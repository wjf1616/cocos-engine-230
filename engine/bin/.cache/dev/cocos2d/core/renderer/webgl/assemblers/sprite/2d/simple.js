
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/2d/simple.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler2d = _interopRequireDefault(require("../../../../assembler-2d"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SimpleSpriteAssembler =
/*#__PURE__*/
function (_Assembler2D) {
  _inheritsLoose(SimpleSpriteAssembler, _Assembler2D);

  function SimpleSpriteAssembler() {
    return _Assembler2D.apply(this, arguments) || this;
  }

  var _proto = SimpleSpriteAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(sprite) {
    this.packToDynamicAtlas(sprite, sprite._spriteFrame);

    if (sprite._vertsDirty) {
      this.updateUVs(sprite);
      this.updateVerts(sprite);
      sprite._vertsDirty = false;
    }
  };

  _proto.updateUVs = function updateUVs(sprite) {
    var uv = sprite._spriteFrame.uv;
    var uvOffset = this.uvOffset;
    var floatsPerVert = this.floatsPerVert;
    var verts = this._renderData.vDatas[0];

    for (var i = 0; i < 4; i++) {
      var srcOffset = i * 2;
      var dstOffset = floatsPerVert * i + uvOffset;
      verts[dstOffset] = uv[srcOffset];
      verts[dstOffset + 1] = uv[srcOffset + 1];
    }
  };

  _proto.updateVerts = function updateVerts(sprite) {
    var node = sprite.node,
        cw = node.width,
        ch = node.height,
        appx = node.anchorX * cw,
        appy = node.anchorY * ch,
        l,
        b,
        r,
        t;

    if (sprite.trim) {
      l = -appx;
      b = -appy;
      r = cw - appx;
      t = ch - appy;
    } else {
      var frame = sprite.spriteFrame,
          ow = frame._originalSize.width,
          oh = frame._originalSize.height,
          rw = frame._rect.width,
          rh = frame._rect.height,
          offset = frame._offset,
          scaleX = cw / ow,
          scaleY = ch / oh;
      var trimLeft = offset.x + (ow - rw) / 2;
      var trimRight = offset.x - (ow - rw) / 2;
      var trimBottom = offset.y + (oh - rh) / 2;
      var trimTop = offset.y - (oh - rh) / 2;
      l = trimLeft * scaleX - appx;
      b = trimBottom * scaleY - appy;
      r = cw + trimRight * scaleX - appx;
      t = ch + trimTop * scaleY - appy;
    }

    var local = this._local;
    local[0] = l;
    local[1] = b;
    local[2] = r;
    local[3] = t;
    this.updateWorldVerts(sprite);
  };

  return SimpleSpriteAssembler;
}(_assembler2d["default"]);

exports["default"] = SimpleSpriteAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpbXBsZS5qcyJdLCJuYW1lcyI6WyJTaW1wbGVTcHJpdGVBc3NlbWJsZXIiLCJ1cGRhdGVSZW5kZXJEYXRhIiwic3ByaXRlIiwicGFja1RvRHluYW1pY0F0bGFzIiwiX3Nwcml0ZUZyYW1lIiwiX3ZlcnRzRGlydHkiLCJ1cGRhdGVVVnMiLCJ1cGRhdGVWZXJ0cyIsInV2IiwidXZPZmZzZXQiLCJmbG9hdHNQZXJWZXJ0IiwidmVydHMiLCJfcmVuZGVyRGF0YSIsInZEYXRhcyIsImkiLCJzcmNPZmZzZXQiLCJkc3RPZmZzZXQiLCJub2RlIiwiY3ciLCJ3aWR0aCIsImNoIiwiaGVpZ2h0IiwiYXBweCIsImFuY2hvclgiLCJhcHB5IiwiYW5jaG9yWSIsImwiLCJiIiwiciIsInQiLCJ0cmltIiwiZnJhbWUiLCJzcHJpdGVGcmFtZSIsIm93IiwiX29yaWdpbmFsU2l6ZSIsIm9oIiwicnciLCJfcmVjdCIsInJoIiwib2Zmc2V0IiwiX29mZnNldCIsInNjYWxlWCIsInNjYWxlWSIsInRyaW1MZWZ0IiwieCIsInRyaW1SaWdodCIsInRyaW1Cb3R0b20iLCJ5IiwidHJpbVRvcCIsImxvY2FsIiwiX2xvY2FsIiwidXBkYXRlV29ybGRWZXJ0cyIsIkFzc2VtYmxlcjJEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7SUFFcUJBOzs7Ozs7Ozs7OztTQUNqQkMsbUJBQUEsMEJBQWtCQyxNQUFsQixFQUEwQjtBQUN0QixTQUFLQyxrQkFBTCxDQUF3QkQsTUFBeEIsRUFBZ0NBLE1BQU0sQ0FBQ0UsWUFBdkM7O0FBRUEsUUFBSUYsTUFBTSxDQUFDRyxXQUFYLEVBQXdCO0FBQ3BCLFdBQUtDLFNBQUwsQ0FBZUosTUFBZjtBQUNBLFdBQUtLLFdBQUwsQ0FBaUJMLE1BQWpCO0FBQ0FBLE1BQUFBLE1BQU0sQ0FBQ0csV0FBUCxHQUFxQixLQUFyQjtBQUNIO0FBQ0o7O1NBRURDLFlBQUEsbUJBQVdKLE1BQVgsRUFBbUI7QUFDZixRQUFJTSxFQUFFLEdBQUdOLE1BQU0sQ0FBQ0UsWUFBUCxDQUFvQkksRUFBN0I7QUFDQSxRQUFJQyxRQUFRLEdBQUcsS0FBS0EsUUFBcEI7QUFDQSxRQUFJQyxhQUFhLEdBQUcsS0FBS0EsYUFBekI7QUFDQSxRQUFJQyxLQUFLLEdBQUcsS0FBS0MsV0FBTCxDQUFpQkMsTUFBakIsQ0FBd0IsQ0FBeEIsQ0FBWjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLENBQUMsRUFBeEIsRUFBNEI7QUFDeEIsVUFBSUMsU0FBUyxHQUFHRCxDQUFDLEdBQUcsQ0FBcEI7QUFDQSxVQUFJRSxTQUFTLEdBQUdOLGFBQWEsR0FBR0ksQ0FBaEIsR0FBb0JMLFFBQXBDO0FBQ0FFLE1BQUFBLEtBQUssQ0FBQ0ssU0FBRCxDQUFMLEdBQW1CUixFQUFFLENBQUNPLFNBQUQsQ0FBckI7QUFDQUosTUFBQUEsS0FBSyxDQUFDSyxTQUFTLEdBQUcsQ0FBYixDQUFMLEdBQXVCUixFQUFFLENBQUNPLFNBQVMsR0FBRyxDQUFiLENBQXpCO0FBQ0g7QUFDSjs7U0FFRFIsY0FBQSxxQkFBYUwsTUFBYixFQUFxQjtBQUNqQixRQUFJZSxJQUFJLEdBQUdmLE1BQU0sQ0FBQ2UsSUFBbEI7QUFBQSxRQUNJQyxFQUFFLEdBQUdELElBQUksQ0FBQ0UsS0FEZDtBQUFBLFFBQ3FCQyxFQUFFLEdBQUdILElBQUksQ0FBQ0ksTUFEL0I7QUFBQSxRQUVJQyxJQUFJLEdBQUdMLElBQUksQ0FBQ00sT0FBTCxHQUFlTCxFQUYxQjtBQUFBLFFBRThCTSxJQUFJLEdBQUdQLElBQUksQ0FBQ1EsT0FBTCxHQUFlTCxFQUZwRDtBQUFBLFFBR0lNLENBSEo7QUFBQSxRQUdPQyxDQUhQO0FBQUEsUUFHVUMsQ0FIVjtBQUFBLFFBR2FDLENBSGI7O0FBSUEsUUFBSTNCLE1BQU0sQ0FBQzRCLElBQVgsRUFBaUI7QUFDYkosTUFBQUEsQ0FBQyxHQUFHLENBQUNKLElBQUw7QUFDQUssTUFBQUEsQ0FBQyxHQUFHLENBQUNILElBQUw7QUFDQUksTUFBQUEsQ0FBQyxHQUFHVixFQUFFLEdBQUdJLElBQVQ7QUFDQU8sTUFBQUEsQ0FBQyxHQUFHVCxFQUFFLEdBQUdJLElBQVQ7QUFDSCxLQUxELE1BTUs7QUFDRCxVQUFJTyxLQUFLLEdBQUc3QixNQUFNLENBQUM4QixXQUFuQjtBQUFBLFVBQ0lDLEVBQUUsR0FBR0YsS0FBSyxDQUFDRyxhQUFOLENBQW9CZixLQUQ3QjtBQUFBLFVBQ29DZ0IsRUFBRSxHQUFHSixLQUFLLENBQUNHLGFBQU4sQ0FBb0JiLE1BRDdEO0FBQUEsVUFFSWUsRUFBRSxHQUFHTCxLQUFLLENBQUNNLEtBQU4sQ0FBWWxCLEtBRnJCO0FBQUEsVUFFNEJtQixFQUFFLEdBQUdQLEtBQUssQ0FBQ00sS0FBTixDQUFZaEIsTUFGN0M7QUFBQSxVQUdJa0IsTUFBTSxHQUFHUixLQUFLLENBQUNTLE9BSG5CO0FBQUEsVUFJSUMsTUFBTSxHQUFHdkIsRUFBRSxHQUFHZSxFQUpsQjtBQUFBLFVBSXNCUyxNQUFNLEdBQUd0QixFQUFFLEdBQUdlLEVBSnBDO0FBS0EsVUFBSVEsUUFBUSxHQUFHSixNQUFNLENBQUNLLENBQVAsR0FBVyxDQUFDWCxFQUFFLEdBQUdHLEVBQU4sSUFBWSxDQUF0QztBQUNBLFVBQUlTLFNBQVMsR0FBR04sTUFBTSxDQUFDSyxDQUFQLEdBQVcsQ0FBQ1gsRUFBRSxHQUFHRyxFQUFOLElBQVksQ0FBdkM7QUFDQSxVQUFJVSxVQUFVLEdBQUdQLE1BQU0sQ0FBQ1EsQ0FBUCxHQUFXLENBQUNaLEVBQUUsR0FBR0csRUFBTixJQUFZLENBQXhDO0FBQ0EsVUFBSVUsT0FBTyxHQUFHVCxNQUFNLENBQUNRLENBQVAsR0FBVyxDQUFDWixFQUFFLEdBQUdHLEVBQU4sSUFBWSxDQUFyQztBQUNBWixNQUFBQSxDQUFDLEdBQUdpQixRQUFRLEdBQUdGLE1BQVgsR0FBb0JuQixJQUF4QjtBQUNBSyxNQUFBQSxDQUFDLEdBQUdtQixVQUFVLEdBQUdKLE1BQWIsR0FBc0JsQixJQUExQjtBQUNBSSxNQUFBQSxDQUFDLEdBQUdWLEVBQUUsR0FBRzJCLFNBQVMsR0FBR0osTUFBakIsR0FBMEJuQixJQUE5QjtBQUNBTyxNQUFBQSxDQUFDLEdBQUdULEVBQUUsR0FBRzRCLE9BQU8sR0FBR04sTUFBZixHQUF3QmxCLElBQTVCO0FBQ0g7O0FBRUQsUUFBSXlCLEtBQUssR0FBRyxLQUFLQyxNQUFqQjtBQUNBRCxJQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVd2QixDQUFYO0FBQ0F1QixJQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVd0QixDQUFYO0FBQ0FzQixJQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVdyQixDQUFYO0FBQ0FxQixJQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVdwQixDQUFYO0FBQ0EsU0FBS3NCLGdCQUFMLENBQXNCakQsTUFBdEI7QUFDSDs7O0VBekQ4Q2tEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlcjJEIGZyb20gJy4uLy4uLy4uLy4uL2Fzc2VtYmxlci0yZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZVNwcml0ZUFzc2VtYmxlciBleHRlbmRzIEFzc2VtYmxlcjJEIHtcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChzcHJpdGUpIHtcbiAgICAgICAgdGhpcy5wYWNrVG9EeW5hbWljQXRsYXMoc3ByaXRlLCBzcHJpdGUuX3Nwcml0ZUZyYW1lKTtcblxuICAgICAgICBpZiAoc3ByaXRlLl92ZXJ0c0RpcnR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVWcyhzcHJpdGUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0cyhzcHJpdGUpO1xuICAgICAgICAgICAgc3ByaXRlLl92ZXJ0c0RpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVVVnMgKHNwcml0ZSkge1xuICAgICAgICBsZXQgdXYgPSBzcHJpdGUuX3Nwcml0ZUZyYW1lLnV2O1xuICAgICAgICBsZXQgdXZPZmZzZXQgPSB0aGlzLnV2T2Zmc2V0O1xuICAgICAgICBsZXQgZmxvYXRzUGVyVmVydCA9IHRoaXMuZmxvYXRzUGVyVmVydDtcbiAgICAgICAgbGV0IHZlcnRzID0gdGhpcy5fcmVuZGVyRGF0YS52RGF0YXNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3JjT2Zmc2V0ID0gaSAqIDI7XG4gICAgICAgICAgICBsZXQgZHN0T2Zmc2V0ID0gZmxvYXRzUGVyVmVydCAqIGkgKyB1dk9mZnNldDtcbiAgICAgICAgICAgIHZlcnRzW2RzdE9mZnNldF0gPSB1dltzcmNPZmZzZXRdO1xuICAgICAgICAgICAgdmVydHNbZHN0T2Zmc2V0ICsgMV0gPSB1dltzcmNPZmZzZXQgKyAxXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRzIChzcHJpdGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBzcHJpdGUubm9kZSxcbiAgICAgICAgICAgIGN3ID0gbm9kZS53aWR0aCwgY2ggPSBub2RlLmhlaWdodCxcbiAgICAgICAgICAgIGFwcHggPSBub2RlLmFuY2hvclggKiBjdywgYXBweSA9IG5vZGUuYW5jaG9yWSAqIGNoLFxuICAgICAgICAgICAgbCwgYiwgciwgdDtcbiAgICAgICAgaWYgKHNwcml0ZS50cmltKSB7XG4gICAgICAgICAgICBsID0gLWFwcHg7XG4gICAgICAgICAgICBiID0gLWFwcHk7XG4gICAgICAgICAgICByID0gY3cgLSBhcHB4O1xuICAgICAgICAgICAgdCA9IGNoIC0gYXBweTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmcmFtZSA9IHNwcml0ZS5zcHJpdGVGcmFtZSxcbiAgICAgICAgICAgICAgICBvdyA9IGZyYW1lLl9vcmlnaW5hbFNpemUud2lkdGgsIG9oID0gZnJhbWUuX29yaWdpbmFsU2l6ZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgcncgPSBmcmFtZS5fcmVjdC53aWR0aCwgcmggPSBmcmFtZS5fcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gZnJhbWUuX29mZnNldCxcbiAgICAgICAgICAgICAgICBzY2FsZVggPSBjdyAvIG93LCBzY2FsZVkgPSBjaCAvIG9oO1xuICAgICAgICAgICAgbGV0IHRyaW1MZWZ0ID0gb2Zmc2V0LnggKyAob3cgLSBydykgLyAyO1xuICAgICAgICAgICAgbGV0IHRyaW1SaWdodCA9IG9mZnNldC54IC0gKG93IC0gcncpIC8gMjtcbiAgICAgICAgICAgIGxldCB0cmltQm90dG9tID0gb2Zmc2V0LnkgKyAob2ggLSByaCkgLyAyO1xuICAgICAgICAgICAgbGV0IHRyaW1Ub3AgPSBvZmZzZXQueSAtIChvaCAtIHJoKSAvIDI7XG4gICAgICAgICAgICBsID0gdHJpbUxlZnQgKiBzY2FsZVggLSBhcHB4O1xuICAgICAgICAgICAgYiA9IHRyaW1Cb3R0b20gKiBzY2FsZVkgLSBhcHB5O1xuICAgICAgICAgICAgciA9IGN3ICsgdHJpbVJpZ2h0ICogc2NhbGVYIC0gYXBweDtcbiAgICAgICAgICAgIHQgPSBjaCArIHRyaW1Ub3AgKiBzY2FsZVkgLSBhcHB5O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxvY2FsID0gdGhpcy5fbG9jYWw7XG4gICAgICAgIGxvY2FsWzBdID0gbDtcbiAgICAgICAgbG9jYWxbMV0gPSBiO1xuICAgICAgICBsb2NhbFsyXSA9IHI7XG4gICAgICAgIGxvY2FsWzNdID0gdDtcbiAgICAgICAgdGhpcy51cGRhdGVXb3JsZFZlcnRzKHNwcml0ZSk7XG4gICAgfVxufVxuIl19