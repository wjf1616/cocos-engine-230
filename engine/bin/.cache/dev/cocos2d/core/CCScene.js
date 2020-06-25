
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCScene.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var NIL = function NIL() {};
/**
 * !#en
 * cc.Scene is a subclass of cc.Node that is used only as an abstract concept.<br/>
 * cc.Scene and cc.Node are almost identical with the difference that users can not modify cc.Scene manually.
 * !#zh
 * cc.Scene 是 cc.Node 的子类，仅作为一个抽象的概念。<br/>
 * cc.Scene 和 cc.Node 有点不同，用户不应直接修改 cc.Scene。
 * @class Scene
 * @extends Node
 */


cc.Scene = cc.Class({
  name: 'cc.Scene',
  "extends": require('./CCNode'),
  properties: {
    _is3DNode: {
      "default": true,
      override: true
    },

    /**
     * !#en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
     * !#zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
     * @property {Boolean} autoReleaseAssets
     * @default false
     */
    autoReleaseAssets: {
      "default": undefined,
      type: cc.Boolean
    }
  },
  ctor: function ctor() {
    this._anchorPoint.x = 0.0;
    this._anchorPoint.y = 0.0;
    this._activeInHierarchy = false;
    this._inited = !cc.game._isCloning;

    if (CC_EDITOR) {
      this._prefabSyncedInLiveReload = false;
    } // cache all depend assets for auto release


    this.dependAssets = null;
  },
  destroy: function destroy() {
    if (cc.Object.prototype.destroy.call(this)) {
      var children = this._children;

      for (var i = 0; i < children.length; ++i) {
        children[i].active = false;
      }
    }

    this._active = false;
    this._activeInHierarchy = false;
  },
  _onHierarchyChanged: NIL,
  _instantiate: null,
  _load: function _load() {
    if (!this._inited) {
      if (CC_TEST) {
        cc.assert(!this._activeInHierarchy, 'Should deactivate ActionManager and EventManager by default');
      }

      if (CC_EDITOR && this._prefabSyncedInLiveReload) {
        this._onBatchRestored();
      } else {
        this._onBatchCreated();
      }

      this._inited = true;
    }
  },
  _activate: function _activate(active) {
    active = active !== false;

    if (CC_EDITOR || CC_TEST) {
      // register all nodes to editor
      this._registerIfAttached(active);
    }

    cc.director._nodeActivator.activateNode(this, active);
  }
});
module.exports = cc.Scene;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2NlbmUuanMiXSwibmFtZXMiOlsiTklMIiwiY2MiLCJTY2VuZSIsIkNsYXNzIiwibmFtZSIsInJlcXVpcmUiLCJwcm9wZXJ0aWVzIiwiX2lzM0ROb2RlIiwib3ZlcnJpZGUiLCJhdXRvUmVsZWFzZUFzc2V0cyIsInVuZGVmaW5lZCIsInR5cGUiLCJCb29sZWFuIiwiY3RvciIsIl9hbmNob3JQb2ludCIsIngiLCJ5IiwiX2FjdGl2ZUluSGllcmFyY2h5IiwiX2luaXRlZCIsImdhbWUiLCJfaXNDbG9uaW5nIiwiQ0NfRURJVE9SIiwiX3ByZWZhYlN5bmNlZEluTGl2ZVJlbG9hZCIsImRlcGVuZEFzc2V0cyIsImRlc3Ryb3kiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJjYWxsIiwiY2hpbGRyZW4iLCJfY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiYWN0aXZlIiwiX2FjdGl2ZSIsIl9vbkhpZXJhcmNoeUNoYW5nZWQiLCJfaW5zdGFudGlhdGUiLCJfbG9hZCIsIkNDX1RFU1QiLCJhc3NlcnQiLCJfb25CYXRjaFJlc3RvcmVkIiwiX29uQmF0Y2hDcmVhdGVkIiwiX2FjdGl2YXRlIiwiX3JlZ2lzdGVySWZBdHRhY2hlZCIsImRpcmVjdG9yIiwiX25vZGVBY3RpdmF0b3IiLCJhY3RpdmF0ZU5vZGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQSxHQUFHLEdBQUcsU0FBTkEsR0FBTSxHQUFZLENBQUUsQ0FBeEI7QUFFQTs7Ozs7Ozs7Ozs7O0FBVUFDLEVBQUUsQ0FBQ0MsS0FBSCxHQUFXRCxFQUFFLENBQUNFLEtBQUgsQ0FBUztBQUNoQkMsRUFBQUEsSUFBSSxFQUFFLFVBRFU7QUFFaEIsYUFBU0MsT0FBTyxDQUFDLFVBQUQsQ0FGQTtBQUloQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFNBQVMsRUFBRTtBQUNQLGlCQUFTLElBREY7QUFFUEMsTUFBQUEsUUFBUSxFQUFFO0FBRkgsS0FESDs7QUFNUjs7Ozs7O0FBTUFDLElBQUFBLGlCQUFpQixFQUFFO0FBQ2YsaUJBQVNDLFNBRE07QUFFZkMsTUFBQUEsSUFBSSxFQUFFVixFQUFFLENBQUNXO0FBRk07QUFaWCxHQUpJO0FBdUJoQkMsRUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsU0FBS0MsWUFBTCxDQUFrQkMsQ0FBbEIsR0FBc0IsR0FBdEI7QUFDQSxTQUFLRCxZQUFMLENBQWtCRSxDQUFsQixHQUFzQixHQUF0QjtBQUVBLFNBQUtDLGtCQUFMLEdBQTBCLEtBQTFCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLENBQUNqQixFQUFFLENBQUNrQixJQUFILENBQVFDLFVBQXhCOztBQUVBLFFBQUlDLFNBQUosRUFBZTtBQUNYLFdBQUtDLHlCQUFMLEdBQWlDLEtBQWpDO0FBQ0gsS0FUYSxDQVdkOzs7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0gsR0FwQ2U7QUFzQ2hCQyxFQUFBQSxPQUFPLEVBQUUsbUJBQVk7QUFDakIsUUFBSXZCLEVBQUUsQ0FBQ3dCLE1BQUgsQ0FBVUMsU0FBVixDQUFvQkYsT0FBcEIsQ0FBNEJHLElBQTVCLENBQWlDLElBQWpDLENBQUosRUFBNEM7QUFDeEMsVUFBSUMsUUFBUSxHQUFHLEtBQUtDLFNBQXBCOztBQUNBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsUUFBUSxDQUFDRyxNQUE3QixFQUFxQyxFQUFFRCxDQUF2QyxFQUEwQztBQUN0Q0YsUUFBQUEsUUFBUSxDQUFDRSxDQUFELENBQVIsQ0FBWUUsTUFBWixHQUFxQixLQUFyQjtBQUNIO0FBQ0o7O0FBQ0QsU0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDQSxTQUFLaEIsa0JBQUwsR0FBMEIsS0FBMUI7QUFDSCxHQS9DZTtBQWlEaEJpQixFQUFBQSxtQkFBbUIsRUFBRWxDLEdBakRMO0FBa0RoQm1DLEVBQUFBLFlBQVksRUFBRyxJQWxEQztBQW9EaEJDLEVBQUFBLEtBQUssRUFBRSxpQkFBWTtBQUNmLFFBQUksQ0FBQyxLQUFLbEIsT0FBVixFQUFtQjtBQUNmLFVBQUltQixPQUFKLEVBQWE7QUFDVHBDLFFBQUFBLEVBQUUsQ0FBQ3FDLE1BQUgsQ0FBVSxDQUFDLEtBQUtyQixrQkFBaEIsRUFBb0MsNkRBQXBDO0FBQ0g7O0FBQ0QsVUFBSUksU0FBUyxJQUFJLEtBQUtDLHlCQUF0QixFQUFpRDtBQUM3QyxhQUFLaUIsZ0JBQUw7QUFDSCxPQUZELE1BR0s7QUFDRCxhQUFLQyxlQUFMO0FBQ0g7O0FBQ0QsV0FBS3RCLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDSixHQWpFZTtBQW1FaEJ1QixFQUFBQSxTQUFTLEVBQUUsbUJBQVVULE1BQVYsRUFBa0I7QUFDekJBLElBQUFBLE1BQU0sR0FBSUEsTUFBTSxLQUFLLEtBQXJCOztBQUNBLFFBQUlYLFNBQVMsSUFBSWdCLE9BQWpCLEVBQTBCO0FBQ3RCO0FBQ0EsV0FBS0ssbUJBQUwsQ0FBeUJWLE1BQXpCO0FBQ0g7O0FBQ0QvQixJQUFBQSxFQUFFLENBQUMwQyxRQUFILENBQVlDLGNBQVosQ0FBMkJDLFlBQTNCLENBQXdDLElBQXhDLEVBQThDYixNQUE5QztBQUNIO0FBMUVlLENBQVQsQ0FBWDtBQTZFQWMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCOUMsRUFBRSxDQUFDQyxLQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgTklMID0gZnVuY3Rpb24gKCkge307XG5cbi8qKlxuICogISNlblxuICogY2MuU2NlbmUgaXMgYSBzdWJjbGFzcyBvZiBjYy5Ob2RlIHRoYXQgaXMgdXNlZCBvbmx5IGFzIGFuIGFic3RyYWN0IGNvbmNlcHQuPGJyLz5cbiAqIGNjLlNjZW5lIGFuZCBjYy5Ob2RlIGFyZSBhbG1vc3QgaWRlbnRpY2FsIHdpdGggdGhlIGRpZmZlcmVuY2UgdGhhdCB1c2VycyBjYW4gbm90IG1vZGlmeSBjYy5TY2VuZSBtYW51YWxseS5cbiAqICEjemhcbiAqIGNjLlNjZW5lIOaYryBjYy5Ob2RlIOeahOWtkOexu++8jOS7heS9nOS4uuS4gOS4quaKveixoeeahOamguW/teOAgjxici8+XG4gKiBjYy5TY2VuZSDlkowgY2MuTm9kZSDmnInngrnkuI3lkIzvvIznlKjmiLfkuI3lupTnm7TmjqXkv67mlLkgY2MuU2NlbmXjgIJcbiAqIEBjbGFzcyBTY2VuZVxuICogQGV4dGVuZHMgTm9kZVxuICovXG5jYy5TY2VuZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2NlbmUnLFxuICAgIGV4dGVuZHM6IHJlcXVpcmUoJy4vQ0NOb2RlJyksXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9pczNETm9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgYWxsIChkaXJlY3RseSBvciBpbmRpcmVjdGx5KSBzdGF0aWMgcmVmZXJlbmNlZCBhc3NldHMgb2YgdGhpcyBzY2VuZSBhcmUgcmVsZWFzYWJsZSBieSBkZWZhdWx0IGFmdGVyIHNjZW5lIHVubG9hZGluZy5cbiAgICAgICAgICogISN6aCDmjIfnpLror6XlnLrmma/kuK3nm7TmjqXmiJbpl7TmjqXpnZnmgIHlvJXnlKjliLDnmoTmiYDmnInotYTmupDmmK/lkKbpu5jorqTlnKjlnLrmma/liIfmjaLlkI7oh6rliqjph4rmlL7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhdXRvUmVsZWFzZUFzc2V0c1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgYXV0b1JlbGVhc2VBc3NldHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJvb2xlYW5cbiAgICAgICAgfSxcblxuICAgIH0sXG5cbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2FuY2hvclBvaW50LnggPSAwLjA7XG4gICAgICAgIHRoaXMuX2FuY2hvclBvaW50LnkgPSAwLjA7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gIWNjLmdhbWUuX2lzQ2xvbmluZztcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9wcmVmYWJTeW5jZWRJbkxpdmVSZWxvYWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNhY2hlIGFsbCBkZXBlbmQgYXNzZXRzIGZvciBhdXRvIHJlbGVhc2VcbiAgICAgICAgdGhpcy5kZXBlbmRBc3NldHMgPSBudWxsO1xuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChjYy5PYmplY3QucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5ID0gZmFsc2U7XG4gICAgfSxcblxuICAgIF9vbkhpZXJhcmNoeUNoYW5nZWQ6IE5JTCxcbiAgICBfaW5zdGFudGlhdGUgOiBudWxsLFxuXG4gICAgX2xvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgICAgICAgIGlmIChDQ19URVNUKSB7XG4gICAgICAgICAgICAgICAgY2MuYXNzZXJ0KCF0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSwgJ1Nob3VsZCBkZWFjdGl2YXRlIEFjdGlvbk1hbmFnZXIgYW5kIEV2ZW50TWFuYWdlciBieSBkZWZhdWx0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmIHRoaXMuX3ByZWZhYlN5bmNlZEluTGl2ZVJlbG9hZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQmF0Y2hSZXN0b3JlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25CYXRjaENyZWF0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FjdGl2YXRlOiBmdW5jdGlvbiAoYWN0aXZlKSB7XG4gICAgICAgIGFjdGl2ZSA9IChhY3RpdmUgIT09IGZhbHNlKTtcbiAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICAvLyByZWdpc3RlciBhbGwgbm9kZXMgdG8gZWRpdG9yXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlcklmQXR0YWNoZWQoYWN0aXZlKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5kaXJlY3Rvci5fbm9kZUFjdGl2YXRvci5hY3RpdmF0ZU5vZGUodGhpcywgYWN0aXZlKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5TY2VuZTtcbiJdfQ==