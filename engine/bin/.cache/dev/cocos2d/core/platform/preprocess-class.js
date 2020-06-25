
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/preprocess-class.js';
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

var Attrs = require('./attribute'); // 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。


var SerializableAttrs = {
  url: {
    canUsedInGet: true
  },
  "default": {},
  serializable: {},
  editorOnly: {},
  formerlySerializedAs: {}
};
var TYPO_TO_CORRECT_DEV = CC_DEV && {
  extend: 'extends',
  property: 'properties',
  "static": 'statics',
  constructor: 'ctor'
}; // 预处理 notify 等扩展属性

function parseNotify(val, propName, notify, properties) {
  if (val.get || val.set) {
    if (CC_DEV) {
      cc.warnID(5500);
    }

    return;
  }

  if (val.hasOwnProperty('default')) {
    // 添加新的内部属性，将原来的属性修改为 getter/setter 形式
    // （以 _ 开头将自动设置property 为 visible: false）
    var newKey = "_N$" + propName;

    val.get = function () {
      return this[newKey];
    };

    val.set = function (value) {
      var oldValue = this[newKey];
      this[newKey] = value;
      notify.call(this, oldValue);
    };

    if (CC_EDITOR) {
      val.notifyFor = newKey;
    }

    var newValue = {};
    properties[newKey] = newValue; // 将不能用于get方法中的属性移动到newValue中

    for (var attr in SerializableAttrs) {
      var v = SerializableAttrs[attr];

      if (val.hasOwnProperty(attr)) {
        newValue[attr] = val[attr];

        if (!v.canUsedInGet) {
          delete val[attr];
        }
      }
    }
  } else if (CC_DEV) {
    cc.warnID(5501);
  }
}

function checkUrl(val, className, propName, url) {
  if (Array.isArray(url)) {
    if (url.length > 0) {
      url = url[0];
    } else if (CC_EDITOR) {
      return cc.errorID(5502, className, propName);
    }
  }

  if (CC_EDITOR) {
    if (url == null) {
      return cc.warnID(5503, className, propName);
    }

    if (typeof url !== 'function' || !js.isChildClassOf(url, cc.RawAsset)) {
      return cc.errorID(5504, className, propName);
    }

    if (url === cc.RawAsset) {
      cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' + 'the use of declaring a property in CCClass as a URL has been deprecated.\n' + 'For example, if property is cc.RawAsset, the previous definition is:\n' + '    %s: cc.RawAsset,\n' + '    // or:\n' + '    %s: {\n' + '      url: cc.RawAsset,\n' + '      default: ""\n' + '    },\n' + '    // and the original method to get url is:\n' + '    `this.%s`\n' + 'Now it should be changed to:\n' + '    %s: {\n' + '      type: cc.Asset,     // use \'type:\' to define Asset object directly\n' + '      default: null,      // object\'s default value is null\n' + '    },\n' + '    // and you must get the url by using:\n' + '    `this.%s.nativeUrl`\n' + '(This helps us to successfully refactor all RawAssets at v2.0, ' + "sorry for the inconvenience. \uD83D\uDE30 )", propName, className, propName, propName, propName, propName, propName);
    } else if (js.isChildClassOf(url, cc.Asset)) {
      if (cc.RawAsset.wasRawAssetType(url)) {
        if (!val._short) {
          cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' + 'the use of declaring a property in CCClass as a URL has been deprecated.\n' + 'For example, if property is Texture2D, the previous definition is:\n' + '    %s: cc.Texture2D,\n' + '    // or:\n' + '    %s: {\n' + '      url: cc.Texture2D,\n' + '      default: ""\n' + '    },\n' + 'Now it should be changed to:\n' + '    %s: {\n' + '      type: cc.Texture2D, // use \'type:\' to define Texture2D object directly\n' + '      default: null,      // object\'s default value is null\n' + '    },\n' + '(This helps us to successfully refactor all RawAssets at v2.0, ' + "sorry for the inconvenience. \uD83D\uDE30 )", propName, className, propName, propName, propName);
        }
      } else {
        return cc.errorID(5505, className, propName, cc.js.getClassName(url));
      }
    }

    if (val.type) {
      return cc.warnID(5506, className, propName);
    }
  }

  val.type = url;
}

function parseType(val, type, className, propName) {
  var STATIC_CHECK = CC_EDITOR && CC_DEV || CC_TEST;

  if (Array.isArray(type)) {
    if (STATIC_CHECK && 'default' in val) {
      var isArray = require('./CCClass').isArray; // require lazily to avoid circular require() calls


      if (!isArray(val["default"])) {
        cc.warnID(5507, className, propName);
      }
    }

    if (type.length > 0) {
      if (cc.RawAsset.isRawAssetType(type[0])) {
        val.url = type[0];
        delete val.type;
        return;
      } else {
        val.type = type = type[0];
      }
    } else {
      return cc.errorID(5508, className, propName);
    }
  }

  if (typeof type === 'function') {
    if (type === String) {
      val.type = cc.String;

      if (STATIC_CHECK) {
        cc.warnID(3608, "\"" + className + "." + propName + "\"");
      }
    } else if (type === Boolean) {
      val.type = cc.Boolean;

      if (STATIC_CHECK) {
        cc.warnID(3609, "\"" + className + "." + propName + "\"");
      }
    } else if (type === Number) {
      val.type = cc.Float;

      if (STATIC_CHECK) {
        cc.warnID(3610, "\"" + className + "." + propName + "\"");
      }
    } else if (STATIC_CHECK && cc.RawAsset.isRawAssetType(type)) {
      cc.warnID(5509, className, propName, js.getClassName(type));
    }
  } else if (STATIC_CHECK) {
    switch (type) {
      case 'Number':
        cc.warnID(5510, className, propName);
        break;

      case 'String':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.String, not \"String\".");
        break;

      case 'Boolean':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.Boolean, not \"Boolean\".");
        break;

      case 'Float':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.Float, not \"Float\".");
        break;

      case 'Integer':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.Integer, not \"Integer\".");
        break;

      case null:
        cc.warnID(5511, className, propName);
        break;
    }
  }
}

