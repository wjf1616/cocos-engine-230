
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/Device.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
var Device = function Device(canvasEL) {
  var ctx;

  try {
    ctx = canvasEL.getContext('2d');
  } catch (err) {
    console.error(err);
    return;
  } // statics


  this._canvas = canvasEL;
  this._ctx = ctx;
  this._caps = {}; // capability

  this._stats = {
    drawcalls: 0
  }; // runtime

  this._vx = this._vy = this._vw = this._vh = 0;
  this._sx = this._sy = this._sw = this._sh = 0;
};

Device.prototype._restoreTexture = function _restoreTexture(unit) {}; // ===============================
// Immediate Settings
// ===============================

/**
 * @method setViewport
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */


Device.prototype.setViewport = function setViewport(x, y, w, h) {
  if (this._vx !== x || this._vy !== y || this._vw !== w || this._vh !== h) {
    this._vx = x;
    this._vy = y;
    this._vw = w;
    this._vh = h;
  }
};
/**
 * @method setScissor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */


Device.prototype.setScissor = function setScissor(x, y, w, h) {
  if (this._sx !== x || this._sy !== y || this._sw !== w || this._sh !== h) {
    this._sx = x;
    this._sy = y;
    this._sw = w;
    this._sh = h;
  }
};

Device.prototype.clear = function clear(color) {
  var ctx = this._ctx;
  ctx.clearRect(this._vx, this._vy, this._vw, this._vh);

  if (color && (color[0] !== 0 || color[1] !== 0 || color[2] !== 0)) {
    ctx.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    ctx.globalAlpha = color[3];
    ctx.fillRect(this._vx, this._vy, this._vw, this._vh);
  }
};

Device.prototype.resetDrawCalls = function () {
  this._stats.drawcalls = 0;
};

Device.prototype.getDrawCalls = function () {
  return this._stats.drawcalls;
};

