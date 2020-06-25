
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/polyfill/array-buffer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

if (!ArrayBuffer.isView) {
  var TypedArray = Object.getPrototypeOf(Int8Array);
  ArrayBuffer.isView = typeof TypedArray === 'function' ? function (obj) {
    return obj instanceof TypedArray;
  } : function (obj) {
    // old JSC, phantom, QtWebview
    if (typeof obj !== 'object') {
      return false;
    }

    var ctor = obj.constructor;
    return ctor === Float32Array || ctor === Uint8Array || ctor === Uint32Array || ctor === Int8Array;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFycmF5LWJ1ZmZlci5qcyJdLCJuYW1lcyI6WyJBcnJheUJ1ZmZlciIsImlzVmlldyIsIlR5cGVkQXJyYXkiLCJPYmplY3QiLCJnZXRQcm90b3R5cGVPZiIsIkludDhBcnJheSIsIm9iaiIsImN0b3IiLCJjb25zdHJ1Y3RvciIsIkZsb2F0MzJBcnJheSIsIlVpbnQ4QXJyYXkiLCJVaW50MzJBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksQ0FBQ0EsV0FBVyxDQUFDQyxNQUFqQixFQUF5QjtBQUNyQixNQUFNQyxVQUFVLEdBQUdDLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsU0FBdEIsQ0FBbkI7QUFDQUwsRUFBQUEsV0FBVyxDQUFDQyxNQUFaLEdBQXNCLE9BQU9DLFVBQVAsS0FBc0IsVUFBdkIsR0FBcUMsVUFBVUksR0FBVixFQUFlO0FBQ3JFLFdBQU9BLEdBQUcsWUFBWUosVUFBdEI7QUFDSCxHQUZvQixHQUVqQixVQUFVSSxHQUFWLEVBQWU7QUFDZjtBQUNBLFFBQUksT0FBT0EsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQ3pCLGFBQU8sS0FBUDtBQUNIOztBQUNELFFBQUlDLElBQUksR0FBR0QsR0FBRyxDQUFDRSxXQUFmO0FBQ0EsV0FBT0QsSUFBSSxLQUFLRSxZQUFULElBQXlCRixJQUFJLEtBQUtHLFVBQWxDLElBQWdESCxJQUFJLEtBQUtJLFdBQXpELElBQXdFSixJQUFJLEtBQUtGLFNBQXhGO0FBQ0gsR0FURDtBQVVIIiwic291cmNlc0NvbnRlbnQiOlsiaWYgKCFBcnJheUJ1ZmZlci5pc1ZpZXcpIHtcbiAgICBjb25zdCBUeXBlZEFycmF5ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKEludDhBcnJheSk7XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3ID0gKHR5cGVvZiBUeXBlZEFycmF5ID09PSAnZnVuY3Rpb24nKSA/IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIFR5cGVkQXJyYXk7XG4gICAgfSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgLy8gb2xkIEpTQywgcGhhbnRvbSwgUXRXZWJ2aWV3XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gY3RvciA9PT0gRmxvYXQzMkFycmF5IHx8IGN0b3IgPT09IFVpbnQ4QXJyYXkgfHwgY3RvciA9PT0gVWludDMyQXJyYXkgfHwgY3RvciA9PT0gSW50OEFycmF5O1xuICAgIH07XG59Il19