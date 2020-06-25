
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/enums.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

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

/**
 * !#en Shape type.
 * @enum geomUtils.enums
 */
var _default = {
  /**
   * !#en Ray.
   * !#zh 射线。
   * @property {Number} SHAPE_RAY
   * @default 1 << 0
   */
  SHAPE_RAY: 1 << 0,

  /**
   * !#en Line.
   * !#zh 直线。
   * @property {Number} SHAPE_LINE
   * @default 2
  */
  SHAPE_LINE: 1 << 1,

  /**
   * !#en Sphere.
   * !#zh 球。
   * @property {Number} SHAPE_SPHERE
   * @default 4
  */
  SHAPE_SPHERE: 1 << 2,

  /**
   * !#en Aabb.
   * !#zh 包围盒。
   * @property {Number} SHAPE_AABB
  */
  SHAPE_AABB: 1 << 3,

  /**
   * !#en Obb.
   * !#zh 有向包围盒。
   * @property {Number} SHAPE_OBB
  */
  SHAPE_OBB: 1 << 4,

  /**
   * !#en Plane.
   * !#zh 平面。
   * @property {Number} SHAPE_PLANE
  */
  SHAPE_PLANE: 1 << 5,

  /**
   * !#en Triangle.
   * !#zh 三角形。
   * @property {Number} SHAPE_TRIANGLE
  */
  SHAPE_TRIANGLE: 1 << 6,

  /**
   * !#en Frustum.
   * !#zh 平截头体。
   * @property {Number} SHAPE_FRUSTUM
  */
  SHAPE_FRUSTUM: 1 << 7,

  /**
   * !#en frustum accurate.
   * !#zh 平截头体。
   * @property {Number} SHAPE_FRUSTUM_ACCURATE
  */
  SHAPE_FRUSTUM_ACCURATE: 1 << 8
};
exports["default"] = _default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudW1zLnRzIl0sIm5hbWVzIjpbIlNIQVBFX1JBWSIsIlNIQVBFX0xJTkUiLCJTSEFQRV9TUEhFUkUiLCJTSEFQRV9BQUJCIiwiU0hBUEVfT0JCIiwiU0hBUEVfUExBTkUiLCJTSEFQRV9UUklBTkdMRSIsIlNIQVBFX0ZSVVNUVU0iLCJTSEFQRV9GUlVTVFVNX0FDQ1VSQVRFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7ZUFJZTtBQUNYOzs7Ozs7QUFNQUEsRUFBQUEsU0FBUyxFQUFHLEtBQUssQ0FQTjs7QUFRWDs7Ozs7O0FBTUFDLEVBQUFBLFVBQVUsRUFBRyxLQUFLLENBZFA7O0FBZVg7Ozs7OztBQU1BQyxFQUFBQSxZQUFZLEVBQUcsS0FBSyxDQXJCVDs7QUFzQlg7Ozs7O0FBS0FDLEVBQUFBLFVBQVUsRUFBRyxLQUFLLENBM0JQOztBQTRCWDs7Ozs7QUFLQUMsRUFBQUEsU0FBUyxFQUFHLEtBQUssQ0FqQ047O0FBa0NYOzs7OztBQUtBQyxFQUFBQSxXQUFXLEVBQUcsS0FBSyxDQXZDUjs7QUF3Q1g7Ozs7O0FBS0FDLEVBQUFBLGNBQWMsRUFBRyxLQUFLLENBN0NYOztBQThDWDs7Ozs7QUFLQUMsRUFBQUEsYUFBYSxFQUFHLEtBQUssQ0FuRFY7O0FBb0RYOzs7OztBQUtBQyxFQUFBQSxzQkFBc0IsRUFBRyxLQUFLO0FBekRuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gU2hhcGUgdHlwZS5cbiAqIEBlbnVtIGdlb21VdGlscy5lbnVtc1xuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICogISNlbiBSYXkuXG4gICAgICogISN6aCDlsITnur/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0hBUEVfUkFZXG4gICAgICogQGRlZmF1bHQgMSA8PCAwXG4gICAgICovXG4gICAgU0hBUEVfUkFZOiAoMSA8PCAwKSxcbiAgICAvKipcbiAgICAgKiAhI2VuIExpbmUuXG4gICAgICogISN6aCDnm7Tnur/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0hBUEVfTElORVxuICAgICAqIEBkZWZhdWx0IDJcbiAgICAqL1xuICAgIFNIQVBFX0xJTkU6ICgxIDw8IDEpLFxuICAgIC8qKlxuICAgICAqICEjZW4gU3BoZXJlLlxuICAgICAqICEjemgg55CD44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNIQVBFX1NQSEVSRVxuICAgICAqIEBkZWZhdWx0IDRcbiAgICAqL1xuICAgIFNIQVBFX1NQSEVSRTogKDEgPDwgMiksXG4gICAgLyoqXG4gICAgICogISNlbiBBYWJiLlxuICAgICAqICEjemgg5YyF5Zu055uS44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNIQVBFX0FBQkJcbiAgICAqL1xuICAgIFNIQVBFX0FBQkI6ICgxIDw8IDMpLFxuICAgIC8qKlxuICAgICAqICEjZW4gT2JiLlxuICAgICAqICEjemgg5pyJ5ZCR5YyF5Zu055uS44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNIQVBFX09CQlxuICAgICovXG4gICAgU0hBUEVfT0JCOiAoMSA8PCA0KSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFBsYW5lLlxuICAgICAqICEjemgg5bmz6Z2i44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNIQVBFX1BMQU5FXG4gICAgKi9cbiAgICBTSEFQRV9QTEFORTogKDEgPDwgNSksXG4gICAgLyoqXG4gICAgICogISNlbiBUcmlhbmdsZS5cbiAgICAgKiAhI3poIOS4ieinkuW9ouOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSEFQRV9UUklBTkdMRVxuICAgICovXG4gICAgU0hBUEVfVFJJQU5HTEU6ICgxIDw8IDYpLFxuICAgIC8qKlxuICAgICAqICEjZW4gRnJ1c3R1bS5cbiAgICAgKiAhI3poIOW5s+aIquWktOS9k+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSEFQRV9GUlVTVFVNXG4gICAgKi9cbiAgICBTSEFQRV9GUlVTVFVNOiAoMSA8PCA3KSxcbiAgICAvKipcbiAgICAgKiAhI2VuIGZydXN0dW0gYWNjdXJhdGUuXG4gICAgICogISN6aCDlubPmiKrlpLTkvZPjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0hBUEVfRlJVU1RVTV9BQ0NVUkFURVxuICAgICovXG4gICAgU0hBUEVfRlJVU1RVTV9BQ0NVUkFURTogKDEgPDwgOCksXG59O1xuICAiXX0=