
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/vertex-data.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/**
 * @class primitive.VertexData
 * @param {number[]} positions 
 * @param {number[]} normals 
 * @param {number[]} uvs 
 * @param {number[]} indices 
 * @param {Vec3} minPos 
 * @param {Vec3} maxPos 
 * @param {number} boundingRadius 
 */
var VertexData =
/**
 * @property {number[]} positions
 */

/**
 * @property {number[]} normals
 */

/**
 * @property {number[]} uvs
 */

/**
 * @property {[Number]} indices
 */

/**
 * @property {Vec3} minPos
 */

/**
 * @property {Vec3} maxPos
 */

/**
 * @property {number} boundingRadius
 */
function VertexData(positions, normals, uvs, indices, minPos, maxPos, boundingRadius) {
  this.positions = void 0;
  this.normals = void 0;
  this.uvs = void 0;
  this.indices = void 0;
  this.minPos = void 0;
  this.maxPos = void 0;
  this.boundingRadius = void 0;
  this.positions = positions;
  this.normals = normals;
  this.uvs = uvs;
  this.indices = indices;
  this.minPos = minPos;
  this.maxPos = maxPos;
  this.boundingRadius = boundingRadius;
};

exports["default"] = VertexData;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnRleC1kYXRhLnRzIl0sIm5hbWVzIjpbIlZlcnRleERhdGEiLCJwb3NpdGlvbnMiLCJub3JtYWxzIiwidXZzIiwiaW5kaWNlcyIsIm1pblBvcyIsIm1heFBvcyIsImJvdW5kaW5nUmFkaXVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7SUFVcUJBO0FBQ2pCOzs7O0FBSUE7Ozs7QUFJQTs7OztBQUlBOzs7O0FBSUE7Ozs7QUFJQTs7OztBQUlBOzs7QUFLQSxvQkFBWUMsU0FBWixFQUFpQ0MsT0FBakMsRUFBb0RDLEdBQXBELEVBQW1FQyxPQUFuRSxFQUFzRkMsTUFBdEYsRUFBb0dDLE1BQXBHLEVBQWtIQyxjQUFsSCxFQUEwSTtBQUFBLE9BMUIxSU4sU0EwQjBJO0FBQUEsT0F0QjFJQyxPQXNCMEk7QUFBQSxPQWxCMUlDLEdBa0IwSTtBQUFBLE9BZDFJQyxPQWMwSTtBQUFBLE9BVjFJQyxNQVUwSTtBQUFBLE9BTjFJQyxNQU0wSTtBQUFBLE9BRjFJQyxjQUUwSTtBQUN0SSxPQUFLTixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLE9BQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLE9BQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNBLE9BQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLE9BQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtDLGNBQUwsR0FBc0JBLGNBQXRCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjMyBmcm9tICcuLi8uLi92YWx1ZS10eXBlcy92ZWMzJztcblxuLyoqXG4gKiBAY2xhc3MgcHJpbWl0aXZlLlZlcnRleERhdGFcbiAqIEBwYXJhbSB7bnVtYmVyW119IHBvc2l0aW9ucyBcbiAqIEBwYXJhbSB7bnVtYmVyW119IG5vcm1hbHMgXG4gKiBAcGFyYW0ge251bWJlcltdfSB1dnMgXG4gKiBAcGFyYW0ge251bWJlcltdfSBpbmRpY2VzIFxuICogQHBhcmFtIHtWZWMzfSBtaW5Qb3MgXG4gKiBAcGFyYW0ge1ZlYzN9IG1heFBvcyBcbiAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZGluZ1JhZGl1cyBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVydGV4RGF0YSB7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJbXX0gcG9zaXRpb25zXG4gICAgICovXG4gICAgcG9zaXRpb25zOiBudW1iZXJbXTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge251bWJlcltdfSBub3JtYWxzXG4gICAgICovXG4gICAgbm9ybWFsczogbnVtYmVyW107XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJbXX0gdXZzXG4gICAgICovXG4gICAgdXZzOiBudW1iZXJbXTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1tOdW1iZXJdfSBpbmRpY2VzXG4gICAgICovXG4gICAgaW5kaWNlczogbnVtYmVyW107XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBtaW5Qb3NcbiAgICAgKi9cbiAgICBtaW5Qb3M6IFZlYzM7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBtYXhQb3NcbiAgICAgKi9cbiAgICBtYXhQb3M6IFZlYzM7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGJvdW5kaW5nUmFkaXVzXG4gICAgICovXG4gICAgYm91bmRpbmdSYWRpdXM6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uczogbnVtYmVyW10sIG5vcm1hbHM6IG51bWJlcltdLCB1dnM6IG51bWJlcltdLCBpbmRpY2VzOiBudW1iZXJbXSwgbWluUG9zOiBWZWMzLCBtYXhQb3M6IFZlYzMsIGJvdW5kaW5nUmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBwb3NpdGlvbnM7XG4gICAgICAgIHRoaXMubm9ybWFscyA9IG5vcm1hbHM7XG4gICAgICAgIHRoaXMudXZzID0gdXZzO1xuICAgICAgICB0aGlzLmluZGljZXMgPSBpbmRpY2VzO1xuICAgICAgICB0aGlzLm1pblBvcyA9IG1pblBvcztcbiAgICAgICAgdGhpcy5tYXhQb3MgPSBtYXhQb3M7XG4gICAgICAgIHRoaXMuYm91bmRpbmdSYWRpdXMgPSBib3VuZGluZ1JhZGl1cztcbiAgICB9XG59XG4iXX0=