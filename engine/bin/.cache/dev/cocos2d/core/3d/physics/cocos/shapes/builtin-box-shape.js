
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cocos/shapes/builtin-box-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.BuiltinBoxShape = void 0;

var _builtinShape = require("./builtin-shape");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Obb = cc.geomUtils.Obb;
var Vec3 = cc.Vec3;

var _worldScale = new Vec3();

var BuiltinBoxShape =
/*#__PURE__*/
function (_BuiltinShape) {
  _inheritsLoose(BuiltinBoxShape, _BuiltinShape);

  _createClass(BuiltinBoxShape, [{
    key: "localObb",
    get: function get() {
      return this._localShape;
    }
  }, {
    key: "worldObb",
    get: function get() {
      return this._worldShape;
    }
  }, {
    key: "boxCollider",
    get: function get() {
      return this.collider;
    }
  }]);

  function BuiltinBoxShape(size) {
    var _this;

    _this = _BuiltinShape.call(this) || this;
    _this._localShape = new Obb();
    _this._worldShape = new Obb();
    Vec3.multiplyScalar(_this.localObb.halfExtents, size, 0.5);
    Vec3.copy(_this.worldObb.halfExtents, _this.localObb.halfExtents);
    return _this;
  }

  var _proto = BuiltinBoxShape.prototype;

  _proto.onLoad = function onLoad() {
    _BuiltinShape.prototype.onLoad.call(this);

    this.size = this.boxCollider.size;
  };

  _createClass(BuiltinBoxShape, [{
    key: "size",
    set: function set(size) {
      Vec3.multiplyScalar(this.localObb.halfExtents, size, 0.5);
      this.collider.node.getWorldScale(_worldScale);
      Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, _worldScale);
    }
  }]);

  return BuiltinBoxShape;
}(_builtinShape.BuiltinShape);

