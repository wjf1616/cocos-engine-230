
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/EditBoxImplBase.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2012 James Chen
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var EditBoxImplBase = cc.Class({
  ctor: function ctor() {
    this._delegate = null;
    this._editing = false;
  },
  init: function init(delegate) {},
  enable: function enable() {},
  disable: function disable() {
    if (this._editing) {
      this.endEditing();
    }
  },
  clear: function clear() {},
  update: function update() {},
  setTabIndex: function setTabIndex(index) {},
  setSize: function setSize(width, height) {},
  setFocus: function setFocus(value) {
    if (value) {
      this.beginEditing();
    } else {
      this.endEditing();
    }
  },
  isFocused: function isFocused() {
    return this._editing;
  },
  beginEditing: function beginEditing() {},
  endEditing: function endEditing() {}
});
module.exports = EditBoxImplBase;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVkaXRCb3hJbXBsQmFzZS5qcyJdLCJuYW1lcyI6WyJFZGl0Qm94SW1wbEJhc2UiLCJjYyIsIkNsYXNzIiwiY3RvciIsIl9kZWxlZ2F0ZSIsIl9lZGl0aW5nIiwiaW5pdCIsImRlbGVnYXRlIiwiZW5hYmxlIiwiZGlzYWJsZSIsImVuZEVkaXRpbmciLCJjbGVhciIsInVwZGF0ZSIsInNldFRhYkluZGV4IiwiaW5kZXgiLCJzZXRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJzZXRGb2N1cyIsInZhbHVlIiwiYmVnaW5FZGl0aW5nIiwiaXNGb2N1c2VkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsSUFBSUEsZUFBZSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUMzQkMsRUFBQUEsSUFEMkIsa0JBQ25CO0FBQ0osU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDSCxHQUowQjtBQU0zQkMsRUFBQUEsSUFOMkIsZ0JBTXJCQyxRQU5xQixFQU1YLENBRWYsQ0FSMEI7QUFVM0JDLEVBQUFBLE1BVjJCLG9CQVVqQixDQUVULENBWjBCO0FBYzNCQyxFQUFBQSxPQWQyQixxQkFjaEI7QUFDUCxRQUFJLEtBQUtKLFFBQVQsRUFBbUI7QUFDZixXQUFLSyxVQUFMO0FBQ0g7QUFDSixHQWxCMEI7QUFvQjNCQyxFQUFBQSxLQXBCMkIsbUJBb0JsQixDQUVSLENBdEIwQjtBQXdCM0JDLEVBQUFBLE1BeEIyQixvQkF3QmpCLENBRVQsQ0ExQjBCO0FBNEIzQkMsRUFBQUEsV0E1QjJCLHVCQTRCZEMsS0E1QmMsRUE0QlAsQ0FFbkIsQ0E5QjBCO0FBZ0MzQkMsRUFBQUEsT0FoQzJCLG1CQWdDbEJDLEtBaENrQixFQWdDWEMsTUFoQ1csRUFnQ0gsQ0FFdkIsQ0FsQzBCO0FBb0MzQkMsRUFBQUEsUUFwQzJCLG9CQW9DakJDLEtBcENpQixFQW9DVjtBQUNiLFFBQUlBLEtBQUosRUFBVztBQUNQLFdBQUtDLFlBQUw7QUFDSCxLQUZELE1BR0s7QUFDRCxXQUFLVixVQUFMO0FBQ0g7QUFDSixHQTNDMEI7QUE2QzNCVyxFQUFBQSxTQTdDMkIsdUJBNkNkO0FBQ1QsV0FBTyxLQUFLaEIsUUFBWjtBQUNILEdBL0MwQjtBQWlEM0JlLEVBQUFBLFlBakQyQiwwQkFpRFgsQ0FFZixDQW5EMEI7QUFxRDNCVixFQUFBQSxVQXJEMkIsd0JBcURiLENBRWI7QUF2RDBCLENBQVQsQ0FBdEI7QUEwREFZLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZCLGVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEyIEphbWVzIENoZW5cbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmxldCBFZGl0Qm94SW1wbEJhc2UgPSBjYy5DbGFzcyh7XG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZWRpdGluZyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBpbml0IChkZWxlZ2F0ZSkge1xuXG4gICAgfSxcblxuICAgIGVuYWJsZSAoKSB7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBkaXNhYmxlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VkaXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRWRpdGluZygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBzZXRUYWJJbmRleCAoaW5kZXgpIHtcblxuICAgIH0sXG5cbiAgICBzZXRTaXplICh3aWR0aCwgaGVpZ2h0KSB7XG5cbiAgICB9LFxuXG4gICAgc2V0Rm9jdXMgKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5iZWdpbkVkaXRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRWRpdGluZygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzRm9jdXNlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lZGl0aW5nO1xuICAgIH0sXG5cbiAgICBiZWdpbkVkaXRpbmcgKCkge1xuXG4gICAgfSxcbiAgICBcbiAgICBlbmRFZGl0aW5nICgpIHtcblxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0Qm94SW1wbEJhc2U7XG4iXX0=