
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCRenderTexture.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var renderer = require('../renderer');

var Texture2D = require('./CCTexture2D');

/**
 * Render textures are textures that can be rendered to.
 * @class RenderTexture
 * @extends Texture2D
 */
var RenderTexture = cc.Class({
  name: 'cc.RenderTexture',
  "extends": Texture2D,
  ctor: function ctor() {
    this._framebuffer = null;
  },

  /**
   * !#en
   * Init the render texture with size.
   * !#zh
   * 初始化 render texture 
   * @param {Number} [width] 
   * @param {Number} [height]
   * @param {Number} [depthStencilFormat]
   * @method initWithSize
   */
  initWithSize: function initWithSize(width, height, depthStencilFormat) {
    this.width = Math.floor(width || cc.visibleRect.width);
    this.height = Math.floor(height || cc.visibleRect.height);

    this._resetUnderlyingMipmaps();

    var opts = {
      colors: [this._texture]
    };
    if (this._depthStencilBuffer) this._depthStencilBuffer.destroy();
    var depthStencilBuffer;

    if (depthStencilFormat) {
      depthStencilBuffer = new _gfx["default"].RenderBuffer(renderer.device, depthStencilFormat, width, height);

      if (depthStencilFormat === _gfx["default"].RB_FMT_D24S8) {
        opts.depthStencil = depthStencilBuffer;
      } else if (depthStencilFormat === _gfx["default"].RB_FMT_S8) {
        opts.stencil = depthStencilBuffer;
      } else if (depthStencilFormat === _gfx["default"].RB_FMT_D16) {
        opts.depth = depthStencilBuffer;
      }
    }

    this._depthStencilBuffer = depthStencilBuffer;
    if (this._framebuffer) this._framebuffer.destroy();
    this._framebuffer = new _gfx["default"].FrameBuffer(renderer.device, width, height, opts);
    this._packable = false;
    this.loaded = true;
    this.emit("load");
  },
  updateSize: function updateSize(width, height) {
    this.width = Math.floor(width || cc.visibleRect.width);
    this.height = Math.floor(height || cc.visibleRect.height);

    this._resetUnderlyingMipmaps();

    var rbo = this._depthStencilBuffer;
    if (rbo) rbo.update(this.width, this.height);
    this._framebuffer._width = width;
    this._framebuffer._height = height;
  },

  /**
   * !#en Draw a texture to the specified position
   * !#zh 将指定的图片渲染到指定的位置上
   * @param {Texture2D} texture 
   * @param {Number} x 
   * @param {Number} y 
   */
  drawTextureAt: function drawTextureAt(texture, x, y) {
    if (!texture._image) return;

    this._texture.updateSubImage({
      x: x,
      y: y,
      image: texture._image,
      width: texture.width,
      height: texture.height,
      level: 0,
      flipY: false,
      premultiplyAlpha: texture._premultiplyAlpha
    });
  },

  /**
   * !#en
   * Get pixels from render texture, the pixels data stores in a RGBA Uint8Array.
   * It will return a new (width * height * 4) length Uint8Array by default。
   * You can specify a data to store the pixels to reuse the data, 
   * you and can specify other params to specify the texture region to read.
   * !#zh
   * 从 render texture 读取像素数据，数据类型为 RGBA 格式的 Uint8Array 数组。
   * 默认每次调用此函数会生成一个大小为 （长 x 高 x 4） 的 Uint8Array。
   * 你可以通过传入 data 来接收像素数据，也可以通过传参来指定需要读取的区域的像素。
   * @method readPixels
   * @param {Uint8Array} [data]
   * @param {Number} [x] 
   * @param {Number} [y] 
   * @param {Number} [w] 
   * @param {Number} [h] 
   * @return {Uint8Array}
   */
  readPixels: function readPixels(data, x, y, w, h) {
    if (!this._framebuffer || !this._texture) return data;
    x = x || 0;
    y = y || 0;
    var width = w || this.width;
    var height = h || this.height;
    data = data || new Uint8Array(width * height * 4);
    var gl = cc.game._renderContext;
    var oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer.getHandle());
    gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.bindFramebuffer(gl.FRAMEBUFFER, oldFBO);
    return data;
  },
  destroy: function destroy() {
    this._super();

    if (this._framebuffer) {
      this._framebuffer.destroy();

      this._framebuffer = null;
    }
  }
});
cc.RenderTexture = module.exports = RenderTexture;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmVuZGVyVGV4dHVyZS5qcyJdLCJuYW1lcyI6WyJyZW5kZXJlciIsInJlcXVpcmUiLCJUZXh0dXJlMkQiLCJSZW5kZXJUZXh0dXJlIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJjdG9yIiwiX2ZyYW1lYnVmZmVyIiwiaW5pdFdpdGhTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJkZXB0aFN0ZW5jaWxGb3JtYXQiLCJNYXRoIiwiZmxvb3IiLCJ2aXNpYmxlUmVjdCIsIl9yZXNldFVuZGVybHlpbmdNaXBtYXBzIiwib3B0cyIsImNvbG9ycyIsIl90ZXh0dXJlIiwiX2RlcHRoU3RlbmNpbEJ1ZmZlciIsImRlc3Ryb3kiLCJkZXB0aFN0ZW5jaWxCdWZmZXIiLCJnZngiLCJSZW5kZXJCdWZmZXIiLCJkZXZpY2UiLCJSQl9GTVRfRDI0UzgiLCJkZXB0aFN0ZW5jaWwiLCJSQl9GTVRfUzgiLCJzdGVuY2lsIiwiUkJfRk1UX0QxNiIsImRlcHRoIiwiRnJhbWVCdWZmZXIiLCJfcGFja2FibGUiLCJsb2FkZWQiLCJlbWl0IiwidXBkYXRlU2l6ZSIsInJibyIsInVwZGF0ZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJkcmF3VGV4dHVyZUF0IiwidGV4dHVyZSIsIngiLCJ5IiwiX2ltYWdlIiwidXBkYXRlU3ViSW1hZ2UiLCJpbWFnZSIsImxldmVsIiwiZmxpcFkiLCJwcmVtdWx0aXBseUFscGhhIiwiX3ByZW11bHRpcGx5QWxwaGEiLCJyZWFkUGl4ZWxzIiwiZGF0YSIsInciLCJoIiwiVWludDhBcnJheSIsImdsIiwiZ2FtZSIsIl9yZW5kZXJDb250ZXh0Iiwib2xkRkJPIiwiZ2V0UGFyYW1ldGVyIiwiRlJBTUVCVUZGRVJfQklORElORyIsImJpbmRGcmFtZWJ1ZmZlciIsIkZSQU1FQlVGRkVSIiwiZ2V0SGFuZGxlIiwiUkdCQSIsIlVOU0lHTkVEX0JZVEUiLCJfc3VwZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7QUFIQSxJ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Q0FBZTlDLEtBQUssR0FBR0MsTUFBUixHQUFpQixDQUFoQyxDQUFoQjtBQUVBLFFBQUk4QyxFQUFFLEdBQUdyRCxFQUFFLENBQUNzRCxJQUFILENBQVFDLGNBQWpCO0FBQ0EsUUFBSUMsTUFBTSxHQUFHSCxFQUFFLENBQUNJLFlBQUgsQ0FBZ0JKLEVBQUUsQ0FBQ0ssbUJBQW5CLENBQWI7QUFDQUwsSUFBQUEsRUFBRSxDQUFDTSxlQUFILENBQW1CTixFQUFFLENBQUNPLFdBQXRCLEVBQW1DLEtBQUt4RCxZQUFMLENBQWtCeUQsU0FBbEIsRUFBbkM7QUFDQVIsSUFBQUEsRUFBRSxDQUFDTCxVQUFILENBQWNULENBQWQsRUFBaUJDLENBQWpCLEVBQW9CbEMsS0FBcEIsRUFBMkJDLE1BQTNCLEVBQW1DOEMsRUFBRSxDQUFDUyxJQUF0QyxFQUE0Q1QsRUFBRSxDQUFDVSxhQUEvQyxFQUE4RGQsSUFBOUQ7QUFDQUksSUFBQUEsRUFBRSxDQUFDTSxlQUFILENBQW1CTixFQUFFLENBQUNPLFdBQXRCLEVBQW1DSixNQUFuQztBQUVBLFdBQU9QLElBQVA7QUFDSCxHQXJId0I7QUF1SHpCaEMsRUFBQUEsT0F2SHlCLHFCQXVIZDtBQUNQLFNBQUsrQyxNQUFMOztBQUNBLFFBQUksS0FBSzVELFlBQVQsRUFBdUI7QUFDbkIsV0FBS0EsWUFBTCxDQUFrQmEsT0FBbEI7O0FBQ0EsV0FBS2IsWUFBTCxHQUFvQixJQUFwQjtBQUNIO0FBQ0o7QUE3SHdCLENBQVQsQ0FBcEI7QUFnSUFKLEVBQUUsQ0FBQ0QsYUFBSCxHQUFtQmtFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5FLGFBQXBDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlcicpO1xuY29uc3QgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi9DQ1RleHR1cmUyRCcpO1xuXG5pbXBvcnQgZ2Z4IGZyb20gJy4uLy4uL3JlbmRlcmVyL2dmeCc7XG5cbi8qKlxuICogUmVuZGVyIHRleHR1cmVzIGFyZSB0ZXh0dXJlcyB0aGF0IGNhbiBiZSByZW5kZXJlZCB0by5cbiAqIEBjbGFzcyBSZW5kZXJUZXh0dXJlXG4gKiBAZXh0ZW5kcyBUZXh0dXJlMkRcbiAqL1xubGV0IFJlbmRlclRleHR1cmUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJlbmRlclRleHR1cmUnLFxuICAgIGV4dGVuZHM6IFRleHR1cmUyRCxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9mcmFtZWJ1ZmZlciA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbml0IHRoZSByZW5kZXIgdGV4dHVyZSB3aXRoIHNpemUuXG4gICAgICogISN6aFxuICAgICAqIOWIneWni+WMliByZW5kZXIgdGV4dHVyZSBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3dpZHRoXSBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodF1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2RlcHRoU3RlbmNpbEZvcm1hdF1cbiAgICAgKiBAbWV0aG9kIGluaXRXaXRoU2l6ZVxuICAgICAqL1xuICAgIGluaXRXaXRoU2l6ZSAod2lkdGgsIGhlaWdodCwgZGVwdGhTdGVuY2lsRm9ybWF0KSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBNYXRoLmZsb29yKHdpZHRoIHx8IGNjLnZpc2libGVSZWN0LndpZHRoKTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCB8fCBjYy52aXNpYmxlUmVjdC5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9yZXNldFVuZGVybHlpbmdNaXBtYXBzKCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgb3B0cyA9IHtcbiAgICAgICAgICAgIGNvbG9yczogWyB0aGlzLl90ZXh0dXJlIF0sXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuX2RlcHRoU3RlbmNpbEJ1ZmZlcikgdGhpcy5fZGVwdGhTdGVuY2lsQnVmZmVyLmRlc3Ryb3koKTtcbiAgICAgICAgbGV0IGRlcHRoU3RlbmNpbEJ1ZmZlcjtcbiAgICAgICAgaWYgKGRlcHRoU3RlbmNpbEZvcm1hdCkge1xuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQnVmZmVyID0gbmV3IGdmeC5SZW5kZXJCdWZmZXIocmVuZGVyZXIuZGV2aWNlLCBkZXB0aFN0ZW5jaWxGb3JtYXQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgaWYgKGRlcHRoU3RlbmNpbEZvcm1hdCA9PT0gZ2Z4LlJCX0ZNVF9EMjRTOCkge1xuICAgICAgICAgICAgICAgIG9wdHMuZGVwdGhTdGVuY2lsID0gZGVwdGhTdGVuY2lsQnVmZmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGVwdGhTdGVuY2lsRm9ybWF0ID09PSBnZnguUkJfRk1UX1M4KSB7XG4gICAgICAgICAgICAgICAgb3B0cy5zdGVuY2lsID0gZGVwdGhTdGVuY2lsQnVmZmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGVwdGhTdGVuY2lsRm9ybWF0ID09PSBnZnguUkJfRk1UX0QxNikge1xuICAgICAgICAgICAgICAgIG9wdHMuZGVwdGggPSBkZXB0aFN0ZW5jaWxCdWZmZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGVwdGhTdGVuY2lsQnVmZmVyID0gZGVwdGhTdGVuY2lsQnVmZmVyO1xuICAgICAgICBpZiAodGhpcy5fZnJhbWVidWZmZXIpIHRoaXMuX2ZyYW1lYnVmZmVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fZnJhbWVidWZmZXIgPSBuZXcgZ2Z4LkZyYW1lQnVmZmVyKHJlbmRlcmVyLmRldmljZSwgd2lkdGgsIGhlaWdodCwgb3B0cyk7XG5cbiAgICAgICAgdGhpcy5fcGFja2FibGUgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KFwibG9hZFwiKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBNYXRoLmZsb29yKHdpZHRoIHx8IGNjLnZpc2libGVSZWN0LndpZHRoKTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCB8fCBjYy52aXNpYmxlUmVjdC5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9yZXNldFVuZGVybHlpbmdNaXBtYXBzKCk7XG5cbiAgICAgICAgbGV0IHJibyA9IHRoaXMuX2RlcHRoU3RlbmNpbEJ1ZmZlcjtcbiAgICAgICAgaWYgKHJibykgcmJvLnVwZGF0ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2ZyYW1lYnVmZmVyLl93aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9mcmFtZWJ1ZmZlci5faGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERyYXcgYSB0ZXh0dXJlIHRvIHRoZSBzcGVjaWZpZWQgcG9zaXRpb25cbiAgICAgKiAhI3poIOWwhuaMh+WumueahOWbvueJh+a4suafk+WIsOaMh+WumueahOS9jee9ruS4ilxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IFxuICAgICAqL1xuICAgIGRyYXdUZXh0dXJlQXQgKHRleHR1cmUsIHgsIHkpIHtcbiAgICAgICAgaWYgKCF0ZXh0dXJlLl9pbWFnZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3RleHR1cmUudXBkYXRlU3ViSW1hZ2Uoe1xuICAgICAgICAgICAgeCwgeSxcbiAgICAgICAgICAgIGltYWdlOiB0ZXh0dXJlLl9pbWFnZSxcbiAgICAgICAgICAgIHdpZHRoOiB0ZXh0dXJlLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0ZXh0dXJlLmhlaWdodCxcbiAgICAgICAgICAgIGxldmVsOiAwLFxuICAgICAgICAgICAgZmxpcFk6IGZhbHNlLFxuICAgICAgICAgICAgcHJlbXVsdGlwbHlBbHBoYTogdGV4dHVyZS5fcHJlbXVsdGlwbHlBbHBoYVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHBpeGVscyBmcm9tIHJlbmRlciB0ZXh0dXJlLCB0aGUgcGl4ZWxzIGRhdGEgc3RvcmVzIGluIGEgUkdCQSBVaW50OEFycmF5LlxuICAgICAqIEl0IHdpbGwgcmV0dXJuIGEgbmV3ICh3aWR0aCAqIGhlaWdodCAqIDQpIGxlbmd0aCBVaW50OEFycmF5IGJ5IGRlZmF1bHTjgIJcbiAgICAgKiBZb3UgY2FuIHNwZWNpZnkgYSBkYXRhIHRvIHN0b3JlIHRoZSBwaXhlbHMgdG8gcmV1c2UgdGhlIGRhdGEsIFxuICAgICAqIHlvdSBhbmQgY2FuIHNwZWNpZnkgb3RoZXIgcGFyYW1zIHRvIHNwZWNpZnkgdGhlIHRleHR1cmUgcmVnaW9uIHRvIHJlYWQuXG4gICAgICogISN6aFxuICAgICAqIOS7jiByZW5kZXIgdGV4dHVyZSDor7vlj5blg4/ntKDmlbDmja7vvIzmlbDmja7nsbvlnovkuLogUkdCQSDmoLzlvI/nmoQgVWludDhBcnJheSDmlbDnu4TjgIJcbiAgICAgKiDpu5jorqTmr4/mrKHosIPnlKjmraTlh73mlbDkvJrnlJ/miJDkuIDkuKrlpKflsI/kuLog77yI6ZW/IHgg6auYIHggNO+8iSDnmoQgVWludDhBcnJheeOAglxuICAgICAqIOS9oOWPr+S7pemAmui/h+S8oOWFpSBkYXRhIOadpeaOpeaUtuWDj+e0oOaVsOaNru+8jOS5n+WPr+S7pemAmui/h+S8oOWPguadpeaMh+WumumcgOimgeivu+WPlueahOWMuuWfn+eahOWDj+e0oOOAglxuICAgICAqIEBtZXRob2QgcmVhZFBpeGVsc1xuICAgICAqIEBwYXJhbSB7VWludDhBcnJheX0gW2RhdGFdXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt4XSBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbd10gXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtoXSBcbiAgICAgKiBAcmV0dXJuIHtVaW50OEFycmF5fVxuICAgICAqL1xuICAgIHJlYWRQaXhlbHMgKGRhdGEsIHgsIHksIHcsIGgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mcmFtZWJ1ZmZlciB8fCAhdGhpcy5fdGV4dHVyZSkgcmV0dXJuIGRhdGE7XG5cbiAgICAgICAgeCA9IHggfHwgMDtcbiAgICAgICAgeSA9IHkgfHwgMDtcbiAgICAgICAgbGV0IHdpZHRoID0gdyB8fCB0aGlzLndpZHRoO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gaCB8fCB0aGlzLmhlaWdodFxuICAgICAgICBkYXRhID0gZGF0YSAgfHwgbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiA0KTtcblxuICAgICAgICBsZXQgZ2wgPSBjYy5nYW1lLl9yZW5kZXJDb250ZXh0O1xuICAgICAgICBsZXQgb2xkRkJPID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLkZSQU1FQlVGRkVSX0JJTkRJTkcpO1xuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIHRoaXMuX2ZyYW1lYnVmZmVyLmdldEhhbmRsZSgpKTtcbiAgICAgICAgZ2wucmVhZFBpeGVscyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBkYXRhKTtcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBvbGRGQk8pO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG5cbiAgICBkZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2ZyYW1lYnVmZmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZWJ1ZmZlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZWJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuUmVuZGVyVGV4dHVyZSA9IG1vZHVsZS5leHBvcnRzID0gUmVuZGVyVGV4dHVyZTtcbiJdfQ==