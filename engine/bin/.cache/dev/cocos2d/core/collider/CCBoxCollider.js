
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCBoxCollider.js';
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

/**
 * !#en Defines a Box Collider .
 * !#zh 用来定义包围盒碰撞体
 * @class Collider.Box
 */
cc.Collider.Box = cc.Class({
  properties: {
    _offset: cc.v2(0, 0),
    _size: cc.size(100, 100),

    /**
     * !#en Position offset
     * !#zh 位置偏移量
     * @property offset
     * @type {Vec2}
     */
    offset: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.offset',
      get: function get() {
        return this._offset;
      },
      set: function set(value) {
        this._offset = value;
      },
      type: cc.Vec2
    },

    /**
     * !#en Box size
     * !#zh 包围盒大小
     * @property size
     * @type {Size}
     */
    size: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.size',
      get: function get() {
        return this._size;
      },
      set: function set(value) {
        this._size.width = value.width < 0 ? 0 : value.width;
        this._size.height = value.height < 0 ? 0 : value.height;
      },
      type: cc.Size
    }
  },
  resetInEditor: CC_EDITOR && function () {
    var size = this.node.getContentSize();

    if (size.width !== 0 && size.height !== 0) {
      this.size = cc.size(size);
      this.offset.x = (0.5 - this.node.anchorX) * size.width;
      this.offset.y = (0.5 - this.node.anchorY) * size.height;
    }
  }
});
/**
 * !#en Box Collider.
 * !#zh 包围盒碰撞组件
 * @class BoxCollider
 * @extends Collider
 * @uses Collider.Box
 */

var BoxCollider = cc.Class({
  name: 'cc.BoxCollider',
  "extends": cc.Collider,
  mixins: [cc.Collider.Box],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.collider/Box Collider'
  }
});
cc.BoxCollider = module.exports = BoxCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQm94Q29sbGlkZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDb2xsaWRlciIsIkJveCIsIkNsYXNzIiwicHJvcGVydGllcyIsIl9vZmZzZXQiLCJ2MiIsIl9zaXplIiwic2l6ZSIsIm9mZnNldCIsInRvb2x0aXAiLCJDQ19ERVYiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsInR5cGUiLCJWZWMyIiwid2lkdGgiLCJoZWlnaHQiLCJTaXplIiwicmVzZXRJbkVkaXRvciIsIkNDX0VESVRPUiIsIm5vZGUiLCJnZXRDb250ZW50U2l6ZSIsIngiLCJhbmNob3JYIiwieSIsImFuY2hvclkiLCJCb3hDb2xsaWRlciIsIm5hbWUiLCJtaXhpbnMiLCJlZGl0b3IiLCJtZW51IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQTs7Ozs7QUFLQUEsRUFBRSxDQUFDQyxRQUFILENBQVlDLEdBQVosR0FBa0JGLEVBQUUsQ0FBQ0csS0FBSCxDQUFTO0FBQ3ZCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsT0FBTyxFQUFFTCxFQUFFLENBQUNNLEVBQUgsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUREO0FBRVJDLElBQUFBLEtBQUssRUFBRVAsRUFBRSxDQUFDUSxJQUFILENBQVEsR0FBUixFQUFhLEdBQWIsQ0FGQzs7QUFJUjs7Ozs7O0FBTUFDLElBQUFBLE1BQU0sRUFBRTtBQUNKQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSxnREFEZjtBQUVKQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS1AsT0FBWjtBQUNILE9BSkc7QUFLSlEsTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS1QsT0FBTCxHQUFlUyxLQUFmO0FBQ0gsT0FQRztBQVFKQyxNQUFBQSxJQUFJLEVBQUVmLEVBQUUsQ0FBQ2dCO0FBUkwsS0FWQTs7QUFxQlI7Ozs7OztBQU1BUixJQUFBQSxJQUFJLEVBQUU7QUFDRkUsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksOENBRGpCO0FBRUZDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLTCxLQUFaO0FBQ0gsT0FKQztBQUtGTSxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLUCxLQUFMLENBQVdVLEtBQVgsR0FBbUJILEtBQUssQ0FBQ0csS0FBTixHQUFjLENBQWQsR0FBa0IsQ0FBbEIsR0FBc0JILEtBQUssQ0FBQ0csS0FBL0M7QUFDQSxhQUFLVixLQUFMLENBQVdXLE1BQVgsR0FBb0JKLEtBQUssQ0FBQ0ksTUFBTixHQUFlLENBQWYsR0FBbUIsQ0FBbkIsR0FBdUJKLEtBQUssQ0FBQ0ksTUFBakQ7QUFDSCxPQVJDO0FBU0ZILE1BQUFBLElBQUksRUFBRWYsRUFBRSxDQUFDbUI7QUFUUDtBQTNCRSxHQURXO0FBeUN2QkMsRUFBQUEsYUFBYSxFQUFFQyxTQUFTLElBQUksWUFBWTtBQUNwQyxRQUFJYixJQUFJLEdBQUcsS0FBS2MsSUFBTCxDQUFVQyxjQUFWLEVBQVg7O0FBQ0EsUUFBSWYsSUFBSSxDQUFDUyxLQUFMLEtBQWUsQ0FBZixJQUFvQlQsSUFBSSxDQUFDVSxNQUFMLEtBQWdCLENBQXhDLEVBQTJDO0FBQ3ZDLFdBQUtWLElBQUwsR0FBWVIsRUFBRSxDQUFDUSxJQUFILENBQVNBLElBQVQsQ0FBWjtBQUNBLFdBQUtDLE1BQUwsQ0FBWWUsQ0FBWixHQUFnQixDQUFDLE1BQU0sS0FBS0YsSUFBTCxDQUFVRyxPQUFqQixJQUE0QmpCLElBQUksQ0FBQ1MsS0FBakQ7QUFDQSxXQUFLUixNQUFMLENBQVlpQixDQUFaLEdBQWdCLENBQUMsTUFBTSxLQUFLSixJQUFMLENBQVVLLE9BQWpCLElBQTRCbkIsSUFBSSxDQUFDVSxNQUFqRDtBQUNIO0FBQ0o7QUFoRHNCLENBQVQsQ0FBbEI7QUFtREE7Ozs7Ozs7O0FBT0EsSUFBSVUsV0FBVyxHQUFHNUIsRUFBRSxDQUFDRyxLQUFILENBQVM7QUFDdkIwQixFQUFBQSxJQUFJLEVBQUUsZ0JBRGlCO0FBRXZCLGFBQVM3QixFQUFFLENBQUNDLFFBRlc7QUFHdkI2QixFQUFBQSxNQUFNLEVBQUUsQ0FBQzlCLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZQyxHQUFiLENBSGU7QUFLdkI2QixFQUFBQSxNQUFNLEVBQUVWLFNBQVMsSUFBSTtBQUNqQlcsSUFBQUEsSUFBSSxFQUFFO0FBRFc7QUFMRSxDQUFULENBQWxCO0FBVUFoQyxFQUFFLENBQUM0QixXQUFILEdBQWlCSyxNQUFNLENBQUNDLE9BQVAsR0FBaUJOLFdBQWxDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbi8qKlxuICogISNlbiBEZWZpbmVzIGEgQm94IENvbGxpZGVyIC5cbiAqICEjemgg55So5p2l5a6a5LmJ5YyF5Zu055uS56Kw5pKe5L2TXG4gKiBAY2xhc3MgQ29sbGlkZXIuQm94XG4gKi9cbmNjLkNvbGxpZGVyLkJveCA9IGNjLkNsYXNzKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9vZmZzZXQ6IGNjLnYyKDAsIDApLFxuICAgICAgICBfc2l6ZTogY2Muc2l6ZSgxMDAsIDEwMCksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUG9zaXRpb24gb2Zmc2V0XG4gICAgICAgICAqICEjemgg5L2N572u5YGP56e76YePXG4gICAgICAgICAqIEBwcm9wZXJ0eSBvZmZzZXRcbiAgICAgICAgICogQHR5cGUge1ZlYzJ9XG4gICAgICAgICAqL1xuICAgICAgICBvZmZzZXQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm9mZnNldCcsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuVmVjMlxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEJveCBzaXplXG4gICAgICAgICAqICEjemgg5YyF5Zu055uS5aSn5bCPXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzaXplXG4gICAgICAgICAqIEB0eXBlIHtTaXplfVxuICAgICAgICAgKi9cbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuc2l6ZScsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NpemUud2lkdGggPSB2YWx1ZS53aWR0aCA8IDAgPyAwIDogdmFsdWUud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZS5oZWlnaHQgPSB2YWx1ZS5oZWlnaHQgPCAwID8gMCA6IHZhbHVlLmhlaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5TaXplXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRJbkVkaXRvcjogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgaWYgKHNpemUud2lkdGggIT09IDAgJiYgc2l6ZS5oZWlnaHQgIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSA9IGNjLnNpemUoIHNpemUgKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0LnggPSAoMC41IC0gdGhpcy5ub2RlLmFuY2hvclgpICogc2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0LnkgPSAoMC41IC0gdGhpcy5ub2RlLmFuY2hvclkpICogc2l6ZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIEJveCBDb2xsaWRlci5cbiAqICEjemgg5YyF5Zu055uS56Kw5pKe57uE5Lu2XG4gKiBAY2xhc3MgQm94Q29sbGlkZXJcbiAqIEBleHRlbmRzIENvbGxpZGVyXG4gKiBAdXNlcyBDb2xsaWRlci5Cb3hcbiAqL1xudmFyIEJveENvbGxpZGVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Cb3hDb2xsaWRlcicsXG4gICAgZXh0ZW5kczogY2MuQ29sbGlkZXIsXG4gICAgbWl4aW5zOiBbY2MuQ29sbGlkZXIuQm94XSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5jb2xsaWRlci9Cb3ggQ29sbGlkZXInLFxuICAgIH1cbn0pO1xuXG5jYy5Cb3hDb2xsaWRlciA9IG1vZHVsZS5leHBvcnRzID0gQm94Q29sbGlkZXI7XG4iXX0=