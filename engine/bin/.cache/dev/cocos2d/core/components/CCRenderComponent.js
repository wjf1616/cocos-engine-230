
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCRenderComponent.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../renderer/assembler"));

var _materialVariant = _interopRequireDefault(require("../assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
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

var RenderFlow = require('../renderer/render-flow');

var Material = require('../assets/material/CCMaterial');
/**
 * !#en
 * Base class for components which supports rendering features.
 * !#zh
 * 所有支持渲染的组件的基类
 *
 * @class RenderComponent
 * @extends Component
 */


var RenderComponent = cc.Class({
  name: 'RenderComponent',
  "extends": Component,
  editor: CC_EDITOR && {
    executeInEditMode: true,
    disallowMultiple: true
  },
  properties: {
    _materials: {
      "default": [],
      type: Material
    },

    /**
     * !#en The materials used by this render component.
     * !#zh 渲染组件使用的材质。
     * @property {[Material]} sharedMaterials
     */
    materials: {
      get: function get() {
        return this._materials;
      },
      set: function set(val) {
        this._materials = val;

        this._activateMaterial();
      },
      type: [Material],
      displayName: 'Materials',
      animatable: false
    }
  },
  ctor: function ctor() {
    this._vertsDirty = true;
    this._assembler = null;
  },
  _resetAssembler: function _resetAssembler() {
    _assembler["default"].init(this);

    this._updateColor();
  },
  __preload: function __preload() {
    this._resetAssembler();

    this._activateMaterial();
  },
  onEnable: function onEnable() {
    if (this.node._renderComponent) {
      this.node._renderComponent.enabled = false;
    }

    this.node._renderComponent = this;
    this.node._renderFlag |= RenderFlow.FLAG_OPACITY_COLOR;
    this.setVertsDirty();
  },
  onDisable: function onDisable() {
    this.node._renderComponent = null;
    this.disableRender();
  },
  onDestroy: function onDestroy() {
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      cc.pool.material.put(materials[i]);
    }

    materials.length = 0;
    cc.pool.assembler.put(this._assembler);
  },
  setVertsDirty: function setVertsDirty() {
    this._vertsDirty = true;
    this.markForRender(true);
  },
  _on3DNodeChanged: function _on3DNodeChanged() {
    this._resetAssembler();
  },
  _validateRender: function _validateRender() {},
  markForValidate: function markForValidate() {
    cc.RenderFlow.registerValidate(this);
  },
  markForRender: function markForRender(enable) {
    var flag = RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA;

    if (enable) {
      this.node._renderFlag |= flag;
      this.markForValidate();
    } else {
      this.node._renderFlag &= ~flag;
    }
  },
  disableRender: function disableRender() {
    this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA);
  },

  /**
   * !#en Get the material by index.
   * !#zh 根据指定索引获取材质
   * @method getMaterial
   * @param {Number} index 
   * @return {MaterialVariant}
   */
  getMaterial: function getMaterial(index) {
    if (index < 0 || index >= this._materials.length) {
      return null;
    }

    var material = this._materials[index];
    if (!material) return null;

    var instantiated = _materialVariant["default"].create(material, this);

    if (instantiated !== material) {
      this.setMaterial(index, instantiated);
    }

    return instantiated;
  },

  /**
   * !#en Gets all the materials.
   * !#zh 获取所有材质。
   * @method getMaterials
   * @return {[MaterialVariant]}
   */
  getMaterials: function getMaterials() {
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      materials[i] = _materialVariant["default"].create(materials[i], this);
    }

    return materials;
  },

  /**
   * !#en Set the material by index.
   * !#zh 根据指定索引设置材质
   * @method setMaterial
   * @param {Number} index 
   * @param {Material} material
   * @return {Material}
   */
  setMaterial: function setMaterial(index, material) {
    if (material !== this._materials[index]) {
      material = _materialVariant["default"].create(material, this);
      this._materials[index] = material;
    }

    this._updateMaterial();

    this.markForRender(true);
    return material;
  },
  _getDefaultMaterial: function _getDefaultMaterial() {
    return Material.getBuiltinMaterial('2d-sprite');
  },

  /**
   * Init material.
   */
  _activateMaterial: function _activateMaterial() {
    var materials = this._materials;

    if (!materials[0]) {
      var material = this._getDefaultMaterial();

      materials[0] = material;
    }

    for (var i = 0; i < materials.length; i++) {
      materials[i] = _materialVariant["default"].create(materials[i], this);
    }

    this._updateMaterial();
  },

  /**
   * Update material properties.
   */
  _updateMaterial: function _updateMaterial() {},
  _updateColor: function _updateColor() {
    if (this._assembler.updateColor) {
      this._assembler.updateColor(this);
    }
  },
  _checkBacth: function _checkBacth(renderer, cullingMask) {
    var material = this._materials[0];

    if (material && material.getHash() !== renderer.material.getHash() || renderer.cullingMask !== cullingMask) {
      renderer._flush();

      renderer.node = material.getDefine('CC_USE_MODEL') ? this.node : renderer._dummyNode;
      renderer.material = material;
      renderer.cullingMask = cullingMask;
    }
  }
});
cc.RenderComponent = module.exports = RenderComponent;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmVuZGVyQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbIkNvbXBvbmVudCIsInJlcXVpcmUiLCJSZW5kZXJGbG93IiwiTWF0ZXJpYWwiLCJSZW5kZXJDb21wb25lbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZGlzYWxsb3dNdWx0aXBsZSIsInByb3BlcnRpZXMiLCJfbWF0ZXJpYWxzIiwidHlwZSIsIm1hdGVyaWFscyIsImdldCIsInNldCIsInZhbCIsIl9hY3RpdmF0ZU1hdGVyaWFsIiwiZGlzcGxheU5hbWUiLCJhbmltYXRhYmxlIiwiY3RvciIsIl92ZXJ0c0RpcnR5IiwiX2Fzc2VtYmxlciIsIl9yZXNldEFzc2VtYmxlciIsIkFzc2VtYmxlciIsImluaXQiLCJfdXBkYXRlQ29sb3IiLCJfX3ByZWxvYWQiLCJvbkVuYWJsZSIsIm5vZGUiLCJfcmVuZGVyQ29tcG9uZW50IiwiZW5hYmxlZCIsIl9yZW5kZXJGbGFnIiwiRkxBR19PUEFDSVRZX0NPTE9SIiwic2V0VmVydHNEaXJ0eSIsIm9uRGlzYWJsZSIsImRpc2FibGVSZW5kZXIiLCJvbkRlc3Ryb3kiLCJpIiwibGVuZ3RoIiwicG9vbCIsIm1hdGVyaWFsIiwicHV0IiwiYXNzZW1ibGVyIiwibWFya0ZvclJlbmRlciIsIl9vbjNETm9kZUNoYW5nZWQiLCJfdmFsaWRhdGVSZW5kZXIiLCJtYXJrRm9yVmFsaWRhdGUiLCJyZWdpc3RlclZhbGlkYXRlIiwiZW5hYmxlIiwiZmxhZyIsIkZMQUdfUkVOREVSIiwiRkxBR19VUERBVEVfUkVOREVSX0RBVEEiLCJnZXRNYXRlcmlhbCIsImluZGV4IiwiaW5zdGFudGlhdGVkIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwic2V0TWF0ZXJpYWwiLCJnZXRNYXRlcmlhbHMiLCJfdXBkYXRlTWF0ZXJpYWwiLCJfZ2V0RGVmYXVsdE1hdGVyaWFsIiwiZ2V0QnVpbHRpbk1hdGVyaWFsIiwidXBkYXRlQ29sb3IiLCJfY2hlY2tCYWN0aCIsInJlbmRlcmVyIiwiY3VsbGluZ01hc2siLCJnZXRIYXNoIiwiX2ZsdXNoIiwiZ2V0RGVmaW5lIiwiX2R1bW15Tm9kZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7Ozs7QUExQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxlQUFELENBQXpCOztBQUNBLElBQU1DLFVBQVUsR0FBR0QsT0FBTyxDQUFDLHlCQUFELENBQTFCOztBQUNBLElBQU1FLFFBQVEsR0FBR0YsT0FBTyxDQUFDLCtCQUFELENBQXhCO0FBRUE7Ozs7Ozs7Ozs7O0FBU0EsSUFBSUcsZUFBZSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUMzQkMsRUFBQUEsSUFBSSxFQUFFLGlCQURxQjtBQUUzQixhQUFTUCxTQUZrQjtBQUkzQlEsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLGlCQUFpQixFQUFFLElBREY7QUFFakJDLElBQUFBLGdCQUFnQixFQUFFO0FBRkQsR0FKTTtBQVMzQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLEVBREQ7QUFFUkMsTUFBQUEsSUFBSSxFQUFFWDtBQUZFLEtBREo7O0FBTVI7Ozs7O0FBS0FZLElBQUFBLFNBQVMsRUFBRTtBQUNQQyxNQUFBQSxHQURPLGlCQUNBO0FBQ0gsZUFBTyxLQUFLSCxVQUFaO0FBQ0gsT0FITTtBQUlQSSxNQUFBQSxHQUpPLGVBSUZDLEdBSkUsRUFJRztBQUNOLGFBQUtMLFVBQUwsR0FBa0JLLEdBQWxCOztBQUNBLGFBQUtDLGlCQUFMO0FBQ0gsT0FQTTtBQVFQTCxNQUFBQSxJQUFJLEVBQUUsQ0FBQ1gsUUFBRCxDQVJDO0FBU1BpQixNQUFBQSxXQUFXLEVBQUUsV0FUTjtBQVVQQyxNQUFBQSxVQUFVLEVBQUU7QUFWTDtBQVhILEdBVGU7QUFrQzNC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bEIsRUFBcEMsSUFDQUYsUUFBUSxDQUFDQyxXQUFULEtBQXlCQSxXQUQ3QixFQUMwQztBQUN0Q0QsTUFBQUEsUUFBUSxDQUFDRyxNQUFUOztBQUVBSCxNQUFBQSxRQUFRLENBQUNwQyxJQUFULEdBQWdCWSxRQUFRLENBQUM0QixTQUFULENBQW1CLGNBQW5CLElBQXFDLEtBQUt4QyxJQUExQyxHQUFpRG9DLFFBQVEsQ0FBQ0ssVUFBMUU7QUFDQUwsTUFBQUEsUUFBUSxDQUFDeEIsUUFBVCxHQUFvQkEsUUFBcEI7QUFDQXdCLE1BQUFBLFFBQVEsQ0FBQ0MsV0FBVCxHQUF1QkEsV0FBdkI7QUFDSDtBQUNKO0FBNU0wQixDQUFULENBQXRCO0FBK01BL0QsRUFBRSxDQUFDRCxlQUFILEdBQXFCcUUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdEUsZUFBdEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uL3JlbmRlcmVyL2Fzc2VtYmxlcic7XG5pbXBvcnQgTWF0ZXJpYWxWYXJpYW50IGZyb20gJy4uL2Fzc2V0cy9tYXRlcmlhbC9tYXRlcmlhbC12YXJpYW50JztcblxuY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9tYXRlcmlhbC9DQ01hdGVyaWFsJyk7XG5cbi8qKlxuICogISNlblxuICogQmFzZSBjbGFzcyBmb3IgY29tcG9uZW50cyB3aGljaCBzdXBwb3J0cyByZW5kZXJpbmcgZmVhdHVyZXMuXG4gKiAhI3poXG4gKiDmiYDmnInmlK/mjIHmuLLmn5PnmoTnu4Tku7bnmoTln7rnsbtcbiAqXG4gKiBAY2xhc3MgUmVuZGVyQ29tcG9uZW50XG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IFJlbmRlckNvbXBvbmVudCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnUmVuZGVyQ29tcG9uZW50JyxcbiAgICBleHRlbmRzOiBDb21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgICAgICBkaXNhbGxvd011bHRpcGxlOiB0cnVlXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX21hdGVyaWFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBNYXRlcmlhbCxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbWF0ZXJpYWxzIHVzZWQgYnkgdGhpcyByZW5kZXIgY29tcG9uZW50LlxuICAgICAgICAgKiAhI3poIOa4suafk+e7hOS7tuS9v+eUqOeahOadkOi0qOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1tNYXRlcmlhbF19IHNoYXJlZE1hdGVyaWFsc1xuICAgICAgICAgKi9cbiAgICAgICAgbWF0ZXJpYWxzOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbHM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbHMgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFtNYXRlcmlhbF0sXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ01hdGVyaWFscycsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fdmVydHNEaXJ0eSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIF9yZXNldEFzc2VtYmxlciAoKSB7XG4gICAgICAgIEFzc2VtYmxlci5pbml0KHRoaXMpO1xuICAgICAgICB0aGlzLl91cGRhdGVDb2xvcigpO1xuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZU1hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5fcmVuZGVyQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckNvbXBvbmVudC5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJDb21wb25lbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX09QQUNJVFlfQ09MT1I7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJDb21wb25lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNjLnBvb2wubWF0ZXJpYWwucHV0KG1hdGVyaWFsc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbWF0ZXJpYWxzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgY2MucG9vbC5hc3NlbWJsZXIucHV0KHRoaXMuX2Fzc2VtYmxlcik7XG4gICAgfSxcblxuICAgIHNldFZlcnRzRGlydHkgKCkge1xuICAgICAgICB0aGlzLl92ZXJ0c0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgIH0sXG5cbiAgICBfb24zRE5vZGVDaGFuZ2VkICgpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICB9LFxuICAgIFxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgfSxcblxuICAgIG1hcmtGb3JWYWxpZGF0ZSAoKSB7XG4gICAgICAgIGNjLlJlbmRlckZsb3cucmVnaXN0ZXJWYWxpZGF0ZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgbWFya0ZvclJlbmRlciAoZW5hYmxlKSB7XG4gICAgICAgIGxldCBmbGFnID0gUmVuZGVyRmxvdy5GTEFHX1JFTkRFUiB8IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEE7XG4gICAgICAgIGlmIChlbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyB8PSBmbGFnO1xuICAgICAgICAgICAgdGhpcy5tYXJrRm9yVmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+ZmxhZztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXNhYmxlUmVuZGVyICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICY9IH4oUmVuZGVyRmxvdy5GTEFHX1JFTkRFUiB8IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgbWF0ZXJpYWwgYnkgaW5kZXguXG4gICAgICogISN6aCDmoLnmja7mjIflrprntKLlvJXojrflj5bmnZDotKhcbiAgICAgKiBAbWV0aG9kIGdldE1hdGVyaWFsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFxuICAgICAqIEByZXR1cm4ge01hdGVyaWFsVmFyaWFudH1cbiAgICAgKi9cbiAgICBnZXRNYXRlcmlhbCAoaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLl9tYXRlcmlhbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsc1tpbmRleF07XG4gICAgICAgIGlmICghbWF0ZXJpYWwpIHJldHVybiBudWxsO1xuICAgICAgICBcbiAgICAgICAgbGV0IGluc3RhbnRpYXRlZCA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGUobWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICBpZiAoaW5zdGFudGlhdGVkICE9PSBtYXRlcmlhbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRNYXRlcmlhbChpbmRleCwgaW5zdGFudGlhdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnN0YW50aWF0ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBhbGwgdGhlIG1hdGVyaWFscy5cbiAgICAgKiAhI3poIOiOt+WPluaJgOacieadkOi0qOOAglxuICAgICAqIEBtZXRob2QgZ2V0TWF0ZXJpYWxzXG4gICAgICogQHJldHVybiB7W01hdGVyaWFsVmFyaWFudF19XG4gICAgICovXG4gICAgZ2V0TWF0ZXJpYWxzICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGVyaWFsc1tpXSA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGUobWF0ZXJpYWxzW2ldLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0ZXJpYWxzO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIG1hdGVyaWFsIGJ5IGluZGV4LlxuICAgICAqICEjemgg5qC55o2u5oyH5a6a57Si5byV6K6+572u5p2Q6LSoXG4gICAgICogQG1ldGhvZCBzZXRNYXRlcmlhbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBcbiAgICAgKiBAcGFyYW0ge01hdGVyaWFsfSBtYXRlcmlhbFxuICAgICAqIEByZXR1cm4ge01hdGVyaWFsfVxuICAgICAqL1xuICAgIHNldE1hdGVyaWFsIChpbmRleCwgbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKG1hdGVyaWFsICE9PSB0aGlzLl9tYXRlcmlhbHNbaW5kZXhdKSB7XG4gICAgICAgICAgICBtYXRlcmlhbCA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGUobWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxzW2luZGV4XSA9IG1hdGVyaWFsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xuICAgIH0sXG5cbiAgICBfZ2V0RGVmYXVsdE1hdGVyaWFsICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGVyaWFsLmdldEJ1aWx0aW5NYXRlcmlhbCgnMmQtc3ByaXRlJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXQgbWF0ZXJpYWwuXG4gICAgICovXG4gICAgX2FjdGl2YXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gdGhpcy5fbWF0ZXJpYWxzO1xuICAgICAgICBpZiAoIW1hdGVyaWFsc1swXSkge1xuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fZ2V0RGVmYXVsdE1hdGVyaWFsKCk7XG4gICAgICAgICAgICBtYXRlcmlhbHNbMF0gPSBtYXRlcmlhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRlcmlhbHNbaV0gPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlKG1hdGVyaWFsc1tpXSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgbWF0ZXJpYWwgcHJvcGVydGllcy5cbiAgICAgKi9cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuXG4gICAgfSxcblxuICAgIF91cGRhdGVDb2xvciAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlbWJsZXIudXBkYXRlQ29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlci51cGRhdGVDb2xvcih0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY2hlY2tCYWN0aCAocmVuZGVyZXIsIGN1bGxpbmdNYXNrKSB7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsc1swXTtcbiAgICAgICAgaWYgKChtYXRlcmlhbCAmJiBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IHJlbmRlcmVyLm1hdGVyaWFsLmdldEhhc2goKSkgfHwgXG4gICAgICAgICAgICByZW5kZXJlci5jdWxsaW5nTWFzayAhPT0gY3VsbGluZ01hc2spIHtcbiAgICAgICAgICAgIHJlbmRlcmVyLl9mbHVzaCgpO1xuICAgIFxuICAgICAgICAgICAgcmVuZGVyZXIubm9kZSA9IG1hdGVyaWFsLmdldERlZmluZSgnQ0NfVVNFX01PREVMJykgPyB0aGlzLm5vZGUgOiByZW5kZXJlci5fZHVtbXlOb2RlO1xuICAgICAgICAgICAgcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgICAgIHJlbmRlcmVyLmN1bGxpbmdNYXNrID0gY3VsbGluZ01hc2s7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuUmVuZGVyQ29tcG9uZW50ID0gbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJDb21wb25lbnQ7XG4iXX0=