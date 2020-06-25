
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/attribute.js';
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

var isPlainEmptyObj = require('./utils').isPlainEmptyObj_DEV;

var DELIMETER = '$_$';

function createAttrsSingle(owner, superAttrs) {
  var attrs = superAttrs ? Object.create(superAttrs) : {};
  js.value(owner, '__attrs__', attrs);
  return attrs;
} // subclass should not have __attrs__


function createAttrs(subclass) {
  if (typeof subclass !== 'function') {
    // attributes only in instance
    var instance = subclass;
    return createAttrsSingle(instance, getClassAttrs(instance.constructor));
  }

  var superClass;
  var chains = cc.Class.getInheritanceChain(subclass);

  for (var i = chains.length - 1; i >= 0; i--) {
    var cls = chains[i];

    var attrs = cls.hasOwnProperty('__attrs__') && cls.__attrs__;

    if (!attrs) {
      superClass = chains[i + 1];
      createAttrsSingle(cls, superClass && superClass.__attrs__);
    }
  }

  superClass = chains[0];
  createAttrsSingle(subclass, superClass && superClass.__attrs__);
  return subclass.__attrs__;
} // /**
//  * @class Class
//  */
//  *
//  * Tag the class with any meta attributes, then return all current attributes assigned to it.
//  * This function holds only the attributes, not their implementations.
//  *
//  * @method attr
//  * @param {Function|Object} ctor - the class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
//  * @param {String} propName - the name of property or function, used to retrieve the attributes
//  * @param {Object} [newAttrs] - the attribute table to mark, new attributes will merged with existed attributes. Attribute whose key starts with '_' will be ignored.
//  * @static
//  * @private


function attr(ctor, propName, newAttrs) {
  var attrs = getClassAttrs(ctor);

  if (!CC_DEV || typeof newAttrs === 'undefined') {
    // get
    var prefix = propName + DELIMETER;
    var ret = {};

    for (var key in attrs) {
      if (key.startsWith(prefix)) {
        ret[key.slice(prefix.length)] = attrs[key];
      }
    }

    return ret;
  } else if (CC_DEV && typeof newAttrs === 'object') {
    // set
    cc.warn("`cc.Class.attr(obj, prop, { key: value });` is deprecated, use `cc.Class.Attr.setClassAttr(obj, prop, 'key', value);` instead please.");

    for (var _key in newAttrs) {
      attrs[propName + DELIMETER + _key] = newAttrs[_key];
    }
  }
} // returns a readonly meta object


function getClassAttrs(ctor) {
  return ctor.hasOwnProperty('__attrs__') && ctor.__attrs__ || createAttrs(ctor);
}

function setClassAttr(ctor, propName, key, value) {
  getClassAttrs(ctor)[propName + DELIMETER + key] = value;
}
/**
 * @module cc
 */


function PrimitiveType(name, def) {
  this.name = name;
  this["default"] = def;
}

PrimitiveType.prototype.toString = function () {
  return this.name;
};
/**
 * Specify that the input value must be integer in Inspector.
 * Also used to indicates that the elements in array should be type integer.
 * @property {string} Integer
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Integer
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Integer
 * })
 * member = [];
 */


cc.Integer = new PrimitiveType('Integer', 0);
/**
 * Indicates that the elements in array should be type double.
 * @property {string} Float
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Float
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Float
 * })
 * member = [];
 */

cc.Float = new PrimitiveType('Float', 0);

if (CC_EDITOR) {
  js.get(cc, 'Number', function () {
    cc.warnID(3603);
    return cc.Float;
  });
}
/**
 * Indicates that the elements in array should be type boolean.
 * @property {string} Boolean
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Boolean
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Boolean
 * })
 * member = [];
 */


cc.Boolean = new PrimitiveType('Boolean', false);
/**
 * Indicates that the elements in array should be type string.
 * @property {string} String
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.String
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.String
 * })
 * member = [];
 */

cc.String = new PrimitiveType('String', ''); // Ensures the type matches its default value

