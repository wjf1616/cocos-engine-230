
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/collider/CCPhysicsChainCollider.js';
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
 * @class PhysicsChainCollider
 * @extends PolygonCollider
 */


var PhysicsChainCollider = cc.Class({
  name: 'cc.PhysicsChainCollider',
  "extends": cc.PhysicsCollider,
  editor: {
    menu: CC_EDITOR && 'i18n:MAIN_MENU.component.physics/Collider/Chain',
    inspector: CC_EDITOR && 'packages://inspector/inspectors/comps/physics/points-base-collider.js',
    requireComponent: cc.RigidBody
  },
  properties: {
    /**
     * !#en Whether the chain is loop
     * !#zh 链条是否首尾相连
     * @property loop
     * @type {Boolean}
     */
    loop: false,

    /**
     * !#en Chain points
     * !#zh 链条顶点数组
     * @property points
     * @type {Vec2[]}
     */
    points: {
      "default": function _default() {
        return [cc.v2(-50, 0), cc.v2(50, 0)];
      },
      type: [cc.Vec2]
    },
    threshold: {
      "default": 1,
      serializable: false,
      visible: false
    }
  },
  _createShape: function _createShape(scale) {
    var shape = new b2.ChainShape();
    var points = this.points;
    var vertices = [];

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      vertices.push(new b2.Vec2(p.x / PTM_RATIO * scale.x, p.y / PTM_RATIO * scale.y));
    }

    if (this.loop) {
      shape.CreateLoop(vertices, vertices.length);
    } else {
      shape.CreateChain(vertices, vertices.length);
    }

    return shape;
  },
  resetInEditor: CC_EDITOR && function () {
    this.resetPointsByContour();
  },
  resetPointsByContour: CC_EDITOR && function () {
    var PhysicsUtils = Editor.require('scene://utils/physics');

    PhysicsUtils.resetPoints(this, {
      threshold: this.threshold,
      loop: this.loop
    });
  }
});
cc.PhysicsChainCollider = module.exports = PhysicsChainCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc0NoYWluQ29sbGlkZXIuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsIlBoeXNpY3NDaGFpbkNvbGxpZGVyIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJQaHlzaWNzQ29sbGlkZXIiLCJlZGl0b3IiLCJtZW51IiwiQ0NfRURJVE9SIiwiaW5zcGVjdG9yIiwicmVxdWlyZUNvbXBvbmVudCIsIlJpZ2lkQm9keSIsInByb3BlcnRpZXMiLCJsb29wIiwicG9pbnRzIiwidjIiLCJ0eXBlIiwiVmVjMiIsInRocmVzaG9sZCIsInNlcmlhbGl6YWJsZSIsInZpc2libGUiLCJfY3JlYXRlU2hhcGUiLCJzY2FsZSIsInNoYXBlIiwiYjIiLCJDaGFpblNoYXBlIiwidmVydGljZXMiLCJpIiwibGVuZ3RoIiwicCIsInB1c2giLCJ4IiwieSIsIkNyZWF0ZUxvb3AiLCJDcmVhdGVDaGFpbiIsInJlc2V0SW5FZGl0b3IiLCJyZXNldFBvaW50c0J5Q29udG91ciIsIlBoeXNpY3NVdGlscyIsIkVkaXRvciIsInJlc2V0UG9pbnRzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDO0FBRUE7Ozs7OztBQUlBLElBQUlFLG9CQUFvQixHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNoQ0MsRUFBQUEsSUFBSSxFQUFFLHlCQUQwQjtBQUVoQyxhQUFTRixFQUFFLENBQUNHLGVBRm9CO0FBSWhDQyxFQUFBQSxNQUFNLEVBQUU7QUFDSkMsSUFBQUEsSUFBSSxFQUFFQyxTQUFTLElBQUksaURBRGY7QUFFSkMsSUFBQUEsU0FBUyxFQUFFRCxTQUFTLElBQUksdUVBRnBCO0FBR0pFLElBQUFBLGdCQUFnQixFQUFFUixFQUFFLENBQUNTO0FBSGpCLEdBSndCO0FBVWhDQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjs7Ozs7O0FBTUFDLElBQUFBLElBQUksRUFBRSxLQVBFOztBQVNSOzs7Ozs7QUFNQUMsSUFBQUEsTUFBTSxFQUFFO0FBQ0osaUJBQVMsb0JBQVk7QUFDaEIsZUFBTyxDQUFDWixFQUFFLENBQUNhLEVBQUgsQ0FBTSxDQUFDLEVBQVAsRUFBVyxDQUFYLENBQUQsRUFBZ0JiLEVBQUUsQ0FBQ2EsRUFBSCxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQWhCLENBQVA7QUFDSixPQUhHO0FBSUpDLE1BQUFBLElBQUksRUFBRSxDQUFDZCxFQUFFLENBQUNlLElBQUo7QUFKRixLQWZBO0FBc0JSQyxJQUFBQSxTQUFTLEVBQUU7QUFDUCxpQkFBUyxDQURGO0FBRVBDLE1BQUFBLFlBQVksRUFBRSxLQUZQO0FBR1BDLE1BQUFBLE9BQU8sRUFBRTtBQUhGO0FBdEJILEdBVm9CO0FBdUNoQ0MsRUFBQUEsWUFBWSxFQUFFLHNCQUFVQyxLQUFWLEVBQWlCO0FBQzNCLFFBQUlDLEtBQUssR0FBRyxJQUFJQyxFQUFFLENBQUNDLFVBQVAsRUFBWjtBQUVBLFFBQUlYLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjtBQUNBLFFBQUlZLFFBQVEsR0FBRyxFQUFmOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2IsTUFBTSxDQUFDYyxNQUEzQixFQUFtQ0QsQ0FBQyxFQUFwQyxFQUF3QztBQUNwQyxVQUFJRSxDQUFDLEdBQUdmLE1BQU0sQ0FBQ2EsQ0FBRCxDQUFkO0FBQ0FELE1BQUFBLFFBQVEsQ0FBQ0ksSUFBVCxDQUFlLElBQUlOLEVBQUUsQ0FBQ1AsSUFBUCxDQUFZWSxDQUFDLENBQUNFLENBQUYsR0FBSWhDLFNBQUosR0FBY3VCLEtBQUssQ0FBQ1MsQ0FBaEMsRUFBbUNGLENBQUMsQ0FBQ0csQ0FBRixHQUFJakMsU0FBSixHQUFjdUIsS0FBSyxDQUFDVSxDQUF2RCxDQUFmO0FBQ0g7O0FBRUQsUUFBSSxLQUFLbkIsSUFBVCxFQUFlO0FBQ1hVLE1BQUFBLEtBQUssQ0FBQ1UsVUFBTixDQUFpQlAsUUFBakIsRUFBMkJBLFFBQVEsQ0FBQ0UsTUFBcEM7QUFDSCxLQUZELE1BR0s7QUFDREwsTUFBQUEsS0FBSyxDQUFDVyxXQUFOLENBQWtCUixRQUFsQixFQUE0QkEsUUFBUSxDQUFDRSxNQUFyQztBQUNIOztBQUNELFdBQU9MLEtBQVA7QUFDSCxHQXhEK0I7QUEwRGhDWSxFQUFBQSxhQUFhLEVBQUUzQixTQUFTLElBQUksWUFBWTtBQUNwQyxTQUFLNEIsb0JBQUw7QUFDSCxHQTVEK0I7QUE4RGhDQSxFQUFBQSxvQkFBb0IsRUFBRTVCLFNBQVMsSUFBSSxZQUFZO0FBQzNDLFFBQUk2QixZQUFZLEdBQUdDLE1BQU0sQ0FBQ3RDLE9BQVAsQ0FBZSx1QkFBZixDQUFuQjs7QUFDQXFDLElBQUFBLFlBQVksQ0FBQ0UsV0FBYixDQUF5QixJQUF6QixFQUErQjtBQUFDckIsTUFBQUEsU0FBUyxFQUFFLEtBQUtBLFNBQWpCO0FBQTRCTCxNQUFBQSxJQUFJLEVBQUUsS0FBS0E7QUFBdkMsS0FBL0I7QUFDSDtBQWpFK0IsQ0FBVCxDQUEzQjtBQW9FQVgsRUFBRSxDQUFDRCxvQkFBSCxHQUEwQnVDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhDLG9CQUEzQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIFBUTV9SQVRJTyA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuUFRNX1JBVElPO1xuXG4vKipcbiAqIEBjbGFzcyBQaHlzaWNzQ2hhaW5Db2xsaWRlclxuICogQGV4dGVuZHMgUG9seWdvbkNvbGxpZGVyXG4gKi9cbnZhciBQaHlzaWNzQ2hhaW5Db2xsaWRlciA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUGh5c2ljc0NoYWluQ29sbGlkZXInLFxuICAgIGV4dGVuZHM6IGNjLlBoeXNpY3NDb2xsaWRlcixcblxuICAgIGVkaXRvcjoge1xuICAgICAgICBtZW51OiBDQ19FRElUT1IgJiYgJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0NvbGxpZGVyL0NoYWluJyxcbiAgICAgICAgaW5zcGVjdG9yOiBDQ19FRElUT1IgJiYgJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvcGh5c2ljcy9wb2ludHMtYmFzZS1jb2xsaWRlci5qcycsXG4gICAgICAgIHJlcXVpcmVDb21wb25lbnQ6IGNjLlJpZ2lkQm9keVxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgdGhlIGNoYWluIGlzIGxvb3BcbiAgICAgICAgICogISN6aCDpk77mnaHmmK/lkKbpppblsL7nm7jov55cbiAgICAgICAgICogQHByb3BlcnR5IGxvb3BcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBsb29wOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDaGFpbiBwb2ludHNcbiAgICAgICAgICogISN6aCDpk77mnaHpobbngrnmlbDnu4RcbiAgICAgICAgICogQHByb3BlcnR5IHBvaW50c1xuICAgICAgICAgKiBAdHlwZSB7VmVjMltdfVxuICAgICAgICAgKi9cbiAgICAgICAgcG9pbnRzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBbY2MudjIoLTUwLCAwKSwgY2MudjIoNTAsIDApXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBbY2MuVmVjMl1cbiAgICAgICAgfSxcblxuICAgICAgICB0aHJlc2hvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgX2NyZWF0ZVNoYXBlOiBmdW5jdGlvbiAoc2NhbGUpIHtcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IGIyLkNoYWluU2hhcGUoKTtcblxuICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG4gICAgICAgIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHAgPSBwb2ludHNbaV07XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKCBuZXcgYjIuVmVjMihwLngvUFRNX1JBVElPKnNjYWxlLngsIHAueS9QVE1fUkFUSU8qc2NhbGUueSkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgIHNoYXBlLkNyZWF0ZUxvb3AodmVydGljZXMsIHZlcnRpY2VzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFwZS5DcmVhdGVDaGFpbih2ZXJ0aWNlcywgdmVydGljZXMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2hhcGU7XG4gICAgfSxcblxuICAgIHJlc2V0SW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVzZXRQb2ludHNCeUNvbnRvdXIoKTtcbiAgICB9LFxuXG4gICAgcmVzZXRQb2ludHNCeUNvbnRvdXI6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBQaHlzaWNzVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnc2NlbmU6Ly91dGlscy9waHlzaWNzJyk7XG4gICAgICAgIFBoeXNpY3NVdGlscy5yZXNldFBvaW50cyh0aGlzLCB7dGhyZXNob2xkOiB0aGlzLnRocmVzaG9sZCwgbG9vcDogdGhpcy5sb29wfSk7XG4gICAgfVxufSk7XG5cbmNjLlBoeXNpY3NDaGFpbkNvbGxpZGVyID0gbW9kdWxlLmV4cG9ydHMgPSBQaHlzaWNzQ2hhaW5Db2xsaWRlcjtcbiJdfQ==