
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/physics-ray-result.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.PhysicsRayResult = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var Vec3 = cc.Vec3;
/**
 * !#en
 * Used to store physical ray detection results
 * !#zh
 * 用于保存物理射线检测结果
 * @class PhysicsRayResult
 */

var PhysicsRayResult =
/*#__PURE__*/
function () {
  function PhysicsRayResult() {
    this._hitPoint = new Vec3();
    this._distance = 0;
    this._collidier = null;
  }

  var _proto = PhysicsRayResult.prototype;

  /**
   * !#en
   * Set up ray. This method is used internally by the engine. Do not call it from an external script
   * !#zh
   * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用
   * @method _assign
   * @param {Vec3} hitPoint
   * @param {number} distance
   * @param {Collider3D} collider
   */
  _proto._assign = function _assign(hitPoint, distance, collider) {
    Vec3.copy(this._hitPoint, hitPoint);
    this._distance = distance;
    this._collidier = collider;
  }
  /**
   * !#en
   * Clone
   * !#zh
   * 克隆
   * @method clone
   */
  ;

  _proto.clone = function clone() {
    var c = new PhysicsRayResult();
    Vec3.copy(c._hitPoint, this._hitPoint);
    c._distance = this._distance;
    c._collidier = this._collidier;
    return c;
  };

  _createClass(PhysicsRayResult, [{
    key: "hitPoint",

    /**
     * !#en
     * Hit the point
     * !#zh
     * 击中点
     * @property {Vec3} hitPoint
     * @readonly
     */
    get: function get() {
      return this._hitPoint;
    }
    /**
     * !#en
     * Distance
     * !#zh
     * 距离
     * @property {number} distance
     * @readonly
     */

  }, {
    key: "distance",
    get: function get() {
      return this._distance;
    }
    /**
     * !#en
     * Hit the collision box
     * !#zh
     * 击中的碰撞盒
     * @property {Collider3D} collider
     * @readonly
     */

  }, {
    key: "collider",
    get: function get() {
      return this._collidier;
    }
  }]);

  return PhysicsRayResult;
}();

