
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/misc.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.isPow2 = isPow2;

function isPow2(v) {
  return !(v & v - 1) && !!v;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pc2MuanMiXSwibmFtZXMiOlsiaXNQb3cyIiwidiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLE1BQVQsQ0FBZ0JDLENBQWhCLEVBQW1CO0FBQ3hCLFNBQU8sRUFBRUEsQ0FBQyxHQUFJQSxDQUFDLEdBQUcsQ0FBWCxLQUFtQixDQUFDLENBQUNBLENBQTVCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaXNQb3cyKHYpIHtcbiAgcmV0dXJuICEodiAmICh2IC0gMSkpICYmICghIXYpO1xufSJdfQ==