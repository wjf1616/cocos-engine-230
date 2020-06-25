
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/font-loader.js';
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
var textUtils = require('../utils/text-utils');

var _canvasContext = null; // letter symbol number CJK

var _testString = "BES bswy:->@123\u4E01\u3041\u1101";
var _fontFaces = {};

var _intervalId = -1;

var _loadingFonts = []; // 3 seconds timeout

var _timeout = 3000; // Refer to https://github.com/typekit/webfontloader/blob/master/src/core/fontwatcher.js

var useNativeCheck = function () {
  var nativeCheck = undefined;
  return function () {
    if (nativeCheck === undefined) {
      if (!!window.FontFace) {
        var match = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent);
        var safari10Match = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);

        if (match) {
          nativeCheck = parseInt(match[1], 10) > 42;
        } else if (safari10Match) {
          nativeCheck = false;
        } else {
          nativeCheck = true;
        }
      } else {
        nativeCheck = false;
      }
    }

    return nativeCheck;
  };
}();

function _checkFontLoaded() {
  var allFontsLoaded = true;
  var now = Date.now();

  for (var i = _loadingFonts.length - 1; i >= 0; i--) {
    var fontLoadHandle = _loadingFonts[i];
    var fontFamily = fontLoadHandle.fontFamilyName; // load timeout

    if (now - fontLoadHandle.startTime > _timeout) {
      cc.warnID(4933, fontFamily);
      fontLoadHandle.callback(null, fontFamily);

      _loadingFonts.splice(i, 1);

      continue;
    }

    var oldWidth = fontLoadHandle.refWidth;
    var fontDesc = '40px ' + fontFamily;
    _canvasContext.font = fontDesc;
    var newWidth = textUtils.safeMeasureText(_canvasContext, _testString, fontDesc); // loaded successfully

    if (oldWidth !== newWidth) {
      _loadingFonts.splice(i, 1);

      fontLoadHandle.callback(null, fontFamily);
    } else {
      allFontsLoaded = false;
    }
  }

  if (allFontsLoaded) {
    clearInterval(_intervalId);
    _intervalId = -1;
  }
} // refer to https://github.com/typekit/webfontloader/blob/master/src/core/nativefontwatchrunner.js


function nativeCheckFontLoaded(start, font, callback) {
  var loader = new Promise(function (resolve, reject) {
    var check = function check() {
      var now = Date.now();

      if (now - start >= _timeout) {
        reject();
      } else {
        document.fonts.load('40px ' + font).then(function (fonts) {
          if (fonts.length >= 1) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        }, function () {
          reject();
        });
      }
    };

    check();
  });
  var timeoutId = null,
      timer = new Promise(function (resolve, reject) {
    timeoutId = setTimeout(reject, _timeout);
  });
  Promise.race([timer, loader]).then(function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    callback(null, font);
  }, function () {
    cc.warnID(4933, font);
    callback(null, font);
  });
}

var fontLoader = {
  loadFont: function loadFont(item, callback) {
    var url = item.url;

    var fontFamilyName = fontLoader._getFontFamily(url); // Already loaded fonts


    if (_fontFaces[fontFamilyName]) {
      return fontFamilyName;
    }

    if (!_canvasContext) {
      var labelCanvas = document.createElement('canvas');
      labelCanvas.width = 100;
      labelCanvas.height = 100;
      _canvasContext = labelCanvas.getContext('2d');
    } // Default width reference to test whether new font is loaded correctly


    var fontDesc = '40px ' + fontFamilyName;
    _canvasContext.font = fontDesc;
    var refWidth = textUtils.safeMeasureText(_canvasContext, _testString, fontDesc); // Setup font face style

    var fontStyle = document.createElement("style");
    fontStyle.type = "text/css";
    var fontStr = "";
    if (isNaN(fontFamilyName - 0)) fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";else fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";
    fontStr += "url('" + url + "');";
    fontStyle.textContent = fontStr + "}";
    document.body.appendChild(fontStyle); // Preload font with div

    var preloadDiv = document.createElement("div");
    var divStyle = preloadDiv.style;
    divStyle.fontFamily = fontFamilyName;
    preloadDiv.innerHTML = ".";
    divStyle.position = "absolute";
    divStyle.left = "-100px";
    divStyle.top = "-100px";
    document.body.appendChild(preloadDiv);

    if (useNativeCheck()) {
      nativeCheckFontLoaded(Date.now(), fontFamilyName, callback);
    } else {
      // Save loading font
      var fontLoadHandle = {
        fontFamilyName: fontFamilyName,
        refWidth: refWidth,
        callback: callback,
        startTime: Date.now()
      };

      _loadingFonts.push(fontLoadHandle);

      if (_intervalId === -1) {
        _intervalId = setInterval(_checkFontLoaded, 100);
      }
    }

    _fontFaces[fontFamilyName] = fontStyle;
  },
  _getFontFamily: function _getFontFamily(fontHandle) {
    var ttfIndex = fontHandle.lastIndexOf(".ttf");
    if (ttfIndex === -1) return fontHandle;
    var slashPos = fontHandle.lastIndexOf("/");
    var fontFamilyName;

    if (slashPos === -1) {
      fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
    } else {
      fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
    }

    if (fontFamilyName.indexOf(' ') !== -1) {
      fontFamilyName = '"' + fontFamilyName + '"';
    }

    return fontFamilyName;
  }
};
module.exports = fontLoader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvbnQtbG9hZGVyLmpzIl0sIm5hbWVzIjpbInRleHRVdGlscyIsInJlcXVpcmUiLCJfY2FudmFzQ29udGV4dCIsIl90ZXN0U3RyaW5nIiwiX2ZvbnRGYWNlcyIsIl9pbnRlcnZhbElkIiwiX2xvYWRpbmdGb250cyIsIl90aW1lb3V0IiwidXNlTmF0aXZlQ2hlY2siLCJuYXRpdmVDaGVjayIsInVuZGVmaW5lZCIsIndpbmRvdyIsIkZvbnRGYWNlIiwibWF0Y2giLCJleGVjIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2FmYXJpMTBNYXRjaCIsInZlbmRvciIsInBhcnNlSW50IiwiX2NoZWNrRm9udExvYWRlZCIsImFsbEZvbnRzTG9hZGVkIiwibm93IiwiRGF0ZSIsImkiLCJsZW5ndGgiLCJmb250TG9hZEhhbmRsZSIsImZvbnRGYW1pbHkiLCJmb250RmFtaWx5TmFtZSIsInN0YXJ0VGltZSIsImNjIiwid2FybklEIiwiY2FsbGJhY2siLCJzcGxpY2UiLCJvbGRXaWR0aCIsInJlZldpZHRoIiwiZm9udERlc2MiLCJmb250IiwibmV3V2lkdGgiLCJzYWZlTWVhc3VyZVRleHQiLCJjbGVhckludGVydmFsIiwibmF0aXZlQ2hlY2tGb250TG9hZGVkIiwic3RhcnQiLCJsb2FkZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNoZWNrIiwiZG9jdW1lbnQiLCJmb250cyIsImxvYWQiLCJ0aGVuIiwic2V0VGltZW91dCIsInRpbWVvdXRJZCIsInRpbWVyIiwicmFjZSIsImNsZWFyVGltZW91dCIsImZvbnRMb2FkZXIiLCJsb2FkRm9udCIsIml0ZW0iLCJ1cmwiLCJfZ2V0Rm9udEZhbWlseSIsImxhYmVsQ2FudmFzIiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0Q29udGV4dCIsImZvbnRTdHlsZSIsInR5cGUiLCJmb250U3RyIiwiaXNOYU4iLCJ0ZXh0Q29udGVudCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInByZWxvYWREaXYiLCJkaXZTdHlsZSIsInN0eWxlIiwiaW5uZXJIVE1MIiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwicHVzaCIsInNldEludGVydmFsIiwiZm9udEhhbmRsZSIsInR0ZkluZGV4IiwibGFzdEluZGV4T2YiLCJzbGFzaFBvcyIsInN1YnN0cmluZyIsImluZGV4T2YiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxxQkFBRCxDQUF6Qjs7QUFFQSxJQUFJQyxjQUFjLEdBQUcsSUFBckIsRUFDQTs7QUFDQSxJQUFJQyxXQUFXLEdBQUcsbUNBQWxCO0FBRUEsSUFBSUMsVUFBVSxHQUFHLEVBQWpCOztBQUNBLElBQUlDLFdBQVcsR0FBRyxDQUFDLENBQW5COztBQUNBLElBQUlDLGFBQWEsR0FBRyxFQUFwQixFQUNBOztBQUNBLElBQUlDLFFBQVEsR0FBRyxJQUFmLEVBRUE7O0FBQ0EsSUFBSUMsY0FBYyxHQUFJLFlBQVk7QUFDOUIsTUFBSUMsV0FBVyxHQUFHQyxTQUFsQjtBQUNBLFNBQU8sWUFBWTtBQUNmLFFBQUlELFdBQVcsS0FBS0MsU0FBcEIsRUFBK0I7QUFDM0IsVUFBSSxDQUFDLENBQUNDLE1BQU0sQ0FBQ0MsUUFBYixFQUF1QjtBQUNuQixZQUFJQyxLQUFLLEdBQUcsd0JBQXdCQyxJQUF4QixDQUE2QkgsTUFBTSxDQUFDSSxTQUFQLENBQWlCQyxTQUE5QyxDQUFaO0FBQ0EsWUFBSUMsYUFBYSxHQUFHLDhCQUE4QkgsSUFBOUIsQ0FBbUNILE1BQU0sQ0FBQ0ksU0FBUCxDQUFpQkMsU0FBcEQsS0FBa0UsUUFBUUYsSUFBUixDQUFhSCxNQUFNLENBQUNJLFNBQVAsQ0FBaUJHLE1BQTlCLENBQXRGOztBQUVBLFlBQUlMLEtBQUosRUFBVztBQUNQSixVQUFBQSxXQUFXLEdBQUdVLFFBQVEsQ0FBQ04sS0FBSyxDQUFDLENBQUQsQ0FBTixFQUFXLEVBQVgsQ0FBUixH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QU9ELFVBQVA7QUFFckIsUUFBSUcsUUFBUSxHQUFHSCxVQUFVLENBQUNFLFdBQVgsQ0FBdUIsR0FBdkIsQ0FBZjtBQUNBLFFBQUl6RCxjQUFKOztBQUNBLFFBQUkwRCxRQUFRLEtBQUssQ0FBQyxDQUFsQixFQUFxQjtBQUNqQjFELE1BQUFBLGNBQWMsR0FBR3VELFVBQVUsQ0FBQ0ksU0FBWCxDQUFxQixDQUFyQixFQUF3QkgsUUFBeEIsSUFBb0MsUUFBckQ7QUFDSCxLQUZELE1BRU87QUFDSHhELE1BQUFBLGNBQWMsR0FBR3VELFVBQVUsQ0FBQ0ksU0FBWCxDQUFxQkQsUUFBUSxHQUFHLENBQWhDLEVBQW1DRixRQUFuQyxJQUErQyxRQUFoRTtBQUNIOztBQUNELFFBQUl4RCxjQUFjLENBQUM0RCxPQUFmLENBQXVCLEdBQXZCLE1BQWdDLENBQUMsQ0FBckMsRUFBd0M7QUFDcEM1RCxNQUFBQSxjQUFjLEdBQUcsTUFBTUEsY0FBTixHQUF1QixHQUF4QztBQUNIOztBQUNELFdBQU9BLGNBQVA7QUFDSDtBQS9FWSxDQUFqQjtBQWtGQTZELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpDLFVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IHRleHRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3RleHQtdXRpbHMnKTtcblxubGV0IF9jYW52YXNDb250ZXh0ID0gbnVsbDtcbi8vIGxldHRlciBzeW1ib2wgbnVtYmVyIENKS1xubGV0IF90ZXN0U3RyaW5nID0gXCJCRVMgYnN3eTotPkAxMjNcXHU0RTAxXFx1MzA0MVxcdTExMDFcIjtcblxubGV0IF9mb250RmFjZXMgPSB7fTtcbmxldCBfaW50ZXJ2YWxJZCA9IC0xO1xubGV0IF9sb2FkaW5nRm9udHMgPSBbXTtcbi8vIDMgc2Vjb25kcyB0aW1lb3V0XG5sZXQgX3RpbWVvdXQgPSAzMDAwO1xuXG4vLyBSZWZlciB0byBodHRwczovL2dpdGh1Yi5jb20vdHlwZWtpdC93ZWJmb250bG9hZGVyL2Jsb2IvbWFzdGVyL3NyYy9jb3JlL2ZvbnR3YXRjaGVyLmpzXG5sZXQgdXNlTmF0aXZlQ2hlY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBuYXRpdmVDaGVjayA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobmF0aXZlQ2hlY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCEhd2luZG93LkZvbnRGYWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gL0dlY2tvLipGaXJlZm94XFwvKFxcZCspLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgICAgICAgICB2YXIgc2FmYXJpMTBNYXRjaCA9IC9PUyBYLipWZXJzaW9uXFwvMTBcXC4uKlNhZmFyaS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FwcGxlLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hdGl2ZUNoZWNrID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSA+IDQyO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2FmYXJpMTBNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBuYXRpdmVDaGVjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5hdGl2ZUNoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuYXRpdmVDaGVjayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hdGl2ZUNoZWNrO1xuICAgICAgICBcbiAgICB9XG59KSgpO1xuXG5mdW5jdGlvbiBfY2hlY2tGb250TG9hZGVkICgpIHtcbiAgICBsZXQgYWxsRm9udHNMb2FkZWQgPSB0cnVlO1xuICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgZm9yIChsZXQgaSA9IF9sb2FkaW5nRm9udHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IGZvbnRMb2FkSGFuZGxlID0gX2xvYWRpbmdGb250c1tpXTtcbiAgICAgICAgbGV0IGZvbnRGYW1pbHkgPSBmb250TG9hZEhhbmRsZS5mb250RmFtaWx5TmFtZTtcbiAgICAgICAgLy8gbG9hZCB0aW1lb3V0XG4gICAgICAgIGlmIChub3cgLSBmb250TG9hZEhhbmRsZS5zdGFydFRpbWUgPiBfdGltZW91dCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDQ5MzMsIGZvbnRGYW1pbHkpO1xuICAgICAgICAgICAgZm9udExvYWRIYW5kbGUuY2FsbGJhY2sobnVsbCwgZm9udEZhbWlseSk7XG4gICAgICAgICAgICBfbG9hZGluZ0ZvbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9sZFdpZHRoID0gZm9udExvYWRIYW5kbGUucmVmV2lkdGg7XG4gICAgICAgIGxldCBmb250RGVzYyA9ICc0MHB4ICcgKyBmb250RmFtaWx5O1xuICAgICAgICBfY2FudmFzQ29udGV4dC5mb250ID0gZm9udERlc2M7XG4gICAgICAgIGxldCBuZXdXaWR0aCA9IHRleHRVdGlscy5zYWZlTWVhc3VyZVRleHQoX2NhbnZhc0NvbnRleHQsIF90ZXN0U3RyaW5nLCBmb250RGVzYyk7XG4gICAgICAgIC8vIGxvYWRlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYgKG9sZFdpZHRoICE9PSBuZXdXaWR0aCkge1xuICAgICAgICAgICAgX2xvYWRpbmdGb250cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBmb250TG9hZEhhbmRsZS5jYWxsYmFjayhudWxsLCBmb250RmFtaWx5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFsbEZvbnRzTG9hZGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWxsRm9udHNMb2FkZWQpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChfaW50ZXJ2YWxJZCk7XG4gICAgICAgIF9pbnRlcnZhbElkID0gLTE7XG4gICAgfVxufVxuXG4vLyByZWZlciB0byBodHRwczovL2dpdGh1Yi5jb20vdHlwZWtpdC93ZWJmb250bG9hZGVyL2Jsb2IvbWFzdGVyL3NyYy9jb3JlL25hdGl2ZWZvbnR3YXRjaHJ1bm5lci5qc1xuZnVuY3Rpb24gbmF0aXZlQ2hlY2tGb250TG9hZGVkIChzdGFydCwgZm9udCwgY2FsbGJhY2spIHtcbiAgICB2YXIgbG9hZGVyID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgY2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgaWYgKG5vdyAtIHN0YXJ0ID49IF90aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZm9udHMubG9hZCgnNDBweCAnICsgZm9udCkudGhlbihmdW5jdGlvbiAoZm9udHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvbnRzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGVjaywgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY2hlY2soKTtcbiAgICB9KTtcbiAgXG4gICAgdmFyIHRpbWVvdXRJZCA9IG51bGwsXG4gICAgdGltZXIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQocmVqZWN0LCBfdGltZW91dCk7XG4gICAgfSk7XG4gIFxuICAgIFByb21pc2UucmFjZShbdGltZXIsIGxvYWRlcl0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGltZW91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGZvbnQpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDQ5MzMsIGZvbnQpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCBmb250KTtcbiAgICB9KTtcbn1cblxudmFyIGZvbnRMb2FkZXIgPSB7XG4gICAgbG9hZEZvbnQ6IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgdXJsID0gaXRlbS51cmw7XG4gICAgICAgIGxldCBmb250RmFtaWx5TmFtZSA9IGZvbnRMb2FkZXIuX2dldEZvbnRGYW1pbHkodXJsKTtcblxuICAgICAgICAvLyBBbHJlYWR5IGxvYWRlZCBmb250c1xuICAgICAgICBpZiAoX2ZvbnRGYWNlc1tmb250RmFtaWx5TmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmb250RmFtaWx5TmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghX2NhbnZhc0NvbnRleHQpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgbGFiZWxDYW52YXMud2lkdGggPSAxMDA7XG4gICAgICAgICAgICBsYWJlbENhbnZhcy5oZWlnaHQgPSAxMDA7XG4gICAgICAgICAgICBfY2FudmFzQ29udGV4dCA9IGxhYmVsQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIERlZmF1bHQgd2lkdGggcmVmZXJlbmNlIHRvIHRlc3Qgd2hldGhlciBuZXcgZm9udCBpcyBsb2FkZWQgY29ycmVjdGx5XG4gICAgICAgIGxldCBmb250RGVzYyA9ICc0MHB4ICcgKyBmb250RmFtaWx5TmFtZTtcbiAgICAgICAgX2NhbnZhc0NvbnRleHQuZm9udCA9IGZvbnREZXNjO1xuICAgICAgICBsZXQgcmVmV2lkdGggPSB0ZXh0VXRpbHMuc2FmZU1lYXN1cmVUZXh0KF9jYW52YXNDb250ZXh0LCBfdGVzdFN0cmluZywgZm9udERlc2MpO1xuXG4gICAgICAgIC8vIFNldHVwIGZvbnQgZmFjZSBzdHlsZVxuICAgICAgICBsZXQgZm9udFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICBmb250U3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICAgICAgbGV0IGZvbnRTdHIgPSBcIlwiO1xuICAgICAgICBpZiAoaXNOYU4oZm9udEZhbWlseU5hbWUgLSAwKSlcbiAgICAgICAgICAgIGZvbnRTdHIgKz0gXCJAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6XCIgKyBmb250RmFtaWx5TmFtZSArIFwiOyBzcmM6XCI7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZvbnRTdHIgKz0gXCJAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6J1wiICsgZm9udEZhbWlseU5hbWUgKyBcIic7IHNyYzpcIjtcbiAgICAgICAgZm9udFN0ciArPSBcInVybCgnXCIgKyB1cmwgKyBcIicpO1wiO1xuICAgICAgICBmb250U3R5bGUudGV4dENvbnRlbnQgPSBmb250U3RyICsgXCJ9XCI7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9udFN0eWxlKTtcblxuICAgICAgICAvLyBQcmVsb2FkIGZvbnQgd2l0aCBkaXZcbiAgICAgICAgbGV0IHByZWxvYWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsZXQgZGl2U3R5bGUgPSBwcmVsb2FkRGl2LnN0eWxlO1xuICAgICAgICBkaXZTdHlsZS5mb250RmFtaWx5ID0gZm9udEZhbWlseU5hbWU7XG4gICAgICAgIHByZWxvYWREaXYuaW5uZXJIVE1MID0gXCIuXCI7XG4gICAgICAgIGRpdlN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBkaXZTdHlsZS5sZWZ0ID0gXCItMTAwcHhcIjtcbiAgICAgICAgZGl2U3R5bGUudG9wID0gXCItMTAwcHhcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwcmVsb2FkRGl2KTtcblxuICAgICAgICBpZiAodXNlTmF0aXZlQ2hlY2soKSkge1xuICAgICAgICAgICAgbmF0aXZlQ2hlY2tGb250TG9hZGVkKERhdGUubm93KCksIGZvbnRGYW1pbHlOYW1lLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTYXZlIGxvYWRpbmcgZm9udFxuICAgICAgICAgICAgbGV0IGZvbnRMb2FkSGFuZGxlID0ge1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHlOYW1lLFxuICAgICAgICAgICAgICAgIHJlZldpZHRoLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2xvYWRpbmdGb250cy5wdXNoKGZvbnRMb2FkSGFuZGxlKTtcbiAgICAgICAgICAgIGlmIChfaW50ZXJ2YWxJZCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBfaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKF9jaGVja0ZvbnRMb2FkZWQsIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX2ZvbnRGYWNlc1tmb250RmFtaWx5TmFtZV0gPSBmb250U3R5bGU7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBfZ2V0Rm9udEZhbWlseTogZnVuY3Rpb24gKGZvbnRIYW5kbGUpIHtcbiAgICAgICAgdmFyIHR0ZkluZGV4ID0gZm9udEhhbmRsZS5sYXN0SW5kZXhPZihcIi50dGZcIik7XG4gICAgICAgIGlmICh0dGZJbmRleCA9PT0gLTEpIHJldHVybiBmb250SGFuZGxlO1xuXG4gICAgICAgIHZhciBzbGFzaFBvcyA9IGZvbnRIYW5kbGUubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgICB2YXIgZm9udEZhbWlseU5hbWU7XG4gICAgICAgIGlmIChzbGFzaFBvcyA9PT0gLTEpIHtcbiAgICAgICAgICAgIGZvbnRGYW1pbHlOYW1lID0gZm9udEhhbmRsZS5zdWJzdHJpbmcoMCwgdHRmSW5kZXgpICsgXCJfTEFCRUxcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvbnRGYW1pbHlOYW1lID0gZm9udEhhbmRsZS5zdWJzdHJpbmcoc2xhc2hQb3MgKyAxLCB0dGZJbmRleCkgKyBcIl9MQUJFTFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb250RmFtaWx5TmFtZS5pbmRleE9mKCcgJykgIT09IC0xKSB7XG4gICAgICAgICAgICBmb250RmFtaWx5TmFtZSA9ICdcIicgKyBmb250RmFtaWx5TmFtZSArICdcIic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvbnRGYW1pbHlOYW1lO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9udExvYWRlciJdfQ==