
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/renderer/particle-system-3d-renderer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../../../value-types");

var _gfx = _interopRequireDefault(require("../../../../renderer/gfx"));

var _particleBatchModel = _interopRequireDefault(require("./particle-batch-model"));

var _materialVariant = _interopRequireDefault(require("../../../assets/material/material-variant"));

var _recyclePool = _interopRequireDefault(require("../../../../renderer/memop/recycle-pool"));

var _enum = require("../enum");

var _particle = _interopRequireDefault(require("../particle"));

var _assembler = _interopRequireDefault(require("../../../renderer/assembler"));

var _particleSystem3d = _interopRequireDefault(require("../particle-system-3d"));

var _dec, _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('../../../platform/CCClassDecorator'),
    ccclass = _require.ccclass,
    property = _require.property; // tslint:disable: max-line-length


var _tempAttribUV = new _valueTypes.Vec3();

var _tempAttribUV0 = new _valueTypes.Vec2();

var _tempAttribColor = new _valueTypes.Vec4();

var _tempWorldTrans = new _valueTypes.Mat4();

var _uvs = [0, 0, // bottom-left
1, 0, // bottom-right
0, 1, // top-left
1, 1 // top-right
];
var CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
var CC_USE_BILLBOARD = 'CC_USE_BILLBOARD';
var CC_USE_STRETCHED_BILLBOARD = 'CC_USE_STRETCHED_BILLBOARD';
var CC_USE_HORIZONTAL_BILLBOARD = 'CC_USE_HORIZONTAL_BILLBOARD';
var CC_USE_VERTICAL_BILLBOARD = 'CC_USE_VERTICAL_BILLBOARD';
var CC_USE_MESH = 'CC_USE_MESH';
var vfmtNormal = new _gfx["default"].VertexFormat([{
  name: _gfx["default"].ATTR_POSITION,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD1,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD2,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_COLOR,
  type: _gfx["default"].ATTR_TYPE_UINT8,
  num: 4,
  normalize: true
}]);
vfmtNormal.name = 'vfmtNormal';
var vfmtStretch = new _gfx["default"].VertexFormat([{
  name: _gfx["default"].ATTR_POSITION,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD1,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD2,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_COLOR,
  type: _gfx["default"].ATTR_TYPE_UINT8,
  num: 4,
  normalize: true
}, {
  name: _gfx["default"].ATTR_COLOR1,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}]);
