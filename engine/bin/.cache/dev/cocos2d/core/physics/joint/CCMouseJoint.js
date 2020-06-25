
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCMouseJoint.js';
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

var tempB2Vec2 = new b2.Vec2();
/**
 * !#en
 * A mouse joint is used to make a point on a body track a
 * specified world point. This a soft constraint with a maximum
 * force. This allows the constraint to stretch and without
 * applying huge forces.
 * Mouse Joint will auto register the touch event with the mouse region node,
 * and move the choosed rigidbody in touch move event.
 * Note : generally mouse joint only used in test bed.
 * !#zh
 * 鼠标关节用于使刚体上的一个点追踪一个指定的世界坐标系下的位置。
 * 鼠标关节可以指定一个最大的里来施加一个柔和的约束。
 * 鼠标关节会自动使用 mouse region 节点来注册鼠标事件，并且在触摸移动事件中移动选中的刚体。
 * 注意：一般鼠标关节只在测试环境中使用。
 * @class MouseJoint
 * @extends Joint
 */

var MouseJoint = cc.Class({
  name: 'cc.MouseJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Mouse'
  },
  properties: {
    _target: 1,
    _frequency: 5,
    _dampingRatio: 0.7,
    _maxForce: 0,
    connectedBody: {
      "default": null,
      type: cc.RigidBody,
      visible: false,
      override: true
    },
    collideConnected: {
      "default": true,
      visible: false,
      override: true
    },

    /**
     * !#en
     * The anchor of the rigidbody.
     * !#zh
     * 刚体的锚点。
     * @property {Vec2} anchor
     * @default cc.v2(0, 0)
     */
    anchor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.anchor',
      "default": cc.v2(0, 0),
      override: true,
      visible: false
    },

    /**
     * !#en
     * The anchor of the connected rigidbody.
     * !#zh
     * 关节另一端刚体的锚点。
     * @property {Vec2} connectedAnchor
     * @default cc.v2(0, 0)
     */
    connectedAnchor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedAnchor',
      "default": cc.v2(0, 0),
      override: true,
      visible: false
    },

    /**
     * !#en
     * The node used to register touch evnet.
     * If this is null, it will be the joint's node.
     * !#zh
     * 用于注册触摸事件的节点。
     * 如果没有设置这个值，那么将会使用关节的节点来注册事件。
     * @property {Node} mouseRegion
     * @default null
     */
    mouseRegion: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.mouseRegion',
      "default": null,
      type: cc.Node
    },

    /**
     * !#en
     * The target point.
     * The mouse joint will move choosed rigidbody to target point.
     * !#zh
     * 目标点，鼠标关节将会移动选中的刚体到指定的目标点
     * @property {Vec2} target
     */
    target: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.target',
      visible: false,
      get: function get() {
        return this._target;
      },
      set: function set(value) {
        this._target = value;

        if (this._joint) {
          tempB2Vec2.x = value.x / PTM_RATIO;
          tempB2Vec2.y = value.y / PTM_RATIO;

          this._joint.SetTarget(tempB2Vec2);
        }
      }
    },

    /**
     * !#en
     * The spring frequency.
     * !#zh
     * 弹簧系数。
     * @property {Number} frequency
     * @default 0
     */
    frequency: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.frequency',
      get: function get() {
        return this._frequency;
      },
      set: function set(value) {
        this._frequency = value;

        if (this._joint) {
          this._joint.SetFrequency(value);
        }
      }
    },

    /**
     * !#en
     * The damping ratio.
     * !#zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     * @property {Number} dampingRatio
     * @property 0
     */
    dampingRatio: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.dampingRatio',
      get: function get() {
        return this._dampingRatio;
      },
      set: function set(value) {
        this._dampingRatio = value;

        if (this._joint) {
          this._joint.SetDampingRatio(value);
        }
      }
    },

    /**
     * !#en
     * The maximum force
     * !#zh
     * 最大阻力值
     * @property {Number} maxForce
     * @default 1
     */
    maxForce: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxForce',
      visible: false,
      get: function get() {
        return this._maxForce;
      },
      set: function set(value) {
        this._maxForce = value;

        if (this._joint) {
          this._joint.SetMaxForce(value);
        }
      }
    }
  },
  onLoad: function onLoad() {
    var mouseRegion = this.mouseRegion || this.node;
    mouseRegion.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    mouseRegion.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    mouseRegion.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    mouseRegion.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  },
  onEnable: function onEnable() {},
  start: function start() {},
  onTouchBegan: function onTouchBegan(event) {
    var manager = cc.director.getPhysicsManager();
    var target = this._pressPoint = event.touch.getLocation();

    if (cc.Camera && cc.Camera.main) {
      target = cc.Camera.main.getScreenToWorldPoint(target);
    }

    var collider = manager.testPoint(target);
    if (!collider) return;
    var body = this.connectedBody = collider.body;
    body.awake = true;
    this.maxForce = 1000 * this.connectedBody.getMass();
    this.target = target;

    this._init();
  },
  onTouchMove: function onTouchMove(event) {
    this._pressPoint = event.touch.getLocation();
  },
  onTouchEnd: function onTouchEnd(event) {
    this._destroy();

    this._pressPoint = null;
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.MouseJointDef();
    tempB2Vec2.x = this.target.x / PTM_RATIO;
    tempB2Vec2.y = this.target.y / PTM_RATIO;
    def.target = tempB2Vec2;
    def.maxForce = this.maxForce;
    def.dampingRatio = this.dampingRatio;
    def.frequencyHz = this.frequency;
    return def;
  },
  update: function update() {
    if (!this._pressPoint || !this._isValid()) {
      return;
    }

    var camera = cc.Camera.findCamera(this.node);

    if (camera) {
      this.target = camera.getScreenToWorldPoint(this._pressPoint);
    } else {
      this.target = this._pressPoint;
    }
  }
});
cc.MouseJoint = module.exports = MouseJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTW91c2VKb2ludC5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwidGVtcEIyVmVjMiIsImIyIiwiVmVjMiIsIk1vdXNlSm9pbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkpvaW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwiaW5zcGVjdG9yIiwibWVudSIsInByb3BlcnRpZXMiLCJfdGFyZ2V0IiwiX2ZyZXF1ZW5jeSIsIl9kYW1waW5nUmF0aW8iLCJfbWF4Rm9yY2UiLCJjb25uZWN0ZWRCb2R5IiwidHlwZSIsIlJpZ2lkQm9keSIsInZpc2libGUiLCJvdmVycmlkZSIsImNvbGxpZGVDb25uZWN0ZWQiLCJhbmNob3IiLCJ0b29sdGlwIiwiQ0NfREVWIiwidjIiLCJjb25uZWN0ZWRBbmNob3IiLCJtb3VzZVJlZ2lvbiIsIk5vZGUiLCJ0YXJnZXQiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9qb2ludCIsIngiLCJ5IiwiU2V0VGFyZ2V0IiwiZnJlcXVlbmN5IiwiU2V0RnJlcXVlbmN5IiwiZGFtcGluZ1JhdGlvIiwiU2V0RGFtcGluZ1JhdGlvIiwibWF4Rm9yY2UiLCJTZXRNYXhGb3JjZSIsIm9uTG9hZCIsIm5vZGUiLCJvbiIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwib25Ub3VjaEJlZ2FuIiwiVE9VQ0hfTU9WRSIsIm9uVG91Y2hNb3ZlIiwiVE9VQ0hfRU5EIiwib25Ub3VjaEVuZCIsIlRPVUNIX0NBTkNFTCIsIm9uRW5hYmxlIiwic3RhcnQiLCJldmVudCIsIm1hbmFnZXIiLCJkaXJlY3RvciIsImdldFBoeXNpY3NNYW5hZ2VyIiwiX3ByZXNzUG9pbnQiLCJ0b3VjaCIsImdldExvY2F0aW9uIiwiQ2FtZXJhIiwibWFpbiIsImdldFNjcmVlblRvV29ybGRQb2ludCIsImNvbGxpZGVyIiwidGVzdFBvaW50IiwiYm9keSIsImF3YWtlIiwiZ2V0TWFzcyIsIl9pbml0IiwiX2Rlc3Ryb3kiLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJNb3VzZUpvaW50RGVmIiwiZnJlcXVlbmN5SHoiLCJ1cGRhdGUiLCJfaXNWYWxpZCIsImNhbWVyYSIsImZpbmRDYW1lcmEiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7O0FBRUEsSUFBSUUsVUFBVSxHQUFHLElBQUlDLEVBQUUsQ0FBQ0MsSUFBUCxFQUFqQjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBSUMsVUFBVSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN0QkMsRUFBQUEsSUFBSSxFQUFFLGVBRGdCO0FBRXRCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGVTtBQUl0QkMsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLFNBQVMsRUFBRSx3REFETTtBQUVqQkMsSUFBQUEsSUFBSSxFQUFFO0FBRlcsR0FKQztBQVN0QkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLE9BQU8sRUFBRSxDQUREO0FBRVJDLElBQUFBLFVBQVUsRUFBRSxDQUZKO0FBR1JDLElBQUFBLGFBQWEsRUFBRSxHQUhQO0FBSVJDLElBQUFBLFNBQVMsRUFBRSxDQUpIO0FBTVJDLElBQUFBLGFBQWEsRUFBRTtBQUNYLGlCQUFTLElBREU7QUFFWEMsTUFBQUEsSUFBSSxFQUFFZCxFQUFFLENBQUNlLFNBRkU7QUFHWEMsTUFBQUEsT0FBTyxFQUFFLEtBSEU7QUFJWEMsTUFBQUEsUUFBUSxFQUFFO0FBSkMsS0FOUDtBQWFSQyxJQUFBQSxnQkFBZ0IsRUFBRTtBQUNkLGlCQUFTLElBREs7QUFFZEYsTUFBQUEsT0FBTyxFQUFFLEtBRks7QUFHZEMsTUFBQUEsUUFBUSxFQUFFO0FBSEksS0FiVjs7QUFtQlI7Ozs7Ozs7O0FBUUFFLElBQUFBLE1BQU0sRUFBRTtBQUNKQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0s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O0FBQ0FpQyxJQUFBQSxHQUFHLENBQUNuQyxZQUFKLEdBQW1CLEtBQUtBLFlBQXhCO0FBQ0FtQyxJQUFBQSxHQUFHLENBQUNFLFdBQUosR0FBa0IsS0FBS3ZDLFNBQXZCO0FBQ0EsV0FBT3FDLEdBQVA7QUFDSCxHQXROcUI7QUF3TnRCRyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsUUFBSSxDQUFDLEtBQUtqQixXQUFOLElBQXFCLENBQUMsS0FBS2tCLFFBQUwsRUFBMUIsRUFBMkM7QUFDdkM7QUFDSDs7QUFFRCxRQUFJQyxNQUFNLEdBQUc1RSxFQUFFLENBQUM0RCxNQUFILENBQVVpQixVQUFWLENBQXFCLEtBQUtwQyxJQUExQixDQUFiOztBQUNBLFFBQUltQyxNQUFKLEVBQVk7QUFDUixXQUFLbEQsTUFBTCxHQUFja0QsTUFBTSxDQUFDZCxxQkFBUCxDQUE2QixLQUFLTCxXQUFsQyxDQUFkO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsV0FBSy9CLE1BQUwsR0FBYyxLQUFLK0IsV0FBbkI7QUFDSDtBQUNKO0FBcE9xQixDQUFULENBQWpCO0FBdU9BekQsRUFBRSxDQUFDRCxVQUFILEdBQWdCK0UsTUFBTSxDQUFDQyxPQUFQLEdBQWlCaEYsVUFBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcblxudmFyIHRlbXBCMlZlYzIgPSBuZXcgYjIuVmVjMigpO1xuLyoqXG4gKiAhI2VuXG4gKiBBIG1vdXNlIGpvaW50IGlzIHVzZWQgdG8gbWFrZSBhIHBvaW50IG9uIGEgYm9keSB0cmFjayBhXG4gKiBzcGVjaWZpZWQgd29ybGQgcG9pbnQuIFRoaXMgYSBzb2Z0IGNvbnN0cmFpbnQgd2l0aCBhIG1heGltdW1cbiAqIGZvcmNlLiBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludCB0byBzdHJldGNoIGFuZCB3aXRob3V0XG4gKiBhcHBseWluZyBodWdlIGZvcmNlcy5cbiAqIE1vdXNlIEpvaW50IHdpbGwgYXV0byByZWdpc3RlciB0aGUgdG91Y2ggZXZlbnQgd2l0aCB0aGUgbW91c2UgcmVnaW9uIG5vZGUsXG4gKiBhbmQgbW92ZSB0aGUgY2hvb3NlZCByaWdpZGJvZHkgaW4gdG91Y2ggbW92ZSBldmVudC5cbiAqIE5vdGUgOiBnZW5lcmFsbHkgbW91c2Ugam9pbnQgb25seSB1c2VkIGluIHRlc3QgYmVkLlxuICogISN6aFxuICog6byg5qCH5YWz6IqC55So5LqO5L2/5Yia5L2T5LiK55qE5LiA5Liq54K56L+96Liq5LiA5Liq5oyH5a6a55qE5LiW55WM5Z2Q5qCH57O75LiL55qE5L2N572u44CCXG4gKiDpvKDmoIflhbPoioLlj6/ku6XmjIflrprkuIDkuKrmnIDlpKfnmoTph4zmnaXmlr3liqDkuIDkuKrmn5TlkoznmoTnuqbmnZ/jgIJcbiAqIOm8oOagh+WFs+iKguS8muiHquWKqOS9v+eUqCBtb3VzZSByZWdpb24g6IqC54K55p2l5rOo5YaM6byg5qCH5LqL5Lu277yM5bm25LiU5Zyo6Kem5pG456e75Yqo5LqL5Lu25Lit56e75Yqo6YCJ5Lit55qE5Yia5L2T44CCXG4gKiDms6jmhI/vvJrkuIDoiKzpvKDmoIflhbPoioLlj6rlnKjmtYvor5Xnjq/looPkuK3kvb/nlKjjgIJcbiAqIEBjbGFzcyBNb3VzZUpvaW50XG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG52YXIgTW91c2VKb2ludCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTW91c2VKb2ludCcsXG4gICAgZXh0ZW5kczogY2MuSm9pbnQsXG4gICAgXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3BoeXNpY3Mvam9pbnQuanMnLFxuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvSm9pbnQvTW91c2UnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF90YXJnZXQ6IDEsXG4gICAgICAgIF9mcmVxdWVuY3k6IDUsXG4gICAgICAgIF9kYW1waW5nUmF0aW86IDAuNyxcbiAgICAgICAgX21heEZvcmNlOiAwLFxuXG4gICAgICAgIGNvbm5lY3RlZEJvZHk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5SaWdpZEJvZHksXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGlkZUNvbm5lY3RlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgYW5jaG9yIG9mIHRoZSByaWdpZGJvZHkuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Yia5L2T55qE6ZSa54K544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gYW5jaG9yXG4gICAgICAgICAqIEBkZWZhdWx0IGNjLnYyKDAsIDApXG4gICAgICAgICAqL1xuICAgICAgICBhbmNob3I6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmFuY2hvcicsICAgICAgICAgICAgXG4gICAgICAgICAgICBkZWZhdWx0OiBjYy52MigwLCAwKSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGFuY2hvciBvZiB0aGUgY29ubmVjdGVkIHJpZ2lkYm9keS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlhbPoioLlj6bkuIDnq6/liJrkvZPnmoTplJrngrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtWZWMyfSBjb25uZWN0ZWRBbmNob3JcbiAgICAgICAgICogQGRlZmF1bHQgY2MudjIoMCwgMClcbiAgICAgICAgICovXG4gICAgICAgIGNvbm5lY3RlZEFuY2hvcjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuY29ubmVjdGVkQW5jaG9yJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLnYyKDAsIDApLFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBub2RlIHVzZWQgdG8gcmVnaXN0ZXIgdG91Y2ggZXZuZXQuXG4gICAgICAgICAqIElmIHRoaXMgaXMgbnVsbCwgaXQgd2lsbCBiZSB0aGUgam9pbnQncyBub2RlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOeUqOS6juazqOWGjOinpuaRuOS6i+S7tueahOiKgueCueOAglxuICAgICAgICAgKiDlpoLmnpzmsqHmnInorr7nva7ov5nkuKrlgLzvvIzpgqPkuYjlsIbkvJrkvb/nlKjlhbPoioLnmoToioLngrnmnaXms6jlhozkuovku7bjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOb2RlfSBtb3VzZVJlZ2lvblxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqL1xuICAgICAgICBtb3VzZVJlZ2lvbjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIubW91c2VSZWdpb24nLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgdGFyZ2V0IHBvaW50LlxuICAgICAgICAgKiBUaGUgbW91c2Ugam9pbnQgd2lsbCBtb3ZlIGNob29zZWQgcmlnaWRib2R5IHRvIHRhcmdldCBwb2ludC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnm67moIfngrnvvIzpvKDmoIflhbPoioLlsIbkvJrnp7vliqjpgInkuK3nmoTliJrkvZPliLDmjIflrprnmoTnm67moIfngrlcbiAgICAgICAgICogQHByb3BlcnR5IHtWZWMyfSB0YXJnZXRcbiAgICAgICAgICovXG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIudGFyZ2V0JyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RhcmdldCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wQjJWZWMyLnggPSB2YWx1ZS54L1BUTV9SQVRJTztcbiAgICAgICAgICAgICAgICAgICAgdGVtcEIyVmVjMi55ID0gdmFsdWUueS9QVE1fUkFUSU87XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldFRhcmdldCh0ZW1wQjJWZWMyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHNwcmluZyBmcmVxdWVuY3kuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5by557Cn57O75pWw44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmcmVxdWVuY3lcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5mcmVxdWVuY3knLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZXF1ZW5jeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZXF1ZW5jeSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRGcmVxdWVuY3kodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZGFtcGluZyByYXRpby5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpmLvlsLzvvIzooajnpLrlhbPoioLlj5jlvaLlkI7vvIzmgaLlpI3liLDliJ3lp4vnirbmgIHlj5fliLDnmoTpmLvlipvjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRhbXBpbmdSYXRpb1xuICAgICAgICAgKiBAcHJvcGVydHkgMFxuICAgICAgICAgKi9cbiAgICAgICAgZGFtcGluZ1JhdGlvOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5kYW1waW5nUmF0aW8nLCAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhbXBpbmdSYXRpbztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhbXBpbmdSYXRpbyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXREYW1waW5nUmF0aW8odmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbWF4aW11bSBmb3JjZVxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOacgOWkp+mYu+WKm+WAvFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbWF4Rm9yY2VcbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgbWF4Rm9yY2U6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm1heEZvcmNlJywgICAgICAgICAgICBcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heEZvcmNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4Rm9yY2UgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuU2V0TWF4Rm9yY2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtb3VzZVJlZ2lvbiA9IHRoaXMubW91c2VSZWdpb24gfHwgdGhpcy5ub2RlO1xuICAgICAgICBtb3VzZVJlZ2lvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoQmVnYW4sIHRoaXMpO1xuICAgICAgICBtb3VzZVJlZ2lvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcbiAgICAgICAgbW91c2VSZWdpb24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xuICAgICAgICBtb3VzZVJlZ2lvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgfSxcblxuICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBtYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKTtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuX3ByZXNzUG9pbnQgPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNjLkNhbWVyYSAmJiBjYy5DYW1lcmEubWFpbikge1xuICAgICAgICAgICAgdGFyZ2V0ID0gY2MuQ2FtZXJhLm1haW4uZ2V0U2NyZWVuVG9Xb3JsZFBvaW50KHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29sbGlkZXIgPSBtYW5hZ2VyLnRlc3RQb2ludCggdGFyZ2V0ICk7XG4gICAgICAgIGlmICghY29sbGlkZXIpIHJldHVybjtcblxuICAgICAgICB2YXIgYm9keSA9IHRoaXMuY29ubmVjdGVkQm9keSA9IGNvbGxpZGVyLmJvZHk7XG4gICAgICAgIGJvZHkuYXdha2UgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWF4Rm9yY2UgPSAxMDAwICogdGhpcy5jb25uZWN0ZWRCb2R5LmdldE1hc3MoKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH0sXG5cbiAgICBvblRvdWNoTW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3ByZXNzUG9pbnQgPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIH0sXG5cbiAgICBvblRvdWNoRW5kOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9wcmVzc1BvaW50ID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUpvaW50RGVmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWYgPSBuZXcgYjIuTW91c2VKb2ludERlZigpO1xuICAgICAgICB0ZW1wQjJWZWMyLnggPSB0aGlzLnRhcmdldC54L1BUTV9SQVRJTztcbiAgICAgICAgdGVtcEIyVmVjMi55ID0gdGhpcy50YXJnZXQueS9QVE1fUkFUSU87XG4gICAgICAgIGRlZi50YXJnZXQgPSB0ZW1wQjJWZWMyO1xuICAgICAgICBkZWYubWF4Rm9yY2UgPSB0aGlzLm1heEZvcmNlO1xuICAgICAgICBkZWYuZGFtcGluZ1JhdGlvID0gdGhpcy5kYW1waW5nUmF0aW87XG4gICAgICAgIGRlZi5mcmVxdWVuY3lIeiA9IHRoaXMuZnJlcXVlbmN5O1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wcmVzc1BvaW50IHx8ICF0aGlzLl9pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYW1lcmEgPSBjYy5DYW1lcmEuZmluZENhbWVyYSh0aGlzLm5vZGUpO1xuICAgICAgICBpZiAoY2FtZXJhKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IGNhbWVyYS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQodGhpcy5fcHJlc3NQb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMuX3ByZXNzUG9pbnQ7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuTW91c2VKb2ludCA9IG1vZHVsZS5leHBvcnRzID0gTW91c2VKb2ludDtcbiJdfQ==