
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/js.js';
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
var tempCIDGenerater = new (require('./id-generater'))('TmpCId.');

function _getPropertyDescriptor(obj, name) {
  while (obj) {
    var pd = Object.getOwnPropertyDescriptor(obj, name);

    if (pd) {
      return pd;
    }

    obj = Object.getPrototypeOf(obj);
  }

  return null;
}

function _copyprop(name, source, target) {
  var pd = _getPropertyDescriptor(source, name);

  Object.defineProperty(target, name, pd);
}
/**
 * This module provides some JavaScript utilities.
 * All members can be accessed with "cc.js".
 * @submodule js
 * @module js
 */


var js = {
  /**
   * Check the obj whether is number or not
   * If a number is created by using 'new Number(10086)', the typeof it will be "object"...
   * Then you can use this function if you care about this case.
   * @method isNumber
   * @param {*} obj
   * @returns {Boolean}
   */
  isNumber: function isNumber(obj) {
    return typeof obj === 'number' || obj instanceof Number;
  },

  /**
   * Check the obj whether is string or not.
   * If a string is created by using 'new String("blabla")', the typeof it will be "object"...
   * Then you can use this function if you care about this case.
   * @method isString
   * @param {*} obj
   * @returns {Boolean}
   */
  isString: function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
  },

  /**
   * Copy all properties not defined in obj from arguments[1...n]
   * @method addon
   * @param {Object} obj object to extend its properties
   * @param {Object} ...sourceObj source object to copy properties from
   * @return {Object} the result obj
   */
  addon: function addon(obj) {
    'use strict';

    obj = obj || {};

    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];

      if (source) {
        if (typeof source !== 'object') {
          cc.errorID(5402, source);
          continue;
        }

        for (var name in source) {
          if (!(name in obj)) {
            _copyprop(name, source, obj);
          }
        }
      }
    }

    return obj;
  },

  /**
   * copy all properties from arguments[1...n] to obj
   * @method mixin
   * @param {Object} obj
   * @param {Object} ...sourceObj
   * @return {Object} the result obj
   */
  mixin: function mixin(obj) {
    'use strict';

    obj = obj || {};

    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];

      if (source) {
        if (typeof source !== 'object') {
          cc.errorID(5403, source);
          continue;
        }

        for (var name in source) {
          _copyprop(name, source, obj);
        }
      }
    }

    return obj;
  },

  /**
   * Derive the class from the supplied base class.
   * Both classes are just native javascript constructors, not created by cc.Class, so
   * usually you will want to inherit using {{#crossLink "cc/Class:method"}}cc.Class {{/crossLink}} instead.
   * @method extend
   * @param {Function} cls
   * @param {Function} base - the baseclass to inherit
   * @return {Function} the result class
   */
  extend: function extend(cls, base) {
    if (CC_DEV) {
      if (!base) {
        cc.errorID(5404);
        return;
      }

      if (!cls) {
        cc.errorID(5405);
        return;
      }

      if (Object.keys(cls.prototype).length > 0) {
        cc.errorID(5406);
      }
    }

    for (var p in base) {
      if (base.hasOwnProperty(p)) cls[p] = base[p];
    }

    cls.prototype = Object.create(base.prototype, {
      constructor: {
        value: cls,
        writable: true,
        configurable: true
      }
    });
    return cls;
  },

  /**
   * Get super class
   * @method getSuper
   * @param {Function} ctor - the constructor of subclass
   * @return {Function}
   */
  getSuper: function getSuper(ctor) {
    var proto = ctor.prototype; // binded function do not have prototype

    var dunderProto = proto && Object.getPrototypeOf(proto);
    return dunderProto && dunderProto.constructor;
  },

  /**
   * Checks whether subclass is child of superclass or equals to superclass
   *
   * @method isChildClassOf
   * @param {Function} subclass
   * @param {Function} superclass
   * @return {Boolean}
   */
  isChildClassOf: function isChildClassOf(subclass, superclass) {
    if (subclass && superclass) {
      if (typeof subclass !== 'function') {
        return false;
      }

      if (typeof superclass !== 'function') {
        if (CC_DEV) {
          cc.warnID(3625, superclass);
        }

        return false;
      }

      if (subclass === superclass) {
        return true;
      }

      for (;;) {
        subclass = js.getSuper(subclass);

        if (!subclass) {
          return false;
        }

        if (subclass === superclass) {
          return true;
        }
      }
    }

    return false;
  },

  /**
   * Removes all enumerable properties from object
   * @method clear
   * @param {any} obj
   */
  clear: function clear(obj) {
    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {
      delete obj[keys[i]];
    }
  },

  /**
   * Checks whether obj is an empty object
   * @method isEmptyObject
   * @param {any} obj 
   * @returns {Boolean}
   */
  isEmptyObject: function isEmptyObject(obj) {
    for (var key in obj) {
      return false;
    }

    return true;
  },

  /**
   * Get property descriptor in object and all its ancestors
   * @method getPropertyDescriptor
   * @param {Object} obj
   * @param {String} name
   * @return {Object}
   */
  getPropertyDescriptor: _getPropertyDescriptor
};
var tmpValueDesc = {
  value: undefined,
  enumerable: false,
  writable: false,
  configurable: true
};
/**
 * Define value, just help to call Object.defineProperty.<br>
 * The configurable will be true.
 * @method value
 * @param {Object} obj
 * @param {String} prop
 * @param {any} value
 * @param {Boolean} [writable=false]
 * @param {Boolean} [enumerable=false]
 */

js.value = function (obj, prop, value, writable, enumerable) {
  tmpValueDesc.value = value;
  tmpValueDesc.writable = writable;
  tmpValueDesc.enumerable = enumerable;
  Object.defineProperty(obj, prop, tmpValueDesc);
  tmpValueDesc.value = undefined;
};

var tmpGetSetDesc = {
  get: null,
  set: null,
  enumerable: false
};
/**
 * Define get set accessor, just help to call Object.defineProperty(...)
 * @method getset
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} getter
 * @param {Function} [setter=null]
 * @param {Boolean} [enumerable=false]
 * @param {Boolean} [configurable=false]
 */

js.getset = function (obj, prop, getter, setter, enumerable, configurable) {
  if (typeof setter !== 'function') {
    enumerable = setter;
    setter = undefined;
  }

  tmpGetSetDesc.get = getter;
  tmpGetSetDesc.set = setter;
  tmpGetSetDesc.enumerable = enumerable;
  tmpGetSetDesc.configurable = configurable;
  Object.defineProperty(obj, prop, tmpGetSetDesc);
  tmpGetSetDesc.get = null;
  tmpGetSetDesc.set = null;
};

var tmpGetDesc = {
  get: null,
  enumerable: false,
  configurable: false
};
/**
 * Define get accessor, just help to call Object.defineProperty(...)
 * @method get
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} getter
 * @param {Boolean} [enumerable=false]
 * @param {Boolean} [configurable=false]
 */

js.get = function (obj, prop, getter, enumerable, configurable) {
  tmpGetDesc.get = getter;
  tmpGetDesc.enumerable = enumerable;
  tmpGetDesc.configurable = configurable;
  Object.defineProperty(obj, prop, tmpGetDesc);
  tmpGetDesc.get = null;
};

var tmpSetDesc = {
  set: null,
  enumerable: false,
  configurable: false
};
/**
 * Define set accessor, just help to call Object.defineProperty(...)
 * @method set
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} setter
 * @param {Boolean} [enumerable=false]
 * @param {Boolean} [configurable=false]
 */

js.set = function (obj, prop, setter, enumerable, configurable) {
  tmpSetDesc.set = setter;
  tmpSetDesc.enumerable = enumerable;
  tmpSetDesc.configurable = configurable;
  Object.defineProperty(obj, prop, tmpSetDesc);
  tmpSetDesc.set = null;
};
/**
 * Get class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>)
 * @method getClassName
 * @param {Object|Function} objOrCtor - instance or constructor
 * @return {String}
 */


js.getClassName = function (objOrCtor) {
  if (typeof objOrCtor === 'function') {
    var prototype = objOrCtor.prototype;

    if (prototype && prototype.hasOwnProperty('__classname__') && prototype.__classname__) {
      return prototype.__classname__;
    }

    var retval = ''; //  for browsers which have name property in the constructor of the object, such as chrome

    if (objOrCtor.name) {
      retval = objOrCtor.name;
    }

    if (objOrCtor.toString) {
      var arr,
          str = objOrCtor.toString();

      if (str.charAt(0) === '[') {
        // str is "[object objectClass]"
        arr = str.match(/\[\w+\s*(\w+)\]/);
      } else {
        // str is function objectClass () {} for IE Firefox
        arr = str.match(/function\s*(\w+)/);
      }

      if (arr && arr.length === 2) {
        retval = arr[1];
      }
    }

    return retval !== 'Object' ? retval : '';
  } else if (objOrCtor && objOrCtor.constructor) {
    return js.getClassName(objOrCtor.constructor);
  }

  return '';
};

function isTempClassId(id) {
  return typeof id !== 'string' || id.startsWith(tempCIDGenerater.prefix);
} // id 注册


