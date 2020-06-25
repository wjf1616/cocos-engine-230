
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/core/program-lib.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../gfx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
var _shdID = 0;

function _generateDefines(tmpDefines, defines) {
  var results = [];

  for (var i = 0; i < tmpDefines.length; i++) {
    var name = tmpDefines[i].name;
    var value = defines[name];

    if (typeof value !== 'number') {
      value = value ? 1 : 0;
    }

    results.push("#define " + name + " " + value);
  }

  return results.join('\n') + '\n';
}

function _replaceMacroNums(string, tmpDefines, defines) {
  var tmp = string;

  for (var i = 0; i < tmpDefines.length; i++) {
    var name = tmpDefines[i].name;
    var value = defines[name];

    if (Number.isInteger(value)) {
      var reg = new RegExp(name, 'g');
      tmp = tmp.replace(reg, value);
    }
  }

  return tmp;
}

function _unrollLoops(string) {
  var pattern = /#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g;

  function replace(match, index, begin, end, snippet) {
    var unroll = '';
    var parsedBegin = parseInt(begin);
    var parsedEnd = parseInt(end);

    if (parsedBegin.isNaN || parsedEnd.isNaN) {
      console.error('Unroll For Loops Error: begin and end of range must be an int num.');
    }

    for (var i = parsedBegin; i < parsedEnd; ++i) {
      unroll += snippet.replace(new RegExp("{" + index + "}", 'g'), i);
    }

    return unroll;
  }

  return string.replace(pattern, replace);
}

function _replaceHighp(string) {
  return string.replace(/\bhighp\b/g, 'mediump');
}

