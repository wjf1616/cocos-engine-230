
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/cone.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}'use strict';

exports.__esModule = true;
exports["default"] = _default;

var _cylinder = _interopRequireDefault(require("./cylinder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @param {Number} radius
 * @param {Number} height
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.heightSegments
 * @param {Boolean} opts.capped
 * @param {Number} opts.arc
 */
function _default(radius, height, opts) {
  if (radius === void 0) {
    radius = 0.5;
  }

  if (height === void 0) {
    height = 1;
  }

  if (opts === void 0) {
    opts = {
      radialSegments: 32,
      heightSegments: 1,
      capped: true,
      arc: 2.0 * Math.PI
    };
  }

  return (0, _cylinder["default"])(0, radius, height, opts);
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmUudHMiXSwibmFtZXMiOlsicmFkaXVzIiwiaGVpZ2h0Iiwib3B0cyIsInJhZGlhbFNlZ21lbnRzIiwiaGVpZ2h0U2VnbWVudHMiLCJjYXBwZWQiLCJhcmMiLCJNYXRoIiwiUEkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBRUE7Ozs7QUFFQTs7Ozs7Ozs7O0FBU2Usa0JBQVVBLE1BQVYsRUFBd0JDLE1BQXhCLEVBQW9DQyxJQUFwQyxFQUFzSDtBQUFBLE1BQTVHRixNQUE0RztBQUE1R0EsSUFBQUEsTUFBNEcsR0FBbkcsR0FBbUc7QUFBQTs7QUFBQSxNQUE5RkMsTUFBOEY7QUFBOUZBLElBQUFBLE1BQThGLEdBQXJGLENBQXFGO0FBQUE7O0FBQUEsTUFBbEZDLElBQWtGO0FBQWxGQSxJQUFBQSxJQUFrRixHQUEzRTtBQUFDQyxNQUFBQSxjQUFjLEVBQUUsRUFBakI7QUFBcUJDLE1BQUFBLGNBQWMsRUFBRSxDQUFyQztBQUF3Q0MsTUFBQUEsTUFBTSxFQUFFLElBQWhEO0FBQXNEQyxNQUFBQSxHQUFHLEVBQUUsTUFBTUMsSUFBSSxDQUFDQztBQUF0RSxLQUEyRTtBQUFBOztBQUNuSSxTQUFPLDBCQUFTLENBQVQsRUFBWVIsTUFBWixFQUFvQkMsTUFBcEIsRUFBNEJDLElBQTVCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGN5bGluZGVyIGZyb20gJy4vY3lsaW5kZXInO1xuXG4vKipcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0cy5yYWRpYWxTZWdtZW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuaGVpZ2h0U2VnbWVudHNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0cy5jYXBwZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmFyY1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocmFkaXVzID0gMC41LCBoZWlnaHQgPSAxLCBvcHRzID0ge3JhZGlhbFNlZ21lbnRzOiAzMiwgaGVpZ2h0U2VnbWVudHM6IDEsIGNhcHBlZDogdHJ1ZSwgYXJjOiAyLjAgKiBNYXRoLlBJfSkge1xuICByZXR1cm4gY3lsaW5kZXIoMCwgcmFkaXVzLCBoZWlnaHQsIG9wdHMpO1xufVxuIl19