(function () {
  var _idToClass = {};
  var _nameToClass = {};

  function setup(key, publicName, table) {
    js.getset(js, publicName, function () {
      return Object.assign({}, table);
    }, function (value) {
      js.clear(table);
      Object.assign(table, value);
    });
    return function (id, constructor) {
      // deregister old
      if (constructor.prototype.hasOwnProperty(key)) {
        delete table[constructor.prototype[key]];
      }

      js.value(constructor.prototype, key, id); // register class

      if (id) {
        var registered = table[id];

        if (registered && registered !== constructor) {
          var error = 'A Class already exists with the same ' + key + ' : "' + id + '".';

          if (CC_TEST) {
            error += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
cc.js.unregisterClass to remove the id of unused class';
          }

          cc.error(error);
        } else {
          table[id] = constructor;
        } //if (id === "") {
        //    console.trace("", table === _nameToClass);
        //}

      }
    };
  }
  /**
   * Register the class by specified id, if its classname is not defined, the class name will also be set.
   * @method _setClassId
   * @param {String} classId
   * @param {Function} constructor
   * @private
   */

  /**
   * !#en All classes registered in the engine, indexed by ID.
   * !#zh 引擎中已注册的所有类型，通过 ID 进行索引。
   * @property _registeredClassIds
   * @example
   * // save all registered classes before loading scripts
   * let builtinClassIds = cc.js._registeredClassIds;
   * let builtinClassNames = cc.js._registeredClassNames;
   * // load some scripts that contain CCClass
   * ...
   * // clear all loaded classes
   * cc.js._registeredClassIds = builtinClassIds;
   * cc.js._registeredClassNames = builtinClassNames;
   */


  js._setClassId = setup('__cid__', '_registeredClassIds', _idToClass);
  /**
   * !#en All classes registered in the engine, indexed by name.
   * !#zh 引擎中已注册的所有类型，通过名称进行索引。
   * @property _registeredClassNames
   * @example
   * // save all registered classes before loading scripts
   * let builtinClassIds = cc.js._registeredClassIds;
   * let builtinClassNames = cc.js._registeredClassNames;
   * // load some scripts that contain CCClass
   * ...
   * // clear all loaded classes
   * cc.js._registeredClassIds = builtinClassIds;
   * cc.js._registeredClassNames = builtinClassNames;
   */

  var doSetClassName = setup('__classname__', '_registeredClassNames', _nameToClass);
  /**
   * Register the class by specified name manually
   * @method setClassName
   * @param {String} className
   * @param {Function} constructor
   */

  js.setClassName = function (className, constructor) {
    doSetClassName(className, constructor); // auto set class id

    if (!constructor.prototype.hasOwnProperty('__cid__')) {
      var id = className || tempCIDGenerater.getNewId();

      if (id) {
        js._setClassId(id, constructor);
      }
    }
  };
  /**
   * Unregister a class from fireball.
   *
   * If you dont need a registered class anymore, you should unregister the class so that Fireball will not keep its reference anymore.
   * Please note that its still your responsibility to free other references to the class.
   *
   * @method unregisterClass
   * @param {Function} ...constructor - the class you will want to unregister, any number of classes can be added
   */


  js.unregisterClass = function () {
    for (var i = 0; i < arguments.length; i++) {
      var p = arguments[i].prototype;
      var classId = p.__cid__;

      if (classId) {
        delete _idToClass[classId];
      }

      var classname = p.__classname__;

      if (classname) {
        delete _nameToClass[classname];
      }
    }
  };
  /**
   * Get the registered class by id
   * @method _getClassById
   * @param {String} classId
   * @return {Function} constructor
   * @private
   */


  js._getClassById = function (classId) {
    return _idToClass[classId];
  };
  /**
   * Get the registered class by name
   * @method getClassByName
   * @param {String} classname
   * @return {Function} constructor
   */


  js.getClassByName = function (classname) {
    return _nameToClass[classname];
  };
  /**
   * Get class id of the object
   * @method _getClassId
   * @param {Object|Function} obj - instance or constructor
   * @param {Boolean} [allowTempId=true] - can return temp id in editor
   * @return {String}
   * @private
   */


  js._getClassId = function (obj, allowTempId) {
    allowTempId = typeof allowTempId !== 'undefined' ? allowTempId : true;
    var res;

    if (typeof obj === 'function' && obj.prototype.hasOwnProperty('__cid__')) {
      res = obj.prototype.__cid__;

      if (!allowTempId && (CC_DEV || CC_EDITOR) && isTempClassId(res)) {
        return '';
      }

      return res;
    }

    if (obj && obj.constructor) {
      var prototype = obj.constructor.prototype;

      if (prototype && prototype.hasOwnProperty('__cid__')) {
        res = obj.__cid__;

        if (!allowTempId && (CC_DEV || CC_EDITOR) && isTempClassId(res)) {
          return '';
        }

        return res;
      }
    }

    return '';
  };
})();
/**
 * Defines a polyfill field for obsoleted codes.
 * @method obsolete
 * @param {any} obj - YourObject or YourClass.prototype
 * @param {String} obsoleted - "OldParam" or "YourClass.OldParam"
 * @param {String} newExpr - "NewParam" or "YourClass.NewParam"
 * @param {Boolean} [writable=false]
 */


js.obsolete = function (obj, obsoleted, newExpr, writable) {
  var extractPropName = /([^.]+)$/;
  var oldProp = extractPropName.exec(obsoleted)[0];
  var newProp = extractPropName.exec(newExpr)[0];

  function get() {
    if (CC_DEV) {
      cc.warnID(5400, obsoleted, newExpr);
    }

    return this[newProp];
  }

  if (writable) {
    js.getset(obj, oldProp, get, function (value) {
      if (CC_DEV) {
        cc.warnID(5401, obsoleted, newExpr);
      }

      this[newProp] = value;
    });
  } else {
    js.get(obj, oldProp, get);
  }
};
/**
 * Defines all polyfill fields for obsoleted codes corresponding to the enumerable properties of props.
 * @method obsoletes
 * @param {any} obj - YourObject or YourClass.prototype
 * @param {any} objName - "YourObject" or "YourClass"
 * @param {Object} props
 * @param {Boolean} [writable=false]
 */


js.obsoletes = function (obj, objName, props, writable) {
  for (var obsoleted in props) {
    var newName = props[obsoleted];
    js.obsolete(obj, objName + '.' + obsoleted, newName, writable);
  }
};

var REGEXP_NUM_OR_STR = /(%d)|(%s)/;
var REGEXP_STR = /%s/;
/**
 * A string tool to construct a string with format string.
 * @method formatStr
 * @param {String|any} msg - A JavaScript string containing zero or more substitution strings (%s).
 * @param {any} ...subst - JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
 * @returns {String}
 * @example
 * cc.js.formatStr("a: %s, b: %s", a, b);
 * cc.js.formatStr(a, b, c);
 */

js.formatStr = function () {
  var argLen = arguments.length;

  if (argLen === 0) {
    return '';
  }

  var msg = arguments[0];

  if (argLen === 1) {
    return '' + msg;
  }

  var hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);

  if (hasSubstitution) {
    for (var i = 1; i < argLen; ++i) {
      var arg = arguments[i];
      var regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
      if (regExpToTest.test(msg)) msg = msg.replace(regExpToTest, arg);else msg += ' ' + arg;
    }
  } else {
    for (var _i = 1; _i < argLen; ++_i) {
      msg += ' ' + arguments[_i];
    }
  }

  return msg;
}; // see https://github.com/petkaantonov/bluebird/issues/1389


js.shiftArguments = function () {
  var len = arguments.length - 1;
  var args = new Array(len);

  for (var i = 0; i < len; ++i) {
    args[i] = arguments[i + 1];
  }

  return args;
};
/**
 * !#en
 * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members). So we can skip `hasOwnProperty` calls on property lookups. It is a worthwhile optimization than the `{}` literal when `hasOwnProperty` calls are necessary.
 * !#zh
 * 该方法是对 `Object.create(null)` 的简单封装。`Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断。在需要频繁判断 `hasOwnProperty` 时，使用这个方法性能会比 `{}` 更高。
 *
 * @method createMap
 * @param {Boolean} [forceDictMode=false] - Apply the delete operator to newly created map object. This causes V8 to put the object in "dictionary mode" and disables creation of hidden classes which are very expensive for objects that are constantly changing shape.
 * @return {Object}
 */


js.createMap = function (forceDictMode) {
  var map = Object.create(null);

  if (forceDictMode) {
    var INVALID_IDENTIFIER_1 = '.';
    var INVALID_IDENTIFIER_2 = '/';
    map[INVALID_IDENTIFIER_1] = true;
    map[INVALID_IDENTIFIER_2] = true;
    delete map[INVALID_IDENTIFIER_1];
    delete map[INVALID_IDENTIFIER_2];
  }

  return map;
};
/**
 * @class array
 * @static
 */

/**
 * Removes the array item at the specified index.
 * @method removeAt
 * @param {any[]} array
 * @param {Number} index
 */


function removeAt(array, index) {
  array.splice(index, 1);
}
/**
 * Removes the array item at the specified index.
 * It's faster but the order of the array will be changed.
 * @method fastRemoveAt
 * @param {any[]} array
 * @param {Number} index
 */


function fastRemoveAt(array, index) {
  var length = array.length;

  if (index < 0 || index >= length) {
    return;
  }

  array[index] = array[length - 1];
  array.length = length - 1;
}
/**
 * Removes the first occurrence of a specific object from the array.
 * @method remove
 * @param {any[]} array
 * @param {any} value
 * @return {Boolean}
 */


function remove(array, value) {
  var index = array.indexOf(value);

  if (index >= 0) {
    removeAt(array, index);
    return true;
  } else {
    return false;
  }
}
/**
 * Removes the first occurrence of a specific object from the array.
 * It's faster but the order of the array will be changed.
 * @method fastRemove
 * @param {any[]} array
 * @param {Number} value
 */


function fastRemove(array, value) {
  var index = array.indexOf(value);

  if (index >= 0) {
    array[index] = array[array.length - 1];
    --array.length;
  }
}
/**
 * Verify array's Type
 * @method verifyType
 * @param {array} array
 * @param {Function} type
 * @return {Boolean}
 */


function verifyType(array, type) {
  if (array && array.length > 0) {
    for (var i = 0; i < array.length; i++) {
      if (!(array[i] instanceof type)) {
        cc.logID(1300);
        return false;
      }
    }
  }

  return true;
}
/**
 * Removes from array all values in minusArr. For each Value in minusArr, the first matching instance in array will be removed.
 * @method removeArray
 * @param {Array} array Source Array
 * @param {Array} minusArr minus Array
 */


function removeArray(array, minusArr) {
  for (var i = 0, l = minusArr.length; i < l; i++) {
    remove(array, minusArr[i]);
  }
}
/**
 * Inserts some objects at index
 * @method appendObjectsAt
 * @param {Array} array
 * @param {Array} addObjs
 * @param {Number} index
 * @return {Array}
 */


function appendObjectsAt(array, addObjs, index) {
  array.splice.apply(array, [index, 0].concat(addObjs));
  return array;
}
/**
 * Exact same function as Array.prototype.indexOf.<br>
 * HACK: ugliy hack for Baidu mobile browser compatibility, stupid Baidu guys modify Array.prototype.indexOf for all pages loaded, their version changes strict comparison to non-strict comparison, it also ignores the second parameter of the original API, and this will cause event handler enter infinite loop.<br>
 * Baidu developers, if you ever see this documentation, here is the standard: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf, Seriously!
 *
 * @method indexOf
 * @param {any} searchElement - Element to locate in the array.
 * @param {Number} [fromIndex=0] - The index to start the search at
 * @return {Number} - the first index at which a given element can be found in the array, or -1 if it is not present.
 */


var indexOf = Array.prototype.indexOf;
/**
 * Determines whether the array contains a specific value.
 * @method contains
 * @param {any[]} array
 * @param {any} value
 * @return {Boolean}
 */

function contains(array, value) {
  return array.indexOf(value) >= 0;
}
/**
 * Copy an array's item to a new array (its performance is better than Array.slice)
 * @method copy
 * @param {Array} array
 * @return {Array}
 */


function copy(array) {
  var i,
      len = array.length,
      arr_clone = new Array(len);

  for (i = 0; i < len; i += 1) {
    arr_clone[i] = array[i];
  }

  return arr_clone;
}

js.array = {
  remove: remove,
  fastRemove: fastRemove,
  removeAt: removeAt,
  fastRemoveAt: fastRemoveAt,
  contains: contains,
  verifyType: verifyType,
  removeArray: removeArray,
  appendObjectsAt: appendObjectsAt,
  copy: copy,
  indexOf: indexOf,
  MutableForwardIterator: require('../utils/mutable-forward-iterator')
}; // OBJECT POOL

