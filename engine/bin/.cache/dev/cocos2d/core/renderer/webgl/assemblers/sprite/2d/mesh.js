
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/2d/mesh.js';
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

var MeshSpriteAssembler =
/*#__PURE__*/
function (_Assembler2D) {
  _inheritsLoose(MeshSpriteAssembler, _Assembler2D);

  function MeshSpriteAssembler() {
    return _Assembler2D.apply(this, arguments) || this;
  }

  var _proto = MeshSpriteAssembler.prototype;

  _proto.initData = function initData(sprite) {
    this._renderData.createFlexData(0, 4, 6, this.getVfmt());
  };

  _proto.updateRenderData = function updateRenderData(sprite) {
    this.packToDynamicAtlas(sprite, sprite._spriteFrame);
    var frame = sprite.spriteFrame;

    if (frame) {
      var vertices = frame.vertices;

      if (vertices) {
        this.verticesCount = vertices.x.length;
        this.indicesCount = vertices.triangles.length;
        var renderData = this._renderData;
        var flexBuffer = renderData._flexBuffer;

        if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
          this.updateColor(sprite);
          sprite._vertsDirty = true;
        }

        flexBuffer.used(this.verticesCount, this.indicesCount);
        this.updateIndices(vertices.triangles);

        if (sprite._vertsDirty) {
          this.updateUVs(sprite);
          this.updateVerts(sprite);
          this.updateWorldVerts(sprite);
          sprite._vertsDirty = false;
        }
      }
    }
  };

  _proto.updateIndices = function updateIndices(triangles) {
    this._renderData.iDatas[0].set(triangles);
  };

  _proto.updateUVs = function updateUVs(sprite) {
    var vertices = sprite.spriteFrame.vertices,
        u = vertices.nu,
        v = vertices.nv;
    var uvOffset = this.uvOffset;
    var floatsPerVert = this.floatsPerVert;
    var verts = this._renderData.vDatas[0];

    for (var i = 0; i < u.length; i++) {
      var dstOffset = floatsPerVert * i + uvOffset;
      verts[dstOffset] = u[i];
      verts[dstOffset + 1] = v[i];
    }
  };

  _proto.updateVerts = function updateVerts(sprite) {
    var node = sprite.node,
        contentWidth = Math.abs(node.width),
        contentHeight = Math.abs(node.height),
        appx = node.anchorX * contentWidth,
        appy = node.anchorY * contentHeight;
    var frame = sprite.spriteFrame,
        vertices = frame.vertices,
        x = vertices.x,
        y = vertices.y,
        originalWidth = frame._originalSize.width,
        originalHeight = frame._originalSize.height,
        rectWidth = frame._rect.width,
        rectHeight = frame._rect.height,
        offsetX = frame._offset.x,
        offsetY = frame._offset.y,
        trimX = offsetX + (originalWidth - rectWidth) / 2,
        trimY = offsetY + (originalHeight - rectHeight) / 2;
    var scaleX = contentWidth / (sprite.trim ? rectWidth : originalWidth),
        scaleY = contentHeight / (sprite.trim ? rectHeight : originalHeight);
    var local = this._local;

    if (!sprite.trim) {
      for (var i = 0, l = x.length; i < l; i++) {
        var offset = i * 2;
        local[offset] = x[i] * scaleX - appx;
        local[offset + 1] = (originalHeight - y[i]) * scaleY - appy;
      }
    } else {
      for (var _i = 0, _l = x.length; _i < _l; _i++) {
        var _offset = _i * 2;

        local[_offset] = (x[_i] - trimX) * scaleX - appx;
        local[_offset + 1] = (originalHeight - y[_i] - trimY) * scaleY - appy;
      }
    }
  };

  _proto.updateWorldVerts = function updateWorldVerts(sprite) {
    var node = sprite.node;
    var matrix = node._worldMatrix;
    var matrixm = matrix.m;
    var a = matrixm[0],
        b = matrixm[1],
        c = matrixm[4],
        d = matrixm[5],
        tx = matrixm[12],
        ty = matrixm[13];
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var i = 0, l = this.verticesCount; i < l; i++) {
      var lx = local[i * 2];
      var ly = local[i * 2 + 1];
      world[floatsPerVert * i] = lx * a + ly * c + tx;
      world[floatsPerVert * i + 1] = lx * b + ly * d + ty;
    }
  };

  return MeshSpriteAssembler;
}(_assembler2d["default"]);