var ProgramLib =
/*#__PURE__*/
function () {
  /**
   * @param {gfx.Device} device
   */
  function ProgramLib(device) {
    this._device = device; // register templates

    this._templates = {};
    this._cache = {};

    this._checkPrecision();
  }

  var _proto = ProgramLib.prototype;

  _proto.clear = function clear() {
    this._templates = {};
    this._cache = {};
  }
  /**
   * @param {string} name
   * @param {string} vert
   * @param {string} frag
   * @param {Object[]} defines
   *
   * @example:
   *   // this object is auto-generated from your actual shaders
   *   let program = {
   *     name: 'foobar',
   *     vert: vertTmpl,
   *     frag: fragTmpl,
   *     defines: [
   *       { name: 'shadow', type: 'boolean' },
   *       { name: 'lightCount', type: 'number', min: 1, max: 4 }
   *     ],
   *     attributes: [{ name: 'a_position', type: 'vec3' }],
   *     uniforms: [{ name: 'color', type: 'vec4' }],
   *     extensions: ['GL_OES_standard_derivatives'],
   *   };
   *   programLib.define(program);
   */
  ;

  _proto.define = function define(prog) {
    var name = prog.name,
        defines = prog.defines,
        glsl1 = prog.glsl1;

    var _ref = glsl1 || prog,
        vert = _ref.vert,
        frag = _ref.frag;

    if (this._templates[name]) {
      // console.warn(`Failed to define shader ${name}: already exists.`);
      return;
    }

    var id = ++_shdID; // calculate option mask offset

    var offset = 0;

    for (var i = 0; i < defines.length; ++i) {
      var def = defines[i];
      var cnt = 1;

      if (def.type === 'number') {
        var range = def.range || [];
        def.min = range[0] || 0;
        def.max = range[1] || 4;
        cnt = Math.ceil(Math.log2(def.max - def.min));

        def._map = function (value) {
          return value - this.min << this._offset;
        }.bind(def);
      } else {
        // boolean
        def._map = function (value) {
          if (value) {
            return 1 << this._offset;
          }

          return 0;
        }.bind(def);
      }

      def._offset = offset;
      offset += cnt;
    }

    var uniforms = prog.uniforms || [];

    if (prog.samplers) {
      for (var _i = 0; _i < prog.samplers.length; _i++) {
        uniforms.push(prog.samplers[_i]);
      }
    }

    if (prog.blocks) {
      for (var _i2 = 0; _i2 < prog.blocks.length; _i2++) {
        var _defines = prog.blocks[_i2].defines;
        var members = prog.blocks[_i2].members;

        for (var j = 0; j < members.length; j++) {
          uniforms.push({
            defines: _defines,
            name: members[j].name,
            type: members[j].type
          });
        }
      }
    } // store it


    this._templates[name] = {
      id: id,
      name: name,
      vert: vert,
      frag: frag,
      defines: defines,
      attributes: prog.attributes,
      uniforms: uniforms,
      extensions: prog.extensions
    };
  };

  _proto.getTemplate = function getTemplate(name) {
    return this._templates[name];
  }
  /**
   * Does this library has the specified program?
   * @param {string} name
   * @returns {boolean}
   */
  ;

  _proto.hasProgram = function hasProgram(name) {
    return this._templates[name] !== undefined;
  };

  _proto.getKey = function getKey(name, defines) {
    var tmpl = this._templates[name];
    var key = 0;

    for (var i = 0; i < tmpl.defines.length; ++i) {
      var tmplDefs = tmpl.defines[i];
      var value = defines[tmplDefs.name];

      if (value === undefined) {
        continue;
      }

      key |= tmplDefs._map(value);
    } // return key << 8 | tmpl.id;
    // key number maybe bigger than 32 bit, need use string to store value.


    return tmpl.id + ':' + key;
  };

  _proto.getProgram = function getProgram(name, defines, errPrefix) {
    var key = this.getKey(name, defines);
    var program = this._cache[key];

    if (program) {
      return program;
    } // get template


    var tmpl = this._templates[name];

    var customDef = _generateDefines(tmpl.defines, defines);

    var vert = _replaceMacroNums(tmpl.vert, tmpl.defines, defines);

    vert = customDef + _unrollLoops(vert);

    if (!this._highpSupported) {
      vert = _replaceHighp(vert);
    }

    var frag = _replaceMacroNums(tmpl.frag, tmpl.defines, defines);

    frag = customDef + _unrollLoops(frag);

    if (!this._highpSupported) {
      frag = _replaceHighp(frag);
    }

    program = new _gfx["default"].Program(this._device, {
      vert: vert,
      frag: frag
    });
    var errors = program.link();

    if (errors) {
      var vertLines = vert.split('\n');
      var fragLines = frag.split('\n');
      var defineLength = tmpl.defines.length;
      errors.forEach(function (err) {
        var line = err.line - 1;
        var originLine = err.line - defineLength;
        var lines = err.type === 'vs' ? vertLines : fragLines; // let source = ` ${lines[line-1]}\n>${lines[line]}\n ${lines[line+1]}`;

        var source = lines[line];
        var info = err.info || "Failed to compile " + err.type + " " + err.fileID + " (ln " + originLine + "): \n " + err.message + ": \n  " + source;
        cc.error(errPrefix + " : " + info);
      });
    }

    this._cache[key] = program;
    return program;
  };

  _proto._checkPrecision = function _checkPrecision() {
    var gl = this._device._gl;
    var highpSupported = false;

    if (gl.getShaderPrecisionFormat) {
      var vertHighp = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
      var fragHighp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      highpSupported = vertHighp && vertHighp.precision > 0 && fragHighp && fragHighp.precision > 0;
    }

    if (!highpSupported) {
      cc.warnID(9102);
    }

    this._highpSupported = highpSupported;
  };

  return ProgramLib;
}();

