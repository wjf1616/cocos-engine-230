
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/CCModel.js';
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
var Model = cc.Class({
  name: 'cc.Model',
  "extends": cc.Asset,
  ctor: function ctor() {
    this._rootNode = null;
  },
  properties: {
    _nodes: {
      "default": []
    },
    _precomputeJointMatrix: false,
    nodes: {
      get: function get() {
        return this._nodes;
      }
    },
    rootNode: {
      get: function get() {
        return this._rootNode;
      }
    },
    precomputeJointMatrix: {
      get: function get() {
        return this._precomputeJointMatrix;
      }
    }
  },
  onLoad: function onLoad() {
    var nodes = this._nodes;
    this._rootNode = nodes[0];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node.position = cc.v3.apply(this, node.position);
      node.scale = cc.v3.apply(this, node.scale);
      node.quat = cc.quat.apply(this, node.quat);

      if (node.uniqueBindPose) {
        node.uniqueBindPose = cc.mat4.apply(this, node.uniqueBindPose);
      }

      var pose = node.bindpose;

      if (pose) {
        for (var _i in pose) {
          pose[_i] = cc.mat4.apply(this, pose[_i]);
        }
      }

      var children = node.children;

      if (children) {
        for (var _i2 = 0; _i2 < children.length; _i2++) {
          children[_i2] = nodes[children[_i2]];
        }
      }
    }
  }
});
cc.Model = module.exports = Model;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTW9kZWwuanMiXSwibmFtZXMiOlsiTW9kZWwiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwiY3RvciIsIl9yb290Tm9kZSIsInByb3BlcnRpZXMiLCJfbm9kZXMiLCJfcHJlY29tcHV0ZUpvaW50TWF0cml4Iiwibm9kZXMiLCJnZXQiLCJyb290Tm9kZSIsInByZWNvbXB1dGVKb2ludE1hdHJpeCIsIm9uTG9hZCIsImkiLCJsZW5ndGgiLCJub2RlIiwicG9zaXRpb24iLCJ2MyIsImFwcGx5Iiwic2NhbGUiLCJxdWF0IiwidW5pcXVlQmluZFBvc2UiLCJtYXQ0IiwicG9zZSIsImJpbmRwb3NlIiwiY2hpbGRyZW4iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQSxLQUFLLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ2pCQyxFQUFBQSxJQUFJLEVBQUUsVUFEVztBQUVqQixhQUFTRixFQUFFLENBQUNHLEtBRks7QUFJakJDLEVBQUFBLElBSmlCLGtCQUlUO0FBQ0osU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNILEdBTmdCO0FBUWpCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFO0FBQ0osaUJBQVM7QUFETCxLQURBO0FBS1JDLElBQUFBLHNCQUFzQixFQUFFLEtBTGhCO0FBT1JDLElBQUFBLEtBQUssRUFBRTtBQUNIQyxNQUFBQSxHQURHLGlCQUNJO0FBQ0gsZUFBTyxLQUFLSCxNQUFaO0FBQ0g7QUFIRSxLQVBDO0FBWVJJLElBQUFBLFFBQVEsRUFBRTtBQUNORCxNQUFBQSxHQURNLGlCQUNDO0FBQ0gsZUFBTyxLQUFLTCxTQUFaO0FBQ0g7QUFISyxLQVpGO0FBa0JSTyxJQUFBQSxxQkFBcUIsRUFBRTtBQUNuQkYsTUFBQUEsR0FEbUIsaUJBQ1o7QUFDSCxlQUFPLEtBQUtGLHNCQUFaO0FBQ0g7QUFIa0I7QUFsQmYsR0FSSztBQWlDakJLLEVBQUFBLE1BakNpQixvQkFpQ1A7QUFDTixRQUFJSixLQUFLLEdBQUcsS0FBS0YsTUFBakI7QUFDQSxTQUFLRixTQUFMLEdBQWlCSSxLQUFLLENBQUMsQ0FBRCxDQUF0Qjs7QUFDQSxTQUFLLElBQUlLLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLEtBQUssQ0FBQ00sTUFBMUIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsVUFBSUUsSUFBSSxHQUFHUCxLQUFLLENBQUNLLENBQUQsQ0FBaEI7QUFDQUUsTUFBQUEsSUFBSSxDQUFDQyxRQUFMLEdBQWdCakIsRUFBRSxDQUFDa0IsRUFBSCxDQUFNQyxLQUFOLENBQVksSUFBWixFQUFrQkgsSUFBSSxDQUFDQyxRQUF2QixDQUFoQjtBQUNBRCxNQUFBQSxJQUFJLENBQUNJLEtBQUwsR0FBYXBCLEVBQUUsQ0FBQ2tCLEVBQUgsQ0FBTUMsS0FBTixDQUFZLElBQVosRUFBa0JILElBQUksQ0FBQ0ksS0FBdkIsQ0FBYjtBQUNBSixNQUFBQSxJQUFJLENBQUNLLElBQUwsR0FBWXJCLEVBQUUsQ0FBQ3FCLElBQUgsQ0FBUUYsS0FBUixDQUFjLElBQWQsRUFBb0JILElBQUksQ0FBQ0ssSUFBekIsQ0FBWjs7QUFFQSxVQUFJTCxJQUFJLENBQUNNLGNBQVQsRUFBeUI7QUFDckJOLFFBQUFBLElBQUksQ0FBQ00sY0FBTCxHQUFzQnRCLEVBQUUsQ0FBQ3VCLElBQUgsQ0FBUUosS0FBUixDQUFjLElBQWQsRUFBb0JILElBQUksQ0FBQ00sY0FBekIsQ0FBdEI7QUFDSDs7QUFFRCxVQUFJRSxJQUFJLEdBQUdSLElBQUksQ0FBQ1MsUUFBaEI7O0FBQ0EsVUFBSUQsSUFBSixFQUFVO0FBQ04sYUFBSyxJQUFJVixFQUFULElBQWNVLElBQWQsRUFBb0I7QUFDaEJBLFVBQUFBLElBQUksQ0FBQ1YsRUFBRCxDQUFKLEdBQVVkLEVBQUUsQ0FBQ3VCLElBQUgsQ0FBUUosS0FBUixDQUFjLElBQWQsRUFBb0JLLElBQUksQ0FBQ1YsRUFBRCxDQUF4QixDQUFWO0FBQ0g7QUFDSjs7QUFFRCxVQUFJWSxRQUFRLEdBQUdWLElBQUksQ0FBQ1UsUUFBcEI7O0FBQ0EsVUFBSUEsUUFBSixFQUFjO0FBQ1YsYUFBSyxJQUFJWixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHWSxRQUFRLENBQUNYLE1BQTdCLEVBQXFDRCxHQUFDLEVBQXRDLEVBQTBDO0FBQ3RDWSxVQUFBQSxRQUFRLENBQUNaLEdBQUQsQ0FBUixHQUFjTCxLQUFLLENBQUNpQixRQUFRLENBQUNaLEdBQUQsQ0FBVCxDQUFuQjtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBNURnQixDQUFULENBQVo7QUErREFkLEVBQUUsQ0FBQ0QsS0FBSCxHQUFXNEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0IsS0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmxldCBNb2RlbCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTW9kZWwnLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3Jvb3ROb2RlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfbm9kZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3ByZWNvbXB1dGVKb2ludE1hdHJpeDogZmFsc2UsXG5cbiAgICAgICAgbm9kZXM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByb290Tm9kZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJlY29tcHV0ZUpvaW50TWF0cml4OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmVjb21wdXRlSm9pbnRNYXRyaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5fbm9kZXM7XG4gICAgICAgIHRoaXMuX3Jvb3ROb2RlID0gbm9kZXNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBub2RlLnBvc2l0aW9uID0gY2MudjMuYXBwbHkodGhpcywgbm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAgICBub2RlLnNjYWxlID0gY2MudjMuYXBwbHkodGhpcywgbm9kZS5zY2FsZSk7XG4gICAgICAgICAgICBub2RlLnF1YXQgPSBjYy5xdWF0LmFwcGx5KHRoaXMsIG5vZGUucXVhdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChub2RlLnVuaXF1ZUJpbmRQb3NlKSB7XG4gICAgICAgICAgICAgICAgbm9kZS51bmlxdWVCaW5kUG9zZSA9IGNjLm1hdDQuYXBwbHkodGhpcywgbm9kZS51bmlxdWVCaW5kUG9zZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwb3NlID0gbm9kZS5iaW5kcG9zZTtcbiAgICAgICAgICAgIGlmIChwb3NlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwb3NlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2VbaV0gPSBjYy5tYXQ0LmFwcGx5KHRoaXMsIHBvc2VbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baV0gPSBub2Rlc1tjaGlsZHJlbltpXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLk1vZGVsID0gbW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcbiJdfQ==