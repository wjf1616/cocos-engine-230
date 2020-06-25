
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/index.js';
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

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en
 * The global main namespace of Spine, all classes, functions,
 * properties and constants of Spine are defined in this namespace
 * !#zh
 * Spine 的全局的命名空间，
 * 与 Spine 相关的所有的类，函数，属性，常量都在这个命名空间中定义。
 * @module sp
 * @main sp
 */

/*
 * Reference:
 * http://esotericsoftware.com/spine-runtime-terminology
 * http://esotericsoftware.com/files/runtime-diagram.png
 * http://en.esotericsoftware.com/spine-using-runtimes
 */
var _global = typeof window === 'undefined' ? global : window;

var _isUseSpine = true;

if (!CC_NATIVERENDERER) {
  _global.spine = require('./lib/spine');
} else if (!_global.spine) {
  _isUseSpine = false;
}

if (_isUseSpine) {
  _global.sp = {};
  /**
   * !#en
   * The global time scale of Spine.
   * !#zh
   * Spine 全局时间缩放率。
   * @example
   * sp.timeScale = 0.8;
   */

  sp._timeScale = 1.0;
  Object.defineProperty(sp, 'timeScale', {
    get: function get() {
      return this._timeScale;
    },
    set: function set(value) {
      this._timeScale = value;
    },
    configurable: true
  }); // The attachment type of spine. It contains three type: REGION(0), BOUNDING_BOX(1), MESH(2) and SKINNED_MESH.

  sp.ATTACHMENT_TYPE = {
    REGION: 0,
    BOUNDING_BOX: 1,
    MESH: 2,
    SKINNED_MESH: 3
  };
  /**
   * !#en The event type of spine skeleton animation.
   * !#zh 骨骼动画事件类型。
   * @enum AnimationEventType
   */

  sp.AnimationEventType = cc.Enum({
    /**
     * !#en The play spine skeleton animation start type.
     * !#zh 开始播放骨骼动画。
     * @property {Number} START
     */
    START: 0,

    /**
     * !#en Another entry has replaced this entry as the current entry. This entry may continue being applied for mixing.
     * !#zh 当前的 entry 被其他的 entry 替换。当使用 mixing 时，当前的 entry 会继续运行。
     */
    INTERRUPT: 1,

    /**
     * !#en The play spine skeleton animation finish type.
     * !#zh 播放骨骼动画结束。
     * @property {Number} END
     */
    END: 2,

    /**
     * !#en The entry will be disposed.
     * !#zh entry 将被销毁。
     */
    DISPOSE: 3,

    /**
     * !#en The play spine skeleton animation complete type.
     * !#zh 播放骨骼动画完成。
     * @property {Number} COMPLETE
     */
    COMPLETE: 4,

    /**
     * !#en The spine skeleton animation event type.
     * !#zh 骨骼动画事件。
     * @property {Number} EVENT
     */
    EVENT: 5
  });
  /**
   * @module sp
   */

  if (!CC_EDITOR || !Editor.isMainProcess) {
    sp.spine = _global.spine;

    if (!CC_NATIVERENDERER) {
      require('./skeleton-texture');
    }

    require('./skeleton-data');

    require('./vertex-effect-delegate');

    require('./Skeleton');

    require('./spine-assembler');
  } else {
    require('./skeleton-data');
  }
}
/**
 * !#en
 * `sp.spine` is the namespace for official Spine Runtime, which officially implemented and maintained by Spine.<br>
 * Please refer to the official documentation for its detailed usage: [http://en.esotericsoftware.com/spine-using-runtimes](http://en.esotericsoftware.com/spine-using-runtimes)
 * !#zh
 * sp.spine 模块是 Spine 官方运行库的 API 入口，由 Spine 官方统一实现和维护，具体用法请参考：[http://zh.esotericsoftware.com/spine-using-runtimes](http://zh.esotericsoftware.com/spine-using-runtimes)
 * @module sp.spine
 * @main sp.spine
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIl9nbG9iYWwiLCJ3aW5kb3ciLCJnbG9iYWwiLCJfaXNVc2VTcGluZSIsIkNDX05BVElWRVJFTkRFUkVSIiwic3BpbmUiLCJyZXF1aXJlIiwic3AiLCJfdGltZVNjYWxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsImNvbmZpZ3VyYWJsZSIsIkFUVEFDSE1FTlRfVFlQRSIsIlJFR0lPTiIsIkJPVU5ESU5HX0JPWCIsIk1FU0giLCJTS0lOTkVEX01FU0giLCJBbmltYXRpb25FdmVudFR5cGUiLCJjYyIsIkVudW0iLCJTVEFSVCIsIklOVEVSUlVQVCIsIkVORCIsIkRJU1BPU0UiLCJDT01QTEVURSIsIkVWRU5UIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNNYWluUHJvY2VzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7QUFPQSxJQUFJQSxPQUFPLEdBQUcsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQXZEOztBQUNBLElBQUlFLFdBQVcsR0FBRyxJQUFsQjs7QUFFQSxJQUFJLENBQUNDLGlCQUFMLEVBQXdCO0FBQ3BCSixFQUFBQSxPQUFPLENBQUNLLEtBQVIsR0FBZ0JDLE9BQU8sQ0FBQyxhQUFELENBQXZCO0FBQ0gsQ0FGRCxNQUVPLElBQUksQ0FBQ04sT0FBTyxDQUFDSyxLQUFiLEVBQW9CO0FBQ3ZCRixFQUFBQSxXQUFXLEdBQUcsS0FBZDtBQUNIOztBQUVELElBQUlBLFdBQUosRUFBaUI7QUFDYkgsRUFBQUEsT0FBTyxDQUFDTyxFQUFSLEdBQWEsRUFBYjtBQUVBOzs7Ozs7Ozs7QUFRQUEsRUFBQUEsRUFBRSxDQUFDQyxVQUFILEdBQWdCLEdBQWhCO0FBQ0FDLEVBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkgsRUFBdEIsRUFBMEIsV0FBMUIsRUFBdUM7QUFDbkNJLElBQUFBLEdBRG1DLGlCQUM1QjtBQUNILGFBQU8sS0FBS0gsVUFBWjtBQUNILEtBSGtDO0FBSW5DSSxJQUFBQSxHQUptQyxlQUk5QkMsS0FKOEIsRUFJdkI7QUFDUixXQUFLTCxVQUFMLEdBQWtCSyxLQUFsQjtBQUNILEtBTmtDO0FBT25DQyxJQUFBQSxZQUFZLEVBQUU7QUFQcUIsR0FBdkMsRUFaYSxDQXNCYjs7QUFDQVAsRUFBQUEsRUFBRSxDQUFDUSxlQUFILEdBQXFCO0FBQ2pCQyxJQUFBQSxNQUFNLEVBQUUsQ0FEUztBQUVqQkMsSUFBQUEsWUFBWSxFQUFFLENBRkc7QUFHakJDLElBQUFBLElBQUksRUFBRSxDQUhXO0FBSWpCQyxJQUFBQSxZQUFZLEVBQUM7QUFKSSxHQUFyQjtBQU9BOzs7Ozs7QUFLQVosRUFBQUEsRUFBRSxDQUFDYSxrQkFBSCxHQUF3QkMsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDNUI7Ozs7O0FBS0FDLElBQUFBLEtBQUssRUFBRSxDQU5xQjs7QUFPNUI7Ozs7QUFJQUMsSUFBQUEsU0FBUyxFQUFFLENBWGlCOztBQVk1Qjs7Ozs7QUFLQUMsSUFBQUEsR0FBRyxFQUFFLENBakJ1Qjs7QUFrQjVCOzs7O0FBSUFDLElBQUFBLE9BQU8sRUFBRSxDQXRCbUI7O0FBdUI1Qjs7Ozs7QUFLQUMsSUFBQUEsUUFBUSxFQUFFLENBNUJrQjs7QUE2QjVCOzs7OztBQUtBQyxJQUFBQSxLQUFLLEVBQUU7QUFsQ3FCLEdBQVIsQ0FBeEI7QUFxQ0E7Ozs7QUFHQSxNQUFJLENBQUNDLFNBQUQsSUFBYyxDQUFDQyxNQUFNLENBQUNDLGFBQTFCLEVBQXlDO0FBRXJDeEIsSUFBQUEsRUFBRSxDQUFDRixLQUFILEdBQVdMLE9BQU8sQ0FBQ0ssS0FBbkI7O0FBQ0EsUUFBSSxDQUFDRCxpQkFBTCxFQUF3QjtBQUNwQkUsTUFBQUEsT0FBTyxDQUFDLG9CQUFELENBQVA7QUFDSDs7QUFFREEsSUFBQUEsT0FBTyxDQUFDLGlCQUFELENBQVA7O0FBQ0FBLElBQUFBLE9BQU8sQ0FBQywwQkFBRCxDQUFQOztBQUNBQSxJQUFBQSxPQUFPLENBQUMsWUFBRCxDQUFQOztBQUNBQSxJQUFBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDtBQUNILEdBWEQsTUFZSztBQUNEQSxJQUFBQSxPQUFPLENBQUMsaUJBQUQsQ0FBUDtBQUNIO0FBQ0o7QUFFRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgZ2xvYmFsIG1haW4gbmFtZXNwYWNlIG9mIFNwaW5lLCBhbGwgY2xhc3NlcywgZnVuY3Rpb25zLFxuICogcHJvcGVydGllcyBhbmQgY29uc3RhbnRzIG9mIFNwaW5lIGFyZSBkZWZpbmVkIGluIHRoaXMgbmFtZXNwYWNlXG4gKiAhI3poXG4gKiBTcGluZSDnmoTlhajlsYDnmoTlkb3lkI3nqbrpl7TvvIxcbiAqIOS4jiBTcGluZSDnm7jlhbPnmoTmiYDmnInnmoTnsbvvvIzlh73mlbDvvIzlsZ7mgKfvvIzluLjph4/pg73lnKjov5nkuKrlkb3lkI3nqbrpl7TkuK3lrprkuYnjgIJcbiAqIEBtb2R1bGUgc3BcbiAqIEBtYWluIHNwXG4gKi9cblxuLypcbiAqIFJlZmVyZW5jZTpcbiAqIGh0dHA6Ly9lc290ZXJpY3NvZnR3YXJlLmNvbS9zcGluZS1ydW50aW1lLXRlcm1pbm9sb2d5XG4gKiBodHRwOi8vZXNvdGVyaWNzb2Z0d2FyZS5jb20vZmlsZXMvcnVudGltZS1kaWFncmFtLnBuZ1xuICogaHR0cDovL2VuLmVzb3Rlcmljc29mdHdhcmUuY29tL3NwaW5lLXVzaW5nLXJ1bnRpbWVzXG4gKi9cblxudmFyIF9nbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdztcbnZhciBfaXNVc2VTcGluZSA9IHRydWU7XG5cbmlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICBfZ2xvYmFsLnNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbn0gZWxzZSBpZiAoIV9nbG9iYWwuc3BpbmUpIHtcbiAgICBfaXNVc2VTcGluZSA9IGZhbHNlO1xufVxuXG5pZiAoX2lzVXNlU3BpbmUpIHtcbiAgICBfZ2xvYmFsLnNwID0ge307XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGdsb2JhbCB0aW1lIHNjYWxlIG9mIFNwaW5lLlxuICAgICAqICEjemhcbiAgICAgKiBTcGluZSDlhajlsYDml7bpl7TnvKnmlL7njofjgIJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHNwLnRpbWVTY2FsZSA9IDAuODtcbiAgICAgKi9cbiAgICBzcC5fdGltZVNjYWxlID0gMS4wO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzcCwgJ3RpbWVTY2FsZScsIHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90aW1lU2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUaGUgYXR0YWNobWVudCB0eXBlIG9mIHNwaW5lLiBJdCBjb250YWlucyB0aHJlZSB0eXBlOiBSRUdJT04oMCksIEJPVU5ESU5HX0JPWCgxKSwgTUVTSCgyKSBhbmQgU0tJTk5FRF9NRVNILlxuICAgIHNwLkFUVEFDSE1FTlRfVFlQRSA9IHtcbiAgICAgICAgUkVHSU9OOiAwLFxuICAgICAgICBCT1VORElOR19CT1g6IDEsXG4gICAgICAgIE1FU0g6IDIsXG4gICAgICAgIFNLSU5ORURfTUVTSDozXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgb2Ygc3BpbmUgc2tlbGV0b24gYW5pbWF0aW9uLlxuICAgICAqICEjemgg6aqo6aq85Yqo55S75LqL5Lu257G75Z6L44CCXG4gICAgICogQGVudW0gQW5pbWF0aW9uRXZlbnRUeXBlXG4gICAgICovXG4gICAgc3AuQW5pbWF0aW9uRXZlbnRUeXBlID0gY2MuRW51bSh7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBwbGF5IHNwaW5lIHNrZWxldG9uIGFuaW1hdGlvbiBzdGFydCB0eXBlLlxuICAgICAgICAgKiAhI3poIOW8gOWni+aSreaUvumqqOmqvOWKqOeUu+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1RBUlRcbiAgICAgICAgICovXG4gICAgICAgIFNUQVJUOiAwLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBbm90aGVyIGVudHJ5IGhhcyByZXBsYWNlZCB0aGlzIGVudHJ5IGFzIHRoZSBjdXJyZW50IGVudHJ5LiBUaGlzIGVudHJ5IG1heSBjb250aW51ZSBiZWluZyBhcHBsaWVkIGZvciBtaXhpbmcuXG4gICAgICAgICAqICEjemgg5b2T5YmN55qEIGVudHJ5IOiiq+WFtuS7lueahCBlbnRyeSDmm7/mjaLjgILlvZPkvb/nlKggbWl4aW5nIOaXtu+8jOW9k+WJjeeahCBlbnRyeSDkvJrnu6fnu63ov5DooYzjgIJcbiAgICAgICAgICovXG4gICAgICAgIElOVEVSUlVQVDogMSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHBsYXkgc3BpbmUgc2tlbGV0b24gYW5pbWF0aW9uIGZpbmlzaCB0eXBlLlxuICAgICAgICAgKiAhI3poIOaSreaUvumqqOmqvOWKqOeUu+e7k+adn+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRU5EXG4gICAgICAgICAqL1xuICAgICAgICBFTkQ6IDIsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBlbnRyeSB3aWxsIGJlIGRpc3Bvc2VkLlxuICAgICAgICAgKiAhI3poIGVudHJ5IOWwhuiiq+mUgOavgeOAglxuICAgICAgICAgKi9cbiAgICAgICAgRElTUE9TRTogMyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHBsYXkgc3BpbmUgc2tlbGV0b24gYW5pbWF0aW9uIGNvbXBsZXRlIHR5cGUuXG4gICAgICAgICAqICEjemgg5pKt5pS+6aqo6aq85Yqo55S75a6M5oiQ44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDT01QTEVURVxuICAgICAgICAgKi9cbiAgICAgICAgQ09NUExFVEU6IDQsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBzcGluZSBza2VsZXRvbiBhbmltYXRpb24gZXZlbnQgdHlwZS5cbiAgICAgICAgICogISN6aCDpqqjpqrzliqjnlLvkuovku7bjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVWRU5UXG4gICAgICAgICAqL1xuICAgICAgICBFVkVOVDogNVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBzcFxuICAgICAqL1xuICAgIGlmICghQ0NfRURJVE9SIHx8ICFFZGl0b3IuaXNNYWluUHJvY2Vzcykge1xuICAgICAgICBcbiAgICAgICAgc3Auc3BpbmUgPSBfZ2xvYmFsLnNwaW5lO1xuICAgICAgICBpZiAoIUNDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICByZXF1aXJlKCcuL3NrZWxldG9uLXRleHR1cmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVpcmUoJy4vc2tlbGV0b24tZGF0YScpO1xuICAgICAgICByZXF1aXJlKCcuL3ZlcnRleC1lZmZlY3QtZGVsZWdhdGUnKTtcbiAgICAgICAgcmVxdWlyZSgnLi9Ta2VsZXRvbicpO1xuICAgICAgICByZXF1aXJlKCcuL3NwaW5lLWFzc2VtYmxlcicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgnLi9za2VsZXRvbi1kYXRhJyk7XG4gICAgfVxufVxuXG4vKipcbiAqICEjZW5cbiAqIGBzcC5zcGluZWAgaXMgdGhlIG5hbWVzcGFjZSBmb3Igb2ZmaWNpYWwgU3BpbmUgUnVudGltZSwgd2hpY2ggb2ZmaWNpYWxseSBpbXBsZW1lbnRlZCBhbmQgbWFpbnRhaW5lZCBieSBTcGluZS48YnI+XG4gKiBQbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24gZm9yIGl0cyBkZXRhaWxlZCB1c2FnZTogW2h0dHA6Ly9lbi5lc290ZXJpY3NvZnR3YXJlLmNvbS9zcGluZS11c2luZy1ydW50aW1lc10oaHR0cDovL2VuLmVzb3Rlcmljc29mdHdhcmUuY29tL3NwaW5lLXVzaW5nLXJ1bnRpbWVzKVxuICogISN6aFxuICogc3Auc3BpbmUg5qih5Z2X5pivIFNwaW5lIOWumOaWuei/kOihjOW6k+eahCBBUEkg5YWl5Y+j77yM55SxIFNwaW5lIOWumOaWuee7n+S4gOWunueOsOWSjOe7tOaKpO+8jOWFt+S9k+eUqOazleivt+WPguiAg++8mltodHRwOi8vemguZXNvdGVyaWNzb2Z0d2FyZS5jb20vc3BpbmUtdXNpbmctcnVudGltZXNdKGh0dHA6Ly96aC5lc290ZXJpY3NvZnR3YXJlLmNvbS9zcGluZS11c2luZy1ydW50aW1lcylcbiAqIEBtb2R1bGUgc3Auc3BpbmVcbiAqIEBtYWluIHNwLnNwaW5lXG4gKi9cbiJdfQ==