function getTypeChecker(type, attrName) {
  return function (constructor, mainPropName) {
    var propInfo = '"' + js.getClassName(constructor) + '.' + mainPropName + '"';
    var mainPropAttrs = attr(constructor, mainPropName);

    if (!mainPropAttrs.saveUrlAsAsset) {
      var mainPropAttrsType = mainPropAttrs.type;

      if (mainPropAttrsType === cc.Integer || mainPropAttrsType === cc.Float) {
        mainPropAttrsType = 'Number';
      } else if (mainPropAttrsType === cc.String || mainPropAttrsType === cc.Boolean) {
        mainPropAttrsType = '' + mainPropAttrsType;
      }

      if (mainPropAttrsType !== type) {
        cc.warnID(3604, propInfo);
        return;
      }
    }

    if (!mainPropAttrs.hasOwnProperty('default')) {
      return;
    }

    var defaultVal = mainPropAttrs["default"];

    if (typeof defaultVal === 'undefined') {
      return;
    }

    var isContainer = Array.isArray(defaultVal) || isPlainEmptyObj(defaultVal);

    if (isContainer) {
      return;
    }

    var defaultType = typeof defaultVal;
    var type_lowerCase = type.toLowerCase();

    if (defaultType === type_lowerCase) {
      if (!mainPropAttrs.saveUrlAsAsset) {
        if (type_lowerCase === 'object') {
          if (defaultVal && !(defaultVal instanceof mainPropAttrs.ctor)) {
            cc.warnID(3605, propInfo, js.getClassName(mainPropAttrs.ctor));
          } else {
            return;
          }
        } else if (type !== 'Number') {
          cc.warnID(3606, attrName, propInfo, type);
        }
      }
    } else if (defaultType !== 'function') {
      if (type === cc.String && defaultVal == null) {
        if (!js.isChildClassOf(mainPropAttrs.ctor, cc.RawAsset)) {
          cc.warnID(3607, propInfo);
        }
      } else {
        cc.warnID(3611, attrName, propInfo, defaultType);
      }
    } else {
      return;
    }

    delete mainPropAttrs.type;
  };
} // Ensures the type matches its default value


function getObjTypeChecker(typeCtor) {
  return function (classCtor, mainPropName) {
    getTypeChecker('Object', 'type')(classCtor, mainPropName); // check ValueType

    var defaultDef = getClassAttrs(classCtor)[mainPropName + DELIMETER + 'default'];

    var defaultVal = require('./CCClass').getDefault(defaultDef);

    if (!Array.isArray(defaultVal) && js.isChildClassOf(typeCtor, cc.ValueType)) {
      var typename = js.getClassName(typeCtor);
      var info = cc.js.formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.', js.getClassName(classCtor), mainPropName, typename);

      if (defaultDef) {
        cc.log(info);
      } else {
        cc.warnID(3612, info, typename, js.getClassName(classCtor), mainPropName, typename);
      }
    }
  };
}

