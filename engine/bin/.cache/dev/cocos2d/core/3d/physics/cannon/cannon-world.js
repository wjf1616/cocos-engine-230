
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/cannon-world.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonWorld = void 0;

var _cannon = _interopRequireDefault(require("../../../../../external/cannon/cannon"));

var _cannonUtil = require("./cannon-util");

var _cannonShape = require("./shapes/cannon-shape");

var _cannonSharedBody = require("./cannon-shared-body");

var _util = require("../framework/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vec3 = cc.Vec3;
var fastRemoveAt = cc.js.array.fastRemoveAt;

var CannonWorld =
/*#__PURE__*/
function () {
  _createClass(CannonWorld, [{
    key: "world",
    get: function get() {
      return this._world;
    }
  }, {
    key: "defaultMaterial",
    set: function set(mat) {
      this._world.defaultMaterial.friction = mat.friction;
      this._world.defaultMaterial.restitution = mat.restitution;

      if (_cannonShape.CannonShape.idToMaterial[mat._uuid] != null) {
        _cannonShape.CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
      }
    }
  }, {
    key: "allowSleep",
    set: function set(v) {
      this._world.allowSleep = v;
    }
  }, {
    key: "gravity",
    set: function set(gravity) {
      Vec3.copy(this._world.gravity, gravity);
    }
  }]);

  function CannonWorld() {
    this.bodies = [];
    this._world = void 0;
    this._raycastResult = new _cannon["default"].RaycastResult();
    this._world = new _cannon["default"].World();
    this._world.broadphase = new _cannon["default"].NaiveBroadphase();
  }

  var _proto = CannonWorld.prototype;

  _proto.step = function step(deltaTime, timeSinceLastCalled, maxSubStep) {
    (0, _util.clearNodeTransformRecord)(); // sync scene to physics

    for (var i = 0; i < this.bodies.length; i++) {
      this.bodies[i].syncSceneToPhysics();
    }

    (0, _util.clearNodeTransformDirtyFlag)();

    this._world.step(deltaTime, timeSinceLastCalled, maxSubStep); // sync physics to scene


    for (var _i = 0; _i < this.bodies.length; _i++) {
      this.bodies[_i].syncPhysicsToScene();
    }

    this._world.emitTriggeredEvents();

    this._world.emitCollisionEvents();
  };

  _proto.raycastClosest = function raycastClosest(worldRay, options, result) {
    setupFromAndTo(worldRay, options.maxDistance);
    (0, _cannonUtil.toCannonRaycastOptions)(raycastOpt, options);

    var hit = this._world.raycastClosest(from, to, raycastOpt, this._raycastResult);

    if (hit) {
      (0, _cannonUtil.fillRaycastResult)(result, this._raycastResult);
    }

    return hit;
  };

  _proto.raycast = function raycast(worldRay, options, pool, results) {
    setupFromAndTo(worldRay, options.maxDistance);
    (0, _cannonUtil.toCannonRaycastOptions)(raycastOpt, options);

    var hit = this._world.raycastAll(from, to, raycastOpt, function (result) {
      var r = pool.add();
      (0, _cannonUtil.fillRaycastResult)(r, result);
      results.push(r);
    });

    return hit;
  };

  _proto.getSharedBody = function getSharedBody(node) {
    return _cannonSharedBody.CannonSharedBody.getSharedBody(node, this);
  };

  _proto.addSharedBody = function addSharedBody(sharedBody) {
    var i = this.bodies.indexOf(sharedBody);

    if (i < 0) {
      this.bodies.push(sharedBody);

      this._world.addBody(sharedBody.body);
    }
  };

  _proto.removeSharedBody = function removeSharedBody(sharedBody) {
    var i = this.bodies.indexOf(sharedBody);

    if (i >= 0) {
      fastRemoveAt(this.bodies, i);

      this._world.remove(sharedBody.body);
    }
  };

  return CannonWorld;
}();

exports.CannonWorld = CannonWorld;
var from = new _cannon["default"].Vec3();
var to = new _cannon["default"].Vec3();

function setupFromAndTo(worldRay, distance) {
  Vec3.copy(from, worldRay.o);
  worldRay.computeHit(to, distance);
}

var raycastOpt = {
  'checkCollisionResponse': false,
  'collisionFilterGroup': -1,
  'collisionFilterMask': -1,
  'skipBackFaces': false
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbm5vbi13b3JsZC50cyJdLCJuYW1lcyI6WyJWZWMzIiwiY2MiLCJmYXN0UmVtb3ZlQXQiLCJqcyIsImFycmF5IiwiQ2Fubm9uV29ybGQiLCJfd29ybGQiLCJtYXQiLCJkZWZhdWx0TWF0ZXJpYWwiLCJmcmljdGlvbiIsInJlc3RpdHV0aW9uIiwiQ2Fubm9uU2hhcGUiLCJpZFRvTWF0ZXJpYWwiLCJfdXVpZCIsInYiLCJhbGxvd1NsZWVwIiwiZ3Jhdml0eSIsImNvcHkiLCJib2RpZXMiLCJfcmF5Y2FzdFJlc3VsdCIsIkNBTk5PTiIsIlJheWNhc3RSZXN1bHQiLCJXb3JsZCIsImJyb2FkcGhhc2UiLCJOYWl2ZUJyb2FkcGhhc2UiLCJzdGVwIiwiZGVsdGFUaW1lIiwidGltZVNpbmNlTGFzdENhbGxlZCIsIm1heFN1YlN0ZXAiLCJpIiwibGVuZ3RoIiwic3luY1NjZW5lVG9QaHlzaWNzIiwic3luY1BoeXNpY3NUb1NjZW5lIiwiZW1pdFRyaWdnZXJlZEV2ZW50cyIsImVtaXRDb2xsaXNpb25FdmVudHMiLCJyYXljYXN0Q2xvc2VzdCIsIndvcmxkUmF5Iiwib3B0aW9ucyIsInJlc3VsdCIsInNldHVwRnJvbUFuZFRvIiwibWF4RGlzdGFuY2UiLCJyYXljYXN0T3B0IiwiaGl0IiwiZnJvbSIsInRvIiwicmF5Y2FzdCIsInBvb2wiLCJyZXN1bHRzIiwicmF5Y2FzdEFsbCIsInIiLCJhZGQiLCJwdXNoIiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJDYW5ub25TaGFyZWRCb2R5IiwiYWRkU2hhcmVkQm9keSIsInNoYXJlZEJvZHkiLCJpbmRleE9mIiwiYWRkQm9keSIsImJvZHkiLCJyZW1vdmVTaGFyZWRCb2R5IiwicmVtb3ZlIiwiZGlzdGFuY2UiLCJvIiwiY29tcHV0ZUhpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7Ozs7Ozs7QUFFQSxJQUFNQSxJQUFJLEdBQUdDLEVBQUUsQ0FBQ0QsSUFBaEI7QUFDQSxJQUFNRSxZQUFZLEdBQUdELEVBQUUsQ0FBQ0UsRUFBSCxDQUFNQyxLQUFOLENBQVlGLFlBQWpDOztJQUVhRzs7Ozs7d0JBRUk7QUFDVCxhQUFPLEtBQUtDLE1BQVo7QUFDSDs7O3NCQUVvQkMsS0FBc0I7QUFDdkMsV0FBS0QsTUFBTCxDQUFZRSxlQUFaLENBQTRCQyxRQUE1QixHQUF1Q0YsR0FBRyxDQUFDRSxRQUEzQztBQUNBLFdBQUtILE1BQUwsQ0FBWUUsZUFBWixDQUE0QkUsV0FBNUIsR0FBMENILEdBQUcsQ0FBQ0csV0FBOUM7O0FBQ0EsVUFBSUMseUJBQVlDLFlBQVosQ0FBeUJMLEdBQUcsQ0FBQ00sS0FBN0IsS0FBdUMsSUFBM0MsRUFBaUQ7QUFDN0NGLGlDQUFZQyxZQUFaLENBQXlCTCxHQUFHLENBQUNNLEtBQTdCLElBQXNDLEtBQUtQLE1BQUwsQ0FBWUUsZUFBbEQ7QUFDSDtBQUNKOzs7c0JBRWVNLEdBQVk7QUFDeEIsV0FBS1IsTUFBTCxDQUFZUyxVQUFaLEdBQXlCRCxDQUF6QjtBQUNIOzs7c0JBRVlFLFNBQWtCO0FBQzNCaEIsTUFBQUEsSUFBSSxDQUFDaUIsSUFBTCxDQUFVLEtBQUtYLE1BQUwsQ0FBWVUsT0FBdEIsRUFBK0JBLE9BQS9CO0FBQ0g7OztBQU9ELHlCQUFlO0FBQUEsU0FMTkUsTUFLTSxHQUx1QixFQUt2QjtBQUFBLFNBSFBaLE1BR087QUFBQSxTQUZQYSxjQUVPLEdBRlUsSUFBSUMsbUJBQU9DLGFBQVgsRUFFVjtBQUNYLFNBQUtmLE1BQUwsR0FBYyxJQUFJYyxtQkFBT0UsS0FBWCxFQUFkO0FBQ0EsU0FBS2hCLE1BQUwsQ0FBWWlCLFVBQVosR0FBeUIsSUFBSUgsbUJBQU9JLGVBQVgsRUFBekI7QUFDSDs7OztTQUVEQyxPQUFBLGNBQU1DLFNBQU4sRUFBeUJDLG1CQUF6QixFQUF1REMsVUFBdkQsRUFBNEU7QUFFeEUsMENBRndFLENBSXhFOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLWCxNQUFMLENBQVlZLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQ3pDLFdBQUtYLE1BQUwsQ0FBWVcsQ0FBWixFQUFlRSxrQkFBZjtBQUNIOztBQUVEOztBQUVBLFNBQUt6QixNQUFMLENBQVltQixJQUFaLENBQWlCQyxTQUFqQixFQUE0QkMsbUJBQTVCLEVBQWlEQyxVQUFqRCxFQVh3RSxDQWF4RTs7O0FBQ0EsU0FBSyxJQUFJQyxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHLEtBQUtYLE1BQUwsQ0FBWVksTUFBaEMsRUFBd0NELEVBQUMsRUFBekMsRUFBNkM7QUFDekMsV0FBS1gsTUFBTCxDQUFZVyxFQUFaLEVBQWVHLGtCQUFmO0FBQ0g7O0FBRUQsU0FBSzFCLE1BQUwsQ0FBWTJCLG1CQUFaOztBQUNBLFNBQUszQixNQUFMLENBQVk0QixtQkFBWjtBQUNIOztTQUVEQyxpQkFBQSx3QkFBZ0JDLFFBQWhCLEVBQTRDQyxPQUE1QyxFQUFzRUMsTUFBdEUsRUFBeUc7QUFDckdDLElBQUFBLGNBQWMsQ0FBQ0gsUUFBRCxFQUFXQyxPQUFPLENBQUNHLFdBQW5CLENBQWQ7QUFDQSw0Q0FBdUJDLFVBQXZCLEVBQW1DSixPQUFuQzs7QUFDQSxRQUFNSyxHQUFHLEdBQUcsS0FBS3BDLE1BQUwsQ0FBWTZCLGNBQVosQ0FBMkJRLElBQTNCLEVBQWlDQyxFQUFqQyxFQUFxQ0gsVUFBckMsRUFBaUQsS0FBS3RCLGNBQXRELENBQVo7O0FBQ0EsUUFBSXVCLEdBQUosRUFBUztBQUNMLHlDQUFrQkosTUFBbEIsRUFBMEIsS0FBS25CLGNBQS9CO0FBQ0g7O0FBQ0QsV0FBT3VCLEdBQVA7QUFDSDs7U0FFREcsVUFBQSxpQkFBU1QsUUFBVCxFQUFxQ0MsT0FBckMsRUFBK0RTLElBQS9ELEVBQXFGQyxPQUFyRixFQUEySDtBQUN2SFIsSUFBQUEsY0FBYyxDQUFDSCxRQUFELEVBQVdDLE9BQU8sQ0FBQ0csV0FBbkIsQ0FBZDtBQUNBLDRDQUF1QkMsVUFBdkIsRUFBbUNKLE9BQW5DOztBQUNBLFFBQU1LLEdBQUcsR0FBRyxLQUFLcEMsTUFBTCxDQUFZMEMsVUFBWixDQUF1QkwsSUFBdkIsRUFBNkJDLEVBQTdCLEVBQWlDSCxVQUFqQyxFQUE2QyxVQUFDSCxNQUFELEVBQXVDO0FBQzVGLFVBQU1XLENBQUMsR0FBR0gsSUFBSSxDQUFDSSxHQUFMLEVBQVY7QUFDQSx5Q0FBa0JELENBQWxCLEVBQXFCWCxNQUFyQjtBQUNBUyxNQUFBQSxPQUFPLENBQUNJLElBQVIsQ0FBYUYsQ0FBYjtBQUNILEtBSlcsQ0FBWjs7QUFLQSxXQUFPUCxHQUFQO0FBQ0g7O1NBRURVLGdCQUFBLHVCQUFlQyxJQUFmLEVBQTZDO0FBQ3pDLFdBQU9DLG1DQUFpQkYsYUFBakIsQ0FBK0JDLElBQS9CLEVBQXFDLElBQXJDLENBQVA7QUFDSDs7U0FFREUsZ0JBQUEsdUJBQWVDLFVBQWYsRUFBNkM7QUFDekMsUUFBTTNCLENBQUMsR0FBRyxLQUFLWCxNQUFMLENBQVl1QyxPQUFaLENBQW9CRCxVQUFwQixDQUFWOztBQUNBLFFBQUkzQixDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQ1AsV0FBS1gsTUFBTCxDQUFZaUMsSUFBWixDQUFpQkssVUFBakI7O0FBQ0EsV0FBS2xELE1BQUwsQ0FBWW9ELE9BQVosQ0FBb0JGLFVBQVUsQ0FBQ0csSUFBL0I7QUFDSDtBQUNKOztTQUVEQyxtQkFBQSwwQkFBa0JKLFVBQWxCLEVBQWdEO0FBQzVDLFFBQU0zQixDQUFDLEdBQUcsS0FBS1gsTUFBTCxDQUFZdUMsT0FBWixDQUFvQkQsVUFBcEIsQ0FBVjs7QUFDQSxRQUFJM0IsQ0FBQyxJQUFJLENBQVQsRUFBWTtBQUNSM0IsTUFBQUEsWUFBWSxDQUFDLEtBQUtnQixNQUFOLEVBQWNXLENBQWQsQ0FBWjs7QUFDQSxXQUFLdkIsTUFBTCxDQUFZdUQsTUFBWixDQUFtQkwsVUFBVSxDQUFDRyxJQUE5QjtBQUNIO0FBQ0o7Ozs7OztBQUdMLElBQU1oQixJQUFJLEdBQUcsSUFBSXZCLG1CQUFPcEIsSUFBWCxFQUFiO0FBQ0EsSUFBTTRDLEVBQUUsR0FBRyxJQUFJeEIsbUJBQU9wQixJQUFYLEVBQVg7O0FBQ0EsU0FBU3VDLGNBQVQsQ0FBeUJILFFBQXpCLEVBQXFEMEIsUUFBckQsRUFBdUU7QUFDbkU5RCxFQUFBQSxJQUFJLENBQUNpQixJQUFMLENBQVUwQixJQUFWLEVBQWdCUCxRQUFRLENBQUMyQixDQUF6QjtBQUNBM0IsRUFBQUEsUUFBUSxDQUFDNEIsVUFBVCxDQUFvQnBCLEVBQXBCLEVBQXdCa0IsUUFBeEI7QUFDSDs7QUFFRCxJQUFNckIsVUFBa0MsR0FBRztBQUN2Qyw0QkFBMEIsS0FEYTtBQUV2QywwQkFBd0IsQ0FBQyxDQUZjO0FBR3ZDLHlCQUF1QixDQUFDLENBSGU7QUFJdkMsbUJBQWlCO0FBSnNCLENBQTNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBDQU5OT04gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvY2Fubm9uL2Nhbm5vbic7XG5pbXBvcnQgeyBmaWxsUmF5Y2FzdFJlc3VsdCwgdG9DYW5ub25SYXljYXN0T3B0aW9ucyB9IGZyb20gJy4vY2Fubm9uLXV0aWwnO1xuaW1wb3J0IHsgQ2Fubm9uU2hhcGUgfSBmcm9tICcuL3NoYXBlcy9jYW5ub24tc2hhcGUnO1xuaW1wb3J0IHsgQ2Fubm9uU2hhcmVkQm9keSB9IGZyb20gJy4vY2Fubm9uLXNoYXJlZC1ib2R5JztcbmltcG9ydCB7IElQaHlzaWNzV29ybGQsIElSYXljYXN0T3B0aW9ucyB9IGZyb20gJy4uL3NwZWMvaS1waHlzaWNzLXdvcmxkJztcbmltcG9ydCB7IFBoeXNpY3NNYXRlcmlhbCwgUGh5c2ljc1JheVJlc3VsdCB9IGZyb20gJy4uL2ZyYW1ld29yayc7XG5pbXBvcnQgeyBjbGVhck5vZGVUcmFuc2Zvcm1SZWNvcmQsIGNsZWFyTm9kZVRyYW5zZm9ybURpcnR5RmxhZyB9IGZyb20gJy4uL2ZyYW1ld29yay91dGlsJ1xuXG5jb25zdCBWZWMzID0gY2MuVmVjMztcbmNvbnN0IGZhc3RSZW1vdmVBdCA9IGNjLmpzLmFycmF5LmZhc3RSZW1vdmVBdDtcblxuZXhwb3J0IGNsYXNzIENhbm5vbldvcmxkIGltcGxlbWVudHMgSVBoeXNpY3NXb3JsZCB7XG5cbiAgICBnZXQgd29ybGQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGQ7XG4gICAgfVxuXG4gICAgc2V0IGRlZmF1bHRNYXRlcmlhbCAobWF0OiBQaHlzaWNzTWF0ZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fd29ybGQuZGVmYXVsdE1hdGVyaWFsLmZyaWN0aW9uID0gbWF0LmZyaWN0aW9uO1xuICAgICAgICB0aGlzLl93b3JsZC5kZWZhdWx0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSBtYXQucmVzdGl0dXRpb247XG4gICAgICAgIGlmIChDYW5ub25TaGFwZS5pZFRvTWF0ZXJpYWxbbWF0Ll91dWlkXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBDYW5ub25TaGFwZS5pZFRvTWF0ZXJpYWxbbWF0Ll91dWlkXSA9IHRoaXMuX3dvcmxkLmRlZmF1bHRNYXRlcmlhbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBhbGxvd1NsZWVwICh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3dvcmxkLmFsbG93U2xlZXAgPSB2O1xuICAgIH1cblxuICAgIHNldCBncmF2aXR5IChncmF2aXR5OiBjYy5WZWMzKSB7XG4gICAgICAgIFZlYzMuY29weSh0aGlzLl93b3JsZC5ncmF2aXR5LCBncmF2aXR5KTtcbiAgICB9XG5cbiAgICByZWFkb25seSBib2RpZXM6IENhbm5vblNoYXJlZEJvZHlbXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSBfd29ybGQ6IENBTk5PTi5Xb3JsZDtcbiAgICBwcml2YXRlIF9yYXljYXN0UmVzdWx0ID0gbmV3IENBTk5PTi5SYXljYXN0UmVzdWx0KCk7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3dvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCgpO1xuICAgICAgICB0aGlzLl93b3JsZC5icm9hZHBoYXNlID0gbmV3IENBTk5PTi5OYWl2ZUJyb2FkcGhhc2UoKTtcbiAgICB9XG5cbiAgICBzdGVwIChkZWx0YVRpbWU6IG51bWJlciwgdGltZVNpbmNlTGFzdENhbGxlZD86IG51bWJlciwgbWF4U3ViU3RlcD86IG51bWJlcikge1xuXG4gICAgICAgIGNsZWFyTm9kZVRyYW5zZm9ybVJlY29yZCgpO1xuXG4gICAgICAgIC8vIHN5bmMgc2NlbmUgdG8gcGh5c2ljc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJvZGllc1tpXS5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyTm9kZVRyYW5zZm9ybURpcnR5RmxhZygpO1xuXG4gICAgICAgIHRoaXMuX3dvcmxkLnN0ZXAoZGVsdGFUaW1lLCB0aW1lU2luY2VMYXN0Q2FsbGVkLCBtYXhTdWJTdGVwKTtcblxuICAgICAgICAvLyBzeW5jIHBoeXNpY3MgdG8gc2NlbmVcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ib2RpZXNbaV0uc3luY1BoeXNpY3NUb1NjZW5lKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl93b3JsZC5lbWl0VHJpZ2dlcmVkRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuX3dvcmxkLmVtaXRDb2xsaXNpb25FdmVudHMoKTtcbiAgICB9XG5cbiAgICByYXljYXN0Q2xvc2VzdCAod29ybGRSYXk6IGNjLmdlb21VdGlscy5SYXksIG9wdGlvbnM6IElSYXljYXN0T3B0aW9ucywgcmVzdWx0OiBQaHlzaWNzUmF5UmVzdWx0KTogYm9vbGVhbiB7XG4gICAgICAgIHNldHVwRnJvbUFuZFRvKHdvcmxkUmF5LCBvcHRpb25zLm1heERpc3RhbmNlKTtcbiAgICAgICAgdG9DYW5ub25SYXljYXN0T3B0aW9ucyhyYXljYXN0T3B0LCBvcHRpb25zKTtcbiAgICAgICAgY29uc3QgaGl0ID0gdGhpcy5fd29ybGQucmF5Y2FzdENsb3Nlc3QoZnJvbSwgdG8sIHJheWNhc3RPcHQsIHRoaXMuX3JheWNhc3RSZXN1bHQpO1xuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICBmaWxsUmF5Y2FzdFJlc3VsdChyZXN1bHQsIHRoaXMuX3JheWNhc3RSZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoaXQ7XG4gICAgfVxuXG4gICAgcmF5Y2FzdCAod29ybGRSYXk6IGNjLmdlb21VdGlscy5SYXksIG9wdGlvbnM6IElSYXljYXN0T3B0aW9ucywgcG9vbDogY2MuUmVjeWNsZVBvb2wsIHJlc3VsdHM6IFBoeXNpY3NSYXlSZXN1bHRbXSk6IGJvb2xlYW4ge1xuICAgICAgICBzZXR1cEZyb21BbmRUbyh3b3JsZFJheSwgb3B0aW9ucy5tYXhEaXN0YW5jZSk7XG4gICAgICAgIHRvQ2Fubm9uUmF5Y2FzdE9wdGlvbnMocmF5Y2FzdE9wdCwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IGhpdCA9IHRoaXMuX3dvcmxkLnJheWNhc3RBbGwoZnJvbSwgdG8sIHJheWNhc3RPcHQsIChyZXN1bHQ6IENBTk5PTi5SYXljYXN0UmVzdWx0KTogYW55ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBwb29sLmFkZCgpO1xuICAgICAgICAgICAgZmlsbFJheWNhc3RSZXN1bHQociwgcmVzdWx0KTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoaXRcbiAgICB9XG5cbiAgICBnZXRTaGFyZWRCb2R5IChub2RlOiBOb2RlKTogQ2Fubm9uU2hhcmVkQm9keSB7XG4gICAgICAgIHJldHVybiBDYW5ub25TaGFyZWRCb2R5LmdldFNoYXJlZEJvZHkobm9kZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgYWRkU2hhcmVkQm9keSAoc2hhcmVkQm9keTogQ2Fubm9uU2hhcmVkQm9keSkge1xuICAgICAgICBjb25zdCBpID0gdGhpcy5ib2RpZXMuaW5kZXhPZihzaGFyZWRCb2R5KTtcbiAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmJvZGllcy5wdXNoKHNoYXJlZEJvZHkpO1xuICAgICAgICAgICAgdGhpcy5fd29ybGQuYWRkQm9keShzaGFyZWRCb2R5LmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlU2hhcmVkQm9keSAoc2hhcmVkQm9keTogQ2Fubm9uU2hhcmVkQm9keSkge1xuICAgICAgICBjb25zdCBpID0gdGhpcy5ib2RpZXMuaW5kZXhPZihzaGFyZWRCb2R5KTtcbiAgICAgICAgaWYgKGkgPj0gMCkge1xuICAgICAgICAgICAgZmFzdFJlbW92ZUF0KHRoaXMuYm9kaWVzLCBpKTtcbiAgICAgICAgICAgIHRoaXMuX3dvcmxkLnJlbW92ZShzaGFyZWRCb2R5LmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBmcm9tID0gbmV3IENBTk5PTi5WZWMzKCk7XG5jb25zdCB0byA9IG5ldyBDQU5OT04uVmVjMygpO1xuZnVuY3Rpb24gc2V0dXBGcm9tQW5kVG8gKHdvcmxkUmF5OiBjYy5nZW9tVXRpbHMuUmF5LCBkaXN0YW5jZTogbnVtYmVyKSB7XG4gICAgVmVjMy5jb3B5KGZyb20sIHdvcmxkUmF5Lm8pO1xuICAgIHdvcmxkUmF5LmNvbXB1dGVIaXQodG8sIGRpc3RhbmNlKTtcbn1cblxuY29uc3QgcmF5Y2FzdE9wdDogQ0FOTk9OLklSYXljYXN0T3B0aW9ucyA9IHtcbiAgICAnY2hlY2tDb2xsaXNpb25SZXNwb25zZSc6IGZhbHNlLFxuICAgICdjb2xsaXNpb25GaWx0ZXJHcm91cCc6IC0xLFxuICAgICdjb2xsaXNpb25GaWx0ZXJNYXNrJzogLTEsXG4gICAgJ3NraXBCYWNrRmFjZXMnOiBmYWxzZVxufSJdfQ==