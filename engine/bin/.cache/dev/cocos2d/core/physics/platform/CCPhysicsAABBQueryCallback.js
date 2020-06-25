
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/platform/CCPhysicsAABBQueryCallback.js';
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
var BodyType = require('../CCPhysicsTypes').BodyType;

function PhysicsAABBQueryCallback() {
  this._point = new b2.Vec2();
  this._isPoint = false;
  this._fixtures = [];
}

PhysicsAABBQueryCallback.prototype.init = function (point) {
  if (point) {
    this._isPoint = true;
    this._point.x = point.x;
    this._point.y = point.y;
  } else {
    this._isPoint = false;
  }

  this._fixtures.length = 0;
};

PhysicsAABBQueryCallback.prototype.ReportFixture = function (fixture) {
  var body = fixture.GetBody();

  if (body.GetType() === BodyType.Dynamic) {
    if (this._isPoint) {
      if (fixture.TestPoint(this._point)) {
        this._fixtures.push(fixture); // We are done, terminate the query.


        return false;
      }
    } else {
      this._fixtures.push(fixture);
    }
  } // True to continue the query, false to terminate the query.


  return true;
};

PhysicsAABBQueryCallback.prototype.getFixture = function () {
  return this._fixtures[0];
};

PhysicsAABBQueryCallback.prototype.getFixtures = function () {
  return this._fixtures;
};

