
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCClass.js';
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
var js = require('./js');

var Enum = require('./CCEnum');

var utils = require('./utils');

var _isPlainEmptyObj_DEV = utils.isPlainEmptyObj_DEV;
var _cloneable_DEV = utils.cloneable_DEV;

var Attr = require('./attribute');

var DELIMETER = Attr.DELIMETER;

var preprocess = require('./preprocess-class');

require('./requiring-frame');

var BUILTIN_ENTRIES = ['name', 'extends', 'mixins', 'ctor', '__ctor__', 'properties', 'statics', 'editor', '__ES6__'];
var INVALID_STATICS_DEV = CC_DEV && ['name', '__ctors__', '__props__', 'arguments', 'call', 'apply', 'caller', 'length', 'prototype'];

function pushUnique(array, item) {
  if (array.indexOf(item) < 0) {
    array.push(item);
  }
}

var deferredInitializer = {
  // Configs for classes which needs deferred initialization
  datas: null,
  // register new class
  // data - {cls: cls, cb: properties, mixins: options.mixins}
  push: function push(data) {
    if (this.datas) {
      this.datas.push(data);
    } else {
      this.datas = [data]; // start a new timer to initialize

      var self = this;
      setTimeout(function () {
        self.init();
      }, 0);
    }
  },
  init: function init() {
    var datas = this.datas;

    if (datas) {
      for (var i = 0; i < datas.length; ++i) {
        var data = datas[i];
        var cls = data.cls;
        var properties = data.props;

        if (typeof properties === 'function') {
          properties = properties();
        }

        var name = js.getClassName(cls);

        if (properties) {
          declareProperties(cls, name, properties, cls.$super, data.mixins);
        } else {
          cc.errorID(3633, name);
        }
      }

      this.datas = null;
    }
  }
}; // both getter and prop must register the name into __props__ array

function appendProp(cls, name) {
  if (CC_DEV) {
    //if (!IDENTIFIER_RE.test(name)) {
    //    cc.error('The property name "' + name + '" is not compliant with JavaScript naming standards');
    //    return;
    //}
    if (name.indexOf('.') !== -1) {
      cc.errorID(3634);
      return;
    }
  }

  pushUnique(cls.__props__, name);
}

function defineProp(cls, className, propName, val, es6) {
  var defaultValue = val["default"];

  if (CC_DEV) {
    if (!es6) {
      // check default object value
      if (typeof defaultValue === 'object' && defaultValue) {
        if (Array.isArray(defaultValue)) {
          // check array empty
          if (defaultValue.length > 0) {
            cc.errorID(3635, className, propName, propName);
            return;
          }
        } else if (!_isPlainEmptyObj_DEV(defaultValue)) {
          // check cloneable
          if (!_cloneable_DEV(defaultValue)) {
            cc.errorID(3636, className, propName, propName);
            return;
          }
        }
      }
    } // check base prototype to avoid name collision


    if (CCClass.getInheritanceChain(cls).some(function (x) {
      return x.prototype.hasOwnProperty(propName);
    })) {
      cc.errorID(3637, className, propName, className);
      return;
    }
  } // set default value


  Attr.setClassAttr(cls, propName, 'default', defaultValue);
  appendProp(cls, propName); // apply attributes

  parseAttributes(cls, val, className, propName, false);

  if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
    for (var i = 0; i < onAfterProps_ET.length; i++) {
      onAfterProps_ET[i](cls, propName);
    }

    onAfterProps_ET.length = 0;
  }
}

function defineGetSet(cls, name, propName, val, es6) {
  var getter = val.get;
  var setter = val.set;
  var proto = cls.prototype;
  var d = Object.getOwnPropertyDescriptor(proto, propName);
  var setterUndefined = !d;

  if (getter) {
    if (CC_DEV && !es6 && d && d.get) {
      cc.errorID(3638, name, propName);
      return;
    }

    parseAttributes(cls, val, name, propName, true);

    if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
      onAfterProps_ET.length = 0;
    }

    Attr.setClassAttr(cls, propName, 'serializable', false);

    if (CC_DEV) {
      // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
      appendProp(cls, propName);
    }

    if (!es6) {
      js.get(proto, propName, getter, setterUndefined, setterUndefined);
    }

    if (CC_EDITOR || CC_DEV) {
      Attr.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
    }
  }

  if (setter) {
    if (!es6) {
      if (CC_DEV && d && d.set) {
        return cc.errorID(3640, name, propName);
      }

      js.set(proto, propName, setter, setterUndefined, setterUndefined);
    }

    if (CC_EDITOR || CC_DEV) {
      Attr.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
    }
  }
}

function getDefault(defaultVal) {
  if (typeof defaultVal === 'function') {
    if (CC_EDITOR) {
      try {
        return defaultVal();
      } catch (e) {
        cc._throw(e);

        return undefined;
      }
    } else {
      return defaultVal();
    }
  }

  return defaultVal;
}

function mixinWithInherited(dest, src, filter) {
  for (var prop in src) {
    if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
      Object.defineProperty(dest, prop, js.getPropertyDescriptor(src, prop));
    }
  }
}

function doDefine(className, baseClass, mixins, options) {
  var shouldAddProtoCtor;
  var __ctor__ = options.__ctor__;
  var ctor = options.ctor;
  var __es6__ = options.__ES6__;

  if (CC_DEV) {
    // check ctor
    var ctorToUse = __ctor__ || ctor;

    if (ctorToUse) {
      if (CCClass._isCCClass(ctorToUse)) {
        cc.errorID(3618, className);
      } else if (typeof ctorToUse !== 'function') {
        cc.errorID(3619, className);
      } else {
        if (baseClass && /\bprototype.ctor\b/.test(ctorToUse)) {
          if (__es6__) {
            cc.errorID(3651, className || "");
          } else {
            cc.warnID(3600, className || "");
            shouldAddProtoCtor = true;
          }
        }
      }

      if (ctor) {
        if (__ctor__) {
          cc.errorID(3649, className);
        } else {
          ctor = options.ctor = _validateCtor_DEV(ctor, baseClass, className, options);
        }
      }
    }
  }

  var ctors;
  var fireClass;

  if (__es6__) {
    ctors = [ctor];
    fireClass = ctor;
  } else {
    ctors = __ctor__ ? [__ctor__] : _getAllCtors(baseClass, mixins, options);
    fireClass = _createCtor(ctors, baseClass, className, options); // extend - Create a new Class that inherits from this Class

    js.value(fireClass, 'extend', function (options) {
      options["extends"] = this;
      return CCClass(options);
    }, true);
  }

  js.value(fireClass, '__ctors__', ctors.length > 0 ? ctors : null, true);
  var prototype = fireClass.prototype;

  if (baseClass) {
    if (!__es6__) {
      js.extend(fireClass, baseClass); // 这里会把父类的 __props__ 复制给子类

      prototype = fireClass.prototype; // get extended prototype
    }

    fireClass.$super = baseClass;

    if (CC_DEV && shouldAddProtoCtor) {
      prototype.ctor = function () {};
    }
  }

  if (mixins) {
    for (var m = mixins.length - 1; m >= 0; m--) {
      var mixin = mixins[m];
      mixinWithInherited(prototype, mixin.prototype); // mixin statics (this will also copy editor attributes for component)

      mixinWithInherited(fireClass, mixin, function (prop) {
        return mixin.hasOwnProperty(prop) && (!CC_DEV || INVALID_STATICS_DEV.indexOf(prop) < 0);
      }); // mixin attributes

      if (CCClass._isCCClass(mixin)) {
        mixinWithInherited(Attr.getClassAttrs(fireClass), Attr.getClassAttrs(mixin));
      }
    } // restore constuctor overridden by mixin


    prototype.constructor = fireClass;
  }

  if (!__es6__) {
    prototype.__initProps__ = compileProps;
  }

  js.setClassName(className, fireClass);
  return fireClass;
}

function define(className, baseClass, mixins, options) {
  var Component = cc.Component;

  var frame = cc._RF.peek();

  if (frame && js.isChildClassOf(baseClass, Component)) {
    // project component
    if (js.isChildClassOf(frame.cls, Component)) {
      cc.errorID(3615);
      return null;
    }

    if (CC_DEV && frame.uuid && className) {
      cc.warnID(3616, className);
    }

    className = className || frame.script;
  }

  var cls = doDefine(className, baseClass, mixins, options);

  if (frame) {
    if (js.isChildClassOf(baseClass, Component)) {
      var uuid = frame.uuid;

      if (uuid) {
        js._setClassId(uuid, cls);

        if (CC_EDITOR) {
          Component._addMenuItem(cls, 'i18n:MAIN_MENU.component.scripts/' + className, -1);

          cls.prototype.__scriptUuid = Editor.Utils.UuidUtils.decompressUuid(uuid);
        }
      }

      frame.cls = cls;
    } else if (!js.isChildClassOf(frame.cls, Component)) {
      frame.cls = cls;
    }
  }

  return cls;
}

function normalizeClassName_DEV(className) {
  var DefaultName = 'CCClass';

  if (className) {
    className = className.replace(/^[^$A-Za-z_]/, '_').replace(/[^0-9A-Za-z_$]/g, '_');

    try {
      // validate name
      Function('function ' + className + '(){}')();
      return className;
    } catch (e) {
      ;
    }
  }

  return DefaultName;
}

function getNewValueTypeCodeJit(value) {
  var clsName = js.getClassName(value);
  var type = value.constructor;
  var res = 'new ' + clsName + '(';

  for (var i = 0; i < type.__props__.length; i++) {
    var prop = type.__props__[i];
    var propVal = value[prop];

    if (CC_DEV && typeof propVal === 'object') {
      cc.errorID(3641, clsName);
      return 'new ' + clsName + '()';
    }

    res += propVal;

    if (i < type.__props__.length - 1) {
      res += ',';
    }
  }

  return res + ')';
} // TODO - move escapeForJS, IDENTIFIER_RE, getNewValueTypeCodeJit to misc.js or a new source file
// convert a normal string including newlines, quotes and unicode characters into a string literal
// ready to use in JavaScript source


function escapeForJS(s) {
  return JSON.stringify(s). // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function getInitPropsJit(attrs, propList) {
  // functions for generated code
  var F = [];
  var func = '';

  for (var i = 0; i < propList.length; i++) {
    var prop = propList[i];
    var attrKey = prop + DELIMETER + 'default';

    if (attrKey in attrs) {
      // getter does not have default
      var statement;

      if (IDENTIFIER_RE.test(prop)) {
        statement = 'this.' + prop + '=';
      } else {
        statement = 'this[' + escapeForJS(prop) + ']=';
      }

      var expression;
      var def = attrs[attrKey];

      if (typeof def === 'object' && def) {
        if (def instanceof cc.ValueType) {
          expression = getNewValueTypeCodeJit(def);
        } else if (Array.isArray(def)) {
          expression = '[]';
        } else {
          expression = '{}';
        }
      } else if (typeof def === 'function') {
        var index = F.length;
        F.push(def);
        expression = 'F[' + index + ']()';

        if (CC_EDITOR) {
          func += 'try {\n' + statement + expression + ';\n}\ncatch(e) {\ncc._throw(e);\n' + statement + 'undefined;\n}\n';
          continue;
        }
      } else if (typeof def === 'string') {
        expression = escapeForJS(def);
      } else {
        // number, boolean, null, undefined
        expression = def;
      }

      statement = statement + expression + ';\n';
      func += statement;
    }
  } // if (CC_TEST && !isPhantomJS) {
  //     console.log(func);
  // }


  var initProps;

  if (F.length === 0) {
    initProps = Function(func);
  } else {
    initProps = Function('F', 'return (function(){\n' + func + '})')(F);
  }

  return initProps;
}

function getInitProps(attrs, propList) {
  var advancedProps = [];
  var advancedValues = [];
  var simpleProps = [];
  var simpleValues = [];

  for (var i = 0; i < propList.length; ++i) {
    var prop = propList[i];
    var attrKey = prop + DELIMETER + 'default';

    if (attrKey in attrs) {
      // getter does not have default
      var def = attrs[attrKey];

      if (typeof def === 'object' && def || typeof def === 'function') {
        advancedProps.push(prop);
        advancedValues.push(def);
      } else {
        // number, boolean, null, undefined, string
        simpleProps.push(prop);
        simpleValues.push(def);
      }
    }
  }

  return function () {
    for (var _i = 0; _i < simpleProps.length; ++_i) {
      this[simpleProps[_i]] = simpleValues[_i];
    }

    for (var _i2 = 0; _i2 < advancedProps.length; _i2++) {
      var _prop = advancedProps[_i2];
      var expression;
      var def = advancedValues[_i2];

      if (typeof def === 'object') {
        if (def instanceof cc.ValueType) {
          expression = def.clone();
        } else if (Array.isArray(def)) {
          expression = [];
        } else {
          expression = {};
        }
      } else {
        // def is function
        if (CC_EDITOR) {
          try {
            expression = def();
          } catch (err) {
            cc._throw(e);

            continue;
          }
        } else {
          expression = def();
        }
      }

      this[_prop] = expression;
    }
  };
} // simple test variable name


var IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

function compileProps(actualClass) {
  // init deferred properties
  var attrs = Attr.getClassAttrs(actualClass);
  var propList = actualClass.__props__;

  if (propList === null) {
    deferredInitializer.init();
    propList = actualClass.__props__;
  } // Overwite __initProps__ to avoid compile again.


  var initProps = CC_SUPPORT_JIT ? getInitPropsJit(attrs, propList) : getInitProps(attrs, propList);
  actualClass.prototype.__initProps__ = initProps; // call instantiateProps immediately, no need to pass actualClass into it anymore
  // (use call to manually bind `this` because `this` may not instanceof actualClass)

  initProps.call(this);
}

var _createCtor = CC_SUPPORT_JIT ? function (ctors, baseClass, className, options) {
  var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
  var ctorName = CC_DEV ? normalizeClassName_DEV(className) : 'CCClass';
  var body = 'return function ' + ctorName + '(){\n';

  if (superCallBounded) {
    body += 'this._super=null;\n';
  } // instantiate props


  body += 'this.__initProps__(' + ctorName + ');\n'; // call user constructors

  var ctorLen = ctors.length;

  if (ctorLen > 0) {
    var useTryCatch = CC_DEV && !(className && className.startsWith('cc.'));

    if (useTryCatch) {
      body += 'try{\n';
    }

    var SNIPPET = '].apply(this,arguments);\n';

    if (ctorLen === 1) {
      body += ctorName + '.__ctors__[0' + SNIPPET;
    } else {
      body += 'var cs=' + ctorName + '.__ctors__;\n';

      for (var i = 0; i < ctorLen; i++) {
        body += 'cs[' + i + SNIPPET;
      }
    }

    if (useTryCatch) {
      body += '}catch(e){\n' + 'cc._throw(e);\n' + '}\n';
    }
  }

  body += '}';
  return Function(body)();
} : function (ctors, baseClass, className, options) {
  var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
  var ctorLen = ctors.length;

  var _Class5;

  if (ctorLen > 0) {
    if (superCallBounded) {
      if (ctorLen === 2) {
        // User Component
        _Class5 = function Class() {
          this._super = null;

          this.__initProps__(_Class5);

          ctors[0].apply(this, arguments);
          ctors[1].apply(this, arguments);
        };
      } else {
        _Class5 = function _Class() {
          this._super = null;

          this.__initProps__(_Class5);

          for (var i = 0; i < ctors.length; ++i) {
            ctors[i].apply(this, arguments);
          }
        };
      }
    } else {
      if (ctorLen === 3) {
        // Node
        _Class5 = function _Class2() {
          this.__initProps__(_Class5);

          ctors[0].apply(this, arguments);
          ctors[1].apply(this, arguments);
          ctors[2].apply(this, arguments);
        };
      } else {
        _Class5 = function _Class3() {
          this.__initProps__(_Class5);

          var ctors = _Class5.__ctors__;

          for (var i = 0; i < ctors.length; ++i) {
            ctors[i].apply(this, arguments);
          }
        };
      }
    }
  } else {
    _Class5 = function _Class4() {
      if (superCallBounded) {
        this._super = null;
      }

      this.__initProps__(_Class5);
    };
  }

  return _Class5;
};

function _validateCtor_DEV(ctor, baseClass, className, options) {
  if (CC_EDITOR && baseClass) {
    // check super call in constructor
    var originCtor = ctor;

    if (SuperCallReg.test(ctor)) {
      if (options.__ES6__) {
        cc.errorID(3651, className);
      } else {
        cc.warnID(3600, className); // suppresss super call

        ctor = function ctor() {
          this._super = function () {};

          var ret = originCtor.apply(this, arguments);
          this._super = null;
          return ret;
        };
      }
    }
  } // check ctor


  if (ctor.length > 0 && (!className || !className.startsWith('cc.'))) {
    // To make a unified CCClass serialization process,
    // we don't allow parameters for constructor when creating instances of CCClass.
    // For advanced user, construct arguments can still get from 'arguments'.
    cc.warnID(3617, className);
  }

  return ctor;
}

function _getAllCtors(baseClass, mixins, options) {
  // get base user constructors
  function getCtors(cls) {
    if (CCClass._isCCClass(cls)) {
      return cls.__ctors__ || [];
    } else {
      return [cls];
    }
  }

  var ctors = []; // if (options.__ES6__) {
  //     if (mixins) {
  //         let baseOrMixins = getCtors(baseClass);
  //         for (let b = 0; b < mixins.length; b++) {
  //             let mixin = mixins[b];
  //             if (mixin) {
  //                 let baseCtors = getCtors(mixin);
  //                 for (let c = 0; c < baseCtors.length; c++) {
  //                     if (baseOrMixins.indexOf(baseCtors[c]) < 0) {
  //                         pushUnique(ctors, baseCtors[c]);
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // }
  // else {

  var baseOrMixins = [baseClass].concat(mixins);

  for (var b = 0; b < baseOrMixins.length; b++) {
    var baseOrMixin = baseOrMixins[b];

    if (baseOrMixin) {
      var baseCtors = getCtors(baseOrMixin);

      for (var c = 0; c < baseCtors.length; c++) {
        pushUnique(ctors, baseCtors[c]);
      }
    }
  } // }
  // append subclass user constructors


  var ctor = options.ctor;

  if (ctor) {
    ctors.push(ctor);
  }

  return ctors;
}

var SuperCallReg = /xyz/.test(function () {
  xyz;
}) ? /\b\._super\b/ : /.*/;
var SuperCallRegStrict = /xyz/.test(function () {
  xyz;
}) ? /this\._super\s*\(/ : /(NONE){99}/;

function boundSuperCalls(baseClass, options, className) {
  var hasSuperCall = false;

  for (var funcName in options) {
    if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
      continue;
    }

    var func = options[funcName];

    if (typeof func !== 'function') {
      continue;
    }

    var pd = js.getPropertyDescriptor(baseClass.prototype, funcName);

    if (pd) {
      var superFunc = pd.value; // ignore pd.get, assume that function defined by getter is just for warnings

      if (typeof superFunc === 'function') {
        if (SuperCallReg.test(func)) {
          hasSuperCall = true; // boundSuperCall

          options[funcName] = function (superFunc, func) {
            return function () {
              var tmp = this._super; // Add a new ._super() method that is the same method but on the super-Class

              this._super = superFunc;
              var ret = func.apply(this, arguments); // The method only need to be bound temporarily, so we remove it when we're done executing

              this._super = tmp;
              return ret;
            };
          }(superFunc, func);
        }

        continue;
      }
    }

    if (CC_DEV && SuperCallRegStrict.test(func)) {
      cc.warnID(3620, className, funcName);
    }
  }

  return hasSuperCall;
}

function declareProperties(cls, className, properties, baseClass, mixins, es6) {
  cls.__props__ = [];

  if (baseClass && baseClass.__props__) {
    cls.__props__ = baseClass.__props__.slice();
  }

  if (mixins) {
    for (var m = 0; m < mixins.length; ++m) {
      var mixin = mixins[m];

      if (mixin.__props__) {
        cls.__props__ = cls.__props__.concat(mixin.__props__.filter(function (x) {
          return cls.__props__.indexOf(x) < 0;
        }));
      }
    }
  }

  if (properties) {
    // 预处理属性
    preprocess.preprocessAttrs(properties, className, cls, es6);

    for (var propName in properties) {
      var val = properties[propName];

      if ('default' in val) {
        defineProp(cls, className, propName, val, es6);
      } else {
        defineGetSet(cls, className, propName, val, es6);
      }
    }
  }

  var attrs = Attr.getClassAttrs(cls);
  cls.__values__ = cls.__props__.filter(function (prop) {
    return attrs[prop + DELIMETER + 'serializable'] !== false;
  });
}
/**
 * @module cc
 */

/**
 * !#en Defines a CCClass using the given specification, please see [Class](/docs/editors_and_tools/creator-chapters/scripting/class.html) for details.
 * !#zh 定义一个 CCClass，传入参数必须是一个包含类型参数的字面量对象，具体用法请查阅[类型定义](/docs/creator/scripting/class.html)。
 *
 * @method Class
 *
 * @param {Object} [options]
 * @param {String} [options.name] - The class name used for serialization.
 * @param {Function} [options.extends] - The base class.
 * @param {Function} [options.ctor] - The constructor.
 * @param {Function} [options.__ctor__] - The same as ctor, but less encapsulated.
 * @param {Object} [options.properties] - The property definitions.
 * @param {Object} [options.statics] - The static members.
 * @param {Function[]} [options.mixins]
 *
 * @param {Object} [options.editor] - attributes for Component listed below.
 * @param {Boolean} [options.editor.executeInEditMode=false] - Allows the current component to run in edit mode. By default, all components are executed only at runtime, meaning that they will not have their callback functions executed while the Editor is in edit mode.
 * @param {Function} [options.editor.requireComponent] - Automatically add required component as a dependency.
 * @param {String} [options.editor.menu] - The menu path to register a component to the editors "Component" menu. Eg. "Rendering/Camera".
 * @param {Number} [options.editor.executionOrder=0] - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after. The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * @param {Boolean} [options.editor.disallowMultiple] - If specified to a type, prevents Component of the same type (or subtype) to be added more than once to a Node.
 * @param {Boolean} [options.editor.playOnFocus=false] - This property is only available when executeInEditMode is set. If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.
 * @param {String} [options.editor.inspector] - Customize the page url used by the current component to render in the Properties.
 * @param {String} [options.editor.icon] - Customize the icon that the current component displays in the editor.
 * @param {String} [options.editor.help] - The custom documentation URL
 *
 * @param {Function} [options.update] - lifecycle method for Component, see {{#crossLink "Component/update:method"}}{{/crossLink}}
 * @param {Function} [options.lateUpdate] - lifecycle method for Component, see {{#crossLink "Component/lateUpdate:method"}}{{/crossLink}}
 * @param {Function} [options.onLoad] - lifecycle method for Component, see {{#crossLink "Component/onLoad:method"}}{{/crossLink}}
 * @param {Function} [options.start] - lifecycle method for Component, see {{#crossLink "Component/start:method"}}{{/crossLink}}
 * @param {Function} [options.onEnable] - lifecycle method for Component, see {{#crossLink "Component/onEnable:method"}}{{/crossLink}}
 * @param {Function} [options.onDisable] - lifecycle method for Component, see {{#crossLink "Component/onDisable:method"}}{{/crossLink}}
 * @param {Function} [options.onDestroy] - lifecycle method for Component, see {{#crossLink "Component/onDestroy:method"}}{{/crossLink}}
 * @param {Function} [options.onFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onLostFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onLostFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.resetInEditor] - lifecycle method for Component, see {{#crossLink "Component/resetInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onRestore] - for Component only, see {{#crossLink "Component/onRestore:method"}}{{/crossLink}}
 * @param {Function} [options._getLocalBounds] - for Component only, see {{#crossLink "Component/_getLocalBounds:method"}}{{/crossLink}}
 *
 * @return {Function} - the created class
 *
 * @example

 // define base class
 var Node = cc.Class();

 // define sub class
 var Sprite = cc.Class({
     name: 'Sprite',
     extends: Node,

     ctor: function () {
         this.url = "";
         this.id = 0;
     },

     statics: {
         // define static members
         count: 0,
         getBounds: function (spriteList) {
             // compute bounds...
         }
     },

     properties {
         width: {
             default: 128,
             type: cc.Integer,
             tooltip: 'The width of sprite'
         },
         height: 128,
         size: {
             get: function () {
                 return cc.v2(this.width, this.height);
             }
         }
     },

     load: function () {
         // load this.url...
     };
 });

 // instantiate

 var obj = new Sprite();
 obj.url = 'sprite.png';
 obj.load();
 */