exports["default"] = ProgramLib;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2dyYW0tbGliLmpzIl0sIm5hbWVzIjpbIl9zaGRJRCIsIl9nZW5lcmF0ZURlZmluZXMiLCJ0bXBEZWZpbmVzIiwiZGVmaW5lcyIsInJlc3VsdHMiLCJpIiwibGVuZ3RoIiwibmFtZSIsInZhbHVlIiwicHVzaCIsImpvaW4iLCJfcmVwbGFjZU1hY3JvTnVtcyIsInN0cmluZyIsInRtcCIsIk51bWJlciIsImlzSW50ZWdlciIsInJlZyIsIlJlZ0V4cCIsInJlcGxhY2UiLCJfdW5yb2xsTG9vcHMiLCJwYXR0ZXJuIiwibWF0Y2giLCJpbmRleCIsImJlZ2luIiwiZW5kIiwic25pcHBldCIsInVucm9sbCIsInBhcnNlZEJlZ2luIiwicGFyc2VJbnQiLCJwYXJzZWRFbmQiLCJpc05hTiIsImNvbnNvbGUiLCJlcnJvciIsIl9yZXBsYWNlSGlnaHAiLCJQcm9ncmFtTGliIiwiZGV2aWNlIiwiX2RldmljZSIsIl90ZW1wbGF0ZXMiLCJfY2FjaGUiLCJfY2hlY2tQcmVjaXNpb24iLCJjbGVhciIsImRlZmluZSIsInByb2ciLCJnbHNsMSIsInZlcnQiLCJmcmFnIiwiaWQiLCJvZmZzZXQiLCJkZWYiLCJjbnQiLCJ0eXBlIiwicmFuZ2UiLCJtaW4iLCJtYXgiLCJNYXRoIiwiY2VpbCIsImxvZzIiLCJfbWFwIiwiX29mZnNldCIsImJpbmQiLCJ1bmlmb3JtcyIsInNhbXBsZXJzIiwiYmxvY2tzIiwibWVtYmVycyIsImoiLCJhdHRyaWJ1dGVzIiwiZXh0ZW5zaW9ucyIsImdldFRlbXBsYXRlIiwiaGFzUHJvZ3JhbSIsInVuZGVmaW5lZCIsImdldEtleSIsInRtcGwiLCJrZXkiLCJ0bXBsRGVmcyIsImdldFByb2dyYW0iLCJlcnJQcmVmaXgiLCJwcm9ncmFtIiwiY3VzdG9tRGVmIiwiX2hpZ2hwU3VwcG9ydGVkIiwiZ2Z4IiwiUHJvZ3JhbSIsImVycm9ycyIsImxpbmsiLCJ2ZXJ0TGluZXMiLCJzcGxpdCIsImZyYWdMaW5lcyIsImRlZmluZUxlbmd0aCIsImZvckVhY2giLCJlcnIiLCJsaW5lIiwib3JpZ2luTGluZSIsImxpbmVzIiwic291cmNlIiwiaW5mbyIsImZpbGVJRCIsIm1lc3NhZ2UiLCJjYyIsImdsIiwiX2dsIiwiaGlnaHBTdXBwb3J0ZWQiLCJnZXRTaGFkZXJQcmVjaXNpb25Gb3JtYXQiLCJ2ZXJ0SGlnaHAiLCJWRVJURVhfU0hBREVSIiwiSElHSF9GTE9BVCIsImZyYWdIaWdocCIsIkZSQUdNRU5UX1NIQURFUiIsInByZWNpc2lvbiIsIndhcm5JRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7O0FBRkE7QUFJQSxJQUFJQSxNQUFNLEdBQUcsQ0FBYjs7QUFFQSxTQUFTQyxnQkFBVCxDQUEwQkMsVUFBMUIsRUFBc0NDLE9BQXRDLEVBQStDO0FBQzdDLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsVUFBVSxDQUFDSSxNQUEvQixFQUF1Q0QsQ0FBQyxFQUF4QyxFQUE0QztBQUMxQyxRQUFJRSxJQUFJLEdBQUdMLFVBQVUsQ0FBQ0csQ0FBRCxDQUFWLENBQWNFLElBQXpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHTCxPQUFPLENBQUNJLElBQUQsQ0FBbkI7O0FBQ0EsUUFBSSxPQUFPQyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCQSxNQUFBQSxLQUFLLEdBQUdBLEtBQUssR0FBRyxDQUFILEdBQU8sQ0FBcEI7QUFDRDs7QUFDREosSUFBQUEsT0FBTyxDQUFDSyxJQUFSLGNBQXdCRixJQUF4QixTQUFnQ0MsS0FBaEM7QUFDRDs7QUFDRCxTQUFPSixPQUFPLENBQUNNLElBQVIsQ0FBYSxJQUFiLElBQXFCLElBQTVCO0FBQ0Q7O0FBRUQsU0FBU0MsaUJBQVQsQ0FBMkJDLE1BQTNCLEVBQW1DVixVQUFuQyxFQUErQ0MsT0FBL0MsRUFBd0Q7QUFDdEQsTUFBSVUsR0FBRyxHQUFHRCxNQUFWOztBQUVBLE9BQUssSUFBSVAsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENB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OztTQUVEckMsa0JBQUEsMkJBQW1CO0FBQ2pCLFFBQUkwRCxFQUFFLEdBQUcsS0FBSzdELE9BQUwsQ0FBYThELEdBQXRCO0FBQ0EsUUFBSUMsY0FBYyxHQUFHLEtBQXJCOztBQUNBLFFBQUlGLEVBQUUsQ0FBQ0csd0JBQVAsRUFBaUM7QUFDN0IsVUFBSUMsU0FBUyxHQUFHSixFQUFFLENBQUNHLHdCQUFILENBQTRCSCxFQUFFLENBQUNLLGFBQS9CLEVBQThDTCxFQUFFLENBQUNNLFVBQWpELENBQWhCO0FBQ0EsVUFBSUMsU0FBUyxHQUFHUCxFQUFFLENBQUNHLHdCQUFILENBQTRCSCxFQUFFLENBQUNRLGVBQS9CLEVBQWdEUixFQUFFLENBQUNNLFVBQW5ELENBQWhCO0FBQ0FKLE1BQUFBLGNBQWMsR0FBSUUsU0FBUyxJQUFJQSxTQUFTLENBQUNLLFNBQVYsR0FBc0IsQ0FBcEMsSUFDZEYsU0FBUyxJQUFJQSxTQUFTLENBQUNFLFNBQVYsR0FBc0IsQ0FEdEM7QUFFSDs7QUFDRCxRQUFJLENBQUNQLGNBQUwsRUFBcUI7QUFDbkJILE1BQUFBLEVBQUUsQ0FBQ1csTUFBSCxDQUFVLElBQVY7QUFDRDs7QUFDRCxTQUFLN0IsZUFBTCxHQUF1QnFCLGNBQXZCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IGdmeCBmcm9tICcuLi9nZngnO1xuXG5sZXQgX3NoZElEID0gMDtcblxuZnVuY3Rpb24gX2dlbmVyYXRlRGVmaW5lcyh0bXBEZWZpbmVzLCBkZWZpbmVzKSB7XG4gIGxldCByZXN1bHRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wRGVmaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBuYW1lID0gdG1wRGVmaW5lc1tpXS5uYW1lO1xuICAgIGxldCB2YWx1ZSA9IGRlZmluZXNbbmFtZV07XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUgPyAxIDogMDtcbiAgICB9XG4gICAgcmVzdWx0cy5wdXNoKGAjZGVmaW5lICR7bmFtZX0gJHt2YWx1ZX1gKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cy5qb2luKCdcXG4nKSArICdcXG4nO1xufVxuXG5mdW5jdGlvbiBfcmVwbGFjZU1hY3JvTnVtcyhzdHJpbmcsIHRtcERlZmluZXMsIGRlZmluZXMpIHtcbiAgbGV0IHRtcCA9IHN0cmluZztcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcERlZmluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgbmFtZSA9IHRtcERlZmluZXNbaV0ubmFtZTtcbiAgICBsZXQgdmFsdWUgPSBkZWZpbmVzW25hbWVdO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAobmFtZSwgJ2cnKTtcbiAgICAgIHRtcCA9IHRtcC5yZXBsYWNlKHJlZywgdmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG1wO1xufVxuXG5mdW5jdGlvbiBfdW5yb2xsTG9vcHMoc3RyaW5nKSB7XG4gIGxldCBwYXR0ZXJuID0gLyNwcmFnbWEgZm9yIChcXHcrKSBpbiByYW5nZVxcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqXFwpKFtcXHNcXFNdKz8pI3ByYWdtYSBlbmRGb3IvZztcbiAgZnVuY3Rpb24gcmVwbGFjZShtYXRjaCwgaW5kZXgsIGJlZ2luLCBlbmQsIHNuaXBwZXQpIHtcbiAgICBsZXQgdW5yb2xsID0gJyc7XG4gICAgbGV0IHBhcnNlZEJlZ2luID0gcGFyc2VJbnQoYmVnaW4pO1xuICAgIGxldCBwYXJzZWRFbmQgPSBwYXJzZUludChlbmQpO1xuICAgIGlmIChwYXJzZWRCZWdpbi5pc05hTiB8fCBwYXJzZWRFbmQuaXNOYU4pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vucm9sbCBGb3IgTG9vcHMgRXJyb3I6IGJlZ2luIGFuZCBlbmQgb2YgcmFuZ2UgbXVzdCBiZSBhbiBpbnQgbnVtLicpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gcGFyc2VkQmVnaW47IGkgPCBwYXJzZWRFbmQ7ICsraSkge1xuICAgICAgdW5yb2xsICs9IHNuaXBwZXQucmVwbGFjZShuZXcgUmVnRXhwKGB7JHtpbmRleH19YCwgJ2cnKSwgaSk7XG4gICAgfVxuICAgIHJldHVybiB1bnJvbGw7XG4gIH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHBhdHRlcm4sIHJlcGxhY2UpO1xufVxuXG5mdW5jdGlvbiBfcmVwbGFjZUhpZ2hwKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xcYmhpZ2hwXFxiL2csICdtZWRpdW1wJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyYW1MaWIge1xuICAvKipcbiAgICogQHBhcmFtIHtnZnguRGV2aWNlfSBkZXZpY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRldmljZSkge1xuICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcblxuICAgIC8vIHJlZ2lzdGVyIHRlbXBsYXRlc1xuICAgIHRoaXMuX3RlbXBsYXRlcyA9IHt9O1xuICAgIHRoaXMuX2NhY2hlID0ge307XG5cbiAgICB0aGlzLl9jaGVja1ByZWNpc2lvbigpO1xuICB9XG5cbiAgY2xlYXIgKCkge1xuICAgIHRoaXMuX3RlbXBsYXRlcyA9IHt9O1xuICAgIHRoaXMuX2NhY2hlID0ge307XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZlcnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZyYWdcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gZGVmaW5lc1xuICAgKlxuICAgKiBAZXhhbXBsZTpcbiAgICogICAvLyB0aGlzIG9iamVjdCBpcyBhdXRvLWdlbmVyYXRlZCBmcm9tIHlvdXIgYWN0dWFsIHNoYWRlcnNcbiAgICogICBsZXQgcHJvZ3JhbSA9IHtcbiAgICogICAgIG5hbWU6ICdmb29iYXInLFxuICAgKiAgICAgdmVydDogdmVydFRtcGwsXG4gICAqICAgICBmcmFnOiBmcmFnVG1wbCxcbiAgICogICAgIGRlZmluZXM6IFtcbiAgICogICAgICAgeyBuYW1lOiAnc2hhZG93JywgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAqICAgICAgIHsgbmFtZTogJ2xpZ2h0Q291bnQnLCB0eXBlOiAnbnVtYmVyJywgbWluOiAxLCBtYXg6IDQgfVxuICAgKiAgICAgXSxcbiAgICogICAgIGF0dHJpYnV0ZXM6IFt7IG5hbWU6ICdhX3Bvc2l0aW9uJywgdHlwZTogJ3ZlYzMnIH1dLFxuICAgKiAgICAgdW5pZm9ybXM6IFt7IG5hbWU6ICdjb2xvcicsIHR5cGU6ICd2ZWM0JyB9XSxcbiAgICogICAgIGV4dGVuc2lvbnM6IFsnR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJ10sXG4gICAqICAgfTtcbiAgICogICBwcm9ncmFtTGliLmRlZmluZShwcm9ncmFtKTtcbiAgICovXG4gIGRlZmluZShwcm9nKSB7XG4gICAgbGV0IHsgbmFtZSwgZGVmaW5lcywgZ2xzbDEgfSA9IHByb2c7XG4gICAgbGV0IHsgdmVydCwgZnJhZyB9ID0gZ2xzbDEgfHwgcHJvZztcbiAgICBpZiAodGhpcy5fdGVtcGxhdGVzW25hbWVdKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oYEZhaWxlZCB0byBkZWZpbmUgc2hhZGVyICR7bmFtZX06IGFscmVhZHkgZXhpc3RzLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZCA9ICsrX3NoZElEO1xuXG4gICAgLy8gY2FsY3VsYXRlIG9wdGlvbiBtYXNrIG9mZnNldFxuICAgIGxldCBvZmZzZXQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVmaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IGRlZiA9IGRlZmluZXNbaV07XG4gICAgICBsZXQgY250ID0gMTtcblxuICAgICAgaWYgKGRlZi50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICBsZXQgcmFuZ2UgPSBkZWYucmFuZ2UgfHwgW107XG4gICAgICAgIGRlZi5taW4gPSByYW5nZVswXSB8fCAwO1xuICAgICAgICBkZWYubWF4ID0gcmFuZ2VbMV0gfHwgNDtcbiAgICAgICAgY250ID0gTWF0aC5jZWlsKE1hdGgubG9nMihkZWYubWF4IC0gZGVmLm1pbikpO1xuXG4gICAgICAgIGRlZi5fbWFwID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWx1ZSAtIHRoaXMubWluKSA8PCB0aGlzLl9vZmZzZXQ7XG4gICAgICAgIH0uYmluZChkZWYpO1xuICAgICAgfSBlbHNlIHsgLy8gYm9vbGVhblxuICAgICAgICBkZWYuX21hcCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIDEgPDwgdGhpcy5fb2Zmc2V0O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfS5iaW5kKGRlZik7XG4gICAgICB9XG5cbiAgICAgIGRlZi5fb2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgb2Zmc2V0ICs9IGNudDtcbiAgICB9XG5cbiAgICBsZXQgdW5pZm9ybXMgPSBwcm9nLnVuaWZvcm1zIHx8IFtdO1xuXG4gICAgaWYgKHByb2cuc2FtcGxlcnMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZy5zYW1wbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB1bmlmb3Jtcy5wdXNoKHByb2cuc2FtcGxlcnNbaV0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9nLmJsb2Nrcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9nLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZGVmaW5lcyA9IHByb2cuYmxvY2tzW2ldLmRlZmluZXM7XG4gICAgICAgIGxldCBtZW1iZXJzID0gcHJvZy5ibG9ja3NbaV0ubWVtYmVycztcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtZW1iZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdW5pZm9ybXMucHVzaCh7XG4gICAgICAgICAgICBkZWZpbmVzLFxuICAgICAgICAgICAgbmFtZTogbWVtYmVyc1tqXS5uYW1lLFxuICAgICAgICAgICAgdHlwZTogbWVtYmVyc1tqXS50eXBlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzdG9yZSBpdFxuICAgIHRoaXMuX3RlbXBsYXRlc1tuYW1lXSA9IHtcbiAgICAgIGlkLFxuICAgICAgbmFtZSxcbiAgICAgIHZlcnQsXG4gICAgICBmcmFnLFxuICAgICAgZGVmaW5lcyxcbiAgICAgIGF0dHJpYnV0ZXM6IHByb2cuYXR0cmlidXRlcyxcbiAgICAgIHVuaWZvcm1zLFxuICAgICAgZXh0ZW5zaW9uczogcHJvZy5leHRlbnNpb25zXG4gICAgfTtcbiAgfVxuXG4gIGdldFRlbXBsYXRlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVzW25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIERvZXMgdGhpcyBsaWJyYXJ5IGhhcyB0aGUgc3BlY2lmaWVkIHByb2dyYW0/XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaGFzUHJvZ3JhbShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlc1tuYW1lXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0S2V5KG5hbWUsIGRlZmluZXMpIHtcbiAgICBsZXQgdG1wbCA9IHRoaXMuX3RlbXBsYXRlc1tuYW1lXTtcbiAgICBsZXQga2V5ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcGwuZGVmaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IHRtcGxEZWZzID0gdG1wbC5kZWZpbmVzW2ldO1xuICAgICAgXG4gICAgICBsZXQgdmFsdWUgPSBkZWZpbmVzW3RtcGxEZWZzLm5hbWVdO1xuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGtleSB8PSB0bXBsRGVmcy5fbWFwKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4ga2V5IDw8IDggfCB0bXBsLmlkO1xuICAgIC8vIGtleSBudW1iZXIgbWF5YmUgYmlnZ2VyIHRoYW4gMzIgYml0LCBuZWVkIHVzZSBzdHJpbmcgdG8gc3RvcmUgdmFsdWUuXG4gICAgcmV0dXJuIHRtcGwuaWQgKyAnOicgKyBrZXk7XG4gIH1cblxuICBnZXRQcm9ncmFtKG5hbWUsIGRlZmluZXMsIGVyclByZWZpeCkge1xuICAgIGxldCBrZXkgPSB0aGlzLmdldEtleShuYW1lLCBkZWZpbmVzKTtcbiAgICBsZXQgcHJvZ3JhbSA9IHRoaXMuX2NhY2hlW2tleV07XG4gICAgaWYgKHByb2dyYW0pIHtcbiAgICAgIHJldHVybiBwcm9ncmFtO1xuICAgIH1cblxuICAgIC8vIGdldCB0ZW1wbGF0ZVxuICAgIGxldCB0bXBsID0gdGhpcy5fdGVtcGxhdGVzW25hbWVdO1xuICAgIGxldCBjdXN0b21EZWYgPSBfZ2VuZXJhdGVEZWZpbmVzKHRtcGwuZGVmaW5lcywgZGVmaW5lcyk7XG4gICAgbGV0IHZlcnQgPSBfcmVwbGFjZU1hY3JvTnVtcyh0bXBsLnZlcnQsIHRtcGwuZGVmaW5lcywgZGVmaW5lcyk7XG4gICAgdmVydCA9IGN1c3RvbURlZiArIF91bnJvbGxMb29wcyh2ZXJ0KTtcbiAgICBpZiAoIXRoaXMuX2hpZ2hwU3VwcG9ydGVkKSB7XG4gICAgICB2ZXJ0ID0gX3JlcGxhY2VIaWdocCh2ZXJ0KTtcbiAgICB9XG5cbiAgICBsZXQgZnJhZyA9IF9yZXBsYWNlTWFjcm9OdW1zKHRtcGwuZnJhZywgdG1wbC5kZWZpbmVzLCBkZWZpbmVzKTtcbiAgICBmcmFnID0gY3VzdG9tRGVmICsgX3Vucm9sbExvb3BzKGZyYWcpO1xuICAgIGlmICghdGhpcy5faGlnaHBTdXBwb3J0ZWQpIHtcbiAgICAgIGZyYWcgPSBfcmVwbGFjZUhpZ2hwKGZyYWcpO1xuICAgIH1cblxuICAgIHByb2dyYW0gPSBuZXcgZ2Z4LlByb2dyYW0odGhpcy5fZGV2aWNlLCB7XG4gICAgICB2ZXJ0LFxuICAgICAgZnJhZ1xuICAgIH0pO1xuICAgIGxldCBlcnJvcnMgPSBwcm9ncmFtLmxpbmsoKTtcbiAgICBpZiAoZXJyb3JzKSB7XG4gICAgICBsZXQgdmVydExpbmVzID0gdmVydC5zcGxpdCgnXFxuJyk7XG4gICAgICBsZXQgZnJhZ0xpbmVzID0gZnJhZy5zcGxpdCgnXFxuJyk7XG4gICAgICBsZXQgZGVmaW5lTGVuZ3RoID0gdG1wbC5kZWZpbmVzLmxlbmd0aDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGVyciA9PiB7XG4gICAgICAgIGxldCBsaW5lID0gZXJyLmxpbmUgLSAxO1xuICAgICAgICBsZXQgb3JpZ2luTGluZSA9IGVyci5saW5lIC0gZGVmaW5lTGVuZ3RoO1xuXG4gICAgICAgIGxldCBsaW5lcyA9IGVyci50eXBlID09PSAndnMnID8gdmVydExpbmVzIDogZnJhZ0xpbmVzO1xuICAgICAgICAvLyBsZXQgc291cmNlID0gYCAke2xpbmVzW2xpbmUtMV19XFxuPiR7bGluZXNbbGluZV19XFxuICR7bGluZXNbbGluZSsxXX1gO1xuICAgICAgICBsZXQgc291cmNlID0gbGluZXNbbGluZV07XG5cbiAgICAgICAgbGV0IGluZm8gPSBlcnIuaW5mbyB8fCBgRmFpbGVkIHRvIGNvbXBpbGUgJHtlcnIudHlwZX0gJHtlcnIuZmlsZUlEfSAobG4gJHtvcmlnaW5MaW5lfSk6IFxcbiAke2Vyci5tZXNzYWdlfTogXFxuICAke3NvdXJjZX1gO1xuICAgICAgICBjYy5lcnJvcihgJHtlcnJQcmVmaXh9IDogJHtpbmZvfWApO1xuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5fY2FjaGVba2V5XSA9IHByb2dyYW07XG5cbiAgICByZXR1cm4gcHJvZ3JhbTtcbiAgfVxuXG4gIF9jaGVja1ByZWNpc2lvbiAoKSB7XG4gICAgbGV0IGdsID0gdGhpcy5fZGV2aWNlLl9nbDtcbiAgICBsZXQgaGlnaHBTdXBwb3J0ZWQgPSBmYWxzZTtcbiAgICBpZiAoZ2wuZ2V0U2hhZGVyUHJlY2lzaW9uRm9ybWF0KSB7XG4gICAgICAgIGxldCB2ZXJ0SGlnaHAgPSBnbC5nZXRTaGFkZXJQcmVjaXNpb25Gb3JtYXQoZ2wuVkVSVEVYX1NIQURFUiwgZ2wuSElHSF9GTE9BVCk7XG4gICAgICAgIGxldCBmcmFnSGlnaHAgPSBnbC5nZXRTaGFkZXJQcmVjaXNpb25Gb3JtYXQoZ2wuRlJBR01FTlRfU0hBREVSLCBnbC5ISUdIX0ZMT0FUKTtcbiAgICAgICAgaGlnaHBTdXBwb3J0ZWQgPSAodmVydEhpZ2hwICYmIHZlcnRIaWdocC5wcmVjaXNpb24gPiAwKSAmJlxuICAgICAgICAgIChmcmFnSGlnaHAgJiYgZnJhZ0hpZ2hwLnByZWNpc2lvbiA+IDApO1xuICAgIH1cbiAgICBpZiAoIWhpZ2hwU3VwcG9ydGVkKSB7XG4gICAgICBjYy53YXJuSUQoOTEwMik7XG4gICAgfVxuICAgIHRoaXMuX2hpZ2hwU3VwcG9ydGVkID0gaGlnaHBTdXBwb3J0ZWQ7XG4gIH1cbn1cbiJdfQ==