
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/missing-script.js';
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
var js = cc.js;

var BUILTIN_CLASSID_RE = require('../utils/misc').BUILTIN_CLASSID_RE;
/*
 * A temp fallback to contain the original serialized data which can not be loaded.
 */


var MissingClass = cc.Class({
  name: 'cc.MissingClass',
  properties: {
    // the serialized data for original object
    _$erialized: {
      "default": null,
      visible: false,
      editorOnly: true
    }
  }
});
/*
 * A temp fallback to contain the original component which can not be loaded.
 */

var MissingScript = cc.Class({
  name: 'cc.MissingScript',
  "extends": cc.Component,
  editor: {
    inspector: 'packages://inspector/inspectors/comps/missing-script.js'
  },
  properties: {
    //_scriptUuid: {
    //    get: function () {
    //        var id = this._$erialized.__type__;
    //        if (Editor.Utils.UuidUtils.isUuid(id)) {
    //            return Editor.Utils.UuidUtils.decompressUuid(id);
    //        }
    //        return '';
    //    },
    //    set: function (value) {
    //        if ( !sandbox.compiled ) {
    //            cc.error('Scripts not yet compiled, please fix script errors and compile first.');
    //            return;
    //        }
    //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
    //            var classId = Editor.Utils.UuidUtils.compressUuid(value);
    //            if (cc.js._getClassById(classId)) {
    //                this._$erialized.__type__ = classId;
    //                Editor.Ipc.sendToWins('reload:window-scripts', sandbox.compiled);
    //            }
    //            else {
    //                cc.error('Can not find a component in the script which uuid is "%s".', value);
    //            }
    //        }
    //        else {
    //            cc.error('invalid script');
    //        }
    //    }
    //},
    compiled: {
      "default": false,
      serializable: false
    },
    // the serialized data for original script object
    _$erialized: {
      "default": null,
      visible: false,
      editorOnly: true
    }
  },
  ctor: CC_EDITOR && function () {
    this.compiled = _Scene.Sandbox.compiled;
  },
  statics: {
    /*
     * @param {string} id
     * @return {function} constructor
     */
    safeFindClass: function safeFindClass(id, data) {
      var cls = js._getClassById(id);

      if (cls) {
        return cls;
      }

      if (id) {
        cc.deserialize.reportMissingClass(id);
        return MissingScript.getMissingWrapper(id, data);
      }

      return null;
    },
    getMissingWrapper: function getMissingWrapper(id, data) {
      if (data.node && (/^[0-9a-zA-Z+/]{23}$/.test(id) || BUILTIN_CLASSID_RE.test(id))) {
        // is component
        return MissingScript;
      } else {
        return MissingClass;
      }
    }
  },
  onLoad: function onLoad() {
    cc.warnID(4600, this.node.name);
  }
});
cc._MissingScript = module.exports = MissingScript;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pc3Npbmctc2NyaXB0LmpzIl0sIm5hbWVzIjpbImpzIiwiY2MiLCJCVUlMVElOX0NMQVNTSURfUkUiLCJyZXF1aXJlIiwiTWlzc2luZ0NsYXNzIiwiQ2xhc3MiLCJuYW1lIiwicHJvcGVydGllcyIsIl8kZXJpYWxpemVkIiwidmlzaWJsZSIsImVkaXRvck9ubHkiLCJNaXNzaW5nU2NyaXB0IiwiQ29tcG9uZW50IiwiZWRpdG9yIiwiaW5zcGVjdG9yIiwiY29tcGlsZWQiLCJzZXJpYWxpemFibGUiLCJjdG9yIiwiQ0NfRURJVE9SIiwiX1NjZW5lIiwiU2FuZGJveCIsInN0YXRpY3MiLCJzYWZlRmluZENsYXNzIiwiaWQiLCJkYXRhIiwiY2xzIiwiX2dldENsYXNzQnlJZCIsImRlc2VyaWFsaXplIiwicmVwb3J0TWlzc2luZ0NsYXNzIiwiZ2V0TWlzc2luZ1dyYXBwZXIiLCJub2RlIiwidGVzdCIsIm9uTG9hZCIsIndhcm5JRCIsIl9NaXNzaW5nU2NyaXB0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLEVBQUUsR0FBR0MsRUFBRSxDQUFDRCxFQUFaOztBQUNBLElBQUlFLGtCQUFrQixHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUFQLENBQXlCRCxrQkFBbEQ7QUFFQTs7Ozs7QUFHQSxJQUFJRSxZQUFZLEdBQUdILEVBQUUsQ0FBQ0ksS0FBSCxDQUFTO0FBQ3hCQyxFQUFBQSxJQUFJLEVBQUUsaUJBRGtCO0FBRXhCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBQyxJQUFBQSxXQUFXLEVBQUU7QUFDVCxpQkFBUyxJQURBO0FBRVRDLE1BQUFBLE9BQU8sRUFBRSxLQUZBO0FBR1RDLE1BQUFBLFVBQVUsRUFBRTtBQUhIO0FBRkw7QUFGWSxDQUFULENBQW5CO0FBWUE7Ozs7QUFHQSxJQUFJQyxhQUFhLEdBQUdWLEVBQUUsQ0FBQ0ksS0FBSCxDQUFTO0FBQ3pCQyxFQUFBQSxJQUFJLEVBQUUsa0JBRG1CO0FBRXpCLGFBQVNMLEVBQUUsQ0FBQ1csU0FGYTtBQUd6QkMsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLFNBQVMsRUFBRTtBQURQLEdBSGlCO0FBTXpCUCxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBUSxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxLQURIO0FBRU5DLE1BQUFBLFlBQVksRUFBRTtBQUZSLEtBN0JGO0FBaUNSO0FBQ0FSLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLElBREE7QUFFVEMsTUFBQUEsT0FBTyxFQUFFLEtBRkE7QUFHVEMsTUFBQUEsVUFBVSxFQUFFO0FBSEg7QUFsQ0wsR0FOYTtBQThDekJPLEVBQUFBLElBQUksRUFBRUMsU0FBUyxJQUFJLFlBQVk7QUFDM0IsU0FBS0gsUUFBTCxHQUFnQkksTUFBTSxDQUFDQyxPQUFQLENBQWVMLFFBQS9CO0FBQ0gsR0FoRHdCO0FBaUR6Qk0sRUFBQUEsT0FBTyxFQUFFO0FBQ0w7Ozs7QUFJQUMsSUFBQUEsYUFBYSxFQUFFLHVCQUFVQyxFQUFWLEVBQWNDLElBQWQsRUFBb0I7QUFDL0IsVUFBSUMsR0FBRyxHQUFHekIsRUFBRSxDQUFDMEIsYUFBSCxDQUFpQkgsRUFBakIsQ0FBVjs7QUFDQSxVQUFJRSxHQUFKLEVBQVM7QUFDTCxlQUFPQSxHQUFQO0FBQ0g7O0FBQ0QsVUFBSUYsRUFBSixFQUFRO0FBQ0p0QixRQUFBQSxFQUFFLENBQUMwQixXQUFILENBQWVDLGtCQUFmLENBQWtDTCxFQUFsQztBQUNBLGVBQU9aLGFBQWEsQ0FBQ2tCLGlCQUFkLENBQWdDTixFQUFoQyxFQUFvQ0MsSUFBcEMsQ0FBUDtBQUNIOztBQUNELGFBQU8sSUFBUDtBQUNILEtBZkk7QUFnQkxLLElBQUFBLGlCQUFpQixFQUFFLDJCQUFVTixFQUFWLEVBQWNDLElBQWQsRUFBb0I7QUFDbkMsVUFBSUEsSUFBSSxDQUFDTSxJQUFMLEtBQWMsc0JBQXNCQyxJQUF0QixDQUEyQlIsRUFBM0IsS0FBa0NyQixrQkFBa0IsQ0FBQzZCLElBQW5CLENBQXdCUixFQUF4QixDQUFoRCxDQUFKLEVBQWtGO0FBQzlFO0FBQ0EsZUFBT1osYUFBUDtBQUNILE9BSEQsTUFJSztBQUNELGVBQU9QLFlBQVA7QUFDSDtBQUNKO0FBeEJJLEdBakRnQjtBQTJFekI0QixFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIvQixJQUFBQSxFQUFFLENBQUNnQyxNQUFILENBQVUsSUFBVixFQUFnQixLQUFLSCxJQUFMLENBQVV4QixJQUExQjtBQUNIO0FBN0V3QixDQUFULENBQXBCO0FBZ0ZBTCxFQUFFLENBQUNpQyxjQUFILEdBQW9CQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ6QixhQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gY2MuanM7XG52YXIgQlVJTFRJTl9DTEFTU0lEX1JFID0gcmVxdWlyZSgnLi4vdXRpbHMvbWlzYycpLkJVSUxUSU5fQ0xBU1NJRF9SRTtcblxuLypcbiAqIEEgdGVtcCBmYWxsYmFjayB0byBjb250YWluIHRoZSBvcmlnaW5hbCBzZXJpYWxpemVkIGRhdGEgd2hpY2ggY2FuIG5vdCBiZSBsb2FkZWQuXG4gKi9cbnZhciBNaXNzaW5nQ2xhc3MgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1pc3NpbmdDbGFzcycsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyB0aGUgc2VyaWFsaXplZCBkYXRhIGZvciBvcmlnaW5hbCBvYmplY3RcbiAgICAgICAgXyRlcmlhbGl6ZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuLypcbiAqIEEgdGVtcCBmYWxsYmFjayB0byBjb250YWluIHRoZSBvcmlnaW5hbCBjb21wb25lbnQgd2hpY2ggY2FuIG5vdCBiZSBsb2FkZWQuXG4gKi9cbnZhciBNaXNzaW5nU2NyaXB0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5NaXNzaW5nU2NyaXB0JywgXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIGVkaXRvcjoge1xuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL21pc3Npbmctc2NyaXB0LmpzJyxcbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy9fc2NyaXB0VXVpZDoge1xuICAgICAgICAvLyAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgICAgIHZhciBpZCA9IHRoaXMuXyRlcmlhbGl6ZWQuX190eXBlX187XG4gICAgICAgIC8vICAgICAgICBpZiAoRWRpdG9yLlV0aWxzLlV1aWRVdGlscy5pc1V1aWQoaWQpKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuIEVkaXRvci5VdGlscy5VdWlkVXRpbHMuZGVjb21wcmVzc1V1aWQoaWQpO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAvLyAgICB9LFxuICAgICAgICAvLyAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyAgICAgICAgaWYgKCAhc2FuZGJveC5jb21waWxlZCApIHtcbiAgICAgICAgLy8gICAgICAgICAgICBjYy5lcnJvcignU2NyaXB0cyBub3QgeWV0IGNvbXBpbGVkLCBwbGVhc2UgZml4IHNjcmlwdCBlcnJvcnMgYW5kIGNvbXBpbGUgZmlyc3QuJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgaWYgKHZhbHVlICYmIEVkaXRvci5VdGlscy5VdWlkVXRpbHMuaXNVdWlkKHZhbHVlLl91dWlkKSkge1xuICAgICAgICAvLyAgICAgICAgICAgIHZhciBjbGFzc0lkID0gRWRpdG9yLlV0aWxzLlV1aWRVdGlscy5jb21wcmVzc1V1aWQodmFsdWUpO1xuICAgICAgICAvLyAgICAgICAgICAgIGlmIChjYy5qcy5fZ2V0Q2xhc3NCeUlkKGNsYXNzSWQpKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMuXyRlcmlhbGl6ZWQuX190eXBlX18gPSBjbGFzc0lkO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBFZGl0b3IuSXBjLnNlbmRUb1dpbnMoJ3JlbG9hZDp3aW5kb3ctc2NyaXB0cycsIHNhbmRib3guY29tcGlsZWQpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2MuZXJyb3IoJ0NhbiBub3QgZmluZCBhIGNvbXBvbmVudCBpbiB0aGUgc2NyaXB0IHdoaWNoIHV1aWQgaXMgXCIlc1wiLicsIHZhbHVlKTtcbiAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICBjYy5lcnJvcignaW52YWxpZCBzY3JpcHQnKTtcbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy8gICAgfVxuICAgICAgICAvL30sXG4gICAgICAgIGNvbXBpbGVkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHNlcmlhbGl6YWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdGhlIHNlcmlhbGl6ZWQgZGF0YSBmb3Igb3JpZ2luYWwgc2NyaXB0IG9iamVjdFxuICAgICAgICBfJGVyaWFsaXplZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjdG9yOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbXBpbGVkID0gX1NjZW5lLlNhbmRib3guY29tcGlsZWQ7XG4gICAgfSxcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgICAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIHNhZmVGaW5kQ2xhc3M6IGZ1bmN0aW9uIChpZCwgZGF0YSkge1xuICAgICAgICAgICAgdmFyIGNscyA9IGpzLl9nZXRDbGFzc0J5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKGNscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBjYy5kZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3MoaWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBNaXNzaW5nU2NyaXB0LmdldE1pc3NpbmdXcmFwcGVyKGlkLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuICAgICAgICBnZXRNaXNzaW5nV3JhcHBlcjogZnVuY3Rpb24gKGlkLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5ub2RlICYmICgvXlswLTlhLXpBLVorL117MjN9JC8udGVzdChpZCkgfHwgQlVJTFRJTl9DTEFTU0lEX1JFLnRlc3QoaWQpKSkge1xuICAgICAgICAgICAgICAgIC8vIGlzIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIHJldHVybiBNaXNzaW5nU2NyaXB0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1pc3NpbmdDbGFzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCg0NjAwLCB0aGlzLm5vZGUubmFtZSk7XG4gICAgfVxufSk7XG5cbmNjLl9NaXNzaW5nU2NyaXB0ID0gbW9kdWxlLmV4cG9ydHMgPSBNaXNzaW5nU2NyaXB0O1xuIl19