function postCheckType(val, type, className, propName) {
  if (CC_EDITOR && typeof type === 'function') {
    if (cc.Class._isCCClass(type) && val.serializable !== false && !js._getClassId(type, false)) {
      cc.warnID(5512, className, propName, className, propName);
    }
  }
}

function getBaseClassWherePropertyDefined_DEV(propName, cls) {
  if (CC_DEV) {
    var res;

    for (; cls && cls.__props__ && cls.__props__.indexOf(propName) !== -1; cls = cls.$super) {
      res = cls;
    }

    if (!res) {
      cc.error('unknown error');
    }

    return res;
  }
}

exports.getFullFormOfProperty = function (options, propname_dev, classname_dev) {
  var isLiteral = options && options.constructor === Object;

  if (isLiteral) {
    return null;
  }

  if (Array.isArray(options) && options.length > 0) {
    var type = options[0];

    if (CC_DEV && cc.RawAsset.wasRawAssetType(type)) {
      // deprecate `myProp: [cc.Texture2D]` since 1.10
      cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' + 'properties in CCClass can not be abbreviated if they are of type RawAsset.\n' + 'Please use the complete form.\n' + 'For example, if property is Texture2D\'s url array, the previous definition is:\n' + '    %s: [cc.Texture2D],\n' + 'If you use JS, it should be changed to:\n' + '    %s: {\n' + '      type: cc.Texture2D, // use \'type:\' to define an array of Texture2D objects\n' + '      default: []\n' + '    },\n' + 'If you use TS, it should be changed to:\n' + '    %s: {\n' + '      type: cc.Texture2D, // use \'type:\' to define an array of Texture2D objects\n' + '    }\n' + '   %s: cc.Texture2D[] = [];\n' + '(This helps us to successfully refactor all RawAssets at v2.0, ' + "sorry for the inconvenience. \uD83D\uDE30 )", propname_dev, classname_dev, propname_dev, propname_dev);
      return {
        "default": [],
        url: options,
        _short: true
      };
    }

    return {
      "default": [],
      type: options,
      _short: true
    };
  } else if (typeof options === 'function') {
    var _type = options;

    if (!cc.RawAsset.isRawAssetType(_type)) {
      if (cc.RawAsset.wasRawAssetType(_type)) {
        // deprecate `myProp: cc.Texture2D` since 1.10
        if (CC_DEV) {
          cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' + 'properties in CCClass can not be abbreviated if they are of type RawAsset.\n' + 'Please use the complete form.\n' + 'For example, if the type is Texture2D, the previous definition is:\n' + '    %s: cc.Texture2D,\n' + 'If you use JS, it should be changed to:\n' + '    %s: {\n' + '      type: cc.Texture2D // use \'type:\' to define Texture2D object directly\n' + '      default: null,     // object\'s default value is null\n' + '    },\n' + 'If you use TS, it should be changed to:\n' + '    %s: {\n' + '      type: cc.Texture2D // use \'type:\' to define Texture2D object directly\n' + '    }\n' + '    %s: cc.Texture2D = null;\n' + '(This helps us to successfully refactor all RawAssets at v2.0, ' + "sorry for the inconvenience. \uD83D\uDE30 )", propname_dev, classname_dev, propname_dev, propname_dev);
        }
      } else {
        return {
          "default": js.isChildClassOf(_type, cc.ValueType) ? new _type() : null,
          type: _type,
          _short: true
        };
      }
    }

    return {
      "default": '',
      url: _type,
      _short: true
    };
  } else if (options instanceof Attrs.PrimitiveType) {
    return {
      "default": options["default"],
      _short: true
    };
  } else {
    return {
      "default": options,
      _short: true
    };
  }
};

exports.preprocessAttrs = function (properties, className, cls, es6) {
  for (var propName in properties) {
    var val = properties[propName];
    var fullForm = exports.getFullFormOfProperty(val, propName, className);

    if (fullForm) {
      val = properties[propName] = fullForm;
    }

    if (val) {
      if (CC_EDITOR) {
        if ('default' in val) {
          if (val.get) {
            cc.errorID(5513, className, propName);
          } else if (val.set) {
            cc.errorID(5514, className, propName);
          } else if (cc.Class._isCCClass(val["default"])) {
            val["default"] = null;
            cc.errorID(5515, className, propName);
          }
        } else if (!val.get && !val.set) {
          var maybeTypeScript = es6;

          if (!maybeTypeScript) {
            cc.errorID(5516, className, propName);
          }
        }
      }

      if (CC_DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
        // check override
        var baseClass = js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
        cc.warnID(5517, className, propName, baseClass, propName);
      }

      var notify = val.notify;

      if (notify) {
        if (CC_DEV && es6) {
          cc.error('not yet support notify attribute for ES6 Classes');
        } else {
          parseNotify(val, propName, notify, properties);
        }
      }

      if ('type' in val) {
        parseType(val, val.type, className, propName);
      }

      if ('url' in val) {
        checkUrl(val, className, propName, val.url);
      }

      if ('type' in val) {
        postCheckType(val, val.type, className, propName);
      }
    }
  }
};

if (CC_DEV) {
  var CALL_SUPER_DESTROY_REG_DEV = /\b\._super\b|destroy\s*\.\s*call\s*\(\s*\w+\s*[,|)]/;

  exports.doValidateMethodWithProps_DEV = function (func, funcName, className, cls, base) {
    if (cls.__props__ && cls.__props__.indexOf(funcName) >= 0) {
      // find class that defines this method as a property
      var baseClassName = js.getClassName(getBaseClassWherePropertyDefined_DEV(funcName, cls));
      cc.errorID(3648, className, funcName, baseClassName);
      return false;
    }

    if (funcName === 'destroy' && js.isChildClassOf(base, cc.Component) && !CALL_SUPER_DESTROY_REG_DEV.test(func)) {
      cc.error("Overwriting '" + funcName + "' function in '" + className + "' class without calling super is not allowed. Call the super function in '" + funcName + "' please.");
    }
  };
}

