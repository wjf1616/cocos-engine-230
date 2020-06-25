
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/polyfill/string.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.lastIndexOf(searchString, position) === position;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    if (typeof position === 'undefined' || position > this.length) {
      position = this.length;
    }

    position -= searchString.length;
    var lastIndex = this.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.trimLeft) {
  String.prototype.trimLeft = function () {
    return this.replace(/^\s+/, '');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZy5qcyJdLCJuYW1lcyI6WyJTdHJpbmciLCJwcm90b3R5cGUiLCJzdGFydHNXaXRoIiwic2VhcmNoU3RyaW5nIiwicG9zaXRpb24iLCJsYXN0SW5kZXhPZiIsImVuZHNXaXRoIiwibGVuZ3RoIiwibGFzdEluZGV4IiwiaW5kZXhPZiIsInRyaW1MZWZ0IiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksQ0FBQ0EsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxVQUF0QixFQUFrQztBQUM5QkYsRUFBQUEsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxVQUFqQixHQUE4QixVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUM1REEsSUFBQUEsUUFBUSxHQUFHQSxRQUFRLElBQUksQ0FBdkI7QUFDQSxXQUFPLEtBQUtDLFdBQUwsQ0FBaUJGLFlBQWpCLEVBQStCQyxRQUEvQixNQUE2Q0EsUUFBcEQ7QUFDSCxHQUhEO0FBSUg7O0FBRUQsSUFBSSxDQUFDSixNQUFNLENBQUNDLFNBQVAsQ0FBaUJLLFFBQXRCLEVBQWdDO0FBQzVCTixFQUFBQSxNQUFNLENBQUNDLFNBQVAsQ0FBaUJLLFFBQWpCLEdBQTRCLFVBQVVILFlBQVYsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQzFELFFBQUksT0FBT0EsUUFBUCxLQUFvQixXQUFwQixJQUFtQ0EsUUFBUSxHQUFHLEtBQUtHLE1BQXZELEVBQStEO0FBQzNESCxNQUFBQSxRQUFRLEdBQUcsS0FBS0csTUFBaEI7QUFDSDs7QUFDREgsSUFBQUEsUUFBUSxJQUFJRCxZQUFZLENBQUNJLE1BQXpCO0FBQ0EsUUFBSUMsU0FBUyxHQUFHLEtBQUtDLE9BQUwsQ0FBYU4sWUFBYixFQUEyQkMsUUFBM0IsQ0FBaEI7QUFDQSxXQUFPSSxTQUFTLEtBQUssQ0FBQyxDQUFmLElBQW9CQSxTQUFTLEtBQUtKLFFBQXpDO0FBQ0gsR0FQRDtBQVFIOztBQUVELElBQUksQ0FBQ0osTUFBTSxDQUFDQyxTQUFQLENBQWlCUyxRQUF0QixFQUFnQztBQUM1QlYsRUFBQUEsTUFBTSxDQUFDQyxTQUFQLENBQWlCUyxRQUFqQixHQUE0QixZQUFZO0FBQ3BDLFdBQU8sS0FBS0MsT0FBTCxDQUFhLE1BQWIsRUFBcUIsRUFBckIsQ0FBUDtBQUNILEdBRkQ7QUFHSCIsInNvdXJjZXNDb250ZW50IjpbImlmICghU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKSB7XG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoID0gZnVuY3Rpb24gKHNlYXJjaFN0cmluZywgcG9zaXRpb24pIHtcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiB8fCAwO1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0SW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKSA9PT0gcG9zaXRpb247XG4gICAgfTtcbn1cblxuaWYgKCFTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKSB7XG4gICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcG9zaXRpb24gPT09ICd1bmRlZmluZWQnIHx8IHBvc2l0aW9uID4gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcG9zaXRpb24gLT0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICAgICAgdmFyIGxhc3RJbmRleCA9IHRoaXMuaW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIGxhc3RJbmRleCAhPT0gLTEgJiYgbGFzdEluZGV4ID09PSBwb3NpdGlvbjtcbiAgICB9O1xufVxuXG5pZiAoIVN0cmluZy5wcm90b3R5cGUudHJpbUxlZnQpIHtcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzKy8sICcnKTtcbiAgICB9O1xufVxuIl19