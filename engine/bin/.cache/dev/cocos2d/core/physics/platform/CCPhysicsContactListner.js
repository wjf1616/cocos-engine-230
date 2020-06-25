
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/platform/CCPhysicsContactListner.js';
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
function PhysicsContactListener() {
  this._contactFixtures = [];
}

PhysicsContactListener.prototype.setBeginContact = function (cb) {
  this._BeginContact = cb;
};

PhysicsContactListener.prototype.setEndContact = function (cb) {
  this._EndContact = cb;
};

PhysicsContactListener.prototype.setPreSolve = function (cb) {
  this._PreSolve = cb;
};

PhysicsContactListener.prototype.setPostSolve = function (cb) {
  this._PostSolve = cb;
};

PhysicsContactListener.prototype.BeginContact = function (contact) {
  if (!this._BeginContact) return;
  var fixtureA = contact.GetFixtureA();
  var fixtureB = contact.GetFixtureB();
  var fixtures = this._contactFixtures;
  contact._shouldReport = false;

  if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
    contact._shouldReport = true; // for quick check whether this contact should report

    this._BeginContact(contact);
  }
};

PhysicsContactListener.prototype.EndContact = function (contact) {
  if (this._EndContact && contact._shouldReport) {
    contact._shouldReport = false;

    this._EndContact(contact);
  }
};

PhysicsContactListener.prototype.PreSolve = function (contact, oldManifold) {
  if (this._PreSolve && contact._shouldReport) {
    this._PreSolve(contact, oldManifold);
  }
};

PhysicsContactListener.prototype.PostSolve = function (contact, impulse) {
  if (this._PostSolve && contact._shouldReport) {
    this._PostSolve(contact, impulse);
  }
};

PhysicsContactListener.prototype.registerContactFixture = function (fixture) {
  this._contactFixtures.push(fixture);
};

PhysicsContactListener.prototype.unregisterContactFixture = function (fixture) {
  cc.js.array.remove(this._contactFixtures, fixture);
};

