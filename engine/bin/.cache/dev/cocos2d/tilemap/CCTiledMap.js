
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledMap.js';
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
require('./CCTMXXMLParser');

require('./CCTiledMapAsset');

require('./CCTiledLayer');

require('./CCTiledTile');

require('./CCTiledObjectGroup');
/**
 * !#en The orientation of tiled map.
 * !#zh Tiled Map 地图方向。
 * @enum TiledMap.Orientation
 * @static
 */


var Orientation = cc.Enum({
  /**
   * !#en Orthogonal orientation.
   * !#zh 直角鸟瞰地图（90°地图）。
   * @property ORTHO
   * @type {Number}
   * @static
   */
  ORTHO: 0,

  /**
   * !#en Hexagonal orientation.
   * !#zh 六边形地图
   * @property HEX
   * @type {Number}
   * @static
   */
  HEX: 1,

  /**
   * Isometric orientation.
   * 等距斜视地图（斜45°地图）。
   * @property ISO
   * @type {Number}
   * @static
   */
  ISO: 2
});
/*
 * The property type of tiled map.
 * @enum TiledMap.Property
 * @static
 */

var Property = cc.Enum({
  /**
   * @property NONE
   * @type {Number}
   * @static
   */
  NONE: 0,

  /**
   * @property MAP
   * @type {Number}
   * @static
   */
  MAP: 1,

  /**
   * @property LAYER
   * @type {Number}
   * @static
   */
  LAYER: 2,

  /**
   * @property OBJECTGROUP
   * @type {Number}
   * @static
   */
  OBJECTGROUP: 3,

  /**
   * @property OBJECT
   * @type {Number}
   * @static
   */
  OBJECT: 4,

  /**
   * @property TILE
   * @type {Number}
   * @static
   */
  TILE: 5
});
/*
 * The tile flags of tiled map.
 * @enum TiledMap.TileFlag
 * @static
 */

var TileFlag = cc.Enum({
  /**
   * @property HORIZONTAL
   * @type {Number}
   * @static
   */
  HORIZONTAL: 0x80000000,

  /**
   * @property VERTICAL
   * @type {Number}
   * @static
   */
  VERTICAL: 0x40000000,

  /**
   * @property DIAGONAL
   * @type {Number}
   * @static
   */
  DIAGONAL: 0x20000000,

  /**
   * @property FLIPPED_ALL
   * @type {Number}
   * @static
   */
  FLIPPED_ALL: (0x80000000 | 0x40000000 | 0x20000000 | 0x10000000) >>> 0,

  /**
   * @property FLIPPED_MASK
   * @type {Number}
   * @static
   */
  FLIPPED_MASK: ~(0x80000000 | 0x40000000 | 0x20000000 | 0x10000000) >>> 0
});
/*
 * !#en The stagger axis of Hex tiled map.
 * !#zh 六边形地图的 stagger axis 值
 * @enum TiledMap.StaggerAxis
 * @static
 */

var StaggerAxis = cc.Enum({
  /**
   * @property STAGGERAXIS_X
   * @type {Number}
   * @static
   */
  STAGGERAXIS_X: 0,

  /**
   * @property STAGGERAXIS_Y
   * @type {Number}
   * @static
   */
  STAGGERAXIS_Y: 1
});
/*
 * !#en The stagger index of Hex tiled map.
 * !#zh 六边形地图的 stagger index 值
 * @enum TiledMap.RenderOrder
 * @static
 */

var StaggerIndex = cc.Enum({
  /**
   * @property STAGGERINDEX_ODD
   * @type {Number}
   * @static
   */
  STAGGERINDEX_ODD: 0,

  /**
   * @property STAGGERINDEX_EVEN
   * @type {Number}
   * @static
   */
  STAGGERINDEX_EVEN: 1
});
/*
 * !#en The render order of tiled map.
 * !#zh 地图的渲染顺序
 * @enum TiledMap.RenderOrder
 * @static
 */

var RenderOrder = cc.Enum({
  /**
   * @property STAGGERINDEX_ODD
   * @type {Number}
   * @static
   */
  RightDown: 0,
  RightUp: 1,
  LeftDown: 2,
  LeftUp: 3
});
/**
 * !#en TiledMap Object Type
 * !#zh 地图物体类型
 * @enum TiledMap.TMXObjectType
 * @static
 */

var TMXObjectType = cc.Enum({
  /**
   * @property RECT
   * @type {Number}
   * @static
   */
  RECT: 0,

  /**
   * @property ELLIPSE
   * @type {Number}
   * @static
   */
  ELLIPSE: 1,

  /**
   * @property POLYGON
   * @type {Number}
   * @static
   */
  POLYGON: 2,

  /**
   * @property POLYLINE
   * @type {Number}
   * @static
   */
  POLYLINE: 3,

  /**
   * @property IMAGE
   * @type {Number}
   * @static
   */
  IMAGE: 4,

  /**
   * @property TEXT
   * @type {Number}
   * @static
   */
  TEXT: 5
});
/**
 * !#en Renders a TMX Tile Map in the scene.
 * !#zh 在场景中渲染一个 tmx 格式的 Tile Map。
 * @class TiledMap
 * @extends Component
 */

