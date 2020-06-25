
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var utils = _interopRequireWildcard(require("./utils"));

var _box = _interopRequireDefault(require("./box"));

var _cone = _interopRequireDefault(require("./cone"));

var _cylinder = _interopRequireDefault(require("./cylinder"));

var _plane = _interopRequireDefault(require("./plane"));

var _quad = _interopRequireDefault(require("./quad"));

var _sphere = _interopRequireDefault(require("./sphere"));

var _torus = _interopRequireDefault(require("./torus"));

var _capsule = _interopRequireDefault(require("./capsule"));

var _polyhedron = require("./polyhedron");

var _vertexData = _interopRequireDefault(require("./vertex-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * 一个创建 3D 物体顶点数据的基础模块，你可以通过 "cc.primitive" 来访问这个模块。
 * @module cc.primitive
 * @submodule cc.primitive
 * @main
 */
cc.primitive = Object.assign({
  /**
   * !#en Create box vertex data
   * !#zh 创建长方体顶点数据
   * @method box
   * @static
   * @param {Number} width
   * @param {Number} height
   * @param {Number} length
   * @param {Object} opts
   * @param {Number} opts.widthSegments
   * @param {Number} opts.heightSegments
   * @param {Number} opts.lengthSegments
   * @return {primitive.VertexData}
   */
  box: _box["default"],

  /**
   * !#en Create cone vertex data
   * !#zh 创建圆锥体顶点数据
   * @method cone
   * @static
   * @param {Number} radius
   * @param {Number} height
   * @param {Object} opts
   * @param {Number} opts.radialSegments
   * @param {Number} opts.heightSegments
   * @param {Boolean} opts.capped
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  cone: _cone["default"],

  /**
   * !#en Create cylinder vertex data
   * !#zh 创建圆柱体顶点数据
   * @method cylinder
   * @static
   * @param {Number} radiusTop
   * @param {Number} radiusBottom
   * @param {Number} height
   * @param {Object} opts
   * @param {Number} opts.radialSegments
   * @param {Number} opts.heightSegments
   * @param {Boolean} opts.capped
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  cylinder: _cylinder["default"],

  /**
   * !#en Create plane vertex data
   * !#zh 创建平台顶点数据
   * @method plane
   * @static
   * @param {Number} width
   * @param {Number} length
   * @param {Object} opts
   * @param {Number} opts.widthSegments
   * @param {Number} opts.lengthSegments
   * @return {primitive.VertexData}
   */
  plane: _plane["default"],

  /**
   * !#en Create quad vertex data
   * !#zh 创建面片顶点数据
   * @method quad
   * @static
   * @return {primitive.VertexData}
   */
  quad: _quad["default"],

  /**
   * !#en Create sphere vertex data
   * !#zh 创建球体顶点数据
   * @method sphere
   * @static
   * @param {Number} radius
   * @param {Object} opts
   * @param {Number} opts.segments
   * @return {primitive.VertexData}
   */
  sphere: _sphere["default"],

  /**
   * !#en Create torus vertex data
   * !#zh 创建圆环顶点数据
   * @method torus
   * @static
   * @param {Number} radius
   * @param {Number} tube
   * @param {Object} opts
   * @param {Number} opts.radialSegments
   * @param {Number} opts.tubularSegments
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  torus: _torus["default"],

  /**
   * !#en Create capsule vertex data
   * !#zh 创建胶囊体顶点数据
   * @method capsule
   * @static
   * @param {Number} radiusTop
   * @param {Number} radiusBottom
   * @param {Number} height
   * @param {Object} opts
   * @param {Number} opts.sides
   * @param {Number} opts.heightSegments
   * @param {Boolean} opts.capped
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  capsule: _capsule["default"],

  /**
   * !#en Create polyhedron vertex data
   * !#zh 创建多面体顶点数据
   * @method polyhedron
   * @static
   * @param {primitive.PolyhedronType} type
   * @param {Number} Size
   * @param {Object} opts
   * @param {Number} opts.sizeX
   * @param {Number} opts.sizeY
   * @param {Number} opts.sizeZ
   * @return {primitive.VertexData}
   */
  polyhedron: _polyhedron.polyhedron,
  PolyhedronType: _polyhedron.PolyhedronType,
  VertexData: _vertexData["default"]
}, utils);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImNjIiwicHJpbWl0aXZlIiwiT2JqZWN0IiwiYXNzaWduIiwiYm94IiwiY29uZSIsImN5bGluZGVyIiwicGxhbmUiLCJxdWFkIiwic3BoZXJlIiwidG9ydXMiLCJjYXBzdWxlIiwicG9seWhlZHJvbiIsIlBvbHloZWRyb25UeXBlIiwiVmVydGV4RGF0YSIsInV0aWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7OztBQU9BQSxFQUFFLENBQUNDLFNBQUgsR0FBZUMsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFDekI7Ozs7Ozs7Ozs7Ozs7O0FBY0FDLEVBQUFBLEdBQUcsRUFBSEEsZUFmeUI7O0FBZ0J6Qjs7Ozs7Ozs7Ozs7Ozs7QUFjQUMsRUFBQUEsSUFBSSxFQUFKQSxnQkE5QnlCOztBQStCekI7Ozs7Ozs7Ozs7Ozs7OztBQWVBQyxFQUFBQSxRQUFRLEVBQVJBLG9CQTlDeUI7O0FBK0N6Qjs7Ozs7Ozs7Ozs7O0FBWUFDLEVBQUFBLEtBQUssRUFBTEEsaUJBM0R5Qjs7QUE0RHpCOzs7Ozs7O0FBT0FDLEVBQUFBLElBQUksRUFBSkEsZ0JBbkV5Qjs7QUFvRXpCOzs7Ozs7Ozs7O0FBVUFDLEVBQUFBLE1BQU0sRUFBTkEsa0JBOUV5Qjs7QUErRXpCOzs7Ozs7Ozs7Ozs7O0FBYUFDLEVBQUFBLEtBQUssRUFBTEEsaUJBNUZ5Qjs7QUE2RnpCOzs7Ozs7Ozs7Ozs7Ozs7QUFlQUMsRUFBQUEsT0FBTyxFQUFQQSxtQkE1R3lCOztBQTZHekI7Ozs7Ozs7Ozs7Ozs7QUFhQUMsRUFBQUEsVUFBVSxFQUFWQSxzQkExSHlCO0FBNEh6QkMsRUFBQUEsY0FBYyxFQUFkQSwwQkE1SHlCO0FBNkh6QkMsRUFBQUEsVUFBVSxFQUFWQTtBQTdIeUIsQ0FBZCxFQThIWkMsS0E5SFksQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGJveCBmcm9tICcuL2JveCc7XG5pbXBvcnQgY29uZSBmcm9tICcuL2NvbmUnO1xuaW1wb3J0IGN5bGluZGVyIGZyb20gJy4vY3lsaW5kZXInO1xuaW1wb3J0IHBsYW5lIGZyb20gJy4vcGxhbmUnO1xuaW1wb3J0IHF1YWQgZnJvbSAnLi9xdWFkJztcbmltcG9ydCBzcGhlcmUgZnJvbSAnLi9zcGhlcmUnO1xuaW1wb3J0IHRvcnVzIGZyb20gJy4vdG9ydXMnO1xuaW1wb3J0IGNhcHN1bGUgZnJvbSAnLi9jYXBzdWxlJztcbmltcG9ydCB7IFBvbHloZWRyb25UeXBlLCBwb2x5aGVkcm9uIH0gZnJvbSAnLi9wb2x5aGVkcm9uJztcbmltcG9ydCBWZXJ0ZXhEYXRhIGZyb20gJy4vdmVydGV4LWRhdGEnO1xuXG4vKipcbiAqIOS4gOS4quWIm+W7uiAzRCDniankvZPpobbngrnmlbDmja7nmoTln7rnoYDmqKHlnZfvvIzkvaDlj6/ku6XpgJrov4cgXCJjYy5wcmltaXRpdmVcIiDmnaXorr/pl67ov5nkuKrmqKHlnZfjgIJcbiAqIEBtb2R1bGUgY2MucHJpbWl0aXZlXG4gKiBAc3VibW9kdWxlIGNjLnByaW1pdGl2ZVxuICogQG1haW5cbiAqL1xuXG5jYy5wcmltaXRpdmUgPSBPYmplY3QuYXNzaWduKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIENyZWF0ZSBib3ggdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uumVv+aWueS9k+mhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgYm94XG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy53aWR0aFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuaGVpZ2h0U2VnbWVudHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5sZW5ndGhTZWdtZW50c1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIGJveCxcbiAgICAvKipcbiAgICAgKiAhI2VuIENyZWF0ZSBjb25lIHZlcnRleCBkYXRhXG4gICAgICogISN6aCDliJvlu7rlnIbplKXkvZPpobbngrnmlbDmja5cbiAgICAgKiBAbWV0aG9kIGNvbmVcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnJhZGlhbFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuaGVpZ2h0U2VnbWVudHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdHMuY2FwcGVkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuYXJjXG4gICAgICogQHJldHVybiB7cHJpbWl0aXZlLlZlcnRleERhdGF9XG4gICAgICovXG4gICAgY29uZSxcbiAgICAvKipcbiAgICAgKiAhI2VuIENyZWF0ZSBjeWxpbmRlciB2ZXJ0ZXggZGF0YVxuICAgICAqICEjemgg5Yib5bu65ZyG5p+x5L2T6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCBjeWxpbmRlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzVG9wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c0JvdHRvbVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnJhZGlhbFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuaGVpZ2h0U2VnbWVudHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdHMuY2FwcGVkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuYXJjXG4gICAgICogQHJldHVybiB7cHJpbWl0aXZlLlZlcnRleERhdGF9XG4gICAgICovXG4gICAgY3lsaW5kZXIsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgcGxhbmUgdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uuW5s+WPsOmhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgcGxhbmVcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMud2lkdGhTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmxlbmd0aFNlZ21lbnRzXG4gICAgICogQHJldHVybiB7cHJpbWl0aXZlLlZlcnRleERhdGF9XG4gICAgICovXG4gICAgcGxhbmUsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgcXVhZCB2ZXJ0ZXggZGF0YVxuICAgICAqICEjemgg5Yib5bu66Z2i54mH6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCBxdWFkXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIHF1YWQsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgc3BoZXJlIHZlcnRleCBkYXRhXG4gICAgICogISN6aCDliJvlu7rnkIPkvZPpobbngrnmlbDmja5cbiAgICAgKiBAbWV0aG9kIHNwaGVyZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5zZWdtZW50c1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIHNwaGVyZSxcbiAgICAvKipcbiAgICAgKiAhI2VuIENyZWF0ZSB0b3J1cyB2ZXJ0ZXggZGF0YVxuICAgICAqICEjemgg5Yib5bu65ZyG546v6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCB0b3J1c1xuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHR1YmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnJhZGlhbFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMudHVidWxhclNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuYXJjXG4gICAgICogQHJldHVybiB7cHJpbWl0aXZlLlZlcnRleERhdGF9XG4gICAgICovXG4gICAgdG9ydXMsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgY2Fwc3VsZSB2ZXJ0ZXggZGF0YVxuICAgICAqICEjemgg5Yib5bu66IO25ZuK5L2T6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCBjYXBzdWxlXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNUb3BcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzQm90dG9tXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuc2lkZXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5oZWlnaHRTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0cy5jYXBwZWRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5hcmNcbiAgICAgKiBAcmV0dXJuIHtwcmltaXRpdmUuVmVydGV4RGF0YX1cbiAgICAgKi9cbiAgICBjYXBzdWxlLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ3JlYXRlIHBvbHloZWRyb24gdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uuWkmumdouS9k+mhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgcG9seWhlZHJvblxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge3ByaW1pdGl2ZS5Qb2x5aGVkcm9uVHlwZX0gdHlwZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBTaXplXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5zaXplWFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnNpemVZXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuc2l6ZVpcbiAgICAgKiBAcmV0dXJuIHtwcmltaXRpdmUuVmVydGV4RGF0YX1cbiAgICAgKi9cbiAgICBwb2x5aGVkcm9uLFxuXG4gICAgUG9seWhlZHJvblR5cGUsXG4gICAgVmVydGV4RGF0YSxcbn0sIHV0aWxzKTsiXX0=