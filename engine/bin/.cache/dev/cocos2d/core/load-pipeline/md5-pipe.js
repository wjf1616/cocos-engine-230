
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/md5-pipe.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
var Pipeline = require('./pipeline');

var ID = 'MD5Pipe';
var UuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;

var MD5Pipe = function MD5Pipe(md5AssetsMap, md5NativeAssetsMap, libraryBase) {
  this.id = ID;
  this.async = false;
  this.pipeline = null;
  this.md5AssetsMap = md5AssetsMap;
  this.md5NativeAssetsMap = md5NativeAssetsMap;
  this.libraryBase = libraryBase;
};

MD5Pipe.ID = ID;

MD5Pipe.prototype.handle = function (item) {
  item.url = this.transformURL(item.url);
  return null;
};

MD5Pipe.prototype.transformURL = function (url) {
  var isNativeAsset = !url.startsWith(this.libraryBase);
  var map = isNativeAsset ? this.md5NativeAssetsMap : this.md5AssetsMap;
  url = url.replace(UuidRegex, function (match, uuid) {
    var hashValue = map[uuid];
    return hashValue ? match + '.' + hashValue : match;
  });
  return url;
};

Pipeline.MD5Pipe = module.exports = MD5Pipe;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1kNS1waXBlLmpzIl0sIm5hbWVzIjpbIlBpcGVsaW5lIiwicmVxdWlyZSIsIklEIiwiVXVpZFJlZ2V4IiwiTUQ1UGlwZSIsIm1kNUFzc2V0c01hcCIsIm1kNU5hdGl2ZUFzc2V0c01hcCIsImxpYnJhcnlCYXNlIiwiaWQiLCJhc3luYyIsInBpcGVsaW5lIiwicHJvdG90eXBlIiwiaGFuZGxlIiwiaXRlbSIsInVybCIsInRyYW5zZm9ybVVSTCIsImlzTmF0aXZlQXNzZXQiLCJzdGFydHNXaXRoIiwibWFwIiwicmVwbGFjZSIsIm1hdGNoIiwidXVpZCIsImhhc2hWYWx1ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXRCOztBQUVBLElBQU1DLEVBQUUsR0FBRyxTQUFYO0FBQ0EsSUFBTUMsU0FBUyxHQUFHLDhDQUFsQjs7QUFFQSxJQUFJQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFVQyxZQUFWLEVBQXdCQyxrQkFBeEIsRUFBNENDLFdBQTVDLEVBQXlEO0FBQ25FLE9BQUtDLEVBQUwsR0FBVU4sRUFBVjtBQUNBLE9BQUtPLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLE9BQUtMLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0EsT0FBS0Msa0JBQUwsR0FBMEJBLGtCQUExQjtBQUNBLE9BQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0gsQ0FQRDs7QUFRQUgsT0FBTyxDQUFDRixFQUFSLEdBQWFBLEVBQWI7O0FBRUFFLE9BQU8sQ0FBQ08sU0FBUixDQUFrQkMsTUFBbEIsR0FBMkIsVUFBU0MsSUFBVCxFQUFlO0FBQ3RDQSxFQUFBQSxJQUFJLENBQUNDLEdBQUwsR0FBVyxLQUFLQyxZQUFMLENBQWtCRixJQUFJLENBQUNDLEdBQXZCLENBQVg7QUFDQSxTQUFPLElBQVA7QUFDSCxDQUhEOztBQUtBVixPQUFPLENBQUNPLFNBQVIsQ0FBa0JJLFlBQWxCLEdBQWlDLFVBQVVELEdBQVYsRUFBZTtBQUM1QyxNQUFJRSxhQUFhLEdBQUcsQ0FBQ0YsR0FBRyxDQUFDRyxVQUFKLENBQWUsS0FBS1YsV0FBcEIsQ0FBckI7QUFDQSxNQUFJVyxHQUFHLEdBQUdGLGFBQWEsR0FBRyxLQUFLVixrQkFBUixHQUE2QixLQUFLRCxZQUF6RDtBQUNBUyxFQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0ssT0FBSixDQUFZaEIsU0FBWixFQUF1QixVQUFVaUIsS0FBVixFQUFpQkMsSUFBakIsRUFBdUI7QUFDaEQsUUFBSUMsU0FBUyxHQUFHSixHQUFHLENBQUNHLElBQUQsQ0FBbkI7QUFDQSxXQUFPQyxTQUFTLEdBQUdGLEtBQUssR0FBRyxHQUFSLEdBQWNFLFNBQWpCLEdBQTZCRixLQUE3QztBQUNILEdBSEssQ0FBTjtBQUlBLFNBQU9OLEdBQVA7QUFDSCxDQVJEOztBQVdBZCxRQUFRLENBQUNJLE9BQVQsR0FBbUJtQixNQUFNLENBQUNDLE9BQVAsR0FBaUJwQixPQUFwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQaXBlbGluZSA9IHJlcXVpcmUoJy4vcGlwZWxpbmUnKTtcblxuY29uc3QgSUQgPSAnTUQ1UGlwZSc7XG5jb25zdCBVdWlkUmVnZXggPSAvLipbL1xcXFxdWzAtOWEtZkEtRl17Mn1bL1xcXFxdKFswLTlhLWZBLUYtXXs4LH0pLztcblxudmFyIE1ENVBpcGUgPSBmdW5jdGlvbiAobWQ1QXNzZXRzTWFwLCBtZDVOYXRpdmVBc3NldHNNYXAsIGxpYnJhcnlCYXNlKSB7XG4gICAgdGhpcy5pZCA9IElEO1xuICAgIHRoaXMuYXN5bmMgPSBmYWxzZTtcbiAgICB0aGlzLnBpcGVsaW5lID0gbnVsbDtcbiAgICB0aGlzLm1kNUFzc2V0c01hcCA9IG1kNUFzc2V0c01hcDtcbiAgICB0aGlzLm1kNU5hdGl2ZUFzc2V0c01hcCA9IG1kNU5hdGl2ZUFzc2V0c01hcDtcbiAgICB0aGlzLmxpYnJhcnlCYXNlID0gbGlicmFyeUJhc2U7XG59O1xuTUQ1UGlwZS5JRCA9IElEO1xuXG5NRDVQaXBlLnByb3RvdHlwZS5oYW5kbGUgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaXRlbS51cmwgPSB0aGlzLnRyYW5zZm9ybVVSTChpdGVtLnVybCk7XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG5NRDVQaXBlLnByb3RvdHlwZS50cmFuc2Zvcm1VUkwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgbGV0IGlzTmF0aXZlQXNzZXQgPSAhdXJsLnN0YXJ0c1dpdGgodGhpcy5saWJyYXJ5QmFzZSk7XG4gICAgbGV0IG1hcCA9IGlzTmF0aXZlQXNzZXQgPyB0aGlzLm1kNU5hdGl2ZUFzc2V0c01hcCA6IHRoaXMubWQ1QXNzZXRzTWFwO1xuICAgIHVybCA9IHVybC5yZXBsYWNlKFV1aWRSZWdleCwgZnVuY3Rpb24gKG1hdGNoLCB1dWlkKSB7XG4gICAgICAgIGxldCBoYXNoVmFsdWUgPSBtYXBbdXVpZF07XG4gICAgICAgIHJldHVybiBoYXNoVmFsdWUgPyBtYXRjaCArICcuJyArIGhhc2hWYWx1ZSA6IG1hdGNoO1xuICAgIH0pO1xuICAgIHJldHVybiB1cmw7XG59O1xuXG5cblBpcGVsaW5lLk1ENVBpcGUgPSBtb2R1bGUuZXhwb3J0cyA9IE1ENVBpcGU7XG4iXX0=