
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _enums = require("./enums");

var gfx = null;

if (CC_JSB && CC_NATIVERENDERER) {
  gfx = window.gfx;
} else {
  var VertexFormat = require('./vertex-format');

  var IndexBuffer = require('./index-buffer');

  var VertexBuffer = require('./vertex-buffer');

  var Program = require('./program');

  var Texture = require('./texture');

  var Texture2D = require('./texture-2d');

  var TextureCube = require('./texture-cube');

  var RenderBuffer = require('./render-buffer');

  var FrameBuffer = require('./frame-buffer');

  var Device = require('./device');

  gfx = {
    // classes
    VertexFormat: VertexFormat,
    IndexBuffer: IndexBuffer,
    VertexBuffer: VertexBuffer,
    Program: Program,
    Texture: Texture,
    Texture2D: Texture2D,
    TextureCube: TextureCube,
    RenderBuffer: RenderBuffer,
    FrameBuffer: FrameBuffer,
    Device: Device,
    // functions
    attrTypeBytes: _enums.attrTypeBytes,
    glFilter: _enums.glFilter,
    glTextureFmt: _enums.glTextureFmt
  };
  Object.assign(gfx, _enums.enums);
}

var _default = gfx;
exports["default"] = _default;
cc.gfx = gfx;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImdmeCIsIkNDX0pTQiIsIkNDX05BVElWRVJFTkRFUkVSIiwid2luZG93IiwiVmVydGV4Rm9ybWF0IiwicmVxdWlyZSIsIkluZGV4QnVmZmVyIiwiVmVydGV4QnVmZmVyIiwiUHJvZ3JhbSIsIlRleHR1cmUiLCJUZXh0dXJlMkQiLCJUZXh0dXJlQ3ViZSIsIlJlbmRlckJ1ZmZlciIsIkZyYW1lQnVmZmVyIiwiRGV2aWNlIiwiYXR0clR5cGVCeXRlcyIsImdsRmlsdGVyIiwiZ2xUZXh0dXJlRm10IiwiT2JqZWN0IiwiYXNzaWduIiwiZW51bXMiLCJjYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQU9BLElBQUlBLEdBQUcsR0FBRyxJQUFWOztBQUVBLElBQUlDLE1BQU0sSUFBSUMsaUJBQWQsRUFBaUM7QUFDN0JGLEVBQUFBLEdBQUcsR0FBR0csTUFBTSxDQUFDSCxHQUFiO0FBQ0gsQ0FGRCxNQUVPO0FBQ0gsTUFBSUksWUFBWSxHQUFHQyxPQUFPLENBQUMsaUJBQUQsQ0FBMUI7O0FBQ0EsTUFBSUMsV0FBVyxHQUFHRCxPQUFPLENBQUMsZ0JBQUQsQ0FBekI7O0FBQ0EsTUFBSUUsWUFBWSxHQUFHRixPQUFPLENBQUMsaUJBQUQsQ0FBMUI7O0FBQ0EsTUFBSUcsT0FBTyxHQUFHSCxPQUFPLENBQUMsV0FBRCxDQUFyQjs7QUFDQSxNQUFJSSxPQUFPLEdBQUdKLE9BQU8sQ0FBQyxXQUFELENBQXJCOztBQUNBLE1BQUlLLFNBQVMsR0FBR0wsT0FBTyxDQUFDLGNBQUQsQ0FBdkI7O0FBQ0EsTUFBSU0sV0FBVyxHQUFHTixPQUFPLENBQUMsZ0JBQUQsQ0FBekI7O0FBQ0EsTUFBSU8sWUFBWSxHQUFHUCxPQUFPLENBQUMsaUJBQUQsQ0FBMUI7O0FBQ0EsTUFBSVEsV0FBVyxHQUFHUixPQUFPLENBQUMsZ0JBQUQsQ0FBekI7O0FBQ0EsTUFBSVMsTUFBTSxHQUFHVCxPQUFPLENBQUMsVUFBRCxDQUFwQjs7QUFFQUwsRUFBQUEsR0FBRyxHQUFHO0FBQ0Y7QUFDQUksSUFBQUEsWUFBWSxFQUFaQSxZQUZFO0FBR0ZFLElBQUFBLFdBQVcsRUFBWEEsV0FIRTtBQUlGQyxJQUFBQSxZQUFZLEVBQVpBLFlBSkU7QUFLRkMsSUFBQUEsT0FBTyxFQUFQQSxPQUxFO0FBTUZDLElBQUFBLE9BQU8sRUFBUEEsT0FORTtBQU9GQyxJQUFBQSxTQUFTLEVBQVRBLFNBUEU7QUFRRkMsSUFBQUEsV0FBVyxFQUFYQSxXQVJFO0FBU0ZDLElBQUFBLFlBQVksRUFBWkEsWUFURTtBQVVGQyxJQUFBQSxXQUFXLEVBQVhBLFdBVkU7QUFXRkMsSUFBQUEsTUFBTSxFQUFOQSxNQVhFO0FBYUY7QUFDQUMsSUFBQUEsYUFBYSxFQUFiQSxvQkFkRTtBQWVGQyxJQUFBQSxRQUFRLEVBQVJBLGVBZkU7QUFnQkZDLElBQUFBLFlBQVksRUFBWkE7QUFoQkUsR0FBTjtBQWtCQUMsRUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWNuQixHQUFkLEVBQW1Cb0IsWUFBbkI7QUFDSDs7ZUFFY3BCOztBQUNmcUIsRUFBRSxDQUFDckIsR0FBSCxHQUFTQSxHQUFUIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBlbnVtcyxcbiAgICBhdHRyVHlwZUJ5dGVzLFxuICAgIGdsRmlsdGVyLFxuICAgIGdsVGV4dHVyZUZtdCxcbn0gZnJvbSAnLi9lbnVtcyc7XG5cbmxldCBnZnggPSBudWxsO1xuXG5pZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgZ2Z4ID0gd2luZG93LmdmeDtcbn0gZWxzZSB7XG4gICAgbGV0IFZlcnRleEZvcm1hdCA9IHJlcXVpcmUoJy4vdmVydGV4LWZvcm1hdCcpO1xuICAgIGxldCBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4vaW5kZXgtYnVmZmVyJyk7XG4gICAgbGV0IFZlcnRleEJ1ZmZlciA9IHJlcXVpcmUoJy4vdmVydGV4LWJ1ZmZlcicpO1xuICAgIGxldCBQcm9ncmFtID0gcmVxdWlyZSgnLi9wcm9ncmFtJyk7XG4gICAgbGV0IFRleHR1cmUgPSByZXF1aXJlKCcuL3RleHR1cmUnKTtcbiAgICBsZXQgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi90ZXh0dXJlLTJkJyk7XG4gICAgbGV0IFRleHR1cmVDdWJlID0gcmVxdWlyZSgnLi90ZXh0dXJlLWN1YmUnKTtcbiAgICBsZXQgUmVuZGVyQnVmZmVyID0gcmVxdWlyZSgnLi9yZW5kZXItYnVmZmVyJyk7XG4gICAgbGV0IEZyYW1lQnVmZmVyID0gcmVxdWlyZSgnLi9mcmFtZS1idWZmZXInKTtcbiAgICBsZXQgRGV2aWNlID0gcmVxdWlyZSgnLi9kZXZpY2UnKTtcblxuICAgIGdmeCA9IHtcbiAgICAgICAgLy8gY2xhc3Nlc1xuICAgICAgICBWZXJ0ZXhGb3JtYXQsXG4gICAgICAgIEluZGV4QnVmZmVyLFxuICAgICAgICBWZXJ0ZXhCdWZmZXIsXG4gICAgICAgIFByb2dyYW0sXG4gICAgICAgIFRleHR1cmUsXG4gICAgICAgIFRleHR1cmUyRCxcbiAgICAgICAgVGV4dHVyZUN1YmUsXG4gICAgICAgIFJlbmRlckJ1ZmZlcixcbiAgICAgICAgRnJhbWVCdWZmZXIsXG4gICAgICAgIERldmljZSxcblxuICAgICAgICAvLyBmdW5jdGlvbnNcbiAgICAgICAgYXR0clR5cGVCeXRlcyxcbiAgICAgICAgZ2xGaWx0ZXIsXG4gICAgICAgIGdsVGV4dHVyZUZtdCxcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24oZ2Z4LCBlbnVtcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdmeDtcbmNjLmdmeCA9IGdmeDtcbiJdfQ==