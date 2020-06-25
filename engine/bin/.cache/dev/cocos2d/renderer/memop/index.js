
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.TypedArrayPool = exports.RecyclePool = exports.Pool = exports.LinkedArray = exports.FixedArray = exports.CircularPool = void 0;

var _circularPool = _interopRequireDefault(require("./circular-pool"));

exports.CircularPool = _circularPool["default"];

var _fixedArray = _interopRequireDefault(require("./fixed-array"));

exports.FixedArray = _fixedArray["default"];

var _linkedArray = _interopRequireDefault(require("./linked-array"));

exports.LinkedArray = _linkedArray["default"];

var _pool = _interopRequireDefault(require("./pool"));

exports.Pool = _pool["default"];

var _recyclePool = _interopRequireDefault(require("./recycle-pool"));

exports.RecyclePool = _recyclePool["default"];

var _typedArrayPool = _interopRequireDefault(require("./typed-array-pool"));

exports.TypedArrayPool = _typedArrayPool["default"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBkZWZhdWx0IGFzIENpcmN1bGFyUG9vbCB9IGZyb20gJy4vY2lyY3VsYXItcG9vbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZpeGVkQXJyYXkgfSBmcm9tICcuL2ZpeGVkLWFycmF5JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTGlua2VkQXJyYXkgfSBmcm9tICcuL2xpbmtlZC1hcnJheSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBvb2wgfSBmcm9tICcuL3Bvb2wnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZWN5Y2xlUG9vbCB9IGZyb20gJy4vcmVjeWNsZS1wb29sJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVHlwZWRBcnJheVBvb2wgfSBmcm9tICcuL3R5cGVkLWFycmF5LXBvb2wnOyJdfQ==