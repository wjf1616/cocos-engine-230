
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/collider/CCPhysicsBoxCollider.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;
/**
 * @class PhysicsBoxCollider
 * @extends PhysicsCollider
 * @uses Collider.Box
 */


var PhysicsBoxCollider = cc.Class({
  name: 'cc.PhysicsBoxCollider',
  "extends": cc.PhysicsCollider,
  mixins: [cc.Collider.Box],
  editor: {
    menu: CC_EDITOR && 'i18n:MAIN_MENU.component.physics/Collider/Box',
    requireComponent: cc.RigidBody
  },
  _createShape: function _createShape(scale) {
    var scaleX = Math.abs(scale.x);
    var scaleY = Math.abs(scale.y);
    var width = this.size.width / 2 / PTM_RATIO * scaleX;
    var height = this.size.height / 2 / PTM_RATIO * scaleY;
    var offsetX = this.offset.x / PTM_RATIO * scaleX;
    var offsetY = this.offset.y / PTM_RATIO * scaleY;
    var shape = new b2.PolygonShape();
    shape.SetAsBox(width, height, new b2.Vec2(offsetX, offsetY), 0);
    return shape;
  }
});
cc.PhysicsBoxCollider = module.exports = PhysicsBoxCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc0JveENvbGxpZGVyLmpzIl0sIm5hbWVzIjpbIlBUTV9SQVRJTyIsInJlcXVpcmUiLCJQaHlzaWNzQm94Q29sbGlkZXIiLCJjYyIsIkNsYXNzIiwibmFtZSIsIlBoeXNpY3NDb2xsaWRlciIsIm1peGlucyIsIkNvbGxpZGVyIiwiQm94IiwiZWRpdG9yIiwibWVudSIsIkNDX0VESVRPUiIsInJlcXVpcmVDb21wb25lbnQiLCJSaWdpZEJvZHkiLCJfY3JlYXRlU2hhcGUiLCJzY2FsZSIsInNjYWxlWCIsIk1hdGgiLCJhYnMiLCJ4Iiwic2NhbGVZIiwieSIsIndpZHRoIiwic2l6ZSIsImhlaWdodCIsIm9mZnNldFgiLCJvZmZzZXQiLCJvZmZzZXRZIiwic2hhcGUiLCJiMiIsIlBvbHlnb25TaGFwZSIsIlNldEFzQm94IiwiVmVjMiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCRCxTQUE3QztBQUVBOzs7Ozs7O0FBS0EsSUFBSUUsa0JBQWtCLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzlCQyxFQUFBQSxJQUFJLEVBQUUsdUJBRHdCO0FBRTlCLGFBQVNGLEVBQUUsQ0FBQ0csZUFGa0I7QUFHOUJDLEVBQUFBLE1BQU0sRUFBRSxDQUFDSixFQUFFLENBQUNLLFFBQUgsQ0FBWUMsR0FBYixDQUhzQjtBQUs5QkMsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLElBQUksRUFBRUMsU0FBUyxJQUFJLCtDQURmO0FBRUpDLElBQUFBLGdCQUFnQixFQUFFVixFQUFFLENBQUNXO0FBRmpCLEdBTHNCO0FBVTlCQyxFQUFBQSxZQUFZLEVBQUUsc0JBQVVDLEtBQVYsRUFBaUI7QUFDM0IsUUFBSUMsTUFBTSxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsS0FBSyxDQUFDSSxDQUFmLENBQWI7QUFDQSxRQUFJQyxNQUFNLEdBQUdILElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxLQUFLLENBQUNNLENBQWYsQ0FBYjtBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxJQUFMLENBQVVELEtBQVYsR0FBZ0IsQ0FBaEIsR0FBa0J2QixTQUFsQixHQUE4QmlCLE1BQTFDO0FBQ0EsUUFBSVEsTUFBTSxHQUFHLEtBQUtELElBQUwsQ0FBVUMsTUFBVixHQUFpQixDQUFqQixHQUFtQnpCLFNBQW5CLEdBQStCcUIsTUFBNUM7QUFDQSxRQUFJSyxPQUFPLEdBQUcsS0FBS0MsTUFBTCxDQUFZUCxDQUFaLEdBQWNwQixTQUFkLEdBQXlCaUIsTUFBdkM7QUFDQSxRQUFJVyxPQUFPLEdBQUcsS0FBS0QsTUFBTCxDQUFZTCxDQUFaLEdBQWN0QixTQUFkLEdBQXlCcUIsTUFBdkM7QUFFQSxRQUFJUSxLQUFLLEdBQUcsSUFBSUMsRUFBRSxDQUFDQyxZQUFQLEVBQVo7QUFDQUYsSUFBQUEsS0FBSyxDQUFDRyxRQUFOLENBQWVULEtBQWYsRUFBc0JFLE1BQXRCLEVBQThCLElBQUlLLEVBQUUsQ0FBQ0csSUFBUCxDQUFZUCxPQUFaLEVBQXFCRSxPQUFyQixDQUE5QixFQUE2RCxDQUE3RDtBQUNBLFdBQU9DLEtBQVA7QUFDSDtBQXJCNkIsQ0FBVCxDQUF6QjtBQXdCQTFCLEVBQUUsQ0FBQ0Qsa0JBQUgsR0FBd0JnQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJqQyxrQkFBekMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcblxuLyoqXG4gKiBAY2xhc3MgUGh5c2ljc0JveENvbGxpZGVyXG4gKiBAZXh0ZW5kcyBQaHlzaWNzQ29sbGlkZXJcbiAqIEB1c2VzIENvbGxpZGVyLkJveFxuICovXG52YXIgUGh5c2ljc0JveENvbGxpZGVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5QaHlzaWNzQm94Q29sbGlkZXInLFxuICAgIGV4dGVuZHM6IGNjLlBoeXNpY3NDb2xsaWRlcixcbiAgICBtaXhpbnM6IFtjYy5Db2xsaWRlci5Cb3hdLFxuXG4gICAgZWRpdG9yOiB7XG4gICAgICAgIG1lbnU6IENDX0VESVRPUiAmJiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvQ29sbGlkZXIvQm94JyxcbiAgICAgICAgcmVxdWlyZUNvbXBvbmVudDogY2MuUmlnaWRCb2R5XG4gICAgfSxcblxuICAgIF9jcmVhdGVTaGFwZTogZnVuY3Rpb24gKHNjYWxlKSB7XG4gICAgICAgIHZhciBzY2FsZVggPSBNYXRoLmFicyhzY2FsZS54KTtcbiAgICAgICAgdmFyIHNjYWxlWSA9IE1hdGguYWJzKHNjYWxlLnkpO1xuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLnNpemUud2lkdGgvMi9QVE1fUkFUSU8gKiBzY2FsZVg7XG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLnNpemUuaGVpZ2h0LzIvUFRNX1JBVElPICogc2NhbGVZO1xuICAgICAgICB2YXIgb2Zmc2V0WCA9IHRoaXMub2Zmc2V0LngvUFRNX1JBVElPICpzY2FsZVg7XG4gICAgICAgIHZhciBvZmZzZXRZID0gdGhpcy5vZmZzZXQueS9QVE1fUkFUSU8gKnNjYWxlWTtcblxuICAgICAgICB2YXIgc2hhcGUgPSBuZXcgYjIuUG9seWdvblNoYXBlKCk7XG4gICAgICAgIHNoYXBlLlNldEFzQm94KHdpZHRoLCBoZWlnaHQsIG5ldyBiMi5WZWMyKG9mZnNldFgsIG9mZnNldFkpLCAwKTtcbiAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgIH1cbn0pO1xuXG5jYy5QaHlzaWNzQm94Q29sbGlkZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3NCb3hDb2xsaWRlcjtcbiJdfQ==