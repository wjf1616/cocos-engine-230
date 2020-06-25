
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/polyfill/object.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

// for IE11
if (!Object.assign) {
  Object.assign = function (target, source) {
    return cc.js.mixin(target, source);
  };
} // for Baidu browser
// Implementation reference to: 
// http://2ality.com/2016/02/object-getownpropertydescriptors.html
// http://docs.w3cub.com/javascript/global_objects/reflect/ownkeys/


if (!Object.getOwnPropertyDescriptors) {
  Object.getOwnPropertyDescriptors = function (obj) {
    var descriptors = {};
    var ownKeys = Object.getOwnPropertyNames(obj);

    if (Object.getOwnPropertySymbols) {
      // for IE 11
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj));
    }

    for (var i = 0; i < ownKeys.length; ++i) {
      var key = ownKeys[i];
      descriptors[key] = Object.getOwnPropertyDescriptor(obj, key);
    }

    return descriptors;
  };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdC5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJhc3NpZ24iLCJ0YXJnZXQiLCJzb3VyY2UiLCJjYyIsImpzIiwibWl4aW4iLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwib2JqIiwiZGVzY3JpcHRvcnMiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImdldE93blByb3BlcnR5U3ltYm9scyIsImNvbmNhdCIsImkiLCJsZW5ndGgiLCJrZXkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBLElBQUksQ0FBQ0EsTUFBTSxDQUFDQyxNQUFaLEVBQW9CO0FBQ2hCRCxFQUFBQSxNQUFNLENBQUNDLE1BQVAsR0FBZ0IsVUFBVUMsTUFBVixFQUFrQkMsTUFBbEIsRUFBMEI7QUFDdEMsV0FBT0MsRUFBRSxDQUFDQyxFQUFILENBQU1DLEtBQU4sQ0FBWUosTUFBWixFQUFvQkMsTUFBcEIsQ0FBUDtBQUNILEdBRkQ7QUFHSCxFQUVEO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJLENBQUNILE1BQU0sQ0FBQ08seUJBQVosRUFBdUM7QUFDbkNQLEVBQUFBLE1BQU0sQ0FBQ08seUJBQVAsR0FBbUMsVUFBVUMsR0FBVixFQUFlO0FBQzlDLFFBQUlDLFdBQVcsR0FBRyxFQUFsQjtBQUNBLFFBQUlDLE9BQU8sR0FBR1YsTUFBTSxDQUFDVyxtQkFBUCxDQUEyQkgsR0FBM0IsQ0FBZDs7QUFDQSxRQUFJUixNQUFNLENBQUNZLHFCQUFYLEVBQWtDO0FBQUU7QUFDaENGLE1BQUFBLE9BQU8sR0FBR0EsT0FBTyxDQUFDRyxNQUFSLENBQWViLE1BQU0sQ0FBQ1kscUJBQVAsQ0FBNkJKLEdBQTdCLENBQWYsQ0FBVjtBQUNIOztBQUNELFNBQUksSUFBSU0sQ0FBQyxHQUFHLENBQVosRUFBZUEsQ0FBQyxHQUFHSixPQUFPLENBQUNLLE1BQTNCLEVBQW1DLEVBQUVELENBQXJDLEVBQXVDO0FBQ25DLFVBQUlFLEdBQUcsR0FBR04sT0FBTyxDQUFDSSxDQUFELENBQWpCO0FBQ0FMLE1BQUFBLFdBQVcsQ0FBQ08sR0FBRCxDQUFYLEdBQW1CaEIsTUFBTSxDQUFDaUIsd0JBQVAsQ0FBZ0NULEdBQWhDLEVBQXFDUSxHQUFyQyxDQUFuQjtBQUNIOztBQUNELFdBQU9QLFdBQVA7QUFDSCxHQVhEO0FBWUgiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vIGZvciBJRTExXG5pZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgICBPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIHJldHVybiBjYy5qcy5taXhpbih0YXJnZXQsIHNvdXJjZSk7XG4gICAgfVxufVxuXG4vLyBmb3IgQmFpZHUgYnJvd3NlclxuLy8gSW1wbGVtZW50YXRpb24gcmVmZXJlbmNlIHRvOiBcbi8vIGh0dHA6Ly8yYWxpdHkuY29tLzIwMTYvMDIvb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvcnMuaHRtbFxuLy8gaHR0cDovL2RvY3MudzNjdWIuY29tL2phdmFzY3JpcHQvZ2xvYmFsX29iamVjdHMvcmVmbGVjdC9vd25rZXlzL1xuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBsZXQgZGVzY3JpcHRvcnMgPSB7fTtcbiAgICAgICAgbGV0IG93bktleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyAvLyBmb3IgSUUgMTFcbiAgICAgICAgICAgIG93bktleXMgPSBvd25LZXlzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iaikpO1xuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBvd25LZXlzLmxlbmd0aDsgKytpKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBvd25LZXlzW2ldO1xuICAgICAgICAgICAgZGVzY3JpcHRvcnNba2V5XSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9ycztcbiAgICB9XG59Il19