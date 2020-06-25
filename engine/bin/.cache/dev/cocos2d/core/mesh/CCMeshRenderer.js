
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/mesh/CCMeshRenderer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _inputAssembler = _interopRequireDefault(require("../../renderer/core/input-assembler"));

var _aabb = _interopRequireDefault(require("../geom-utils/aabb"));

var _meshUtil = require("../utils/mesh-util");

var _vec = _interopRequireDefault(require("../value-types/vec3"));

var _mat = _interopRequireDefault(require("../value-types/mat4"));

var _materialVariant = _interopRequireDefault(require("../assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

var Mesh = require('./CCMesh');

var RenderFlow = require('../renderer/render-flow');

var Renderer = require('../renderer');

var Material = require('../assets/material/CCMaterial');
/**
 * !#en Shadow projection mode
 *
 * !#ch 阴影投射方式
 * @static
 * @enum MeshRenderer.ShadowCastingMode
 */


var ShadowCastingMode = cc.Enum({
  /**
   * !#en
   *
   * !#ch 关闭阴影投射
   * @property OFF
   * @readonly
   * @type {Number}
   */
  OFF: 0,

  /**
   * !#en
   *
   * !#ch 开启阴影投射，当阴影光产生的时候
   * @property ON
   * @readonly
   * @type {Number}
   */
  ON: 1 // /**
  //  * !#en
  //  *
  //  * !#ch 可以从网格的任意一遍投射出阴影
  //  * @property TWO_SIDED
  //  * @readonly
  //  * @type {Number}
  //  */
  // TWO_SIDED: 2,
  // /**
  //  * !#en
  //  *
  //  * !#ch 只显示阴影
  //  * @property SHADOWS_ONLY
  //  * @readonly
  //  * @type {Number}
  //  */
  // SHADOWS_ONLY: 3,

});
/**
 * !#en
 * Mesh Renderer Component
 * !#zh
 * 网格渲染组件
 * @class MeshRenderer
 * @extends RenderComponent
 */

var MeshRenderer = cc.Class({
  name: 'cc.MeshRenderer',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.mesh/MeshRenderer'
  },
  properties: {
    _mesh: {
      "default": null,
      type: Mesh
    },
    _receiveShadows: false,
    _shadowCastingMode: ShadowCastingMode.OFF,
    _enableAutoBatch: false,

    /**
     * !#en
     * The mesh which the renderer uses.
     * !#zh
     * 设置使用的网格
     * @property {Mesh} mesh
     */
    mesh: {
      get: function get() {
        return this._mesh;
      },
      set: function set(v) {
        if (this._mesh === v) return;

        this._setMesh(v);

        if (!v) {
          this.disableRender();
          return;
        }

        this.markForRender(true);
        this.node._renderFlag |= RenderFlow.FLAG_TRANSFORM;
      },
      type: Mesh,
      animatable: false
    },
    textures: {
      "default": [],
      type: cc.Texture2D,
      visible: false
    },

    /**
     * !#en
     * Whether the mesh should receive shadows.
     * !#zh
     * 网格是否接受光源投射的阴影
     * @property {Boolean} receiveShadows
     */
    receiveShadows: {
      get: function get() {
        return this._receiveShadows;
      },
      set: function set(val) {
        this._receiveShadows = val;

        this._updateReceiveShadow();
      },
      animatable: false
    },

    /**
     * !#en
     * Shadow Casting Mode
     * !#zh
     * 网格投射阴影的模式
     * @property {ShadowCastingMode} shadowCastingMode
     */
    shadowCastingMode: {
      get: function get() {
        return this._shadowCastingMode;
      },
      set: function set(val) {
        this._shadowCastingMode = val;

        this._updateCastShadow();
      },
      type: ShadowCastingMode,
      animatable: false
    },

    /**
     * !#en
     * Enable auto merge mesh, only support when mesh's VertexFormat, PrimitiveType, materials are all the same
     * !#zh 
     * 开启自动合并 mesh 功能，只有在网格的 顶点格式，PrimitiveType, 使用的材质 都一致的情况下才会有效
     * @property {Boolean} enableAutoBatch
     */
    enableAutoBatch: {
      get: function get() {
        return this._enableAutoBatch;
      },
      set: function set(val) {
        this._enableAutoBatch = val;
      }
    }
  },
  statics: {
    ShadowCastingMode: ShadowCastingMode
  },
  ctor: function ctor() {
    this._boundingBox = cc.geomUtils && new _aabb["default"]();

    if (CC_DEBUG) {
      this._debugDatas = {
        wireFrame: [],
        normal: []
      };
    }
  },
  onEnable: function onEnable() {
    var _this = this;

    this._super();

    if (this._mesh && !this._mesh.loaded) {
      this.disableRender();

      this._mesh.once('load', function () {
        if (!_this.isValid) return;

        _this._setMesh(_this._mesh);

        _this.markForRender(true);
      });

      (0, _meshUtil.postLoadMesh)(this._mesh);
    } else {
      this._setMesh(this._mesh);
    }

    this._updateRenderNode();

    this._updateMaterial();
  },
  onDestroy: function onDestroy() {
    this._setMesh(null);

    cc.pool.assembler.put(this._assembler);
  },
  _updateRenderNode: function _updateRenderNode() {
    this._assembler.setRenderNode(this.node);
  },
  _setMesh: function _setMesh(mesh) {
    if (cc.geomUtils && mesh) {
      _aabb["default"].fromPoints(this._boundingBox, mesh._minPos, mesh._maxPos);
    }

    if (this._mesh) {
      this._mesh.off('init-format', this._updateMeshAttribute, this);
    }

    if (mesh) {
      mesh.on('init-format', this._updateMeshAttribute, this);
    }

    this._mesh = mesh;

    this._updateMeshAttribute();
  },
  _getDefaultMaterial: function _getDefaultMaterial() {
    return Material.getBuiltinMaterial('unlit');
  },
  _validateRender: function _validateRender() {
    var mesh = this._mesh;

    if (mesh && mesh._subDatas.length > 0) {
      return;
    }

    this.disableRender();
  },
  _updateMaterial: function _updateMaterial() {
    // TODO: used to upgrade from 2.1, should be removed
    var textures = this.textures;

    if (textures && textures.length > 0) {
      for (var i = 0; i < textures.length; i++) {
        var material = this._materials[i];
        if (material) continue;
        material = _materialVariant["default"].create(this._getDefaultMaterial(), this);
        material.setProperty('diffuseTexture', textures[i]);
        this.setMaterial(i, material);
      }
    }

    this._updateReceiveShadow();

    this._updateCastShadow();

    this._updateMeshAttribute();
  },
  _updateReceiveShadow: function _updateReceiveShadow() {
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      materials[i].define('CC_USE_SHADOW_MAP', this._receiveShadows, undefined, true);
    }
  },
  _updateCastShadow: function _updateCastShadow() {
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      materials[i].define('CC_CASTING_SHADOW', this._shadowCastingMode === ShadowCastingMode.ON, undefined, true);
    }
  },
  _updateMeshAttribute: function _updateMeshAttribute() {
    var subDatas = this._mesh && this._mesh.subDatas;
    if (!subDatas) return;
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      if (!subDatas[i]) break;
      var vfm = subDatas[i].vfm;
      var material = materials[i];
      material.define('CC_USE_ATTRIBUTE_COLOR', !!vfm.element(_gfx["default"].ATTR_COLOR), undefined, true);
      material.define('CC_USE_ATTRIBUTE_UV0', !!vfm.element(_gfx["default"].ATTR_UV0), undefined, true);
      material.define('CC_USE_ATTRIBUTE_NORMAL', !!vfm.element(_gfx["default"].ATTR_NORMAL), undefined, true);
      material.define('CC_USE_ATTRIBUTE_TANGENT', !!vfm.element(_gfx["default"].ATTR_TANGENT), undefined, true);
    }

    if (CC_DEBUG) {
      for (var name in this._debugDatas) {
        this._debugDatas[name].length = 0;
      }
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._assembler.updateMeshData(this);
    }
  },
  _checkBacth: function _checkBacth() {}
});

if (CC_DEBUG) {
  var BLACK_COLOR = cc.Color.BLACK;
  var RED_COLOR = cc.Color.RED;
  var v3_tmp = [cc.v3(), cc.v3()];
  var mat4_tmp = cc.mat4();
  var createDebugDataFns = {
    normal: function normal(comp, ia, subData, subIndex) {
      var oldVfm = subData.vfm;
      var normalEle = oldVfm.element(_gfx["default"].ATTR_NORMAL);
      var posEle = oldVfm.element(_gfx["default"].ATTR_POSITION);
      var jointEle = oldVfm.element(_gfx["default"].ATTR_JOINTS);
      var weightEle = oldVfm.element(_gfx["default"].ATTR_WEIGHTS);

      if (!normalEle || !posEle) {
        return;
      }

      var indices = [];
      var vbData = [];
      var lineLength = 100;

      _vec["default"].set(v3_tmp[0], 5, 0, 0);

      _mat["default"].invert(mat4_tmp, comp.node._worldMatrix);

      _vec["default"].transformMat4Normal(v3_tmp[0], v3_tmp[0], mat4_tmp);

      lineLength = v3_tmp[0].mag();
      var mesh = comp.mesh;

      var posData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_POSITION);

      var normalData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_NORMAL);

      var jointData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_JOINTS);

      var weightData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_WEIGHTS);

      var vertexCount = posData.length / posEle.num;

      for (var i = 0; i < vertexCount; i++) {
        var normalIndex = i * normalEle.num;
        var posIndex = i * posEle.num;

        _vec["default"].set(v3_tmp[0], normalData[normalIndex], normalData[normalIndex + 1], normalData[normalIndex + 2]);

        _vec["default"].set(v3_tmp[1], posData[posIndex], posData[posIndex + 1], posData[posIndex + 2]);

        _vec["default"].scaleAndAdd(v3_tmp[0], v3_tmp[1], v3_tmp[0], lineLength);

        for (var lineIndex = 0; lineIndex < 2; lineIndex++) {
          vbData.push(v3_tmp[lineIndex].x, v3_tmp[lineIndex].y, v3_tmp[lineIndex].z);

          if (jointEle) {
            var jointIndex = i * jointEle.num;

            for (var j = 0; j < jointEle.num; j++) {
              vbData.push(jointData[jointIndex + j]);
            }
          }

          if (weightEle) {
            var weightIndex = i * weightEle.num;

            for (var _j = 0; _j < weightEle.num; _j++) {
              vbData.push(weightData[weightIndex + _j]);
            }
          }
        }

        indices.push(i * 2, i * 2 + 1);
      }

      var formatOpts = [{
        name: _gfx["default"].ATTR_POSITION,
        type: _gfx["default"].ATTR_TYPE_FLOAT32,
        num: 3
      }];

      if (jointEle) {
        formatOpts.push({
          name: _gfx["default"].ATTR_JOINTS,
          type: _gfx["default"].ATTR_TYPE_FLOAT32,
          num: jointEle.num
        });
      }

      if (weightEle) {
        formatOpts.push({
          name: _gfx["default"].ATTR_WEIGHTS,
          type: _gfx["default"].ATTR_TYPE_FLOAT32,
          num: weightEle.num
        });
      }

      var gfxVFmt = new _gfx["default"].VertexFormat(formatOpts);
      var vb = new _gfx["default"].VertexBuffer(Renderer.device, gfxVFmt, _gfx["default"].USAGE_STATIC, new Float32Array(vbData));
      var ibData = new Uint16Array(indices);
      var ib = new _gfx["default"].IndexBuffer(Renderer.device, _gfx["default"].INDEX_FMT_UINT16, _gfx["default"].USAGE_STATIC, ibData, ibData.length);

      var m = _materialVariant["default"].createWithBuiltin('unlit');

      m.setProperty('diffuseColor', RED_COLOR);
      return {
        material: m,
        ia: new _inputAssembler["default"](vb, ib, _gfx["default"].PT_LINES)
      };
    },
    wireFrame: function wireFrame(comp, ia, subData) {
      var oldIbData = subData.getIData(Uint16Array);

      var m = _materialVariant["default"].createWithBuiltin('unlit');

      m.setProperty('diffuseColor', BLACK_COLOR);
      var indices = [];

      for (var i = 0; i < oldIbData.length; i += 3) {
        var a = oldIbData[i + 0];
        var b = oldIbData[i + 1];
        var c = oldIbData[i + 2];
        indices.push(a, b, b, c, c, a);
      }

      var ibData = new Uint16Array(indices);
      var ib = new _gfx["default"].IndexBuffer(Renderer.device, _gfx["default"].INDEX_FMT_UINT16, _gfx["default"].USAGE_STATIC, ibData, ibData.length);
      return {
        material: m,
        ia: new _inputAssembler["default"](ia._vertexBuffer, ib, _gfx["default"].PT_LINES)
      };
    }
  };
  var _proto = MeshRenderer.prototype;

  _proto._updateDebugDatas = function () {
    var debugDatas = this._debugDatas;
    var subMeshes = this._mesh.subMeshes;
    var subDatas = this._mesh._subDatas;

    for (var name in debugDatas) {
      var debugData = debugDatas[name];
      if (debugData.length === subMeshes.length) continue;
      if (!cc.macro['SHOW_MESH_' + name.toUpperCase()]) continue;
      debugData.length = subMeshes.length;

      for (var i = 0; i < subMeshes.length; i++) {
        debugData[i] = createDebugDataFns[name](this, subMeshes[i], subDatas[i], i);
      }
    }
  };
}

