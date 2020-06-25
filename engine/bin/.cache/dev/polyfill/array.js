
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/polyfill/array.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function (callback) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
      var element = this[i];

      if (callback.call(this, element, i, this)) {
        return element;
      }
    }

    return undefined;
  };
} // for ie 11


if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    return this.indexOf(value) !== -1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFycmF5LmpzIl0sIm5hbWVzIjpbIkFycmF5IiwiaXNBcnJheSIsImFyZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImZpbmQiLCJjYWxsYmFjayIsImxlbmd0aCIsImkiLCJlbGVtZW50IiwidW5kZWZpbmVkIiwiaW5jbHVkZXMiLCJ2YWx1ZSIsImluZGV4T2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLENBQUNBLEtBQUssQ0FBQ0MsT0FBWCxFQUFvQjtBQUNoQkQsRUFBQUEsS0FBSyxDQUFDQyxPQUFOLEdBQWdCLFVBQVVDLEdBQVYsRUFBZTtBQUMzQixXQUFPQyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsZ0JBQS9DO0FBQ0gsR0FGRDtBQUdIOztBQUVELElBQUksQ0FBQ0YsS0FBSyxDQUFDSSxTQUFOLENBQWdCRyxJQUFyQixFQUEyQjtBQUN2QlAsRUFBQUEsS0FBSyxDQUFDSSxTQUFOLENBQWdCRyxJQUFoQixHQUF1QixVQUFVQyxRQUFWLEVBQW9CO0FBQ3ZDLFFBQUlDLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELE1BQXBCLEVBQTRCQyxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCLFVBQUlDLE9BQU8sR0FBRyxLQUFLRCxDQUFMLENBQWQ7O0FBQ0EsVUFBSUYsUUFBUSxDQUFDRixJQUFULENBQWMsSUFBZCxFQUFvQkssT0FBcEIsRUFBNkJELENBQTdCLEVBQWdDLElBQWhDLENBQUosRUFBMkM7QUFDdkMsZUFBT0MsT0FBUDtBQUNIO0FBQ0o7O0FBRUQsV0FBT0MsU0FBUDtBQUNILEdBVkQ7QUFXSCxFQUVEOzs7QUFDQSxJQUFJLENBQUNaLEtBQUssQ0FBQ0ksU0FBTixDQUFnQlMsUUFBckIsRUFBK0I7QUFDM0JiLEVBQUFBLEtBQUssQ0FBQ0ksU0FBTixDQUFnQlMsUUFBaEIsR0FBMkIsVUFBVUMsS0FBVixFQUFpQjtBQUN4QyxXQUFPLEtBQUtDLE9BQUwsQ0FBYUQsS0FBYixNQUF3QixDQUFDLENBQWhDO0FBQ0gsR0FGRDtBQUdIIiwic291cmNlc0NvbnRlbnQiOlsiaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgQXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG59XG5cbmlmICghQXJyYXkucHJvdG90eXBlLmZpbmQpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpc1tpXTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXMsIGVsZW1lbnQsIGksIHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG59XG5cbi8vIGZvciBpZSAxMVxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgIH07XG59XG4iXX0=