function CCClass(options) {
  options = options || {};
  var name = options.name;
  var base = options["extends"]
  /* || CCObject*/
  ;
  var mixins = options.mixins; // create constructor

  var cls = define(name, base, mixins, options);

  if (!name) {
    name = cc.js.getClassName(cls);
  }

  cls._sealed = true;

  if (base) {
    base._sealed = false;
  } // define Properties


  var properties = options.properties;

  if (typeof properties === 'function' || base && base.__props__ === null || mixins && mixins.some(function (x) {
    return x.__props__ === null;
  })) {
    if (CC_DEV && options.__ES6__) {
      cc.error('not yet implement deferred properties for ES6 Classes');
    } else {
      deferredInitializer.push({
        cls: cls,
        props: properties,
        mixins: mixins
      });
      cls.__props__ = cls.__values__ = null;
    }
  } else {
    declareProperties(cls, name, properties, base, options.mixins, options.__ES6__);
  } // define statics


  var statics = options.statics;

  if (statics) {
    var staticPropName;

    if (CC_DEV) {
      for (staticPropName in statics) {
        if (INVALID_STATICS_DEV.indexOf(staticPropName) !== -1) {
          cc.errorID(3642, name, staticPropName, staticPropName);
        }
      }
    }

    for (staticPropName in statics) {
      cls[staticPropName] = statics[staticPropName];
    }
  } // define functions


  for (var funcName in options) {
    if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
      continue;
    }

    var func = options[funcName];

    if (!preprocess.validateMethodWithProps(func, funcName, name, cls, base)) {
      continue;
    } // use value to redefine some super method defined as getter


    js.value(cls.prototype, funcName, func, true, true);
  }

  var editor = options.editor;

  if (editor) {
    if (js.isChildClassOf(base, cc.Component)) {
      cc.Component._registerEditorProps(cls, editor);
    } else if (CC_DEV) {
      cc.warnID(3623, name);
    }
  }

  return cls;
}
/**
 * Checks whether the constructor is created by cc.Class
 *
 * @method _isCCClass
 * @param {Function} constructor
 * @return {Boolean}
 * @private
 */


CCClass._isCCClass = function (constructor) {
  return constructor && constructor.hasOwnProperty('__ctors__'); // is not inherited __ctors__
}; //
// Optimized define function only for internal classes
//
// @method _fastDefine
// @param {String} className
// @param {Function} constructor
// @param {Object} serializableFields
// @private
//


CCClass._fastDefine = function (className, constructor, serializableFields) {
  js.setClassName(className, constructor); //constructor.__ctors__ = constructor.__ctors__ || null;

  var props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
  var attrs = Attr.getClassAttrs(constructor);

  for (var i = 0; i < props.length; i++) {
    var key = props[i];
    attrs[key + DELIMETER + 'visible'] = false;
    attrs[key + DELIMETER + 'default'] = serializableFields[key];
  }
};

CCClass.Attr = Attr;
CCClass.attr = Attr.attr;
/*
 * Return all super classes
 * @method getInheritanceChain
 * @param {Function} constructor
 * @return {Function[]}
 */

CCClass.getInheritanceChain = function (klass) {
  var chain = [];

  for (;;) {
    klass = js.getSuper(klass);

    if (!klass) {
      break;
    }

    if (klass !== Object) {
      chain.push(klass);
    }
  }

  return chain;
};

var PrimitiveTypes = {
  // Specify that the input value must be integer in Properties.
  // Also used to indicates that the type of elements in array or the type of value in dictionary is integer.
  Integer: 'Number',
  // Indicates that the type of elements in array or the type of value in dictionary is double.
  Float: 'Number',
  Boolean: 'Boolean',
  String: 'String'
};
var onAfterProps_ET = [];

function parseAttributes(cls, attributes, className, propName, usedInGetter) {
  var ERR_Type = CC_DEV ? 'The %s of %s must be type %s' : '';
  var attrs = null;
  var propNamePrefix = '';

  function initAttrs() {
    propNamePrefix = propName + DELIMETER;
    return attrs = Attr.getClassAttrs(cls);
  }

  if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
    onAfterProps_ET.length = 0;
  }

  var type = attributes.type;

  if (type) {
    var primitiveType = PrimitiveTypes[type];

    if (primitiveType) {
      (attrs || initAttrs())[propNamePrefix + 'type'] = type;

      if ((CC_EDITOR && !Editor.isBuilder || CC_TEST) && !attributes._short) {
        onAfterProps_ET.push(Attr.getTypeChecker_ET(primitiveType, 'cc.' + type));
      }
    } else if (type === 'Object') {
      if (CC_DEV) {
        cc.errorID(3644, className, propName);
      }
    } else {
      if (type === Attr.ScriptUuid) {
        (attrs || initAttrs())[propNamePrefix + 'type'] = 'Script';
        attrs[propNamePrefix + 'ctor'] = cc.ScriptAsset;
      } else {
        if (typeof type === 'object') {
          if (Enum.isEnum(type)) {
            (attrs || initAttrs())[propNamePrefix + 'type'] = 'Enum';
            attrs[propNamePrefix + 'enumList'] = Enum.getList(type);
          } else if (CC_DEV) {
            cc.errorID(3645, className, propName, type);
          }
        } else if (typeof type === 'function') {
          (attrs || initAttrs())[propNamePrefix + 'type'] = 'Object';
          attrs[propNamePrefix + 'ctor'] = type;

          if ((CC_EDITOR && !Editor.isBuilder || CC_TEST) && !attributes._short) {
            onAfterProps_ET.push(attributes.url ? Attr.getTypeChecker_ET('String', 'cc.String') : Attr.getObjTypeChecker_ET(type));
          }
        } else if (CC_DEV) {
          cc.errorID(3646, className, propName, type);
        }
      }
    }
  }

  function parseSimpleAttr(attrName, expectType) {
    if (attrName in attributes) {
      var val = attributes[attrName];

      if (typeof val === expectType) {
        (attrs || initAttrs())[propNamePrefix + attrName] = val;
      } else if (CC_DEV) {
        cc.error(ERR_Type, attrName, className, propName, expectType);
      }
    }
  }

  if (attributes.editorOnly) {
    if (CC_DEV && usedInGetter) {
      cc.errorID(3613, "editorOnly", name, propName);
    } else {
      (attrs || initAttrs())[propNamePrefix + 'editorOnly'] = true;
    }
  } //parseSimpleAttr('preventDeferredLoad', 'boolean');


  if (CC_DEV) {
    parseSimpleAttr('displayName', 'string');
    parseSimpleAttr('multiline', 'boolean');

    if (attributes.readonly) {
      (attrs || initAttrs())[propNamePrefix + 'readonly'] = true;
    }

    parseSimpleAttr('tooltip', 'string');
    parseSimpleAttr('slide', 'boolean');
  }

  if (attributes.url) {
    (attrs || initAttrs())[propNamePrefix + 'saveUrlAsAsset'] = true;
  }

  if (attributes.serializable === false) {
    if (CC_DEV && usedInGetter) {
      cc.errorID(3613, "serializable", name, propName);
    } else {
      (attrs || initAttrs())[propNamePrefix + 'serializable'] = false;
    }
  }

  parseSimpleAttr('formerlySerializedAs', 'string');

  if (CC_EDITOR) {
    parseSimpleAttr('notifyFor', 'string');

    if ('animatable' in attributes) {
      (attrs || initAttrs())[propNamePrefix + 'animatable'] = !!attributes.animatable;
    }
  }

  if (CC_DEV) {
    var visible = attributes.visible;

    if (typeof visible !== 'undefined') {
      if (!visible) {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
      } else if (typeof visible === 'function') {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = visible;
      }
    } else {
      var startsWithUS = propName.charCodeAt(0) === 95;

      if (startsWithUS) {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
      }
    }
  }

  var range = attributes.range;

  if (range) {
    if (Array.isArray(range)) {
      if (range.length >= 2) {
        (attrs || initAttrs())[propNamePrefix + 'min'] = range[0];
        attrs[propNamePrefix + 'max'] = range[1];

        if (range.length > 2) {
          attrs[propNamePrefix + 'step'] = range[2];
        }
      } else if (CC_DEV) {
        cc.errorID(3647);
      }
    } else if (CC_DEV) {
      cc.error(ERR_Type, 'range', className, propName, 'array');
    }
  }

  parseSimpleAttr('min', 'number');
  parseSimpleAttr('max', 'number');
  parseSimpleAttr('step', 'number');
}

cc.Class = CCClass;
module.exports = {
  isArray: function isArray(defaultVal) {
    defaultVal = getDefault(defaultVal);
    return Array.isArray(defaultVal);
  },
  fastDefine: CCClass._fastDefine,
  getNewValueTypeCode: CC_SUPPORT_JIT && getNewValueTypeCodeJit,
  IDENTIFIER_RE: IDENTIFIER_RE,
  escapeForJS: escapeForJS,
  getDefault: getDefault
};

