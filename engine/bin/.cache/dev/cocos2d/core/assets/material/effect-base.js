
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/effect-base.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _pass = _interopRequireDefault(require("../../../renderer/core/pass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var gfx = cc.gfx;

var EffectBase =
/*#__PURE__*/
function () {
  function EffectBase() {
    this._dirty = true;
    this._name = '';
    this._technique = null;
  }

  var _proto = EffectBase.prototype;

  _proto._createPassProp = function _createPassProp(name, pass) {
    var prop = pass._properties[name];

    if (!prop) {
      return;
    }

    var uniform = Object.create(null);
    uniform.name = name;
    uniform.type = prop.type;

    if (prop.value instanceof Float32Array) {
      uniform.value = new Float32Array(prop.value);
    } else {
      uniform.value = prop.value;
    }

    pass._properties[name] = uniform;
    return uniform;
  };

  _proto._setPassProperty = function _setPassProperty(name, value, pass, directly) {
    var properties = pass._properties;
    var uniform = properties.hasOwnProperty(name);

    if (!uniform) {
      uniform = this._createPassProp(name, pass);
    } else if (uniform.value === value) return;

    this._dirty = true;
    return _pass["default"].prototype.setProperty.call(pass, name, value, directly);
  };

  _proto.setProperty = function setProperty(name, value, passIdx, directly) {
    var success = false;
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      if (this._setPassProperty(name, value, passes[i], directly)) {
        success = true;
      }
    }

    if (!success) {
      cc.warnID(9103, this.name, name);
    }
  };

  _proto.getProperty = function getProperty(name, passIdx) {
    var passes = this.passes;
    if (passIdx >= passes.length) return;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      var value = passes[i].getProperty(name);

      if (value !== undefined) {
        return value;
      }
    }
  };

  _proto.define = function define(name, value, passIdx, force) {
    var success = false;
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      if (passes[i].define(name, value, force)) {
        success = true;
      }
    }

    if (!success) {
      cc.warnID(9104, this.name, name);
    }
  };

  _proto.getDefine = function getDefine(name, passIdx) {
    var passes = this.passes;
    if (passIdx >= passes.length) return;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      var value = passes[i].getDefine(name);

      if (value !== undefined) {
        return value;
      }
    }
  };

  _proto.setCullMode = function setCullMode(cullMode, passIdx) {
    if (cullMode === void 0) {
      cullMode = gfx.CULL_BACK;
    }

    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setCullMode(cullMode);
    }

    this._dirty = true;
  };

  _proto.setDepth = function setDepth(depthTest, depthWrite, depthFunc, passIdx) {
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setDepth(depthTest, depthWrite, depthFunc);
    }

    this._dirty = true;
  };

  _proto.setBlend = function setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx) {
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor);
    }

    this._dirty = true;
  };

  _proto.setStencilEnabled = function setStencilEnabled(stencilTest, passIdx) {
    if (stencilTest === void 0) {
      stencilTest = gfx.STENCIL_INHERIT;
    }

    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setStencilEnabled(stencilTest);
    }

    this._dirty = true;
  };

  _proto.setStencil = function setStencil(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx) {
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      var pass = passes[i];
      pass.setStencilFront(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
      pass.setStencilBack(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
    }

    this._dirty = true;
  };

  _createClass(EffectBase, [{
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "technique",
    get: function get() {
      return this._technique;
    }
  }, {
    key: "passes",
    get: function get() {
      return [];
    }
  }]);

  return EffectBase;
}();

