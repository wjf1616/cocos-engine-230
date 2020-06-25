
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/graphics/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _inputAssembler = _interopRequireDefault(require("../../../../../renderer/core/input-assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var MeshBuffer = require('../../mesh-buffer');

var vfmtPosColor = require('../../vertex-format').vfmtPosColor;

var renderer = require('../../../index');

var Graphics = require('../../../../graphics/graphics');

var PointFlags = require('../../../../graphics/types').PointFlags;

var LineJoin = Graphics.LineJoin;
var LineCap = Graphics.LineCap;

var Earcut = require('./earcut');

var Impl = require('./impl');

var MAX_VERTEX = 65535;
var MAX_INDICE = MAX_VERTEX * 2;
var PI = Math.PI;
var min = Math.min;
var max = Math.max;
var ceil = Math.ceil;
var acos = Math.acos;
var cos = Math.cos;
var sin = Math.sin;
var atan2 = Math.atan2;

function curveDivs(r, arc, tol) {
  var da = acos(r / (r + tol)) * 2.0;
  return max(2, ceil(arc / da));
}

function clamp(v, min, max) {
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  }

  return v;
}

var GraphicsAssembler =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(GraphicsAssembler, _Assembler);

  function GraphicsAssembler(graphics) {
    var _this;

    _this = _Assembler.call(this, graphics) || this;
    _this._buffer = null;
    _this._buffers = [];
    _this._bufferOffset = 0;
    return _this;
  }

  var _proto = GraphicsAssembler.prototype;

  _proto.getVfmt = function getVfmt() {
    return vfmtPosColor;
  };

  _proto.requestBuffer = function requestBuffer() {
    var buffer = {
      indiceStart: 0,
      vertexStart: 0
    };
    var meshbuffer = new MeshBuffer(renderer._handle, vfmtPosColor);
    buffer.meshbuffer = meshbuffer;
    var ia = new _inputAssembler["default"](meshbuffer._vb, meshbuffer._ib);
    buffer.ia = ia;

    this._buffers.push(buffer);

    return buffer;
  };

  _proto.getBuffers = function getBuffers() {
    if (this._buffers.length === 0) {
      this.requestBuffer();
    }

    return this._buffers;
  };

  _proto.clear = function clear(clean) {
    this._bufferOffset = 0;
    var datas = this._buffers;

    if (clean) {
      for (var i = 0, l = datas.length; i < l; i++) {
        var data = datas[i];
        data.meshbuffer.destroy();
        data.meshbuffer = null;
      }

      datas.length = 0;
    } else {
      for (var _i = 0, _l = datas.length; _i < _l; _i++) {
        var _data = datas[_i];
        _data.indiceStart = 0;
        _data.vertexStart = 0;
        var meshbuffer = _data.meshbuffer;
        meshbuffer.reset();
      }
    }
  };

  _proto.fillBuffers = function fillBuffers(graphics, renderer) {
    renderer._flush();

    renderer.node = graphics.node;
    renderer.material = graphics._materials[0];
    var buffers = this.getBuffers();

    for (var index = 0, length = buffers.length; index < length; index++) {
      var buffer = buffers[index];
      var meshbuffer = buffer.meshbuffer;
      buffer.ia._count = buffer.indiceStart;

      renderer._flushIA(buffer.ia);

      meshbuffer.uploadData();
    }
  };

  _proto.genBuffer = function genBuffer(graphics, cverts) {
    var buffers = this.getBuffers();
    var buffer = buffers[this._bufferOffset];
    var meshbuffer = buffer.meshbuffer;
    var maxVertsCount = buffer.vertexStart + cverts;

    if (maxVertsCount > MAX_VERTEX || maxVertsCount * 3 > MAX_INDICE) {
      ++this._bufferOffset;
      maxVertsCount = cverts;

      if (this._bufferOffset < buffers.length) {
        buffer = buffers[this._bufferOffset];
      } else {
        buffer = this.requestBuffer(graphics);
        buffers[this._bufferOffset] = buffer;
      }

      meshbuffer = buffer.meshbuffer;
    }

    if (maxVertsCount > meshbuffer.vertexOffset) {
      meshbuffer.requestStatic(cverts, cverts * 3);
    }

    this._buffer = buffer;
    return buffer;
  };

  _proto.stroke = function stroke(graphics) {
    this._curColor = graphics._strokeColor._val;

    this._flattenPaths(graphics._impl);

    this._expandStroke(graphics);

    graphics._impl._updatePathOffset = true;
  };

  _proto.fill = function fill(graphics) {
    this._curColor = graphics._fillColor._val;

    this._expandFill(graphics);

    graphics._impl._updatePathOffset = true;
  };

  _proto._expandStroke = function _expandStroke(graphics) {
    var w = graphics.lineWidth * 0.5,
        lineCap = graphics.lineCap,
        lineJoin = graphics.lineJoin,
        miterLimit = graphics.miterLimit;
    var impl = graphics._impl;
    var ncap = curveDivs(w, PI, impl._tessTol);

    this._calculateJoins(impl, w, lineJoin, miterLimit);

    var paths = impl._paths; // Calculate max vertex usage.

    var cverts = 0;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pointsLength = path.points.length;
      if (lineJoin === LineJoin.ROUND) cverts += (pointsLength + path.nbevel * (ncap + 2) + 1) * 2; // plus one for loop
      else cverts += (pointsLength + path.nbevel * 5 + 1) * 2; // plus one for loop

      if (!path.closed) {
        // space for caps
        if (lineCap === LineCap.ROUND) {
          cverts += (ncap * 2 + 2) * 2;
        } else {
          cverts += (3 + 3) * 2;
        }
      }
    }

    var buffer = this.genBuffer(graphics, cverts),
        meshbuffer = buffer.meshbuffer,
        vData = meshbuffer._vData,
        iData = meshbuffer._iData;

    for (var _i2 = impl._pathOffset, _l2 = impl._pathLength; _i2 < _l2; _i2++) {
      var _path = paths[_i2];
      var pts = _path.points;
      var _pointsLength = pts.length;
      var offset = buffer.vertexStart;
      var p0 = void 0,
          p1 = void 0;
      var start = void 0,
          end = void 0,
          loop = void 0;
      loop = _path.closed;

      if (loop) {
        // Looping
        p0 = pts[_pointsLength - 1];
        p1 = pts[0];
        start = 0;
        end = _pointsLength;
      } else {
        // Add cap
        p0 = pts[0];
        p1 = pts[1];
        start = 1;
        end = _pointsLength - 1;
      }

      if (!loop) {
        // Add cap
        var dPos = p1.sub(p0);
        dPos.normalizeSelf();
        var dx = dPos.x;
        var dy = dPos.y;
        if (lineCap === LineCap.BUTT) this._buttCapStart(p0, dx, dy, w, 0);else if (lineCap === LineCap.SQUARE) this._buttCapStart(p0, dx, dy, w, w);else if (lineCap === LineCap.ROUND) this._roundCapStart(p0, dx, dy, w, ncap);
      }

      for (var j = start; j < end; ++j) {
        if (lineJoin === LineJoin.ROUND) {
          this._roundJoin(p0, p1, w, w, ncap);
        } else if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
          this._bevelJoin(p0, p1, w, w);
        } else {
          this._vset(p1.x + p1.dmx * w, p1.y + p1.dmy * w);

          this._vset(p1.x - p1.dmx * w, p1.y - p1.dmy * w);
        }

        p0 = p1;
        p1 = pts[j + 1];
      }

      if (loop) {
        // Loop it
        var vDataoOfset = offset * 3;

        this._vset(vData[vDataoOfset], vData[vDataoOfset + 1]);

        this._vset(vData[vDataoOfset + 3], vData[vDataoOfset + 4]);
      } else {
        // Add cap
        var _dPos = p1.sub(p0);

        _dPos.normalizeSelf();

        var _dx = _dPos.x;
        var _dy = _dPos.y;
        if (lineCap === LineCap.BUTT) this._buttCapEnd(p1, _dx, _dy, w, 0);else if (lineCap === LineCap.SQUARE) this._buttCapEnd(p1, _dx, _dy, w, w);else if (lineCap === LineCap.ROUND) this._roundCapEnd(p1, _dx, _dy, w, ncap);
      } // stroke indices


      var indicesOffset = buffer.indiceStart;

      for (var _start = offset + 2, _end = buffer.vertexStart; _start < _end; _start++) {
        iData[indicesOffset++] = _start - 2;
        iData[indicesOffset++] = _start - 1;
        iData[indicesOffset++] = _start;
      }

      buffer.indiceStart = indicesOffset;
    }
  };

  _proto._expandFill = function _expandFill(graphics) {
    var impl = graphics._impl;
    var paths = impl._paths; // Calculate max vertex usage.

    var cverts = 0;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pointsLength = path.points.length;
      cverts += pointsLength;
    }

    var buffer = this.genBuffer(graphics, cverts),
        meshbuffer = buffer.meshbuffer,
        vData = meshbuffer._vData,
        iData = meshbuffer._iData;

    for (var _i3 = impl._pathOffset, _l3 = impl._pathLength; _i3 < _l3; _i3++) {
      var _path2 = paths[_i3];
      var pts = _path2.points;
      var _pointsLength2 = pts.length;

      if (_pointsLength2 === 0) {
        continue;
      } // Calculate shape vertices.


      var offset = buffer.vertexStart;

      for (var j = 0; j < _pointsLength2; ++j) {
        this._vset(pts[j].x, pts[j].y);
      }

      var indicesOffset = buffer.indiceStart;

      if (_path2.complex) {
        var earcutData = [];

        for (var _j = offset, end = buffer.vertexStart; _j < end; _j++) {
          var vDataOffset = _j * 3;
          earcutData.push(vData[vDataOffset]);
          earcutData.push(vData[vDataOffset + 1]);
        }

        var newIndices = Earcut(earcutData, null, 2);

        if (!newIndices || newIndices.length === 0) {
          continue;
        }

        for (var _j2 = 0, nIndices = newIndices.length; _j2 < nIndices; _j2++) {
          iData[indicesOffset++] = newIndices[_j2] + offset;
        }
      } else {
        var first = offset;

        for (var start = offset + 2, _end2 = buffer.vertexStart; start < _end2; start++) {
          iData[indicesOffset++] = first;
          iData[indicesOffset++] = start - 1;
          iData[indicesOffset++] = start;
        }
      }

      buffer.indiceStart = indicesOffset;
    }
  };

  _proto._calculateJoins = function _calculateJoins(impl, w, lineJoin, miterLimit) {
    var iw = 0.0;

    if (w > 0.0) {
      iw = 1 / w;
    } // Calculate which joins needs extra vertices to append, and gather vertex count.


    var paths = impl._paths;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pts = path.points;
      var ptsLength = pts.length;
      var p0 = pts[ptsLength - 1];
      var p1 = pts[0];
      var nleft = 0;
      path.nbevel = 0;

      for (var j = 0; j < ptsLength; j++) {
        var dmr2 = void 0,
            cross = void 0,
            limit = void 0; // perp normals

        var dlx0 = p0.dy;
        var dly0 = -p0.dx;
        var dlx1 = p1.dy;
        var dly1 = -p1.dx; // Calculate extrusions

        p1.dmx = (dlx0 + dlx1) * 0.5;
        p1.dmy = (dly0 + dly1) * 0.5;
        dmr2 = p1.dmx * p1.dmx + p1.dmy * p1.dmy;

        if (dmr2 > 0.000001) {
          var scale = 1 / dmr2;

          if (scale > 600) {
            scale = 600;
          }

          p1.dmx *= scale;
          p1.dmy *= scale;
        } // Keep track of left turns.


        cross = p1.dx * p0.dy - p0.dx * p1.dy;

        if (cross > 0) {
          nleft++;
          p1.flags |= PointFlags.PT_LEFT;
        } // Calculate if we should use bevel or miter for inner join.


        limit = max(11, min(p0.len, p1.len) * iw);

        if (dmr2 * limit * limit < 1) {
          p1.flags |= PointFlags.PT_INNERBEVEL;
        } // Check to see if the corner needs to be beveled.


        if (p1.flags & PointFlags.PT_CORNER) {
          if (dmr2 * miterLimit * miterLimit < 1 || lineJoin === LineJoin.BEVEL || lineJoin === LineJoin.ROUND) {
            p1.flags |= PointFlags.PT_BEVEL;
          }
        }

        if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
          path.nbevel++;
        }

        p0 = p1;
        p1 = pts[j + 1];
      }
    }
  };

  _proto._flattenPaths = function _flattenPaths(impl) {
    var paths = impl._paths;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pts = path.points;
      var p0 = pts[pts.length - 1];
      var p1 = pts[0];

      if (pts.length > 2 && p0.equals(p1)) {
        path.closed = true;
        pts.pop();
        p0 = pts[pts.length - 1];
      }

      for (var j = 0, size = pts.length; j < size; j++) {
        // Calculate segment direction and length
        var dPos = p1.sub(p0);
        p0.len = dPos.mag();
        if (dPos.x || dPos.y) dPos.normalizeSelf();
        p0.dx = dPos.x;
        p0.dy = dPos.y; // Advance

        p0 = p1;
        p1 = pts[j + 1];
      }
    }
  };

  _proto._chooseBevel = function _chooseBevel(bevel, p0, p1, w) {
    var x = p1.x;
    var y = p1.y;
    var x0, y0, x1, y1;

    if (bevel !== 0) {
      x0 = x + p0.dy * w;
      y0 = y - p0.dx * w;
      x1 = x + p1.dy * w;
      y1 = y - p1.dx * w;
    } else {
      x0 = x1 = x + p1.dmx * w;
      y0 = y1 = y + p1.dmy * w;
    }

    return [x0, y0, x1, y1];
  };

  _proto._buttCapStart = function _buttCapStart(p, dx, dy, w, d) {
    var px = p.x - dx * d;
    var py = p.y - dy * d;
    var dlx = dy;
    var dly = -dx;

    this._vset(px + dlx * w, py + dly * w);

    this._vset(px - dlx * w, py - dly * w);
  };

  _proto._buttCapEnd = function _buttCapEnd(p, dx, dy, w, d) {
    var px = p.x + dx * d;
    var py = p.y + dy * d;
    var dlx = dy;
    var dly = -dx;

    this._vset(px + dlx * w, py + dly * w);

    this._vset(px - dlx * w, py - dly * w);
  };

  _proto._roundCapStart = function _roundCapStart(p, dx, dy, w, ncap) {
    var px = p.x;
    var py = p.y;
    var dlx = dy;
    var dly = -dx;

    for (var i = 0; i < ncap; i++) {
      var a = i / (ncap - 1) * PI;
      var ax = cos(a) * w,
          ay = sin(a) * w;

      this._vset(px - dlx * ax - dx * ay, py - dly * ax - dy * ay);

      this._vset(px, py);
    }

    this._vset(px + dlx * w, py + dly * w);

    this._vset(px - dlx * w, py - dly * w);
  };

  _proto._roundCapEnd = function _roundCapEnd(p, dx, dy, w, ncap) {
    var px = p.x;
    var py = p.y;
    var dlx = dy;
    var dly = -dx;

    this._vset(px + dlx * w, py + dly * w);

    this._vset(px - dlx * w, py - dly * w);

    for (var i = 0; i < ncap; i++) {
      var a = i / (ncap - 1) * PI;
      var ax = cos(a) * w,
          ay = sin(a) * w;

      this._vset(px, py);

      this._vset(px - dlx * ax + dx * ay, py - dly * ax + dy * ay);
    }
  };

  _proto._roundJoin = function _roundJoin(p0, p1, lw, rw, ncap) {
    var dlx0 = p0.dy;
    var dly0 = -p0.dx;
    var dlx1 = p1.dy;
    var dly1 = -p1.dx;
    var p1x = p1.x;
    var p1y = p1.y;

    if ((p1.flags & PointFlags.PT_LEFT) !== 0) {
      var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);

      var lx0 = out[0];
      var ly0 = out[1];
      var lx1 = out[2];
      var ly1 = out[3];
      var a0 = atan2(-dly0, -dlx0);
      var a1 = atan2(-dly1, -dlx1);
      if (a1 > a0) a1 -= PI * 2;

      this._vset(lx0, ly0);

      this._vset(p1x - dlx0 * rw, p1.y - dly0 * rw);

      var n = clamp(ceil((a0 - a1) / PI) * ncap, 2, ncap);

      for (var i = 0; i < n; i++) {
        var u = i / (n - 1);
        var a = a0 + u * (a1 - a0);
        var rx = p1x + cos(a) * rw;
        var ry = p1y + sin(a) * rw;

        this._vset(p1x, p1y);

        this._vset(rx, ry);
      }

      this._vset(lx1, ly1);

      this._vset(p1x - dlx1 * rw, p1y - dly1 * rw);
    } else {
      var _out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);

      var rx0 = _out[0];
      var ry0 = _out[1];
      var rx1 = _out[2];
      var ry1 = _out[3];

      var _a = atan2(dly0, dlx0);

      var _a2 = atan2(dly1, dlx1);

      if (_a2 < _a) _a2 += PI * 2;

      this._vset(p1x + dlx0 * rw, p1y + dly0 * rw);

      this._vset(rx0, ry0);

      var _n = clamp(ceil((_a2 - _a) / PI) * ncap, 2, ncap);

      for (var _i4 = 0; _i4 < _n; _i4++) {
        var _u = _i4 / (_n - 1);

        var _a3 = _a + _u * (_a2 - _a);

        var lx = p1x + cos(_a3) * lw;
        var ly = p1y + sin(_a3) * lw;

        this._vset(lx, ly);

        this._vset(p1x, p1y);
      }

      this._vset(p1x + dlx1 * rw, p1y + dly1 * rw);

      this._vset(rx1, ry1);
    }
  };

  _proto._bevelJoin = function _bevelJoin(p0, p1, lw, rw) {
    var rx0, ry0, rx1, ry1;
    var lx0, ly0, lx1, ly1;
    var dlx0 = p0.dy;
    var dly0 = -p0.dx;
    var dlx1 = p1.dy;
    var dly1 = -p1.dx;

    if (p1.flags & PointFlags.PT_LEFT) {
      var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);

      lx0 = out[0];
      ly0 = out[1];
      lx1 = out[2];
      ly1 = out[3];

      this._vset(lx0, ly0);

      this._vset(p1.x - dlx0 * rw, p1.y - dly0 * rw);

      this._vset(lx1, ly1);

      this._vset(p1.x - dlx1 * rw, p1.y - dly1 * rw);
    } else {
      var _out2 = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);

      rx0 = _out2[0];
      ry0 = _out2[1];
      rx1 = _out2[2];
      ry1 = _out2[3];

      this._vset(p1.x + dlx0 * lw, p1.y + dly0 * lw);

      this._vset(rx0, ry0);

      this._vset(p1.x + dlx1 * lw, p1.y + dly1 * lw);

      this._vset(rx1, ry1);
    }
  };

  _proto._vset = function _vset(x, y) {
    var buffer = this._buffer;
    var meshbuffer = buffer.meshbuffer;
    var dataOffset = buffer.vertexStart * 3;
    var vData = meshbuffer._vData;
    var uintVData = meshbuffer._uintVData;
    vData[dataOffset] = x;
    vData[dataOffset + 1] = y;
    uintVData[dataOffset + 2] = this._curColor;
    buffer.vertexStart++;
    meshbuffer._dirty = true;
  };

  return GraphicsAssembler;
}(_assembler["default"]);