module.exports = Device;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRldmljZS5qcyJdLCJuYW1lcyI6WyJEZXZpY2UiLCJjYW52YXNFTCIsImN0eCIsImdldENvbnRleHQiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJfY2FudmFzIiwiX2N0eCIsIl9jYXBzIiwiX3N0YXRzIiwiZHJhd2NhbGxzIiwiX3Z4IiwiX3Z5IiwiX3Z3IiwiX3ZoIiwiX3N4IiwiX3N5IiwiX3N3IiwiX3NoIiwicHJvdG90eXBlIiwiX3Jlc3RvcmVUZXh0dXJlIiwidW5pdCIsInNldFZpZXdwb3J0IiwieCIsInkiLCJ3IiwiaCIsInNldFNjaXNzb3IiLCJjbGVhciIsImNvbG9yIiwiY2xlYXJSZWN0IiwiZmlsbFN0eWxlIiwiZ2xvYmFsQWxwaGEiLCJmaWxsUmVjdCIsInJlc2V0RHJhd0NhbGxzIiwiZ2V0RHJhd0NhbGxzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBO0FBRUEsSUFBSUEsTUFBTSxHQUFHLFNBQVNBLE1BQVQsQ0FBZ0JDLFFBQWhCLEVBQTBCO0FBQ3JDLE1BQUlDLEdBQUo7O0FBRUEsTUFBSTtBQUNGQSxJQUFBQSxHQUFHLEdBQUdELFFBQVEsQ0FBQ0UsVUFBVCxDQUFvQixJQUFwQixDQUFOO0FBQ0QsR0FGRCxDQUVFLE9BQU9DLEdBQVAsRUFBWTtBQUNaQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsR0FBZDtBQUNBO0FBQ0QsR0FSb0MsQ0FVckM7OztBQUNBLE9BQUtHLE9BQUwsR0FBZU4sUUFBZjtBQUNBLE9BQUtPLElBQUwsR0FBWU4sR0FBWjtBQUNBLE9BQUtPLEtBQUwsR0FBYSxFQUFiLENBYnFDLENBYXBCOztBQUNqQixPQUFLQyxNQUFMLEdBQWM7QUFDWkMsSUFBQUEsU0FBUyxFQUFFO0FBREMsR0FBZCxDQWRxQyxDQWtCckM7O0FBQ0EsT0FBS0MsR0FBTCxHQUFXLEtBQUtDLEdBQUwsR0FBVyxLQUFLQyxHQUFMLEdBQVcsS0FBS0MsR0FBTCxHQUFXLENBQTVDO0FBQ0Es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TSxDQUFDQyxPQUFQLEdBQWlCdEMsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiAgXG4gXG52YXIgRGV2aWNlID0gZnVuY3Rpb24gRGV2aWNlKGNhbnZhc0VMKSB7XG4gIHZhciBjdHg7XG5cbiAgdHJ5IHtcbiAgICBjdHggPSBjYW52YXNFTC5nZXRDb250ZXh0KCcyZCcpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gc3RhdGljc1xuICB0aGlzLl9jYW52YXMgPSBjYW52YXNFTDtcbiAgdGhpcy5fY3R4ID0gY3R4O1xuICB0aGlzLl9jYXBzID0ge307IC8vIGNhcGFiaWxpdHlcbiAgdGhpcy5fc3RhdHMgPSB7XG4gICAgZHJhd2NhbGxzOiAwLFxuICB9O1xuXG4gIC8vIHJ1bnRpbWVcbiAgdGhpcy5fdnggPSB0aGlzLl92eSA9IHRoaXMuX3Z3ID0gdGhpcy5fdmggPSAwO1xuICB0aGlzLl9zeCA9IHRoaXMuX3N5ID0gdGhpcy5fc3cgPSB0aGlzLl9zaCA9IDA7XG59O1xuXG5EZXZpY2UucHJvdG90eXBlLl9yZXN0b3JlVGV4dHVyZSA9IGZ1bmN0aW9uIF9yZXN0b3JlVGV4dHVyZSAodW5pdCkge1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW1tZWRpYXRlIFNldHRpbmdzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQG1ldGhvZCBzZXRWaWV3cG9ydFxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcGFyYW0ge051bWJlcn0gd1xuICogQHBhcmFtIHtOdW1iZXJ9IGhcbiAqL1xuRGV2aWNlLnByb3RvdHlwZS5zZXRWaWV3cG9ydCA9IGZ1bmN0aW9uIHNldFZpZXdwb3J0ICh4LCB5LCB3LCBoKSB7XG4gIGlmIChcbiAgICB0aGlzLl92eCAhPT0geCB8fFxuICAgIHRoaXMuX3Z5ICE9PSB5IHx8XG4gICAgdGhpcy5fdncgIT09IHcgfHxcbiAgICB0aGlzLl92aCAhPT0gaFxuICApIHtcbiAgICB0aGlzLl92eCA9IHg7XG4gICAgdGhpcy5fdnkgPSB5O1xuICAgIHRoaXMuX3Z3ID0gdztcbiAgICB0aGlzLl92aCA9IGg7XG4gIH1cbn07XG5cbi8qKlxuICogQG1ldGhvZCBzZXRTY2lzc29yXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEBwYXJhbSB7TnVtYmVyfSB3XG4gKiBAcGFyYW0ge051bWJlcn0gaFxuICovXG5EZXZpY2UucHJvdG90eXBlLnNldFNjaXNzb3IgPSBmdW5jdGlvbiBzZXRTY2lzc29yICh4LCB5LCB3LCBoKSB7XG4gIGlmIChcbiAgICB0aGlzLl9zeCAhPT0geCB8fFxuICAgIHRoaXMuX3N5ICE9PSB5IHx8XG4gICAgdGhpcy5fc3cgIT09IHcgfHxcbiAgICB0aGlzLl9zaCAhPT0gaFxuICApIHtcbiAgICB0aGlzLl9zeCA9IHg7XG4gICAgdGhpcy5fc3kgPSB5O1xuICAgIHRoaXMuX3N3ID0gdztcbiAgICB0aGlzLl9zaCA9IGg7XG4gIH1cbn07XG5cbkRldmljZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoY29sb3IpIHtcbiAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgY3R4LmNsZWFyUmVjdCh0aGlzLl92eCwgdGhpcy5fdnksIHRoaXMuX3Z3LCB0aGlzLl92aCk7XG4gIGlmIChjb2xvciAmJiAoY29sb3JbMF0gIT09IDAgfHwgY29sb3JbMV0gIT09IDAgfHwgY29sb3JbMl0gIT09IDApKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoJyArIGNvbG9yWzBdICsgJywnICsgY29sb3JbMV0gKyAnLCcgKyBjb2xvclsyXSArJyknO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGNvbG9yWzNdO1xuICAgIGN0eC5maWxsUmVjdCh0aGlzLl92eCwgdGhpcy5fdnksIHRoaXMuX3Z3LCB0aGlzLl92aCk7XG4gIH1cbn07XG5cbkRldmljZS5wcm90b3R5cGUucmVzZXREcmF3Q2FsbHMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX3N0YXRzLmRyYXdjYWxscyA9IDA7XG59XG5cbkRldmljZS5wcm90b3R5cGUuZ2V0RHJhd0NhbGxzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc3RhdHMuZHJhd2NhbGxzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERldmljZTtcbiJdfQ==