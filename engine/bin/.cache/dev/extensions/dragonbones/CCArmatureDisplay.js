
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/CCArmatureDisplay.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

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
var EventTarget = require('../../cocos2d/core/event/event-target');

dragonBones.CCArmatureDisplay = cc.Class({
  name: 'dragonBones.CCArmatureDisplay',
  properties: {
    // adapt old api
    node: {
      get: function get() {
        return this;
      }
    }
  },
  ctor: function ctor() {
    this._eventTarget = new EventTarget();
  },
  setEventTarget: function setEventTarget(eventTarget) {
    this._eventTarget = eventTarget;
  },
  getRootDisplay: function getRootDisplay() {
    var parentSlot = this._armature._parent;

    if (!parentSlot) {
      return this;
    }

    var slot;

    while (parentSlot) {
      slot = parentSlot;
      parentSlot = parentSlot._armature._parent;
    }

    return slot._armature.getDisplay();
  },
  convertToRootSpace: function convertToRootSpace(pos) {
    var slot = this._armature._parent;

    if (!slot) {
      return pos;
    }

    slot.updateWorldMatrix();
    var worldMatrix = slot._worldMatrix;
    var worldMatrixm = worldMatrix.m;
    var newPos = cc.v2(0, 0);
    newPos.x = pos.x * worldMatrixm[0] + pos.y * worldMatrixm[4] + worldMatrixm[12];
    newPos.y = pos.x * worldMatrixm[1] + pos.y * worldMatrixm[5] + worldMatrixm[13];
    return newPos;
  },
  convertToWorldSpace: function convertToWorldSpace(point) {
    var newPos = this.convertToRootSpace(point);
    var ccNode = this.getRootNode();
    var finalPos = ccNode.convertToWorldSpaceAR(newPos);
    return finalPos;
  },
  getRootNode: function getRootNode() {
    var rootDisplay = this.getRootDisplay();
    return rootDisplay && rootDisplay._ccNode;
  },
  ////////////////////////////////////
  // dragonbones api
  dbInit: function dbInit(armature) {
    this._armature = armature;
  },
  dbClear: function dbClear() {
    this._armature = null;
  },
  dbUpdate: function dbUpdate() {},
  advanceTimeBySelf: function advanceTimeBySelf(on) {
    this.shouldAdvanced = !!on;
  },
  hasDBEventListener: function hasDBEventListener(type) {
    return this._eventTarget.hasEventListener(type);
  },
  addDBEventListener: function addDBEventListener(type, listener, target) {
    this._eventTarget.on(type, listener, target);
  },
  removeDBEventListener: function removeDBEventListener(type, listener, target) {
    this._eventTarget.off(type, listener, target);
  },
  dispatchDBEvent: function dispatchDBEvent(type, eventObject) {
    this._eventTarget.emit(type, eventObject);
  } ////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXJtYXR1cmVEaXNwbGF5LmpzIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicmVxdWlyZSIsImRyYWdvbkJvbmVzIiwiQ0NBcm1hdHVyZURpc3BsYXkiLCJjYyIsIkNsYXNzIiwibmFtZSIsInByb3BlcnRpZXMiLCJub2RlIiwiZ2V0IiwiY3RvciIsIl9ldmVudFRhcmdldCIsInNldEV2ZW50VGFyZ2V0IiwiZXZlbnRUYXJnZXQiLCJnZXRSb290RGlzcGxheSIsInBhcmVudFNsb3QiLCJfYXJtYXR1cmUiLCJfcGFyZW50Iiwic2xvdCIsImdldERpc3BsYXkiLCJjb252ZXJ0VG9Sb290U3BhY2UiLCJwb3MiLCJ1cGRhdGVXb3JsZE1hdHJpeCIsIndvcmxkTWF0cml4IiwiX3dvcmxkTWF0cml4Iiwid29ybGRNYXRyaXhtIiwibSIsIm5ld1BvcyIsInYyIiwieCIsInkiLCJjb252ZXJ0VG9Xb3JsZFNwYWNlIiwicG9pbnQiLCJjY05vZGUiLCJnZXRSb290Tm9kZSIsImZpbmFsUG9zIiwiY29udmVydFRvV29ybGRTcGFjZUFSIiwicm9vdERpc3BsYXkiLCJfY2NOb2RlIiwiZGJJbml0IiwiYXJtYXR1cmUiLCJkYkNsZWFyIiwiZGJVcGRhdGUiLCJhZHZhbmNlVGltZUJ5U2VsZiIsIm9uIiwic2hvdWxkQWR2YW5jZWQiLCJoYXNEQkV2ZW50TGlzdGVuZXIiLCJ0eXBlIiwiaGFzRXZlbnRMaXN0ZW5lciIsImFkZERCRXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwidGFyZ2V0IiwicmVtb3ZlREJFdmVudExpc3RlbmVyIiwib2ZmIiwiZGlzcGF0Y2hEQkV2ZW50IiwiZXZlbnRPYmplY3QiLCJlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxJQUFJQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyx1Q0FBRCxDQUF6Qjs7QUFFQUMsV0FBVyxDQUFDQyxpQkFBWixHQUFnQ0MsRUFBRSxDQUFDQyxLQUFI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QztBQTZFckNDLEVBQUFBLGlCQTdFcUMsNkJBNkVqQkMsRUE3RWlCLEVBNkViO0FBQ3BCLFNBQUtDLGNBQUwsR0FBc0IsQ0FBQyxDQUFDRCxFQUF4QjtBQUNILEdBL0VvQztBQWlGckNFLEVBQUFBLGtCQWpGcUMsOEJBaUZqQkMsSUFqRmlCLEVBaUZYO0FBQ3RCLFdBQU8sS0FBS3BDLFlBQUwsQ0FBa0JxQyxnQkFBbEIsQ0FBbUNELElBQW5DLENBQVA7QUFDSCxHQW5Gb0M7QUFxRnJDRSxFQUFBQSxrQkFyRnFDLDhCQXFGakJGLElBckZpQixFQXFGWEcsUUFyRlcsRUFxRkRDLE1BckZDLEVBcUZPO0FBQ3hDLFNBQUt4QyxZQUFMLENBQWtCaUMsRUFBbEIsQ0FBcUJHLElBQXJCLEVBQTJCRyxRQUEzQixFQUFxQ0MsTUFBckM7QUFDSCxHQXZGb0M7QUF5RnJDQyxFQUFBQSxxQkF6RnFDLGlDQXlGZEwsSUF6RmMsRUF5RlJHLFFBekZRLEVBeUZFQyxNQXpGRixFQXlGVTtBQUMzQyxTQUFLeEMsWUFBTCxDQUFrQjBDLEdBQWxCLENBQXNCTixJQUF0QixFQUE0QkcsUUFBNUIsRUFBc0NDLE1BQXRDO0FBQ0gsR0EzRm9DO0FBNkZyQ0csRUFBQUEsZUE3RnFDLDJCQTZGbkJQLElBN0ZtQixFQTZGYlEsV0E3RmEsRUE2RkE7QUFDakMsU0FBSzVDLFlBQUwsQ0FBa0I2QyxJQUFsQixDQUF1QlQsSUFBdkIsRUFBNkJRLFdBQTdCO0FBQ0gsR0EvRm9DLENBZ0dyQzs7QUFoR3FDLENBQVQsQ0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmxldCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9ldmVudC9ldmVudC10YXJnZXQnKTtcblxuZHJhZ29uQm9uZXMuQ0NBcm1hdHVyZURpc3BsYXkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2RyYWdvbkJvbmVzLkNDQXJtYXR1cmVEaXNwbGF5JyxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gYWRhcHQgb2xkIGFwaVxuICAgICAgICBub2RlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQgPSBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgICB9LFxuXG4gICAgc2V0RXZlbnRUYXJnZXQgKGV2ZW50VGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0ID0gZXZlbnRUYXJnZXQ7XG4gICAgfSxcblxuICAgIGdldFJvb3REaXNwbGF5ICgpIHtcbiAgICAgICAgdmFyIHBhcmVudFNsb3QgPSB0aGlzLl9hcm1hdHVyZS5fcGFyZW50O1xuICAgICAgICBpZiAoIXBhcmVudFNsb3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXIgc2xvdDtcbiAgICAgICAgd2hpbGUgKHBhcmVudFNsb3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNsb3QgPSBwYXJlbnRTbG90O1xuICAgICAgICAgICAgcGFyZW50U2xvdCA9IHBhcmVudFNsb3QuX2FybWF0dXJlLl9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNsb3QuX2FybWF0dXJlLmdldERpc3BsYXkoKTtcbiAgICB9LFxuXG4gICAgY29udmVydFRvUm9vdFNwYWNlIChwb3MpIHtcbiAgICAgICAgdmFyIHNsb3QgPSB0aGlzLl9hcm1hdHVyZS5fcGFyZW50O1xuICAgICAgICBpZiAoIXNsb3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgIH1cbiAgICAgICAgc2xvdC51cGRhdGVXb3JsZE1hdHJpeCgpO1xuXG4gICAgICAgIGxldCB3b3JsZE1hdHJpeCA9IHNsb3QuX3dvcmxkTWF0cml4O1xuICAgICAgICBsZXQgd29ybGRNYXRyaXhtID0gd29ybGRNYXRyaXgubTtcbiAgICAgICAgbGV0IG5ld1BvcyA9IGNjLnYyKDAsMCk7XG4gICAgICAgIG5ld1Bvcy54ID0gcG9zLnggKiB3b3JsZE1hdHJpeG1bMF0gKyBwb3MueSAqIHdvcmxkTWF0cml4bVs0XSArIHdvcmxkTWF0cml4bVsxMl07XG4gICAgICAgIG5ld1Bvcy55ID0gcG9zLnggKiB3b3JsZE1hdHJpeG1bMV0gKyBwb3MueSAqIHdvcmxkTWF0cml4bVs1XSArIHdvcmxkTWF0cml4bVsxM107XG4gICAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfSxcblxuICAgIGNvbnZlcnRUb1dvcmxkU3BhY2UgKHBvaW50KSB7XG4gICAgICAgIHZhciBuZXdQb3MgPSB0aGlzLmNvbnZlcnRUb1Jvb3RTcGFjZShwb2ludCk7XG4gICAgICAgIHZhciBjY05vZGUgPSB0aGlzLmdldFJvb3ROb2RlKCk7XG4gICAgICAgIHZhciBmaW5hbFBvcyA9IGNjTm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIobmV3UG9zKTtcbiAgICAgICAgcmV0dXJuIGZpbmFsUG9zO1xuICAgIH0sXG5cbiAgICBnZXRSb290Tm9kZSAoKSB7XG4gICAgICAgIHZhciByb290RGlzcGxheSA9IHRoaXMuZ2V0Um9vdERpc3BsYXkoKTtcbiAgICAgICAgcmV0dXJuIHJvb3REaXNwbGF5ICYmIHJvb3REaXNwbGF5Ll9jY05vZGU7XG4gICAgfSxcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIGRyYWdvbmJvbmVzIGFwaVxuICAgIGRiSW5pdCAoYXJtYXR1cmUpIHtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBhcm1hdHVyZTtcbiAgICB9LFxuXG4gICAgZGJDbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX2FybWF0dXJlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgZGJVcGRhdGUgKCkge1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgYWR2YW5jZVRpbWVCeVNlbGYgIChvbikge1xuICAgICAgICB0aGlzLnNob3VsZEFkdmFuY2VkID0gISFvbjtcbiAgICB9LFxuXG4gICAgaGFzREJFdmVudExpc3RlbmVyICh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudFRhcmdldC5oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgIH0sXG5cbiAgICBhZGREQkV2ZW50TGlzdGVuZXIgKHR5cGUsIGxpc3RlbmVyLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQub24odHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIHJlbW92ZURCRXZlbnRMaXN0ZW5lciAodHlwZSwgbGlzdGVuZXIsIHRhcmdldCkge1xuICAgICAgICB0aGlzLl9ldmVudFRhcmdldC5vZmYodHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoREJFdmVudCAgKHR5cGUsIGV2ZW50T2JqZWN0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0LmVtaXQodHlwZSwgZXZlbnRPYmplY3QpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufSk7XG4iXX0=