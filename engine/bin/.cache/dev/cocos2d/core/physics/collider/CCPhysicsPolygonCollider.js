
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/collider/CCPhysicsPolygonCollider.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var PolygonSeparator = require('../CCPolygonSeparator');
/**
 * @class PhysicsPolygonCollider
 * @extends PhysicsCollider
 * @uses Collider.Polygon
 */


var PhysicsPolygonCollider = cc.Class({
  name: 'cc.PhysicsPolygonCollider',
  "extends": cc.PhysicsCollider,
  mixins: [cc.Collider.Polygon],
  editor: {
    menu: CC_EDITOR && 'i18n:MAIN_MENU.component.physics/Collider/Polygon',
    inspector: CC_EDITOR && 'packages://inspector/inspectors/comps/physics/points-base-collider.js',
    requireComponent: cc.RigidBody
  },
  _createShape: function _createShape(scale) {
    var shapes = [];
    var points = this.points; // check if last point equal to first point

    if (points.length > 0 && points[0].equals(points[points.length - 1])) {
      points.length -= 1;
    }

    var polys = PolygonSeparator.ConvexPartition(points);
    var offset = this.offset;

    for (var i = 0; i < polys.length; i++) {
      var poly = polys[i];
      var shape = null,
          vertices = [];
      var firstVertice = null;

      for (var j = 0, l = poly.length; j < l; j++) {
        if (!shape) {
          shape = new b2.PolygonShape();
        }

        var p = poly[j];
        var x = (p.x + offset.x) / PTM_RATIO * scale.x;
        var y = (p.y + offset.y) / PTM_RATIO * scale.y;
        var v = new b2.Vec2(x, y);
        vertices.push(v);

        if (!firstVertice) {
          firstVertice = v;
        }

        if (vertices.length === b2.maxPolygonVertices) {
          shape.Set(vertices, vertices.length);
          shapes.push(shape);
          shape = null;

          if (j < l - 1) {
            vertices = [firstVertice, vertices[vertices.length - 1]];
          }
        }
      }

      if (shape) {
        shape.Set(vertices, vertices.length);
        shapes.push(shape);
      }
    }

    return shapes;
  }
});
cc.PhysicsPolygonCollider = module.exports = PhysicsPolygonCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc1BvbHlnb25Db2xsaWRlci5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwiUG9seWdvblNlcGFyYXRvciIsIlBoeXNpY3NQb2x5Z29uQ29sbGlkZXIiLCJjYyIsIkNsYXNzIiwibmFtZSIsIlBoeXNpY3NDb2xsaWRlciIsIm1peGlucyIsIkNvbGxpZGVyIiwiUG9seWdvbiIsImVkaXRvciIsIm1lbnUiLCJDQ19FRElUT1IiLCJpbnNwZWN0b3IiLCJyZXF1aXJlQ29tcG9uZW50IiwiUmlnaWRCb2R5IiwiX2NyZWF0ZVNoYXBlIiwic2NhbGUiLCJzaGFwZXMiLCJwb2ludHMiLCJsZW5ndGgiLCJlcXVhbHMiLCJwb2x5cyIsIkNvbnZleFBhcnRpdGlvbiIsIm9mZnNldCIsImkiLCJwb2x5Iiwic2hhcGUiLCJ2ZXJ0aWNlcyIsImZpcnN0VmVydGljZSIsImoiLCJsIiwiYjIiLCJQb2x5Z29uU2hhcGUiLCJwIiwieCIsInkiLCJ2IiwiVmVjMiIsInB1c2giLCJtYXhQb2x5Z29uVmVydGljZXMiLCJTZXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7O0FBQ0EsSUFBSUUsZ0JBQWdCLEdBQUdELE9BQU8sQ0FBQyx1QkFBRCxDQUE5QjtBQUVBOzs7Ozs7O0FBS0EsSUFBSUUsc0JBQXNCLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ2xDQyxFQUFBQSxJQUFJLEVBQUUsMkJBRDRCO0FBRWxDLGFBQVNGLEVBQUUsQ0FBQ0csZUFGc0I7QUFHbENDLEVBQUFBLE1BQU0sRUFBRSxDQUFDSixFQUFFLENBQUNLLFFBQUgsQ0FBWUMsT0FBYixDQUgwQjtBQUtsQ0MsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLElBQUksRUFBRUMsU0FBUyxJ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Sjs7QUFFRCxXQUFPVCxNQUFQO0FBQ0g7QUEvRGlDLENBQVQsQ0FBN0I7QUFrRUFmLEVBQUUsQ0FBQ0Qsc0JBQUgsR0FBNEJ3QyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ6QyxzQkFBN0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG52YXIgUG9seWdvblNlcGFyYXRvciA9IHJlcXVpcmUoJy4uL0NDUG9seWdvblNlcGFyYXRvcicpO1xuXG4vKipcbiAqIEBjbGFzcyBQaHlzaWNzUG9seWdvbkNvbGxpZGVyXG4gKiBAZXh0ZW5kcyBQaHlzaWNzQ29sbGlkZXJcbiAqIEB1c2VzIENvbGxpZGVyLlBvbHlnb25cbiAqL1xudmFyIFBoeXNpY3NQb2x5Z29uQ29sbGlkZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBoeXNpY3NQb2x5Z29uQ29sbGlkZXInLFxuICAgIGV4dGVuZHM6IGNjLlBoeXNpY3NDb2xsaWRlcixcbiAgICBtaXhpbnM6IFtjYy5Db2xsaWRlci5Qb2x5Z29uXSxcblxuICAgIGVkaXRvcjoge1xuICAgICAgICBtZW51OiBDQ19FRElUT1IgJiYgJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0NvbGxpZGVyL1BvbHlnb24nLFxuICAgICAgICBpbnNwZWN0b3I6IENDX0VESVRPUiAmJiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9waHlzaWNzL3BvaW50cy1iYXNlLWNvbGxpZGVyLmpzJyxcbiAgICAgICAgcmVxdWlyZUNvbXBvbmVudDogY2MuUmlnaWRCb2R5XG4gICAgfSxcblxuICAgIF9jcmVhdGVTaGFwZTogZnVuY3Rpb24gKHNjYWxlKSB7XG4gICAgICAgIHZhciBzaGFwZXMgPSBbXTtcblxuICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG4gICAgICAgIFxuICAgICAgICAvLyBjaGVjayBpZiBsYXN0IHBvaW50IGVxdWFsIHRvIGZpcnN0IHBvaW50XG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoID4gMCAmJiBwb2ludHNbMF0uZXF1YWxzKHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgICAgICBwb2ludHMubGVuZ3RoIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcG9seXMgPSBQb2x5Z29uU2VwYXJhdG9yLkNvbnZleFBhcnRpdGlvbihwb2ludHMpO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2x5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBvbHkgPSBwb2x5c1tpXTtcblxuICAgICAgICAgICAgdmFyIHNoYXBlID0gbnVsbCwgdmVydGljZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBmaXJzdFZlcnRpY2UgPSBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbCA9IHBvbHkubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzaGFwZSkge1xuICAgICAgICAgICAgICAgICAgICBzaGFwZSA9IG5ldyBiMi5Qb2x5Z29uU2hhcGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwb2x5W2pdO1xuICAgICAgICAgICAgICAgIHZhciB4ID0gKHAueCArIG9mZnNldC54KS9QVE1fUkFUSU8qc2NhbGUueDtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IChwLnkgKyBvZmZzZXQueSkvUFRNX1JBVElPKnNjYWxlLnk7XG4gICAgICAgICAgICAgICAgdmFyIHYgPSBuZXcgYjIuVmVjMih4LCB5KTtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKCB2ICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZpcnN0VmVydGljZSkge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdFZlcnRpY2UgPSB2O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPT09IGIyLm1heFBvbHlnb25WZXJ0aWNlcykge1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5TZXQodmVydGljZXMsIHZlcnRpY2VzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKHNoYXBlKTtcblxuICAgICAgICAgICAgICAgICAgICBzaGFwZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGogPCBsIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljZXMgPSBbZmlyc3RWZXJ0aWNlLCB2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaGFwZSkge1xuICAgICAgICAgICAgICAgIHNoYXBlLlNldCh2ZXJ0aWNlcywgdmVydGljZXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBzaGFwZXMucHVzaChzaGFwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2hhcGVzO1xuICAgIH1cbn0pO1xuXG5jYy5QaHlzaWNzUG9seWdvbkNvbGxpZGVyID0gbW9kdWxlLmV4cG9ydHMgPSBQaHlzaWNzUG9seWdvbkNvbGxpZGVyO1xuIl19