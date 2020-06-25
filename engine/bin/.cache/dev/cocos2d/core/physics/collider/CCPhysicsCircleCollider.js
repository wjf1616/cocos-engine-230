
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/collider/CCPhysicsCircleCollider.js';
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
 * @class PhysicsCircleCollider
 * @extends PhysicsCollider
 * @uses Collider.Circle
 */


var PhysicsCircleCollider = cc.Class({
  name: 'cc.PhysicsCircleCollider',
  "extends": cc.PhysicsCollider,
  mixins: [cc.Collider.Circle],
  editor: {
    menu: CC_EDITOR && 'i18n:MAIN_MENU.component.physics/Collider/Circle',
    requireComponent: cc.RigidBody
  },
  _createShape: function _createShape(scale) {
    var scaleX = Math.abs(scale.x);
    var scaleY = Math.abs(scale.y);
    var offsetX = this.offset.x / PTM_RATIO * scaleX;
    var offsetY = this.offset.y / PTM_RATIO * scaleY;
    var shape = new b2.CircleShape();
    shape.m_radius = this.radius / PTM_RATIO * scaleX;
    shape.m_p = new b2.Vec2(offsetX, offsetY);
    return shape;
  }
});
cc.PhysicsCircleCollider = module.exports = PhysicsCircleCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc0NpcmNsZUNvbGxpZGVyLmpzIl0sIm5hbWVzIjpbIlBUTV9SQVRJTyIsInJlcXVpcmUiLCJQaHlzaWNzQ2lyY2xlQ29sbGlkZXIiLCJjYyIsIkNsYXNzIiwibmFtZSIsIlBoeXNpY3NDb2xsaWRlciIsIm1peGlucyIsIkNvbGxpZGVyIiwiQ2lyY2xlIiwiZWRpdG9yIiwibWVudSIsIkNDX0VESVRPUiIsInJlcXVpcmVDb21wb25lbnQiLCJSaWdpZEJvZHkiLCJfY3JlYXRlU2hhcGUiLCJzY2FsZSIsInNjYWxlWCIsIk1hdGgiLCJhYnMiLCJ4Iiwic2NhbGVZIiwieSIsIm9mZnNldFgiLCJvZmZzZXQiLCJvZmZzZXRZIiwic2hhcGUiLCJiMiIsIkNpcmNsZVNoYXBlIiwibV9yYWRpdXMiLCJyYWRpdXMiLCJtX3AiLCJWZWMyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDO0FBRUE7Ozs7Ozs7QUFLQSxJQUFJRSxxQkFBcUIsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDakNDLEVBQUFBLElBQUksRUFBRSwwQkFEMkI7QUFFakMsYUFBU0YsRUFBRSxDQUFDRyxlQUZxQjtBQUdqQ0MsRUFBQUEsTUFBTSxFQUFFLENBQUNKLEVBQUUsQ0FBQ0ssUUFBSCxDQUFZQyxNQUFiLENBSHlCO0FBS2pDQyxFQUFBQSxNQUFNLEVBQUU7QUFDSkMsSUFBQUEsSUFBSSxFQUFFQyxTQUFTLElBQUksa0RBRGY7QUFFSkMsSUFBQUEsZ0JBQWdCLEVBQUVWLEVBQUUsQ0FBQ1c7QUFGakIsR0FMeUI7QUFVakNDLEVBQUFBLFlBQVksRUFBRSxzQkFBVUMsS0FBVixFQUFpQjtBQUMzQixRQUFJQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxLQUFLLENBQUNJLENBQWYsQ0FBYjtBQUNBLFFBQUlDLE1BQU0sR0FBR0gsSUFBSSxDQUFDQyxHQUFMLENBQVNILEtBQUssQ0FBQ00sQ0FBZixDQUFiO0FBQ0EsUUFBSUMsT0FBTyxHQUFHLEtBQUtDLE1BQUwsQ0FBWUosQ0FBWixHQUFjcEIsU0FBZCxHQUEwQmlCLE1BQXhDO0FBQ0EsUUFBSVEsT0FBTyxHQUFHLEtBQUtELE1BQUwsQ0FBWUYsQ0FBWixHQUFjdEIsU0FBZCxHQUEwQnFCLE1BQXhDO0FBRUEsUUFBSUssS0FBSyxHQUFHLElBQUlDLEVBQUUsQ0FBQ0MsV0FBUCxFQUFaO0FBQ0FGLElBQUFBLEtBQUssQ0FBQ0csUUFBTixHQUFpQixLQUFLQyxNQUFMLEdBQWM5QixTQUFkLEdBQTBCaUIsTUFBM0M7QUFDQVMsSUFBQUEsS0FBSyxDQUFDSyxHQUFOLEdBQVksSUFBSUosRUFBRSxDQUFDSyxJQUFQLENBQVlULE9BQVosRUFBcUJFLE9BQXJCLENBQVo7QUFFQSxXQUFPQyxLQUFQO0FBQ0g7QUFyQmdDLENBQVQsQ0FBNUI7QUF3QkF2QixFQUFFLENBQUNELHFCQUFILEdBQTJCK0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCaEMscUJBQTVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG5cbi8qKlxuICogQGNsYXNzIFBoeXNpY3NDaXJjbGVDb2xsaWRlclxuICogQGV4dGVuZHMgUGh5c2ljc0NvbGxpZGVyXG4gKiBAdXNlcyBDb2xsaWRlci5DaXJjbGVcbiAqL1xudmFyIFBoeXNpY3NDaXJjbGVDb2xsaWRlciA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUGh5c2ljc0NpcmNsZUNvbGxpZGVyJyxcbiAgICBleHRlbmRzOiBjYy5QaHlzaWNzQ29sbGlkZXIsXG4gICAgbWl4aW5zOiBbY2MuQ29sbGlkZXIuQ2lyY2xlXSxcblxuICAgIGVkaXRvcjoge1xuICAgICAgICBtZW51OiBDQ19FRElUT1IgJiYgJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0NvbGxpZGVyL0NpcmNsZScsXG4gICAgICAgIHJlcXVpcmVDb21wb25lbnQ6IGNjLlJpZ2lkQm9keVxuICAgIH0sXG5cbiAgICBfY3JlYXRlU2hhcGU6IGZ1bmN0aW9uIChzY2FsZSkge1xuICAgICAgICB2YXIgc2NhbGVYID0gTWF0aC5hYnMoc2NhbGUueCk7XG4gICAgICAgIHZhciBzY2FsZVkgPSBNYXRoLmFicyhzY2FsZS55KTtcbiAgICAgICAgdmFyIG9mZnNldFggPSB0aGlzLm9mZnNldC54L1BUTV9SQVRJTyAqIHNjYWxlWDtcbiAgICAgICAgdmFyIG9mZnNldFkgPSB0aGlzLm9mZnNldC55L1BUTV9SQVRJTyAqIHNjYWxlWTtcblxuICAgICAgICB2YXIgc2hhcGUgPSBuZXcgYjIuQ2lyY2xlU2hhcGUoKTtcbiAgICAgICAgc2hhcGUubV9yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIFBUTV9SQVRJTyAqIHNjYWxlWDtcbiAgICAgICAgc2hhcGUubV9wID0gbmV3IGIyLlZlYzIob2Zmc2V0WCwgb2Zmc2V0WSk7XG5cbiAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgIH1cbn0pO1xuXG5jYy5QaHlzaWNzQ2lyY2xlQ29sbGlkZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3NDaXJjbGVDb2xsaWRlcjtcbiJdfQ==