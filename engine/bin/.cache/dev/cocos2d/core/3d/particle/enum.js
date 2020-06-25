
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/enum.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.TextureMode = exports.TrailMode = exports.ArcMode = exports.EmitLocation = exports.ShapeType = exports.RenderMode = exports.Space = void 0;

var _CCEnum = _interopRequireDefault(require("../../platform/CCEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Space = (0, _CCEnum["default"])({
  World: 0,
  Local: 1,
  Custom: 2
});
/**
 * 粒子的生成模式
 * @enum ParticleSystem3DAssembler.RenderMode
 */

exports.Space = Space;
var RenderMode = (0, _CCEnum["default"])({
  /**
   * 粒子始终面向摄像机
   */
  Billboard: 0,

  /**
   * 粒子始终面向摄像机但会根据参数进行拉伸
   */
  StrecthedBillboard: 1,

  /**
   * 粒子始终与 XZ 平面平行
   */
  HorizontalBillboard: 2,

  /**
   * 粒子始终与 Y 轴平行且朝向摄像机
   */
  VerticalBillboard: 3,

  /**
   * 粒子保持模型本身状态
   */
  Mesh: 4
});
/**
 * 粒子发射器类型
 * @enum shapeModule.ShapeType
 */

exports.RenderMode = RenderMode;
var ShapeType = (0, _CCEnum["default"])({
  /**
   * 立方体类型粒子发射器
   * @property {Number} Box
   */
  Box: 0,

  /**
   * 圆形粒子发射器
   * @property {Number} Circle
   */
  Circle: 1,

  /**
   * 圆锥体粒子发射器
   * @property {Number} Cone
   */
  Cone: 2,

  /**
   * 球体粒子发射器
   * @property {Number} Sphere
   */
  Sphere: 3,

  /**
   * 半球体粒子发射器
   * @property {Number} Hemisphere
   */
  Hemisphere: 4
});
/**
 * 粒子从发射器的哪个部位发射
 * @enum shapeModule.EmitLocation
 */

exports.ShapeType = ShapeType;
var EmitLocation = (0, _CCEnum["default"])({
  /**
   * 基础位置发射（仅对 Circle 类型及 Cone 类型的粒子发射器适用）
   * @property {Number} Base
   */
  Base: 0,

  /**
   * 边框位置发射（仅对 Box 类型及 Circle 类型的粒子发射器适用）
   * @property {Number} Edge
   */
  Edge: 1,

  /**
   * 表面位置发射（对所有类型的粒子发射器都适用）
   * @property {Number} Shell
   */
  Shell: 2,

  /**
   * 内部位置发射（对所有类型的粒子发射器都适用）
   * @property {Number} Volume
   */
  Volume: 3
});
/**
 * 粒子在扇形区域的发射方式
 * @enum shapeModule.ArcMode
 */

exports.EmitLocation = EmitLocation;
var ArcMode = (0, _CCEnum["default"])({
  /**
   * 随机位置发射
   * @property {Number} Random
   */
  Random: 0,

  /**
   * 沿某一方向循环发射，每次循环方向相同
   * @property {Number} Loop
   */
  Loop: 1,

  /**
   * 循环发射，每次循环方向相反
   * @property {Number} PingPong
   */
  PingPong: 2
});
/**
 * 选择如何为粒子系统生成轨迹
 * @enum trailModule.TrailMode
 */

exports.ArcMode = ArcMode;
var TrailMode = (0, _CCEnum["default"])({
  /**
   * 粒子模式<bg>
   * 创建一种效果，其中每个粒子在其路径中留下固定的轨迹
   */
  Particles: 0,

  /**
   * 带模式<bg>
   * 根据其生命周期创建连接每个粒子的轨迹带
   */
  Ribbon: 1
});
/**
 * 纹理填充模式
 * @enum trailModule.TextureMode
 */