module.exports = {
  PrimitiveType: PrimitiveType,
  attr: attr,
  getClassAttrs: getClassAttrs,
  setClassAttr: setClassAttr,
  DELIMETER: DELIMETER,
  getTypeChecker_ET: (CC_EDITOR && !Editor.isBuilder || CC_TEST) && getTypeChecker,
  getObjTypeChecker_ET: (CC_EDITOR && !Editor.isBuilder || CC_TEST) && getObjTypeChecker,
  ScriptUuid: {} // the value will be represented as a uuid string

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZS5qcyJdLCJuYW1lcyI6WyJqcyIsInJlcXVpcmUiLCJpc1BsYWluRW1wdHlPYmoiLCJpc1BsYWluRW1wdHlPYmpfREVWIiwiREVMSU1FVEVSIiwiY3JlYXRlQXR0cnNTaW5nbGUiLCJvd25lciIsInN1cGVyQXR0cnMiLCJhdHRycyIsIk9iamVjdCIsImNyZWF0ZSIsInZhbHVlIiwiY3JlYXRlQXR0cnMiLCJzdWJjbGFzcyIsImluc3RhbmNlIiwiZ2V0Q2xhc3NBdHRycyIsImNvbnN0cnVjdG9yIiwic3VwZXJDbGFzcyIsImNoYWlucyIsImNjIiwiQ2xhc3MiLCJnZXRJbmhlcml0YW5jZUNoYWluIiwiaSIsImxlbmd0aCIsImNscyIsImhhc093blByb3BlcnR5IiwiX19hdHRyc19fIiwiYXR0ciIsImN0b3IiLCJwcm9wTmFtZSIsIm5ld0F0dHJzIiwiQ0NfREVWIiwicHJlZml4IiwicmV0Iiwia2V5Iiwic3RhcnRzV2l0aCIsInNsaWNlIiwid2FybiIsInNldENsYXNzQXR0ciIsIlByaW1pdGl2ZVR5cGUiLCJuYW1lIiwiZGVmIiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJJbnRlZ2VyIiwiRmxvYXQiLCJDQ19FRElUT1IiLCJnZXQiLCJ3YXJuSUQiLCJCb29sZWFuIiwiU3RyaW5nIiwiZ2V0VHlwZUNoZWNrZXIiLCJ0eXBlIiwiYXR0ck5hbWUiLCJtYWluUHJvcE5hbWUiLCJwcm9wSW5mbyIsImdldENsYXNzTmFtZSIsIm1haW5Qcm9wQXR0cnMiLCJzYXZlVXJsQXNBc3NldCIsIm1haW5Qcm9wQXR0cnNUeXBlIiwiZGVmYXVsdFZhbCIsImlzQ29udGFpbmVyIiwiQXJyYXkiLCJpc0FycmF5IiwiZGVmYXVsdFR5cGUiLCJ0eXBlX2xvd2VyQ2FzZSIsInRvTG93ZXJDYXNlIiwiaXNDaGlsZENsYXNzT2YiLCJSYXdBc3NldCIsImdldE9ialR5cGVDaGVja2VyIiwidHlwZUN0b3IiLCJjbGFzc0N0b3IiLCJkZWZhdWx0RGVmIiwiZ2V0RGVmYXVsdCIsIlZhbHVlVHlwZSIsInR5cGVuYW1lIiwiaW5mbyIsImZvcm1hdFN0ciIsImxvZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRUeXBlQ2hlY2tlcl9FVCIsIkVkaXRvciIsImlzQnVpbGRlciIsIkNDX1RFU1QiLCJnZXRPYmpUeXBlQ2hlY2tlcl9FVCIsIlNjcmlwdFV1aWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQWhCOztBQUNBLElBQUlDLGVBQWUsR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQkUsbUJBQXpDOztBQUVBLElBQU1DLFNBQVMsR0FBRyxLQUFsQjs7QUFFQSxTQUFTQyxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBbUNDLFVBQW5DLEVBQStDO0FBQzNDLE1BQUlDLEtBQUssR0FBR0QsVUFBVSxHQUFHRSxNQUFNLENBQUNDLE1BQVAsQ0FBY0gsVUFBZCxDQUFILEdBQStCLEVBQXJEO0FBQ0FQLEVBQUFBLEVBQUUsQ0FBQ1csS0FBSCxDQUFTTCxLQUFULEVBQWdCLFdBQWhCLEVBQTZCRSxLQUE3QjtBQUNBLFNBQU9BLEtBQVA7QUFDSCxFQUVEOzs7QUFDQSxTQUFTSSxXQUFULENBQXNCQyxRQUF0QixFQUFnQztBQUM1QixNQUFJLE9BQU9BLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDaEM7QUFDQSxRQUFJQyxRQUFRLEdBQUdELFFBQWY7QUFDQSxXQUFPUixpQkFBaUIsQ0FBQ1MsUUFBRCxFQUFXQyxhQUFhLENBQUNELFFBQVEsQ0FBQ0UsV0FBVixDQUF4QixDQUF4QjtBQUNIOztBQUNELE1BQUlDLFVBQUo7QUFDQSxNQUFJQyxNQUFNLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTQyxtQkFBVCxDQUE2QlIsUUFBN0IsQ0FBYjs7QUFDQSxPQUFLLElBQUlTLENBQUMsR0FBR0osTUFBTSxDQUFDSyxNQUFQLEdBQWdCLENBQTdCLEVBQWdDRCxDQUFD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QUFFdkMsU0FBUyxJQUFJLENBQUNvQyxNQUFNLENBQUNDLFNBQXRCLElBQW9DQyxPQUFyQyxLQUFpRGYsaUJBUDFEO0FBUWJpQixFQUFBQSxVQUFVLEVBQUUsRUFSQyxDQVFROztBQVJSLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIganMgPSByZXF1aXJlKCcuL2pzJyk7XG52YXIgaXNQbGFpbkVtcHR5T2JqID0gcmVxdWlyZSgnLi91dGlscycpLmlzUGxhaW5FbXB0eU9ial9ERVY7XG5cbmNvbnN0IERFTElNRVRFUiA9ICckXyQnO1xuXG5mdW5jdGlvbiBjcmVhdGVBdHRyc1NpbmdsZSAob3duZXIsIHN1cGVyQXR0cnMpIHtcbiAgICB2YXIgYXR0cnMgPSBzdXBlckF0dHJzID8gT2JqZWN0LmNyZWF0ZShzdXBlckF0dHJzKSA6IHt9O1xuICAgIGpzLnZhbHVlKG93bmVyLCAnX19hdHRyc19fJywgYXR0cnMpO1xuICAgIHJldHVybiBhdHRycztcbn1cblxuLy8gc3ViY2xhc3Mgc2hvdWxkIG5vdCBoYXZlIF9fYXR0cnNfX1xuZnVuY3Rpb24gY3JlYXRlQXR0cnMgKHN1YmNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdWJjbGFzcyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBhdHRyaWJ1dGVzIG9ubHkgaW4gaW5zdGFuY2VcbiAgICAgICAgbGV0IGluc3RhbmNlID0gc3ViY2xhc3M7XG4gICAgICAgIHJldHVybiBjcmVhdGVBdHRyc1NpbmdsZShpbnN0YW5jZSwgZ2V0Q2xhc3NBdHRycyhpbnN0YW5jZS5jb25zdHJ1Y3RvcikpO1xuICAgIH1cbiAgICB2YXIgc3VwZXJDbGFzcztcbiAgICB2YXIgY2hhaW5zID0gY2MuQ2xhc3MuZ2V0SW5oZXJpdGFuY2VDaGFpbihzdWJjbGFzcyk7XG4gICAgZm9yICh2YXIgaSA9IGNoYWlucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgY2xzID0gY2hhaW5zW2ldO1xuICAgICAgICB2YXIgYXR0cnMgPSBjbHMuaGFzT3duUHJvcGVydHkoJ19fYXR0cnNfXycpICYmIGNscy5fX2F0dHJzX187XG4gICAgICAgIGlmICghYXR0cnMpIHtcbiAgICAgICAgICAgIHN1cGVyQ2xhc3MgPSBjaGFpbnNbaSArIDFdO1xuICAgICAgICAgICAgY3JlYXRlQXR0cnNTaW5nbGUoY2xzLCBzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MuX19hdHRyc19fKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdXBlckNsYXNzID0gY2hhaW5zWzBdO1xuICAgIGNyZWF0ZUF0dHJzU2luZ2xlKHN1YmNsYXNzLCBzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MuX19hdHRyc19fKTtcbiAgICByZXR1cm4gc3ViY2xhc3MuX19hdHRyc19fO1xufVxuXG4vLyAvKipcbi8vICAqIEBjbGFzcyBDbGFzc1xuLy8gICovXG5cbi8vICAqXG4vLyAgKiBUYWcgdGhlIGNsYXNzIHdpdGggYW55IG1ldGEgYXR0cmlidXRlcywgdGhlbiByZXR1cm4gYWxsIGN1cnJlbnQgYXR0cmlidXRlcyBhc3NpZ25lZCB0byBpdC5cbi8vICAqIFRoaXMgZnVuY3Rpb24gaG9sZHMgb25seSB0aGUgYXR0cmlidXRlcywgbm90IHRoZWlyIGltcGxlbWVudGF0aW9ucy5cbi8vICAqXG4vLyAgKiBAbWV0aG9kIGF0dHJcbi8vICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBjdG9yIC0gdGhlIGNsYXNzIG9yIGluc3RhbmNlLiBJZiBpbnN0YW5jZSwgdGhlIGF0dHJpYnV0ZSB3aWxsIGJlIGR5bmFtaWMgYW5kIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgc3BlY2lmaWVkIGluc3RhbmNlLlxuLy8gICogQHBhcmFtIHtTdHJpbmd9IHByb3BOYW1lIC0gdGhlIG5hbWUgb2YgcHJvcGVydHkgb3IgZnVuY3Rpb24sIHVzZWQgdG8gcmV0cmlldmUgdGhlIGF0dHJpYnV0ZXNcbi8vICAqIEBwYXJhbSB7T2JqZWN0fSBbbmV3QXR0cnNdIC0gdGhlIGF0dHJpYnV0ZSB0YWJsZSB0byBtYXJrLCBuZXcgYXR0cmlidXRlcyB3aWxsIG1lcmdlZCB3aXRoIGV4aXN0ZWQgYXR0cmlidXRlcy4gQXR0cmlidXRlIHdob3NlIGtleSBzdGFydHMgd2l0aCAnXycgd2lsbCBiZSBpZ25vcmVkLlxuLy8gICogQHN0YXRpY1xuLy8gICogQHByaXZhdGVcbmZ1bmN0aW9uIGF0dHIgKGN0b3IsIHByb3BOYW1lLCBuZXdBdHRycykge1xuICAgIHZhciBhdHRycyA9IGdldENsYXNzQXR0cnMoY3Rvcik7XG4gICAgaWYgKCFDQ19ERVYgfHwgdHlwZW9mIG5ld0F0dHJzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBnZXRcbiAgICAgICAgdmFyIHByZWZpeCA9IHByb3BOYW1lICsgREVMSU1FVEVSO1xuICAgICAgICB2YXIgcmV0ID0ge307XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBhdHRycykge1xuICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKHByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICByZXRba2V5LnNsaWNlKHByZWZpeC5sZW5ndGgpXSA9IGF0dHJzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZWxzZSBpZiAoQ0NfREVWICYmIHR5cGVvZiBuZXdBdHRycyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gc2V0XG4gICAgICAgIGNjLndhcm4oYFxcYGNjLkNsYXNzLmF0dHIob2JqLCBwcm9wLCB7IGtleTogdmFsdWUgfSk7XFxgIGlzIGRlcHJlY2F0ZWQsIHVzZSBcXGBjYy5DbGFzcy5BdHRyLnNldENsYXNzQXR0cihvYmosIHByb3AsICdrZXknLCB2YWx1ZSk7XFxgIGluc3RlYWQgcGxlYXNlLmApO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbmV3QXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJzW3Byb3BOYW1lICsgREVMSU1FVEVSICsga2V5XSA9IG5ld0F0dHJzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIHJldHVybnMgYSByZWFkb25seSBtZXRhIG9iamVjdFxuZnVuY3Rpb24gZ2V0Q2xhc3NBdHRycyAoY3Rvcikge1xuICAgIHJldHVybiAoY3Rvci5oYXNPd25Qcm9wZXJ0eSgnX19hdHRyc19fJykgJiYgY3Rvci5fX2F0dHJzX18pIHx8IGNyZWF0ZUF0dHJzKGN0b3IpO1xufVxuXG5mdW5jdGlvbiBzZXRDbGFzc0F0dHIgKGN0b3IsIHByb3BOYW1lLCBrZXksIHZhbHVlKSB7XG4gICAgZ2V0Q2xhc3NBdHRycyhjdG9yKVtwcm9wTmFtZSArIERFTElNRVRFUiArIGtleV0gPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuZnVuY3Rpb24gUHJpbWl0aXZlVHlwZSAobmFtZSwgZGVmKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmRlZmF1bHQgPSBkZWY7XG59XG5QcmltaXRpdmVUeXBlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IHRoYXQgdGhlIGlucHV0IHZhbHVlIG11c3QgYmUgaW50ZWdlciBpbiBJbnNwZWN0b3IuXG4gKiBBbHNvIHVzZWQgdG8gaW5kaWNhdGVzIHRoYXQgdGhlIGVsZW1lbnRzIGluIGFycmF5IHNob3VsZCBiZSB0eXBlIGludGVnZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSW50ZWdlclxuICogQHJlYWRvbmx5XG4gKiBAZXhhbXBsZVxuICogLy8gaW4gY2MuQ2xhc3NcbiAqIG1lbWJlcjoge1xuICogICAgIGRlZmF1bHQ6IFtdLFxuICogICAgIHR5cGU6IGNjLkludGVnZXJcbiAqIH1cbiAqIC8vIEVTNiBjY2NsYXNzXG4gKiBAY2MuX2RlY29yYXRvci5wcm9wZXJ0eSh7XG4gKiAgICAgdHlwZTogY2MuSW50ZWdlclxuICogfSlcbiAqIG1lbWJlciA9IFtdO1xuICovXG5jYy5JbnRlZ2VyID0gbmV3IFByaW1pdGl2ZVR5cGUoJ0ludGVnZXInLCAwKTtcblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgZWxlbWVudHMgaW4gYXJyYXkgc2hvdWxkIGJlIHR5cGUgZG91YmxlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IEZsb2F0XG4gKiBAcmVhZG9ubHlcbiAqIEBleGFtcGxlXG4gKiAvLyBpbiBjYy5DbGFzc1xuICogbWVtYmVyOiB7XG4gKiAgICAgZGVmYXVsdDogW10sXG4gKiAgICAgdHlwZTogY2MuRmxvYXRcbiAqIH1cbiAqIC8vIEVTNiBjY2NsYXNzXG4gKiBAY2MuX2RlY29yYXRvci5wcm9wZXJ0eSh7XG4gKiAgICAgdHlwZTogY2MuRmxvYXRcbiAqIH0pXG4gKiBtZW1iZXIgPSBbXTtcbiAqL1xuY2MuRmxvYXQgPSBuZXcgUHJpbWl0aXZlVHlwZSgnRmxvYXQnLCAwKTtcblxuaWYgKENDX0VESVRPUikge1xuICAgIGpzLmdldChjYywgJ051bWJlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDM2MDMpO1xuICAgICAgICByZXR1cm4gY2MuRmxvYXQ7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIHRoYXQgdGhlIGVsZW1lbnRzIGluIGFycmF5IHNob3VsZCBiZSB0eXBlIGJvb2xlYW4uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQm9vbGVhblxuICogQHJlYWRvbmx5XG4gKiBAZXhhbXBsZVxuICogLy8gaW4gY2MuQ2xhc3NcbiAqIG1lbWJlcjoge1xuICogICAgIGRlZmF1bHQ6IFtdLFxuICogICAgIHR5cGU6IGNjLkJvb2xlYW5cbiAqIH1cbiAqIC8vIEVTNiBjY2NsYXNzXG4gKiBAY2MuX2RlY29yYXRvci5wcm9wZXJ0eSh7XG4gKiAgICAgdHlwZTogY2MuQm9vbGVhblxuICogfSlcbiAqIG1lbWJlciA9IFtdO1xuICovXG5jYy5Cb29sZWFuID0gbmV3IFByaW1pdGl2ZVR5cGUoJ0Jvb2xlYW4nLCBmYWxzZSk7XG5cbi8qKlxuICogSW5kaWNhdGVzIHRoYXQgdGhlIGVsZW1lbnRzIGluIGFycmF5IHNob3VsZCBiZSB0eXBlIHN0cmluZy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBTdHJpbmdcbiAqIEByZWFkb25seVxuICogQGV4YW1wbGVcbiAqIC8vIGluIGNjLkNsYXNzXG4gKiBtZW1iZXI6IHtcbiAqICAgICBkZWZhdWx0OiBbXSxcbiAqICAgICB0eXBlOiBjYy5TdHJpbmdcbiAqIH1cbiAqIC8vIEVTNiBjY2NsYXNzXG4gKiBAY2MuX2RlY29yYXRvci5wcm9wZXJ0eSh7XG4gKiAgICAgdHlwZTogY2MuU3RyaW5nXG4gKiB9KVxuICogbWVtYmVyID0gW107XG4gKi9cbmNjLlN0cmluZyA9IG5ldyBQcmltaXRpdmVUeXBlKCdTdHJpbmcnLCAnJyk7XG5cbi8vIEVuc3VyZXMgdGhlIHR5cGUgbWF0Y2hlcyBpdHMgZGVmYXVsdCB2YWx1ZVxuZnVuY3Rpb24gZ2V0VHlwZUNoZWNrZXIgKHR5cGUsIGF0dHJOYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjb25zdHJ1Y3RvciwgbWFpblByb3BOYW1lKSB7XG4gICAgICAgIHZhciBwcm9wSW5mbyA9ICdcIicgKyBqcy5nZXRDbGFzc05hbWUoY29uc3RydWN0b3IpICsgJy4nICsgbWFpblByb3BOYW1lICsgJ1wiJztcbiAgICAgICAgdmFyIG1haW5Qcm9wQXR0cnMgPSBhdHRyKGNvbnN0cnVjdG9yLCBtYWluUHJvcE5hbWUpO1xuICAgICAgICBpZiAoIW1haW5Qcm9wQXR0cnMuc2F2ZVVybEFzQXNzZXQpIHtcbiAgICAgICAgICAgIHZhciBtYWluUHJvcEF0dHJzVHlwZSA9IG1haW5Qcm9wQXR0cnMudHlwZTtcbiAgICAgICAgICAgIGlmIChtYWluUHJvcEF0dHJzVHlwZSA9PT0gY2MuSW50ZWdlciB8fCBtYWluUHJvcEF0dHJzVHlwZSA9PT0gY2MuRmxvYXQpIHtcbiAgICAgICAgICAgICAgICBtYWluUHJvcEF0dHJzVHlwZSA9ICdOdW1iZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWFpblByb3BBdHRyc1R5cGUgPT09IGNjLlN0cmluZyB8fCBtYWluUHJvcEF0dHJzVHlwZSA9PT0gY2MuQm9vbGVhbikge1xuICAgICAgICAgICAgICAgIG1haW5Qcm9wQXR0cnNUeXBlID0gJycgKyBtYWluUHJvcEF0dHJzVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYWluUHJvcEF0dHJzVHlwZSAhPT0gdHlwZSkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjA0LCBwcm9wSW5mbyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghbWFpblByb3BBdHRycy5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmF1bHRWYWwgPSBtYWluUHJvcEF0dHJzLmRlZmF1bHQ7XG4gICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNDb250YWluZXIgPSBBcnJheS5pc0FycmF5KGRlZmF1bHRWYWwpIHx8IGlzUGxhaW5FbXB0eU9iaihkZWZhdWx0VmFsKTtcbiAgICAgICAgaWYgKGlzQ29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmF1bHRUeXBlID0gdHlwZW9mIGRlZmF1bHRWYWw7XG4gICAgICAgIHZhciB0eXBlX2xvd2VyQ2FzZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGRlZmF1bHRUeXBlID09PSB0eXBlX2xvd2VyQ2FzZSkge1xuICAgICAgICAgICAgaWYgKCFtYWluUHJvcEF0dHJzLnNhdmVVcmxBc0Fzc2V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVfbG93ZXJDYXNlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVmYXVsdFZhbCAmJiAhKGRlZmF1bHRWYWwgaW5zdGFuY2VvZiBtYWluUHJvcEF0dHJzLmN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwNSwgcHJvcEluZm8sIGpzLmdldENsYXNzTmFtZShtYWluUHJvcEF0dHJzLmN0b3IpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlICE9PSAnTnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwNiwgYXR0ck5hbWUsIHByb3BJbmZvLCB0eXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVmYXVsdFR5cGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBjYy5TdHJpbmcgJiYgZGVmYXVsdFZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFqcy5pc0NoaWxkQ2xhc3NPZihtYWluUHJvcEF0dHJzLmN0b3IsIGNjLlJhd0Fzc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwNywgcHJvcEluZm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjExLCBhdHRyTmFtZSwgcHJvcEluZm8sIGRlZmF1bHRUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgbWFpblByb3BBdHRycy50eXBlO1xuICAgIH07XG59XG5cbi8vIEVuc3VyZXMgdGhlIHR5cGUgbWF0Y2hlcyBpdHMgZGVmYXVsdCB2YWx1ZVxuZnVuY3Rpb24gZ2V0T2JqVHlwZUNoZWNrZXIgKHR5cGVDdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjbGFzc0N0b3IsIG1haW5Qcm9wTmFtZSkge1xuICAgICAgICBnZXRUeXBlQ2hlY2tlcignT2JqZWN0JywgJ3R5cGUnKShjbGFzc0N0b3IsIG1haW5Qcm9wTmFtZSk7XG4gICAgICAgIC8vIGNoZWNrIFZhbHVlVHlwZVxuICAgICAgICB2YXIgZGVmYXVsdERlZiA9IGdldENsYXNzQXR0cnMoY2xhc3NDdG9yKVttYWluUHJvcE5hbWUgKyBERUxJTUVURVIgKyAnZGVmYXVsdCddO1xuICAgICAgICB2YXIgZGVmYXVsdFZhbCA9IHJlcXVpcmUoJy4vQ0NDbGFzcycpLmdldERlZmF1bHQoZGVmYXVsdERlZik7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShkZWZhdWx0VmFsKSAmJiBqcy5pc0NoaWxkQ2xhc3NPZih0eXBlQ3RvciwgY2MuVmFsdWVUeXBlKSkge1xuICAgICAgICAgICAgdmFyIHR5cGVuYW1lID0ganMuZ2V0Q2xhc3NOYW1lKHR5cGVDdG9yKTtcbiAgICAgICAgICAgIHZhciBpbmZvID0gY2MuanMuZm9ybWF0U3RyKCdObyBuZWVkIHRvIHNwZWNpZnkgdGhlIFwidHlwZVwiIG9mIFwiJXMuJXNcIiBiZWNhdXNlICVzIGlzIGEgY2hpbGQgY2xhc3Mgb2YgVmFsdWVUeXBlLicsXG4gICAgICAgICAgICAgICAganMuZ2V0Q2xhc3NOYW1lKGNsYXNzQ3RvciksIG1haW5Qcm9wTmFtZSwgdHlwZW5hbWUpO1xuICAgICAgICAgICAgaWYgKGRlZmF1bHREZWYpIHtcbiAgICAgICAgICAgICAgICBjYy5sb2coaW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYxMiwgaW5mbywgdHlwZW5hbWUsIGpzLmdldENsYXNzTmFtZShjbGFzc0N0b3IpLCBtYWluUHJvcE5hbWUsIHR5cGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFByaW1pdGl2ZVR5cGUsXG4gICAgYXR0cjogYXR0cixcbiAgICBnZXRDbGFzc0F0dHJzOiBnZXRDbGFzc0F0dHJzLFxuICAgIHNldENsYXNzQXR0cjogc2V0Q2xhc3NBdHRyLFxuICAgIERFTElNRVRFUjogREVMSU1FVEVSLFxuICAgIGdldFR5cGVDaGVja2VyX0VUOiAoKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikgfHwgQ0NfVEVTVCkgJiYgZ2V0VHlwZUNoZWNrZXIsXG4gICAgZ2V0T2JqVHlwZUNoZWNrZXJfRVQ6ICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSAmJiBnZXRPYmpUeXBlQ2hlY2tlcixcbiAgICBTY3JpcHRVdWlkOiB7fSwgICAgICAvLyB0aGUgdmFsdWUgd2lsbCBiZSByZXByZXNlbnRlZCBhcyBhIHV1aWQgc3RyaW5nXG59O1xuIl19