cc.PhysicsAABBQueryCallback = module.exports = PhysicsAABBQueryCallback;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc0FBQkJRdWVyeUNhbGxiYWNrLmpzIl0sIm5hbWVzIjpbIkJvZHlUeXBlIiwicmVxdWlyZSIsIlBoeXNpY3NBQUJCUXVlcnlDYWxsYmFjayIsIl9wb2ludCIsImIyIiwiVmVjMiIsIl9pc1BvaW50IiwiX2ZpeHR1cmVzIiwicHJvdG90eXBlIiwiaW5pdCIsInBvaW50IiwieCIsInkiLCJsZW5ndGgiLCJSZXBvcnRGaXh0dXJlIiwiZml4dHVyZSIsImJvZHkiLCJHZXRCb2R5IiwiR2V0VHlwZSIsIkR5bmFtaWMiLCJUZXN0UG9pbnQiLCJwdXNoIiwiZ2V0Rml4dHVyZSIsImdldEZpeHR1cmVzIiwiY2MiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFNQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCRCxRQUE5Qzs7QUFFQSxTQUFTRSx3QkFBVCxHQUFxQztBQUNqQyxPQUFLQyxNQUFMLEdBQWMsSUFBSUMsRUFBRSxDQUFDQyxJQUFQLEVBQWQ7QUFDQSxPQUFLQyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNIOztBQUVETCx3QkFBd0IsQ0FBQ00sU0FBekIsQ0FBbUNDLElBQW5DLEdBQTBDLFVBQVVDLEtBQVYsRUFBaUI7QUFDdkQsTUFBSUEsS0FBSixFQUFXO0FBQ1AsU0FBS0osUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtILE1BQUwsQ0FBWVEsQ0FBWixHQUFnQkQsS0FBSyxDQUFDQyxDQUF0QjtBQUNBLFNBQUtSLE1BQUwsQ0FBWVMsQ0FBWixHQUFnQkYsS0FBSyxDQUFDRSxDQUF0QjtBQUNILEdBSkQsTUFLSztBQUNELFNBQUtOLFFBQUwsR0FBZ0IsS0FBaEI7QUFDSDs7QUFFRCxPQUFLQyxTQUFMLENBQWVNLE1BQWYsR0FBd0IsQ0FBeEI7QUFDSCxDQVhEOztBQWFBWCx3QkFBd0IsQ0FBQ00sU0FBekIsQ0FBbUNNLGFBQW5DLEdBQW1ELFVBQVVDLE9BQVYsRUFBbUI7QUFDbEUsTUFBSUMsSUFBSSxHQUFHRCxPQUFPLENBQUNFLE9BQVIsRUFBWDs7QUFDQSxNQUFJRCxJQUFJLENBQUNFLE9BQUwsT0FBbUJsQixRQUFRLENBQUNtQixPQUFoQyxFQUF5QztBQUNyQyxRQUFJLEtBQUtiLFFBQVQsRUFBbUI7QUFDZixVQUFJUyxPQUFPLENBQUNLLFNBQVIsQ0FBa0IsS0FBS2pCLE1BQXZCLENBQUosRUFBb0M7QUFDaEMsYUFBS0ksU0FBTCxDQUFlYyxJQUFmLENBQW9CTixPQUFwQixFQURnQyxDQUVoQzs7O0FBQ0EsZUFBTyxLQUFQO0FBQ0g7QUFDSixLQU5ELE1BT0s7QUFDRCxXQUFLUixTQUFMLENBQWVjLElBQWYsQ0FBb0JOLE9BQXBCO0FBQ0g7QUFDSixHQWJpRSxDQWVsRTs7O0FBQ0EsU0FBTyxJQUFQO0FBQ0gsQ0FqQkQ7O0FBbUJBYix3QkFBd0IsQ0FBQ00sU0FBekIsQ0FBbUNjLFVBQW5DLEdBQWdELFlBQVk7QUFDeEQsU0FBTyxLQUFLZixTQUFMLENBQWUsQ0FBZixDQUFQO0FBQ0gsQ0FGRDs7QUFJQUwsd0JBQXdCLENBQUNNLFNBQXpCLENBQW1DZSxXQUFuQyxHQUFpRCxZQUFZO0FBQ3pELFNBQU8sS0FBS2hCLFNBQVo7QUFDSCxDQUZEOztBQUlBaUIsRUFBRSxDQUFDdEIsd0JBQUgsR0FBOEJ1QixNQUFNLENBQUNDLE9BQVAsR0FBaUJ4Qix3QkFBL0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBCb2R5VHlwZSA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuQm9keVR5cGU7XG5cbmZ1bmN0aW9uIFBoeXNpY3NBQUJCUXVlcnlDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5fcG9pbnQgPSBuZXcgYjIuVmVjMigpO1xuICAgIHRoaXMuX2lzUG9pbnQgPSBmYWxzZTtcbiAgICB0aGlzLl9maXh0dXJlcyA9IFtdO1xufVxuXG5QaHlzaWNzQUFCQlF1ZXJ5Q2FsbGJhY2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICBpZiAocG9pbnQpIHtcbiAgICAgICAgdGhpcy5faXNQb2ludCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BvaW50LnggPSBwb2ludC54O1xuICAgICAgICB0aGlzLl9wb2ludC55ID0gcG9pbnQueTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2lzUG9pbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fZml4dHVyZXMubGVuZ3RoID0gMDtcbn07XG5cblBoeXNpY3NBQUJCUXVlcnlDYWxsYmFjay5wcm90b3R5cGUuUmVwb3J0Rml4dHVyZSA9IGZ1bmN0aW9uIChmaXh0dXJlKSB7XG4gICAgdmFyIGJvZHkgPSBmaXh0dXJlLkdldEJvZHkoKTtcbiAgICBpZiAoYm9keS5HZXRUeXBlKCkgPT09IEJvZHlUeXBlLkR5bmFtaWMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUG9pbnQpIHtcbiAgICAgICAgICAgIGlmIChmaXh0dXJlLlRlc3RQb2ludCh0aGlzLl9wb2ludCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maXh0dXJlcy5wdXNoKGZpeHR1cmUpO1xuICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBkb25lLCB0ZXJtaW5hdGUgdGhlIHF1ZXJ5LlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpeHR1cmVzLnB1c2goZml4dHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcnVlIHRvIGNvbnRpbnVlIHRoZSBxdWVyeSwgZmFsc2UgdG8gdGVybWluYXRlIHRoZSBxdWVyeS5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cblBoeXNpY3NBQUJCUXVlcnlDYWxsYmFjay5wcm90b3R5cGUuZ2V0Rml4dHVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZml4dHVyZXNbMF07XG59O1xuXG5QaHlzaWNzQUFCQlF1ZXJ5Q2FsbGJhY2sucHJvdG90eXBlLmdldEZpeHR1cmVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9maXh0dXJlcztcbn07XG5cbmNjLlBoeXNpY3NBQUJCUXVlcnlDYWxsYmFjayA9IG1vZHVsZS5leHBvcnRzID0gUGh5c2ljc0FBQkJRdWVyeUNhbGxiYWNrO1xuIl19