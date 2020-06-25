
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/animation-manager.js';
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
var js = cc.js;
var AnimationManager = cc.Class({
  ctor: function ctor() {
    this._anims = new js.array.MutableForwardIterator([]);
    this._delayEvents = [];
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
  },
  // for manager
  update: function update(dt) {
    var iterator = this._anims;
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      var anim = array[iterator.i];

      if (anim._isPlaying && !anim._isPaused) {
        anim.update(dt);
      }
    }

    var events = this._delayEvents;

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      event.target[event.func].apply(event.target, event.args);
    }

    events.length = 0;
  },
  destruct: function destruct() {},

  /**
   * @param {AnimationState} anim
   */
  addAnimation: function addAnimation(anim) {
    var index = this._anims.array.indexOf(anim);

    if (index === -1) {
      this._anims.push(anim);
    }
  },

  /**
   * @param {AnimationState} anim
   */
  removeAnimation: function removeAnimation(anim) {
    var index = this._anims.array.indexOf(anim);

    if (index >= 0) {
      this._anims.fastRemoveAt(index);
    } else {
      cc.errorID(3907);
    }
  },
  pushDelayEvent: function pushDelayEvent(target, func, args) {
    this._delayEvents.push({
      target: target,
      func: func,
      args: args
    });
  }
});
cc.AnimationManager = module.exports = AnimationManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdGlvbi1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImpzIiwiY2MiLCJBbmltYXRpb25NYW5hZ2VyIiwiQ2xhc3MiLCJjdG9yIiwiX2FuaW1zIiwiYXJyYXkiLCJNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yIiwiX2RlbGF5RXZlbnRzIiwiZGlyZWN0b3IiLCJfc2NoZWR1bGVyIiwiZW5hYmxlRm9yVGFyZ2V0IiwidXBkYXRlIiwiZHQiLCJpdGVyYXRvciIsImkiLCJsZW5ndGgiLCJhbmltIiwiX2lzUGxheWluZyIsIl9pc1BhdXNlZCIsImV2ZW50cyIsImV2ZW50IiwidGFyZ2V0IiwiZnVuYyIsImFwcGx5IiwiYXJncyIsImRlc3RydWN0IiwiYWRkQW5pbWF0aW9uIiwiaW5kZXgiLCJpbmRleE9mIiwicHVzaCIsInJlbW92ZUFuaW1hdGlvbiIsImZhc3RSZW1vdmVBdCIsImVycm9ySUQiLCJwdXNoRGVsYXlFdmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQUlBLEVBQUUsR0FBR0MsRUFBRSxDQUFDRCxFQUFaO0FBRUEsSUFBSUUsZ0JBQWdCLEdBQUdELEVBQUUsQ0FBQ0UsS0FBSCxDQUFTO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxTQUFLQyxNQUFMLEdBQWMsSUFBSUwsRUFBRSxDQUFDTSxLQUFILENBQVNDLHNCQUFiLENBQW9DLEVBQXBDLENBQWQ7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBRUFQLElBQUFBLEVBQUUsQ0FBQ1EsUUFBSCxDQUFZQyxVQUFaLElBQTBCVCxFQUFFLENBQUNRLFFBQUgsQ0FBWUMsVUFBWixDQUF1QkMsZUFBdkIsQ0FBdUMsSUFBdkMsQ0FBMUI7QUFDSCxHQU4yQjtBQVE1QjtBQUVBQyxFQUFBQSxNQUFNLEVBQUUsZ0JBQVVDLEVBQVYsRUFBYztBQUNsQixRQUFJQyxRQUFRLEdBQUcsS0FBS1QsTUFBcEI7QUFDQSxRQUFJQyxLQUFLLEdBQUdRLFFBQVEsQ0FBQ1IsS0FBckI7O0FBQ0EsU0FBS1EsUUFBUSxDQUFDQyxDQUFULEdBQWEsQ0FBbEIsRUFBcUJELFFBQVEsQ0FBQ0MsQ0FBVCxHQUFhVCxLQUFLLENBQUNVLE1BQXhDLEVBQWdELEVBQUVGLFFBQVEsQ0FBQ0MsQ0FBM0QsRUFBOEQ7QUFDMUQsVUFBSUUsSUFBSSxHQUFHWCxLQUFLLENBQUNRLFFBQVEsQ0FBQ0MsQ0FBVixDQUFoQjs7QUFDQSxVQUFJRSxJQUFJLENBQUNDLFVBQUwsSUFBbUIsQ0FBQ0QsSUFBSSxDQUFDRSxTQUE3QixFQUF3QztBQUNwQ0YsUUFBQUEsSUFBSSxDQUFDTCxNQUFMLENBQVlDLEVBQVo7QUFDSDtBQUNKOztBQUVELFFBQUlPLE1BQU0sR0FBRyxLQUFLWixZQUFsQjs7QUFDQSxTQUFLLElBQUlPLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdLLE1BQU0sQ0FBQ0osTUFBM0IsRUFBbUNELENBQUMsRUFBcEMsRUFBd0M7QUFDcEMsVUFBSU0sS0FBSyxHQUFHRCxNQUFNLENBQUNMLENBQUQsQ0FBbEI7QUFDQU0sTUFBQUEsS0FBSyxDQUFDQyxNQUFOLENBQWFELEtBQUssQ0FBQ0UsSUFBbkIsRUFBeUJDLEtBQXpCLENBQStCSCxLQUFLLENBQUNDLE1BQXJDLEVBQTZDRCxLQUFLLENBQUNJLElBQW5EO0FBQ0g7O0FBQ0RMLElBQUFBLE1BQU0sQ0FBQ0osTUFBUCxHQUFnQixDQUFoQjtBQUVILEdBM0IyQjtBQTZCNUJVLEVBQUFBLFFBQVEsRUFBRSxvQkFBWSxDQUFFLENBN0JJOztBQWdDNUI7OztBQUdBQyxFQUFBQSxZQUFZLEVBQUUsc0JBQVVWLElBQVYsRUFBZ0I7QUFDMUIsUUFBSVcsS0FBSyxHQUFHLEtBQUt2QixNQUFMLENBQVlDLEtBQVosQ0FBa0J1QixPQUFsQixDQUEwQlosSUFBMUIsQ0FBWjs7QUFDQSxRQUFJVyxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2QsV0FBS3ZCLE1BQUwsQ0FBWXlCLElBQVosQ0FBaUJiLElBQWpCO0FBQ0g7QUFDSixHQXhDMkI7O0FBMEM1Qjs7O0FBR0FjLEVBQUFBLGVBQWUsRUFBRSx5QkFBVWQsSUFBVixFQUFnQjtBQUM3QixRQUFJVyxLQUFLLEdBQUcsS0FBS3ZCLE1BQUwsQ0FBWUMsS0FBWixDQUFrQnVCLE9BQWxCLENBQTBCWixJQUExQixDQUFaOztBQUNBLFFBQUlXLEtBQUssSUFBSSxDQUFiLEVBQWdCO0FBQ1osV0FBS3ZCLE1BQUwsQ0FBWTJCLFlBQVosQ0FBeUJKLEtBQXpCO0FBQ0gsS0FGRCxNQUdLO0FBQ0QzQixNQUFBQSxFQUFFLENBQUNnQyxPQUFILENBQVcsSUFBWDtBQUNIO0FBQ0osR0FyRDJCO0FBdUQ1QkMsRUFBQUEsY0FBYyxFQUFFLHdCQUFVWixNQUFWLEVBQWtCQyxJQUFsQixFQUF3QkUsSUFBeEIsRUFBOEI7QUFDMUMsU0FBS2pCLFlBQUwsQ0FBa0JzQixJQUFsQixDQUF1QjtBQUNuQlIsTUFBQUEsTUFBTSxFQUFFQSxNQURXO0FBRW5CQyxNQUFBQSxJQUFJLEVBQUVBLElBRmE7QUFHbkJFLE1BQUFBLElBQUksRUFBRUE7QUFIYSxLQUF2QjtBQUtIO0FBN0QyQixDQUFULENBQXZCO0FBaUVBeEIsRUFBRSxDQUFDQyxnQkFBSCxHQUFzQmlDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxDLGdCQUF2QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IGNjLmpzO1xuXG52YXIgQW5pbWF0aW9uTWFuYWdlciA9IGNjLkNsYXNzKHtcbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2FuaW1zID0gbmV3IGpzLmFycmF5Lk11dGFibGVGb3J3YXJkSXRlcmF0b3IoW10pO1xuICAgICAgICB0aGlzLl9kZWxheUV2ZW50cyA9IFtdO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLl9zY2hlZHVsZXIgJiYgY2MuZGlyZWN0b3IuX3NjaGVkdWxlci5lbmFibGVGb3JUYXJnZXQodGhpcyk7XG4gICAgfSxcblxuICAgIC8vIGZvciBtYW5hZ2VyXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9hbmltcztcbiAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgIGZvciAoaXRlcmF0b3IuaSA9IDA7IGl0ZXJhdG9yLmkgPCBhcnJheS5sZW5ndGg7ICsraXRlcmF0b3IuaSkge1xuICAgICAgICAgICAgdmFyIGFuaW0gPSBhcnJheVtpdGVyYXRvci5pXTtcbiAgICAgICAgICAgIGlmIChhbmltLl9pc1BsYXlpbmcgJiYgIWFuaW0uX2lzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgYW5pbS51cGRhdGUoZHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2RlbGF5RXZlbnRzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGV2ZW50ID0gZXZlbnRzW2ldO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0W2V2ZW50LmZ1bmNdLmFwcGx5KGV2ZW50LnRhcmdldCwgZXZlbnQuYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBkZXN0cnVjdDogZnVuY3Rpb24gKCkge30sXG5cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uU3RhdGV9IGFuaW1cbiAgICAgKi9cbiAgICBhZGRBbmltYXRpb246IGZ1bmN0aW9uIChhbmltKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2FuaW1zLmFycmF5LmluZGV4T2YoYW5pbSk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1zLnB1c2goYW5pbSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBbmltYXRpb25TdGF0ZX0gYW5pbVxuICAgICAqL1xuICAgIHJlbW92ZUFuaW1hdGlvbjogZnVuY3Rpb24gKGFuaW0pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fYW5pbXMuYXJyYXkuaW5kZXhPZihhbmltKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1zLmZhc3RSZW1vdmVBdChpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM5MDcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHB1c2hEZWxheUV2ZW50OiBmdW5jdGlvbiAodGFyZ2V0LCBmdW5jLCBhcmdzKSB7XG4gICAgICAgIHRoaXMuX2RlbGF5RXZlbnRzLnB1c2goe1xuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICBmdW5jOiBmdW5jLFxuICAgICAgICAgICAgYXJnczogYXJnc1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuXG5jYy5BbmltYXRpb25NYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25NYW5hZ2VyO1xuIl19