/**
 * !#en
 * A fixed-length object pool designed for general type.<br>
 * The implementation of this object pool is very simple,
 * it can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 * !#zh
 * 长度固定的对象缓存池，可以用来缓存各种对象类型。<br/>
 * 这个对象池的实现非常精简，它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁。
 * @class Pool
 * @example
 *
 *Example 1:
 *
 *function Details () {
 *    this.uuidList = [];
 *};
 *Details.prototype.reset = function () {
 *    this.uuidList.length = 0;
 *};
 *Details.pool = new js.Pool(function (obj) {
 *    obj.reset();
 *}, 5);
 *Details.pool.get = function () {
 *    return this._get() || new Details();
 *};
 *
 *var detail = Details.pool.get();
 *...
 *Details.pool.put(detail);
 *
 *Example 2:
 *
 *function Details (buffer) {
 *    this.uuidList = buffer;
 *};
 *...
 *Details.pool.get = function (buffer) {
 *    var cached = this._get();
 *    if (cached) {
 *        cached.uuidList = buffer;
 *        return cached;
 *    }
 *    else {
 *        return new Details(buffer);
 *    }
 *};
 *
 *var detail = Details.pool.get( [] );
 *...
 */

/**
 * !#en
 * Constructor for creating an object pool for the specific object type.
 * You can pass a callback argument for process the cleanup logic when the object is recycled.
 * !#zh
 * 使用构造函数来创建一个指定对象类型的对象池，您可以传递一个回调函数，用于处理对象回收时的清理逻辑。
 * @method constructor
 * @param {Function} [cleanupFunc] - the callback method used to process the cleanup logic when the object is recycled.
 * @param {Object} cleanupFunc.obj
 * @param {Number} size - initializes the length of the array
 * @typescript
 * constructor(cleanupFunc: (obj: any) => void, size: number)
 * constructor(size: number)
 */

function Pool(cleanupFunc, size) {
  if (size === undefined) {
    size = cleanupFunc;
    cleanupFunc = null;
  }

  this.get = null;
  this.count = 0;
  this._pool = new Array(size);
  this._cleanup = cleanupFunc;
}
/**
 * !#en
 * Get and initialize an object from pool. This method defaults to null and requires the user to implement it.
 * !#zh
 * 获取并初始化对象池中的对象。这个方法默认为空，需要用户自己实现。
 * @method get
 * @param {any} ...params - parameters to used to initialize the object
 * @returns {Object}
 */

/**
 * !#en
 * The current number of available objects, the default is 0, it will gradually increase with the recycle of the object,
 * the maximum will not exceed the size specified when the constructor is called.
 * !#zh
 * 当前可用对象数量，一开始默认是 0，随着对象的回收会逐渐增大，最大不会超过调用构造函数时指定的 size。
 * @property {Number} count
 * @default 0
 */

/**
 * !#en
 * Get an object from pool, if no available object in the pool, null will be returned.
 * !#zh
 * 获取对象池中的对象，如果对象池没有可用对象，则返回空。
 * @method _get
 * @returns {Object|null}
 */


Pool.prototype._get = function () {
  if (this.count > 0) {
    --this.count;
    var cache = this._pool[this.count];
    this._pool[this.count] = null;
    return cache;
  }

  return null;
};
/**
 * !#en Put an object into the pool.
 * !#zh 向对象池返还一个不再需要的对象。
 * @method put
 */


Pool.prototype.put = function (obj) {
  var pool = this._pool;

  if (this.count < pool.length) {
    if (this._cleanup && this._cleanup(obj) === false) {
      return;
    }

    pool[this.count] = obj;
    ++this.count;
  }
};
/**
 * !#en Resize the pool.
 * !#zh 设置对象池容量。
 * @method resize
 */


Pool.prototype.resize = function (length) {
  if (length >= 0) {
    this._pool.length = length;

    if (this.count > length) {
      this.count = length;
    }
  }
};

js.Pool = Pool; //

cc.js = js;
module.exports = js; // fix submodule pollute ...