cc.PhysicsContactListener = module.exports = PhysicsContactListener;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc0NvbnRhY3RMaXN0bmVyLmpzIl0sIm5hbWVzIjpbIlBoeXNpY3NDb250YWN0TGlzdGVuZXIiLCJfY29udGFjdEZpeHR1cmVzIiwicHJvdG90eXBlIiwic2V0QmVnaW5Db250YWN0IiwiY2IiLCJfQmVnaW5Db250YWN0Iiwic2V0RW5kQ29udGFjdCIsIl9FbmRDb250YWN0Iiwic2V0UHJlU29sdmUiLCJfUHJlU29sdmUiLCJzZXRQb3N0U29sdmUiLCJfUG9zdFNvbHZlIiwiQmVnaW5Db250YWN0IiwiY29udGFjdCIsImZpeHR1cmVBIiwiR2V0Rml4dHVyZUEiLCJmaXh0dXJlQiIsIkdldEZpeHR1cmVCIiwiZml4dHVyZXMiLCJfc2hvdWxkUmVwb3J0IiwiaW5kZXhPZiIsIkVuZENvbnRhY3QiLCJQcmVTb2x2ZSIsIm9sZE1hbmlmb2xkIiwiUG9zdFNvbHZlIiwiaW1wdWxzZSIsInJlZ2lzdGVyQ29udGFjdEZpeHR1cmUiLCJmaXh0dXJlIiwicHVzaCIsInVucmVnaXN0ZXJDb250YWN0Rml4dHVyZSIsImNjIiwianMiLCJhcnJheSIsInJlbW92ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFNBQVNBLHNCQUFULEdBQW1DO0FBQy9CLE9BQUtDLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0g7O0FBRURELHNCQUFzQixDQUFDRSxTQUF2QixDQUFpQ0MsZUFBakMsR0FBbUQsVUFBVUMsRUFBVixFQUFjO0FBQzdELE9BQUtDLGFBQUwsR0FBcUJELEVBQXJCO0FBQ0gsQ0FGRDs7QUFJQUosc0JBQXNCLENBQUNFLFNBQXZCLENBQWlDSSxhQUFqQyxHQUFpRCxVQUFVRixFQUFWLEVBQWM7QUFDM0QsT0FBS0csV0FBTCxHQUFtQkgsRUFBbkI7QUFDSCxDQUZEOztBQUlBSixzQkFBc0IsQ0FBQ0UsU0FBdkIsQ0FBaUNNLFdBQWpDLEdBQStDLFVBQVVKLEVBQVYsRUFBYztBQUN6RCxPQUFLSyxTQUFMLEdBQWlCTCxFQUFqQjtBQUNILENBRkQ7O0FBSUFKLHNCQUFzQixDQUFDRSxTQUF2QixDQUFpQ1EsWUFBakMsR0FBZ0QsVUFBVU4sRUFBVixFQUFjO0FBQzFELE9BQUtPLFVBQUwsR0FBa0JQLEVBQWxCO0FBQ0gsQ0FGRDs7QUFJQUosc0JBQXNCLENBQUNFLFNBQXZCLENBQWlDVSxZQUFqQyxHQUFnRCxVQUFVQyxPQUFWLEVBQW1CO0FBQy9ELE1BQUksQ0FBQyxLQUFLUixhQUFWLEVBQXlCO0FBRXpCLE1BQUlTLFFBQVEsR0FBR0QsT0FBTyxDQUFDRSxXQUFSLEVBQWY7QUFDQSxNQUFJQyxRQUFRLEdBQUdILE9BQU8sQ0FBQ0ksV0FBUixFQUFmO0FBQ0EsTUFBSUMsUUFBUSxHQUFHLEtBQUtqQixnQkFBcEI7QUFFQVksRUFBQUEsT0FBTyxDQUFDTSxhQUFSLEdBQXdCLEtBQXhCOztBQUVBLE1BQUlELFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQk4sUUFBakIsTUFBK0IsQ0FBQyxDQUFoQyxJQUFxQ0ksUUFBUSxDQUFDRSxPQUFULENBQWlCSixRQUFqQixNQUErQixDQUFDLENBQXpFLEVBQTRFO0FBQ3hFSCxJQUFBQSxPQUFPLENBQUNNLGFBQVIsR0FBd0IsSUFBeEIsQ0FEd0UsQ0FDMUM7O0FBQzlCLFNBQUtkLGFBQUwsQ0FBbUJRLE9BQW5CO0FBQ0g7QUFDSixDQWJEOztBQWVBYixzQkFBc0IsQ0FBQ0UsU0FBdkIsQ0FBaUNtQixVQUFqQyxHQUE4QyxVQUFVUixPQUFWLEVBQW1CO0FBQzdELE1BQUksS0FBS04sV0FBTCxJQUFvQk0sT0FBTyxDQUFDTSxhQUFoQyxFQUErQztBQUMzQ04sSUFBQUEsT0FBTyxDQUFDTSxhQUFSLEdBQXdCLEtBQXhCOztBQUNBLFNBQUtaLFdBQUwsQ0FBaUJNLE9BQWpCO0FBQ0g7QUFDSixDQUxEOztBQU9BYixzQkFBc0IsQ0FBQ0UsU0FBdkIsQ0FBaUNvQixRQUFqQyxHQUE0QyxVQUFVVCxPQUFWLEVBQW1CVSxXQUFuQixFQUFnQztBQUN4RSxNQUFJLEtBQUtkLFNBQUwsSUFBa0JJLE9BQU8sQ0FBQ00sYUFBOUIsRUFBNkM7QUFDekMsU0FBS1YsU0FBTCxDQUFlSSxPQUFmLEVBQXdCVSxXQUF4QjtBQUNIO0FBQ0osQ0FKRDs7QUFNQXZCLHNCQUFzQixDQUFDRSxTQUF2QixDQUFpQ3NCLFNBQWpDLEdBQTZDLFVBQVVYLE9BQVYsRUFBbUJZLE9BQW5CLEVBQTRCO0FBQ3JFLE1BQUksS0FBS2QsVUFBTCxJQUFtQkUsT0FBTyxDQUFDTSxhQUEvQixFQUE4QztBQUMxQyxTQUFLUixVQUFMLENBQWdCRSxPQUFoQixFQUF5QlksT0FBekI7QUFDSDtBQUNKLENBSkQ7O0FBTUF6QixzQkFBc0IsQ0FBQ0UsU0FBdkIsQ0FBaUN3QixzQkFBakMsR0FBMEQsVUFBVUMsT0FBVixFQUFtQjtBQUN6RSxPQUFLMUIsZ0JBQUwsQ0FBc0IyQixJQUF0QixDQUEyQkQsT0FBM0I7QUFDSCxDQUZEOztBQUlBM0Isc0JBQXNCLENBQUNFLFNBQXZCLENBQWlDMkIsd0JBQWpDLEdBQTRELFVBQVVGLE9BQVYsRUFBbUI7QUFDM0VHLEVBQUFBLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNQyxLQUFOLENBQVlDLE1BQVosQ0FBbUIsS0FBS2hDLGdCQUF4QixFQUEwQzBCLE9BQTFDO0FBQ0gsQ0FGRDs7QUFJQUcsRUFBRSxDQUFDOUIsc0JBQUgsR0FBNEJrQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJuQyxzQkFBN0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbmZ1bmN0aW9uIFBoeXNpY3NDb250YWN0TGlzdGVuZXIgKCkge1xuICAgIHRoaXMuX2NvbnRhY3RGaXh0dXJlcyA9IFtdO1xufVxuXG5QaHlzaWNzQ29udGFjdExpc3RlbmVyLnByb3RvdHlwZS5zZXRCZWdpbkNvbnRhY3QgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICB0aGlzLl9CZWdpbkNvbnRhY3QgPSBjYjtcbn07XG5cblBoeXNpY3NDb250YWN0TGlzdGVuZXIucHJvdG90eXBlLnNldEVuZENvbnRhY3QgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICB0aGlzLl9FbmRDb250YWN0ID0gY2I7XG59O1xuXG5QaHlzaWNzQ29udGFjdExpc3RlbmVyLnByb3RvdHlwZS5zZXRQcmVTb2x2ZSA9IGZ1bmN0aW9uIChjYikge1xuICAgIHRoaXMuX1ByZVNvbHZlID0gY2I7XG59O1xuXG5QaHlzaWNzQ29udGFjdExpc3RlbmVyLnByb3RvdHlwZS5zZXRQb3N0U29sdmUgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICB0aGlzLl9Qb3N0U29sdmUgPSBjYjtcbn07XG5cblBoeXNpY3NDb250YWN0TGlzdGVuZXIucHJvdG90eXBlLkJlZ2luQ29udGFjdCA9IGZ1bmN0aW9uIChjb250YWN0KSB7XG4gICAgaWYgKCF0aGlzLl9CZWdpbkNvbnRhY3QpIHJldHVybjtcblxuICAgIHZhciBmaXh0dXJlQSA9IGNvbnRhY3QuR2V0Rml4dHVyZUEoKTtcbiAgICB2YXIgZml4dHVyZUIgPSBjb250YWN0LkdldEZpeHR1cmVCKCk7XG4gICAgdmFyIGZpeHR1cmVzID0gdGhpcy5fY29udGFjdEZpeHR1cmVzO1xuICAgIFxuICAgIGNvbnRhY3QuX3Nob3VsZFJlcG9ydCA9IGZhbHNlO1xuICAgIFxuICAgIGlmIChmaXh0dXJlcy5pbmRleE9mKGZpeHR1cmVBKSAhPT0gLTEgfHwgZml4dHVyZXMuaW5kZXhPZihmaXh0dXJlQikgIT09IC0xKSB7XG4gICAgICAgIGNvbnRhY3QuX3Nob3VsZFJlcG9ydCA9IHRydWU7IC8vIGZvciBxdWljayBjaGVjayB3aGV0aGVyIHRoaXMgY29udGFjdCBzaG91bGQgcmVwb3J0XG4gICAgICAgIHRoaXMuX0JlZ2luQ29udGFjdChjb250YWN0KTtcbiAgICB9XG59O1xuXG5QaHlzaWNzQ29udGFjdExpc3RlbmVyLnByb3RvdHlwZS5FbmRDb250YWN0ID0gZnVuY3Rpb24gKGNvbnRhY3QpIHtcbiAgICBpZiAodGhpcy5fRW5kQ29udGFjdCAmJiBjb250YWN0Ll9zaG91bGRSZXBvcnQpIHtcbiAgICAgICAgY29udGFjdC5fc2hvdWxkUmVwb3J0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX0VuZENvbnRhY3QoY29udGFjdCk7XG4gICAgfVxufTtcblxuUGh5c2ljc0NvbnRhY3RMaXN0ZW5lci5wcm90b3R5cGUuUHJlU29sdmUgPSBmdW5jdGlvbiAoY29udGFjdCwgb2xkTWFuaWZvbGQpIHtcbiAgICBpZiAodGhpcy5fUHJlU29sdmUgJiYgY29udGFjdC5fc2hvdWxkUmVwb3J0KSB7XG4gICAgICAgIHRoaXMuX1ByZVNvbHZlKGNvbnRhY3QsIG9sZE1hbmlmb2xkKTtcbiAgICB9XG59O1xuXG5QaHlzaWNzQ29udGFjdExpc3RlbmVyLnByb3RvdHlwZS5Qb3N0U29sdmUgPSBmdW5jdGlvbiAoY29udGFjdCwgaW1wdWxzZSkge1xuICAgIGlmICh0aGlzLl9Qb3N0U29sdmUgJiYgY29udGFjdC5fc2hvdWxkUmVwb3J0KSB7XG4gICAgICAgIHRoaXMuX1Bvc3RTb2x2ZShjb250YWN0LCBpbXB1bHNlKTtcbiAgICB9XG59O1xuXG5QaHlzaWNzQ29udGFjdExpc3RlbmVyLnByb3RvdHlwZS5yZWdpc3RlckNvbnRhY3RGaXh0dXJlID0gZnVuY3Rpb24gKGZpeHR1cmUpIHtcbiAgICB0aGlzLl9jb250YWN0Rml4dHVyZXMucHVzaChmaXh0dXJlKTtcbn07XG5cblBoeXNpY3NDb250YWN0TGlzdGVuZXIucHJvdG90eXBlLnVucmVnaXN0ZXJDb250YWN0Rml4dHVyZSA9IGZ1bmN0aW9uIChmaXh0dXJlKSB7XG4gICAgY2MuanMuYXJyYXkucmVtb3ZlKHRoaXMuX2NvbnRhY3RGaXh0dXJlcywgZml4dHVyZSk7XG59O1xuXG5jYy5QaHlzaWNzQ29udGFjdExpc3RlbmVyID0gbW9kdWxlLmV4cG9ydHMgPSBQaHlzaWNzQ29udGFjdExpc3RlbmVyO1xuIl19