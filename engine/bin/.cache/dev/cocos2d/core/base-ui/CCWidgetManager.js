
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/base-ui/CCWidgetManager.js';
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
var Event; // Support serializing widget in asset db, see cocos-creator/2d-tasks/issues/1894

if (!CC_EDITOR || !Editor.isMainProcess) {
  Event = require('../CCNode').EventType;
}

var TOP = 1 << 0;
var MID = 1 << 1; // vertical center

var BOT = 1 << 2;
var LEFT = 1 << 3;
var CENTER = 1 << 4; // horizontal center

var RIGHT = 1 << 5;
var HORIZONTAL = LEFT | CENTER | RIGHT;
var VERTICAL = TOP | MID | BOT;
var AlignMode = cc.Enum({
  ONCE: 0,
  ON_WINDOW_RESIZE: 1,
  ALWAYS: 2
}); // returns a readonly size of the node

function getReadonlyNodeSize(parent) {
  if (parent instanceof cc.Scene) {
    return CC_EDITOR ? cc.engine.getDesignResolutionSize() : cc.visibleRect;
  } else {
    return parent._contentSize;
  }
}

function computeInverseTransForTarget(widgetNode, target, out_inverseTranslate, out_inverseScale) {
  var scaleX = widgetNode._parent.scaleX;
  var scaleY = widgetNode._parent.scaleY;
  var translateX = 0;
  var translateY = 0;

  for (var node = widgetNode._parent;;) {
    translateX += node.x;
    translateY += node.y;
    node = node._parent; // loop increment

    if (!node) {
      // ERROR: widgetNode should be child of target
      out_inverseTranslate.x = out_inverseTranslate.y = 0;
      out_inverseScale.x = out_inverseScale.y = 1;
      return;
    }

    if (node !== target) {
      var sx = node.scaleX;
      var sy = node.scaleY;
      translateX *= sx;
      translateY *= sy;
      scaleX *= sx;
      scaleY *= sy;
    } else {
      break;
    }
  }

  out_inverseScale.x = scaleX !== 0 ? 1 / scaleX : 1;
  out_inverseScale.y = scaleY !== 0 ? 1 / scaleY : 1;
  out_inverseTranslate.x = -translateX;
  out_inverseTranslate.y = -translateY;
}

var tInverseTranslate = cc.Vec2.ZERO;
var tInverseScale = cc.Vec2.ONE; // align to borders by adjusting node's position and size (ignore rotation)

function align(node, widget) {
  var hasTarget = widget._target;
  var target;
  var inverseTranslate, inverseScale;

  if (hasTarget) {
    target = hasTarget;
    inverseTranslate = tInverseTranslate;
    inverseScale = tInverseScale;
    computeInverseTransForTarget(node, target, inverseTranslate, inverseScale);
  } else {
    target = node._parent;
  }

  var targetSize = getReadonlyNodeSize(target);
  var targetAnchor = target._anchorPoint;
  var isRoot = !CC_EDITOR && target instanceof cc.Scene;
  var x = node.x,
      y = node.y;
  var anchor = node._anchorPoint;

  if (widget._alignFlags & HORIZONTAL) {
    var localLeft,
        localRight,
        targetWidth = targetSize.width;

    if (isRoot) {
      localLeft = cc.visibleRect.left.x;
      localRight = cc.visibleRect.right.x;
    } else {
      localLeft = -targetAnchor.x * targetWidth;
      localRight = localLeft + targetWidth;
    } // adjust borders according to offsets


    localLeft += widget._isAbsLeft ? widget._left : widget._left * targetWidth;
    localRight -= widget._isAbsRight ? widget._right : widget._right * targetWidth;

    if (hasTarget) {
      localLeft += inverseTranslate.x;
      localLeft *= inverseScale.x;
      localRight += inverseTranslate.x;
      localRight *= inverseScale.x;
    }

    var width,
        anchorX = anchor.x,
        scaleX = node.scaleX;

    if (scaleX < 0) {
      anchorX = 1.0 - anchorX;
      scaleX = -scaleX;
    }

    if (widget.isStretchWidth) {
      width = localRight - localLeft;

      if (scaleX !== 0) {
        node.width = width / scaleX;
      }

      x = localLeft + anchorX * width;
    } else {
      width = node.width * scaleX;

      if (widget.isAlignHorizontalCenter) {
        var localHorizontalCenter = widget._isAbsHorizontalCenter ? widget._horizontalCenter : widget._horizontalCenter * targetWidth;
        var targetCenter = (0.5 - targetAnchor.x) * targetSize.width;

        if (hasTarget) {
          localHorizontalCenter *= inverseScale.x;
          targetCenter += inverseTranslate.x;
          targetCenter *= inverseScale.x;
        }

        x = targetCenter + (anchorX - 0.5) * width + localHorizontalCenter;
      } else if (widget.isAlignLeft) {
        x = localLeft + anchorX * width;
      } else {
        x = localRight + (anchorX - 1) * width;
      }
    }
  }

  if (widget._alignFlags & VERTICAL) {
    var localTop,
        localBottom,
        targetHeight = targetSize.height;

    if (isRoot) {
      localBottom = cc.visibleRect.bottom.y;
      localTop = cc.visibleRect.top.y;
    } else {
      localBottom = -targetAnchor.y * targetHeight;
      localTop = localBottom + targetHeight;
    } // adjust borders according to offsets


    localBottom += widget._isAbsBottom ? widget._bottom : widget._bottom * targetHeight;
    localTop -= widget._isAbsTop ? widget._top : widget._top * targetHeight;

    if (hasTarget) {
      // transform
      localBottom += inverseTranslate.y;
      localBottom *= inverseScale.y;
      localTop += inverseTranslate.y;
      localTop *= inverseScale.y;
    }

    var height,
        anchorY = anchor.y,
        scaleY = node.scaleY;

    if (scaleY < 0) {
      anchorY = 1.0 - anchorY;
      scaleY = -scaleY;
    }

    if (widget.isStretchHeight) {
      height = localTop - localBottom;

      if (scaleY !== 0) {
        node.height = height / scaleY;
      }

      y = localBottom + anchorY * height;
    } else {
      height = node.height * scaleY;

      if (widget.isAlignVerticalCenter) {
        var localVerticalCenter = widget._isAbsVerticalCenter ? widget._verticalCenter : widget._verticalCenter * targetHeight;
        var targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;

        if (hasTarget) {
          localVerticalCenter *= inverseScale.y;
          targetMiddle += inverseTranslate.y;
          targetMiddle *= inverseScale.y;
        }

        y = targetMiddle + (anchorY - 0.5) * height + localVerticalCenter;
      } else if (widget.isAlignBottom) {
        y = localBottom + anchorY * height;
      } else {
        y = localTop + (anchorY - 1) * height;
      }
    }
  }

  node.setPosition(x, y);
}

function visitNode(node) {
  var widget = node._widget;

  if (widget) {
    if (CC_DEV) {
      widget._validateTargetInDEV();
    }

    align(node, widget);

    if ((!CC_EDITOR || animationState.animatedSinceLastFrame) && widget.alignMode !== AlignMode.ALWAYS) {
      widget.enabled = false;
    } else {
      activeWidgets.push(widget);
    }
  }

  var children = node._children;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];

    if (child._active) {
      visitNode(child);
    }
  }
}

if (CC_EDITOR) {
  var animationState = {
    previewing: false,
    time: 0,
    animatedSinceLastFrame: false
  };
}