exports["default"] = GraphicsAssembler;

_assembler["default"].register(cc.Graphics, GraphicsAssembler);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIk1lc2hCdWZmZXIiLCJyZXF1aXJlIiwidmZtdFBvc0NvbG9yIiwicmVuZGVyZXIiLCJHcmFwaGljcyIsIlBvaW50RmxhZ3MiLCJMaW5lSm9pbiIsIkxpbmVDYXAiLCJFYXJjdXQiLCJJbXBsIiwiTUFYX1ZFUlRFWCIsIk1BWF9JTkRJQ0UiLCJQSSIsIk1hdGgiLCJtaW4iLCJtYXgiLCJjZWlsIiwiYWNvcyIsImNvcyIsInNpbiIsImF0YW4yIiwiY3VydmVEaXZzIiwiciIsImFyYyIsInRvbCIsImRhIiwiY2xhbXAiLCJ2IiwiR3JhcGhpY3NBc3NlbWJsZXIiLCJncmFwaGljcyIsIl9idWZmZXIiLCJfYnVmZmVycyIsIl9idWZmZXJPZmZzZXQiLCJnZXRWZm10IiwicmVxdWVzdEJ1ZmZlciIsImJ1ZmZlciIsImluZGljZVN0YXJ0IiwidmVydGV4U3RhcnQiLCJtZXNoYnVmZmVyIiwiX2hhbmRsZSIsImlhIiwiSW5wdXRBc3NlbWJsZXIiLCJfdmIiLCJfaWIiLCJwdXNoIiwiZ2V0QnVmZmVycyIsImxlbmd0aCIsImNsZWFyIiwiY2xlYW4iLCJkYXRhcyIsImkiLCJsIiwiZGF0YSIsImRlc3Ryb3kiLCJyZXNldCIsImZpbGxCdWZmZXJzIiwiX2ZsdXNoIiwibm9kZSIsIm1hdGVyaWFsIiwiX21hdGVyaWFscyIsImJ1ZmZlcnMiLCJpbmRleCIsIl9jb3VudCIsIl9mbHVzaElBIiwidXBsb2FkRGF0YSIsImdlbkJ1ZmZlciIsImN2ZXJ0cyIsIm1heFZlcnRzQ291bnQiLCJ2ZXJ0ZXhPZmZzZXQiLCJyZXF1ZXN0U3RhdGljIiwic3Ryb2tlIiwiX2N1ckNvbG9yIiwiX3N0cm9rZUNvbG9yIiwiX3ZhbCIsIl9mbGF0dGVuUGF0aHMiLCJfaW1wbCIsIl9leHBhbmRTdHJva2UiLCJfdXBkYXRlUGF0aE9mZnNldCIsImZpbGwiLCJfZmlsbENvbG9yIiwiX2V4cGFuZEZpbGwiLCJ3IiwibGluZVdpZHRoIiwibGluZUNhcCIsImxpbmVKb2luIiwibWl0ZXJMaW1pdCIsImltcGwiLCJuY2FwIiwiX3Rlc3NUb2wiLCJfY2FsY3VsYXRlSm9pbnMiLCJwYXRocyIsIl9wYXRocyIsIl9wYXRoT2Zmc2V0IiwiX3BhdGhMZW5ndGgiLCJwYXRoIiwicG9pbnRzTGVuZ3RoIiwicG9pbnRzIiwiUk9VTkQiLCJuYmV2ZWwiLCJjbG9zZWQiLCJ2RGF0YSIsIl92RGF0YSIsImlEYXRhIiwiX2lEYXRhIiwicHRzIiwib2Zmc2V0IiwicDAiLCJwMSIsInN0YXJ0IiwiZW5kIiwibG9vcCIsImRQb3MiLCJzdWIiLCJub3JtYWxpemVTZWxmIiwiZHgiLCJ4IiwiZHkiLCJ5IiwiQlVUVCIsIl9idXR0Q2FwU3RhcnQiLCJTUVVBUkUiLCJfcm91bmRDYXBTdGFydCIsImoiLCJfcm91bmRKb2luIiwiZmxhZ3MiLCJQVF9CRVZFTCIsIlBUX0lOTkVSQkVWRUwiLCJfYmV2ZWxKb2luIiwiX3ZzZXQiLCJkbXgiLCJkbXkiLCJ2RGF0YW9PZnNldCIsIl9idXR0Q2FwRW5kIiwiX3JvdW5kQ2FwRW5kIiwiaW5kaWNlc09mZnNldCIsImNvbXBsZXgiLCJlYXJjdXREYXRhIiwidkRhdGFPZmZzZXQiLCJuZXdJbmRpY2VzIiwibkluZGljZXMiLCJmaXJzdCIsIml3IiwicHRzTGVuZ3RoIiwibmxlZnQiLCJkbXIyIiwiY3Jvc3MiLCJsaW1pdCIsImRseDAiLCJkbHkwIiwiZGx4MSIsImRseTEiLCJzY2FsZSIsIlBUX0xFRlQiLCJsZW4iLCJQVF9DT1JORVIiLCJCRVZFTCIsImVxdWFscyIsInBvcCIsInNpemUiLCJtYWciLCJfY2hvb3NlQmV2ZWwiLCJiZXZlbCIsIngwIiwieTAiLCJ4MSIsInkxIiwicCIsImQiLCJweCIsInB5IiwiZGx4IiwiZGx5IiwiYSIsImF4IiwiYXkiLCJsdyIsInJ3IiwicDF4IiwicDF5Iiwib3V0IiwibHgwIiwibHkwIiwibHgxIiwibHkxIiwiYTAiLCJhMSIsIm4iLCJ1IiwicngiLCJyeSIsInJ4MCIsInJ5MCIsInJ4MSIsInJ5MSIsImx4IiwibHkiLCJkYXRhT2Zmc2V0IiwidWludFZEYXRhIiwiX3VpbnRWRGF0YSIsIl9kaXJ0eSIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIiwiY2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBRUE7Ozs7OztBQUVBLElBQU1BLFVBQVUsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQTFCOztBQUNBLElBQU1DLFlBQVksR0FBR0QsT0FBTyxDQUFDLHFCQUFELENBQVAsQ0FBK0JDLFlBQXBEOztBQUNBLElBQU1DLFFBQVEsR0FBR0YsT0FBTyxDQUFDLGdCQUFELENBQXhCOztBQUVBLElBQU1HLFFBQVEsR0FBR0gsT0FBTyxDQUFDLCtCQUFELENBQXhCOztBQUNBLElBQU1JLFVBQVUsR0FBR0osT0FBTyxDQUFDLDRCQUFELENBQVAsQ0FBc0NJLFVBQXpEOztBQUNBLElBQU1DLFFBQVEsR0FBR0YsUUFBUSxDQUFDRSxRQUExQjtBQUNBLElBQU1DLE9BQU8sR0FBR0gsUUFBUSxDQUFDRyxPQUF6Qjs7QUFDQSxJQUFNQyxNQUFNLEdBQUdQLE9BQU8sQ0FBQyxVQUFELENBQXRCOztBQUNBLElBQU1RLElBQUksR0FBR1IsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBRUEsSUFBTVMsVUFBVSxHQUFHLEtBQW5CO0FBQ0EsSUFBTUMsVUFBVSxHQUFHRCxVQUFVLEdBQUcsQ0FBaEM7QUFFQSxJQUFNRSxFQUFFLEdBQVFDLElBQUksQ0FBQ0QsRUFBckI7QUFDQSxJQUFNRSxHQUFHLEdBQU9ELElBQUksQ0FBQ0MsR0FBckI7QUFDQSxJQUFNQyxHQUFHLEdBQU9GLElBQUksQ0FBQ0UsR0FBckI7QUFDQSxJQUFNQyxJQUFJLEdBQU1ILElBQUksQ0FBQ0csSUFBckI7QUFDQSxJQUFNQyxJQUFJLEdBQU1KLElBQUksQ0FBQ0ksSUFBckI7QUFDQSxJQUFNQyxHQUFHLEdBQU9MLElBQUksQ0FBQ0ssR0FBckI7QUFDQSxJQUFNQyxHQUFHLEdBQU9OLElBQUksQ0FBQ00sR0FBckI7QUFDQSxJQUFNQyxLQUFLLEdBQUtQLElB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R0FBRzBCLEVBQXpCLEVBQTZCcEUsRUFBRSxDQUFDVSxDQUFILEdBQU9pQyxJQUFJLEdBQUd5QixFQUEzQzs7QUFDQSxXQUFLL0MsS0FBTCxDQUFXZ0UsR0FBWCxFQUFnQkMsR0FBaEI7QUFDSDtBQUNKOztTQUVEakUsUUFBQSxlQUFPYixDQUFQLEVBQVVFLENBQVYsRUFBYTtBQUNULFFBQUlsRixNQUFNLEdBQUcsS0FBS0wsT0FBbEI7QUFDQSxRQUFJUSxVQUFVLEdBQUdILE1BQU0sQ0FBQ0csVUFBeEI7QUFDQSxRQUFJOEosVUFBVSxHQUFHakssTUFBTSxDQUFDRSxXQUFQLEdBQXFCLENBQXRDO0FBRUEsUUFBSStELEtBQUssR0FBRzlELFVBQVUsQ0FBQytELE1BQXZCO0FBQ0EsUUFBSWdHLFNBQVMsR0FBRy9KLFVBQVUsQ0FBQ2dLLFVBQTNCO0FBRUFsRyxJQUFBQSxLQUFLLENBQUNnRyxVQUFELENBQUwsR0FBb0JqRixDQUFwQjtBQUNBZixJQUFBQSxLQUFLLENBQUNnRyxVQUFVLEdBQUMsQ0FBWixDQUFMLEdBQXNCL0UsQ0FBdEI7QUFDQWdGLElBQUFBLFNBQVMsQ0FBQ0QsVUFBVSxHQUFDLENBQVosQ0FBVCxHQUEwQixLQUFLN0gsU0FBL0I7QUFFQXBDLElBQUFBLE1BQU0sQ0FBQ0UsV0FBUDtBQUNBQyxJQUFBQSxVQUFVLENBQUNpSyxNQUFYLEdBQW9CLElBQXBCO0FBQ0g7OztFQTlsQjBDQzs7OztBQWltQi9DQSxzQkFBVUMsUUFBVixDQUFtQkMsRUFBRSxDQUFDdE0sUUFBdEIsRUFBZ0N3QixpQkFBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uLy4uL2Fzc2VtYmxlcic7XG5cbmltcG9ydCBJbnB1dEFzc2VtYmxlciBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZW5kZXJlci9jb3JlL2lucHV0LWFzc2VtYmxlcic7XG5cbmNvbnN0IE1lc2hCdWZmZXIgPSByZXF1aXJlKCcuLi8uLi9tZXNoLWJ1ZmZlcicpO1xuY29uc3QgdmZtdFBvc0NvbG9yID0gcmVxdWlyZSgnLi4vLi4vdmVydGV4LWZvcm1hdCcpLnZmbXRQb3NDb2xvcjtcbmNvbnN0IHJlbmRlcmVyID0gcmVxdWlyZSgnLi4vLi4vLi4vaW5kZXgnKTtcblxuY29uc3QgR3JhcGhpY3MgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi9ncmFwaGljcy9ncmFwaGljcycpO1xuY29uc3QgUG9pbnRGbGFncyA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uL2dyYXBoaWNzL3R5cGVzJykuUG9pbnRGbGFncztcbmNvbnN0IExpbmVKb2luID0gR3JhcGhpY3MuTGluZUpvaW47XG5jb25zdCBMaW5lQ2FwID0gR3JhcGhpY3MuTGluZUNhcDtcbmNvbnN0IEVhcmN1dCA9IHJlcXVpcmUoJy4vZWFyY3V0Jyk7XG5jb25zdCBJbXBsID0gcmVxdWlyZSgnLi9pbXBsJyk7XG5cbmNvbnN0IE1BWF9WRVJURVggPSA2NTUzNTtcbmNvbnN0IE1BWF9JTkRJQ0UgPSBNQVhfVkVSVEVYICogMjtcblxuY29uc3QgUEkgICAgICA9IE1hdGguUEk7XG5jb25zdCBtaW4gICAgID0gTWF0aC5taW47XG5jb25zdCBtYXggICAgID0gTWF0aC5tYXg7XG5jb25zdCBjZWlsICAgID0gTWF0aC5jZWlsO1xuY29uc3QgYWNvcyAgICA9IE1hdGguYWNvcztcbmNvbnN0IGNvcyAgICAgPSBNYXRoLmNvcztcbmNvbnN0IHNpbiAgICAgPSBNYXRoLnNpbjtcbmNvbnN0IGF0YW4yICAgPSBNYXRoLmF0YW4yO1xuXG5mdW5jdGlvbiBjdXJ2ZURpdnMgKHIsIGFyYywgdG9sKSB7XG4gICAgbGV0IGRhID0gYWNvcyhyIC8gKHIgKyB0b2wpKSAqIDIuMDtcbiAgICByZXR1cm4gbWF4KDIsIGNlaWwoYXJjIC8gZGEpKTtcbn1cblxuZnVuY3Rpb24gY2xhbXAgKHYsIG1pbiwgbWF4KSB7XG4gICAgaWYgKHYgPCBtaW4pIHtcbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgZWxzZSBpZiAodiA+IG1heCkge1xuICAgICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICByZXR1cm4gdjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpY3NBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIge1xuICAgIGNvbnN0cnVjdG9yIChncmFwaGljcykge1xuICAgICAgICBzdXBlcihncmFwaGljcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9idWZmZXJzID0gW107XG4gICAgICAgIHRoaXMuX2J1ZmZlck9mZnNldCA9IDA7XG4gICAgfVxuXG4gICAgZ2V0VmZtdCAoKSB7XG4gICAgICAgIHJldHVybiB2Zm10UG9zQ29sb3I7XG4gICAgfVxuXG4gICAgcmVxdWVzdEJ1ZmZlciAoKSB7XG4gICAgICAgIGxldCBidWZmZXIgPSB7XG4gICAgICAgICAgICBpbmRpY2VTdGFydDogMCxcbiAgICAgICAgICAgIHZlcnRleFN0YXJ0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IG1lc2hidWZmZXIgPSBuZXcgTWVzaEJ1ZmZlcihyZW5kZXJlci5faGFuZGxlLCB2Zm10UG9zQ29sb3IpO1xuICAgICAgICBidWZmZXIubWVzaGJ1ZmZlciA9IG1lc2hidWZmZXI7XG5cbiAgICAgICAgbGV0IGlhID0gbmV3IElucHV0QXNzZW1ibGVyKG1lc2hidWZmZXIuX3ZiLCBtZXNoYnVmZmVyLl9pYik7XG4gICAgICAgIGJ1ZmZlci5pYSA9IGlhO1xuXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMucHVzaChidWZmZXIpO1xuXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgfVxuXG4gICAgZ2V0QnVmZmVycyAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9idWZmZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QnVmZmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVycztcbiAgICB9XG5cbiAgICBjbGVhciAoY2xlYW4pIHtcbiAgICAgICAgdGhpcy5fYnVmZmVyT2Zmc2V0ID0gMDtcblxuICAgICAgICBsZXQgZGF0YXMgPSB0aGlzLl9idWZmZXJzO1xuICAgICAgICBpZiAoY2xlYW4pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBkYXRhc1tpXTtcbiAgICAgICAgICAgICAgICBkYXRhLm1lc2hidWZmZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIGRhdGEubWVzaGJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhcy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGRhdGFzW2ldO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5pbmRpY2VTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgZGF0YS52ZXJ0ZXhTdGFydCA9IDA7XG5cbiAgICAgICAgICAgICAgICBsZXQgbWVzaGJ1ZmZlciA9IGRhdGEubWVzaGJ1ZmZlcjtcbiAgICAgICAgICAgICAgICBtZXNoYnVmZmVyLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsQnVmZmVycyAoZ3JhcGhpY3MsIHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLl9mbHVzaCgpO1xuXG4gICAgICAgIHJlbmRlcmVyLm5vZGUgPSBncmFwaGljcy5ub2RlO1xuICAgICAgICByZW5kZXJlci5tYXRlcmlhbCA9IGdyYXBoaWNzLl9tYXRlcmlhbHNbMF07XG5cbiAgICAgICAgbGV0IGJ1ZmZlcnMgPSB0aGlzLmdldEJ1ZmZlcnMoKTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBsZW5ndGggPSBidWZmZXJzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBidWZmZXJzW2luZGV4XTtcbiAgICAgICAgICAgIGxldCBtZXNoYnVmZmVyID0gYnVmZmVyLm1lc2hidWZmZXI7XG4gICAgICAgICAgICBidWZmZXIuaWEuX2NvdW50ID0gYnVmZmVyLmluZGljZVN0YXJ0O1xuICAgICAgICAgICAgcmVuZGVyZXIuX2ZsdXNoSUEoYnVmZmVyLmlhKTtcbiAgICAgICAgICAgIG1lc2hidWZmZXIudXBsb2FkRGF0YSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuQnVmZmVyIChncmFwaGljcywgY3ZlcnRzKSB7XG4gICAgICAgIGxldCBidWZmZXJzID0gdGhpcy5nZXRCdWZmZXJzKCk7IFxuICAgICAgICBsZXQgYnVmZmVyID0gYnVmZmVyc1t0aGlzLl9idWZmZXJPZmZzZXRdO1xuICAgICAgICBsZXQgbWVzaGJ1ZmZlciA9IGJ1ZmZlci5tZXNoYnVmZmVyO1xuXG4gICAgICAgIGxldCBtYXhWZXJ0c0NvdW50ID0gYnVmZmVyLnZlcnRleFN0YXJ0ICsgY3ZlcnRzO1xuICAgICAgICBpZiAobWF4VmVydHNDb3VudCA+IE1BWF9WRVJURVggfHxcbiAgICAgICAgICAgIG1heFZlcnRzQ291bnQgKiAzID4gTUFYX0lORElDRSkge1xuICAgICAgICAgICAgKyt0aGlzLl9idWZmZXJPZmZzZXQ7XG4gICAgICAgICAgICBtYXhWZXJ0c0NvdW50ID0gY3ZlcnRzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyT2Zmc2V0IDwgYnVmZmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIgPSBidWZmZXJzW3RoaXMuX2J1ZmZlck9mZnNldF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBidWZmZXIgPSB0aGlzLnJlcXVlc3RCdWZmZXIoZ3JhcGhpY3MpO1xuICAgICAgICAgICAgICAgIGJ1ZmZlcnNbdGhpcy5fYnVmZmVyT2Zmc2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWVzaGJ1ZmZlciA9IGJ1ZmZlci5tZXNoYnVmZmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1heFZlcnRzQ291bnQgPiBtZXNoYnVmZmVyLnZlcnRleE9mZnNldCkge1xuICAgICAgICAgICAgbWVzaGJ1ZmZlci5yZXF1ZXN0U3RhdGljKGN2ZXJ0cywgY3ZlcnRzKjMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgIH1cblxuICAgIHN0cm9rZSAoZ3JhcGhpY3MpIHtcbiAgICAgICAgdGhpcy5fY3VyQ29sb3IgPSBncmFwaGljcy5fc3Ryb2tlQ29sb3IuX3ZhbDtcblxuICAgICAgICB0aGlzLl9mbGF0dGVuUGF0aHMoZ3JhcGhpY3MuX2ltcGwpO1xuICAgICAgICB0aGlzLl9leHBhbmRTdHJva2UoZ3JhcGhpY3MpO1xuICAgIFxuICAgICAgICBncmFwaGljcy5faW1wbC5fdXBkYXRlUGF0aE9mZnNldCA9IHRydWU7XG4gICAgfVxuXG4gICAgZmlsbCAoZ3JhcGhpY3MpIHtcbiAgICAgICAgdGhpcy5fY3VyQ29sb3IgPSBncmFwaGljcy5fZmlsbENvbG9yLl92YWw7XG5cbiAgICAgICAgdGhpcy5fZXhwYW5kRmlsbChncmFwaGljcyk7XG4gICAgICAgIGdyYXBoaWNzLl9pbXBsLl91cGRhdGVQYXRoT2Zmc2V0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZXhwYW5kU3Ryb2tlIChncmFwaGljcykge1xuICAgICAgICBsZXQgdyA9IGdyYXBoaWNzLmxpbmVXaWR0aCAqIDAuNSxcbiAgICAgICAgICAgIGxpbmVDYXAgPSBncmFwaGljcy5saW5lQ2FwLFxuICAgICAgICAgICAgbGluZUpvaW4gPSBncmFwaGljcy5saW5lSm9pbixcbiAgICAgICAgICAgIG1pdGVyTGltaXQgPSBncmFwaGljcy5taXRlckxpbWl0O1xuXG4gICAgICAgIGxldCBpbXBsID0gZ3JhcGhpY3MuX2ltcGw7XG4gICAgXG4gICAgICAgIGxldCBuY2FwID0gY3VydmVEaXZzKHcsIFBJLCBpbXBsLl90ZXNzVG9sKTtcbiAgICBcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlSm9pbnMoaW1wbCwgdywgbGluZUpvaW4sIG1pdGVyTGltaXQpO1xuICAgIFxuICAgICAgICBsZXQgcGF0aHMgPSBpbXBsLl9wYXRocztcbiAgICAgICAgXG4gICAgICAgIC8vIENhbGN1bGF0ZSBtYXggdmVydGV4IHVzYWdlLlxuICAgICAgICBsZXQgY3ZlcnRzID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IGltcGwuX3BhdGhPZmZzZXQsIGwgPSBpbXBsLl9wYXRoTGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHBhdGhzW2ldO1xuICAgICAgICAgICAgbGV0IHBvaW50c0xlbmd0aCA9IHBhdGgucG9pbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKGxpbmVKb2luID09PSBMaW5lSm9pbi5ST1VORCkgY3ZlcnRzICs9IChwb2ludHNMZW5ndGggKyBwYXRoLm5iZXZlbCAqIChuY2FwICsgMikgKyAxKSAqIDI7IC8vIHBsdXMgb25lIGZvciBsb29wXG4gICAgICAgICAgICBlbHNlIGN2ZXJ0cyArPSAocG9pbnRzTGVuZ3RoICsgcGF0aC5uYmV2ZWwgKiA1ICsgMSkgKiAyOyAvLyBwbHVzIG9uZSBmb3IgbG9vcFxuXG4gICAgICAgICAgICBpZiAoIXBhdGguY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gc3BhY2UgZm9yIGNhcHNcbiAgICAgICAgICAgICAgICBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5ST1VORCkge1xuICAgICAgICAgICAgICAgICAgICBjdmVydHMgKz0gKG5jYXAgKiAyICsgMikgKiAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN2ZXJ0cyArPSAoMyArIDMpICogMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCBidWZmZXIgPSB0aGlzLmdlbkJ1ZmZlcihncmFwaGljcywgY3ZlcnRzKSxcbiAgICAgICAgICAgIG1lc2hidWZmZXIgPSBidWZmZXIubWVzaGJ1ZmZlcixcbiAgICAgICAgICAgIHZEYXRhID0gbWVzaGJ1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICBpRGF0YSA9IG1lc2hidWZmZXIuX2lEYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLl9wYXRoT2Zmc2V0LCBsID0gaW1wbC5fcGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBwYXRoc1tpXTtcbiAgICAgICAgICAgIGxldCBwdHMgPSBwYXRoLnBvaW50cztcbiAgICAgICAgICAgIGxldCBwb2ludHNMZW5ndGggPSBwdHMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydDtcblxuICAgICAgICAgICAgbGV0IHAwLCBwMTtcbiAgICAgICAgICAgIGxldCBzdGFydCwgZW5kLCBsb29wO1xuICAgICAgICAgICAgbG9vcCA9IHBhdGguY2xvc2VkO1xuICAgICAgICAgICAgaWYgKGxvb3ApIHtcbiAgICAgICAgICAgICAgICAvLyBMb29waW5nXG4gICAgICAgICAgICAgICAgcDAgPSBwdHNbcG9pbnRzTGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgcDEgPSBwdHNbMF07XG4gICAgICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgIGVuZCA9IHBvaW50c0xlbmd0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGNhcFxuICAgICAgICAgICAgICAgIHAwID0gcHRzWzBdO1xuICAgICAgICAgICAgICAgIHAxID0gcHRzWzFdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMTtcbiAgICAgICAgICAgICAgICBlbmQgPSBwb2ludHNMZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKCFsb29wKSB7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGNhcFxuICAgICAgICAgICAgICAgIGxldCBkUG9zID0gcDEuc3ViKHAwKTtcbiAgICAgICAgICAgICAgICBkUG9zLm5vcm1hbGl6ZVNlbGYoKTtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgZHggPSBkUG9zLng7XG4gICAgICAgICAgICAgICAgbGV0IGR5ID0gZFBvcy55O1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLkJVVFQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1dHRDYXBTdGFydChwMCwgZHgsIGR5LCB3LCAwKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLlNRVUFSRSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnV0dENhcFN0YXJ0KHAwLCBkeCwgZHksIHcsIHcpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmVDYXAgPT09IExpbmVDYXAuUk9VTkQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kQ2FwU3RhcnQocDAsIGR4LCBkeSwgdywgbmNhcCk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gc3RhcnQ7IGogPCBlbmQ7ICsraikge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lSm9pbiA9PT0gTGluZUpvaW4uUk9VTkQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91bmRKb2luKHAwLCBwMSwgdywgdywgbmNhcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChwMS5mbGFncyAmIChQb2ludEZsYWdzLlBUX0JFVkVMIHwgUG9pbnRGbGFncy5QVF9JTk5FUkJFVkVMKSkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmV2ZWxKb2luKHAwLCBwMSwgdywgdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHAxLnggKyBwMS5kbXggKiB3LCBwMS55ICsgcDEuZG15ICogdyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZzZXQocDEueCAtIHAxLmRteCAqIHcsIHAxLnkgLSBwMS5kbXkgKiB3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgcDAgPSBwMTtcbiAgICAgICAgICAgICAgICBwMSA9IHB0c1tqICsgMV07XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBpZiAobG9vcCkge1xuICAgICAgICAgICAgICAgIC8vIExvb3AgaXRcbiAgICAgICAgICAgICAgICBsZXQgdkRhdGFvT2ZzZXQgPSBvZmZzZXQgKiAzO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZzZXQodkRhdGFbdkRhdGFvT2ZzZXRdLCAgIHZEYXRhW3ZEYXRhb09mc2V0KzFdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHZEYXRhW3ZEYXRhb09mc2V0KzNdLCB2RGF0YVt2RGF0YW9PZnNldCs0XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFkZCBjYXBcbiAgICAgICAgICAgICAgICBsZXQgZFBvcyA9IHAxLnN1YihwMCk7XG4gICAgICAgICAgICAgICAgZFBvcy5ub3JtYWxpemVTZWxmKCk7XG4gICAgXG4gICAgICAgICAgICAgICAgbGV0IGR4ID0gZFBvcy54O1xuICAgICAgICAgICAgICAgIGxldCBkeSA9IGRQb3MueTtcbiAgICBcbiAgICAgICAgICAgICAgICBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5CVVRUKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idXR0Q2FwRW5kKHAxLCBkeCwgZHksIHcsIDApO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmVDYXAgPT09IExpbmVDYXAuU1FVQVJFKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idXR0Q2FwRW5kKHAxLCBkeCwgZHksIHcsIHcpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmVDYXAgPT09IExpbmVDYXAuUk9VTkQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kQ2FwRW5kKHAxLCBkeCwgZHksIHcsIG5jYXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdHJva2UgaW5kaWNlc1xuICAgICAgICAgICAgbGV0IGluZGljZXNPZmZzZXQgPSBidWZmZXIuaW5kaWNlU3RhcnQ7XG4gICAgICAgICAgICBmb3IgKGxldCBzdGFydCA9IG9mZnNldCsyLCBlbmQgPSBidWZmZXIudmVydGV4U3RhcnQ7IHN0YXJ0IDwgZW5kOyBzdGFydCsrKSB7XG4gICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IHN0YXJ0IC0gMjtcbiAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gc3RhcnQgLSAxO1xuICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBzdGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVmZmVyLmluZGljZVN0YXJ0ID0gaW5kaWNlc09mZnNldDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBfZXhwYW5kRmlsbCAoZ3JhcGhpY3MpIHtcbiAgICAgICAgbGV0IGltcGwgPSBncmFwaGljcy5faW1wbDtcblxuICAgICAgICBsZXQgcGF0aHMgPSBpbXBsLl9wYXRocztcblxuICAgICAgICAvLyBDYWxjdWxhdGUgbWF4IHZlcnRleCB1c2FnZS5cbiAgICAgICAgbGV0IGN2ZXJ0cyA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLl9wYXRoT2Zmc2V0LCBsID0gaW1wbC5fcGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBwYXRoc1tpXTtcbiAgICAgICAgICAgIGxldCBwb2ludHNMZW5ndGggPSBwYXRoLnBvaW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGN2ZXJ0cyArPSBwb2ludHNMZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYnVmZmVyID0gdGhpcy5nZW5CdWZmZXIoZ3JhcGhpY3MsIGN2ZXJ0cyksXG4gICAgICAgICAgICBtZXNoYnVmZmVyID0gYnVmZmVyLm1lc2hidWZmZXIsXG4gICAgICAgICAgICB2RGF0YSA9IG1lc2hidWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgaURhdGEgPSBtZXNoYnVmZmVyLl9pRGF0YTtcblxuICAgICAgICBmb3IgKGxldCBpID0gaW1wbC5fcGF0aE9mZnNldCwgbCA9IGltcGwuX3BhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwYXRoID0gcGF0aHNbaV07XG4gICAgICAgICAgICBsZXQgcHRzID0gcGF0aC5wb2ludHM7XG4gICAgICAgICAgICBsZXQgcG9pbnRzTGVuZ3RoID0gcHRzLmxlbmd0aDtcbiAgICBcbiAgICAgICAgICAgIGlmIChwb2ludHNMZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBzaGFwZSB2ZXJ0aWNlcy5cbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSBidWZmZXIudmVydGV4U3RhcnQ7XG4gICAgXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvaW50c0xlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdnNldChwdHNbal0ueCwgcHRzW2pdLnkpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgbGV0IGluZGljZXNPZmZzZXQgPSBidWZmZXIuaW5kaWNlU3RhcnQ7XG4gICAgXG4gICAgICAgICAgICBpZiAocGF0aC5jb21wbGV4KSB7XG4gICAgICAgICAgICAgICAgbGV0IGVhcmN1dERhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gb2Zmc2V0LCBlbmQgPSBidWZmZXIudmVydGV4U3RhcnQ7IGogPCBlbmQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdkRhdGFPZmZzZXQgPSBqICogMztcbiAgICAgICAgICAgICAgICAgICAgZWFyY3V0RGF0YS5wdXNoKHZEYXRhW3ZEYXRhT2Zmc2V0XSk7XG4gICAgICAgICAgICAgICAgICAgIGVhcmN1dERhdGEucHVzaCh2RGF0YVt2RGF0YU9mZnNldCsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGxldCBuZXdJbmRpY2VzID0gRWFyY3V0KGVhcmN1dERhdGEsIG51bGwsIDIpO1xuICAgIFxuICAgICAgICAgICAgICAgIGlmICghbmV3SW5kaWNlcyB8fCBuZXdJbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIG5JbmRpY2VzID0gbmV3SW5kaWNlcy5sZW5ndGg7IGogPCBuSW5kaWNlczsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBuZXdJbmRpY2VzW2pdICsgb2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IG9mZnNldDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzdGFydCA9IG9mZnNldCsyLCBlbmQgPSBidWZmZXIudmVydGV4U3RhcnQ7IHN0YXJ0IDwgZW5kOyBzdGFydCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBmaXJzdDtcbiAgICAgICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IHN0YXJ0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVmZmVyLmluZGljZVN0YXJ0ID0gaW5kaWNlc09mZnNldDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jYWxjdWxhdGVKb2lucyAoaW1wbCwgdywgbGluZUpvaW4sIG1pdGVyTGltaXQpIHtcbiAgICAgICAgbGV0IGl3ID0gMC4wO1xuICAgIFxuICAgICAgICBpZiAodyA+IDAuMCkge1xuICAgICAgICAgICAgaXcgPSAxIC8gdztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBDYWxjdWxhdGUgd2hpY2ggam9pbnMgbmVlZHMgZXh0cmEgdmVydGljZXMgdG8gYXBwZW5kLCBhbmQgZ2F0aGVyIHZlcnRleCBjb3VudC5cbiAgICAgICAgbGV0IHBhdGhzID0gaW1wbC5fcGF0aHM7XG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLl9wYXRoT2Zmc2V0LCBsID0gaW1wbC5fcGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBwYXRoc1tpXTtcbiAgICBcbiAgICAgICAgICAgIGxldCBwdHMgPSBwYXRoLnBvaW50cztcbiAgICAgICAgICAgIGxldCBwdHNMZW5ndGggPSBwdHMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IHAwID0gcHRzW3B0c0xlbmd0aCAtIDFdO1xuICAgICAgICAgICAgbGV0IHAxID0gcHRzWzBdO1xuICAgICAgICAgICAgbGV0IG5sZWZ0ID0gMDtcbiAgICBcbiAgICAgICAgICAgIHBhdGgubmJldmVsID0gMDtcbiAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHRzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZG1yMiwgY3Jvc3MsIGxpbWl0O1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIHBlcnAgbm9ybWFsc1xuICAgICAgICAgICAgICAgIGxldCBkbHgwID0gcDAuZHk7XG4gICAgICAgICAgICAgICAgbGV0IGRseTAgPSAtcDAuZHg7XG4gICAgICAgICAgICAgICAgbGV0IGRseDEgPSBwMS5keTtcbiAgICAgICAgICAgICAgICBsZXQgZGx5MSA9IC1wMS5keDtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgZXh0cnVzaW9uc1xuICAgICAgICAgICAgICAgIHAxLmRteCA9IChkbHgwICsgZGx4MSkgKiAwLjU7XG4gICAgICAgICAgICAgICAgcDEuZG15ID0gKGRseTAgKyBkbHkxKSAqIDAuNTtcbiAgICAgICAgICAgICAgICBkbXIyID0gcDEuZG14ICogcDEuZG14ICsgcDEuZG15ICogcDEuZG15O1xuICAgICAgICAgICAgICAgIGlmIChkbXIyID4gMC4wMDAwMDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjYWxlID0gMSAvIGRtcjI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2FsZSA+IDYwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSA2MDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcDEuZG14ICo9IHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICBwMS5kbXkgKj0gc2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgbGVmdCB0dXJucy5cbiAgICAgICAgICAgICAgICBjcm9zcyA9IHAxLmR4ICogcDAuZHkgLSBwMC5keCAqIHAxLmR5O1xuICAgICAgICAgICAgICAgIGlmIChjcm9zcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmxlZnQrKztcbiAgICAgICAgICAgICAgICAgICAgcDEuZmxhZ3MgfD0gUG9pbnRGbGFncy5QVF9MRUZUO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgaWYgd2Ugc2hvdWxkIHVzZSBiZXZlbCBvciBtaXRlciBmb3IgaW5uZXIgam9pbi5cbiAgICAgICAgICAgICAgICBsaW1pdCA9IG1heCgxMSwgbWluKHAwLmxlbiwgcDEubGVuKSAqIGl3KTtcbiAgICAgICAgICAgICAgICBpZiAoZG1yMiAqIGxpbWl0ICogbGltaXQgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHAxLmZsYWdzIHw9IFBvaW50RmxhZ3MuUFRfSU5ORVJCRVZFTDtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBjb3JuZXIgbmVlZHMgdG8gYmUgYmV2ZWxlZC5cbiAgICAgICAgICAgICAgICBpZiAocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0NPUk5FUikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG1yMiAqIG1pdGVyTGltaXQgKiBtaXRlckxpbWl0IDwgMSB8fCBsaW5lSm9pbiA9PT0gTGluZUpvaW4uQkVWRUwgfHwgbGluZUpvaW4gPT09IExpbmVKb2luLlJPVU5EKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwMS5mbGFncyB8PSBQb2ludEZsYWdzLlBUX0JFVkVMO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGlmICgocDEuZmxhZ3MgJiAoUG9pbnRGbGFncy5QVF9CRVZFTCB8IFBvaW50RmxhZ3MuUFRfSU5ORVJCRVZFTCkpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGgubmJldmVsKys7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIHAwID0gcDE7XG4gICAgICAgICAgICAgICAgcDEgPSBwdHNbaiArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9mbGF0dGVuUGF0aHMgKGltcGwpIHtcbiAgICAgICAgbGV0IHBhdGhzID0gaW1wbC5fcGF0aHM7XG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLl9wYXRoT2Zmc2V0LCBsID0gaW1wbC5fcGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBwYXRoc1tpXTtcbiAgICAgICAgICAgIGxldCBwdHMgPSBwYXRoLnBvaW50cztcbiAgICBcbiAgICAgICAgICAgIGxldCBwMCA9IHB0c1twdHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBsZXQgcDEgPSBwdHNbMF07XG4gICAgXG4gICAgICAgICAgICBpZiAocHRzLmxlbmd0aCA+IDIgJiYgcDAuZXF1YWxzKHAxKSkge1xuICAgICAgICAgICAgICAgIHBhdGguY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwdHMucG9wKCk7XG4gICAgICAgICAgICAgICAgcDAgPSBwdHNbcHRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIHNpemUgPSBwdHMubGVuZ3RoOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHNlZ21lbnQgZGlyZWN0aW9uIGFuZCBsZW5ndGhcbiAgICAgICAgICAgICAgICBsZXQgZFBvcyA9IHAxLnN1YihwMCk7XG4gICAgICAgICAgICAgICAgcDAubGVuID0gZFBvcy5tYWcoKTtcbiAgICAgICAgICAgICAgICBpZiAoZFBvcy54IHx8IGRQb3MueSlcbiAgICAgICAgICAgICAgICAgICAgZFBvcy5ub3JtYWxpemVTZWxmKCk7XG4gICAgICAgICAgICAgICAgcDAuZHggPSBkUG9zLng7XG4gICAgICAgICAgICAgICAgcDAuZHkgPSBkUG9zLnk7XG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZVxuICAgICAgICAgICAgICAgIHAwID0gcDE7XG4gICAgICAgICAgICAgICAgcDEgPSBwdHNbaiArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2Nob29zZUJldmVsIChiZXZlbCwgcDAsIHAxLCB3KSB7XG4gICAgICAgIGxldCB4ID0gcDEueDtcbiAgICAgICAgbGV0IHkgPSBwMS55O1xuICAgICAgICBsZXQgeDAsIHkwLCB4MSwgeTE7XG4gICAgXG4gICAgICAgIGlmIChiZXZlbCAhPT0gMCkge1xuICAgICAgICAgICAgeDAgPSB4ICsgcDAuZHkgKiB3O1xuICAgICAgICAgICAgeTAgPSB5IC0gcDAuZHggKiB3O1xuICAgICAgICAgICAgeDEgPSB4ICsgcDEuZHkgKiB3O1xuICAgICAgICAgICAgeTEgPSB5IC0gcDEuZHggKiB3O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeDAgPSB4MSA9IHggKyBwMS5kbXggKiB3O1xuICAgICAgICAgICAgeTAgPSB5MSA9IHkgKyBwMS5kbXkgKiB3O1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBbeDAsIHkwLCB4MSwgeTFdO1xuICAgIH1cbiAgICBcbiAgICBfYnV0dENhcFN0YXJ0IChwLCBkeCwgZHksIHcsIGQpIHtcbiAgICAgICAgbGV0IHB4ID0gcC54IC0gZHggKiBkO1xuICAgICAgICBsZXQgcHkgPSBwLnkgLSBkeSAqIGQ7XG4gICAgICAgIGxldCBkbHggPSBkeTtcbiAgICAgICAgbGV0IGRseSA9IC1keDtcbiAgICBcbiAgICAgICAgdGhpcy5fdnNldChweCArIGRseCAqIHcsIHB5ICsgZGx5ICogdyk7XG4gICAgICAgIHRoaXMuX3ZzZXQocHggLSBkbHggKiB3LCBweSAtIGRseSAqIHcpO1xuICAgIH1cblxuICAgIF9idXR0Q2FwRW5kIChwLCBkeCwgZHksIHcsIGQpIHtcbiAgICAgICAgbGV0IHB4ID0gcC54ICsgZHggKiBkO1xuICAgICAgICBsZXQgcHkgPSBwLnkgKyBkeSAqIGQ7XG4gICAgICAgIGxldCBkbHggPSBkeTtcbiAgICAgICAgbGV0IGRseSA9IC1keDtcbiAgICBcbiAgICAgICAgdGhpcy5fdnNldChweCArIGRseCAqIHcsIHB5ICsgZGx5ICogdyk7XG4gICAgICAgIHRoaXMuX3ZzZXQocHggLSBkbHggKiB3LCBweSAtIGRseSAqIHcpO1xuICAgIH1cbiAgICBcbiAgICBfcm91bmRDYXBTdGFydCAocCwgZHgsIGR5LCB3LCBuY2FwKSB7XG4gICAgICAgIGxldCBweCA9IHAueDtcbiAgICAgICAgbGV0IHB5ID0gcC55O1xuICAgICAgICBsZXQgZGx4ID0gZHk7XG4gICAgICAgIGxldCBkbHkgPSAtZHg7XG4gICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmNhcDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYSA9IGkgLyAobmNhcCAtIDEpICogUEk7XG4gICAgICAgICAgICBsZXQgYXggPSBjb3MoYSkgKiB3LFxuICAgICAgICAgICAgICAgIGF5ID0gc2luKGEpICogdztcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocHggLSBkbHggKiBheCAtIGR4ICogYXksIHB5IC0gZGx5ICogYXggLSBkeSAqIGF5KTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocHgsIHB5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92c2V0KHB4ICsgZGx4ICogdywgcHkgKyBkbHkgKiB3KTtcbiAgICAgICAgdGhpcy5fdnNldChweCAtIGRseCAqIHcsIHB5IC0gZGx5ICogdyk7XG4gICAgfVxuICAgIFxuICAgIF9yb3VuZENhcEVuZCAocCwgZHgsIGR5LCB3LCBuY2FwKSB7XG4gICAgICAgIGxldCBweCA9IHAueDtcbiAgICAgICAgbGV0IHB5ID0gcC55O1xuICAgICAgICBsZXQgZGx4ID0gZHk7XG4gICAgICAgIGxldCBkbHkgPSAtZHg7XG4gICAgXG4gICAgICAgIHRoaXMuX3ZzZXQocHggKyBkbHggKiB3LCBweSArIGRseSAqIHcpO1xuICAgICAgICB0aGlzLl92c2V0KHB4IC0gZGx4ICogdywgcHkgLSBkbHkgKiB3KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuY2FwOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBhID0gaSAvIChuY2FwIC0gMSkgKiBQSTtcbiAgICAgICAgICAgIGxldCBheCA9IGNvcyhhKSAqIHcsXG4gICAgICAgICAgICAgICAgYXkgPSBzaW4oYSkgKiB3O1xuICAgICAgICAgICAgdGhpcy5fdnNldChweCwgcHkpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChweCAtIGRseCAqIGF4ICsgZHggKiBheSwgcHkgLSBkbHkgKiBheCArIGR5ICogYXkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9yb3VuZEpvaW4gKHAwLCBwMSwgbHcsIHJ3LCBuY2FwKSB7XG4gICAgICAgIGxldCBkbHgwID0gcDAuZHk7XG4gICAgICAgIGxldCBkbHkwID0gLXAwLmR4O1xuICAgICAgICBsZXQgZGx4MSA9IHAxLmR5O1xuICAgICAgICBsZXQgZGx5MSA9IC1wMS5keDtcbiAgICBcbiAgICAgICAgbGV0IHAxeCA9IHAxLng7XG4gICAgICAgIGxldCBwMXkgPSBwMS55O1xuICAgIFxuICAgICAgICBpZiAoKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9MRUZUKSAhPT0gMCkge1xuICAgICAgICAgICAgbGV0IG91dCA9IHRoaXMuX2Nob29zZUJldmVsKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9JTk5FUkJFVkVMLCBwMCwgcDEsIGx3KTtcbiAgICAgICAgICAgIGxldCBseDAgPSBvdXRbMF07XG4gICAgICAgICAgICBsZXQgbHkwID0gb3V0WzFdO1xuICAgICAgICAgICAgbGV0IGx4MSA9IG91dFsyXTtcbiAgICAgICAgICAgIGxldCBseTEgPSBvdXRbM107XG4gICAgXG4gICAgICAgICAgICBsZXQgYTAgPSBhdGFuMigtZGx5MCwgLWRseDApO1xuICAgICAgICAgICAgbGV0IGExID0gYXRhbjIoLWRseTEsIC1kbHgxKTtcbiAgICAgICAgICAgIGlmIChhMSA+IGEwKSBhMSAtPSBQSSAqIDI7XG4gICAgXG4gICAgICAgICAgICB0aGlzLl92c2V0KGx4MCwgbHkwKTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDF4IC0gZGx4MCAqIHJ3LCBwMS55IC0gZGx5MCAqIHJ3KTtcbiAgICBcbiAgICAgICAgICAgIGxldCBuID0gY2xhbXAoY2VpbCgoYTAgLSBhMSkgLyBQSSkgKiBuY2FwLCAyLCBuY2FwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHUgPSBpIC8gKG4gLSAxKTtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IGEwICsgdSAqIChhMSAtIGEwKTtcbiAgICAgICAgICAgICAgICBsZXQgcnggPSBwMXggKyBjb3MoYSkgKiBydztcbiAgICAgICAgICAgICAgICBsZXQgcnkgPSBwMXkgKyBzaW4oYSkgKiBydztcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHAxeCwgcDF5KTtcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHJ4LCByeSk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB0aGlzLl92c2V0KGx4MSwgbHkxKTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDF4IC0gZGx4MSAqIHJ3LCBwMXkgLSBkbHkxICogcncpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG91dCA9IHRoaXMuX2Nob29zZUJldmVsKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9JTk5FUkJFVkVMLCBwMCwgcDEsIC1ydyk7XG4gICAgICAgICAgICBsZXQgcngwID0gb3V0WzBdO1xuICAgICAgICAgICAgbGV0IHJ5MCA9IG91dFsxXTtcbiAgICAgICAgICAgIGxldCByeDEgPSBvdXRbMl07XG4gICAgICAgICAgICBsZXQgcnkxID0gb3V0WzNdO1xuICAgIFxuICAgICAgICAgICAgbGV0IGEwID0gYXRhbjIoZGx5MCwgZGx4MCk7XG4gICAgICAgICAgICBsZXQgYTEgPSBhdGFuMihkbHkxLCBkbHgxKTtcbiAgICAgICAgICAgIGlmIChhMSA8IGEwKSBhMSArPSBQSSAqIDI7XG4gICAgXG4gICAgICAgICAgICB0aGlzLl92c2V0KHAxeCArIGRseDAgKiBydywgcDF5ICsgZGx5MCAqIHJ3KTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocngwLCByeTApO1xuICAgIFxuICAgICAgICAgICAgbGV0IG4gPSBjbGFtcChjZWlsKChhMSAtIGEwKSAvIFBJKSAqIG5jYXAsIDIsIG5jYXApO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdSA9IGkgLyAobiAtIDEpO1xuICAgICAgICAgICAgICAgIGxldCBhID0gYTAgKyB1ICogKGExIC0gYTApO1xuICAgICAgICAgICAgICAgIGxldCBseCA9IHAxeCArIGNvcyhhKSAqIGx3O1xuICAgICAgICAgICAgICAgIGxldCBseSA9IHAxeSArIHNpbihhKSAqIGx3O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZzZXQobHgsIGx5KTtcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHAxeCwgcDF5KTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDF4ICsgZGx4MSAqIHJ3LCBwMXkgKyBkbHkxICogcncpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChyeDEsIHJ5MSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgX2JldmVsSm9pbiAocDAsIHAxLCBsdywgcncpIHtcbiAgICAgICAgbGV0IHJ4MCwgcnkwLCByeDEsIHJ5MTtcbiAgICAgICAgbGV0IGx4MCwgbHkwLCBseDEsIGx5MTtcbiAgICAgICAgbGV0IGRseDAgPSBwMC5keTtcbiAgICAgICAgbGV0IGRseTAgPSAtcDAuZHg7XG4gICAgICAgIGxldCBkbHgxID0gcDEuZHk7XG4gICAgICAgIGxldCBkbHkxID0gLXAxLmR4O1xuICAgIFxuICAgICAgICBpZiAocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0xFRlQpIHtcbiAgICAgICAgICAgIGxldCBvdXQgPSB0aGlzLl9jaG9vc2VCZXZlbChwMS5mbGFncyAmIFBvaW50RmxhZ3MuUFRfSU5ORVJCRVZFTCwgcDAsIHAxLCBsdyk7XG4gICAgICAgICAgICBseDAgPSBvdXRbMF07XG4gICAgICAgICAgICBseTAgPSBvdXRbMV07XG4gICAgICAgICAgICBseDEgPSBvdXRbMl07XG4gICAgICAgICAgICBseTEgPSBvdXRbM107XG4gICAgXG4gICAgICAgICAgICB0aGlzLl92c2V0KGx4MCwgbHkwKTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDEueCAtIGRseDAgKiBydywgcDEueSAtIGRseTAgKiBydyk7XG4gICAgXG4gICAgICAgICAgICB0aGlzLl92c2V0KGx4MSwgbHkxKTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDEueCAtIGRseDEgKiBydywgcDEueSAtIGRseTEgKiBydyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gdGhpcy5fY2hvb3NlQmV2ZWwocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgLXJ3KTtcbiAgICAgICAgICAgIHJ4MCA9IG91dFswXTtcbiAgICAgICAgICAgIHJ5MCA9IG91dFsxXTtcbiAgICAgICAgICAgIHJ4MSA9IG91dFsyXTtcbiAgICAgICAgICAgIHJ5MSA9IG91dFszXTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDEueCArIGRseDAgKiBsdywgcDEueSArIGRseTAgKiBsdyk7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHJ4MCwgcnkwKTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDEueCArIGRseDEgKiBsdywgcDEueSArIGRseTEgKiBsdyk7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHJ4MSwgcnkxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBfdnNldCAoeCwgeSkge1xuICAgICAgICBsZXQgYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuICAgICAgICBsZXQgbWVzaGJ1ZmZlciA9IGJ1ZmZlci5tZXNoYnVmZmVyO1xuICAgICAgICBsZXQgZGF0YU9mZnNldCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydCAqIDM7XG5cbiAgICAgICAgbGV0IHZEYXRhID0gbWVzaGJ1ZmZlci5fdkRhdGE7XG4gICAgICAgIGxldCB1aW50VkRhdGEgPSBtZXNoYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgdkRhdGFbZGF0YU9mZnNldF0gPSB4O1xuICAgICAgICB2RGF0YVtkYXRhT2Zmc2V0KzFdID0geTtcbiAgICAgICAgdWludFZEYXRhW2RhdGFPZmZzZXQrMl0gPSB0aGlzLl9jdXJDb2xvcjtcblxuICAgICAgICBidWZmZXIudmVydGV4U3RhcnQgKys7XG4gICAgICAgIG1lc2hidWZmZXIuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9XG59XG5cbkFzc2VtYmxlci5yZWdpc3RlcihjYy5HcmFwaGljcywgR3JhcGhpY3NBc3NlbWJsZXIpO1xuIl19