exports.TrailMode = TrailMode;
var TextureMode = (0, _CCEnum["default"])({
  /**
   * 拉伸填充纹理
   */
  Stretch: 0,

  /**
   * 重复填充纹理
   */
  Repeat: 1
});
exports.TextureMode = TextureMode;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudW0udHMiXSwibmFtZXMiOlsiU3BhY2UiLCJXb3JsZCIsIkxvY2FsIiwiQ3VzdG9tIiwiUmVuZGVyTW9kZSIsIkJpbGxib2FyZCIsIlN0cmVjdGhlZEJpbGxib2FyZCIsIkhvcml6b250YWxCaWxsYm9hcmQiLCJWZXJ0aWNhbEJpbGxib2FyZCIsIk1lc2giLCJTaGFwZVR5cGUiLCJCb3giLCJDaXJjbGUiLCJDb25lIiwiU3BoZXJlIiwiSGVtaXNwaGVyZSIsIkVtaXRMb2NhdGlvbiIsIkJhc2UiLCJFZGdlIiwiU2hlbGwiLCJWb2x1bWUiLCJBcmNNb2RlIiwiUmFuZG9tIiwiTG9vcCIsIlBpbmdQb25nIiwiVHJhaWxNb2RlIiwiUGFydGljbGVzIiwiUmliYm9uIiwiVGV4dHVyZU1vZGUiLCJTdHJldGNoIiwiUmVwZWF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFTyxJQUFNQSxLQUFLLEdBQUcsd0JBQUs7QUFDdEJDLEVBQUFBLEtBQUssRUFBRSxDQURlO0FBRXRCQyxFQUFBQSxLQUFLLEVBQUUsQ0FGZTtBQUd0QkMsRUFBQUEsTUFBTSxFQUFFO0FBSGMsQ0FBTCxDQUFkO0FBTVA7Ozs7OztBQUlPLElBQU1DLFVBQVUsR0FBRyx3QkFBSztBQUUzQjs7O0FBR0FDLEVBQUFBLFNBQVMsRUFBRSxDQUxnQjs7QUFPM0I7OztBQUdBQyxFQUFBQSxrQkFBa0IsRUFBRSxDQVZPOztBQVkzQjs7O0FBR0FDLEVBQUFBLG1CQUFtQixFQUFFLENBZk07O0FBaUIzQjs7O0FBR0FDLEVBQUFBLGlCQUFpQixFQUFFLENBcEJROztBQXNCM0I7OztBQUdBQyxFQUFBQSxJQUFJLEVBQUU7QUF6QnFCLENBQUwsQ0FBbkI7QUE0QlA7Ozs7OztBQUlPLElBQU1DLFNBQVMsR0FBRyx3QkFBSztBQUMxQjs7OztBQUlBQyxFQUFBQSxHQUFHLEVBQUUsQ0FMcUI7O0FBTzFCOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRSxDQVhrQjs7QUFhMUI7Ozs7QUFJQUMsRUFBQUEsSUFBSSxFQUFFLENBakJvQjs7QUFtQjFCOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRSxDQXZCa0I7O0FBeUIxQjs7OztBQUlBQyxFQUFBQSxVQUFVLEVBQUU7QUE3QmMsQ0FBTCxDQUFsQjtBQWdDUDs7Ozs7O0FBSU8sSUFBTUMsWUFBWSxHQUFHLHdCQUFLO0FBQzdCOzs7O0FBSUFDLEVBQUFBLElBQUksRUFBRSxDQUx1Qjs7QUFPN0I7Ozs7QUFJQUMsRUFBQUEsSUFBSSxFQUFFLENBWHVCOztBQWE3Qjs7OztBQUlBQyxFQUFBQSxLQUFLLEVBQUUsQ0FqQnNCOztBQW1CN0I7Ozs7QUFJQUMsRUFBQUEsTUFBTSxFQUFFO0FBdkJxQixDQUFMLENBQXJCO0FBMEJQOzs7Ozs7QUFJTyxJQUFNQyxPQUFPLEdBQUcsd0JBQUs7QUFDeEI7Ozs7QUFJQUMsRUFBQUEsTUFBTSxFQUFFLENBTGdCOztBQU94Qjs7OztBQUlBQyxFQUFBQSxJQUFJLEVBQUUsQ0FYa0I7O0FBYXhCOzs7O0FBSUFDLEVBQUFBLFFBQVEsRUFBRTtBQWpCYyxDQUFMLENBQWhCO0FBb0JQOzs7Ozs7QUFJTyxJQUFNQyxTQUFTLEdBQUcsd0JBQUs7QUFDMUI7Ozs7QUFJQUMsRUFBQUEsU0FBUyxFQUFFLENBTGU7O0FBTzFCOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRTtBQVhrQixDQUFMLENBQWxCO0FBY1A7Ozs7OztBQUlPLElBQU1DLFdBQVcsR0FBRyx3QkFBSztBQUM1Qjs7O0FBR0FDLEVBQUFBLE9BQU8sRUFBRSxDQUptQjs7QUFNNUI7OztBQUdBQyxFQUFBQSxNQUFNLEVBQUU7QUFUb0IsQ0FBTCxDQUFwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbnVtICBmcm9tICcuLi8uLi9wbGF0Zm9ybS9DQ0VudW0nO1xuXG5leHBvcnQgY29uc3QgU3BhY2UgPSBFbnVtKHtcbiAgICBXb3JsZDogMCxcbiAgICBMb2NhbDogMSxcbiAgICBDdXN0b206IDIsXG59KTtcblxuLyoqXG4gKiDnspLlrZDnmoTnlJ/miJDmqKHlvI9cbiAqIEBlbnVtIFBhcnRpY2xlU3lzdGVtM0RBc3NlbWJsZXIuUmVuZGVyTW9kZVxuICovXG5leHBvcnQgY29uc3QgUmVuZGVyTW9kZSA9IEVudW0oe1xuXG4gICAgLyoqXG4gICAgICog57KS5a2Q5aeL57uI6Z2i5ZCR5pGE5YOP5py6XG4gICAgICovXG4gICAgQmlsbGJvYXJkOiAwLFxuXG4gICAgLyoqXG4gICAgICog57KS5a2Q5aeL57uI6Z2i5ZCR5pGE5YOP5py65L2G5Lya5qC55o2u5Y+C5pWw6L+b6KGM5ouJ5Ly4XG4gICAgICovXG4gICAgU3RyZWN0aGVkQmlsbGJvYXJkOiAxLFxuXG4gICAgLyoqXG4gICAgICog57KS5a2Q5aeL57uI5LiOIFhaIOW5s+mdouW5s+ihjFxuICAgICAqL1xuICAgIEhvcml6b250YWxCaWxsYm9hcmQ6IDIsXG5cbiAgICAvKipcbiAgICAgKiDnspLlrZDlp4vnu4jkuI4gWSDovbTlubPooYzkuJTmnJ3lkJHmkYTlg4/mnLpcbiAgICAgKi9cbiAgICBWZXJ0aWNhbEJpbGxib2FyZDogMyxcblxuICAgIC8qKlxuICAgICAqIOeykuWtkOS/neaMgeaooeWei+acrOi6q+eKtuaAgVxuICAgICAqL1xuICAgIE1lc2g6IDQsXG59KTtcblxuLyoqXG4gKiDnspLlrZDlj5HlsITlmajnsbvlnotcbiAqIEBlbnVtIHNoYXBlTW9kdWxlLlNoYXBlVHlwZVxuICovXG5leHBvcnQgY29uc3QgU2hhcGVUeXBlID0gRW51bSh7XG4gICAgLyoqXG4gICAgICog56uL5pa55L2T57G75Z6L57KS5a2Q5Y+R5bCE5ZmoXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJveFxuICAgICAqL1xuICAgIEJveDogMCxcblxuICAgIC8qKlxuICAgICAqIOWchuW9oueykuWtkOWPkeWwhOWZqFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDaXJjbGVcbiAgICAgKi9cbiAgICBDaXJjbGU6IDEsXG5cbiAgICAvKipcbiAgICAgKiDlnIbplKXkvZPnspLlrZDlj5HlsITlmahcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQ29uZVxuICAgICAqL1xuICAgIENvbmU6IDIsXG5cbiAgICAvKipcbiAgICAgKiDnkIPkvZPnspLlrZDlj5HlsITlmahcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU3BoZXJlXG4gICAgICovXG4gICAgU3BoZXJlOiAzLFxuXG4gICAgLyoqXG4gICAgICog5Y2K55CD5L2T57KS5a2Q5Y+R5bCE5ZmoXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhlbWlzcGhlcmVcbiAgICAgKi9cbiAgICBIZW1pc3BoZXJlOiA0LFxufSk7XG5cbi8qKlxuICog57KS5a2Q5LuO5Y+R5bCE5Zmo55qE5ZOq5Liq6YOo5L2N5Y+R5bCEXG4gKiBAZW51bSBzaGFwZU1vZHVsZS5FbWl0TG9jYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IEVtaXRMb2NhdGlvbiA9IEVudW0oe1xuICAgIC8qKlxuICAgICAqIOWfuuehgOS9jee9ruWPkeWwhO+8iOS7heWvuSBDaXJjbGUg57G75Z6L5Y+KIENvbmUg57G75Z6L55qE57KS5a2Q5Y+R5bCE5Zmo6YCC55So77yJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJhc2VcbiAgICAgKi9cbiAgICBCYXNlOiAwLFxuXG4gICAgLyoqXG4gICAgICog6L655qGG5L2N572u5Y+R5bCE77yI5LuF5a+5IEJveCDnsbvlnovlj4ogQ2lyY2xlIOexu+Wei+eahOeykuWtkOWPkeWwhOWZqOmAgueUqO+8iVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFZGdlXG4gICAgICovXG4gICAgRWRnZTogMSxcblxuICAgIC8qKlxuICAgICAqIOihqOmdouS9jee9ruWPkeWwhO+8iOWvueaJgOacieexu+Wei+eahOeykuWtkOWPkeWwhOWZqOmDvemAgueUqO+8iVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTaGVsbFxuICAgICAqL1xuICAgIFNoZWxsOiAyLFxuXG4gICAgLyoqXG4gICAgICog5YaF6YOo5L2N572u5Y+R5bCE77yI5a+55omA5pyJ57G75Z6L55qE57KS5a2Q5Y+R5bCE5Zmo6YO96YCC55So77yJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFZvbHVtZVxuICAgICAqL1xuICAgIFZvbHVtZTogMyxcbn0pO1xuXG4vKipcbiAqIOeykuWtkOWcqOaJh+W9ouWMuuWfn+eahOWPkeWwhOaWueW8j1xuICogQGVudW0gc2hhcGVNb2R1bGUuQXJjTW9kZVxuICovXG5leHBvcnQgY29uc3QgQXJjTW9kZSA9IEVudW0oe1xuICAgIC8qKlxuICAgICAqIOmaj+acuuS9jee9ruWPkeWwhFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSYW5kb21cbiAgICAgKi9cbiAgICBSYW5kb206IDAsXG5cbiAgICAvKipcbiAgICAgKiDmsr/mn5DkuIDmlrnlkJHlvqrnjq/lj5HlsITvvIzmr4/mrKHlvqrnjq/mlrnlkJHnm7jlkIxcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTG9vcFxuICAgICAqL1xuICAgIExvb3A6IDEsXG5cbiAgICAvKipcbiAgICAgKiDlvqrnjq/lj5HlsITvvIzmr4/mrKHlvqrnjq/mlrnlkJHnm7jlj41cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUGluZ1BvbmdcbiAgICAgKi9cbiAgICBQaW5nUG9uZzogMixcbn0pO1xuXG4vKipcbiAqIOmAieaLqeWmguS9leS4uueykuWtkOezu+e7n+eUn+aIkOi9qOi/uVxuICogQGVudW0gdHJhaWxNb2R1bGUuVHJhaWxNb2RlXG4gKi9cbmV4cG9ydCBjb25zdCBUcmFpbE1vZGUgPSBFbnVtKHtcbiAgICAvKipcbiAgICAgKiDnspLlrZDmqKHlvI88Ymc+XG4gICAgICog5Yib5bu65LiA56eN5pWI5p6c77yM5YW25Lit5q+P5Liq57KS5a2Q5Zyo5YW26Lev5b6E5Lit55WZ5LiL5Zu65a6a55qE6L2o6L+5XG4gICAgICovXG4gICAgUGFydGljbGVzOiAwLFxuXG4gICAgLyoqXG4gICAgICog5bim5qih5byPPGJnPlxuICAgICAqIOagueaNruWFtueUn+WRveWRqOacn+WIm+W7uui/nuaOpeavj+S4queykuWtkOeahOi9qOi/ueW4plxuICAgICAqL1xuICAgIFJpYmJvbjogMSxcbn0pO1xuXG4vKipcbiAqIOe6ueeQhuWhq+WFheaooeW8j1xuICogQGVudW0gdHJhaWxNb2R1bGUuVGV4dHVyZU1vZGVcbiAqL1xuZXhwb3J0IGNvbnN0IFRleHR1cmVNb2RlID0gRW51bSh7XG4gICAgLyoqXG4gICAgICog5ouJ5Ly45aGr5YWF57q555CGXG4gICAgICovXG4gICAgU3RyZXRjaDogMCxcblxuICAgIC8qKlxuICAgICAqIOmHjeWkjeWhq+WFhee6ueeQhlxuICAgICAqL1xuICAgIFJlcGVhdDogMSxcbn0pO1xuIl19