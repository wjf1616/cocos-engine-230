
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/utils.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _enums = _interopRequireDefault(require("../../../renderer/enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
// function genHashCode (str) {
//     var hash = 0;
//     if (str.length == 0) {
//         return hash;
//     }
//     for (var i = 0; i < str.length; i++) {
//         var char = str.charCodeAt(i);
//         hash = ((hash<<5)-hash)+char;
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
// }
function serializeDefines(defines) {
  var str = '';

  for (var name in defines) {
    str += name + defines[name];
  }

  return str;
}

function serializePass(pass, excludeProperties) {
  var str = pass._programName + pass._cullMode;

  if (pass._blend) {
    str += pass._blendEq + pass._blendAlphaEq + pass._blendSrc + pass._blendDst + pass._blendSrcAlpha + pass._blendDstAlpha + pass._blendColor;
  }

  if (pass._depthTest) {
    str += pass._depthWrite + pass._depthFunc;
  }

  if (pass._stencilTest) {
    str += pass._stencilFuncFront + pass._stencilRefFront + pass._stencilMaskFront + pass._stencilFailOpFront + pass._stencilZFailOpFront + pass._stencilZPassOpFront + pass._stencilWriteMaskFront + pass._stencilFuncBack + pass._stencilRefBack + pass._stencilMaskBack + pass._stencilFailOpBack + pass._stencilZFailOpBack + pass._stencilZPassOpBack + pass._stencilWriteMaskBack;
  }

  if (!excludeProperties) {
    str += serializeUniforms(pass._properties);
  }

  str += serializeDefines(pass._defines);
  return str;
}

function serializePasses(passes) {
  var hashData = '';

  for (var i = 0; i < passes.length; i++) {
    hashData += serializePass(passes[i]);
  }

  return hashData;
}

function serializeUniforms(uniforms) {
  var hashData = '';

  for (var name in uniforms) {
    var param = uniforms[name];
    var prop = param.value;

    if (!prop) {
      continue;
    }

    if (param.type === _enums["default"].PARAM_TEXTURE_2D || param.type === _enums["default"].PARAM_TEXTURE_CUBE) {
      hashData += prop._id + ';';
    } else {
      hashData += prop.toString() + ';';
    }
  }

  return hashData;
}

var _default = {
  serializeDefines: serializeDefines,
  serializePasses: serializePasses,
  serializeUniforms: serializeUniforms
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbInNlcmlhbGl6ZURlZmluZXMiLCJkZWZpbmVzIiwic3RyIiwibmFtZSIsInNlcmlhbGl6ZVBhc3MiLCJwYXNzIiwiZXhjbHVkZVByb3BlcnRpZXMiLCJfcHJvZ3JhbU5hbWUiLCJfY3VsbE1vZGUiLCJfYmxlbmQiLCJfYmxlbmRFcSIsIl9ibGVuZEFscGhhRXEiLCJfYmxlbmRTcmMiLCJfYmxlbmREc3QiLCJfYmxlbmRTcmNBbHBoYSIsIl9ibGVuZERzdEFscGhhIiwiX2JsZW5kQ29sb3IiLCJfZGVwdGhUZXN0IiwiX2RlcHRoV3JpdGUiLCJfZGVwdGhGdW5jIiwiX3N0ZW5jaWxUZXN0IiwiX3N0ZW5jaWxGdW5jRnJvbnQiLCJfc3RlbmNpbFJlZkZyb250IiwiX3N0ZW5jaWxNYXNrRnJvbnQiLCJfc3RlbmNpbEZhaWxPcEZyb250IiwiX3N0ZW5jaWxaRmFpbE9wRnJvbnQiLCJfc3RlbmNpbFpQYXNzT3BGcm9udCIsIl9zdGVuY2lsV3JpdGVNYXNrRnJvbnQiLCJfc3RlbmNpbEZ1bmNCYWNrIiwiX3N0ZW5jaWxSZWZCYWNrIiwiX3N0ZW5jaWxNYXNrQmFjayIsIl9zdGVuY2lsRmFpbE9wQmFjayIsIl9zdGVuY2lsWkZhaWxPcEJhY2siLCJfc3RlbmNpbFpQYXNzT3BCYWNrIiwiX3N0ZW5jaWxXcml0ZU1hc2tCYWNrIiwic2VyaWFsaXplVW5pZm9ybXMiLCJfcHJvcGVydGllcyIsIl9kZWZpbmVzIiwic2VyaWFsaXplUGFzc2VzIiwicGFzc2VzIiwiaGFzaERhdGEiLCJpIiwibGVuZ3RoIiwidW5pZm9ybXMiLCJwYXJhbSIsInByb3AiLCJ2YWx1ZSIsInR5cGUiLCJlbnVtcyIsIlBBUkFNX1RFWFRVUkVfMkQiLCJQQVJBTV9URVhUVVJFX0NVQkUiLCJfaWQiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7O0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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a0JBQU1FLGtCQUFsRSxFQUFzRjtBQUNsRlYsTUFBQUEsUUFBUSxJQUFJSyxJQUFJLENBQUNNLEdBQUwsR0FBVyxHQUF2QjtBQUNILEtBRkQsTUFHSztBQUNEWCxNQUFBQSxRQUFRLElBQUlLLElBQUksQ0FBQ08sUUFBTCxLQUFrQixHQUE5QjtBQUNIO0FBQ0o7O0FBRUQsU0FBT1osUUFBUDtBQUNIOztlQUVjO0FBQ1h4QyxFQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQURXO0FBRVhzQyxFQUFBQSxlQUFlLEVBQWZBLGVBRlc7QUFHWEgsRUFBQUEsaUJBQWlCLEVBQWpCQTtBQUhXIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuICBcblxuaW1wb3J0IGVudW1zIGZyb20gJy4uLy4uLy4uL3JlbmRlcmVyL2VudW1zJztcblxuLy8gZnVuY3Rpb24gZ2VuSGFzaENvZGUgKHN0cikge1xuLy8gICAgIHZhciBoYXNoID0gMDtcbi8vICAgICBpZiAoc3RyLmxlbmd0aCA9PSAwKSB7XG4vLyAgICAgICAgIHJldHVybiBoYXNoO1xuLy8gICAgIH1cbi8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgICB2YXIgY2hhciA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuLy8gICAgICAgICBoYXNoID0gKChoYXNoPDw1KS1oYXNoKStjaGFyO1xuLy8gICAgICAgICBoYXNoID0gaGFzaCAmIGhhc2g7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuLy8gICAgIH1cbi8vICAgICByZXR1cm4gaGFzaDtcbi8vIH1cblxuZnVuY3Rpb24gc2VyaWFsaXplRGVmaW5lcyAoZGVmaW5lcykge1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBmb3IgKGxldCBuYW1lIGluIGRlZmluZXMpIHtcbiAgICAgICAgc3RyICs9IG5hbWUgKyBkZWZpbmVzW25hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVQYXNzIChwYXNzLCBleGNsdWRlUHJvcGVydGllcykge1xuICAgIGxldCBzdHIgPSBwYXNzLl9wcm9ncmFtTmFtZSArIHBhc3MuX2N1bGxNb2RlO1xuICAgIGlmIChwYXNzLl9ibGVuZCkge1xuICAgICAgICBzdHIgKz0gcGFzcy5fYmxlbmRFcSArIHBhc3MuX2JsZW5kQWxwaGFFcSArIHBhc3MuX2JsZW5kU3JjICsgcGFzcy5fYmxlbmREc3RcbiAgICAgICAgICAgICsgcGFzcy5fYmxlbmRTcmNBbHBoYSArIHBhc3MuX2JsZW5kRHN0QWxwaGEgKyBwYXNzLl9ibGVuZENvbG9yO1xuICAgIH1cbiAgICBpZiAocGFzcy5fZGVwdGhUZXN0KSB7XG4gICAgICAgIHN0ciArPSBwYXNzLl9kZXB0aFdyaXRlICsgcGFzcy5fZGVwdGhGdW5jO1xuICAgIH1cbiAgICBpZiAocGFzcy5fc3RlbmNpbFRlc3QpIHtcbiAgICAgICAgc3RyICs9IHBhc3MuX3N0ZW5jaWxGdW5jRnJvbnQgKyBwYXNzLl9zdGVuY2lsUmVmRnJvbnQgKyBwYXNzLl9zdGVuY2lsTWFza0Zyb250XG4gICAgICAgICAgICArIHBhc3MuX3N0ZW5jaWxGYWlsT3BGcm9udCArIHBhc3MuX3N0ZW5jaWxaRmFpbE9wRnJvbnQgKyBwYXNzLl9zdGVuY2lsWlBhc3NPcEZyb250XG4gICAgICAgICAgICArIHBhc3MuX3N0ZW5jaWxXcml0ZU1hc2tGcm9udFxuICAgICAgICAgICAgKyBwYXNzLl9zdGVuY2lsRnVuY0JhY2sgKyBwYXNzLl9zdGVuY2lsUmVmQmFjayArIHBhc3MuX3N0ZW5jaWxNYXNrQmFja1xuICAgICAgICAgICAgKyBwYXNzLl9zdGVuY2lsRmFpbE9wQmFjayArIHBhc3MuX3N0ZW5jaWxaRmFpbE9wQmFjayArIHBhc3MuX3N0ZW5jaWxaUGFzc09wQmFja1xuICAgICAgICAgICAgKyBwYXNzLl9zdGVuY2lsV3JpdGVNYXNrQmFjaztcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHN0ciArPSBzZXJpYWxpemVVbmlmb3JtcyhwYXNzLl9wcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgc3RyICs9IHNlcmlhbGl6ZURlZmluZXMocGFzcy5fZGVmaW5lcyk7XG5cbiAgICByZXR1cm4gc3RyO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVQYXNzZXMgKHBhc3Nlcykge1xuICAgIGxldCBoYXNoRGF0YSA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhhc2hEYXRhICs9IHNlcmlhbGl6ZVBhc3MocGFzc2VzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc2hEYXRhO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVVbmlmb3JtcyAodW5pZm9ybXMpIHtcbiAgICBsZXQgaGFzaERhdGEgPSAnJztcbiAgICBmb3IgKGxldCBuYW1lIGluIHVuaWZvcm1zKSB7XG4gICAgICAgIGxldCBwYXJhbSA9IHVuaWZvcm1zW25hbWVdO1xuICAgICAgICBsZXQgcHJvcCA9IHBhcmFtLnZhbHVlO1xuXG4gICAgICAgIGlmICghcHJvcCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW0udHlwZSA9PT0gZW51bXMuUEFSQU1fVEVYVFVSRV8yRCB8fCBwYXJhbS50eXBlID09PSBlbnVtcy5QQVJBTV9URVhUVVJFX0NVQkUpIHtcbiAgICAgICAgICAgIGhhc2hEYXRhICs9IHByb3AuX2lkICsgJzsnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFzaERhdGEgKz0gcHJvcC50b1N0cmluZygpICsgJzsnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhc2hEYXRhO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc2VyaWFsaXplRGVmaW5lcyxcbiAgICBzZXJpYWxpemVQYXNzZXMsXG4gICAgc2VyaWFsaXplVW5pZm9ybXNcbn07Il19