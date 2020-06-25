
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/deserialize.js';
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

var Attr = require('./attribute');

var CCClass = require('./CCClass');

var misc = require('../utils/misc'); // HELPERS

/**
 * !#en Contains information collected during deserialization
 * !#zh 包含反序列化时的一些信息
 * @class Details
 *
 */


var Details = function Details() {
  /**
   * list of the depends assets' uuid
   * @property {String[]} uuidList
   */
  this.uuidList = [];
  /**
   * the obj list whose field needs to load asset by uuid
   * @property {Object[]} uuidObjList
   */

  this.uuidObjList = [];
  /**
   * the corresponding field name which referenced to the asset
   * @property {String[]} uuidPropList
   */

  this.uuidPropList = []; // TODO - DELME since 2.0

  this._stillUseUrl = js.createMap(true);
};
/**
 * @method reset
 */


Details.prototype.reset = function () {
  this.uuidList.length = 0;
  this.uuidObjList.length = 0;
  this.uuidPropList.length = 0;
  js.clear(this._stillUseUrl);
};

if (CC_EDITOR || CC_TEST) {
  Details.prototype.assignAssetsBy = function (getter) {
    // ignore this._stillUseUrl
    for (var i = 0, len = this.uuidList.length; i < len; i++) {
      var uuid = this.uuidList[i];
      var obj = this.uuidObjList[i];
      var prop = this.uuidPropList[i];
      obj[prop] = getter(uuid);
    }
  };
} // /**
//  * @method getUuidOf
//  * @param {Object} obj
//  * @param {String} propName
//  * @return {String}
//  */
// Details.prototype.getUuidOf = function (obj, propName) {
//     for (var i = 0; i < this.uuidObjList.length; i++) {
//         if (this.uuidObjList[i] === obj && this.uuidPropList[i] === propName) {
//             return this.uuidList[i];
//         }
//     }
//     return "";
// };

/**
 * @method push
 * @param {Object} obj
 * @param {String} propName
 * @param {String} uuid
 */


Details.prototype.push = function (obj, propName, uuid, _stillUseUrl) {
  if (_stillUseUrl) {
    this._stillUseUrl[this.uuidList.length] = true;
  }

  this.uuidList.push(uuid);
  this.uuidObjList.push(obj);
  this.uuidPropList.push(propName);
};

Details.pool = new js.Pool(function (obj) {
  obj.reset();
}, 10);

Details.pool.get = function () {
  return this._get() || new Details();
}; // IMPLEMENT OF DESERIALIZATION


var _Deserializer = function () {
  function _Deserializer(result, target, classFinder, customEnv, ignoreEditorOnly) {
    this.result = result;
    this.customEnv = customEnv;
    this.deserializedList = [];
    this.deserializedData = null;
    this._classFinder = classFinder;

    if (CC_DEV) {
      this._target = target;
      this._ignoreEditorOnly = ignoreEditorOnly;
    }

    this._idList = [];
    this._idObjList = [];
    this._idPropList = [];
  }

  function _dereference(self) {
    // 这里不采用遍历反序列化结果的方式，因为反序列化的结果如果引用到复杂的外部库，很容易堆栈溢出。
    var deserializedList = self.deserializedList;
    var idPropList = self._idPropList;
    var idList = self._idList;
    var idObjList = self._idObjList;
    var onDereferenced = self._classFinder && self._classFinder.onDereferenced;
    var i, propName, id;

    if (CC_EDITOR && onDereferenced) {
      for (i = 0; i < idList.length; i++) {
        propName = idPropList[i];
        id = idList[i];
        idObjList[i][propName] = deserializedList[id];
        onDereferenced(deserializedList, id, idObjList[i], propName);
      }
    } else {
      for (i = 0; i < idList.length; i++) {
        propName = idPropList[i];
        id = idList[i];
        idObjList[i][propName] = deserializedList[id];
      }
    }
  }

  var prototype = _Deserializer.prototype;

  prototype.deserialize = function (jsonObj) {
    if (Array.isArray(jsonObj)) {
      var jsonArray = jsonObj;
      var refCount = jsonArray.length;
      this.deserializedList.length = refCount; // deserialize

      for (var i = 0; i < refCount; i++) {
        if (jsonArray[i]) {
          if (CC_EDITOR || CC_TEST) {
            var mainTarget = i === 0 && this._target;
            this.deserializedList[i] = this._deserializeObject(jsonArray[i], false, mainTarget, this.deserializedList, '' + i);
          } else {
            this.deserializedList[i] = this._deserializeObject(jsonArray[i], false);
          }
        }
      }

      this.deserializedData = refCount > 0 ? this.deserializedList[0] : []; //// callback
      //for (var j = 0; j < refCount; j++) {
      //    if (referencedList[j].onAfterDeserialize) {
      //        referencedList[j].onAfterDeserialize();
      //    }
      //}
    } else {
      this.deserializedList.length = 1;

      if (CC_EDITOR || CC_TEST) {
        this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, false, this._target, this.deserializedList, '0') : null;
      } else {
        this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, false) : null;
      }

      this.deserializedList[0] = this.deserializedData; //// callback
      //if (deserializedData.onAfterDeserialize) {
      //    deserializedData.onAfterDeserialize();
      //}
    } // dereference


    _dereference(this);

    return this.deserializedData;
  }; ///**
  // * @param {Object} serialized - The obj to deserialize, must be non-nil
  // * @param {Boolean} _stillUseUrl
  // * @param {Object} [target=null] - editor only
  // * @param {Object} [owner] - debug only
  // * @param {String} [propName] - debug only
  // */


  prototype._deserializeObject = function (serialized, _stillUseUrl, target, owner, propName) {
    var prop;
    var obj = null; // the obj to return

    var klass = null;
    var type = serialized.__type__;

    if (type === 'TypedArray') {
      var array = serialized.array;
      obj = new window[serialized.ctor](array.length);

      for (var i = 0; i < array.length; ++i) {
        obj[i] = array[i];
      }

      return obj;
    } else if (type) {
      // Type Object (including CCClass)
      klass = this._classFinder(type, serialized, owner, propName);

      if (!klass) {
        var notReported = this._classFinder === js._getClassById;

        if (notReported) {
          cc.deserialize.reportMissingClass(type);
        }

        return null;
      }

      if ((CC_EDITOR || CC_TEST) && target) {
        // use target
        if (!(target instanceof klass)) {
          cc.warnID(5300, js.getClassName(target), klass);
        }

        obj = target;
      } else {
        // instantiate a new object
        obj = new klass();
      }

      if (obj._deserialize) {
        obj._deserialize(serialized.content, this);

        return obj;
      }

      if (cc.Class._isCCClass(klass)) {
        _deserializeFireClass(this, obj, serialized, klass, target);
      } else {
        this._deserializeTypedObject(obj, serialized, klass);
      }
    } else if (!Array.isArray(serialized)) {
      // embedded primitive javascript object
      obj = (CC_EDITOR || CC_TEST) && target || {};

      this._deserializePrimitiveObject(obj, serialized);
    } else {
      // Array
      if ((CC_EDITOR || CC_TEST) && target) {
        target.length = serialized.length;
        obj = target;
      } else {
        obj = new Array(serialized.length);
      }

      for (var _i = 0; _i < serialized.length; _i++) {
        prop = serialized[_i];

        if (typeof prop === 'object' && prop) {
          if (CC_EDITOR || CC_TEST) {
            this._deserializeObjField(obj, prop, '' + _i, target && obj, _stillUseUrl);
          } else {
            this._deserializeObjField(obj, prop, '' + _i, null, _stillUseUrl);
          }
        } else {
          obj[_i] = prop;
        }
      }
    }

    return obj;
  }; // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid


  prototype._deserializeObjField = function (obj, jsonObj, propName, target, _stillUseUrl) {
    var id = jsonObj.__id__;

    if (id === undefined) {
      var uuid = jsonObj.__uuid__;

      if (uuid) {
        //if (ENABLE_TARGET) {
        //这里不做任何操作，因为有可能调用者需要知道依赖哪些 asset。
        //调用者使用 uuidList 时，可以判断 obj[propName] 是否为空，为空则表示待进一步加载，
        //不为空则只是表明依赖关系。
        //    if (target && target[propName] && target[propName]._uuid === uuid) {
        //        console.assert(obj[propName] === target[propName]);
        //        return;
        //    }
        // }
        this.result.push(obj, propName, uuid, _stillUseUrl);
      } else {
        if (CC_EDITOR || CC_TEST) {
          obj[propName] = this._deserializeObject(jsonObj, _stillUseUrl, target && target[propName], obj, propName);
        } else {
          obj[propName] = this._deserializeObject(jsonObj, _stillUseUrl);
        }
      }
    } else {
      var dObj = this.deserializedList[id];

      if (dObj) {
        obj[propName] = dObj;
      } else {
        this._idList.push(id);

        this._idObjList.push(obj);

        this._idPropList.push(propName);
      }
    }
  };

  prototype._deserializePrimitiveObject = function (instance, serialized) {
    var self = this;

    for (var propName in serialized) {
      if (serialized.hasOwnProperty(propName)) {
        var prop = serialized[propName];

        if (typeof prop !== 'object') {
          if (propName !== '__type__'
          /* && k != '__id__'*/
          ) {
              instance[propName] = prop;
            }
        } else {
          if (prop) {
            if (CC_EDITOR || CC_TEST) {
              self._deserializeObjField(instance, prop, propName, self._target && instance);
            } else {
              self._deserializeObjField(instance, prop, propName);
            }
          } else {
            instance[propName] = null;
          }
        }
      }
    }
  }; // function _compileTypedObject (accessor, klass, ctorCode) {
  //     if (klass === cc.Vec2) {
  //         return `{` +
  //                     `o${accessor}.x=prop.x||0;` +
  //                     `o${accessor}.y=prop.y||0;` +
  //                `}`;
  //     }
  //     else if (klass === cc.Color) {
  //         return `{` +
  //                    `o${accessor}.r=prop.r||0;` +
  //                    `o${accessor}.g=prop.g||0;` +
  //                    `o${accessor}.b=prop.b||0;` +
  //                    `o${accessor}.a=(prop.a===undefined?255:prop.a);` +
  //                `}`;
  //     }
  //     else if (klass === cc.Size) {
  //         return `{` +
  //                    `o${accessor}.width=prop.width||0;` +
  //                    `o${accessor}.height=prop.height||0;` +
  //                `}`;
  //     }
  //     else {
  //         return `s._deserializeTypedObject(o${accessor},prop,${ctorCode});`;
  //     }
  // }
  // deserialize ValueType


  prototype._deserializeTypedObject = function (instance, serialized, klass) {
    if (klass === cc.Vec2) {
      instance.x = serialized.x || 0;
      instance.y = serialized.y || 0;
      return;
    } else if (klass === cc.Vec3) {
      instance.x = serialized.x || 0;
      instance.y = serialized.y || 0;
      instance.z = serialized.z || 0;
      return;
    } else if (klass === cc.Color) {
      instance.r = serialized.r || 0;
      instance.g = serialized.g || 0;
      instance.b = serialized.b || 0;
      var a = serialized.a;
      instance.a = a === undefined ? 255 : a;
      return;
    } else if (klass === cc.Size) {
      instance.width = serialized.width || 0;
      instance.height = serialized.height || 0;
      return;
    }

    var DEFAULT = Attr.DELIMETER + 'default';
    var attrs = Attr.getClassAttrs(klass);
    var fastDefinedProps = klass.__props__ || Object.keys(instance); // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来

    for (var i = 0; i < fastDefinedProps.length; i++) {
      var propName = fastDefinedProps[i];
      var value = serialized[propName];

      if (value === undefined || !serialized.hasOwnProperty(propName)) {
        // not serialized,
        // recover to default value in ValueType, because eliminated properties equals to
        // its default value in ValueType, not default value in user class
        value = CCClass.getDefault(attrs[propName + DEFAULT]);
      }

      if (typeof value !== 'object') {
        instance[propName] = value;
      } else if (value) {
        if (CC_EDITOR || CC_TEST) {
          this._deserializeObjField(instance, value, propName, this._target && instance);
        } else {
          this._deserializeObjField(instance, value, propName);
        }
      } else {
        instance[propName] = null;
      }
    }
  };

  function compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, assumeHavePropIfIsValue, stillUseUrl) {
    if (defaultValue instanceof cc.ValueType) {
      // fast case
      if (!assumeHavePropIfIsValue) {
        sources.push('if(prop){');
      }

      var ctorCode = js.getClassName(defaultValue);
      sources.push("s._deserializeTypedObject(o" + accessorToSet + ",prop," + ctorCode + ");");

      if (!assumeHavePropIfIsValue) {
        sources.push('}else o' + accessorToSet + '=null;');
      }
    } else {
      sources.push('if(prop){');
      sources.push('s._deserializeObjField(o,prop,' + propNameLiteralToSet + (CC_EDITOR || CC_TEST ? ',t&&o,' : ',null,') + !!stillUseUrl + ');');
      sources.push('}else o' + accessorToSet + '=null;');
    }
  }

  var compileDeserialize = CC_SUPPORT_JIT ? function (self, klass) {
    var TYPE = Attr.DELIMETER + 'type';
    var EDITOR_ONLY = Attr.DELIMETER + 'editorOnly';
    var DEFAULT = Attr.DELIMETER + 'default';
    var SAVE_URL_AS_ASSET = Attr.DELIMETER + 'saveUrlAsAsset';
    var FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';
    var attrs = Attr.getClassAttrs(klass);
    var props = klass.__values__; // self, obj, serializedData, klass, target

    var sources = ['var prop;'];
    var fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass)); // sources.push('var vb,vn,vs,vo,vu,vf;');    // boolean, number, string, object, undefined, function

    for (var p = 0; p < props.length; p++) {
      var propName = props[p];

      if ((CC_PREVIEW || CC_EDITOR && self._ignoreEditorOnly) && attrs[propName + EDITOR_ONLY]) {
        continue; // skip editor only if in preview
      }

      var accessorToSet, propNameLiteralToSet;

      if (CCClass.IDENTIFIER_RE.test(propName)) {
        propNameLiteralToSet = '"' + propName + '"';
        accessorToSet = '.' + propName;
      } else {
        propNameLiteralToSet = CCClass.escapeForJS(propName);
        accessorToSet = '[' + propNameLiteralToSet + ']';
      }

      var accessorToGet = accessorToSet;

      if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
        var propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];

        if (CCClass.IDENTIFIER_RE.test(propNameToRead)) {
          accessorToGet = '.' + propNameToRead;
        } else {
          accessorToGet = '[' + CCClass.escapeForJS(propNameToRead) + ']';
        }
      }

      sources.push('prop=d' + accessorToGet + ';');
      sources.push("if(typeof " + (CC_JSB || CC_RUNTIME ? '(prop)' : 'prop') + "!==\"undefined\"){");
      var stillUseUrl = attrs[propName + SAVE_URL_AS_ASSET]; // function undefined object(null) string boolean number

      var defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);

      if (fastMode) {
        var isPrimitiveType;
        var userType = attrs[propName + TYPE];

        if (defaultValue === undefined && userType) {
          isPrimitiveType = userType instanceof Attr.PrimitiveType;
        } else {
          var defaultType = typeof defaultValue;
          isPrimitiveType = defaultType === 'string' && !stillUseUrl || defaultType === 'number' || defaultType === 'boolean';
        }

        if (isPrimitiveType) {
          sources.push("o" + accessorToSet + "=prop;");
        } else {
          compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, true, stillUseUrl);
        }
      } else {
        sources.push("if(typeof " + (CC_JSB || CC_RUNTIME ? '(prop)' : 'prop') + "!==\"object\"){" + 'o' + accessorToSet + '=prop;' + '}else{');
        compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, false, stillUseUrl);
        sources.push('}');
      }

      sources.push('}');
    }

    if (cc.js.isChildClassOf(klass, cc._BaseNode) || cc.js.isChildClassOf(klass, cc.Component)) {
      if (CC_PREVIEW || CC_EDITOR && self._ignoreEditorOnly) {
        var mayUsedInPersistRoot = js.isChildClassOf(klass, cc.Node);

        if (mayUsedInPersistRoot) {
          sources.push('d._id&&(o._id=d._id);');
        }
      } else {
        sources.push('d._id&&(o._id=d._id);');
      }
    }

    if (props[props.length - 1] === '_$erialized') {
      // deep copy original serialized data
      sources.push('o._$erialized=JSON.parse(JSON.stringify(d));'); // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced

      sources.push('s._deserializePrimitiveObject(o._$erialized,d);');
    }

    return Function('s', 'o', 'd', 'k', 't', sources.join(''));
  } : function (self, klass) {
    var fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));
    var shouldCopyId = cc.js.isChildClassOf(klass, cc._BaseNode) || cc.js.isChildClassOf(klass, cc.Component);
    var shouldCopyRawData;
    var simpleProps = [];
    var simplePropsToRead = simpleProps;
    var advancedProps = [];
    var advancedPropsToRead = advancedProps;
    var advancedPropsUseUrl = [];
    var advancedPropsValueType = [];

    (function () {
      var props = klass.__values__;
      shouldCopyRawData = props[props.length - 1] === '_$erialized';
      var attrs = Attr.getClassAttrs(klass);
      var TYPE = Attr.DELIMETER + 'type';
      var DEFAULT = Attr.DELIMETER + 'default';
      var SAVE_URL_AS_ASSET = Attr.DELIMETER + 'saveUrlAsAsset';
      var FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';

      for (var p = 0; p < props.length; p++) {
        var propName = props[p];
        var propNameToRead = propName;

        if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
          propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
        }

        var stillUseUrl = attrs[propName + SAVE_URL_AS_ASSET]; // function undefined object(null) string boolean number

        var defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
        var isPrimitiveType = false;

        if (fastMode) {
          var userType = attrs[propName + TYPE];

          if (defaultValue === undefined && userType) {
            isPrimitiveType = userType instanceof Attr.PrimitiveType;
          } else {
            var defaultType = typeof defaultValue;
            isPrimitiveType = defaultType === 'string' && !stillUseUrl || defaultType === 'number' || defaultType === 'boolean';
          }
        }

        if (fastMode && isPrimitiveType) {
          if (propNameToRead !== propName && simplePropsToRead === simpleProps) {
            simplePropsToRead = simpleProps.slice();
          }

          simpleProps.push(propName);

          if (simplePropsToRead !== simpleProps) {
            simplePropsToRead.push(propNameToRead);
          }
        } else {
          if (propNameToRead !== propName && advancedPropsToRead === advancedProps) {
            advancedPropsToRead = advancedProps.slice();
          }

          advancedProps.push(propName);

          if (advancedPropsToRead !== advancedProps) {
            advancedPropsToRead.push(propNameToRead);
          }

          advancedPropsUseUrl.push(stillUseUrl);
          advancedPropsValueType.push(defaultValue instanceof cc.ValueType && defaultValue.constructor);
        }
      }
    })();

    return function (s, o, d, k, t) {
      for (var i = 0; i < simpleProps.length; ++i) {
        var _prop = d[simplePropsToRead[i]];

        if (_prop !== undefined) {
          o[simpleProps[i]] = _prop;
        }
      }

      for (var _i2 = 0; _i2 < advancedProps.length; ++_i2) {
        var propName = advancedProps[_i2];
        var prop = d[advancedPropsToRead[_i2]];

        if (prop === undefined) {
          continue;
        }

        if (!fastMode && typeof prop !== 'object') {
          o[propName] = prop;
        } else {
          // fastMode (so will not simpleProp) or object
          var valueTypeCtor = advancedPropsValueType[_i2];

          if (valueTypeCtor) {
            if (fastMode || prop) {
              s._deserializeTypedObject(o[propName], prop, valueTypeCtor);
            } else {
              o[propName] = null;
            }
          } else {
            if (prop) {
              s._deserializeObjField(o, prop, propName, CC_EDITOR || CC_TEST ? t && o : null, advancedPropsUseUrl[_i2]);
            } else {
              o[propName] = null;
            }
          }
        }
      }

      if (shouldCopyId && d._id) {
        o._id = d._id;
      }

      if (shouldCopyRawData) {
        // deep copy original serialized data
        o._$erialized = JSON.parse(JSON.stringify(d)); // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced

        s._deserializePrimitiveObject(o._$erialized, d);
      }
    };
  };

  function unlinkUnusedPrefab(self, serialized, obj) {
    var uuid = serialized['asset'] && serialized['asset'].__uuid__;

    if (uuid) {
      var last = self.result.uuidList.length - 1;

      if (self.result.uuidList[last] === uuid && self.result.uuidObjList[last] === obj && self.result.uuidPropList[last] === 'asset') {
        self.result.uuidList.pop();
        self.result.uuidObjList.pop();
        self.result.uuidPropList.pop();
      } else {
        var debugEnvOnlyInfo = 'Failed to skip prefab asset while deserializing PrefabInfo';
        cc.warn(debugEnvOnlyInfo);
      }
    }
  }

  function _deserializeFireClass(self, obj, serialized, klass, target) {
    var deserialize;

    if (klass.hasOwnProperty('__deserialize__')) {
      deserialize = klass.__deserialize__;
    } else {
      deserialize = compileDeserialize(self, klass); // if (CC_TEST && !isPhantomJS) {
      //     cc.log(deserialize);
      // }

      js.value(klass, '__deserialize__', deserialize, true);
    }

    deserialize(self, obj, serialized, klass, target); // if preview or build worker

    if (CC_PREVIEW || CC_EDITOR && self._ignoreEditorOnly) {
      if (klass === cc._PrefabInfo && !obj.sync) {
        unlinkUnusedPrefab(self, serialized, obj);
      }
    }
  }

  _Deserializer.pool = new js.Pool(function (obj) {
    obj.result = null;
    obj.customEnv = null;
    obj.deserializedList.length = 0;
    obj.deserializedData = null;
    obj._classFinder = null;

    if (CC_DEV) {
      obj._target = null;
    }

    obj._idList.length = 0;
    obj._idObjList.length = 0;
    obj._idPropList.length = 0;
  }, 1);

  _Deserializer.pool.get = function (result, target, classFinder, customEnv, ignoreEditorOnly) {
    var cache = this._get();

    if (cache) {
      cache.result = result;
      cache.customEnv = customEnv;
      cache._classFinder = classFinder;

      if (CC_DEV) {
        cache._target = target;
        cache._ignoreEditorOnly = ignoreEditorOnly;
      }

      return cache;
    } else {
      return new _Deserializer(result, target, classFinder, customEnv, ignoreEditorOnly);
    }
  };

  return _Deserializer;
}();
/**
 * @module cc
 */

/**
 * !#en Deserialize json to cc.Asset
 * !#zh 将 JSON 反序列化为对象实例。
 *
 * 当指定了 target 选项时，如果 target 引用的其它 asset 的 uuid 不变，则不会改变 target 对 asset 的引用，
 * 也不会将 uuid 保存到 result 对象中。
 *
 * @method deserialize
 * @param {String|Object} data - the serialized cc.Asset json string or json object.
 * @param {Details} [details] - additional loading result
 * @param {Object} [options]
 * @return {object} the main data(asset)
 */


cc.deserialize = function (data, details, options) {
  options = options || {};
  var classFinder = options.classFinder || js._getClassById; // 启用 createAssetRefs 后，如果有 url 属性则会被统一强制设置为 { uuid: 'xxx' }，必须后面再特殊处理

  var createAssetRefs = options.createAssetRefs || cc.sys.platform === cc.sys.EDITOR_CORE;
  var target = (CC_EDITOR || CC_TEST) && options.target;
  var customEnv = options.customEnv;
  var ignoreEditorOnly = options.ignoreEditorOnly;

  if (CC_EDITOR && Buffer.isBuffer(data)) {
    data = data.toString();
  }

  if (typeof data === 'string') {
    data = JSON.parse(data);
  } //var oldJson = JSON.stringify(data, null, 2);


  var tempDetails = !details;
  details = details || Details.pool.get();

  var deserializer = _Deserializer.pool.get(details, target, classFinder, customEnv, ignoreEditorOnly);

  cc.game._isCloning = true;
  var res = deserializer.deserialize(data);
  cc.game._isCloning = false;

  _Deserializer.pool.put(deserializer);

  if (createAssetRefs) {
    details.assignAssetsBy(Editor.serialize.asAsset);
  }

  if (tempDetails) {
    Details.pool.put(details);
  } //var afterJson = JSON.stringify(data, null, 2);
  //if (oldJson !== afterJson) {
  //    throw new Error('JSON SHOULD not changed');
  //}


  return res;
};

cc.deserialize.Details = Details;

