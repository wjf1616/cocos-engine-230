
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var Pool =
/*#__PURE__*/
function () {
  function Pool() {
    this.enabled = false;
    this.count = 0;
    this.maxSize = 1024;
  }

  var _proto = Pool.prototype;

  _proto.get = function get() {};

  _proto.put = function put() {};

  _proto.clear = function clear() {};

  return Pool;
}();

exports["default"] = Pool;
cc.pool = {};

Pool.register = function (name, pool) {
  cc.pool[name] = pool;
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvb2wuanMiXSwibmFtZXMiOlsiUG9vbCIsImVuYWJsZWQiLCJjb3VudCIsIm1heFNpemUiLCJnZXQiLCJwdXQiLCJjbGVhciIsImNjIiwicG9vbCIsInJlZ2lzdGVyIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQUNxQkE7Ozs7U0FDakJDLFVBQVU7U0FDVkMsUUFBUTtTQUNSQyxVQUFVOzs7OztTQUVWQyxNQUFBLGVBQU8sQ0FFTjs7U0FDREMsTUFBQSxlQUFPLENBRU47O1NBQ0RDLFFBQUEsaUJBQVMsQ0FFUjs7Ozs7O0FBR0xDLEVBQUUsQ0FBQ0MsSUFBSCxHQUFVLEVBQVY7O0FBRUFSLElBQUksQ0FBQ1MsUUFBTCxHQUFnQixVQUFVQyxJQUFWLEVBQWdCRixJQUFoQixFQUFzQjtBQUNsQ0QsRUFBQUEsRUFBRSxDQUFDQyxJQUFILENBQVFFLElBQVIsSUFBZ0JGLElBQWhCO0FBQ0gsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9vbCB7XG4gICAgZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvdW50ID0gMDtcbiAgICBtYXhTaXplID0gMTAyNDtcblxuICAgIGdldCAoKSB7XG5cbiAgICB9XG4gICAgcHV0ICgpIHtcblxuICAgIH1cbiAgICBjbGVhciAoKSB7XG5cbiAgICB9XG59XG5cbmNjLnBvb2wgPSB7fTtcblxuUG9vbC5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lLCBwb29sKSB7XG4gICAgY2MucG9vbFtuYW1lXSA9IHBvb2w7XG59XG4iXX0=