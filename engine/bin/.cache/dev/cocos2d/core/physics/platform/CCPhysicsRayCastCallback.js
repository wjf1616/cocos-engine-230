
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/platform/CCPhysicsRayCastCallback.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
function PhysicsRayCastCallback() {
  this._type = 0;
  this._fixtures = [];
  this._points = [];
  this._normals = [];
  this._fractions = [];
}

PhysicsRayCastCallback.prototype.init = function (type) {
  this._type = type;
  this._fixtures.length = 0;
  this._points.length = 0;
  this._normals.length = 0;
  this._fractions.length = 0;
};

PhysicsRayCastCallback.prototype.ReportFixture = function (fixture, point, normal, fraction) {
  if (this._type === 0) {
    // closest
    this._fixtures[0] = fixture;
    this._points[0] = point;
    this._normals[0] = normal;
    this._fractions[0] = fraction;
    return fraction;
  }

  this._fixtures.push(fixture);

  this._points.push(cc.v2(point));

  this._normals.push(cc.v2(normal));

  this._fractions.push(fraction);

  if (this._type === 1) {
    // any
    return 0;
  } else if (this._type >= 2) {
    // all
    return 1;
  }

  return fraction;
};

PhysicsRayCastCallback.prototype.getFixtures = function () {
  return this._fixtures;
};

PhysicsRayCastCallback.prototype.getPoints = function () {
  return this._points;
};

PhysicsRayCastCallback.prototype.getNormals = function () {
  return this._normals;
};

PhysicsRayCastCallback.prototype.getFractions = function () {
  return this._fractions;
};