/**
 * @submodule cc
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzLmpzIl0sIm5hbWVzIjpbInRlbXBDSURHZW5lcmF0ZXIiLCJyZXF1aXJlIiwiX2dldFByb3BlcnR5RGVzY3JpcHRvciIsIm9iaiIsIm5hbWUiLCJwZCIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImdldFByb3RvdHlwZU9mIiwiX2NvcHlwcm9wIiwic291cmNlIiwidGFyZ2V0IiwiZGVmaW5lUHJvcGVydHkiLCJqcyIsImlzTnVtYmVyIiwiTnVtYmVyIiwiaXNTdHJpbmciLCJTdHJpbmciLCJhZGRvbiIsImkiLCJsZW5ndGgiLCJhcmd1bWVudHMiLCJjYyIsImVycm9ySUQiLCJtaXhpbiIsImV4dGVuZCIsImNscyIsImJhc2UiLCJDQ19ERVYiLCJrZXlzIiwicHJvdG90eXBlIiwicCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJ2YWx1ZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiZ2V0U3VwZXIiLCJjdG9yIiwicHJvdG8iLCJkdW5kZXJQcm90byIsImlzQ2hpbGRDbGFzc09mIiwic3ViY2xhc3MiLCJzdXBlcmNsYXNzIiwid2FybklEIiwiY2xlYXIiLCJpc0VtcHR5T2JqZWN0Iiwia2V5IiwiZ2V0UHJvcGVydHlEZXNjcmlwdG9yIiwidG1wVmFsdWVEZXNjIiwidW5kZWZpbmVkIiwiZW51bWVyYWJsZSIsInByb3AiLCJ0bXBHZXRTZXREZXNjIiwiZ2V0Iiwic2V0IiwiZ2V0c2V0IiwiZ2V0dGVyIiwic2V0dGVyIiwidG1wR2V0RGVzYyIsInRtcFNldERlc2MiLCJnZXRDbGFzc05hbWUiLCJvYmpPckN0b3IiLCJfX2NsYXNzbmFtZV9fIiwicmV0dmFsIiwidG9TdHJpbmciLCJhcnIiLCJzdHIiLCJjaGFyQXQiLCJtYXRjaCIsImlzVGVtcENsYXNzSWQiLCJpZCIsInN0YXJ0c1dpdGgiLCJwcmVmaXgiLCJfaWRUb0NsYXNzIiwiX25hbWVUb0NsYXNzIiwic2V0dXAiLCJwdWJsaWNOYW1lIiwidGFibGUiLCJhc3NpZ24iLCJyZWdpc3RlcmVkIiwiZXJyb3IiLCJDQ19URVNUIiwiX3NldENsYXNzSWQiLCJkb1NldENsYXNzTmFtZSIsInNldENsYXNzTmFtZSIsImNsYXNzTmFtZSIsImdldE5ld0lkIiwidW5yZWdpc3RlckNsYXNzIiwiY2xhc3NJZCIsIl9fY2lkX18iLCJjbGFzc25hbWUiLCJfZ2V0Q2xhc3NCeUlkIiwiZ2V0Q2xhc3NCeU5hbWUiLCJfZ2V0Q2xhc3NJZCIsImFsbG93VGVtcElkIiwicmVzIiwiQ0NfRURJVE9SIiwib2Jzb2xldGUiLCJvYnNvbGV0ZWQiLCJuZXdFeHByIiwiZXh0cmFjdFByb3BOYW1lIiwib2xkUHJvcCIsImV4ZWMiLCJuZXdQcm9wIiwib2Jzb2xldGVzIiwib2JqTmFtZSIsInByb3BzIiwibmV3TmFtZSIsIlJFR0VYUF9OVU1fT1JfU1RSIiwiUkVHRVhQX1NUUiIsImZvcm1hdFN0ciIsImFyZ0xlbiIsIm1zZyIsImhhc1N1YnN0aXR1dGlvbiIsInRlc3QiLCJhcmciLCJyZWdFeHBUb1Rlc3QiLCJyZXBsYWNlIiwic2hpZnRBcmd1bWVudHMiLCJsZW4iLCJhcmdzIiwiQXJyYXkiLCJjcmVhdGVNYXAiLCJmb3JjZURpY3RNb2RlIiwibWFwIiwiSU5WQUxJRF9JREVOVElGSUVSXzEiLCJJTlZBTElEX0lERU5USUZJRVJfMiIsInJlbW92ZUF0IiwiYXJyYXkiLCJpbmRleCIsInNwbGljZSIsImZhc3RSZW1vdmVBdCIsInJlbW92ZSIsImluZGV4T2YiLCJmYXN0UmVtb3ZlIiwidmVyaWZ5VHlwZSIsInR5cGUiLCJsb2dJRCIsInJlbW92ZUFycmF5IiwibWludXNBcnIiLCJsIiwiYXBwZW5kT2JqZWN0c0F0IiwiYWRkT2JqcyIsImFwcGx5IiwiY29uY2F0IiwiY29udGFpbnMiLCJjb3B5IiwiYXJyX2Nsb25lIiwiTXV0YWJsZUZvcndhcmRJdGVyYXRvciIsIlBvb2wiLCJjbGVhbnVwRnVuYyIsInNpemUiLCJjb3VudCIsIl9wb29sIiwiX2NsZWFudXAiLCJfZ2V0Iiwi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dGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IHRlbXBDSURHZW5lcmF0ZXIgPSBuZXcgKHJlcXVpcmUoJy4vaWQtZ2VuZXJhdGVyJykpKCdUbXBDSWQuJyk7XG5cblxuZnVuY3Rpb24gX2dldFByb3BlcnR5RGVzY3JpcHRvciAob2JqLCBuYW1lKSB7XG4gICAgd2hpbGUgKG9iaikge1xuICAgICAgICB2YXIgcGQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG4gICAgICAgIGlmIChwZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBkO1xuICAgICAgICB9XG4gICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gX2NvcHlwcm9wKG5hbWUsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgdmFyIHBkID0gX2dldFByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHBkKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBzb21lIEphdmFTY3JpcHQgdXRpbGl0aWVzLlxuICogQWxsIG1lbWJlcnMgY2FuIGJlIGFjY2Vzc2VkIHdpdGggXCJjYy5qc1wiLlxuICogQHN1Ym1vZHVsZSBqc1xuICogQG1vZHVsZSBqc1xuICovXG52YXIganMgPSB7XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB0aGUgb2JqIHdoZXRoZXIgaXMgbnVtYmVyIG9yIG5vdFxuICAgICAqIElmIGEgbnVtYmVyIGlzIGNyZWF0ZWQgYnkgdXNpbmcgJ25ldyBOdW1iZXIoMTAwODYpJywgdGhlIHR5cGVvZiBpdCB3aWxsIGJlIFwib2JqZWN0XCIuLi5cbiAgICAgKiBUaGVuIHlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb24gaWYgeW91IGNhcmUgYWJvdXQgdGhpcyBjYXNlLlxuICAgICAqIEBtZXRob2QgaXNOdW1iZXJcbiAgICAgKiBAcGFyYW0geyp9IG9ialxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzTnVtYmVyOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IG9iaiBpbnN0YW5jZW9mIE51bWJlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhlIG9iaiB3aGV0aGVyIGlzIHN0cmluZyBvciBub3QuXG4gICAgICogSWYgYSBzdHJpbmcgaXMgY3JlYXRlZCBieSB1c2luZyAnbmV3IFN0cmluZyhcImJsYWJsYVwiKScsIHRoZSB0eXBlb2YgaXQgd2lsbCBiZSBcIm9iamVjdFwiLi4uXG4gICAgICogVGhlbiB5b3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIGlmIHlvdSBjYXJlIGFib3V0IHRoaXMgY2FzZS5cbiAgICAgKiBAbWV0aG9kIGlzU3RyaW5nXG4gICAgICogQHBhcmFtIHsqfSBvYmpcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1N0cmluZzogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fCBvYmogaW5zdGFuY2VvZiBTdHJpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvcHkgYWxsIHByb3BlcnRpZXMgbm90IGRlZmluZWQgaW4gb2JqIGZyb20gYXJndW1lbnRzWzEuLi5uXVxuICAgICAqIEBtZXRob2QgYWRkb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIG9iamVjdCB0byBleHRlbmQgaXRzIHByb3BlcnRpZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gLi4uc291cmNlT2JqIHNvdXJjZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSByZXN1bHQgb2JqXG4gICAgICovXG4gICAgYWRkb246IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICBvYmogPSBvYmogfHwge307XG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTQwMiwgc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBuYW1lIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEobmFtZSBpbiBvYmopICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NvcHlwcm9wKCBuYW1lLCBzb3VyY2UsIG9iaik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY29weSBhbGwgcHJvcGVydGllcyBmcm9tIGFyZ3VtZW50c1sxLi4ubl0gdG8gb2JqXG4gICAgICogQG1ldGhvZCBtaXhpblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gLi4uc291cmNlT2JqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcmVzdWx0IG9ialxuICAgICAqL1xuICAgIG1peGluOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgb2JqID0gb2JqIHx8IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDU0MDMsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbmFtZSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgX2NvcHlwcm9wKCBuYW1lLCBzb3VyY2UsIG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERlcml2ZSB0aGUgY2xhc3MgZnJvbSB0aGUgc3VwcGxpZWQgYmFzZSBjbGFzcy5cbiAgICAgKiBCb3RoIGNsYXNzZXMgYXJlIGp1c3QgbmF0aXZlIGphdmFzY3JpcHQgY29uc3RydWN0b3JzLCBub3QgY3JlYXRlZCBieSBjYy5DbGFzcywgc29cbiAgICAgKiB1c3VhbGx5IHlvdSB3aWxsIHdhbnQgdG8gaW5oZXJpdCB1c2luZyB7eyNjcm9zc0xpbmsgXCJjYy9DbGFzczptZXRob2RcIn19Y2MuQ2xhc3Mge3svY3Jvc3NMaW5rfX0gaW5zdGVhZC5cbiAgICAgKiBAbWV0aG9kIGV4dGVuZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNsc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGJhc2UgLSB0aGUgYmFzZWNsYXNzIHRvIGluaGVyaXRcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIHJlc3VsdCBjbGFzc1xuICAgICAqL1xuICAgIGV4dGVuZDogZnVuY3Rpb24gKGNscywgYmFzZSkge1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBpZiAoIWJhc2UpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDU0MDQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY2xzKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg1NDA1KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY2xzLnByb3RvdHlwZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTQwNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgcCBpbiBiYXNlKSBpZiAoYmFzZS5oYXNPd25Qcm9wZXJ0eShwKSkgY2xzW3BdID0gYmFzZVtwXTtcbiAgICAgICAgY2xzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoYmFzZS5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGNscyxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBzdXBlciBjbGFzc1xuICAgICAqIEBtZXRob2QgZ2V0U3VwZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yIC0gdGhlIGNvbnN0cnVjdG9yIG9mIHN1YmNsYXNzXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZ2V0U3VwZXIgKGN0b3IpIHtcbiAgICAgICAgdmFyIHByb3RvID0gY3Rvci5wcm90b3R5cGU7IC8vIGJpbmRlZCBmdW5jdGlvbiBkbyBub3QgaGF2ZSBwcm90b3R5cGVcbiAgICAgICAgdmFyIGR1bmRlclByb3RvID0gcHJvdG8gJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICAgICAgcmV0dXJuIGR1bmRlclByb3RvICYmIGR1bmRlclByb3RvLmNvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBzdWJjbGFzcyBpcyBjaGlsZCBvZiBzdXBlcmNsYXNzIG9yIGVxdWFscyB0byBzdXBlcmNsYXNzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGlzQ2hpbGRDbGFzc09mXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3ViY2xhc3NcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlcmNsYXNzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0NoaWxkQ2xhc3NPZiAoc3ViY2xhc3MsIHN1cGVyY2xhc3MpIHtcbiAgICAgICAgaWYgKHN1YmNsYXNzICYmIHN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3ViY2xhc3MgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHN1cGVyY2xhc3MgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjI1LCBzdXBlcmNsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1YmNsYXNzID09PSBzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICAgICAgc3ViY2xhc3MgPSBqcy5nZXRTdXBlcihzdWJjbGFzcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWJjbGFzcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdWJjbGFzcyA9PT0gc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBlbnVtZXJhYmxlIHByb3BlcnRpZXMgZnJvbSBvYmplY3RcbiAgICAgKiBAbWV0aG9kIGNsZWFyXG4gICAgICogQHBhcmFtIHthbnl9IG9ialxuICAgICAqL1xuICAgIGNsZWFyOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqW2tleXNbaV1dO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIG9iaiBpcyBhbiBlbXB0eSBvYmplY3RcbiAgICAgKiBAbWV0aG9kIGlzRW1wdHlPYmplY3RcbiAgICAgKiBAcGFyYW0ge2FueX0gb2JqIFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcHJvcGVydHkgZGVzY3JpcHRvciBpbiBvYmplY3QgYW5kIGFsbCBpdHMgYW5jZXN0b3JzXG4gICAgICogQG1ldGhvZCBnZXRQcm9wZXJ0eURlc2NyaXB0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlEZXNjcmlwdG9yOiBfZ2V0UHJvcGVydHlEZXNjcmlwdG9yXG59O1xuXG5cbnZhciB0bXBWYWx1ZURlc2MgPSB7XG4gICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG59O1xuXG4vKipcbiAqIERlZmluZSB2YWx1ZSwganVzdCBoZWxwIHRvIGNhbGwgT2JqZWN0LmRlZmluZVByb3BlcnR5Ljxicj5cbiAqIFRoZSBjb25maWd1cmFibGUgd2lsbCBiZSB0cnVlLlxuICogQG1ldGhvZCB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHBhcmFtIHtCb29sZWFufSBbd3JpdGFibGU9ZmFsc2VdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtlbnVtZXJhYmxlPWZhbHNlXVxuICovXG5qcy52YWx1ZSA9IGZ1bmN0aW9uIChvYmosIHByb3AsIHZhbHVlLCB3cml0YWJsZSwgZW51bWVyYWJsZSkge1xuICAgIHRtcFZhbHVlRGVzYy52YWx1ZSA9IHZhbHVlO1xuICAgIHRtcFZhbHVlRGVzYy53cml0YWJsZSA9IHdyaXRhYmxlO1xuICAgIHRtcFZhbHVlRGVzYy5lbnVtZXJhYmxlID0gZW51bWVyYWJsZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB0bXBWYWx1ZURlc2MpO1xuICAgIHRtcFZhbHVlRGVzYy52YWx1ZSA9IHVuZGVmaW5lZDtcbn07XG5cbnZhciB0bXBHZXRTZXREZXNjID0ge1xuICAgIGdldDogbnVsbCxcbiAgICBzZXQ6IG51bGwsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG59O1xuXG4vKipcbiAqIERlZmluZSBnZXQgc2V0IGFjY2Vzc29yLCBqdXN0IGhlbHAgdG8gY2FsbCBPYmplY3QuZGVmaW5lUHJvcGVydHkoLi4uKVxuICogQG1ldGhvZCBnZXRzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXR0ZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0ZXI9bnVsbF1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2VudW1lcmFibGU9ZmFsc2VdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWd1cmFibGU9ZmFsc2VdXG4gKi9cbmpzLmdldHNldCA9IGZ1bmN0aW9uIChvYmosIHByb3AsIGdldHRlciwgc2V0dGVyLCBlbnVtZXJhYmxlLCBjb25maWd1cmFibGUpIHtcbiAgICBpZiAodHlwZW9mIHNldHRlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbnVtZXJhYmxlID0gc2V0dGVyO1xuICAgICAgICBzZXR0ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRtcEdldFNldERlc2MuZ2V0ID0gZ2V0dGVyO1xuICAgIHRtcEdldFNldERlc2Muc2V0ID0gc2V0dGVyO1xuICAgIHRtcEdldFNldERlc2MuZW51bWVyYWJsZSA9IGVudW1lcmFibGU7XG4gICAgdG1wR2V0U2V0RGVzYy5jb25maWd1cmFibGUgPSBjb25maWd1cmFibGU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgdG1wR2V0U2V0RGVzYyk7XG4gICAgdG1wR2V0U2V0RGVzYy5nZXQgPSBudWxsO1xuICAgIHRtcEdldFNldERlc2Muc2V0ID0gbnVsbDtcbn07XG5cbnZhciB0bXBHZXREZXNjID0ge1xuICAgIGdldDogbnVsbCxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlXG59O1xuXG4vKipcbiAqIERlZmluZSBnZXQgYWNjZXNzb3IsIGp1c3QgaGVscCB0byBjYWxsIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSguLi4pXG4gKiBAbWV0aG9kIGdldFxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldHRlclxuICogQHBhcmFtIHtCb29sZWFufSBbZW51bWVyYWJsZT1mYWxzZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZ3VyYWJsZT1mYWxzZV1cbiAqL1xuanMuZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcHJvcCwgZ2V0dGVyLCBlbnVtZXJhYmxlLCBjb25maWd1cmFibGUpIHtcbiAgICB0bXBHZXREZXNjLmdldCA9IGdldHRlcjtcbiAgICB0bXBHZXREZXNjLmVudW1lcmFibGUgPSBlbnVtZXJhYmxlO1xuICAgIHRtcEdldERlc2MuY29uZmlndXJhYmxlID0gY29uZmlndXJhYmxlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIHRtcEdldERlc2MpO1xuICAgIHRtcEdldERlc2MuZ2V0ID0gbnVsbDtcbn07XG5cbnZhciB0bXBTZXREZXNjID0ge1xuICAgIHNldDogbnVsbCxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlXG59O1xuXG4vKipcbiAqIERlZmluZSBzZXQgYWNjZXNzb3IsIGp1c3QgaGVscCB0byBjYWxsIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSguLi4pXG4gKiBAbWV0aG9kIHNldFxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHNldHRlclxuICogQHBhcmFtIHtCb29sZWFufSBbZW51bWVyYWJsZT1mYWxzZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZ3VyYWJsZT1mYWxzZV1cbiAqL1xuanMuc2V0ID0gZnVuY3Rpb24gKG9iaiwgcHJvcCwgc2V0dGVyLCBlbnVtZXJhYmxlLCBjb25maWd1cmFibGUpIHtcbiAgICB0bXBTZXREZXNjLnNldCA9IHNldHRlcjtcbiAgICB0bXBTZXREZXNjLmVudW1lcmFibGUgPSBlbnVtZXJhYmxlO1xuICAgIHRtcFNldERlc2MuY29uZmlndXJhYmxlID0gY29uZmlndXJhYmxlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIHRtcFNldERlc2MpO1xuICAgIHRtcFNldERlc2Muc2V0ID0gbnVsbDtcbn07XG5cbi8qKlxuICogR2V0IGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgb2JqZWN0IGlzIGp1c3QgYSB7fSAoYW5kIHdoaWNoIGNsYXNzIG5hbWVkICdPYmplY3QnKSwgaXQgd2lsbCByZXR1cm4gXCJcIi5cbiAqIChtb2RpZmllZCBmcm9tIDxhIGhyZWY9XCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyNDk1MzEvaG93LXRvLWdldC1hLWphdmFzY3JpcHQtb2JqZWN0cy1jbGFzc1wiPnRoZSBjb2RlIGZyb20gdGhpcyBzdGFja292ZXJmbG93IHBvc3Q8L2E+KVxuICogQG1ldGhvZCBnZXRDbGFzc05hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBvYmpPckN0b3IgLSBpbnN0YW5jZSBvciBjb25zdHJ1Y3RvclxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5qcy5nZXRDbGFzc05hbWUgPSBmdW5jdGlvbiAob2JqT3JDdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBvYmpPckN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iak9yQ3Rvci5wcm90b3R5cGU7XG4gICAgICAgIGlmIChwcm90b3R5cGUgJiYgcHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2NsYXNzbmFtZV9fJykgJiYgcHJvdG90eXBlLl9fY2xhc3NuYW1lX18pIHtcbiAgICAgICAgICAgIHJldHVybiBwcm90b3R5cGUuX19jbGFzc25hbWVfXztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0dmFsID0gJyc7XG4gICAgICAgIC8vICBmb3IgYnJvd3NlcnMgd2hpY2ggaGF2ZSBuYW1lIHByb3BlcnR5IGluIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgb2JqZWN0LCBzdWNoIGFzIGNocm9tZVxuICAgICAgICBpZiAob2JqT3JDdG9yLm5hbWUpIHtcbiAgICAgICAgICAgIHJldHZhbCA9IG9iak9yQ3Rvci5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmpPckN0b3IudG9TdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBhcnIsIHN0ciA9IG9iak9yQ3Rvci50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICdbJykge1xuICAgICAgICAgICAgICAgIC8vIHN0ciBpcyBcIltvYmplY3Qgb2JqZWN0Q2xhc3NdXCJcbiAgICAgICAgICAgICAgICBhcnIgPSBzdHIubWF0Y2goL1xcW1xcdytcXHMqKFxcdyspXFxdLyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzdHIgaXMgZnVuY3Rpb24gb2JqZWN0Q2xhc3MgKCkge30gZm9yIElFIEZpcmVmb3hcbiAgICAgICAgICAgICAgICBhcnIgPSBzdHIubWF0Y2goL2Z1bmN0aW9uXFxzKihcXHcrKS8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyciAmJiBhcnIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dmFsID0gYXJyWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWwgIT09ICdPYmplY3QnID8gcmV0dmFsIDogJyc7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9iak9yQ3RvciAmJiBvYmpPckN0b3IuY29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGpzLmdldENsYXNzTmFtZShvYmpPckN0b3IuY29uc3RydWN0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59O1xuXG5mdW5jdGlvbiBpc1RlbXBDbGFzc0lkIChpZCkge1xuICAgIHJldHVybiB0eXBlb2YgaWQgIT09ICdzdHJpbmcnIHx8IGlkLnN0YXJ0c1dpdGgodGVtcENJREdlbmVyYXRlci5wcmVmaXgpO1xufVxuXG4vLyBpZCDms6jlhoxcbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9pZFRvQ2xhc3MgPSB7fTtcbiAgICB2YXIgX25hbWVUb0NsYXNzID0ge307XG5cbiAgICBmdW5jdGlvbiBzZXR1cCAoa2V5LCBwdWJsaWNOYW1lLCB0YWJsZSkge1xuICAgICAgICBqcy5nZXRzZXQoanMsIHB1YmxpY05hbWUsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRhYmxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBqcy5jbGVhcih0YWJsZSk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0YWJsZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlkLCBjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgLy8gZGVyZWdpc3RlciBvbGRcbiAgICAgICAgICAgIGlmIChjb25zdHJ1Y3Rvci5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0YWJsZVtjb25zdHJ1Y3Rvci5wcm90b3R5cGVba2V5XV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcy52YWx1ZShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIGtleSwgaWQpO1xuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY2xhc3NcbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIHZhciByZWdpc3RlcmVkID0gdGFibGVbaWRdO1xuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkICYmIHJlZ2lzdGVyZWQgIT09IGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9ICdBIENsYXNzIGFscmVhZHkgZXhpc3RzIHdpdGggdGhlIHNhbWUgJyArIGtleSArICcgOiBcIicgKyBpZCArICdcIi4nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfVEVTVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgKz0gJyAoVGhpcyBtYXkgYmUgY2F1c2VkIGJ5IGVycm9yIG9mIHVuaXQgdGVzdC4pIFxcXG5JZiB5b3UgZG9udCBuZWVkIHNlcmlhbGl6YXRpb24sIHlvdSBjYW4gc2V0IGNsYXNzIGlkIHRvIFwiXCIuIFlvdSBjYW4gYWxzbyBjYWxsIFxcXG5jYy5qcy51bnJlZ2lzdGVyQ2xhc3MgdG8gcmVtb3ZlIHRoZSBpZCBvZiB1bnVzZWQgY2xhc3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW2lkXSA9IGNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2lmIChpZCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIC8vICAgIGNvbnNvbGUudHJhY2UoXCJcIiwgdGFibGUgPT09IF9uYW1lVG9DbGFzcyk7XG4gICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgdGhlIGNsYXNzIGJ5IHNwZWNpZmllZCBpZCwgaWYgaXRzIGNsYXNzbmFtZSBpcyBub3QgZGVmaW5lZCwgdGhlIGNsYXNzIG5hbWUgd2lsbCBhbHNvIGJlIHNldC5cbiAgICAgKiBAbWV0aG9kIF9zZXRDbGFzc0lkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgLyoqXG4gICAgICogISNlbiBBbGwgY2xhc3NlcyByZWdpc3RlcmVkIGluIHRoZSBlbmdpbmUsIGluZGV4ZWQgYnkgSUQuXG4gICAgICogISN6aCDlvJXmk47kuK3lt7Lms6jlhoznmoTmiYDmnInnsbvlnovvvIzpgJrov4cgSUQg6L+b6KGM57Si5byV44CCXG4gICAgICogQHByb3BlcnR5IF9yZWdpc3RlcmVkQ2xhc3NJZHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHNhdmUgYWxsIHJlZ2lzdGVyZWQgY2xhc3NlcyBiZWZvcmUgbG9hZGluZyBzY3JpcHRzXG4gICAgICogbGV0IGJ1aWx0aW5DbGFzc0lkcyA9IGNjLmpzLl9yZWdpc3RlcmVkQ2xhc3NJZHM7XG4gICAgICogbGV0IGJ1aWx0aW5DbGFzc05hbWVzID0gY2MuanMuX3JlZ2lzdGVyZWRDbGFzc05hbWVzO1xuICAgICAqIC8vIGxvYWQgc29tZSBzY3JpcHRzIHRoYXQgY29udGFpbiBDQ0NsYXNzXG4gICAgICogLi4uXG4gICAgICogLy8gY2xlYXIgYWxsIGxvYWRlZCBjbGFzc2VzXG4gICAgICogY2MuanMuX3JlZ2lzdGVyZWRDbGFzc0lkcyA9IGJ1aWx0aW5DbGFzc0lkcztcbiAgICAgKiBjYy5qcy5fcmVnaXN0ZXJlZENsYXNzTmFtZXMgPSBidWlsdGluQ2xhc3NOYW1lcztcbiAgICAgKi9cbiAgICBqcy5fc2V0Q2xhc3NJZCA9IHNldHVwKCdfX2NpZF9fJywgJ19yZWdpc3RlcmVkQ2xhc3NJZHMnLCBfaWRUb0NsYXNzKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWxsIGNsYXNzZXMgcmVnaXN0ZXJlZCBpbiB0aGUgZW5naW5lLCBpbmRleGVkIGJ5IG5hbWUuXG4gICAgICogISN6aCDlvJXmk47kuK3lt7Lms6jlhoznmoTmiYDmnInnsbvlnovvvIzpgJrov4flkI3np7Dov5vooYzntKLlvJXjgIJcbiAgICAgKiBAcHJvcGVydHkgX3JlZ2lzdGVyZWRDbGFzc05hbWVzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBzYXZlIGFsbCByZWdpc3RlcmVkIGNsYXNzZXMgYmVmb3JlIGxvYWRpbmcgc2NyaXB0c1xuICAgICAqIGxldCBidWlsdGluQ2xhc3NJZHMgPSBjYy5qcy5fcmVnaXN0ZXJlZENsYXNzSWRzO1xuICAgICAqIGxldCBidWlsdGluQ2xhc3NOYW1lcyA9IGNjLmpzLl9yZWdpc3RlcmVkQ2xhc3NOYW1lcztcbiAgICAgKiAvLyBsb2FkIHNvbWUgc2NyaXB0cyB0aGF0IGNvbnRhaW4gQ0NDbGFzc1xuICAgICAqIC4uLlxuICAgICAqIC8vIGNsZWFyIGFsbCBsb2FkZWQgY2xhc3Nlc1xuICAgICAqIGNjLmpzLl9yZWdpc3RlcmVkQ2xhc3NJZHMgPSBidWlsdGluQ2xhc3NJZHM7XG4gICAgICogY2MuanMuX3JlZ2lzdGVyZWRDbGFzc05hbWVzID0gYnVpbHRpbkNsYXNzTmFtZXM7XG4gICAgICovXG4gICAgdmFyIGRvU2V0Q2xhc3NOYW1lID0gc2V0dXAoJ19fY2xhc3NuYW1lX18nLCAnX3JlZ2lzdGVyZWRDbGFzc05hbWVzJywgX25hbWVUb0NsYXNzKTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIHRoZSBjbGFzcyBieSBzcGVjaWZpZWQgbmFtZSBtYW51YWxseVxuICAgICAqIEBtZXRob2Qgc2V0Q2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAganMuc2V0Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSwgY29uc3RydWN0b3IpIHtcbiAgICAgICAgZG9TZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvcik7XG4gICAgICAgIC8vIGF1dG8gc2V0IGNsYXNzIGlkXG4gICAgICAgIGlmICghY29uc3RydWN0b3IucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2NpZF9fJykpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGNsYXNzTmFtZSB8fCB0ZW1wQ0lER2VuZXJhdGVyLmdldE5ld0lkKCk7XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBqcy5fc2V0Q2xhc3NJZChpZCwgY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVucmVnaXN0ZXIgYSBjbGFzcyBmcm9tIGZpcmViYWxsLlxuICAgICAqXG4gICAgICogSWYgeW91IGRvbnQgbmVlZCBhIHJlZ2lzdGVyZWQgY2xhc3MgYW55bW9yZSwgeW91IHNob3VsZCB1bnJlZ2lzdGVyIHRoZSBjbGFzcyBzbyB0aGF0IEZpcmViYWxsIHdpbGwgbm90IGtlZXAgaXRzIHJlZmVyZW5jZSBhbnltb3JlLlxuICAgICAqIFBsZWFzZSBub3RlIHRoYXQgaXRzIHN0aWxsIHlvdXIgcmVzcG9uc2liaWxpdHkgdG8gZnJlZSBvdGhlciByZWZlcmVuY2VzIHRvIHRoZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgdW5yZWdpc3RlckNsYXNzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gLi4uY29uc3RydWN0b3IgLSB0aGUgY2xhc3MgeW91IHdpbGwgd2FudCB0byB1bnJlZ2lzdGVyLCBhbnkgbnVtYmVyIG9mIGNsYXNzZXMgY2FuIGJlIGFkZGVkXG4gICAgICovXG4gICAganMudW5yZWdpc3RlckNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHAgPSBhcmd1bWVudHNbaV0ucHJvdG90eXBlO1xuICAgICAgICAgICAgdmFyIGNsYXNzSWQgPSBwLl9fY2lkX187XG4gICAgICAgICAgICBpZiAoY2xhc3NJZCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfaWRUb0NsYXNzW2NsYXNzSWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNsYXNzbmFtZSA9IHAuX19jbGFzc25hbWVfXztcbiAgICAgICAgICAgIGlmIChjbGFzc25hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgX25hbWVUb0NsYXNzW2NsYXNzbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSByZWdpc3RlcmVkIGNsYXNzIGJ5IGlkXG4gICAgICogQG1ldGhvZCBfZ2V0Q2xhc3NCeUlkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWRcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gY29uc3RydWN0b3JcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGpzLl9nZXRDbGFzc0J5SWQgPSBmdW5jdGlvbiAoY2xhc3NJZCkge1xuICAgICAgICByZXR1cm4gX2lkVG9DbGFzc1tjbGFzc0lkXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSByZWdpc3RlcmVkIGNsYXNzIGJ5IG5hbWVcbiAgICAgKiBAbWV0aG9kIGdldENsYXNzQnlOYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzbmFtZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGpzLmdldENsYXNzQnlOYW1lID0gZnVuY3Rpb24gKGNsYXNzbmFtZSkge1xuICAgICAgICByZXR1cm4gX25hbWVUb0NsYXNzW2NsYXNzbmFtZV07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCBjbGFzcyBpZCBvZiB0aGUgb2JqZWN0XG4gICAgICogQG1ldGhvZCBfZ2V0Q2xhc3NJZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBvYmogLSBpbnN0YW5jZSBvciBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FsbG93VGVtcElkPXRydWVdIC0gY2FuIHJldHVybiB0ZW1wIGlkIGluIGVkaXRvclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGpzLl9nZXRDbGFzc0lkID0gZnVuY3Rpb24gKG9iaiwgYWxsb3dUZW1wSWQpIHtcbiAgICAgICAgYWxsb3dUZW1wSWQgPSAodHlwZW9mIGFsbG93VGVtcElkICE9PSAndW5kZWZpbmVkJyA/IGFsbG93VGVtcElkOiB0cnVlKTtcblxuICAgICAgICB2YXIgcmVzO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmoucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2NpZF9fJykpIHtcbiAgICAgICAgICAgIHJlcyA9IG9iai5wcm90b3R5cGUuX19jaWRfXztcbiAgICAgICAgICAgIGlmICghYWxsb3dUZW1wSWQgJiYgKENDX0RFViB8fCBDQ19FRElUT1IpICYmIGlzVGVtcENsYXNzSWQocmVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iaiAmJiBvYmouY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmouY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgICAgICAgaWYgKHByb3RvdHlwZSAmJiBwcm90b3R5cGUuaGFzT3duUHJvcGVydHkoJ19fY2lkX18nKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG9iai5fX2NpZF9fO1xuICAgICAgICAgICAgICAgIGlmICghYWxsb3dUZW1wSWQgJiYgKENDX0RFViB8fCBDQ19FRElUT1IpICYmIGlzVGVtcENsYXNzSWQocmVzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIERlZmluZXMgYSBwb2x5ZmlsbCBmaWVsZCBmb3Igb2Jzb2xldGVkIGNvZGVzLlxuICogQG1ldGhvZCBvYnNvbGV0ZVxuICogQHBhcmFtIHthbnl9IG9iaiAtIFlvdXJPYmplY3Qgb3IgWW91ckNsYXNzLnByb3RvdHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IG9ic29sZXRlZCAtIFwiT2xkUGFyYW1cIiBvciBcIllvdXJDbGFzcy5PbGRQYXJhbVwiXG4gKiBAcGFyYW0ge1N0cmluZ30gbmV3RXhwciAtIFwiTmV3UGFyYW1cIiBvciBcIllvdXJDbGFzcy5OZXdQYXJhbVwiXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3cml0YWJsZT1mYWxzZV1cbiAqL1xuanMub2Jzb2xldGUgPSBmdW5jdGlvbiAob2JqLCBvYnNvbGV0ZWQsIG5ld0V4cHIsIHdyaXRhYmxlKSB7XG4gICAgdmFyIGV4dHJhY3RQcm9wTmFtZSA9IC8oW14uXSspJC87XG4gICAgdmFyIG9sZFByb3AgPSBleHRyYWN0UHJvcE5hbWUuZXhlYyhvYnNvbGV0ZWQpWzBdO1xuICAgIHZhciBuZXdQcm9wID0gZXh0cmFjdFByb3BOYW1lLmV4ZWMobmV3RXhwcilbMF07XG4gICAgZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgY2Mud2FybklEKDU0MDAsIG9ic29sZXRlZCwgbmV3RXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNbbmV3UHJvcF07XG4gICAgfVxuICAgIGlmICh3cml0YWJsZSkge1xuICAgICAgICBqcy5nZXRzZXQob2JqLCBvbGRQcm9wLFxuICAgICAgICAgICAgZ2V0LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoNTQwMSwgb2Jzb2xldGVkLCBuZXdFeHByKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpc1tuZXdQcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAganMuZ2V0KG9iaiwgb2xkUHJvcCwgZ2V0KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIERlZmluZXMgYWxsIHBvbHlmaWxsIGZpZWxkcyBmb3Igb2Jzb2xldGVkIGNvZGVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBwcm9wcy5cbiAqIEBtZXRob2Qgb2Jzb2xldGVzXG4gKiBAcGFyYW0ge2FueX0gb2JqIC0gWW91ck9iamVjdCBvciBZb3VyQ2xhc3MucHJvdG90eXBlXG4gKiBAcGFyYW0ge2FueX0gb2JqTmFtZSAtIFwiWW91ck9iamVjdFwiIG9yIFwiWW91ckNsYXNzXCJcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICogQHBhcmFtIHtCb29sZWFufSBbd3JpdGFibGU9ZmFsc2VdXG4gKi9cbmpzLm9ic29sZXRlcyA9IGZ1bmN0aW9uIChvYmosIG9iak5hbWUsIHByb3BzLCB3cml0YWJsZSkge1xuICAgIGZvciAodmFyIG9ic29sZXRlZCBpbiBwcm9wcykge1xuICAgICAgICB2YXIgbmV3TmFtZSA9IHByb3BzW29ic29sZXRlZF07XG4gICAgICAgIGpzLm9ic29sZXRlKG9iaiwgb2JqTmFtZSArICcuJyArIG9ic29sZXRlZCwgbmV3TmFtZSwgd3JpdGFibGUpO1xuICAgIH1cbn07XG5cbnZhciBSRUdFWFBfTlVNX09SX1NUUiA9IC8oJWQpfCglcykvO1xudmFyIFJFR0VYUF9TVFIgPSAvJXMvO1xuXG4vKipcbiAqIEEgc3RyaW5nIHRvb2wgdG8gY29uc3RydWN0IGEgc3RyaW5nIHdpdGggZm9ybWF0IHN0cmluZy5cbiAqIEBtZXRob2QgZm9ybWF0U3RyXG4gKiBAcGFyYW0ge1N0cmluZ3xhbnl9IG1zZyAtIEEgSmF2YVNjcmlwdCBzdHJpbmcgY29udGFpbmluZyB6ZXJvIG9yIG1vcmUgc3Vic3RpdHV0aW9uIHN0cmluZ3MgKCVzKS5cbiAqIEBwYXJhbSB7YW55fSAuLi5zdWJzdCAtIEphdmFTY3JpcHQgb2JqZWN0cyB3aXRoIHdoaWNoIHRvIHJlcGxhY2Ugc3Vic3RpdHV0aW9uIHN0cmluZ3Mgd2l0aGluIG1zZy4gVGhpcyBnaXZlcyB5b3UgYWRkaXRpb25hbCBjb250cm9sIG92ZXIgdGhlIGZvcm1hdCBvZiB0aGUgb3V0cHV0LlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBleGFtcGxlXG4gKiBjYy5qcy5mb3JtYXRTdHIoXCJhOiAlcywgYjogJXNcIiwgYSwgYik7XG4gKiBjYy5qcy5mb3JtYXRTdHIoYSwgYiwgYyk7XG4gKi9cbmpzLmZvcm1hdFN0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJnTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoYXJnTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIG1zZyA9IGFyZ3VtZW50c1swXTtcbiAgICBpZiAoYXJnTGVuID09PSAxKSB7XG4gICAgICAgIHJldHVybiAnJyArIG1zZztcbiAgICB9XG5cbiAgICB2YXIgaGFzU3Vic3RpdHV0aW9uID0gdHlwZW9mIG1zZyA9PT0gJ3N0cmluZycgJiYgUkVHRVhQX05VTV9PUl9TVFIudGVzdChtc2cpO1xuICAgIGlmIChoYXNTdWJzdGl0dXRpb24pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcmdMZW47ICsraSkge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIHZhciByZWdFeHBUb1Rlc3QgPSB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyA/IFJFR0VYUF9OVU1fT1JfU1RSIDogUkVHRVhQX1NUUjtcbiAgICAgICAgICAgIGlmIChyZWdFeHBUb1Rlc3QudGVzdChtc2cpKVxuICAgICAgICAgICAgICAgIG1zZyA9IG1zZy5yZXBsYWNlKHJlZ0V4cFRvVGVzdCwgYXJnKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtc2cgKz0gJyAnICsgYXJnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ0xlbjsgKytpKSB7XG4gICAgICAgICAgICBtc2cgKz0gJyAnICsgYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtc2c7XG59O1xuXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9pc3N1ZXMvMTM4OVxuanMuc2hpZnRBcmd1bWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGxlbik7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgIH1cbiAgICByZXR1cm4gYXJncztcbn07XG5cbi8qKlxuICogISNlblxuICogQSBzaW1wbGUgd3JhcHBlciBvZiBgT2JqZWN0LmNyZWF0ZShudWxsKWAgd2hpY2ggZW5zdXJlcyB0aGUgcmV0dXJuIG9iamVjdCBoYXZlIG5vIHByb3RvdHlwZSAoYW5kIHRodXMgbm8gaW5oZXJpdGVkIG1lbWJlcnMpLiBTbyB3ZSBjYW4gc2tpcCBgaGFzT3duUHJvcGVydHlgIGNhbGxzIG9uIHByb3BlcnR5IGxvb2t1cHMuIEl0IGlzIGEgd29ydGh3aGlsZSBvcHRpbWl6YXRpb24gdGhhbiB0aGUgYHt9YCBsaXRlcmFsIHdoZW4gYGhhc093blByb3BlcnR5YCBjYWxscyBhcmUgbmVjZXNzYXJ5LlxuICogISN6aFxuICog6K+l5pa55rOV5piv5a+5IGBPYmplY3QuY3JlYXRlKG51bGwpYCDnmoTnroDljZXlsIHoo4XjgIJgT2JqZWN0LmNyZWF0ZShudWxsKWAg55So5LqO5Yib5bu65pegIHByb3RvdHlwZSDvvIjkuZ/lsLHml6Dnu6fmib/vvInnmoTnqbrlr7nosaHjgILov5nmoLfmiJHku6zlnKjor6Xlr7nosaHkuIrmn6Xmib7lsZ7mgKfml7bvvIzlsLHkuI3nlKjov5vooYwgYGhhc093blByb3BlcnR5YCDliKTmlq3jgILlnKjpnIDopoHpopHnuYHliKTmlq0gYGhhc093blByb3BlcnR5YCDml7bvvIzkvb/nlKjov5nkuKrmlrnms5XmgKfog73kvJrmr5QgYHt9YCDmm7Tpq5jjgIJcbiAqXG4gKiBAbWV0aG9kIGNyZWF0ZU1hcFxuICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VEaWN0TW9kZT1mYWxzZV0gLSBBcHBseSB0aGUgZGVsZXRlIG9wZXJhdG9yIHRvIG5ld2x5IGNyZWF0ZWQgbWFwIG9iamVjdC4gVGhpcyBjYXVzZXMgVjggdG8gcHV0IHRoZSBvYmplY3QgaW4gXCJkaWN0aW9uYXJ5IG1vZGVcIiBhbmQgZGlzYWJsZXMgY3JlYXRpb24gb2YgaGlkZGVuIGNsYXNzZXMgd2hpY2ggYXJlIHZlcnkgZXhwZW5zaXZlIGZvciBvYmplY3RzIHRoYXQgYXJlIGNvbnN0YW50bHkgY2hhbmdpbmcgc2hhcGUuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmpzLmNyZWF0ZU1hcCA9IGZ1bmN0aW9uIChmb3JjZURpY3RNb2RlKSB7XG4gICAgdmFyIG1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgaWYgKGZvcmNlRGljdE1vZGUpIHtcbiAgICAgICAgY29uc3QgSU5WQUxJRF9JREVOVElGSUVSXzEgPSAnLic7XG4gICAgICAgIGNvbnN0IElOVkFMSURfSURFTlRJRklFUl8yID0gJy8nO1xuICAgICAgICBtYXBbSU5WQUxJRF9JREVOVElGSUVSXzFdID0gdHJ1ZTtcbiAgICAgICAgbWFwW0lOVkFMSURfSURFTlRJRklFUl8yXSA9IHRydWU7XG4gICAgICAgIGRlbGV0ZSBtYXBbSU5WQUxJRF9JREVOVElGSUVSXzFdO1xuICAgICAgICBkZWxldGUgbWFwW0lOVkFMSURfSURFTlRJRklFUl8yXTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbn07XG5cbi8qKlxuICogQGNsYXNzIGFycmF5XG4gKiBAc3RhdGljXG4gKi9cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBhcnJheSBpdGVtIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gKiBAbWV0aG9kIHJlbW92ZUF0XG4gKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUF0IChhcnJheSwgaW5kZXgpIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGFycmF5IGl0ZW0gYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAqIEl0J3MgZmFzdGVyIGJ1dCB0aGUgb3JkZXIgb2YgdGhlIGFycmF5IHdpbGwgYmUgY2hhbmdlZC5cbiAqIEBtZXRob2QgZmFzdFJlbW92ZUF0XG4gKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKi9cbmZ1bmN0aW9uIGZhc3RSZW1vdmVBdCAoYXJyYXksIGluZGV4KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFycmF5W2luZGV4XSA9IGFycmF5W2xlbmd0aCAtIDFdO1xuICAgIGFycmF5Lmxlbmd0aCA9IGxlbmd0aCAtIDE7XG59XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIHNwZWNpZmljIG9iamVjdCBmcm9tIHRoZSBhcnJheS5cbiAqIEBtZXRob2QgcmVtb3ZlXG4gKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiByZW1vdmUgKGFycmF5LCB2YWx1ZSkge1xuICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YodmFsdWUpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIHJlbW92ZUF0KGFycmF5LCBpbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGEgc3BlY2lmaWMgb2JqZWN0IGZyb20gdGhlIGFycmF5LlxuICogSXQncyBmYXN0ZXIgYnV0IHRoZSBvcmRlciBvZiB0aGUgYXJyYXkgd2lsbCBiZSBjaGFuZ2VkLlxuICogQG1ldGhvZCBmYXN0UmVtb3ZlXG4gKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIGZhc3RSZW1vdmUgKGFycmF5LCB2YWx1ZSkge1xuICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YodmFsdWUpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGFycmF5W2luZGV4XSA9IGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAtLWFycmF5Lmxlbmd0aDtcbiAgICB9XG59XG5cbi8qKlxuICogVmVyaWZ5IGFycmF5J3MgVHlwZVxuICogQG1ldGhvZCB2ZXJpZnlUeXBlXG4gKiBAcGFyYW0ge2FycmF5fSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHlwZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gdmVyaWZ5VHlwZSAoYXJyYXksIHR5cGUpIHtcbiAgICBpZiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShhcnJheVtpXSBpbnN0YW5jZW9mICB0eXBlKSkge1xuICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDEzMDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGZyb20gYXJyYXkgYWxsIHZhbHVlcyBpbiBtaW51c0Fyci4gRm9yIGVhY2ggVmFsdWUgaW4gbWludXNBcnIsIHRoZSBmaXJzdCBtYXRjaGluZyBpbnN0YW5jZSBpbiBhcnJheSB3aWxsIGJlIHJlbW92ZWQuXG4gKiBAbWV0aG9kIHJlbW92ZUFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBTb3VyY2UgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IG1pbnVzQXJyIG1pbnVzIEFycmF5XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFycmF5IChhcnJheSwgbWludXNBcnIpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG1pbnVzQXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICByZW1vdmUoYXJyYXksIG1pbnVzQXJyW2ldKTtcbiAgICB9XG59XG5cbi8qKlxuICogSW5zZXJ0cyBzb21lIG9iamVjdHMgYXQgaW5kZXhcbiAqIEBtZXRob2QgYXBwZW5kT2JqZWN0c0F0XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICogQHBhcmFtIHtBcnJheX0gYWRkT2Jqc1xuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXBwZW5kT2JqZWN0c0F0IChhcnJheSwgYWRkT2JqcywgaW5kZXgpIHtcbiAgICBhcnJheS5zcGxpY2UuYXBwbHkoYXJyYXksIFtpbmRleCwgMF0uY29uY2F0KGFkZE9ianMpKTtcbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogRXhhY3Qgc2FtZSBmdW5jdGlvbiBhcyBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi48YnI+XG4gKiBIQUNLOiB1Z2xpeSBoYWNrIGZvciBCYWlkdSBtb2JpbGUgYnJvd3NlciBjb21wYXRpYmlsaXR5LCBzdHVwaWQgQmFpZHUgZ3V5cyBtb2RpZnkgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgZm9yIGFsbCBwYWdlcyBsb2FkZWQsIHRoZWlyIHZlcnNpb24gY2hhbmdlcyBzdHJpY3QgY29tcGFyaXNvbiB0byBub24tc3RyaWN0IGNvbXBhcmlzb24sIGl0IGFsc28gaWdub3JlcyB0aGUgc2Vjb25kIHBhcmFtZXRlciBvZiB0aGUgb3JpZ2luYWwgQVBJLCBhbmQgdGhpcyB3aWxsIGNhdXNlIGV2ZW50IGhhbmRsZXIgZW50ZXIgaW5maW5pdGUgbG9vcC48YnI+XG4gKiBCYWlkdSBkZXZlbG9wZXJzLCBpZiB5b3UgZXZlciBzZWUgdGhpcyBkb2N1bWVudGF0aW9uLCBoZXJlIGlzIHRoZSBzdGFuZGFyZDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaW5kZXhPZiwgU2VyaW91c2x5IVxuICpcbiAqIEBtZXRob2QgaW5kZXhPZlxuICogQHBhcmFtIHthbnl9IHNlYXJjaEVsZW1lbnQgLSBFbGVtZW50IHRvIGxvY2F0ZSBpbiB0aGUgYXJyYXkuXG4gKiBAcGFyYW0ge051bWJlcn0gW2Zyb21JbmRleD0wXSAtIFRoZSBpbmRleCB0byBzdGFydCB0aGUgc2VhcmNoIGF0XG4gKiBAcmV0dXJuIHtOdW1iZXJ9IC0gdGhlIGZpcnN0IGluZGV4IGF0IHdoaWNoIGEgZ2l2ZW4gZWxlbWVudCBjYW4gYmUgZm91bmQgaW4gdGhlIGFycmF5LCBvciAtMSBpZiBpdCBpcyBub3QgcHJlc2VudC5cbiAqL1xudmFyIGluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGFycmF5IGNvbnRhaW5zIGEgc3BlY2lmaWMgdmFsdWUuXG4gKiBAbWV0aG9kIGNvbnRhaW5zXG4gKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBjb250YWlucyAoYXJyYXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpID49IDA7XG59XG5cbi8qKlxuICogQ29weSBhbiBhcnJheSdzIGl0ZW0gdG8gYSBuZXcgYXJyYXkgKGl0cyBwZXJmb3JtYW5jZSBpcyBiZXR0ZXIgdGhhbiBBcnJheS5zbGljZSlcbiAqIEBtZXRob2QgY29weVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBjb3B5IChhcnJheSkge1xuICAgIHZhciBpLCBsZW4gPSBhcnJheS5sZW5ndGgsIGFycl9jbG9uZSA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYXJyX2Nsb25lW2ldID0gYXJyYXlbaV07XG4gICAgcmV0dXJuIGFycl9jbG9uZTtcbn1cblxuanMuYXJyYXkgPSB7XG4gICAgcmVtb3ZlLFxuICAgIGZhc3RSZW1vdmUsXG4gICAgcmVtb3ZlQXQsXG4gICAgZmFzdFJlbW92ZUF0LFxuICAgIGNvbnRhaW5zLFxuICAgIHZlcmlmeVR5cGUsXG4gICAgcmVtb3ZlQXJyYXksXG4gICAgYXBwZW5kT2JqZWN0c0F0LFxuICAgIGNvcHksXG4gICAgaW5kZXhPZixcbiAgICBNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yOiByZXF1aXJlKCcuLi91dGlscy9tdXRhYmxlLWZvcndhcmQtaXRlcmF0b3InKVxufTtcblxuLy8gT0JKRUNUIFBPT0xcblxuLyoqXG4gKiAhI2VuXG4gKiBBIGZpeGVkLWxlbmd0aCBvYmplY3QgcG9vbCBkZXNpZ25lZCBmb3IgZ2VuZXJhbCB0eXBlLjxicj5cbiAqIFRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG9iamVjdCBwb29sIGlzIHZlcnkgc2ltcGxlLFxuICogaXQgY2FuIGhlbHBzIHlvdSB0byBpbXByb3ZlIHlvdXIgZ2FtZSBwZXJmb3JtYW5jZSBmb3Igb2JqZWN0cyB3aGljaCBuZWVkIGZyZXF1ZW50IHJlbGVhc2UgYW5kIHJlY3JlYXRlIG9wZXJhdGlvbnM8YnIvPlxuICogISN6aFxuICog6ZW/5bqm5Zu65a6a55qE5a+56LGh57yT5a2Y5rGg77yM5Y+v5Lul55So5p2l57yT5a2Y5ZCE56eN5a+56LGh57G75Z6L44CCPGJyLz5cbiAqIOi/meS4quWvueixoeaxoOeahOWunueOsOmdnuW4uOeyvueugO+8jOWug+WPr+S7peW4ruWKqeaCqOaPkOmrmOa4uOaIj+aAp+iDve+8jOmAgueUqOS6juS8mOWMluWvueixoeeahOWPjeWkjeWIm+W7uuWSjOmUgOavgeOAglxuICogQGNsYXNzIFBvb2xcbiAqIEBleGFtcGxlXG4gKlxuICpFeGFtcGxlIDE6XG4gKlxuICpmdW5jdGlvbiBEZXRhaWxzICgpIHtcbiAqICAgIHRoaXMudXVpZExpc3QgPSBbXTtcbiAqfTtcbiAqRGV0YWlscy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gKiAgICB0aGlzLnV1aWRMaXN0Lmxlbmd0aCA9IDA7XG4gKn07XG4gKkRldGFpbHMucG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChvYmopIHtcbiAqICAgIG9iai5yZXNldCgpO1xuICp9LCA1KTtcbiAqRGV0YWlscy5wb29sLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAqICAgIHJldHVybiB0aGlzLl9nZXQoKSB8fCBuZXcgRGV0YWlscygpO1xuICp9O1xuICpcbiAqdmFyIGRldGFpbCA9IERldGFpbHMucG9vbC5nZXQoKTtcbiAqLi4uXG4gKkRldGFpbHMucG9vbC5wdXQoZGV0YWlsKTtcbiAqXG4gKkV4YW1wbGUgMjpcbiAqXG4gKmZ1bmN0aW9uIERldGFpbHMgKGJ1ZmZlcikge1xuICogICAgdGhpcy51dWlkTGlzdCA9IGJ1ZmZlcjtcbiAqfTtcbiAqLi4uXG4gKkRldGFpbHMucG9vbC5nZXQgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gKiAgICB2YXIgY2FjaGVkID0gdGhpcy5fZ2V0KCk7XG4gKiAgICBpZiAoY2FjaGVkKSB7XG4gKiAgICAgICAgY2FjaGVkLnV1aWRMaXN0ID0gYnVmZmVyO1xuICogICAgICAgIHJldHVybiBjYWNoZWQ7XG4gKiAgICB9XG4gKiAgICBlbHNlIHtcbiAqICAgICAgICByZXR1cm4gbmV3IERldGFpbHMoYnVmZmVyKTtcbiAqICAgIH1cbiAqfTtcbiAqXG4gKnZhciBkZXRhaWwgPSBEZXRhaWxzLnBvb2wuZ2V0KCBbXSApO1xuICouLi5cbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBDb25zdHJ1Y3RvciBmb3IgY3JlYXRpbmcgYW4gb2JqZWN0IHBvb2wgZm9yIHRoZSBzcGVjaWZpYyBvYmplY3QgdHlwZS5cbiAqIFlvdSBjYW4gcGFzcyBhIGNhbGxiYWNrIGFyZ3VtZW50IGZvciBwcm9jZXNzIHRoZSBjbGVhbnVwIGxvZ2ljIHdoZW4gdGhlIG9iamVjdCBpcyByZWN5Y2xlZC5cbiAqICEjemhcbiAqIOS9v+eUqOaehOmAoOWHveaVsOadpeWIm+W7uuS4gOS4quaMh+WumuWvueixoeexu+Wei+eahOWvueixoeaxoO+8jOaCqOWPr+S7peS8oOmAkuS4gOS4quWbnuiwg+WHveaVsO+8jOeUqOS6juWkhOeQhuWvueixoeWbnuaUtuaXtueahOa4heeQhumAu+i+keOAglxuICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NsZWFudXBGdW5jXSAtIHRoZSBjYWxsYmFjayBtZXRob2QgdXNlZCB0byBwcm9jZXNzIHRoZSBjbGVhbnVwIGxvZ2ljIHdoZW4gdGhlIG9iamVjdCBpcyByZWN5Y2xlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjbGVhbnVwRnVuYy5vYmpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIC0gaW5pdGlhbGl6ZXMgdGhlIGxlbmd0aCBvZiB0aGUgYXJyYXlcbiAqIEB0eXBlc2NyaXB0XG4gKiBjb25zdHJ1Y3RvcihjbGVhbnVwRnVuYzogKG9iajogYW55KSA9PiB2b2lkLCBzaXplOiBudW1iZXIpXG4gKiBjb25zdHJ1Y3RvcihzaXplOiBudW1iZXIpXG4gKi9cbmZ1bmN0aW9uIFBvb2wgKGNsZWFudXBGdW5jLCBzaXplKSB7XG4gICAgaWYgKHNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzaXplID0gY2xlYW51cEZ1bmM7XG4gICAgICAgIGNsZWFudXBGdW5jID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5nZXQgPSBudWxsO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuX3Bvb2wgPSBuZXcgQXJyYXkoc2l6ZSk7XG4gICAgdGhpcy5fY2xlYW51cCA9IGNsZWFudXBGdW5jO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIEdldCBhbmQgaW5pdGlhbGl6ZSBhbiBvYmplY3QgZnJvbSBwb29sLiBUaGlzIG1ldGhvZCBkZWZhdWx0cyB0byBudWxsIGFuZCByZXF1aXJlcyB0aGUgdXNlciB0byBpbXBsZW1lbnQgaXQuXG4gKiAhI3poXG4gKiDojrflj5blubbliJ3lp4vljJblr7nosaHmsaDkuK3nmoTlr7nosaHjgILov5nkuKrmlrnms5Xpu5jorqTkuLrnqbrvvIzpnIDopoHnlKjmiLfoh6rlt7Hlrp7njrDjgIJcbiAqIEBtZXRob2QgZ2V0XG4gKiBAcGFyYW0ge2FueX0gLi4ucGFyYW1zIC0gcGFyYW1ldGVycyB0byB1c2VkIHRvIGluaXRpYWxpemUgdGhlIG9iamVjdFxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBjdXJyZW50IG51bWJlciBvZiBhdmFpbGFibGUgb2JqZWN0cywgdGhlIGRlZmF1bHQgaXMgMCwgaXQgd2lsbCBncmFkdWFsbHkgaW5jcmVhc2Ugd2l0aCB0aGUgcmVjeWNsZSBvZiB0aGUgb2JqZWN0LFxuICogdGhlIG1heGltdW0gd2lsbCBub3QgZXhjZWVkIHRoZSBzaXplIHNwZWNpZmllZCB3aGVuIHRoZSBjb25zdHJ1Y3RvciBpcyBjYWxsZWQuXG4gKiAhI3poXG4gKiDlvZPliY3lj6/nlKjlr7nosaHmlbDph4/vvIzkuIDlvIDlp4vpu5jorqTmmK8gMO+8jOmaj+edgOWvueixoeeahOWbnuaUtuS8mumAkOa4kOWinuWkp++8jOacgOWkp+S4jeS8mui2hei/h+iwg+eUqOaehOmAoOWHveaVsOaXtuaMh+WumueahCBzaXpl44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gY291bnRcbiAqIEBkZWZhdWx0IDBcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEdldCBhbiBvYmplY3QgZnJvbSBwb29sLCBpZiBubyBhdmFpbGFibGUgb2JqZWN0IGluIHRoZSBwb29sLCBudWxsIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiAhI3poXG4gKiDojrflj5blr7nosaHmsaDkuK3nmoTlr7nosaHvvIzlpoLmnpzlr7nosaHmsaDmsqHmnInlj6/nlKjlr7nosaHvvIzliJnov5Tlm57nqbrjgIJcbiAqIEBtZXRob2QgX2dldFxuICogQHJldHVybnMge09iamVjdHxudWxsfVxuICovXG5Qb29sLnByb3RvdHlwZS5fZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmNvdW50ID4gMCkge1xuICAgICAgICAtLXRoaXMuY291bnQ7XG4gICAgICAgIHZhciBjYWNoZSA9IHRoaXMuX3Bvb2xbdGhpcy5jb3VudF07XG4gICAgICAgIHRoaXMuX3Bvb2xbdGhpcy5jb3VudF0gPSBudWxsO1xuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiAhI2VuIFB1dCBhbiBvYmplY3QgaW50byB0aGUgcG9vbC5cbiAqICEjemgg5ZCR5a+56LGh5rGg6L+U6L+Y5LiA5Liq5LiN5YaN6ZyA6KaB55qE5a+56LGh44CCXG4gKiBAbWV0aG9kIHB1dFxuICovXG5Qb29sLnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHBvb2wgPSB0aGlzLl9wb29sO1xuICAgIGlmICh0aGlzLmNvdW50IDwgcG9vbC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NsZWFudXAgJiYgdGhpcy5fY2xlYW51cChvYmopID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBvb2xbdGhpcy5jb3VudF0gPSBvYmo7XG4gICAgICAgICsrdGhpcy5jb3VudDtcbiAgICB9XG59O1xuXG4vKipcbiAqICEjZW4gUmVzaXplIHRoZSBwb29sLlxuICogISN6aCDorr7nva7lr7nosaHmsaDlrrnph4/jgIJcbiAqIEBtZXRob2QgcmVzaXplXG4gKi9cblBvb2wucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICBpZiAobGVuZ3RoID49IDApIHtcbiAgICAgICAgdGhpcy5fcG9vbC5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIGlmICh0aGlzLmNvdW50ID4gbGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50ID0gbGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuanMuUG9vbCA9IFBvb2w7XG5cbi8vXG5cbmNjLmpzID0ganM7XG5cbm1vZHVsZS5leHBvcnRzID0ganM7XG5cbi8vIGZpeCBzdWJtb2R1bGUgcG9sbHV0ZSAuLi5cbi8qKlxuICogQHN1Ym1vZHVsZSBjY1xuICovXG4iXX0=