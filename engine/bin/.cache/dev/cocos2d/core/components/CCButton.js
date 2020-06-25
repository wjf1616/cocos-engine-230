
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCButton.js';
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
var Component = require('./CCComponent');

var GraySpriteState = require('../utils/gray-sprite-state');
/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */


var Transition = cc.Enum({
  /**
   * !#en The none type.
   * !#zh 不做任何过渡
   * @property {Number} NONE
   */
  NONE: 0,

  /**
   * !#en The color type.
   * !#zh 颜色过渡
   * @property {Number} COLOR
   */
  COLOR: 1,

  /**
   * !#en The sprite type.
   * !#zh 精灵过渡
   * @property {Number} SPRITE
   */
  SPRITE: 2,

  /**
   * !#en The scale type
   * !#zh 缩放过渡
   * @property {Number} SCALE
   */
  SCALE: 3
});
var State = cc.Enum({
  NORMAL: 0,
  HOVER: 1,
  PRESSED: 2,
  DISABLED: 3
});
/**
 * !#en
 * Button has 4 Transition types<br/>
 * When Button state changed:<br/>
 *  If Transition type is Button.Transition.NONE, Button will do nothing<br/>
 *  If Transition type is Button.Transition.COLOR, Button will change target's color<br/>
 *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite<br/>
 *  If Transition type is Button.Transition.SCALE, Button will change target node's scale<br/>
 *
 * Button will trigger 5 events:<br/>
 *  Button.EVENT_TOUCH_DOWN<br/>
 *  Button.EVENT_TOUCH_UP<br/>
 *  Button.EVENT_HOVER_IN<br/>
 *  Button.EVENT_HOVER_MOVE<br/>
 *  Button.EVENT_HOVER_OUT<br/>
 *  User can get the current clicked node with 'event.target' from event object which is passed as parameter in the callback function of click event.
 *
 * !#zh
 * 按钮组件。可以被按下，或者点击。
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
 * 
 *   - Button.Transition.NONE   // 不做任何过渡
 *   - Button.Transition.COLOR  // 进行颜色之间过渡
 *   - Button.Transition.SPRITE // 进行精灵之间过渡
 *   - Button.Transition.SCALE // 进行缩放过渡
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
 * 以下事件可以在全平台上都触发：
 * 
 *   - cc.Node.EventType.TOUCH_START  // 按下时事件
 *   - cc.Node.EventType.TOUCH_Move   // 按住移动后事件
 *   - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
 *   - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
 * 
 * 以下事件只在 PC 平台上触发：
 * 
 *   - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
 *   - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
 *   - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
 *   - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
 *   - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
 *   - cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件
 * 
 * 用户可以通过获取 __点击事件__ 回调函数的参数 event 的 target 属性获取当前点击对象。
 * @class Button
 * @extends Component
 * @uses GraySpriteState
 * @example
 *
 * // Add an event to the button.
 * button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
 *     cc.log("This is a callback after the trigger event");
 * });

 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', function (button) {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 *
 */

var Button = cc.Class({
  name: 'cc.Button',
  "extends": Component,
  mixins: [GraySpriteState],
  ctor: function ctor() {
    this._pressed = false;
    this._hovered = false;
    this._fromColor = null;
    this._toColor = null;
    this._time = 0;
    this._transitionFinished = true; // init _originalScale in __preload()

    this._fromScale = cc.Vec2.ZERO;
    this._toScale = cc.Vec2.ZERO;
    this._originalScale = null;
    this._graySpriteMaterial = null;
    this._spriteMaterial = null;
    this._sprite = null;
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/Button',
    help: 'i18n:COMPONENT.help_url.button',
    inspector: 'packages://inspector/inspectors/comps/button.js',
    executeInEditMode: true
  },
  properties: {
    /**
     * !#en
     * Whether the Button is disabled.
     * If true, the Button will trigger event and do transition.
     * !#zh
     * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
     * @property {Boolean} interactable
     * @default true
     */
    interactable: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.interactable',
      notify: function notify() {
        this._updateState();

        if (!this.interactable) {
          this._resetState();
        }
      },
      animatable: false
    },
    _resizeToTarget: {
      animatable: false,
      set: function set(value) {
        if (value) {
          this._resizeNodeToTargetNode();
        }
      }
    },

    /**
     * !#en When this flag is true, Button target sprite will turn gray when interactable is false.
     * !#zh 如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰
     * @property {Boolean} enableAutoGrayEffect
     */
    enableAutoGrayEffect: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.auto_gray_effect',
      notify: function notify() {
        this._updateDisabledState();
      }
    },

    /**
     * !#en Transition type
     * !#zh 按钮状态改变时过渡方式。
     * @property {Button.Transition} transition
     * @default Button.Transition.Node
     */
    transition: {
      "default": Transition.NONE,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.transition',
      type: Transition,
      animatable: false,
      notify: function notify(oldValue) {
        this._updateTransition(oldValue);
      },
      formerlySerializedAs: 'transition'
    },
    // color transition

    /**
     * !#en Normal state color.
     * !#zh 普通状态下按钮所显示的颜色。
     * @property {Color} normalColor
     */
    normalColor: {
      "default": cc.Color.WHITE,
      displayName: 'Normal',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.NORMAL) {
          this._getTarget().opacity = this.normalColor.a;
        }

        this._updateState();
      }
    },

    /**
     * !#en Pressed state color
     * !#zh 按下状态时按钮所显示的颜色。
     * @property {Color} pressedColor
     */
    pressedColor: {
      "default": cc.color(211, 211, 211),
      displayName: 'Pressed',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.PRESSED) {
          this._getTarget().opacity = this.pressedColor.a;
        }

        this._updateState();
      },
      formerlySerializedAs: 'pressedColor'
    },

    /**
     * !#en Hover state color
     * !#zh 悬停状态下按钮所显示的颜色。
     * @property {Color} hoverColor
     */
    hoverColor: {
      "default": cc.Color.WHITE,
      displayName: 'Hover',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.hover_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.HOVER) {
          this._getTarget().opacity = this.hoverColor.a;
        }

        this._updateState();
      },
      formerlySerializedAs: 'hoverColor'
    },

    /**
     * !#en Disabled state color
     * !#zh 禁用状态下按钮所显示的颜色。
     * @property {Color} disabledColor
     */
    disabledColor: {
      "default": cc.color(124, 124, 124),
      displayName: 'Disabled',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.disabled_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.DISABLED) {
          this._getTarget().opacity = this.disabledColor.a;
        }

        this._updateState();
      }
    },

    /**
     * !#en Color and Scale transition duration
     * !#zh 颜色过渡和缩放过渡时所需时间
     * @property {Number} duration
     */
    duration: {
      "default": 0.1,
      range: [0, 10],
      tooltip: CC_DEV && 'i18n:COMPONENT.button.duration'
    },

    /**
     * !#en  When user press the button, the button will zoom to a scale.
     * The final scale of the button  equals (button original scale * zoomScale)
     * !#zh 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale
     * @property {Number} zoomScale
     */
    zoomScale: {
      "default": 1.2,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.zoom_scale'
    },
    // sprite transition

    /**
     * !#en Normal state sprite
     * !#zh 普通状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} normalSprite
     */
    normalSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Normal',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_sprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en Pressed state sprite
     * !#zh 按下状态时按钮所显示的 Sprite 。
     * @property {SpriteFrame} pressedSprite
     */
    pressedSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Pressed',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_sprite',
      formerlySerializedAs: 'pressedSprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en Hover state sprite
     * !#zh 悬停状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} hoverSprite
     */
    hoverSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Hover',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.hover_sprite',
      formerlySerializedAs: 'hoverSprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en Disabled state sprite
     * !#zh 禁用状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} disabledSprite
     */
    disabledSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Disabled',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.disabled_sprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en
     * Transition target.
     * When Button state changed:
     *  If Transition type is Button.Transition.NONE, Button will do nothing
     *  If Transition type is Button.Transition.COLOR, Button will change target's color
     *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
     * !#zh
     * 需要过渡的目标。
     * 当前按钮状态改变规则：
     * -如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。
     * -如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。
     * -如果 Transition type 选择 Button.Transition.Sprite，按钮会对目标 Sprite 进行 Sprite 之间的过渡。
     * @property {Node} target
     */
    target: {
      "default": null,
      type: cc.Node,
      tooltip: CC_DEV && "i18n:COMPONENT.button.target",
      notify: function notify(oldValue) {
        this._applyTarget();

        if (oldValue && this.target !== oldValue) {
          this._unregisterTargetEvent(oldValue);
        }
      }
    },

    /**
     * !#en If Button is clicked, it will trigger event's handler
     * !#zh 按钮的点击事件列表。
     * @property {Component.EventHandler[]} clickEvents
     */
    clickEvents: {
      "default": [],
      type: cc.Component.EventHandler,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.click_events'
    }
  },
  statics: {
    Transition: Transition
  },
  __preload: function __preload() {
    this._applyTarget();

    this._resetState();
  },
  _resetState: function _resetState() {
    this._pressed = false;
    this._hovered = false; // // Restore button status

    var target = this._getTarget();

    var transition = this.transition;
    var originalScale = this._originalScale;

    if (transition === Transition.COLOR && this.interactable) {
      this._setTargetColor(this.normalColor);
    } else if (transition === Transition.SCALE && originalScale) {
      target.setScale(originalScale.x, originalScale.y);
    }

    this._transitionFinished = true;
  },
  onEnable: function onEnable() {
    // check sprite frames
    if (this.normalSprite) {
      this.normalSprite.ensureLoadTexture();
    }

    if (this.hoverSprite) {
      this.hoverSprite.ensureLoadTexture();
    }

    if (this.pressedSprite) {
      this.pressedSprite.ensureLoadTexture();
    }

    if (this.disabledSprite) {
      this.disabledSprite.ensureLoadTexture();
    }

    if (!CC_EDITOR) {
      this._registerNodeEvent();
    }
  },
  onDisable: function onDisable() {
    this._resetState();

    if (!CC_EDITOR) {
      this._unregisterNodeEvent();
    }
  },
  _getTarget: function _getTarget() {
    return this.target ? this.target : this.node;
  },
  _onTargetSpriteFrameChanged: function _onTargetSpriteFrameChanged(comp) {
    if (this.transition === Transition.SPRITE) {
      this._setCurrentStateSprite(comp.spriteFrame);
    }
  },
  _onTargetColorChanged: function _onTargetColorChanged(color) {
    if (this.transition === Transition.COLOR) {
      this._setCurrentStateColor(color);
    }
  },
  _onTargetScaleChanged: function _onTargetScaleChanged() {
    var target = this._getTarget(); // update _originalScale if target scale changed


    if (this._originalScale) {
      if (this.transition !== Transition.SCALE || this._transitionFinished) {
        this._originalScale.x = target.scaleX;
        this._originalScale.y = target.scaleY;
      }
    }
  },
  _setTargetColor: function _setTargetColor(color) {
    var target = this._getTarget();

    target.color = color;
    target.opacity = color.a;
  },
  _getStateColor: function _getStateColor(state) {
    switch (state) {
      case State.NORMAL:
        return this.normalColor;

      case State.HOVER:
        return this.hoverColor;

      case State.PRESSED:
        return this.pressedColor;

      case State.DISABLED:
        return this.disabledColor;
    }
  },
  _getStateSprite: function _getStateSprite(state) {
    switch (state) {
      case State.NORMAL:
        return this.normalSprite;

      case State.HOVER:
        return this.hoverSprite;

      case State.PRESSED:
        return this.pressedSprite;

      case State.DISABLED:
        return this.disabledSprite;
    }
  },
  _setCurrentStateColor: function _setCurrentStateColor(color) {
    switch (this._getButtonState()) {
      case State.NORMAL:
        this.normalColor = color;
        break;

      case State.HOVER:
        this.hoverColor = color;
        break;

      case State.PRESSED:
        this.pressedColor = color;
        break;

      case State.DISABLED:
        this.disabledColor = color;
        break;
    }
  },
  _setCurrentStateSprite: function _setCurrentStateSprite(spriteFrame) {
    switch (this._getButtonState()) {
      case State.NORMAL:
        this.normalSprite = spriteFrame;
        break;

      case State.HOVER:
        this.hoverSprite = spriteFrame;
        break;

      case State.PRESSED:
        this.pressedSprite = spriteFrame;
        break;

      case State.DISABLED:
        this.disabledSprite = spriteFrame;
        break;
    }
  },
  update: function update(dt) {
    var target = this._getTarget();

    if (this._transitionFinished) return;
    if (this.transition !== Transition.COLOR && this.transition !== Transition.SCALE) return;
    this.time += dt;
    var ratio = 1.0;

    if (this.duration > 0) {
      ratio = this.time / this.duration;
    } // clamp ratio


    if (ratio >= 1) {
      ratio = 1;
    }

    if (this.transition === Transition.COLOR) {
      var color = this._fromColor.lerp(this._toColor, ratio);

      this._setTargetColor(color);
    } // Skip if _originalScale is invalid
    else if (this.transition === Transition.SCALE && this._originalScale) {
        target.scale = this._fromScale.lerp(this._toScale, ratio);
      }

    if (ratio === 1) {
      this._transitionFinished = true;
    }
  },
  _registerNodeEvent: function _registerNodeEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
  },
  _unregisterNodeEvent: function _unregisterNodeEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
    this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
  },
  _registerTargetEvent: function _registerTargetEvent(target) {
    if (CC_EDITOR) {
      target.on('spriteframe-changed', this._onTargetSpriteFrameChanged, this);
      target.on(cc.Node.EventType.COLOR_CHANGED, this._onTargetColorChanged, this);
    }

    target.on(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
  },
  _unregisterTargetEvent: function _unregisterTargetEvent(target) {
    if (CC_EDITOR) {
      target.off('spriteframe-changed', this._onTargetSpriteFrameChanged, this);
      target.off(cc.Node.EventType.COLOR_CHANGED, this._onTargetColorChanged, this);
    }

    target.off(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
  },
  _getTargetSprite: function _getTargetSprite(target) {
    var sprite = null;

    if (target) {
      sprite = target.getComponent(cc.Sprite);
    }

    return sprite;
  },
  _applyTarget: function _applyTarget() {
    var target = this._getTarget();

    this._sprite = this._getTargetSprite(target);

    if (!this._originalScale) {
      this._originalScale = cc.Vec2.ZERO;
    }

    this._originalScale.x = target.scaleX;
    this._originalScale.y = target.scaleY;

    this._registerTargetEvent(target);
  },
  // touch event handler
  _onTouchBegan: function _onTouchBegan(event) {
    if (!this.interactable || !this.enabledInHierarchy) return;
    this._pressed = true;

    this._updateState();

    event.stopPropagation();
  },
  _onTouchMove: function _onTouchMove(event) {
    if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return; // mobile phone will not emit _onMouseMoveOut,
    // so we have to do hit test when touch moving

    var touch = event.touch;

    var hit = this.node._hitTest(touch.getLocation());

    var target = this._getTarget();

    var originalScale = this._originalScale;

    if (this.transition === Transition.SCALE && originalScale) {
      if (hit) {
        this._fromScale.x = originalScale.x;
        this._fromScale.y = originalScale.y;
        this._toScale.x = originalScale.x * this.zoomScale;
        this._toScale.y = originalScale.y * this.zoomScale;
        this._transitionFinished = false;
      } else {
        this.time = 0;
        this._transitionFinished = true;
        target.setScale(originalScale.x, originalScale.y);
      }
    } else {
      var state;

      if (hit) {
        state = State.PRESSED;
      } else {
        state = State.NORMAL;
      }

      this._applyTransition(state);
    }

    event.stopPropagation();
  },
  _onTouchEnded: function _onTouchEnded(event) {
    if (!this.interactable || !this.enabledInHierarchy) return;

    if (this._pressed) {
      cc.Component.EventHandler.emitEvents(this.clickEvents, event);
      this.node.emit('click', this);
    }

    this._pressed = false;

    this._updateState();

    event.stopPropagation();
  },
  _onTouchCancel: function _onTouchCancel() {
    if (!this.interactable || !this.enabledInHierarchy) return;
    this._pressed = false;

    this._updateState();
  },
  _onMouseMoveIn: function _onMouseMoveIn() {
    if (this._pressed || !this.interactable || !this.enabledInHierarchy) return;
    if (this.transition === Transition.SPRITE && !this.hoverSprite) return;

    if (!this._hovered) {
      this._hovered = true;

      this._updateState();
    }
  },
  _onMouseMoveOut: function _onMouseMoveOut() {
    if (this._hovered) {
      this._hovered = false;

      this._updateState();
    }
  },
  // state handler
  _updateState: function _updateState() {
    var state = this._getButtonState();

    this._applyTransition(state);

    this._updateDisabledState();
  },
  _getButtonState: function _getButtonState() {
    var state;

    if (!this.interactable) {
      state = State.DISABLED;
    } else if (this._pressed) {
      state = State.PRESSED;
    } else if (this._hovered) {
      state = State.HOVER;
    } else {
      state = State.NORMAL;
    }

    return state;
  },
  _updateColorTransitionImmediately: function _updateColorTransitionImmediately(state) {
    var color = this._getStateColor(state);

    this._setTargetColor(color);

    this._fromColor = color.clone();
    this._toColor = color;
  },
  _updateColorTransition: function _updateColorTransition(state) {
    if (CC_EDITOR || state === State.DISABLED) {
      this._updateColorTransitionImmediately(state);
    } else {
      var target = this._getTarget();

      var color = this._getStateColor(state);

      this._fromColor = target.color.clone();
      this._toColor = color;
      this.time = 0;
      this._transitionFinished = false;
    }
  },
  _updateSpriteTransition: function _updateSpriteTransition(state) {
    var sprite = this._getStateSprite(state);

    if (this._sprite && sprite) {
      this._sprite.spriteFrame = sprite;
    }
  },
  _updateScaleTransition: function _updateScaleTransition(state) {
    if (state === State.PRESSED) {
      this._zoomUp();
    } else {
      this._zoomBack();
    }
  },
  _zoomUp: function _zoomUp() {
    // skip before __preload()
    if (!this._originalScale) {
      return;
    }

    this._fromScale.x = this._originalScale.x;
    this._fromScale.y = this._originalScale.y;
    this._toScale.x = this._originalScale.x * this.zoomScale;
    this._toScale.y = this._originalScale.y * this.zoomScale;
    this.time = 0;
    this._transitionFinished = false;
  },
  _zoomBack: function _zoomBack() {
    // skip before __preload()
    if (!this._originalScale) {
      return;
    }

    var target = this._getTarget();

    this._fromScale.x = target.scaleX;
    this._fromScale.y = target.scaleY;
    this._toScale.x = this._originalScale.x;
    this._toScale.y = this._originalScale.y;
    this.time = 0;
    this._transitionFinished = false;
  },
  _updateTransition: function _updateTransition(oldTransition) {
    // Reset to normal data when change transition.
    if (oldTransition === Transition.COLOR) {
      this._updateColorTransitionImmediately(State.NORMAL);
    } else if (oldTransition === Transition.SPRITE) {
      this._updateSpriteTransition(State.NORMAL);
    }

    this._updateState();
  },
  _applyTransition: function _applyTransition(state) {
    var transition = this.transition;

    if (transition === Transition.COLOR) {
      this._updateColorTransition(state);
    } else if (transition === Transition.SPRITE) {
      this._updateSpriteTransition(state);
    } else if (transition === Transition.SCALE) {
      this._updateScaleTransition(state);
    }
  },
  _resizeNodeToTargetNode: CC_EDITOR && function () {
    this.node.setContentSize(this._getTarget().getContentSize());
  },
  _updateDisabledState: function _updateDisabledState() {
    if (this._sprite) {
      var useGrayMaterial = false;

      if (this.enableAutoGrayEffect) {
        if (!(this.transition === Transition.SPRITE && this.disabledSprite)) {
          if (!this.interactable) {
            useGrayMaterial = true;
          }
        }
      }

      this._switchGrayMaterial(useGrayMaterial, this._sprite);
    }
  }
});
cc.Button = module.exports = Button;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event click
 * @param {Event.EventCustom} event
 * @param {Button} button - The Button component.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQnV0dG9uLmpzIl0sIm5hbWVzIjpbIkNvbXBvbmVudCIsInJlcXVpcmUiLCJHcmF5U3ByaXRlU3RhdGUiLCJUcmFuc2l0aW9uIiwiY2MiLCJFbnVtIiwiTk9ORSIsIkNPTE9SIiwiU1BSSVRFIiwiU0NBTEUiLCJTdGF0ZSIsIk5PUk1BTCIsIkhPVkVSIiwiUFJFU1NFRCIsIkRJU0FCTEVEIiwiQnV0dG9uIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwiY3RvciIsIl9wcmVzc2VkIiwiX2hvdmVyZWQiLCJfZnJvbUNvbG9yIiwiX3RvQ29sb3IiLCJfdGltZSIsIl90cmFuc2l0aW9uRmluaXNoZWQiLCJfZnJvbVNjYWxlIiwiVmVjMiIsIlpFUk8iLCJfdG9TY2FsZSIsIl9vcmlnaW5hbFNjYWxlIiwiX2dyYXlTcHJpdGVNYXRlcmlhbCIsIl9zcHJpdGVNYXRlcmlhbCIsIl9zcHJpdGUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsImluc3BlY3RvciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsImludGVyYWN0YWJsZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJub3RpZnkiLCJfdXBkYXRlU3RhdGUiLCJfcmVzZXRTdGF0ZSIsImFuaW1hdGFibGUiLCJfcmVzaXplVG9UYXJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9yZXNpemVOb2RlVG9UYXJnZXROb2RlIiwiZW5hYmxlQXV0b0dyYXlFZmZlY3QiLCJfdXBkYXRlRGlzYWJsZWRTdGF0ZSIsInRyYW5zaXRpb24iLCJ0eXBlIiwib2xkVmFsdWUiLCJfdXBkYXRlVHJhbnNpdGlvbiIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwibm9ybWFsQ29sb3IiLCJDb2xvciIsIldISVRFIiwiZGlzcGxheU5hbWUiLCJfZ2V0QnV0dG9uU3RhdGUiLCJfZ2V0VGFyZ2V0Iiwib3BhY2l0eSIsImEiLCJwcmVzc2VkQ29sb3IiLCJjb2xvciIsImhvdmVyQ29sb3IiLCJkaXNhYmxlZENvbG9yIiwiZHVyYXRpb24iLCJyYW5nZSIsInpvb21TY2FsZSIsIm5vcm1hbFNwcml0ZSIsIlNwcml0ZUZyYW1lIiwicHJlc3NlZFNwcml0ZSIsImhvdmVyU3ByaXRlIiwiZGlzYWJsZWRTcHJpdGUiLCJ0YXJnZXQiLCJOb2RlIiwiX2FwcGx5VGFyZ2V0IiwiX3VucmVnaXN0ZXJUYXJnZXRFdmVudCIsImNsaWNrRXZlbnRzIiwiRXZlbnRIYW5kbGVyIiwic3RhdGljcyIsIl9fcHJlbG9hZCIsIm9yaWdpbmFsU2NhbGUiLCJfc2V0VGFyZ2V0Q29sb3IiLCJzZXRTY2FsZSIsIngiLCJ5Iiwib25FbmFibGUiLCJlbnN1cmVMb2FkVGV4dHVyZSIsIl9yZWdpc3Rlck5vZGVFdmVudCIsIm9uRGlzYWJsZSIsIl91bnJlZ2lzdGVyTm9kZUV2ZW50Iiwibm9kZSIsIl9vblRhcmdldFNwcml0ZUZyYW1lQ2hhbmdlZCIsImNvbXAiLCJfc2V0Q3VycmVudFN0YXRlU3ByaXRlIiwic3ByaXRlRnJhbWUiLCJfb25UYXJnZXRDb2xvckNoYW5nZWQiLCJfc2V0Q3VycmVudFN0YXRlQ29sb3IiLCJfb25UYXJnZXRTY2FsZUNoYW5nZWQiLCJzY2FsZVgiLCJzY2FsZVkiLCJfZ2V0U3RhdGVDb2xvciIsInN0YXRlIiwiX2dldFN0YXRlU3ByaXRlIiwidXBkYXRlIiwiZHQiLCJ0aW1lIiwicmF0aW8iLCJsZXJwIiwic2NhbGUiLCJvbiIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwiX29uVG91Y2hCZWdhbiIsIlRPVUNIX01PVkUiLCJfb25Ub3VjaE1vdmUiLCJUT1VDSF9FTkQiLCJfb25Ub3VjaEVuZGVkIiwiVE9VQ0hfQ0FOQ0VMIiwiX29uVG91Y2hDYW5jZWwiLCJNT1VTRV9FTlRFUiIsIl9vbk1vdXNlTW92ZUluIiwiTU9VU0VfTEVBVkUiLCJfb25Nb3VzZU1vdmVPdXQiLCJvZmYiLCJfcmVnaXN0ZXJUYXJnZXRFdmVudCIsIkNPTE9SX0NIQU5HRUQiLCJTQ0FMRV9DSEFOR0VEIiwiX2dldFRhcmdldFNwcml0ZSIsInNwcml0ZSIsImdldENvbXBvbmVudCIsIlNwcml0ZSIsImV2ZW50IiwiZW5hYmxlZEluSGllcmFyY2h5Iiwic3RvcFByb3BhZ2F0aW9uIiwidG91Y2giLCJoaXQiLCJfaGl0VGVzdCIsImdldExvY2F0aW9uIiwiX2FwcGx5VHJhbnNpdGlvbiIsImVtaXRFdmVudHMiLCJlbWl0IiwiX3VwZGF0ZUNvbG9yVHJhbnNpdGlvbkltbWVkaWF0ZWx5IiwiY2xvbmUiLCJfdXBkYXRlQ29sb3JUcmFuc2l0aW9uIiwiX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24iLCJfdXBkYXRlU2NhbGVUcmFuc2l0aW9uIiwiX3pvb21VcCIsIl96b29tQmFjayIsIm9sZFRyYW5zaXRpb24iLCJzZXRDb250ZW50U2l6ZSIsImdldENvbnRlbnRTaXplIiwidXNlR3JheU1hdGVyaWFsIiwiX3N3aXRjaEdyYXlNYXRlcmlhbCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxlQUFELENBQXpCOztBQUNBLElBQU1DLGVBQWUsR0FBR0QsT0FBTyxDQUFDLDRCQUFELENBQS9CO0FBRUE7Ozs7Ozs7QUFLQSxJQUFJRSxVQUFVLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3JCOzs7OztBQUtBQyxFQUFBQSxJQUFJLEVBQUUsQ0FOZTs7QUFRckI7Ozs7O0FBS0FDLEVBQUFBLEtBQUssRUFBRSxDQWJjOztBQWVyQjs7Ozs7QUFLQUMsRUFBQUEsTUFBTSxFQUFFLENBcEJhOztBQXFCckI7Ozs7O0FBS0FDLEVBQUFBLEtBQUssRUFBRTtBQTFCYyxDQUFSLENBQWpCO0FBNkJBLElBQU1DLEtBQUssR0FBR04sRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDbEJNLEVBQUFBLE1BQU0sRUFBRSxDQURVO0FBRWxCQyxFQUFBQSxLQUFLLEVBQUUsQ0FGVztBQUdsQkMsRUFBQUEsT0FBTyxFQUFFLENBSFM7QUFJbEJDLEVBQUFB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S3BCLE9BQVQsRUFBa0I7QUFDZCxVQUFJNkgsZUFBZSxHQUFHLEtBQXRCOztBQUVBLFVBQUksS0FBSzFHLG9CQUFULEVBQStCO0FBQzNCLFlBQUksRUFBRSxLQUFLRSxVQUFMLEtBQW9CbkQsVUFBVSxDQUFDSyxNQUEvQixJQUF5QyxLQUFLc0UsY0FBaEQsQ0FBSixFQUFxRTtBQUNqRSxjQUFJLENBQUMsS0FBS3JDLFlBQVYsRUFBd0I7QUFDcEJxSCxZQUFBQSxlQUFlLEdBQUcsSUFBbEI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsV0FBS0MsbUJBQUwsQ0FBeUJELGVBQXpCLEVBQTBDLEtBQUs3SCxPQUEvQztBQUNIO0FBQ0o7QUF4dEJpQixDQUFULENBQWI7QUEydEJBN0IsRUFBRSxDQUFDVyxNQUFILEdBQVlpSixNQUFNLENBQUNDLE9BQVAsR0FBaUJsSixNQUE3QjtBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuL0NDQ29tcG9uZW50Jyk7XG5jb25zdCBHcmF5U3ByaXRlU3RhdGUgPSByZXF1aXJlKCcuLi91dGlscy9ncmF5LXNwcml0ZS1zdGF0ZScpO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdHJhbnNpdGlvbiB0eXBlLlxuICogISN6aCDov4fmuKHnsbvlnotcbiAqIEBlbnVtIEJ1dHRvbi5UcmFuc2l0aW9uXG4gKi9cbmxldCBUcmFuc2l0aW9uID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbm9uZSB0eXBlLlxuICAgICAqICEjemgg5LiN5YGa5Lu75L2V6L+H5rihXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5PTkVcbiAgICAgKi9cbiAgICBOT05FOiAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY29sb3IgdHlwZS5cbiAgICAgKiAhI3poIOminOiJsui/h+a4oVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDT0xPUlxuICAgICAqL1xuICAgIENPTE9SOiAxLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc3ByaXRlIHR5cGUuXG4gICAgICogISN6aCDnsr7ngbXov4fmuKFcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1BSSVRFXG4gICAgICovXG4gICAgU1BSSVRFOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNjYWxlIHR5cGVcbiAgICAgKiAhI3poIOe8qeaUvui/h+a4oVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ0FMRVxuICAgICAqL1xuICAgIFNDQUxFOiAzXG59KTtcblxuY29uc3QgU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBOT1JNQUw6IDAsXG4gICAgSE9WRVI6IDEsXG4gICAgUFJFU1NFRDogMixcbiAgICBESVNBQkxFRDogMyxcbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIEJ1dHRvbiBoYXMgNCBUcmFuc2l0aW9uIHR5cGVzPGJyLz5cbiAqIFdoZW4gQnV0dG9uIHN0YXRlIGNoYW5nZWQ6PGJyLz5cbiAqICBJZiBUcmFuc2l0aW9uIHR5cGUgaXMgQnV0dG9uLlRyYW5zaXRpb24uTk9ORSwgQnV0dG9uIHdpbGwgZG8gbm90aGluZzxici8+XG4gKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLkNPTE9SLCBCdXR0b24gd2lsbCBjaGFuZ2UgdGFyZ2V0J3MgY29sb3I8YnIvPlxuICogIElmIFRyYW5zaXRpb24gdHlwZSBpcyBCdXR0b24uVHJhbnNpdGlvbi5TUFJJVEUsIEJ1dHRvbiB3aWxsIGNoYW5nZSB0YXJnZXQgU3ByaXRlJ3Mgc3ByaXRlPGJyLz5cbiAqICBJZiBUcmFuc2l0aW9uIHR5cGUgaXMgQnV0dG9uLlRyYW5zaXRpb24uU0NBTEUsIEJ1dHRvbiB3aWxsIGNoYW5nZSB0YXJnZXQgbm9kZSdzIHNjYWxlPGJyLz5cbiAqXG4gKiBCdXR0b24gd2lsbCB0cmlnZ2VyIDUgZXZlbnRzOjxici8+XG4gKiAgQnV0dG9uLkVWRU5UX1RPVUNIX0RPV048YnIvPlxuICogIEJ1dHRvbi5FVkVOVF9UT1VDSF9VUDxici8+XG4gKiAgQnV0dG9uLkVWRU5UX0hPVkVSX0lOPGJyLz5cbiAqICBCdXR0b24uRVZFTlRfSE9WRVJfTU9WRTxici8+XG4gKiAgQnV0dG9uLkVWRU5UX0hPVkVSX09VVDxici8+XG4gKiAgVXNlciBjYW4gZ2V0IHRoZSBjdXJyZW50IGNsaWNrZWQgbm9kZSB3aXRoICdldmVudC50YXJnZXQnIGZyb20gZXZlbnQgb2JqZWN0IHdoaWNoIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIgaW4gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG9mIGNsaWNrIGV2ZW50LlxuICpcbiAqICEjemhcbiAqIOaMiemSrue7hOS7tuOAguWPr+S7peiiq+aMieS4i++8jOaIluiAheeCueWHu+OAglxuICpcbiAqIOaMiemSruWPr+S7pemAmui/h+S/ruaUuSBUcmFuc2l0aW9uIOadpeiuvue9ruaMiemSrueKtuaAgei/h+a4oeeahOaWueW8j++8mlxuICogXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uTk9ORSAgIC8vIOS4jeWBmuS7u+S9lei/h+a4oVxuICogICAtIEJ1dHRvbi5UcmFuc2l0aW9uLkNPTE9SICAvLyDov5vooYzpopzoibLkuYvpl7Tov4fmuKFcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5TUFJJVEUgLy8g6L+b6KGM57K+54G15LmL6Ze06L+H5rihXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uU0NBTEUgLy8g6L+b6KGM57yp5pS+6L+H5rihXG4gKlxuICog5oyJ6ZKu5Y+v5Lul57uR5a6a5LqL5Lu277yI5L2G5piv5b+F6aG76KaB5Zyo5oyJ6ZKu55qEIE5vZGUg5LiK5omN6IO957uR5a6a5LqL5Lu277yJ77yaPGJyLz5cbiAqIOS7peS4i+S6i+S7tuWPr+S7peWcqOWFqOW5s+WPsOS4iumDveinpuWPke+8mlxuICogXG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQgIC8vIOaMieS4i+aXtuS6i+S7tlxuICogICAtIGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01vdmUgICAvLyDmjInkvY/np7vliqjlkI7kuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQgICAgLy8g5oyJ5LiL5ZCO5p2+5byA5ZCO5LqL5Lu2XG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMIC8vIOaMieS4i+WPlua2iOS6i+S7tlxuICogXG4gKiDku6XkuIvkuovku7blj6rlnKggUEMg5bmz5Y+w5LiK6Kem5Y+R77yaXG4gKiBcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOICAvLyDpvKDmoIfmjInkuIvml7bkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFICAvLyDpvKDmoIfmjInkvY/np7vliqjlkI7kuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiAvLyDpvKDmoIfov5vlhaXnm67moIfkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSAvLyDpvKDmoIfnprvlvIDnm67moIfkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9VUCAgICAvLyDpvKDmoIfmnb7lvIDkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCAvLyDpvKDmoIfmu5rova7kuovku7ZcbiAqIFxuICog55So5oi35Y+v5Lul6YCa6L+H6I635Y+WIF9f54K55Ye75LqL5Lu2X18g5Zue6LCD5Ye95pWw55qE5Y+C5pWwIGV2ZW50IOeahCB0YXJnZXQg5bGe5oCn6I635Y+W5b2T5YmN54K55Ye75a+56LGh44CCXG4gKiBAY2xhc3MgQnV0dG9uXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqIEB1c2VzIEdyYXlTcHJpdGVTdGF0ZVxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBZGQgYW4gZXZlbnQgdG8gdGhlIGJ1dHRvbi5cbiAqIGJ1dHRvbi5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjYy5sb2coXCJUaGlzIGlzIGEgY2FsbGJhY2sgYWZ0ZXIgdGhlIHRyaWdnZXIgZXZlbnRcIik7XG4gKiB9KTtcblxuICogLy8gWW91IGNvdWxkIGFsc28gYWRkIGEgY2xpY2sgZXZlbnRcbiAqIC8vTm90ZTogSW4gdGhpcyB3YXksIHlvdSBjYW4ndCBnZXQgdGhlIHRvdWNoIGV2ZW50IGluZm8sIHNvIHVzZSBpdCB3aXNlbHkuXG4gKiBidXR0b24ubm9kZS5vbignY2xpY2snLCBmdW5jdGlvbiAoYnV0dG9uKSB7XG4gKiAgICAvL1RoZSBldmVudCBpcyBhIGN1c3RvbSBldmVudCwgeW91IGNvdWxkIGdldCB0aGUgQnV0dG9uIGNvbXBvbmVudCB2aWEgZmlyc3QgYXJndW1lbnRcbiAqIH0pXG4gKlxuICovXG5sZXQgQnV0dG9uID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5CdXR0b24nLFxuICAgIGV4dGVuZHM6IENvbXBvbmVudCxcbiAgICBtaXhpbnM6IFtHcmF5U3ByaXRlU3RhdGVdLFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mcm9tQ29sb3IgPSBudWxsO1xuICAgICAgICB0aGlzLl90b0NvbG9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIC8vIGluaXQgX29yaWdpbmFsU2NhbGUgaW4gX19wcmVsb2FkKClcbiAgICAgICAgdGhpcy5fZnJvbVNjYWxlID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICB0aGlzLl90b1NjYWxlID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbFNjYWxlID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9ncmF5U3ByaXRlTWF0ZXJpYWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9zcHJpdGVNYXRlcmlhbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fc3ByaXRlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL0J1dHRvbicsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5idXR0b24nLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL2J1dHRvbi5qcycsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogV2hldGhlciB0aGUgQnV0dG9uIGlzIGRpc2FibGVkLlxuICAgICAgICAgKiBJZiB0cnVlLCB0aGUgQnV0dG9uIHdpbGwgdHJpZ2dlciBldmVudCBhbmQgZG8gdHJhbnNpdGlvbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmjInpkq7kuovku7bmmK/lkKbooqvlk43lupTvvIzlpoLmnpzkuLogZmFsc2XvvIzliJnmjInpkq7lsIbooqvnpoHnlKjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpbnRlcmFjdGFibGVcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgaW50ZXJhY3RhYmxlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uaW50ZXJhY3RhYmxlJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9yZXNpemVUb1RhcmdldDoge1xuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZU5vZGVUb1RhcmdldE5vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hlbiB0aGlzIGZsYWcgaXMgdHJ1ZSwgQnV0dG9uIHRhcmdldCBzcHJpdGUgd2lsbCB0dXJuIGdyYXkgd2hlbiBpbnRlcmFjdGFibGUgaXMgZmFsc2UuXG4gICAgICAgICAqICEjemgg5aaC5p6c6L+Z5Liq5qCH6K6w5Li6IHRydWXvvIzlvZMgYnV0dG9uIOeahCBpbnRlcmFjdGFibGUg5bGe5oCn5Li6IGZhbHNlIOeahOaXtuWAme+8jOS8muS9v+eUqOWGhee9riBzaGFkZXIg6K6pIGJ1dHRvbiDnmoQgdGFyZ2V0IOiKgueCueeahCBzcHJpdGUg57uE5Lu25Y+Y54GwXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlQXV0b0dyYXlFZmZlY3RcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUF1dG9HcmF5RWZmZWN0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmF1dG9fZ3JheV9lZmZlY3QnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEaXNhYmxlZFN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVHJhbnNpdGlvbiB0eXBlXG4gICAgICAgICAqICEjemgg5oyJ6ZKu54q25oCB5pS55Y+Y5pe26L+H5rih5pa55byP44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7QnV0dG9uLlRyYW5zaXRpb259IHRyYW5zaXRpb25cbiAgICAgICAgICogQGRlZmF1bHQgQnV0dG9uLlRyYW5zaXRpb24uTm9kZVxuICAgICAgICAgKi9cbiAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogVHJhbnNpdGlvbi5OT05FLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24udHJhbnNpdGlvbicsXG4gICAgICAgICAgICB0eXBlOiBUcmFuc2l0aW9uLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVHJhbnNpdGlvbihvbGRWYWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICd0cmFuc2l0aW9uJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNvbG9yIHRyYW5zaXRpb25cblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBOb3JtYWwgc3RhdGUgY29sb3IuXG4gICAgICAgICAqICEjemgg5pmu6YCa54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qE6aKc6Imy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IG5vcm1hbENvbG9yXG4gICAgICAgICAqL1xuICAgICAgICBub3JtYWxDb2xvcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogY2MuQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ05vcm1hbCcsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5ub3JtYWxfY29sb3InLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLkNvbG9yICYmIHRoaXMuX2dldEJ1dHRvblN0YXRlKCkgPT09IFN0YXRlLk5PUk1BTCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRUYXJnZXQoKS5vcGFjaXR5ID0gdGhpcy5ub3JtYWxDb2xvci5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFByZXNzZWQgc3RhdGUgY29sb3JcbiAgICAgICAgICogISN6aCDmjInkuIvnirbmgIHml7bmjInpkq7miYDmmL7npLrnmoTpopzoibLjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gcHJlc3NlZENvbG9yXG4gICAgICAgICAqL1xuICAgICAgICBwcmVzc2VkQ29sb3I6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLmNvbG9yKDIxMSwgMjExLCAyMTEpLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdQcmVzc2VkJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLnByZXNzZWRfY29sb3InLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLkNvbG9yICYmIHRoaXMuX2dldEJ1dHRvblN0YXRlKCkgPT09IFN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0VGFyZ2V0KCkub3BhY2l0eSA9IHRoaXMucHJlc3NlZENvbG9yLmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdwcmVzc2VkQ29sb3InXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSG92ZXIgc3RhdGUgY29sb3JcbiAgICAgICAgICogISN6aCDmgqzlgZznirbmgIHkuIvmjInpkq7miYDmmL7npLrnmoTpopzoibLjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gaG92ZXJDb2xvclxuICAgICAgICAgKi9cbiAgICAgICAgaG92ZXJDb2xvcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogY2MuQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0hvdmVyJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmhvdmVyX2NvbG9yJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5Db2xvciAmJiB0aGlzLl9nZXRCdXR0b25TdGF0ZSgpID09PSBTdGF0ZS5IT1ZFUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRUYXJnZXQoKS5vcGFjaXR5ID0gdGhpcy5ob3ZlckNvbG9yLmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdob3ZlckNvbG9yJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIERpc2FibGVkIHN0YXRlIGNvbG9yXG4gICAgICAgICAqICEjemgg56aB55So54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qE6aKc6Imy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IGRpc2FibGVkQ29sb3JcbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVkQ29sb3I6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLmNvbG9yKDEyNCwgMTI0LCAxMjQpLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdEaXNhYmxlZCcsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5kaXNhYmxlZF9jb2xvcicsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ29sb3IgJiYgdGhpcy5fZ2V0QnV0dG9uU3RhdGUoKSA9PT0gU3RhdGUuRElTQUJMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0VGFyZ2V0KCkub3BhY2l0eSA9IHRoaXMuZGlzYWJsZWRDb2xvci5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENvbG9yIGFuZCBTY2FsZSB0cmFuc2l0aW9uIGR1cmF0aW9uXG4gICAgICAgICAqICEjemgg6aKc6Imy6L+H5rih5ZKM57yp5pS+6L+H5rih5pe25omA6ZyA5pe26Ze0XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgZHVyYXRpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAuMSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgMTBdLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uZHVyYXRpb24nLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuICBXaGVuIHVzZXIgcHJlc3MgdGhlIGJ1dHRvbiwgdGhlIGJ1dHRvbiB3aWxsIHpvb20gdG8gYSBzY2FsZS5cbiAgICAgICAgICogVGhlIGZpbmFsIHNjYWxlIG9mIHRoZSBidXR0b24gIGVxdWFscyAoYnV0dG9uIG9yaWdpbmFsIHNjYWxlICogem9vbVNjYWxlKVxuICAgICAgICAgKiAhI3poIOW9k+eUqOaIt+eCueWHu+aMiemSruWQju+8jOaMiemSruS8mue8qeaUvuWIsOS4gOS4quWAvO+8jOi/meS4quWAvOetieS6jiBCdXR0b24g5Y6f5aeLIHNjYWxlICogem9vbVNjYWxlXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB6b29tU2NhbGVcbiAgICAgICAgICovXG4gICAgICAgIHpvb21TY2FsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMS4yLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uem9vbV9zY2FsZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBzcHJpdGUgdHJhbnNpdGlvblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBOb3JtYWwgc3RhdGUgc3ByaXRlXG4gICAgICAgICAqICEjemgg5pmu6YCa54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qEIFNwcml0ZSDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGVGcmFtZX0gbm9ybWFsU3ByaXRlXG4gICAgICAgICAqL1xuICAgICAgICBub3JtYWxTcHJpdGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnTm9ybWFsJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLm5vcm1hbF9zcHJpdGUnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFByZXNzZWQgc3RhdGUgc3ByaXRlXG4gICAgICAgICAqICEjemgg5oyJ5LiL54q25oCB5pe25oyJ6ZKu5omA5pi+56S655qEIFNwcml0ZSDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGVGcmFtZX0gcHJlc3NlZFNwcml0ZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJlc3NlZFNwcml0ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdQcmVzc2VkJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLnByZXNzZWRfc3ByaXRlJyxcbiAgICAgICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiAncHJlc3NlZFNwcml0ZScsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSG92ZXIgc3RhdGUgc3ByaXRlXG4gICAgICAgICAqICEjemgg5oKs5YGc54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qEIFNwcml0ZSDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGVGcmFtZX0gaG92ZXJTcHJpdGVcbiAgICAgICAgICovXG4gICAgICAgIGhvdmVyU3ByaXRlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0hvdmVyJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmhvdmVyX3Nwcml0ZScsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ2hvdmVyU3ByaXRlJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBEaXNhYmxlZCBzdGF0ZSBzcHJpdGVcbiAgICAgICAgICogISN6aCDnpoHnlKjnirbmgIHkuIvmjInpkq7miYDmmL7npLrnmoQgU3ByaXRlIOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1Nwcml0ZUZyYW1lfSBkaXNhYmxlZFNwcml0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZGlzYWJsZWRTcHJpdGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnRGlzYWJsZWQnLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uZGlzYWJsZWRfc3ByaXRlJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUcmFuc2l0aW9uIHRhcmdldC5cbiAgICAgICAgICogV2hlbiBCdXR0b24gc3RhdGUgY2hhbmdlZDpcbiAgICAgICAgICogIElmIFRyYW5zaXRpb24gdHlwZSBpcyBCdXR0b24uVHJhbnNpdGlvbi5OT05FLCBCdXR0b24gd2lsbCBkbyBub3RoaW5nXG4gICAgICAgICAqICBJZiBUcmFuc2l0aW9uIHR5cGUgaXMgQnV0dG9uLlRyYW5zaXRpb24uQ09MT1IsIEJ1dHRvbiB3aWxsIGNoYW5nZSB0YXJnZXQncyBjb2xvclxuICAgICAgICAgKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLlNQUklURSwgQnV0dG9uIHdpbGwgY2hhbmdlIHRhcmdldCBTcHJpdGUncyBzcHJpdGVcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpnIDopoHov4fmuKHnmoTnm67moIfjgIJcbiAgICAgICAgICog5b2T5YmN5oyJ6ZKu54q25oCB5pS55Y+Y6KeE5YiZ77yaXG4gICAgICAgICAqIC3lpoLmnpwgVHJhbnNpdGlvbiB0eXBlIOmAieaLqSBCdXR0b24uVHJhbnNpdGlvbi5OT05F77yM5oyJ6ZKu5LiN5YGa5Lu75L2V6L+H5rih44CCXG4gICAgICAgICAqIC3lpoLmnpwgVHJhbnNpdGlvbiB0eXBlIOmAieaLqSBCdXR0b24uVHJhbnNpdGlvbi5DT0xPUu+8jOaMiemSruS8muWvueebruagh+minOiJsui/m+ihjOminOiJsuS5i+mXtOeahOi/h+a4oeOAglxuICAgICAgICAgKiAt5aaC5p6cIFRyYW5zaXRpb24gdHlwZSDpgInmi6kgQnV0dG9uLlRyYW5zaXRpb24uU3ByaXRl77yM5oyJ6ZKu5Lya5a+555uu5qCHIFNwcml0ZSDov5vooYwgU3ByaXRlIOS5i+mXtOeahOi/h+a4oeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge05vZGV9IHRhcmdldFxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiBcImkxOG46Q09NUE9ORU5ULmJ1dHRvbi50YXJnZXRcIixcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseVRhcmdldCgpO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAmJiB0aGlzLnRhcmdldCAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5yZWdpc3RlclRhcmdldEV2ZW50KG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSWYgQnV0dG9uIGlzIGNsaWNrZWQsIGl0IHdpbGwgdHJpZ2dlciBldmVudCdzIGhhbmRsZXJcbiAgICAgICAgICogISN6aCDmjInpkq7nmoTngrnlh7vkuovku7bliJfooajjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IGNsaWNrRXZlbnRzXG4gICAgICAgICAqL1xuICAgICAgICBjbGlja0V2ZW50czoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uY2xpY2tfZXZlbnRzJyxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFRyYW5zaXRpb246IFRyYW5zaXRpb24sXG4gICAgfSxcblxuICAgIF9fcHJlbG9hZCAoKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VGFyZ2V0KCk7XG4gICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0U3RhdGUgKCkge1xuICAgICAgICB0aGlzLl9wcmVzc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2hvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gLy8gUmVzdG9yZSBidXR0b24gc3RhdHVzXG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgbGV0IHRyYW5zaXRpb24gPSB0aGlzLnRyYW5zaXRpb247XG4gICAgICAgIGxldCBvcmlnaW5hbFNjYWxlID0gdGhpcy5fb3JpZ2luYWxTY2FsZTtcblxuICAgICAgICBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUiAmJiB0aGlzLmludGVyYWN0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0VGFyZ2V0Q29sb3IodGhpcy5ub3JtYWxDb2xvcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSAmJiBvcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICB0YXJnZXQuc2V0U2NhbGUob3JpZ2luYWxTY2FsZS54LCBvcmlnaW5hbFNjYWxlLnkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgLy8gY2hlY2sgc3ByaXRlIGZyYW1lc1xuICAgICAgICBpZiAodGhpcy5ub3JtYWxTcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9ybWFsU3ByaXRlLmVuc3VyZUxvYWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaG92ZXJTcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuaG92ZXJTcHJpdGUuZW5zdXJlTG9hZFRleHR1cmUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcmVzc2VkU3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNzZWRTcHJpdGUuZW5zdXJlTG9hZFRleHR1cmUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZFNwcml0ZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZFNwcml0ZS5lbnN1cmVMb2FkVGV4dHVyZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJOb2RlRXZlbnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG5cbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VucmVnaXN0ZXJOb2RlRXZlbnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0VGFyZ2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0ID8gdGhpcy50YXJnZXQgOiB0aGlzLm5vZGU7XG4gICAgfSxcblxuICAgIF9vblRhcmdldFNwcml0ZUZyYW1lQ2hhbmdlZCAoY29tcCkge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3VycmVudFN0YXRlU3ByaXRlKGNvbXAuc3ByaXRlRnJhbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRhcmdldENvbG9yQ2hhbmdlZCAoY29sb3IpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3VycmVudFN0YXRlQ29sb3IoY29sb3IpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRhcmdldFNjYWxlQ2hhbmdlZCAoKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgLy8gdXBkYXRlIF9vcmlnaW5hbFNjYWxlIGlmIHRhcmdldCBzY2FsZSBjaGFuZ2VkXG4gICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9PSBUcmFuc2l0aW9uLlNDQUxFIHx8IHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2NhbGUueCA9IHRhcmdldC5zY2FsZVg7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTY2FsZS55ID0gdGFyZ2V0LnNjYWxlWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0VGFyZ2V0Q29sb3IgKGNvbG9yKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgdGFyZ2V0LmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRhcmdldC5vcGFjaXR5ID0gY29sb3IuYTtcbiAgICB9LFxuXG4gICAgX2dldFN0YXRlQ29sb3IgKHN0YXRlKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuTk9STUFMOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vcm1hbENvbG9yO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5IT1ZFUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ob3ZlckNvbG9yO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5QUkVTU0VEOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNzZWRDb2xvcjtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuRElTQUJMRUQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWRDb2xvcjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0U3RhdGVTcHJpdGUgKHN0YXRlKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuTk9STUFMOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vcm1hbFNwcml0ZTtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuSE9WRVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG92ZXJTcHJpdGU7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLlBSRVNTRUQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlc3NlZFNwcml0ZTtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuRElTQUJMRUQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWRTcHJpdGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldEN1cnJlbnRTdGF0ZUNvbG9yIChjb2xvcikge1xuICAgICAgICBzd2l0Y2ggKCB0aGlzLl9nZXRCdXR0b25TdGF0ZSgpICkge1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5OT1JNQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxDb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5IT1ZFUjpcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuUFJFU1NFRDpcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzZWRDb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5ESVNBQkxFRDpcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVkQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0Q3VycmVudFN0YXRlU3ByaXRlIChzcHJpdGVGcmFtZSkge1xuICAgICAgICBzd2l0Y2ggKCB0aGlzLl9nZXRCdXR0b25TdGF0ZSgpICkge1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5OT1JNQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxTcHJpdGUgPSBzcHJpdGVGcmFtZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuSE9WRVI6XG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlclNwcml0ZSA9IHNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5QUkVTU0VEOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3NlZFNwcml0ZSA9IHNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5ESVNBQkxFRDpcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVkU3ByaXRlID0gc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5fZ2V0VGFyZ2V0KCk7XG4gICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiAhPT0gVHJhbnNpdGlvbi5DT0xPUiAmJiB0aGlzLnRyYW5zaXRpb24gIT09IFRyYW5zaXRpb24uU0NBTEUpIHJldHVybjtcblxuICAgICAgICB0aGlzLnRpbWUgKz0gZHQ7XG4gICAgICAgIGxldCByYXRpbyA9IDEuMDtcbiAgICAgICAgaWYgKHRoaXMuZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICByYXRpbyA9IHRoaXMudGltZSAvIHRoaXMuZHVyYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGFtcCByYXRpb1xuICAgICAgICBpZiAocmF0aW8gPj0gMSkge1xuICAgICAgICAgICAgcmF0aW8gPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xuICAgICAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5fZnJvbUNvbG9yLmxlcnAodGhpcy5fdG9Db2xvciwgcmF0aW8pO1xuICAgICAgICAgICAgdGhpcy5fc2V0VGFyZ2V0Q29sb3IoY29sb3IpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNraXAgaWYgX29yaWdpbmFsU2NhbGUgaXMgaW52YWxpZFxuICAgICAgICBlbHNlIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU0NBTEUgJiYgdGhpcy5fb3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnNjYWxlID0gdGhpcy5fZnJvbVNjYWxlLmxlcnAodGhpcy5fdG9TY2FsZSwgcmF0aW8pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhdGlvID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl9vblRvdWNoQ2FuY2VsLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRU5URVIsIHRoaXMuX29uTW91c2VNb3ZlSW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIHRoaXMuX29uTW91c2VNb3ZlT3V0LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJOb2RlRXZlbnQgKCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uVG91Y2hNb3ZlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl9vblRvdWNoQ2FuY2VsLCB0aGlzKTtcblxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLl9vbk1vdXNlTW92ZUluLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgdGhpcy5fb25Nb3VzZU1vdmVPdXQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJUYXJnZXRFdmVudCAodGFyZ2V0KSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRhcmdldC5vbignc3ByaXRlZnJhbWUtY2hhbmdlZCcsIHRoaXMuX29uVGFyZ2V0U3ByaXRlRnJhbWVDaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgICAgIHRhcmdldC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DT0xPUl9DSEFOR0VELCB0aGlzLl9vblRhcmdldENvbG9yQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0Lm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQsIHRoaXMuX29uVGFyZ2V0U2NhbGVDaGFuZ2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJUYXJnZXRFdmVudCAodGFyZ2V0KSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRhcmdldC5vZmYoJ3Nwcml0ZWZyYW1lLWNoYW5nZWQnLCB0aGlzLl9vblRhcmdldFNwcml0ZUZyYW1lQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgICAgICB0YXJnZXQub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHRoaXMuX29uVGFyZ2V0Q29sb3JDaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQsIHRoaXMuX29uVGFyZ2V0U2NhbGVDaGFuZ2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2dldFRhcmdldFNwcml0ZSAodGFyZ2V0KSB7XG4gICAgICAgIGxldCBzcHJpdGUgPSBudWxsO1xuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICBzcHJpdGUgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwcml0ZTtcbiAgICB9LFxuXG4gICAgX2FwcGx5VGFyZ2V0ICgpIHtcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuX2dldFRhcmdldCgpO1xuICAgICAgICB0aGlzLl9zcHJpdGUgPSB0aGlzLl9nZXRUYXJnZXRTcHJpdGUodGFyZ2V0KTtcbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNjYWxlID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29yaWdpbmFsU2NhbGUueCA9IHRhcmdldC5zY2FsZVg7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsU2NhbGUueSA9IHRhcmdldC5zY2FsZVk7XG5cbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJUYXJnZXRFdmVudCh0YXJnZXQpO1xuICAgIH0sXG5cbiAgICAvLyB0b3VjaCBldmVudCBoYW5kbGVyXG4gICAgX29uVG91Y2hCZWdhbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9wcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoTW92ZSAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkgfHwgIXRoaXMuX3ByZXNzZWQpIHJldHVybjtcbiAgICAgICAgLy8gbW9iaWxlIHBob25lIHdpbGwgbm90IGVtaXQgX29uTW91c2VNb3ZlT3V0LFxuICAgICAgICAvLyBzbyB3ZSBoYXZlIHRvIGRvIGhpdCB0ZXN0IHdoZW4gdG91Y2ggbW92aW5nXG4gICAgICAgIGxldCB0b3VjaCA9IGV2ZW50LnRvdWNoO1xuICAgICAgICBsZXQgaGl0ID0gdGhpcy5ub2RlLl9oaXRUZXN0KHRvdWNoLmdldExvY2F0aW9uKCkpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5fZ2V0VGFyZ2V0KCk7XG4gICAgICAgIGxldCBvcmlnaW5hbFNjYWxlID0gdGhpcy5fb3JpZ2luYWxTY2FsZTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNDQUxFICYmIG9yaWdpbmFsU2NhbGUpIHtcbiAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcm9tU2NhbGUueCA9IG9yaWdpbmFsU2NhbGUueDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcm9tU2NhbGUueSA9IG9yaWdpbmFsU2NhbGUueTtcbiAgICAgICAgICAgICAgICB0aGlzLl90b1NjYWxlLnggPSBvcmlnaW5hbFNjYWxlLnggKiB0aGlzLnpvb21TY2FsZTtcbiAgICAgICAgICAgICAgICB0aGlzLl90b1NjYWxlLnkgPSBvcmlnaW5hbFNjYWxlLnkgKiB0aGlzLnpvb21TY2FsZTtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRTY2FsZShvcmlnaW5hbFNjYWxlLngsIG9yaWdpbmFsU2NhbGUueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3RhdGU7XG4gICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5QUkVTU0VEO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFN0YXRlLk5PUk1BTDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2FwcGx5VHJhbnNpdGlvbihzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoRW5kZWQgKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuX3ByZXNzZWQpIHtcbiAgICAgICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmNsaWNrRXZlbnRzLCBldmVudCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuZW1pdCgnY2xpY2snLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcmVzc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaENhbmNlbCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgIH0sXG5cbiAgICBfb25Nb3VzZU1vdmVJbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wcmVzc2VkIHx8ICF0aGlzLmludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TUFJJVEUgJiYgIXRoaXMuaG92ZXJTcHJpdGUpIHJldHVybjtcblxuICAgICAgICBpZiAoIXRoaXMuX2hvdmVyZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hvdmVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25Nb3VzZU1vdmVPdXQgKCkge1xuICAgICAgICBpZiAodGhpcy5faG92ZXJlZCkge1xuICAgICAgICAgICAgdGhpcy5faG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBzdGF0ZSBoYW5kbGVyXG4gICAgX3VwZGF0ZVN0YXRlICgpIHtcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5fZ2V0QnV0dG9uU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fYXBwbHlUcmFuc2l0aW9uKHN0YXRlKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xuICAgIH0sXG5cbiAgICBfZ2V0QnV0dG9uU3RhdGUgKCkge1xuICAgICAgICBsZXQgc3RhdGU7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUpIHtcbiAgICAgICAgICAgIHN0YXRlID0gU3RhdGUuRElTQUJMRUQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fcHJlc3NlZCkge1xuICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5QUkVTU0VEO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2hvdmVyZWQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gU3RhdGUuSE9WRVI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFN0YXRlLk5PUk1BTDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcblxuICAgIF91cGRhdGVDb2xvclRyYW5zaXRpb25JbW1lZGlhdGVseSAoc3RhdGUpIHtcbiAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5fZ2V0U3RhdGVDb2xvcihzdGF0ZSk7XG4gICAgICAgIHRoaXMuX3NldFRhcmdldENvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5fZnJvbUNvbG9yID0gY29sb3IuY2xvbmUoKTtcbiAgICAgICAgdGhpcy5fdG9Db2xvciA9IGNvbG9yO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQ29sb3JUcmFuc2l0aW9uIChzdGF0ZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IHN0YXRlID09PSBTdGF0ZS5ESVNBQkxFRCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29sb3JUcmFuc2l0aW9uSW1tZWRpYXRlbHkoc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuX2dldFRhcmdldCgpO1xuICAgICAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5fZ2V0U3RhdGVDb2xvcihzdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9mcm9tQ29sb3IgPSB0YXJnZXQuY29sb3IuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RvQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU3ByaXRlVHJhbnNpdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgbGV0IHNwcml0ZSA9IHRoaXMuX2dldFN0YXRlU3ByaXRlKHN0YXRlKTtcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZSAmJiBzcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5zcHJpdGVGcmFtZSA9IHNwcml0ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU2NhbGVUcmFuc2l0aW9uIChzdGF0ZSkge1xuICAgICAgICBpZiAoc3RhdGUgPT09IFN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3pvb21VcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fem9vbUJhY2soKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfem9vbVVwICgpIHtcbiAgICAgICAgLy8gc2tpcCBiZWZvcmUgX19wcmVsb2FkKClcbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mcm9tU2NhbGUueCA9IHRoaXMuX29yaWdpbmFsU2NhbGUueDtcbiAgICAgICAgdGhpcy5fZnJvbVNjYWxlLnkgPSB0aGlzLl9vcmlnaW5hbFNjYWxlLnk7XG4gICAgICAgIHRoaXMuX3RvU2NhbGUueCA9IHRoaXMuX29yaWdpbmFsU2NhbGUueCAqIHRoaXMuem9vbVNjYWxlO1xuICAgICAgICB0aGlzLl90b1NjYWxlLnkgPSB0aGlzLl9vcmlnaW5hbFNjYWxlLnkgKiB0aGlzLnpvb21TY2FsZTtcbiAgICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIF96b29tQmFjayAoKSB7XG4gICAgICAgIC8vIHNraXAgYmVmb3JlIF9fcHJlbG9hZCgpXG4gICAgICAgIGlmICghdGhpcy5fb3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuX2dldFRhcmdldCgpO1xuICAgICAgICB0aGlzLl9mcm9tU2NhbGUueCA9IHRhcmdldC5zY2FsZVg7XG4gICAgICAgIHRoaXMuX2Zyb21TY2FsZS55ID0gdGFyZ2V0LnNjYWxlWTtcbiAgICAgICAgdGhpcy5fdG9TY2FsZS54ID0gdGhpcy5fb3JpZ2luYWxTY2FsZS54O1xuICAgICAgICB0aGlzLl90b1NjYWxlLnkgPSB0aGlzLl9vcmlnaW5hbFNjYWxlLnk7XG4gICAgICAgIHRoaXMudGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlVHJhbnNpdGlvbiAob2xkVHJhbnNpdGlvbikge1xuICAgICAgICAvLyBSZXNldCB0byBub3JtYWwgZGF0YSB3aGVuIGNoYW5nZSB0cmFuc2l0aW9uLlxuICAgICAgICBpZiAob2xkVHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29sb3JUcmFuc2l0aW9uSW1tZWRpYXRlbHkoU3RhdGUuTk9STUFMKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvbGRUcmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3ByaXRlVHJhbnNpdGlvbihTdGF0ZS5OT1JNQUwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgfSxcblxuICAgIF9hcHBseVRyYW5zaXRpb24gKHN0YXRlKSB7XG4gICAgICAgIGxldCB0cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uO1xuICAgICAgICBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29sb3JUcmFuc2l0aW9uKHN0YXRlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3ByaXRlVHJhbnNpdGlvbihzdGF0ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU2NhbGVUcmFuc2l0aW9uKHN0YXRlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKHRoaXMuX2dldFRhcmdldCgpLmdldENvbnRlbnRTaXplKCkpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlRGlzYWJsZWRTdGF0ZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGUpIHtcbiAgICAgICAgICAgIGxldCB1c2VHcmF5TWF0ZXJpYWwgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZW5hYmxlQXV0b0dyYXlFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoISh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU1BSSVRFICYmIHRoaXMuZGlzYWJsZWRTcHJpdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZUdyYXlNYXRlcmlhbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3N3aXRjaEdyYXlNYXRlcmlhbCh1c2VHcmF5TWF0ZXJpYWwsIHRoaXMuX3Nwcml0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuQnV0dG9uID0gbW9kdWxlLmV4cG9ydHMgPSBCdXR0b247XG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgY2xpY2tcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge0J1dHRvbn0gYnV0dG9uIC0gVGhlIEJ1dHRvbiBjb21wb25lbnQuXG4gKi9cbiJdfQ==