var TiledMap = cc.Class({
  name: 'cc.TiledMap',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    executeInEditMode: true,
    menu: 'i18n:MAIN_MENU.component.renderers/TiledMap'
  },
  ctor: function ctor() {
    // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'
    this._texGrids = []; // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'

    this._textures = [];
    this._tilesets = [];
    this._animations = [];
    this._imageLayers = [];
    this._layers = [];
    this._groups = [];
    this._images = [];
    this._properties = [];
    this._tileProperties = [];
    this._mapSize = cc.size(0, 0);
    this._tileSize = cc.size(0, 0);
  },
  statics: {
    Orientation: Orientation,
    Property: Property,
    TileFlag: TileFlag,
    StaggerAxis: StaggerAxis,
    StaggerIndex: StaggerIndex,
    TMXObjectType: TMXObjectType,
    RenderOrder: RenderOrder
  },
  properties: {
    _tmxFile: {
      "default": null,
      type: cc.TiledMapAsset
    },

    /**
     * !#en The TiledMap Asset.
     * !#zh TiledMap 资源。
     * @property {TiledMapAsset} tmxAsset
     * @default ""
     */
    tmxAsset: {
      get: function get() {
        return this._tmxFile;
      },
      set: function set(value, force) {
        if (this._tmxFile !== value || CC_EDITOR && force) {
          this._tmxFile = value;

          this._applyFile();
        }
      },
      type: cc.TiledMapAsset
    }
  },

  /**
   * !#en Gets the map size.
   * !#zh 获取地图大小。
   * @method getMapSize
   * @return {Size}
   * @example
   * let mapSize = tiledMap.getMapSize();
   * cc.log("Map Size: " + mapSize);
   */
  getMapSize: function getMapSize() {
    return this._mapSize;
  },

  /**
   * !#en Gets the tile size.
   * !#zh 获取地图背景中 tile 元素的大小。
   * @method getTileSize
   * @return {Size}
   * @example
   * let tileSize = tiledMap.getTileSize();
   * cc.log("Tile Size: " + tileSize);
   */
  getTileSize: function getTileSize() {
    return this._tileSize;
  },

  /**
   * !#en map orientation.
   * !#zh 获取地图方向。
   * @method getMapOrientation
   * @return {Number}
   * @example
   * let mapOrientation = tiledMap.getMapOrientation();
   * cc.log("Map Orientation: " + mapOrientation);
   */
  getMapOrientation: function getMapOrientation() {
    return this._mapOrientation;
  },

  /**
   * !#en object groups.
   * !#zh 获取所有的对象层。
   * @method getObjectGroups
   * @return {TiledObjectGroup[]}
   * @example
   * let objGroups = titledMap.getObjectGroups();
   * for (let i = 0; i < objGroups.length; ++i) {
   *     cc.log("obj: " + objGroups[i]);
   * }
   */
  getObjectGroups: function getObjectGroups() {
    return this._groups;
  },

  /**
   * !#en Return the TMXObjectGroup for the specific group.
   * !#zh 获取指定的 TMXObjectGroup。
   * @method getObjectGroup
   * @param {String} groupName
   * @return {TiledObjectGroup}
   * @example
   * let group = titledMap.getObjectGroup("Players");
   * cc.log("ObjectGroup: " + group);
   */
  getObjectGroup: function getObjectGroup(groupName) {
    var groups = this._groups;

    for (var i = 0, l = groups.length; i < l; i++) {
      var group = groups[i];

      if (group && group.getGroupName() === groupName) {
        return group;
      }
    }

    return null;
  },

  /**
   * !#en enable or disable culling
   * !#zh 开启或关闭裁剪。
   * @method enableCulling
   * @param value
   */
  enableCulling: function enableCulling(value) {
    var layers = this._layers;

    for (var i = 0; i < layers.length; ++i) {
      layers[i].enableCulling(value);
    }
  },

  /**
   * !#en Gets the map properties.
   * !#zh 获取地图的属性。
   * @method getProperties
   * @return {Object[]}
   * @example
   * let properties = titledMap.getProperties();
   * for (let i = 0; i < properties.length; ++i) {
   *     cc.log("Properties: " + properties[i]);
   * }
   */
  getProperties: function getProperties() {
    return this._properties;
  },

  /**
   * !#en Return All layers array.
   * !#zh 返回包含所有 layer 的数组。
   * @method getLayers
   * @returns {TiledLayer[]}
   * @example
   * let layers = titledMap.getLayers();
   * for (let i = 0; i < layers.length; ++i) {
   *     cc.log("Layers: " + layers[i]);
   * }
   */
  getLayers: function getLayers() {
    return this._layers;
  },

  /**
   * !#en return the cc.TiledLayer for the specific layer.
   * !#zh 获取指定名称的 layer。
   * @method getLayer
   * @param {String} layerName
   * @return {TiledLayer}
   * @example
   * let layer = titledMap.getLayer("Player");
   * cc.log(layer);
   */
  getLayer: function getLayer(layerName) {
    var layers = this._layers;

    for (var i = 0, l = layers.length; i < l; i++) {
      var layer = layers[i];

      if (layer && layer.getLayerName() === layerName) {
        return layer;
      }
    }

    return null;
  },
  _changeLayer: function _changeLayer(layerName, replaceLayer) {
    var layers = this._layers;

    for (var i = 0, l = layers.length; i < l; i++) {
      var layer = layers[i];

      if (layer && layer.getLayerName() === layerName) {
        layers[i] = replaceLayer;
        return;
      }
    }
  },

  /**
   * !#en Return the value for the specific property name.
   * !#zh 通过属性名称，获取指定的属性。
   * @method getProperty
   * @param {String} propertyName
   * @return {String}
   * @example
   * let property = titledMap.getProperty("info");
   * cc.log("Property: " + property);
   */
  getProperty: function getProperty(propertyName) {
    return this._properties[propertyName.toString()];
  },

  /**
   * !#en Return properties dictionary for tile GID.
   * !#zh 通过 GID ，获取指定的属性。
   * @method getPropertiesForGID
   * @param {Number} GID
   * @return {Object}
   * @example
   * let properties = titledMap.getPropertiesForGID(GID);
   * cc.log("Properties: " + properties);
   */
  getPropertiesForGID: function getPropertiesForGID(GID) {
    return this._tileProperties[GID];
  },
  __preload: function __preload() {
    if (this._tmxFile) {
      // refresh layer entities
      this._applyFile();
    }
  },
  onEnable: function onEnable() {
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
  },
  onDisable: function onDisable() {
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
  },
  _applyFile: function _applyFile() {
    var file = this._tmxFile;

    if (file) {
      var texValues = file.textures;
      var texKeys = file.textureNames;
      var texSizes = file.textureSizes;
      var textures = {};
      var textureSizes = {};

      for (var i = 0; i < texValues.length; ++i) {
        var texName = texKeys[i];
        textures[texName] = texValues[i];
        textureSizes[texName] = texSizes[i];
      }

      var imageLayerTextures = {};
      texValues = file.imageLayerTextures;
      texKeys = file.imageLayerTextureNames;

      for (var _i = 0; _i < texValues.length; ++_i) {
        imageLayerTextures[texKeys[_i]] = texValues[_i];
      }

      var tsxFileNames = file.tsxFileNames;
      var tsxFiles = file.tsxFiles;
      var tsxMap = {};

      for (var _i2 = 0; _i2 < tsxFileNames.length; ++_i2) {
        if (tsxFileNames[_i2].length > 0) {
          tsxMap[tsxFileNames[_i2]] = tsxFiles[_i2].text;
        }
      }

      var mapInfo = new cc.TMXMapInfo(file.tmxXmlStr, tsxMap, textures, textureSizes, imageLayerTextures);
      var tilesets = mapInfo.getTilesets();
      if (!tilesets || tilesets.length === 0) cc.logID(7241);

      this._buildWithMapInfo(mapInfo);
    } else {
      this._releaseMapInfo();
    }
  },
  _releaseMapInfo: function _releaseMapInfo() {
    // remove the layers & object groups added before
    var layers = this._layers;

    for (var i = 0, l = layers.length; i < l; i++) {
      layers[i].node.removeFromParent(true);
      layers[i].node.destroy();
    }

    layers.length = 0;
    var groups = this._groups;

    for (var _i3 = 0, _l = groups.length; _i3 < _l; _i3++) {
      groups[_i3].node.removeFromParent(true);

      groups[_i3].node.destroy();
    }

    groups.length = 0;
    var images = this._images;

    for (var _i4 = 0, _l2 = images.length; _i4 < _l2; _i4++) {
      images[_i4].removeFromParent(true);

      images[_i4].destroy();
    }

    images.length = 0;
  },
  _syncAnchorPoint: function _syncAnchorPoint() {
    var anchor = this.node.getAnchorPoint();
    var leftTopX = this.node.width * anchor.x;
    var leftTopY = this.node.height * (1 - anchor.y);
    var i, l;

    for (i = 0, l = this._layers.length; i < l; i++) {
      var layerInfo = this._layers[i];
      var layerNode = layerInfo.node; // Tiled layer sync anchor to map because it's old behavior,
      // do not change the behavior avoid influence user's existed logic.

      layerNode.setAnchorPoint(anchor);
    }

    for (i = 0, l = this._groups.length; i < l; i++) {
      var groupInfo = this._groups[i];
      var groupNode = groupInfo.node; // Group layer not sync anchor to map because it's old behavior,
      // do not change the behavior avoid influence user's existing logic.

      groupNode.anchorX = 0.5;
      groupNode.anchorY = 0.5;
      groupNode.x = groupInfo._offset.x - leftTopX + groupNode.width * groupNode.anchorX;
      groupNode.y = groupInfo._offset.y + leftTopY - groupNode.height * groupNode.anchorY;
    }

    for (i = 0, l = this._images.length; i < l; i++) {
      var image = this._images[i];
      image.anchorX = 0.5;
      image.anchorY = 0.5;
      image.x = image._offset.x - leftTopX + image.width * image.anchorX;
      image.y = image._offset.y + leftTopY - image.height * image.anchorY;
    }
  },
  _fillAniGrids: function _fillAniGrids(texGrids, animations) {
    for (var i in animations) {
      var animation = animations[i];
      if (!animation) continue;
      var frames = animation.frames;

      for (var j = 0; j < frames.length; j++) {
        var frame = frames[j];
        frame.grid = texGrids[frame.tileid];
      }
    }
  },
  _buildLayerAndGroup: function _buildLayerAndGroup() {
    var tilesets = this._tilesets;
    var texGrids = this._texGrids;
    var animations = this._animations;
    texGrids.length = 0;

    for (var i = 0, l = tilesets.length; i < l; ++i) {
      var tilesetInfo = tilesets[i];
      if (!tilesetInfo) continue;
      cc.TiledMap.fillTextureGrids(tilesetInfo, texGrids, i);
    }

    this._fillAniGrids(texGrids, animations);

    var layers = this._layers;
    var groups = this._groups;
    var images = this._images;
    var oldNodeNames = {};

    for (var _i5 = 0, n = layers.length; _i5 < n; _i5++) {
      oldNodeNames[layers[_i5].node._name] = true;
    }

    for (var _i6 = 0, _n = groups.length; _i6 < _n; _i6++) {
      oldNodeNames[groups[_i6].node._name] = true;
    }

    for (var _i7 = 0, _n2 = images.length; _i7 < _n2; _i7++) {
      oldNodeNames[images[_i7]._name] = true;
    }

    layers = this._layers = [];
    groups = this._groups = [];
    images = this._images = [];
    var mapInfo = this._mapInfo;
    var node = this.node;
    var layerInfos = mapInfo.getAllChildren();
    var textures = this._textures;
    var maxWidth = 0;
    var maxHeight = 0;

    if (layerInfos && layerInfos.length > 0) {
      for (var _i8 = 0, len = layerInfos.length; _i8 < len; _i8++) {
        var layerInfo = layerInfos[_i8];
        var name = layerInfo.name;
        var child = this.node.getChildByName(name);
        oldNodeNames[name] = false;

        if (!child) {
          child = new cc.Node();
          child.name = name;
          node.addChild(child);
        }

        child.setSiblingIndex(_i8);
        child.active = layerInfo.visible;

        if (layerInfo instanceof cc.TMXLayerInfo) {
          var layer = child.getComponent(cc.TiledLayer);

          if (!layer) {
            layer = child.addComponent(cc.TiledLayer);
          }

          layer._init(layerInfo, mapInfo, tilesets, textures, texGrids); // tell the layerinfo to release the ownership of the tiles map.


          layerInfo.ownTiles = false;
          layers.push(layer);
        } else if (layerInfo instanceof cc.TMXObjectGroupInfo) {
          var group = child.getComponent(cc.TiledObjectGroup);

          if (!group) {
            group = child.addComponent(cc.TiledObjectGroup);
          }

          group._init(layerInfo, mapInfo, texGrids);

          groups.push(group);
        } else if (layerInfo instanceof cc.TMXImageLayerInfo) {
          var texture = layerInfo.sourceImage;
          child.opacity = layerInfo.opacity;
          child.layerInfo = layerInfo;
          child._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);
          var image = child.getComponent(cc.Sprite);

          if (!image) {
            image = child.addComponent(cc.Sprite);
          }

          var spf = image.spriteFrame || new cc.SpriteFrame();
          spf.setTexture(texture);
          image.spriteFrame = spf;
          child.width = texture.width;
          child.height = texture.height;
          images.push(child);
        }

        maxWidth = Math.max(maxWidth, child.width);
        maxHeight = Math.max(maxHeight, child.height);
      }
    }

    var children = node.children;

    for (var _i9 = 0, _n3 = children.length; _i9 < _n3; _i9++) {
      var c = children[_i9];

      if (oldNodeNames[c._name]) {
        c.destroy();
      }
    }

    this.node.width = maxWidth;
    this.node.height = maxHeight;

    this._syncAnchorPoint();
  },
  _buildWithMapInfo: function _buildWithMapInfo(mapInfo) {
    this._mapInfo = mapInfo;
    this._mapSize = mapInfo.getMapSize();
    this._tileSize = mapInfo.getTileSize();
    this._mapOrientation = mapInfo.orientation;
    this._properties = mapInfo.properties;
    this._tileProperties = mapInfo.getTileProperties();
    this._imageLayers = mapInfo.getImageLayers();
    this._animations = mapInfo.getTileAnimations();
    this._tilesets = mapInfo.getTilesets();
    var tilesets = this._tilesets;
    this._textures.length = 0;
    var totalTextures = [];

    for (var i = 0, l = tilesets.length; i < l; ++i) {
      var tilesetInfo = tilesets[i];
      if (!tilesetInfo || !tilesetInfo.sourceImage) continue;
      this._textures[i] = tilesetInfo.sourceImage;
      totalTextures.push(tilesetInfo.sourceImage);
    }

    for (var _i10 = 0; _i10 < this._imageLayers.length; _i10++) {
      var imageLayer = this._imageLayers[_i10];
      if (!imageLayer || !imageLayer.sourceImage) continue;
      totalTextures.push(imageLayer.sourceImage);
    }

    cc.TiledMap.loadAllTextures(totalTextures, function () {
      this._buildLayerAndGroup();
    }.bind(this));
  },
  update: function update(dt) {
    var animations = this._animations;
    var texGrids = this._texGrids;

    for (var aniGID in animations) {
      var animation = animations[aniGID];
      var frames = animation.frames;
      var frame = frames[animation.frameIdx];
      animation.dt += dt;

      if (frame.duration < animation.dt) {
        animation.dt = 0;
        animation.frameIdx++;

        if (animation.frameIdx >= frames.length) {
          animation.frameIdx = 0;
        }

        frame = frames[animation.frameIdx];
      }

      texGrids[aniGID] = frame.grid;
    }
  }
});
cc.TiledMap = module.exports = TiledMap;