function refreshScene() {
  // check animation editor
  if (CC_EDITOR && !Editor.isBuilder) {
    var AnimUtils = Editor.require('scene://utils/animation');

    var EditMode = Editor.require('scene://edit-mode');

    if (AnimUtils && EditMode) {
      var nowPreviewing = EditMode.curMode().name === 'animation' && !!AnimUtils.Cache.animation;

      if (nowPreviewing !== animationState.previewing) {
        animationState.previewing = nowPreviewing;

        if (nowPreviewing) {
          animationState.animatedSinceLastFrame = true;
          var component = cc.engine.getInstanceById(AnimUtils.Cache.component);

          if (component) {
            var animation = component.getAnimationState(AnimUtils.Cache.animation);

            if (animation) {
              animationState.time = animation.time;
            }
          }
        } else {
          animationState.animatedSinceLastFrame = false;
        }
      } else if (nowPreviewing) {
        var _component = cc.engine.getInstanceById(AnimUtils.Cache.component);

        if (_component) {
          var _animation = _component.getAnimationState(AnimUtils.Cache.animation);

          if (_animation && animationState.time !== _animation.time) {
            animationState.animatedSinceLastFrame = true;
            animationState.time = AnimUtils.Cache.animation.time;
          }
        }
      }
    }
  }

  var scene = cc.director.getScene();

  if (scene) {
    widgetManager.isAligning = true;

    if (widgetManager._nodesOrderDirty) {
      activeWidgets.length = 0;
      visitNode(scene);
      widgetManager._nodesOrderDirty = false;
    } else {
      var i,
          widget,
          iterator = widgetManager._activeWidgetsIterator;
      var AnimUtils;

      if (CC_EDITOR && (AnimUtils = Editor.require('scene://utils/animation')) && AnimUtils.Cache.animation) {
        var editingNode = cc.engine.getInstanceById(AnimUtils.Cache.rNode);

        if (editingNode) {
          for (i = activeWidgets.length - 1; i >= 0; i--) {
            widget = activeWidgets[i];
            var node = widget.node;

            if (widget.alignMode !== AlignMode.ALWAYS && animationState.animatedSinceLastFrame && node.isChildOf(editingNode)) {
              // widget contains in activeWidgets should aligned at least once
              widget.enabled = false;
            } else {
              align(node, widget);
            }
          }
        }
      } else {
        // loop reversely will not help to prevent out of sync
        // because user may remove more than one item during a step.
        for (iterator.i = 0; iterator.i < activeWidgets.length; ++iterator.i) {
          widget = activeWidgets[iterator.i];
          align(widget.node, widget);
        }
      }
    }

    widgetManager.isAligning = false;
  } // check animation editor


  if (CC_EDITOR) {
    animationState.animatedSinceLastFrame = false;
  }
}

var adjustWidgetToAllowMovingInEditor = CC_EDITOR && function (oldPos) {
  if (widgetManager.isAligning) {
    return;
  }

  var newPos = this.node.position;
  var delta = newPos.sub(oldPos);
  var target = this.node._parent;
  var inverseScale = cc.Vec2.ONE;

  if (this._target) {
    target = this._target;
    computeInverseTransForTarget(this.node, target, new cc.Vec2(), inverseScale);
  }

  var targetSize = getReadonlyNodeSize(target);
  var deltaInPercent;

  if (targetSize.width !== 0 && targetSize.height !== 0) {
    deltaInPercent = new cc.Vec2(delta.x / targetSize.width, delta.y / targetSize.height);
  } else {
    deltaInPercent = cc.Vec2.ZERO;
  }

  if (this.isAlignTop) {
    this.top -= (this.isAbsoluteTop ? delta.y : deltaInPercent.y) * inverseScale.y;
  }

  if (this.isAlignBottom) {
    this.bottom += (this.isAbsoluteBottom ? delta.y : deltaInPercent.y) * inverseScale.y;
  }

  if (this.isAlignLeft) {
    this.left += (this.isAbsoluteLeft ? delta.x : deltaInPercent.x) * inverseScale.x;
  }

  if (this.isAlignRight) {
    this.right -= (this.isAbsoluteRight ? delta.x : deltaInPercent.x) * inverseScale.x;
  }

  if (this.isAlignHorizontalCenter) {
    this.horizontalCenter += (this.isAbsoluteHorizontalCenter ? delta.x : deltaInPercent.x) * inverseScale.x;
  }

  if (this.isAlignVerticalCenter) {
    this.verticalCenter += (this.isAbsoluteVerticalCenter ? delta.y : deltaInPercent.y) * inverseScale.y;
  }
};

var adjustWidgetToAllowResizingInEditor = CC_EDITOR && function (oldSize) {
  if (widgetManager.isAligning) {
    return;
  }

  var newSize = this.node.getContentSize();
  var delta = cc.v2(newSize.width - oldSize.width, newSize.height - oldSize.height);
  var target = this.node._parent;
  var inverseScale = cc.Vec2.ONE;

  if (this._target) {
    target = this._target;
    computeInverseTransForTarget(this.node, target, new cc.Vec2(), inverseScale);
  }

  var targetSize = getReadonlyNodeSize(target);
  var deltaInPercent;

  if (targetSize.width !== 0 && targetSize.height !== 0) {
    deltaInPercent = new cc.Vec2(delta.x / targetSize.width, delta.y / targetSize.height);
  } else {
    deltaInPercent = cc.Vec2.ZERO;
  }

  var anchor = this.node._anchorPoint;

  if (this.isAlignTop) {
    this.top -= (this.isAbsoluteTop ? delta.y : deltaInPercent.y) * (1 - anchor.y) * inverseScale.y;
  }

  if (this.isAlignBottom) {
    this.bottom -= (this.isAbsoluteBottom ? delta.y : deltaInPercent.y) * anchor.y * inverseScale.y;
  }

  if (this.isAlignLeft) {
    this.left -= (this.isAbsoluteLeft ? delta.x : deltaInPercent.x) * anchor.x * inverseScale.x;
  }

  if (this.isAlignRight) {
    this.right -= (this.isAbsoluteRight ? delta.x : deltaInPercent.x) * (1 - anchor.x) * inverseScale.x;
  }
};

var activeWidgets = []; // updateAlignment from scene to node recursively

function updateAlignment(node) {
  var parent = node._parent;

  if (cc.Node.isNode(parent)) {
    updateAlignment(parent);
  }

  var widget = node._widget || node.getComponent(cc.Widget); // node._widget will be null when widget is disabled

  if (widget && parent) {
    align(node, widget);
  }
}

var widgetManager = cc._widgetManager = module.exports = {
  _AlignFlags: {
    TOP: TOP,
    MID: MID,
    // vertical center
    BOT: BOT,
    LEFT: LEFT,
    CENTER: CENTER,
    // horizontal center
    RIGHT: RIGHT
  },
  isAligning: false,
  _nodesOrderDirty: false,
  _activeWidgetsIterator: new cc.js.array.MutableForwardIterator(activeWidgets),
  init: function init(director) {
    director.on(cc.Director.EVENT_AFTER_UPDATE, refreshScene);

    if (CC_EDITOR && cc.engine) {
      cc.engine.on('design-resolution-changed', this.onResized.bind(this));
    } else {
      if (cc.sys.isMobile) {
        var thisOnResized = this.onResized.bind(this);
        window.addEventListener('resize', thisOnResized);
        window.addEventListener('orientationchange', thisOnResized);
      } else {
        cc.view.on('canvas-resize', this.onResized, this);
      }
    }
  },
  add: function add(widget) {
    widget.node._widget = widget;
    this._nodesOrderDirty = true;

    if (CC_EDITOR && !cc.engine.isPlaying) {
      widget.node.on(Event.POSITION_CHANGED, adjustWidgetToAllowMovingInEditor, widget);
      widget.node.on(Event.SIZE_CHANGED, adjustWidgetToAllowResizingInEditor, widget);
    }
  },
  remove: function remove(widget) {
    widget.node._widget = null;

    this._activeWidgetsIterator.remove(widget);

    if (CC_EDITOR && !cc.engine.isPlaying) {
      widget.node.off(Event.POSITION_CHANGED, adjustWidgetToAllowMovingInEditor, widget);
      widget.node.off(Event.SIZE_CHANGED, adjustWidgetToAllowResizingInEditor, widget);
    }
  },
  onResized: function onResized() {
    var scene = cc.director.getScene();

    if (scene) {
      this.refreshWidgetOnResized(scene);
    }
  },
  refreshWidgetOnResized: function refreshWidgetOnResized(node) {
    var widget = cc.Node.isNode(node) && node.getComponent(cc.Widget);

    if (widget) {
      if (widget.alignMode === AlignMode.ON_WINDOW_RESIZE) {
        widget.enabled = true;
      }
    }

    var children = node._children;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      this.refreshWidgetOnResized(child);
    }
  },
  updateAlignment: updateAlignment,
  AlignMode: AlignMode
};

if (CC_EDITOR) {
  module.exports._computeInverseTransForTarget = computeInverseTransForTarget;
  module.exports._getReadonlyNodeSize = getReadonlyNodeSize;
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDV2lkZ2V0TWFuYWdlci5qcyJdLCJuYW1lcyI6WyJFdmVudCIsIkNDX0VESVRPUiIsIkVkaXRvciIsImlzTWFpblByb2Nlc3MiLCJyZXF1aXJlIiwiRXZlbnRUeXBlIiwiVE9QIiwiTUlEIiwiQk9UIiwiTEVGVCIsIkNFTlRFUiIsIlJJR0hUIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiQWxpZ25Nb2RlIiwiY2MiLCJFbnVtIiwiT05DRSIsIk9OX1dJTkRPV19SRVNJWkUiLCJBTFdBWVMiLCJnZXRSZWFkb25seU5vZGVTaXplIiwicGFyZW50IiwiU2NlbmUiLCJlbmdpbmUiLCJnZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSIsInZpc2libGVSZWN0IiwiX2NvbnRlbnRTaXplIiwiY29tcHV0ZUludmVyc2VUcmFuc0ZvclRhcmdldCIsIndpZGdldE5vZGUiLCJ0YXJnZXQiLCJvdXRfaW52ZXJzZVRyYW5zbGF0ZSIsIm91dF9pbnZlcnNlU2NhbGUiLCJzY2FsZVgiLCJfcGFyZW50Iiwic2NhbGVZIiwidHJhbnNsYXRlWCIsInRyYW5zbGF0ZVkiLCJub2RlIiwieCIsInkiLCJzeCIsInN5IiwidEludmVyc2VUcmFuc2xhdGUiLCJWZWMyIiwiWkVSTyIsInRJbnZlcnNlU2NhbGUiLCJPTkUiLCJhbGlnbiIsIndpZGdldCIsImhhc1RhcmdldCIsIl90YXJnZXQiLCJpbnZlcnNlVHJhbnNsYXRlIiwiaW52ZXJzZVNjYWxlIiwidGFyZ2V0U2l6ZSIsInRhcmdldEFuY2hvciIsIl9hbmNob3JQb2ludCIsImlzUm9vdCIsImFuY2hvciIsIl9hbGlnbkZsYWdzIiwibG9jYWxMZWZ0IiwibG9jYWxSaWdodCIsInRhcmdldFdpZHRoIiwid2lkdGgiLCJsZWZ0IiwicmlnaHQiLCJfaXNBYnNMZWZ0IiwiX2xlZnQiLCJfaXNBYnNSaWdodCIsIl9yaWdodCIsImFuY2hvclgiLCJpc1N0cmV0Y2hXaWR0aCIsImlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyIiwibG9jYWxIb3Jpem9udGFsQ2VudGVyIiwiX2lzQWJzSG9yaXpvbnRhbENlbnRlciIsIl9ob3Jpem9udGFsQ2VudGVyIiwidGFyZ2V0Q2VudGVyIiwiaXNBbGlnbkxlZnQiLCJsb2NhbFRvcCIsImxvY2FsQm90dG9tIiwidGFyZ2V0SGVpZ2h0IiwiaGVpZ2h0IiwiYm90dG9tIiwidG9wIiwiX2lzQWJzQm90dG9tIiwiX2JvdHRvbSIsIl9pc0Fic1RvcCIsIl90b3AiLCJhbmNob3JZIiwiaXNTdHJldGNoSGVpZ2h0IiwiaXNBbGlnblZlcnRpY2FsQ2VudGVyIiwibG9jYWxWZXJ0aWNhbENlbnRlciIsIl9pc0Fic1ZlcnRpY2FsQ2VudGVyIiwiX3ZlcnRpY2FsQ2VudGVyIiwidGFyZ2V0TWlkZGxlIiwiaXNBbGlnbkJvdHRvbSIsInNldFBvc2l0aW9uIiwidmlzaXROb2RlIiwiX3dpZGdldCIsIkNDX0RFViIsIl92YWxpZGF0ZVRhcmdldEluREVWIiwiYW5pbWF0aW9uU3RhdGUiLCJhbmltYXRlZFNpbmNlTGFzdEZyYW1lIiwiYWxpZ25Nb2RlIiwiZW5hYmxlZCIsImFjdGl2ZVdpZGdldHMiLCJwdXNoIiwiY2hpbGRyZW4iLCJfY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJfYWN0aXZlIiwicHJldmlld2luZyIsInRpbWUiLCJyZWZyZXNoU2NlbmUiLCJpc0J1aWxkZXIiLCJBbmltVXRpbHMiLCJFZGl0TW9kZSIsIm5vd1ByZXZpZXdpbmciLCJjdXJNb2RlIiwibmFtZSIsIkNhY2hlIiwiYW5pbWF0aW9uIiwiY29tcG9uZW50IiwiZ2V0SW5zdGFuY2VCeUlkIiwiZ2V0QW5pbWF0aW9uU3RhdGUiLCJzY2VuZSIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJ3aWRnZXRNYW5hZ2VyIiwiaXNBbGlnbmluZyIsIl9ub2Rlc09yZGVyRGlydHkiLCJpdGVyYXRvciIsIl9hY3RpdmVXaWRnZXRzSXRlcmF0b3IiLCJlZGl0aW5nTm9kZSIsInJOb2RlIiwiaXNDaGlsZE9mIiwiYWRqdXN0V2lkZ2V0VG9BbGxvd01vdmluZ0luRWRpdG9yIiwib2xkUG9zIiwibmV3UG9zIiwicG9zaXRpb24iLCJkZWx0YSIsInN1YiIsImRlbHRhSW5QZXJjZW50IiwiaXNBbGlnblRvcCIsImlzQWJzb2x1dGVUb3AiLCJpc0Fic29sdXRlQm90dG9tIiwiaXNBYnNvbHV0ZUxlZnQiLCJpc0FsaWduUmlnaHQiLCJpc0Fic29sdXRlUmlnaHQiLCJob3Jpem9udGFsQ2VudGVyIiwiaXNBYnNvbHV0ZUhvcml6b250YWxDZW50ZXIiLCJ2ZXJ0aWNhbENlbnRlciIsImlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlciIsImFkanVzdFdpZGdldFRvQWxsb3dSZXNpemluZ0luRWRpdG9yIiwib2xkU2l6ZSIsIm5ld1NpemUiLCJnZXRDb250ZW50U2l6ZSIsInYyIiwidXBkYXRlQWxpZ25tZW50IiwiTm9kZSIsImlzTm9kZSIsImdldENvbXBvbmVudCIsIldpZGdldCIsIl93aWRnZXRNYW5hZ2VyIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9BbGlnbkZsYWdzIiwianMiLCJhcnJheSIsIk11dGFibGVGb3J3YXJkSXRlcmF0b3IiLCJpbml0Iiwib24iLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX1VQREFURSIsIm9uUmVzaXplZCIsImJpbmQiLCJzeXMiLCJpc01vYmlsZSIsInRoaXNPblJlc2l6ZWQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwidmlldyIsImFkZCIsImlzUGxheWluZyIsIlBPU0lUSU9OX0NIQU5HRUQiLCJTSVpFX0NIQU5HRUQiLCJyZW1vdmUiLCJvZmYiLCJyZWZyZXNoV2lkZ2V0T25SZXNpemVkIiwiX2NvbXB1dGVJbnZlcnNlVHJhbnNGb3JUYXJnZXQiLCJfZ2V0UmVhZG9ubHlOb2RlU2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLEtBQUosRUFFQTs7QUFDQSxJQUFJLENBQUNDLFNBQUQsSUFBYyxDQUFDQyxNQUFNLENBQUNDLGFBQTFCLEVBQXlDO0FBQ3ZDSCxF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aUosSUFBSCxDQUFRQyxNQUFSLENBQWU1SCxJQUFmLEtBQXdCQSxJQUFJLENBQUM2SCxZQUFMLENBQWtCbkosRUFBRSxDQUFDb0osTUFBckIsQ0FBckM7O0FBQ0EsUUFBSW5ILE1BQUosRUFBWTtBQUNSLFVBQUlBLE1BQU0sQ0FBQ3NELFNBQVAsS0FBcUJ4RixTQUFTLENBQUNJLGdCQUFuQyxFQUFxRDtBQUNqRDhCLFFBQUFBLE1BQU0sQ0FBQ3VELE9BQVAsR0FBaUIsSUFBakI7QUFDSDtBQUNKOztBQUVELFFBQUlHLFFBQVEsR0FBR3JFLElBQUksQ0FBQ3NFLFNBQXBCOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsUUFBUSxDQUFDRyxNQUE3QixFQUFxQ0QsQ0FBQyxFQUF0QyxFQUEwQztBQUN0QyxVQUFJRSxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0UsQ0FBRCxDQUFwQjtBQUNBLFdBQUtpRixzQkFBTCxDQUE0Qi9FLEtBQTVCO0FBQ0g7QUFDSixHQWpFb0Q7QUFrRXJEaUQsRUFBQUEsZUFBZSxFQUFFQSxlQWxFb0M7QUFtRXJEakosRUFBQUEsU0FBUyxFQUFFQTtBQW5FMEMsQ0FBekQ7O0FBc0VBLElBQUliLFNBQUosRUFBZTtBQUNYb0ssRUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWV3Qiw2QkFBZixHQUErQ25LLDRCQUEvQztBQUNBMEksRUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWV5QixvQkFBZixHQUFzQzNLLG1CQUF0QztBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgRXZlbnQ7XG5cbi8vIFN1cHBvcnQgc2VyaWFsaXppbmcgd2lkZ2V0IGluIGFzc2V0IGRiLCBzZWUgY29jb3MtY3JlYXRvci8yZC10YXNrcy9pc3N1ZXMvMTg5NFxuaWYgKCFDQ19FRElUT1IgfHwgIUVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gIEV2ZW50ID0gcmVxdWlyZSgnLi4vQ0NOb2RlJykuRXZlbnRUeXBlO1xufVxuXG52YXIgVE9QICAgICA9IDEgPDwgMDtcbnZhciBNSUQgICAgID0gMSA8PCAxOyAgIC8vIHZlcnRpY2FsIGNlbnRlclxudmFyIEJPVCAgICAgPSAxIDw8IDI7XG52YXIgTEVGVCAgICA9IDEgPDwgMztcbnZhciBDRU5URVIgID0gMSA8PCA0OyAgIC8vIGhvcml6b250YWwgY2VudGVyXG52YXIgUklHSFQgICA9IDEgPDwgNTtcbnZhciBIT1JJWk9OVEFMID0gTEVGVCB8IENFTlRFUiB8IFJJR0hUO1xudmFyIFZFUlRJQ0FMID0gVE9QIHwgTUlEIHwgQk9UO1xuXG52YXIgQWxpZ25Nb2RlID0gY2MuRW51bSh7XG4gICAgT05DRTogMCxcbiAgICBPTl9XSU5ET1dfUkVTSVpFOiAxLFxuICAgIEFMV0FZUzogMixcbn0pO1xuXG4vLyByZXR1cm5zIGEgcmVhZG9ubHkgc2l6ZSBvZiB0aGUgbm9kZVxuZnVuY3Rpb24gZ2V0UmVhZG9ubHlOb2RlU2l6ZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIGNjLlNjZW5lKSB7XG4gICAgICAgIHJldHVybiBDQ19FRElUT1IgPyBjYy5lbmdpbmUuZ2V0RGVzaWduUmVzb2x1dGlvblNpemUoKSA6IGNjLnZpc2libGVSZWN0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudC5fY29udGVudFNpemU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0ICh3aWRnZXROb2RlLCB0YXJnZXQsIG91dF9pbnZlcnNlVHJhbnNsYXRlLCBvdXRfaW52ZXJzZVNjYWxlKSB7XG4gICAgdmFyIHNjYWxlWCA9IHdpZGdldE5vZGUuX3BhcmVudC5zY2FsZVg7XG4gICAgdmFyIHNjYWxlWSA9IHdpZGdldE5vZGUuX3BhcmVudC5zY2FsZVk7XG4gICAgdmFyIHRyYW5zbGF0ZVggPSAwO1xuICAgIHZhciB0cmFuc2xhdGVZID0gMDtcbiAgICBmb3IgKHZhciBub2RlID0gd2lkZ2V0Tm9kZS5fcGFyZW50OzspIHtcbiAgICAgICAgdHJhbnNsYXRlWCArPSBub2RlLng7XG4gICAgICAgIHRyYW5zbGF0ZVkgKz0gbm9kZS55O1xuICAgICAgICBub2RlID0gbm9kZS5fcGFyZW50OyAgICAvLyBsb29wIGluY3JlbWVudFxuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIC8vIEVSUk9SOiB3aWRnZXROb2RlIHNob3VsZCBiZSBjaGlsZCBvZiB0YXJnZXRcbiAgICAgICAgICAgIG91dF9pbnZlcnNlVHJhbnNsYXRlLnggPSBvdXRfaW52ZXJzZVRyYW5zbGF0ZS55ID0gMDtcbiAgICAgICAgICAgIG91dF9pbnZlcnNlU2NhbGUueCA9IG91dF9pbnZlcnNlU2NhbGUueSA9IDE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUgIT09IHRhcmdldCkge1xuICAgICAgICAgICAgdmFyIHN4ID0gbm9kZS5zY2FsZVg7XG4gICAgICAgICAgICB2YXIgc3kgPSBub2RlLnNjYWxlWTtcbiAgICAgICAgICAgIHRyYW5zbGF0ZVggKj0gc3g7XG4gICAgICAgICAgICB0cmFuc2xhdGVZICo9IHN5O1xuICAgICAgICAgICAgc2NhbGVYICo9IHN4O1xuICAgICAgICAgICAgc2NhbGVZICo9IHN5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3V0X2ludmVyc2VTY2FsZS54ID0gc2NhbGVYICE9PSAwID8gKDEgLyBzY2FsZVgpIDogMTtcbiAgICBvdXRfaW52ZXJzZVNjYWxlLnkgPSBzY2FsZVkgIT09IDAgPyAoMSAvIHNjYWxlWSkgOiAxO1xuICAgIG91dF9pbnZlcnNlVHJhbnNsYXRlLnggPSAtdHJhbnNsYXRlWDtcbiAgICBvdXRfaW52ZXJzZVRyYW5zbGF0ZS55ID0gLXRyYW5zbGF0ZVk7XG59XG5cbnZhciB0SW52ZXJzZVRyYW5zbGF0ZSA9IGNjLlZlYzIuWkVSTztcbnZhciB0SW52ZXJzZVNjYWxlID0gY2MuVmVjMi5PTkU7XG5cbi8vIGFsaWduIHRvIGJvcmRlcnMgYnkgYWRqdXN0aW5nIG5vZGUncyBwb3NpdGlvbiBhbmQgc2l6ZSAoaWdub3JlIHJvdGF0aW9uKVxuZnVuY3Rpb24gYWxpZ24gKG5vZGUsIHdpZGdldCkge1xuICAgIHZhciBoYXNUYXJnZXQgPSB3aWRnZXQuX3RhcmdldDtcbiAgICB2YXIgdGFyZ2V0O1xuICAgIHZhciBpbnZlcnNlVHJhbnNsYXRlLCBpbnZlcnNlU2NhbGU7XG4gICAgaWYgKGhhc1RhcmdldCkge1xuICAgICAgICB0YXJnZXQgPSBoYXNUYXJnZXQ7XG4gICAgICAgIGludmVyc2VUcmFuc2xhdGUgPSB0SW52ZXJzZVRyYW5zbGF0ZTtcbiAgICAgICAgaW52ZXJzZVNjYWxlID0gdEludmVyc2VTY2FsZTtcbiAgICAgICAgY29tcHV0ZUludmVyc2VUcmFuc0ZvclRhcmdldChub2RlLCB0YXJnZXQsIGludmVyc2VUcmFuc2xhdGUsIGludmVyc2VTY2FsZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0YXJnZXQgPSBub2RlLl9wYXJlbnQ7XG4gICAgfVxuICAgIHZhciB0YXJnZXRTaXplID0gZ2V0UmVhZG9ubHlOb2RlU2l6ZSh0YXJnZXQpO1xuICAgIHZhciB0YXJnZXRBbmNob3IgPSB0YXJnZXQuX2FuY2hvclBvaW50O1xuXG4gICAgdmFyIGlzUm9vdCA9ICFDQ19FRElUT1IgJiYgdGFyZ2V0IGluc3RhbmNlb2YgY2MuU2NlbmU7XG4gICAgdmFyIHggPSBub2RlLngsIHkgPSBub2RlLnk7XG4gICAgdmFyIGFuY2hvciA9IG5vZGUuX2FuY2hvclBvaW50O1xuXG4gICAgaWYgKHdpZGdldC5fYWxpZ25GbGFncyAmIEhPUklaT05UQUwpIHtcblxuICAgICAgICB2YXIgbG9jYWxMZWZ0LCBsb2NhbFJpZ2h0LCB0YXJnZXRXaWR0aCA9IHRhcmdldFNpemUud2lkdGg7XG4gICAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgICAgIGxvY2FsTGVmdCA9IGNjLnZpc2libGVSZWN0LmxlZnQueDtcbiAgICAgICAgICAgIGxvY2FsUmlnaHQgPSBjYy52aXNpYmxlUmVjdC5yaWdodC54O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9jYWxMZWZ0ID0gLXRhcmdldEFuY2hvci54ICogdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICBsb2NhbFJpZ2h0ID0gbG9jYWxMZWZ0ICsgdGFyZ2V0V2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGp1c3QgYm9yZGVycyBhY2NvcmRpbmcgdG8gb2Zmc2V0c1xuICAgICAgICBsb2NhbExlZnQgKz0gd2lkZ2V0Ll9pc0Fic0xlZnQgPyB3aWRnZXQuX2xlZnQgOiB3aWRnZXQuX2xlZnQgKiB0YXJnZXRXaWR0aDtcbiAgICAgICAgbG9jYWxSaWdodCAtPSB3aWRnZXQuX2lzQWJzUmlnaHQgPyB3aWRnZXQuX3JpZ2h0IDogd2lkZ2V0Ll9yaWdodCAqIHRhcmdldFdpZHRoO1xuXG4gICAgICAgIGlmIChoYXNUYXJnZXQpIHtcbiAgICAgICAgICAgIGxvY2FsTGVmdCArPSBpbnZlcnNlVHJhbnNsYXRlLng7XG4gICAgICAgICAgICBsb2NhbExlZnQgKj0gaW52ZXJzZVNjYWxlLng7XG4gICAgICAgICAgICBsb2NhbFJpZ2h0ICs9IGludmVyc2VUcmFuc2xhdGUueDtcbiAgICAgICAgICAgIGxvY2FsUmlnaHQgKj0gaW52ZXJzZVNjYWxlLng7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgd2lkdGgsIGFuY2hvclggPSBhbmNob3IueCwgc2NhbGVYID0gbm9kZS5zY2FsZVg7XG4gICAgICAgIGlmIChzY2FsZVggPCAwKSB7XG4gICAgICAgICAgICBhbmNob3JYID0gMS4wIC0gYW5jaG9yWDtcbiAgICAgICAgICAgIHNjYWxlWCA9IC1zY2FsZVg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdpZGdldC5pc1N0cmV0Y2hXaWR0aCkge1xuICAgICAgICAgICAgd2lkdGggPSBsb2NhbFJpZ2h0IC0gbG9jYWxMZWZ0O1xuICAgICAgICAgICAgaWYgKHNjYWxlWCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIG5vZGUud2lkdGggPSB3aWR0aCAvIHNjYWxlWDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSBsb2NhbExlZnQgKyBhbmNob3JYICogd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCA9IG5vZGUud2lkdGggKiBzY2FsZVg7XG4gICAgICAgICAgICBpZiAod2lkZ2V0LmlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsSG9yaXpvbnRhbENlbnRlciA9IHdpZGdldC5faXNBYnNIb3Jpem9udGFsQ2VudGVyID8gd2lkZ2V0Ll9ob3Jpem9udGFsQ2VudGVyIDogd2lkZ2V0Ll9ob3Jpem9udGFsQ2VudGVyICogdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldENlbnRlciA9ICgwLjUgLSB0YXJnZXRBbmNob3IueCkgKiB0YXJnZXRTaXplLndpZHRoO1xuICAgICAgICAgICAgICAgIGlmIChoYXNUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxIb3Jpem9udGFsQ2VudGVyICo9IGludmVyc2VTY2FsZS54O1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDZW50ZXIgKz0gaW52ZXJzZVRyYW5zbGF0ZS54O1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDZW50ZXIgKj0gaW52ZXJzZVNjYWxlLng7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHggPSB0YXJnZXRDZW50ZXIgKyAoYW5jaG9yWCAtIDAuNSkgKiB3aWR0aCArIGxvY2FsSG9yaXpvbnRhbENlbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHdpZGdldC5pc0FsaWduTGVmdCkge1xuICAgICAgICAgICAgICAgIHggPSBsb2NhbExlZnQgKyBhbmNob3JYICogd2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB4ID0gbG9jYWxSaWdodCArIChhbmNob3JYIC0gMSkgKiB3aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aWRnZXQuX2FsaWduRmxhZ3MgJiBWRVJUSUNBTCkge1xuXG4gICAgICAgIHZhciBsb2NhbFRvcCwgbG9jYWxCb3R0b20sIHRhcmdldEhlaWdodCA9IHRhcmdldFNpemUuaGVpZ2h0O1xuICAgICAgICBpZiAoaXNSb290KSB7XG4gICAgICAgICAgICBsb2NhbEJvdHRvbSA9IGNjLnZpc2libGVSZWN0LmJvdHRvbS55O1xuICAgICAgICAgICAgbG9jYWxUb3AgPSBjYy52aXNpYmxlUmVjdC50b3AueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvY2FsQm90dG9tID0gLXRhcmdldEFuY2hvci55ICogdGFyZ2V0SGVpZ2h0O1xuICAgICAgICAgICAgbG9jYWxUb3AgPSBsb2NhbEJvdHRvbSArIHRhcmdldEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkanVzdCBib3JkZXJzIGFjY29yZGluZyB0byBvZmZzZXRzXG4gICAgICAgIGxvY2FsQm90dG9tICs9IHdpZGdldC5faXNBYnNCb3R0b20gPyB3aWRnZXQuX2JvdHRvbSA6IHdpZGdldC5fYm90dG9tICogdGFyZ2V0SGVpZ2h0O1xuICAgICAgICBsb2NhbFRvcCAtPSB3aWRnZXQuX2lzQWJzVG9wID8gd2lkZ2V0Ll90b3AgOiB3aWRnZXQuX3RvcCAqIHRhcmdldEhlaWdodDtcblxuICAgICAgICBpZiAoaGFzVGFyZ2V0KSB7XG4gICAgICAgICAgICAvLyB0cmFuc2Zvcm1cbiAgICAgICAgICAgIGxvY2FsQm90dG9tICs9IGludmVyc2VUcmFuc2xhdGUueTtcbiAgICAgICAgICAgIGxvY2FsQm90dG9tICo9IGludmVyc2VTY2FsZS55O1xuICAgICAgICAgICAgbG9jYWxUb3AgKz0gaW52ZXJzZVRyYW5zbGF0ZS55O1xuICAgICAgICAgICAgbG9jYWxUb3AgKj0gaW52ZXJzZVNjYWxlLnk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGVpZ2h0LCBhbmNob3JZID0gYW5jaG9yLnksIHNjYWxlWSA9IG5vZGUuc2NhbGVZO1xuICAgICAgICBpZiAoc2NhbGVZIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yWSA9IDEuMCAtIGFuY2hvclk7XG4gICAgICAgICAgICBzY2FsZVkgPSAtc2NhbGVZO1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aWRnZXQuaXNTdHJldGNoSGVpZ2h0KSB7XG4gICAgICAgICAgICBoZWlnaHQgPSBsb2NhbFRvcCAtIGxvY2FsQm90dG9tO1xuICAgICAgICAgICAgaWYgKHNjYWxlWSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIG5vZGUuaGVpZ2h0ID0gaGVpZ2h0IC8gc2NhbGVZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IGxvY2FsQm90dG9tICsgYW5jaG9yWSAqIGhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGhlaWdodCA9IG5vZGUuaGVpZ2h0ICogc2NhbGVZO1xuICAgICAgICAgICAgaWYgKHdpZGdldC5pc0FsaWduVmVydGljYWxDZW50ZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxWZXJ0aWNhbENlbnRlciA9IHdpZGdldC5faXNBYnNWZXJ0aWNhbENlbnRlciA/IHdpZGdldC5fdmVydGljYWxDZW50ZXIgOiB3aWRnZXQuX3ZlcnRpY2FsQ2VudGVyICogdGFyZ2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRNaWRkbGUgPSAoMC41IC0gdGFyZ2V0QW5jaG9yLnkpICogdGFyZ2V0U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGhhc1RhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFZlcnRpY2FsQ2VudGVyICo9IGludmVyc2VTY2FsZS55O1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRNaWRkbGUgKz0gaW52ZXJzZVRyYW5zbGF0ZS55O1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRNaWRkbGUgKj0gaW52ZXJzZVNjYWxlLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHkgPSB0YXJnZXRNaWRkbGUgKyAoYW5jaG9yWSAtIDAuNSkgKiBoZWlnaHQgKyBsb2NhbFZlcnRpY2FsQ2VudGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAod2lkZ2V0LmlzQWxpZ25Cb3R0b20pIHtcbiAgICAgICAgICAgICAgICB5ID0gbG9jYWxCb3R0b20gKyBhbmNob3JZICogaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgeSA9IGxvY2FsVG9wICsgKGFuY2hvclkgLSAxKSAqIGhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUuc2V0UG9zaXRpb24oeCwgeSk7XG59XG5cbmZ1bmN0aW9uIHZpc2l0Tm9kZSAobm9kZSkge1xuICAgIHZhciB3aWRnZXQgPSBub2RlLl93aWRnZXQ7XG4gICAgaWYgKHdpZGdldCkge1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICB3aWRnZXQuX3ZhbGlkYXRlVGFyZ2V0SW5ERVYoKTtcbiAgICAgICAgfVxuICAgICAgICBhbGlnbihub2RlLCB3aWRnZXQpO1xuICAgICAgICBpZiAoKCFDQ19FRElUT1IgfHwgYW5pbWF0aW9uU3RhdGUuYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZSkgJiYgd2lkZ2V0LmFsaWduTW9kZSAhPT0gQWxpZ25Nb2RlLkFMV0FZUykge1xuICAgICAgICAgICAgd2lkZ2V0LmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFjdGl2ZVdpZGdldHMucHVzaCh3aWRnZXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgIGlmIChjaGlsZC5fYWN0aXZlKSB7XG4gICAgICAgICAgICB2aXNpdE5vZGUoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgdmFyIGFuaW1hdGlvblN0YXRlID0ge1xuICAgICAgICBwcmV2aWV3aW5nOiBmYWxzZSxcbiAgICAgICAgdGltZTogMCxcbiAgICAgICAgYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZTogZmFsc2UsXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaFNjZW5lICgpIHtcbiAgICAvLyBjaGVjayBhbmltYXRpb24gZWRpdG9yXG4gICAgaWYgKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikge1xuICAgICAgICB2YXIgQW5pbVV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvYW5pbWF0aW9uJyk7XG4gICAgICAgIHZhciBFZGl0TW9kZSA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL2VkaXQtbW9kZScpO1xuICAgICAgICBpZiAoQW5pbVV0aWxzICYmIEVkaXRNb2RlKSB7XG4gICAgICAgICAgICB2YXIgbm93UHJldmlld2luZyA9IChFZGl0TW9kZS5jdXJNb2RlKCkubmFtZSA9PT0gJ2FuaW1hdGlvbicgJiYgISFBbmltVXRpbHMuQ2FjaGUuYW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGlmIChub3dQcmV2aWV3aW5nICE9PSBhbmltYXRpb25TdGF0ZS5wcmV2aWV3aW5nKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUucHJldmlld2luZyA9IG5vd1ByZXZpZXdpbmc7XG4gICAgICAgICAgICAgICAgaWYgKG5vd1ByZXZpZXdpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUuYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBjYy5lbmdpbmUuZ2V0SW5zdGFuY2VCeUlkKEFuaW1VdGlscy5DYWNoZS5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gY29tcG9uZW50LmdldEFuaW1hdGlvblN0YXRlKEFuaW1VdGlscy5DYWNoZS5hbmltYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblN0YXRlLnRpbWUgPSBhbmltYXRpb24udGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUuYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vd1ByZXZpZXdpbmcpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2MuZW5naW5lLmdldEluc3RhbmNlQnlJZChBbmltVXRpbHMuQ2FjaGUuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSBjb21wb25lbnQuZ2V0QW5pbWF0aW9uU3RhdGUoQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb24gJiYgYW5pbWF0aW9uU3RhdGUudGltZSAhPT0gYW5pbWF0aW9uLnRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblN0YXRlLmFuaW1hdGVkU2luY2VMYXN0RnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUudGltZSA9IEFuaW1VdGlscy5DYWNoZS5hbmltYXRpb24udGltZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzY2VuZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgaWYgKHNjZW5lKSB7XG4gICAgICAgIHdpZGdldE1hbmFnZXIuaXNBbGlnbmluZyA9IHRydWU7XG4gICAgICAgIGlmICh3aWRnZXRNYW5hZ2VyLl9ub2Rlc09yZGVyRGlydHkpIHtcbiAgICAgICAgICAgIGFjdGl2ZVdpZGdldHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHZpc2l0Tm9kZShzY2VuZSk7XG4gICAgICAgICAgICB3aWRnZXRNYW5hZ2VyLl9ub2Rlc09yZGVyRGlydHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpLCB3aWRnZXQsIGl0ZXJhdG9yID0gd2lkZ2V0TWFuYWdlci5fYWN0aXZlV2lkZ2V0c0l0ZXJhdG9yO1xuICAgICAgICAgICAgdmFyIEFuaW1VdGlscztcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiZcbiAgICAgICAgICAgICAgICAoQW5pbVV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvYW5pbWF0aW9uJykpICYmXG4gICAgICAgICAgICAgICAgQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0aW5nTm9kZSA9IGNjLmVuZ2luZS5nZXRJbnN0YW5jZUJ5SWQoQW5pbVV0aWxzLkNhY2hlLnJOb2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdGluZ05vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gYWN0aXZlV2lkZ2V0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkZ2V0ID0gYWN0aXZlV2lkZ2V0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gd2lkZ2V0Lm5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lkZ2V0LmFsaWduTW9kZSAhPT0gQWxpZ25Nb2RlLkFMV0FZUyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblN0YXRlLmFuaW1hdGVkU2luY2VMYXN0RnJhbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmlzQ2hpbGRPZihlZGl0aW5nTm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpZGdldCBjb250YWlucyBpbiBhY3RpdmVXaWRnZXRzIHNob3VsZCBhbGlnbmVkIGF0IGxlYXN0IG9uY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXQuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ24obm9kZSwgd2lkZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGxvb3AgcmV2ZXJzZWx5IHdpbGwgbm90IGhlbHAgdG8gcHJldmVudCBvdXQgb2Ygc3luY1xuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgdXNlciBtYXkgcmVtb3ZlIG1vcmUgdGhhbiBvbmUgaXRlbSBkdXJpbmcgYSBzdGVwLlxuICAgICAgICAgICAgICAgIGZvciAoaXRlcmF0b3IuaSA9IDA7IGl0ZXJhdG9yLmkgPCBhY3RpdmVXaWRnZXRzLmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpZGdldCA9IGFjdGl2ZVdpZGdldHNbaXRlcmF0b3IuaV07XG4gICAgICAgICAgICAgICAgICAgIGFsaWduKHdpZGdldC5ub2RlLCB3aWRnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aWRnZXRNYW5hZ2VyLmlzQWxpZ25pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBhbmltYXRpb24gZWRpdG9yXG4gICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICBhbmltYXRpb25TdGF0ZS5hbmltYXRlZFNpbmNlTGFzdEZyYW1lID0gZmFsc2U7XG4gICAgfVxufVxuXG52YXIgYWRqdXN0V2lkZ2V0VG9BbGxvd01vdmluZ0luRWRpdG9yID0gQ0NfRURJVE9SICYmIGZ1bmN0aW9uIChvbGRQb3MpIHtcbiAgICBpZiAod2lkZ2V0TWFuYWdlci5pc0FsaWduaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIG5ld1BvcyA9IHRoaXMubm9kZS5wb3NpdGlvbjtcbiAgICB2YXIgZGVsdGEgPSBuZXdQb3Muc3ViKG9sZFBvcyk7XG5cbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5ub2RlLl9wYXJlbnQ7XG4gICAgdmFyIGludmVyc2VTY2FsZSA9IGNjLlZlYzIuT05FO1xuXG4gICAgaWYgKHRoaXMuX3RhcmdldCkge1xuICAgICAgICB0YXJnZXQgPSB0aGlzLl90YXJnZXQ7XG4gICAgICAgIGNvbXB1dGVJbnZlcnNlVHJhbnNGb3JUYXJnZXQodGhpcy5ub2RlLCB0YXJnZXQsIG5ldyBjYy5WZWMyKCksIGludmVyc2VTY2FsZSk7XG4gICAgfVxuXG4gICAgdmFyIHRhcmdldFNpemUgPSBnZXRSZWFkb25seU5vZGVTaXplKHRhcmdldCk7XG4gICAgdmFyIGRlbHRhSW5QZXJjZW50O1xuICAgIGlmICh0YXJnZXRTaXplLndpZHRoICE9PSAwICYmIHRhcmdldFNpemUuaGVpZ2h0ICE9PSAwKSB7XG4gICAgICAgIGRlbHRhSW5QZXJjZW50ID0gbmV3IGNjLlZlYzIoZGVsdGEueCAvIHRhcmdldFNpemUud2lkdGgsIGRlbHRhLnkgLyB0YXJnZXRTaXplLmhlaWdodCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkZWx0YUluUGVyY2VudCA9IGNjLlZlYzIuWkVSTztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0FsaWduVG9wKSB7XG4gICAgICAgIHRoaXMudG9wIC09ICh0aGlzLmlzQWJzb2x1dGVUb3AgPyBkZWx0YS55IDogZGVsdGFJblBlcmNlbnQueSkgKiBpbnZlcnNlU2NhbGUueTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNBbGlnbkJvdHRvbSkge1xuICAgICAgICB0aGlzLmJvdHRvbSArPSAodGhpcy5pc0Fic29sdXRlQm90dG9tID8gZGVsdGEueSA6IGRlbHRhSW5QZXJjZW50LnkpICogaW52ZXJzZVNjYWxlLnk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzQWxpZ25MZWZ0KSB7XG4gICAgICAgIHRoaXMubGVmdCArPSAodGhpcy5pc0Fic29sdXRlTGVmdCA/IGRlbHRhLnggOiBkZWx0YUluUGVyY2VudC54KSAqIGludmVyc2VTY2FsZS54O1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0FsaWduUmlnaHQpIHtcbiAgICAgICAgdGhpcy5yaWdodCAtPSAodGhpcy5pc0Fic29sdXRlUmlnaHQgPyBkZWx0YS54IDogZGVsdGFJblBlcmNlbnQueCkgKiBpbnZlcnNlU2NhbGUueDtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNBbGlnbkhvcml6b250YWxDZW50ZXIpIHtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsQ2VudGVyICs9ICh0aGlzLmlzQWJzb2x1dGVIb3Jpem9udGFsQ2VudGVyID8gZGVsdGEueCA6IGRlbHRhSW5QZXJjZW50LngpICogaW52ZXJzZVNjYWxlLng7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzQWxpZ25WZXJ0aWNhbENlbnRlcikge1xuICAgICAgICB0aGlzLnZlcnRpY2FsQ2VudGVyICs9ICh0aGlzLmlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlciA/IGRlbHRhLnkgOiBkZWx0YUluUGVyY2VudC55KSAqIGludmVyc2VTY2FsZS55O1xuICAgIH1cbn07XG5cbnZhciBhZGp1c3RXaWRnZXRUb0FsbG93UmVzaXppbmdJbkVkaXRvciA9IENDX0VESVRPUiAmJiBmdW5jdGlvbiAob2xkU2l6ZSkge1xuICAgIGlmICh3aWRnZXRNYW5hZ2VyLmlzQWxpZ25pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbmV3U2l6ZSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgIHZhciBkZWx0YSA9IGNjLnYyKG5ld1NpemUud2lkdGggLSBvbGRTaXplLndpZHRoLCBuZXdTaXplLmhlaWdodCAtIG9sZFNpemUuaGVpZ2h0KTtcblxuICAgIHZhciB0YXJnZXQgPSB0aGlzLm5vZGUuX3BhcmVudDtcbiAgICB2YXIgaW52ZXJzZVNjYWxlID0gY2MuVmVjMi5PTkU7XG4gICAgaWYgKHRoaXMuX3RhcmdldCkge1xuICAgICAgICB0YXJnZXQgPSB0aGlzLl90YXJnZXQ7XG4gICAgICAgIGNvbXB1dGVJbnZlcnNlVHJhbnNGb3JUYXJnZXQodGhpcy5ub2RlLCB0YXJnZXQsIG5ldyBjYy5WZWMyKCksIGludmVyc2VTY2FsZSk7XG4gICAgfVxuXG4gICAgdmFyIHRhcmdldFNpemUgPSBnZXRSZWFkb25seU5vZGVTaXplKHRhcmdldCk7XG4gICAgdmFyIGRlbHRhSW5QZXJjZW50O1xuICAgIGlmICh0YXJnZXRTaXplLndpZHRoICE9PSAwICYmIHRhcmdldFNpemUuaGVpZ2h0ICE9PSAwKSB7XG4gICAgICAgIGRlbHRhSW5QZXJjZW50ID0gbmV3IGNjLlZlYzIoZGVsdGEueCAvIHRhcmdldFNpemUud2lkdGgsIGRlbHRhLnkgLyB0YXJnZXRTaXplLmhlaWdodCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkZWx0YUluUGVyY2VudCA9IGNjLlZlYzIuWkVSTztcbiAgICB9XG5cbiAgICB2YXIgYW5jaG9yID0gdGhpcy5ub2RlLl9hbmNob3JQb2ludDtcblxuICAgIGlmICh0aGlzLmlzQWxpZ25Ub3ApIHtcbiAgICAgICAgdGhpcy50b3AgLT0gKHRoaXMuaXNBYnNvbHV0ZVRvcCA/IGRlbHRhLnkgOiBkZWx0YUluUGVyY2VudC55KSAqICgxIC0gYW5jaG9yLnkpICogaW52ZXJzZVNjYWxlLnk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzQWxpZ25Cb3R0b20pIHtcbiAgICAgICAgdGhpcy5ib3R0b20gLT0gKHRoaXMuaXNBYnNvbHV0ZUJvdHRvbSA/IGRlbHRhLnkgOiBkZWx0YUluUGVyY2VudC55KSAqIGFuY2hvci55ICogaW52ZXJzZVNjYWxlLnk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzQWxpZ25MZWZ0KSB7XG4gICAgICAgIHRoaXMubGVmdCAtPSAodGhpcy5pc0Fic29sdXRlTGVmdCA/IGRlbHRhLnggOiBkZWx0YUluUGVyY2VudC54KSAqIGFuY2hvci54ICogaW52ZXJzZVNjYWxlLng7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzQWxpZ25SaWdodCkge1xuICAgICAgICB0aGlzLnJpZ2h0IC09ICh0aGlzLmlzQWJzb2x1dGVSaWdodCA/IGRlbHRhLnggOiBkZWx0YUluUGVyY2VudC54KSAqICgxIC0gYW5jaG9yLngpICogaW52ZXJzZVNjYWxlLng7XG4gICAgfVxufTtcblxudmFyIGFjdGl2ZVdpZGdldHMgPSBbXTtcblxuLy8gdXBkYXRlQWxpZ25tZW50IGZyb20gc2NlbmUgdG8gbm9kZSByZWN1cnNpdmVseVxuZnVuY3Rpb24gdXBkYXRlQWxpZ25tZW50IChub2RlKSB7XG4gICAgdmFyIHBhcmVudCA9IG5vZGUuX3BhcmVudDtcbiAgICBpZiAoY2MuTm9kZS5pc05vZGUocGFyZW50KSkge1xuICAgICAgICB1cGRhdGVBbGlnbm1lbnQocGFyZW50KTtcbiAgICB9XG4gICAgdmFyIHdpZGdldCA9IG5vZGUuX3dpZGdldCB8fFxuICAgICAgICAgICAgICAgICBub2RlLmdldENvbXBvbmVudChjYy5XaWRnZXQpOyAgLy8gbm9kZS5fd2lkZ2V0IHdpbGwgYmUgbnVsbCB3aGVuIHdpZGdldCBpcyBkaXNhYmxlZFxuICAgIGlmICh3aWRnZXQgJiYgcGFyZW50KSB7XG4gICAgICAgIGFsaWduKG5vZGUsIHdpZGdldCk7XG4gICAgfVxufVxuXG52YXIgd2lkZ2V0TWFuYWdlciA9IGNjLl93aWRnZXRNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgX0FsaWduRmxhZ3M6IHtcbiAgICAgICAgVE9QOiBUT1AsXG4gICAgICAgIE1JRDogTUlELCAgICAgICAvLyB2ZXJ0aWNhbCBjZW50ZXJcbiAgICAgICAgQk9UOiBCT1QsXG4gICAgICAgIExFRlQ6IExFRlQsXG4gICAgICAgIENFTlRFUjogQ0VOVEVSLCAvLyBob3Jpem9udGFsIGNlbnRlclxuICAgICAgICBSSUdIVDogUklHSFRcbiAgICB9LFxuICAgIGlzQWxpZ25pbmc6IGZhbHNlLFxuICAgIF9ub2Rlc09yZGVyRGlydHk6IGZhbHNlLFxuICAgIF9hY3RpdmVXaWRnZXRzSXRlcmF0b3I6IG5ldyBjYy5qcy5hcnJheS5NdXRhYmxlRm9yd2FyZEl0ZXJhdG9yKGFjdGl2ZVdpZGdldHMpLFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKGRpcmVjdG9yKSB7XG4gICAgICAgIGRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgcmVmcmVzaFNjZW5lKTtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SICYmIGNjLmVuZ2luZSkge1xuICAgICAgICAgICAgY2MuZW5naW5lLm9uKCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJywgdGhpcy5vblJlc2l6ZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNPblJlc2l6ZWQgPSB0aGlzLm9uUmVzaXplZC5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzT25SZXNpemVkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCB0aGlzT25SZXNpemVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLnZpZXcub24oJ2NhbnZhcy1yZXNpemUnLCB0aGlzLm9uUmVzaXplZCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gKHdpZGdldCkge1xuICAgICAgICB3aWRnZXQubm9kZS5fd2lkZ2V0ID0gd2lkZ2V0O1xuICAgICAgICB0aGlzLl9ub2Rlc09yZGVyRGlydHkgPSB0cnVlO1xuICAgICAgICBpZiAoQ0NfRURJVE9SICYmICFjYy5lbmdpbmUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB3aWRnZXQubm9kZS5vbihFdmVudC5QT1NJVElPTl9DSEFOR0VELCBhZGp1c3RXaWRnZXRUb0FsbG93TW92aW5nSW5FZGl0b3IsIHdpZGdldCk7XG4gICAgICAgICAgICB3aWRnZXQubm9kZS5vbihFdmVudC5TSVpFX0NIQU5HRUQsIGFkanVzdFdpZGdldFRvQWxsb3dSZXNpemluZ0luRWRpdG9yLCB3aWRnZXQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uICh3aWRnZXQpIHtcbiAgICAgICAgd2lkZ2V0Lm5vZGUuX3dpZGdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVdpZGdldHNJdGVyYXRvci5yZW1vdmUod2lkZ2V0KTtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgd2lkZ2V0Lm5vZGUub2ZmKEV2ZW50LlBPU0lUSU9OX0NIQU5HRUQsIGFkanVzdFdpZGdldFRvQWxsb3dNb3ZpbmdJbkVkaXRvciwgd2lkZ2V0KTtcbiAgICAgICAgICAgIHdpZGdldC5ub2RlLm9mZihFdmVudC5TSVpFX0NIQU5HRUQsIGFkanVzdFdpZGdldFRvQWxsb3dSZXNpemluZ0luRWRpdG9yLCB3aWRnZXQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblJlc2l6ZWQgKCkge1xuICAgICAgICB2YXIgc2NlbmUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpO1xuICAgICAgICBpZiAoc2NlbmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFdpZGdldE9uUmVzaXplZChzY2VuZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2hXaWRnZXRPblJlc2l6ZWQgKG5vZGUpIHtcbiAgICAgICAgdmFyIHdpZGdldCA9IGNjLk5vZGUuaXNOb2RlKG5vZGUpICYmIG5vZGUuZ2V0Q29tcG9uZW50KGNjLldpZGdldCk7XG4gICAgICAgIGlmICh3aWRnZXQpIHtcbiAgICAgICAgICAgIGlmICh3aWRnZXQuYWxpZ25Nb2RlID09PSBBbGlnbk1vZGUuT05fV0lORE9XX1JFU0laRSkge1xuICAgICAgICAgICAgICAgIHdpZGdldC5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFdpZGdldE9uUmVzaXplZChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZUFsaWdubWVudDogdXBkYXRlQWxpZ25tZW50LFxuICAgIEFsaWduTW9kZTogQWxpZ25Nb2RlLFxufTtcblxuaWYgKENDX0VESVRPUikge1xuICAgIG1vZHVsZS5leHBvcnRzLl9jb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0ID0gY29tcHV0ZUludmVyc2VUcmFuc0ZvclRhcmdldDtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0UmVhZG9ubHlOb2RlU2l6ZSA9IGdldFJlYWRvbmx5Tm9kZVNpemU7XG59XG4iXX0=