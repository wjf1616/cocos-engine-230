
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/shapes/cannon-sphere-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonSphereShape = void 0;

var _cannon = _interopRequireDefault(require("../../../../../../external/cannon/cannon"));

var _cannonUtil = require("../cannon-util");

var _cannonShape = require("./cannon-shape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var v3_0 = new cc.Vec3();

var CannonSphereShape =
/*#__PURE__*/
function (_CannonShape) {
  _inheritsLoose(CannonSphereShape, _CannonShape);

  _createClass(CannonSphereShape, [{
    key: "sphereCollider",
    get: function get() {
      return this.collider;
    }
  }, {
    key: "sphere",
    get: function get() {
      return this._shape;
    }
  }, {
    key: "radius",
    get: function get() {
      return this._radius;
    },
    set: function set(v) {
      this.collider.node.getWorldScale(v3_0);
      var max = v3_0.maxAxis();
      this.sphere.radius = v * Math.abs(max);
      this.sphere.updateBoundingSphereRadius();

      if (this._index != -1) {
        (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }
  }]);

  function CannonSphereShape(radius) {
    var _this;

    _this = _CannonShape.call(this) || this;
    _this._radius = void 0;
    _this._radius = radius;
    _this._shape = new _cannon["default"].Sphere(_this._radius);
    return _this;
  }

  var _proto = CannonSphereShape.prototype;

  _proto.onLoad = function onLoad() {
    _CannonShape.prototype.onLoad.call(this);

    this.radius = this.sphereCollider.radius;
  };

  _proto.setScale = function setScale(scale) {
    _CannonShape.prototype.setScale.call(this, scale);

    this.radius = this.sphereCollider.radius;
  };

  return CannonSphereShape;
}(_cannonShape.CannonShape);

exports.CannonSphereShape = CannonSphereShape;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbm5vbi1zcGhlcmUtc2hhcGUudHMiXSwibmFtZXMiOlsidjNfMCIsImNjIiwiVmVjMyIsIkNhbm5vblNwaGVyZVNoYXBlIiwiY29sbGlkZXIiLCJfc2hhcGUiLCJfcmFkaXVzIiwidiIsIm5vZGUiLCJnZXRXb3JsZFNjYWxlIiwibWF4IiwibWF4QXhpcyIsInNwaGVyZSIsInJhZGl1cyIsIk1hdGgiLCJhYnMiLCJ1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cyIsIl9pbmRleCIsIl9ib2R5IiwiQ0FOTk9OIiwiU3BoZXJlIiwib25Mb2FkIiwic3BoZXJlQ29sbGlkZXIiLCJzZXRTY2FsZSIsInNjYWxlIiwiQ2Fubm9uU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFJQSxJQUFNQSxJQUFJLEdBQUcsSUFBSUMsRUFBRSxDQUFDQyxJQUFQLEVBQWI7O0lBQ2FDOzs7Ozs7O3dCQUVhO0FBQ2xCLGFBQU8sS0FBS0MsUUFBWjtBQUNIOzs7d0JBRWE7QUFDVixhQUFPLEtBQUtDLE1BQVo7QUFDSDs7O3dCQUVhO0FBQ1YsYUFBTyxLQUFLQyxPQUFaO0FBQ0g7c0JBRVdDLEdBQVc7QUFDbkIsV0FBS0gsUUFBTCxDQUFjSSxJQUFkLENBQW1CQyxhQUFuQixDQUFpQ1QsSUFBakM7QUFDQSxVQUFNVSxHQUFHLEdBQUdWLElBQUksQ0FBQ1csT0FBTCxFQUFaO0FBQ0EsV0FBS0MsTUFBTCxDQUFZQyxNQUFaLEdBQXFCTixDQUFDLEdBQUdPLElBQUksQ0FBQ0MsR0FBTCxDQUFTTCxHQUFULENBQXpCO0FBQ0EsV0FBS0UsTUFBTCxDQUFZSSwwQkFBWjs7QUFDQSxVQUFJLEtBQUtDLE1BQUwsSUFBZSxDQUFDLENBQXBCLEVBQXVCO0FBQ25CLDRDQUFtQixLQUFLQyxLQUF4QjtBQUNIO0FBQ0o7OztBQUlELDZCQUFhTCxNQUFiLEVBQTZCO0FBQUE7O0FBQ3pCO0FBRHlCLFVBRnJCUCxPQUVxQjtBQUV6QixVQUFLQSxPQUFMLEdBQWVPLE1BQWY7QUFDQSxVQUFLUixNQUFMLEdBQWMsSUFBSWMsbUJBQU9DLE1BQVgsQ0FBa0IsTUFBS2QsT0FBdkIsQ0FBZDtBQUh5QjtBQUk1Qjs7OztTQUVEZSxTQUFBLGtCQUFVO0FBQ04sMkJBQU1BLE1BQU47O0FBQ0EsU0FBS1IsTUFBTCxHQUFjLEtBQUtTLGNBQUwsQ0FBb0JULE1BQWxDO0FBQ0g7O1NBRURVLFdBQUEsa0JBQVVDLEtBQVYsRUFBZ0M7QUFDNUIsMkJBQU1ELFFBQU4sWUFBZUMsS0FBZjs7QUFDQSxTQUFLWCxNQUFMLEdBQWMsS0FBS1MsY0FBTCxDQUFvQlQsTUFBbEM7QUFDSDs7O0VBeENrQ1kiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IENBTk5PTiBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9jYW5ub24vY2Fubm9uJztcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xuaW1wb3J0IHsgSVNwaGVyZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xuaW1wb3J0IHsgU3BoZXJlQ29sbGlkZXIzRCB9IGZyb20gJy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xuXG5jb25zdCB2M18wID0gbmV3IGNjLlZlYzMoKTtcbmV4cG9ydCBjbGFzcyBDYW5ub25TcGhlcmVTaGFwZSBleHRlbmRzIENhbm5vblNoYXBlIGltcGxlbWVudHMgSVNwaGVyZVNoYXBlIHtcblxuICAgIGdldCBzcGhlcmVDb2xsaWRlciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxpZGVyIGFzIFNwaGVyZUNvbGxpZGVyM0Q7XG4gICAgfVxuXG4gICAgZ2V0IHNwaGVyZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBDQU5OT04uU3BoZXJlO1xuICAgIH1cblxuICAgIGdldCByYWRpdXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzO1xuICAgIH1cblxuICAgIHNldCByYWRpdXMgKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNvbGxpZGVyLm5vZGUuZ2V0V29ybGRTY2FsZSh2M18wKTtcbiAgICAgICAgY29uc3QgbWF4ID0gdjNfMC5tYXhBeGlzKCk7XG4gICAgICAgIHRoaXMuc3BoZXJlLnJhZGl1cyA9IHYgKiBNYXRoLmFicyhtYXgpO1xuICAgICAgICB0aGlzLnNwaGVyZS51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpO1xuICAgICAgICBpZiAodGhpcy5faW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3JhZGl1czogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IgKHJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3JhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgdGhpcy5fc2hhcGUgPSBuZXcgQ0FOTk9OLlNwaGVyZSh0aGlzLl9yYWRpdXMpO1xuICAgIH1cblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHRoaXMuc3BoZXJlQ29sbGlkZXIucmFkaXVzO1xuICAgIH1cblxuICAgIHNldFNjYWxlIChzY2FsZTogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBzdXBlci5zZXRTY2FsZShzY2FsZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5zcGhlcmVDb2xsaWRlci5yYWRpdXM7XG4gICAgfVxuXG59XG4iXX0=