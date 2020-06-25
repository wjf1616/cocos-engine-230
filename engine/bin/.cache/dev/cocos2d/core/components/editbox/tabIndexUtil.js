
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/tabIndexUtil.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var tabIndexUtil = {
  _tabIndexList: [],
  add: function add(editBoxImpl) {
    var list = this._tabIndexList;
    var index = list.indexOf(editBoxImpl);

    if (index === -1) {
      list.push(editBoxImpl);
    }
  },
  remove: function remove(editBoxImpl) {
    var list = this._tabIndexList;
    var index = list.indexOf(editBoxImpl);

    if (index !== -1) {
      list.splice(index, 1);
    }
  },
  resort: function resort() {
    this._tabIndexList.sort(function (a, b) {
      return a._delegate._tabIndex - b._delegate._tabIndex;
    });
  },
  next: function next(editBoxImpl) {
    var list = this._tabIndexList;
    var index = list.indexOf(editBoxImpl);
    editBoxImpl.setFocus(false);

    if (index !== -1) {
      var nextImpl = list[index + 1];

      if (nextImpl && nextImpl._delegate._tabIndex >= 0) {
        nextImpl.setFocus(true);
      }
    }
  }
};
module.exports = tabIndexUtil;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYkluZGV4VXRpbC5qcyJdLCJuYW1lcyI6WyJ0YWJJbmRleFV0aWwiLCJfdGFiSW5kZXhMaXN0IiwiYWRkIiwiZWRpdEJveEltcGwiLCJsaXN0IiwiaW5kZXgiLCJpbmRleE9mIiwicHVzaCIsInJlbW92ZSIsInNwbGljZSIsInJlc29ydCIsInNvcnQiLCJhIiwiYiIsIl9kZWxlZ2F0ZSIsIl90YWJJbmRleCIsIm5leHQiLCJzZXRGb2N1cyIsIm5leHRJbXBsIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFlBQVksR0FBRztBQUNqQkMsRUFBQUEsYUFBYSxFQUFFLEVBREU7QUFHakJDLEVBQUFBLEdBSGlCLGVBR1pDLFdBSFksRUFHQztBQUNkLFFBQUlDLElBQUksR0FBRyxLQUFLSCxhQUFoQjtBQUNBLFFBQUlJLEtBQUssR0FBR0QsSUFBSSxDQUFDRSxPQUFMLENBQWFILFdBQWIsQ0FBWjs7QUFDQSxRQUFJRSxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWlCO0FBQ2JELE1BQUFBLElBQUksQ0FBQ0csSUFBTCxDQUFVSixXQUFWO0FBQ0g7QUFDSixHQVRnQjtBQVdqQkssRUFBQUEsTUFYaUIsa0JBV1RMLFdBWFMsRUFXSTtBQUNqQixRQUFJQyxJQUFJLEdBQUcsS0FBS0gsYUFBaEI7QUFDQSxRQUFJSSxLQUFLLEdBQUdELElBQUksQ0FBQ0UsT0FBTCxDQUFhSCxXQUFiLENBQVo7O0FBQ0EsUUFBSUUsS0FBSyxLQUFLLENBQUMsQ0FBZixFQUFrQjtBQUNkRCxNQUFBQSxJQUFJLENBQUNLLE1BQUwsQ0FBWUosS0FBWixFQUFtQixDQUFuQjtBQUNIO0FBQ0osR0FqQmdCO0FBbUJqQkssRUFBQUEsTUFuQmlCLG9CQW1CUDtBQUNOLFNBQUtULGFBQUwsQ0FBbUJVLElBQW5CLENBQXdCLFVBQVNDLENBQVQsRUFBWUMsQ0FBWixFQUFlO0FBQ25DLGFBQU9ELENBQUMsQ0FBQ0UsU0FBRixDQUFZQyxTQUFaLEdBQXdCRixDQUFDLENBQUNDLFNBQUYsQ0FBWUMsU0FBM0M7QUFDSCxLQUZEO0FBR0gsR0F2QmdCO0FBeUJqQkMsRUFBQUEsSUF6QmlCLGdCQXlCWGIsV0F6QlcsRUF5QkU7QUFDZixRQUFJQyxJQUFJLEdBQUcsS0FBS0gsYUFBaEI7QUFDQSxRQUFJSSxLQUFLLEdBQUdELElBQUksQ0FBQ0UsT0FBTCxDQUFhSCxXQUFiLENBQVo7QUFDQUEsSUFBQUEsV0FBVyxDQUFDYyxRQUFaLENBQXFCLEtBQXJCOztBQUNBLFFBQUlaLEtBQUssS0FBSyxDQUFDLENBQWYsRUFBa0I7QUFDZCxVQUFJYSxRQUFRLEdBQUdkLElBQUksQ0FBQ0MsS0FBSyxHQUFDLENBQVAsQ0FBbkI7O0FBQ0EsVUFBSWEsUUFBUSxJQUFJQSxRQUFRLENBQUNKLFNBQVQsQ0FBbUJDLFNBQW5CLElBQWdDLENBQWhELEVBQW1EO0FBQy9DRyxRQUFBQSxRQUFRLENBQUNELFFBQVQsQ0FBa0IsSUFBbEI7QUFDSDtBQUNKO0FBQ0o7QUFuQ2dCLENBQXJCO0FBc0NBRSxNQUFNLENBQUNDLE9BQVAsR0FBaUJwQixZQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYkluZGV4VXRpbCA9IHtcbiAgICBfdGFiSW5kZXhMaXN0OiBbXSxcblxuICAgIGFkZCAoZWRpdEJveEltcGwpIHtcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLl90YWJJbmRleExpc3Q7XG4gICAgICAgIGxldCBpbmRleCA9IGxpc3QuaW5kZXhPZihlZGl0Qm94SW1wbCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpe1xuICAgICAgICAgICAgbGlzdC5wdXNoKGVkaXRCb3hJbXBsKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmUgKGVkaXRCb3hJbXBsKSB7XG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5fdGFiSW5kZXhMaXN0O1xuICAgICAgICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YoZWRpdEJveEltcGwpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzb3J0ICgpIHtcbiAgICAgICAgdGhpcy5fdGFiSW5kZXhMaXN0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuX2RlbGVnYXRlLl90YWJJbmRleCAtIGIuX2RlbGVnYXRlLl90YWJJbmRleDtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG5leHQgKGVkaXRCb3hJbXBsKSB7XG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5fdGFiSW5kZXhMaXN0O1xuICAgICAgICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YoZWRpdEJveEltcGwpO1xuICAgICAgICBlZGl0Qm94SW1wbC5zZXRGb2N1cyhmYWxzZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGxldCBuZXh0SW1wbCA9IGxpc3RbaW5kZXgrMV07XG4gICAgICAgICAgICBpZiAobmV4dEltcGwgJiYgbmV4dEltcGwuX2RlbGVnYXRlLl90YWJJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgbmV4dEltcGwuc2V0Rm9jdXModHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhYkluZGV4VXRpbDsiXX0=