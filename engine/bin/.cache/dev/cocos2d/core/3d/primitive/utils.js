
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/utils.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.wireframe = wireframe;
exports.invWinding = invWinding;
exports.toWavefrontOBJ = toWavefrontOBJ;
exports.normals = normals;
exports.calcNormals = calcNormals;

var _vec = _interopRequireDefault(require("../../value-types/vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function wireframe(indices) {
  var offsets = [[0, 1], [1, 2], [2, 0]];
  var lines = [];
  var lineIDs = {};

  for (var i = 0; i < indices.length; i += 3) {
    for (var k = 0; k < 3; ++k) {
      var i1 = indices[i + offsets[k][0]];
      var i2 = indices[i + offsets[k][1]]; // check if we already have the line in our lines

      var id = i1 > i2 ? i2 << 16 | i1 : i1 << 16 | i2;

      if (lineIDs[id] === undefined) {
        lineIDs[id] = 0;
        lines.push(i1, i2);
      }
    }
  }

  return lines;
}

function invWinding(indices) {
  var newIB = [];

  for (var i = 0; i < indices.length; i += 3) {
    newIB.push(indices[i], indices[i + 2], indices[i + 1]);
  }

  return newIB;
}

function toWavefrontOBJ(primitive, scale) {
  if (scale === void 0) {
    scale = 1;
  }

  var v = primitive.positions,
      t = primitive.uvs,
      n = primitive.normals,
      IB = primitive.indices;

  var V = function V(i) {
    return IB[i] + 1 + "/" + (IB[i] + 1) + "/" + (IB[i] + 1);
  };

  var content = '';

  for (var i = 0; i < v.length; i += 3) {
    content += "v " + v[i] * scale + " " + v[i + 1] * scale + " " + v[i + 2] * scale + "\n";
  }

  for (var _i = 0; _i < t.length; _i += 2) {
    content += "vt " + t[_i] + " " + t[_i + 1] + "\n";
  }

  for (var _i2 = 0; _i2 < n.length; _i2 += 3) {
    content += "vn " + n[_i2] + " " + n[_i2 + 1] + " " + n[_i2 + 2] + "\n";
  }

  for (var _i3 = 0; _i3 < IB.length; _i3 += 3) {
    content += "f " + V(_i3) + " " + V(_i3 + 1) + " " + V(_i3 + 2) + "\n";
  }

  return content;
}

function normals(positions, normals, length) {
  if (length === void 0) {
    length = 1;
  }

  var verts = new Array(2 * positions.length);

  for (var i = 0; i < positions.length / 3; ++i) {
    var i3 = 3 * i;
    var i6 = 6 * i; // line start

    verts[i6 + 0] = positions[i3 + 0];
    verts[i6 + 1] = positions[i3 + 1];
    verts[i6 + 2] = positions[i3 + 2]; // line end

    verts[i6 + 3] = positions[i3 + 0] + normals[i3 + 0] * length;
    verts[i6 + 4] = positions[i3 + 1] + normals[i3 + 1] * length;
    verts[i6 + 5] = positions[i3 + 2] + normals[i3 + 2] * length;
  }

  return verts;
}

function fromArray(out, a, offset) {
  out.x = a[offset];
  out.y = a[offset + 1];
  out.z = a[offset + 2];
}

function calcNormals(positions, indices, normals) {
  normals = normals || new Array(positions.length);

  for (var i = 0, l = normals.length; i < l; i++) {
    normals[i] = 0;
  }

  var vA, vB, vC;
  var pA = cc.v3(),
      pB = cc.v3(),
      pC = cc.v3();
  var cb = cc.v3(),
      ab = cc.v3();

  for (var _i4 = 0, il = indices.length; _i4 < il; _i4 += 3) {
    vA = indices[_i4 + 0] * 3;
    vB = indices[_i4 + 1] * 3;
    vC = indices[_i4 + 2] * 3;
    fromArray(pA, positions, vA);
    fromArray(pB, positions, vB);
    fromArray(pC, positions, vC);

    _vec["default"].subtract(cb, pC, pB);

    _vec["default"].subtract(ab, pA, pB);

    _vec["default"].cross(cb, cb, ab);

    normals[vA] += cb.x;
    normals[vA + 1] += cb.y;
    normals[vA + 2] += cb.z;
    normals[vB] += cb.x;
    normals[vB + 1] += cb.y;
    normals[vB + 2] += cb.z;
    normals[vC] += cb.x;
    normals[vC + 1] += cb.y;
    normals[vC + 2] += cb.z;
  }

  var tempNormal = cc.v3();

  for (var _i5 = 0, _l = normals.length; _i5 < _l; _i5 += 3) {
    tempNormal.x = normals[_i5];
    tempNormal.y = normals[_i5 + 1];
    tempNormal.z = normals[_i5 + 2];
    tempNormal.normalizeSelf();
    normals[_i5] = tempNormal.x;
    normals[_i5 + 1] = tempNormal.y;
    normals[_i5 + 2] = tempNormal.z;
  }

  return normals;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLnRzIl0sIm5hbWVzIjpbIndpcmVmcmFtZSIsImluZGljZXMiLCJvZmZzZXRzIiwibGluZXMiLCJsaW5lSURzIiwiaSIsImxlbmd0aCIsImsiLCJpMSIsImkyIiwiaWQiLCJ1bmRlZmluZWQiLCJwdXNoIiwiaW52V2luZGluZyIsIm5ld0lCIiwidG9XYXZlZnJvbnRPQkoiLCJwcmltaXRpdmUiLCJzY2FsZSIsInYiLCJwb3NpdGlvbnMiLCJ0IiwidXZzIiwibiIsIm5vcm1hbHMiLCJJQiIsIlYiLCJjb250ZW50IiwidmVydHMiLCJBcnJheSIsImkzIiwiaTYiLCJmcm9tQXJyYXkiLCJvdXQiLCJhIiwib2Zmc2V0IiwieCIsInkiLCJ6IiwiY2FsY05vcm1hbHMiLCJsIiwidkEiLCJ2QiIsInZDIiwicEEiLCJjYyIsInYzIiwicEIiLCJwQyIsImNiIiwiYWIiLCJpbCIsIlZlYzMiLCJzdWJ0cmFjdCIsImNyb3NzIiwidGVtcE5vcm1hbCIsIm5vcm1hbGl6ZVNlbGYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFTyxTQUFTQSxTQUFULENBQW1CQyxPQUFuQixFQUE0QjtBQUNqQyxNQUFNQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixDQUFoQjtBQUNBLE1BQUlDLEtBQWUsR0FBRyxFQUF0QjtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUVBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osT0FBTyxDQUFDSyxNQUE1QixFQUFvQ0QsQ0FBQyxJQUFJLENBQXpDLEVBQTRDO0FBQzFDLFNBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QixFQUFFQSxDQUF6QixFQUE0QjtBQUMxQixVQUFJQyxFQUFF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QUFPLENBQUNqQixNQUE1QixFQUFvQ0QsR0FBQyxHQUFHa0MsRUFBeEMsRUFBMkNsQyxHQUFDLElBQUUsQ0FBOUMsRUFBaUQ7QUFDN0NpRCxJQUFBQSxVQUFVLENBQUNuQixDQUFYLEdBQWVaLE9BQU8sQ0FBQ2xCLEdBQUQsQ0FBdEI7QUFDQWlELElBQUFBLFVBQVUsQ0FBQ2xCLENBQVgsR0FBZWIsT0FBTyxDQUFDbEIsR0FBQyxHQUFDLENBQUgsQ0FBdEI7QUFDQWlELElBQUFBLFVBQVUsQ0FBQ2pCLENBQVgsR0FBZWQsT0FBTyxDQUFDbEIsR0FBQyxHQUFDLENBQUgsQ0FBdEI7QUFFQWlELElBQUFBLFVBQVUsQ0FBQ0MsYUFBWDtBQUVBaEMsSUFBQUEsT0FBTyxDQUFDbEIsR0FBRCxDQUFQLEdBQWFpRCxVQUFVLENBQUNuQixDQUF4QjtBQUNBWixJQUFBQSxPQUFPLENBQUNsQixHQUFDLEdBQUMsQ0FBSCxDQUFQLEdBQWVpRCxVQUFVLENBQUNsQixDQUExQjtBQUNBYixJQUFBQSxPQUFPLENBQUNsQixHQUFDLEdBQUMsQ0FBSCxDQUFQLEdBQWVpRCxVQUFVLENBQUNqQixDQUExQjtBQUNIOztBQUVELFNBQU9kLE9BQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWZWMzIGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzL3ZlYzMnO1xuXG5leHBvcnQgZnVuY3Rpb24gd2lyZWZyYW1lKGluZGljZXMpIHtcbiAgY29uc3Qgb2Zmc2V0cyA9IFtbMCwgMV0sIFsxLCAyXSwgWzIsIDBdXTtcbiAgbGV0IGxpbmVzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgbGluZUlEcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgMzsgKytrKSB7XG4gICAgICBsZXQgaTEgPSBpbmRpY2VzW2kgKyBvZmZzZXRzW2tdWzBdXTtcbiAgICAgIGxldCBpMiA9IGluZGljZXNbaSArIG9mZnNldHNba11bMV1dO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhlIGxpbmUgaW4gb3VyIGxpbmVzXG4gICAgICBsZXQgaWQgPSAoaTEgPiBpMikgPyAoKGkyIDw8IDE2KSB8IGkxKSA6ICgoaTEgPDwgMTYpIHwgaTIpO1xuICAgICAgaWYgKGxpbmVJRHNbaWRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGluZUlEc1tpZF0gPSAwO1xuICAgICAgICBsaW5lcy5wdXNoKGkxLCBpMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52V2luZGluZyhpbmRpY2VzKSB7XG4gIGxldCBuZXdJQiA6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkgKz0gMylcbiAgICBuZXdJQi5wdXNoKGluZGljZXNbaV0sIGluZGljZXNbaSArIDJdLCBpbmRpY2VzW2kgKyAxXSk7XG4gIHJldHVybiBuZXdJQjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvV2F2ZWZyb250T0JKKHByaW1pdGl2ZSwgc2NhbGUgPSAxKSB7XG4gIGxldCB2ID0gcHJpbWl0aXZlLnBvc2l0aW9ucywgdCA9IHByaW1pdGl2ZS51dnMsIG4gPSBwcmltaXRpdmUubm9ybWFscywgSUIgPSBwcmltaXRpdmUuaW5kaWNlcztcbiAgbGV0IFYgPSBpID0+IGAke0lCW2ldKzF9LyR7SUJbaV0rMX0vJHtJQltpXSsxfWA7XG4gIGxldCBjb250ZW50ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdi5sZW5ndGg7IGkgKz0gMylcbiAgICBjb250ZW50ICs9IGB2ICR7dltpXSpzY2FsZX0gJHt2W2krMV0qc2NhbGV9ICR7dltpKzJdKnNjYWxlfVxcbmA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdC5sZW5ndGg7IGkgKz0gMilcbiAgICBjb250ZW50ICs9IGB2dCAke3RbaV19ICR7dFtpKzFdfVxcbmA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbi5sZW5ndGg7IGkgKz0gMylcbiAgICBjb250ZW50ICs9IGB2biAke25baV19ICR7bltpKzFdfSAke25baSsyXX1cXG5gO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IElCLmxlbmd0aDsgaSArPSAzKVxuICAgIGNvbnRlbnQgKz0gYGYgJHtWKGkpfSAke1YoaSsxKX0gJHtWKGkrMil9XFxuYDtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxzKHBvc2l0aW9ucywgbm9ybWFscywgbGVuZ3RoID0gMSkge1xuICBsZXQgdmVydHMgPSBuZXcgQXJyYXkoMiAqIHBvc2l0aW9ucy5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmxlbmd0aC8zOyArK2kpIHtcbiAgICBsZXQgaTMgPSAzKmk7XG4gICAgbGV0IGk2ID0gNippO1xuXG4gICAgLy8gbGluZSBzdGFydFxuICAgIHZlcnRzW2k2ICsgMF0gPSBwb3NpdGlvbnNbaTMgKyAwXTtcbiAgICB2ZXJ0c1tpNiArIDFdID0gcG9zaXRpb25zW2kzICsgMV07XG4gICAgdmVydHNbaTYgKyAyXSA9IHBvc2l0aW9uc1tpMyArIDJdO1xuXG4gICAgLy8gbGluZSBlbmRcbiAgICB2ZXJ0c1tpNiArIDNdID0gcG9zaXRpb25zW2kzICsgMF0gKyBub3JtYWxzW2kzICsgMF0gKiBsZW5ndGg7XG4gICAgdmVydHNbaTYgKyA0XSA9IHBvc2l0aW9uc1tpMyArIDFdICsgbm9ybWFsc1tpMyArIDFdICogbGVuZ3RoO1xuICAgIHZlcnRzW2k2ICsgNV0gPSBwb3NpdGlvbnNbaTMgKyAyXSArIG5vcm1hbHNbaTMgKyAyXSAqIGxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiB2ZXJ0cztcbn1cblxuXG5mdW5jdGlvbiBmcm9tQXJyYXkgKG91dCwgYSwgb2Zmc2V0KSB7XG4gIG91dC54ID0gYVtvZmZzZXRdO1xuICBvdXQueSA9IGFbb2Zmc2V0KzFdO1xuICBvdXQueiA9IGFbb2Zmc2V0KzJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsY05vcm1hbHMgKHBvc2l0aW9ucywgaW5kaWNlcywgbm9ybWFscykge1xuICBub3JtYWxzID0gbm9ybWFscyB8fCBuZXcgQXJyYXkocG9zaXRpb25zLmxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwLCBsID0gbm9ybWFscy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5vcm1hbHNbaV0gPSAwO1xuICB9XG5cbiAgbGV0IHZBLCB2QiwgdkM7XG4gIGxldCBwQSA9IGNjLnYzKCksIHBCID0gY2MudjMoKSwgcEMgPSBjYy52MygpO1xuICBsZXQgY2IgPSBjYy52MygpLCBhYiA9IGNjLnYzKCk7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gaW5kaWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArPSAzKSB7XG5cbiAgICAgIHZBID0gaW5kaWNlc1tpICsgMF0gKiAzO1xuICAgICAgdkIgPSBpbmRpY2VzW2kgKyAxXSAqIDM7XG4gICAgICB2QyA9IGluZGljZXNbaSArIDJdICogMztcblxuICAgICAgZnJvbUFycmF5KHBBLCBwb3NpdGlvbnMsIHZBKTtcbiAgICAgIGZyb21BcnJheShwQiwgcG9zaXRpb25zLCB2Qik7XG4gICAgICBmcm9tQXJyYXkocEMsIHBvc2l0aW9ucywgdkMpO1xuXG4gICAgICBWZWMzLnN1YnRyYWN0KGNiLCBwQywgcEIpO1xuICAgICAgVmVjMy5zdWJ0cmFjdChhYiwgcEEsIHBCKTtcbiAgICAgIFZlYzMuY3Jvc3MoY2IsIGNiLCBhYik7XG5cbiAgICAgIG5vcm1hbHNbdkFdICs9IGNiLng7XG4gICAgICBub3JtYWxzW3ZBICsgMV0gKz0gY2IueTtcbiAgICAgIG5vcm1hbHNbdkEgKyAyXSArPSBjYi56O1xuXG4gICAgICBub3JtYWxzW3ZCXSArPSBjYi54O1xuICAgICAgbm9ybWFsc1t2QiArIDFdICs9IGNiLnk7XG4gICAgICBub3JtYWxzW3ZCICsgMl0gKz0gY2IuejtcblxuICAgICAgbm9ybWFsc1t2Q10gKz0gY2IueDtcbiAgICAgIG5vcm1hbHNbdkMgKyAxXSArPSBjYi55O1xuICAgICAgbm9ybWFsc1t2QyArIDJdICs9IGNiLno7XG4gIH1cblxuICBsZXQgdGVtcE5vcm1hbCA9IGNjLnYzKCk7XG4gIGZvciAobGV0IGkgPSAwLCBsID0gbm9ybWFscy5sZW5ndGg7IGkgPCBsOyBpKz0zKSB7XG4gICAgICB0ZW1wTm9ybWFsLnggPSBub3JtYWxzW2ldO1xuICAgICAgdGVtcE5vcm1hbC55ID0gbm9ybWFsc1tpKzFdO1xuICAgICAgdGVtcE5vcm1hbC56ID0gbm9ybWFsc1tpKzJdO1xuXG4gICAgICB0ZW1wTm9ybWFsLm5vcm1hbGl6ZVNlbGYoKTtcblxuICAgICAgbm9ybWFsc1tpXSA9IHRlbXBOb3JtYWwueDtcbiAgICAgIG5vcm1hbHNbaSsxXSA9IHRlbXBOb3JtYWwueTtcbiAgICAgIG5vcm1hbHNbaSsyXSA9IHRlbXBOb3JtYWwuejtcbiAgfVxuXG4gIHJldHVybiBub3JtYWxzO1xufVxuIl19