if (CC_TEST) {
  js.mixin(CCClass, module.exports);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ2xhc3MuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiRW51bSIsInV0aWxzIiwiX2lzUGxhaW5FbXB0eU9ial9ERVYiLCJpc1BsYWluRW1wdHlPYmpfREVWIiwiX2Nsb25lYWJsZV9ERVYiLCJjbG9uZWFibGVfREVWIiwiQXR0ciIsIkRFTElNRVRFUiIsInByZXByb2Nlc3MiLCJCVUlMVElOX0VOVFJJRVMiLCJJTlZBTElEX1NUQVRJQ1NfREVWIiwiQ0NfREVWIiwicHVzaFVuaXF1ZSIsImFycmF5IiwiaXRlbSIsImluZGV4T2YiLCJwdXNoIiwiZGVmZXJyZWRJbml0aWFsaXplciIsImRhdGFzIiwiZGF0YSIsInNlbGYiLCJzZXRUaW1lb3V0IiwiaW5pdCIsImkiLCJsZW5ndGgiLCJjbHMiLCJwcm9wZXJ0aWVzIiwicHJvcHMiLCJuYW1lIiwiZ2V0Q2xhc3NOYW1lIiwiZGVjbGFyZVByb3BlcnRpZXMiLCIkc3VwZXIiLCJtaXhpbnMiLCJjYyIsImVycm9ySUQiLCJhcHBlbmRQcm9wIiwiX19wcm9wc19fIiwiZGVmaW5lUHJvcCIsImNsYXNzTmFtZSIsInByb3BOYW1lIiwidmFsIiwiZXM2IiwiZGVmYXVsdFZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiQ0NDbGFzcyIsImdldEluaGVyaXRhbmNlQ2hhaW4iLCJzb21lIiwieCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5Iiwic2V0Q2xhc3NBdHRyIiwicGFyc2VBdHRyaWJ1dGVzIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNCdWlsZGVyIiwiQ0NfVEVTVCIsIm9uQWZ0ZXJQcm9wc19FVCIsImRlZmluZUdldFNldCIsImdldHRlciIsImdldCIsInNldHRlciIsInNldCIsInByb3RvIiwiZCIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInNldHRlclVuZGVmaW5lZCIsImdldERlZmF1bHQiLCJkZWZhdWx0VmFsIiwiZSIsIl90aHJvdyIsInVuZGVmaW5lZCIsIm1peGluV2l0aEluaGVyaXRlZCIsImRlc3QiLCJzcmMiLCJmaWx0ZXIiLCJwcm9wIiwiZGVmaW5lUHJvcGVydHkiLCJnZXRQcm9wZXJ0eURlc2NyaXB0b3IiLCJkb0RlZmluZSIsImJhc2VDbGFzcyIsIm9wdGlvbnMiLCJzaG91bGRBZGRQcm90b0N0b3IiLCJfX2N0b3JfXyIsImN0b3IiLCJfX2VzNl9fIiwiX19FUzZfXyIsImN0b3JUb1VzZSIsIl9pc0NDQ2xhc3MiLCJ0ZXN0Iiwid2FybklEIiwiX3ZhbGlkYXRlQ3Rvcl9ERVYiLCJjdG9ycyIsImZpcmVDbGFzcyIsIl9nZXRBbGxDdG9ycyIsIl9jcmVhdGVDdG9yIiwidmFsdWUiLCJleHRlbmQiLCJtIiwibWl4aW4iLCJnZXRDbGFzc0F0dHJzIiwiY29uc3RydWN0b3IiLCJfX2luaXRQcm9wc19fIiwiY29tcGlsZVByb3BzIiwic2V0Q2xhc3NOYW1lIiwiZGVmaW5lIiwiQ29tcG9uZW50IiwiZnJhbWUiLCJfUkYiLCJwZWVrIiwiaXNDaGlsZENsYXNzT2YiLCJ1dWlkIiwic2NyaXB0IiwiX3NldENsYXNzSWQiLCJfYWRkTWVudUl0ZW0iLCJfX3NjcmlwdFV1aWQiLCJVdGlscyIsIlV1aWRVdGlscyIsImRlY29tcHJlc3NVdWlkIiwibm9ybWFsaXplQ2xhc3NOYW1lX0RFViIsIkRlZmF1bHROYW1lIiwicmVwbGFjZSIsIkZ1bmN0aW9uIiwiZ2V0TmV3VmFsdWVUeXBlQ29kZUppdCIsImNsc05hbWUiLCJ0eXBlIiwicmVzIiwicHJvcFZhbCIsImVzY2FwZUZvckpTIiwicyIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRJbml0UHJvcHNKaXQiLCJhdHRycyIsInByb3BMaXN0IiwiRiIsImZ1bmMiLCJhdHRyS2V5Iiwic3RhdGVtZW50IiwiSURFTlRJRklFUl9SRSIsImV4cHJlc3Npb24iLCJkZWYiLCJWYWx1ZVR5cGUiLCJpbmRleCIsImluaXRQcm9wcyIsImdldEluaXRQcm9wcyIsImFkdmFuY2VkUHJvcHMiLCJhZHZhbmNlZFZhbHVlcyIsInNpbXBsZVByb3BzIiwic2ltcGxlVmFsdWVzIiwiY2xvbmUiLCJlcnIiLCJhY3R1YWxDbGFzcyIsIkNDX1NVUFBPUlRfSklUIiwiY2FsbCIsInN1cGVyQ2FsbEJvdW5kZWQiLCJib3VuZFN1cGVyQ2FsbHMiLCJjdG9yTmFtZSIsImJvZHkiLCJjdG9yTGVuIiwidXNlVHJ5Q2F0Y2giLCJzdGFydHNXaXRoIiwiU05JUFBFVCIsIkNsYXNzIiwiX3N1cGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJfX2N0b3JzX18iLCJvcmlnaW5DdG9yIiwiU3VwZXJDYWxsUmVnIiwicmV0IiwiZ2V0Q3RvcnMiLCJiYXNlT3JNaXhpbnMiLCJjb25jYXQiLCJiIiwiYmFzZU9yTWl4aW4iLCJiYXNlQ3RvcnMiLCJjIiwieHl6IiwiU3VwZXJDYWxsUmVnU3RyaWN0IiwiaGFzU3VwZXJDYWxsIiwiZnVuY05hbWUiLCJwZCIsInN1cGVyRnVuYyIsInRtcCIsInNsaWNlIiwicHJlcHJvY2Vzc0F0dHJzIiwiX192YWx1ZXNfXyIsImJhc2UiLCJfc2VhbGVkIiwiZXJyb3IiLCJzdGF0aWNzIiwic3RhdGljUHJvcE5hbWUiLCJ2YWxpZGF0ZU1ldGhvZFdpdGhQcm9wcyIsImVkaXRvciIsIl9yZWdpc3RlckVkaXRvclByb3BzIiwiX2Zhc3REZWZpbmUiLCJzZXJpYWxpemFibGVGaWVsZHMiLCJrZXlzIiwia2V5IiwiYXR0ciIsImtsYXNzIiwiY2hhaW4iLCJnZXRTdXBlciIsIlByaW1pdGl2ZVR5cGVzIiwiSW50ZWdlciIsIkZsb2F0IiwiQm9vbGVhbiIsIlN0cmluZyIsImF0dHJpYnV0ZXMiLCJ1c2VkSW5HZXR0ZXIiLCJFUlJfVHlwZSIsInByb3BOYW1lUHJlZml4IiwiaW5pdEF0dHJzIiwicHJpbWl0aXZlVHlwZSIsIl9zaG9ydCIsImdldFR5cGVDaGVja2VyX0VUIiwiU2NyaXB0VXVpZCIsIlNjcmlwdEFzc2V0IiwiaXNFbnVtIiwiZ2V0TGlzdCIsInVybCIsImdldE9ialR5cGVDaGVja2VyX0VUIiwicGFyc2VTaW1wbGVBdHRyIiwiYXR0ck5hbWUiLCJleHBlY3RUeXBlIiwiZWRpdG9yT25seSIsInJlYWRvbmx5Iiwic2VyaWFsaXphYmxlIiwiYW5pbWF0YWJsZSIsInZpc2libGUiLCJzdGFydHNXaXRoVVMiLCJjaGFyQ29kZUF0IiwicmFuZ2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZmFzdERlZmluZSIsImdldE5ld1ZhbHVlVHlwZUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQWhCOztBQUNBLElBQUlDLElBQUksR0FBR0QsT0FBTyxDQUFDLFVBQUQsQ0FBbEI7O0FBQ0EsSUFBSUUsS0FBSyxHQUFHRixPQUFPLENBQUMsU0FBRCxDQUFuQjs7QUFDQSxJQUFJRyxvQkFBb0IsR0FBR0QsS0FBSyxDQUFDRSxtQkFBakM7QUFDQSxJQUFJQyxjQUFjLEdBQUdILEtBQUssQ0FBQ0ksYUFBM0I7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHUCxPQUFPLENBQUMsYUFBRCxDQUFsQjs7QUFDQSxJQUFJUSxTQUFTLEdBQUdELElBQUksQ0FBQ0MsU0FBckI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHVCxPQUFPLENBQUMsb0JBQUQsQ0FBeEI7O0FBQ0FBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUVBLElBQUlVLGVBQWUsR0FBRyxDQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLFFBQXBCLEVBQThCLE1BQTlCLEVBQXNDLFVBQXRDLEVBQWtELFlBQWxELEVBQWdFLFNBQWhFLEVBQTJFLFFBQTNFLEVBQXFGLFNBQXJGLENBQXRCO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUdDLE1BQU0sSUFBSSxDQUFDLE1BQUQsRUFBUyxXQUFULEVBQXNCLFdBQXRCLEVBQW1DLFdBQW5DLEVBQWdELE1BQWhELEVBQXdELE9BQXhELEVBQWlFLFFBQWpFLEVBQ2IsUUFEYSxFQUNILFdBREcsQ0FBcEM7O0FBR0EsU0FBU0MsVUFBVCxDQUFxQkMsS0FBckIsRUFBNEJDLElBQTVCLEVBQWtDO0FBQzlCLE1BQUlELEtBQUssQ0FBQ0UsT0FBTixDQUFjRCxJQUFkLElBQXNCLENBQTFCLEVBQTZCO0FBQ3pCRCxJQUFBQSxLQUFLLENBQUNHLElBQU4sQ0FBV0YsSUFBWDtBQUNIO0FBQ0o7O0FBRUQsSUFBSUcsbUJBQW1CLEdBQUc7QUFFdEI7QUFDQUMsRUFBQUEsS0FBSyxFQUFFLElBSGU7QUFLdEI7QUFDQTtBQUNBRixFQUFBQSxJQUFJLEVBQUUsY0FBVUcsSUFBVixFQUFnQjtBQUNsQixRQUFJLEtBQUtELEtBQVQsRUFBZ0I7QUFDWixXQUFLQSxLQUFMLENBQVdGLElBQVgsQ0FBZ0JHLElBQWhCO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsV0FBS0QsS0FBTCxHQUFhLENBQUNDLElBQUQsQ0FBYixDQURDLENBRUQ7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQUMsTUFBQUEsVUFBVSxDQUFDLFlBQVk7QUFDbkJELFFBQUFBLElBQUksQ0FBQ0UsSUFBTDtBQUNILE9BRlMsRUFFUCxDQUZPLENBQVY7QUFHSDtBQUNKLEdBbkJxQjtBQXFCdEJBLEVBQUFBLElBQUksRUFBRSxnQkFBWTtBQUNkLFFBQUlKLEtBQUssR0FBRyxLQUFLQSxLQUFqQjs7QUFDQSxRQUFJQSxLQUFKLEVBQVc7QUFDUCxXQUFLLElBQUlLLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLEtBQUssQ0FBQ00sTUFBMUIsRUFBa0MsRUFBRUQsQ0FBcEMsRUFBdUM7QUFDbkMsWUFBSUosSUFBSSxHQUFHRCxLQUFLLENBQUNLLENBQUQsQ0FBaEI7QUFDQSxZQUFJRSxHQUFHLEdBQUdOLElBQUksQ0FBQ00sR0FBZjtBQUNBLFlBQUlDLFVBQVUsR0FBR1AsSUFBSSxDQUFDUSxLQUF0Qjs7QUFDQSxZQUFJLE9BQU9ELFVBQVAsS0FBc0IsVUFBMUIsRUFBc0M7QUFDbENBLFVBQUFBLFVBQVUsR0FBR0EsVUFBVSxFQUF2QjtBQUNIOztBQUNELFlBQUlFLElBQUksR0FBRzlCLEVBQUUsQ0FBQytCLFlBQUgsQ0FBZ0JKLEdBQWhCLENBQVg7O0FBQ0EsWUFBSUMsVUFBSixFQUFnQjtBQUNaSSxVQUFBQSxpQkFBaUIsQ0FBQ0wsR0FBRCxFQUFNRyxJQUFOLEVBQVlGLFVBQVosRUFBd0JELEdBQUcsQ0FBQ00sTUFBNUIsRUFBb0NaLElBQUksQ0FBQ2EsTUFBekMsQ0FBakI7QUFDSCxTQUZELE1BR0s7QUFDREMsVUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQk4sSUFBakI7QUFDSDtBQUNKOztBQUNELFdBQUtWLEtBQUwsR0FBYSxJQUFiO0FBQ0g7QUFDSjtBQXpDcUIsQ0FBMUIsRUE0Q0E7O0FBQ0EsU0FBU2lCLFVBQVQsQ0FBcUJWLEdBQXJCLEVBQTBCRyxJQUExQixFQUFnQztBQUM1QixNQUFJakIsTUFBSixFQUFZO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJaUIsSUFBSSxDQUFDYixPQUFMLENBQWEsR0FBYixNQUFzQixDQUFDLENBQTNCLEVBQThCO0FBQzFCa0IsTUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWDtBQUNBO0FBQ0g7QUFDSjs7QUFDRHRCLEVBQUFBLFVBQVUsQ0FBQ2EsR0FBRyxDQUFDVyxTQUFMLEVBQWdCUixJQUFoQixDQUFWO0FBQ0g7O0FBRUQsU0FBU1MsVUFBVCxDQUFxQlosR0FBckIsRUFBMEJhLFNBQTFCLEVBQXFDQyxRQUFyQyxFQUErQ0MsR0FBL0MsRUFBb0RDLEdBQXBELEVBQXlEO0FBQ3JELE1BQUlDLFlBQVksR0FBR0YsR0FBRyxXQUF0Qjs7QUFFQSxNQUFJN0IsTUFBSixFQUFZO0FBQ1IsUUFBSSxDQUFDOEIsR0FBTCxFQUFVO0FBQ047QUFDQSxVQUFJLE9BQU9DLFlBQVAsS0FBd0IsUUFBeEIsSUFBb0NBLFlBQXhDLEVBQXNEO0FBQ2xELFlBQUlDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixZQUFkLENBQUosRUFBaUM7QUFDN0I7QUFDQSxjQUFJQSxZQUFZLENBQUNsQixNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQ3pCUyxZQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQixFQUE0QkMsUUFBNUIsRUFBc0NBLFFBQXRDO0FBQ0E7QUFDSDtBQUNKLFNBTkQsTUFPSyxJQUFJLENBQUNyQyxvQkFBb0IsQ0FBQ3dDLFlBQUQsQ0FBekIsRUFBeUM7QUFDMUM7QUFDQSxjQUFJLENBQUN0QyxjQUFjLENBQUNzQyxZQUFELENBQW5CLEVBQW1DO0FBQy9CVCxZQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQixFQUE0QkMsUUFBNUIsRUFBc0NBLFFBQXRDO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSixLQW5CTyxDQXFCUjs7O0FBQ0EsUUFBSU0sT0FBTyxDQUFDQyxtQkFBUixDQUE0QnJCLEdBQTVCLEVBQ1FzQixJQURSLENBQ2EsVUFBVUMsQ0FBVixFQUFhO0FBQUUsYUFBT0EsQ0FBQyxDQUFDQyxTQUFGLENBQVlDLGNBQVosQ0FBMkJYLFFBQTNCLENBQVA7QUFBOEMsS0FEMUUsQ0FBSixFQUVBO0FBQ0lOLE1BQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCLEVBQTRCQyxRQUE1QixFQUFzQ0QsU0FBdEM7QUFDQTtBQUNIO0FBQ0osR0EvQm9ELENBaUNyRDs7O0FBQ0FoQyxFQUFBQSxJQUFJLENBQUM2QyxZQUFMLENBQWtCMUIsR0FBbEIsRUFBdUJjLFFBQXZCLEVBQWlDLFNBQWpDLEVBQTRDRyxZQUE1QztBQUVBUCxFQUFBQSxVQUFVLENBQUNWLEdBQUQsRUFBTWMsUUFBTixDQUFWLENBcENxRCxDQXNDckQ7O0FBQ0FhLEVBQUFBLGVBQWUsQ0FBQzNCLEdBQUQsRUFBTWUsR0FBTixFQUFXRixTQUFYLEVBQXNCQyxRQUF0QixFQUFnQyxLQUFoQyxDQUFmOztBQUNBLE1BQUtjLFNBQVMsSUFBSSxDQUFDQyxNQUFNLENBQUNDLFNBQXRCLElBQW9DQyxPQUF4QyxFQUFpRDtBQUM3QyxTQUFLLElBQUlqQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHa0MsZUFBZSxDQUFDakMsTUFBcEMsRUFBNENELENBQUMsRUFBN0MsRUFBaUQ7QUFDN0NrQyxNQUFBQSxlQUFlLENBQUNsQyxDQUFELENBQWYsQ0FBbUJFLEdBQW5CLEVBQXdCYyxRQUF4QjtBQUNIOztBQUNEa0IsSUFBQUEsZUFBZSxDQUFDakMsTUFBaEIsR0FBeUIsQ0FBekI7QUFDSDtBQUNKOztBQUVELFNBQVNrQyxZQUFULENBQXVCakMsR0FBdkIsRUFBNEJHLElBQTVCLEVBQWtDVyxRQUFsQyxFQUE0Q0MsR0FBNUMsRUFBaURDLEdBQWpELEVBQXNEO0FBQ2xELE1BQUlrQixNQUFNLEdBQUduQixHQUFHLENBQUNvQixHQUFqQjtBQUNBLE1BQUlDLE1BQU0sR0FBR3JCLEdBQUcsQ0FBQ3NCLEdBQWpCO0FBQ0EsTUFBSUMsS0FBSyxHQUFHdEMsR0FBRyxDQUFDd0IsU0FBaEI7QUFDQSxNQUFJZSxDQUFDLEdBQUdDLE1BQU0sQ0FBQ0Msd0JBQVAsQ0FBZ0NILEtBQWhDLEVBQXVDeEIsUUFBdkMsQ0FBUjtBQUNBLE1BQUk0QixlQUFlLEdBQUcsQ0FBQ0gsQ0FBdkI7O0FBRUEsTUFBSUwsTUFBSixFQUFZO0FBQ1IsUUFBSWhELE1BQU0sSUFBSSxDQUFDOEIsR0FBWCxJQUFrQnVCLENBQWxCLElBQXVCQSxDQUFDLENBQUNKLEdBQTdCLEVBQWtDO0FBQzlCM0IsTUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQk4sSUFBakIsRUFBdUJXLFFBQXZCO0FBQ0E7QUFDSDs7QUFFRGEsSUFBQUEsZUFBZSxDQUFDM0IsR0FBRCxFQUFNZSxHQUFOLEVBQVdaLElBQVgsRUFBaUJXLFFBQWpCLEVBQTJCLElBQTNCLENBQWY7O0FBQ0EsUUFBS2MsU0FBUyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsU0FBdEIsSUFBb0NDLE9BQXhDLEVBQWlEO0FBQzdDQyxNQUFBQSxlQUFlLENBQUNqQyxNQUFoQixHQUF5QixDQUF6QjtBQUNIOztBQUVEbEIsSUFBQUEsSUFBSSxDQUFDNkMsWUFBTCxDQUFrQjFCLEdBQWxCLEVBQXVCYyxRQUF2QixFQUFpQyxjQUFqQyxFQUFpRCxLQUFqRDs7QUFFQSxRQUFJNUIsTUFBSixFQUFZO0FBQ1I7QUFDQXdCLE1BQUFBLFVBQVUsQ0FBQ1YsR0FBRCxFQUFNYyxRQUFOLENBQVY7QUFDSDs7QUFFRCxRQUFJLENBQUNFLEdBQUwsRUFBVTtBQUNOM0MsTUFBQUEsRUFBRSxDQUFDOEQsR0FBSCxDQUFPRyxLQUFQLEVBQWN4QixRQUFkLEVBQXdCb0IsTUFBeEIsRUFBZ0NRLGVBQWhDLEVBQWlEQSxlQUFqRDtBQUNIOztBQUVELFFBQUlkLFNBQVMsSUFBSTFDLE1BQWpCLEVBQXlCO0FBQ3JCTCxNQUFBQSxJQUFJLENBQUM2QyxZQUFMLENBQWtCMUIsR0FBbEIsRUFBdUJjLFFBQXZCLEVBQWlDLFdBQWpDLEVBQThDLElBQTlDLEVBRHFCLENBQ2dDO0FBQ3hEO0FBQ0o7O0FBRUQsTUFBSXNCLE1BQUosRUFBWTtBQUNSLFFBQUksQ0FBQ3BCLEdBQUwsRUFBVTtBQUNOLFVBQUk5QixNQUFNLElBQUlxRCxDQUFWLElBQWVBLENBQUMsQ0FBQ0YsR0FBckIsRUFBMEI7QUFDdEIsZUFBTzdCLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJOLElBQWpCLEVBQXVCVyxRQUF2QixDQUFQO0FBQ0g7O0FBQ0R6QyxNQUFBQSxFQUFFLENBQUNnRSxHQUFILENBQU9DLEtBQVAsRUFBY3hCLFFBQWQsRUFBd0JzQixNQUF4QixFQUFnQ00sZUFBaEMsRUFBaURBLGVBQWpEO0FBQ0g7O0FBQ0QsUUFBSWQsU0FBUyxJQUFJMUMsTUFBakIsRUFBeUI7QUFDckJMLE1BQUFBLElBQUksQ0FBQzZDLFlBQUwsQ0FBa0IxQixHQUFsQixFQUF1QmMsUUFBdkIsRUFBaUMsV0FBakMsRUFBOEMsSUFBOUMsRUFEcUIsQ0FDZ0M7QUFDeEQ7QUFDSjtBQUNKOztBQUVELFNBQVM2QixVQUFULENBQXFCQyxVQUFyQixFQUFpQztBQUM3QixNQUFJLE9BQU9BLFVBQVAsS0FBc0IsVUFBMUIsRUFBc0M7QUFDbEMsUUFBSWhCLFNBQUosRUFBZTtBQUNYLFVBQUk7QUFDQSxlQUFPZ0IsVUFBVSxFQUFqQjtBQUNILE9BRkQsQ0FHQSxPQUFPQyxDQUFQLEVBQVU7QUFDTnJDLFFBQUFBLEVBQUUsQ0FBQ3NDLE1BQUgsQ0FBVUQsQ0FBVjs7QUFDQSxlQUFPRSxTQUFQO0FBQ0g7QUFDSixLQVJELE1BU0s7QUFDRCxhQUFPSCxVQUFVLEVBQWpCO0FBQ0g7QUFDSjs7QUFDRCxTQUFPQSxVQUFQO0FBQ0g7O0FBRUQsU0FBU0ksa0JBQVQsQ0FBNkJDLElBQTdCLEVBQW1DQyxHQUFuQyxFQUF3Q0MsTUFBeEMsRUFBZ0Q7QUFDNUMsT0FBSyxJQUFJQyxJQUFULElBQWlCRixHQUFqQixFQUFzQjtBQUNsQixRQUFJLENBQUNELElBQUksQ0FBQ3hCLGNBQUwsQ0FBb0IyQixJQUFwQixDQUFELEtBQStCLENBQUNELE1BQUQsSUFBV0EsTUFBTSxDQUFDQyxJQUFELENBQWhELENBQUosRUFBNkQ7QUFDekRaLE1BQUFBLE1BQU0sQ0FBQ2EsY0FBUCxDQUFzQkosSUFBdEIsRUFBNEJHLElBQTVCLEVBQWtDL0UsRUFBRSxDQUFDaUYscUJBQUgsQ0FBeUJKLEdBQXpCLEVBQThCRSxJQUE5QixDQUFsQztBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFTRyxRQUFULENBQW1CMUMsU0FBbkIsRUFBOEIyQyxTQUE5QixFQUF5Q2pELE1BQXpDLEVBQWlEa0QsT0FBakQsRUFBMEQ7QUFDdEQsTUFBSUMsa0JBQUo7QUFDQSxNQUFJQyxRQUFRLEdBQUdGLE9BQU8sQ0FBQ0UsUUFBdkI7QUFDQSxNQUFJQyxJQUFJLEdBQUdILE9BQU8sQ0FBQ0csSUFBbkI7QUFDQSxNQUFJQyxPQUFPLEdBQUdKLE9BQU8sQ0FBQ0ssT0FBdEI7O0FBRUEsTUFBSTVFLE1BQUosRUFBWTtBQUNSO0FBQ0EsUUFBSTZFLFNBQVMsR0FBR0osUUFBUSxJQUFJQyxJQUE1Qjs7QUFDQSxRQUFJRyxTQUFKLEVBQWU7QUFDWCxVQUFJM0MsT0FBTyxDQUFDNEMsVUFBUixDQUFtQkQsU0FBbkIsQ0FBSixFQUFtQztBQUMvQnZELFFBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCO0FBQ0gsT0FGRCxNQUdLLElBQUksT0FBT2tELFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDdEN2RCxRQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQjtBQUNILE9BRkksTUFHQTtBQUNELFlBQUkyQyxTQUFTLElBQUkscUJBQXFCUyxJQUFyQixDQUEwQkYsU0FBMUIsQ0FBakIsRUFBdUQ7QUFDbkQsY0FBSUYsT0FBSixFQUFhO0FBQ1RyRCxZQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFTLElBQUksRUFBOUI7QUFDSCxXQUZELE1BR0s7QUFDREwsWUFBQUEsRUFBRSxDQUFDMEQsTUFBSCxDQUFVLElBQVYsRUFBZ0JyRCxTQUFTLElBQUksRUFBN0I7QUFDQTZDLFlBQUFBLGtCQUFrQixHQUFHLElBQXJCO0FBQ0g7QUFDSjtBQUNKOztBQUNELFVBQUlFLElBQUosRUFBVTtBQUNOLFlBQUlELFFBQUosRUFBYztBQUNWbkQsVUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQkksU0FBakI7QUFDSCxTQUZELE1BR0s7QUFDRCtDLFVBQUFBLElBQUksR0FBR0gsT0FBTyxDQUFDRyxJQUFSLEdBQWVPLGlCQUFpQixDQUFDUCxJQUFELEVBQU9KLFNBQVAsRUFBa0IzQyxTQUFsQixFQUE2QjRDLE9BQTdCLENBQXZDO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsTUFBSVcsS0FBSjtBQUNBLE1BQUlDLFNBQUo7O0FBQ0EsTUFBSVIsT0FBSixFQUFhO0FBQ1RPLElBQUFBLEtBQUssR0FBRyxDQUFDUixJQUFELENBQVI7QUFDQVMsSUFBQUEsU0FBUyxHQUFHVCxJQUFaO0FBQ0gsR0FIRCxNQUlLO0FBQ0RRLElBQUFBLEtBQUssR0FBR1QsUUFBUSxHQUFHLENBQUNBLFFBQUQsQ0FBSCxHQUFnQlcsWUFBWSxDQUFDZCxTQUFELEVBQVlqRCxNQUFaLEVBQW9Ca0QsT0FBcEIsQ0FBNUM7QUFDQVksSUFBQUEsU0FBUyxHQUFHRSxXQUFXLENBQUNILEtBQUQsRUFBUVosU0FBUixFQUFtQjNDLFNBQW5CLEVBQThCNEMsT0FBOUIsQ0FBdkIsQ0FGQyxDQUlEOztBQUNBcEYsSUFBQUEsRUFBRSxDQUFDbUcsS0FBSCxDQUFTSCxTQUFULEVBQW9CLFFBQXBCLEVBQThCLFVBQVVaLE9BQVYsRUFBbUI7QUFDN0NBLE1BQUFBLE9BQU8sV0FBUCxHQUFrQixJQUFsQjtBQUNBLGFBQU9yQyxPQUFPLENBQUNxQyxPQUFELENBQWQ7QUFDSCxLQUhELEVBR0csSUFISDtBQUlIOztBQUVEcEYsRUFBQUEsRUFBRSxDQUFDbUcsS0FBSCxDQUFTSCxTQUFULEVBQW9CLFdBQXBCLEVBQWlDRCxLQUFLLENBQUNyRSxNQUFOLEdBQWUsQ0FBZixHQUFtQnFFLEtBQW5CLEdBQTJCLElBQTVELEVBQWtFLElBQWxFO0FBR0EsTUFBSTVDLFNBQVMsR0FBRzZDLFNBQVMsQ0FBQzdDLFNBQTFCOztBQUNBLE1BQUlnQyxTQUFKLEVBQWU7QUFDWCxRQUFJLENBQUNLLE9BQUwsRUFBYztBQUNWeEYsTUFBQUEsRUFBRSxDQUFDb0csTUFBSCxDQUFVSixTQUFWLEVBQXFCYixTQUFyQixFQURVLENBQzhCOztBQUN4Q2hDLE1BQUFBLFNBQVMsR0FBRzZDLFNBQVMsQ0FBQzdDLFNBQXRCLENBRlUsQ0FFOEI7QUFDM0M7O0FBQ0Q2QyxJQUFBQSxTQUFTLENBQUMvRCxNQUFWLEdBQW1Ca0QsU0FBbkI7O0FBQ0EsUUFBSXRFLE1BQU0sSUFBSXdFLGtCQUFkLEVBQWtDO0FBQzlCbEMsTUFBQUEsU0FBUyxDQUFDb0MsSUFBVixHQUFpQixZQUFZLENBQUUsQ0FBL0I7QUFDSDtBQUNKOztBQUVELE1BQUlyRCxNQUFKLEVBQVk7QUFDUixTQUFLLElBQUltRSxDQUFDLEdBQUduRSxNQUFNLENBQUNSLE1BQVAsR0FBZ0IsQ0FBN0IsRUFBZ0MyRSxDQUFDLElBQUksQ0FBckMsRUFBd0NBLENBQUMsRUFBekMsRUFBNkM7QUFDekMsVUFBSUMsS0FBSyxHQUFHcEUsTUFBTSxDQUFDbUUsQ0FBRCxDQUFsQjtBQUNBMUIsTUFBQUEsa0JBQWtCLENBQUN4QixTQUFELEVBQVltRCxLQUFLLENBQUNuRCxTQUFsQixDQUFsQixDQUZ5QyxDQUl6Qzs7QUFDQXdCLE1BQUFBLGtCQUFrQixDQUFDcUIsU0FBRCxFQUFZTSxLQUFaLEVBQW1CLFVBQVV2QixJQUFWLEVBQWdCO0FBQ2pELGVBQU91QixLQUFLLENBQUNsRCxjQUFOLENBQXFCMkIsSUFBckIsTUFBK0IsQ0FBQ2xFLE1BQUQsSUFBV0QsbUJBQW1CLENBQUNLLE9BQXBCLENBQTRCOEQsSUFBNUIsSUFBb0MsQ0FBOUUsQ0FBUDtBQUNILE9BRmlCLENBQWxCLENBTHlDLENBU3pDOztBQUNBLFVBQUloQyxPQUFPLENBQUM0QyxVQUFSLENBQW1CVyxLQUFuQixDQUFKLEVBQStCO0FBQzNCM0IsUUFBQUEsa0JBQWtCLENBQUNuRSxJQUFJLENBQUMrRixhQUFMLENBQW1CUCxTQUFuQixDQUFELEVBQWdDeEYsSUFBSSxDQUFDK0YsYUFBTCxDQUFtQkQsS0FBbkIsQ0FBaEMsQ0FBbEI7QUFDSDtBQUNKLEtBZE8sQ0FlUjs7O0FBQ0FuRCxJQUFBQSxTQUFTLENBQUNxRCxXQUFWLEdBQXdCUixTQUF4QjtBQUNIOztBQUVELE1BQUksQ0FBQ1IsT0FBTCxFQUFjO0FBQ1ZyQyxJQUFBQSxTQUFTLENBQUNzRCxhQUFWLEdBQTBCQyxZQUExQjtBQUNIOztBQUVEMUcsRUFBQUEsRUFBRSxDQUFDMkcsWUFBSCxDQUFnQm5FLFNBQWhCLEVBQTJCd0QsU0FBM0I7QUFDQSxTQUFPQSxTQUFQO0FBQ0g7O0FBRUQsU0FBU1ksTUFBVCxDQUFpQnBFLFNBQWpCLEVBQTRCMkMsU0FBNUIsRUFBdUNqRCxNQUF2QyxFQUErQ2tELE9BQS9DLEVBQXdEO0FBQ3BELE1BQUl5QixTQUFTLEdBQUcxRSxFQUFFLENBQUMwRSxTQUFuQjs7QUFDQSxNQUFJQyxLQUFLLEdBQUczRSxFQUFFLENBQUM0RSxHQUFILENBQU9DLElBQVAsRUFBWjs7QUFDQSxNQUFJRixLQUFLLElBQUk5RyxFQUFFLENBQUNpSCxjQUFILENBQWtCOUIsU0FBbEIsRUFBNkIwQixTQUE3QixDQUFiLEVBQXNEO0FBQ2xEO0FBQ0EsUUFBSTdHLEVBQUUsQ0FBQ2lILGNBQUgsQ0FBa0JILEtBQUssQ0FBQ25GLEdBQXhCLEVBQTZCa0YsU0FBN0IsQ0FBSixFQUE2QztBQUN6QzFFLE1BQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVg7QUFDQSxhQUFPLElBQVA7QUFDSDs7QUFDRCxRQUFJdkIsTUFBTSxJQUFJaUcsS0FBSyxDQUFDSSxJQUFoQixJQUF3QjFFLFNBQTVCLEVBQXVDO0FBQ25DTCxNQUFBQSxFQUFFLENBQUMwRCxNQUFILENBQVUsSUFBVixFQUFnQnJELFNBQWhCO0FBQ0g7O0FBQ0RBLElBQUFBLFNBQVMsR0FBR0EsU0FBUyxJQUFJc0UsS0FBSyxDQUFDSyxNQUEvQjtBQUNIOztBQUVELE1BQUl4RixHQUFHLEdBQUd1RCxRQUFRLENBQUMxQyxTQUFELEVBQVkyQyxTQUFaLEVBQXVCakQsTUFBdkIsRUFBK0JrRCxPQUEvQixDQUFsQjs7QUFFQSxNQUFJMEIsS0FBSixFQUFXO0FBQ1AsUUFBSTlHLEVBQUUsQ0FBQ2lILGNBQUgsQ0FBa0I5QixTQUFsQixFQUE2QjBCLFNBQTdCLENBQUosRUFBNkM7QUFDekMsVUFBSUssSUFBSSxHQUFHSixLQUFLLENBQUNJLElBQWpCOztBQUNBLFVBQUlBLElBQUosRUFBVTtBQUNObEgsUUFBQUEsRUFBRSxDQUFDb0gsV0FBSCxDQUFlRixJQUFmLEVBQXFCdkYsR0FBckI7O0FBQ0EsWUFBSTRCLFNBQUosRUFBZTtBQUNYc0QsVUFBQUEsU0FBUyxDQUFDUSxZQUFWLENBQXVCMUYsR0FBdkIsRUFBNEIsc0NBQXNDYSxTQUFsRSxFQUE2RSxDQUFDLENBQTlFOztBQUNBYixVQUFBQSxHQUFHLENBQUN3QixTQUFKLENBQWNtRSxZQUFkLEdBQTZCOUQsTUFBTSxDQUFDK0QsS0FBUCxDQUFhQyxTQUFiLENBQXVCQyxjQUF2QixDQUFzQ1AsSUFBdEMsQ0FBN0I7QUFDSDtBQUNKOztBQUNESixNQUFBQSxLQUFLLENBQUNuRixHQUFOLEdBQVlBLEdBQVo7QUFDSCxLQVZELE1BV0ssSUFBSSxDQUFDM0IsRUFBRSxDQUFDaUgsY0FBSCxDQUFrQkgsS0FBSyxDQUFDbkYsR0FBeEIsRUFBNkJrRixTQUE3QixDQUFMLEVBQThDO0FBQy9DQyxNQUFBQSxLQUFLLENBQUNuRixHQUFOLEdBQVlBLEdBQVo7QUFDSDtBQUNKOztBQUNELFNBQU9BLEdBQVA7QUFDSDs7QUFFRCxTQUFTK0Ysc0JBQVQsQ0FBaUNsRixTQUFqQyxFQUE0QztBQUN4QyxNQUFJbUYsV0FBVyxHQUFHLFNBQWxCOztBQUNBLE1BQUluRixTQUFKLEVBQWU7QUFDWEEsSUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNvRixPQUFWLENBQWtCLGNBQWxCLEVBQWtDLEdBQWxDLEVBQXVDQSxPQUF2QyxDQUErQyxpQkFBL0MsRUFBa0UsR0FBbEUsQ0FBWjs7QUFDQSxRQUFJO0FBQ0E7QUFDQUMsTUFBQUEsUUFBUSxDQUFDLGNBQWNyRixTQUFkLEdBQTBCLE1BQTNCLENBQVI7QUFDQSxhQUFPQSxTQUFQO0FBQ0gsS0FKRCxDQUtBLE9BQU9nQyxDQUFQLEVBQVU7QUFDTjtBQUNIO0FBQ0o7O0FBQ0QsU0FBT21ELFdBQVA7QUFDSDs7QUFFRCxTQUFTRyxzQkFBVCxDQUFpQzNCLEtBQWpDLEVBQXdDO0FBQ3BDLE1BQUk0QixPQUFPLEdBQUcvSCxFQUFFLENBQUMrQixZQUFILENBQWdCb0UsS0FBaEIsQ0FBZDtBQUNBLE1BQUk2QixJQUFJLEdBQUc3QixLQUFLLENBQUNLLFdBQWpCO0FBQ0EsTUFBSXlCLEdBQUcsR0FBRyxTQUFTRixPQUFULEdBQW1CLEdBQTdCOztBQUNBLE9BQUssSUFBSXRHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd1RyxJQUFJLENBQUMxRixTQUFMLENBQWVaLE1BQW5DLEVBQTJDRCxDQUFDLEVBQTVDLEVBQWdEO0FBQzVDLFFBQUlzRCxJQUFJLEdBQUdpRCxJQUFJLENBQUMxRixTQUFMLENBQWViLENBQWYsQ0FBWDtBQUNBLFFBQUl5RyxPQUFPLEdBQUcvQixLQUFLLENBQUNwQixJQUFELENBQW5COztBQUNBLFFBQUlsRSxNQUFNLElBQUksT0FBT3FILE9BQVAsS0FBbUIsUUFBakMsRUFBMkM7QUFDdkMvRixNQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCMkYsT0FBakI7QUFDQSxhQUFPLFNBQVNBLE9BQVQsR0FBbUIsSUFBMUI7QUFDSDs7QUFDREUsSUFBQUEsR0FBRyxJQUFJQyxPQUFQOztBQUNBLFFBQUl6RyxDQUFDLEdBQUd1RyxJQUFJLENBQUMxRixTQUFMLENBQWVaLE1BQWYsR0FBd0IsQ0FBaEMsRUFBbUM7QUFDL0J1RyxNQUFBQSxHQUFHLElBQUksR0FBUDtBQUNIO0FBQ0o7O0FBQ0QsU0FBT0EsR0FBRyxHQUFHLEdBQWI7QUFDSCxFQUVEO0FBRUE7QUFDQTs7O0FBQ0EsU0FBU0UsV0FBVCxDQUFzQkMsQ0FBdEIsRUFBeUI7QUFDckIsU0FBT0MsSUFBSSxDQUFDQyxTQUFMLENBQWVGLENBQWYsR0FDSDtBQUNBUixFQUFBQSxPQUZHLENBRUssU0FGTCxFQUVnQixTQUZoQixFQUdIQSxPQUhHLENBR0ssU0FITCxFQUdnQixTQUhoQixDQUFQO0FBSUg7O0FBRUQsU0FBU1csZUFBVCxDQUEwQkMsS0FBMUIsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQ3ZDO0FBQ0EsTUFBSUMsQ0FBQyxHQUFHLEVBQVI7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDs7QUFFQSxPQUFLLElBQUlsSCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHZ0gsUUFBUSxDQUFDL0csTUFBN0IsRUFBcUNELENBQUMsRUFBdEMsRUFBMEM7QUFDdEMsUUFBSXNELElBQUksR0FBRzBELFFBQVEsQ0FBQ2hILENBQUQsQ0FBbkI7QUFDQSxRQUFJbUgsT0FBTyxHQUFHN0QsSUFBSSxHQUFHdEUsU0FBUCxHQUFtQixTQUFqQzs7QUFDQSxRQUFJbUksT0FBTyxJQUFJSixLQUFmLEVBQXNCO0FBQUc7QUFDckIsVUFBSUssU0FBSjs7QUFDQSxVQUFJQyxhQUFhLENBQUNsRCxJQUFkLENBQW1CYixJQUFuQixDQUFKLEVBQThCO0FBQzFCOEQsUUFBQUEsU0FBUyxHQUFHLFVBQVU5RCxJQUFWLEdBQWlCLEdBQTdCO0FBQ0gsT0FGRCxNQUdLO0FBQ0Q4RCxRQUFBQSxTQUFTLEdBQUcsVUFBVVYsV0FBVyxDQUFDcEQsSUFBRCxDQUFyQixHQUE4QixJQUExQztBQUNIOztBQUNELFVBQUlnRSxVQUFKO0FBQ0EsVUFBSUMsR0FBRyxHQUFHUixLQUFLLENBQUNJLE9BQUQsQ0FBZjs7QUFDQSxVQUFJLE9BQU9JLEdBQVAsS0FBZSxRQUFmLElBQTJCQSxHQUEvQixFQUFvQztBQUNoQyxZQUFJQSxHQUFHLFlBQVk3RyxFQUFFLENBQUM4RyxTQUF0QixFQUFpQztBQUM3QkYsVUFBQUEsVUFBVSxHQUFHakIsc0JBQXNCLENBQUNrQixHQUFELENBQW5DO0FBQ0gsU0FGRCxNQUdLLElBQUluRyxLQUFLLENBQUNDLE9BQU4sQ0FBY2tHLEdBQWQsQ0FBSixFQUF3QjtBQUN6QkQsVUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDSCxTQUZJLE1BR0E7QUFDREEsVUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDSDtBQUNKLE9BVkQsTUFXSyxJQUFJLE9BQU9DLEdBQVAsS0FBZSxVQUFuQixFQUErQjtBQUNoQyxZQUFJRSxLQUFLLEdBQUdSLENBQUMsQ0FBQ2hILE1BQWQ7QUFDQWdILFFBQUFBLENBQUMsQ0FBQ3hILElBQUYsQ0FBTzhILEdBQVA7QUFDQUQsUUFBQUEsVUFBVSxHQUFHLE9BQU9HLEtBQVAsR0FBZSxLQUE1Qjs7QUFDQSxZQUFJM0YsU0FBSixFQUFlO0FBQ1hvRixVQUFBQSxJQUFJLElBQUksWUFBWUUsU0FBWixHQUF3QkUsVUFBeEIsR0FBcUMsbUNBQXJDLEdBQTJFRixTQUEzRSxHQUF1RixpQkFBL0Y7QUFDQTtBQUNIO0FBQ0osT0FSSSxNQVNBLElBQUksT0FBT0csR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzlCRCxRQUFBQSxVQUFVLEdBQUdaLFdBQVcsQ0FBQ2EsR0FBRCxDQUF4QjtBQUNILE9BRkksTUFHQTtBQUNEO0FBQ0FELFFBQUFBLFVBQVUsR0FBR0MsR0FBYjtBQUNIOztBQUNESCxNQUFBQSxTQUFTLEdBQUdBLFNBQVMsR0FBR0UsVUFBWixHQUF5QixLQUFyQztBQUNBSixNQUFBQSxJQUFJLElBQUlFLFNBQVI7QUFDSDtBQUNKLEdBaERzQyxDQWtEdkM7QUFDQTtBQUNBOzs7QUFFQSxNQUFJTSxTQUFKOztBQUNBLE1BQUlULENBQUMsQ0FBQ2hILE1BQUYsS0FBYSxDQUFqQixFQUFvQjtBQUNoQnlILElBQUFBLFNBQVMsR0FBR3RCLFFBQVEsQ0FBQ2MsSUFBRCxDQUFwQjtBQUNILEdBRkQsTUFHSztBQUNEUSxJQUFBQSxTQUFTLEdBQUd0QixRQUFRLENBQUMsR0FBRCxFQUFNLDBCQUEwQmMsSUFBMUIsR0FBaUMsSUFBdkMsQ0FBUixDQUFxREQsQ0FBckQsQ0FBWjtBQUNIOztBQUVELFNBQU9TLFNBQVA7QUFDSDs7QUFFRCxTQUFTQyxZQUFULENBQXVCWixLQUF2QixFQUE4QkMsUUFBOUIsRUFBd0M7QUFDcEMsTUFBSVksYUFBYSxHQUFHLEVBQXBCO0FBQ0EsTUFBSUMsY0FBYyxHQUFHLEVBQXJCO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsTUFBSUMsWUFBWSxHQUFHLEVBQW5COztBQUVBLE9BQUssSUFBSS9ILENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdnSCxRQUFRLENBQUMvRyxNQUE3QixFQUFxQyxFQUFFRCxDQUF2QyxFQUEwQztBQUN0QyxRQUFJc0QsSUFBSSxHQUFHMEQsUUFBUSxDQUFDaEgsQ0FBRCxDQUFuQjtBQUNBLFFBQUltSCxPQUFPLEdBQUc3RCxJQUFJLEdBQUd0RSxTQUFQLEdBQW1CLFNBQWpDOztBQUNBLFFBQUltSSxPQUFPLElBQUlKLEtBQWYsRUFBc0I7QUFBRTtBQUNwQixVQUFJUSxHQUFHLEdBQUdSLEtBQUssQ0FBQ0ksT0FBRCxDQUFmOztBQUNBLFVBQUssT0FBT0ksR0FBUCxLQUFlLFFBQWYsSUFBMkJBLEdBQTVCLElBQW9DLE9BQU9BLEdBQVAsS0FBZSxVQUF2RCxFQUFtRTtBQUMvREssUUFBQUEsYUFBYSxDQUFDbkksSUFBZCxDQUFtQjZELElBQW5CO0FBQ0F1RSxRQUFBQSxjQUFjLENBQUNwSSxJQUFmLENBQW9COEgsR0FBcEI7QUFDSCxPQUhELE1BSUs7QUFDRDtBQUNBTyxRQUFBQSxXQUFXLENBQUNySSxJQUFaLENBQWlCNkQsSUFBakI7QUFDQXlFLFFBQUFBLFlBQVksQ0FBQ3RJLElBQWIsQ0FBa0I4SCxHQUFsQjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFPLFlBQVk7QUFDZixTQUFLLElBQUl2SCxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHOEgsV0FBVyxDQUFDN0gsTUFBaEMsRUFBd0MsRUFBRUQsRUFBMUMsRUFBNkM7QUFDekMsV0FBSzhILFdBQVcsQ0FBQzlILEVBQUQsQ0FBaEIsSUFBdUIrSCxZQUFZLENBQUMvSCxFQUFELENBQW5DO0FBQ0g7O0FBQ0QsU0FBSyxJQUFJQSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHNEgsYUFBYSxDQUFDM0gsTUFBbEMsRUFBMENELEdBQUMsRUFBM0MsRUFBK0M7QUFDM0MsVUFBSXNELEtBQUksR0FBR3NFLGFBQWEsQ0FBQzVILEdBQUQsQ0FBeEI7QUFDQSxVQUFJc0gsVUFBSjtBQUNBLFVBQUlDLEdBQUcsR0FBR00sY0FBYyxDQUFDN0gsR0FBRCxDQUF4Qjs7QUFDQSxVQUFJLE9BQU91SCxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDekIsWUFBSUEsR0FBRyxZQUFZN0csRUFBRSxDQUFDOEcsU0FBdEIsRUFBaUM7QUFDN0JGLFVBQUFBLFVBQVUsR0FBR0MsR0FBRyxDQUFDUyxLQUFKLEVBQWI7QUFDSCxTQUZELE1BR0ssSUFBSTVHLEtBQUssQ0FBQ0MsT0FBTixDQUFja0csR0FBZCxDQUFKLEVBQXdCO0FBQ3pCRCxVQUFBQSxVQUFVLEdBQUcsRUFBYjtBQUNILFNBRkksTUFHQTtBQUNEQSxVQUFBQSxVQUFVLEdBQUcsRUFBYjtBQUNIO0FBQ0osT0FWRCxNQVdLO0FBQ0Q7QUFDQSxZQUFJeEYsU0FBSixFQUFlO0FBQ1gsY0FBSTtBQUNBd0YsWUFBQUEsVUFBVSxHQUFHQyxHQUFHLEVBQWhCO0FBQ0gsV0FGRCxDQUdBLE9BQU9VLEdBQVAsRUFBWTtBQUNSdkgsWUFBQUEsRUFBRSxDQUFDc0MsTUFBSCxDQUFVRCxDQUFWOztBQUNBO0FBQ0g7QUFDSixTQVJELE1BU0s7QUFDRHVFLFVBQUFBLFVBQVUsR0FBR0MsR0FBRyxFQUFoQjtBQUNIO0FBQ0o7O0FBQ0QsV0FBS2pFLEtBQUwsSUFBYWdFLFVBQWI7QUFDSDtBQUNKLEdBcENEO0FBcUNILEVBRUQ7OztBQUNBLElBQUlELGFBQWEsR0FBRyw0QkFBcEI7O0FBQ0EsU0FBU3BDLFlBQVQsQ0FBdUJpRCxXQUF2QixFQUFvQztBQUNoQztBQUNBLE1BQUluQixLQUFLLEdBQUdoSSxJQUFJLENBQUMrRixhQUFMLENBQW1Cb0QsV0FBbkIsQ0FBWjtBQUNBLE1BQUlsQixRQUFRLEdBQUdrQixXQUFXLENBQUNySCxTQUEzQjs7QUFDQSxNQUFJbUcsUUFBUSxLQUFLLElBQWpCLEVBQXVCO0FBQ25CdEgsSUFBQUEsbUJBQW1CLENBQUNLLElBQXBCO0FBQ0FpSCxJQUFBQSxRQUFRLEdBQUdrQixXQUFXLENBQUNySCxTQUF2QjtBQUNILEdBUCtCLENBU2hDOzs7QUFDQSxNQUFJNkcsU0FBUyxHQUFHUyxjQUFjLEdBQUdyQixlQUFlLENBQUNDLEtBQUQsRUFBUUMsUUFBUixDQUFsQixHQUFzQ1csWUFBWSxDQUFDWixLQUFELEVBQVFDLFFBQVIsQ0FBaEY7QUFDQWtCLEVBQUFBLFdBQVcsQ0FBQ3hHLFNBQVosQ0FBc0JzRCxhQUF0QixHQUFzQzBDLFNBQXRDLENBWGdDLENBYWhDO0FBQ0E7O0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ1UsSUFBVixDQUFlLElBQWY7QUFDSDs7QUFFRCxJQUFJM0QsV0FBVyxHQUFHMEQsY0FBYyxHQUFHLFVBQVU3RCxLQUFWLEVBQWlCWixTQUFqQixFQUE0QjNDLFNBQTVCLEVBQXVDNEMsT0FBdkMsRUFBZ0Q7QUFDL0UsTUFBSTBFLGdCQUFnQixHQUFHM0UsU0FBUyxJQUFJNEUsZUFBZSxDQUFDNUUsU0FBRCxFQUFZQyxPQUFaLEVBQXFCNUMsU0FBckIsQ0FBbkQ7QUFFQSxNQUFJd0gsUUFBUSxHQUFHbkosTUFBTSxHQUFHNkcsc0JBQXNCLENBQUNsRixTQUFELENBQXpCLEdBQXVDLFNBQTVEO0FBQ0EsTUFBSXlILElBQUksR0FBRyxxQkFBcUJELFFBQXJCLEdBQWdDLE9BQTNDOztBQUVBLE1BQUlGLGdCQUFKLEVBQXNCO0FBQ2xCRyxJQUFBQSxJQUFJLElBQUkscUJBQVI7QUFDSCxHQVI4RSxDQVUvRTs7O0FBQ0FBLEVBQUFBLElBQUksSUFBSSx3QkFBd0JELFFBQXhCLEdBQW1DLE1BQTNDLENBWCtFLENBYS9FOztBQUNBLE1BQUlFLE9BQU8sR0FBR25FLEtBQUssQ0FBQ3JFLE1BQXBCOztBQUNBLE1BQUl3SSxPQUFPLEdBQUcsQ0FBZCxFQUFpQjtBQUNiLFFBQUlDLFdBQVcsR0FBR3RKLE1BQU0sSUFBSSxFQUFHMkIsU0FBUyxJQUFJQSxTQUFTLENBQUM0SCxVQUFWLENBQXFCLEtBQXJCLENBQWhCLENBQTVCOztBQUNBLFFBQUlELFdBQUosRUFBaUI7QUFDYkYsTUFBQUEsSUFBSSxJQUFJLFFBQVI7QUFDSDs7QUFDRCxRQUFJSSxPQUFPLEdBQUcsNEJBQWQ7O0FBQ0EsUUFBSUgsT0FBTyxLQUFLLENBQWhCLEVBQW1CO0FBQ2ZELE1BQUFBLElBQUksSUFBSUQsUUFBUSxHQUFHLGNBQVgsR0FBNEJLLE9BQXBDO0FBQ0gsS0FGRCxNQUdLO0FBQ0RKLE1BQUFBLElBQUksSUFBSSxZQUFZRCxRQUFaLEdBQXVCLGVBQS9COztBQUNBLFdBQUssSUFBSXZJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd5SSxPQUFwQixFQUE2QnpJLENBQUMsRUFBOUIsRUFBa0M7QUFDOUJ3SSxRQUFBQSxJQUFJLElBQUksUUFBUXhJLENBQVIsR0FBWTRJLE9BQXBCO0FBQ0g7QUFDSjs7QUFDRCxRQUFJRixXQUFKLEVBQWlCO0FBQ2JGLE1BQUFBLElBQUksSUFBSSxpQkFDSSxpQkFESixHQUVBLEtBRlI7QUFHSDtBQUNKOztBQUNEQSxFQUFBQSxJQUFJLElBQUksR0FBUjtBQUVBLFNBQU9wQyxRQUFRLENBQUNvQyxJQUFELENBQVIsRUFBUDtBQUNILENBdkMrQixHQXVDNUIsVUFBVWxFLEtBQVYsRUFBaUJaLFNBQWpCLEVBQTRCM0MsU0FBNUIsRUFBdUM0QyxPQUF2QyxFQUFnRDtBQUNoRCxNQUFJMEUsZ0JBQWdCLEdBQUczRSxTQUFTLElBQUk0RSxlQUFlLENBQUM1RSxTQUFELEVBQVlDLE9BQVosRUFBcUI1QyxTQUFyQixDQUFuRDtBQUNBLE1BQUkwSCxPQUFPLEdBQUduRSxLQUFLLENBQUNyRSxNQUFwQjs7QUFFQSxNQUFJNEksT0FBSjs7QUFFQSxNQUFJSixPQUFPLEdBQUcsQ0FBZCxFQUFpQjtBQUNiLFFBQUlKLGdCQUFKLEVBQXNCO0FBQ2xCLFVBQUlJLE9BQU8sS0FBSyxDQUFoQixFQUFtQjtBQUNmO0FBQ0FJLFFBQUFBLE9BQUssR0FBRyxpQkFBWTtBQUNoQixlQUFLQyxNQUFMLEdBQWMsSUFBZDs7QUFDQSxlQUFLOUQsYUFBTCxDQUFtQjZELE9BQW5COztBQUNBdkUsVUFBQUEsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTeUUsS0FBVCxDQUFlLElBQWYsRUFBcUJDLFNBQXJCO0FBQ0ExRSxVQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVN5RSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckI7QUFDSCxTQUxEO0FBTUgsT0FSRCxNQVNLO0FBQ0RILFFBQUFBLE9BQUssR0FBRyxrQkFBWTtBQUNoQixlQUFLQyxNQUFMLEdBQWMsSUFBZDs7QUFDQSxlQUFLOUQsYUFBTCxDQUFtQjZELE9BQW5COztBQUNBLGVBQUssSUFBSTdJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdzRSxLQUFLLENBQUNyRSxNQUExQixFQUFrQyxFQUFFRCxDQUFwQyxFQUF1QztBQUNuQ3NFLFlBQUFBLEtBQUssQ0FBQ3RFLENBQUQsQ0FBTCxDQUFTK0ksS0FBVCxDQUFlLElBQWYsRUFBcUJDLFNBQXJCO0FBQ0g7QUFDSixTQU5EO0FBT0g7QUFDSixLQW5CRCxNQW9CSztBQUNELFVBQUlQLE9BQU8sS0FBSyxDQUFoQixFQUFtQjtBQUNmO0FBQ0FJLFFBQUFBLE9BQUssR0FBRyxtQkFBWTtBQUNoQixlQUFLN0QsYUFBTCxDQUFtQjZELE9BQW5COztBQUNBdkUsVUFBQUEsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTeUUsS0FBVCxDQUFlLElBQWYsRUFBcUJDLFNBQXJCO0FBQ0ExRSxVQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVN5RSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckI7QUFDQTFFLFVBQUFBLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU3lFLEtBQVQsQ0FBZSxJQUFmLEVBQXFCQyxTQUFyQjtBQUNILFNBTEQ7QUFNSCxPQVJELE1BU0s7QUFDREgsUUFBQUEsT0FBSyxHQUFHLG1CQUFZO0FBQ2hCLGVBQUs3RCxhQUFMLENBQW1CNkQsT0FBbkI7O0FBQ0EsY0FBSXZFLEtBQUssR0FBR3VFLE9BQUssQ0FBQ0ksU0FBbEI7O0FBQ0EsZUFBSyxJQUFJakosQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3NFLEtBQUssQ0FBQ3JFLE1BQTFCLEVBQWtDLEVBQUVELENBQXBDLEVBQXVDO0FBQ25Dc0UsWUFBQUEsS0FBSyxDQUFDdEUsQ0FBRCxDQUFMLENBQVMrSSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckI7QUFDSDtBQUNKLFNBTkQ7QUFPSDtBQUNKO0FBQ0osR0F6Q0QsTUEwQ0s7QUFDREgsSUFBQUEsT0FBSyxHQUFHLG1CQUFZO0FBQ2hCLFVBQUlSLGdCQUFKLEVBQXNCO0FBQ2xCLGFBQUtTLE1BQUwsR0FBYyxJQUFkO0FBQ0g7O0FBQ0QsV0FBSzlELGFBQUwsQ0FBbUI2RCxPQUFuQjtBQUNILEtBTEQ7QUFNSDs7QUFDRCxTQUFPQSxPQUFQO0FBQ0gsQ0FoR0Q7O0FBa0dBLFNBQVN4RSxpQkFBVCxDQUE0QlAsSUFBNUIsRUFBa0NKLFNBQWxDLEVBQTZDM0MsU0FBN0MsRUFBd0Q0QyxPQUF4RCxFQUFpRTtBQUM3RCxNQUFJN0IsU0FBUyxJQUFJNEIsU0FBakIsRUFBNEI7QUFDeEI7QUFDQSxRQUFJd0YsVUFBVSxHQUFHcEYsSUFBakI7O0FBQ0EsUUFBSXFGLFlBQVksQ0FBQ2hGLElBQWIsQ0FBa0JMLElBQWxCLENBQUosRUFBNkI7QUFDekIsVUFBSUgsT0FBTyxDQUFDSyxPQUFaLEVBQXFCO0FBQ2pCdEQsUUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQkksU0FBakI7QUFDSCxPQUZELE1BR0s7QUFDREwsUUFBQUEsRUFBRSxDQUFDMEQsTUFBSCxDQUFVLElBQVYsRUFBZ0JyRCxTQUFoQixFQURDLENBRUQ7O0FBQ0ErQyxRQUFBQSxJQUFJLEdBQUcsZ0JBQVk7QUFDZixlQUFLZ0YsTUFBTCxHQUFjLFlBQVksQ0FBRSxDQUE1Qjs7QUFDQSxjQUFJTSxHQUFHLEdBQUdGLFVBQVUsQ0FBQ0gsS0FBWCxDQUFpQixJQUFqQixFQUF1QkMsU0FBdkIsQ0FBVjtBQUNBLGVBQUtGLE1BQUwsR0FBYyxJQUFkO0FBQ0EsaUJBQU9NLEdBQVA7QUFDSCxTQUxEO0FBTUg7QUFDSjtBQUNKLEdBbkI0RCxDQXFCN0Q7OztBQUNBLE1BQUl0RixJQUFJLENBQUM3RCxNQUFMLEdBQWMsQ0FBZCxLQUFvQixDQUFDYyxTQUFELElBQWMsQ0FBQ0EsU0FBUyxDQUFDNEgsVUFBVixDQUFxQixLQUFyQixDQUFuQyxDQUFKLEVBQXFFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBakksSUFBQUEsRUFBRSxDQUFDMEQsTUFBSCxDQUFVLElBQVYsRUFBZ0JyRCxTQUFoQjtBQUNIOztBQUVELFNBQU8rQyxJQUFQO0FBQ0g7O0FBRUQsU0FBU1UsWUFBVCxDQUF1QmQsU0FBdkIsRUFBa0NqRCxNQUFsQyxFQUEwQ2tELE9BQTFDLEVBQW1EO0FBQy9DO0FBQ0EsV0FBUzBGLFFBQVQsQ0FBbUJuSixHQUFuQixFQUF3QjtBQUNwQixRQUFJb0IsT0FBTyxDQUFDNEMsVUFBUixDQUFtQmhFLEdBQW5CLENBQUosRUFBNkI7QUFDekIsYUFBT0EsR0FBRyxDQUFDK0ksU0FBSixJQUFpQixFQUF4QjtBQUNILEtBRkQsTUFHSztBQUNELGFBQU8sQ0FBQy9JLEdBQUQsQ0FBUDtBQUNIO0FBQ0o7O0FBRUQsTUFBSW9FLEtBQUssR0FBRyxFQUFaLENBWCtDLENBWS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBSWdGLFlBQVksR0FBRyxDQUFDNUYsU0FBRCxFQUFZNkYsTUFBWixDQUFtQjlJLE1BQW5CLENBQW5COztBQUNBLE9BQUssSUFBSStJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLFlBQVksQ0FBQ3JKLE1BQWpDLEVBQXlDdUosQ0FBQyxFQUExQyxFQUE4QztBQUMxQyxRQUFJQyxXQUFXLEdBQUdILFlBQVksQ0FBQ0UsQ0FBRCxDQUE5Qjs7QUFDQSxRQUFJQyxXQUFKLEVBQWlCO0FBQ2IsVUFBSUMsU0FBUyxHQUFHTCxRQUFRLENBQUNJLFdBQUQsQ0FBeEI7O0FBQ0EsV0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxTQUFTLENBQUN6SixNQUE5QixFQUFzQzBKLENBQUMsRUFBdkMsRUFBMkM7QUFDdkN0SyxRQUFBQSxVQUFVLENBQUNpRixLQUFELEVBQVFvRixTQUFTLENBQUNDLENBQUQsQ0FBakIsQ0FBVjtBQUNIO0FBQ0o7QUFDSixHQXRDOEMsQ0F1Qy9DO0FBRUE7OztBQUNBLE1BQUk3RixJQUFJLEdBQUdILE9BQU8sQ0FBQ0csSUFBbkI7O0FBQ0EsTUFBSUEsSUFBSixFQUFVO0FBQ05RLElBQUFBLEtBQUssQ0FBQzdFLElBQU4sQ0FBV3FFLElBQVg7QUFDSDs7QUFFRCxTQUFPUSxLQUFQO0FBQ0g7O0FBRUQsSUFBSTZFLFlBQVksR0FBRyxNQUFNaEYsSUFBTixDQUFXLFlBQVU7QUFBQ3lGLEVBQUFBLEdBQUc7QUFBQyxDQUExQixJQUE4QixjQUE5QixHQUErQyxJQUFsRTtBQUNBLElBQUlDLGtCQUFrQixHQUFHLE1BQU0xRixJQUFOLENBQVcsWUFBVTtBQUFDeUYsRUFBQUEsR0FBRztBQUFDLENBQTFCLElBQThCLG1CQUE5QixHQUFvRCxZQUE3RTs7QUFDQSxTQUFTdEIsZUFBVCxDQUEwQjVFLFNBQTFCLEVBQXFDQyxPQUFyQyxFQUE4QzVDLFNBQTlDLEVBQXlEO0FBQ3JELE1BQUkrSSxZQUFZLEdBQUcsS0FBbkI7O0FBQ0EsT0FBSyxJQUFJQyxRQUFULElBQXFCcEcsT0FBckIsRUFBOEI7QUFDMUIsUUFBSXpFLGVBQWUsQ0FBQ00sT0FBaEIsQ0FBd0J1SyxRQUF4QixLQUFxQyxDQUF6QyxFQUE0QztBQUN4QztBQUNIOztBQUNELFFBQUk3QyxJQUFJLEdBQUd2RCxPQUFPLENBQUNvRyxRQUFELENBQWxCOztBQUNBLFFBQUksT0FBTzdDLElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDNUI7QUFDSDs7QUFDRCxRQUFJOEMsRUFBRSxHQUFHekwsRUFBRSxDQUFDaUYscUJBQUgsQ0FBeUJFLFNBQVMsQ0FBQ2hDLFNBQW5DLEVBQThDcUksUUFBOUMsQ0FBVDs7QUFDQSxRQUFJQyxFQUFKLEVBQVE7QUFDSixVQUFJQyxTQUFTLEdBQUdELEVBQUUsQ0FBQ3RGLEtBQW5CLENBREksQ0FFSjs7QUFDQSxVQUFJLE9BQU91RixTQUFQLEtBQXFCLFVBQXpCLEVBQXFDO0FBQ2pDLFlBQUlkLFlBQVksQ0FBQ2hGLElBQWIsQ0FBa0IrQyxJQUFsQixDQUFKLEVBQTZCO0FBQ3pCNEMsVUFBQUEsWUFBWSxHQUFHLElBQWYsQ0FEeUIsQ0FFekI7O0FBQ0FuRyxVQUFBQSxPQUFPLENBQUNvRyxRQUFELENBQVAsR0FBcUIsVUFBVUUsU0FBVixFQUFxQi9DLElBQXJCLEVBQTJCO0FBQzVDLG1CQUFPLFlBQVk7QUFDZixrQkFBSWdELEdBQUcsR0FBRyxLQUFLcEIsTUFBZixDQURlLENBR2Y7O0FBQ0EsbUJBQUtBLE1BQUwsR0FBY21CLFNBQWQ7QUFFQSxrQkFBSWIsR0FBRyxHQUFHbEMsSUFBSSxDQUFDNkIsS0FBTCxDQUFXLElBQVgsRUFBaUJDLFNBQWpCLENBQVYsQ0FOZSxDQVFmOztBQUNBLG1CQUFLRixNQUFMLEdBQWNvQixHQUFkO0FBRUEscUJBQU9kLEdBQVA7QUFDSCxhQVpEO0FBYUgsV0FkbUIsQ0FjakJhLFNBZGlCLEVBY04vQyxJQWRNLENBQXBCO0FBZUg7O0FBQ0Q7QUFDSDtBQUNKOztBQUNELFFBQUk5SCxNQUFNLElBQUl5SyxrQkFBa0IsQ0FBQzFGLElBQW5CLENBQXdCK0MsSUFBeEIsQ0FBZCxFQUE2QztBQUN6Q3hHLE1BQUFBLEVBQUUsQ0FBQzBELE1BQUgsQ0FBVSxJQUFWLEVBQWdCckQsU0FBaEIsRUFBMkJnSixRQUEzQjtBQUNIO0FBQ0o7O0FBQ0QsU0FBT0QsWUFBUDtBQUNIOztBQUVELFNBQVN2SixpQkFBVCxDQUE0QkwsR0FBNUIsRUFBaUNhLFNBQWpDLEVBQTRDWixVQUE1QyxFQUF3RHVELFNBQXhELEVBQW1FakQsTUFBbkUsRUFBMkVTLEdBQTNFLEVBQWdGO0FBQzVFaEIsRUFBQUEsR0FBRyxDQUFDVyxTQUFKLEdBQWdCLEVBQWhCOztBQUVBLE1BQUk2QyxTQUFTLElBQUlBLFNBQVMsQ0FBQzdDLFNBQTNCLEVBQXNDO0FBQ2xDWCxJQUFBQSxHQUFHLENBQUNXLFNBQUosR0FBZ0I2QyxTQUFTLENBQUM3QyxTQUFWLENBQW9Cc0osS0FBcEIsRUFBaEI7QUFDSDs7QUFFRCxNQUFJMUosTUFBSixFQUFZO0FBQ1IsU0FBSyxJQUFJbUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR25FLE1BQU0sQ0FBQ1IsTUFBM0IsRUFBbUMsRUFBRTJFLENBQXJDLEVBQXdDO0FBQ3BDLFVBQUlDLEtBQUssR0FBR3BFLE1BQU0sQ0FBQ21FLENBQUQsQ0FBbEI7O0FBQ0EsVUFBSUMsS0FBSyxDQUFDaEUsU0FBVixFQUFxQjtBQUNqQlgsUUFBQUEsR0FBRyxDQUFDVyxTQUFKLEdBQWdCWCxHQUFHLENBQUNXLFNBQUosQ0FBYzBJLE1BQWQsQ0FBcUIxRSxLQUFLLENBQUNoRSxTQUFOLENBQWdCd0MsTUFBaEIsQ0FBdUIsVUFBVTVCLENBQVYsRUFBYTtBQUNyRSxpQkFBT3ZCLEdBQUcsQ0FBQ1csU0FBSixDQUFjckIsT0FBZCxDQUFzQmlDLENBQXRCLElBQTJCLENBQWxDO0FBQ0gsU0FGb0MsQ0FBckIsQ0FBaEI7QUFHSDtBQUNKO0FBQ0o7O0FBRUQsTUFBSXRCLFVBQUosRUFBZ0I7QUFDWjtBQUNBbEIsSUFBQUEsVUFBVSxDQUFDbUwsZUFBWCxDQUEyQmpLLFVBQTNCLEVBQXVDWSxTQUF2QyxFQUFrRGIsR0FBbEQsRUFBdURnQixHQUF2RDs7QUFFQSxTQUFLLElBQUlGLFFBQVQsSUFBcUJiLFVBQXJCLEVBQWlDO0FBQzdCLFVBQUljLEdBQUcsR0FBR2QsVUFBVSxDQUFDYSxRQUFELENBQXBCOztBQUNBLFVBQUksYUFBYUMsR0FBakIsRUFBc0I7QUFDbEJILFFBQUFBLFVBQVUsQ0FBQ1osR0FBRCxFQUFNYSxTQUFOLEVBQWlCQyxRQUFqQixFQUEyQkMsR0FBM0IsRUFBZ0NDLEdBQWhDLENBQVY7QUFDSCxPQUZELE1BR0s7QUFDRGlCLFFBQUFBLFlBQVksQ0FBQ2pDLEdBQUQsRUFBTWEsU0FBTixFQUFpQkMsUUFBakIsRUFBMkJDLEdBQTNCLEVBQWdDQyxHQUFoQyxDQUFaO0FBQ0g7QUFDSjtBQUNKOztBQUVELE1BQUk2RixLQUFLLEdBQUdoSSxJQUFJLENBQUMrRixhQUFMLENBQW1CNUUsR0FBbkIsQ0FBWjtBQUNBQSxFQUFBQSxHQUFHLENBQUNtSyxVQUFKLEdBQWlCbkssR0FBRyxDQUFDVyxTQUFKLENBQWN3QyxNQUFkLENBQXFCLFVBQVVDLElBQVYsRUFBZ0I7QUFDbEQsV0FBT3lELEtBQUssQ0FBQ3pELElBQUksR0FBR3RFLFNBQVAsR0FBbUIsY0FBcEIsQ0FBTCxLQUE2QyxLQUFwRDtBQUNILEdBRmdCLENBQWpCO0FBR0g7QUFFRDs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUZBLFNBQVNzQyxPQUFULENBQWtCcUMsT0FBbEIsRUFBMkI7QUFDdkJBLEVBQUFBLE9BQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCO0FBRUEsTUFBSXRELElBQUksR0FBR3NELE9BQU8sQ0FBQ3RELElBQW5CO0FBQ0EsTUFBSWlLLElBQUksR0FBRzNHLE9BQU87QUFBUTtBQUExQjtBQUNBLE1BQUlsRCxNQUFNLEdBQUdrRCxPQUFPLENBQUNsRCxNQUFyQixDQUx1QixDQU92Qjs7QUFDQSxNQUFJUCxHQUFHLEdBQUdpRixNQUFNLENBQUM5RSxJQUFELEVBQU9pSyxJQUFQLEVBQWE3SixNQUFiLEVBQXFCa0QsT0FBckIsQ0FBaEI7O0FBQ0EsTUFBSSxDQUFDdEQsSUFBTCxFQUFXO0FBQ1BBLElBQUFBLElBQUksR0FBR0ssRUFBRSxDQUFDbkMsRUFBSCxDQUFNK0IsWUFBTixDQUFtQkosR0FBbkIsQ0FBUDtBQUNIOztBQUVEQSxFQUFBQSxHQUFHLENBQUNxSyxPQUFKLEdBQWMsSUFBZDs7QUFDQSxNQUFJRCxJQUFKLEVBQVU7QUFDTkEsSUFBQUEsSUFBSSxDQUFDQyxPQUFMLEdBQWUsS0FBZjtBQUNILEdBaEJzQixDQWtCdkI7OztBQUNBLE1BQUlwSyxVQUFVLEdBQUd3RCxPQUFPLENBQUN4RCxVQUF6Qjs7QUFDQSxNQUFJLE9BQU9BLFVBQVAsS0FBc0IsVUFBdEIsSUFDQ21LLElBQUksSUFBSUEsSUFBSSxDQUFDekosU0FBTCxLQUFtQixJQUQ1QixJQUVDSixNQUFNLElBQUlBLE1BQU0sQ0FBQ2UsSUFBUCxDQUFZLFVBQVVDLENBQVYsRUFBYTtBQUNoQyxXQUFPQSxDQUFDLENBQUNaLFNBQUYsS0FBZ0IsSUFBdkI7QUFDSCxHQUZVLENBRmYsRUFLRTtBQUNFLFFBQUl6QixNQUFNLElBQUl1RSxPQUFPLENBQUNLLE9BQXRCLEVBQStCO0FBQzNCdEQsTUFBQUEsRUFBRSxDQUFDOEosS0FBSCxDQUFTLHVEQUFUO0FBQ0gsS0FGRCxNQUdLO0FBQ0Q5SyxNQUFBQSxtQkFBbUIsQ0FBQ0QsSUFBcEIsQ0FBeUI7QUFBQ1MsUUFBQUEsR0FBRyxFQUFFQSxHQUFOO0FBQVdFLFFBQUFBLEtBQUssRUFBRUQsVUFBbEI7QUFBOEJNLFFBQUFBLE1BQU0sRUFBRUE7QUFBdEMsT0FBekI7QUFDQVAsTUFBQUEsR0FBRyxDQUFDVyxTQUFKLEdBQWdCWCxHQUFHLENBQUNtSyxVQUFKLEdBQWlCLElBQWpDO0FBQ0g7QUFDSixHQWJELE1BY0s7QUFDRDlKLElBQUFBLGlCQUFpQixDQUFDTCxHQUFELEVBQU1HLElBQU4sRUFBWUYsVUFBWixFQUF3Qm1LLElBQXhCLEVBQThCM0csT0FBTyxDQUFDbEQsTUFBdEMsRUFBOENrRCxPQUFPLENBQUNLLE9BQXRELENBQWpCO0FBQ0gsR0FwQ3NCLENBc0N2Qjs7O0FBQ0EsTUFBSXlHLE9BQU8sR0FBRzlHLE9BQU8sQ0FBQzhHLE9BQXRCOztBQUNBLE1BQUlBLE9BQUosRUFBYTtBQUNULFFBQUlDLGNBQUo7O0FBQ0EsUUFBSXRMLE1BQUosRUFBWTtBQUNSLFdBQUtzTCxjQUFMLElBQXVCRCxPQUF2QixFQUFnQztBQUM1QixZQUFJdEwsbUJBQW1CLENBQUNLLE9BQXBCLENBQTRCa0wsY0FBNUIsTUFBZ0QsQ0FBQyxDQUFyRCxFQUF3RDtBQUNwRGhLLFVBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJOLElBQWpCLEVBQXVCcUssY0FBdkIsRUFDSUEsY0FESjtBQUVIO0FBQ0o7QUFDSjs7QUFDRCxTQUFLQSxjQUFMLElBQXVCRCxPQUF2QixFQUFnQztBQUM1QnZLLE1BQUFBLEdBQUcsQ0FBQ3dLLGNBQUQsQ0FBSCxHQUFzQkQsT0FBTyxDQUFDQyxjQUFELENBQTdCO0FBQ0g7QUFDSixHQXJEc0IsQ0F1RHZCOzs7QUFDQSxPQUFLLElBQUlYLFFBQVQsSUFBcUJwRyxPQUFyQixFQUE4QjtBQUMxQixRQUFJekUsZUFBZSxDQUFDTSxPQUFoQixDQUF3QnVLLFFBQXhCLEtBQXFDLENBQXpDLEVBQTRDO0FBQ3hDO0FBQ0g7O0FBQ0QsUUFBSTdDLElBQUksR0FBR3ZELE9BQU8sQ0FBQ29HLFFBQUQsQ0FBbEI7O0FBQ0EsUUFBSSxDQUFDOUssVUFBVSxDQUFDMEwsdUJBQVgsQ0FBbUN6RCxJQUFuQyxFQUF5QzZDLFFBQXpDLEVBQW1EMUosSUFBbkQsRUFBeURILEdBQXpELEVBQThEb0ssSUFBOUQsQ0FBTCxFQUEwRTtBQUN0RTtBQUNILEtBUHlCLENBUTFCOzs7QUFDQS9MLElBQUFBLEVBQUUsQ0FBQ21HLEtBQUgsQ0FBU3hFLEdBQUcsQ0FBQ3dCLFNBQWIsRUFBd0JxSSxRQUF4QixFQUFrQzdDLElBQWxDLEVBQXdDLElBQXhDLEVBQThDLElBQTlDO0FBQ0g7O0FBR0QsTUFBSTBELE1BQU0sR0FBR2pILE9BQU8sQ0FBQ2lILE1BQXJCOztBQUNBLE1BQUlBLE1BQUosRUFBWTtBQUNSLFFBQUlyTSxFQUFFLENBQUNpSCxjQUFILENBQWtCOEUsSUFBbEIsRUFBd0I1SixFQUFFLENBQUMwRSxTQUEzQixDQUFKLEVBQTJDO0FBQ3ZDMUUsTUFBQUEsRUFBRSxDQUFDMEUsU0FBSCxDQUFheUYsb0JBQWIsQ0FBa0MzSyxHQUFsQyxFQUF1QzBLLE1BQXZDO0FBQ0gsS0FGRCxNQUdLLElBQUl4TCxNQUFKLEVBQVk7QUFDYnNCLE1BQUFBLEVBQUUsQ0FBQzBELE1BQUgsQ0FBVSxJQUFWLEVBQWdCL0QsSUFBaEI7QUFDSDtBQUNKOztBQUVELFNBQU9ILEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O0FBUUFvQixPQUFPLENBQUM0QyxVQUFSLEdBQXFCLFVBQVVhLFdBQVYsRUFBdUI7QUFDeEMsU0FBT0EsV0FBVyxJQUNYQSxXQUFXLENBQUNwRCxjQUFaLENBQTJCLFdBQTNCLENBRFAsQ0FEd0MsQ0FFWTtBQUN2RCxDQUhELEVBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUwsT0FBTyxDQUFDd0osV0FBUixHQUFzQixVQUFVL0osU0FBVixFQUFxQmdFLFdBQXJCLEVBQWtDZ0csa0JBQWxDLEVBQXNEO0FBQ3hFeE0sRUFBQUEsRUFBRSxDQUFDMkcsWUFBSCxDQUFnQm5FLFNBQWhCLEVBQTJCZ0UsV0FBM0IsRUFEd0UsQ0FFeEU7O0FBQ0EsTUFBSTNFLEtBQUssR0FBRzJFLFdBQVcsQ0FBQ2xFLFNBQVosR0FBd0JrRSxXQUFXLENBQUNzRixVQUFaLEdBQXlCM0gsTUFBTSxDQUFDc0ksSUFBUCxDQUFZRCxrQkFBWixDQUE3RDtBQUNBLE1BQUloRSxLQUFLLEdBQUdoSSxJQUFJLENBQUMrRixhQUFMLENBQW1CQyxXQUFuQixDQUFaOztBQUNBLE9BQUssSUFBSS9FLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdJLEtBQUssQ0FBQ0gsTUFBMUIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsUUFBSWlMLEdBQUcsR0FBRzdLLEtBQUssQ0FBQ0osQ0FBRCxDQUFmO0FBQ0ErRyxJQUFBQSxLQUFLLENBQUNrRSxHQUFHLEdBQUdqTSxTQUFOLEdBQWtCLFNBQW5CLENBQUwsR0FBcUMsS0FBckM7QUFDQStILElBQUFBLEtBQUssQ0FBQ2tFLEdBQUcsR0FBR2pNLFNBQU4sR0FBa0IsU0FBbkIsQ0FBTCxHQUFxQytMLGtCQUFrQixDQUFDRSxHQUFELENBQXZEO0FBQ0g7QUFDSixDQVZEOztBQVlBM0osT0FBTyxDQUFDdkMsSUFBUixHQUFlQSxJQUFmO0FBQ0F1QyxPQUFPLENBQUM0SixJQUFSLEdBQWVuTSxJQUFJLENBQUNtTSxJQUFwQjtBQUVBOzs7Ozs7O0FBTUE1SixPQUFPLENBQUNDLG1CQUFSLEdBQThCLFVBQVU0SixLQUFWLEVBQWlCO0FBQzNDLE1BQUlDLEtBQUssR0FBRyxFQUFaOztBQUNBLFdBQVM7QUFDTEQsSUFBQUEsS0FBSyxHQUFHNU0sRUFBRSxDQUFDOE0sUUFBSCxDQUFZRixLQUFaLENBQVI7O0FBQ0EsUUFBSSxDQUFDQSxLQUFMLEVBQVk7QUFDUjtBQUNIOztBQUNELFFBQUlBLEtBQUssS0FBS3pJLE1BQWQsRUFBc0I7QUFDbEIwSSxNQUFBQSxLQUFLLENBQUMzTCxJQUFOLENBQVcwTCxLQUFYO0FBQ0g7QUFDSjs7QUFDRCxTQUFPQyxLQUFQO0FBQ0gsQ0FaRDs7QUFjQSxJQUFJRSxjQUFjLEdBQUc7QUFDakI7QUFDQTtBQUNBQyxFQUFBQSxPQUFPLEVBQUUsUUFIUTtBQUlqQjtBQUNBQyxFQUFBQSxLQUFLLEVBQUUsUUFMVTtBQU1qQkMsRUFBQUEsT0FBTyxFQUFFLFNBTlE7QUFPakJDLEVBQUFBLE1BQU0sRUFBRTtBQVBTLENBQXJCO0FBU0EsSUFBSXhKLGVBQWUsR0FBRyxFQUF0Qjs7QUFDQSxTQUFTTCxlQUFULENBQTBCM0IsR0FBMUIsRUFBK0J5TCxVQUEvQixFQUEyQzVLLFNBQTNDLEVBQXNEQyxRQUF0RCxFQUFnRTRLLFlBQWhFLEVBQThFO0FBQzFFLE1BQUlDLFFBQVEsR0FBR3pNLE1BQU0sR0FBRyw4QkFBSCxHQUFvQyxFQUF6RDtBQUVBLE1BQUkySCxLQUFLLEdBQUcsSUFBWjtBQUNBLE1BQUkrRSxjQUFjLEdBQUcsRUFBckI7O0FBQ0EsV0FBU0MsU0FBVCxHQUFzQjtBQUNsQkQsSUFBQUEsY0FBYyxHQUFHOUssUUFBUSxHQUFHaEMsU0FBNUI7QUFDQSxXQUFPK0gsS0FBSyxHQUFHaEksSUFBSSxDQUFDK0YsYUFBTCxDQUFtQjVFLEdBQW5CLENBQWY7QUFDSDs7QUFFRCxNQUFLNEIsU0FBUyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsU0FBdEIsSUFBb0NDLE9BQXhDLEVBQWlEO0FBQzdDQyxJQUFBQSxlQUFlLENBQUNqQyxNQUFoQixHQUF5QixDQUF6QjtBQUNIOztBQUVELE1BQUlzRyxJQUFJLEdBQUdvRixVQUFVLENBQUNwRixJQUF0Qjs7QUFDQSxNQUFJQSxJQUFKLEVBQVU7QUFDTixRQUFJeUYsYUFBYSxHQUFHVixjQUFjLENBQUMvRSxJQUFELENBQWxDOztBQUNBLFFBQUl5RixhQUFKLEVBQW1CO0FBQ2YsT0FBQ2pGLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxNQUF4QyxJQUFrRHZGLElBQWxEOztBQUNBLFVBQUksQ0FBRXpFLFNBQVMsSUFBSSxDQUFDQyxNQUFNLENBQUNDLFNBQXRCLElBQW9DQyxPQUFyQyxLQUFpRCxDQUFDMEosVUFBVSxDQUFDTSxNQUFqRSxFQUF5RTtBQUNyRS9KLFFBQUFBLGVBQWUsQ0FBQ3pDLElBQWhCLENBQXFCVixJQUFJLENBQUNtTixpQkFBTCxDQUF1QkYsYUFBdkIsRUFBc0MsUUFBUXpGLElBQTlDLENBQXJCO0FBQ0g7QUFDSixLQUxELE1BTUssSUFBSUEsSUFBSSxLQUFLLFFBQWIsRUFBdUI7QUFDeEIsVUFBSW5ILE1BQUosRUFBWTtBQUNSc0IsUUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQkksU0FBakIsRUFBNEJDLFFBQTVCO0FBQ0g7QUFDSixLQUpJLE1BS0E7QUFDRCxVQUFJdUYsSUFBSSxLQUFLeEgsSUFBSSxDQUFDb04sVUFBbEIsRUFBOEI7QUFDMUIsU0FBQ3BGLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxNQUF4QyxJQUFrRCxRQUFsRDtBQUNBL0UsUUFBQUEsS0FBSyxDQUFDK0UsY0FBYyxHQUFHLE1BQWxCLENBQUwsR0FBaUNwTCxFQUFFLENBQUMwTCxXQUFwQztBQUNILE9BSEQsTUFJSztBQUNELFlBQUksT0FBTzdGLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDMUIsY0FBSTlILElBQUksQ0FBQzROLE1BQUwsQ0FBWTlGLElBQVosQ0FBSixFQUF1QjtBQUNuQixhQUFDUSxLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsTUFBeEMsSUFBa0QsTUFBbEQ7QUFDQS9FLFlBQUFBLEtBQUssQ0FBQytFLGNBQWMsR0FBRyxVQUFsQixDQUFMLEdBQXFDck4sSUFBSSxDQUFDNk4sT0FBTCxDQUFhL0YsSUFBYixDQUFyQztBQUNILFdBSEQsTUFJSyxJQUFJbkgsTUFBSixFQUFZO0FBQ2JzQixZQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQixFQUE0QkMsUUFBNUIsRUFBc0N1RixJQUF0QztBQUNIO0FBQ0osU0FSRCxNQVNLLElBQUksT0FBT0EsSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUNqQyxXQUFDUSxLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsTUFBeEMsSUFBa0QsUUFBbEQ7QUFDQS9FLFVBQUFBLEtBQUssQ0FBQytFLGNBQWMsR0FBRyxNQUFsQixDQUFMLEdBQWlDdkYsSUFBakM7O0FBQ0EsY0FBSSxDQUFFekUsU0FBUyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsU0FBdEIsSUFBb0NDLE9BQXJDLEtBQWlELENBQUMwSixVQUFVLENBQUNNLE1BQWpFLEVBQXlFO0FBQ3JFL0osWUFBQUEsZUFBZSxDQUFDekMsSUFBaEIsQ0FBcUJrTSxVQUFVLENBQUNZLEdBQVgsR0FBaUJ4TixJQUFJLENBQUNtTixpQkFBTCxDQUF1QixRQUF2QixFQUFpQyxXQUFqQyxDQUFqQixHQUFpRW5OLElBQUksQ0FBQ3lOLG9CQUFMLENBQTBCakcsSUFBMUIsQ0FBdEY7QUFDSDtBQUNKLFNBTkksTUFPQSxJQUFJbkgsTUFBSixFQUFZO0FBQ2JzQixVQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQixFQUE0QkMsUUFBNUIsRUFBc0N1RixJQUF0QztBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUVELFdBQVNrRyxlQUFULENBQTBCQyxRQUExQixFQUFvQ0MsVUFBcEMsRUFBZ0Q7QUFDNUMsUUFBSUQsUUFBUSxJQUFJZixVQUFoQixFQUE0QjtBQUN4QixVQUFJMUssR0FBRyxHQUFHMEssVUFBVSxDQUFDZSxRQUFELENBQXBCOztBQUNBLFVBQUksT0FBT3pMLEdBQVAsS0FBZTBMLFVBQW5CLEVBQStCO0FBQzNCLFNBQUM1RixLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUdZLFFBQXhDLElBQW9EekwsR0FBcEQ7QUFDSCxPQUZELE1BR0ssSUFBSTdCLE1BQUosRUFBWTtBQUNic0IsUUFBQUEsRUFBRSxDQUFDOEosS0FBSCxDQUFTcUIsUUFBVCxFQUFtQmEsUUFBbkIsRUFBNkIzTCxTQUE3QixFQUF3Q0MsUUFBeEMsRUFBa0QyTCxVQUFsRDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxNQUFJaEIsVUFBVSxDQUFDaUIsVUFBZixFQUEyQjtBQUN2QixRQUFJeE4sTUFBTSxJQUFJd00sWUFBZCxFQUE0QjtBQUN4QmxMLE1BQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUIsWUFBakIsRUFBK0JOLElBQS9CLEVBQXFDVyxRQUFyQztBQUNILEtBRkQsTUFHSztBQUNELE9BQUMrRixLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsWUFBeEMsSUFBd0QsSUFBeEQ7QUFDSDtBQUNKLEdBNUV5RSxDQTZFMUU7OztBQUNBLE1BQUkxTSxNQUFKLEVBQVk7QUFDUnFOLElBQUFBLGVBQWUsQ0FBQyxhQUFELEVBQWdCLFFBQWhCLENBQWY7QUFDQUEsSUFBQUEsZUFBZSxDQUFDLFdBQUQsRUFBYyxTQUFkLENBQWY7O0FBQ0EsUUFBSWQsVUFBVSxDQUFDa0IsUUFBZixFQUF5QjtBQUNyQixPQUFDOUYsS0FBSyxJQUFJZ0YsU0FBUyxFQUFuQixFQUF1QkQsY0FBYyxHQUFHLFVBQXhDLElBQXNELElBQXREO0FBQ0g7O0FBQ0RXLElBQUFBLGVBQWUsQ0FBQyxTQUFELEVBQVksUUFBWixDQUFmO0FBQ0FBLElBQUFBLGVBQWUsQ0FBQyxPQUFELEVBQVUsU0FBVixDQUFmO0FBQ0g7O0FBRUQsTUFBSWQsVUFBVSxDQUFDWSxHQUFmLEVBQW9CO0FBQ2hCLEtBQUN4RixLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsZ0JBQXhDLElBQTRELElBQTVEO0FBQ0g7O0FBQ0QsTUFBSUgsVUFBVSxDQUFDbUIsWUFBWCxLQUE0QixLQUFoQyxFQUF1QztBQUNuQyxRQUFJMU4sTUFBTSxJQUFJd00sWUFBZCxFQUE0QjtBQUN4QmxMLE1BQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUIsY0FBakIsRUFBaUNOLElBQWpDLEVBQXVDVyxRQUF2QztBQUNILEtBRkQsTUFHSztBQUNELE9BQUMrRixLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsY0FBeEMsSUFBMEQsS0FBMUQ7QUFDSDtBQUNKOztBQUNEVyxFQUFBQSxlQUFlLENBQUMsc0JBQUQsRUFBeUIsUUFBekIsQ0FBZjs7QUFFQSxNQUFJM0ssU0FBSixFQUFlO0FBQ1gySyxJQUFBQSxlQUFlLENBQUMsV0FBRCxFQUFjLFFBQWQsQ0FBZjs7QUFFQSxRQUFJLGdCQUFnQmQsVUFBcEIsRUFBZ0M7QUFDNUIsT0FBQzVFLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxZQUF4QyxJQUF3RCxDQUFDLENBQUNILFVBQVUsQ0FBQ29CLFVBQXJFO0FBQ0g7QUFDSjs7QUFFRCxNQUFJM04sTUFBSixFQUFZO0FBQ1IsUUFBSTROLE9BQU8sR0FBR3JCLFVBQVUsQ0FBQ3FCLE9BQXpCOztBQUNBLFFBQUksT0FBT0EsT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNoQyxVQUFJLENBQUNBLE9BQUwsRUFBYztBQUNWLFNBQUNqRyxLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsU0FBeEMsSUFBcUQsS0FBckQ7QUFDSCxPQUZELE1BR0ssSUFBSSxPQUFPa0IsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNwQyxTQUFDakcsS0FBSyxJQUFJZ0YsU0FBUyxFQUFuQixFQUF1QkQsY0FBYyxHQUFHLFNBQXhDLElBQXFEa0IsT0FBckQ7QUFDSDtBQUNKLEtBUEQsTUFRSztBQUNELFVBQUlDLFlBQVksR0FBSWpNLFFBQVEsQ0FBQ2tNLFVBQVQsQ0FBb0IsQ0FBcEIsTUFBMkIsRUFBL0M7O0FBQ0EsVUFBSUQsWUFBSixFQUFrQjtBQUNkLFNBQUNsRyxLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsU0FBeEMsSUFBcUQsS0FBckQ7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsTUFBSXFCLEtBQUssR0FBR3hCLFVBQVUsQ0FBQ3dCLEtBQXZCOztBQUNBLE1BQUlBLEtBQUosRUFBVztBQUNQLFFBQUkvTCxLQUFLLENBQUNDLE9BQU4sQ0FBYzhMLEtBQWQsQ0FBSixFQUEwQjtBQUN0QixVQUFJQSxLQUFLLENBQUNsTixNQUFOLElBQWdCLENBQXBCLEVBQXVCO0FBQ25CLFNBQUM4RyxLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsS0FBeEMsSUFBaURxQixLQUFLLENBQUMsQ0FBRCxDQUF0RDtBQUNBcEcsUUFBQUEsS0FBSyxDQUFDK0UsY0FBYyxHQUFHLEtBQWxCLENBQUwsR0FBZ0NxQixLQUFLLENBQUMsQ0FBRCxDQUFyQzs7QUFDQSxZQUFJQSxLQUFLLENBQUNsTixNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDbEI4RyxVQUFBQSxLQUFLLENBQUMrRSxjQUFjLEdBQUcsTUFBbEIsQ0FBTCxHQUFpQ3FCLEtBQUssQ0FBQyxDQUFELENBQXRDO0FBQ0g7QUFDSixPQU5ELE1BT0ssSUFBSS9OLE1BQUosRUFBWTtBQUNic0IsUUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWDtBQUNIO0FBQ0osS0FYRCxNQVlLLElBQUl2QixNQUFKLEVBQVk7QUFDYnNCLE1BQUFBLEVBQUUsQ0FBQzhKLEtBQUgsQ0FBU3FCLFFBQVQsRUFBbUIsT0FBbkIsRUFBNEI5SyxTQUE1QixFQUF1Q0MsUUFBdkMsRUFBaUQsT0FBakQ7QUFDSDtBQUNKOztBQUNEeUwsRUFBQUEsZUFBZSxDQUFDLEtBQUQsRUFBUSxRQUFSLENBQWY7QUFDQUEsRUFBQUEsZUFBZSxDQUFDLEtBQUQsRUFBUSxRQUFSLENBQWY7QUFDQUEsRUFBQUEsZUFBZSxDQUFDLE1BQUQsRUFBUyxRQUFULENBQWY7QUFDSDs7QUFFRC9MLEVBQUUsQ0FBQ21JLEtBQUgsR0FBV3ZILE9BQVg7QUFFQThMLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiaE0sRUFBQUEsT0FBTyxFQUFFLGlCQUFVeUIsVUFBVixFQUFzQjtBQUMzQkEsSUFBQUEsVUFBVSxHQUFHRCxVQUFVLENBQUNDLFVBQUQsQ0FBdkI7QUFDQSxXQUFPMUIsS0FBSyxDQUFDQyxPQUFOLENBQWN5QixVQUFkLENBQVA7QUFDSCxHQUpZO0FBS2J3SyxFQUFBQSxVQUFVLEVBQUVoTSxPQUFPLENBQUN3SixXQUxQO0FBTWJ5QyxFQUFBQSxtQkFBbUIsRUFBRXBGLGNBQWMsSUFBSTlCLHNCQU4xQjtBQU9iZ0IsRUFBQUEsYUFBYSxFQUFiQSxhQVBhO0FBUWJYLEVBQUFBLFdBQVcsRUFBWEEsV0FSYTtBQVNiN0QsRUFBQUEsVUFBVSxFQUFFQTtBQVRDLENBQWpCOztBQVlBLElBQUlaLE9BQUosRUFBYTtBQUNUMUQsRUFBQUEsRUFBRSxDQUFDc0csS0FBSCxDQUFTdkQsT0FBVCxFQUFrQjhMLE1BQU0sQ0FBQ0MsT0FBekI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gcmVxdWlyZSgnLi9qcycpO1xudmFyIEVudW0gPSByZXF1aXJlKCcuL0NDRW51bScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIF9pc1BsYWluRW1wdHlPYmpfREVWID0gdXRpbHMuaXNQbGFpbkVtcHR5T2JqX0RFVjtcbnZhciBfY2xvbmVhYmxlX0RFViA9IHV0aWxzLmNsb25lYWJsZV9ERVY7XG52YXIgQXR0ciA9IHJlcXVpcmUoJy4vYXR0cmlidXRlJyk7XG52YXIgREVMSU1FVEVSID0gQXR0ci5ERUxJTUVURVI7XG52YXIgcHJlcHJvY2VzcyA9IHJlcXVpcmUoJy4vcHJlcHJvY2Vzcy1jbGFzcycpO1xucmVxdWlyZSgnLi9yZXF1aXJpbmctZnJhbWUnKTtcblxudmFyIEJVSUxUSU5fRU5UUklFUyA9IFsnbmFtZScsICdleHRlbmRzJywgJ21peGlucycsICdjdG9yJywgJ19fY3Rvcl9fJywgJ3Byb3BlcnRpZXMnLCAnc3RhdGljcycsICdlZGl0b3InLCAnX19FUzZfXyddO1xuXG52YXIgSU5WQUxJRF9TVEFUSUNTX0RFViA9IENDX0RFViAmJiBbJ25hbWUnLCAnX19jdG9yc19fJywgJ19fcHJvcHNfXycsICdhcmd1bWVudHMnLCAnY2FsbCcsICdhcHBseScsICdjYWxsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAnbGVuZ3RoJywgJ3Byb3RvdHlwZSddO1xuXG5mdW5jdGlvbiBwdXNoVW5pcXVlIChhcnJheSwgaXRlbSkge1xuICAgIGlmIChhcnJheS5pbmRleE9mKGl0ZW0pIDwgMCkge1xuICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgIH1cbn1cblxudmFyIGRlZmVycmVkSW5pdGlhbGl6ZXIgPSB7XG5cbiAgICAvLyBDb25maWdzIGZvciBjbGFzc2VzIHdoaWNoIG5lZWRzIGRlZmVycmVkIGluaXRpYWxpemF0aW9uXG4gICAgZGF0YXM6IG51bGwsXG5cbiAgICAvLyByZWdpc3RlciBuZXcgY2xhc3NcbiAgICAvLyBkYXRhIC0ge2NsczogY2xzLCBjYjogcHJvcGVydGllcywgbWl4aW5zOiBvcHRpb25zLm1peGluc31cbiAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5kYXRhcykge1xuICAgICAgICAgICAgdGhpcy5kYXRhcy5wdXNoKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRhcyA9IFtkYXRhXTtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGEgbmV3IHRpbWVyIHRvIGluaXRpYWxpemVcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YXMgPSB0aGlzLmRhdGFzO1xuICAgICAgICBpZiAoZGF0YXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGRhdGFzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjbHMgPSBkYXRhLmNscztcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IGRhdGEucHJvcHM7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0ganMuZ2V0Q2xhc3NOYW1lKGNscyk7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyZVByb3BlcnRpZXMoY2xzLCBuYW1lLCBwcm9wZXJ0aWVzLCBjbHMuJHN1cGVyLCBkYXRhLm1peGlucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MzMsIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGF0YXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gYm90aCBnZXR0ZXIgYW5kIHByb3AgbXVzdCByZWdpc3RlciB0aGUgbmFtZSBpbnRvIF9fcHJvcHNfXyBhcnJheVxuZnVuY3Rpb24gYXBwZW5kUHJvcCAoY2xzLCBuYW1lKSB7XG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICAvL2lmICghSURFTlRJRklFUl9SRS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIC8vICAgIGNjLmVycm9yKCdUaGUgcHJvcGVydHkgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGlzIG5vdCBjb21wbGlhbnQgd2l0aCBKYXZhU2NyaXB0IG5hbWluZyBzdGFuZGFyZHMnKTtcbiAgICAgICAgLy8gICAgcmV0dXJuO1xuICAgICAgICAvL31cbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdXNoVW5pcXVlKGNscy5fX3Byb3BzX18sIG5hbWUpO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVQcm9wIChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KSB7XG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9IHZhbC5kZWZhdWx0O1xuXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICBpZiAoIWVzNikge1xuICAgICAgICAgICAgLy8gY2hlY2sgZGVmYXVsdCBvYmplY3QgdmFsdWVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFZhbHVlID09PSAnb2JqZWN0JyAmJiBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGFycmF5IGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM1LCBjbGFzc05hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIV9pc1BsYWluRW1wdHlPYmpfREVWKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgY2xvbmVhYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmICghX2Nsb25lYWJsZV9ERVYoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM2LCBjbGFzc05hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBiYXNlIHByb3RvdHlwZSB0byBhdm9pZCBuYW1lIGNvbGxpc2lvblxuICAgICAgICBpZiAoQ0NDbGFzcy5nZXRJbmhlcml0YW5jZUNoYWluKGNscylcbiAgICAgICAgICAgICAgICAgICAuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpOyB9KSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM3LCBjbGFzc05hbWUsIHByb3BOYW1lLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2V0IGRlZmF1bHQgdmFsdWVcbiAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnZGVmYXVsdCcsIGRlZmF1bHRWYWx1ZSk7XG5cbiAgICBhcHBlbmRQcm9wKGNscywgcHJvcE5hbWUpO1xuXG4gICAgLy8gYXBwbHkgYXR0cmlidXRlc1xuICAgIHBhcnNlQXR0cmlidXRlcyhjbHMsIHZhbCwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgZmFsc2UpO1xuICAgIGlmICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb25BZnRlclByb3BzX0VULmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvbkFmdGVyUHJvcHNfRVRbaV0oY2xzLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25BZnRlclByb3BzX0VULmxlbmd0aCA9IDA7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVHZXRTZXQgKGNscywgbmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KSB7XG4gICAgdmFyIGdldHRlciA9IHZhbC5nZXQ7XG4gICAgdmFyIHNldHRlciA9IHZhbC5zZXQ7XG4gICAgdmFyIHByb3RvID0gY2xzLnByb3RvdHlwZTtcbiAgICB2YXIgZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIHByb3BOYW1lKTtcbiAgICB2YXIgc2V0dGVyVW5kZWZpbmVkID0gIWQ7XG5cbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgIWVzNiAmJiBkICYmIGQuZ2V0KSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MzgsIG5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlQXR0cmlidXRlcyhjbHMsIHZhbCwgbmFtZSwgcHJvcE5hbWUsIHRydWUpO1xuICAgICAgICBpZiAoKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgb25BZnRlclByb3BzX0VULmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnc2VyaWFsaXphYmxlJywgZmFsc2UpO1xuXG4gICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIC8vIOS4jeiuuuaYr+WQpiB2aXNpYmxlIOmDveimgea3u+WKoOWIsCBwcm9wc++8jOWQpuWImSBhc3NldCB3YXRjaGVyIOS4jeiDveato+W4uOW3peS9nFxuICAgICAgICAgICAgYXBwZW5kUHJvcChjbHMsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXM2KSB7XG4gICAgICAgICAgICBqcy5nZXQocHJvdG8sIHByb3BOYW1lLCBnZXR0ZXIsIHNldHRlclVuZGVmaW5lZCwgc2V0dGVyVW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfREVWKSB7XG4gICAgICAgICAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnaGFzR2V0dGVyJywgdHJ1ZSk7IC8vIOaWueS+vyBlZGl0b3Ig5YGa5Yik5patXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgIGlmICghZXM2KSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVWICYmIGQgJiYgZC5zZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCgzNjQwLCBuYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcy5zZXQocHJvdG8sIHByb3BOYW1lLCBzZXR0ZXIsIHNldHRlclVuZGVmaW5lZCwgc2V0dGVyVW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX0RFVikge1xuICAgICAgICAgICAgQXR0ci5zZXRDbGFzc0F0dHIoY2xzLCBwcm9wTmFtZSwgJ2hhc1NldHRlcicsIHRydWUpOyAvLyDmlrnkvr8gZWRpdG9yIOWBmuWIpOaWrVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0IChkZWZhdWx0VmFsKSB7XG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY2MuX3Rocm93KGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0VmFsO1xufVxuXG5mdW5jdGlvbiBtaXhpbldpdGhJbmhlcml0ZWQgKGRlc3QsIHNyYywgZmlsdGVyKSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBzcmMpIHtcbiAgICAgICAgaWYgKCFkZXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmICghZmlsdGVyIHx8IGZpbHRlcihwcm9wKSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0LCBwcm9wLCBqcy5nZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3JjLCBwcm9wKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRvRGVmaW5lIChjbGFzc05hbWUsIGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKSB7XG4gICAgdmFyIHNob3VsZEFkZFByb3RvQ3RvcjtcbiAgICB2YXIgX19jdG9yX18gPSBvcHRpb25zLl9fY3Rvcl9fO1xuICAgIHZhciBjdG9yID0gb3B0aW9ucy5jdG9yO1xuICAgIHZhciBfX2VzNl9fID0gb3B0aW9ucy5fX0VTNl9fO1xuXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICAvLyBjaGVjayBjdG9yXG4gICAgICAgIHZhciBjdG9yVG9Vc2UgPSBfX2N0b3JfXyB8fCBjdG9yO1xuICAgICAgICBpZiAoY3RvclRvVXNlKSB7XG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5faXNDQ0NsYXNzKGN0b3JUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MTgsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgY3RvclRvVXNlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjE5LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2VDbGFzcyAmJiAvXFxicHJvdG90eXBlLmN0b3JcXGIvLnRlc3QoY3RvclRvVXNlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX19lczZfXykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjUxLCBjbGFzc05hbWUgfHwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwMCwgY2xhc3NOYW1lIHx8IFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkQWRkUHJvdG9DdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9fY3Rvcl9fKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0OSwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN0b3IgPSBvcHRpb25zLmN0b3IgPSBfdmFsaWRhdGVDdG9yX0RFVihjdG9yLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGN0b3JzO1xuICAgIHZhciBmaXJlQ2xhc3M7XG4gICAgaWYgKF9fZXM2X18pIHtcbiAgICAgICAgY3RvcnMgPSBbY3Rvcl07XG4gICAgICAgIGZpcmVDbGFzcyA9IGN0b3I7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjdG9ycyA9IF9fY3Rvcl9fID8gW19fY3Rvcl9fXSA6IF9nZXRBbGxDdG9ycyhiYXNlQ2xhc3MsIG1peGlucywgb3B0aW9ucyk7XG4gICAgICAgIGZpcmVDbGFzcyA9IF9jcmVhdGVDdG9yKGN0b3JzLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gZXh0ZW5kIC0gQ3JlYXRlIGEgbmV3IENsYXNzIHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIENsYXNzXG4gICAgICAgIGpzLnZhbHVlKGZpcmVDbGFzcywgJ2V4dGVuZCcsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zLmV4dGVuZHMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIENDQ2xhc3Mob3B0aW9ucyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgIH1cblxuICAgIGpzLnZhbHVlKGZpcmVDbGFzcywgJ19fY3RvcnNfXycsIGN0b3JzLmxlbmd0aCA+IDAgPyBjdG9ycyA6IG51bGwsIHRydWUpO1xuXG5cbiAgICB2YXIgcHJvdG90eXBlID0gZmlyZUNsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoYmFzZUNsYXNzKSB7XG4gICAgICAgIGlmICghX19lczZfXykge1xuICAgICAgICAgICAganMuZXh0ZW5kKGZpcmVDbGFzcywgYmFzZUNsYXNzKTsgICAgICAgIC8vIOi/memHjOS8muaKiueItuexu+eahCBfX3Byb3BzX18g5aSN5Yi257uZ5a2Q57G7XG4gICAgICAgICAgICBwcm90b3R5cGUgPSBmaXJlQ2xhc3MucHJvdG90eXBlOyAgICAgICAgLy8gZ2V0IGV4dGVuZGVkIHByb3RvdHlwZVxuICAgICAgICB9XG4gICAgICAgIGZpcmVDbGFzcy4kc3VwZXIgPSBiYXNlQ2xhc3M7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgc2hvdWxkQWRkUHJvdG9DdG9yKSB7XG4gICAgICAgICAgICBwcm90b3R5cGUuY3RvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1peGlucykge1xuICAgICAgICBmb3IgKHZhciBtID0gbWl4aW5zLmxlbmd0aCAtIDE7IG0gPj0gMDsgbS0tKSB7XG4gICAgICAgICAgICB2YXIgbWl4aW4gPSBtaXhpbnNbbV07XG4gICAgICAgICAgICBtaXhpbldpdGhJbmhlcml0ZWQocHJvdG90eXBlLCBtaXhpbi5wcm90b3R5cGUpO1xuXG4gICAgICAgICAgICAvLyBtaXhpbiBzdGF0aWNzICh0aGlzIHdpbGwgYWxzbyBjb3B5IGVkaXRvciBhdHRyaWJ1dGVzIGZvciBjb21wb25lbnQpXG4gICAgICAgICAgICBtaXhpbldpdGhJbmhlcml0ZWQoZmlyZUNsYXNzLCBtaXhpbiwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWl4aW4uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFDQ19ERVYgfHwgSU5WQUxJRF9TVEFUSUNTX0RFVi5pbmRleE9mKHByb3ApIDwgMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gbWl4aW4gYXR0cmlidXRlc1xuICAgICAgICAgICAgaWYgKENDQ2xhc3MuX2lzQ0NDbGFzcyhtaXhpbikpIHtcbiAgICAgICAgICAgICAgICBtaXhpbldpdGhJbmhlcml0ZWQoQXR0ci5nZXRDbGFzc0F0dHJzKGZpcmVDbGFzcyksIEF0dHIuZ2V0Q2xhc3NBdHRycyhtaXhpbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlc3RvcmUgY29uc3R1Y3RvciBvdmVycmlkZGVuIGJ5IG1peGluXG4gICAgICAgIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZpcmVDbGFzcztcbiAgICB9XG5cbiAgICBpZiAoIV9fZXM2X18pIHtcbiAgICAgICAgcHJvdG90eXBlLl9faW5pdFByb3BzX18gPSBjb21waWxlUHJvcHM7XG4gICAgfVxuXG4gICAganMuc2V0Q2xhc3NOYW1lKGNsYXNzTmFtZSwgZmlyZUNsYXNzKTtcbiAgICByZXR1cm4gZmlyZUNsYXNzO1xufVxuXG5mdW5jdGlvbiBkZWZpbmUgKGNsYXNzTmFtZSwgYmFzZUNsYXNzLCBtaXhpbnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgQ29tcG9uZW50ID0gY2MuQ29tcG9uZW50O1xuICAgIHZhciBmcmFtZSA9IGNjLl9SRi5wZWVrKCk7XG4gICAgaWYgKGZyYW1lICYmIGpzLmlzQ2hpbGRDbGFzc09mKGJhc2VDbGFzcywgQ29tcG9uZW50KSkge1xuICAgICAgICAvLyBwcm9qZWN0IGNvbXBvbmVudFxuICAgICAgICBpZiAoanMuaXNDaGlsZENsYXNzT2YoZnJhbWUuY2xzLCBDb21wb25lbnQpKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MTUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKENDX0RFViAmJiBmcmFtZS51dWlkICYmIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM2MTYsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lIHx8IGZyYW1lLnNjcmlwdDtcbiAgICB9XG5cbiAgICB2YXIgY2xzID0gZG9EZWZpbmUoY2xhc3NOYW1lLCBiYXNlQ2xhc3MsIG1peGlucywgb3B0aW9ucyk7XG5cbiAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgaWYgKGpzLmlzQ2hpbGRDbGFzc09mKGJhc2VDbGFzcywgQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgdmFyIHV1aWQgPSBmcmFtZS51dWlkO1xuICAgICAgICAgICAgaWYgKHV1aWQpIHtcbiAgICAgICAgICAgICAgICBqcy5fc2V0Q2xhc3NJZCh1dWlkLCBjbHMpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50Ll9hZGRNZW51SXRlbShjbHMsICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQuc2NyaXB0cy8nICsgY2xhc3NOYW1lLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGNscy5wcm90b3R5cGUuX19zY3JpcHRVdWlkID0gRWRpdG9yLlV0aWxzLlV1aWRVdGlscy5kZWNvbXByZXNzVXVpZCh1dWlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmFtZS5jbHMgPSBjbHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWpzLmlzQ2hpbGRDbGFzc09mKGZyYW1lLmNscywgQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgZnJhbWUuY2xzID0gY2xzO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbHM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNsYXNzTmFtZV9ERVYgKGNsYXNzTmFtZSkge1xuICAgIHZhciBEZWZhdWx0TmFtZSA9ICdDQ0NsYXNzJztcbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC9eW14kQS1aYS16X10vLCAnXycpLnJlcGxhY2UoL1teMC05QS1aYS16XyRdL2csICdfJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSBuYW1lXG4gICAgICAgICAgICBGdW5jdGlvbignZnVuY3Rpb24gJyArIGNsYXNzTmFtZSArICcoKXt9JykoKTtcbiAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gRGVmYXVsdE5hbWU7XG59XG5cbmZ1bmN0aW9uIGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQgKHZhbHVlKSB7XG4gICAgdmFyIGNsc05hbWUgPSBqcy5nZXRDbGFzc05hbWUodmFsdWUpO1xuICAgIHZhciB0eXBlID0gdmFsdWUuY29uc3RydWN0b3I7XG4gICAgdmFyIHJlcyA9ICduZXcgJyArIGNsc05hbWUgKyAnKCc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlLl9fcHJvcHNfXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvcCA9IHR5cGUuX19wcm9wc19fW2ldO1xuICAgICAgICB2YXIgcHJvcFZhbCA9IHZhbHVlW3Byb3BdO1xuICAgICAgICBpZiAoQ0NfREVWICYmIHR5cGVvZiBwcm9wVmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQxLCBjbHNOYW1lKTtcbiAgICAgICAgICAgIHJldHVybiAnbmV3ICcgKyBjbHNOYW1lICsgJygpJztcbiAgICAgICAgfVxuICAgICAgICByZXMgKz0gcHJvcFZhbDtcbiAgICAgICAgaWYgKGkgPCB0eXBlLl9fcHJvcHNfXy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICByZXMgKz0gJywnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXMgKyAnKSc7XG59XG5cbi8vIFRPRE8gLSBtb3ZlIGVzY2FwZUZvckpTLCBJREVOVElGSUVSX1JFLCBnZXROZXdWYWx1ZVR5cGVDb2RlSml0IHRvIG1pc2MuanMgb3IgYSBuZXcgc291cmNlIGZpbGVcblxuLy8gY29udmVydCBhIG5vcm1hbCBzdHJpbmcgaW5jbHVkaW5nIG5ld2xpbmVzLCBxdW90ZXMgYW5kIHVuaWNvZGUgY2hhcmFjdGVycyBpbnRvIGEgc3RyaW5nIGxpdGVyYWxcbi8vIHJlYWR5IHRvIHVzZSBpbiBKYXZhU2NyaXB0IHNvdXJjZVxuZnVuY3Rpb24gZXNjYXBlRm9ySlMgKHMpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocykuXG4gICAgICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9KU09OL3N0cmluZ2lmeVxuICAgICAgICByZXBsYWNlKC9cXHUyMDI4L2csICdcXFxcdTIwMjgnKS5cbiAgICAgICAgcmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5Jyk7XG59XG5cbmZ1bmN0aW9uIGdldEluaXRQcm9wc0ppdCAoYXR0cnMsIHByb3BMaXN0KSB7XG4gICAgLy8gZnVuY3Rpb25zIGZvciBnZW5lcmF0ZWQgY29kZVxuICAgIHZhciBGID0gW107XG4gICAgdmFyIGZ1bmMgPSAnJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wTGlzdFtpXTtcbiAgICAgICAgdmFyIGF0dHJLZXkgPSBwcm9wICsgREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICBpZiAoYXR0cktleSBpbiBhdHRycykgeyAgLy8gZ2V0dGVyIGRvZXMgbm90IGhhdmUgZGVmYXVsdFxuICAgICAgICAgICAgdmFyIHN0YXRlbWVudDtcbiAgICAgICAgICAgIGlmIChJREVOVElGSUVSX1JFLnRlc3QocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSAndGhpcy4nICsgcHJvcCArICc9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICd0aGlzWycgKyBlc2NhcGVGb3JKUyhwcm9wKSArICddPSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHZhciBkZWYgPSBhdHRyc1thdHRyS2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmID09PSAnb2JqZWN0JyAmJiBkZWYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVmIGluc3RhbmNlb2YgY2MuVmFsdWVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBnZXROZXdWYWx1ZVR5cGVDb2RlSml0KGRlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGVmKSkge1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJ1tdJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAne30nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBGLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBGLnB1c2goZGVmKTtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJ0ZbJyArIGluZGV4ICsgJ10oKSc7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmdW5jICs9ICd0cnkge1xcbicgKyBzdGF0ZW1lbnQgKyBleHByZXNzaW9uICsgJztcXG59XFxuY2F0Y2goZSkge1xcbmNjLl90aHJvdyhlKTtcXG4nICsgc3RhdGVtZW50ICsgJ3VuZGVmaW5lZDtcXG59XFxuJztcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXNjYXBlRm9ySlMoZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG51bWJlciwgYm9vbGVhbiwgbnVsbCwgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGRlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCA9IHN0YXRlbWVudCArIGV4cHJlc3Npb24gKyAnO1xcbic7XG4gICAgICAgICAgICBmdW5jICs9IHN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChDQ19URVNUICYmICFpc1BoYW50b21KUykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhmdW5jKTtcbiAgICAvLyB9XG5cbiAgICB2YXIgaW5pdFByb3BzO1xuICAgIGlmIChGLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbml0UHJvcHMgPSBGdW5jdGlvbihmdW5jKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGluaXRQcm9wcyA9IEZ1bmN0aW9uKCdGJywgJ3JldHVybiAoZnVuY3Rpb24oKXtcXG4nICsgZnVuYyArICd9KScpKEYpO1xuICAgIH1cblxuICAgIHJldHVybiBpbml0UHJvcHM7XG59XG5cbmZ1bmN0aW9uIGdldEluaXRQcm9wcyAoYXR0cnMsIHByb3BMaXN0KSB7XG4gICAgdmFyIGFkdmFuY2VkUHJvcHMgPSBbXTtcbiAgICB2YXIgYWR2YW5jZWRWYWx1ZXMgPSBbXTtcbiAgICB2YXIgc2ltcGxlUHJvcHMgPSBbXTtcbiAgICB2YXIgc2ltcGxlVmFsdWVzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBwcm9wID0gcHJvcExpc3RbaV07XG4gICAgICAgIHZhciBhdHRyS2V5ID0gcHJvcCArIERFTElNRVRFUiArICdkZWZhdWx0JztcbiAgICAgICAgaWYgKGF0dHJLZXkgaW4gYXR0cnMpIHsgLy8gZ2V0dGVyIGRvZXMgbm90IGhhdmUgZGVmYXVsdFxuICAgICAgICAgICAgdmFyIGRlZiA9IGF0dHJzW2F0dHJLZXldO1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgZGVmID09PSAnb2JqZWN0JyAmJiBkZWYpIHx8IHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBhZHZhbmNlZFByb3BzLnB1c2gocHJvcCk7XG4gICAgICAgICAgICAgICAgYWR2YW5jZWRWYWx1ZXMucHVzaChkZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbnVtYmVyLCBib29sZWFuLCBudWxsLCB1bmRlZmluZWQsIHN0cmluZ1xuICAgICAgICAgICAgICAgIHNpbXBsZVByb3BzLnB1c2gocHJvcCk7XG4gICAgICAgICAgICAgICAgc2ltcGxlVmFsdWVzLnB1c2goZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltcGxlUHJvcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRoaXNbc2ltcGxlUHJvcHNbaV1dID0gc2ltcGxlVmFsdWVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWR2YW5jZWRQcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByb3AgPSBhZHZhbmNlZFByb3BzW2ldO1xuICAgICAgICAgICAgdmFyIGV4cHJlc3Npb247XG4gICAgICAgICAgICB2YXIgZGVmID0gYWR2YW5jZWRWYWx1ZXNbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVmIGluc3RhbmNlb2YgY2MuVmFsdWVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBkZWYuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWYgaXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZGVmKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuX3Rocm93KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBkZWYoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzW3Byb3BdID0gZXhwcmVzc2lvbjtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIHNpbXBsZSB0ZXN0IHZhcmlhYmxlIG5hbWVcbnZhciBJREVOVElGSUVSX1JFID0gL15bQS1aYS16XyRdWzAtOUEtWmEtel8kXSokLztcbmZ1bmN0aW9uIGNvbXBpbGVQcm9wcyAoYWN0dWFsQ2xhc3MpIHtcbiAgICAvLyBpbml0IGRlZmVycmVkIHByb3BlcnRpZXNcbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoYWN0dWFsQ2xhc3MpO1xuICAgIHZhciBwcm9wTGlzdCA9IGFjdHVhbENsYXNzLl9fcHJvcHNfXztcbiAgICBpZiAocHJvcExpc3QgPT09IG51bGwpIHtcbiAgICAgICAgZGVmZXJyZWRJbml0aWFsaXplci5pbml0KCk7XG4gICAgICAgIHByb3BMaXN0ID0gYWN0dWFsQ2xhc3MuX19wcm9wc19fO1xuICAgIH1cblxuICAgIC8vIE92ZXJ3aXRlIF9faW5pdFByb3BzX18gdG8gYXZvaWQgY29tcGlsZSBhZ2Fpbi5cbiAgICB2YXIgaW5pdFByb3BzID0gQ0NfU1VQUE9SVF9KSVQgPyBnZXRJbml0UHJvcHNKaXQoYXR0cnMsIHByb3BMaXN0KSA6IGdldEluaXRQcm9wcyhhdHRycywgcHJvcExpc3QpO1xuICAgIGFjdHVhbENsYXNzLnByb3RvdHlwZS5fX2luaXRQcm9wc19fID0gaW5pdFByb3BzO1xuXG4gICAgLy8gY2FsbCBpbnN0YW50aWF0ZVByb3BzIGltbWVkaWF0ZWx5LCBubyBuZWVkIHRvIHBhc3MgYWN0dWFsQ2xhc3MgaW50byBpdCBhbnltb3JlXG4gICAgLy8gKHVzZSBjYWxsIHRvIG1hbnVhbGx5IGJpbmQgYHRoaXNgIGJlY2F1c2UgYHRoaXNgIG1heSBub3QgaW5zdGFuY2VvZiBhY3R1YWxDbGFzcylcbiAgICBpbml0UHJvcHMuY2FsbCh0aGlzKTtcbn1cblxudmFyIF9jcmVhdGVDdG9yID0gQ0NfU1VQUE9SVF9KSVQgPyBmdW5jdGlvbiAoY3RvcnMsIGJhc2VDbGFzcywgY2xhc3NOYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIHN1cGVyQ2FsbEJvdW5kZWQgPSBiYXNlQ2xhc3MgJiYgYm91bmRTdXBlckNhbGxzKGJhc2VDbGFzcywgb3B0aW9ucywgY2xhc3NOYW1lKTtcblxuICAgIHZhciBjdG9yTmFtZSA9IENDX0RFViA/IG5vcm1hbGl6ZUNsYXNzTmFtZV9ERVYoY2xhc3NOYW1lKSA6ICdDQ0NsYXNzJztcbiAgICB2YXIgYm9keSA9ICdyZXR1cm4gZnVuY3Rpb24gJyArIGN0b3JOYW1lICsgJygpe1xcbic7XG5cbiAgICBpZiAoc3VwZXJDYWxsQm91bmRlZCkge1xuICAgICAgICBib2R5ICs9ICd0aGlzLl9zdXBlcj1udWxsO1xcbic7XG4gICAgfVxuXG4gICAgLy8gaW5zdGFudGlhdGUgcHJvcHNcbiAgICBib2R5ICs9ICd0aGlzLl9faW5pdFByb3BzX18oJyArIGN0b3JOYW1lICsgJyk7XFxuJztcblxuICAgIC8vIGNhbGwgdXNlciBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgY3RvckxlbiA9IGN0b3JzLmxlbmd0aDtcbiAgICBpZiAoY3RvckxlbiA+IDApIHtcbiAgICAgICAgdmFyIHVzZVRyeUNhdGNoID0gQ0NfREVWICYmICEgKGNsYXNzTmFtZSAmJiBjbGFzc05hbWUuc3RhcnRzV2l0aCgnY2MuJykpO1xuICAgICAgICBpZiAodXNlVHJ5Q2F0Y2gpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gJ3RyeXtcXG4nO1xuICAgICAgICB9XG4gICAgICAgIHZhciBTTklQUEVUID0gJ10uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xcbic7XG4gICAgICAgIGlmIChjdG9yTGVuID09PSAxKSB7XG4gICAgICAgICAgICBib2R5ICs9IGN0b3JOYW1lICsgJy5fX2N0b3JzX19bMCcgKyBTTklQUEVUO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYm9keSArPSAndmFyIGNzPScgKyBjdG9yTmFtZSArICcuX19jdG9yc19fO1xcbic7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN0b3JMZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGJvZHkgKz0gJ2NzWycgKyBpICsgU05JUFBFVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlVHJ5Q2F0Y2gpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gJ31jYXRjaChlKXtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjYy5fdGhyb3coZSk7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICd9XFxuJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBib2R5ICs9ICd9JztcblxuICAgIHJldHVybiBGdW5jdGlvbihib2R5KSgpO1xufSA6IGZ1bmN0aW9uIChjdG9ycywgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgc3VwZXJDYWxsQm91bmRlZCA9IGJhc2VDbGFzcyAmJiBib3VuZFN1cGVyQ2FsbHMoYmFzZUNsYXNzLCBvcHRpb25zLCBjbGFzc05hbWUpO1xuICAgIHZhciBjdG9yTGVuID0gY3RvcnMubGVuZ3RoO1xuXG4gICAgdmFyIENsYXNzO1xuXG4gICAgaWYgKGN0b3JMZW4gPiAwKSB7XG4gICAgICAgIGlmIChzdXBlckNhbGxCb3VuZGVkKSB7XG4gICAgICAgICAgICBpZiAoY3RvckxlbiA9PT0gMikge1xuICAgICAgICAgICAgICAgIC8vIFVzZXIgQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RvcnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY3RvckxlbiA9PT0gMykge1xuICAgICAgICAgICAgICAgIC8vIE5vZGVcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMl0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19pbml0UHJvcHNfXyhDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdG9ycyA9IENsYXNzLl9fY3RvcnNfXztcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RvcnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIENsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHN1cGVyQ2FsbEJvdW5kZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2xhc3M7XG59O1xuXG5mdW5jdGlvbiBfdmFsaWRhdGVDdG9yX0RFViAoY3RvciwgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcbiAgICBpZiAoQ0NfRURJVE9SICYmIGJhc2VDbGFzcykge1xuICAgICAgICAvLyBjaGVjayBzdXBlciBjYWxsIGluIGNvbnN0cnVjdG9yXG4gICAgICAgIHZhciBvcmlnaW5DdG9yID0gY3RvcjtcbiAgICAgICAgaWYgKFN1cGVyQ2FsbFJlZy50ZXN0KGN0b3IpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5fX0VTNl9fKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjUxLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MDAsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gc3VwcHJlc3NzIHN1cGVyIGNhbGxcbiAgICAgICAgICAgICAgICBjdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gb3JpZ2luQ3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGN0b3JcbiAgICBpZiAoY3Rvci5sZW5ndGggPiAwICYmICghY2xhc3NOYW1lIHx8ICFjbGFzc05hbWUuc3RhcnRzV2l0aCgnY2MuJykpKSB7XG4gICAgICAgIC8vIFRvIG1ha2UgYSB1bmlmaWVkIENDQ2xhc3Mgc2VyaWFsaXphdGlvbiBwcm9jZXNzLFxuICAgICAgICAvLyB3ZSBkb24ndCBhbGxvdyBwYXJhbWV0ZXJzIGZvciBjb25zdHJ1Y3RvciB3aGVuIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBDQ0NsYXNzLlxuICAgICAgICAvLyBGb3IgYWR2YW5jZWQgdXNlciwgY29uc3RydWN0IGFyZ3VtZW50cyBjYW4gc3RpbGwgZ2V0IGZyb20gJ2FyZ3VtZW50cycuXG4gICAgICAgIGNjLndhcm5JRCgzNjE3LCBjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBjdG9yO1xufVxuXG5mdW5jdGlvbiBfZ2V0QWxsQ3RvcnMgKGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKSB7XG4gICAgLy8gZ2V0IGJhc2UgdXNlciBjb25zdHJ1Y3RvcnNcbiAgICBmdW5jdGlvbiBnZXRDdG9ycyAoY2xzKSB7XG4gICAgICAgIGlmIChDQ0NsYXNzLl9pc0NDQ2xhc3MoY2xzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNscy5fX2N0b3JzX18gfHwgW107XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2Nsc107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3RvcnMgPSBbXTtcbiAgICAvLyBpZiAob3B0aW9ucy5fX0VTNl9fKSB7XG4gICAgLy8gICAgIGlmIChtaXhpbnMpIHtcbiAgICAvLyAgICAgICAgIGxldCBiYXNlT3JNaXhpbnMgPSBnZXRDdG9ycyhiYXNlQ2xhc3MpO1xuICAgIC8vICAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBtaXhpbnMubGVuZ3RoOyBiKyspIHtcbiAgICAvLyAgICAgICAgICAgICBsZXQgbWl4aW4gPSBtaXhpbnNbYl07XG4gICAgLy8gICAgICAgICAgICAgaWYgKG1peGluKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBiYXNlQ3RvcnMgPSBnZXRDdG9ycyhtaXhpbik7XG4gICAgLy8gICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYmFzZUN0b3JzLmxlbmd0aDsgYysrKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZU9yTWl4aW5zLmluZGV4T2YoYmFzZUN0b3JzW2NdKSA8IDApIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoVW5pcXVlKGN0b3JzLCBiYXNlQ3RvcnNbY10pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIC8vIGVsc2Uge1xuICAgIGxldCBiYXNlT3JNaXhpbnMgPSBbYmFzZUNsYXNzXS5jb25jYXQobWl4aW5zKTtcbiAgICBmb3IgKGxldCBiID0gMDsgYiA8IGJhc2VPck1peGlucy5sZW5ndGg7IGIrKykge1xuICAgICAgICBsZXQgYmFzZU9yTWl4aW4gPSBiYXNlT3JNaXhpbnNbYl07XG4gICAgICAgIGlmIChiYXNlT3JNaXhpbikge1xuICAgICAgICAgICAgbGV0IGJhc2VDdG9ycyA9IGdldEN0b3JzKGJhc2VPck1peGluKTtcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYmFzZUN0b3JzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgcHVzaFVuaXF1ZShjdG9ycywgYmFzZUN0b3JzW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyBhcHBlbmQgc3ViY2xhc3MgdXNlciBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgY3RvciA9IG9wdGlvbnMuY3RvcjtcbiAgICBpZiAoY3Rvcikge1xuICAgICAgICBjdG9ycy5wdXNoKGN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBjdG9ycztcbn1cblxudmFyIFN1cGVyQ2FsbFJlZyA9IC94eXovLnRlc3QoZnVuY3Rpb24oKXt4eXp9KSA/IC9cXGJcXC5fc3VwZXJcXGIvIDogLy4qLztcbnZhciBTdXBlckNhbGxSZWdTdHJpY3QgPSAveHl6Ly50ZXN0KGZ1bmN0aW9uKCl7eHl6fSkgPyAvdGhpc1xcLl9zdXBlclxccypcXCgvIDogLyhOT05FKXs5OX0vO1xuZnVuY3Rpb24gYm91bmRTdXBlckNhbGxzIChiYXNlQ2xhc3MsIG9wdGlvbnMsIGNsYXNzTmFtZSkge1xuICAgIHZhciBoYXNTdXBlckNhbGwgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBmdW5jTmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlmIChCVUlMVElOX0VOVFJJRVMuaW5kZXhPZihmdW5jTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bmMgPSBvcHRpb25zW2Z1bmNOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGQgPSBqcy5nZXRQcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUNsYXNzLnByb3RvdHlwZSwgZnVuY05hbWUpO1xuICAgICAgICBpZiAocGQpIHtcbiAgICAgICAgICAgIHZhciBzdXBlckZ1bmMgPSBwZC52YWx1ZTtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBwZC5nZXQsIGFzc3VtZSB0aGF0IGZ1bmN0aW9uIGRlZmluZWQgYnkgZ2V0dGVyIGlzIGp1c3QgZm9yIHdhcm5pbmdzXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN1cGVyRnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmIChTdXBlckNhbGxSZWcudGVzdChmdW5jKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNTdXBlckNhbGwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBib3VuZFN1cGVyQ2FsbFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2Z1bmNOYW1lXSA9IChmdW5jdGlvbiAoc3VwZXJGdW5jLCBmdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSB0aGlzLl9zdXBlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhIG5ldyAuX3N1cGVyKCkgbWV0aG9kIHRoYXQgaXMgdGhlIHNhbWUgbWV0aG9kIGJ1dCBvbiB0aGUgc3VwZXItQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHN1cGVyRnVuYztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbWV0aG9kIG9ubHkgbmVlZCB0byBiZSBib3VuZCB0ZW1wb3JhcmlseSwgc28gd2UgcmVtb3ZlIGl0IHdoZW4gd2UncmUgZG9uZSBleGVjdXRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHRtcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KShzdXBlckZ1bmMsIGZ1bmMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0NfREVWICYmIFN1cGVyQ2FsbFJlZ1N0cmljdC50ZXN0KGZ1bmMpKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzYyMCwgY2xhc3NOYW1lLCBmdW5jTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc1N1cGVyQ2FsbDtcbn1cblxuZnVuY3Rpb24gZGVjbGFyZVByb3BlcnRpZXMgKGNscywgY2xhc3NOYW1lLCBwcm9wZXJ0aWVzLCBiYXNlQ2xhc3MsIG1peGlucywgZXM2KSB7XG4gICAgY2xzLl9fcHJvcHNfXyA9IFtdO1xuXG4gICAgaWYgKGJhc2VDbGFzcyAmJiBiYXNlQ2xhc3MuX19wcm9wc19fKSB7XG4gICAgICAgIGNscy5fX3Byb3BzX18gPSBiYXNlQ2xhc3MuX19wcm9wc19fLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgaWYgKG1peGlucykge1xuICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1peGlucy5sZW5ndGg7ICsrbSkge1xuICAgICAgICAgICAgdmFyIG1peGluID0gbWl4aW5zW21dO1xuICAgICAgICAgICAgaWYgKG1peGluLl9fcHJvcHNfXykge1xuICAgICAgICAgICAgICAgIGNscy5fX3Byb3BzX18gPSBjbHMuX19wcm9wc19fLmNvbmNhdChtaXhpbi5fX3Byb3BzX18uZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbHMuX19wcm9wc19fLmluZGV4T2YoeCkgPCAwO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgIC8vIOmihOWkhOeQhuWxnuaAp1xuICAgICAgICBwcmVwcm9jZXNzLnByZXByb2Nlc3NBdHRycyhwcm9wZXJ0aWVzLCBjbGFzc05hbWUsIGNscywgZXM2KTtcblxuICAgICAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gcHJvcGVydGllc1twcm9wTmFtZV07XG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnIGluIHZhbCkge1xuICAgICAgICAgICAgICAgIGRlZmluZVByb3AoY2xzLCBjbGFzc05hbWUsIHByb3BOYW1lLCB2YWwsIGVzNik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZpbmVHZXRTZXQoY2xzLCBjbGFzc05hbWUsIHByb3BOYW1lLCB2YWwsIGVzNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoY2xzKTtcbiAgICBjbHMuX192YWx1ZXNfXyA9IGNscy5fX3Byb3BzX18uZmlsdGVyKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgIHJldHVybiBhdHRyc1twcm9wICsgREVMSU1FVEVSICsgJ3NlcmlhbGl6YWJsZSddICE9PSBmYWxzZTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIERlZmluZXMgYSBDQ0NsYXNzIHVzaW5nIHRoZSBnaXZlbiBzcGVjaWZpY2F0aW9uLCBwbGVhc2Ugc2VlIFtDbGFzc10oL2RvY3MvZWRpdG9yc19hbmRfdG9vbHMvY3JlYXRvci1jaGFwdGVycy9zY3JpcHRpbmcvY2xhc3MuaHRtbCkgZm9yIGRldGFpbHMuXG4gKiAhI3poIOWumuS5ieS4gOS4qiBDQ0NsYXNz77yM5Lyg5YWl5Y+C5pWw5b+F6aG75piv5LiA5Liq5YyF5ZCr57G75Z6L5Y+C5pWw55qE5a2X6Z2i6YeP5a+56LGh77yM5YW35L2T55So5rOV6K+35p+l6ZiFW+exu+Wei+WumuS5iV0oL2RvY3MvY3JlYXRvci9zY3JpcHRpbmcvY2xhc3MuaHRtbCnjgIJcbiAqXG4gKiBAbWV0aG9kIENsYXNzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWVdIC0gVGhlIGNsYXNzIG5hbWUgdXNlZCBmb3Igc2VyaWFsaXphdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmV4dGVuZHNdIC0gVGhlIGJhc2UgY2xhc3MuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5jdG9yXSAtIFRoZSBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLl9fY3Rvcl9fXSAtIFRoZSBzYW1lIGFzIGN0b3IsIGJ1dCBsZXNzIGVuY2Fwc3VsYXRlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5wcm9wZXJ0aWVzXSAtIFRoZSBwcm9wZXJ0eSBkZWZpbml0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdGF0aWNzXSAtIFRoZSBzdGF0aWMgbWVtYmVycy5cbiAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW29wdGlvbnMubWl4aW5zXVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5lZGl0b3JdIC0gYXR0cmlidXRlcyBmb3IgQ29tcG9uZW50IGxpc3RlZCBiZWxvdy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yLmV4ZWN1dGVJbkVkaXRNb2RlPWZhbHNlXSAtIEFsbG93cyB0aGUgY3VycmVudCBjb21wb25lbnQgdG8gcnVuIGluIGVkaXQgbW9kZS4gQnkgZGVmYXVsdCwgYWxsIGNvbXBvbmVudHMgYXJlIGV4ZWN1dGVkIG9ubHkgYXQgcnVudGltZSwgbWVhbmluZyB0aGF0IHRoZXkgd2lsbCBub3QgaGF2ZSB0aGVpciBjYWxsYmFjayBmdW5jdGlvbnMgZXhlY3V0ZWQgd2hpbGUgdGhlIEVkaXRvciBpcyBpbiBlZGl0IG1vZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5lZGl0b3IucmVxdWlyZUNvbXBvbmVudF0gLSBBdXRvbWF0aWNhbGx5IGFkZCByZXF1aXJlZCBjb21wb25lbnQgYXMgYSBkZXBlbmRlbmN5LlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5tZW51XSAtIFRoZSBtZW51IHBhdGggdG8gcmVnaXN0ZXIgYSBjb21wb25lbnQgdG8gdGhlIGVkaXRvcnMgXCJDb21wb25lbnRcIiBtZW51LiBFZy4gXCJSZW5kZXJpbmcvQ2FtZXJhXCIuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZWRpdG9yLmV4ZWN1dGlvbk9yZGVyPTBdIC0gVGhlIGV4ZWN1dGlvbiBvcmRlciBvZiBsaWZlY3ljbGUgbWV0aG9kcyBmb3IgQ29tcG9uZW50LiBUaG9zZSBsZXNzIHRoYW4gMCB3aWxsIGV4ZWN1dGUgYmVmb3JlIHdoaWxlIHRob3NlIGdyZWF0ZXIgdGhhbiAwIHdpbGwgZXhlY3V0ZSBhZnRlci4gVGhlIG9yZGVyIHdpbGwgb25seSBhZmZlY3Qgb25Mb2FkLCBvbkVuYWJsZSwgc3RhcnQsIHVwZGF0ZSBhbmQgbGF0ZVVwZGF0ZSB3aGlsZSBvbkRpc2FibGUgYW5kIG9uRGVzdHJveSB3aWxsIG5vdCBiZSBhZmZlY3RlZC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yLmRpc2FsbG93TXVsdGlwbGVdIC0gSWYgc3BlY2lmaWVkIHRvIGEgdHlwZSwgcHJldmVudHMgQ29tcG9uZW50IG9mIHRoZSBzYW1lIHR5cGUgKG9yIHN1YnR5cGUpIHRvIGJlIGFkZGVkIG1vcmUgdGhhbiBvbmNlIHRvIGEgTm9kZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yLnBsYXlPbkZvY3VzPWZhbHNlXSAtIFRoaXMgcHJvcGVydHkgaXMgb25seSBhdmFpbGFibGUgd2hlbiBleGVjdXRlSW5FZGl0TW9kZSBpcyBzZXQuIElmIHNwZWNpZmllZCwgdGhlIGVkaXRvcidzIHNjZW5lIHZpZXcgd2lsbCBrZWVwIHVwZGF0aW5nIHRoaXMgbm9kZSBpbiA2MCBmcHMgd2hlbiBpdCBpcyBzZWxlY3RlZCwgb3RoZXJ3aXNlLCBpdCB3aWxsIHVwZGF0ZSBvbmx5IGlmIG5lY2Vzc2FyeS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5lZGl0b3IuaW5zcGVjdG9yXSAtIEN1c3RvbWl6ZSB0aGUgcGFnZSB1cmwgdXNlZCBieSB0aGUgY3VycmVudCBjb21wb25lbnQgdG8gcmVuZGVyIGluIHRoZSBQcm9wZXJ0aWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5pY29uXSAtIEN1c3RvbWl6ZSB0aGUgaWNvbiB0aGF0IHRoZSBjdXJyZW50IGNvbXBvbmVudCBkaXNwbGF5cyBpbiB0aGUgZWRpdG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5oZWxwXSAtIFRoZSBjdXN0b20gZG9jdW1lbnRhdGlvbiBVUkxcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy51cGRhdGVdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L3VwZGF0ZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmxhdGVVcGRhdGVdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L2xhdGVVcGRhdGU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkxvYWRdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uTG9hZDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnN0YXJ0XSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9zdGFydDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRW5hYmxlXSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vbkVuYWJsZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRGlzYWJsZV0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvb25EaXNhYmxlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25EZXN0cm95XSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vbkRlc3Ryb3k6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkZvY3VzSW5FZGl0b3JdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uRm9jdXNJbkVkaXRvcjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uTG9zdEZvY3VzSW5FZGl0b3JdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uTG9zdEZvY3VzSW5FZGl0b3I6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5yZXNldEluRWRpdG9yXSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9yZXNldEluRWRpdG9yOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25SZXN0b3JlXSAtIGZvciBDb21wb25lbnQgb25seSwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vblJlc3RvcmU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5fZ2V0TG9jYWxCb3VuZHNdIC0gZm9yIENvbXBvbmVudCBvbmx5LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L19nZXRMb2NhbEJvdW5kczptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB0aGUgY3JlYXRlZCBjbGFzc1xuICpcbiAqIEBleGFtcGxlXG5cbiAvLyBkZWZpbmUgYmFzZSBjbGFzc1xuIHZhciBOb2RlID0gY2MuQ2xhc3MoKTtcblxuIC8vIGRlZmluZSBzdWIgY2xhc3NcbiB2YXIgU3ByaXRlID0gY2MuQ2xhc3Moe1xuICAgICBuYW1lOiAnU3ByaXRlJyxcbiAgICAgZXh0ZW5kczogTm9kZSxcblxuICAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICB0aGlzLnVybCA9IFwiXCI7XG4gICAgICAgICB0aGlzLmlkID0gMDtcbiAgICAgfSxcblxuICAgICBzdGF0aWNzOiB7XG4gICAgICAgICAvLyBkZWZpbmUgc3RhdGljIG1lbWJlcnNcbiAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgZ2V0Qm91bmRzOiBmdW5jdGlvbiAoc3ByaXRlTGlzdCkge1xuICAgICAgICAgICAgIC8vIGNvbXB1dGUgYm91bmRzLi4uXG4gICAgICAgICB9XG4gICAgIH0sXG5cbiAgICAgcHJvcGVydGllcyB7XG4gICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgIGRlZmF1bHQ6IDEyOCxcbiAgICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyLFxuICAgICAgICAgICAgIHRvb2x0aXA6ICdUaGUgd2lkdGggb2Ygc3ByaXRlJ1xuICAgICAgICAgfSxcbiAgICAgICAgIGhlaWdodDogMTI4LFxuICAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gY2MudjIodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgfSxcblxuICAgICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAvLyBsb2FkIHRoaXMudXJsLi4uXG4gICAgIH07XG4gfSk7XG5cbiAvLyBpbnN0YW50aWF0ZVxuXG4gdmFyIG9iaiA9IG5ldyBTcHJpdGUoKTtcbiBvYmoudXJsID0gJ3Nwcml0ZS5wbmcnO1xuIG9iai5sb2FkKCk7XG4gKi9cbmZ1bmN0aW9uIENDQ2xhc3MgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHZhciBiYXNlID0gb3B0aW9ucy5leHRlbmRzLyogfHwgQ0NPYmplY3QqLztcbiAgICB2YXIgbWl4aW5zID0gb3B0aW9ucy5taXhpbnM7XG5cbiAgICAvLyBjcmVhdGUgY29uc3RydWN0b3JcbiAgICB2YXIgY2xzID0gZGVmaW5lKG5hbWUsIGJhc2UsIG1peGlucywgb3B0aW9ucyk7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIG5hbWUgPSBjYy5qcy5nZXRDbGFzc05hbWUoY2xzKTtcbiAgICB9XG5cbiAgICBjbHMuX3NlYWxlZCA9IHRydWU7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgICAgYmFzZS5fc2VhbGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIFByb3BlcnRpZXNcbiAgICB2YXIgcHJvcGVydGllcyA9IG9wdGlvbnMucHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgKGJhc2UgJiYgYmFzZS5fX3Byb3BzX18gPT09IG51bGwpIHx8XG4gICAgICAgIChtaXhpbnMgJiYgbWl4aW5zLnNvbWUoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4Ll9fcHJvcHNfXyA9PT0gbnVsbDtcbiAgICAgICAgfSkpXG4gICAgKSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgb3B0aW9ucy5fX0VTNl9fKSB7XG4gICAgICAgICAgICBjYy5lcnJvcignbm90IHlldCBpbXBsZW1lbnQgZGVmZXJyZWQgcHJvcGVydGllcyBmb3IgRVM2IENsYXNzZXMnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlZmVycmVkSW5pdGlhbGl6ZXIucHVzaCh7Y2xzOiBjbHMsIHByb3BzOiBwcm9wZXJ0aWVzLCBtaXhpbnM6IG1peGluc30pO1xuICAgICAgICAgICAgY2xzLl9fcHJvcHNfXyA9IGNscy5fX3ZhbHVlc19fID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGVjbGFyZVByb3BlcnRpZXMoY2xzLCBuYW1lLCBwcm9wZXJ0aWVzLCBiYXNlLCBvcHRpb25zLm1peGlucywgb3B0aW9ucy5fX0VTNl9fKTtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgc3RhdGljc1xuICAgIHZhciBzdGF0aWNzID0gb3B0aW9ucy5zdGF0aWNzO1xuICAgIGlmIChzdGF0aWNzKSB7XG4gICAgICAgIHZhciBzdGF0aWNQcm9wTmFtZTtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgZm9yIChzdGF0aWNQcm9wTmFtZSBpbiBzdGF0aWNzKSB7XG4gICAgICAgICAgICAgICAgaWYgKElOVkFMSURfU1RBVElDU19ERVYuaW5kZXhPZihzdGF0aWNQcm9wTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0MiwgbmFtZSwgc3RhdGljUHJvcE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNQcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoc3RhdGljUHJvcE5hbWUgaW4gc3RhdGljcykge1xuICAgICAgICAgICAgY2xzW3N0YXRpY1Byb3BOYW1lXSA9IHN0YXRpY3Nbc3RhdGljUHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGZ1bmN0aW9uc1xuICAgIGZvciAodmFyIGZ1bmNOYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKEJVSUxUSU5fRU5UUklFUy5pbmRleE9mKGZ1bmNOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVuYyA9IG9wdGlvbnNbZnVuY05hbWVdO1xuICAgICAgICBpZiAoIXByZXByb2Nlc3MudmFsaWRhdGVNZXRob2RXaXRoUHJvcHMoZnVuYywgZnVuY05hbWUsIG5hbWUsIGNscywgYmFzZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHVzZSB2YWx1ZSB0byByZWRlZmluZSBzb21lIHN1cGVyIG1ldGhvZCBkZWZpbmVkIGFzIGdldHRlclxuICAgICAgICBqcy52YWx1ZShjbHMucHJvdG90eXBlLCBmdW5jTmFtZSwgZnVuYywgdHJ1ZSwgdHJ1ZSk7XG4gICAgfVxuXG5cbiAgICB2YXIgZWRpdG9yID0gb3B0aW9ucy5lZGl0b3I7XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgICBpZiAoanMuaXNDaGlsZENsYXNzT2YoYmFzZSwgY2MuQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgY2MuQ29tcG9uZW50Ll9yZWdpc3RlckVkaXRvclByb3BzKGNscywgZWRpdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNjIzLCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjbHM7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGNvbnN0cnVjdG9yIGlzIGNyZWF0ZWQgYnkgY2MuQ2xhc3NcbiAqXG4gKiBAbWV0aG9kIF9pc0NDQ2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHByaXZhdGVcbiAqL1xuQ0NDbGFzcy5faXNDQ0NsYXNzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgIGNvbnN0cnVjdG9yLmhhc093blByb3BlcnR5KCdfX2N0b3JzX18nKTsgICAgIC8vIGlzIG5vdCBpbmhlcml0ZWQgX19jdG9yc19fXG59O1xuXG4vL1xuLy8gT3B0aW1pemVkIGRlZmluZSBmdW5jdGlvbiBvbmx5IGZvciBpbnRlcm5hbCBjbGFzc2VzXG4vL1xuLy8gQG1ldGhvZCBfZmFzdERlZmluZVxuLy8gQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuLy8gQHBhcmFtIHtGdW5jdGlvbn0gY29uc3RydWN0b3Jcbi8vIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpemFibGVGaWVsZHNcbi8vIEBwcml2YXRlXG4vL1xuQ0NDbGFzcy5fZmFzdERlZmluZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUsIGNvbnN0cnVjdG9yLCBzZXJpYWxpemFibGVGaWVsZHMpIHtcbiAgICBqcy5zZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvcik7XG4gICAgLy9jb25zdHJ1Y3Rvci5fX2N0b3JzX18gPSBjb25zdHJ1Y3Rvci5fX2N0b3JzX18gfHwgbnVsbDtcbiAgICB2YXIgcHJvcHMgPSBjb25zdHJ1Y3Rvci5fX3Byb3BzX18gPSBjb25zdHJ1Y3Rvci5fX3ZhbHVlc19fID0gT2JqZWN0LmtleXMoc2VyaWFsaXphYmxlRmllbGRzKTtcbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoY29uc3RydWN0b3IpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2ldO1xuICAgICAgICBhdHRyc1trZXkgKyBERUxJTUVURVIgKyAndmlzaWJsZSddID0gZmFsc2U7XG4gICAgICAgIGF0dHJzW2tleSArIERFTElNRVRFUiArICdkZWZhdWx0J10gPSBzZXJpYWxpemFibGVGaWVsZHNba2V5XTtcbiAgICB9XG59O1xuXG5DQ0NsYXNzLkF0dHIgPSBBdHRyO1xuQ0NDbGFzcy5hdHRyID0gQXR0ci5hdHRyO1xuXG4vKlxuICogUmV0dXJuIGFsbCBzdXBlciBjbGFzc2VzXG4gKiBAbWV0aG9kIGdldEluaGVyaXRhbmNlQ2hhaW5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcmV0dXJuIHtGdW5jdGlvbltdfVxuICovXG5DQ0NsYXNzLmdldEluaGVyaXRhbmNlQ2hhaW4gPSBmdW5jdGlvbiAoa2xhc3MpIHtcbiAgICB2YXIgY2hhaW4gPSBbXTtcbiAgICBmb3IgKDs7KSB7XG4gICAgICAgIGtsYXNzID0ganMuZ2V0U3VwZXIoa2xhc3MpO1xuICAgICAgICBpZiAoIWtsYXNzKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2xhc3MgIT09IE9iamVjdCkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChrbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYWluO1xufTtcblxudmFyIFByaW1pdGl2ZVR5cGVzID0ge1xuICAgIC8vIFNwZWNpZnkgdGhhdCB0aGUgaW5wdXQgdmFsdWUgbXVzdCBiZSBpbnRlZ2VyIGluIFByb3BlcnRpZXMuXG4gICAgLy8gQWxzbyB1c2VkIHRvIGluZGljYXRlcyB0aGF0IHRoZSB0eXBlIG9mIGVsZW1lbnRzIGluIGFycmF5IG9yIHRoZSB0eXBlIG9mIHZhbHVlIGluIGRpY3Rpb25hcnkgaXMgaW50ZWdlci5cbiAgICBJbnRlZ2VyOiAnTnVtYmVyJyxcbiAgICAvLyBJbmRpY2F0ZXMgdGhhdCB0aGUgdHlwZSBvZiBlbGVtZW50cyBpbiBhcnJheSBvciB0aGUgdHlwZSBvZiB2YWx1ZSBpbiBkaWN0aW9uYXJ5IGlzIGRvdWJsZS5cbiAgICBGbG9hdDogJ051bWJlcicsXG4gICAgQm9vbGVhbjogJ0Jvb2xlYW4nLFxuICAgIFN0cmluZzogJ1N0cmluZycsXG59O1xudmFyIG9uQWZ0ZXJQcm9wc19FVCA9IFtdO1xuZnVuY3Rpb24gcGFyc2VBdHRyaWJ1dGVzIChjbHMsIGF0dHJpYnV0ZXMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHVzZWRJbkdldHRlcikge1xuICAgIHZhciBFUlJfVHlwZSA9IENDX0RFViA/ICdUaGUgJXMgb2YgJXMgbXVzdCBiZSB0eXBlICVzJyA6ICcnO1xuXG4gICAgdmFyIGF0dHJzID0gbnVsbDtcbiAgICB2YXIgcHJvcE5hbWVQcmVmaXggPSAnJztcbiAgICBmdW5jdGlvbiBpbml0QXR0cnMgKCkge1xuICAgICAgICBwcm9wTmFtZVByZWZpeCA9IHByb3BOYW1lICsgREVMSU1FVEVSO1xuICAgICAgICByZXR1cm4gYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoY2xzKTtcbiAgICB9XG5cbiAgICBpZiAoKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikgfHwgQ0NfVEVTVCkge1xuICAgICAgICBvbkFmdGVyUHJvcHNfRVQubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9IGF0dHJpYnV0ZXMudHlwZTtcbiAgICBpZiAodHlwZSkge1xuICAgICAgICB2YXIgcHJpbWl0aXZlVHlwZSA9IFByaW1pdGl2ZVR5cGVzW3R5cGVdO1xuICAgICAgICBpZiAocHJpbWl0aXZlVHlwZSkge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd0eXBlJ10gPSB0eXBlO1xuICAgICAgICAgICAgaWYgKCgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSAmJiAhYXR0cmlidXRlcy5fc2hvcnQpIHtcbiAgICAgICAgICAgICAgICBvbkFmdGVyUHJvcHNfRVQucHVzaChBdHRyLmdldFR5cGVDaGVja2VyX0VUKHByaW1pdGl2ZVR5cGUsICdjYy4nICsgdHlwZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdPYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ0LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBBdHRyLlNjcmlwdFV1aWQpIHtcbiAgICAgICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ3R5cGUnXSA9ICdTY3JpcHQnO1xuICAgICAgICAgICAgICAgIGF0dHJzW3Byb3BOYW1lUHJlZml4ICsgJ2N0b3InXSA9IGNjLlNjcmlwdEFzc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoRW51bS5pc0VudW0odHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAndHlwZSddID0gJ0VudW0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnZW51bUxpc3QnXSA9IEVudW0uZ2V0TGlzdCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0NSwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd0eXBlJ10gPSAnT2JqZWN0JztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnY3RvciddID0gdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSAmJiAhYXR0cmlidXRlcy5fc2hvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQWZ0ZXJQcm9wc19FVC5wdXNoKGF0dHJpYnV0ZXMudXJsID8gQXR0ci5nZXRUeXBlQ2hlY2tlcl9FVCgnU3RyaW5nJywgJ2NjLlN0cmluZycpIDogQXR0ci5nZXRPYmpUeXBlQ2hlY2tlcl9FVCh0eXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0NiwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgdHlwZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTaW1wbGVBdHRyIChhdHRyTmFtZSwgZXhwZWN0VHlwZSkge1xuICAgICAgICBpZiAoYXR0ck5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09IGV4cGVjdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSX1R5cGUsIGF0dHJOYW1lLCBjbGFzc05hbWUsIHByb3BOYW1lLCBleHBlY3RUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhdHRyaWJ1dGVzLmVkaXRvck9ubHkpIHtcbiAgICAgICAgaWYgKENDX0RFViAmJiB1c2VkSW5HZXR0ZXIpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzYxMywgXCJlZGl0b3JPbmx5XCIsIG5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAnZWRpdG9yT25seSddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL3BhcnNlU2ltcGxlQXR0cigncHJldmVudERlZmVycmVkTG9hZCcsICdib29sZWFuJyk7XG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICBwYXJzZVNpbXBsZUF0dHIoJ2Rpc3BsYXlOYW1lJywgJ3N0cmluZycpO1xuICAgICAgICBwYXJzZVNpbXBsZUF0dHIoJ211bHRpbGluZScsICdib29sZWFuJyk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ3JlYWRvbmx5J10gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cigndG9vbHRpcCcsICdzdHJpbmcnKTtcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyKCdzbGlkZScsICdib29sZWFuJyk7XG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZXMudXJsKSB7XG4gICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAnc2F2ZVVybEFzQXNzZXQnXSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChhdHRyaWJ1dGVzLnNlcmlhbGl6YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKENDX0RFViAmJiB1c2VkSW5HZXR0ZXIpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzYxMywgXCJzZXJpYWxpemFibGVcIiwgbmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdzZXJpYWxpemFibGUnXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhcnNlU2ltcGxlQXR0cignZm9ybWVybHlTZXJpYWxpemVkQXMnLCAnc3RyaW5nJyk7XG5cbiAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cignbm90aWZ5Rm9yJywgJ3N0cmluZycpO1xuXG4gICAgICAgIGlmICgnYW5pbWF0YWJsZScgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdhbmltYXRhYmxlJ10gPSAhIWF0dHJpYnV0ZXMuYW5pbWF0YWJsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgdmFyIHZpc2libGUgPSBhdHRyaWJ1dGVzLnZpc2libGU7XG4gICAgICAgIGlmICh0eXBlb2YgdmlzaWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICghdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAndmlzaWJsZSddID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmlzaWJsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAndmlzaWJsZSddID0gdmlzaWJsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBzdGFydHNXaXRoVVMgPSAocHJvcE5hbWUuY2hhckNvZGVBdCgwKSA9PT0gOTUpO1xuICAgICAgICAgICAgaWYgKHN0YXJ0c1dpdGhVUykge1xuICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAndmlzaWJsZSddID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmFuZ2UgPSBhdHRyaWJ1dGVzLnJhbmdlO1xuICAgIGlmIChyYW5nZSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChyYW5nZS5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAnbWluJ10gPSByYW5nZVswXTtcbiAgICAgICAgICAgICAgICBhdHRyc1twcm9wTmFtZVByZWZpeCArICdtYXgnXSA9IHJhbmdlWzFdO1xuICAgICAgICAgICAgICAgIGlmIChyYW5nZS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzW3Byb3BOYW1lUHJlZml4ICsgJ3N0ZXAnXSA9IHJhbmdlWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0Nyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBjYy5lcnJvcihFUlJfVHlwZSwgJ3JhbmdlJywgY2xhc3NOYW1lLCBwcm9wTmFtZSwgJ2FycmF5Jyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VTaW1wbGVBdHRyKCdtaW4nLCAnbnVtYmVyJyk7XG4gICAgcGFyc2VTaW1wbGVBdHRyKCdtYXgnLCAnbnVtYmVyJyk7XG4gICAgcGFyc2VTaW1wbGVBdHRyKCdzdGVwJywgJ251bWJlcicpO1xufVxuXG5jYy5DbGFzcyA9IENDQ2xhc3M7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGlzQXJyYXk6IGZ1bmN0aW9uIChkZWZhdWx0VmFsKSB7XG4gICAgICAgIGRlZmF1bHRWYWwgPSBnZXREZWZhdWx0KGRlZmF1bHRWYWwpO1xuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkZWZhdWx0VmFsKTtcbiAgICB9LFxuICAgIGZhc3REZWZpbmU6IENDQ2xhc3MuX2Zhc3REZWZpbmUsXG4gICAgZ2V0TmV3VmFsdWVUeXBlQ29kZTogQ0NfU1VQUE9SVF9KSVQgJiYgZ2V0TmV3VmFsdWVUeXBlQ29kZUppdCxcbiAgICBJREVOVElGSUVSX1JFLFxuICAgIGVzY2FwZUZvckpTLFxuICAgIGdldERlZmF1bHQ6IGdldERlZmF1bHRcbn07XG5cbmlmIChDQ19URVNUKSB7XG4gICAganMubWl4aW4oQ0NDbGFzcywgbW9kdWxlLmV4cG9ydHMpO1xufVxuIl19