exports.BuiltinBoxShape = BuiltinBoxShape;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1aWx0aW4tYm94LXNoYXBlLnRzIl0sIm5hbWVzIjpbIk9iYiIsImNjIiwiZ2VvbVV0aWxzIiwiVmVjMyIsIl93b3JsZFNjYWxlIiwiQnVpbHRpbkJveFNoYXBlIiwiX2xvY2FsU2hhcGUiLCJfd29ybGRTaGFwZSIsImNvbGxpZGVyIiwic2l6ZSIsIm11bHRpcGx5U2NhbGFyIiwibG9jYWxPYmIiLCJoYWxmRXh0ZW50cyIsImNvcHkiLCJ3b3JsZE9iYiIsIm9uTG9hZCIsImJveENvbGxpZGVyIiwibm9kZSIsImdldFdvcmxkU2NhbGUiLCJtdWx0aXBseSIsIkJ1aWx0aW5TaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFJQSxJQUFNQSxHQUFHLEdBQUdDLEVBQUUsQ0FBQ0MsU0FBSCxDQUFhRixHQUF6QjtBQUNBLElBQU1HLElBQUksR0FBR0YsRUFBRSxDQUFDRSxJQUFoQjs7QUFDQSxJQUFJQyxXQUFXLEdBQUcsSUFBSUQsSUFBSixFQUFsQjs7SUFFYUU7Ozs7Ozs7d0JBRU87QUFDWixhQUFPLEtBQUtDLFdBQVo7QUFDSDs7O3dCQUVlO0FBQ1osYUFBTyxLQUFLQyxXQUFaO0FBQ0g7Ozt3QkFFeUI7QUFDdEIsYUFBTyxLQUFLQyxRQUFaO0FBQ0g7OztBQUVELDJCQUFhQyxJQUFiLEVBQTRCO0FBQUE7O0FBQ3hCO0FBQ0EsVUFBS0gsV0FBTCxHQUFtQixJQUFJTixHQUFKLEVBQW5CO0FBQ0EsVUFBS08sV0FBTCxHQUFtQixJQUFJUCxHQUFKLEVBQW5CO0FBQ0FHLElBQUFBLElBQUksQ0FBQ08sY0FBTCxDQUFvQixNQUFLQyxRQUFMLENBQWNDLFdBQWxDLEVBQStDSCxJQUEvQyxFQUFxRCxHQUFyRDtBQUNBTixJQUFBQSxJQUFJLENBQUNVLElBQUwsQ0FBVSxNQUFLQyxRQUFMLENBQWNGLFdBQXhCLEVBQXFDLE1BQUtELFFBQUwsQ0FBY0MsV0FBbkQ7QUFMd0I7QUFNM0I7Ozs7U0FRREcsU0FBQSxrQkFBVTtBQUNOLDRCQUFNQSxNQUFOOztBQUNBLFNBQUtOLElBQUwsR0FBWSxLQUFLTyxXQUFMLENBQWlCUCxJQUE3QjtBQUNIOzs7O3NCQVRTQSxNQUFlO0FBQ3JCTixNQUFBQSxJQUFJLENBQUNPLGNBQUwsQ0FBb0IsS0FBS0MsUUFBTCxDQUFjQyxXQUFsQyxFQUErQ0gsSUFBL0MsRUFBcUQsR0FBckQ7QUFDQSxXQUFLRCxRQUFMLENBQWNTLElBQWQsQ0FBbUJDLGFBQW5CLENBQWlDZCxXQUFqQztBQUNBRCxNQUFBQSxJQUFJLENBQUNnQixRQUFMLENBQWMsS0FBS0wsUUFBTCxDQUFjRixXQUE1QixFQUF5QyxLQUFLRCxRQUFMLENBQWNDLFdBQXZELEVBQW9FUixXQUFwRTtBQUNIOzs7O0VBMUJnQ2dCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IEJ1aWx0aW5TaGFwZSB9IGZyb20gJy4vYnVpbHRpbi1zaGFwZSc7XG5pbXBvcnQgeyBJQm94U2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XG5pbXBvcnQgeyBCb3hDb2xsaWRlcjNEIH0gZnJvbSAnLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XG5cbmNvbnN0IE9iYiA9IGNjLmdlb21VdGlscy5PYmI7XG5jb25zdCBWZWMzID0gY2MuVmVjMztcbmxldCBfd29ybGRTY2FsZSA9IG5ldyBWZWMzKCk7XG5cbmV4cG9ydCBjbGFzcyBCdWlsdGluQm94U2hhcGUgZXh0ZW5kcyBCdWlsdGluU2hhcGUgaW1wbGVtZW50cyBJQm94U2hhcGUge1xuXG4gICAgZ2V0IGxvY2FsT2JiICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsU2hhcGUgYXMgY2MuZ2VvbVV0aWxzLk9iYjtcbiAgICB9XG5cbiAgICBnZXQgd29ybGRPYmIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTaGFwZSBhcyBjYy5nZW9tVXRpbHMuT2JiO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgYm94Q29sbGlkZXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsaWRlciBhcyBCb3hDb2xsaWRlcjNEO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChzaXplOiBjYy5WZWMzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2xvY2FsU2hhcGUgPSBuZXcgT2JiKCk7XG4gICAgICAgIHRoaXMuX3dvcmxkU2hhcGUgPSBuZXcgT2JiKCk7XG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIodGhpcy5sb2NhbE9iYi5oYWxmRXh0ZW50cywgc2l6ZSwgMC41KTtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMud29ybGRPYmIuaGFsZkV4dGVudHMsIHRoaXMubG9jYWxPYmIuaGFsZkV4dGVudHMpO1xuICAgIH1cblxuICAgIHNldCBzaXplIChzaXplOiBjYy5WZWMzKSB7XG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIodGhpcy5sb2NhbE9iYi5oYWxmRXh0ZW50cywgc2l6ZSwgMC41KTtcbiAgICAgICAgdGhpcy5jb2xsaWRlci5ub2RlLmdldFdvcmxkU2NhbGUoX3dvcmxkU2NhbGUpO1xuICAgICAgICBWZWMzLm11bHRpcGx5KHRoaXMud29ybGRPYmIuaGFsZkV4dGVudHMsIHRoaXMubG9jYWxPYmIuaGFsZkV4dGVudHMsIF93b3JsZFNjYWxlKTtcbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICBzdXBlci5vbkxvYWQoKTtcbiAgICAgICAgdGhpcy5zaXplID0gdGhpcy5ib3hDb2xsaWRlci5zaXplO1xuICAgIH1cblxufVxuIl19