cc.TiledMap.loadAllTextures = function (textures, loadedCallback) {
  var totalNum = textures.length;

  if (totalNum === 0) {
    loadedCallback();
    return;
  }

  var curNum = 0;

  var itemCallback = function itemCallback() {
    curNum++;

    if (curNum >= totalNum) {
      loadedCallback();
    }
  };

  for (var i = 0; i < totalNum; i++) {
    var tex = textures[i];

    if (!tex.loaded) {
      tex.once('load', function () {
        itemCallback();
      });
    } else {
      itemCallback();
    }
  }
};

cc.TiledMap.fillTextureGrids = function (tileset, texGrids, texId) {
  var tex = tileset.sourceImage;

  if (!tileset.imageSize.width || !tileset.imageSize.height) {
    tileset.imageSize.width = tex.width;
    tileset.imageSize.height = tex.height;
  }

  var tw = tileset._tileSize.width,
      th = tileset._tileSize.height,
      imageW = tex.width,
      imageH = tex.height,
      spacing = tileset.spacing,
      margin = tileset.margin,
      cols = Math.floor((imageW - margin * 2 + spacing) / (tw + spacing)),
      rows = Math.floor((imageH - margin * 2 + spacing) / (th + spacing)),
      count = rows * cols,
      gid = tileset.firstGid,
      grid = null,
      override = texGrids[gid] ? true : false,
      texelCorrect = cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX ? 0.5 : 0; // Tiledmap may not be partitioned into blocks, resulting in a count value of 0

  if (count <= 0) {
    count = 1;
  }

  var maxGid = tileset.firstGid + count;

  for (; gid < maxGid; ++gid) {
    // Avoid overlapping
    if (override && !texGrids[gid]) {
      override = false;
    }

    if (!override && texGrids[gid]) {
      break;
    }

    grid = {
      // record texture id
      texId: texId,
      // record belong to which tileset
      tileset: tileset,
      x: 0,
      y: 0,
      width: tw,
      height: th,
      t: 0,
      l: 0,
      r: 0,
      b: 0,
      gid: gid
    };
    tileset.rectForGID(gid, grid);
    grid.x += texelCorrect;
    grid.y += texelCorrect;
    grid.width -= texelCorrect * 2;
    grid.height -= texelCorrect * 2;
    grid.t = grid.y / imageH;
    grid.l = grid.x / imageW;
    grid.r = (grid.x + grid.width) / imageW;
    grid.b = (grid.y + grid.height) / imageH;
    texGrids[gid] = grid;
  }
};

