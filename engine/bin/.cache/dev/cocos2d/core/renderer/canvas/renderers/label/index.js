
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/label/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _CCLabel = _interopRequireDefault(require("../../../../components/CCLabel"));

var _ttf = _interopRequireDefault(require("./ttf"));

var _bmfont = _interopRequireDefault(require("./bmfont"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var canvasPool = {
  pool: [],
  get: function get() {
    var data = this.pool.pop();

    if (!data) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      data = {
        canvas: canvas,
        context: context
      };
    }

    return data;
  },
  put: function put(canvas) {
    if (this.pool.length >= 32) {
      return;
    }

    this.pool.push(canvas);
  }
};
_CCLabel["default"]._canvasPool = canvasPool;

_assembler["default"].register(_CCLabel["default"], {
  getConstructor: function getConstructor(label) {
    var ctor = _ttf["default"];

    if (label.font instanceof cc.BitmapFont) {
      ctor = _bmfont["default"];
    } else if (label.cacheMode === _CCLabel["default"].CacheMode.CHAR) {
      cc.warn('sorry, canvas mode does not support CHAR mode currently!');
    }

    return ctor;
  },
  TTF: _ttf["default"],
  Bmfont: _bmfont["default"]
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNhbnZhc1Bvb2wiLCJwb29sIiwiZ2V0IiwiZGF0YSIsInBvcCIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwicHV0IiwibGVuZ3RoIiwicHVzaCIsIkxhYmVsIiwiX2NhbnZhc1Bvb2wiLCJBc3NlbWJsZXIiLCJyZWdpc3RlciIsImdldENvbnN0cnVjdG9yIiwibGFiZWwiLCJjdG9yIiwiVFRGIiwiZm9udCIsImNjIiwiQml0bWFwRm9udCIsIkJtZm9udCIsImNhY2hlTW9kZSIsIkNhY2hlTW9kZSIsIkNIQVIiLCJ3YXJuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBNUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsSUFBSUEsVUFBVSxHQUFHO0FBQ2JDLEVBQUFBLElBQUksRUFBRSxFQURPO0FBRWJDLEVBQUFBLEdBRmEsaUJBRU47QUFDSCxRQUFJQyxJQUFJLEdBQUcsS0FBS0YsSUFBTCxDQUFVRyxHQUFWLEVBQVg7O0FBRUEsUUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDUCxVQUFJRSxNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQ0EsVUFBSUMsT0FBTyxHQUFHSCxNQUFNLENBQUNJLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBZDtBQUNBTixNQUFBQSxJQUFJLEdBQUc7QUFDSEUsUUFBQUEsTUFBTSxFQUFFQSxNQURMO0FBRUhHLFFBQUFBLE9BQU8sRUFBRUE7QUFGTixPQUFQO0FBSUg7O0FBRUQsV0FBT0wsSUFBUDtBQUNILEdBZlk7QUFnQmJPLEVBQUFBLEdBaEJhLGVBZ0JSTCxNQWhCUSxFQWdCQTtBQUNULFFBQUksS0FBS0osSUFBTCxDQUFVVSxNQUFWLElBQW9CLEVBQXhCLEVBQTRCO0FBQ3hCO0FBQ0g7O0FBQ0QsU0FBS1YsSUFBTCxDQUFVVyxJQUFWLENBQWVQLE1BQWY7QUFDSDtBQXJCWSxDQUFqQjtBQXdCQVEsb0JBQU1DLFdBQU4sR0FBb0JkLFVBQXBCOztBQUdBZSxzQkFBVUMsUUFBVixDQUFtQkgsbUJBQW5CLEVBQTBCO0FBQ3RCSSxFQUFBQSxjQURzQiwwQkFDUEMsS0FETyxFQUNBO0FBQ2xCLFFBQUlDLElBQUksR0FBR0MsZUFBWDs7QUFFQSxRQUFJRixLQUFLLENBQUNHLElBQU4sWUFBc0JDLEVBQUUsQ0FBQ0MsVUFBN0IsRUFBeUM7QUFDckNKLE1BQUFBLElBQUksR0FBR0ssa0JBQVA7QUFDSCxLQUZELE1BRU8sSUFBSU4sS0FBSyxDQUFDTyxTQUFOLEtBQW9CWixvQkFBTWEsU0FBTixDQUFnQkMsSUFBeEMsRUFBOEM7QUFDakRMLE1BQUFBLEVBQUUsQ0FBQ00sSUFBSCxDQUFRLDBEQUFSO0FBQ0g7O0FBRUQsV0FBT1QsSUFBUDtBQUNILEdBWHFCO0FBYXRCQyxFQUFBQSxHQUFHLEVBQUhBLGVBYnNCO0FBY3RCSSxFQUFBQSxNQUFNLEVBQU5BO0FBZHNCLENBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vLi4vLi4vYXNzZW1ibGVyJztcbmltcG9ydCBMYWJlbCBmcm9tICcuLi8uLi8uLi8uLi9jb21wb25lbnRzL0NDTGFiZWwnO1xuaW1wb3J0IFRURiBmcm9tICcuL3R0Zic7XG5pbXBvcnQgQm1mb250IGZyb20gJy4vYm1mb250JztcblxubGV0IGNhbnZhc1Bvb2wgPSB7XG4gICAgcG9vbDogW10sXG4gICAgZ2V0ICgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLnBvb2wucG9wKCk7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgY2FudmFzOiBjYW52YXMsXG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBwdXQgKGNhbnZhcykge1xuICAgICAgICBpZiAodGhpcy5wb29sLmxlbmd0aCA+PSAzMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9vbC5wdXNoKGNhbnZhcyk7XG4gICAgfVxufTtcblxuTGFiZWwuX2NhbnZhc1Bvb2wgPSBjYW52YXNQb29sO1xuXG5cbkFzc2VtYmxlci5yZWdpc3RlcihMYWJlbCwge1xuICAgIGdldENvbnN0cnVjdG9yKGxhYmVsKSB7XG4gICAgICAgIGxldCBjdG9yID0gVFRGO1xuICAgICAgICBcbiAgICAgICAgaWYgKGxhYmVsLmZvbnQgaW5zdGFuY2VvZiBjYy5CaXRtYXBGb250KSB7XG4gICAgICAgICAgICBjdG9yID0gQm1mb250O1xuICAgICAgICB9IGVsc2UgaWYgKGxhYmVsLmNhY2hlTW9kZSA9PT0gTGFiZWwuQ2FjaGVNb2RlLkNIQVIpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ3NvcnJ5LCBjYW52YXMgbW9kZSBkb2VzIG5vdCBzdXBwb3J0IENIQVIgbW9kZSBjdXJyZW50bHkhJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RvcjtcbiAgICB9LFxuXG4gICAgVFRGLFxuICAgIEJtZm9udFxufSk7Il19