vfmtStretch.name = 'vfmtStretch';
var vfmtMesh = new _gfx["default"].VertexFormat([{
  name: _gfx["default"].ATTR_POSITION,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD1,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_TEX_COORD2,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_COLOR,
  type: _gfx["default"].ATTR_TYPE_UINT8,
  num: 4,
  normalize: true
}, {
  name: _gfx["default"].ATTR_TEX_COORD3,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_NORMAL,
  type: _gfx["default"].ATTR_TYPE_FLOAT32,
  num: 3
}, {
  name: _gfx["default"].ATTR_COLOR1,
  type: _gfx["default"].ATTR_TYPE_UINT8,
  num: 4,
  normalize: true
}]);
vfmtMesh.name = 'vfmtMesh';
var ParticleSystem3DAssembler = (_dec = ccclass('cc.ParticleSystem3DAssembler'), _dec(_class = (_temp =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(ParticleSystem3DAssembler, _Assembler);

  function ParticleSystem3DAssembler() {
    var _this;

    _this = _Assembler.call(this) || this;
    _this._defines = null;
    _this._trailDefines = null;
    _this._model = null;
    _this.frameTile_velLenScale = null;
    _this.attrs = [];
    _this._vertFormat = [];
    _this._particleSystem = null;
    _this._particles = null;
    _this._defaultMat = null;
    _this._isAssetReady = false;
    _this._defaultTrailMat = null;
    _this._customProperties = null;
    _this._node_scale = null;
    _this._model = null;
    _this.frameTile_velLenScale = cc.v4(1, 1, 0, 0);
    _this._node_scale = cc.v4();
    _this.attrs = new Array(5);
    _this._trailDefines = {
      CC_USE_WORLD_SPACE: true
    };
    return _this;
  }

  var _proto = ParticleSystem3DAssembler.prototype;

  _proto.onInit = function onInit(ps) {
    var _this2 = this;

    this._particleSystem = ps;
    this._particles = new _recyclePool["default"](function () {
      return new _particle["default"](_this2);
    }, 16);

    this._setVertexAttrib();

    this.onEnable();

    this._updateModel();

    this._updateMaterialParams();

    this._updateTrailMaterial();
  };

  _proto.onEnable = function onEnable() {
    if (!this._particleSystem) {
      return;
    }

    if (this._model == null) {
      this._model = new _particleBatchModel["default"]();
    }

    if (!this._model.inited) {
      this._model.setCapacity(this._particleSystem.capacity);
    }

    this._model.enabled = this._particleSystem.enabledInHierarchy;
  };

  _proto.onDisable = function onDisable() {
    if (this._model) {
      this._model.enabled = this._particleSystem.enabledInHierarchy;
    }
  };

  _proto.onDestroy = function onDestroy() {
    this._model = null;
  };

  _proto.clear = function clear() {
    this._particles.reset();

    this.updateParticleBuffer();
  };

  _proto._getFreeParticle = function _getFreeParticle() {
    if (this._particles.length >= this._particleSystem.capacity) {
      return null;
    }

    return this._particles.add();
  };

  _proto._setNewParticle = function _setNewParticle(p) {};

  _proto._updateParticles = function _updateParticles(dt) {
    this._particleSystem.node.getWorldMatrix(_tempWorldTrans);

    switch (this._particleSystem.scaleSpace) {
      case _enum.Space.Local:
        this._particleSystem.node.getScale(this._node_scale);

        break;

      case _enum.Space.World:
        this._particleSystem.node.getWorldScale(this._node_scale);

        break;
    }

    var material = this._particleSystem.materials[0];
    var mat = material ? this._particleSystem.particleMaterial : this._defaultMat;
    mat.setProperty('scale', this._node_scale);

    if (this._particleSystem.velocityOvertimeModule.enable) {
      this._particleSystem.velocityOvertimeModule.update(this._particleSystem._simulationSpace, _tempWorldTrans);
    }

    if (this._particleSystem.forceOvertimeModule.enable) {
      this._particleSystem.forceOvertimeModule.update(this._particleSystem._simulationSpace, _tempWorldTrans);
    }

    if (this._particleSystem.trailModule.enable) {
      this._particleSystem.trailModule.update();
    }

    for (var i = 0; i < this._particles.length; ++i) {
      var p = this._particles.data[i];
      p.remainingLifetime -= dt;

      _valueTypes.Vec3.set(p.animatedVelocity, 0, 0, 0);

      if (p.remainingLifetime < 0.0) {
        if (this._particleSystem.trailModule.enable) {
          this._particleSystem.trailModule.removeParticle(p);
        }

        this._particles.remove(i);

        --i;
        continue;
      }

      p.velocity.y -= this._particleSystem.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, p.randomSeed) * 9.8 * dt; // apply gravity.

      if (this._particleSystem.sizeOvertimeModule.enable) {
        this._particleSystem.sizeOvertimeModule.animate(p);
      }

      if (this._particleSystem.colorOverLifetimeModule.enable) {
        this._particleSystem.colorOverLifetimeModule.animate(p);
      }

      if (this._particleSystem.forceOvertimeModule.enable) {
        this._particleSystem.forceOvertimeModule.animate(p, dt);
      }

      if (this._particleSystem.velocityOvertimeModule.enable) {
        this._particleSystem.velocityOvertimeModule.animate(p);
      } else {
        _valueTypes.Vec3.copy(p.ultimateVelocity, p.velocity);
      }

      if (this._particleSystem.limitVelocityOvertimeModule.enable) {
        this._particleSystem.limitVelocityOvertimeModule.animate(p);
      }

      if (this._particleSystem.rotationOvertimeModule.enable) {
        this._particleSystem.rotationOvertimeModule.animate(p, dt);
      }

      if (this._particleSystem.textureAnimationModule.enable) {
        this._particleSystem.textureAnimationModule.animate(p);
      }

      _valueTypes.Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.


      if (this._particleSystem.trailModule.enable) {
        this._particleSystem.trailModule.animate(p, dt);
      }
    }

    return this._particles.length;
  } // internal function
  ;

  _proto.updateParticleBuffer = function updateParticleBuffer() {
    // update vertex buffer
    var idx = 0;
    var uploadVel = this._particleSystem.renderMode === _enum.RenderMode.StrecthedBillboard;

    for (var i = 0; i < this._particles.length; ++i) {
      var p = this._particles.data[i];
      var fi = 0;

      if (this._particleSystem.textureAnimationModule.enable) {
        fi = p.frameIndex;
      }

      idx = i * 4;
      var attrNum = 0;

      if (this._particleSystem.renderMode !== _enum.RenderMode.Mesh) {
        for (var j = 0; j < 4; ++j) {
          // four verts per particle.
          attrNum = 0;
          this.attrs[attrNum++] = p.position;
          _tempAttribUV.x = _uvs[2 * j];
          _tempAttribUV.y = _uvs[2 * j + 1];
          _tempAttribUV.z = fi;
          this.attrs[attrNum++] = _tempAttribUV;
          this.attrs[attrNum++] = p.size;
          this.attrs[attrNum++] = p.rotation;
          this.attrs[attrNum++] = p.color._val;

          if (uploadVel) {
            this.attrs[attrNum++] = p.ultimateVelocity;
          } else {
            this.attrs[attrNum++] = null;
          }

          this._model.addParticleVertexData(idx++, this.attrs);
        }
      } else {
        attrNum = 0;
        this.attrs[attrNum++] = p.position;
        _tempAttribUV.z = fi;
        this.attrs[attrNum++] = _tempAttribUV;
        this.attrs[attrNum++] = p.size;
        this.attrs[attrNum++] = p.rotation;
        this.attrs[attrNum++] = p.color._val;

        this._model.addParticleVertexData(i, this.attrs);
      }
    }

    this.updateIA(0, this._particles.length * this._model._indexCount, true);
  };

  _proto.updateShaderUniform = function updateShaderUniform() {};

  _proto.updateIA = function updateIA(index, count, vDirty, iDirty) {
    if (!this._model) return;

    this._model.updateIA(index, count, vDirty, iDirty);
  };

  _proto.getParticleCount = function getParticleCount() {
    return this._particles.data.length;
  };

  _proto._onMaterialModified = function _onMaterialModified(index, material) {
    if (index === 0) {
      this._updateModel();

      this._updateMaterialParams();
    } else {
      this._updateTrailMaterial();
    }
  };

  _proto._onRebuildPSO = function _onRebuildPSO(index, material) {
    if (this._model && index === 0) {
      this._model.setModelMaterial(material);
    }

    if (this._particleSystem.trailModule._trailModel && index === 1) {
      this._particleSystem.trailModule._trailModel.setModelMaterial(material);
    }
  };

  _proto._ensureLoadMesh = function _ensureLoadMesh() {
    if (this._particleSystem.mesh && !this._particleSystem.mesh.loaded) {
      postLoadMesh(this._particleSystem.mesh);
    }
  };

  _proto.setCapacity = function setCapacity(capacity) {
    if (!this._model) return;

    this._model.setCapacity(capacity);
  };

  _proto._setVertexAttrib = function _setVertexAttrib() {
    switch (this._particleSystem.renderMode) {
      case _enum.RenderMode.StrecthedBillboard:
        this._vertFormat = vfmtStretch;
        break;

      case _enum.RenderMode.Mesh:
        this._vertFormat = vfmtMesh;
        break;

      default:
        this._vertFormat = vfmtNormal;
    }
  };

  _proto._updateMaterialParams = function _updateMaterialParams() {
    if (!this._particleSystem) {
      return;
    }

    var mat = this._particleSystem.materials[0];

    if (mat == null && this._defaultMat == null) {
      mat = this._defaultMat = _materialVariant["default"].createWithBuiltin('3d-particle', this);
    } else {
      mat = _materialVariant["default"].create(mat, this._particleSystem);
    }

    mat = this._particleSystem.setMaterial(0, mat);

    if (this._particleSystem._simulationSpace === _enum.Space.World) {
      mat.define(CC_USE_WORLD_SPACE, true);
    } else {
      mat.define(CC_USE_WORLD_SPACE, false);
    }

    if (this._particleSystem.renderMode === _enum.RenderMode.Billboard) {
      mat.define(CC_USE_BILLBOARD, true);
      mat.define(CC_USE_STRETCHED_BILLBOARD, false);
      mat.define(CC_USE_HORIZONTAL_BILLBOARD, false);
      mat.define(CC_USE_VERTICAL_BILLBOARD, false);
      mat.define(CC_USE_MESH, false);
    } else if (this._particleSystem.renderMode === _enum.RenderMode.StrecthedBillboard) {
      mat.define(CC_USE_BILLBOARD, false);
      mat.define(CC_USE_STRETCHED_BILLBOARD, true);
      mat.define(CC_USE_HORIZONTAL_BILLBOARD, false);
      mat.define(CC_USE_VERTICAL_BILLBOARD, false);
      mat.define(CC_USE_MESH, false);
      this.frameTile_velLenScale.z = this._particleSystem.velocityScale;
      this.frameTile_velLenScale.w = this._particleSystem.lengthScale;
    } else if (this._particleSystem.renderMode === _enum.RenderMode.HorizontalBillboard) {
      mat.define(CC_USE_BILLBOARD, false);
      mat.define(CC_USE_STRETCHED_BILLBOARD, false);
      mat.define(CC_USE_HORIZONTAL_BILLBOARD, true);
      mat.define(CC_USE_VERTICAL_BILLBOARD, false);
      mat.define(CC_USE_MESH, false);
    } else if (this._particleSystem.renderMode === _enum.RenderMode.VerticalBillboard) {
      mat.define(CC_USE_BILLBOARD, false);
      mat.define(CC_USE_STRETCHED_BILLBOARD, false);
      mat.define(CC_USE_HORIZONTAL_BILLBOARD, false);
      mat.define(CC_USE_VERTICAL_BILLBOARD, true);
      mat.define(CC_USE_MESH, false);
    } else if (this._particleSystem.renderMode === _enum.RenderMode.Mesh) {
      mat.define(CC_USE_BILLBOARD, false);
      mat.define(CC_USE_STRETCHED_BILLBOARD, false);
      mat.define(CC_USE_HORIZONTAL_BILLBOARD, false);
      mat.define(CC_USE_VERTICAL_BILLBOARD, false);
      mat.define(CC_USE_MESH, true);
    } else {
      console.warn("particle system renderMode " + this._particleSystem.renderMode + " not support.");
    }

    if (this._particleSystem.textureAnimationModule.enable) {
      _valueTypes.Vec2.set(this.frameTile_velLenScale, this._particleSystem.textureAnimationModule.numTilesX, this._particleSystem.textureAnimationModule.numTilesY);
    }

    mat.setProperty('frameTile_velLenScale', this.frameTile_velLenScale);
  };

  _proto._updateTrailMaterial = function _updateTrailMaterial() {
    if (this._particleSystem.trailModule.enable) {
      var mat = this._particleSystem.trailMaterial;

      if (mat === null && this._defaultTrailMat === null) {
        this._defaultTrailMat = _materialVariant["default"].createWithBuiltin('3d-trail', this);
      }

      if (mat === null) {
        mat = this._defaultTrailMat;
        this._particleSystem.trailMaterial = mat;
      }

      if (this._particleSystem._simulationSpace === _enum.Space.World || this._particleSystem.trailModule.space === _enum.Space.World) {
        mat.define(CC_USE_WORLD_SPACE, true);
      } else {
        mat.define(CC_USE_WORLD_SPACE, false);
      }

      this._particleSystem.trailModule._updateMaterial();
    }
  };

  _proto._updateTrailEnable = function _updateTrailEnable(enable) {
    if (!this._model) {
      return;
    }

    var subData = this._model._subDatas[1];

    if (subData) {
      subData.enable = enable;
    }
  };

  _proto._updateModel = function _updateModel() {
    if (!this._model) {
      return;
    }

    this._model.setVertexAttributes(this._particleSystem.renderMode === _enum.RenderMode.Mesh ? this._particleSystem.mesh : null, this._vertFormat);
  };

  _proto.setVertexAttributes = function setVertexAttributes(mesh, vfmt) {
    if (!this._model) {
      return;
    }

    this._model.setVertexAttributes(mesh, vfmt);
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    if (!this._model) return;

    this._model._uploadData();

    var submeshes = this._model._subMeshes;
    var subDatas = this._model._subDatas;
    var materials = comp.materials;

    renderer._flush();

    for (var i = 0, len = submeshes.length; i < len; i++) {
      var ia = submeshes[i];
      var meshData = subDatas[i];
      var material = materials[i];

      if (meshData.enable) {
        renderer.material = material;
        renderer.cullingMask = comp.node._cullingMask;
        renderer.node = comp.node;

        renderer._flushIA(ia);
      }
    }
  };

  return ParticleSystem3DAssembler;
}(_assembler["default"]), _temp)) || _class);
exports["default"] = ParticleSystem3DAssembler;
Object.assign(ParticleSystem3DAssembler, {
  uv: _uvs
});