cc.deserialize.reportMissingClass = function (id) {
  if (CC_EDITOR && Editor.Utils.UuidUtils.isUuid(id)) {
    id = Editor.Utils.UuidUtils.decompressUuid(id);
    cc.warnID(5301, id);
  } else {
    cc.warnID(5302, id);
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlc2VyaWFsaXplLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIkF0dHIiLCJDQ0NsYXNzIiwibWlzYyIsIkRldGFpbHMiLCJ1dWlkTGlzdCIsInV1aWRPYmpMaXN0IiwidXVpZFByb3BMaXN0IiwiX3N0aWxsVXNlVXJsIiwiY3JlYXRlTWFwIiwicHJvdG90eXBlIiwicmVzZXQiLCJsZW5ndGgiLCJjbGVhciIsIkNDX0VESVRPUiIsIkNDX1RFU1QiLCJhc3NpZ25Bc3NldHNCeSIsImdldHRlciIsImkiLCJsZW4iLCJ1dWlkIiwib2JqIiwicHJvcCIsInB1c2giLCJwcm9wTmFtZSIsInBvb2wiLCJQb29sIiwiZ2V0IiwiX2dldCIsIl9EZXNlcmlhbGl6ZXIiLCJyZXN1bHQiLCJ0YXJnZXQiLCJjbGFzc0ZpbmRlciIsImN1c3RvbUVudiIsImlnbm9yZUVkaXRvck9ubHkiLCJkZXNlcmlhbGl6ZWRMaXN0IiwiZGVzZXJpYWxpemVkRGF0YSIsIl9jbGFzc0ZpbmRlciIsIkNDX0RFViIsIl90YXJnZXQiLCJfaWdub3JlRWRpdG9yT25seSIsIl9pZExpc3QiLCJfaWRPYmpMaXN0IiwiX2lkUHJvcExpc3QiLCJfZGVyZWZlcmVuY2UiLCJzZWxmIiwiaWRQcm9wTGlzdCIsImlkTGlzdCIsImlkT2JqTGlzdCIsIm9uRGVyZWZlcmVuY2VkIiwiaWQiLCJkZXNlcmlhbGl6ZSIsImpzb25PYmoiLCJBcnJheSIsImlzQXJyYXkiLCJqc29uQXJyYXkiLCJyZWZDb3VudCIsIm1haW5UYXJnZXQiLCJfZGVzZXJpYWxpemVPYmplY3QiLCJzZXJpYWxpemVkIiwib3duZXIiLCJrbGFzcyIsInR5cGUiLCJfX3R5cGVfXyIsImFycmF5Iiwid2luZG93IiwiY3RvciIsIm5vdFJlcG9ydGVkIiwiX2dldENsYXNzQnlJZCIsImNjIiwicmVwb3J0TWlzc2luZ0NsYXNzIiwid2FybklEIiwiZ2V0Q2xhc3NOYW1lIiwiX2Rlc2VyaWFsaXplIiwiY29udGVudCIsIkNsYXNzIiwiX2lzQ0NDbGFzcyIsIl9kZXNlcmlhbGl6ZUZpcmVDbGFzcyIsIl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0IiwiX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0IiwiX2Rlc2VyaWFsaXplT2JqRmllbGQiLCJfX2lkX18iLCJ1bmRlZmluZWQiLCJfX3V1aWRfXyIsImRPYmoiLCJpbnN0YW5jZSIsImhhc093blByb3BlcnR5IiwiVmVjMiIsIngiLCJ5IiwiVmVjMyIsInoiLCJDb2xvciIsInIiLCJnIiwiYiIsImEiLCJTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJERUZBVUxUIiwiREVMSU1FVEVSIiwiYXR0cnMiLCJnZXRDbGFzc0F0dHJzIiwiZmFzdERlZmluZWRQcm9wcyIsIl9fcHJvcHNfXyIsIk9iamVjdCIsImtleXMiLCJ2YWx1ZSIsImdldERlZmF1bHQiLCJjb21waWxlT2JqZWN0VHlwZUppdCIsInNvdXJjZXMiLCJkZWZhdWx0VmFsdWUiLCJhY2Nlc3NvclRvU2V0IiwicHJvcE5hbWVMaXRlcmFsVG9TZXQiLCJhc3N1bWVIYXZlUHJvcElmSXNWYWx1ZSIsInN0aWxsVXNlVXJsIiwiVmFsdWVUeXBlIiwiY3RvckNvZGUiLCJjb21waWxlRGVzZXJpYWxpemUiLCJDQ19TVVBQT1JUX0pJVCIsIlRZUEUiLCJFRElUT1JfT05MWSIsIlNBVkVfVVJMX0FTX0FTU0VUIiwiRk9STUVSTFlfU0VSSUFMSVpFRF9BUyIsInByb3BzIiwiX192YWx1ZXNfXyIsImZhc3RNb2RlIiwiQlVJTFRJTl9DTEFTU0lEX1JFIiwidGVzdCIsIl9nZXRDbGFzc0lkIiwicCIsIkNDX1BSRVZJRVciLCJJREVOVElGSUVSX1JFIiwiZXNjYXBlRm9ySlMiLCJhY2Nlc3NvclRvR2V0IiwicHJvcE5hbWVUb1JlYWQiLCJDQ19KU0IiLCJDQ19SVU5USU1FIiwiaXNQcmltaXRpdmVUeXBlIiwidXNlclR5cGUiLCJQcmltaXRpdmVUeXBlIiwiZGVmYXVsdFR5cGUiLCJpc0NoaWxkQ2xhc3NPZiIsIl9CYXNlTm9kZSIsIkNvbXBvbmVudCIsIm1heVVzZWRJblBlcnNpc3RSb290IiwiTm9kZSIsIkZ1bmN0aW9uIiwiam9pbiIsInNob3VsZENvcHlJZCIsInNob3VsZENvcHlSYXdEYXRhIiwic2ltcGxlUHJvcHMiLCJzaW1wbGVQcm9wc1RvUmVhZCIsImFkdmFuY2VkUHJvcHMiLCJhZHZhbmNlZFByb3BzVG9SZWFkIiwiYWR2YW5jZWRQcm9wc1VzZVVybCIsImFkdmFuY2VkUHJvcHNWYWx1ZVR5cGUiLCJzbGljZSIsImNvbnN0cnVjdG9yIiwicyIsIm8iLCJkIiwiayIsInQiLCJ2YWx1ZVR5cGVDdG9yIiwiX2lkIiwiXyRlcmlhbGl6ZWQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJ1bmxpbmtVbnVzZWRQcmVmYWIiLCJsYXN0IiwicG9wIiwiZGVidWdFbnZPbmx5SW5mbyIsIndhcm4iLCJfX2Rlc2VyaWFsaXplX18iLCJfUHJlZmFiSW5mbyIsInN5bmMiLCJjYWNoZSIsImRhdGEiLCJkZXRhaWxzIiwib3B0aW9ucyIsImNyZWF0ZUFzc2V0UmVmcyIsInN5cyIsInBsYXRmb3JtIiwiRURJVE9SX0NPUkUiLCJCdWZmZXIiLCJpc0J1ZmZlciIsInRvU3RyaW5nIiwidGVtcERldGFpbHMiLCJkZXNlcmlhbGl6ZXIiLCJnYW1lIiwiX2lzQ2xvbmluZyIsInJlcyIsInB1dCIsIkVkaXRvciIsInNlcmlhbGl6ZSIsImFzQXNzZXQiLCJVdGlscyIsIlV1aWRVdGlscyIsImlzVXVpZCIsImRlY29tcHJlc3NVdWlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFoQjs7QUFDQSxJQUFJQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQWxCOztBQUNBLElBQUlFLE9BQU8sR0FBR0YsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBSUcsSUFBSSxHQUFHSCxPQUFPLENBQUMsZUFBRCxDQUFsQixFQUVBOztBQUVBOzs7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a0osTUFBTSxDQUFDRyxLQUFQLENBQWFDLFNBQWIsQ0FBdUJFLGNBQXZCLENBQXNDeEosRUFBdEMsQ0FBTDtBQUNBbUIsSUFBQUEsRUFBRSxDQUFDRSxNQUFILENBQVUsSUFBVixFQUFnQnJCLEVBQWhCO0FBQ0gsR0FIRCxNQUlLO0FBQ0RtQixJQUFBQSxFQUFFLENBQUNFLE1BQUgsQ0FBVSxJQUFWLEVBQWdCckIsRUFBaEI7QUFDSDtBQUNKLENBUkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IHJlcXVpcmUoJy4vanMnKTtcbnZhciBBdHRyID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGUnKTtcbnZhciBDQ0NsYXNzID0gcmVxdWlyZSgnLi9DQ0NsYXNzJyk7XG52YXIgbWlzYyA9IHJlcXVpcmUoJy4uL3V0aWxzL21pc2MnKTtcblxuLy8gSEVMUEVSU1xuXG4vKipcbiAqICEjZW4gQ29udGFpbnMgaW5mb3JtYXRpb24gY29sbGVjdGVkIGR1cmluZyBkZXNlcmlhbGl6YXRpb25cbiAqICEjemgg5YyF5ZCr5Y+N5bqP5YiX5YyW5pe255qE5LiA5Lqb5L+h5oGvXG4gKiBAY2xhc3MgRGV0YWlsc1xuICpcbiAqL1xudmFyIERldGFpbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogbGlzdCBvZiB0aGUgZGVwZW5kcyBhc3NldHMnIHV1aWRcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ1tdfSB1dWlkTGlzdFxuICAgICAqL1xuICAgIHRoaXMudXVpZExpc3QgPSBbXTtcbiAgICAvKipcbiAgICAgKiB0aGUgb2JqIGxpc3Qgd2hvc2UgZmllbGQgbmVlZHMgdG8gbG9hZCBhc3NldCBieSB1dWlkXG4gICAgICogQHByb3BlcnR5IHtPYmplY3RbXX0gdXVpZE9iakxpc3RcbiAgICAgKi9cbiAgICB0aGlzLnV1aWRPYmpMaXN0ID0gW107XG4gICAgLyoqXG4gICAgICogdGhlIGNvcnJlc3BvbmRpbmcgZmllbGQgbmFtZSB3aGljaCByZWZlcmVuY2VkIHRvIHRoZSBhc3NldFxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nW119IHV1aWRQcm9wTGlzdFxuICAgICAqL1xuICAgIHRoaXMudXVpZFByb3BMaXN0ID0gW107XG5cbiAgICAvLyBUT0RPIC0gREVMTUUgc2luY2UgMi4wXG4gICAgdGhpcy5fc3RpbGxVc2VVcmwgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XG59O1xuLyoqXG4gKiBAbWV0aG9kIHJlc2V0XG4gKi9cbkRldGFpbHMucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudXVpZExpc3QubGVuZ3RoID0gMDtcbiAgICB0aGlzLnV1aWRPYmpMaXN0Lmxlbmd0aCA9IDA7XG4gICAgdGhpcy51dWlkUHJvcExpc3QubGVuZ3RoID0gMDtcbiAgICBqcy5jbGVhcih0aGlzLl9zdGlsbFVzZVVybCk7XG59O1xuaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgRGV0YWlscy5wcm90b3R5cGUuYXNzaWduQXNzZXRzQnkgPSBmdW5jdGlvbiAoZ2V0dGVyKSB7XG4gICAgICAgIC8vIGlnbm9yZSB0aGlzLl9zdGlsbFVzZVVybFxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy51dWlkTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIHV1aWQgPSB0aGlzLnV1aWRMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMudXVpZE9iakxpc3RbaV07XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMudXVpZFByb3BMaXN0W2ldO1xuICAgICAgICAgICAgb2JqW3Byb3BdID0gZ2V0dGVyKHV1aWQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbi8vIC8qKlxuLy8gICogQG1ldGhvZCBnZXRVdWlkT2Zcbi8vICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbi8vICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZVxuLy8gICogQHJldHVybiB7U3RyaW5nfVxuLy8gICovXG4vLyBEZXRhaWxzLnByb3RvdHlwZS5nZXRVdWlkT2YgPSBmdW5jdGlvbiAob2JqLCBwcm9wTmFtZSkge1xuLy8gICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy51dWlkT2JqTGlzdC5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgICBpZiAodGhpcy51dWlkT2JqTGlzdFtpXSA9PT0gb2JqICYmIHRoaXMudXVpZFByb3BMaXN0W2ldID09PSBwcm9wTmFtZSkge1xuLy8gICAgICAgICAgICAgcmV0dXJuIHRoaXMudXVpZExpc3RbaV07XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIFwiXCI7XG4vLyB9O1xuLyoqXG4gKiBAbWV0aG9kIHB1c2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHV1aWRcbiAqL1xuRGV0YWlscy5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChvYmosIHByb3BOYW1lLCB1dWlkLCBfc3RpbGxVc2VVcmwpIHtcbiAgICBpZiAoX3N0aWxsVXNlVXJsKSB7XG4gICAgICAgIHRoaXMuX3N0aWxsVXNlVXJsW3RoaXMudXVpZExpc3QubGVuZ3RoXSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudXVpZExpc3QucHVzaCh1dWlkKTtcbiAgICB0aGlzLnV1aWRPYmpMaXN0LnB1c2gob2JqKTtcbiAgICB0aGlzLnV1aWRQcm9wTGlzdC5wdXNoKHByb3BOYW1lKTtcbn07XG5cbkRldGFpbHMucG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChvYmopIHtcbiAgICBvYmoucmVzZXQoKTtcbn0sIDEwKTtcblxuRGV0YWlscy5wb29sLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0KCkgfHwgbmV3IERldGFpbHMoKTtcbn07XG5cbi8vIElNUExFTUVOVCBPRiBERVNFUklBTElaQVRJT05cblxudmFyIF9EZXNlcmlhbGl6ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIF9EZXNlcmlhbGl6ZXIocmVzdWx0LCB0YXJnZXQsIGNsYXNzRmluZGVyLCBjdXN0b21FbnYsIGlnbm9yZUVkaXRvck9ubHkpIHtcbiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgIHRoaXMuY3VzdG9tRW52ID0gY3VzdG9tRW52O1xuICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWREYXRhID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY2xhc3NGaW5kZXIgPSBjbGFzc0ZpbmRlcjtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5faWdub3JlRWRpdG9yT25seSA9IGlnbm9yZUVkaXRvck9ubHk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faWRMaXN0ID0gW107XG4gICAgICAgIHRoaXMuX2lkT2JqTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9pZFByb3BMaXN0ID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2RlcmVmZXJlbmNlIChzZWxmKSB7XG4gICAgICAgIC8vIOi/memHjOS4jemHh+eUqOmBjeWOhuWPjeW6j+WIl+WMlue7k+aenOeahOaWueW8j++8jOWboOS4uuWPjeW6j+WIl+WMlueahOe7k+aenOWmguaenOW8leeUqOWIsOWkjeadgueahOWklumDqOW6k++8jOW+iOWuueaYk+WghuagiOa6ouWHuuOAglxuICAgICAgICB2YXIgZGVzZXJpYWxpemVkTGlzdCA9IHNlbGYuZGVzZXJpYWxpemVkTGlzdDtcbiAgICAgICAgdmFyIGlkUHJvcExpc3QgPSBzZWxmLl9pZFByb3BMaXN0O1xuICAgICAgICB2YXIgaWRMaXN0ID0gc2VsZi5faWRMaXN0O1xuICAgICAgICB2YXIgaWRPYmpMaXN0ID0gc2VsZi5faWRPYmpMaXN0O1xuICAgICAgICB2YXIgb25EZXJlZmVyZW5jZWQgPSBzZWxmLl9jbGFzc0ZpbmRlciAmJiBzZWxmLl9jbGFzc0ZpbmRlci5vbkRlcmVmZXJlbmNlZDtcbiAgICAgICAgdmFyIGksIHByb3BOYW1lLCBpZDtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiBvbkRlcmVmZXJlbmNlZCkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGlkTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3BOYW1lID0gaWRQcm9wTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZCA9IGlkTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZE9iakxpc3RbaV1bcHJvcE5hbWVdID0gZGVzZXJpYWxpemVkTGlzdFtpZF07XG4gICAgICAgICAgICAgICAgb25EZXJlZmVyZW5jZWQoZGVzZXJpYWxpemVkTGlzdCwgaWQsIGlkT2JqTGlzdFtpXSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGlkTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3BOYW1lID0gaWRQcm9wTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZCA9IGlkTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZE9iakxpc3RbaV1bcHJvcE5hbWVdID0gZGVzZXJpYWxpemVkTGlzdFtpZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlID0gX0Rlc2VyaWFsaXplci5wcm90b3R5cGU7XG5cbiAgICBwcm90b3R5cGUuZGVzZXJpYWxpemUgPSBmdW5jdGlvbiAoanNvbk9iaikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShqc29uT2JqKSkge1xuICAgICAgICAgICAgdmFyIGpzb25BcnJheSA9IGpzb25PYmo7XG4gICAgICAgICAgICB2YXIgcmVmQ291bnQgPSBqc29uQXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0Lmxlbmd0aCA9IHJlZkNvdW50O1xuICAgICAgICAgICAgLy8gZGVzZXJpYWxpemVcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVmQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChqc29uQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWFpblRhcmdldCA9IChpID09PSAwICYmIHRoaXMuX3RhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3RbaV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uQXJyYXlbaV0sIGZhbHNlLCBtYWluVGFyZ2V0LCB0aGlzLmRlc2VyaWFsaXplZExpc3QsICcnICsgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3RbaV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uQXJyYXlbaV0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVzZXJpYWxpemVkRGF0YSA9IHJlZkNvdW50ID4gMCA/IHRoaXMuZGVzZXJpYWxpemVkTGlzdFswXSA6IFtdO1xuXG4gICAgICAgICAgICAvLy8vIGNhbGxiYWNrXG4gICAgICAgICAgICAvL2ZvciAodmFyIGogPSAwOyBqIDwgcmVmQ291bnQ7IGorKykge1xuICAgICAgICAgICAgLy8gICAgaWYgKHJlZmVyZW5jZWRMaXN0W2pdLm9uQWZ0ZXJEZXNlcmlhbGl6ZSkge1xuICAgICAgICAgICAgLy8gICAgICAgIHJlZmVyZW5jZWRMaXN0W2pdLm9uQWZ0ZXJEZXNlcmlhbGl6ZSgpO1xuICAgICAgICAgICAgLy8gICAgfVxuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3QubGVuZ3RoID0gMTtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzZXJpYWxpemVkRGF0YSA9IGpzb25PYmogPyB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uT2JqLCBmYWxzZSwgdGhpcy5fdGFyZ2V0LCB0aGlzLmRlc2VyaWFsaXplZExpc3QsICcwJykgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWREYXRhID0ganNvbk9iaiA/IHRoaXMuX2Rlc2VyaWFsaXplT2JqZWN0KGpzb25PYmosIGZhbHNlKSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3RbMF0gPSB0aGlzLmRlc2VyaWFsaXplZERhdGE7XG5cbiAgICAgICAgICAgIC8vLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIC8vaWYgKGRlc2VyaWFsaXplZERhdGEub25BZnRlckRlc2VyaWFsaXplKSB7XG4gICAgICAgICAgICAvLyAgICBkZXNlcmlhbGl6ZWREYXRhLm9uQWZ0ZXJEZXNlcmlhbGl6ZSgpO1xuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZXJlZmVyZW5jZVxuICAgICAgICBfZGVyZWZlcmVuY2UodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzZXJpYWxpemVkRGF0YTtcbiAgICB9O1xuXG4gICAgLy8vKipcbiAgICAvLyAqIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpemVkIC0gVGhlIG9iaiB0byBkZXNlcmlhbGl6ZSwgbXVzdCBiZSBub24tbmlsXG4gICAgLy8gKiBAcGFyYW0ge0Jvb2xlYW59IF9zdGlsbFVzZVVybFxuICAgIC8vICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXQ9bnVsbF0gLSBlZGl0b3Igb25seVxuICAgIC8vICogQHBhcmFtIHtPYmplY3R9IFtvd25lcl0gLSBkZWJ1ZyBvbmx5XG4gICAgLy8gKiBAcGFyYW0ge1N0cmluZ30gW3Byb3BOYW1lXSAtIGRlYnVnIG9ubHlcbiAgICAvLyAqL1xuICAgIHByb3RvdHlwZS5fZGVzZXJpYWxpemVPYmplY3QgPSBmdW5jdGlvbiAoc2VyaWFsaXplZCwgX3N0aWxsVXNlVXJsLCB0YXJnZXQsIG93bmVyLCBwcm9wTmFtZSkge1xuICAgICAgICB2YXIgcHJvcDtcbiAgICAgICAgdmFyIG9iaiA9IG51bGw7ICAgICAvLyB0aGUgb2JqIHRvIHJldHVyblxuICAgICAgICB2YXIga2xhc3MgPSBudWxsO1xuICAgICAgICB2YXIgdHlwZSA9IHNlcmlhbGl6ZWQuX190eXBlX187XG4gICAgICAgIGlmICh0eXBlID09PSAnVHlwZWRBcnJheScpIHtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHNlcmlhbGl6ZWQuYXJyYXk7XG4gICAgICAgICAgICBvYmogPSBuZXcgd2luZG93W3NlcmlhbGl6ZWQuY3Rvcl0oYXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBvYmpbaV0gPSBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSkge1xuXG4gICAgICAgICAgICAvLyBUeXBlIE9iamVjdCAoaW5jbHVkaW5nIENDQ2xhc3MpXG5cbiAgICAgICAgICAgIGtsYXNzID0gdGhpcy5fY2xhc3NGaW5kZXIodHlwZSwgc2VyaWFsaXplZCwgb3duZXIsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIGlmICgha2xhc3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm90UmVwb3J0ZWQgPSB0aGlzLl9jbGFzc0ZpbmRlciA9PT0ganMuX2dldENsYXNzQnlJZDtcbiAgICAgICAgICAgICAgICBpZiAobm90UmVwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZGVzZXJpYWxpemUucmVwb3J0TWlzc2luZ0NsYXNzKHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHRhcmdldFxuICAgICAgICAgICAgICAgIGlmICggISh0YXJnZXQgaW5zdGFuY2VvZiBrbGFzcykgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCg1MzAwLCBqcy5nZXRDbGFzc05hbWUodGFyZ2V0KSwga2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmogPSB0YXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpbnN0YW50aWF0ZSBhIG5ldyBvYmplY3RcbiAgICAgICAgICAgICAgICBvYmogPSBuZXcga2xhc3MoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9iai5fZGVzZXJpYWxpemUpIHtcbiAgICAgICAgICAgICAgICBvYmouX2Rlc2VyaWFsaXplKHNlcmlhbGl6ZWQuY29udGVudCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYy5DbGFzcy5faXNDQ0NsYXNzKGtsYXNzKSkge1xuICAgICAgICAgICAgICAgIF9kZXNlcmlhbGl6ZUZpcmVDbGFzcyh0aGlzLCBvYmosIHNlcmlhbGl6ZWQsIGtsYXNzLCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVUeXBlZE9iamVjdChvYmosIHNlcmlhbGl6ZWQsIGtsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggIUFycmF5LmlzQXJyYXkoc2VyaWFsaXplZCkgKSB7XG5cbiAgICAgICAgICAgIC8vIGVtYmVkZGVkIHByaW1pdGl2ZSBqYXZhc2NyaXB0IG9iamVjdFxuXG4gICAgICAgICAgICBvYmogPSAoKENDX0VESVRPUiB8fCBDQ19URVNUKSAmJiB0YXJnZXQpIHx8IHt9O1xuICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3Qob2JqLCBzZXJpYWxpemVkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgLy8gQXJyYXlcblxuICAgICAgICAgICAgaWYgKChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmxlbmd0aCA9IHNlcmlhbGl6ZWQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIG9iaiA9IHRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iaiA9IG5ldyBBcnJheShzZXJpYWxpemVkLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VyaWFsaXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBzZXJpYWxpemVkW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcgJiYgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rlc2VyaWFsaXplT2JqRmllbGQob2JqLCBwcm9wLCAnJyArIGksIHRhcmdldCAmJiBvYmosIF9zdGlsbFVzZVVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZXNlcmlhbGl6ZU9iakZpZWxkKG9iaiwgcHJvcCwgJycgKyBpLCBudWxsLCBfc3RpbGxVc2VVcmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYmpbaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICAvLyDlkowgX2Rlc2VyaWFsaXplT2JqZWN0IOS4jeWQjOeahOWcsOaWueWcqOS6juS8muWIpOaWrSBpZCDlkowgdXVpZFxuICAgIHByb3RvdHlwZS5fZGVzZXJpYWxpemVPYmpGaWVsZCA9IGZ1bmN0aW9uIChvYmosIGpzb25PYmosIHByb3BOYW1lLCB0YXJnZXQsIF9zdGlsbFVzZVVybCkge1xuICAgICAgICB2YXIgaWQgPSBqc29uT2JqLl9faWRfXztcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciB1dWlkID0ganNvbk9iai5fX3V1aWRfXztcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgICAgICAgICAgLy9pZiAoRU5BQkxFX1RBUkdFVCkge1xuICAgICAgICAgICAgICAgICAgICAvL+i/memHjOS4jeWBmuS7u+S9leaTjeS9nO+8jOWboOS4uuacieWPr+iDveiwg+eUqOiAhemcgOimgeefpemBk+S+nei1luWTquS6myBhc3NldOOAglxuICAgICAgICAgICAgICAgICAgICAvL+iwg+eUqOiAheS9v+eUqCB1dWlkTGlzdCDml7bvvIzlj6/ku6XliKTmlq0gb2JqW3Byb3BOYW1lXSDmmK/lkKbkuLrnqbrvvIzkuLrnqbrliJnooajnpLrlvoXov5vkuIDmraXliqDovb3vvIxcbiAgICAgICAgICAgICAgICAgICAgLy/kuI3kuLrnqbrliJnlj6rmmK/ooajmmI7kvp3otZblhbPns7vjgIJcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAodGFyZ2V0ICYmIHRhcmdldFtwcm9wTmFtZV0gJiYgdGFyZ2V0W3Byb3BOYW1lXS5fdXVpZCA9PT0gdXVpZCkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICBjb25zb2xlLmFzc2VydChvYmpbcHJvcE5hbWVdID09PSB0YXJnZXRbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChvYmosIHByb3BOYW1lLCB1dWlkLCBfc3RpbGxVc2VVcmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wTmFtZV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uT2JqLCBfc3RpbGxVc2VVcmwsIHRhcmdldCAmJiB0YXJnZXRbcHJvcE5hbWVdLCBvYmosIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wTmFtZV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uT2JqLCBfc3RpbGxVc2VVcmwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkT2JqID0gdGhpcy5kZXNlcmlhbGl6ZWRMaXN0W2lkXTtcbiAgICAgICAgICAgIGlmIChkT2JqKSB7XG4gICAgICAgICAgICAgICAgb2JqW3Byb3BOYW1lXSA9IGRPYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZExpc3QucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faWRPYmpMaXN0LnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZFByb3BMaXN0LnB1c2gocHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByb3RvdHlwZS5fZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3QgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIHNlcmlhbGl6ZWQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBzZXJpYWxpemVkKSB7XG4gICAgICAgICAgICBpZiAoc2VyaWFsaXplZC5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHNlcmlhbGl6ZWRbcHJvcE5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lICE9PSAnX190eXBlX18nLyogJiYgayAhPSAnX19pZF9fJyovKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fZGVzZXJpYWxpemVPYmpGaWVsZChpbnN0YW5jZSwgcHJvcCwgcHJvcE5hbWUsIHNlbGYuX3RhcmdldCAmJiBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9kZXNlcmlhbGl6ZU9iakZpZWxkKGluc3RhbmNlLCBwcm9wLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gZnVuY3Rpb24gX2NvbXBpbGVUeXBlZE9iamVjdCAoYWNjZXNzb3IsIGtsYXNzLCBjdG9yQ29kZSkge1xuICAgIC8vICAgICBpZiAoa2xhc3MgPT09IGNjLlZlYzIpIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBge2AgK1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYG8ke2FjY2Vzc29yfS54PXByb3AueHx8MDtgICtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ueT1wcm9wLnl8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgYH1gO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5Db2xvcikge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGB7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ucj1wcm9wLnJ8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uZz1wcm9wLmd8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uYj1wcm9wLmJ8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uYT0ocHJvcC5hPT09dW5kZWZpbmVkPzI1NTpwcm9wLmEpO2AgK1xuICAgIC8vICAgICAgICAgICAgICAgIGB9YDtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbHNlIGlmIChrbGFzcyA9PT0gY2MuU2l6ZSkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGB7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ud2lkdGg9cHJvcC53aWR0aHx8MDtgICtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgYG8ke2FjY2Vzc29yfS5oZWlnaHQ9cHJvcC5oZWlnaHR8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgYH1gO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2Uge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG8ke2FjY2Vzc29yfSxwcm9wLCR7Y3RvckNvZGV9KTtgO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgLy8gZGVzZXJpYWxpemUgVmFsdWVUeXBlXG4gICAgcHJvdG90eXBlLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBzZXJpYWxpemVkLCBrbGFzcykge1xuICAgICAgICBpZiAoa2xhc3MgPT09IGNjLlZlYzIpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnggPSBzZXJpYWxpemVkLnggfHwgMDtcbiAgICAgICAgICAgIGluc3RhbmNlLnkgPSBzZXJpYWxpemVkLnkgfHwgMDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrbGFzcyA9PT0gY2MuVmVjMykge1xuICAgICAgICAgICAgaW5zdGFuY2UueCA9IHNlcmlhbGl6ZWQueCB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UueSA9IHNlcmlhbGl6ZWQueSB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UueiA9IHNlcmlhbGl6ZWQueiB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5Db2xvcikge1xuICAgICAgICAgICAgaW5zdGFuY2UuciA9IHNlcmlhbGl6ZWQuciB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UuZyA9IHNlcmlhbGl6ZWQuZyB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UuYiA9IHNlcmlhbGl6ZWQuYiB8fCAwO1xuICAgICAgICAgICAgdmFyIGEgPSBzZXJpYWxpemVkLmE7XG4gICAgICAgICAgICBpbnN0YW5jZS5hID0gKGEgPT09IHVuZGVmaW5lZCA/IDI1NSA6IGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5TaXplKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS53aWR0aCA9IHNlcmlhbGl6ZWQud2lkdGggfHwgMDtcbiAgICAgICAgICAgIGluc3RhbmNlLmhlaWdodCA9IHNlcmlhbGl6ZWQuaGVpZ2h0IHx8IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgREVGQVVMVCA9IEF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoa2xhc3MpO1xuICAgICAgICB2YXIgZmFzdERlZmluZWRQcm9wcyA9IGtsYXNzLl9fcHJvcHNfXyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGluc3RhbmNlKTsgICAgLy8g6YGN5Y6GIGluc3RhbmNl77yM5aaC5p6c5YW35pyJ57G75Z6L77yM5omN5LiN5Lya5oqKIF9fdHlwZV9fIOS5n+ivu+i/m+adpVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZhc3REZWZpbmVkUHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IGZhc3REZWZpbmVkUHJvcHNbaV07XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzZXJpYWxpemVkW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICFzZXJpYWxpemVkLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBzZXJpYWxpemVkLFxuICAgICAgICAgICAgICAgIC8vIHJlY292ZXIgdG8gZGVmYXVsdCB2YWx1ZSBpbiBWYWx1ZVR5cGUsIGJlY2F1c2UgZWxpbWluYXRlZCBwcm9wZXJ0aWVzIGVxdWFscyB0b1xuICAgICAgICAgICAgICAgIC8vIGl0cyBkZWZhdWx0IHZhbHVlIGluIFZhbHVlVHlwZSwgbm90IGRlZmF1bHQgdmFsdWUgaW4gdXNlciBjbGFzc1xuICAgICAgICAgICAgICAgIHZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGF0dHJzW3Byb3BOYW1lICsgREVGQVVMVF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVPYmpGaWVsZChpbnN0YW5jZSwgdmFsdWUsIHByb3BOYW1lLCB0aGlzLl90YXJnZXQgJiYgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVPYmpGaWVsZChpbnN0YW5jZSwgdmFsdWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNvbXBpbGVPYmplY3RUeXBlSml0IChzb3VyY2VzLCBkZWZhdWx0VmFsdWUsIGFjY2Vzc29yVG9TZXQsIHByb3BOYW1lTGl0ZXJhbFRvU2V0LCBhc3N1bWVIYXZlUHJvcElmSXNWYWx1ZSwgc3RpbGxVc2VVcmwpIHtcbiAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSBpbnN0YW5jZW9mIGNjLlZhbHVlVHlwZSkge1xuICAgICAgICAgICAgLy8gZmFzdCBjYXNlXG4gICAgICAgICAgICBpZiAoIWFzc3VtZUhhdmVQcm9wSWZJc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKCdpZihwcm9wKXsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjdG9yQ29kZSA9IGpzLmdldENsYXNzTmFtZShkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgc291cmNlcy5wdXNoKGBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG8ke2FjY2Vzc29yVG9TZXR9LHByb3AsJHtjdG9yQ29kZX0pO2ApO1xuICAgICAgICAgICAgaWYgKCFhc3N1bWVIYXZlUHJvcElmSXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnfWVsc2UgbycgKyBhY2Nlc3NvclRvU2V0ICsgJz1udWxsOycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc291cmNlcy5wdXNoKCdpZihwcm9wKXsnKTtcbiAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goJ3MuX2Rlc2VyaWFsaXplT2JqRmllbGQobyxwcm9wLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcE5hbWVMaXRlcmFsVG9TZXQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgPyAnLHQmJm8sJyA6ICcsbnVsbCwnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhIXN0aWxsVXNlVXJsICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyk7Jyk7XG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ31lbHNlIG8nICsgYWNjZXNzb3JUb1NldCArICc9bnVsbDsnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb21waWxlRGVzZXJpYWxpemUgPSBDQ19TVVBQT1JUX0pJVCA/IGZ1bmN0aW9uIChzZWxmLCBrbGFzcykge1xuICAgICAgICB2YXIgVFlQRSA9IEF0dHIuREVMSU1FVEVSICsgJ3R5cGUnO1xuICAgICAgICB2YXIgRURJVE9SX09OTFkgPSBBdHRyLkRFTElNRVRFUiArICdlZGl0b3JPbmx5JztcbiAgICAgICAgdmFyIERFRkFVTFQgPSBBdHRyLkRFTElNRVRFUiArICdkZWZhdWx0JztcbiAgICAgICAgdmFyIFNBVkVfVVJMX0FTX0FTU0VUID0gQXR0ci5ERUxJTUVURVIgKyAnc2F2ZVVybEFzQXNzZXQnO1xuICAgICAgICB2YXIgRk9STUVSTFlfU0VSSUFMSVpFRF9BUyA9IEF0dHIuREVMSU1FVEVSICsgJ2Zvcm1lcmx5U2VyaWFsaXplZEFzJztcbiAgICAgICAgdmFyIGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcblxuICAgICAgICB2YXIgcHJvcHMgPSBrbGFzcy5fX3ZhbHVlc19fO1xuICAgICAgICAvLyBzZWxmLCBvYmosIHNlcmlhbGl6ZWREYXRhLCBrbGFzcywgdGFyZ2V0XG4gICAgICAgIHZhciBzb3VyY2VzID0gW1xuICAgICAgICAgICAgJ3ZhciBwcm9wOydcbiAgICAgICAgXTtcbiAgICAgICAgdmFyIGZhc3RNb2RlID0gbWlzYy5CVUlMVElOX0NMQVNTSURfUkUudGVzdChqcy5fZ2V0Q2xhc3NJZChrbGFzcykpO1xuICAgICAgICAvLyBzb3VyY2VzLnB1c2goJ3ZhciB2Yix2bix2cyx2byx2dSx2ZjsnKTsgICAgLy8gYm9vbGVhbiwgbnVtYmVyLCBzdHJpbmcsIG9iamVjdCwgdW5kZWZpbmVkLCBmdW5jdGlvblxuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wc1twXTtcbiAgICAgICAgICAgIGlmICgoQ0NfUFJFVklFVyB8fCAoQ0NfRURJVE9SICYmIHNlbGYuX2lnbm9yZUVkaXRvck9ubHkpKSAmJiBhdHRyc1twcm9wTmFtZSArIEVESVRPUl9PTkxZXSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAgIC8vIHNraXAgZWRpdG9yIG9ubHkgaWYgaW4gcHJldmlld1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWNjZXNzb3JUb1NldCwgcHJvcE5hbWVMaXRlcmFsVG9TZXQ7XG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5JREVOVElGSUVSX1JFLnRlc3QocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcHJvcE5hbWVMaXRlcmFsVG9TZXQgPSAnXCInICsgcHJvcE5hbWUgKyAnXCInO1xuICAgICAgICAgICAgICAgIGFjY2Vzc29yVG9TZXQgPSAnLicgKyBwcm9wTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BOYW1lTGl0ZXJhbFRvU2V0ID0gQ0NDbGFzcy5lc2NhcGVGb3JKUyhwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzb3JUb1NldCA9ICdbJyArIHByb3BOYW1lTGl0ZXJhbFRvU2V0ICsgJ10nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWNjZXNzb3JUb0dldCA9IGFjY2Vzc29yVG9TZXQ7XG4gICAgICAgICAgICBpZiAoYXR0cnNbcHJvcE5hbWUgKyBGT1JNRVJMWV9TRVJJQUxJWkVEX0FTXSkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZVRvUmVhZCA9IGF0dHJzW3Byb3BOYW1lICsgRk9STUVSTFlfU0VSSUFMSVpFRF9BU107XG4gICAgICAgICAgICAgICAgaWYgKENDQ2xhc3MuSURFTlRJRklFUl9SRS50ZXN0KHByb3BOYW1lVG9SZWFkKSkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NvclRvR2V0ID0gJy4nICsgcHJvcE5hbWVUb1JlYWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NvclRvR2V0ID0gJ1snICsgQ0NDbGFzcy5lc2NhcGVGb3JKUyhwcm9wTmFtZVRvUmVhZCkgKyAnXSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ3Byb3A9ZCcgKyBhY2Nlc3NvclRvR2V0ICsgJzsnKTtcbiAgICAgICAgICAgIHNvdXJjZXMucHVzaChgaWYodHlwZW9mICR7Q0NfSlNCIHx8IENDX1JVTlRJTUUgPyAnKHByb3ApJyA6ICdwcm9wJ30hPT1cInVuZGVmaW5lZFwiKXtgKTtcblxuICAgICAgICAgICAgdmFyIHN0aWxsVXNlVXJsID0gYXR0cnNbcHJvcE5hbWUgKyBTQVZFX1VSTF9BU19BU1NFVF07XG4gICAgICAgICAgICAvLyBmdW5jdGlvbiB1bmRlZmluZWQgb2JqZWN0KG51bGwpIHN0cmluZyBib29sZWFuIG51bWJlclxuICAgICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IENDQ2xhc3MuZ2V0RGVmYXVsdChhdHRyc1twcm9wTmFtZSArIERFRkFVTFRdKTtcbiAgICAgICAgICAgIGlmIChmYXN0TW9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBpc1ByaW1pdGl2ZVR5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXJUeXBlID0gYXR0cnNbcHJvcE5hbWUgKyBUWVBFXTtcbiAgICAgICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09PSB1bmRlZmluZWQgJiYgdXNlclR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNQcmltaXRpdmVUeXBlID0gdXNlclR5cGUgaW5zdGFuY2VvZiBBdHRyLlByaW1pdGl2ZVR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFR5cGUgPSB0eXBlb2YgZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ByaW1pdGl2ZVR5cGUgPSAoZGVmYXVsdFR5cGUgPT09ICdzdHJpbmcnICYmICFzdGlsbFVzZVVybCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlID09PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goYG8ke2FjY2Vzc29yVG9TZXR9PXByb3A7YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21waWxlT2JqZWN0VHlwZUppdChzb3VyY2VzLCBkZWZhdWx0VmFsdWUsIGFjY2Vzc29yVG9TZXQsIHByb3BOYW1lTGl0ZXJhbFRvU2V0LCB0cnVlLCBzdGlsbFVzZVVybCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKGBpZih0eXBlb2YgJHtDQ19KU0IgfHwgQ0NfUlVOVElNRSA/ICcocHJvcCknIDogJ3Byb3AnfSE9PVwib2JqZWN0XCIpe2AgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ28nICsgYWNjZXNzb3JUb1NldCArICc9cHJvcDsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ31lbHNleycpO1xuICAgICAgICAgICAgICAgIGNvbXBpbGVPYmplY3RUeXBlSml0KHNvdXJjZXMsIGRlZmF1bHRWYWx1ZSwgYWNjZXNzb3JUb1NldCwgcHJvcE5hbWVMaXRlcmFsVG9TZXQsIGZhbHNlLCBzdGlsbFVzZVVybCk7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKCd9Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ30nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2MuanMuaXNDaGlsZENsYXNzT2Yoa2xhc3MsIGNjLl9CYXNlTm9kZSkgfHwgY2MuanMuaXNDaGlsZENsYXNzT2Yoa2xhc3MsIGNjLkNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIGlmIChDQ19QUkVWSUVXIHx8IChDQ19FRElUT1IgJiYgc2VsZi5faWdub3JlRWRpdG9yT25seSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF5VXNlZEluUGVyc2lzdFJvb3QgPSBqcy5pc0NoaWxkQ2xhc3NPZihrbGFzcywgY2MuTm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1heVVzZWRJblBlcnNpc3RSb290KSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnZC5faWQmJihvLl9pZD1kLl9pZCk7Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKCdkLl9pZCYmKG8uX2lkPWQuX2lkKTsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcHNbcHJvcHMubGVuZ3RoIC0gMV0gPT09ICdfJGVyaWFsaXplZCcpIHtcbiAgICAgICAgICAgIC8vIGRlZXAgY29weSBvcmlnaW5hbCBzZXJpYWxpemVkIGRhdGFcbiAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnby5fJGVyaWFsaXplZD1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGQpKTsnKTtcbiAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBzZXJpYWxpemVkIGRhdGEgYXMgcHJpbWl0aXZlIGphdmFzY3JpcHQgb2JqZWN0LCBzbyBpdHMgX19pZF9fIHdpbGwgYmUgZGVyZWZlcmVuY2VkXG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ3MuX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0KG8uXyRlcmlhbGl6ZWQsZCk7Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKCdzJywgJ28nLCAnZCcsICdrJywgJ3QnLCBzb3VyY2VzLmpvaW4oJycpKTtcbiAgICB9IDogZnVuY3Rpb24gKHNlbGYsIGtsYXNzKSB7XG4gICAgICAgIHZhciBmYXN0TW9kZSA9IG1pc2MuQlVJTFRJTl9DTEFTU0lEX1JFLnRlc3QoanMuX2dldENsYXNzSWQoa2xhc3MpKTtcbiAgICAgICAgdmFyIHNob3VsZENvcHlJZCA9IGNjLmpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBjYy5fQmFzZU5vZGUpIHx8IGNjLmpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBjYy5Db21wb25lbnQpO1xuICAgICAgICB2YXIgc2hvdWxkQ29weVJhd0RhdGE7XG5cbiAgICAgICAgdmFyIHNpbXBsZVByb3BzID0gW107XG4gICAgICAgIHZhciBzaW1wbGVQcm9wc1RvUmVhZCA9IHNpbXBsZVByb3BzO1xuICAgICAgICB2YXIgYWR2YW5jZWRQcm9wcyA9IFtdO1xuICAgICAgICB2YXIgYWR2YW5jZWRQcm9wc1RvUmVhZCA9IGFkdmFuY2VkUHJvcHM7XG4gICAgICAgIHZhciBhZHZhbmNlZFByb3BzVXNlVXJsID0gW107XG4gICAgICAgIHZhciBhZHZhbmNlZFByb3BzVmFsdWVUeXBlID0gW107XG5cbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IGtsYXNzLl9fdmFsdWVzX187XG4gICAgICAgICAgICBzaG91bGRDb3B5UmF3RGF0YSA9IHByb3BzW3Byb3BzLmxlbmd0aCAtIDFdID09PSAnXyRlcmlhbGl6ZWQnO1xuXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoa2xhc3MpO1xuICAgICAgICAgICAgdmFyIFRZUEUgPSBBdHRyLkRFTElNRVRFUiArICd0eXBlJztcbiAgICAgICAgICAgIHZhciBERUZBVUxUID0gQXR0ci5ERUxJTUVURVIgKyAnZGVmYXVsdCc7XG4gICAgICAgICAgICB2YXIgU0FWRV9VUkxfQVNfQVNTRVQgPSBBdHRyLkRFTElNRVRFUiArICdzYXZlVXJsQXNBc3NldCc7XG4gICAgICAgICAgICB2YXIgRk9STUVSTFlfU0VSSUFMSVpFRF9BUyA9IEF0dHIuREVMSU1FVEVSICsgJ2Zvcm1lcmx5U2VyaWFsaXplZEFzJztcblxuICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3BzW3BdO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZVRvUmVhZCA9IHByb3BOYW1lO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyc1twcm9wTmFtZSArIEZPUk1FUkxZX1NFUklBTElaRURfQVNdKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BOYW1lVG9SZWFkID0gYXR0cnNbcHJvcE5hbWUgKyBGT1JNRVJMWV9TRVJJQUxJWkVEX0FTXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHN0aWxsVXNlVXJsID0gYXR0cnNbcHJvcE5hbWUgKyBTQVZFX1VSTF9BU19BU1NFVF07XG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gdW5kZWZpbmVkIG9iamVjdChudWxsKSBzdHJpbmcgYm9vbGVhbiBudW1iZXJcbiAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGF0dHJzW3Byb3BOYW1lICsgREVGQVVMVF0pO1xuICAgICAgICAgICAgICAgIHZhciBpc1ByaW1pdGl2ZVR5cGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoZmFzdE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJUeXBlID0gYXR0cnNbcHJvcE5hbWUgKyBUWVBFXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIHVzZXJUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ByaW1pdGl2ZVR5cGUgPSB1c2VyVHlwZSBpbnN0YW5jZW9mIEF0dHIuUHJpbWl0aXZlVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0VHlwZSA9IHR5cGVvZiBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ByaW1pdGl2ZVR5cGUgPSAoZGVmYXVsdFR5cGUgPT09ICdzdHJpbmcnICYmICFzdGlsbFVzZVVybCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgPT09ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmFzdE1vZGUgJiYgaXNQcmltaXRpdmVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZVRvUmVhZCAhPT0gcHJvcE5hbWUgJiYgc2ltcGxlUHJvcHNUb1JlYWQgPT09IHNpbXBsZVByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGVQcm9wc1RvUmVhZCA9IHNpbXBsZVByb3BzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2ltcGxlUHJvcHMucHVzaChwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW1wbGVQcm9wc1RvUmVhZCAhPT0gc2ltcGxlUHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZVByb3BzVG9SZWFkLnB1c2gocHJvcE5hbWVUb1JlYWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWVUb1JlYWQgIT09IHByb3BOYW1lICYmIGFkdmFuY2VkUHJvcHNUb1JlYWQgPT09IGFkdmFuY2VkUHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHNUb1JlYWQgPSBhZHZhbmNlZFByb3BzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wcy5wdXNoKHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkdmFuY2VkUHJvcHNUb1JlYWQgIT09IGFkdmFuY2VkUHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHNUb1JlYWQucHVzaChwcm9wTmFtZVRvUmVhZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wc1VzZVVybC5wdXNoKHN0aWxsVXNlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wc1ZhbHVlVHlwZS5wdXNoKChkZWZhdWx0VmFsdWUgaW5zdGFuY2VvZiBjYy5WYWx1ZVR5cGUpICYmIGRlZmF1bHRWYWx1ZS5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAocywgbywgZCwgaywgdCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW1wbGVQcm9wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gZFtzaW1wbGVQcm9wc1RvUmVhZFtpXV07XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvW3NpbXBsZVByb3BzW2ldXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZHZhbmNlZFByb3BzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BOYW1lID0gYWR2YW5jZWRQcm9wc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IGRbYWR2YW5jZWRQcm9wc1RvUmVhZFtpXV07XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFmYXN0TW9kZSAmJiB0eXBlb2YgcHJvcCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb1twcm9wTmFtZV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmFzdE1vZGUgKHNvIHdpbGwgbm90IHNpbXBsZVByb3ApIG9yIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVUeXBlQ3RvciA9IGFkdmFuY2VkUHJvcHNWYWx1ZVR5cGVbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVR5cGVDdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFzdE1vZGUgfHwgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMuX2Rlc2VyaWFsaXplVHlwZWRPYmplY3Qob1twcm9wTmFtZV0sIHByb3AsIHZhbHVlVHlwZUN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb1twcm9wTmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLl9kZXNlcmlhbGl6ZU9iakZpZWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKENDX0VESVRPUiB8fCBDQ19URVNUKSA/ICh0ICYmIG8pIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wc1VzZVVybFtpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb1twcm9wTmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNob3VsZENvcHlJZCAmJiBkLl9pZCkge1xuICAgICAgICAgICAgICAgIG8uX2lkID0gZC5faWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ29weVJhd0RhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBkZWVwIGNvcHkgb3JpZ2luYWwgc2VyaWFsaXplZCBkYXRhXG4gICAgICAgICAgICAgICAgby5fJGVyaWFsaXplZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZCkpO1xuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBzZXJpYWxpemVkIGRhdGEgYXMgcHJpbWl0aXZlIGphdmFzY3JpcHQgb2JqZWN0LCBzbyBpdHMgX19pZF9fIHdpbGwgYmUgZGVyZWZlcmVuY2VkXG4gICAgICAgICAgICAgICAgcy5fZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3Qoby5fJGVyaWFsaXplZCwgZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdW5saW5rVW51c2VkUHJlZmFiIChzZWxmLCBzZXJpYWxpemVkLCBvYmopIHtcbiAgICAgICAgdmFyIHV1aWQgPSBzZXJpYWxpemVkWydhc3NldCddICYmIHNlcmlhbGl6ZWRbJ2Fzc2V0J10uX191dWlkX187XG4gICAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgICAgICB2YXIgbGFzdCA9IHNlbGYucmVzdWx0LnV1aWRMaXN0Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAoc2VsZi5yZXN1bHQudXVpZExpc3RbbGFzdF0gPT09IHV1aWQgJiZcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdC51dWlkT2JqTGlzdFtsYXN0XSA9PT0gb2JqICYmXG4gICAgICAgICAgICAgICAgc2VsZi5yZXN1bHQudXVpZFByb3BMaXN0W2xhc3RdID09PSAnYXNzZXQnKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXN1bHQudXVpZExpc3QucG9wKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXN1bHQudXVpZE9iakxpc3QucG9wKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXN1bHQudXVpZFByb3BMaXN0LnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlYnVnRW52T25seUluZm8gPSAnRmFpbGVkIHRvIHNraXAgcHJlZmFiIGFzc2V0IHdoaWxlIGRlc2VyaWFsaXppbmcgUHJlZmFiSW5mbyc7XG4gICAgICAgICAgICAgICAgY2Mud2FybihkZWJ1Z0Vudk9ubHlJbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9kZXNlcmlhbGl6ZUZpcmVDbGFzcyAoc2VsZiwgb2JqLCBzZXJpYWxpemVkLCBrbGFzcywgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBkZXNlcmlhbGl6ZTtcbiAgICAgICAgaWYgKGtsYXNzLmhhc093blByb3BlcnR5KCdfX2Rlc2VyaWFsaXplX18nKSkge1xuICAgICAgICAgICAgZGVzZXJpYWxpemUgPSBrbGFzcy5fX2Rlc2VyaWFsaXplX187XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXNlcmlhbGl6ZSA9IGNvbXBpbGVEZXNlcmlhbGl6ZShzZWxmLCBrbGFzcyk7XG4gICAgICAgICAgICAvLyBpZiAoQ0NfVEVTVCAmJiAhaXNQaGFudG9tSlMpIHtcbiAgICAgICAgICAgIC8vICAgICBjYy5sb2coZGVzZXJpYWxpemUpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAganMudmFsdWUoa2xhc3MsICdfX2Rlc2VyaWFsaXplX18nLCBkZXNlcmlhbGl6ZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVzZXJpYWxpemUoc2VsZiwgb2JqLCBzZXJpYWxpemVkLCBrbGFzcywgdGFyZ2V0KTtcbiAgICAgICAgLy8gaWYgcHJldmlldyBvciBidWlsZCB3b3JrZXJcbiAgICAgICAgaWYgKENDX1BSRVZJRVcgfHwgKENDX0VESVRPUiAmJiBzZWxmLl9pZ25vcmVFZGl0b3JPbmx5KSkge1xuICAgICAgICAgICAgaWYgKGtsYXNzID09PSBjYy5fUHJlZmFiSW5mbyAmJiAhb2JqLnN5bmMpIHtcbiAgICAgICAgICAgICAgICB1bmxpbmtVbnVzZWRQcmVmYWIoc2VsZiwgc2VyaWFsaXplZCwgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9EZXNlcmlhbGl6ZXIucG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgb2JqLnJlc3VsdCA9IG51bGw7XG4gICAgICAgIG9iai5jdXN0b21FbnYgPSBudWxsO1xuICAgICAgICBvYmouZGVzZXJpYWxpemVkTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICBvYmouZGVzZXJpYWxpemVkRGF0YSA9IG51bGw7XG4gICAgICAgIG9iai5fY2xhc3NGaW5kZXIgPSBudWxsO1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBvYmouX3RhcmdldCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgb2JqLl9pZExpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgb2JqLl9pZE9iakxpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgb2JqLl9pZFByb3BMaXN0Lmxlbmd0aCA9IDA7XG4gICAgfSwgMSk7XG5cbiAgICBfRGVzZXJpYWxpemVyLnBvb2wuZ2V0ID0gZnVuY3Rpb24gKHJlc3VsdCwgdGFyZ2V0LCBjbGFzc0ZpbmRlciwgY3VzdG9tRW52LCBpZ25vcmVFZGl0b3JPbmx5KSB7XG4gICAgICAgIHZhciBjYWNoZSA9IHRoaXMuX2dldCgpO1xuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgIGNhY2hlLnJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIGNhY2hlLmN1c3RvbUVudiA9IGN1c3RvbUVudjtcbiAgICAgICAgICAgIGNhY2hlLl9jbGFzc0ZpbmRlciA9IGNsYXNzRmluZGVyO1xuICAgICAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgIGNhY2hlLl90YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgY2FjaGUuX2lnbm9yZUVkaXRvck9ubHkgPSBpZ25vcmVFZGl0b3JPbmx5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBfRGVzZXJpYWxpemVyKHJlc3VsdCwgdGFyZ2V0LCBjbGFzc0ZpbmRlciwgY3VzdG9tRW52LCBpZ25vcmVFZGl0b3JPbmx5KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX0Rlc2VyaWFsaXplcjtcbn0pKCk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBEZXNlcmlhbGl6ZSBqc29uIHRvIGNjLkFzc2V0XG4gKiAhI3poIOWwhiBKU09OIOWPjeW6j+WIl+WMluS4uuWvueixoeWunuS+i+OAglxuICpcbiAqIOW9k+aMh+WumuS6hiB0YXJnZXQg6YCJ6aG55pe277yM5aaC5p6cIHRhcmdldCDlvJXnlKjnmoTlhbblroMgYXNzZXQg55qEIHV1aWQg5LiN5Y+Y77yM5YiZ5LiN5Lya5pS55Y+YIHRhcmdldCDlr7kgYXNzZXQg55qE5byV55So77yMXG4gKiDkuZ/kuI3kvJrlsIYgdXVpZCDkv53lrZjliLAgcmVzdWx0IOWvueixoeS4reOAglxuICpcbiAqIEBtZXRob2QgZGVzZXJpYWxpemVcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YSAtIHRoZSBzZXJpYWxpemVkIGNjLkFzc2V0IGpzb24gc3RyaW5nIG9yIGpzb24gb2JqZWN0LlxuICogQHBhcmFtIHtEZXRhaWxzfSBbZGV0YWlsc10gLSBhZGRpdGlvbmFsIGxvYWRpbmcgcmVzdWx0XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtvYmplY3R9IHRoZSBtYWluIGRhdGEoYXNzZXQpXG4gKi9cbmNjLmRlc2VyaWFsaXplID0gZnVuY3Rpb24gKGRhdGEsIGRldGFpbHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgY2xhc3NGaW5kZXIgPSBvcHRpb25zLmNsYXNzRmluZGVyIHx8IGpzLl9nZXRDbGFzc0J5SWQ7XG4gICAgLy8g5ZCv55SoIGNyZWF0ZUFzc2V0UmVmcyDlkI7vvIzlpoLmnpzmnIkgdXJsIOWxnuaAp+WImeS8muiiq+e7n+S4gOW8uuWItuiuvue9ruS4uiB7IHV1aWQ6ICd4eHgnIH3vvIzlv4XpobvlkI7pnaLlho3nibnmrorlpITnkIZcbiAgICB2YXIgY3JlYXRlQXNzZXRSZWZzID0gb3B0aW9ucy5jcmVhdGVBc3NldFJlZnMgfHwgY2Muc3lzLnBsYXRmb3JtID09PSBjYy5zeXMuRURJVE9SX0NPUkU7XG4gICAgdmFyIHRhcmdldCA9IChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgb3B0aW9ucy50YXJnZXQ7XG4gICAgdmFyIGN1c3RvbUVudiA9IG9wdGlvbnMuY3VzdG9tRW52O1xuICAgIHZhciBpZ25vcmVFZGl0b3JPbmx5ID0gb3B0aW9ucy5pZ25vcmVFZGl0b3JPbmx5O1xuXG4gICAgaWYgKENDX0VESVRPUiAmJiBCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH1cblxuICAgIC8vdmFyIG9sZEpzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKTtcblxuICAgIHZhciB0ZW1wRGV0YWlscyA9ICFkZXRhaWxzO1xuICAgIGRldGFpbHMgPSBkZXRhaWxzIHx8IERldGFpbHMucG9vbC5nZXQoKTtcbiAgICB2YXIgZGVzZXJpYWxpemVyID0gX0Rlc2VyaWFsaXplci5wb29sLmdldChkZXRhaWxzLCB0YXJnZXQsIGNsYXNzRmluZGVyLCBjdXN0b21FbnYsIGlnbm9yZUVkaXRvck9ubHkpO1xuXG4gICAgY2MuZ2FtZS5faXNDbG9uaW5nID0gdHJ1ZTtcbiAgICB2YXIgcmVzID0gZGVzZXJpYWxpemVyLmRlc2VyaWFsaXplKGRhdGEpO1xuICAgIGNjLmdhbWUuX2lzQ2xvbmluZyA9IGZhbHNlO1xuXG4gICAgX0Rlc2VyaWFsaXplci5wb29sLnB1dChkZXNlcmlhbGl6ZXIpO1xuICAgIGlmIChjcmVhdGVBc3NldFJlZnMpIHtcbiAgICAgICAgZGV0YWlscy5hc3NpZ25Bc3NldHNCeShFZGl0b3Iuc2VyaWFsaXplLmFzQXNzZXQpO1xuICAgIH1cbiAgICBpZiAodGVtcERldGFpbHMpIHtcbiAgICAgICAgRGV0YWlscy5wb29sLnB1dChkZXRhaWxzKTtcbiAgICB9XG5cbiAgICAvL3ZhciBhZnRlckpzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKTtcbiAgICAvL2lmIChvbGRKc29uICE9PSBhZnRlckpzb24pIHtcbiAgICAvLyAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT04gU0hPVUxEIG5vdCBjaGFuZ2VkJyk7XG4gICAgLy99XG5cbiAgICByZXR1cm4gcmVzO1xufTtcblxuY2MuZGVzZXJpYWxpemUuRGV0YWlscyA9IERldGFpbHM7XG5jYy5kZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3MgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICBpZiAoQ0NfRURJVE9SICYmIEVkaXRvci5VdGlscy5VdWlkVXRpbHMuaXNVdWlkKGlkKSkge1xuICAgICAgICBpZCA9IEVkaXRvci5VdGlscy5VdWlkVXRpbHMuZGVjb21wcmVzc1V1aWQoaWQpO1xuICAgICAgICBjYy53YXJuSUQoNTMwMSwgaWQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2Mud2FybklEKDUzMDIsIGlkKTtcbiAgICB9XG59OyJdfQ==