
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/shapes/cannon-box-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonBoxShape = void 0;

var _cannon = _interopRequireDefault(require("../../../../../../external/cannon/cannon"));

var _cannonUtil = require("../cannon-util");

var _cannonShape = require("./cannon-shape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Vec3 = cc.Vec3;
var v3_0 = new Vec3();

var CannonBoxShape =
/*#__PURE__*/
function (_CannonShape) {
  _inheritsLoose(CannonBoxShape, _CannonShape);

  _createClass(CannonBoxShape, [{
    key: "boxCollider",
    get: function get() {
      return this.collider;
    }
  }, {
    key: "box",
    get: function get() {
      return this._shape;
    }
  }]);

  function CannonBoxShape(size) {
    var _this;

    _this = _CannonShape.call(this) || this;
    _this.halfExtent = new _cannon["default"].Vec3();
    Vec3.multiplyScalar(_this.halfExtent, size, 0.5);
    _this._shape = new _cannon["default"].Box(_this.halfExtent.clone());
    return _this;
  }

  var _proto = CannonBoxShape.prototype;

  _proto.onLoad = function onLoad() {
    _CannonShape.prototype.onLoad.call(this);

    this.size = this.boxCollider.size;
  };

  _proto.setScale = function setScale(scale) {
    _CannonShape.prototype.setScale.call(this, scale);

    this.size = this.boxCollider.size;
  };

  _createClass(CannonBoxShape, [{
    key: "size",
    set: function set(v) {
      this.collider.node.getWorldScale(v3_0);
      Vec3.multiplyScalar(this.halfExtent, v, 0.5);
      Vec3.multiply(this.box.halfExtents, this.halfExtent, v3_0);
      this.box.updateConvexPolyhedronRepresentation();

      if (this._index != -1) {
        (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }
  }]);

  return CannonBoxShape;
}(_cannonShape.CannonShape);

exports.CannonBoxShape = CannonBoxShape;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbm5vbi1ib3gtc2hhcGUudHMiXSwibmFtZXMiOlsiVmVjMyIsImNjIiwidjNfMCIsIkNhbm5vbkJveFNoYXBlIiwiY29sbGlkZXIiLCJfc2hhcGUiLCJzaXplIiwiaGFsZkV4dGVudCIsIkNBTk5PTiIsIm11bHRpcGx5U2NhbGFyIiwiQm94IiwiY2xvbmUiLCJvbkxvYWQiLCJib3hDb2xsaWRlciIsInNldFNjYWxlIiwic2NhbGUiLCJ2Iiwibm9kZSIsImdldFdvcmxkU2NhbGUiLCJtdWx0aXBseSIsImJveCIsImhhbGZFeHRlbnRzIiwidXBkYXRlQ29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uIiwiX2luZGV4IiwiX2JvZHkiLCJDYW5ub25TaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUtBLElBQU1BLElBQUksR0FBR0MsRUFBRSxDQUFDRCxJQUFoQjtBQUNBLElBQU1FLElBQUksR0FBRyxJQUFJRixJQUFKLEVBQWI7O0lBRWFHOzs7Ozs7O3dCQUVpQjtBQUN0QixhQUFPLEtBQUtDLFFBQVo7QUFDSDs7O3dCQUVpQjtBQUNkLGFBQU8sS0FBS0MsTUFBWjtBQUNIOzs7QUFHRCwwQkFBYUMsSUFBYixFQUE0QjtBQUFBOztBQUN4QjtBQUR3QixVQURuQkMsVUFDbUIsR0FETyxJQUFJQyxtQkFBT1IsSUFBWCxFQUNQO0FBRXhCQSxJQUFBQSxJQUFJLENBQUNTLGNBQUwsQ0FBb0IsTUFBS0YsVUFBekIsRUFBcUNELElBQXJDLEVBQTJDLEdBQTNDO0FBQ0EsVUFBS0QsTUFBTCxHQUFjLElBQUlHLG1CQUFPRSxHQUFYLENBQWUsTUFBS0gsVUFBTCxDQUFnQkksS0FBaEIsRUFBZixDQUFkO0FBSHdCO0FBSTNCOzs7O1NBWURDLFNBQUEsa0JBQVU7QUFDTiwyQkFBTUEsTUFBTjs7QUFDQSxTQUFLTixJQUFMLEdBQVksS0FBS08sV0FBTCxDQUFpQlAsSUFBN0I7QUFDSDs7U0FFRFEsV0FBQSxrQkFBVUMsS0FBVixFQUFnQztBQUM1QiwyQkFBTUQsUUFBTixZQUFlQyxLQUFmOztBQUNBLFNBQUtULElBQUwsR0FBWSxLQUFLTyxXQUFMLENBQWlCUCxJQUE3QjtBQUNIOzs7O3NCQWxCU1UsR0FBYztBQUNwQixXQUFLWixRQUFMLENBQWNhLElBQWQsQ0FBbUJDLGFBQW5CLENBQWlDaEIsSUFBakM7QUFDQUYsTUFBQUEsSUFBSSxDQUFDUyxjQUFMLENBQW9CLEtBQUtGLFVBQXpCLEVBQXFDUyxDQUFyQyxFQUF3QyxHQUF4QztBQUNBaEIsTUFBQUEsSUFBSSxDQUFDbUIsUUFBTCxDQUFjLEtBQUtDLEdBQUwsQ0FBU0MsV0FBdkIsRUFBb0MsS0FBS2QsVUFBekMsRUFBcURMLElBQXJEO0FBQ0EsV0FBS2tCLEdBQUwsQ0FBU0Usb0NBQVQ7O0FBQ0EsVUFBSSxLQUFLQyxNQUFMLElBQWUsQ0FBQyxDQUFwQixFQUF1QjtBQUNuQiw0Q0FBbUIsS0FBS0MsS0FBeEI7QUFDSDtBQUNKOzs7O0VBekIrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IENBTk5PTiBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9jYW5ub24vY2Fubm9uJztcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xuaW1wb3J0IHsgSUJveFNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLWNvbW1vbic7XG5pbXBvcnQgeyBCb3hDb2xsaWRlcjNEIH0gZnJvbSAnLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XG5cbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuY29uc3QgdjNfMCA9IG5ldyBWZWMzKCk7XG5cbmV4cG9ydCBjbGFzcyBDYW5ub25Cb3hTaGFwZSBleHRlbmRzIENhbm5vblNoYXBlIGltcGxlbWVudHMgSUJveFNoYXBlIHtcblxuICAgIHB1YmxpYyBnZXQgYm94Q29sbGlkZXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsaWRlciBhcyBCb3hDb2xsaWRlcjNEO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgYm94ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIENBTk5PTi5Cb3g7XG4gICAgfVxuXG4gICAgcmVhZG9ubHkgaGFsZkV4dGVudDogQ0FOTk9OLlZlYzMgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcbiAgICBjb25zdHJ1Y3RvciAoc2l6ZTogY2MuVmVjMykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKHRoaXMuaGFsZkV4dGVudCwgc2l6ZSwgMC41KTtcbiAgICAgICAgdGhpcy5fc2hhcGUgPSBuZXcgQ0FOTk9OLkJveCh0aGlzLmhhbGZFeHRlbnQuY2xvbmUoKSk7XG4gICAgfVxuXG4gICAgc2V0IHNpemUgKHY6IElWZWMzTGlrZSkge1xuICAgICAgICB0aGlzLmNvbGxpZGVyLm5vZGUuZ2V0V29ybGRTY2FsZSh2M18wKTtcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcih0aGlzLmhhbGZFeHRlbnQsIHYsIDAuNSk7XG4gICAgICAgIFZlYzMubXVsdGlwbHkodGhpcy5ib3guaGFsZkV4dGVudHMsIHRoaXMuaGFsZkV4dGVudCwgdjNfMCk7XG4gICAgICAgIHRoaXMuYm94LnVwZGF0ZUNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5faW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xuICAgICAgICB0aGlzLnNpemUgPSB0aGlzLmJveENvbGxpZGVyLnNpemU7XG4gICAgfVxuXG4gICAgc2V0U2NhbGUgKHNjYWxlOiBjYy5WZWMzKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNldFNjYWxlKHNjYWxlKTtcbiAgICAgICAgdGhpcy5zaXplID0gdGhpcy5ib3hDb2xsaWRlci5zaXplO1xuICAgIH1cbn1cbiJdfQ==