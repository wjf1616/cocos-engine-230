
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/Texture2D.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
var Texture2D = function Texture2D(device, options) {
  this._device = device;
  this._width = 4;
  this._height = 4;
  this._image = null;

  if (options) {
    if (options.width !== undefined) {
      this._width = options.width;
    }

    if (options.height !== undefined) {
      this._height = options.height;
    }

    this.updateImage(options);
  }
};

Texture2D.prototype.update = function update(options) {
  this.updateImage(options);
};

Texture2D.prototype.updateImage = function updateImage(options) {
  if (options.images && options.images[0]) {
    var image = options.images[0];

    if (image && image !== this._image) {
      this._image = image;
    }
  }
};

Texture2D.prototype.destroy = function destroy() {
  this._image = null;
};

module.exports = Texture2D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRleHR1cmUyRC5qcyJdLCJuYW1lcyI6WyJUZXh0dXJlMkQiLCJkZXZpY2UiLCJvcHRpb25zIiwiX2RldmljZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJfaW1hZ2UiLCJ3aWR0aCIsInVuZGVmaW5lZCIsImhlaWdodCIsInVwZGF0ZUltYWdlIiwicHJvdG90eXBlIiwidXBkYXRlIiwiaW1hZ2VzIiwiaW1hZ2UiLCJkZXN0cm95IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBO0FBRUEsSUFBSUEsU0FBUyxHQUFHLFNBQVNBLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCQyxPQUEzQixFQUFvQztBQUNsRCxPQUFLQyxPQUFMLEdBQWVGLE1BQWY7QUFFQSxPQUFLRyxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLE9BQUwsR0FBZSxDQUFmO0FBRUEsT0FBS0MsTUFBTCxHQUFjLElBQWQ7O0FBRUEsTUFBSUosT0FBSixFQUFhO0FBQ1gsUUFBSUEsT0FBTyxDQUFDSyxLQUFSLEtBQWtCQyxTQUF0QixFQUFpQztBQUMvQixXQUFLSixNQUFMLEdBQWNGLE9BQU8sQ0FBQ0ssS0FBdEI7QUFDRDs7QUFDRCxRQUFJTCxPQUFPLENBQUNPLE1BQVIsS0FBbUJELFNBQXZCLEVBQWtDO0FBQ2hDLFdBQUtILE9BQUwsR0FBZUgsT0FBTyxDQUFDTyxNQUF2QjtBQUNEOztBQUVELFNBQUtDLFdBQUwsQ0FBaUJSLE9BQWpCO0FBQ0Q7QUFDRixDQWxCRDs7QUFvQkFGLFNBQVMsQ0FBQ1csU0FBVixDQUFvQkMsTUFBcEIsR0FBNkIsU0FBU0EsTUFBVCxDQUFpQlYsT0FBakIsRUFBMEI7QUFDckQsT0FBS1EsV0FBTCxDQUFpQlIsT0FBakI7QUFDRCxDQUZEOztBQUlBRixTQUFTLENBQUNXLFNBQVYsQ0FBb0JELFdBQXBCLEdBQWtDLFNBQVNBLFdBQVQsQ0FBc0JSLE9BQXRCLEVBQStCO0FBQy9ELE1BQUlBLE9BQU8sQ0FBQ1csTUFBUixJQUFrQlgsT0FBTyxDQUFDVyxNQUFSLENBQWUsQ0FBZixDQUF0QixFQUF5QztBQUN2QyxRQUFJQyxLQUFLLEdBQUdaLE9BQU8sQ0FBQ1csTUFBUixDQUFlLENBQWYsQ0FBWjs7QUFDQSxRQUFJQyxLQUFLLElBQUlBLEtBQUssS0FBSyxLQUFLUixNQUE1QixFQUFvQztBQUNsQyxXQUFLQSxNQUFMLEdBQWNRLEtBQWQ7QUFDRDtBQUNGO0FBQ0YsQ0FQRDs7QUFTQWQsU0FBUyxDQUFDVyxTQUFWLENBQW9CSSxPQUFwQixHQUE4QixTQUFTQSxPQUFULEdBQW9CO0FBQ2hELE9BQUtULE1BQUwsR0FBYyxJQUFkO0FBQ0QsQ0FGRDs7QUFJQVUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCakIsU0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiAgXG4gXG52YXIgVGV4dHVyZTJEID0gZnVuY3Rpb24gVGV4dHVyZTJEKGRldmljZSwgb3B0aW9ucykge1xuICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XG4gICAgXG4gIHRoaXMuX3dpZHRoID0gNDtcbiAgdGhpcy5faGVpZ2h0ID0gNDtcblxuICB0aGlzLl9pbWFnZSA9IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy53aWR0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl93aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUltYWdlKG9wdGlvbnMpO1xuICB9XG59O1xuXG5UZXh0dXJlMkQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3B0aW9ucykge1xuICB0aGlzLnVwZGF0ZUltYWdlKG9wdGlvbnMpO1xufTtcblxuVGV4dHVyZTJELnByb3RvdHlwZS51cGRhdGVJbWFnZSA9IGZ1bmN0aW9uIHVwZGF0ZUltYWdlIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmltYWdlcyAmJiBvcHRpb25zLmltYWdlc1swXSkge1xuICAgIHZhciBpbWFnZSA9IG9wdGlvbnMuaW1hZ2VzWzBdO1xuICAgIGlmIChpbWFnZSAmJiBpbWFnZSAhPT0gdGhpcy5faW1hZ2UpIHtcbiAgICAgIHRoaXMuX2ltYWdlID0gaW1hZ2U7XG4gICAgfVxuICB9XG59O1xuXG5UZXh0dXJlMkQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdGhpcy5faW1hZ2UgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XG4iXX0=