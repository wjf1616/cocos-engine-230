
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/graphics/graphics.js';
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
var RenderComponent = require('../components/CCRenderComponent');

var Material = require('../assets/material/CCMaterial');

var Types = require('./types');

var LineCap = Types.LineCap;
var LineJoin = Types.LineJoin;
/**
 * @class Graphics
 * @extends RenderComponent
 */

var Graphics = cc.Class({
  name: 'cc.Graphics',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Graphics'
  },
  ctor: function ctor() {
    this._impl = new Graphics._Impl(this);
  },
  properties: {
    _lineWidth: 1,
    _strokeColor: cc.Color.BLACK,
    _lineJoin: LineJoin.MITER,
    _lineCap: LineCap.BUTT,
    _fillColor: cc.Color.WHITE,
    _miterLimit: 10,

    /**
     * !#en
     * Current line width.
     * !#zh
     * 当前线条宽度
     * @property {Number} lineWidth
     * @default 1
     */
    lineWidth: {
      get: function get() {
        return this._lineWidth;
      },
      set: function set(value) {
        this._lineWidth = value;
        this._impl.lineWidth = value;
      }
    },

    /**
     * !#en
     * lineJoin determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together.
     * !#zh
     * lineJoin 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。
     * @property {Graphics.LineJoin} lineJoin
     * @default LineJoin.MITER
     */
    lineJoin: {
      get: function get() {
        return this._lineJoin;
      },
      set: function set(value) {
        this._lineJoin = value;
        this._impl.lineJoin = value;
      },
      type: LineJoin
    },

    /**
     * !#en
     * lineCap determines how the end points of every line are drawn.
     * !#zh
     * lineCap 指定如何绘制每一条线段末端。
     * @property {Graphics.LineCap} lineCap
     * @default LineCap.BUTT
     */
    lineCap: {
      get: function get() {
        return this._lineCap;
      },
      set: function set(value) {
        this._lineCap = value;
        this._impl.lineCap = value;
      },
      type: LineCap
    },

    /**
     * !#en
     * stroke color
     * !#zh
     * 线段颜色
     * @property {Color} strokeColor
     * @default Color.BLACK
     */
    strokeColor: {
      get: function get() {
        return this._strokeColor;
      },
      set: function set(value) {
        this._impl.strokeColor = this._strokeColor = cc.color(value);
      }
    },

    /**
     * !#en
     * fill color
     * !#zh
     * 填充颜色
     * @property {Color} fillColor
     * @default Color.WHITE
     */
    fillColor: {
      get: function get() {
        return this._fillColor;
      },
      set: function set(value) {
        this._impl.fillColor = this._fillColor = cc.color(value);
      }
    },

    /**
     * !#en
     * Sets the miter limit ratio
     * !#zh
     * 设置斜接面限制比例
     * @property {Number} miterLimit
     * @default 10
     */
    miterLimit: {
      get: function get() {
        return this._miterLimit;
      },
      set: function set(value) {
        this._miterLimit = value;
        this._impl.miterLimit = value;
      }
    }
  },
  statics: {
    LineJoin: LineJoin,
    LineCap: LineCap
  },
  onRestore: function onRestore() {
    if (!this._impl) {
      this._impl = new Graphics._Impl(this);
    }
  },
  onDestroy: function onDestroy() {
    this.clear(true);

    this._super();

    this._impl = null;
  },
  _getDefaultMaterial: function _getDefaultMaterial() {
    return Material.getBuiltinMaterial('2d-base');
  },
  _updateMaterial: function _updateMaterial() {
    var material = this._materials[0];
    material && material.define('CC_USE_MODEL', true);
  },

  /**
   * !#en Move path start point to (x,y).
   * !#zh 移动路径起点到坐标(x, y)
   * @method moveTo
   * @param {Number} [x] The x axis of the coordinate for the end point.
   * @param {Number} [y] The y axis of the coordinate for the end point.
   */
  moveTo: function moveTo(x, y) {
    if (CC_DEBUG && x instanceof cc.Vec2) {
      cc.warn('[moveTo] : Can not pass Vec2 as [x, y] value, please check it.');
      return;
    }

    this._impl.moveTo(x, y);
  },

  /**
   * !#en Adds a straight line to the path
   * !#zh 绘制直线路径
   * @method lineTo
   * @param {Number} [x] The x axis of the coordinate for the end point.
   * @param {Number} [y] The y axis of the coordinate for the end point.
   */
  lineTo: function lineTo(x, y) {
    if (CC_DEBUG && x instanceof cc.Vec2) {
      cc.warn('[moveTo] : Can not pass Vec2 as [x, y] value, please check it.');
      return;
    }

    this._impl.lineTo(x, y);
  },

  /**
   * !#en Adds a cubic Bézier curve to the path
   * !#zh 绘制三次贝赛尔曲线路径
   * @method bezierCurveTo
   * @param {Number} [c1x] The x axis of the coordinate for the first control point.
   * @param {Number} [c1y] The y axis of the coordinate for first control point.
   * @param {Number} [c2x] The x axis of the coordinate for the second control point.
   * @param {Number} [c2y] The y axis of the coordinate for the second control point.
   * @param {Number} [x] The x axis of the coordinate for the end point.
   * @param {Number} [y] The y axis of the coordinate for the end point.
   */
  bezierCurveTo: function bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
    this._impl.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
  },

  /**
   * !#en Adds a quadratic Bézier curve to the path
   * !#zh 绘制二次贝赛尔曲线路径
   * @method quadraticCurveTo
   * @param {Number} [cx] The x axis of the coordinate for the control point.
   * @param {Number} [cy] The y axis of the coordinate for the control point.
   * @param {Number} [x] The x axis of the coordinate for the end point.
   * @param {Number} [y] The y axis of the coordinate for the end point.
   */
  quadraticCurveTo: function quadraticCurveTo(cx, cy, x, y) {
    this._impl.quadraticCurveTo(cx, cy, x, y);
  },

  /**
   * !#en Adds an arc to the path which is centered at (cx, cy) position with radius r starting at startAngle and ending at endAngle going in the given direction by counterclockwise (defaulting to false).
   * !#zh 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
   * @method arc
   * @param {Number} [cx] The x axis of the coordinate for the center point.
   * @param {Number} [cy] The y axis of the coordinate for the center point.
   * @param {Number} [r] The arc's radius.
   * @param {Number} [startAngle] The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
   * @param {Number} [endAngle] The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
   * @param {Boolean} [counterclockwise] An optional Boolean which, if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
   */
  arc: function arc(cx, cy, r, startAngle, endAngle, counterclockwise) {
    this._impl.arc(cx, cy, r, startAngle, endAngle, counterclockwise);
  },

  /**
   * !#en Adds an ellipse to the path.
   * !#zh 绘制椭圆路径。
   * @method ellipse
   * @param {Number} [cx] The x axis of the coordinate for the center point.
   * @param {Number} [cy] The y axis of the coordinate for the center point.
   * @param {Number} [rx] The ellipse's x-axis radius.
   * @param {Number} [ry] The ellipse's y-axis radius.
   */
  ellipse: function ellipse(cx, cy, rx, ry) {
    this._impl.ellipse(cx, cy, rx, ry);
  },

  /**
   * !#en Adds an circle to the path.
   * !#zh 绘制圆形路径。
   * @method circle
   * @param {Number} [cx] The x axis of the coordinate for the center point.
   * @param {Number} [cy] The y axis of the coordinate for the center point.
   * @param {Number} [r] The circle's radius.
   */
  circle: function circle(cx, cy, r) {
    this._impl.circle(cx, cy, r);
  },

  /**
   * !#en Adds an rectangle to the path.
   * !#zh 绘制矩形路径。
   * @method rect
   * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
   * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
   * @param {Number} [w] The rectangle's width.
   * @param {Number} [h] The rectangle's height.
   */
  rect: function rect(x, y, w, h) {
    this._impl.rect(x, y, w, h);
  },

  /**
   * !#en Adds an round corner rectangle to the path. 
   * !#zh 绘制圆角矩形路径。
   * @method roundRect
   * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
   * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
   * @param {Number} [w] The rectangles width.
   * @param {Number} [h] The rectangle's height.
   * @param {Number} [r] The radius of the rectangle.
   */
  roundRect: function roundRect(x, y, w, h, r) {
    this._impl.roundRect(x, y, w, h, r);
  },

  /**
   * !#en Draws a filled rectangle.
   * !#zh 绘制填充矩形。
   * @method fillRect
   * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
   * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
   * @param {Number} [w] The rectangle's width.
   * @param {Number} [h] The rectangle's height.
   */
  fillRect: function fillRect(x, y, w, h) {
    this.rect(x, y, w, h);
    this.fill();
  },

  /**
   * !#en Erasing any previously drawn content.
   * !#zh 擦除之前绘制的所有内容的方法。
   * @method clear
   * @param {Boolean} [clean] Whether to clean the graphics inner cache.
   */
  clear: function clear(clean) {
    this._impl.clear(clean);

    if (this._assembler) {
      this._assembler.clear(clean);
    }
  },

  /**
   * !#en Causes the point of the pen to move back to the start of the current path. It tries to add a straight line from the current point to the start.
   * !#zh 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
   * @method close
   */
  close: function close() {
    this._impl.close();
  },

  /**
   * !#en Strokes the current or given path with the current stroke style.
   * !#zh 根据当前的画线样式，绘制当前或已经存在的路径。
   * @method stroke
   */
  stroke: function stroke() {
    if (!this._assembler) {
      this._resetAssembler();
    }

    this._assembler.stroke(this);
  },

  /**
   * !#en Fills the current or given path with the current fill style.
   * !#zh 根据当前的画线样式，填充当前或已经存在的路径。
   * @method fill
   */
  fill: function fill() {
    if (!this._assembler) {
      this._resetAssembler();
    }

    this._assembler.fill(this);
  }
});
cc.Graphics = module.exports = Graphics;
cc.Graphics.Types = Types;
cc.Graphics.Helper = require('./helper');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYXBoaWNzLmpzIl0sIm5hbWVzIjpbIlJlbmRlckNvbXBvbmVudCIsInJlcXVpcmUiLCJNYXRlcmlhbCIsIlR5cGVzIiwiTGluZUNhcCIsIkxpbmVKb2luIiwiR3JhcGhpY3MiLCJjYyIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJjdG9yIiwiX2ltcGwiLCJfSW1wbCIsInByb3BlcnRpZXMiLCJfbGluZVdpZHRoIiwiX3N0cm9rZUNvbG9yIiwiQ29sb3IiLCJCTEFDSyIsIl9saW5lSm9pbiIsIk1JVEVSIiwiX2xpbmVDYXAiLCJCVVRUIiwiX2ZpbGxDb2xvciIsIldISVRFIiwiX21pdGVyTGltaXQiLCJsaW5lV2lkdGgiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsImxpbmVKb2luIiwidHlwZSIsImxpbmVDYXAiLCJzdHJva2VDb2xvciIsImNvbG9yIiwiZmlsbENvbG9yIiwibWl0ZXJMaW1pdCIsInN0YXRpY3MiLCJvblJlc3RvcmUiLCJvbkRlc3Ryb3kiLCJjbGVhciIsIl9zdXBlciIsIl9nZXREZWZhdWx0TWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJfdXBkYXRlTWF0ZXJpYWwiLCJtYXRlcmlhbCIsIl9tYXRlcmlhbHMiLCJkZWZpbmUiLCJtb3ZlVG8iLCJ4IiwieSIsIkNDX0RFQlVHIiwiVmVjMiIsIndhcm4iLCJsaW5lVG8iLCJiZXppZXJDdXJ2ZVRvIiwiYzF4IiwiYzF5IiwiYzJ4IiwiYzJ5IiwicXVhZHJhdGljQ3VydmVUbyIsImN4IiwiY3kiLCJhcmMiLCJyIiwic3RhcnRBbmdsZSIsImVuZEFuZ2xlIiwiY291bnRlcmNsb2Nrd2lzZSIsImVsbGlwc2UiLCJyeCIsInJ5IiwiY2lyY2xlIiwicmVjdCIsInciLCJoIiwicm91bmRSZWN0IiwiZmlsbFJlY3QiLCJmaWxsIiwiY2xlYW4iLCJfYXNzZW1ibGVyIiwiY2xvc2UiLCJzdHJva2UiLCJfcmVzZXRBc3NlbWJsZXIiLCJtb2R1bGUiLCJleHBvcnRz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ckI7QUFDSDtBQWxWbUIsQ0FBVCxDQUFmO0FBcVZBeEUsRUFBRSxDQUFDRCxRQUFILEdBQWMrRSxNQUFNLENBQUNDLE9BQVAsR0FBaUJoRixRQUEvQjtBQUNBQyxFQUFFLENBQUNELFFBQUgsQ0FBWUgsS0FBWixHQUFvQkEsS0FBcEI7QUFDQUksRUFBRSxDQUFDRCxRQUFILENBQVlpRixNQUFaLEdBQXFCdEYsT0FBTyxDQUFDLFVBQUQsQ0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcblxuY29uc3QgVHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJyk7XG5jb25zdCBMaW5lQ2FwID0gVHlwZXMuTGluZUNhcDtcbmNvbnN0IExpbmVKb2luID0gVHlwZXMuTGluZUpvaW47XG5cbi8qKlxuICogQGNsYXNzIEdyYXBoaWNzXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqL1xubGV0IEdyYXBoaWNzID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5HcmFwaGljcycsXG4gICAgZXh0ZW5kczogUmVuZGVyQ29tcG9uZW50LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9HcmFwaGljcycsXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9pbXBsID0gbmV3IEdyYXBoaWNzLl9JbXBsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9saW5lV2lkdGg6IDEsXG4gICAgICAgIF9zdHJva2VDb2xvcjogY2MuQ29sb3IuQkxBQ0ssXG4gICAgICAgIF9saW5lSm9pbjogTGluZUpvaW4uTUlURVIsXG4gICAgICAgIF9saW5lQ2FwOiBMaW5lQ2FwLkJVVFQsXG4gICAgICAgIF9maWxsQ29sb3I6IGNjLkNvbG9yLldISVRFLFxuICAgICAgICBfbWl0ZXJMaW1pdDogMTAsXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBDdXJyZW50IGxpbmUgd2lkdGguXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5b2T5YmN57q/5p2h5a695bqmXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaW5lV2lkdGhcbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgbGluZVdpZHRoOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lV2lkdGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVXaWR0aCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwubGluZVdpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogbGluZUpvaW4gZGV0ZXJtaW5lcyBob3cgdHdvIGNvbm5lY3Rpbmcgc2VnbWVudHMgKG9mIGxpbmVzLCBhcmNzIG9yIGN1cnZlcykgd2l0aCBub24temVybyBsZW5ndGhzIGluIGEgc2hhcGUgYXJlIGpvaW5lZCB0b2dldGhlci5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiBsaW5lSm9pbiDnlKjmnaXorr7nva4y5Liq6ZW/5bqm5LiN5Li6MOeahOebuOi/numDqOWIhu+8iOe6v+aute+8jOWchuW8p++8jOabsue6v++8ieWmguS9lei/nuaOpeWcqOS4gOi1t+eahOWxnuaAp+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0dyYXBoaWNzLkxpbmVKb2lufSBsaW5lSm9pblxuICAgICAgICAgKiBAZGVmYXVsdCBMaW5lSm9pbi5NSVRFUlxuICAgICAgICAgKi9cbiAgICAgICAgbGluZUpvaW46IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVKb2luO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lSm9pbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwubGluZUpvaW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBMaW5lSm9pblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIGxpbmVDYXAgZGV0ZXJtaW5lcyBob3cgdGhlIGVuZCBwb2ludHMgb2YgZXZlcnkgbGluZSBhcmUgZHJhd24uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICogbGluZUNhcCDmjIflrprlpoLkvZXnu5jliLbmr4/kuIDmnaHnur/mrrXmnKvnq6/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtHcmFwaGljcy5MaW5lQ2FwfSBsaW5lQ2FwXG4gICAgICAgICAqIEBkZWZhdWx0IExpbmVDYXAuQlVUVFxuICAgICAgICAgKi9cbiAgICAgICAgbGluZUNhcDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZUNhcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZUNhcCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwubGluZUNhcCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IExpbmVDYXBcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBzdHJva2UgY29sb3JcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnur/mrrXpopzoibJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gc3Ryb2tlQ29sb3JcbiAgICAgICAgICogQGRlZmF1bHQgQ29sb3IuQkxBQ0tcbiAgICAgICAgICovXG4gICAgICAgIHN0cm9rZUNvbG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdHJva2VDb2xvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1wbC5zdHJva2VDb2xvciA9IHRoaXMuX3N0cm9rZUNvbG9yID0gY2MuY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIGZpbGwgY29sb3JcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDloavlhYXpopzoibJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gZmlsbENvbG9yXG4gICAgICAgICAqIEBkZWZhdWx0IENvbG9yLldISVRFXG4gICAgICAgICAqL1xuICAgICAgICBmaWxsQ29sb3I6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbGxDb2xvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1wbC5maWxsQ29sb3IgPSB0aGlzLl9maWxsQ29sb3IgPSBjYy5jb2xvcih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU2V0cyB0aGUgbWl0ZXIgbGltaXQgcmF0aW9cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDorr7nva7mlpzmjqXpnaLpmZDliLbmr5TkvotcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1pdGVyTGltaXRcbiAgICAgICAgICogQGRlZmF1bHQgMTBcbiAgICAgICAgICovXG4gICAgICAgIG1pdGVyTGltaXQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pdGVyTGltaXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pdGVyTGltaXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbXBsLm1pdGVyTGltaXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIExpbmVKb2luOiBMaW5lSm9pbixcbiAgICAgICAgTGluZUNhcDogTGluZUNhcFxuICAgIH0sXG5cbiAgICBvblJlc3RvcmUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgR3JhcGhpY3MuX0ltcGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5jbGVhcih0cnVlKTtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5faW1wbCA9IG51bGw7XG4gICAgfSxcblxuICAgIF9nZXREZWZhdWx0TWF0ZXJpYWwgKCkge1xuICAgICAgICByZXR1cm4gTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKCcyZC1iYXNlJyk7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsc1swXTtcbiAgICAgICAgbWF0ZXJpYWwgJiYgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBNb3ZlIHBhdGggc3RhcnQgcG9pbnQgdG8gKHgseSkuXG4gICAgICogISN6aCDnp7vliqjot6/lvoTotbfngrnliLDlnZDmoIcoeCwgeSlcbiAgICAgKiBAbWV0aG9kIG1vdmVUb1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeF0gVGhlIHggYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIGVuZCBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIFRoZSB5IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSBlbmQgcG9pbnQuXG4gICAgICovXG4gICAgbW92ZVRvICh4LCB5KSB7XG4gICAgICAgIGlmIChDQ19ERUJVRyAmJiB4IGluc3RhbmNlb2YgY2MuVmVjMikge1xuICAgICAgICAgICAgY2Mud2FybignW21vdmVUb10gOiBDYW4gbm90IHBhc3MgVmVjMiBhcyBbeCwgeV0gdmFsdWUsIHBsZWFzZSBjaGVjayBpdC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbXBsLm1vdmVUbyh4LCB5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGEgc3RyYWlnaHQgbGluZSB0byB0aGUgcGF0aFxuICAgICAqICEjemgg57uY5Yi255u057q/6Lev5b6EXG4gICAgICogQG1ldGhvZCBsaW5lVG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3hdIFRoZSB4IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSBUaGUgeSBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgZW5kIHBvaW50LlxuICAgICAqL1xuICAgIGxpbmVUbyAoeCwgeSkge1xuICAgICAgICBpZiAoQ0NfREVCVUcgJiYgeCBpbnN0YW5jZW9mIGNjLlZlYzIpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ1ttb3ZlVG9dIDogQ2FuIG5vdCBwYXNzIFZlYzIgYXMgW3gsIHldIHZhbHVlLCBwbGVhc2UgY2hlY2sgaXQuJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW1wbC5saW5lVG8oeCwgeSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyBhIGN1YmljIELDqXppZXIgY3VydmUgdG8gdGhlIHBhdGhcbiAgICAgKiAhI3poIOe7mOWItuS4ieasoei0nei1m+WwlOabsue6v+i3r+W+hFxuICAgICAqIEBtZXRob2QgYmV6aWVyQ3VydmVUb1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbYzF4XSBUaGUgeCBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgZmlyc3QgY29udHJvbCBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2MxeV0gVGhlIHkgYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgZmlyc3QgY29udHJvbCBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2MyeF0gVGhlIHggYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIHNlY29uZCBjb250cm9sIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbYzJ5XSBUaGUgeSBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgc2Vjb25kIGNvbnRyb2wgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt4XSBUaGUgeCBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV0gVGhlIHkgYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIGVuZCBwb2ludC5cbiAgICAgKi9cbiAgICBiZXppZXJDdXJ2ZVRvIChjMXgsIGMxeSwgYzJ4LCBjMnksIHgsIHkpIHtcbiAgICAgICAgdGhpcy5faW1wbC5iZXppZXJDdXJ2ZVRvKGMxeCwgYzF5LCBjMngsIGMyeSwgeCwgeSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyBhIHF1YWRyYXRpYyBCw6l6aWVyIGN1cnZlIHRvIHRoZSBwYXRoXG4gICAgICogISN6aCDnu5jliLbkuozmrKHotJ3otZvlsJTmm7Lnur/ot6/lvoRcbiAgICAgKiBAbWV0aG9kIHF1YWRyYXRpY0N1cnZlVG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2N4XSBUaGUgeCBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgY29udHJvbCBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2N5XSBUaGUgeSBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgY29udHJvbCBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3hdIFRoZSB4IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSBUaGUgeSBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgZW5kIHBvaW50LlxuICAgICAqL1xuICAgIHF1YWRyYXRpY0N1cnZlVG8gKGN4LCBjeSwgeCwgeSkge1xuICAgICAgICB0aGlzLl9pbXBsLnF1YWRyYXRpY0N1cnZlVG8oY3gsIGN5LCB4LCB5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGFuIGFyYyB0byB0aGUgcGF0aCB3aGljaCBpcyBjZW50ZXJlZCBhdCAoY3gsIGN5KSBwb3NpdGlvbiB3aXRoIHJhZGl1cyByIHN0YXJ0aW5nIGF0IHN0YXJ0QW5nbGUgYW5kIGVuZGluZyBhdCBlbmRBbmdsZSBnb2luZyBpbiB0aGUgZ2l2ZW4gZGlyZWN0aW9uIGJ5IGNvdW50ZXJjbG9ja3dpc2UgKGRlZmF1bHRpbmcgdG8gZmFsc2UpLlxuICAgICAqICEjemgg57uY5Yi25ZyG5byn6Lev5b6E44CC5ZyG5byn6Lev5b6E55qE5ZyG5b+D5ZyoIChjeCwgY3kpIOS9jee9ru+8jOWNiuW+hOS4uiByIO+8jOagueaNriBjb3VudGVyY2xvY2t3aXNlIO+8iOm7mOiupOS4umZhbHNl77yJ5oyH5a6a55qE5pa55ZCR5LuOIHN0YXJ0QW5nbGUg5byA5aeL57uY5Yi277yM5YiwIGVuZEFuZ2xlIOe7k+adn+OAglxuICAgICAqIEBtZXRob2QgYXJjXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjeF0gVGhlIHggYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIGNlbnRlciBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2N5XSBUaGUgeSBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgY2VudGVyIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcl0gVGhlIGFyYydzIHJhZGl1cy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0QW5nbGVdIFRoZSBhbmdsZSBhdCB3aGljaCB0aGUgYXJjIHN0YXJ0cywgbWVhc3VyZWQgY2xvY2t3aXNlIGZyb20gdGhlIHBvc2l0aXZlIHggYXhpcyBhbmQgZXhwcmVzc2VkIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtlbmRBbmdsZV0gVGhlIGFuZ2xlIGF0IHdoaWNoIHRoZSBhcmMgZW5kcywgbWVhc3VyZWQgY2xvY2t3aXNlIGZyb20gdGhlIHBvc2l0aXZlIHggYXhpcyBhbmQgZXhwcmVzc2VkIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbY291bnRlcmNsb2Nrd2lzZV0gQW4gb3B0aW9uYWwgQm9vbGVhbiB3aGljaCwgaWYgdHJ1ZSwgY2F1c2VzIHRoZSBhcmMgdG8gYmUgZHJhd24gY291bnRlci1jbG9ja3dpc2UgYmV0d2VlbiB0aGUgdHdvIGFuZ2xlcy4gQnkgZGVmYXVsdCBpdCBpcyBkcmF3biBjbG9ja3dpc2UuXG4gICAgICovXG4gICAgYXJjIChjeCwgY3ksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjb3VudGVyY2xvY2t3aXNlKSB7XG4gICAgICAgIHRoaXMuX2ltcGwuYXJjKGN4LCBjeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNvdW50ZXJjbG9ja3dpc2UpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFkZHMgYW4gZWxsaXBzZSB0byB0aGUgcGF0aC5cbiAgICAgKiAhI3poIOe7mOWItuakreWchui3r+W+hOOAglxuICAgICAqIEBtZXRob2QgZWxsaXBzZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbY3hdIFRoZSB4IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSBjZW50ZXIgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjeV0gVGhlIHkgYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIGNlbnRlciBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3J4XSBUaGUgZWxsaXBzZSdzIHgtYXhpcyByYWRpdXMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtyeV0gVGhlIGVsbGlwc2UncyB5LWF4aXMgcmFkaXVzLlxuICAgICAqL1xuICAgIGVsbGlwc2UgKGN4LCBjeSwgcngsIHJ5KSB7XG4gICAgICAgIHRoaXMuX2ltcGwuZWxsaXBzZShjeCwgY3ksIHJ4LCByeSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyBhbiBjaXJjbGUgdG8gdGhlIHBhdGguXG4gICAgICogISN6aCDnu5jliLblnIblvaLot6/lvoTjgIJcbiAgICAgKiBAbWV0aG9kIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbY3hdIFRoZSB4IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSBjZW50ZXIgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjeV0gVGhlIHkgYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIGNlbnRlciBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3JdIFRoZSBjaXJjbGUncyByYWRpdXMuXG4gICAgICovXG4gICAgY2lyY2xlIChjeCwgY3ksIHIpIHtcbiAgICAgICAgdGhpcy5faW1wbC5jaXJjbGUoY3gsIGN5LCByKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGFuIHJlY3RhbmdsZSB0byB0aGUgcGF0aC5cbiAgICAgKiAhI3poIOe7mOWItuefqeW9oui3r+W+hOOAglxuICAgICAqIEBtZXRob2QgcmVjdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeF0gVGhlIHggYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIHJlY3RhbmdsZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIFRoZSB5IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSByZWN0YW5nbGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt3XSBUaGUgcmVjdGFuZ2xlJ3Mgd2lkdGguXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtoXSBUaGUgcmVjdGFuZ2xlJ3MgaGVpZ2h0LlxuICAgICAqL1xuICAgIHJlY3QgKHgsIHksIHcsIGgpIHtcbiAgICAgICAgdGhpcy5faW1wbC5yZWN0KHgsIHksIHcsIGgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFkZHMgYW4gcm91bmQgY29ybmVyIHJlY3RhbmdsZSB0byB0aGUgcGF0aC4gXG4gICAgICogISN6aCDnu5jliLblnIbop5Lnn6nlvaLot6/lvoTjgIJcbiAgICAgKiBAbWV0aG9kIHJvdW5kUmVjdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeF0gVGhlIHggYXhpcyBvZiB0aGUgY29vcmRpbmF0ZSBmb3IgdGhlIHJlY3RhbmdsZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIFRoZSB5IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSByZWN0YW5nbGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt3XSBUaGUgcmVjdGFuZ2xlcyB3aWR0aC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2hdIFRoZSByZWN0YW5nbGUncyBoZWlnaHQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtyXSBUaGUgcmFkaXVzIG9mIHRoZSByZWN0YW5nbGUuXG4gICAgICovXG4gICAgcm91bmRSZWN0ICh4LCB5LCB3LCBoLCByKSB7XG4gICAgICAgIHRoaXMuX2ltcGwucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERyYXdzIGEgZmlsbGVkIHJlY3RhbmdsZS5cbiAgICAgKiAhI3poIOe7mOWItuWhq+WFheefqeW9ouOAglxuICAgICAqIEBtZXRob2QgZmlsbFJlY3RcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3hdIFRoZSB4IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUgZm9yIHRoZSByZWN0YW5nbGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSBUaGUgeSBheGlzIG9mIHRoZSBjb29yZGluYXRlIGZvciB0aGUgcmVjdGFuZ2xlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbd10gVGhlIHJlY3RhbmdsZSdzIHdpZHRoLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbaF0gVGhlIHJlY3RhbmdsZSdzIGhlaWdodC5cbiAgICAgKi9cbiAgICBmaWxsUmVjdCAoeCwgeSwgdywgaCkge1xuICAgICAgICB0aGlzLnJlY3QoeCwgeSwgdywgaCk7XG4gICAgICAgIHRoaXMuZmlsbCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVyYXNpbmcgYW55IHByZXZpb3VzbHkgZHJhd24gY29udGVudC5cbiAgICAgKiAhI3poIOaTpumZpOS5i+WJjee7mOWItueahOaJgOacieWGheWuueeahOaWueazleOAglxuICAgICAqIEBtZXRob2QgY2xlYXJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbGVhbl0gV2hldGhlciB0byBjbGVhbiB0aGUgZ3JhcGhpY3MgaW5uZXIgY2FjaGUuXG4gICAgICovXG4gICAgY2xlYXIgKGNsZWFuKSB7XG4gICAgICAgIHRoaXMuX2ltcGwuY2xlYXIoY2xlYW4pO1xuICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuY2xlYXIoY2xlYW4pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2F1c2VzIHRoZSBwb2ludCBvZiB0aGUgcGVuIHRvIG1vdmUgYmFjayB0byB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgcGF0aC4gSXQgdHJpZXMgdG8gYWRkIGEgc3RyYWlnaHQgbGluZSBmcm9tIHRoZSBjdXJyZW50IHBvaW50IHRvIHRoZSBzdGFydC5cbiAgICAgKiAhI3poIOWwhueslOeCuei/lOWbnuWIsOW9k+WJjei3r+W+hOi1t+Wni+eCueeahOOAguWug+WwneivleS7juW9k+WJjeeCueWIsOi1t+Wni+eCuee7mOWItuS4gOadoeebtOe6v+OAglxuICAgICAqIEBtZXRob2QgY2xvc2VcbiAgICAgKi9cbiAgICBjbG9zZSAoKSB7XG4gICAgICAgIHRoaXMuX2ltcGwuY2xvc2UoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdHJva2VzIHRoZSBjdXJyZW50IG9yIGdpdmVuIHBhdGggd2l0aCB0aGUgY3VycmVudCBzdHJva2Ugc3R5bGUuXG4gICAgICogISN6aCDmoLnmja7lvZPliY3nmoTnlLvnur/moLflvI/vvIznu5jliLblvZPliY3miJblt7Lnu4/lrZjlnKjnmoTot6/lvoTjgIJcbiAgICAgKiBAbWV0aG9kIHN0cm9rZVxuICAgICAqL1xuICAgIHN0cm9rZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fYXNzZW1ibGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5zdHJva2UodGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRmlsbHMgdGhlIGN1cnJlbnQgb3IgZ2l2ZW4gcGF0aCB3aXRoIHRoZSBjdXJyZW50IGZpbGwgc3R5bGUuXG4gICAgICogISN6aCDmoLnmja7lvZPliY3nmoTnlLvnur/moLflvI/vvIzloavlhYXlvZPliY3miJblt7Lnu4/lrZjlnKjnmoTot6/lvoTjgIJcbiAgICAgKiBAbWV0aG9kIGZpbGxcbiAgICAgKi9cbiAgICBmaWxsICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hc3NlbWJsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0QXNzZW1ibGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLmZpbGwodGhpcyk7XG4gICAgfVxufSk7XG5cbmNjLkdyYXBoaWNzID0gbW9kdWxlLmV4cG9ydHMgPSBHcmFwaGljcztcbmNjLkdyYXBoaWNzLlR5cGVzID0gVHlwZXM7XG5jYy5HcmFwaGljcy5IZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuIl19