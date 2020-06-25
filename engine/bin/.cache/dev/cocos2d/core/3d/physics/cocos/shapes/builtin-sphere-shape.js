
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cocos/shapes/builtin-sphere-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.BuiltinSphereShape = void 0;

var _builtinShape = require("./builtin-shape");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Sphere = cc.geomUtils.Sphere;

var _worldScale = new cc.Vec3();

var BuiltinSphereShape =
/*#__PURE__*/
function (_BuiltinShape) {
  _inheritsLoose(BuiltinSphereShape, _BuiltinShape);

  _createClass(BuiltinSphereShape, [{
    key: "radius",
    set: function set(radius) {
      this.localSphere.radius = radius;
      this.collider.node.getWorldScale(_worldScale);

      var s = _worldScale.maxAxis();

      this.worldSphere.radius = this.localSphere.radius * s;
    }
  }, {
    key: "localSphere",
    get: function get() {
      return this._localShape;
    }
  }, {
    key: "worldSphere",
    get: function get() {
      return this._worldShape;
    }
  }, {
    key: "sphereCollider",
    get: function get() {
      return this.collider;
    }
  }]);

  function BuiltinSphereShape(radius) {
    var _this;

    _this = _BuiltinShape.call(this) || this;
    _this._localShape = new Sphere(0, 0, 0, radius);
    _this._worldShape = new Sphere(0, 0, 0, radius);
    return _this;
  }

  var _proto = BuiltinSphereShape.prototype;

  _proto.onLoad = function onLoad() {
    _BuiltinShape.prototype.onLoad.call(this);

    this.radius = this.sphereCollider.radius;
  };

  return BuiltinSphereShape;
}(_builtinShape.BuiltinShape);

exports.BuiltinSphereShape = BuiltinSphereShape;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1aWx0aW4tc3BoZXJlLXNoYXBlLnRzIl0sIm5hbWVzIjpbIlNwaGVyZSIsImNjIiwiZ2VvbVV0aWxzIiwiX3dvcmxkU2NhbGUiLCJWZWMzIiwiQnVpbHRpblNwaGVyZVNoYXBlIiwicmFkaXVzIiwibG9jYWxTcGhlcmUiLCJjb2xsaWRlciIsIm5vZGUiLCJnZXRXb3JsZFNjYWxlIiwicyIsIm1heEF4aXMiLCJ3b3JsZFNwaGVyZSIsIl9sb2NhbFNoYXBlIiwiX3dvcmxkU2hhcGUiLCJvbkxvYWQiLCJzcGhlcmVDb2xsaWRlciIsIkJ1aWx0aW5TaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFJQSxJQUFNQSxNQUFNLEdBQUdDLEVBQUUsQ0FBQ0MsU0FBSCxDQUFhRixNQUE1Qjs7QUFDQSxJQUFJRyxXQUFXLEdBQUcsSUFBSUYsRUFBRSxDQUFDRyxJQUFQLEVBQWxCOztJQUVhQzs7Ozs7OztzQkFFR0MsUUFBZ0I7QUFDeEIsV0FBS0MsV0FBTCxDQUFpQkQsTUFBakIsR0FBMEJBLE1BQTFCO0FBQ0EsV0FBS0UsUUFBTCxDQUFjQyxJQUFkLENBQW1CQyxhQUFuQixDQUFpQ1AsV0FBakM7O0FBQ0EsVUFBTVEsQ0FBQyxHQUFHUixXQUFXLENBQUNTLE9BQVosRUFBVjs7QUFDQSxXQUFLQyxXQUFMLENBQWlCUCxNQUFqQixHQUEwQixLQUFLQyxXQUFMLENBQWlCRCxNQUFqQixHQUEwQkssQ0FBcEQ7QUFDSDs7O3dCQUVrQjtBQUNmLGFBQU8sS0FBS0csV0FBWjtBQUNIOzs7d0JBRWtCO0FBQ2YsYUFBTyxLQUFLQyxXQUFaO0FBQ0g7Ozt3QkFFcUI7QUFDbEIsYUFBTyxLQUFLUCxRQUFaO0FBQ0g7OztBQUVELDhCQUFhRixNQUFiLEVBQTZCO0FBQUE7O0FBQ3pCO0FBQ0EsVUFBS1EsV0FBTCxHQUFtQixJQUFJZCxNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0JNLE1BQXBCLENBQW5CO0FBQ0EsVUFBS1MsV0FBTCxHQUFtQixJQUFJZixNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0JNLE1BQXBCLENBQW5CO0FBSHlCO0FBSTVCOzs7O1NBRURVLFNBQUEsa0JBQVU7QUFDTiw0QkFBTUEsTUFBTjs7QUFDQSxTQUFLVixNQUFMLEdBQWMsS0FBS1csY0FBTCxDQUFvQlgsTUFBbEM7QUFDSDs7O0VBOUJtQ1kiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgQnVpbHRpblNoYXBlIH0gZnJvbSAnLi9idWlsdGluLXNoYXBlJztcbmltcG9ydCB7IElTcGhlcmVTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcbmltcG9ydCB7IFNwaGVyZUNvbGxpZGVyM0QgfSBmcm9tICcuLi8uLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrJztcblxuY29uc3QgU3BoZXJlID0gY2MuZ2VvbVV0aWxzLlNwaGVyZTtcbmxldCBfd29ybGRTY2FsZSA9IG5ldyBjYy5WZWMzKCk7XG5cbmV4cG9ydCBjbGFzcyBCdWlsdGluU3BoZXJlU2hhcGUgZXh0ZW5kcyBCdWlsdGluU2hhcGUgaW1wbGVtZW50cyBJU3BoZXJlU2hhcGUge1xuXG4gICAgc2V0IHJhZGl1cyAocmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5sb2NhbFNwaGVyZS5yYWRpdXMgPSByYWRpdXM7XG4gICAgICAgIHRoaXMuY29sbGlkZXIubm9kZS5nZXRXb3JsZFNjYWxlKF93b3JsZFNjYWxlKTtcbiAgICAgICAgY29uc3QgcyA9IF93b3JsZFNjYWxlLm1heEF4aXMoKTtcbiAgICAgICAgdGhpcy53b3JsZFNwaGVyZS5yYWRpdXMgPSB0aGlzLmxvY2FsU3BoZXJlLnJhZGl1cyAqIHM7XG4gICAgfVxuXG4gICAgZ2V0IGxvY2FsU3BoZXJlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsU2hhcGUgYXMgY2MuZ2VvbVV0aWxzLlNwaGVyZTtcbiAgICB9XG5cbiAgICBnZXQgd29ybGRTcGhlcmUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTaGFwZSBhcyBjYy5nZW9tVXRpbHMuU3BoZXJlO1xuICAgIH1cblxuICAgIGdldCBzcGhlcmVDb2xsaWRlciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxpZGVyIGFzIFNwaGVyZUNvbGxpZGVyM0Q7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKHJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2xvY2FsU2hhcGUgPSBuZXcgU3BoZXJlKDAsIDAsIDAsIHJhZGl1cyk7XG4gICAgICAgIHRoaXMuX3dvcmxkU2hhcGUgPSBuZXcgU3BoZXJlKDAsIDAsIDAsIHJhZGl1cyk7XG4gICAgfVxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5zcGhlcmVDb2xsaWRlci5yYWRpdXM7XG4gICAgfVxuXG59XG4iXX0=