exports.PhysicsRayResult = PhysicsRayResult;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBoeXNpY3MtcmF5LXJlc3VsdC50cyJdLCJuYW1lcyI6WyJWZWMzIiwiY2MiLCJQaHlzaWNzUmF5UmVzdWx0IiwiX2hpdFBvaW50IiwiX2Rpc3RhbmNlIiwiX2NvbGxpZGllciIsIl9hc3NpZ24iLCJoaXRQb2ludCIsImRpc3RhbmNlIiwiY29sbGlkZXIiLCJjb3B5IiwiY2xvbmUiLCJjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsSUFBSSxHQUFHQyxFQUFFLENBQUNELElBQWhCO0FBRUE7Ozs7Ozs7O0lBT2FFOzs7O1NBc0NEQyxZQUFxQixJQUFJSCxJQUFKO1NBQ3JCSSxZQUFvQjtTQUNwQkMsYUFBZ0M7Ozs7O0FBRXhDOzs7Ozs7Ozs7O1NBVU9DLFVBQVAsaUJBQWdCQyxRQUFoQixFQUFtQ0MsUUFBbkMsRUFBcURDLFFBQXJELEVBQTJFO0FBQ3ZFVCxJQUFBQSxJQUFJLENBQUNVLElBQUwsQ0FBVSxLQUFLUCxTQUFmLEVBQTBCSSxRQUExQjtBQUNBLFNBQUtILFNBQUwsR0FBaUJJLFFBQWpCO0FBQ0EsU0FBS0gsVUFBTCxHQUFrQkksUUFBbEI7QUFDSDtBQUVEOzs7Ozs7Ozs7U0FPT0UsUUFBUCxpQkFBZ0I7QUFDWixRQUFNQyxDQUFDLEdBQUcsSUFBSVYsZ0JBQUosRUFBVjtBQUNBRixJQUFBQSxJQUFJLENBQUNVLElBQUwsQ0FBVUUsQ0FBQyxDQUFDVCxTQUFaLEVBQXVCLEtBQUtBLFNBQTVCO0FBQ0FTLElBQUFBLENBQUMsQ0FBQ1IsU0FBRixHQUFjLEtBQUtBLFNBQW5CO0FBQ0FRLElBQUFBLENBQUMsQ0FBQ1AsVUFBRixHQUFlLEtBQUtBLFVBQXBCO0FBQ0EsV0FBT08sQ0FBUDtBQUNIOzs7OztBQXJFRDs7Ozs7Ozs7d0JBUXlCO0FBQ3JCLGFBQU8sS0FBS1QsU0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7O3dCQVF3QjtBQUNwQixhQUFPLEtBQUtDLFNBQVo7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozt3QkFRNEI7QUFDeEIsYUFBTyxLQUFLQyxVQUFaO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgQ29sbGlkZXIzRCB9IGZyb20gJy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xuY29uc3QgVmVjMyA9IGNjLlZlYzM7XG5cbi8qKlxuICogISNlblxuICogVXNlZCB0byBzdG9yZSBwaHlzaWNhbCByYXkgZGV0ZWN0aW9uIHJlc3VsdHNcbiAqICEjemhcbiAqIOeUqOS6juS/neWtmOeJqeeQhuWwhOe6v+ajgOa1i+e7k+aenFxuICogQGNsYXNzIFBoeXNpY3NSYXlSZXN1bHRcbiAqL1xuZXhwb3J0IGNsYXNzIFBoeXNpY3NSYXlSZXN1bHQge1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEhpdCB0aGUgcG9pbnRcbiAgICAgKiAhI3poXG4gICAgICog5Ye75Lit54K5XG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBoaXRQb2ludFxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGdldCBoaXRQb2ludCAoKTogY2MuVmVjMyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oaXRQb2ludDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGlzdGFuY2VcbiAgICAgKiAhI3poXG4gICAgICog6Led56a7XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRpc3RhbmNlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZ2V0IGRpc3RhbmNlICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzdGFuY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEhpdCB0aGUgY29sbGlzaW9uIGJveFxuICAgICAqICEjemhcbiAgICAgKiDlh7vkuK3nmoTnorDmkp7nm5JcbiAgICAgKiBAcHJvcGVydHkge0NvbGxpZGVyM0R9IGNvbGxpZGVyXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZ2V0IGNvbGxpZGVyICgpOiBDb2xsaWRlcjNEIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGllciE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGl0UG9pbnQ6IGNjLlZlYzMgPSBuZXcgVmVjMygpO1xuICAgIHByaXZhdGUgX2Rpc3RhbmNlOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX2NvbGxpZGllcjogQ29sbGlkZXIzRCB8IG51bGwgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldCB1cCByYXkuIFRoaXMgbWV0aG9kIGlzIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgZW5naW5lLiBEbyBub3QgY2FsbCBpdCBmcm9tIGFuIGV4dGVybmFsIHNjcmlwdFxuICAgICAqICEjemhcbiAgICAgKiDorr7nva7lsITnur/vvIzmraTmlrnms5XnlLHlvJXmk47lhoXpg6jkvb/nlKjvvIzor7fli7/lnKjlpJbpg6johJrmnKzosIPnlKhcbiAgICAgKiBAbWV0aG9kIF9hc3NpZ25cbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGhpdFBvaW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlXG4gICAgICogQHBhcmFtIHtDb2xsaWRlcjNEfSBjb2xsaWRlclxuICAgICAqL1xuICAgIHB1YmxpYyBfYXNzaWduIChoaXRQb2ludDogY2MuVmVjMywgZGlzdGFuY2U6IG51bWJlciwgY29sbGlkZXI6IENvbGxpZGVyM0QpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2hpdFBvaW50LCBoaXRQb2ludCk7XG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgIHRoaXMuX2NvbGxpZGllciA9IGNvbGxpZGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDbG9uZVxuICAgICAqICEjemhcbiAgICAgKiDlhYvpmoZcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICovXG4gICAgcHVibGljIGNsb25lICgpIHtcbiAgICAgICAgY29uc3QgYyA9IG5ldyBQaHlzaWNzUmF5UmVzdWx0KCk7XG4gICAgICAgIFZlYzMuY29weShjLl9oaXRQb2ludCwgdGhpcy5faGl0UG9pbnQpO1xuICAgICAgICBjLl9kaXN0YW5jZSA9IHRoaXMuX2Rpc3RhbmNlO1xuICAgICAgICBjLl9jb2xsaWRpZXIgPSB0aGlzLl9jb2xsaWRpZXI7XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cbn1cbiJdfQ==