_assembler["default"].register(_particleSystem3d["default"], ParticleSystem3DAssembler);

module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnRpY2xlLXN5c3RlbS0zZC1yZW5kZXJlci50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2NjbGFzcyIsInByb3BlcnR5IiwiX3RlbXBBdHRyaWJVViIsIlZlYzMiLCJfdGVtcEF0dHJpYlVWMCIsIlZlYzIiLCJfdGVtcEF0dHJpYkNvbG9yIiwiVmVjNCIsIl90ZW1wV29ybGRUcmFucyIsIk1hdDQiLCJfdXZzIiwiQ0NfVVNFX1dPUkxEX1NQQUNFIiwiQ0NfVVNFX0JJTExCT0FSRCIsIkNDX1VTRV9TVFJFVENIRURfQklMTEJPQVJEIiwiQ0NfVVNFX0hPUklaT05UQUxfQklMTEJPQVJEIiwiQ0NfVVNFX1ZFUlRJQ0FMX0JJTExCT0FSRCIsIkNDX1VTRV9NRVNIIiwidmZtdE5vcm1hbCIsImdmeCIsIlZlcnRleEZvcm1hdCIsIm5hbWUiLCJBVFRSX1BPU0lUSU9OIiwidHlwZSIsIkFUVFJfVFlQRV9GTE9BVDMyIiwibnVtIiwiQVRUUl9URVhfQ09PUkQiLCJBVFRSX1RFWF9DT09SRDEiLCJBVFRSX1RFWF9DT09SRDIiLCJBVFRSX0NPTE9SIiwiQVRUUl9UWVBFX1VJTlQ4Iiwibm9ybWFsaXplIiwidmZtdFN0cmV0Y2giLCJBVFRSX0NPTE9SMSIsInZmbXRNZXNoIiwiQVRUUl9URVhfQ09PUkQzIiwiQVRUUl9OT1JNQUwiLCJQYXJ0aWNsZVN5c3RlbTNEQXNzZW1ibGVyIiwiX2RlZmluZXMiLCJfdHJhaWxEZWZpbmVzIiwiX21vZGVsIiwiZnJhbWVUaWxlX3ZlbExlblNjYWxlIiwiYXR0cnMiLCJfdmVydEZvcm1hdCIsIl9wYXJ0aWNsZVN5c3RlbSIsIl9wYXJ0aWNsZXMiLCJfZGVmYXVsdE1hdCIsIl9pc0Fzc2V0UmVhZHkiLCJfZGVmYXVsdFRyYWlsTWF0IiwiX2N1c3RvbVByb3BlcnRpZXMiLCJfbm9kZV9zY2FsZSIsImNjIiwidjQiLCJBcnJheSIsIm9uSW5pdCIsInBzIiwiUmVjeWNsZVBvb2wiLCJQYXJ0aWNsZSIsIl9zZXRWZXJ0ZXhBdHRyaWIiLCJvbkVuYWJsZSIsIl91cGRhdGVNb2RlbCIsIl91cGRhdGVNYXRlcmlhbFBhcmFtcyIsIl91cGRhdGVUcmFpbE1hdGVyaWFsIiwiUGFydGljbGVCYXRjaE1vZGVsIiwiaW5pdGVkIiwic2V0Q2FwYWNpdHkiLCJjYXBhY2l0eSIsImVuYWJsZWQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJvbkRpc2FibGUiLCJvbkRlc3Ryb3kiLCJjbGVhciIsInJlc2V0IiwidXBkYXRlUGFydGljbGVCdWZmZXIiLCJfZ2V0RnJlZVBhcnRpY2xlIiwibGVuZ3RoIiwiYWRkIiwiX3NldE5ld1BhcnRpY2xlIiwicCIsIl91cGRhdGVQYXJ0aWNsZXMiLCJkdCIsIm5vZGUiLCJnZXRXb3JsZE1hdHJpeCIsInNjYWxlU3BhY2UiLCJTcGFjZSIsIkxvY2FsIiwiZ2V0U2NhbGUiLCJXb3JsZCIsImdldFdvcmxkU2NhbGUiLCJtYXRlcmlhbCIsIm1hdGVyaWFscyIsIm1hdCIsInBhcnRpY2xlTWF0ZXJpYWwiLCJzZXRQcm9wZXJ0eSIsInZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJlbmFibGUiLCJ1cGRhdGUiLCJfc2ltdWxhdGlvblNwYWNlIiwiZm9yY2VPdmVydGltZU1vZHVsZSIsInRyYWlsTW9kdWxlIiwiaSIsImRhdGEiLCJyZW1haW5pbmdMaWZldGltZSIsInNldCIsImFuaW1hdGVkVmVsb2NpdHkiLCJyZW1vdmVQYXJ0aWNsZSIsInJlbW92ZSIsInZlbG9jaXR5IiwieSIsImdyYXZpdHlNb2RpZmllciIsImV2YWx1YXRlIiwic3RhcnRMaWZldGltZSIsInJhbmRvbVNlZWQiLCJzaXplT3ZlcnRpbWVNb2R1bGUiLCJhbmltYXRlIiwiY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUiLCJjb3B5IiwidWx0aW1hdGVWZWxvY2l0eSIsImxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSIsInJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUiLCJ0ZXh0dXJlQW5pbWF0aW9uTW9kdWxlIiwic2NhbGVBbmRBZGQiLCJwb3NpdGlvbiIsImlkeCIsInVwbG9hZFZlbCIsInJlbmRlck1vZGUiLCJSZW5kZXJNb2RlIiwiU3RyZWN0aGVkQmlsbGJvYXJkIiwiZmkiLCJmcmFtZUluZGV4IiwiYXR0ck51bSIsIk1lc2giLCJqIiwieCIsInoiLCJzaXplIiwicm90YXRpb24iLCJjb2xvciIsIl92YWwiLCJhZGRQYXJ0aWNsZVZlcnRleERhdGEiLCJ1cGRhdGVJQSIsIl9pbmRleENvdW50IiwidXBkYXRlU2hhZGVyVW5pZm9ybSIsImluZGV4IiwiY291bnQiLCJ2RGlydHkiLCJpRGlydHkiLCJnZXRQYXJ0aWNsZUNvdW50IiwiX29uTWF0ZXJpYWxNb2RpZmllZCIsIl9vblJlYnVpbGRQU08iLCJzZXRNb2RlbE1hdGVyaWFsIiwiX3RyYWlsTW9kZWwiLCJfZW5zdXJlTG9hZE1lc2giLCJtZXNoIiwibG9hZGVkIiwicG9zdExvYWRNZXNoIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlV2l0aEJ1aWx0aW4iLCJjcmVhdGUiLCJzZXRNYXRlcmlhbCIsImRlZmluZSIsIkJpbGxib2FyZCIsInZlbG9jaXR5U2NhbGUiLCJ3IiwibGVuZ3RoU2NhbGUiLCJIb3Jpem9udGFsQmlsbGJvYXJkIiwiVmVydGljYWxCaWxsYm9hcmQiLCJjb25zb2xlIiwid2FybiIsIm51bVRpbGVzWCIsIm51bVRpbGVzWSIsInRyYWlsTWF0ZXJpYWwiLCJzcGFjZSIsIl91cGRhdGVNYXRlcmlhbCIsIl91cGRhdGVUcmFpbEVuYWJsZSIsInN1YkRhdGEiLCJfc3ViRGF0YXMiLCJzZXRWZXJ0ZXhBdHRyaWJ1dGVzIiwidmZtdCIsImZpbGxCdWZmZXJzIiwiY29tcCIsInJlbmRlcmVyIiwiX3VwbG9hZERhdGEiLCJzdWJtZXNoZXMiLCJfc3ViTWVzaGVzIiwic3ViRGF0YXMiLCJfZmx1c2giLCJsZW4iLCJpYSIsIm1lc2hEYXRhIiwiY3VsbGluZ01hc2siLCJfY3VsbGluZ01hc2siLCJfZmx1c2hJQSIsIkFzc2VtYmxlciIsIk9iamVjdCIsImFzc2lnbiIsInV2IiwicmVnaXN0ZXIiLCJQYXJ0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LCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGdmeCBmcm9tICcuLi8uLi8uLi8uLi9yZW5kZXJlci9nZngnO1xuaW1wb3J0IFBhcnRpY2xlQmF0Y2hNb2RlbCBmcm9tICcuL3BhcnRpY2xlLWJhdGNoLW1vZGVsJztcbmltcG9ydCBNYXRlcmlhbFZhcmlhbnQgZnJvbSAnLi4vLi4vLi4vYXNzZXRzL21hdGVyaWFsL21hdGVyaWFsLXZhcmlhbnQnO1xuaW1wb3J0IFJlY3ljbGVQb29sIGZyb20gJy4uLy4uLy4uLy4uL3JlbmRlcmVyL21lbW9wL3JlY3ljbGUtcG9vbCc7XG5pbXBvcnQgeyBSZW5kZXJNb2RlLCBTcGFjZSB9IGZyb20gJy4uL2VudW0nO1xuaW1wb3J0IFBhcnRpY2xlIGZyb20gJy4uL3BhcnRpY2xlJztcbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vLi4vLi4vcmVuZGVyZXIvYXNzZW1ibGVyJztcbmltcG9ydCBQYXJ0aWNsZVN5c3RlbTNEIGZyb20gJy4uL3BhcnRpY2xlLXN5c3RlbS0zZCc7XG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IHJlcXVpcmUoJy4uLy4uLy4uL3BsYXRmb3JtL0NDQ2xhc3NEZWNvcmF0b3InKTtcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgX3RlbXBBdHRyaWJVViA9IG5ldyBWZWMzKCk7XG5jb25zdCBfdGVtcEF0dHJpYlVWMCA9IG5ldyBWZWMyKCk7XG5jb25zdCBfdGVtcEF0dHJpYkNvbG9yID0gbmV3IFZlYzQoKTtcbmNvbnN0IF90ZW1wV29ybGRUcmFucyA9IG5ldyBNYXQ0KCk7XG5cbmNvbnN0IF91dnMgPSBbXG4gICAgMCwgMCwgLy8gYm90dG9tLWxlZnRcbiAgICAxLCAwLCAvLyBib3R0b20tcmlnaHRcbiAgICAwLCAxLCAvLyB0b3AtbGVmdFxuICAgIDEsIDEsIC8vIHRvcC1yaWdodFxuXTtcblxuY29uc3QgQ0NfVVNFX1dPUkxEX1NQQUNFID0gJ0NDX1VTRV9XT1JMRF9TUEFDRSc7XG5jb25zdCBDQ19VU0VfQklMTEJPQVJEID0gJ0NDX1VTRV9CSUxMQk9BUkQnO1xuY29uc3QgQ0NfVVNFX1NUUkVUQ0hFRF9CSUxMQk9BUkQgPSAnQ0NfVVNFX1NUUkVUQ0hFRF9CSUxMQk9BUkQnO1xuY29uc3QgQ0NfVVNFX0hPUklaT05UQUxfQklMTEJPQVJEID0gJ0NDX1VTRV9IT1JJWk9OVEFMX0JJTExCT0FSRCc7XG5jb25zdCBDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJEID0gJ0NDX1VTRV9WRVJUSUNBTF9CSUxMQk9BUkQnO1xuY29uc3QgQ0NfVVNFX01FU0ggPSAnQ0NfVVNFX01FU0gnO1xuXG5cbnZhciB2Zm10Tm9ybWFsID0gbmV3IGdmeC5WZXJ0ZXhGb3JtYXQoW1xuICAgIHsgbmFtZTogZ2Z4LkFUVFJfUE9TSVRJT04sIHR5cGU6IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiwgbnVtOiAzfSxcbiAgICB7IG5hbWU6IGdmeC5BVFRSX1RFWF9DT09SRCwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfVEVYX0NPT1JEMSwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfVEVYX0NPT1JEMiwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfQ09MT1IsIHR5cGU6IGdmeC5BVFRSX1RZUEVfVUlOVDgsIG51bTogNCwgbm9ybWFsaXplOiB0cnVlIH0sXG5dKTtcbnZmbXROb3JtYWwubmFtZSA9ICd2Zm10Tm9ybWFsJztcblxudmFyIHZmbXRTdHJldGNoID0gbmV3IGdmeC5WZXJ0ZXhGb3JtYXQoW1xuICAgIHsgbmFtZTogZ2Z4LkFUVFJfUE9TSVRJT04sIHR5cGU6IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiwgbnVtOiAzfSxcbiAgICB7IG5hbWU6IGdmeC5BVFRSX1RFWF9DT09SRCwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfVEVYX0NPT1JEMSwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfVEVYX0NPT1JEMiwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfQ09MT1IsIHR5cGU6IGdmeC5BVFRSX1RZUEVfVUlOVDgsIG51bTogNCwgbm9ybWFsaXplOiB0cnVlIH0sXG4gICAgeyBuYW1lOiBnZnguQVRUUl9DT0xPUjEsIHR5cGU6IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiwgbnVtOiAzfVxuXSk7XG52Zm10U3RyZXRjaC5uYW1lID0gJ3ZmbXRTdHJldGNoJztcblxudmFyIHZmbXRNZXNoID0gbmV3IGdmeC5WZXJ0ZXhGb3JtYXQoW1xuICAgIHsgbmFtZTogZ2Z4LkFUVFJfUE9TSVRJT04sIHR5cGU6IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiwgbnVtOiAzfSxcbiAgICB7IG5hbWU6IGdmeC5BVFRSX1RFWF9DT09SRCwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfVEVYX0NPT1JEMSwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfVEVYX0NPT1JEMiwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDN9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfQ09MT1IsIHR5cGU6IGdmeC5BVFRSX1RZUEVfVUlOVDgsIG51bTogNCwgbm9ybWFsaXplOiB0cnVlIH0sXG4gICAgeyBuYW1lOiBnZnguQVRUUl9URVhfQ09PUkQzLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogMyB9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfTk9STUFMLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogMyB9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfQ09MT1IxLCB0eXBlOiBnZnguQVRUUl9UWVBFX1VJTlQ4LCBudW06IDQsIG5vcm1hbGl6ZTogdHJ1ZSB9XG5dKTtcbnZmbXRNZXNoLm5hbWUgPSAndmZtdE1lc2gnO1xuXG5AY2NjbGFzcygnY2MuUGFydGljbGVTeXN0ZW0zREFzc2VtYmxlcicpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVN5c3RlbTNEQXNzZW1ibGVyIGV4dGVuZHMgQXNzZW1ibGVyIHtcbiAgICBfZGVmaW5lcyA9IG51bGw7XG4gICAgX3RyYWlsRGVmaW5lcyA9IG51bGw7XG4gICAgX21vZGVsID0gbnVsbDtcbiAgICBmcmFtZVRpbGVfdmVsTGVuU2NhbGUgPSBudWxsO1xuICAgIGF0dHJzID0gW107XG4gICAgX3ZlcnRGb3JtYXQgPSBbXTtcbiAgICBfcGFydGljbGVTeXN0ZW0gPSBudWxsO1xuICAgIF9wYXJ0aWNsZXMgPSBudWxsO1xuICAgIF9kZWZhdWx0TWF0ID0gbnVsbDtcbiAgICBfaXNBc3NldFJlYWR5ID0gZmFsc2U7XG4gICAgX2RlZmF1bHRUcmFpbE1hdCA9IG51bGw7XG4gICAgX2N1c3RvbVByb3BlcnRpZXMgPSBudWxsO1xuICAgIF9ub2RlX3NjYWxlID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbW9kZWwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZnJhbWVUaWxlX3ZlbExlblNjYWxlID0gY2MudjQoMSwgMSwgMCwgMCk7XG4gICAgICAgIHRoaXMuX25vZGVfc2NhbGUgPSBjYy52NCgpO1xuICAgICAgICB0aGlzLmF0dHJzID0gbmV3IEFycmF5KDUpO1xuXG4gICAgICAgIHRoaXMuX3RyYWlsRGVmaW5lcyA9IHtcbiAgICAgICAgICAgIENDX1VTRV9XT1JMRF9TUEFDRTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvbkluaXQgKHBzKSB7XG4gICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtID0gcHM7XG4gICAgICAgIHRoaXMuX3BhcnRpY2xlcyA9IG5ldyBSZWN5Y2xlUG9vbCgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhcnRpY2xlKHRoaXMpO1xuICAgICAgICB9LCAxNik7XG4gICAgICAgIHRoaXMuX3NldFZlcnRleEF0dHJpYigpO1xuICAgICAgICB0aGlzLm9uRW5hYmxlKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vZGVsKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRyYWlsTWF0ZXJpYWwoKTtcbiAgICB9XG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGFydGljbGVTeXN0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbCA9IG5ldyBQYXJ0aWNsZUJhdGNoTW9kZWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwuaW5pdGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zZXRDYXBhY2l0eSh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5jYXBhY2l0eSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb2RlbC5lbmFibGVkID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uZW5hYmxlZEluSGllcmFyY2h5O1xuICAgIH1cblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuZW5hYmxlZCA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLmVuYWJsZWRJbkhpZXJhcmNoeTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX21vZGVsID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX3BhcnRpY2xlcy5yZXNldCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlQnVmZmVyKCk7XG4gICAgfVxuXG4gICAgX2dldEZyZWVQYXJ0aWNsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZXMubGVuZ3RoID49IHRoaXMuX3BhcnRpY2xlU3lzdGVtLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcGFydGljbGVzLmFkZCgpO1xuICAgIH1cblxuICAgIF9zZXROZXdQYXJ0aWNsZSAocCkge1xuXG4gICAgfVxuXG4gICAgX3VwZGF0ZVBhcnRpY2xlcyAoZHQpIHtcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ubm9kZS5nZXRXb3JsZE1hdHJpeChfdGVtcFdvcmxkVHJhbnMpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5fcGFydGljbGVTeXN0ZW0uc2NhbGVTcGFjZSkge1xuICAgICAgICAgICAgY2FzZSBTcGFjZS5Mb2NhbDpcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5ub2RlLmdldFNjYWxlKHRoaXMuX25vZGVfc2NhbGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTcGFjZS5Xb3JsZDpcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5ub2RlLmdldFdvcmxkU2NhbGUodGhpcy5fbm9kZV9zY2FsZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5tYXRlcmlhbHNbMF07XG4gICAgICAgIGxldCBtYXQgPSBtYXRlcmlhbCA/IHRoaXMuX3BhcnRpY2xlU3lzdGVtLnBhcnRpY2xlTWF0ZXJpYWwgOiB0aGlzLl9kZWZhdWx0TWF0O1xuICAgICAgICBtYXQuc2V0UHJvcGVydHkoJ3NjYWxlJywgdGhpcy5fbm9kZV9zY2FsZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS52ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLnVwZGF0ZSh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fc2ltdWxhdGlvblNwYWNlLCBfdGVtcFdvcmxkVHJhbnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5mb3JjZU92ZXJ0aW1lTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0uZm9yY2VPdmVydGltZU1vZHVsZS51cGRhdGUodGhpcy5fcGFydGljbGVTeXN0ZW0uX3NpbXVsYXRpb25TcGFjZSwgX3RlbXBXb3JsZFRyYW5zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0udHJhaWxNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS50cmFpbE1vZHVsZS51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgcCA9IHRoaXMuX3BhcnRpY2xlcy5kYXRhW2ldO1xuICAgICAgICAgICAgcC5yZW1haW5pbmdMaWZldGltZSAtPSBkdDtcbiAgICAgICAgICAgIFZlYzMuc2V0KHAuYW5pbWF0ZWRWZWxvY2l0eSwgMCwgMCwgMCk7XG5cbiAgICAgICAgICAgIGlmIChwLnJlbWFpbmluZ0xpZmV0aW1lIDwgMC4wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRyYWlsTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS50cmFpbE1vZHVsZS5yZW1vdmVQYXJ0aWNsZShwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydGljbGVzLnJlbW92ZShpKTtcbiAgICAgICAgICAgICAgICAtLWk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHAudmVsb2NpdHkueSAtPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5ncmF2aXR5TW9kaWZpZXIuZXZhbHVhdGUoMSAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWUsIHAucmFuZG9tU2VlZCkgKiA5LjggKiBkdDsgLy8gYXBwbHkgZ3Jhdml0eS5cbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5zaXplT3ZlcnRpbWVNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0uc2l6ZU92ZXJ0aW1lTW9kdWxlLmFuaW1hdGUocCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0uY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0uY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUuYW5pbWF0ZShwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5mb3JjZU92ZXJ0aW1lTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLmZvcmNlT3ZlcnRpbWVNb2R1bGUuYW5pbWF0ZShwLCBkdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0udmVsb2NpdHlPdmVydGltZU1vZHVsZS5lbmFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS52ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLmFuaW1hdGUocCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFZlYzMuY29weShwLnVsdGltYXRlVmVsb2NpdHksIHAudmVsb2NpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0ubGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLmxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZS5hbmltYXRlKHApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ucm90YXRpb25PdmVydGltZU1vZHVsZS5hbmltYXRlKHAsIGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS50ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRleHR1cmVBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFZlYzMuc2NhbGVBbmRBZGQocC5wb3NpdGlvbiwgcC5wb3NpdGlvbiwgcC51bHRpbWF0ZVZlbG9jaXR5LCBkdCk7IC8vIGFwcGx5IHZlbG9jaXR5LlxuICAgICAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRyYWlsTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRyYWlsTW9kdWxlLmFuaW1hdGUocCwgZHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0aWNsZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIGludGVybmFsIGZ1bmN0aW9uXG4gICAgdXBkYXRlUGFydGljbGVCdWZmZXIgKCkge1xuICAgICAgICAvLyB1cGRhdGUgdmVydGV4IGJ1ZmZlclxuICAgICAgICBsZXQgaWR4ID0gMDtcbiAgICAgICAgY29uc3QgdXBsb2FkVmVsID0gdGhpcy5fcGFydGljbGVTeXN0ZW0ucmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5TdHJlY3RoZWRCaWxsYm9hcmQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gdGhpcy5fcGFydGljbGVzLmRhdGFbaV07XG4gICAgICAgICAgICBsZXQgZmkgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRleHR1cmVBbmltYXRpb25Nb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgZmkgPSBwLmZyYW1lSW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggPSBpICogNDtcbiAgICAgICAgICAgIGxldCBhdHRyTnVtID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5yZW5kZXJNb2RlICE9PSBSZW5kZXJNb2RlLk1lc2gpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDQ7ICsraikgeyAvLyBmb3VyIHZlcnRzIHBlciBwYXJ0aWNsZS5cbiAgICAgICAgICAgICAgICAgICAgYXR0ck51bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0cnNbYXR0ck51bSsrXSA9IHAucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wQXR0cmliVVYueCA9IF91dnNbMiAqIGpdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcEF0dHJpYlVWLnkgPSBfdXZzWzIgKiBqICsgMV07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wQXR0cmliVVYueiA9IGZpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJzW2F0dHJOdW0rK10gPSBfdGVtcEF0dHJpYlVWO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJzW2F0dHJOdW0rK10gPSBwLnNpemU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0cnNbYXR0ck51bSsrXSA9IHAucm90YXRpb247XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0cnNbYXR0ck51bSsrXSA9IHAuY29sb3IuX3ZhbDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodXBsb2FkVmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJzW2F0dHJOdW0rK10gPSBwLnVsdGltYXRlVmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJzW2F0dHJOdW0rK10gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuYWRkUGFydGljbGVWZXJ0ZXhEYXRhKGlkeCsrLCB0aGlzLmF0dHJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJOdW0gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cnNbYXR0ck51bSsrXSA9IHAucG9zaXRpb247XG4gICAgICAgICAgICAgICAgX3RlbXBBdHRyaWJVVi56ID0gZmk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyc1thdHRyTnVtKytdID0gX3RlbXBBdHRyaWJVVjtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJzW2F0dHJOdW0rK10gPSBwLnNpemU7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyc1thdHRyTnVtKytdID0gcC5yb3RhdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJzW2F0dHJOdW0rK10gPSBwLmNvbG9yLl92YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuYWRkUGFydGljbGVWZXJ0ZXhEYXRhKGksIHRoaXMuYXR0cnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVJQSgwLCB0aGlzLl9wYXJ0aWNsZXMubGVuZ3RoICogdGhpcy5fbW9kZWwuX2luZGV4Q291bnQsIHRydWUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVNoYWRlclVuaWZvcm0gKCkge1xuXG4gICAgfVxuXG4gICAgdXBkYXRlSUEgKGluZGV4LCBjb3VudCwgdkRpcnR5LCBpRGlydHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZUlBKGluZGV4LCBjb3VudCwgdkRpcnR5LCBpRGlydHkpO1xuICAgIH1cblxuICAgIGdldFBhcnRpY2xlQ291bnQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFydGljbGVzLmRhdGEubGVuZ3RoO1xuICAgIH1cblxuICAgIF9vbk1hdGVyaWFsTW9kaWZpZWQgKGluZGV4LCBtYXRlcmlhbCkge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1vZGVsKCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVHJhaWxNYXRlcmlhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX29uUmVidWlsZFBTTyAoaW5kZXgsIG1hdGVyaWFsKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAmJiBpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0TW9kZWxNYXRlcmlhbChtYXRlcmlhbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRyYWlsTW9kdWxlLl90cmFpbE1vZGVsICYmIGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS50cmFpbE1vZHVsZS5fdHJhaWxNb2RlbC5zZXRNb2RlbE1hdGVyaWFsKG1hdGVyaWFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9lbnN1cmVMb2FkTWVzaCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5tZXNoICYmICF0aGlzLl9wYXJ0aWNsZVN5c3RlbS5tZXNoLmxvYWRlZCkge1xuICAgICAgICAgICAgcG9zdExvYWRNZXNoKHRoaXMuX3BhcnRpY2xlU3lzdGVtLm1lc2gpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q2FwYWNpdHkgKGNhcGFjaXR5KSB7XG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9tb2RlbC5zZXRDYXBhY2l0eShjYXBhY2l0eSk7XG4gICAgfVxuXG4gICAgX3NldFZlcnRleEF0dHJpYiAoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fcGFydGljbGVTeXN0ZW0ucmVuZGVyTW9kZSkge1xuICAgICAgICAgICAgY2FzZSBSZW5kZXJNb2RlLlN0cmVjdGhlZEJpbGxib2FyZDpcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJ0Rm9ybWF0ID0gdmZtdFN0cmV0Y2g7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFJlbmRlck1vZGUuTWVzaDpcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJ0Rm9ybWF0ID0gdmZtdE1lc2g7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRGb3JtYXQgPSB2Zm10Tm9ybWFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3VwZGF0ZU1hdGVyaWFsUGFyYW1zICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtYXQgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5tYXRlcmlhbHNbMF07XG4gICAgICAgIGlmIChtYXQgPT0gbnVsbCAmJiB0aGlzLl9kZWZhdWx0TWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgIG1hdCA9IHRoaXMuX2RlZmF1bHRNYXQgPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlV2l0aEJ1aWx0aW4oJzNkLXBhcnRpY2xlJywgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXQgPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlKG1hdCwgdGhpcy5fcGFydGljbGVTeXN0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0ID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uc2V0TWF0ZXJpYWwoMCwgbWF0KTtcblxuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0uX3NpbXVsYXRpb25TcGFjZSA9PT0gU3BhY2UuV29ybGQpIHtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX1dPUkxEX1NQQUNFLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX1dPUkxEX1NQQUNFLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0ucmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5CaWxsYm9hcmQpIHtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX0JJTExCT0FSRCwgdHJ1ZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9TVFJFVENIRURfQklMTEJPQVJELCBmYWxzZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9IT1JJWk9OVEFMX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJELCBmYWxzZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9NRVNILCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0ucmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5TdHJlY3RoZWRCaWxsYm9hcmQpIHtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfU1RSRVRDSEVEX0JJTExCT0FSRCwgdHJ1ZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9IT1JJWk9OVEFMX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJELCBmYWxzZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9NRVNILCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lVGlsZV92ZWxMZW5TY2FsZS56ID0gdGhpcy5fcGFydGljbGVTeXN0ZW0udmVsb2NpdHlTY2FsZTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVUaWxlX3ZlbExlblNjYWxlLncgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5sZW5ndGhTY2FsZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5yZW5kZXJNb2RlID09PSBSZW5kZXJNb2RlLkhvcml6b250YWxCaWxsYm9hcmQpIHtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfU1RSRVRDSEVEX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfSE9SSVpPTlRBTF9CSUxMQk9BUkQsIHRydWUpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJELCBmYWxzZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9NRVNILCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0ucmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5WZXJ0aWNhbEJpbGxib2FyZCkge1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfQklMTEJPQVJELCBmYWxzZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9TVFJFVENIRURfQklMTEJPQVJELCBmYWxzZSk7XG4gICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9IT1JJWk9OVEFMX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJELCB0cnVlKTtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX01FU0gsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5yZW5kZXJNb2RlID09PSBSZW5kZXJNb2RlLk1lc2gpIHtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfU1RSRVRDSEVEX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfSE9SSVpPTlRBTF9CSUxMQk9BUkQsIGZhbHNlKTtcbiAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX1ZFUlRJQ0FMX0JJTExCT0FSRCwgZmFsc2UpO1xuICAgICAgICAgICAgbWF0LmRlZmluZShDQ19VU0VfTUVTSCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYHBhcnRpY2xlIHN5c3RlbSByZW5kZXJNb2RlICR7dGhpcy5fcGFydGljbGVTeXN0ZW0ucmVuZGVyTW9kZX0gbm90IHN1cHBvcnQuYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0udGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5lbmFibGUpIHtcbiAgICAgICAgICAgIFZlYzIuc2V0KHRoaXMuZnJhbWVUaWxlX3ZlbExlblNjYWxlLCB0aGlzLl9wYXJ0aWNsZVN5c3RlbS50ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLm51bVRpbGVzWCwgdGhpcy5fcGFydGljbGVTeXN0ZW0udGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5udW1UaWxlc1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LnNldFByb3BlcnR5KCdmcmFtZVRpbGVfdmVsTGVuU2NhbGUnLCB0aGlzLmZyYW1lVGlsZV92ZWxMZW5TY2FsZSk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZVRyYWlsTWF0ZXJpYWwgKCkge1xuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0udHJhaWxNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICBsZXQgbWF0ID0gdGhpcy5fcGFydGljbGVTeXN0ZW0udHJhaWxNYXRlcmlhbDtcbiAgICAgICAgICAgIGlmIChtYXQgPT09IG51bGwgJiYgdGhpcy5fZGVmYXVsdFRyYWlsTWF0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmYXVsdFRyYWlsTWF0ID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZVdpdGhCdWlsdGluKCczZC10cmFpbCcsIHRoaXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWF0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbWF0ID0gdGhpcy5fZGVmYXVsdFRyYWlsTWF0O1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRyYWlsTWF0ZXJpYWwgPSBtYXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fc2ltdWxhdGlvblNwYWNlID09PSBTcGFjZS5Xb3JsZCB8fCB0aGlzLl9wYXJ0aWNsZVN5c3RlbS50cmFpbE1vZHVsZS5zcGFjZSA9PT0gU3BhY2UuV29ybGQpIHtcbiAgICAgICAgICAgICAgICBtYXQuZGVmaW5lKENDX1VTRV9XT1JMRF9TUEFDRSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hdC5kZWZpbmUoQ0NfVVNFX1dPUkxEX1NQQUNFLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnRyYWlsTW9kdWxlLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3VwZGF0ZVRyYWlsRW5hYmxlIChlbmFibGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN1YkRhdGEgPSB0aGlzLl9tb2RlbC5fc3ViRGF0YXNbMV07XG4gICAgICAgIGlmIChzdWJEYXRhKSB7XG4gICAgICAgICAgICBzdWJEYXRhLmVuYWJsZSA9IGVuYWJsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVNb2RlbCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlbC5zZXRWZXJ0ZXhBdHRyaWJ1dGVzKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuTWVzaCA/IHRoaXMuX3BhcnRpY2xlU3lzdGVtLm1lc2ggOiBudWxsLCB0aGlzLl92ZXJ0Rm9ybWF0KTtcbiAgICB9XG5cbiAgICBzZXRWZXJ0ZXhBdHRyaWJ1dGVzIChtZXNoLCB2Zm10KSB7XG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlbC5zZXRWZXJ0ZXhBdHRyaWJ1dGVzKG1lc2gsIHZmbXQpO1xuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fbW9kZWwuX3VwbG9hZERhdGEoKTtcblxuICAgICAgICBsZXQgc3VibWVzaGVzID0gdGhpcy5fbW9kZWwuX3N1Yk1lc2hlcztcbiAgICAgICAgbGV0IHN1YkRhdGFzID0gdGhpcy5fbW9kZWwuX3N1YkRhdGFzO1xuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gY29tcC5tYXRlcmlhbHM7XG4gICAgICAgIHJlbmRlcmVyLl9mbHVzaCgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdWJtZXNoZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpYSA9IHN1Ym1lc2hlc1tpXTtcbiAgICAgICAgICAgIGxldCBtZXNoRGF0YSA9IHN1YkRhdGFzW2ldO1xuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbWF0ZXJpYWxzW2ldO1xuXG4gICAgICAgICAgICBpZiAobWVzaERhdGEuZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5jdWxsaW5nTWFzayA9IGNvbXAubm9kZS5fY3VsbGluZ01hc2s7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIubm9kZSA9IGNvbXAubm9kZTtcblxuICAgICAgICAgICAgICAgIHJlbmRlcmVyLl9mbHVzaElBKGlhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuT2JqZWN0LmFzc2lnbihQYXJ0aWNsZVN5c3RlbTNEQXNzZW1ibGVyLCB7IHV2OiBfdXZzIH0pO1xuXG5Bc3NlbWJsZXIucmVnaXN0ZXIoUGFydGljbGVTeXN0ZW0zRCwgUGFydGljbGVTeXN0ZW0zREFzc2VtYmxlcik7XG4iXX0=