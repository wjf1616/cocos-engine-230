
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _vertexFormat = require("./webgl/vertex-format");

var _assemblerPool = _interopRequireDefault(require("./assembler-pool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Assembler =
/*#__PURE__*/
function () {
  function Assembler() {
    this._extendNative && this._extendNative();
  }

  var _proto = Assembler.prototype;

  _proto.init = function init(renderComp) {
    this._renderComp = renderComp;
  };

  _proto.updateRenderData = function updateRenderData(comp) {};

  _proto.fillBuffers = function fillBuffers(comp, renderer) {};

  _proto.getVfmt = function getVfmt() {
    return _vertexFormat.vfmtPosUvColor;
  };

  return Assembler;
}();

exports["default"] = Assembler;

Assembler.register = function (renderCompCtor, assembler) {
  renderCompCtor.__assembler__ = assembler;
};

Assembler.init = function (renderComp) {
  var renderCompCtor = renderComp.constructor;
  var assemblerCtor = renderCompCtor.__assembler__;

  while (!assemblerCtor) {
    renderCompCtor = renderCompCtor.$super;

    if (!renderCompCtor) {
      cc.warn("Can not find assembler for render component : [" + cc.js.getClassName(renderComp) + "]");
      return;
    }

    assemblerCtor = renderCompCtor.__assembler__;
  }

  if (assemblerCtor.getConstructor) {
    assemblerCtor = assemblerCtor.getConstructor(renderComp);
  }

  if (!renderComp._assembler || renderComp._assembler.constructor !== assemblerCtor) {
    var assembler = _assemblerPool["default"].get(assemblerCtor);

    assembler.init(renderComp);
    renderComp._assembler = assembler;
  }
};

cc.Assembler = Assembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2VtYmxlci5qcyJdLCJuYW1lcyI6WyJBc3NlbWJsZXIiLCJfZXh0ZW5kTmF0aXZlIiwiaW5pdCIsInJlbmRlckNvbXAiLCJfcmVuZGVyQ29tcCIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwiZmlsbEJ1ZmZlcnMiLCJyZW5kZXJlciIsImdldFZmbXQiLCJ2Zm10UG9zVXZDb2xvciIsInJlZ2lzdGVyIiwicmVuZGVyQ29tcEN0b3IiLCJhc3NlbWJsZXIiLCJfX2Fzc2VtYmxlcl9fIiwiY29uc3RydWN0b3IiLCJhc3NlbWJsZXJDdG9yIiwiJHN1cGVyIiwiY2MiLCJ3YXJuIiwianMiLCJnZXRDbGFzc05hbWUiLCJnZXRDb25zdHJ1Y3RvciIsIl9hc3NlbWJsZXIiLCJhc3NlbWJsZXJQb29sIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7SUFFcUJBOzs7QUFDakIsdUJBQWU7QUFDWCxTQUFLQyxhQUFMLElBQXNCLEtBQUtBLGFBQUwsRUFBdEI7QUFDSDs7OztTQUNEQyxPQUFBLGNBQU1DLFVBQU4sRUFBa0I7QUFDZCxTQUFLQyxXQUFMLEdBQW1CRCxVQUFuQjtBQUNIOztTQUVERSxtQkFBQSwwQkFBa0JDLElBQWxCLEVBQXdCLENBQ3ZCOztTQUVEQyxjQUFBLHFCQUFhRCxJQUFiLEVBQW1CRSxRQUFuQixFQUE2QixDQUM1Qjs7U0FFREMsVUFBQSxtQkFBVztBQUNQLFdBQU9DLDRCQUFQO0FBQ0g7Ozs7Ozs7QUFJTFYsU0FBUyxDQUFDVyxRQUFWLEdBQXFCLFVBQVVDLGNBQVYsRUFBMEJDLFNBQTFCLEVBQXFDO0FBQ3RERCxFQUFBQSxjQUFjLENBQUNFLGFBQWYsR0FBK0JELFNBQS9CO0FBQ0gsQ0FGRDs7QUFJQWIsU0FBUyxDQUFDRSxJQUFWLEdBQWlCLFVBQVVDLFVBQVYsRUFBc0I7QUFDbkMsTUFBSVMsY0FBYyxHQUFHVCxVQUFVLENBQUNZLFdBQWhDO0FBQ0EsTUFBSUMsYUFBYSxHQUFJSixjQUFjLENBQUNFLGFBQXBDOztBQUNBLFNBQU8sQ0FBQ0UsYUFBUixFQUF1QjtBQUNuQkosSUFBQUEsY0FBYyxHQUFHQSxjQUFjLENBQUNLLE1BQWhDOztBQUNBLFFBQUksQ0FBQ0wsY0FBTCxFQUFxQjtBQUNqQk0sTUFBQUEsRUFBRSxDQUFDQyxJQUFILHFEQUEwREQsRUFBRSxDQUFDRSxFQUFILENBQU1DLFlBQU4sQ0FBbUJsQixVQUFuQixDQUExRDtBQUNBO0FBQ0g7O0FBQ0RhLElBQUFBLGFBQWEsR0FBSUosY0FBYyxDQUFDRSxhQUFoQztBQUNIOztBQUNELE1BQUlFLGFBQWEsQ0FBQ00sY0FBbEIsRUFBa0M7QUFDOUJOLElBQUFBLGFBQWEsR0FBR0EsYUFBYSxDQUFDTSxjQUFkLENBQTZCbkIsVUFBN0IsQ0FBaEI7QUFDSDs7QUFFRCxNQUFJLENBQUNBLFVBQVUsQ0FBQ29CLFVBQVosSUFBMEJwQixVQUFVLENBQUNvQixVQUFYLENBQXNCUixXQUF0QixLQUFzQ0MsYUFBcEUsRUFBbUY7QUFDL0UsUUFBSUgsU0FBUyxHQUFHVywwQkFBY0MsR0FBZCxDQUFrQlQsYUFBbEIsQ0FBaEI7O0FBQ0FILElBQUFBLFNBQVMsQ0FBQ1gsSUFBVixDQUFlQyxVQUFmO0FBQ0FBLElBQUFBLFVBQVUsQ0FBQ29CLFVBQVgsR0FBd0JWLFNBQXhCO0FBQ0g7QUFDSixDQXBCRDs7QUFzQkFLLEVBQUUsQ0FBQ2xCLFNBQUgsR0FBZUEsU0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHZmbXRQb3NVdkNvbG9yIH0gZnJvbSAnLi93ZWJnbC92ZXJ0ZXgtZm9ybWF0JztcbmltcG9ydCBhc3NlbWJsZXJQb29sIGZyb20gJy4vYXNzZW1ibGVyLXBvb2wnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NlbWJsZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fZXh0ZW5kTmF0aXZlICYmIHRoaXMuX2V4dGVuZE5hdGl2ZSgpO1xuICAgIH1cbiAgICBpbml0IChyZW5kZXJDb21wKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckNvbXAgPSByZW5kZXJDb21wO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChjb21wKSB7XG4gICAgfVxuXG4gICAgZmlsbEJ1ZmZlcnMgKGNvbXAsIHJlbmRlcmVyKSB7XG4gICAgfVxuICAgIFxuICAgIGdldFZmbXQgKCkge1xuICAgICAgICByZXR1cm4gdmZtdFBvc1V2Q29sb3I7XG4gICAgfVxufVxuXG5cbkFzc2VtYmxlci5yZWdpc3RlciA9IGZ1bmN0aW9uIChyZW5kZXJDb21wQ3RvciwgYXNzZW1ibGVyKSB7XG4gICAgcmVuZGVyQ29tcEN0b3IuX19hc3NlbWJsZXJfXyA9IGFzc2VtYmxlcjtcbn07XG5cbkFzc2VtYmxlci5pbml0ID0gZnVuY3Rpb24gKHJlbmRlckNvbXApIHtcbiAgICBsZXQgcmVuZGVyQ29tcEN0b3IgPSByZW5kZXJDb21wLmNvbnN0cnVjdG9yO1xuICAgIGxldCBhc3NlbWJsZXJDdG9yID0gIHJlbmRlckNvbXBDdG9yLl9fYXNzZW1ibGVyX187XG4gICAgd2hpbGUgKCFhc3NlbWJsZXJDdG9yKSB7XG4gICAgICAgIHJlbmRlckNvbXBDdG9yID0gcmVuZGVyQ29tcEN0b3IuJHN1cGVyO1xuICAgICAgICBpZiAoIXJlbmRlckNvbXBDdG9yKSB7XG4gICAgICAgICAgICBjYy53YXJuKGBDYW4gbm90IGZpbmQgYXNzZW1ibGVyIGZvciByZW5kZXIgY29tcG9uZW50IDogWyR7Y2MuanMuZ2V0Q2xhc3NOYW1lKHJlbmRlckNvbXApfV1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhc3NlbWJsZXJDdG9yID0gIHJlbmRlckNvbXBDdG9yLl9fYXNzZW1ibGVyX187XG4gICAgfVxuICAgIGlmIChhc3NlbWJsZXJDdG9yLmdldENvbnN0cnVjdG9yKSB7XG4gICAgICAgIGFzc2VtYmxlckN0b3IgPSBhc3NlbWJsZXJDdG9yLmdldENvbnN0cnVjdG9yKHJlbmRlckNvbXApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIXJlbmRlckNvbXAuX2Fzc2VtYmxlciB8fCByZW5kZXJDb21wLl9hc3NlbWJsZXIuY29uc3RydWN0b3IgIT09IGFzc2VtYmxlckN0b3IpIHtcbiAgICAgICAgbGV0IGFzc2VtYmxlciA9IGFzc2VtYmxlclBvb2wuZ2V0KGFzc2VtYmxlckN0b3IpO1xuICAgICAgICBhc3NlbWJsZXIuaW5pdChyZW5kZXJDb21wKTtcbiAgICAgICAgcmVuZGVyQ29tcC5fYXNzZW1ibGVyID0gYXNzZW1ibGVyO1xuICAgIH1cbn07XG5cbmNjLkFzc2VtYmxlciA9IEFzc2VtYmxlcjtcbiJdfQ==