exports.validateMethodWithProps = function (func, funcName, className, cls, base) {
  if (CC_DEV && funcName === 'constructor') {
    cc.errorID(3643, className);
    return false;
  }

  if (typeof func === 'function' || func === null) {
    if (CC_DEV) {
      this.doValidateMethodWithProps_DEV(func, funcName, className, cls, base);
    }
  } else {
    if (CC_DEV) {
      if (func === false && base && base.prototype) {
        // check override
        var overrided = base.prototype[funcName];

        if (typeof overrided === 'function') {
          var baseFuc = js.getClassName(base) + '.' + funcName;
          var subFuc = className + '.' + funcName;
          cc.warnID(3624, subFuc, baseFuc, subFuc, subFuc);
        }
      }

      var correct = TYPO_TO_CORRECT_DEV[funcName];

      if (correct) {
        cc.warnID(3621, className, funcName, correct);
      } else if (func) {
        cc.errorID(3622, className, funcName);
      }
    }

    return false;
  }

  return true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXByb2Nlc3MtY2xhc3MuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiQXR0cnMiLCJTZXJpYWxpemFibGVBdHRycyIsInVybCIsImNhblVzZWRJbkdldCIsInNlcmlhbGl6YWJsZSIsImVkaXRvck9ubHkiLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsIlRZUE9fVE9fQ09SUkVDVF9ERVYiLCJDQ19ERVYiLCJleHRlbmQiLCJwcm9wZXJ0eSIsImNvbnN0cnVjdG9yIiwicGFyc2VOb3RpZnkiLCJ2YWwiLCJwcm9wTmFtZSIsIm5vdGlmeSIsInByb3BlcnRpZXMiLCJnZXQiLCJzZXQiLCJjYyIsIndhcm5JRCIsImhhc093blByb3BlcnR5IiwibmV3S2V5IiwidmFsdWUiLCJvbGRWYWx1ZSIsImNhbGwiLCJDQ19FRElUT1IiLCJub3RpZnlGb3IiLCJuZXdWYWx1ZSIsImF0dHIiLCJ2IiwiY2hlY2tVcmwiLCJjbGFzc05hbWUiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJlcnJvcklEIiwiaXNDaGlsZENsYXNzT2YiLCJSYXdBc3NldCIsIndhcm4iLCJBc3NldCIsIndhc1Jhd0Fzc2V0VHlwZSIsIl9zaG9ydCIsImdldENsYXNzTmFtZSIsInR5cGUiLCJwYXJzZVR5cGUiLCJTVEFUSUNfQ0hFQ0siLCJDQ19URVNUIiwiaXNSYXdBc3NldFR5cGUiLCJTdHJpbmciLCJCb29sZWFuIiwiTnVtYmVyIiwiRmxvYXQiLCJwb3N0Q2hlY2tUeXBlIiwiQ2xhc3MiLCJfaXNDQ0NsYXNzIiwiX2dldENsYXNzSWQiLCJnZXRCYXNlQ2xhc3NXaGVyZVByb3BlcnR5RGVmaW5lZF9ERVYiLCJjbHMiLCJyZXMiLCJfX3Byb3BzX18iLCJpbmRleE9mIiwiJHN1cGVyIiwiZXJyb3IiLCJleHBvcnRzIiwiZ2V0RnVsbEZvcm1PZlByb3BlcnR5Iiwib3B0aW9ucyIsInByb3BuYW1lX2RldiIsImNsYXNzbmFtZV9kZXYiLCJpc0xpdGVyYWwiLCJPYmplY3QiLCJWYWx1ZVR5cGUiLCJQcmltaXRpdmVUeXBlIiwicHJlcHJvY2Vzc0F0dHJzIiwiZXM2IiwiZnVsbEZvcm0iLCJtYXliZVR5cGVTY3JpcHQiLCJvdmVycmlkZSIsImJhc2VDbGFzcyIsIkNBTExfU1VQRVJfREVTVFJPWV9SRUdfREVWIiwiZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYiLCJmdW5jIiwiZnVuY05hbWUiLCJiYXNlIiwiYmFzZUNsYXNzTmFtZSIsIkNvbXBvbmVudCIsInRlc3QiLCJ2YWxpZGF0ZU1ldGhvZFdpdGhQcm9wcyIsInByb3RvdHlwZSIsIm92ZXJyaWRlZCIsImJhc2VGdWMiLCJzdWJGdWMiLCJjb3JyZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQXJCLEVBRUE7OztBQUVBLElBQUlFLGlCQUFpQixHQUFHO0FBQ3BCQyxFQUFBQSxHQUFHLEVBQUU7QUFDREMsSUFBQUEsWUFBWSxFQUFFO0FBRGIsR0FEZTtBQUlwQixhQUFTLEVBSlc7QUFLcEJDLEVBQUFBLFlBQVksRUFBRSxFQUxNO0FBTXBCQyxFQUFBQSxVQUFVLEVBQUUsRUFOUTtBQU9wQkMsRUFBQUEsb0JBQW9CLEVBQUU7QUFQRixDQUF4QjtBQVVBLElBQUlDLG1CQUFtQixHQUFHQyxNQUFNLElBQUk7QUFDaENDLEVBQUFBLE1BQU0sRUFBRSxTQUR3QjtBQUVoQ0MsRUFBQUEsUUFBUSxFQUFFLFlBRnNCO0FBR2hDLFlBQVEsU0FId0I7QUFJaENDLEVBQUFBLFdBQVcsRUFBRTtBQUptQixDQUFwQyxFQU9BOztBQUNBLFNBQVNDLFdBQVQsQ0FBc0JDLEdBQXRCLEVBQTJCQyxRQUEzQixFQUFxQ0MsTUFBckMsRUFBNkNDLFVBQTdDLEVBQXlEO0FBQ3JELE1BQUlILEdBQUcsQ0FBQ0ksR0FBSixJQUFXSixHQUFHLENBQUNL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bkMsRUFBOEM7QUFDMUM7QUFDQSxZQUFJQyxTQUFTLEdBQUdOLElBQUksQ0FBQ0ssU0FBTCxDQUFlTixRQUFmLENBQWhCOztBQUNBLFlBQUksT0FBT08sU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUNqQyxjQUFJQyxPQUFPLEdBQUc1RixFQUFFLENBQUM2QyxZQUFILENBQWdCd0MsSUFBaEIsSUFBd0IsR0FBeEIsR0FBOEJELFFBQTVDO0FBQ0EsY0FBSVMsTUFBTSxHQUFHM0QsU0FBUyxHQUFHLEdBQVosR0FBa0JrRCxRQUEvQjtBQUNBL0QsVUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVUsSUFBVixFQUFnQnVFLE1BQWhCLEVBQXdCRCxPQUF4QixFQUFpQ0MsTUFBakMsRUFBeUNBLE1BQXpDO0FBQ0g7QUFDSjs7QUFDRCxVQUFJQyxPQUFPLEdBQUdyRixtQkFBbUIsQ0FBQzJFLFFBQUQsQ0FBakM7O0FBQ0EsVUFBSVUsT0FBSixFQUFhO0FBQ1R6RSxRQUFBQSxFQUFFLENBQUNDLE1BQUgsQ0FBVSxJQUFWLEVBQWdCWSxTQUFoQixFQUEyQmtELFFBQTNCLEVBQXFDVSxPQUFyQztBQUNILE9BRkQsTUFHSyxJQUFJWCxJQUFKLEVBQVU7QUFDWDlELFFBQUFBLEVBQUUsQ0FBQ2lCLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSixTQUFqQixFQUE0QmtELFFBQTVCO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLEtBQVA7QUFDSDs7QUFDRCxTQUFPLElBQVA7QUFDSCxDQWhDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QganMgPSByZXF1aXJlKCcuL2pzJyk7XG5jb25zdCBBdHRycyA9IHJlcXVpcmUoJy4vYXR0cmlidXRlJyk7XG5cbi8vIOWinuWKoOmihOWkhOeQhuWxnuaAp+i/meS4quatpemqpOeahOebrueahOaYr+mZjeS9jiBDQ0NsYXNzIOeahOWunueOsOmavuW6pu+8jOWwhuavlOi+g+eos+WumueahOmAmueUqOmAu+i+keWSjOS4gOS6m+mcgOaxguavlOi+g+eBtea0u+eahOWxnuaAp+mcgOaxguWIhumalOW8gOOAglxuXG52YXIgU2VyaWFsaXphYmxlQXR0cnMgPSB7XG4gICAgdXJsOiB7XG4gICAgICAgIGNhblVzZWRJbkdldDogdHJ1ZVxuICAgIH0sXG4gICAgZGVmYXVsdDoge30sXG4gICAgc2VyaWFsaXphYmxlOiB7fSxcbiAgICBlZGl0b3JPbmx5OiB7fSxcbiAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczoge31cbn07XG5cbnZhciBUWVBPX1RPX0NPUlJFQ1RfREVWID0gQ0NfREVWICYmIHtcbiAgICBleHRlbmQ6ICdleHRlbmRzJyxcbiAgICBwcm9wZXJ0eTogJ3Byb3BlcnRpZXMnLFxuICAgIHN0YXRpYzogJ3N0YXRpY3MnLFxuICAgIGNvbnN0cnVjdG9yOiAnY3Rvcidcbn07XG5cbi8vIOmihOWkhOeQhiBub3RpZnkg562J5omp5bGV5bGe5oCnXG5mdW5jdGlvbiBwYXJzZU5vdGlmeSAodmFsLCBwcm9wTmFtZSwgbm90aWZ5LCBwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKHZhbC5nZXQgfHwgdmFsLnNldCkge1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoNTUwMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodmFsLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykpIHtcbiAgICAgICAgLy8g5re75Yqg5paw55qE5YaF6YOo5bGe5oCn77yM5bCG5Y6f5p2l55qE5bGe5oCn5L+u5pS55Li6IGdldHRlci9zZXR0ZXIg5b2i5byPXG4gICAgICAgIC8vIO+8iOS7pSBfIOW8gOWktOWwhuiHquWKqOiuvue9rnByb3BlcnR5IOS4uiB2aXNpYmxlOiBmYWxzZe+8iVxuICAgICAgICB2YXIgbmV3S2V5ID0gXCJfTiRcIiArIHByb3BOYW1lO1xuXG4gICAgICAgIHZhbC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tuZXdLZXldO1xuICAgICAgICB9O1xuICAgICAgICB2YWwuc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzW25ld0tleV07XG4gICAgICAgICAgICB0aGlzW25ld0tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIG5vdGlmeS5jYWxsKHRoaXMsIG9sZFZhbHVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YWwubm90aWZ5Rm9yID0gbmV3S2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5ld1ZhbHVlID0ge307XG4gICAgICAgIHByb3BlcnRpZXNbbmV3S2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICAvLyDlsIbkuI3og73nlKjkuo5nZXTmlrnms5XkuK3nmoTlsZ7mgKfnp7vliqjliLBuZXdWYWx1ZeS4rVxuICAgICAgICBmb3IgKHZhciBhdHRyIGluIFNlcmlhbGl6YWJsZUF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgdiA9IFNlcmlhbGl6YWJsZUF0dHJzW2F0dHJdO1xuICAgICAgICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2F0dHJdID0gdmFsW2F0dHJdO1xuICAgICAgICAgICAgICAgIGlmICghdi5jYW5Vc2VkSW5HZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbFthdHRyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgIGNjLndhcm5JRCg1NTAxKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrVXJsICh2YWwsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHVybCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHVybCkpIHtcbiAgICAgICAgaWYgKHVybC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmxbMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCg1NTAyLCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgIGlmICh1cmwgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLndhcm5JRCg1NTAzLCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHVybCAhPT0gJ2Z1bmN0aW9uJyB8fCAhanMuaXNDaGlsZENsYXNzT2YodXJsLCBjYy5SYXdBc3NldCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDU1MDQsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cmwgPT09IGNjLlJhd0Fzc2V0KSB7XG4gICAgICAgICAgICBjYy53YXJuKCdQbGVhc2UgY2hhbmdlIHRoZSBkZWZpbml0aW9uIG9mIHByb3BlcnR5IFxcJyVzXFwnIGluIGNsYXNzIFxcJyVzXFwnLiBTdGFydGluZyBmcm9tIHYxLjEwLFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAndGhlIHVzZSBvZiBkZWNsYXJpbmcgYSBwcm9wZXJ0eSBpbiBDQ0NsYXNzIGFzIGEgVVJMIGhhcyBiZWVuIGRlcHJlY2F0ZWQuXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdGb3IgZXhhbXBsZSwgaWYgcHJvcGVydHkgaXMgY2MuUmF3QXNzZXQsIHRoZSBwcmV2aW91cyBkZWZpbml0aW9uIGlzOlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICVzOiBjYy5SYXdBc3NldCxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAvLyBvcjpcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAlczoge1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICAgdXJsOiBjYy5SYXdBc3NldCxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgIGRlZmF1bHQ6IFwiXCJcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICB9LFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgIC8vIGFuZCB0aGUgb3JpZ2luYWwgbWV0aG9kIHRvIGdldCB1cmwgaXM6XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgICAgYHRoaXMuJXNgXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdOb3cgaXQgc2hvdWxkIGJlIGNoYW5nZWQgdG86XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgICAgJXM6IHtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgIHR5cGU6IGNjLkFzc2V0LCAgICAgLy8gdXNlIFxcJ3R5cGU6XFwnIHRvIGRlZmluZSBBc3NldCBvYmplY3QgZGlyZWN0bHlcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gb2JqZWN0XFwncyBkZWZhdWx0IHZhbHVlIGlzIG51bGxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICB9LFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgIC8vIGFuZCB5b3UgbXVzdCBnZXQgdGhlIHVybCBieSB1c2luZzpcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICBgdGhpcy4lcy5uYXRpdmVVcmxgXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcoVGhpcyBoZWxwcyB1cyB0byBzdWNjZXNzZnVsbHkgcmVmYWN0b3IgYWxsIFJhd0Fzc2V0cyBhdCB2Mi4wLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3NvcnJ5IGZvciB0aGUgaW5jb252ZW5pZW5jZS4gXFx1RDgzRFxcdURFMzAgKScsXG4gICAgICAgICAgICAgICAgICAgIHByb3BOYW1lLCBjbGFzc05hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSwgcHJvcE5hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoanMuaXNDaGlsZENsYXNzT2YodXJsLCBjYy5Bc3NldCkpIHtcbiAgICAgICAgICAgIGlmIChjYy5SYXdBc3NldC53YXNSYXdBc3NldFR5cGUodXJsKSkge1xuICAgICAgICAgICAgICAgIGlmICghdmFsLl9zaG9ydCkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKCdQbGVhc2UgY2hhbmdlIHRoZSBkZWZpbml0aW9uIG9mIHByb3BlcnR5IFxcJyVzXFwnIGluIGNsYXNzIFxcJyVzXFwnLiBTdGFydGluZyBmcm9tIHYxLjEwLFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aGUgdXNlIG9mIGRlY2xhcmluZyBhIHByb3BlcnR5IGluIENDQ2xhc3MgYXMgYSBVUkwgaGFzIGJlZW4gZGVwcmVjYXRlZC5cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm9yIGV4YW1wbGUsIGlmIHByb3BlcnR5IGlzIFRleHR1cmUyRCwgdGhlIHByZXZpb3VzIGRlZmluaXRpb24gaXM6XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAlczogY2MuVGV4dHVyZTJELFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgLy8gb3I6XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAlczoge1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgICB1cmw6IGNjLlRleHR1cmUyRCxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICAgICAgZGVmYXVsdDogXCJcIlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgfSxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTm93IGl0IHNob3VsZCBiZSBjaGFuZ2VkIHRvOlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgJXM6IHtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICAgICAgdHlwZTogY2MuVGV4dHVyZTJELCAvLyB1c2UgXFwndHlwZTpcXCcgdG8gZGVmaW5lIFRleHR1cmUyRCBvYmplY3QgZGlyZWN0bHlcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICAgICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBvYmplY3RcXCdzIGRlZmF1bHQgdmFsdWUgaXMgbnVsbFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgfSxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKFRoaXMgaGVscHMgdXMgdG8gc3VjY2Vzc2Z1bGx5IHJlZmFjdG9yIGFsbCBSYXdBc3NldHMgYXQgdjIuMCwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NvcnJ5IGZvciB0aGUgaW5jb252ZW5pZW5jZS4gXFx1RDgzRFxcdURFMzAgKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcE5hbWUsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoNTUwNSwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgY2MuanMuZ2V0Q2xhc3NOYW1lKHVybCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh2YWwudHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLndhcm5JRCg1NTA2LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YWwudHlwZSA9IHVybDtcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlICh2YWwsIHR5cGUsIGNsYXNzTmFtZSwgcHJvcE5hbWUpIHtcbiAgICBjb25zdCBTVEFUSUNfQ0hFQ0sgPSAoQ0NfRURJVE9SICYmIENDX0RFVikgfHwgQ0NfVEVTVDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICAgIGlmIChTVEFUSUNfQ0hFQ0sgJiYgJ2RlZmF1bHQnIGluIHZhbCkge1xuICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL0NDQ2xhc3MnKS5pc0FycmF5OyAgIC8vIHJlcXVpcmUgbGF6aWx5IHRvIGF2b2lkIGNpcmN1bGFyIHJlcXVpcmUoKSBjYWxsc1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KHZhbC5kZWZhdWx0KSkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCg1NTA3LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoY2MuUmF3QXNzZXQuaXNSYXdBc3NldFR5cGUodHlwZVswXSkpIHtcbiAgICAgICAgICAgICAgICB2YWwudXJsID0gdHlwZVswXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdmFsLnR5cGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsLnR5cGUgPSB0eXBlID0gdHlwZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDU1MDgsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAodHlwZSA9PT0gU3RyaW5nKSB7XG4gICAgICAgICAgICB2YWwudHlwZSA9IGNjLlN0cmluZztcbiAgICAgICAgICAgIGlmIChTVEFUSUNfQ0hFQ0spIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwOCwgYFwiJHtjbGFzc05hbWV9LiR7cHJvcE5hbWV9XCJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSBCb29sZWFuKSB7XG4gICAgICAgICAgICB2YWwudHlwZSA9IGNjLkJvb2xlYW47XG4gICAgICAgICAgICBpZiAoU1RBVElDX0NIRUNLKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MDksIGBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gTnVtYmVyKSB7XG4gICAgICAgICAgICB2YWwudHlwZSA9IGNjLkZsb2F0O1xuICAgICAgICAgICAgaWYgKFNUQVRJQ19DSEVDSykge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjEwLCBgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cImApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFNUQVRJQ19DSEVDSyAmJiBjYy5SYXdBc3NldC5pc1Jhd0Fzc2V0VHlwZSh0eXBlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDU1MDksIGNsYXNzTmFtZSwgcHJvcE5hbWUsIGpzLmdldENsYXNzTmFtZSh0eXBlKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoU1RBVElDX0NIRUNLKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdOdW1iZXInOlxuICAgICAgICAgICAgY2Mud2FybklEKDU1MTAsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICAgICAgICBjYy53YXJuKGBUaGUgdHlwZSBvZiBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiIG11c3QgYmUgY2MuU3RyaW5nLCBub3QgXCJTdHJpbmdcIi5gKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgICAgIGNjLndhcm4oYFRoZSB0eXBlIG9mIFwiJHtjbGFzc05hbWV9LiR7cHJvcE5hbWV9XCIgbXVzdCBiZSBjYy5Cb29sZWFuLCBub3QgXCJCb29sZWFuXCIuYCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRmxvYXQnOlxuICAgICAgICAgICAgY2Mud2FybihgVGhlIHR5cGUgb2YgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cIiBtdXN0IGJlIGNjLkZsb2F0LCBub3QgXCJGbG9hdFwiLmApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0ludGVnZXInOlxuICAgICAgICAgICAgY2Mud2FybihgVGhlIHR5cGUgb2YgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cIiBtdXN0IGJlIGNjLkludGVnZXIsIG5vdCBcIkludGVnZXJcIi5gKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgICAgICBjYy53YXJuSUQoNTUxMSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcG9zdENoZWNrVHlwZSAodmFsLCB0eXBlLCBjbGFzc05hbWUsIHByb3BOYW1lKSB7XG4gICAgaWYgKENDX0VESVRPUiAmJiB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoY2MuQ2xhc3MuX2lzQ0NDbGFzcyh0eXBlKSAmJiB2YWwuc2VyaWFsaXphYmxlICE9PSBmYWxzZSAmJiAhanMuX2dldENsYXNzSWQodHlwZSwgZmFsc2UpKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoNTUxMiwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldEJhc2VDbGFzc1doZXJlUHJvcGVydHlEZWZpbmVkX0RFViAocHJvcE5hbWUsIGNscykge1xuICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgZm9yICg7IGNscyAmJiBjbHMuX19wcm9wc19fICYmIGNscy5fX3Byb3BzX18uaW5kZXhPZihwcm9wTmFtZSkgIT09IC0xOyBjbHMgPSBjbHMuJHN1cGVyKSB7XG4gICAgICAgICAgICByZXMgPSBjbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCd1bmtub3duIGVycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbmV4cG9ydHMuZ2V0RnVsbEZvcm1PZlByb3BlcnR5ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHByb3BuYW1lX2RldiwgY2xhc3NuYW1lX2Rldikge1xuICAgIHZhciBpc0xpdGVyYWwgPSBvcHRpb25zICYmIG9wdGlvbnMuY29uc3RydWN0b3IgPT09IE9iamVjdDtcbiAgICBpZiAoaXNMaXRlcmFsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSAmJiBvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IHR5cGUgPSBvcHRpb25zWzBdO1xuICAgICAgICBpZiAoQ0NfREVWICYmIGNjLlJhd0Fzc2V0Lndhc1Jhd0Fzc2V0VHlwZSh0eXBlKSkge1xuICAgICAgICAgICAgLy8gZGVwcmVjYXRlIGBteVByb3A6IFtjYy5UZXh0dXJlMkRdYCBzaW5jZSAxLjEwXG4gICAgICAgICAgICBjYy53YXJuKCdQbGVhc2UgY2hhbmdlIHRoZSBkZWZpbml0aW9uIG9mIHByb3BlcnR5IFxcJyVzXFwnIGluIGNsYXNzIFxcJyVzXFwnLiBTdGFydGluZyBmcm9tIHYxLjEwLFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAncHJvcGVydGllcyBpbiBDQ0NsYXNzIGNhbiBub3QgYmUgYWJicmV2aWF0ZWQgaWYgdGhleSBhcmUgb2YgdHlwZSBSYXdBc3NldC5cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJ1BsZWFzZSB1c2UgdGhlIGNvbXBsZXRlIGZvcm0uXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdGb3IgZXhhbXBsZSwgaWYgcHJvcGVydHkgaXMgVGV4dHVyZTJEXFwncyB1cmwgYXJyYXksIHRoZSBwcmV2aW91cyBkZWZpbml0aW9uIGlzOlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICVzOiBbY2MuVGV4dHVyZTJEXSxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJ0lmIHlvdSB1c2UgSlMsIGl0IHNob3VsZCBiZSBjaGFuZ2VkIHRvOlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICVzOiB7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsIC8vIHVzZSBcXCd0eXBlOlxcJyB0byBkZWZpbmUgYW4gYXJyYXkgb2YgVGV4dHVyZTJEIG9iamVjdHNcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgIGRlZmF1bHQ6IFtdXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgICAgfSxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJ0lmIHlvdSB1c2UgVFMsIGl0IHNob3VsZCBiZSBjaGFuZ2VkIHRvOlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICVzOiB7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsIC8vIHVzZSBcXCd0eXBlOlxcJyB0byBkZWZpbmUgYW4gYXJyYXkgb2YgVGV4dHVyZTJEIG9iamVjdHNcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICB9XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICcgICAlczogY2MuVGV4dHVyZTJEW10gPSBbXTtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnKFRoaXMgaGVscHMgdXMgdG8gc3VjY2Vzc2Z1bGx5IHJlZmFjdG9yIGFsbCBSYXdBc3NldHMgYXQgdjIuMCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdzb3JyeSBmb3IgdGhlIGluY29udmVuaWVuY2UuIFxcdUQ4M0RcXHVERTMwICknLFxuICAgICAgICAgICAgICAgICAgICBwcm9wbmFtZV9kZXYsIGNsYXNzbmFtZV9kZXYsIHByb3BuYW1lX2RldiwgcHJvcG5hbWVfZGV2KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICAgICAgdXJsOiBvcHRpb25zLFxuICAgICAgICAgICAgICAgIF9zaG9ydDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBvcHRpb25zLFxuICAgICAgICAgICAgX3Nob3J0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCB0eXBlID0gb3B0aW9ucztcbiAgICAgICAgaWYgKCFjYy5SYXdBc3NldC5pc1Jhd0Fzc2V0VHlwZSh0eXBlKSkge1xuICAgICAgICAgICAgaWYgKGNjLlJhd0Fzc2V0Lndhc1Jhd0Fzc2V0VHlwZSh0eXBlKSkge1xuICAgICAgICAgICAgICAgIC8vIGRlcHJlY2F0ZSBgbXlQcm9wOiBjYy5UZXh0dXJlMkRgIHNpbmNlIDEuMTBcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oJ1BsZWFzZSBjaGFuZ2UgdGhlIGRlZmluaXRpb24gb2YgcHJvcGVydHkgXFwnJXNcXCcgaW4gY2xhc3MgXFwnJXNcXCcuIFN0YXJ0aW5nIGZyb20gdjEuMTAsXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnRpZXMgaW4gQ0NDbGFzcyBjYW4gbm90IGJlIGFiYnJldmlhdGVkIGlmIHRoZXkgYXJlIG9mIHR5cGUgUmF3QXNzZXQuXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BsZWFzZSB1c2UgdGhlIGNvbXBsZXRlIGZvcm0uXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZvciBleGFtcGxlLCBpZiB0aGUgdHlwZSBpcyBUZXh0dXJlMkQsIHRoZSBwcmV2aW91cyBkZWZpbml0aW9uIGlzOlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgJXM6IGNjLlRleHR1cmUyRCxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSWYgeW91IHVzZSBKUywgaXQgc2hvdWxkIGJlIGNoYW5nZWQgdG86XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAlczoge1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQgLy8gdXNlIFxcJ3R5cGU6XFwnIHRvIGRlZmluZSBUZXh0dXJlMkQgb2JqZWN0IGRpcmVjdGx5XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAgIGRlZmF1bHQ6IG51bGwsICAgICAvLyBvYmplY3RcXCdzIGRlZmF1bHQgdmFsdWUgaXMgbnVsbFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgfSxcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSWYgeW91IHVzZSBUUywgaXQgc2hvdWxkIGJlIGNoYW5nZWQgdG86XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAlczoge1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQgLy8gdXNlIFxcJ3R5cGU6XFwnIHRvIGRlZmluZSBUZXh0dXJlMkQgb2JqZWN0IGRpcmVjdGx5XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICB9XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAlczogY2MuVGV4dHVyZTJEID0gbnVsbDtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoVGhpcyBoZWxwcyB1cyB0byBzdWNjZXNzZnVsbHkgcmVmYWN0b3IgYWxsIFJhd0Fzc2V0cyBhdCB2Mi4wLCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc29ycnkgZm9yIHRoZSBpbmNvbnZlbmllbmNlLiBcXHVEODNEXFx1REUzMCApJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wbmFtZV9kZXYsIGNsYXNzbmFtZV9kZXYsIHByb3BuYW1lX2RldiwgcHJvcG5hbWVfZGV2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBqcy5pc0NoaWxkQ2xhc3NPZih0eXBlLCBjYy5WYWx1ZVR5cGUpID8gbmV3IHR5cGUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIF9zaG9ydDogdHJ1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgdXJsOiB0eXBlLFxuICAgICAgICAgICAgX3Nob3J0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBBdHRycy5QcmltaXRpdmVUeXBlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBvcHRpb25zLmRlZmF1bHQsXG4gICAgICAgICAgICBfc2hvcnQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBvcHRpb25zLFxuICAgICAgICAgICAgX3Nob3J0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxufTtcblxuZXhwb3J0cy5wcmVwcm9jZXNzQXR0cnMgPSBmdW5jdGlvbiAocHJvcGVydGllcywgY2xhc3NOYW1lLCBjbHMsIGVzNikge1xuICAgIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgdmFyIHZhbCA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xuICAgICAgICB2YXIgZnVsbEZvcm0gPSBleHBvcnRzLmdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSh2YWwsIHByb3BOYW1lLCBjbGFzc05hbWUpO1xuICAgICAgICBpZiAoZnVsbEZvcm0pIHtcbiAgICAgICAgICAgIHZhbCA9IHByb3BlcnRpZXNbcHJvcE5hbWVdID0gZnVsbEZvcm07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGlmICgnZGVmYXVsdCcgaW4gdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwuZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDU1MTMsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbC5zZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTUxNCwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2MuQ2xhc3MuX2lzQ0NDbGFzcyh2YWwuZGVmYXVsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbC5kZWZhdWx0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTUxNSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXZhbC5nZXQgJiYgIXZhbC5zZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heWJlVHlwZVNjcmlwdCA9IGVzNjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXliZVR5cGVTY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTUxNiwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ0NfREVWICYmICF2YWwub3ZlcnJpZGUgJiYgY2xzLl9fcHJvcHNfXy5pbmRleE9mKHByb3BOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBvdmVycmlkZVxuICAgICAgICAgICAgICAgIHZhciBiYXNlQ2xhc3MgPSBqcy5nZXRDbGFzc05hbWUoZ2V0QmFzZUNsYXNzV2hlcmVQcm9wZXJ0eURlZmluZWRfREVWKHByb3BOYW1lLCBjbHMpKTtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoNTUxNywgY2xhc3NOYW1lLCBwcm9wTmFtZSwgYmFzZUNsYXNzLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm90aWZ5ID0gdmFsLm5vdGlmeTtcbiAgICAgICAgICAgIGlmIChub3RpZnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVWICYmIGVzNikge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcignbm90IHlldCBzdXBwb3J0IG5vdGlmeSBhdHRyaWJ1dGUgZm9yIEVTNiBDbGFzc2VzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZU5vdGlmeSh2YWwsIHByb3BOYW1lLCBub3RpZnksIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCd0eXBlJyBpbiB2YWwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZVR5cGUodmFsLCB2YWwudHlwZSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgndXJsJyBpbiB2YWwpIHtcbiAgICAgICAgICAgICAgICBjaGVja1VybCh2YWwsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbC51cmwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJ3R5cGUnIGluIHZhbCkge1xuICAgICAgICAgICAgICAgIHBvc3RDaGVja1R5cGUodmFsLCB2YWwudHlwZSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAoQ0NfREVWKSB7XG4gICAgY29uc3QgQ0FMTF9TVVBFUl9ERVNUUk9ZX1JFR19ERVYgPSAvXFxiXFwuX3N1cGVyXFxifGRlc3Ryb3lcXHMqXFwuXFxzKmNhbGxcXHMqXFwoXFxzKlxcdytcXHMqWyx8KV0vO1xuICAgIGV4cG9ydHMuZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYgPSBmdW5jdGlvbiAoZnVuYywgZnVuY05hbWUsIGNsYXNzTmFtZSwgY2xzLCBiYXNlKSB7XG4gICAgICAgIGlmIChjbHMuX19wcm9wc19fICYmIGNscy5fX3Byb3BzX18uaW5kZXhPZihmdW5jTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgLy8gZmluZCBjbGFzcyB0aGF0IGRlZmluZXMgdGhpcyBtZXRob2QgYXMgYSBwcm9wZXJ0eVxuICAgICAgICAgICAgdmFyIGJhc2VDbGFzc05hbWUgPSBqcy5nZXRDbGFzc05hbWUoZ2V0QmFzZUNsYXNzV2hlcmVQcm9wZXJ0eURlZmluZWRfREVWKGZ1bmNOYW1lLCBjbHMpKTtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0OCwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgYmFzZUNsYXNzTmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZ1bmNOYW1lID09PSAnZGVzdHJveScgJiZcbiAgICAgICAgICAgIGpzLmlzQ2hpbGRDbGFzc09mKGJhc2UsIGNjLkNvbXBvbmVudCkgJiZcbiAgICAgICAgICAgICFDQUxMX1NVUEVSX0RFU1RST1lfUkVHX0RFVi50ZXN0KGZ1bmMpXG4gICAgICAgICkge1xuICAgICAgICAgICAgY2MuZXJyb3IoYE92ZXJ3cml0aW5nICcke2Z1bmNOYW1lfScgZnVuY3Rpb24gaW4gJyR7Y2xhc3NOYW1lfScgY2xhc3Mgd2l0aG91dCBjYWxsaW5nIHN1cGVyIGlzIG5vdCBhbGxvd2VkLiBDYWxsIHRoZSBzdXBlciBmdW5jdGlvbiBpbiAnJHtmdW5jTmFtZX0nIHBsZWFzZS5gKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydHMudmFsaWRhdGVNZXRob2RXaXRoUHJvcHMgPSBmdW5jdGlvbiAoZnVuYywgZnVuY05hbWUsIGNsYXNzTmFtZSwgY2xzLCBiYXNlKSB7XG4gICAgaWYgKENDX0RFViAmJiBmdW5jTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICBjYy5lcnJvcklEKDM2NDMsIGNsYXNzTmFtZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nIHx8IGZ1bmMgPT09IG51bGwpIHtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgdGhpcy5kb1ZhbGlkYXRlTWV0aG9kV2l0aFByb3BzX0RFVihmdW5jLCBmdW5jTmFtZSwgY2xhc3NOYW1lLCBjbHMsIGJhc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PT0gZmFsc2UgJiYgYmFzZSAmJiBiYXNlLnByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIG92ZXJyaWRlXG4gICAgICAgICAgICAgICAgdmFyIG92ZXJyaWRlZCA9IGJhc2UucHJvdG90eXBlW2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZUZ1YyA9IGpzLmdldENsYXNzTmFtZShiYXNlKSArICcuJyArIGZ1bmNOYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3ViRnVjID0gY2xhc3NOYW1lICsgJy4nICsgZnVuY05hbWU7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjI0LCBzdWJGdWMsIGJhc2VGdWMsIHN1YkZ1Yywgc3ViRnVjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29ycmVjdCA9IFRZUE9fVE9fQ09SUkVDVF9ERVZbZnVuY05hbWVdO1xuICAgICAgICAgICAgaWYgKGNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYyMSwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgY29ycmVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChmdW5jKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjIyLCBjbGFzc05hbWUsIGZ1bmNOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcbiJdfQ==