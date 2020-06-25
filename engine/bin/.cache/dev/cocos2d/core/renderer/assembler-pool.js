
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/assembler-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _pool3 = _interopRequireDefault(require("../utils/pool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _assemblerId = 0;

function getAssemblerId(assemblerCtor) {
  if (!Object.getOwnPropertyDescriptor(assemblerCtor, '__assemblerId__')) {
    assemblerCtor.__assemblerId__ = ++_assemblerId;
  }

  return assemblerCtor.__assemblerId__;
}
/**
 * {
 *   assembler_ctor_id: []
 * }
 */


var AssemblerPool =
/*#__PURE__*/
function (_Pool) {
  _inheritsLoose(AssemblerPool, _Pool);

  function AssemblerPool() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Pool.call.apply(_Pool, [this].concat(args)) || this;
    _this._pool = {};
    return _this;
  }

  var _proto = AssemblerPool.prototype;

  _proto.put = function put(assembler) {
    if (!assembler) return;

    if (!this.enabled) {
      if (CC_JSB && CC_NATIVERENDERER) {
        assembler.destroy && assembler.destroy();
      }

      return;
    }

    var id = getAssemblerId(assembler.constructor);
    var pool = this._pool;

    if (!pool[id]) {
      pool[id] = [];
    }

    if (this.count > this.maxSize) return;

    this._clean(assembler);

    pool[id].push(assembler);
    this.count++;
  };

  _proto.get = function get(assemblerCtor) {
    var assembler;

    if (this.enabled) {
      var _pool = this._pool;
      var id = getAssemblerId(assemblerCtor);
      assembler = _pool[id] && _pool[id].pop();
    }

    if (!assembler) {
      assembler = new assemblerCtor();
    } else {
      this.count--;
    }

    return assembler;
  };

  _proto.clear = function clear() {
    if (CC_JSB && CC_NATIVERENDERER) {
      var _pool2 = this._pool;

      for (var name in _pool2) {
        var assemblers = _pool2[name];
        if (!assemblers) continue;

        for (var i = 0; i < assemblers.length; i++) {
          assemblers[i].destroy && assemblers[i].destroy();
        }
      }
    }

    this._pool = {};
    this.count = 0;
  };

  _proto._clean = function _clean(assembler) {
    if (CC_JSB && CC_NATIVERENDERER) {
      assembler.reset();
    }

    assembler._renderComp = null;
  };

  return AssemblerPool;
}(_pool3["default"]);

var pool = new AssemblerPool();

_pool3["default"].register('assembler', pool);

var _default = pool;
exports["default"] = _default;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2VtYmxlci1wb29sLmpzIl0sIm5hbWVzIjpbIl9hc3NlbWJsZXJJZCIsImdldEFzc2VtYmxlcklkIiwiYXNzZW1ibGVyQ3RvciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIl9fYXNzZW1ibGVySWRfXyIsIkFzc2VtYmxlclBvb2wiLCJfcG9vbCIsInB1dCIsImFzc2VtYmxlciIsImVuYWJsZWQiLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsImRlc3Ryb3kiLCJpZCIsImNvbnN0cnVjdG9yIiwicG9vbCIsImNvdW50IiwibWF4U2l6ZSIsIl9jbGVhbiIsInB1c2giLCJnZXQiLCJwb3AiLCJjbGVhciIsIm5hbWUiLCJhc3NlbWJsZXJzIiwiaSIsImxlbmd0aCIsInJlc2V0IiwiX3JlbmRlckNvbXAiLCJQb29sIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBSUEsWUFBWSxHQUFHLENBQW5COztBQUVBLFNBQVNDLGNBQVQsQ0FBeUJDLGFBQXpCLEVBQXdDO0FBQ3BDLE1BQUksQ0FBQ0MsTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0YsYUFBaEMsRUFBK0MsaUJBQS9DLENBQUwsRUFBd0U7QUFDcEVBLElBQUFBLGFBQWEsQ0FBQ0csZUFBZCxHQUFnQyxFQUFFTCxZQUFsQztBQUNIOztBQUNELFNBQU9FLGFBQWEsQ0FBQ0csZUFBckI7QUFDSDtBQUVEOzs7Ozs7O0lBS01DOzs7Ozs7Ozs7Ozs7O1VBQ0ZDLFFBQVE7Ozs7OztTQUVSQyxNQUFBLGFBQUtDLFNBQUwsRUFBZ0I7QUFDWixRQUFJLENBQUNBLFNBQUwsRUFBZ0I7O0FBQ2hCLFFBQUksQ0FBQyxLQUFLQyxPQUFWLEVBQW1CO0FBQ2YsVUFBSUMsTUFBTSxJQUFJQyxpQkFBZCxFQUFpQztBQUM3QkgsUUFBQUEsU0FBUyxDQUFDSSxPQUFWLElBQXFCSixTQUFTLENBQUNJLE9BQVYsRUFBckI7QUFDSDs7QUFDRDtBQUNIOztBQUVELFFBQUlDLEVBQUUsR0FBR2IsY0FBYyxDQUFDUSxTQUFTLENBQUNNLFdBQVgsQ0FBdkI7QUFDQSxRQUFJQyxJQUFJLEdBQUcsS0FBS1QsS0FBaEI7O0FBQ0EsUUFBSSxDQUFDUyxJQUFJLENBQUNGLEVBQUQsQ0FBVCxFQUFlO0FBQ1hFLE1BQUFBLElBQUksQ0FBQ0YsRUFBRCxDQUFKLEdBQVcsRUFBWDtBQUNIOztBQUNELFFBQUksS0FBS0csS0FBTCxHQUFhLEtBQUtDLE9BQXRCLEVBQStCOztBQUUvQixTQUFLQyxNQUFMLENBQVlWLFNBQVo7O0FBQ0FPLElBQUFBLElBQUksQ0FBQ0YsRUFBRCxDQUFKLENBQVNNLElBQVQsQ0FBY1gsU0FBZDtBQUNBLFNBQUtRLEtBQUw7QUFDSDs7U0FFREksTUFBQSxhQUFLbkIsYUFBTCxFQUFvQjtBQUNoQixRQUFJTyxTQUFKOztBQUVBLFFBQUksS0FBS0MsT0FBVCxFQUFrQjtBQUNkLFVBQUlNLEtBQUksR0FBRyxLQUFLVCxLQUFoQjtBQUNBLFVBQUlPLEVBQUUsR0FBR2IsY0FBYyxDQUFDQyxhQUFELENBQXZCO0FBQ0FPLE1BQUFBLFNBQVMsR0FBR08sS0FBSSxDQUFDRixFQUFELENBQUosSUFBWUUsS0FBSSxDQUFDRixFQUFELENBQUosQ0FBU1EsR0FBVCxFQUF4QjtBQUNIOztBQUVELFFBQUksQ0FBQ2IsU0FBTCxFQUFnQjtBQUNaQSxNQUFBQSxTQUFTLEdBQUcsSUFBSVAsYUFBSixFQUFaO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsV0FBS2UsS0FBTDtBQUNIOztBQUNELFdBQU9SLFNBQVA7QUFDSDs7U0FFRGMsUUFBQSxpQkFBUztBQUNMLFFBQUlaLE1BQU0sSUFBSUMsaUJBQWQsRUFBaUM7QUFDN0IsVUFBSUksTUFBSSxHQUFHLEtBQUtULEtBQWhCOztBQUNBLFdBQUssSUFBSWlCLElBQVQsSUFBaUJSLE1BQWpCLEVBQXVCO0FBQ25CLFlBQUlTLFVBQVUsR0FBR1QsTUFBSSxDQUFDUSxJQUFELENBQXJCO0FBQ0EsWUFBSSxDQUFDQyxVQUFMLEVBQWlCOztBQUVqQixhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELFVBQVUsQ0FBQ0UsTUFBL0IsRUFBdUNELENBQUMsRUFBeEMsRUFBNEM7QUFDeENELFVBQUFBLFVBQVUsQ0FBQ0MsQ0FBRCxDQUFWLENBQWNiLE9BQWQsSUFBeUJZLFVBQVUsQ0FBQ0MsQ0FBRCxDQUFWLENBQWNiLE9BQWQsRUFBekI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsU0FBS04sS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLVSxLQUFMLEdBQWEsQ0FBYjtBQUNIOztTQUVERSxTQUFBLGdCQUFRVixTQUFSLEVBQW1CO0FBQ2YsUUFBSUUsTUFBTSxJQUFJQyxpQkFBZCxFQUFpQztBQUM3QkgsTUFBQUEsU0FBUyxDQUFDbUIsS0FBVjtBQUNIOztBQUNEbkIsSUFBQUEsU0FBUyxDQUFDb0IsV0FBVixHQUF3QixJQUF4QjtBQUNIOzs7RUFoRXVCQzs7QUFtRTVCLElBQUlkLElBQUksR0FBRyxJQUFJVixhQUFKLEVBQVg7O0FBQ0F3QixrQkFBS0MsUUFBTCxDQUFjLFdBQWQsRUFBMkJmLElBQTNCOztlQUNlQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQb29sIGZyb20gJy4uL3V0aWxzL3Bvb2wnO1xuXG5sZXQgX2Fzc2VtYmxlcklkID0gMDtcblxuZnVuY3Rpb24gZ2V0QXNzZW1ibGVySWQgKGFzc2VtYmxlckN0b3IpIHtcbiAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYXNzZW1ibGVyQ3RvciwgJ19fYXNzZW1ibGVySWRfXycpKSB7XG4gICAgICAgIGFzc2VtYmxlckN0b3IuX19hc3NlbWJsZXJJZF9fID0gKytfYXNzZW1ibGVySWQ7XG4gICAgfVxuICAgIHJldHVybiBhc3NlbWJsZXJDdG9yLl9fYXNzZW1ibGVySWRfXztcbn1cblxuLyoqXG4gKiB7XG4gKiAgIGFzc2VtYmxlcl9jdG9yX2lkOiBbXVxuICogfVxuICovXG5jbGFzcyBBc3NlbWJsZXJQb29sIGV4dGVuZHMgUG9vbCB7XG4gICAgX3Bvb2wgPSB7fTtcblxuICAgIHB1dCAoYXNzZW1ibGVyKSB7XG4gICAgICAgIGlmICghYXNzZW1ibGVyKSByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICAgICAgYXNzZW1ibGVyLmRlc3Ryb3kgJiYgYXNzZW1ibGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpZCA9IGdldEFzc2VtYmxlcklkKGFzc2VtYmxlci5jb25zdHJ1Y3Rvcik7XG4gICAgICAgIGxldCBwb29sID0gdGhpcy5fcG9vbDtcbiAgICAgICAgaWYgKCFwb29sW2lkXSkge1xuICAgICAgICAgICAgcG9vbFtpZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb3VudCA+IHRoaXMubWF4U2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2NsZWFuKGFzc2VtYmxlcik7XG4gICAgICAgIHBvb2xbaWRdLnB1c2goYXNzZW1ibGVyKTtcbiAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgIH1cblxuICAgIGdldCAoYXNzZW1ibGVyQ3Rvcikge1xuICAgICAgICBsZXQgYXNzZW1ibGVyO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgbGV0IHBvb2wgPSB0aGlzLl9wb29sO1xuICAgICAgICAgICAgbGV0IGlkID0gZ2V0QXNzZW1ibGVySWQoYXNzZW1ibGVyQ3Rvcik7XG4gICAgICAgICAgICBhc3NlbWJsZXIgPSBwb29sW2lkXSAmJiBwb29sW2lkXS5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXNzZW1ibGVyKSB7XG4gICAgICAgICAgICBhc3NlbWJsZXIgPSBuZXcgYXNzZW1ibGVyQ3RvcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb3VudC0tO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc3NlbWJsZXI7XG4gICAgfVxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICBsZXQgcG9vbCA9IHRoaXMuX3Bvb2w7XG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIHBvb2wpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXNzZW1ibGVycyA9IHBvb2xbbmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCFhc3NlbWJsZXJzKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNzZW1ibGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhc3NlbWJsZXJzW2ldLmRlc3Ryb3kgJiYgYXNzZW1ibGVyc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wb29sID0ge307XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgIH1cblxuICAgIF9jbGVhbiAoYXNzZW1ibGVyKSB7XG4gICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIGFzc2VtYmxlci5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VtYmxlci5fcmVuZGVyQ29tcCA9IG51bGw7XG4gICAgfVxufVxuXG5sZXQgcG9vbCA9IG5ldyBBc3NlbWJsZXJQb29sKCk7XG5Qb29sLnJlZ2lzdGVyKCdhc3NlbWJsZXInLCBwb29sKTtcbmV4cG9ydCBkZWZhdWx0IHBvb2w7XG4iXX0=