cc.PhysicsRayCastCallback = module.exports = PhysicsRayCastCallback;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc1JheUNhc3RDYWxsYmFjay5qcyJdLCJuYW1lcyI6WyJQaHlzaWNzUmF5Q2FzdENhbGxiYWNrIiwiX3R5cGUiLCJfZml4dHVyZXMiLCJfcG9pbnRzIiwiX25vcm1hbHMiLCJfZnJhY3Rpb25zIiwicHJvdG90eXBlIiwiaW5pdCIsInR5cGUiLCJsZW5ndGgiLCJSZXBvcnRGaXh0dXJlIiwiZml4dHVyZSIsInBvaW50Iiwibm9ybWFsIiwiZnJhY3Rpb24iLCJwdXNoIiwiY2MiLCJ2MiIsImdldEZpeHR1cmVzIiwiZ2V0UG9pbnRzIiwiZ2V0Tm9ybWFscyIsImdldEZyYWN0aW9ucyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFNBQVNBLHNCQUFULEdBQW1DO0FBQy9CLE9BQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLE9BQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLE9BQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDSDs7QUFFREwsc0JBQXNCLENBQUNNLFNBQXZCLENBQWlDQyxJQUFqQyxHQUF3QyxVQUFVQyxJQUFWLEVBQWdCO0FBQ3BELE9BQUtQLEtBQUwsR0FBYU8sSUFBYjtBQUNBLE9BQUtOLFNBQUwsQ0FBZU8sTUFBZixHQUF3QixDQUF4QjtBQUNBLE9BQUtOLE9BQUwsQ0FBYU0sTUFBYixHQUFzQixDQUF0QjtBQUNBLE9BQUtMLFFBQUwsQ0FBY0ssTUFBZCxHQUF1QixDQUF2QjtBQUNBLE9BQUtKLFVBQUwsQ0FBZ0JJLE1BQWhCLEdBQXlCLENBQXpCO0FBQ0gsQ0FORDs7QUFRQVQsc0JBQXNCLENBQUNNLFNBQXZCLENBQWlDSSxhQUFqQyxHQUFpRCxVQUFVQyxPQUFWLEVBQW1CQyxLQUFuQixFQUEwQkMsTUFBMUIsRUFBa0NDLFFBQWxDLEVBQTRDO0FBQ3pGLE1BQUksS0FBS2IsS0FBTCxLQUFlLENBQW5CLEVBQXNCO0FBQUU7QUFDcEIsU0FBS0MsU0FBTCxDQUFlLENBQWYsSUFBb0JTLE9BQXBCO0FBQ0EsU0FBS1IsT0FBTCxDQUFhLENBQWIsSUFBa0JTLEtBQWxCO0FBQ0EsU0FBS1IsUUFBTCxDQUFjLENBQWQsSUFBbUJTLE1BQW5CO0FBQ0EsU0FBS1IsVUFBTCxDQUFnQixDQUFoQixJQUFxQlMsUUFBckI7QUFDQSxXQUFPQSxRQUFQO0FBQ0g7O0FBRUQsT0FBS1osU0FBTCxDQUFlYSxJQUFmLENBQW9CSixPQUFwQjs7QUFDQSxPQUFLUixPQUFMLENBQWFZLElBQWIsQ0FBa0JDLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNTCxLQUFOLENBQWxCOztBQUNBLE9BQUtSLFFBQUwsQ0FBY1csSUFBZCxDQUFtQkMsRUFBRSxDQUFDQyxFQUFILENBQU1KLE1BQU4sQ0FBbkI7O0FBQ0EsT0FBS1IsVUFBTCxDQUFnQlUsSUFBaEIsQ0FBcUJELFFBQXJCOztBQUVBLE1BQUksS0FBS2IsS0FBTCxLQUFlLENBQW5CLEVBQXNCO0FBQUU7QUFDcEIsV0FBTyxDQUFQO0FBQ0gsR0FGRCxNQUdLLElBQUksS0FBS0EsS0FBTCxJQUFjLENBQWxCLEVBQXFCO0FBQUU7QUFDeEIsV0FBTyxDQUFQO0FBQ0g7O0FBRUQsU0FBT2EsUUFBUDtBQUNILENBdEJEOztBQXlCQWQsc0JBQXNCLENBQUNNLFNBQXZCLENBQWlDWSxXQUFqQyxHQUErQyxZQUFZO0FBQ3ZELFNBQU8sS0FBS2hCLFNBQVo7QUFDSCxDQUZEOztBQUlBRixzQkFBc0IsQ0FBQ00sU0FBdkIsQ0FBaUNhLFNBQWpDLEdBQTZDLFlBQVk7QUFDckQsU0FBTyxLQUFLaEIsT0FBWjtBQUNILENBRkQ7O0FBSUFILHNCQUFzQixDQUFDTSxTQUF2QixDQUFpQ2MsVUFBakMsR0FBOEMsWUFBWTtBQUN0RCxTQUFPLEtBQUtoQixRQUFaO0FBQ0gsQ0FGRDs7QUFJQUosc0JBQXNCLENBQUNNLFNBQXZCLENBQWlDZSxZQUFqQyxHQUFnRCxZQUFZO0FBQ3hELFNBQU8sS0FBS2hCLFVBQVo7QUFDSCxDQUZEOztBQUlBVyxFQUFFLENBQUNoQixzQkFBSCxHQUE0QnNCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZCLHNCQUE3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuZnVuY3Rpb24gUGh5c2ljc1JheUNhc3RDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5fdHlwZSA9IDA7XG4gICAgdGhpcy5fZml4dHVyZXMgPSBbXTtcbiAgICB0aGlzLl9wb2ludHMgPSBbXTtcbiAgICB0aGlzLl9ub3JtYWxzID0gW107XG4gICAgdGhpcy5fZnJhY3Rpb25zID0gW107XG59XG5cblBoeXNpY3NSYXlDYXN0Q2FsbGJhY2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuX2ZpeHR1cmVzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fcG9pbnRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fbm9ybWFscy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX2ZyYWN0aW9ucy5sZW5ndGggPSAwO1xufTtcblxuUGh5c2ljc1JheUNhc3RDYWxsYmFjay5wcm90b3R5cGUuUmVwb3J0Rml4dHVyZSA9IGZ1bmN0aW9uIChmaXh0dXJlLCBwb2ludCwgbm9ybWFsLCBmcmFjdGlvbikge1xuICAgIGlmICh0aGlzLl90eXBlID09PSAwKSB7IC8vIGNsb3Nlc3RcbiAgICAgICAgdGhpcy5fZml4dHVyZXNbMF0gPSBmaXh0dXJlO1xuICAgICAgICB0aGlzLl9wb2ludHNbMF0gPSBwb2ludDtcbiAgICAgICAgdGhpcy5fbm9ybWFsc1swXSA9IG5vcm1hbDtcbiAgICAgICAgdGhpcy5fZnJhY3Rpb25zWzBdID0gZnJhY3Rpb247XG4gICAgICAgIHJldHVybiBmcmFjdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLl9maXh0dXJlcy5wdXNoKGZpeHR1cmUpO1xuICAgIHRoaXMuX3BvaW50cy5wdXNoKGNjLnYyKHBvaW50KSk7XG4gICAgdGhpcy5fbm9ybWFscy5wdXNoKGNjLnYyKG5vcm1hbCkpO1xuICAgIHRoaXMuX2ZyYWN0aW9ucy5wdXNoKGZyYWN0aW9uKTtcbiAgICBcbiAgICBpZiAodGhpcy5fdHlwZSA9PT0gMSkgeyAvLyBhbnlcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuX3R5cGUgPj0gMikgeyAvLyBhbGxcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZyYWN0aW9uO1xufTtcblxuXG5QaHlzaWNzUmF5Q2FzdENhbGxiYWNrLnByb3RvdHlwZS5nZXRGaXh0dXJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZml4dHVyZXM7XG59O1xuXG5QaHlzaWNzUmF5Q2FzdENhbGxiYWNrLnByb3RvdHlwZS5nZXRQb2ludHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BvaW50cztcbn07XG5cblBoeXNpY3NSYXlDYXN0Q2FsbGJhY2sucHJvdG90eXBlLmdldE5vcm1hbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vcm1hbHM7XG59O1xuXG5QaHlzaWNzUmF5Q2FzdENhbGxiYWNrLnByb3RvdHlwZS5nZXRGcmFjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYWN0aW9ucztcbn07XG5cbmNjLlBoeXNpY3NSYXlDYXN0Q2FsbGJhY2sgPSBtb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3NSYXlDYXN0Q2FsbGJhY2s7XG4iXX0=