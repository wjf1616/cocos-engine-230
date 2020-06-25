
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/particle-system-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../core/renderer/assembler"));

var _inputAssembler = _interopRequireDefault(require("../renderer/core/input-assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ParticleSystem = require('./CCParticleSystem');

var renderer = require('../core/renderer/');

var QuadBuffer = require('../core/renderer/webgl/quad-buffer');

var vfmtPosUvColor = require('../core/renderer/webgl/vertex-format').vfmtPosUvColor;

var ParticleAssembler =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(ParticleAssembler, _Assembler);

  function ParticleAssembler(comp) {
    var _this;

    _this = _Assembler.call(this, comp) || this;
    _this._buffer = null;
    _this._ia = null;
    _this._vfmt = vfmtPosUvColor;
    return _this;
  }

  var _proto = ParticleAssembler.prototype;

  _proto.getBuffer = function getBuffer() {
    if (!this._buffer) {
      // Create quad buffer for vertex and index
      this._buffer = new QuadBuffer(renderer._handle, vfmtPosUvColor);
      this._ia = new _inputAssembler["default"]();
      this._ia._vertexBuffer = this._buffer._vb;
      this._ia._indexBuffer = this._buffer._ib;
      this._ia._start = 0;
      this._ia._count = 0;
    }

    return this._buffer;
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    if (!this._ia) return;
    renderer.node = comp.node;
    renderer.material = comp._materials[0];

    renderer._flushIA(this._ia);
  };

  return ParticleAssembler;
}(_assembler["default"]);

_assembler["default"].register(ParticleSystem, ParticleAssembler);

module.exports = ParticleAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnRpY2xlLXN5c3RlbS1hc3NlbWJsZXIuanMiXSwibmFtZXMiOlsiUGFydGljbGVTeXN0ZW0iLCJyZXF1aXJlIiwicmVuZGVyZXIiLCJRdWFkQnVmZmVyIiwidmZtdFBvc1V2Q29sb3IiLCJQYXJ0aWNsZUFzc2VtYmxlciIsImNvbXAiLCJfYnVmZmVyIiwiX2lhIiwiX3ZmbXQiLCJnZXRCdWZmZXIiLCJfaGFuZGxlIiwiSW5wdXRBc3NlbWJsZXIiLCJfdmVydGV4QnVmZmVyIiwiX3ZiIiwiX2luZGV4QnVmZmVyIiwiX2liIiwiX3N0YXJ0IiwiX2NvdW50IiwiZmlsbEJ1ZmZlcnMiLCJub2RlIiwibWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwiX2ZsdXNoSUEiLCJBc3NlbWJsZXIiLCJyZWdpc3RlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBT0E7Ozs7OztBQUxBLElBQU1BLGNBQWMsR0FBR0MsT0FBTyxDQUFDLG9CQUFELENBQTlCOztBQUNBLElBQU1DLFFBQVEsR0FBR0QsT0FBTyxDQUFDLG1CQUFELENBQXhCOztBQUNBLElBQU1FLFVBQVUsR0FBR0YsT0FBTyxDQUFDLG9DQUFELENBQTFCOztBQUNBLElBQU1HLGNBQWMsR0FBR0gsT0FBTyxDQUFDLHNDQUFELENBQVAsQ0FBZ0RHLGNBQXZFOztJQUlNQzs7Ozs7QUFDRiw2QkFBYUMsSUFBYixFQUFtQjtBQUFBOztBQUNmLGtDQUFNQSxJQUFOO0FBRUEsVUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxVQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUVBLFVBQUtDLEtBQUwsR0FBYUwsY0FBYjtBQU5lO0FBT2xCOzs7O1NBRURNLFlBQUEscUJBQWE7QUFDVCxRQUFJLENBQUMsS0FBS0gsT0FBVixFQUFtQjtBQUNmO0FBQ0EsV0FBS0EsT0FBTCxHQUFlLElBQUlKLFVBQUosQ0FBZUQsUUFBUSxDQUFDUyxPQUF4QixFQUFpQ1AsY0FBakMsQ0FBZjtBQUVBLFdBQUtJLEdBQUwsR0FBVyxJQUFJSSwwQkFBSixFQUFYO0FBQ0EsV0FBS0osR0FBTCxDQUFTSyxhQUFULEdBQXlCLEtBQUtOLE9BQUwsQ0FBYU8sR0FBdEM7QUFDQSxXQUFLTixHQUFMLENBQVNPLFlBQVQsR0FBd0IsS0FBS1IsT0FBTCxDQUFhUyxHQUFyQztBQUNBLFdBQUtSLEdBQUwsQ0FBU1MsTUFBVCxHQUFrQixDQUFsQjtBQUNBLFdBQUtULEdBQUwsQ0FBU1UsTUFBVCxHQUFrQixDQUFsQjtBQUNIOztBQUNELFdBQU8sS0FBS1gsT0FBWjtBQUNIOztTQUVEWSxjQUFBLHFCQUFhYixJQUFiLEVBQW1CSixRQUFuQixFQUE2QjtBQUN6QixRQUFJLENBQUMsS0FBS00sR0FBVixFQUFlO0FBRWZOLElBQUFBLFFBQVEsQ0FBQ2tCLElBQVQsR0FBZ0JkLElBQUksQ0FBQ2MsSUFBckI7QUFDQWxCLElBQUFBLFFBQVEsQ0FBQ21CLFFBQVQsR0FBb0JmLElBQUksQ0FBQ2dCLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBcEI7O0FBQ0FwQixJQUFBQSxRQUFRLENBQUNxQixRQUFULENBQWtCLEtBQUtmLEdBQXZCO0FBQ0g7OztFQTlCMkJnQjs7QUFpQ2hDQSxzQkFBVUMsUUFBVixDQUFtQnpCLGNBQW5CLEVBQW1DSyxpQkFBbkM7O0FBRUFxQixNQUFNLENBQUNDLE9BQVAsR0FBaUJ0QixpQkFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kICBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIENodWtvbmcgQWlwdSByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uL2NvcmUvcmVuZGVyZXIvYXNzZW1ibGVyJztcbiBcbmNvbnN0IFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi9DQ1BhcnRpY2xlU3lzdGVtJyk7XG5jb25zdCByZW5kZXJlciA9IHJlcXVpcmUoJy4uL2NvcmUvcmVuZGVyZXIvJyk7XG5jb25zdCBRdWFkQnVmZmVyID0gcmVxdWlyZSgnLi4vY29yZS9yZW5kZXJlci93ZWJnbC9xdWFkLWJ1ZmZlcicpO1xuY29uc3QgdmZtdFBvc1V2Q29sb3IgPSByZXF1aXJlKCcuLi9jb3JlL3JlbmRlcmVyL3dlYmdsL3ZlcnRleC1mb3JtYXQnKS52Zm10UG9zVXZDb2xvcjtcblxuaW1wb3J0IElucHV0QXNzZW1ibGVyIGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvaW5wdXQtYXNzZW1ibGVyJztcblxuY2xhc3MgUGFydGljbGVBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIge1xuICAgIGNvbnN0cnVjdG9yIChjb21wKSB7XG4gICAgICAgIHN1cGVyKGNvbXApO1xuXG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2lhID0gbnVsbDtcblxuICAgICAgICB0aGlzLl92Zm10ID0gdmZtdFBvc1V2Q29sb3I7XG4gICAgfVxuXG4gICAgZ2V0QnVmZmVyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9idWZmZXIpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBxdWFkIGJ1ZmZlciBmb3IgdmVydGV4IGFuZCBpbmRleFxuICAgICAgICAgICAgdGhpcy5fYnVmZmVyID0gbmV3IFF1YWRCdWZmZXIocmVuZGVyZXIuX2hhbmRsZSwgdmZtdFBvc1V2Q29sb3IpO1xuXG4gICAgICAgICAgICB0aGlzLl9pYSA9IG5ldyBJbnB1dEFzc2VtYmxlcigpO1xuICAgICAgICAgICAgdGhpcy5faWEuX3ZlcnRleEJ1ZmZlciA9IHRoaXMuX2J1ZmZlci5fdmI7XG4gICAgICAgICAgICB0aGlzLl9pYS5faW5kZXhCdWZmZXIgPSB0aGlzLl9idWZmZXIuX2liO1xuICAgICAgICAgICAgdGhpcy5faWEuX3N0YXJ0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2lhLl9jb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlcjtcbiAgICB9XG4gICAgXG4gICAgZmlsbEJ1ZmZlcnMgKGNvbXAsIHJlbmRlcmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5faWEpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmVyLm5vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIHJlbmRlcmVyLm1hdGVyaWFsID0gY29tcC5fbWF0ZXJpYWxzWzBdO1xuICAgICAgICByZW5kZXJlci5fZmx1c2hJQSh0aGlzLl9pYSk7XG4gICAgfVxufVxuXG5Bc3NlbWJsZXIucmVnaXN0ZXIoUGFydGljbGVTeXN0ZW0sIFBhcnRpY2xlQXNzZW1ibGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJ0aWNsZUFzc2VtYmxlcjsiXX0=