cc.js.obsolete(cc.TiledMap.prototype, 'cc.TiledMap.tmxFile', 'tmxAsset', true);
cc.js.get(cc.TiledMap.prototype, 'mapLoaded', function () {
  cc.errorID(7203);
  return [];
}, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVGlsZWRNYXAuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk9yaWVudGF0aW9uIiwiY2MiLCJFbnVtIiwiT1JUSE8iLCJIRVgiLCJJU08iLCJQcm9wZXJ0eSIsIk5PTkUiLCJNQVAiLCJMQVlFUiIsIk9CSkVDVEdST1VQIiwiT0JKRUNUIiwiVElMRSIsIlRpbGVGbGFnIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiRElBR09OQUwiLCJGTElQUEVEX0FMTCIsIkZMSVBQRURfTUFTSyIsIlN0YWdnZXJBeGlzIiwiU1RBR0dFUkFYSVNfWCIsIlNUQUdHRVJBWElTX1kiLCJTdGFnZ2VySW5kZXgiLCJTVEFHR0VSSU5ERVhfT0REIiwiU1RBR0dFUklOREVYX0VWRU4iLCJSZW5kZXJPcmRlciIsIlJpZ2h0RG93biIsIlJpZ2h0VXAiLCJMZWZ0RG93biIsIkxlZnRVcCIsIlRNWE9iamVjdFR5cGUiLCJSRUNUIiwiRUxMSVBTRSIsIlBPTFlHT04iLCJQT0xZTElORSIsIklNQUdFIiwiVEVYVCIsIlRpbGVkTWFwIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJtZW51IiwiY3RvciIsIl90ZXhHcmlkcyIsIl90ZXh0dXJlcyIsIl90aWxlc2V0cyIsIl9hbmltYXRpb25zIiwiX2ltYWdlTGF5ZXJzIiwiX2xheWVycyIsIl9ncm91cHMiLCJfaW1hZ2VzIiwiX3Byb3BlcnRpZXMiLCJfdGlsZVByb3BlcnRpZXMiLCJfbWFwU2l6ZSIsInNpemUiLCJfdGlsZVNpemUiLCJzdGF0aWNzIiwicHJvcGVydGllcyIsIl90bXhGaWxlIiwidHlwZSIsIlRpbGVkTWFwQXNzZXQiLCJ0bXhBc3NldCIsImdldCIsInNldCIsInZhbHVlIiwiZm9yY2UiLCJfYXBwbHlGaWxlIiwiZ2V0TWFwU2l6ZSIsImdldFRpbGVTaXplIiwiZ2V0TWFwT3JpZW50YXRpb24iLCJfbWFwT3JpZW50YXRpb24iLCJnZXRPYmplY3RHcm91cHMiLCJnZXRPYmplY3RHcm91cCIsImdyb3VwTmFtZSIsImdyb3VwcyIsImkiLCJsIiwibGVuZ3RoIiwiZ3JvdXAiLCJnZXRHcm91cE5hbWUiLCJlbmFibGVDdWxsaW5nIiwibGF5ZXJzIiwiZ2V0UHJvcGVydGllcyIsImdldExheWVycyIsImdldExheWVyIiwibGF5ZXJOYW1lIiwibGF5ZXIiLCJnZXRMYXllck5hbWUiLCJfY2hhbmdlTGF5ZXIiLCJyZXBsYWNlTGF5ZXIiLCJnZXRQcm9wZXJ0eSIsInByb3BlcnR5TmFtZSIsInRvU3RyaW5nIiwiZ2V0UHJvcGVydGllc0ZvckdJRCIsIkdJRCIsIl9fcHJlbG9hZCIsIm9uRW5hYmxlIiwibm9kZSIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIkFOQ0hPUl9DSEFOR0VEIiwiX3N5bmNBbmNob3JQb2ludCIsIm9uRGlzYWJsZSIsIm9mZiIsImZpbGUiLCJ0ZXhWYWx1ZXMiLCJ0ZXh0dXJlcyIsInRleEtleXMiLCJ0ZXh0dXJlTmFtZXMiLCJ0ZXhTaXplcyIsInRleHR1cmVTaXplcyIsInRleE5hbWUiLCJpbWFnZUxheWVyVGV4dHVyZXMiLCJpbWFnZUxheWVyVGV4dHVyZU5hbWVzIiwidHN4RmlsZU5hbWVzIiwidHN4RmlsZXMiLCJ0c3hNYXAiLCJ0ZXh0IiwibWFwSW5mbyIsIlRNWE1hcEluZm8iLCJ0bXhYbWxTdHIiLCJ0aWxlc2V0cyIsImdldFRpbGVzZXRzIiwibG9nSUQiLCJfYnVpbGRXaXRoTWFwSW5mbyIsIl9yZWxlYXNlTWFwSW5mbyIsInJlbW92ZUZyb21QYXJlbnQiLCJkZXN0cm95IiwiaW1hZ2VzIiwiYW5jaG9yIiwiZ2V0QW5jaG9yUG9pbnQiLCJsZWZ0VG9wWCIsIndpZHRoIiwieCIsImxlZnRUb3BZIiwiaGVpZ2h0IiwieSIsImxheWVySW5mbyIsImxheWVyTm9kZSIsInNldEFuY2hvclBvaW50IiwiZ3JvdXBJbmZvIiwiZ3JvdXBOb2RlIiwiYW5jaG9yWCIsImFuY2hvclkiLCJfb2Zmc2V0IiwiaW1hZ2UiLCJfZmlsbEFuaUdyaWRzIiwidGV4R3JpZHMiLCJhbmltYXRpb25zIiwiYW5pbWF0aW9uIiwiZnJhbWVzIiwiaiIsImZyYW1lIiwiZ3JpZCIsInRpbGVpZCIsIl9idWlsZExheWVyQW5kR3JvdXAiLCJ0aWxlc2V0SW5mbyIsImZpbGxUZXh0dXJlR3JpZHMiLCJvbGROb2RlTmFtZXMiLCJuIiwiX25hbWUiLCJfbWFwSW5mbyIsImxheWVySW5mb3MiLCJnZXRBbGxDaGlsZHJlbiIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwibGVuIiwiY2hpbGQiLCJnZXRDaGlsZEJ5TmFtZSIsImFkZENoaWxkIiwic2V0U2libGluZ0luZGV4IiwiYWN0aXZlIiwidmlzaWJsZSIsIlRNWExheWVySW5mbyIsImdldENvbXBvbmVudCIsIlRpbGVkTGF5ZXIiLCJhZGRDb21wb25lbnQiLCJfaW5pdCIsIm93blRpbGVzIiwicHVzaCIsIlRNWE9iamVjdEdyb3VwSW5mbyIsIlRpbGVkT2JqZWN0R3JvdXAiLCJUTVhJbWFnZUxheWVySW5mbyIsInRleHR1cmUiLCJzb3VyY2VJbWFnZSIsIm9wYWNpdHkiLCJ2MiIsIm9mZnNldCIsIlNwcml0ZSIsInNwZiIsInNwcml0ZUZyYW1lIiwiU3ByaXRlRnJhbWUiLCJzZXRUZXh0dXJlIiwiTWF0aCIsIm1heCIsImNoaWxkcmVuIiwiYyIsIm9yaWVudGF0aW9uIiwiZ2V0VGlsZVByb3BlcnRpZXMiLCJnZXRJbWFnZUxheWVycyIsImdldFRpbGVBbmltYXRpb25zIiwidG90YWxUZXh0dXJlcyIsImltYWdlTGF5ZXIiLCJsb2FkQWxsVGV4dHVyZXMiLCJiaW5kIiwidXBkYXRlIiwiZHQiLCJhbmlHSUQiLCJmcmFtZUlkeCIsImR1cmF0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsImxvYWRlZENhbGxiYWNrIiwidG90YWxOdW0iLCJjdXJOdW0iLCJpdGVtQ2FsbGJhY2siLCJ0ZXgiLCJsb2FkZWQiLCJvbmNlIiwidGlsZXNldCIsInRleElkIiwiaW1hZ2VTaXplIiwidHciLCJ0aCIsImltYWdlVyIsImltYWdlSCIsInNwYWNpbmciLCJtYXJnaW4iLCJjb2xzIiwiZmxvb3IiLCJyb3dzIiwiY291bnQiLCJnaWQiLCJmaXJzdEdpZCIsIm92ZXJyaWRlIiwidGV4ZWxDb3JyZWN0IiwibWFjcm8iLCJGSVhfQVJUSUZBQ1RTX0JZX1NUUkVDSElOR19URVhFTF9UTVgiLCJtYXhHaWQiLCJ0IiwiciIsImIiLCJyZWN0Rm9yR0lEIiwianMiLCJvYnNvbGV0ZSIsInByb3RvdHlwZSIsImVycm9ySUQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQUEsT0FBTyxDQUFDLGtCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLGVBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLHNCQUFELENBQVA7QUFFQTs7Ozs7Ozs7QUFNQSxJQUFJQyxXQUFXLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3RCOzs7Ozs7O0FBT0FDLEVBQUFBLEtBQUssRUFBRSxDQVJlOztBQVV0Qjs7Ozs7OztBQU9BQyxFQUFBQSxHQUFHLEVBQUUsQ0FqQmlCOztBQW1CdEI7Ozs7Ozs7QUFPQUMsRUFBQUEsR0FBRyxFQUFFO0FBMUJpQixDQUFSLENBQWxCO0FBNkJBOzs7Ozs7QUFLQSxJQUFJQyxRQUFRLEdBQUdMLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ25COzs7OztBQUtBSyxFQUFBQSxJQUFJLEVBQUUsQ0FOYTs7QUFRbkI7Ozs7O0FBS0FDLEVBQUFBLEdBQUcsRUFBRSxDQWJjOztBQWVuQjs7Ozs7QUFLQUMsRUFBQUEsS0FBSyxFQUFFLENBcEJZOztBQXNCbkI7Ozs7O0FBS0FDLEVBQUFBLFdBQVcsRUFBRSxDQTNCTTs7QUE2Qm5COzs7OztBQUtBQyxFQUFBQSxNQUFNLEVBQUUsQ0FsQ1c7O0FBb0NuQjs7Ozs7QUFLQUMsRUFBQUEsSUFBSSxFQUFFO0FBekNhLENBQVIsQ0FBZjtBQTRD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QjtBQUNBdkUsSUFBQUEsSUFBSSxDQUFDdUYsQ0FBTCxHQUFTLENBQUN2RixJQUFJLENBQUNwQixDQUFMLEdBQVNvQixJQUFJLENBQUNyQixLQUFmLElBQXdCNEYsTUFBakM7QUFDQXZFLElBQUFBLElBQUksQ0FBQ3dGLENBQUwsR0FBUyxDQUFDeEYsSUFBSSxDQUFDakIsQ0FBTCxHQUFTaUIsSUFBSSxDQUFDbEIsTUFBZixJQUF5QjBGLE1BQWxDO0FBQ0E5RSxJQUFBQSxRQUFRLENBQUNxRixHQUFELENBQVIsR0FBZ0IvRSxJQUFoQjtBQUNIO0FBQ0osQ0EzREQ7O0FBNkRBNUosRUFBRSxDQUFDc1AsRUFBSCxDQUFNQyxRQUFOLENBQWV2UCxFQUFFLENBQUNvQyxRQUFILENBQVlvTixTQUEzQixFQUFzQyxxQkFBdEMsRUFBNkQsVUFBN0QsRUFBeUUsSUFBekU7QUFDQXhQLEVBQUUsQ0FBQ3NQLEVBQUgsQ0FBTXRMLEdBQU4sQ0FBVWhFLEVBQUUsQ0FBQ29DLFFBQUgsQ0FBWW9OLFNBQXRCLEVBQWlDLFdBQWpDLEVBQThDLFlBQVk7QUFDdER4UCxFQUFBQSxFQUFFLENBQUN5UCxPQUFILENBQVcsSUFBWDtBQUNBLFNBQU8sRUFBUDtBQUNILENBSEQsRUFHRyxLQUhIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5yZXF1aXJlKCcuL0NDVE1YWE1MUGFyc2VyJyk7XG5yZXF1aXJlKCcuL0NDVGlsZWRNYXBBc3NldCcpO1xucmVxdWlyZSgnLi9DQ1RpbGVkTGF5ZXInKTtcbnJlcXVpcmUoJy4vQ0NUaWxlZFRpbGUnKTtcbnJlcXVpcmUoJy4vQ0NUaWxlZE9iamVjdEdyb3VwJyk7XG5cbi8qKlxuICogISNlbiBUaGUgb3JpZW50YXRpb24gb2YgdGlsZWQgbWFwLlxuICogISN6aCBUaWxlZCBNYXAg5Zyw5Zu+5pa55ZCR44CCXG4gKiBAZW51bSBUaWxlZE1hcC5PcmllbnRhdGlvblxuICogQHN0YXRpY1xuICovXG5sZXQgT3JpZW50YXRpb24gPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIE9ydGhvZ29uYWwgb3JpZW50YXRpb24uXG4gICAgICogISN6aCDnm7Top5LpuJ/nnrDlnLDlm77vvIg5MMKw5Zyw5Zu+77yJ44CCXG4gICAgICogQHByb3BlcnR5IE9SVEhPXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgT1JUSE86IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEhleGFnb25hbCBvcmllbnRhdGlvbi5cbiAgICAgKiAhI3poIOWFrei+ueW9ouWcsOWbvlxuICAgICAqIEBwcm9wZXJ0eSBIRVhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBIRVg6IDEsXG5cbiAgICAvKipcbiAgICAgKiBJc29tZXRyaWMgb3JpZW50YXRpb24uXG4gICAgICog562J6Led5pac6KeG5Zyw5Zu+77yI5pacNDXCsOWcsOWbvu+8ieOAglxuICAgICAqIEBwcm9wZXJ0eSBJU09cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBJU086IDJcbn0pO1xuXG4vKlxuICogVGhlIHByb3BlcnR5IHR5cGUgb2YgdGlsZWQgbWFwLlxuICogQGVudW0gVGlsZWRNYXAuUHJvcGVydHlcbiAqIEBzdGF0aWNcbiAqL1xubGV0IFByb3BlcnR5ID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE5PTkVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBOT05FOiAwLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE1BUFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1BUDogMSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBMQVlFUlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIExBWUVSOiAyLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9CSkVDVEdST1VQXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgT0JKRUNUR1JPVVA6IDMsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgT0JKRUNUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgT0JKRUNUOiA0LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFRJTEVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUSUxFOiA1XG59KTtcblxuLypcbiAqIFRoZSB0aWxlIGZsYWdzIG9mIHRpbGVkIG1hcC5cbiAqIEBlbnVtIFRpbGVkTWFwLlRpbGVGbGFnXG4gKiBAc3RhdGljXG4gKi9cbmxldCBUaWxlRmxhZyA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBIT1JJWk9OVEFMXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgSE9SSVpPTlRBTDogMHg4MDAwMDAwMCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBWRVJUSUNBTFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFZFUlRJQ0FMOiAweDQwMDAwMDAwLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IERJQUdPTkFMXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgRElBR09OQUw6IDB4MjAwMDAwMDAsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgRkxJUFBFRF9BTExcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBGTElQUEVEX0FMTDogKDB4ODAwMDAwMDAgfCAweDQwMDAwMDAwIHwgMHgyMDAwMDAwMCB8IDB4MTAwMDAwMDApID4+PiAwLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IEZMSVBQRURfTUFTS1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIEZMSVBQRURfTUFTSzogKH4oMHg4MDAwMDAwMCB8IDB4NDAwMDAwMDAgfCAweDIwMDAwMDAwIHwgMHgxMDAwMDAwMCkpID4+PiAwXG59KTtcblxuLypcbiAqICEjZW4gVGhlIHN0YWdnZXIgYXhpcyBvZiBIZXggdGlsZWQgbWFwLlxuICogISN6aCDlha3ovrnlvaLlnLDlm77nmoQgc3RhZ2dlciBheGlzIOWAvFxuICogQGVudW0gVGlsZWRNYXAuU3RhZ2dlckF4aXNcbiAqIEBzdGF0aWNcbiAqL1xubGV0IFN0YWdnZXJBeGlzID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNUQUdHRVJBWElTX1hcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBTVEFHR0VSQVhJU19YIDogMCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBTVEFHR0VSQVhJU19ZXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgU1RBR0dFUkFYSVNfWSA6IDFcbn0pO1xuXG4vKlxuICogISNlbiBUaGUgc3RhZ2dlciBpbmRleCBvZiBIZXggdGlsZWQgbWFwLlxuICogISN6aCDlha3ovrnlvaLlnLDlm77nmoQgc3RhZ2dlciBpbmRleCDlgLxcbiAqIEBlbnVtIFRpbGVkTWFwLlJlbmRlck9yZGVyXG4gKiBAc3RhdGljXG4gKi9cbmxldCBTdGFnZ2VySW5kZXggPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgU1RBR0dFUklOREVYX09ERFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNUQUdHRVJJTkRFWF9PREQgOiAwLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNUQUdHRVJJTkRFWF9FVkVOXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgU1RBR0dFUklOREVYX0VWRU4gOiAxXG59KTtcblxuLypcbiAqICEjZW4gVGhlIHJlbmRlciBvcmRlciBvZiB0aWxlZCBtYXAuXG4gKiAhI3poIOWcsOWbvueahOa4suafk+mhuuW6j1xuICogQGVudW0gVGlsZWRNYXAuUmVuZGVyT3JkZXJcbiAqIEBzdGF0aWNcbiAqL1xubGV0IFJlbmRlck9yZGVyID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNUQUdHRVJJTkRFWF9PRERcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBSaWdodERvd24gOiAwLFxuICAgIFJpZ2h0VXAgOiAxLFxuICAgIExlZnREb3duOiAyLFxuICAgIExlZnRVcDogMyxcbn0pO1xuXG4vKipcbiAqICEjZW4gVGlsZWRNYXAgT2JqZWN0IFR5cGVcbiAqICEjemgg5Zyw5Zu+54mp5L2T57G75Z6LXG4gKiBAZW51bSBUaWxlZE1hcC5UTVhPYmplY3RUeXBlXG4gKiBAc3RhdGljXG4gKi9cbmxldCBUTVhPYmplY3RUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFJFQ1RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBSRUNUIDogMCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBFTExJUFNFXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgRUxMSVBTRSA6IDEsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgUE9MWUdPTlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFBPTFlHT04gOiAyLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFBPTFlMSU5FXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgUE9MWUxJTkUgOiAzLFxuICAgIFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBJTUFHRVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIElNQUdFIDogNCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBURVhUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgVEVYVDogNSxcbn0pO1xuXG4vKipcbiAqICEjZW4gUmVuZGVycyBhIFRNWCBUaWxlIE1hcCBpbiB0aGUgc2NlbmUuXG4gKiAhI3poIOWcqOWcuuaZr+S4rea4suafk+S4gOS4qiB0bXgg5qC85byP55qEIFRpbGUgTWFw44CCXG4gKiBAY2xhc3MgVGlsZWRNYXBcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5sZXQgVGlsZWRNYXAgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRpbGVkTWFwJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9UaWxlZE1hcCcsXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICAvLyBzdG9yZSBhbGwgbGF5ZXIgZ2lkIGNvcnJlc3BvbmRpbmcgdGV4dHVyZSBpbmZvLCBpbmRleCBpcyBnaWQsIGZvcm1hdCBsaWtlcyAnW2dpZDBdPXRleC1pbmZvLFtnaWQxXT10ZXgtaW5mbywgLi4uJ1xuICAgICAgICB0aGlzLl90ZXhHcmlkcyA9IFtdO1xuICAgICAgICAvLyBzdG9yZSBhbGwgdGlsZXNldCB0ZXh0dXJlLCBpbmRleCBpcyB0aWxlc2V0IGluZGV4LCBmb3JtYXQgbGlrZXMgJ1swXT10ZXh0dXJlMCwgWzFdPXRleHR1cmUxLCAuLi4nXG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0gW107XG4gICAgICAgIHRoaXMuX3RpbGVzZXRzID0gW107XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLl9pbWFnZUxheWVycyA9IFtdO1xuICAgICAgICB0aGlzLl9sYXllcnMgPSBbXTtcbiAgICAgICAgdGhpcy5fZ3JvdXBzID0gW107XG4gICAgICAgIHRoaXMuX2ltYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gW107XG4gICAgICAgIHRoaXMuX3RpbGVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5fbWFwU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgICAgIHRoaXMuX3RpbGVTaXplID0gY2Muc2l6ZSgwLCAwKTtcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBPcmllbnRhdGlvbjogT3JpZW50YXRpb24sXG4gICAgICAgIFByb3BlcnR5OiBQcm9wZXJ0eSxcbiAgICAgICAgVGlsZUZsYWc6IFRpbGVGbGFnLFxuICAgICAgICBTdGFnZ2VyQXhpczogU3RhZ2dlckF4aXMsXG4gICAgICAgIFN0YWdnZXJJbmRleDogU3RhZ2dlckluZGV4LFxuICAgICAgICBUTVhPYmplY3RUeXBlOiBUTVhPYmplY3RUeXBlLFxuICAgICAgICBSZW5kZXJPcmRlcjogUmVuZGVyT3JkZXJcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfdG14RmlsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRpbGVkTWFwQXNzZXRcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIFRpbGVkTWFwIEFzc2V0LlxuICAgICAgICAgKiAhI3poIFRpbGVkTWFwIOi1hOa6kOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1RpbGVkTWFwQXNzZXR9IHRteEFzc2V0XG4gICAgICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgICAgICovXG4gICAgICAgIHRteEFzc2V0IDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdG14RmlsZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlLCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90bXhGaWxlICE9PSB2YWx1ZSB8fCAoQ0NfRURJVE9SICYmIGZvcmNlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90bXhGaWxlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5RmlsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5UaWxlZE1hcEFzc2V0XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBtYXAgc2l6ZS5cbiAgICAgKiAhI3poIOiOt+WPluWcsOWbvuWkp+Wwj+OAglxuICAgICAqIEBtZXRob2QgZ2V0TWFwU2l6ZVxuICAgICAqIEByZXR1cm4ge1NpemV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgbWFwU2l6ZSA9IHRpbGVkTWFwLmdldE1hcFNpemUoKTtcbiAgICAgKiBjYy5sb2coXCJNYXAgU2l6ZTogXCIgKyBtYXBTaXplKTtcbiAgICAgKi9cbiAgICBnZXRNYXBTaXplICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcFNpemU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyB0aGUgdGlsZSBzaXplLlxuICAgICAqICEjemgg6I635Y+W5Zyw5Zu+6IOM5pmv5LitIHRpbGUg5YWD57Sg55qE5aSn5bCP44CCXG4gICAgICogQG1ldGhvZCBnZXRUaWxlU2l6ZVxuICAgICAqIEByZXR1cm4ge1NpemV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgdGlsZVNpemUgPSB0aWxlZE1hcC5nZXRUaWxlU2l6ZSgpO1xuICAgICAqIGNjLmxvZyhcIlRpbGUgU2l6ZTogXCIgKyB0aWxlU2l6ZSk7XG4gICAgICovXG4gICAgZ2V0VGlsZVNpemUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGlsZVNpemU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gbWFwIG9yaWVudGF0aW9uLlxuICAgICAqICEjemgg6I635Y+W5Zyw5Zu+5pa55ZCR44CCXG4gICAgICogQG1ldGhvZCBnZXRNYXBPcmllbnRhdGlvblxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBtYXBPcmllbnRhdGlvbiA9IHRpbGVkTWFwLmdldE1hcE9yaWVudGF0aW9uKCk7XG4gICAgICogY2MubG9nKFwiTWFwIE9yaWVudGF0aW9uOiBcIiArIG1hcE9yaWVudGF0aW9uKTtcbiAgICAgKi9cbiAgICBnZXRNYXBPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXBPcmllbnRhdGlvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBvYmplY3QgZ3JvdXBzLlxuICAgICAqICEjemgg6I635Y+W5omA5pyJ55qE5a+56LGh5bGC44CCXG4gICAgICogQG1ldGhvZCBnZXRPYmplY3RHcm91cHNcbiAgICAgKiBAcmV0dXJuIHtUaWxlZE9iamVjdEdyb3VwW119XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgb2JqR3JvdXBzID0gdGl0bGVkTWFwLmdldE9iamVjdEdyb3VwcygpO1xuICAgICAqIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqR3JvdXBzLmxlbmd0aDsgKytpKSB7XG4gICAgICogICAgIGNjLmxvZyhcIm9iajogXCIgKyBvYmpHcm91cHNbaV0pO1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBnZXRPYmplY3RHcm91cHMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdXBzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybiB0aGUgVE1YT2JqZWN0R3JvdXAgZm9yIHRoZSBzcGVjaWZpYyBncm91cC5cbiAgICAgKiAhI3poIOiOt+WPluaMh+WumueahCBUTVhPYmplY3RHcm91cOOAglxuICAgICAqIEBtZXRob2QgZ2V0T2JqZWN0R3JvdXBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZ3JvdXBOYW1lXG4gICAgICogQHJldHVybiB7VGlsZWRPYmplY3RHcm91cH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBncm91cCA9IHRpdGxlZE1hcC5nZXRPYmplY3RHcm91cChcIlBsYXllcnNcIik7XG4gICAgICogY2MubG9nKFwiT2JqZWN0R3JvdXA6IFwiICsgZ3JvdXApO1xuICAgICAqL1xuICAgIGdldE9iamVjdEdyb3VwIChncm91cE5hbWUpIHtcbiAgICAgICAgbGV0IGdyb3VwcyA9IHRoaXMuX2dyb3VwcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBncm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBncm91cHNbaV07XG4gICAgICAgICAgICBpZiAoZ3JvdXAgJiYgZ3JvdXAuZ2V0R3JvdXBOYW1lKCkgPT09IGdyb3VwTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGVuYWJsZSBvciBkaXNhYmxlIGN1bGxpbmdcbiAgICAgKiAhI3poIOW8gOWQr+aIluWFs+mXreijgeWJquOAglxuICAgICAqIEBtZXRob2QgZW5hYmxlQ3VsbGluZ1xuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIGVuYWJsZUN1bGxpbmcgKHZhbHVlKSB7XG4gICAgICAgIGxldCBsYXllcnMgPSB0aGlzLl9sYXllcnM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsYXllcnNbaV0uZW5hYmxlQ3VsbGluZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBtYXAgcHJvcGVydGllcy5cbiAgICAgKiAhI3poIOiOt+WPluWcsOWbvueahOWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgZ2V0UHJvcGVydGllc1xuICAgICAqIEByZXR1cm4ge09iamVjdFtdfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IHByb3BlcnRpZXMgPSB0aXRsZWRNYXAuZ2V0UHJvcGVydGllcygpO1xuICAgICAqIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7ICsraSkge1xuICAgICAqICAgICBjYy5sb2coXCJQcm9wZXJ0aWVzOiBcIiArIHByb3BlcnRpZXNbaV0pO1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJuIEFsbCBsYXllcnMgYXJyYXkuXG4gICAgICogISN6aCDov5Tlm57ljIXlkKvmiYDmnIkgbGF5ZXIg55qE5pWw57uE44CCXG4gICAgICogQG1ldGhvZCBnZXRMYXllcnNcbiAgICAgKiBAcmV0dXJucyB7VGlsZWRMYXllcltdfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGxheWVycyA9IHRpdGxlZE1hcC5nZXRMYXllcnMoKTtcbiAgICAgKiBmb3IgKGxldCBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7ICsraSkge1xuICAgICAqICAgICBjYy5sb2coXCJMYXllcnM6IFwiICsgbGF5ZXJzW2ldKTtcbiAgICAgKiB9XG4gICAgICovXG4gICAgZ2V0TGF5ZXJzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gdGhlIGNjLlRpbGVkTGF5ZXIgZm9yIHRoZSBzcGVjaWZpYyBsYXllci5cbiAgICAgKiAhI3poIOiOt+WPluaMh+WumuWQjeensOeahCBsYXllcuOAglxuICAgICAqIEBtZXRob2QgZ2V0TGF5ZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbGF5ZXJOYW1lXG4gICAgICogQHJldHVybiB7VGlsZWRMYXllcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBsYXllciA9IHRpdGxlZE1hcC5nZXRMYXllcihcIlBsYXllclwiKTtcbiAgICAgKiBjYy5sb2cobGF5ZXIpO1xuICAgICAqL1xuICAgIGdldExheWVyIChsYXllck5hbWUpIHtcbiAgICAgICAgbGV0IGxheWVycyA9IHRoaXMuX2xheWVycztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGF5ZXIgPSBsYXllcnNbaV07XG4gICAgICAgICAgICBpZiAobGF5ZXIgJiYgbGF5ZXIuZ2V0TGF5ZXJOYW1lKCkgPT09IGxheWVyTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgX2NoYW5nZUxheWVyIChsYXllck5hbWUsIHJlcGxhY2VMYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxheWVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsYXllciA9IGxheWVyc1tpXTtcbiAgICAgICAgICAgIGlmIChsYXllciAmJiBsYXllci5nZXRMYXllck5hbWUoKSA9PT0gbGF5ZXJOYW1lKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJzW2ldID0gcmVwbGFjZUxheWVyO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBwcm9wZXJ0eSBuYW1lLlxuICAgICAqICEjemgg6YCa6L+H5bGe5oCn5ZCN56ew77yM6I635Y+W5oyH5a6a55qE5bGe5oCn44CCXG4gICAgICogQG1ldGhvZCBnZXRQcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgcHJvcGVydHkgPSB0aXRsZWRNYXAuZ2V0UHJvcGVydHkoXCJpbmZvXCIpO1xuICAgICAqIGNjLmxvZyhcIlByb3BlcnR5OiBcIiArIHByb3BlcnR5KTtcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eSAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZS50b1N0cmluZygpXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm4gcHJvcGVydGllcyBkaWN0aW9uYXJ5IGZvciB0aWxlIEdJRC5cbiAgICAgKiAhI3poIOmAmui/hyBHSUQg77yM6I635Y+W5oyH5a6a55qE5bGe5oCn44CCXG4gICAgICogQG1ldGhvZCBnZXRQcm9wZXJ0aWVzRm9yR0lEXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IEdJRFxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBwcm9wZXJ0aWVzID0gdGl0bGVkTWFwLmdldFByb3BlcnRpZXNGb3JHSUQoR0lEKTtcbiAgICAgKiBjYy5sb2coXCJQcm9wZXJ0aWVzOiBcIiArIHByb3BlcnRpZXMpO1xuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXNGb3JHSUQgKEdJRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGlsZVByb3BlcnRpZXNbR0lEXTtcbiAgICB9LFxuXG4gICAgX19wcmVsb2FkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3RteEZpbGUpIHtcbiAgICAgICAgICAgIC8vIHJlZnJlc2ggbGF5ZXIgZW50aXRpZXNcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5RmlsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9zeW5jQW5jaG9yUG9pbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9zeW5jQW5jaG9yUG9pbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlGaWxlICgpIHtcbiAgICAgICAgbGV0IGZpbGUgPSB0aGlzLl90bXhGaWxlO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgbGV0IHRleFZhbHVlcyA9IGZpbGUudGV4dHVyZXM7XG4gICAgICAgICAgICBsZXQgdGV4S2V5cyA9IGZpbGUudGV4dHVyZU5hbWVzO1xuICAgICAgICAgICAgbGV0IHRleFNpemVzID0gZmlsZS50ZXh0dXJlU2l6ZXM7XG4gICAgICAgICAgICBsZXQgdGV4dHVyZXMgPSB7fTtcbiAgICAgICAgICAgIGxldCB0ZXh0dXJlU2l6ZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4VmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRleE5hbWUgPSB0ZXhLZXlzW2ldO1xuICAgICAgICAgICAgICAgIHRleHR1cmVzW3RleE5hbWVdID0gdGV4VmFsdWVzW2ldO1xuICAgICAgICAgICAgICAgIHRleHR1cmVTaXplc1t0ZXhOYW1lXSA9IHRleFNpemVzW2ldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaW1hZ2VMYXllclRleHR1cmVzID0ge307XG4gICAgICAgICAgICB0ZXhWYWx1ZXMgPSBmaWxlLmltYWdlTGF5ZXJUZXh0dXJlcztcbiAgICAgICAgICAgIHRleEtleXMgPSBmaWxlLmltYWdlTGF5ZXJUZXh0dXJlTmFtZXM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleFZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXJUZXh0dXJlc1t0ZXhLZXlzW2ldXSA9IHRleFZhbHVlc1tpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRzeEZpbGVOYW1lcyA9IGZpbGUudHN4RmlsZU5hbWVzO1xuICAgICAgICAgICAgbGV0IHRzeEZpbGVzID0gZmlsZS50c3hGaWxlcztcbiAgICAgICAgICAgIGxldCB0c3hNYXAgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHN4RmlsZU5hbWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRzeEZpbGVOYW1lc1tpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRzeE1hcFt0c3hGaWxlTmFtZXNbaV1dID0gdHN4RmlsZXNbaV0udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBtYXBJbmZvID0gbmV3IGNjLlRNWE1hcEluZm8oZmlsZS50bXhYbWxTdHIsIHRzeE1hcCwgdGV4dHVyZXMsIHRleHR1cmVTaXplcywgaW1hZ2VMYXllclRleHR1cmVzKTtcbiAgICAgICAgICAgIGxldCB0aWxlc2V0cyA9IG1hcEluZm8uZ2V0VGlsZXNldHMoKTtcbiAgICAgICAgICAgIGlmKCF0aWxlc2V0cyB8fCB0aWxlc2V0cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgY2MubG9nSUQoNzI0MSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2J1aWxkV2l0aE1hcEluZm8obWFwSW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZWxlYXNlTWFwSW5mbygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9yZWxlYXNlTWFwSW5mbyAoKSB7XG4gICAgICAgIC8vIHJlbW92ZSB0aGUgbGF5ZXJzICYgb2JqZWN0IGdyb3VwcyBhZGRlZCBiZWZvcmVcbiAgICAgICAgbGV0IGxheWVycyA9IHRoaXMuX2xheWVycztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsYXllcnNbaV0ubm9kZS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xuICAgICAgICAgICAgbGF5ZXJzW2ldLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGxheWVycy5sZW5ndGggPSAwO1xuXG4gICAgICAgIGxldCBncm91cHMgPSB0aGlzLl9ncm91cHM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZ3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZ3JvdXBzW2ldLm5vZGUucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcbiAgICAgICAgICAgIGdyb3Vwc1tpXS5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBncm91cHMubGVuZ3RoID0gMDtcblxuICAgICAgICBsZXQgaW1hZ2VzID0gdGhpcy5faW1hZ2VzO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGltYWdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGltYWdlc1tpXS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xuICAgICAgICAgICAgaW1hZ2VzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpbWFnZXMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgX3N5bmNBbmNob3JQb2ludCAoKSB7XG4gICAgICAgIGxldCBhbmNob3IgPSB0aGlzLm5vZGUuZ2V0QW5jaG9yUG9pbnQoKTtcbiAgICAgICAgbGV0IGxlZnRUb3BYID0gdGhpcy5ub2RlLndpZHRoICogYW5jaG9yLng7XG4gICAgICAgIGxldCBsZWZ0VG9wWSA9IHRoaXMubm9kZS5oZWlnaHQgKiAoMSAtIGFuY2hvci55KTtcbiAgICAgICAgbGV0IGksIGw7XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLl9sYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGF5ZXJJbmZvID0gdGhpcy5fbGF5ZXJzW2ldO1xuICAgICAgICAgICAgbGV0IGxheWVyTm9kZSA9IGxheWVySW5mby5ub2RlO1xuICAgICAgICAgICAgLy8gVGlsZWQgbGF5ZXIgc3luYyBhbmNob3IgdG8gbWFwIGJlY2F1c2UgaXQncyBvbGQgYmVoYXZpb3IsXG4gICAgICAgICAgICAvLyBkbyBub3QgY2hhbmdlIHRoZSBiZWhhdmlvciBhdm9pZCBpbmZsdWVuY2UgdXNlcidzIGV4aXN0ZWQgbG9naWMuXG4gICAgICAgICAgICBsYXllck5vZGUuc2V0QW5jaG9yUG9pbnQoYW5jaG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLl9ncm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXBJbmZvID0gdGhpcy5fZ3JvdXBzW2ldO1xuICAgICAgICAgICAgbGV0IGdyb3VwTm9kZSA9IGdyb3VwSW5mby5ub2RlO1xuICAgICAgICAgICAgLy8gR3JvdXAgbGF5ZXIgbm90IHN5bmMgYW5jaG9yIHRvIG1hcCBiZWNhdXNlIGl0J3Mgb2xkIGJlaGF2aW9yLFxuICAgICAgICAgICAgLy8gZG8gbm90IGNoYW5nZSB0aGUgYmVoYXZpb3IgYXZvaWQgaW5mbHVlbmNlIHVzZXIncyBleGlzdGluZyBsb2dpYy5cbiAgICAgICAgICAgIGdyb3VwTm9kZS5hbmNob3JYID0gMC41O1xuICAgICAgICAgICAgZ3JvdXBOb2RlLmFuY2hvclkgPSAwLjU7XG4gICAgICAgICAgICBncm91cE5vZGUueCA9IGdyb3VwSW5mby5fb2Zmc2V0LnggLSBsZWZ0VG9wWCArIGdyb3VwTm9kZS53aWR0aCAqIGdyb3VwTm9kZS5hbmNob3JYO1xuICAgICAgICAgICAgZ3JvdXBOb2RlLnkgPSBncm91cEluZm8uX29mZnNldC55ICsgbGVmdFRvcFkgLSBncm91cE5vZGUuaGVpZ2h0ICogZ3JvdXBOb2RlLmFuY2hvclk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5faW1hZ2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGltYWdlID0gdGhpcy5faW1hZ2VzW2ldO1xuICAgICAgICAgICAgaW1hZ2UuYW5jaG9yWCA9IDAuNTtcbiAgICAgICAgICAgIGltYWdlLmFuY2hvclkgPSAwLjU7XG4gICAgICAgICAgICBpbWFnZS54ID0gaW1hZ2UuX29mZnNldC54IC0gbGVmdFRvcFggKyBpbWFnZS53aWR0aCAqIGltYWdlLmFuY2hvclg7XG4gICAgICAgICAgICBpbWFnZS55ID0gaW1hZ2UuX29mZnNldC55ICsgbGVmdFRvcFkgLSBpbWFnZS5oZWlnaHQgKiBpbWFnZS5hbmNob3JZO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9maWxsQW5pR3JpZHMgKHRleEdyaWRzLCBhbmltYXRpb25zKSB7XG4gICAgICAgIGZvciAobGV0IGkgaW4gYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IGFuaW1hdGlvbnNbaV07XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbikgY29udGludWU7XG4gICAgICAgICAgICBsZXQgZnJhbWVzID0gYW5pbWF0aW9uLmZyYW1lcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyYW1lID0gZnJhbWVzW2pdO1xuICAgICAgICAgICAgICAgIGZyYW1lLmdyaWQgPSB0ZXhHcmlkc1tmcmFtZS50aWxlaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9idWlsZExheWVyQW5kR3JvdXAgKCkge1xuICAgICAgICBsZXQgdGlsZXNldHMgPSB0aGlzLl90aWxlc2V0cztcbiAgICAgICAgbGV0IHRleEdyaWRzID0gdGhpcy5fdGV4R3JpZHM7XG4gICAgICAgIGxldCBhbmltYXRpb25zID0gdGhpcy5fYW5pbWF0aW9ucztcbiAgICAgICAgdGV4R3JpZHMubGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aWxlc2V0cy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGxldCB0aWxlc2V0SW5mbyA9IHRpbGVzZXRzW2ldO1xuICAgICAgICAgICAgaWYgKCF0aWxlc2V0SW5mbykgY29udGludWU7XG4gICAgICAgICAgICBjYy5UaWxlZE1hcC5maWxsVGV4dHVyZUdyaWRzKHRpbGVzZXRJbmZvLCB0ZXhHcmlkcywgaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZmlsbEFuaUdyaWRzKHRleEdyaWRzLCBhbmltYXRpb25zKTtcblxuICAgICAgICBsZXQgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzO1xuICAgICAgICBsZXQgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuICAgICAgICBsZXQgaW1hZ2VzID0gdGhpcy5faW1hZ2VzO1xuICAgICAgICBsZXQgb2xkTm9kZU5hbWVzID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gbGF5ZXJzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgb2xkTm9kZU5hbWVzW2xheWVyc1tpXS5ub2RlLl9uYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBncm91cHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBvbGROb2RlTmFtZXNbZ3JvdXBzW2ldLm5vZGUuX25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGltYWdlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIG9sZE5vZGVOYW1lc1tpbWFnZXNbaV0uX25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuX2xheWVycyA9IFtdO1xuICAgICAgICBncm91cHMgPSB0aGlzLl9ncm91cHMgPSBbXTtcbiAgICAgICAgaW1hZ2VzID0gdGhpcy5faW1hZ2VzID0gW107XG5cbiAgICAgICAgbGV0IG1hcEluZm8gPSB0aGlzLl9tYXBJbmZvO1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZTtcbiAgICAgICAgbGV0IGxheWVySW5mb3MgPSBtYXBJbmZvLmdldEFsbENoaWxkcmVuKCk7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHRoaXMuX3RleHR1cmVzO1xuICAgICAgICBsZXQgbWF4V2lkdGggPSAwO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcblxuICAgICAgICBpZiAobGF5ZXJJbmZvcyAmJiBsYXllckluZm9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsYXllckluZm9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxheWVySW5mbyA9IGxheWVySW5mb3NbaV07XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBsYXllckluZm8ubmFtZTtcblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShuYW1lKTtcbiAgICAgICAgICAgICAgICBvbGROb2RlTmFtZXNbbmFtZV0gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICghY2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBuZXcgY2MuTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hpbGQuc2V0U2libGluZ0luZGV4KGkpO1xuICAgICAgICAgICAgICAgIGNoaWxkLmFjdGl2ZSA9IGxheWVySW5mby52aXNpYmxlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxheWVySW5mbyBpbnN0YW5jZW9mIGNjLlRNWExheWVySW5mbykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGF5ZXIgPSBjaGlsZC5nZXRDb21wb25lbnQoY2MuVGlsZWRMYXllcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyID0gY2hpbGQuYWRkQ29tcG9uZW50KGNjLlRpbGVkTGF5ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsYXllci5faW5pdChsYXllckluZm8sIG1hcEluZm8sIHRpbGVzZXRzLCB0ZXh0dXJlcywgdGV4R3JpZHMpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgdGhlIGxheWVyaW5mbyB0byByZWxlYXNlIHRoZSBvd25lcnNoaXAgb2YgdGhlIHRpbGVzIG1hcC5cbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJJbmZvLm93blRpbGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGF5ZXJJbmZvIGluc3RhbmNlb2YgY2MuVE1YT2JqZWN0R3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBncm91cCA9IGNoaWxkLmdldENvbXBvbmVudChjYy5UaWxlZE9iamVjdEdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBjaGlsZC5hZGRDb21wb25lbnQoY2MuVGlsZWRPYmplY3RHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuX2luaXQobGF5ZXJJbmZvLCBtYXBJbmZvLCB0ZXhHcmlkcyk7XG4gICAgICAgICAgICAgICAgICAgIGdyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGF5ZXJJbmZvIGluc3RhbmNlb2YgY2MuVE1YSW1hZ2VMYXllckluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHR1cmUgPSBsYXllckluZm8uc291cmNlSW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9wYWNpdHkgPSBsYXllckluZm8ub3BhY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQubGF5ZXJJbmZvID0gbGF5ZXJJbmZvO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fb2Zmc2V0ID0gY2MudjIobGF5ZXJJbmZvLm9mZnNldC54LCAtbGF5ZXJJbmZvLm9mZnNldC55KTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2UgPSBjaGlsZC5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UgPSBjaGlsZC5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNwZiA9IGltYWdlLnNwcml0ZUZyYW1lIHx8IG5ldyBjYy5TcHJpdGVGcmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICBzcGYuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc3ByaXRlRnJhbWUgPSBzcGY7XG5cbiAgICAgICAgICAgICAgICAgICAgY2hpbGQud2lkdGggPSB0ZXh0dXJlLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5oZWlnaHQgPSB0ZXh0dXJlLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1heFdpZHRoID0gTWF0aC5tYXgobWF4V2lkdGgsIGNoaWxkLndpZHRoKTtcbiAgICAgICAgICAgICAgICBtYXhIZWlnaHQgPSBNYXRoLm1heChtYXhIZWlnaHQsIGNoaWxkLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IGMgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChvbGROb2RlTmFtZXNbYy5fbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBjLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm9kZS53aWR0aCA9IG1heFdpZHRoO1xuICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xuICAgICAgICB0aGlzLl9zeW5jQW5jaG9yUG9pbnQoKTtcbiAgICB9LFxuXG4gICAgX2J1aWxkV2l0aE1hcEluZm8gKG1hcEluZm8pIHtcbiAgICAgICAgdGhpcy5fbWFwSW5mbyA9IG1hcEluZm87XG4gICAgICAgIHRoaXMuX21hcFNpemUgPSBtYXBJbmZvLmdldE1hcFNpemUoKTtcbiAgICAgICAgdGhpcy5fdGlsZVNpemUgPSBtYXBJbmZvLmdldFRpbGVTaXplKCk7XG4gICAgICAgIHRoaXMuX21hcE9yaWVudGF0aW9uID0gbWFwSW5mby5vcmllbnRhdGlvbjtcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IG1hcEluZm8ucHJvcGVydGllcztcbiAgICAgICAgdGhpcy5fdGlsZVByb3BlcnRpZXMgPSBtYXBJbmZvLmdldFRpbGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHRoaXMuX2ltYWdlTGF5ZXJzID0gbWFwSW5mby5nZXRJbWFnZUxheWVycygpO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25zID0gbWFwSW5mby5nZXRUaWxlQW5pbWF0aW9ucygpO1xuICAgICAgICB0aGlzLl90aWxlc2V0cyA9IG1hcEluZm8uZ2V0VGlsZXNldHMoKTtcblxuICAgICAgICBsZXQgdGlsZXNldHMgPSB0aGlzLl90aWxlc2V0cztcbiAgICAgICAgdGhpcy5fdGV4dHVyZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBsZXQgdG90YWxUZXh0dXJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRpbGVzZXRzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgbGV0IHRpbGVzZXRJbmZvID0gdGlsZXNldHNbaV07XG4gICAgICAgICAgICBpZiAoIXRpbGVzZXRJbmZvIHx8ICF0aWxlc2V0SW5mby5zb3VyY2VJbWFnZSkgY29udGludWU7XG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlc1tpXSA9IHRpbGVzZXRJbmZvLnNvdXJjZUltYWdlO1xuICAgICAgICAgICAgdG90YWxUZXh0dXJlcy5wdXNoKHRpbGVzZXRJbmZvLnNvdXJjZUltYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5faW1hZ2VMYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpbWFnZUxheWVyID0gdGhpcy5faW1hZ2VMYXllcnNbaV07XG4gICAgICAgICAgICBpZiAoIWltYWdlTGF5ZXIgfHwgIWltYWdlTGF5ZXIuc291cmNlSW1hZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdG90YWxUZXh0dXJlcy5wdXNoKGltYWdlTGF5ZXIuc291cmNlSW1hZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuVGlsZWRNYXAubG9hZEFsbFRleHR1cmVzICh0b3RhbFRleHR1cmVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9idWlsZExheWVyQW5kR3JvdXAoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHRoaXMuX2FuaW1hdGlvbnM7XG4gICAgICAgIGxldCB0ZXhHcmlkcyA9IHRoaXMuX3RleEdyaWRzO1xuICAgICAgICBmb3IgKGxldCBhbmlHSUQgaW4gYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IGFuaW1hdGlvbnNbYW5pR0lEXTtcbiAgICAgICAgICAgIGxldCBmcmFtZXMgPSBhbmltYXRpb24uZnJhbWVzO1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gZnJhbWVzW2FuaW1hdGlvbi5mcmFtZUlkeF07XG4gICAgICAgICAgICBhbmltYXRpb24uZHQgKz0gZHQ7XG4gICAgICAgICAgICBpZiAoZnJhbWUuZHVyYXRpb24gPCBhbmltYXRpb24uZHQpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24uZHQgPSAwO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5mcmFtZUlkeCsrO1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb24uZnJhbWVJZHggPj0gZnJhbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uZnJhbWVJZHggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcmFtZSA9IGZyYW1lc1thbmltYXRpb24uZnJhbWVJZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGV4R3JpZHNbYW5pR0lEXSA9IGZyYW1lLmdyaWQ7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmNjLlRpbGVkTWFwID0gbW9kdWxlLmV4cG9ydHMgPSBUaWxlZE1hcDtcblxuY2MuVGlsZWRNYXAubG9hZEFsbFRleHR1cmVzID0gZnVuY3Rpb24gKHRleHR1cmVzLCBsb2FkZWRDYWxsYmFjaykge1xuICAgIGxldCB0b3RhbE51bSA9IHRleHR1cmVzLmxlbmd0aDtcbiAgICBpZiAodG90YWxOdW0gPT09IDApIHtcbiAgICAgICAgbG9hZGVkQ2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjdXJOdW0gPSAwO1xuICAgIGxldCBpdGVtQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1ck51bSArKztcbiAgICAgICAgaWYgKGN1ck51bSA+PSB0b3RhbE51bSkge1xuICAgICAgICAgICAgbG9hZGVkQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsTnVtOyBpKyspIHtcbiAgICAgICAgbGV0IHRleCA9IHRleHR1cmVzW2ldO1xuICAgICAgICBpZiAoIXRleC5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRleC5vbmNlKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGl0ZW1DYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNjLlRpbGVkTWFwLmZpbGxUZXh0dXJlR3JpZHMgPSBmdW5jdGlvbiAodGlsZXNldCwgdGV4R3JpZHMsIHRleElkKSB7XG4gICAgbGV0IHRleCA9IHRpbGVzZXQuc291cmNlSW1hZ2U7XG5cbiAgICBpZiAoIXRpbGVzZXQuaW1hZ2VTaXplLndpZHRoIHx8ICF0aWxlc2V0LmltYWdlU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgdGlsZXNldC5pbWFnZVNpemUud2lkdGggPSB0ZXgud2lkdGg7XG4gICAgICAgIHRpbGVzZXQuaW1hZ2VTaXplLmhlaWdodCA9IHRleC5oZWlnaHQ7XG4gICAgfVxuXG4gICAgbGV0IHR3ID0gdGlsZXNldC5fdGlsZVNpemUud2lkdGgsXG4gICAgICAgIHRoID0gdGlsZXNldC5fdGlsZVNpemUuaGVpZ2h0LFxuICAgICAgICBpbWFnZVcgPSB0ZXgud2lkdGgsXG4gICAgICAgIGltYWdlSCA9IHRleC5oZWlnaHQsXG4gICAgICAgIHNwYWNpbmcgPSB0aWxlc2V0LnNwYWNpbmcsXG4gICAgICAgIG1hcmdpbiA9IHRpbGVzZXQubWFyZ2luLFxuXG4gICAgICAgIGNvbHMgPSBNYXRoLmZsb29yKChpbWFnZVcgLSBtYXJnaW4qMiArIHNwYWNpbmcpIC8gKHR3ICsgc3BhY2luZykpLFxuICAgICAgICByb3dzID0gTWF0aC5mbG9vcigoaW1hZ2VIIC0gbWFyZ2luKjIgKyBzcGFjaW5nKSAvICh0aCArIHNwYWNpbmcpKSxcbiAgICAgICAgY291bnQgPSByb3dzICogY29scyxcblxuICAgICAgICBnaWQgPSB0aWxlc2V0LmZpcnN0R2lkLFxuICAgICAgICBncmlkID0gbnVsbCxcbiAgICAgICAgb3ZlcnJpZGUgPSB0ZXhHcmlkc1tnaWRdID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICB0ZXhlbENvcnJlY3QgPSBjYy5tYWNyby5GSVhfQVJUSUZBQ1RTX0JZX1NUUkVDSElOR19URVhFTF9UTVggPyAwLjUgOiAwO1xuXG4gICAgLy8gVGlsZWRtYXAgbWF5IG5vdCBiZSBwYXJ0aXRpb25lZCBpbnRvIGJsb2NrcywgcmVzdWx0aW5nIGluIGEgY291bnQgdmFsdWUgb2YgMFxuICAgIGlmIChjb3VudCA8PSAwKSB7XG4gICAgICAgIGNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBsZXQgbWF4R2lkID0gdGlsZXNldC5maXJzdEdpZCArIGNvdW50O1xuICAgIGZvciAoOyBnaWQgPCBtYXhHaWQ7ICsrZ2lkKSB7XG4gICAgICAgIC8vIEF2b2lkIG92ZXJsYXBwaW5nXG4gICAgICAgIGlmIChvdmVycmlkZSAmJiAhdGV4R3JpZHNbZ2lkXSkge1xuICAgICAgICAgICAgb3ZlcnJpZGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW92ZXJyaWRlICYmIHRleEdyaWRzW2dpZF0pIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JpZCA9IHtcbiAgICAgICAgICAgIC8vIHJlY29yZCB0ZXh0dXJlIGlkXG4gICAgICAgICAgICB0ZXhJZDogdGV4SWQsIFxuICAgICAgICAgICAgLy8gcmVjb3JkIGJlbG9uZyB0byB3aGljaCB0aWxlc2V0XG4gICAgICAgICAgICB0aWxlc2V0OiB0aWxlc2V0LFxuICAgICAgICAgICAgeDogMCwgeTogMCwgd2lkdGg6IHR3LCBoZWlnaHQ6IHRoLFxuICAgICAgICAgICAgdDogMCwgbDogMCwgcjogMCwgYjogMCxcbiAgICAgICAgICAgIGdpZDogZ2lkLFxuICAgICAgICB9O1xuICAgICAgICB0aWxlc2V0LnJlY3RGb3JHSUQoZ2lkLCBncmlkKTtcbiAgICAgICAgZ3JpZC54ICs9IHRleGVsQ29ycmVjdDtcbiAgICAgICAgZ3JpZC55ICs9IHRleGVsQ29ycmVjdDtcbiAgICAgICAgZ3JpZC53aWR0aCAtPSB0ZXhlbENvcnJlY3QqMjtcbiAgICAgICAgZ3JpZC5oZWlnaHQgLT0gdGV4ZWxDb3JyZWN0KjI7XG4gICAgICAgIGdyaWQudCA9IChncmlkLnkpIC8gaW1hZ2VIO1xuICAgICAgICBncmlkLmwgPSAoZ3JpZC54KSAvIGltYWdlVztcbiAgICAgICAgZ3JpZC5yID0gKGdyaWQueCArIGdyaWQud2lkdGgpIC8gaW1hZ2VXO1xuICAgICAgICBncmlkLmIgPSAoZ3JpZC55ICsgZ3JpZC5oZWlnaHQpIC8gaW1hZ2VIO1xuICAgICAgICB0ZXhHcmlkc1tnaWRdID0gZ3JpZDtcbiAgICB9XG59O1xuXG5jYy5qcy5vYnNvbGV0ZShjYy5UaWxlZE1hcC5wcm90b3R5cGUsICdjYy5UaWxlZE1hcC50bXhGaWxlJywgJ3RteEFzc2V0JywgdHJ1ZSk7XG5jYy5qcy5nZXQoY2MuVGlsZWRNYXAucHJvdG90eXBlLCAnbWFwTG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgIGNjLmVycm9ySUQoNzIwMyk7XG4gICAgcmV0dXJuIFtdO1xufSwgZmFsc2UpO1xuIl19