exports["default"] = EffectBase;
cc.EffectBase = EffectBase;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVmZmVjdC1iYXNlLnRzIl0sIm5hbWVzIjpbImdmeCIsImNjIiwiRWZmZWN0QmFzZSIsIl9kaXJ0eSIsIl9uYW1lIiwiX3RlY2huaXF1ZSIsIl9jcmVhdGVQYXNzUHJvcCIsIm5hbWUiLCJwYXNzIiwicHJvcCIsIl9wcm9wZXJ0aWVzIiwidW5pZm9ybSIsIk9iamVjdCIsImNyZWF0ZSIsInR5cGUiLCJ2YWx1ZSIsIkZsb2F0MzJBcnJheSIsIl9zZXRQYXNzUHJvcGVydHkiLCJkaXJlY3RseSIsInByb3BlcnRpZXMiLCJoYXNPd25Qcm9wZXJ0eSIsIlBhc3MiLCJwcm90b3R5cGUiLCJzZXRQcm9wZXJ0eSIsImNhbGwiLCJwYXNzSWR4Iiwic3VjY2VzcyIsInBhc3NlcyIsInN0YXJ0IiwiZW5kIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiaSIsIndhcm5JRCIsImdldFByb3BlcnR5IiwiZGVmaW5lIiwiZm9yY2UiLCJnZXREZWZpbmUiLCJzZXRDdWxsTW9kZSIsImN1bGxNb2RlIiwiQ1VMTF9CQUNLIiwic2V0RGVwdGgiLCJkZXB0aFRlc3QiLCJkZXB0aFdyaXRlIiwiZGVwdGhGdW5jIiwic2V0QmxlbmQiLCJlbmFibGVkIiwiYmxlbmRFcSIsImJsZW5kU3JjIiwiYmxlbmREc3QiLCJibGVuZEFscGhhRXEiLCJibGVuZFNyY0FscGhhIiwiYmxlbmREc3RBbHBoYSIsImJsZW5kQ29sb3IiLCJzZXRTdGVuY2lsRW5hYmxlZCIsInN0ZW5jaWxUZXN0IiwiU1RFTkNJTF9JTkhFUklUIiwic2V0U3RlbmNpbCIsInN0ZW5jaWxGdW5jIiwic3RlbmNpbFJlZiIsInN0ZW5jaWxNYXNrIiwic3RlbmNpbEZhaWxPcCIsInN0ZW5jaWxaRmFpbE9wIiwic3RlbmNpbFpQYXNzT3AiLCJzdGVuY2lsV3JpdGVNYXNrIiwic2V0U3RlbmNpbEZyb250Iiwic2V0U3RlbmNpbEJhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQSxJQUFNQSxHQUFH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QUFDSDs7Ozs7OztBQXdLTEosRUFBRSxDQUFDQyxVQUFILEdBQWdCQSxVQUFoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYXNzIGZyb20gJy4uLy4uLy4uL3JlbmRlcmVyL2NvcmUvcGFzcyc7XG5cbmNvbnN0IGdmeCA9IGNjLmdmeDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0QmFzZSB7XG4gICAgX2RpcnR5ID0gdHJ1ZTtcblxuICAgIF9uYW1lID0gJyc7XG4gICAgZ2V0IG5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBfdGVjaG5pcXVlID0gbnVsbDtcbiAgICBnZXQgdGVjaG5pcXVlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlY2huaXF1ZTtcbiAgICB9XG5cbiAgICBnZXQgcGFzc2VzICgpOiBQYXNzW10ge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgX2NyZWF0ZVBhc3NQcm9wIChuYW1lLCBwYXNzKSB7XG4gICAgICAgIGxldCBwcm9wID0gcGFzcy5fcHJvcGVydGllc1tuYW1lXTtcbiAgICAgICAgaWYgKCFwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdW5pZm9ybSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHVuaWZvcm0ubmFtZSA9IG5hbWU7XG4gICAgICAgIHVuaWZvcm0udHlwZSA9IHByb3AudHlwZTtcbiAgICAgICAgaWYgKHByb3AudmFsdWUgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICAgICAgICAgIHVuaWZvcm0udmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KHByb3AudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdW5pZm9ybS52YWx1ZSA9IHByb3AudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcGFzcy5fcHJvcGVydGllc1tuYW1lXSA9IHVuaWZvcm07XG5cbiAgICAgICAgcmV0dXJuIHVuaWZvcm07XG4gICAgfVxuXG4gICAgX3NldFBhc3NQcm9wZXJ0eSAobmFtZSwgdmFsdWUsIHBhc3MsIGRpcmVjdGx5KSB7XG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gcGFzcy5fcHJvcGVydGllcztcbiAgICAgICAgbGV0IHVuaWZvcm0gPSBwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KG5hbWUpO1xuICAgICAgICBpZiAoIXVuaWZvcm0pIHtcbiAgICAgICAgICAgIHVuaWZvcm0gPSB0aGlzLl9jcmVhdGVQYXNzUHJvcChuYW1lLCBwYXNzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1bmlmb3JtLnZhbHVlID09PSB2YWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIFBhc3MucHJvdG90eXBlLnNldFByb3BlcnR5LmNhbGwocGFzcywgbmFtZSwgdmFsdWUsIGRpcmVjdGx5KTtcbiAgICB9XG5cbiAgICBzZXRQcm9wZXJ0eSAobmFtZSwgdmFsdWUsIHBhc3NJZHgsIGRpcmVjdGx5KSB7XG4gICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NldFBhc3NQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcGFzc2VzW2ldLCBkaXJlY3RseSkpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg5MTAzLCB0aGlzLm5hbWUsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UHJvcGVydHkgKG5hbWUsIHBhc3NJZHgpIHtcbiAgICAgICAgbGV0IHBhc3NlcyA9IHRoaXMucGFzc2VzO1xuICAgICAgICBpZiAocGFzc0lkeCA+PSBwYXNzZXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gcGFzc2VzW2ldLmdldFByb3BlcnR5KG5hbWUpO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZpbmUgKG5hbWUsIHZhbHVlLCBwYXNzSWR4LCBmb3JjZSkge1xuICAgICAgICBsZXQgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwYXNzZXNbaV0uZGVmaW5lKG5hbWUsIHZhbHVlLCBmb3JjZSkpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg5MTA0LCB0aGlzLm5hbWUsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RGVmaW5lIChuYW1lLCBwYXNzSWR4KSB7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgaWYgKHBhc3NJZHggPj0gcGFzc2VzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBsZXQgc3RhcnQgPSAwLCBlbmQgPSBwYXNzZXMubGVuZ3RoO1xuICAgICAgICBpZiAocGFzc0lkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdGFydCA9IHBhc3NJZHgsIGVuZCA9IHBhc3NJZHggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBwYXNzZXNbaV0uZ2V0RGVmaW5lKG5hbWUpO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdWxsTW9kZSAoY3VsbE1vZGUgPSBnZnguQ1VMTF9CQUNLLCBwYXNzSWR4KSB7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgcGFzc2VzW2ldLnNldEN1bGxNb2RlKGN1bGxNb2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgfVxuXG4gICAgc2V0RGVwdGggKGRlcHRoVGVzdCwgZGVwdGhXcml0ZSwgZGVwdGhGdW5jLCBwYXNzSWR4KSB7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgcGFzc2VzW2ldLnNldERlcHRoKGRlcHRoVGVzdCwgZGVwdGhXcml0ZSwgZGVwdGhGdW5jKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgfVxuXG4gICAgc2V0QmxlbmQgKGVuYWJsZWQsIGJsZW5kRXEsIGJsZW5kU3JjLCBibGVuZERzdCwgYmxlbmRBbHBoYUVxLCBibGVuZFNyY0FscGhhLCBibGVuZERzdEFscGhhLCBibGVuZENvbG9yLCBwYXNzSWR4KSB7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgcGFzc2VzW2ldLnNldEJsZW5kKFxuICAgICAgICAgICAgICAgIGVuYWJsZWQsXG4gICAgICAgICAgICAgICAgYmxlbmRFcSxcbiAgICAgICAgICAgICAgICBibGVuZFNyYywgYmxlbmREc3QsXG4gICAgICAgICAgICAgICAgYmxlbmRBbHBoYUVxLFxuICAgICAgICAgICAgICAgIGJsZW5kU3JjQWxwaGEsIGJsZW5kRHN0QWxwaGEsIGJsZW5kQ29sb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgIH1cblxuICAgIHNldFN0ZW5jaWxFbmFibGVkIChzdGVuY2lsVGVzdCA9IGdmeC5TVEVOQ0lMX0lOSEVSSVQsIHBhc3NJZHgpIHtcbiAgICAgICAgbGV0IHBhc3NlcyA9IHRoaXMucGFzc2VzO1xuICAgICAgICBsZXQgc3RhcnQgPSAwLCBlbmQgPSBwYXNzZXMubGVuZ3RoO1xuICAgICAgICBpZiAocGFzc0lkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdGFydCA9IHBhc3NJZHgsIGVuZCA9IHBhc3NJZHggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBwYXNzZXNbaV0uc2V0U3RlbmNpbEVuYWJsZWQoc3RlbmNpbFRlc3QpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzZXRTdGVuY2lsIChlbmFibGVkLCBzdGVuY2lsRnVuYywgc3RlbmNpbFJlZiwgc3RlbmNpbE1hc2ssIHN0ZW5jaWxGYWlsT3AsIHN0ZW5jaWxaRmFpbE9wLCBzdGVuY2lsWlBhc3NPcCwgc3RlbmNpbFdyaXRlTWFzaywgcGFzc0lkeCkge1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwYXNzID0gcGFzc2VzW2ldO1xuICAgICAgICAgICAgcGFzcy5zZXRTdGVuY2lsRnJvbnQoZW5hYmxlZCwgc3RlbmNpbEZ1bmMsIHN0ZW5jaWxSZWYsIHN0ZW5jaWxNYXNrLCBzdGVuY2lsRmFpbE9wLCBzdGVuY2lsWkZhaWxPcCwgc3RlbmNpbFpQYXNzT3AsIHN0ZW5jaWxXcml0ZU1hc2spO1xuICAgICAgICAgICAgcGFzcy5zZXRTdGVuY2lsQmFjayhlbmFibGVkLCBzdGVuY2lsRnVuYywgc3RlbmNpbFJlZiwgc3RlbmNpbE1hc2ssIHN0ZW5jaWxGYWlsT3AsIHN0ZW5jaWxaRmFpbE9wLCBzdGVuY2lsWlBhc3NPcCwgc3RlbmNpbFdyaXRlTWFzayk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgIH1cbn1cblxuY2MuRWZmZWN0QmFzZSA9IEVmZmVjdEJhc2U7XG4iXX0=