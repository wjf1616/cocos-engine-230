
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/scene/scene.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _memop = require("../memop");

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

/**
 * A representation of the scene
 */
var Scene =
/*#__PURE__*/
function () {
  /**
   * Setup a default empty scene
   */
  function Scene(app) {
    this._lights = new _memop.FixedArray(16);
    this._models = new _memop.FixedArray(16);
    this._cameras = new _memop.FixedArray(16);
    this._debugCamera = null;
    this._app = app; // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)

    this._views = [];
  }

  var _proto = Scene.prototype;

  _proto._add = function _add(pool, item) {
    if (item._poolID !== -1) {
      return;
    }

    pool.push(item);
    item._poolID = pool.length - 1;
  };

  _proto._remove = function _remove(pool, item) {
    if (item._poolID === -1) {
      return;
    }

    pool.data[pool.length - 1]._poolID = item._poolID;
    pool.fastRemove(item._poolID);
    item._poolID = -1;
  }
  /**
   * reset the model viewIDs
   */
  ;

  _proto.reset = function reset() {
    for (var i = 0; i < this._models.length; ++i) {
      var model = this._models.data[i];
      model._viewID = -1;
    }
  }
  /**
   * Set the debug camera
   * @param {Camera} cam the debug camera
   */
  ;

  _proto.setDebugCamera = function setDebugCamera(cam) {
    this._debugCamera = cam;
  }
  /**
   * Get the count of registered cameras
   * @returns {number} camera count
   */
  ;

  _proto.getCameraCount = function getCameraCount() {
    return this._cameras.length;
  }
  /**
   * Get the specified camera
   * @param {number} idx camera index
   * @returns {Camera} the specified camera
   */
  ;

  _proto.getCamera = function getCamera(idx) {
    return this._cameras.data[idx];
  }
  /**
   * register a camera
   * @param {Camera} camera the new camera
   */
  ;

  _proto.addCamera = function addCamera(camera) {
    this._add(this._cameras, camera);
  }
  /**
   * remove a camera
   * @param {Camera} camera the camera to be removed
   */
  ;

  _proto.removeCamera = function removeCamera(camera) {
    this._remove(this._cameras, camera);
  }
  /**
   * Get the count of registered model
   * @returns {number} model count
   */
  ;

  _proto.getModelCount = function getModelCount() {
    return this._models.length;
  }
  /**
   * Get the specified model
   * @param {number} idx model index
   * @returns {Model} the specified model
   */
  ;

  _proto.getModel = function getModel(idx) {
    return this._models.data[idx];
  }
  /**
   * register a model
   * @param {Model} model the new model
   */
  ;

  _proto.addModel = function addModel(model) {
    this._add(this._models, model);
  }
  /**
   * remove a model
   * @param {Model} model the model to be removed
   */
  ;

  _proto.removeModel = function removeModel(model) {
    this._remove(this._models, model);
  }
  /**
   * Get the count of registered light
   * @returns {number} light count
   */
  ;

  _proto.getLightCount = function getLightCount() {
    return this._lights.length;
  }
  /**
   * Get the specified light
   * @param {number} idx light index
   * @returns {Light} the specified light
   */
  ;

  _proto.getLight = function getLight(idx) {
    return this._lights.data[idx];
  }
  /**
   * register a light
   * @param {Light} light the new light
   */
  ;

  _proto.addLight = function addLight(light) {
    this._add(this._lights, light);
  }
  /**
   * remove a light
   * @param {Light} light the light to be removed
   */
  ;

  _proto.removeLight = function removeLight(light) {
    this._remove(this._lights, light);
  }
  /**
   * register a view
   * @param {View} view the new view
   */
  ;

  _proto.addView = function addView(view) {
    if (this._views.indexOf(view) === -1) {
      this._views.push(view);
    }
  }
  /**
   * remove a view
   * @param {View} view the view to be removed
   */
  ;

  _proto.removeView = function removeView(view) {
    var idx = this._views.indexOf(view);

    if (idx !== -1) {
      this._views.splice(idx, 1);
    }
  };

  return Scene;
}();

var _default = Scene;
exports["default"] = _default;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjZW5lLmpzIl0sIm5hbWVzIjpbIlNjZW5lIiwiYXBwIiwiX2xpZ2h0cyIsIkZpeGVkQXJyYXkiLCJfbW9kZWxzIiwiX2NhbWVyYXMiLCJfZGVidWdDYW1lcmEiLCJfYXBwIiwiX3ZpZXdzIiwiX2FkZCIsInBvb2wiLCJpdGVtIiwiX3Bvb2xJRCIsInB1c2giLCJsZW5ndGgiLCJfcmVtb3ZlIiwiZGF0YSIsImZhc3RSZW1vdmUiLCJyZXNldCIsImkiLCJtb2RlbCIsIl92aWV3SUQiLCJzZXREZWJ1Z0NhbWVyYSIsImNhbSIsImdldENhbWVyYUNvdW50IiwiZ2V0Q2FtZXJhIiwiaWR4IiwiYWRkQ2FtZXJhIiwiY2FtZXJhIiwicmVtb3ZlQ2FtZXJhIiwiZ2V0TW9kZWxDb3VudCIsImdldE1vZGVsIiwiYWRkTW9kZWwiLCJyZW1vdmVNb2RlbCIsImdldExpZ2h0Q291bnQiLCJnZXRMaWdodCIsImFkZExpZ2h0IiwibGlnaHQiLCJyZW1vdmVMaWdodCIsImFkZFZpZXciLCJ2aWV3IiwiaW5kZXhPZiIsInJlbW92ZVZpZXciLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFGQTs7QUFJQTs7O0lBR01BOzs7QUFDSjs7O0FBR0EsaUJBQVlDLEdBQVosRUFBaUI7QUFDZixTQUFLQyxPQUFMLEdBQWUsSUFBSUMsaUJBQUosQ0FBZSxFQUFmLENBQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUQsaUJBQUosQ0FBZSxFQUFmLENBQWY7QUFDQSxTQUFLRSxRQUFMLEdBQWdCLElBQUlGLGlCQUFKLENBQWUsRUFBZixDQUFoQjtBQUNBLFNBQUtHLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLQyxJQUFMLEdBQVlOLEdBQVosQ0FMZSxDQU9mOztBQUNBLFNBQUtPLE1BQUwsR0FBYyxFQUFkO0FBQ0Q7Ozs7U0FFREMsT0FBQSxjQUFLQyxJQUFMLEVBQVdDLElBQVgsRUFBaUI7QUFDZixRQUFJQSxJQUFJLENBQUNDLE9BQUwsS0FBaUIs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Ozs7O1NBSUFFLFVBQUEsaUJBQVFDLElBQVIsRUFBYztBQUNaLFFBQUksS0FBS2hDLE1BQUwsQ0FBWWlDLE9BQVosQ0FBb0JELElBQXBCLE1BQThCLENBQUMsQ0FBbkMsRUFBc0M7QUFDcEMsV0FBS2hDLE1BQUwsQ0FBWUssSUFBWixDQUFpQjJCLElBQWpCO0FBQ0Q7QUFDRjtBQUVEOzs7Ozs7U0FJQUUsYUFBQSxvQkFBV0YsSUFBWCxFQUFpQjtBQUNmLFFBQUlkLEdBQUcsR0FBRyxLQUFLbEIsTUFBTCxDQUFZaUMsT0FBWixDQUFvQkQsSUFBcEIsQ0FBVjs7QUFDQSxRQUFJZCxHQUFHLEtBQUssQ0FBQyxDQUFiLEVBQWdCO0FBQ2QsV0FBS2xCLE1BQUwsQ0FBWW1DLE1BQVosQ0FBbUJqQixHQUFuQixFQUF3QixDQUF4QjtBQUNEO0FBQ0Y7Ozs7O2VBR1kxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG5pbXBvcnQgeyBGaXhlZEFycmF5IH0gZnJvbSAnLi4vbWVtb3AnO1xuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNjZW5lXG4gKi9cbmNsYXNzIFNjZW5lIHtcbiAgLyoqXG4gICAqIFNldHVwIGEgZGVmYXVsdCBlbXB0eSBzY2VuZVxuICAgKi9cbiAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgdGhpcy5fbGlnaHRzID0gbmV3IEZpeGVkQXJyYXkoMTYpO1xuICAgIHRoaXMuX21vZGVscyA9IG5ldyBGaXhlZEFycmF5KDE2KTtcbiAgICB0aGlzLl9jYW1lcmFzID0gbmV3IEZpeGVkQXJyYXkoMTYpO1xuICAgIHRoaXMuX2RlYnVnQ2FtZXJhID0gbnVsbDtcbiAgICB0aGlzLl9hcHAgPSBhcHA7XG5cbiAgICAvLyBOT1RFOiB3ZSBkb24ndCB1c2UgcG9vbCBmb3Igdmlld3MgKGJlY2F1c2UgaXQncyBsZXNzIGNoYW5nZWQgYW5kIGl0IGRvZXNuJ3QgaGF2ZSBwb29sSUQpXG4gICAgdGhpcy5fdmlld3MgPSBbXTtcbiAgfVxuXG4gIF9hZGQocG9vbCwgaXRlbSkge1xuICAgIGlmIChpdGVtLl9wb29sSUQgIT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9vbC5wdXNoKGl0ZW0pO1xuICAgIGl0ZW0uX3Bvb2xJRCA9IHBvb2wubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIF9yZW1vdmUocG9vbCwgaXRlbSkge1xuICAgIGlmIChpdGVtLl9wb29sSUQgPT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9vbC5kYXRhW3Bvb2wubGVuZ3RoLTFdLl9wb29sSUQgPSBpdGVtLl9wb29sSUQ7XG4gICAgcG9vbC5mYXN0UmVtb3ZlKGl0ZW0uX3Bvb2xJRCk7XG4gICAgaXRlbS5fcG9vbElEID0gLTE7XG4gIH1cblxuICAvKipcbiAgICogcmVzZXQgdGhlIG1vZGVsIHZpZXdJRHNcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxzLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuZGF0YVtpXTtcbiAgICAgIG1vZGVsLl92aWV3SUQgPSAtMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBkZWJ1ZyBjYW1lcmFcbiAgICogQHBhcmFtIHtDYW1lcmF9IGNhbSB0aGUgZGVidWcgY2FtZXJhXG4gICAqL1xuICBzZXREZWJ1Z0NhbWVyYShjYW0pIHtcbiAgICB0aGlzLl9kZWJ1Z0NhbWVyYSA9IGNhbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvdW50IG9mIHJlZ2lzdGVyZWQgY2FtZXJhc1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgY291bnRcbiAgICovXG4gIGdldENhbWVyYUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9jYW1lcmFzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNwZWNpZmllZCBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGlkeCBjYW1lcmEgaW5kZXhcbiAgICogQHJldHVybnMge0NhbWVyYX0gdGhlIHNwZWNpZmllZCBjYW1lcmFcbiAgICovXG4gIGdldENhbWVyYShpZHgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FtZXJhcy5kYXRhW2lkeF07XG4gIH1cblxuICAvKipcbiAgICogcmVnaXN0ZXIgYSBjYW1lcmFcbiAgICogQHBhcmFtIHtDYW1lcmF9IGNhbWVyYSB0aGUgbmV3IGNhbWVyYVxuICAgKi9cbiAgYWRkQ2FtZXJhKGNhbWVyYSkge1xuICAgIHRoaXMuX2FkZCh0aGlzLl9jYW1lcmFzLCBjYW1lcmEpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZSBhIGNhbWVyYVxuICAgKiBAcGFyYW0ge0NhbWVyYX0gY2FtZXJhIHRoZSBjYW1lcmEgdG8gYmUgcmVtb3ZlZFxuICAgKi9cbiAgcmVtb3ZlQ2FtZXJhKGNhbWVyYSkge1xuICAgIHRoaXMuX3JlbW92ZSh0aGlzLl9jYW1lcmFzLCBjYW1lcmEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY291bnQgb2YgcmVnaXN0ZXJlZCBtb2RlbFxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBtb2RlbCBjb3VudFxuICAgKi9cbiAgZ2V0TW9kZWxDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNwZWNpZmllZCBtb2RlbFxuICAgKiBAcGFyYW0ge251bWJlcn0gaWR4IG1vZGVsIGluZGV4XG4gICAqIEByZXR1cm5zIHtNb2RlbH0gdGhlIHNwZWNpZmllZCBtb2RlbFxuICAgKi9cbiAgZ2V0TW9kZWwoaWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVscy5kYXRhW2lkeF07XG4gIH1cblxuICAvKipcbiAgICogcmVnaXN0ZXIgYSBtb2RlbFxuICAgKiBAcGFyYW0ge01vZGVsfSBtb2RlbCB0aGUgbmV3IG1vZGVsXG4gICAqL1xuICBhZGRNb2RlbChtb2RlbCkge1xuICAgIHRoaXMuX2FkZCh0aGlzLl9tb2RlbHMsIG1vZGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgYSBtb2RlbFxuICAgKiBAcGFyYW0ge01vZGVsfSBtb2RlbCB0aGUgbW9kZWwgdG8gYmUgcmVtb3ZlZFxuICAgKi9cbiAgcmVtb3ZlTW9kZWwobW9kZWwpIHtcbiAgICB0aGlzLl9yZW1vdmUodGhpcy5fbW9kZWxzLCBtb2RlbCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3VudCBvZiByZWdpc3RlcmVkIGxpZ2h0XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IGNvdW50XG4gICAqL1xuICBnZXRMaWdodENvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9saWdodHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3BlY2lmaWVkIGxpZ2h0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpZHggbGlnaHQgaW5kZXhcbiAgICogQHJldHVybnMge0xpZ2h0fSB0aGUgc3BlY2lmaWVkIGxpZ2h0XG4gICAqL1xuICBnZXRMaWdodChpZHgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGlnaHRzLmRhdGFbaWR4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZWdpc3RlciBhIGxpZ2h0XG4gICAqIEBwYXJhbSB7TGlnaHR9IGxpZ2h0IHRoZSBuZXcgbGlnaHRcbiAgICovXG4gIGFkZExpZ2h0KGxpZ2h0KSB7XG4gICAgdGhpcy5fYWRkKHRoaXMuX2xpZ2h0cywgbGlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZSBhIGxpZ2h0XG4gICAqIEBwYXJhbSB7TGlnaHR9IGxpZ2h0IHRoZSBsaWdodCB0byBiZSByZW1vdmVkXG4gICAqL1xuICByZW1vdmVMaWdodChsaWdodCkge1xuICAgIHRoaXMuX3JlbW92ZSh0aGlzLl9saWdodHMsIGxpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZWdpc3RlciBhIHZpZXdcbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IHRoZSBuZXcgdmlld1xuICAgKi9cbiAgYWRkVmlldyh2aWV3KSB7XG4gICAgaWYgKHRoaXMuX3ZpZXdzLmluZGV4T2YodmlldykgPT09IC0xKSB7XG4gICAgICB0aGlzLl92aWV3cy5wdXNoKHZpZXcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgYSB2aWV3XG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyB0aGUgdmlldyB0byBiZSByZW1vdmVkXG4gICAqL1xuICByZW1vdmVWaWV3KHZpZXcpIHtcbiAgICBsZXQgaWR4ID0gdGhpcy5fdmlld3MuaW5kZXhPZih2aWV3KTtcbiAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fdmlld3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lO1xuIl19