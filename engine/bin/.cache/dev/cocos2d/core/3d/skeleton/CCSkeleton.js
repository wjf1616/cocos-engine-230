
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/skeleton/CCSkeleton.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var Skeleton = cc.Class({
  name: 'cc.Skeleton',
  "extends": cc.Asset,
  ctor: function ctor() {
    this._bindposes = [];
    this._uniqueBindPoses = [];
    this._jointPaths = [];
  },
  properties: {
    _model: cc.Model,
    _jointIndices: [],
    _skinIndex: -1,
    jointPaths: {
      get: function get() {
        return this._jointPaths;
      }
    },
    bindposes: {
      get: function get() {
        return this._bindposes;
      }
    },
    uniqueBindPoses: {
      get: function get() {
        return this._uniqueBindPoses;
      }
    },
    model: {
      get: function get() {
        return this._model;
      }
    }
  },
  onLoad: function onLoad() {
    var nodes = this._model.nodes;
    var jointIndices = this._jointIndices;
    var jointPaths = this._jointPaths;
    var bindposes = this._bindposes;
    var uniqueBindPoses = this._uniqueBindPoses;

    for (var i = 0; i < jointIndices.length; i++) {
      var node = nodes[jointIndices[i]];
      jointPaths[i] = node.path;

      if (node.uniqueBindPose) {
        bindposes[i] = uniqueBindPoses[i] = node.uniqueBindPose;
      } else {
        bindposes[i] = node.bindpose[this._skinIndex];
      }
    }
  }
});
cc.Skeleton = module.exports = Skeleton;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2tlbGV0b24uanMiXSwibmFtZXMiOlsiU2tlbGV0b24iLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwiY3RvciIsIl9iaW5kcG9zZXMiLCJfdW5pcXVlQmluZFBvc2VzIiwiX2pvaW50UGF0aHMiLCJwcm9wZXJ0aWVzIiwiX21vZGVsIiwiTW9kZWwiLCJfam9pbnRJbmRpY2VzIiwiX3NraW5JbmRleCIsImpvaW50UGF0aHMiLCJnZXQiLCJiaW5kcG9zZXMiLCJ1bmlxdWVCaW5kUG9zZXMiLCJtb2RlbCIsIm9uTG9hZCIsIm5vZGVzIiwiam9pbnRJbmRpY2VzIiwiaSIsImxlbmd0aCIsIm5vZGUiLCJwYXRoIiwidW5pcXVlQmluZFBvc2UiLCJiaW5kcG9zZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFFBQVEsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDcEJDLEVBQUFBLElBQUksRUFBRSxhQURjO0FBRXBCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGUTtBQUlwQkMsRUFBQUEsSUFKb0Isa0JBSVo7QUFDSixTQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0IsRUFBeEI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0gsR0FSbUI7QUFVcEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxNQUFNLEVBQUVULEVBQUUsQ0FBQ1UsS0FESDtBQUVSQyxJQUFBQSxhQUFhLEVBQUUsRUFGUDtBQUdSQyxJQUFBQSxVQUFVLEVBQUUsQ0FBQyxDQUhMO0FBS1JDLElBQUFBLFVBQVUsRUFBRTtBQUNSQyxNQUFBQSxHQURRLGlCQUNEO0FBQ0gsZUFBTyxLQUFLUCxXQUFaO0FBQ0g7QUFITyxLQUxKO0FBVVJRLElBQUFBLFNBQVMsRUFBRTtBQUNQRCxNQUFBQSxHQURPLGlCQUNBO0FBQ0gsZUFBTyxLQUFLVCxVQUFaO0FBQ0g7QUFITSxLQVZIO0FBZVJXLElBQUFBLGVBQWUsRUFBRTtBQUNiRixNQUFBQSxHQURhLGlCQUNOO0FBQ0gsZUFBTyxLQUFLUixnQkFBWjtBQUNIO0FBSFksS0FmVDtBQW9CUlcsSUFBQUEsS0FBSyxFQUFFO0FBQ0hILE1BQUFBLEdBREcsaUJBQ0k7QUFDSCxlQUFPLEtBQUtMLE1BQVo7QUFDSDtBQUhFO0FBcEJDLEdBVlE7QUFxQ3BCUyxFQUFBQSxNQXJDb0Isb0JBcUNWO0FBQ04sUUFBSUMsS0FBSyxHQUFHLEtBQUtWLE1BQUwsQ0FBWVUsS0FBeEI7QUFDQSxRQUFJQyxZQUFZLEdBQUcsS0FBS1QsYUFBeEI7QUFDQSxRQUFJRSxVQUFVLEdBQUcsS0FBS04sV0FBdEI7QUFDQSxRQUFJUSxTQUFTLEdBQUcsS0FBS1YsVUFBckI7QUFDQSxRQUFJVyxlQUFlLEdBQUcsS0FBS1YsZ0JBQTNCOztBQUNBLFNBQUssSUFBSWUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsWUFBWSxDQUFDRSxNQUFqQyxFQUF5Q0QsQ0FBQyxFQUExQyxFQUE4QztBQUMxQyxVQUFJRSxJQUFJLEdBQUdKLEtBQUssQ0FBQ0MsWUFBWSxDQUFDQyxDQUFELENBQWIsQ0FBaEI7QUFDQVIsTUFBQUEsVUFBVSxDQUFDUSxDQUFELENBQVYsR0FBZ0JFLElBQUksQ0FBQ0MsSUFBckI7O0FBQ0EsVUFBSUQsSUFBSSxDQUFDRSxjQUFULEVBQXlCO0FBQ3JCVixRQUFBQSxTQUFTLENBQUNNLENBQUQsQ0FBVCxHQUFlTCxlQUFlLENBQUNLLENBQUQsQ0FBZixHQUFxQkUsSUFBSSxDQUFDRSxjQUF6QztBQUNILE9BRkQsTUFHSztBQUNEVixRQUFBQSxTQUFTLENBQUNNLENBQUQsQ0FBVCxHQUFlRSxJQUFJLENBQUNHLFFBQUwsQ0FBYyxLQUFLZCxVQUFuQixDQUFmO0FBQ0g7QUFDSjtBQUNKO0FBckRtQixDQUFULENBQWY7QUF3REFaLEVBQUUsQ0FBQ0QsUUFBSCxHQUFjNEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0IsUUFBL0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxubGV0IFNrZWxldG9uID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Ta2VsZXRvbicsXG4gICAgZXh0ZW5kczogY2MuQXNzZXQsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fYmluZHBvc2VzID0gW107XG4gICAgICAgIHRoaXMuX3VuaXF1ZUJpbmRQb3NlcyA9IFtdO1xuICAgICAgICB0aGlzLl9qb2ludFBhdGhzID0gW107XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX21vZGVsOiBjYy5Nb2RlbCxcbiAgICAgICAgX2pvaW50SW5kaWNlczogW10sXG4gICAgICAgIF9za2luSW5kZXg6IC0xLFxuXG4gICAgICAgIGpvaW50UGF0aHM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2pvaW50UGF0aHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGJpbmRwb3Nlczoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYmluZHBvc2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1bmlxdWVCaW5kUG9zZXM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuaXF1ZUJpbmRQb3NlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIGxldCBub2RlcyA9IHRoaXMuX21vZGVsLm5vZGVzO1xuICAgICAgICBsZXQgam9pbnRJbmRpY2VzID0gdGhpcy5fam9pbnRJbmRpY2VzO1xuICAgICAgICBsZXQgam9pbnRQYXRocyA9IHRoaXMuX2pvaW50UGF0aHM7XG4gICAgICAgIGxldCBiaW5kcG9zZXMgPSB0aGlzLl9iaW5kcG9zZXM7XG4gICAgICAgIGxldCB1bmlxdWVCaW5kUG9zZXMgPSB0aGlzLl91bmlxdWVCaW5kUG9zZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgam9pbnRJbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5vZGVzW2pvaW50SW5kaWNlc1tpXV07XG4gICAgICAgICAgICBqb2ludFBhdGhzW2ldID0gbm9kZS5wYXRoO1xuICAgICAgICAgICAgaWYgKG5vZGUudW5pcXVlQmluZFBvc2UpIHtcbiAgICAgICAgICAgICAgICBiaW5kcG9zZXNbaV0gPSB1bmlxdWVCaW5kUG9zZXNbaV0gPSBub2RlLnVuaXF1ZUJpbmRQb3NlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmluZHBvc2VzW2ldID0gbm9kZS5iaW5kcG9zZVt0aGlzLl9za2luSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLlNrZWxldG9uID0gbW9kdWxlLmV4cG9ydHMgPSBTa2VsZXRvbjsiXX0=