cc.MeshRenderer = module.exports = MeshRenderer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTWVzaFJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIlJlbmRlckNvbXBvbmVudCIsInJlcXVpcmUiLCJNZXNoIiwiUmVuZGVyRmxvdyIsIlJlbmRlcmVyIiwiTWF0ZXJpYWwiLCJTaGFkb3dDYXN0aW5nTW9kZSIsImNjIiwiRW51bSIsIk9GRiIsIk9OIiwiTWVzaFJlbmRlcmVyIiwiQ2xhc3MiLCJuYW1lIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsInByb3BlcnRpZXMiLCJfbWVzaCIsInR5cGUiLCJfcmVjZWl2ZVNoYWRvd3MiLCJfc2hhZG93Q2FzdGluZ01vZGUiLCJfZW5hYmxlQXV0b0JhdGNoIiwibWVzaCIsImdldCIsInNldCIsInYiLCJfc2V0TWVzaCIsImRpc2FibGVSZW5kZXIiLCJtYXJrRm9yUmVuZGVyIiwibm9kZSIsIl9yZW5kZXJGbGFnIiwiRkxBR19UUkFOU0ZPUk0iLCJhbmltYXRhYmxlIiwidGV4dHVyZXMiLCJUZXh0dXJlMkQiLCJ2aXNpYmxlIiwicmVjZWl2ZVNoYWRvd3MiLCJ2YWwiLCJfdXBkYXRlUmVjZWl2ZVNoYWRvdyIsInNoYWRvd0Nhc3RpbmdNb2RlIiwiX3VwZGF0ZUNhc3RTaGFkb3ciLCJlbmFibGVBdXRvQmF0Y2giLCJzdGF0aWNzIiwiY3RvciIsIl9ib3VuZGluZ0JveCIsImdlb21VdGlscyIsIkFhYmIiLCJDQ19ERUJVRyIsIl9kZWJ1Z0RhdGFzIiwid2lyZUZyYW1lIiwibm9ybWFsIiwib25FbmFibGUiLCJfc3VwZXIiLCJsb2FkZWQiLCJvbmNlIiwiaXNWYWxpZCIsIl91cGRhdGVSZW5kZXJOb2RlIiwiX3VwZGF0ZU1hdGVyaWFsIiwib25EZXN0cm95IiwicG9vbCIsImFzc2VtYmxlciIsInB1dCIsIl9hc3NlbWJsZXIiLCJzZXRSZW5kZXJOb2RlIiwiZnJvbVBvaW50cyIsIl9taW5Qb3MiLCJfbWF4UG9zIiwib2ZmIiwiX3VwZGF0ZU1lc2hBdHRyaWJ1dGUiLCJvbiIsIl9nZXREZWZhdWx0TWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJfdmFsaWRhdGVSZW5kZXIiLCJfc3ViRGF0YXMiLCJsZW5ndGgiLCJpIiwibWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwic2V0UHJvcGVydHkiLCJzZXRNYXRlcmlhbCIsIm1hdGVyaWFscyIsImRlZmluZSIsInVuZGVmaW5lZCIsInN1YkRhdGFzIiwidmZtIiwiZWxlbWVudCIsImdmeCIsIkFUVFJfQ09MT1IiLCJBVFRSX1VWMCIsIkFUVFJfTk9STUFMIiwiQVRUUl9UQU5HRU5UIiwiQ0NfSlNCIiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJ1cGRhdGVNZXNoRGF0YSIsIl9jaGVja0JhY3RoIiwiQkxBQ0tfQ09MT1IiLCJDb2xvciIsIkJMQUNLIiwiUkVEX0NPTE9SIiwiUkVEIiwidjNfdG1wIiwidjMiLCJtYXQ0X3RtcCIsIm1hdDQiLCJjcmVhdGVEZWJ1Z0RhdGFGbnMiLCJjb21wIiwiaWEiLCJzdWJEYXRhIiwic3ViSW5kZXgiLCJvbGRWZm0iLCJub3JtYWxFbGUiLCJwb3NFbGUiLCJBVFRSX1BPU0lUSU9OIiwiam9pbnRFbGUiLCJBVFRSX0pPSU5UUyIsIndlaWdodEVsZSIsIkFUVFJfV0VJR0hUUyIsImluZGljZXMiLCJ2YkRhdGEiLCJsaW5lTGVuZ3RoIiwiVmVjMyIsIk1hdDQiLCJpbnZlcnQiLCJfd29ybGRNYXRyaXgiLCJ0cmFuc2Zvcm1NYXQ0Tm9ybWFsIiwibWFnIiwicG9zRGF0YSIsIl9nZXRBdHRyTWVzaERhdGEiLCJub3JtYWxEYXRhIiwiam9pbnREYXRhIiwid2VpZ2h0RGF0YSIsInZlcnRleENvdW50IiwibnVtIiwibm9ybWFsSW5kZXgiLCJwb3NJbmRleCIsInNjYWxlQW5kQWRkIiwibGluZUluZGV4IiwicHVzaCIsIngiLCJ5IiwieiIsImpvaW50SW5kZXgiLCJqIiwid2VpZ2h0SW5kZXgiLCJmb3JtYXRPcHRzIiwiQVRUUl9UWVBFX0ZMT0FUMzIiLCJnZnhWRm10IiwiVmVydGV4Rm9ybWF0IiwidmIiLCJWZXJ0ZXhCdWZmZXIiLCJkZXZpY2UiLCJVU0FHRV9TVEFUSUMiLCJGbG9hdDMyQXJyYXkiLCJpYkRhdGEiLCJVaW50MTZBcnJheSIsImliIiwiSW5kZXhCdWZmZXIiLCJJTkRFWF9GTVRfVUlOVDE2IiwibSIsImNyZWF0ZVdpdGhCdWlsdGluIiwiSW5wdXRBc3NlbWJsZXIiLCJQVF9MSU5FUyIsIm9sZEliRGF0YSIsImdldElEYXRhIiwiYSIsImIiLCJjIiwiX3ZlcnRleEJ1ZmZlciIsIl9wcm90byIsInByb3RvdHlwZSIsIl91cGRhdGVEZWJ1Z0RhdGFzIiwiZGVidWdEYXRhcyIsInN1Yk1lc2hlcyIsImRlYnVnRGF0YSIsIm1hY3JvIiwidG9VcHBlckNhc2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBL0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ0EsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsaUNBQUQsQ0FBL0I7O0FBQ0EsSUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsVUFBRCxDQUFwQjs7QUFDQSxJQUFNRSxVQUFVLEdBQUdGLE9BQU8sQ0FBQyx5QkFBRCxDQUExQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdILE9BQU8sQ0FBQyxhQUFELENBQXhCOztBQUNBLElBQU1JLFFBQVEsR0FBR0osT0FBTyxDQUFDLCtCQUFELENBQXhCO0FBR0E7Ozs7Ozs7OztBQU9BLElBQUlLLGlCQUFpQixHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUM1Qjs7Ozs7Ozs7QUFRQUMsRUFBQUEsR0FBRyxFQUFFLENBVHVCOztBQVU1Qjs7Ozs7Ozs7QUFRQUMsRUFBQUEsRUFBRSxFQUFFLENBbEJ3QixDQW1CNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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QUFHLEtBQUs3SCxXQUF0QjtBQUNBLFFBQUk4SCxTQUFTLEdBQUcsS0FBSzdKLEtBQUwsQ0FBVzZKLFNBQTNCO0FBQ0EsUUFBSXpGLFFBQVEsR0FBRyxLQUFLcEUsS0FBTCxDQUFXd0QsU0FBMUI7O0FBQ0EsU0FBSyxJQUFJN0QsSUFBVCxJQUFpQmlLLFVBQWpCLEVBQTZCO0FBQ3pCLFVBQUlFLFNBQVMsR0FBR0YsVUFBVSxDQUFDakssSUFBRCxDQUExQjtBQUNBLFVBQUltSyxTQUFTLENBQUNyRyxNQUFWLEtBQXFCb0csU0FBUyxDQUFDcEcsTUFBbkMsRUFBMkM7QUFDM0MsVUFBSSxDQUFDcEUsRUFBRSxDQUFDMEssS0FBSCxDQUFTLGVBQWVwSyxJQUFJLENBQUNxSyxXQUFMLEVBQXhCLENBQUwsRUFBa0Q7QUFFbERGLE1BQUFBLFNBQVMsQ0FBQ3JHLE1BQVYsR0FBbUJvRyxTQUFTLENBQUNwRyxNQUE3Qjs7QUFDQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdtRyxTQUFTLENBQUNwRyxNQUE5QixFQUFzQ0MsQ0FBQyxFQUF2QyxFQUEyQztBQUN2Q29HLFFBQUFBLFNBQVMsQ0FBQ3BHLENBQUQsQ0FBVCxHQUFlK0Isa0JBQWtCLENBQUM5RixJQUFELENBQWxCLENBQXlCLElBQXpCLEVBQStCa0ssU0FBUyxDQUFDbkcsQ0FBRCxDQUF4QyxFQUE2Q1UsUUFBUSxDQUFDVixDQUFELENBQXJELEVBQTBEQSxDQUExRCxDQUFmO0FBQ0g7QUFDSjtBQUNKLEdBZEQ7QUFlSDs7QUFFRHJFLEVBQUUsQ0FBQ0ksWUFBSCxHQUFrQndLLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnpLLFlBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgZ2Z4IGZyb20gJy4uLy4uL3JlbmRlcmVyL2dmeCc7XG5pbXBvcnQgSW5wdXRBc3NlbWJsZXIgZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9pbnB1dC1hc3NlbWJsZXInO1xuaW1wb3J0IEFhYmIgZnJvbSAnLi4vZ2VvbS11dGlscy9hYWJiJztcbmltcG9ydCB7IHBvc3RMb2FkTWVzaCB9IGZyb20gJy4uL3V0aWxzL21lc2gtdXRpbCc7XG5pbXBvcnQgVmVjMyBmcm9tICcuLi92YWx1ZS10eXBlcy92ZWMzJztcbmltcG9ydCBNYXQ0IGZyb20gJy4uL3ZhbHVlLXR5cGVzL21hdDQnO1xuaW1wb3J0IE1hdGVyaWFsVmFyaWFudCBmcm9tICcuLi9hc3NldHMvbWF0ZXJpYWwvbWF0ZXJpYWwtdmFyaWFudCc7XG5cbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IE1lc2ggPSByZXF1aXJlKCcuL0NDTWVzaCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBSZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyJyk7XG5jb25zdCBNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9tYXRlcmlhbC9DQ01hdGVyaWFsJyk7XG5cblxuLyoqXG4gKiAhI2VuIFNoYWRvdyBwcm9qZWN0aW9uIG1vZGVcbiAqXG4gKiAhI2NoIOmYtOW9seaKleWwhOaWueW8j1xuICogQHN0YXRpY1xuICogQGVudW0gTWVzaFJlbmRlcmVyLlNoYWRvd0Nhc3RpbmdNb2RlXG4gKi9cbmxldCBTaGFkb3dDYXN0aW5nTW9kZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKlxuICAgICAqICEjY2gg5YWz6Zet6Zi05b2x5oqV5bCEXG4gICAgICogQHByb3BlcnR5IE9GRlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgT0ZGOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKlxuICAgICAqICEjY2gg5byA5ZCv6Zi05b2x5oqV5bCE77yM5b2T6Zi05b2x5YWJ5Lqn55Sf55qE5pe25YCZXG4gICAgICogQHByb3BlcnR5IE9OXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPTjogMSxcbiAgICAvLyAvKipcbiAgICAvLyAgKiAhI2VuXG4gICAgLy8gICpcbiAgICAvLyAgKiAhI2NoIOWPr+S7peS7jue9keagvOeahOS7u+aEj+S4gOmBjeaKleWwhOWHuumYtOW9sVxuICAgIC8vICAqIEBwcm9wZXJ0eSBUV09fU0lERURcbiAgICAvLyAgKiBAcmVhZG9ubHlcbiAgICAvLyAgKiBAdHlwZSB7TnVtYmVyfVxuICAgIC8vICAqL1xuICAgIC8vIFRXT19TSURFRDogMixcbiAgICAvLyAvKipcbiAgICAvLyAgKiAhI2VuXG4gICAgLy8gICpcbiAgICAvLyAgKiAhI2NoIOWPquaYvuekuumYtOW9sVxuICAgIC8vICAqIEBwcm9wZXJ0eSBTSEFET1dTX09OTFlcbiAgICAvLyAgKiBAcmVhZG9ubHlcbiAgICAvLyAgKiBAdHlwZSB7TnVtYmVyfVxuICAgIC8vICAqL1xuICAgIC8vIFNIQURPV1NfT05MWTogMyxcbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIE1lc2ggUmVuZGVyZXIgQ29tcG9uZW50XG4gKiAhI3poXG4gKiDnvZHmoLzmuLLmn5Pnu4Tku7ZcbiAqIEBjbGFzcyBNZXNoUmVuZGVyZXJcbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5sZXQgTWVzaFJlbmRlcmVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5NZXNoUmVuZGVyZXInLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcbiAgICBcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQubWVzaC9NZXNoUmVuZGVyZXInLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9tZXNoOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogTWVzaFxuICAgICAgICB9LFxuXG4gICAgICAgIF9yZWNlaXZlU2hhZG93czogZmFsc2UsXG4gICAgICAgIF9zaGFkb3dDYXN0aW5nTW9kZTogU2hhZG93Q2FzdGluZ01vZGUuT0ZGLFxuXG4gICAgICAgIF9lbmFibGVBdXRvQmF0Y2g6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBtZXNoIHdoaWNoIHRoZSByZW5kZXJlciB1c2VzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiuvue9ruS9v+eUqOeahOe9keagvFxuICAgICAgICAgKiBAcHJvcGVydHkge01lc2h9IG1lc2hcbiAgICAgICAgICovXG4gICAgICAgIG1lc2g6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21lc2g7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21lc2ggPT09IHYpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRNZXNoKHYpO1xuICAgICAgICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogTWVzaCxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgdGV4dHVyZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuVGV4dHVyZTJELFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBXaGV0aGVyIHRoZSBtZXNoIHNob3VsZCByZWNlaXZlIHNoYWRvd3MuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog572R5qC85piv5ZCm5o6l5Y+X5YWJ5rqQ5oqV5bCE55qE6Zi05b2xXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcmVjZWl2ZVNoYWRvd3NcbiAgICAgICAgICovXG4gICAgICAgIHJlY2VpdmVTaGFkb3dzOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNlaXZlU2hhZG93cztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY2VpdmVTaGFkb3dzID0gdmFsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJlY2VpdmVTaGFkb3coKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFNoYWRvdyBDYXN0aW5nIE1vZGVcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnvZHmoLzmipXlsITpmLTlvbHnmoTmqKHlvI9cbiAgICAgICAgICogQHByb3BlcnR5IHtTaGFkb3dDYXN0aW5nTW9kZX0gc2hhZG93Q2FzdGluZ01vZGVcbiAgICAgICAgICovXG4gICAgICAgIHNoYWRvd0Nhc3RpbmdNb2RlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dDYXN0aW5nTW9kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NoYWRvd0Nhc3RpbmdNb2RlID0gdmFsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RTaGFkb3coKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBTaGFkb3dDYXN0aW5nTW9kZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogRW5hYmxlIGF1dG8gbWVyZ2UgbWVzaCwgb25seSBzdXBwb3J0IHdoZW4gbWVzaCdzIFZlcnRleEZvcm1hdCwgUHJpbWl0aXZlVHlwZSwgbWF0ZXJpYWxzIGFyZSBhbGwgdGhlIHNhbWVcbiAgICAgICAgICogISN6aCBcbiAgICAgICAgICog5byA5ZCv6Ieq5Yqo5ZCI5bm2IG1lc2gg5Yqf6IO977yM5Y+q5pyJ5Zyo572R5qC855qEIOmhtueCueagvOW8j++8jFByaW1pdGl2ZVR5cGUsIOS9v+eUqOeahOadkOi0qCDpg73kuIDoh7TnmoTmg4XlhrXkuIvmiY3kvJrmnInmlYhcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVBdXRvQmF0Y2hcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUF1dG9CYXRjaDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlQXV0b0JhdGNoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlQXV0b0JhdGNoID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFNoYWRvd0Nhc3RpbmdNb2RlOiBTaGFkb3dDYXN0aW5nTW9kZVxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fYm91bmRpbmdCb3ggPSBjYy5nZW9tVXRpbHMgJiYgbmV3IEFhYmIoKTtcblxuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnRGF0YXMgPSB7XG4gICAgICAgICAgICAgICAgd2lyZUZyYW1lOiBbXSxcbiAgICAgICAgICAgICAgICBub3JtYWw6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX21lc2ggJiYgIXRoaXMuX21lc2gubG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX21lc2gub25jZSgnbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldE1lc2godGhpcy5fbWVzaCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwb3N0TG9hZE1lc2godGhpcy5fbWVzaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRNZXNoKHRoaXMuX21lc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyTm9kZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLl9zZXRNZXNoKG51bGwpO1xuICAgICAgICBjYy5wb29sLmFzc2VtYmxlci5wdXQodGhpcy5fYXNzZW1ibGVyKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVJlbmRlck5vZGUgKCkge1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIuc2V0UmVuZGVyTm9kZSh0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICBfc2V0TWVzaCAobWVzaCkge1xuICAgICAgICBpZiAoY2MuZ2VvbVV0aWxzICYmIG1lc2gpIHtcbiAgICAgICAgICAgIEFhYmIuZnJvbVBvaW50cyh0aGlzLl9ib3VuZGluZ0JveCwgbWVzaC5fbWluUG9zLCBtZXNoLl9tYXhQb3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX21lc2gpIHtcbiAgICAgICAgICAgIHRoaXMuX21lc2gub2ZmKCdpbml0LWZvcm1hdCcsIHRoaXMuX3VwZGF0ZU1lc2hBdHRyaWJ1dGUsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNoKSB7XG4gICAgICAgICAgICBtZXNoLm9uKCdpbml0LWZvcm1hdCcsIHRoaXMuX3VwZGF0ZU1lc2hBdHRyaWJ1dGUsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21lc2ggPSBtZXNoO1xuICAgICAgICB0aGlzLl91cGRhdGVNZXNoQXR0cmlidXRlKCk7XG4gICAgfSxcblxuICAgIF9nZXREZWZhdWx0TWF0ZXJpYWwgKCkge1xuICAgICAgICByZXR1cm4gTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKCd1bmxpdCcpO1xuICAgIH0sXG5cbiAgICBfdmFsaWRhdGVSZW5kZXIgKCkge1xuICAgICAgICBsZXQgbWVzaCA9IHRoaXMuX21lc2g7XG4gICAgICAgIGlmIChtZXNoICYmIG1lc2guX3N1YkRhdGFzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICAvLyBUT0RPOiB1c2VkIHRvIHVwZ3JhZGUgZnJvbSAyLjEsIHNob3VsZCBiZSByZW1vdmVkXG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHRoaXMudGV4dHVyZXM7XG4gICAgICAgIGlmICh0ZXh0dXJlcyAmJiB0ZXh0dXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWxzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChtYXRlcmlhbCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlKHRoaXMuX2dldERlZmF1bHRNYXRlcmlhbCgpLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgnZGlmZnVzZVRleHR1cmUnLCB0ZXh0dXJlc1tpXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRlcmlhbChpLCBtYXRlcmlhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVSZWNlaXZlU2hhZG93KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RTaGFkb3coKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTWVzaEF0dHJpYnV0ZSgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmVjZWl2ZVNoYWRvdyAoKSB7XG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSB0aGlzLl9tYXRlcmlhbHM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRlcmlhbHNbaV0uZGVmaW5lKCdDQ19VU0VfU0hBRE9XX01BUCcsIHRoaXMuX3JlY2VpdmVTaGFkb3dzLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVDYXN0U2hhZG93ICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGVyaWFsc1tpXS5kZWZpbmUoJ0NDX0NBU1RJTkdfU0hBRE9XJywgdGhpcy5fc2hhZG93Q2FzdGluZ01vZGUgPT09IFNoYWRvd0Nhc3RpbmdNb2RlLk9OLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVNZXNoQXR0cmlidXRlICgpIHtcbiAgICAgICAgbGV0IHN1YkRhdGFzID0gdGhpcy5fbWVzaCAmJiB0aGlzLl9tZXNoLnN1YkRhdGFzO1xuICAgICAgICBpZiAoIXN1YkRhdGFzKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghc3ViRGF0YXNbaV0pIGJyZWFrO1xuICAgICAgICAgICAgbGV0IHZmbSA9IHN1YkRhdGFzW2ldLnZmbTtcbiAgICAgICAgICAgIGxldCBtYXRlcmlhbCA9IG1hdGVyaWFsc1tpXTtcbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX0FUVFJJQlVURV9DT0xPUicsICEhdmZtLmVsZW1lbnQoZ2Z4LkFUVFJfQ09MT1IpLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfQVRUUklCVVRFX1VWMCcsICEhdmZtLmVsZW1lbnQoZ2Z4LkFUVFJfVVYwKSwgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX0FUVFJJQlVURV9OT1JNQUwnLCAhIXZmbS5lbGVtZW50KGdmeC5BVFRSX05PUk1BTCksIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9BVFRSSUJVVEVfVEFOR0VOVCcsICEhdmZtLmVsZW1lbnQoZ2Z4LkFUVFJfVEFOR0VOVCksIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5fZGVidWdEYXRhcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnRGF0YXNbbmFtZV0ubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlci51cGRhdGVNZXNoRGF0YSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY2hlY2tCYWN0aCAoKSB7XG4gICAgfSxcbn0pO1xuXG5pZiAoQ0NfREVCVUcpIHtcbiAgICBjb25zdCBCTEFDS19DT0xPUiA9IGNjLkNvbG9yLkJMQUNLO1xuICAgIGNvbnN0IFJFRF9DT0xPUiA9IGNjLkNvbG9yLlJFRDtcblxuICAgIGxldCB2M190bXAgPSBbY2MudjMoKSwgY2MudjMoKV07XG4gICAgbGV0IG1hdDRfdG1wID0gY2MubWF0NCgpO1xuXG4gICAgbGV0IGNyZWF0ZURlYnVnRGF0YUZucyA9IHtcbiAgICAgICAgbm9ybWFsIChjb21wLCBpYSwgc3ViRGF0YSwgc3ViSW5kZXgpIHtcbiAgICAgICAgICAgIGxldCBvbGRWZm0gPSBzdWJEYXRhLnZmbTtcblxuICAgICAgICAgICAgbGV0IG5vcm1hbEVsZSA9IG9sZFZmbS5lbGVtZW50KGdmeC5BVFRSX05PUk1BTCk7XG4gICAgICAgICAgICBsZXQgcG9zRWxlID0gb2xkVmZtLmVsZW1lbnQoZ2Z4LkFUVFJfUE9TSVRJT04pO1xuICAgICAgICAgICAgbGV0IGpvaW50RWxlID0gb2xkVmZtLmVsZW1lbnQoZ2Z4LkFUVFJfSk9JTlRTKTtcbiAgICAgICAgICAgIGxldCB3ZWlnaHRFbGUgPSBvbGRWZm0uZWxlbWVudChnZnguQVRUUl9XRUlHSFRTKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFub3JtYWxFbGUgfHwgIXBvc0VsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluZGljZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCB2YkRhdGEgPSBbXTtcblxuICAgICAgICAgICAgbGV0IGxpbmVMZW5ndGggPSAxMDA7XG4gICAgICAgICAgICBWZWMzLnNldCh2M190bXBbMF0sIDUsIDAsIDApO1xuICAgICAgICAgICAgTWF0NC5pbnZlcnQobWF0NF90bXAsIGNvbXAubm9kZS5fd29ybGRNYXRyaXgpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0Tm9ybWFsKHYzX3RtcFswXSwgdjNfdG1wWzBdLCBtYXQ0X3RtcCk7XG4gICAgICAgICAgICBsaW5lTGVuZ3RoID0gdjNfdG1wWzBdLm1hZygpO1xuXG4gICAgICAgICAgICBsZXQgbWVzaCA9IGNvbXAubWVzaDtcbiAgICAgICAgICAgIGxldCBwb3NEYXRhID0gbWVzaC5fZ2V0QXR0ck1lc2hEYXRhKHN1YkluZGV4LCBnZnguQVRUUl9QT1NJVElPTik7XG4gICAgICAgICAgICBsZXQgbm9ybWFsRGF0YSA9IG1lc2guX2dldEF0dHJNZXNoRGF0YShzdWJJbmRleCwgZ2Z4LkFUVFJfTk9STUFMKTtcbiAgICAgICAgICAgIGxldCBqb2ludERhdGEgPSBtZXNoLl9nZXRBdHRyTWVzaERhdGEoc3ViSW5kZXgsIGdmeC5BVFRSX0pPSU5UUyk7XG4gICAgICAgICAgICBsZXQgd2VpZ2h0RGF0YSA9IG1lc2guX2dldEF0dHJNZXNoRGF0YShzdWJJbmRleCwgZ2Z4LkFUVFJfV0VJR0hUUyk7XG5cbiAgICAgICAgICAgIGxldCB2ZXJ0ZXhDb3VudCA9IHBvc0RhdGEubGVuZ3RoIC8gcG9zRWxlLm51bTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vcm1hbEluZGV4ID0gaSAqIG5vcm1hbEVsZS5udW07XG4gICAgICAgICAgICAgICAgbGV0IHBvc0luZGV4ID0gaSAqIHBvc0VsZS5udW07XG5cbiAgICAgICAgICAgICAgICBWZWMzLnNldCh2M190bXBbMF0sIG5vcm1hbERhdGFbbm9ybWFsSW5kZXhdLCBub3JtYWxEYXRhW25vcm1hbEluZGV4KzFdLCBub3JtYWxEYXRhW25vcm1hbEluZGV4KzJdKTtcbiAgICAgICAgICAgICAgICBWZWMzLnNldCh2M190bXBbMV0sIHBvc0RhdGFbcG9zSW5kZXhdLCBwb3NEYXRhW3Bvc0luZGV4KzFdLCBwb3NEYXRhW3Bvc0luZGV4KzJdKTtcbiAgICAgICAgICAgICAgICBWZWMzLnNjYWxlQW5kQWRkKHYzX3RtcFswXSwgdjNfdG1wWzFdLCB2M190bXBbMF0sIGxpbmVMZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbGluZUluZGV4ID0gMDsgbGluZUluZGV4IDwgMjsgbGluZUluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmJEYXRhLnB1c2godjNfdG1wW2xpbmVJbmRleF0ueCwgdjNfdG1wW2xpbmVJbmRleF0ueSwgdjNfdG1wW2xpbmVJbmRleF0ueik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqb2ludEVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGpvaW50SW5kZXggPSBpICogam9pbnRFbGUubnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBqb2ludEVsZS5udW07IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZiRGF0YS5wdXNoKGpvaW50RGF0YVtqb2ludEluZGV4ICsgal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh3ZWlnaHRFbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3ZWlnaHRJbmRleCA9IGkgKiB3ZWlnaHRFbGUubnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3ZWlnaHRFbGUubnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YkRhdGEucHVzaCh3ZWlnaHREYXRhW3dlaWdodEluZGV4ICsgal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGkqMiwgaSoyKzEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZm9ybWF0T3B0cyA9IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6IGdmeC5BVFRSX1BPU0lUSU9OLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogMyB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmIChqb2ludEVsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdE9wdHMucHVzaCh7IG5hbWU6IGdmeC5BVFRSX0pPSU5UUywgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IGpvaW50RWxlLm51bSB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdlaWdodEVsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdE9wdHMucHVzaCh7IG5hbWU6IGdmeC5BVFRSX1dFSUdIVFMsIHR5cGU6IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiwgbnVtOiB3ZWlnaHRFbGUubnVtIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ2Z4VkZtdCA9IG5ldyBnZnguVmVydGV4Rm9ybWF0KGZvcm1hdE9wdHMpO1xuXG4gICAgICAgICAgICBsZXQgdmIgPSBuZXcgZ2Z4LlZlcnRleEJ1ZmZlcihcbiAgICAgICAgICAgICAgICBSZW5kZXJlci5kZXZpY2UsXG4gICAgICAgICAgICAgICAgZ2Z4VkZtdCxcbiAgICAgICAgICAgICAgICBnZnguVVNBR0VfU1RBVElDLFxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkodmJEYXRhKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbGV0IGliRGF0YSA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcbiAgICAgICAgICAgIGxldCBpYiA9IG5ldyBnZnguSW5kZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgUmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgIGdmeC5JTkRFWF9GTVRfVUlOVDE2LFxuICAgICAgICAgICAgICAgIGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICAgICAgaWJEYXRhLFxuICAgICAgICAgICAgICAgIGliRGF0YS5sZW5ndGhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGxldCBtID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZVdpdGhCdWlsdGluKCd1bmxpdCcpO1xuICAgICAgICAgICAgbS5zZXRQcm9wZXJ0eSgnZGlmZnVzZUNvbG9yJywgUkVEX0NPTE9SKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogbSxcbiAgICAgICAgICAgICAgICBpYTogbmV3IElucHV0QXNzZW1ibGVyKHZiLCBpYiwgZ2Z4LlBUX0xJTkVTKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aXJlRnJhbWUgKGNvbXAsIGlhLCBzdWJEYXRhKSB7XG4gICAgICAgICAgICBsZXQgb2xkSWJEYXRhID0gc3ViRGF0YS5nZXRJRGF0YShVaW50MTZBcnJheSk7XG4gICAgICAgICAgICBsZXQgbSA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGVXaXRoQnVpbHRpbigndW5saXQnKTtcbiAgICAgICAgICAgIG0uc2V0UHJvcGVydHkoJ2RpZmZ1c2VDb2xvcicsIEJMQUNLX0NPTE9SKTtcblxuICAgICAgICAgICAgbGV0IGluZGljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2xkSWJEYXRhLmxlbmd0aDsgaSs9Mykge1xuICAgICAgICAgICAgICAgIGxldCBhID0gb2xkSWJEYXRhWyBpICsgMCBdO1xuICAgICAgICAgICAgICAgIGxldCBiID0gb2xkSWJEYXRhWyBpICsgMSBdO1xuICAgICAgICAgICAgICAgIGxldCBjID0gb2xkSWJEYXRhWyBpICsgMiBdO1xuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChhLCBiLCBiLCBjLCBjLCBhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGliRGF0YSA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcbiAgICAgICAgICAgIGxldCBpYiA9IG5ldyBnZnguSW5kZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgUmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgIGdmeC5JTkRFWF9GTVRfVUlOVDE2LFxuICAgICAgICAgICAgICAgIGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICAgICAgaWJEYXRhLFxuICAgICAgICAgICAgICAgIGliRGF0YS5sZW5ndGhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG0sXG4gICAgICAgICAgICAgICAgaWE6IG5ldyBJbnB1dEFzc2VtYmxlcihpYS5fdmVydGV4QnVmZmVyLCBpYiwgZ2Z4LlBUX0xJTkVTKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgX3Byb3RvID0gTWVzaFJlbmRlcmVyLnByb3RvdHlwZTtcbiAgICBfcHJvdG8uX3VwZGF0ZURlYnVnRGF0YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBkZWJ1Z0RhdGFzID0gdGhpcy5fZGVidWdEYXRhcztcbiAgICAgICAgbGV0IHN1Yk1lc2hlcyA9IHRoaXMuX21lc2guc3ViTWVzaGVzO1xuICAgICAgICBsZXQgc3ViRGF0YXMgPSB0aGlzLl9tZXNoLl9zdWJEYXRhcztcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBkZWJ1Z0RhdGFzKSB7XG4gICAgICAgICAgICBsZXQgZGVidWdEYXRhID0gZGVidWdEYXRhc1tuYW1lXTtcbiAgICAgICAgICAgIGlmIChkZWJ1Z0RhdGEubGVuZ3RoID09PSBzdWJNZXNoZXMubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICghY2MubWFjcm9bJ1NIT1dfTUVTSF8nICsgbmFtZS50b1VwcGVyQ2FzZSgpXSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGRlYnVnRGF0YS5sZW5ndGggPSBzdWJNZXNoZXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNZXNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RhdGFbaV0gPSBjcmVhdGVEZWJ1Z0RhdGFGbnNbbmFtZV0odGhpcywgc3ViTWVzaGVzW2ldLCBzdWJEYXRhc1tpXSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5jYy5NZXNoUmVuZGVyZXIgPSBtb2R1bGUuZXhwb3J0cyA9IE1lc2hSZW5kZXJlcjtcbiJdfQ==