exports["default"] = MeshSpriteAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc2guanMiXSwibmFtZXMiOlsiTWVzaFNwcml0ZUFzc2VtYmxlciIsImluaXREYXRhIiwic3ByaXRlIiwiX3JlbmRlckRhdGEiLCJjcmVhdGVGbGV4RGF0YSIsImdldFZmbXQiLCJ1cGRhdGVSZW5kZXJEYXRhIiwicGFja1RvRHluYW1pY0F0bGFzIiwiX3Nwcml0ZUZyYW1lIiwiZnJhbWUiLCJzcHJpdGVGcmFtZSIsInZlcnRpY2VzIiwidmVydGljZXNDb3VudCIsIngiLCJsZW5ndGgiLCJpbmRpY2VzQ291bnQiLCJ0cmlhbmdsZXMiLCJyZW5kZXJEYXRhIiwiZmxleEJ1ZmZlciIsIl9mbGV4QnVmZmVyIiwicmVzZXJ2ZSIsInVwZGF0ZUNvbG9yIiwiX3ZlcnRzRGlydHkiLCJ1c2VkIiwidXBkYXRlSW5kaWNlcyIsInVwZGF0ZVVWcyIsInVwZGF0ZVZlcnRzIiwidXBkYXRlV29ybGRWZXJ0cyIsImlEYXRhcyIsInNldCIsInUiLCJudSIsInYiLCJudiIsInV2T2Zmc2V0IiwiZmxvYXRzUGVyVmVydCIsInZlcnRzIiwidkRhdGFzIiwiaSIsImRzdE9mZnNldCIsIm5vZGUiLCJjb250ZW50V2lkdGgiLCJNYXRoIiwiYWJzIiwid2lkdGgiLCJjb250ZW50SGVpZ2h0IiwiaGVpZ2h0IiwiYXBweCIsImFuY2hvclgiLCJhcHB5IiwiYW5jaG9yWSIsInkiLCJvcmlnaW5hbFdpZHRoIiwiX29yaWdpbmFsU2l6ZSIsIm9yaWdpbmFsSGVpZ2h0IiwicmVjdFdpZHRoIiwiX3JlY3QiLCJyZWN0SGVpZ2h0Iiwib2Zmc2V0WCIsIl9vZmZzZXQiLCJvZmZzZXRZIiwidHJpbVgiLCJ0cmltWSIsInNjYWxlWCIsInRyaW0iLCJzY2FsZVkiLCJsb2NhbCIsIl9sb2NhbCIsImwiLCJvZmZzZXQiLCJtYXRyaXgiLCJfd29ybGRNYXRyaXgiLCJtYXRyaXhtIiwibSIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5Iiwid29ybGQiLCJseCIsImx5IiwiQXNzZW1ibGVyMkQiXSwibWFw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Q0FBTCxHQUFTUSxFQUFFLEdBQUdOLENBQWQsR0FBa0JFLEVBQTdDO0FBQ0FFLE1BQUFBLEtBQUssQ0FBQzdDLGFBQWEsR0FBR0csQ0FBaEIsR0FBb0IsQ0FBckIsQ0FBTCxHQUErQjJDLEVBQUUsR0FBR04sQ0FBTCxHQUFTTyxFQUFFLEdBQUdMLENBQWQsR0FBa0JFLEVBQWpEO0FBQ0g7QUFDSjs7O0VBN0c0Q0kiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyMkQgZnJvbSAnLi4vLi4vLi4vLi4vYXNzZW1ibGVyLTJkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzaFNwcml0ZUFzc2VtYmxlciBleHRlbmRzIEFzc2VtYmxlcjJEIHtcbiAgICBpbml0RGF0YSAoc3ByaXRlKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEuY3JlYXRlRmxleERhdGEoMCwgNCwgNiwgdGhpcy5nZXRWZm10KCkpO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChzcHJpdGUpIHtcbiAgICAgICAgdGhpcy5wYWNrVG9EeW5hbWljQXRsYXMoc3ByaXRlLCBzcHJpdGUuX3Nwcml0ZUZyYW1lKTtcblxuICAgICAgICBsZXQgZnJhbWUgPSBzcHJpdGUuc3ByaXRlRnJhbWU7XG4gICAgICAgIGlmIChmcmFtZSkge1xuICAgICAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgICAgICBpZiAodmVydGljZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzQ291bnQgPSB2ZXJ0aWNlcy54Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljZXNDb3VudCA9IHZlcnRpY2VzLnRyaWFuZ2xlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVuZGVyRGF0YSA9IHRoaXMuX3JlbmRlckRhdGE7XG4gICAgICAgICAgICAgICAgbGV0IGZsZXhCdWZmZXIgPSByZW5kZXJEYXRhLl9mbGV4QnVmZmVyO1xuICAgICAgICAgICAgICAgIGlmIChmbGV4QnVmZmVyLnJlc2VydmUodGhpcy52ZXJ0aWNlc0NvdW50LCB0aGlzLmluZGljZXNDb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xvcihzcHJpdGUpO1xuICAgICAgICAgICAgICAgICAgICBzcHJpdGUuX3ZlcnRzRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmbGV4QnVmZmVyLnVzZWQodGhpcy52ZXJ0aWNlc0NvdW50LCB0aGlzLmluZGljZXNDb3VudCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUluZGljZXModmVydGljZXMudHJpYW5nbGVzKTtcblxuICAgICAgICAgICAgICAgIGlmIChzcHJpdGUuX3ZlcnRzRGlydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVVnMoc3ByaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0cyhzcHJpdGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVmVydHMoc3ByaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlLl92ZXJ0c0RpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSW5kaWNlcyAodHJpYW5nbGVzKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEuaURhdGFzWzBdLnNldCh0cmlhbmdsZXMpO1xuICAgIH1cblxuICAgIHVwZGF0ZVVWcyAoc3ByaXRlKSB7XG4gICAgICAgIGxldCB2ZXJ0aWNlcyA9IHNwcml0ZS5zcHJpdGVGcmFtZS52ZXJ0aWNlcyxcbiAgICAgICAgICAgIHUgPSB2ZXJ0aWNlcy5udSxcbiAgICAgICAgICAgIHYgPSB2ZXJ0aWNlcy5udjtcblxuICAgICAgICBsZXQgdXZPZmZzZXQgPSB0aGlzLnV2T2Zmc2V0O1xuICAgICAgICBsZXQgZmxvYXRzUGVyVmVydCA9IHRoaXMuZmxvYXRzUGVyVmVydDtcbiAgICAgICAgbGV0IHZlcnRzID0gdGhpcy5fcmVuZGVyRGF0YS52RGF0YXNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRzdE9mZnNldCA9IGZsb2F0c1BlclZlcnQgKiBpICsgdXZPZmZzZXQ7XG4gICAgICAgICAgICB2ZXJ0c1tkc3RPZmZzZXRdID0gdVtpXTtcbiAgICAgICAgICAgIHZlcnRzW2RzdE9mZnNldCArIDFdID0gdltpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRzIChzcHJpdGUpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBzcHJpdGUubm9kZSxcbiAgICAgICAgICAgIGNvbnRlbnRXaWR0aCA9IE1hdGguYWJzKG5vZGUud2lkdGgpLFxuICAgICAgICAgICAgY29udGVudEhlaWdodCA9IE1hdGguYWJzKG5vZGUuaGVpZ2h0KSxcbiAgICAgICAgICAgIGFwcHggPSBub2RlLmFuY2hvclggKiBjb250ZW50V2lkdGgsXG4gICAgICAgICAgICBhcHB5ID0gbm9kZS5hbmNob3JZICogY29udGVudEhlaWdodDtcblxuICAgICAgICBsZXQgZnJhbWUgPSBzcHJpdGUuc3ByaXRlRnJhbWUsXG4gICAgICAgICAgICB2ZXJ0aWNlcyA9IGZyYW1lLnZlcnRpY2VzLFxuICAgICAgICAgICAgeCA9IHZlcnRpY2VzLngsXG4gICAgICAgICAgICB5ID0gdmVydGljZXMueSxcbiAgICAgICAgICAgIG9yaWdpbmFsV2lkdGggPSBmcmFtZS5fb3JpZ2luYWxTaXplLndpZHRoLFxuICAgICAgICAgICAgb3JpZ2luYWxIZWlnaHQgPSBmcmFtZS5fb3JpZ2luYWxTaXplLmhlaWdodCxcbiAgICAgICAgICAgIHJlY3RXaWR0aCA9IGZyYW1lLl9yZWN0LndpZHRoLFxuICAgICAgICAgICAgcmVjdEhlaWdodCA9IGZyYW1lLl9yZWN0LmhlaWdodCxcbiAgICAgICAgICAgIG9mZnNldFggPSBmcmFtZS5fb2Zmc2V0LngsXG4gICAgICAgICAgICBvZmZzZXRZID0gZnJhbWUuX29mZnNldC55LFxuICAgICAgICAgICAgdHJpbVggPSBvZmZzZXRYICsgKG9yaWdpbmFsV2lkdGggLSByZWN0V2lkdGgpIC8gMixcbiAgICAgICAgICAgIHRyaW1ZID0gb2Zmc2V0WSArIChvcmlnaW5hbEhlaWdodCAtIHJlY3RIZWlnaHQpIC8gMjtcblxuICAgICAgICBsZXQgc2NhbGVYID0gY29udGVudFdpZHRoIC8gKHNwcml0ZS50cmltID8gcmVjdFdpZHRoIDogb3JpZ2luYWxXaWR0aCksXG4gICAgICAgICAgICBzY2FsZVkgPSBjb250ZW50SGVpZ2h0IC8gKHNwcml0ZS50cmltID8gcmVjdEhlaWdodCA6IG9yaWdpbmFsSGVpZ2h0KTtcblxuICAgICAgICBsZXQgbG9jYWwgPSB0aGlzLl9sb2NhbDtcbiAgICAgICAgaWYgKCFzcHJpdGUudHJpbSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB4Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBpICogMjtcbiAgICAgICAgICAgICAgICBsb2NhbFtvZmZzZXRdID0gKHhbaV0pICogc2NhbGVYIC0gYXBweDtcbiAgICAgICAgICAgICAgICBsb2NhbFtvZmZzZXQgKyAxXSA9IChvcmlnaW5hbEhlaWdodCAtIHlbaV0pICogc2NhbGVZIC0gYXBweTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0geC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gaSAqIDI7XG4gICAgICAgICAgICAgICAgbG9jYWxbb2Zmc2V0XSA9ICh4W2ldIC0gdHJpbVgpICogc2NhbGVYIC0gYXBweDtcbiAgICAgICAgICAgICAgICBsb2NhbFtvZmZzZXQgKyAxXSA9IChvcmlnaW5hbEhlaWdodCAtIHlbaV0gLSB0cmltWSkgKiBzY2FsZVkgLSBhcHB5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlV29ybGRWZXJ0cyAoc3ByaXRlKSB7XG4gICAgICAgIGxldCBub2RlID0gc3ByaXRlLm5vZGU7XG4gICAgICAgIGxldCBtYXRyaXggPSBub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IG1hdHJpeG0gPSBtYXRyaXgubTtcbiAgICAgICAgbGV0IGEgPSBtYXRyaXhtWzBdLCBiID0gbWF0cml4bVsxXSwgYyA9IG1hdHJpeG1bNF0sIGQgPSBtYXRyaXhtWzVdLFxuICAgICAgICAgICAgdHggPSBtYXRyaXhtWzEyXSwgdHkgPSBtYXRyaXhtWzEzXTtcbiAgICAgICAgbGV0IGxvY2FsID0gdGhpcy5fbG9jYWw7XG4gICAgICAgIGxldCB3b3JsZCA9IHRoaXMuX3JlbmRlckRhdGEudkRhdGFzWzBdO1xuICAgICAgICBsZXQgZmxvYXRzUGVyVmVydCA9IHRoaXMuZmxvYXRzUGVyVmVydDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnZlcnRpY2VzQ291bnQ7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBseCA9IGxvY2FsW2kqMl07XG4gICAgICAgICAgICBsZXQgbHkgPSBsb2NhbFtpKjIgKyAxXTtcbiAgICAgICAgICAgIHdvcmxkW2Zsb2F0c1BlclZlcnQgKiBpXSA9IGx4ICogYSArIGx5ICogYyArIHR4O1xuICAgICAgICAgICAgd29ybGRbZmxvYXRzUGVyVmVydCAqIGkgKyAxXSA9IGx4ICogYiArIGx5ICogZCArIHR5O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19