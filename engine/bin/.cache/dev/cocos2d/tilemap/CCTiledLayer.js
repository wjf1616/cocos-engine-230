
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledLayer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _valueTypes = require("../core/value-types");

var _materialVariant = _interopRequireDefault(require("../core/assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var RenderComponent = require('../core/components/CCRenderComponent');

var Material = require('../core/assets/material/CCMaterial');

var RenderFlow = require('../core/renderer/render-flow');

var _mat4_temp = cc.mat4();

var _vec2_temp = cc.v2();

var _vec2_temp2 = cc.v2();

var _tempRowCol = {
  row: 0,
  col: 0
};
var TiledUserNodeData = cc.Class({
  name: 'cc.TiledUserNodeData',
  "extends": cc.Component,
  ctor: function ctor() {
    this._index = -1;
    this._row = -1;
    this._col = -1;
    this._tiledLayer = null;
  }
});
/**
 * !#en Render the TMX layer.
 * !#zh 渲染 TMX layer。
 * @class TiledLayer
 * @extends Component
 */

var TiledLayer = cc.Class({
  name: 'cc.TiledLayer',
  // Inherits from the abstract class directly,
  // because TiledLayer not create or maintains the sgNode by itself.
  "extends": RenderComponent,
  editor: {
    inspector: 'packages://inspector/inspectors/comps/tiled-layer.js'
  },
  ctor: function ctor() {
    this._userNodeGrid = {}; // [row][col] = {count: 0, nodesList: []};

    this._userNodeMap = {}; // [id] = node;

    this._userNodeDirty = false; // store the layer tiles node, index is caculated by 'x + width * y', format likes '[0]=tileNode0,[1]=tileNode1, ...'

    this._tiledTiles = []; // store the layer tilesets index array

    this._tilesetIndexArr = []; // texture id to material index

    this._texIdToMatIndex = {};
    this._viewPort = {
      x: -1,
      y: -1,
      width: -1,
      height: -1
    };
    this._cullingRect = {
      leftDown: {
        row: -1,
        col: -1
      },
      rightTop: {
        row: -1,
        col: -1
      }
    };
    this._cullingDirty = true;
    this._rightTop = {
      row: -1,
      col: -1
    };
    this._layerInfo = null;
    this._mapInfo = null; // record max or min tile texture offset, 
    // it will make culling rect more large, which insure culling rect correct.

    this._topOffset = 0;
    this._downOffset = 0;
    this._leftOffset = 0;
    this._rightOffset = 0; // store the layer tiles, index is caculated by 'x + width * y', format likes '[0]=gid0,[1]=gid1, ...'

    this._tiles = []; // vertex array

    this._vertices = []; // vertices dirty

    this._verticesDirty = true;
    this._layerName = '';
    this._layerOrientation = null; // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'

    this._texGrids = null; // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'

    this._textures = null;
    this._tilesets = null;
    this._leftDownToCenterX = 0;
    this._leftDownToCenterY = 0;
    this._hasTiledNodeGrid = false;
    this._hasAniGrid = false;
    this._animations = null; // switch of culling

    this._enableCulling = cc.macro.ENABLE_TILEDMAP_CULLING;
  },
  _hasTiledNode: function _hasTiledNode() {
    return this._hasTiledNodeGrid;
  },
  _hasAnimation: function _hasAnimation() {
    return this._hasAniGrid;
  },

  /**
   * !#en enable or disable culling
   * !#zh 开启或关闭裁剪。
   * @method enableCulling
   * @param value
   */
  enableCulling: function enableCulling(value) {
    if (this._enableCulling != value) {
      this._enableCulling = value;
      this._cullingDirty = true;
    }
  },

  /**
   * !#en Adds user's node into layer.
   * !#zh 添加用户节点。
   * @method addUserNode
   * @param {cc.Node} node
   * @return {Boolean}
   */
  addUserNode: function addUserNode(node) {
    var dataComp = node.getComponent(TiledUserNodeData);

    if (dataComp) {
      cc.warn("CCTiledLayer:addUserNode node has been added");
      return false;
    }

    dataComp = node.addComponent(TiledUserNodeData);
    node.parent = this.node;
    node._renderFlag |= RenderFlow.FLAG_BREAK_FLOW;
    this._userNodeMap[node._id] = dataComp;
    dataComp._row = -1;
    dataComp._col = -1;
    dataComp._tiledLayer = this;

    this._nodeLocalPosToLayerPos(node, _vec2_temp);

    this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);

    this._addUserNodeToGrid(dataComp, _tempRowCol);

    this._updateCullingOffsetByUserNode(node);

    node.on(cc.Node.EventType.POSITION_CHANGED, this._userNodePosChange, dataComp);
    node.on(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);
    return true;
  },

  /**
   * !#en Removes user's node.
   * !#zh 移除用户节点。
   * @method removeUserNode
   * @param {cc.Node} node
   * @return {Boolean}
   */
  removeUserNode: function removeUserNode(node) {
    var dataComp = node.getComponent(TiledUserNodeData);

    if (!dataComp) {
      cc.warn("CCTiledLayer:removeUserNode node is not exist");
      return false;
    }

    node.off(cc.Node.EventType.POSITION_CHANGED, this._userNodePosChange, dataComp);
    node.off(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);

    this._removeUserNodeFromGrid(dataComp);

    delete this._userNodeMap[node._id];

    node._removeComponent(dataComp);

    dataComp.destroy();
    node.removeFromParent(true);
    node._renderFlag &= ~RenderFlow.FLAG_BREAK_FLOW;
    return true;
  },

  /**
   * !#en Destroy user's node.
   * !#zh 销毁用户节点。
   * @method destroyUserNode
   * @param {cc.Node} node
   */
  destroyUserNode: function destroyUserNode(node) {
    this.removeUserNode(node);
    node.destroy();
  },
  // acording layer anchor point to calculate node layer pos
  _nodeLocalPosToLayerPos: function _nodeLocalPosToLayerPos(nodePos, out) {
    out.x = nodePos.x + this._leftDownToCenterX;
    out.y = nodePos.y + this._leftDownToCenterY;
  },
  _getNodesByRowCol: function _getNodesByRowCol(row, col) {
    var rowData = this._userNodeGrid[row];
    if (!rowData) return null;
    return rowData[col];
  },
  _getNodesCountByRow: function _getNodesCountByRow(row) {
    var rowData = this._userNodeGrid[row];
    if (!rowData) return 0;
    return rowData.count;
  },
  _updateAllUserNode: function _updateAllUserNode() {
    this._userNodeGrid = {};

    for (var dataId in this._userNodeMap) {
      var dataComp = this._userNodeMap[dataId];

      this._nodeLocalPosToLayerPos(dataComp.node, _vec2_temp);

      this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);

      this._addUserNodeToGrid(dataComp, _tempRowCol);

      this._updateCullingOffsetByUserNode(dataComp.node);
    }
  },
  _updateCullingOffsetByUserNode: function _updateCullingOffsetByUserNode(node) {
    if (this._topOffset < node.height) {
      this._topOffset = node.height;
    }

    if (this._downOffset < node.height) {
      this._downOffset = node.height;
    }

    if (this._leftOffset < node.width) {
      this._leftOffset = node.width;
    }

    if (this._rightOffset < node.width) {
      this._rightOffset = node.width;
    }
  },
  _userNodeSizeChange: function _userNodeSizeChange() {
    var dataComp = this;
    var node = dataComp.node;
    var self = dataComp._tiledLayer;

    self._updateCullingOffsetByUserNode(node);
  },
  _userNodePosChange: function _userNodePosChange() {
    var dataComp = this;
    var node = dataComp.node;
    var self = dataComp._tiledLayer;

    self._nodeLocalPosToLayerPos(node, _vec2_temp);

    self._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol); // users pos not change


    if (_tempRowCol.row === dataComp._row && _tempRowCol.col === dataComp._col) return;

    self._removeUserNodeFromGrid(dataComp);

    self._addUserNodeToGrid(dataComp, _tempRowCol);
  },
  _removeUserNodeFromGrid: function _removeUserNodeFromGrid(dataComp) {
    var row = dataComp._row;
    var col = dataComp._col;
    var index = dataComp._index;
    var rowData = this._userNodeGrid[row];
    var colData = rowData && rowData[col];

    if (colData) {
      rowData.count--;
      colData.count--;
      colData.list[index] = null;

      if (colData.count <= 0) {
        colData.list.length = 0;
        colData.count = 0;
      }
    }

    dataComp._row = -1;
    dataComp._col = -1;
    dataComp._index = -1;
    this._userNodeDirty = true;
  },
  _isInLayer: function _isInLayer(row, col) {
    return row >= 0 && col >= 0 && row <= this._rightTop.row && col <= this._rightTop.col;
  },
  _addUserNodeToGrid: function _addUserNodeToGrid(dataComp, tempRowCol) {
    var row = tempRowCol.row;
    var col = tempRowCol.col;

    if (this._isInLayer(row, col)) {
      var rowData = this._userNodeGrid[row] = this._userNodeGrid[row] || {
        count: 0
      };
      var colData = rowData[col] = rowData[col] || {
        count: 0,
        list: []
      };
      dataComp._row = row;
      dataComp._col = col;
      dataComp._index = colData.list.length;
      rowData.count++;
      colData.count++;
      colData.list.push(dataComp);
    } else {
      dataComp._row = -1;
      dataComp._col = -1;
      dataComp._index = -1;
    }

    this._userNodeDirty = true;
  },
  _isUserNodeDirty: function _isUserNodeDirty() {
    return this._userNodeDirty;
  },
  _setUserNodeDirty: function _setUserNodeDirty(value) {
    this._userNodeDirty = value;
  },
  onEnable: function onEnable() {
    this._super();

    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);

    this._activateMaterial();
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
  },
  _syncAnchorPoint: function _syncAnchorPoint() {
    var node = this.node;
    this._leftDownToCenterX = node.width * node.anchorX * node.scaleX;
    this._leftDownToCenterY = node.height * node.anchorY * node.scaleY;
    this._cullingDirty = true;
  },
  onDestroy: function onDestroy() {
    this._super();

    if (this._buffer) {
      this._buffer.destroy();

      this._buffer = null;
    }

    this._renderDataList = null;
  },

  /**
   * !#en Gets the layer name.
   * !#zh 获取层的名称。
   * @method getLayerName
   * @return {String}
   * @example
   * let layerName = tiledLayer.getLayerName();
   * cc.log(layerName);
   */
  getLayerName: function getLayerName() {
    return this._layerName;
  },

  /**
   * !#en Set the layer name.
   * !#zh 设置层的名称
   * @method SetLayerName
   * @param {String} layerName
   * @example
   * tiledLayer.setLayerName("New Layer");
   */
  setLayerName: function setLayerName(layerName) {
    this._layerName = layerName;
  },

  /**
   * !#en Return the value for the specific property name.
   * !#zh 获取指定属性名的值。
   * @method getProperty
   * @param {String} propertyName
   * @return {*}
   * @example
   * let property = tiledLayer.getProperty("info");
   * cc.log(property);
   */
  getProperty: function getProperty(propertyName) {
    return this._properties[propertyName];
  },

  /**
   * !#en Returns the position in pixels of a given tile coordinate.
   * !#zh 获取指定 tile 的像素坐标。
   * @method getPositionAt
   * @param {Vec2|Number} pos position or x
   * @param {Number} [y]
   * @return {Vec2}
   * @example
   * let pos = tiledLayer.getPositionAt(cc.v2(0, 0));
   * cc.log("Pos: " + pos);
   * let pos = tiledLayer.getPositionAt(0, 0);
   * cc.log("Pos: " + pos);
   */
  getPositionAt: function getPositionAt(pos, y) {
    var x;

    if (y !== undefined) {
      x = Math.floor(pos);
      y = Math.floor(y);
    } else {
      x = Math.floor(pos.x);
      y = Math.floor(pos.y);
    }

    var ret;

    switch (this._layerOrientation) {
      case cc.TiledMap.Orientation.ORTHO:
        ret = this._positionForOrthoAt(x, y);
        break;

      case cc.TiledMap.Orientation.ISO:
        ret = this._positionForIsoAt(x, y);
        break;

      case cc.TiledMap.Orientation.HEX:
        ret = this._positionForHexAt(x, y);
        break;
    }

    return ret;
  },
  _isInvalidPosition: function _isInvalidPosition(x, y) {
    if (x && typeof x === 'object') {
      var pos = x;
      y = pos.y;
      x = pos.x;
    }

    return x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0;
  },
  _positionForIsoAt: function _positionForIsoAt(x, y) {
    var offsetX = 0,
        offsetY = 0;

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    var gid = this._tiles[index];

    if (gid) {
      var tileset = this._texGrids[gid].tileset;
      var offset = tileset.tileOffset;
      offsetX = offset.x;
      offsetY = offset.y;
    }

    return cc.v2(this._mapTileSize.width * 0.5 * (this._layerSize.height + x - y - 1) + offsetX, this._mapTileSize.height * 0.5 * (this._layerSize.width - x + this._layerSize.height - y - 2) - offsetY);
  },
  _positionForOrthoAt: function _positionForOrthoAt(x, y) {
    var offsetX = 0,
        offsetY = 0;

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    var gid = this._tiles[index];

    if (gid) {
      var tileset = this._texGrids[gid].tileset;
      var offset = tileset.tileOffset;
      offsetX = offset.x;
      offsetY = offset.y;
    }

    return cc.v2(x * this._mapTileSize.width + offsetX, (this._layerSize.height - y - 1) * this._mapTileSize.height - offsetY);
  },
  _positionForHexAt: function _positionForHexAt(col, row) {
    var tileWidth = this._mapTileSize.width;
    var tileHeight = this._mapTileSize.height;
    var rows = this._layerSize.height;

    var index = Math.floor(col) + Math.floor(row) * this._layerSize.width;

    var gid = this._tiles[index];
    var tileset = this._texGrids[gid].tileset;
    var offset = tileset.tileOffset;
    var odd_even = this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD ? 1 : -1;
    var x = 0,
        y = 0;
    var diffX = 0;
    var diffY = 0;

    switch (this._staggerAxis) {
      case cc.TiledMap.StaggerAxis.STAGGERAXIS_Y:
        diffX = 0;

        if (row % 2 === 1) {
          diffX = tileWidth / 2 * odd_even;
        }

        x = col * tileWidth + diffX + offset.x;
        y = (rows - row - 1) * (tileHeight - (tileHeight - this._hexSideLength) / 2) - offset.y;
        break;

      case cc.TiledMap.StaggerAxis.STAGGERAXIS_X:
        diffY = 0;

        if (col % 2 === 1) {
          diffY = tileHeight / 2 * -odd_even;
        }

        x = col * (tileWidth - (tileWidth - this._hexSideLength) / 2) + offset.x;
        y = (rows - row - 1) * tileHeight + diffY - offset.y;
        break;
    }

    return cc.v2(x, y);
  },

  /**
   * !#en
   * Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
   * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
   * If a tile is already placed at that position, then it will be removed.
   * !#zh
   * 设置给定坐标的 tile 的 gid (gid = tile 全局 id)，
   * tile 的 GID 可以使用方法 “tileGIDAt” 来获得。<br />
   * 如果一个 tile 已经放在那个位置，那么它将被删除。
   * @method setTileGIDAt
   * @param {Number} gid
   * @param {Vec2|Number} posOrX position or x
   * @param {Number} flagsOrY flags or y
   * @param {Number} [flags]
   * @example
   * tiledLayer.setTileGIDAt(1001, 10, 10, 1)
   */
  setTileGIDAt: function setTileGIDAt(gid, posOrX, flagsOrY, flags) {
    if (posOrX === undefined) {
      throw new Error("cc.TiledLayer.setTileGIDAt(): pos should be non-null");
    }

    var pos;

    if (flags !== undefined || !(posOrX instanceof cc.Vec2)) {
      // four parameters or posOrX is not a Vec2 object
      pos = cc.v2(posOrX, flagsOrY);
    } else {
      pos = posOrX;
      flags = flagsOrY;
    }

    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);

    if (this._isInvalidPosition(pos)) {
      throw new Error("cc.TiledLayer.setTileGIDAt(): invalid position");
    }

    if (!this._tiles || !this._tilesets || this._tilesets.length == 0) {
      cc.logID(7238);
      return;
    }

    if (gid !== 0 && gid < this._tilesets[0].firstGid) {
      cc.logID(7239, gid);
      return;
    }

    flags = flags || 0;
    var currentFlags = this.getTileFlagsAt(pos);
    var currentGID = this.getTileGIDAt(pos);
    if (currentGID === gid && currentFlags === flags) return;
    var gidAndFlags = (gid | flags) >>> 0;

    this._updateTileForGID(gidAndFlags, pos);
  },
  _updateTileForGID: function _updateTileForGID(gid, pos) {
    if (gid !== 0 && !this._texGrids[gid]) {
      return;
    }

    var idx = 0 | pos.x + pos.y * this._layerSize.width;

    if (idx < this._tiles.length) {
      this._tiles[idx] = gid;
      this._cullingDirty = true;
    }
  },

  /**
   * !#en
   * Returns the tile gid at a given tile coordinate. <br />
   * if it returns 0, it means that the tile is empty. <br />
   * !#zh
   * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
   * 如果它返回 0，则表示该 tile 为空。<br />
   * @method getTileGIDAt
   * @param {Vec2|Number} pos or x
   * @param {Number} [y]
   * @return {Number}
   * @example
   * let tileGid = tiledLayer.getTileGIDAt(0, 0);
   */
  getTileGIDAt: function getTileGIDAt(pos, y) {
    if (pos === undefined) {
      throw new Error("cc.TiledLayer.getTileGIDAt(): pos should be non-null");
    }

    var x = pos;

    if (y === undefined) {
      x = pos.x;
      y = pos.y;
    }

    if (this._isInvalidPosition(x, y)) {
      throw new Error("cc.TiledLayer.getTileGIDAt(): invalid position");
    }

    if (!this._tiles) {
      cc.logID(7237);
      return null;
    }

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width; // Bits on the far end of the 32-bit global tile ID are used for tile flags


    var tile = this._tiles[index];
    return (tile & cc.TiledMap.TileFlag.FLIPPED_MASK) >>> 0;
  },
  getTileFlagsAt: function getTileFlagsAt(pos, y) {
    if (!pos) {
      throw new Error("TiledLayer.getTileFlagsAt: pos should be non-null");
    }

    if (y !== undefined) {
      pos = cc.v2(pos, y);
    }

    if (this._isInvalidPosition(pos)) {
      throw new Error("TiledLayer.getTileFlagsAt: invalid position");
    }

    if (!this._tiles) {
      cc.logID(7240);
      return null;
    }

    var idx = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize.width; // Bits on the far end of the 32-bit global tile ID are used for tile flags


    var tile = this._tiles[idx];
    return (tile & cc.TiledMap.TileFlag.FLIPPED_ALL) >>> 0;
  },
  _setCullingDirty: function _setCullingDirty(value) {
    this._cullingDirty = value;
  },
  _isCullingDirty: function _isCullingDirty() {
    return this._cullingDirty;
  },
  // 'x, y' is the position of viewPort, which's anchor point is at the center of rect.
  // 'width, height' is the size of viewPort.
  _updateViewPort: function _updateViewPort(x, y, width, height) {
    if (this._viewPort.width === width && this._viewPort.height === height && this._viewPort.x === x && this._viewPort.y === y) {
      return;
    }

    this._viewPort.x = x;
    this._viewPort.y = y;
    this._viewPort.width = width;
    this._viewPort.height = height; // if map's type is iso, reserve bottom line is 2 to avoid show empty grid because of iso grid arithmetic

    var reserveLine = 1;

    if (this._layerOrientation === cc.TiledMap.Orientation.ISO) {
      reserveLine = 2;
    }

    var vpx = this._viewPort.x - this._offset.x + this._leftDownToCenterX;
    var vpy = this._viewPort.y - this._offset.y + this._leftDownToCenterY;
    var leftDownX = vpx - this._leftOffset;
    var leftDownY = vpy - this._downOffset;
    var rightTopX = vpx + width + this._rightOffset;
    var rightTopY = vpy + height + this._topOffset;
    var leftDown = this._cullingRect.leftDown;
    var rightTop = this._cullingRect.rightTop;
    if (leftDownX < 0) leftDownX = 0;
    if (leftDownY < 0) leftDownY = 0; // calc left down

    this._positionToRowCol(leftDownX, leftDownY, _tempRowCol); // make range large


    _tempRowCol.row -= reserveLine;
    _tempRowCol.col -= reserveLine; // insure left down row col greater than 0

    _tempRowCol.row = _tempRowCol.row > 0 ? _tempRowCol.row : 0;
    _tempRowCol.col = _tempRowCol.col > 0 ? _tempRowCol.col : 0;

    if (_tempRowCol.row !== leftDown.row || _tempRowCol.col !== leftDown.col) {
      leftDown.row = _tempRowCol.row;
      leftDown.col = _tempRowCol.col;
      this._cullingDirty = true;
    } // show nothing


    if (rightTopX < 0 || rightTopY < 0) {
      _tempRowCol.row = -1;
      _tempRowCol.col = -1;
    } else {
      // calc right top
      this._positionToRowCol(rightTopX, rightTopY, _tempRowCol); // make range large


      _tempRowCol.row++;
      _tempRowCol.col++;
    } // avoid range out of max rect


    if (_tempRowCol.row > this._rightTop.row) _tempRowCol.row = this._rightTop.row;
    if (_tempRowCol.col > this._rightTop.col) _tempRowCol.col = this._rightTop.col;

    if (_tempRowCol.row !== rightTop.row || _tempRowCol.col !== rightTop.col) {
      rightTop.row = _tempRowCol.row;
      rightTop.col = _tempRowCol.col;
      this._cullingDirty = true;
    }
  },
  // the result may not precise, but it dose't matter, it just uses to be got range
  _positionToRowCol: function _positionToRowCol(x, y, result) {
    var TiledMap = cc.TiledMap;
    var Orientation = TiledMap.Orientation;
    var StaggerAxis = TiledMap.StaggerAxis;
    var maptw = this._mapTileSize.width,
        mapth = this._mapTileSize.height,
        maptw2 = maptw * 0.5,
        mapth2 = mapth * 0.5;
    var row = 0,
        col = 0,
        diffX2 = 0,
        diffY2 = 0,
        axis = this._staggerAxis;
    var cols = this._layerSize.width;

    switch (this._layerOrientation) {
      // left top to right dowm
      case Orientation.ORTHO:
        col = Math.floor(x / maptw);
        row = Math.floor(y / mapth);
        break;
      // right top to left down
      // iso can be treat as special hex whose hex side length is 0

      case Orientation.ISO:
        col = Math.floor(x / maptw2);
        row = Math.floor(y / mapth2);
        break;
      // left top to right dowm

      case Orientation.HEX:
        if (axis === StaggerAxis.STAGGERAXIS_Y) {
          row = Math.floor(y / (mapth - this._diffY1));
          diffX2 = row % 2 === 1 ? maptw2 * this._odd_even : 0;
          col = Math.floor((x - diffX2) / maptw);
        } else {
          col = Math.floor(x / (maptw - this._diffX1));
          diffY2 = col % 2 === 1 ? mapth2 * -this._odd_even : 0;
          row = Math.floor((y - diffY2) / mapth);
        }

        break;
    }

    result.row = row;
    result.col = col;
    return result;
  },
  _updateCulling: function _updateCulling() {
    if (CC_EDITOR) {
      this.enableCulling(false);
    } else if (this._enableCulling) {
      this.node._updateWorldMatrix();

      _valueTypes.Mat4.invert(_mat4_temp, this.node._worldMatrix);

      var rect = cc.visibleRect;
      var camera = cc.Camera.findCamera(this.node);

      if (camera) {
        _vec2_temp.x = 0;
        _vec2_temp.y = 0;
        _vec2_temp2.x = _vec2_temp.x + rect.width;
        _vec2_temp2.y = _vec2_temp.y + rect.height;
        camera.getScreenToWorldPoint(_vec2_temp, _vec2_temp);
        camera.getScreenToWorldPoint(_vec2_temp2, _vec2_temp2);

        _valueTypes.Vec2.transformMat4(_vec2_temp, _vec2_temp, _mat4_temp);

        _valueTypes.Vec2.transformMat4(_vec2_temp2, _vec2_temp2, _mat4_temp);

        this._updateViewPort(_vec2_temp.x, _vec2_temp.y, _vec2_temp2.x - _vec2_temp.x, _vec2_temp2.y - _vec2_temp.y);
      }
    }
  },

  /**
   * !#en Layer orientation, which is the same as the map orientation.
   * !#zh 获取 Layer 方向(同地图方向)。
   * @method getLayerOrientation
   * @return {Number}
   * @example
   * let orientation = tiledLayer.getLayerOrientation();
   * cc.log("Layer Orientation: " + orientation);
   */
  getLayerOrientation: function getLayerOrientation() {
    return this._layerOrientation;
  },

  /**
   * !#en properties from the layer. They can be added using Tiled.
   * !#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
   * @method getProperties
   * @return {Array}
   * @example
   * let properties = tiledLayer.getProperties();
   * cc.log("Properties: " + properties);
   */
  getProperties: function getProperties() {
    return this._properties;
  },
  _updateVertices: function _updateVertices() {
    var TiledMap = cc.TiledMap;
    var TileFlag = TiledMap.TileFlag;
    var FLIPPED_MASK = TileFlag.FLIPPED_MASK;
    var StaggerAxis = TiledMap.StaggerAxis;
    var Orientation = TiledMap.Orientation;
    var vertices = this._vertices;
    vertices.length = 0;
    var layerOrientation = this._layerOrientation,
        tiles = this._tiles;

    if (!tiles) {
      return;
    }

    var rightTop = this._rightTop;
    rightTop.row = -1;
    rightTop.col = -1;
    var maptw = this._mapTileSize.width,
        mapth = this._mapTileSize.height,
        maptw2 = maptw * 0.5,
        mapth2 = mapth * 0.5,
        rows = this._layerSize.height,
        cols = this._layerSize.width,
        grids = this._texGrids;
    var colOffset = 0,
        gid,
        grid,
        left,
        bottom,
        axis,
        diffX1,
        diffY1,
        odd_even,
        diffX2,
        diffY2;

    if (layerOrientation === Orientation.HEX) {
      axis = this._staggerAxis;
      diffX1 = this._diffX1;
      diffY1 = this._diffY1;
      odd_even = this._odd_even;
    }

    var cullingCol = 0,
        cullingRow = 0;
    var tileOffset = null,
        gridGID = 0;
    this._topOffset = 0;
    this._downOffset = 0;
    this._leftOffset = 0;
    this._rightOffset = 0;
    this._hasAniGrid = false; // grid border

    var topBorder = 0,
        downBorder = 0,
        leftBorder = 0,
        rightBorder = 0;

    for (var row = 0; row < rows; ++row) {
      for (var col = 0; col < cols; ++col) {
        var index = colOffset + col;
        gid = tiles[index];
        gridGID = (gid & FLIPPED_MASK) >>> 0;
        grid = grids[gridGID]; // if has animation, grid must be updated per frame

        if (this._animations[gridGID]) {
          this._hasAniGrid = true;
        }

        if (!grid) {
          continue;
        }

        switch (layerOrientation) {
          // left top to right dowm
          case Orientation.ORTHO:
            cullingCol = col;
            cullingRow = rows - row - 1;
            left = cullingCol * maptw;
            bottom = cullingRow * mapth;
            break;
          // right top to left down

          case Orientation.ISO:
            // if not consider about col, then left is 'w/2 * (rows - row - 1)'
            // if consider about col then left must add 'w/2 * col'
            // so left is 'w/2 * (rows - row - 1) + w/2 * col'
            // combine expression is 'w/2 * (rows - row + col -1)'
            cullingCol = rows + col - row - 1; // if not consider about row, then bottom is 'h/2 * (cols - col -1)'
            // if consider about row then bottom must add 'h/2 * (rows - row - 1)'
            // so bottom is 'h/2 * (cols - col -1) + h/2 * (rows - row - 1)'
            // combine expressionn is 'h/2 * (rows + cols - col - row - 2)'

            cullingRow = rows + cols - col - row - 2;
            left = maptw2 * cullingCol;
            bottom = mapth2 * cullingRow;
            break;
          // left top to right dowm

          case Orientation.HEX:
            diffX2 = axis === StaggerAxis.STAGGERAXIS_Y && row % 2 === 1 ? maptw2 * odd_even : 0;
            diffY2 = axis === StaggerAxis.STAGGERAXIS_X && col % 2 === 1 ? mapth2 * -odd_even : 0;
            left = col * (maptw - diffX1) + diffX2;
            bottom = (rows - row - 1) * (mapth - diffY1) + diffY2;
            cullingCol = col;
            cullingRow = rows - row - 1;
            break;
        }

        var rowData = vertices[cullingRow] = vertices[cullingRow] || {
          minCol: 0,
          maxCol: 0
        };
        var colData = rowData[cullingCol] = rowData[cullingCol] || {}; // record each row range, it will faster when culling grid

        if (rowData.minCol > cullingCol) {
          rowData.minCol = cullingCol;
        }

        if (rowData.maxCol < cullingCol) {
          rowData.maxCol = cullingCol;
        } // record max rect, when viewPort is bigger than layer, can make it smaller


        if (rightTop.row < cullingRow) {
          rightTop.row = cullingRow;
        }

        if (rightTop.col < cullingCol) {
          rightTop.col = cullingCol;
        } // _offset is whole layer offset
        // tileOffset is tileset offset which is related to each grid
        // tileOffset coordinate system's y axis is opposite with engine's y axis.


        tileOffset = grid.tileset.tileOffset;
        left += this._offset.x + tileOffset.x;
        bottom += this._offset.y - tileOffset.y;
        topBorder = -tileOffset.y + grid.tileset._tileSize.height - mapth;
        topBorder = topBorder < 0 ? 0 : topBorder;
        downBorder = tileOffset.y < 0 ? 0 : tileOffset.y;
        leftBorder = -tileOffset.x < 0 ? 0 : -tileOffset.x;
        rightBorder = tileOffset.x + grid.tileset._tileSize.width - maptw;
        rightBorder = rightBorder < 0 ? 0 : rightBorder;

        if (this._rightOffset < leftBorder) {
          this._rightOffset = leftBorder;
        }

        if (this._leftOffset < rightBorder) {
          this._leftOffset = rightBorder;
        }

        if (this._topOffset < downBorder) {
          this._topOffset = downBorder;
        }

        if (this._downOffset < topBorder) {
          this._downOffset = topBorder;
        }

        colData.left = left;
        colData.bottom = bottom; // this index is tiledmap grid index

        colData.index = index;
      }

      colOffset += cols;
    }

    this._verticesDirty = false;
  },

  /**
   * !#en
   * Get the TiledTile with the tile coordinate.<br/>
   * If there is no tile in the specified coordinate and forceCreate parameter is true, <br/>
   * then will create a new TiledTile at the coordinate.
   * The renderer will render the tile with the rotation, scale, position and color property of the TiledTile.
   * !#zh
   * 通过指定的 tile 坐标获取对应的 TiledTile。 <br/>
   * 如果指定的坐标没有 tile，并且设置了 forceCreate 那么将会在指定的坐标创建一个新的 TiledTile 。<br/>
   * 在渲染这个 tile 的时候，将会使用 TiledTile 的节点的旋转、缩放、位移、颜色属性。<br/>
   * @method getTiledTileAt
   * @param {Integer} x
   * @param {Integer} y
   * @param {Boolean} forceCreate
   * @return {cc.TiledTile}
   * @example
   * let tile = tiledLayer.getTiledTileAt(100, 100, true);
   * cc.log(tile);
   */
  getTiledTileAt: function getTiledTileAt(x, y, forceCreate) {
    if (this._isInvalidPosition(x, y)) {
      throw new Error("TiledLayer.getTiledTileAt: invalid position");
    }

    if (!this._tiles) {
      cc.logID(7236);
      return null;
    }

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    var tile = this._tiledTiles[index];

    if (!tile && forceCreate) {
      var node = new cc.Node();
      tile = node.addComponent(cc.TiledTile);
      tile._x = x;
      tile._y = y;
      tile._layer = this;

      tile._updateInfo();

      node.parent = this.node;
      return tile;
    }

    return tile;
  },

  /** 
   * !#en
   * Change tile to TiledTile at the specified coordinate.
   * !#zh
   * 将指定的 tile 坐标替换为指定的 TiledTile。
   * @method setTiledTileAt
   * @param {Integer} x
   * @param {Integer} y
   * @param {cc.TiledTile} tiledTile
   * @return {cc.TiledTile}
   */
  setTiledTileAt: function setTiledTileAt(x, y, tiledTile) {
    if (this._isInvalidPosition(x, y)) {
      throw new Error("TiledLayer.setTiledTileAt: invalid position");
    }

    if (!this._tiles) {
      cc.logID(7236);
      return null;
    }

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    this._tiledTiles[index] = tiledTile;
    this._cullingDirty = true;

    if (tiledTile) {
      this._hasTiledNodeGrid = true;
    } else {
      this._hasTiledNodeGrid = this._tiledTiles.some(function (tiledNode, index) {
        return !!tiledNode;
      });
    }

    return tiledTile;
  },

  /**
   * !#en Return texture.
   * !#zh 获取纹理。
   * @method getTexture
   * @param index The index of textures
   * @return {Texture2D}
   */
  getTexture: function getTexture(index) {
    index = index || 0;

    if (this._textures && index >= 0 && this._textures.length > index) {
      return this._textures[index];
    }

    return null;
  },

  /**
   * !#en Return texture.
   * !#zh 获取纹理。
   * @method getTextures
   * @return {Texture2D}
   */
  getTextures: function getTextures() {
    return this._textures;
  },

  /**
   * !#en Set the texture.
   * !#zh 设置纹理。
   * @method setTexture
   * @param {Texture2D} texture
   */
  setTexture: function setTexture(texture) {
    this.setTextures([texture]);
  },

  /**
   * !#en Set the texture.
   * !#zh 设置纹理。
   * @method setTexture
   * @param {Texture2D} textures
   */
  setTextures: function setTextures(textures) {
    this._textures = textures;

    this._activateMaterial();
  },

  /**
   * !#en Gets layer size.
   * !#zh 获得层大小。
   * @method getLayerSize
   * @return {Size}
   * @example
   * let size = tiledLayer.getLayerSize();
   * cc.log("layer size: " + size);
   */
  getLayerSize: function getLayerSize() {
    return this._layerSize;
  },

  /**
   * !#en Size of the map's tile (could be different from the tile's size).
   * !#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
   * @method getMapTileSize
   * @return {Size}
   * @example
   * let mapTileSize = tiledLayer.getMapTileSize();
   * cc.log("MapTile size: " + mapTileSize);
   */
  getMapTileSize: function getMapTileSize() {
    return this._mapTileSize;
  },

  /**
   * !#en Gets Tile set first information for the layer.
   * !#zh 获取 layer 索引位置为0的 Tileset 信息。
   * @method getTileSet
   * @param index The index of tilesets
   * @return {TMXTilesetInfo}
   */
  getTileSet: function getTileSet(index) {
    index = index || 0;

    if (this._tilesets && index >= 0 && this._tilesets.length > index) {
      return this._tilesets[index];
    }

    return null;
  },

  /**
   * !#en Gets tile set all information for the layer.
   * !#zh 获取 layer 所有的 Tileset 信息。
   * @method getTileSet
   * @return {TMXTilesetInfo}
   */
  getTileSets: function getTileSets() {
    return this._tilesets;
  },

  /**
   * !#en Sets tile set information for the layer.
   * !#zh 设置 layer 的 tileset 信息。
   * @method setTileSet
   * @param {TMXTilesetInfo} tileset
   */
  setTileSet: function setTileSet(tileset) {
    this.setTileSets([tileset]);
  },

  /**
   * !#en Sets Tile set information for the layer.
   * !#zh 设置 layer 的 Tileset 信息。
   * @method setTileSets
   * @param {TMXTilesetInfo} tilesets
   */
  setTileSets: function setTileSets(tilesets) {
    this._tilesets = tilesets;
    var textures = this._textures = [];
    var texGrids = this._texGrids = [];

    for (var i = 0; i < tilesets.length; i++) {
      var tileset = tilesets[i];

      if (tileset) {
        textures[i] = tileset.sourceImage;
      }
    }

    cc.TiledMap.loadAllTextures(textures, function () {
      for (var _i = 0, l = tilesets.length; _i < l; ++_i) {
        var tilesetInfo = tilesets[_i];
        if (!tilesetInfo) continue;
        cc.TiledMap.fillTextureGrids(tilesetInfo, texGrids, _i);
      }

      this._prepareToRender();
    }.bind(this));
  },
  _traverseAllGrid: function _traverseAllGrid() {
    var tiles = this._tiles;
    var texGrids = this._texGrids;
    var tilesetIndexArr = this._tilesetIndexArr;
    var tilesetIdxMap = {};
    var TiledMap = cc.TiledMap;
    var TileFlag = TiledMap.TileFlag;
    var FLIPPED_MASK = TileFlag.FLIPPED_MASK;
    tilesetIndexArr.length = 0;

    for (var i = 0; i < tiles.length; i++) {
      var gid = tiles[i];
      if (gid === 0) continue;
      gid = (gid & FLIPPED_MASK) >>> 0;
      var grid = texGrids[gid];

      if (!grid) {
        cc.error("CCTiledLayer:_traverseAllGrid grid is null, gid is:", gid);
        continue;
      }

      var tilesetIdx = grid.texId;
      if (tilesetIdxMap[tilesetIdx]) continue;
      tilesetIdxMap[tilesetIdx] = true;
      tilesetIndexArr.push(tilesetIdx);
    }
  },
  _init: function _init(layerInfo, mapInfo, tilesets, textures, texGrids) {
    this._cullingDirty = true;
    this._layerInfo = layerInfo;
    this._mapInfo = mapInfo;
    var size = layerInfo._layerSize; // layerInfo

    this._layerName = layerInfo.name;
    this._tiles = layerInfo._tiles;
    this._properties = layerInfo.properties;
    this._layerSize = size;
    this._minGID = layerInfo._minGID;
    this._maxGID = layerInfo._maxGID;
    this._opacity = layerInfo._opacity;
    this._renderOrder = mapInfo.renderOrder;
    this._staggerAxis = mapInfo.getStaggerAxis();
    this._staggerIndex = mapInfo.getStaggerIndex();
    this._hexSideLength = mapInfo.getHexSideLength();
    this._animations = mapInfo.getTileAnimations(); // tilesets

    this._tilesets = tilesets; // textures

    this._textures = textures; // grid texture

    this._texGrids = texGrids; // mapInfo

    this._layerOrientation = mapInfo.orientation;
    this._mapTileSize = mapInfo.getTileSize();
    var maptw = this._mapTileSize.width;
    var mapth = this._mapTileSize.height;
    var layerW = this._layerSize.width;
    var layerH = this._layerSize.height;

    if (this._layerOrientation === cc.TiledMap.Orientation.HEX) {
      // handle hex map
      var TiledMap = cc.TiledMap;
      var StaggerAxis = TiledMap.StaggerAxis;
      var StaggerIndex = TiledMap.StaggerIndex;
      var width = 0,
          height = 0;
      this._odd_even = this._staggerIndex === StaggerIndex.STAGGERINDEX_ODD ? 1 : -1;

      if (this._staggerAxis === StaggerAxis.STAGGERAXIS_X) {
        this._diffX1 = (maptw - this._hexSideLength) / 2;
        this._diffY1 = 0;
        height = mapth * (layerH + 0.5);
        width = (maptw + this._hexSideLength) * Math.floor(layerW / 2) + maptw * (layerW % 2);
      } else {
        this._diffX1 = 0;
        this._diffY1 = (mapth - this._hexSideLength) / 2;
        width = maptw * (layerW + 0.5);
        height = (mapth + this._hexSideLength) * Math.floor(layerH / 2) + mapth * (layerH % 2);
      }

      this.node.setContentSize(width, height);
    } else if (this._layerOrientation === cc.TiledMap.Orientation.ISO) {
      var wh = layerW + layerH;
      this.node.setContentSize(maptw * 0.5 * wh, mapth * 0.5 * wh);
    } else {
      this.node.setContentSize(layerW * maptw, layerH * mapth);
    } // offset (after layer orientation is set);


    this._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);
    this._useAutomaticVertexZ = false;
    this._vertexZvalue = 0;

    this._syncAnchorPoint();

    this._prepareToRender();
  },
  _prepareToRender: function _prepareToRender() {
    this._updateVertices();

    this._traverseAllGrid();

    this._updateAllUserNode();

    this._activateMaterial();
  },
  _activateMaterial: function _activateMaterial() {
    var tilesetIndexArr = this._tilesetIndexArr;

    if (tilesetIndexArr.length === 0) {
      this.disableRender();
      return;
    }

    var texIdMatIdx = this._texIdToMatIndex = {};
    var textures = this._textures;
    var matLen = tilesetIndexArr.length;

    for (var i = 0; i < matLen; i++) {
      var tilesetIdx = tilesetIndexArr[i];
      var texture = textures[tilesetIdx];
      var material = this._materials[i];

      if (!material) {
        material = Material.getBuiltinMaterial('2d-sprite');
      }

      material = _materialVariant["default"].create(material, this);
      material.define('CC_USE_MODEL', true);
      material.setProperty('texture', texture);
      this._materials[i] = material;
      texIdMatIdx[tilesetIdx] = i;
    }

    this._materials.length = matLen;
    this.markForRender(true);
  }
});
cc.TiledLayer = module.exports = TiledLayer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVGlsZWRMYXllci5qcyJdLCJuYW1lcyI6WyJSZW5kZXJDb21wb25lbnQiLCJyZXF1aXJlIiwiTWF0ZXJpYWwiLCJSZW5kZXJGbG93IiwiX21hdDRfdGVtcCIsImNjIiwibWF0NCIsIl92ZWMyX3RlbXAiLCJ2MiIsIl92ZWMyX3RlbXAyIiwiX3RlbXBSb3dDb2wiLCJyb3ciLCJjb2wiLCJUaWxlZFVzZXJOb2RlRGF0YSIsIkNsYXNzIiwibmFtZSIsIkNvbXBvbmVudCIsImN0b3IiLCJfaW5kZXgiLCJfcm93IiwiX2NvbCIsIl90aWxlZExheWVyIiwiVGlsZWRMYXllciIsImVkaXRvciIsImluc3BlY3RvciIsIl91c2VyTm9kZUdyaWQiLCJfdXNlck5vZGVNYXAiLCJfdXNlck5vZGVEaXJ0eSIsIl90aWxlZFRpbGVzIiwiX3RpbGVzZXRJbmRleEFyciIsIl90ZXhJZFRvTWF0SW5kZXgiLCJfdmlld1BvcnQiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0IiwiX2N1bGxpbmdSZWN0IiwibGVmdERvd24iLCJyaWdodFRvcCIsIl9jdWxsaW5nRGlydHkiLCJfcmlnaHRUb3AiLCJfbGF5ZXJJbmZvIiwiX21hcEluZm8iLCJfdG9wT2Zmc2V0IiwiX2Rvd25PZmZzZXQiLCJfbGVmdE9mZnNldCIsIl9yaWdodE9mZnNldCIsIl90aWxlcyIsIl92ZXJ0aWNlcyIsIl92ZXJ0aWNlc0RpcnR5IiwiX2xheWVyTmFtZSIsIl9sYXllck9yaWVudGF0aW9uIiwiX3RleEdyaWRzIiwiX3RleHR1cmVzIiwiX3RpbGVzZXRzIiwiX2xlZnREb3duVG9DZW50ZXJYIiwiX2xlZnREb3duVG9DZW50ZXJZIiwiX2hhc1RpbGVkTm9kZUdyaWQiLCJfaGFzQW5pR3JpZCIsIl9hbmltYXRpb25zIiwiX2VuYWJsZUN1bGxpbmciLCJtYWNybyIsIkVOQUJMRV9USUxFRE1BUF9DVUxMSU5HIiwiX2hhc1RpbGVkTm9kZSIsIl9oYXNBbmltYXRpb24iLCJlbmFibGVDdWxsaW5nIiwidmFsdWUiLCJhZGRVc2VyTm9kZSIsIm5vZGUiLCJkYXRhQ29tcCIsImdldENvbXBvbmVudCIsIndhcm4iLCJhZGRDb21wb25lbnQiLCJwYXJlbnQiLCJfcmVuZGVyRmxhZyIsIkZMQUdfQlJFQUtfRkxPVyIsIl9pZCIsIl9ub2RlTG9jYWxQb3NUb0xheWVyUG9zIiwiX3Bvc2l0aW9uVG9Sb3dDb2wiLCJfYWRkVXNlck5vZGVUb0dyaWQiLCJfdXBkYXRlQ3VsbGluZ09mZnNldEJ5VXNlck5vZGUiLCJvbiIsIk5vZGUiLCJFdmVudFR5cGUiLCJQT1NJVElPTl9DSEFOR0VEIiwiX3VzZXJOb2RlUG9zQ2hhbmdlIiwiU0laRV9DSEFOR0VEIiwiX3VzZXJOb2RlU2l6ZUNoYW5nZSIsInJlbW92ZVVzZXJOb2RlIiwib2ZmIiwiX3JlbW92ZVVzZXJOb2RlRnJvbUdyaWQiLCJfcmVtb3ZlQ29tcG9uZW50IiwiZGVzdHJveSIsInJlbW92ZUZyb21QYXJlbnQiLCJkZXN0cm95VXNlck5vZGUiLCJub2RlUG9zIiwib3V0IiwiX2dldE5vZGVzQnlSb3dDb2wiLCJyb3dEYXRhIiwiX2dldE5vZGVzQ291bnRCeVJvdyIsImNvdW50IiwiX3VwZGF0ZUFsbFVzZXJOb2RlIiwiZGF0YUlkIiwic2VsZiIsImluZGV4IiwiY29sRGF0YSIsImxpc3QiLCJsZW5ndGgiLCJfaXNJbkxheWVyIiwidGVtcFJvd0NvbCIsInB1c2giLCJfaXNVc2VyTm9kZURpcnR5IiwiX3NldFVzZXJOb2RlRGlydHkiLCJvbkVuYWJsZSIsIl9zdXBlciIsIkFOQ0hPUl9DSEFOR0VEIiwiX3N5bmNBbmNob3JQb2ludCIsIl9hY3RpdmF0ZU1hdGVyaWFsIiwib25EaXNhYmxlIiwiYW5jaG9yWCIsInNjYWxlWCIsImFuY2hvclkiLCJzY2FsZVkiLCJvbkRlc3Ryb3kiLCJfYnVmZmVyIiwiX3JlbmRlckRhdGFMaXN0IiwiZ2V0TGF5ZXJOYW1lIiwic2V0TGF5ZXJOYW1lIiwibGF5ZXJOYW1lIiwiZ2V0UHJvcGVydHkiLCJwcm9wZXJ0eU5hbWUiLCJfcHJvcGVydGllcyIsImdldFBvc2l0aW9uQXQiLCJwb3MiLCJ1bmRlZmluZWQiLCJNYXRoIiwiZmxvb3IiLCJyZXQiLCJUaWxlZE1hcCIsIk9yaWVudGF0aW9uIiwiT1JUSE8iLCJfcG9zaXRpb25Gb3JPcnRob0F0IiwiSVNPIiwiX3Bvc2l0aW9uRm9ySXNvQXQiLCJIRVgiLCJfcG9zaXRpb25Gb3JIZXhBdCIsIl9pc0ludmFsaWRQb3NpdGlvbiIsIl9sYXllclNpemUiLCJvZmZzZXRYIiwib2Zmc2V0WSIsImdpZCIsInRpbGVzZXQiLCJvZmZzZXQiLCJ0aWxlT2Zmc2V0IiwiX21hcFRpbGVTaXplIiwidGlsZVdpZHRoIiwidGlsZUhlaWdodCIsInJvd3MiLCJvZGRfZXZlbiIsIl9zdGFnZ2VySW5kZXgiLCJTdGFnZ2VySW5kZXgiLCJTVEFHR0VSSU5ERVhfT0REIiwiZGlmZlgiLCJkaWZmWSIsIl9zdGFnZ2VyQXhpcyIsIlN0YWdnZXJBeGlzIiwiU1RBR0dFUkFYSVNfWSIsIl9oZXhTaWRlTGVuZ3RoIiwiU1RBR0dFUkFYSVNfWCIsInNldFRpbGVHSURBdCIsInBvc09yWCIsImZsYWdzT3JZIiwiZmxhZ3MiLCJFcnJvciIsIlZlYzIiLCJsb2dJRCIsImZpcnN0R2lkIiwiY3VycmVudEZsYWdzIiwiZ2V0VGlsZUZsYWdzQXQiLCJjdXJyZW50R0lEIiwiZ2V0VGlsZUdJREF0IiwiZ2lkQW5kRmxhZ3MiLCJfdXBkYXRlVGlsZUZvckdJRCIsImlkeCIsInRpbGUiLCJUaWxlRmxhZyIsIkZMSVBQRURfTUFTSyIsIkZMSVBQRURfQUxMIiwiX3NldEN1bGxpbmdEaXJ0eSIsIl9pc0N1bGxpbmdEaXJ0eSIsIl91cGRhdGVWaWV3UG9ydCIsInJlc2VydmVMaW5lIiwidnB4IiwiX29mZnNldCIsInZweSIsImxlZnREb3duWCIsImxlZnREb3duWSIsInJpZ2h0VG9wWCIsInJpZ2h0VG9wWSIsInJlc3VsdCIsIm1hcHR3IiwibWFwdGgiLCJtYXB0dzIiLCJtYXB0aDIiLCJkaWZmWDIiLCJkaWZmWTIiLCJheGlzIiwiY29scyIsIl9kaWZmWTEiLCJfb2RkX2V2ZW4iLCJfZGlmZlgxIiwiX3VwZGF0ZUN1bGxpbmciLCJDQ19FRElUT1IiLCJfdXBkYXRlV29ybGRNYXRyaXgiLCJNYXQ0IiwiaW52ZXJ0IiwiX3dvcmxkTWF0cml4IiwicmVjdCIsInZpc2libGVSZWN0IiwiY2FtZXJhIiwiQ2FtZXJhIiwiZmluZENhbWVyYSIsImdldFNjcmVlblRvV29ybGRQb2ludCIsInRyYW5zZm9ybU1hdDQiLCJnZXRMYXllck9yaWVudGF0aW9uIiwiZ2V0UHJvcGVydGllcyIsIl91cGRhdGVWZXJ0aWNlcyIsInZlcnRpY2VzIiwibGF5ZXJPcmllbnRhdGlvbiIsInRpbGVzIiwiZ3JpZHMiLCJjb2xPZmZzZXQiLCJncmlkIiwibGVmdCIsImJvdHRvbSIsImRpZmZYMSIsImRpZmZZMSIsImN1bGxpbmdDb2wiLCJjdWxsaW5nUm93IiwiZ3JpZEdJRCIsInRvcEJvcmRlciIsImRvd25Cb3JkZXIiLCJsZWZ0Qm9yZGVyIiwicmlnaHRCb3JkZXIiLCJtaW5Db2wiLCJtYXhDb2wiLCJfdGlsZVNpemUiLCJnZXRUaWxlZFRpbGVBdCIsImZvcmNlQ3JlYXRlIiwiVGlsZWRUaWxlIiwiX3giLCJfeSIsIl9sYXllciIsIl91cGRhdGVJbmZvIiwic2V0VGlsZWRUaWxlQXQiLCJ0aWxlZFRpbGUiLCJzb21lIiwidGlsZWROb2RlIiwiZ2V0VGV4dHVyZSIsImdldFRleHR1cmVzIiwic2V0VGV4dHVyZSIsInRleHR1cmUiLCJzZXRUZXh0dXJlcyIsInRleHR1cmVzIiwiZ2V0TGF5ZXJTaXplIiwiZ2V0TWFwVGlsZVNpemUiLCJnZXRUaWxlU2V0IiwiZ2V0VGlsZVNldHMiLCJzZXRUaWxlU2V0Iiwic2V0VGlsZVNldHMiLCJ0aWxlc2V0cyIsInRleEdyaWRzIiwiaSIsInNvdXJjZUltYWdlIiwibG9hZEFsbFRleHR1cmVzIiwibCIsInRpbGVzZXRJbmZvIiwiZmlsbFRleHR1cmVHcmlkcyIsIl9wcmVwYXJlVG9SZW5kZXIiLCJiaW5kIiwiX3RyYXZlcnNlQWxsR3JpZCIsInRpbGVzZXRJbmRleEFyciIsInRpbGVzZXRJZHhNYXAiLCJlcnJvciIsInRpbGVzZXRJZHgiLCJ0ZXhJZCIsIl9pbml0IiwibGF5ZXJJbmZvIiwibWFwSW5mbyIsInNpemUiLCJwcm9wZXJ0aWVzIiwiX21pbkdJRCIsIl9tYXhHSUQiLCJfb3BhY2l0eSIsIl9yZW5kZXJPcmRlciIsInJlbmRlck9yZGVyIiwiZ2V0U3RhZ2dlckF4aXMiLCJnZXRTdGFnZ2VySW5kZXgiLCJnZXRIZXhTaWRlTGVuZ3RoIiwiZ2V0VGlsZUFuaW1hdGlvbnMiLCJvcmllbnRhdGlvbiIsImdldFRpbGVTaXplIiwibGF5ZXJXIiwibGF5ZXJIIiwic2V0Q29udGVudFNpemUiLCJ3aCIsIl91c2VBdXRvbWF0aWNWZXJ0ZXhaIiwiX3ZlcnRleFp2YWx1ZSIsImRpc2FibGVSZW5kZXIiLCJ0ZXhJZE1hdElkeCIsIm1hdExlbiIsIm1hdGVyaWFsIiwiX21hdGVyaWFscyIsImdldEJ1aWx0aW5NYXRlcmlhbCIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZSIsImRlZmluZSIsInNldFByb3BlcnR5IiwibWFya0ZvclJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUE2QkE7O0FBQ0E7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsc0NBQUQsQ0FBL0I7O0FBQ0EsSUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsb0NBQUQsQ0FBeEI7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMsOEJBQUQsQ0FBMUI7O0FBSUEsSUFBSUcsVUFBVSxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBakI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHRixFQUFFLENBQUNHLEVBQUgsRUFBakI7O0FBQ0EsSUFBSUMsV0FBVyxHQUFHSixFQUFFLENBQUNHLEVBQUgsRUFBbEI7O0FBQ0EsSUFBSUUsV0FBVyxHQUFHO0FBQUNDLEVBQUFBLEdBQUcs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QUFBLFFBQVEsR0FBR0csNEJBQWdCQyxNQUFoQixDQUF1QkosUUFBdkIsRUFBaUMsSUFBakMsQ0FBWDtBQUVBQSxNQUFBQSxRQUFRLENBQUNLLE1BQVQsQ0FBZ0IsY0FBaEIsRUFBZ0MsSUFBaEM7QUFDQUwsTUFBQUEsUUFBUSxDQUFDTSxXQUFULENBQXFCLFNBQXJCLEVBQWdDeEQsT0FBaEM7QUFFQSxXQUFLbUQsVUFBTCxDQUFnQnhDLENBQWhCLElBQXFCdUMsUUFBckI7QUFFQUYsTUFBQUEsV0FBVyxDQUFDekIsVUFBRCxDQUFYLEdBQTBCWixDQUExQjtBQUNIOztBQUNELFNBQUt3QyxVQUFMLENBQWdCN00sTUFBaEIsR0FBeUIyTSxNQUF6QjtBQUNBLFNBQUtRLGFBQUwsQ0FBbUIsSUFBbkI7QUFDSDtBQXB2Q3FCLENBQVQsQ0FBakI7QUF1dkNBelQsRUFBRSxDQUFDaUIsVUFBSCxHQUFnQnlTLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjFTLFVBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29yZS9jb21wb25lbnRzL0NDUmVuZGVyQ29tcG9uZW50Jyk7XG5jb25zdCBNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL2NvcmUvYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5cbmltcG9ydCB7IE1hdDQsIFZlYzIgfSBmcm9tICcuLi9jb3JlL3ZhbHVlLXR5cGVzJztcbmltcG9ydCBNYXRlcmlhbFZhcmlhbnQgZnJvbSAnLi4vY29yZS9hc3NldHMvbWF0ZXJpYWwvbWF0ZXJpYWwtdmFyaWFudCc7XG5sZXQgX21hdDRfdGVtcCA9IGNjLm1hdDQoKTtcbmxldCBfdmVjMl90ZW1wID0gY2MudjIoKTtcbmxldCBfdmVjMl90ZW1wMiA9IGNjLnYyKCk7XG5sZXQgX3RlbXBSb3dDb2wgPSB7cm93OjAsIGNvbDowfTtcblxubGV0IFRpbGVkVXNlck5vZGVEYXRhID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5UaWxlZFVzZXJOb2RlRGF0YScsXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2luZGV4ID0gLTE7XG4gICAgICAgIHRoaXMuX3JvdyA9IC0xO1xuICAgICAgICB0aGlzLl9jb2wgPSAtMTtcbiAgICAgICAgdGhpcy5fdGlsZWRMYXllciA9IG51bGw7XG4gICAgfVxuXG59KTtcblxuLyoqXG4gKiAhI2VuIFJlbmRlciB0aGUgVE1YIGxheWVyLlxuICogISN6aCDmuLLmn5MgVE1YIGxheWVy44CCXG4gKiBAY2xhc3MgVGlsZWRMYXllclxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBUaWxlZExheWVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5UaWxlZExheWVyJyxcblxuICAgIC8vIEluaGVyaXRzIGZyb20gdGhlIGFic3RyYWN0IGNsYXNzIGRpcmVjdGx5LFxuICAgIC8vIGJlY2F1c2UgVGlsZWRMYXllciBub3QgY3JlYXRlIG9yIG1haW50YWlucyB0aGUgc2dOb2RlIGJ5IGl0c2VsZi5cbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG5cbiAgICBlZGl0b3I6IHtcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy90aWxlZC1sYXllci5qcycsXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl91c2VyTm9kZUdyaWQgPSB7fTsvLyBbcm93XVtjb2xdID0ge2NvdW50OiAwLCBub2Rlc0xpc3Q6IFtdfTtcbiAgICAgICAgdGhpcy5fdXNlck5vZGVNYXAgPSB7fTsvLyBbaWRdID0gbm9kZTtcbiAgICAgICAgdGhpcy5fdXNlck5vZGVEaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBsYXllciB0aWxlcyBub2RlLCBpbmRleCBpcyBjYWN1bGF0ZWQgYnkgJ3ggKyB3aWR0aCAqIHknLCBmb3JtYXQgbGlrZXMgJ1swXT10aWxlTm9kZTAsWzFdPXRpbGVOb2RlMSwgLi4uJ1xuICAgICAgICB0aGlzLl90aWxlZFRpbGVzID0gW107XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIGxheWVyIHRpbGVzZXRzIGluZGV4IGFycmF5XG4gICAgICAgIHRoaXMuX3RpbGVzZXRJbmRleEFyciA9IFtdO1xuICAgICAgICAvLyB0ZXh0dXJlIGlkIHRvIG1hdGVyaWFsIGluZGV4XG4gICAgICAgIHRoaXMuX3RleElkVG9NYXRJbmRleCA9IHt9O1xuXG4gICAgICAgIHRoaXMuX3ZpZXdQb3J0ID0ge3g6LTEsIHk6LTEsIHdpZHRoOi0xLCBoZWlnaHQ6LTF9O1xuICAgICAgICB0aGlzLl9jdWxsaW5nUmVjdCA9IHtcbiAgICAgICAgICAgIGxlZnREb3duOntyb3c6LTEsIGNvbDotMX0sXG4gICAgICAgICAgICByaWdodFRvcDp7cm93Oi0xLCBjb2w6LTF9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3JpZ2h0VG9wID0ge3JvdzotMSwgY29sOi0xfTtcblxuICAgICAgICB0aGlzLl9sYXllckluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9tYXBJbmZvID0gbnVsbDtcblxuICAgICAgICAvLyByZWNvcmQgbWF4IG9yIG1pbiB0aWxlIHRleHR1cmUgb2Zmc2V0LCBcbiAgICAgICAgLy8gaXQgd2lsbCBtYWtlIGN1bGxpbmcgcmVjdCBtb3JlIGxhcmdlLCB3aGljaCBpbnN1cmUgY3VsbGluZyByZWN0IGNvcnJlY3QuXG4gICAgICAgIHRoaXMuX3RvcE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuX2Rvd25PZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLl9sZWZ0T2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5fcmlnaHRPZmZzZXQgPSAwO1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBsYXllciB0aWxlcywgaW5kZXggaXMgY2FjdWxhdGVkIGJ5ICd4ICsgd2lkdGggKiB5JywgZm9ybWF0IGxpa2VzICdbMF09Z2lkMCxbMV09Z2lkMSwgLi4uJ1xuICAgICAgICB0aGlzLl90aWxlcyA9IFtdO1xuICAgICAgICAvLyB2ZXJ0ZXggYXJyYXlcbiAgICAgICAgdGhpcy5fdmVydGljZXMgPSBbXTtcbiAgICAgICAgLy8gdmVydGljZXMgZGlydHlcbiAgICAgICAgdGhpcy5fdmVydGljZXNEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fbGF5ZXJOYW1lID0gJyc7XG4gICAgICAgIHRoaXMuX2xheWVyT3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgICAgIC8vIHN0b3JlIGFsbCBsYXllciBnaWQgY29ycmVzcG9uZGluZyB0ZXh0dXJlIGluZm8sIGluZGV4IGlzIGdpZCwgZm9ybWF0IGxpa2VzICdbZ2lkMF09dGV4LWluZm8sW2dpZDFdPXRleC1pbmZvLCAuLi4nXG4gICAgICAgIHRoaXMuX3RleEdyaWRzID0gbnVsbDtcbiAgICAgICAgLy8gc3RvcmUgYWxsIHRpbGVzZXQgdGV4dHVyZSwgaW5kZXggaXMgdGlsZXNldCBpbmRleCwgZm9ybWF0IGxpa2VzICdbMF09dGV4dHVyZTAsIFsxXT10ZXh0dXJlMSwgLi4uJ1xuICAgICAgICB0aGlzLl90ZXh0dXJlcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RpbGVzZXRzID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWCA9IDA7XG4gICAgICAgIHRoaXMuX2xlZnREb3duVG9DZW50ZXJZID0gMDtcblxuICAgICAgICB0aGlzLl9oYXNUaWxlZE5vZGVHcmlkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2hhc0FuaUdyaWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9ucyA9IG51bGw7XG5cbiAgICAgICAgLy8gc3dpdGNoIG9mIGN1bGxpbmdcbiAgICAgICAgdGhpcy5fZW5hYmxlQ3VsbGluZyA9IGNjLm1hY3JvLkVOQUJMRV9USUxFRE1BUF9DVUxMSU5HO1xuICAgIH0sXG5cbiAgICBfaGFzVGlsZWROb2RlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1RpbGVkTm9kZUdyaWQ7XG4gICAgfSxcblxuICAgIF9oYXNBbmltYXRpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzQW5pR3JpZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBlbmFibGUgb3IgZGlzYWJsZSBjdWxsaW5nXG4gICAgICogISN6aCDlvIDlkK/miJblhbPpl63oo4HliarjgIJcbiAgICAgKiBAbWV0aG9kIGVuYWJsZUN1bGxpbmdcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBlbmFibGVDdWxsaW5nICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fZW5hYmxlQ3VsbGluZyAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlQ3VsbGluZyA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFkZHMgdXNlcidzIG5vZGUgaW50byBsYXllci5cbiAgICAgKiAhI3poIOa3u+WKoOeUqOaIt+iKgueCueOAglxuICAgICAqIEBtZXRob2QgYWRkVXNlck5vZGVcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IG5vZGVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGFkZFVzZXJOb2RlIChub2RlKSB7XG4gICAgICAgIGxldCBkYXRhQ29tcCA9IG5vZGUuZ2V0Q29tcG9uZW50KFRpbGVkVXNlck5vZGVEYXRhKTtcbiAgICAgICAgaWYgKGRhdGFDb21wKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiQ0NUaWxlZExheWVyOmFkZFVzZXJOb2RlIG5vZGUgaGFzIGJlZW4gYWRkZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhQ29tcCA9IG5vZGUuYWRkQ29tcG9uZW50KFRpbGVkVXNlck5vZGVEYXRhKTtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgIG5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX0JSRUFLX0ZMT1c7XG4gICAgICAgIHRoaXMuX3VzZXJOb2RlTWFwW25vZGUuX2lkXSA9IGRhdGFDb21wO1xuXG4gICAgICAgIGRhdGFDb21wLl9yb3cgPSAtMTtcbiAgICAgICAgZGF0YUNvbXAuX2NvbCA9IC0xO1xuICAgICAgICBkYXRhQ29tcC5fdGlsZWRMYXllciA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9ub2RlTG9jYWxQb3NUb0xheWVyUG9zKG5vZGUsIF92ZWMyX3RlbXApO1xuICAgICAgICB0aGlzLl9wb3NpdGlvblRvUm93Q29sKF92ZWMyX3RlbXAueCwgX3ZlYzJfdGVtcC55LCBfdGVtcFJvd0NvbCk7XG4gICAgICAgIHRoaXMuX2FkZFVzZXJOb2RlVG9HcmlkKGRhdGFDb21wLCBfdGVtcFJvd0NvbCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUN1bGxpbmdPZmZzZXRCeVVzZXJOb2RlKG5vZGUpO1xuICAgICAgICBub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX3VzZXJOb2RlUG9zQ2hhbmdlLCBkYXRhQ29tcCk7XG4gICAgICAgIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl91c2VyTm9kZVNpemVDaGFuZ2UsIGRhdGFDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyB1c2VyJ3Mgbm9kZS5cbiAgICAgKiAhI3poIOenu+mZpOeUqOaIt+iKgueCueOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlVXNlck5vZGVcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IG5vZGVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHJlbW92ZVVzZXJOb2RlIChub2RlKSB7XG4gICAgICAgIGxldCBkYXRhQ29tcCA9IG5vZGUuZ2V0Q29tcG9uZW50KFRpbGVkVXNlck5vZGVEYXRhKTtcbiAgICAgICAgaWYgKCFkYXRhQ29tcCkge1xuICAgICAgICAgICAgY2Mud2FybihcIkNDVGlsZWRMYXllcjpyZW1vdmVVc2VyTm9kZSBub2RlIGlzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VELCB0aGlzLl91c2VyTm9kZVBvc0NoYW5nZSwgZGF0YUNvbXApO1xuICAgICAgICBub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3VzZXJOb2RlU2l6ZUNoYW5nZSwgZGF0YUNvbXApO1xuICAgICAgICB0aGlzLl9yZW1vdmVVc2VyTm9kZUZyb21HcmlkKGRhdGFDb21wKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJOb2RlTWFwW25vZGUuX2lkXTtcbiAgICAgICAgbm9kZS5fcmVtb3ZlQ29tcG9uZW50KGRhdGFDb21wKTtcbiAgICAgICAgZGF0YUNvbXAuZGVzdHJveSgpO1xuICAgICAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQodHJ1ZSk7XG4gICAgICAgIG5vZGUuX3JlbmRlckZsYWcgJj0gflJlbmRlckZsb3cuRkxBR19CUkVBS19GTE9XO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBEZXN0cm95IHVzZXIncyBub2RlLlxuICAgICAqICEjemgg6ZSA5q+B55So5oi36IqC54K544CCXG4gICAgICogQG1ldGhvZCBkZXN0cm95VXNlck5vZGVcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IG5vZGVcbiAgICAgKi9cbiAgICBkZXN0cm95VXNlck5vZGUgKG5vZGUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVVc2VyTm9kZShub2RlKTtcbiAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIC8vIGFjb3JkaW5nIGxheWVyIGFuY2hvciBwb2ludCB0byBjYWxjdWxhdGUgbm9kZSBsYXllciBwb3NcbiAgICBfbm9kZUxvY2FsUG9zVG9MYXllclBvcyAobm9kZVBvcywgb3V0KSB7XG4gICAgICAgIG91dC54ID0gbm9kZVBvcy54ICsgdGhpcy5fbGVmdERvd25Ub0NlbnRlclg7XG4gICAgICAgIG91dC55ID0gbm9kZVBvcy55ICsgdGhpcy5fbGVmdERvd25Ub0NlbnRlclk7XG4gICAgfSxcblxuICAgIF9nZXROb2Rlc0J5Um93Q29sIChyb3csIGNvbCkge1xuICAgICAgICBsZXQgcm93RGF0YSA9IHRoaXMuX3VzZXJOb2RlR3JpZFtyb3ddO1xuICAgICAgICBpZiAoIXJvd0RhdGEpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gcm93RGF0YVtjb2xdO1xuICAgIH0sXG5cbiAgICBfZ2V0Tm9kZXNDb3VudEJ5Um93IChyb3cpIHtcbiAgICAgICAgbGV0IHJvd0RhdGEgPSB0aGlzLl91c2VyTm9kZUdyaWRbcm93XTtcbiAgICAgICAgaWYgKCFyb3dEYXRhKSByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHJvd0RhdGEuY291bnQ7XG4gICAgfSxcblxuICAgIF91cGRhdGVBbGxVc2VyTm9kZSAoKSB7XG4gICAgICAgIHRoaXMuX3VzZXJOb2RlR3JpZCA9IHt9O1xuICAgICAgICBmb3IgKGxldCBkYXRhSWQgaW4gdGhpcy5fdXNlck5vZGVNYXApIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tcCA9IHRoaXMuX3VzZXJOb2RlTWFwW2RhdGFJZF07XG4gICAgICAgICAgICB0aGlzLl9ub2RlTG9jYWxQb3NUb0xheWVyUG9zKGRhdGFDb21wLm5vZGUsIF92ZWMyX3RlbXApO1xuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25Ub1Jvd0NvbChfdmVjMl90ZW1wLngsIF92ZWMyX3RlbXAueSwgX3RlbXBSb3dDb2wpO1xuICAgICAgICAgICAgdGhpcy5fYWRkVXNlck5vZGVUb0dyaWQoZGF0YUNvbXAsIF90ZW1wUm93Q29sKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUN1bGxpbmdPZmZzZXRCeVVzZXJOb2RlKGRhdGFDb21wLm5vZGUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVDdWxsaW5nT2Zmc2V0QnlVc2VyTm9kZSAobm9kZSkge1xuICAgICAgICBpZiAodGhpcy5fdG9wT2Zmc2V0IDwgbm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvcE9mZnNldCA9IG5vZGUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9kb3duT2Zmc2V0IDwgbm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rvd25PZmZzZXQgPSBub2RlLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbGVmdE9mZnNldCA8IG5vZGUud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZnRPZmZzZXQgPSBub2RlLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9yaWdodE9mZnNldCA8IG5vZGUud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0T2Zmc2V0ID0gbm9kZS53aWR0aDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXNlck5vZGVTaXplQ2hhbmdlICgpIHtcbiAgICAgICAgbGV0IGRhdGFDb21wID0gdGhpcztcbiAgICAgICAgbGV0IG5vZGUgPSBkYXRhQ29tcC5ub2RlO1xuICAgICAgICBsZXQgc2VsZiA9IGRhdGFDb21wLl90aWxlZExheWVyO1xuICAgICAgICBzZWxmLl91cGRhdGVDdWxsaW5nT2Zmc2V0QnlVc2VyTm9kZShub2RlKTtcbiAgICB9LFxuXG4gICAgX3VzZXJOb2RlUG9zQ2hhbmdlICgpIHtcbiAgICAgICAgbGV0IGRhdGFDb21wID0gdGhpcztcbiAgICAgICAgbGV0IG5vZGUgPSBkYXRhQ29tcC5ub2RlO1xuICAgICAgICBsZXQgc2VsZiA9IGRhdGFDb21wLl90aWxlZExheWVyO1xuICAgICAgICBzZWxmLl9ub2RlTG9jYWxQb3NUb0xheWVyUG9zKG5vZGUsIF92ZWMyX3RlbXApO1xuICAgICAgICBzZWxmLl9wb3NpdGlvblRvUm93Q29sKF92ZWMyX3RlbXAueCwgX3ZlYzJfdGVtcC55LCBfdGVtcFJvd0NvbCk7XG4gICAgICAgIC8vIHVzZXJzIHBvcyBub3QgY2hhbmdlXG4gICAgICAgIGlmIChfdGVtcFJvd0NvbC5yb3cgPT09IGRhdGFDb21wLl9yb3cgJiYgX3RlbXBSb3dDb2wuY29sID09PSBkYXRhQ29tcC5fY29sKSByZXR1cm47XG5cbiAgICAgICAgc2VsZi5fcmVtb3ZlVXNlck5vZGVGcm9tR3JpZChkYXRhQ29tcCk7XG4gICAgICAgIHNlbGYuX2FkZFVzZXJOb2RlVG9HcmlkKGRhdGFDb21wLCBfdGVtcFJvd0NvbCk7XG4gICAgfSxcblxuICAgIF9yZW1vdmVVc2VyTm9kZUZyb21HcmlkIChkYXRhQ29tcCkge1xuICAgICAgICBsZXQgcm93ID0gZGF0YUNvbXAuX3JvdztcbiAgICAgICAgbGV0IGNvbCA9IGRhdGFDb21wLl9jb2w7XG4gICAgICAgIGxldCBpbmRleCA9IGRhdGFDb21wLl9pbmRleDtcblxuICAgICAgICBsZXQgcm93RGF0YSA9IHRoaXMuX3VzZXJOb2RlR3JpZFtyb3ddO1xuICAgICAgICBsZXQgY29sRGF0YSA9IHJvd0RhdGEgJiYgcm93RGF0YVtjb2xdO1xuICAgICAgICBpZiAoY29sRGF0YSkge1xuICAgICAgICAgICAgcm93RGF0YS5jb3VudCAtLTtcbiAgICAgICAgICAgIGNvbERhdGEuY291bnQgLS07XG4gICAgICAgICAgICBjb2xEYXRhLmxpc3RbaW5kZXhdID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChjb2xEYXRhLmNvdW50IDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb2xEYXRhLmxpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBjb2xEYXRhLmNvdW50ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFDb21wLl9yb3cgPSAtMTtcbiAgICAgICAgZGF0YUNvbXAuX2NvbCA9IC0xO1xuICAgICAgICBkYXRhQ29tcC5faW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5fdXNlck5vZGVEaXJ0eSA9IHRydWU7XG4gICAgfSxcblxuICAgIF9pc0luTGF5ZXIgKHJvdywgY29sKSB7XG4gICAgICAgIHJldHVybiByb3cgPj0gMCAmJiBjb2wgPj0gMCAmJiByb3cgPD0gdGhpcy5fcmlnaHRUb3Aucm93ICYmIGNvbCA8PSB0aGlzLl9yaWdodFRvcC5jb2w7XG4gICAgfSxcblxuICAgIF9hZGRVc2VyTm9kZVRvR3JpZCAoZGF0YUNvbXAsIHRlbXBSb3dDb2wpIHtcbiAgICAgICAgbGV0IHJvdyA9IHRlbXBSb3dDb2wucm93O1xuICAgICAgICBsZXQgY29sID0gdGVtcFJvd0NvbC5jb2w7XG4gICAgICAgIGlmICh0aGlzLl9pc0luTGF5ZXIocm93LCBjb2wpKSB7XG4gICAgICAgICAgICBsZXQgcm93RGF0YSA9IHRoaXMuX3VzZXJOb2RlR3JpZFtyb3ddID0gdGhpcy5fdXNlck5vZGVHcmlkW3Jvd10gfHwge2NvdW50IDogMH07XG4gICAgICAgICAgICBsZXQgY29sRGF0YSA9IHJvd0RhdGFbY29sXSA9IHJvd0RhdGFbY29sXSB8fCB7Y291bnQgOiAwLCBsaXN0OiBbXX07XG4gICAgICAgICAgICBkYXRhQ29tcC5fcm93ID0gcm93O1xuICAgICAgICAgICAgZGF0YUNvbXAuX2NvbCA9IGNvbDtcbiAgICAgICAgICAgIGRhdGFDb21wLl9pbmRleCA9IGNvbERhdGEubGlzdC5sZW5ndGg7XG4gICAgICAgICAgICByb3dEYXRhLmNvdW50Kys7XG4gICAgICAgICAgICBjb2xEYXRhLmNvdW50Kys7XG4gICAgICAgICAgICBjb2xEYXRhLmxpc3QucHVzaChkYXRhQ29tcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhQ29tcC5fcm93ID0gLTE7XG4gICAgICAgICAgICBkYXRhQ29tcC5fY29sID0gLTE7XG4gICAgICAgICAgICBkYXRhQ29tcC5faW5kZXggPSAtMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91c2VyTm9kZURpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2lzVXNlck5vZGVEaXJ0eSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTm9kZURpcnR5O1xuICAgIH0sXG5cbiAgICBfc2V0VXNlck5vZGVEaXJ0eSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdXNlck5vZGVEaXJ0eSA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fc3luY0FuY2hvclBvaW50LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9zeW5jQW5jaG9yUG9pbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfc3luY0FuY2hvclBvaW50ICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIHRoaXMuX2xlZnREb3duVG9DZW50ZXJYID0gbm9kZS53aWR0aCAqIG5vZGUuYW5jaG9yWCAqIG5vZGUuc2NhbGVYO1xuICAgICAgICB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWSA9IG5vZGUuaGVpZ2h0ICogbm9kZS5hbmNob3JZICogbm9kZS5zY2FsZVk7XG4gICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIGlmICh0aGlzLl9idWZmZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGFMaXN0ID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBsYXllciBuYW1lLlxuICAgICAqICEjemgg6I635Y+W5bGC55qE5ZCN56ew44CCXG4gICAgICogQG1ldGhvZCBnZXRMYXllck5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgbGF5ZXJOYW1lID0gdGlsZWRMYXllci5nZXRMYXllck5hbWUoKTtcbiAgICAgKiBjYy5sb2cobGF5ZXJOYW1lKTtcbiAgICAgKi9cbiAgICBnZXRMYXllck5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgbGF5ZXIgbmFtZS5cbiAgICAgKiAhI3poIOiuvue9ruWxgueahOWQjeensFxuICAgICAqIEBtZXRob2QgU2V0TGF5ZXJOYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxheWVyTmFtZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGlsZWRMYXllci5zZXRMYXllck5hbWUoXCJOZXcgTGF5ZXJcIik7XG4gICAgICovXG4gICAgc2V0TGF5ZXJOYW1lIChsYXllck5hbWUpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXJOYW1lID0gbGF5ZXJOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBwcm9wZXJ0eSBuYW1lLlxuICAgICAqICEjemgg6I635Y+W5oyH5a6a5bGe5oCn5ZCN55qE5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRQcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWVcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IHByb3BlcnR5ID0gdGlsZWRMYXllci5nZXRQcm9wZXJ0eShcImluZm9cIik7XG4gICAgICogY2MubG9nKHByb3BlcnR5KTtcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eSAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgcG9zaXRpb24gaW4gcGl4ZWxzIG9mIGEgZ2l2ZW4gdGlsZSBjb29yZGluYXRlLlxuICAgICAqICEjemgg6I635Y+W5oyH5a6aIHRpbGUg55qE5YOP57Sg5Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBnZXRQb3NpdGlvbkF0XG4gICAgICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zIHBvc2l0aW9uIG9yIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBwb3MgPSB0aWxlZExheWVyLmdldFBvc2l0aW9uQXQoY2MudjIoMCwgMCkpO1xuICAgICAqIGNjLmxvZyhcIlBvczogXCIgKyBwb3MpO1xuICAgICAqIGxldCBwb3MgPSB0aWxlZExheWVyLmdldFBvc2l0aW9uQXQoMCwgMCk7XG4gICAgICogY2MubG9nKFwiUG9zOiBcIiArIHBvcyk7XG4gICAgICovXG4gICAgZ2V0UG9zaXRpb25BdCAocG9zLCB5KSB7XG4gICAgICAgIGxldCB4O1xuICAgICAgICBpZiAoeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB4ID0gTWF0aC5mbG9vcihwb3MpO1xuICAgICAgICAgICAgeSA9IE1hdGguZmxvb3IoeSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4ID0gTWF0aC5mbG9vcihwb3MueCk7XG4gICAgICAgICAgICB5ID0gTWF0aC5mbG9vcihwb3MueSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCByZXQ7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY2FzZSBjYy5UaWxlZE1hcC5PcmllbnRhdGlvbi5PUlRITzpcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLl9wb3NpdGlvbkZvck9ydGhvQXQoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLlRpbGVkTWFwLk9yaWVudGF0aW9uLklTTzpcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLl9wb3NpdGlvbkZvcklzb0F0KHgsIHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5UaWxlZE1hcC5PcmllbnRhdGlvbi5IRVg6XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5fcG9zaXRpb25Gb3JIZXhBdCh4LCB5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBfaXNJbnZhbGlkUG9zaXRpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBsZXQgcG9zID0geDtcbiAgICAgICAgICAgIHkgPSBwb3MueTtcbiAgICAgICAgICAgIHggPSBwb3MueDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCA+PSB0aGlzLl9sYXllclNpemUud2lkdGggfHwgeSA+PSB0aGlzLl9sYXllclNpemUuaGVpZ2h0IHx8IHggPCAwIHx8IHkgPCAwO1xuICAgIH0sXG5cbiAgICBfcG9zaXRpb25Gb3JJc29BdCAoeCwgeSkge1xuICAgICAgICBsZXQgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwO1xuICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKHgpICsgTWF0aC5mbG9vcih5KSAqIHRoaXMuX2xheWVyU2l6ZS53aWR0aDtcbiAgICAgICAgbGV0IGdpZCA9IHRoaXMuX3RpbGVzW2luZGV4XTtcbiAgICAgICAgaWYgKGdpZCkge1xuICAgICAgICAgICAgbGV0IHRpbGVzZXQgPSB0aGlzLl90ZXhHcmlkc1tnaWRdLnRpbGVzZXQ7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGlsZXNldC50aWxlT2Zmc2V0O1xuICAgICAgICAgICAgb2Zmc2V0WCA9IG9mZnNldC54O1xuICAgICAgICAgICAgb2Zmc2V0WSA9IG9mZnNldC55O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNjLnYyKFxuICAgICAgICAgICAgdGhpcy5fbWFwVGlsZVNpemUud2lkdGggKiAwLjUgKiAodGhpcy5fbGF5ZXJTaXplLmhlaWdodCArIHggLSB5IC0gMSkgKyBvZmZzZXRYLFxuICAgICAgICAgICAgdGhpcy5fbWFwVGlsZVNpemUuaGVpZ2h0ICogMC41ICogKHRoaXMuX2xheWVyU2l6ZS53aWR0aCAtIHggKyB0aGlzLl9sYXllclNpemUuaGVpZ2h0IC0geSAtIDIpIC0gb2Zmc2V0WVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBfcG9zaXRpb25Gb3JPcnRob0F0ICh4LCB5KSB7XG4gICAgICAgIGxldCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoeCkgKyBNYXRoLmZsb29yKHkpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICBsZXQgZ2lkID0gdGhpcy5fdGlsZXNbaW5kZXhdO1xuICAgICAgICBpZiAoZ2lkKSB7XG4gICAgICAgICAgICBsZXQgdGlsZXNldCA9IHRoaXMuX3RleEdyaWRzW2dpZF0udGlsZXNldDtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSB0aWxlc2V0LnRpbGVPZmZzZXQ7XG4gICAgICAgICAgICBvZmZzZXRYID0gb2Zmc2V0Lng7XG4gICAgICAgICAgICBvZmZzZXRZID0gb2Zmc2V0Lnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2MudjIoXG4gICAgICAgICAgICB4ICogdGhpcy5fbWFwVGlsZVNpemUud2lkdGggKyBvZmZzZXRYLFxuICAgICAgICAgICAgKHRoaXMuX2xheWVyU2l6ZS5oZWlnaHQgLSB5IC0gMSkgKiB0aGlzLl9tYXBUaWxlU2l6ZS5oZWlnaHQgLSBvZmZzZXRZXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIF9wb3NpdGlvbkZvckhleEF0IChjb2wsIHJvdykge1xuICAgICAgICBsZXQgdGlsZVdpZHRoID0gdGhpcy5fbWFwVGlsZVNpemUud2lkdGg7XG4gICAgICAgIGxldCB0aWxlSGVpZ2h0ID0gdGhpcy5fbWFwVGlsZVNpemUuaGVpZ2h0O1xuICAgICAgICBsZXQgcm93cyA9IHRoaXMuX2xheWVyU2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihjb2wpICsgTWF0aC5mbG9vcihyb3cpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICBsZXQgZ2lkID0gdGhpcy5fdGlsZXNbaW5kZXhdO1xuICAgICAgICBsZXQgdGlsZXNldCA9IHRoaXMuX3RleEdyaWRzW2dpZF0udGlsZXNldDtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRpbGVzZXQudGlsZU9mZnNldDtcblxuICAgICAgICBsZXQgb2RkX2V2ZW4gPSAodGhpcy5fc3RhZ2dlckluZGV4ID09PSBjYy5UaWxlZE1hcC5TdGFnZ2VySW5kZXguU1RBR0dFUklOREVYX09ERCkgPyAxIDogLTE7XG4gICAgICAgIGxldCB4ID0gMCwgeSA9IDA7XG4gICAgICAgIGxldCBkaWZmWCA9IDA7XG4gICAgICAgIGxldCBkaWZmWSA9IDA7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fc3RhZ2dlckF4aXMpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuVGlsZWRNYXAuU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWTpcbiAgICAgICAgICAgICAgICBkaWZmWCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZlggPSB0aWxlV2lkdGggLyAyICogb2RkX2V2ZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHggPSBjb2wgKiB0aWxlV2lkdGggKyBkaWZmWCArIG9mZnNldC54O1xuICAgICAgICAgICAgICAgIHkgPSAocm93cyAtIHJvdyAtIDEpICogKHRpbGVIZWlnaHQgLSAodGlsZUhlaWdodCAtIHRoaXMuX2hleFNpZGVMZW5ndGgpIC8gMikgLSBvZmZzZXQueTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuVGlsZWRNYXAuU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWDpcbiAgICAgICAgICAgICAgICBkaWZmWSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGNvbCAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZlkgPSB0aWxlSGVpZ2h0IC8gMiAqIC1vZGRfZXZlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeCA9IGNvbCAqICh0aWxlV2lkdGggLSAodGlsZVdpZHRoIC0gdGhpcy5faGV4U2lkZUxlbmd0aCkgLyAyKSArIG9mZnNldC54O1xuICAgICAgICAgICAgICAgIHkgPSAocm93cyAtIHJvdyAtIDEpICogdGlsZUhlaWdodCArIGRpZmZZIC0gb2Zmc2V0Lnk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgdGlsZSBnaWQgKGdpZCA9IHRpbGUgZ2xvYmFsIGlkKSBhdCBhIGdpdmVuIHRpbGUgY29vcmRpbmF0ZS48YnIgLz5cbiAgICAgKiBUaGUgVGlsZSBHSUQgY2FuIGJlIG9idGFpbmVkIGJ5IHVzaW5nIHRoZSBtZXRob2QgXCJ0aWxlR0lEQXRcIiBvciBieSB1c2luZyB0aGUgVE1YIGVkaXRvciAuIFRpbGVzZXQgTWdyICsxLjxiciAvPlxuICAgICAqIElmIGEgdGlsZSBpcyBhbHJlYWR5IHBsYWNlZCBhdCB0aGF0IHBvc2l0aW9uLCB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u57uZ5a6a5Z2Q5qCH55qEIHRpbGUg55qEIGdpZCAoZ2lkID0gdGlsZSDlhajlsYAgaWQp77yMXG4gICAgICogdGlsZSDnmoQgR0lEIOWPr+S7peS9v+eUqOaWueazlSDigJx0aWxlR0lEQXTigJ0g5p2l6I635b6X44CCPGJyIC8+XG4gICAgICog5aaC5p6c5LiA5LiqIHRpbGUg5bey57uP5pS+5Zyo6YKj5Liq5L2N572u77yM6YKj5LmI5a6D5bCG6KKr5Yig6Zmk44CCXG4gICAgICogQG1ldGhvZCBzZXRUaWxlR0lEQXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZ2lkXG4gICAgICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zT3JYIHBvc2l0aW9uIG9yIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZmxhZ3NPclkgZmxhZ3Mgb3IgeVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZmxhZ3NdXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aWxlZExheWVyLnNldFRpbGVHSURBdCgxMDAxLCAxMCwgMTAsIDEpXG4gICAgICovXG4gICAgc2V0VGlsZUdJREF0IChnaWQsIHBvc09yWCwgZmxhZ3NPclksIGZsYWdzKSB7XG4gICAgICAgIGlmIChwb3NPclggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5zZXRUaWxlR0lEQXQoKTogcG9zIHNob3VsZCBiZSBub24tbnVsbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zO1xuICAgICAgICBpZiAoZmxhZ3MgIT09IHVuZGVmaW5lZCB8fCAhKHBvc09yWCBpbnN0YW5jZW9mIGNjLlZlYzIpKSB7XG4gICAgICAgICAgICAvLyBmb3VyIHBhcmFtZXRlcnMgb3IgcG9zT3JYIGlzIG5vdCBhIFZlYzIgb2JqZWN0XG4gICAgICAgICAgICBwb3MgPSBjYy52Mihwb3NPclgsIGZsYWdzT3JZKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHBvc09yWDtcbiAgICAgICAgICAgIGZsYWdzID0gZmxhZ3NPclk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MueCA9IE1hdGguZmxvb3IocG9zLngpO1xuICAgICAgICBwb3MueSA9IE1hdGguZmxvb3IocG9zLnkpO1xuICAgICAgICBpZiAodGhpcy5faXNJbnZhbGlkUG9zaXRpb24ocG9zKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5zZXRUaWxlR0lEQXQoKTogaW52YWxpZCBwb3NpdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RpbGVzIHx8ICF0aGlzLl90aWxlc2V0cyB8fCB0aGlzLl90aWxlc2V0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY2MubG9nSUQoNzIzOCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdpZCAhPT0gMCAmJiBnaWQgPCB0aGlzLl90aWxlc2V0c1swXS5maXJzdEdpZCkge1xuICAgICAgICAgICAgY2MubG9nSUQoNzIzOSwgZ2lkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZsYWdzID0gZmxhZ3MgfHwgMDtcbiAgICAgICAgbGV0IGN1cnJlbnRGbGFncyA9IHRoaXMuZ2V0VGlsZUZsYWdzQXQocG9zKTtcbiAgICAgICAgbGV0IGN1cnJlbnRHSUQgPSB0aGlzLmdldFRpbGVHSURBdChwb3MpO1xuXG4gICAgICAgIGlmIChjdXJyZW50R0lEID09PSBnaWQgJiYgY3VycmVudEZsYWdzID09PSBmbGFncykgcmV0dXJuO1xuXG4gICAgICAgIGxldCBnaWRBbmRGbGFncyA9IChnaWQgfCBmbGFncykgPj4+IDA7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRpbGVGb3JHSUQoZ2lkQW5kRmxhZ3MsIHBvcyk7XG4gICAgfSxcblxuICAgIF91cGRhdGVUaWxlRm9yR0lEIChnaWQsIHBvcykge1xuICAgICAgICBpZiAoZ2lkICE9PSAwICYmICF0aGlzLl90ZXhHcmlkc1tnaWRdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaWR4ID0gMCB8IChwb3MueCArIHBvcy55ICogdGhpcy5fbGF5ZXJTaXplLndpZHRoKTtcbiAgICAgICAgaWYgKGlkeCA8IHRoaXMuX3RpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fdGlsZXNbaWR4XSA9IGdpZDtcbiAgICAgICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHRpbGUgZ2lkIGF0IGEgZ2l2ZW4gdGlsZSBjb29yZGluYXRlLiA8YnIgLz5cbiAgICAgKiBpZiBpdCByZXR1cm5zIDAsIGl0IG1lYW5zIHRoYXQgdGhlIHRpbGUgaXMgZW1wdHkuIDxiciAvPlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4fnu5nlrprnmoQgdGlsZSDlnZDmoIfjgIFmbGFnc++8iOWPr+mAie+8iei/lOWbniB0aWxlIOeahCBHSUQuIDxiciAvPlxuICAgICAqIOWmguaenOWug+i/lOWbniAw77yM5YiZ6KGo56S66K+lIHRpbGUg5Li656m644CCPGJyIC8+XG4gICAgICogQG1ldGhvZCBnZXRUaWxlR0lEQXRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3Mgb3IgeFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgdGlsZUdpZCA9IHRpbGVkTGF5ZXIuZ2V0VGlsZUdJREF0KDAsIDApO1xuICAgICAqL1xuICAgIGdldFRpbGVHSURBdCAocG9zLCB5KSB7XG4gICAgICAgIGlmIChwb3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5nZXRUaWxlR0lEQXQoKTogcG9zIHNob3VsZCBiZSBub24tbnVsbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeCA9IHBvcztcbiAgICAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgeCA9IHBvcy54O1xuICAgICAgICAgICAgeSA9IHBvcy55O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc0ludmFsaWRQb3NpdGlvbih4LCB5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5nZXRUaWxlR0lEQXQoKTogaW52YWxpZCBwb3NpdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RpbGVzKSB7XG4gICAgICAgICAgICBjYy5sb2dJRCg3MjM3KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcih4KSArIE1hdGguZmxvb3IoeSkgKiB0aGlzLl9sYXllclNpemUud2lkdGg7XG4gICAgICAgIC8vIEJpdHMgb24gdGhlIGZhciBlbmQgb2YgdGhlIDMyLWJpdCBnbG9iYWwgdGlsZSBJRCBhcmUgdXNlZCBmb3IgdGlsZSBmbGFnc1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuX3RpbGVzW2luZGV4XTtcblxuICAgICAgICByZXR1cm4gKHRpbGUgJiBjYy5UaWxlZE1hcC5UaWxlRmxhZy5GTElQUEVEX01BU0spID4+PiAwO1xuICAgIH0sXG5cbiAgICBnZXRUaWxlRmxhZ3NBdCAocG9zLCB5KSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlZExheWVyLmdldFRpbGVGbGFnc0F0OiBwb3Mgc2hvdWxkIGJlIG5vbi1udWxsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvcyA9IGNjLnYyKHBvcywgeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lzSW52YWxpZFBvc2l0aW9uKHBvcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGVkTGF5ZXIuZ2V0VGlsZUZsYWdzQXQ6IGludmFsaWQgcG9zaXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl90aWxlcykge1xuICAgICAgICAgICAgY2MubG9nSUQoNzI0MCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpZHggPSBNYXRoLmZsb29yKHBvcy54KSArIE1hdGguZmxvb3IocG9zLnkpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICAvLyBCaXRzIG9uIHRoZSBmYXIgZW5kIG9mIHRoZSAzMi1iaXQgZ2xvYmFsIHRpbGUgSUQgYXJlIHVzZWQgZm9yIHRpbGUgZmxhZ3NcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLl90aWxlc1tpZHhdO1xuXG4gICAgICAgIHJldHVybiAodGlsZSAmIGNjLlRpbGVkTWFwLlRpbGVGbGFnLkZMSVBQRURfQUxMKSA+Pj4gMDtcbiAgICB9LFxuXG4gICAgX3NldEN1bGxpbmdEaXJ0eSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdmFsdWU7XG4gICAgfSxcblxuICAgIF9pc0N1bGxpbmdEaXJ0eSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdWxsaW5nRGlydHk7XG4gICAgfSxcblxuICAgIC8vICd4LCB5JyBpcyB0aGUgcG9zaXRpb24gb2Ygdmlld1BvcnQsIHdoaWNoJ3MgYW5jaG9yIHBvaW50IGlzIGF0IHRoZSBjZW50ZXIgb2YgcmVjdC5cbiAgICAvLyAnd2lkdGgsIGhlaWdodCcgaXMgdGhlIHNpemUgb2Ygdmlld1BvcnQuXG4gICAgX3VwZGF0ZVZpZXdQb3J0ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGlmICh0aGlzLl92aWV3UG9ydC53aWR0aCA9PT0gd2lkdGggJiYgXG4gICAgICAgICAgICB0aGlzLl92aWV3UG9ydC5oZWlnaHQgPT09IGhlaWdodCAmJlxuICAgICAgICAgICAgdGhpcy5fdmlld1BvcnQueCA9PT0geCAmJlxuICAgICAgICAgICAgdGhpcy5fdmlld1BvcnQueSA9PT0geSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ZpZXdQb3J0LnggPSB4O1xuICAgICAgICB0aGlzLl92aWV3UG9ydC55ID0geTtcbiAgICAgICAgdGhpcy5fdmlld1BvcnQud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5fdmlld1BvcnQuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgIC8vIGlmIG1hcCdzIHR5cGUgaXMgaXNvLCByZXNlcnZlIGJvdHRvbSBsaW5lIGlzIDIgdG8gYXZvaWQgc2hvdyBlbXB0eSBncmlkIGJlY2F1c2Ugb2YgaXNvIGdyaWQgYXJpdGhtZXRpY1xuICAgICAgICBsZXQgcmVzZXJ2ZUxpbmUgPSAxO1xuICAgICAgICBpZiAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbiA9PT0gY2MuVGlsZWRNYXAuT3JpZW50YXRpb24uSVNPKSB7XG4gICAgICAgICAgICByZXNlcnZlTGluZSA9IDI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdnB4ID0gdGhpcy5fdmlld1BvcnQueCAtIHRoaXMuX29mZnNldC54ICsgdGhpcy5fbGVmdERvd25Ub0NlbnRlclg7XG4gICAgICAgIGxldCB2cHkgPSB0aGlzLl92aWV3UG9ydC55IC0gdGhpcy5fb2Zmc2V0LnkgKyB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWTtcblxuICAgICAgICBsZXQgbGVmdERvd25YID0gdnB4IC0gdGhpcy5fbGVmdE9mZnNldDtcbiAgICAgICAgbGV0IGxlZnREb3duWSA9IHZweSAtIHRoaXMuX2Rvd25PZmZzZXQ7XG4gICAgICAgIGxldCByaWdodFRvcFggPSB2cHggKyB3aWR0aCArIHRoaXMuX3JpZ2h0T2Zmc2V0O1xuICAgICAgICBsZXQgcmlnaHRUb3BZID0gdnB5ICsgaGVpZ2h0ICsgdGhpcy5fdG9wT2Zmc2V0O1xuXG4gICAgICAgIGxldCBsZWZ0RG93biA9IHRoaXMuX2N1bGxpbmdSZWN0LmxlZnREb3duO1xuICAgICAgICBsZXQgcmlnaHRUb3AgPSB0aGlzLl9jdWxsaW5nUmVjdC5yaWdodFRvcDtcblxuICAgICAgICBpZiAobGVmdERvd25YIDwgMCkgbGVmdERvd25YID0gMDtcbiAgICAgICAgaWYgKGxlZnREb3duWSA8IDApIGxlZnREb3duWSA9IDA7XG5cbiAgICAgICAgLy8gY2FsYyBsZWZ0IGRvd25cbiAgICAgICAgdGhpcy5fcG9zaXRpb25Ub1Jvd0NvbChsZWZ0RG93blgsIGxlZnREb3duWSwgX3RlbXBSb3dDb2wpO1xuICAgICAgICAvLyBtYWtlIHJhbmdlIGxhcmdlXG4gICAgICAgIF90ZW1wUm93Q29sLnJvdy09cmVzZXJ2ZUxpbmU7XG4gICAgICAgIF90ZW1wUm93Q29sLmNvbC09cmVzZXJ2ZUxpbmU7XG4gICAgICAgIC8vIGluc3VyZSBsZWZ0IGRvd24gcm93IGNvbCBncmVhdGVyIHRoYW4gMFxuICAgICAgICBfdGVtcFJvd0NvbC5yb3cgPSBfdGVtcFJvd0NvbC5yb3cgPiAwID8gX3RlbXBSb3dDb2wucm93IDogMDtcbiAgICAgICAgX3RlbXBSb3dDb2wuY29sID0gX3RlbXBSb3dDb2wuY29sID4gMCA/IF90ZW1wUm93Q29sLmNvbCA6IDA7ICAgICAgICBcblxuICAgICAgICBpZiAoX3RlbXBSb3dDb2wucm93ICE9PSBsZWZ0RG93bi5yb3cgfHwgX3RlbXBSb3dDb2wuY29sICE9PSBsZWZ0RG93bi5jb2wpIHtcbiAgICAgICAgICAgIGxlZnREb3duLnJvdyA9IF90ZW1wUm93Q29sLnJvdztcbiAgICAgICAgICAgIGxlZnREb3duLmNvbCA9IF90ZW1wUm93Q29sLmNvbDtcbiAgICAgICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG93IG5vdGhpbmdcbiAgICAgICAgaWYgKHJpZ2h0VG9wWCA8IDAgfHwgcmlnaHRUb3BZIDwgMCkge1xuICAgICAgICAgICAgX3RlbXBSb3dDb2wucm93ID0gLTE7XG4gICAgICAgICAgICBfdGVtcFJvd0NvbC5jb2wgPSAtMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNhbGMgcmlnaHQgdG9wXG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvblRvUm93Q29sKHJpZ2h0VG9wWCwgcmlnaHRUb3BZLCBfdGVtcFJvd0NvbCk7XG4gICAgICAgICAgICAvLyBtYWtlIHJhbmdlIGxhcmdlXG4gICAgICAgICAgICBfdGVtcFJvd0NvbC5yb3crKztcbiAgICAgICAgICAgIF90ZW1wUm93Q29sLmNvbCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXZvaWQgcmFuZ2Ugb3V0IG9mIG1heCByZWN0XG4gICAgICAgIGlmIChfdGVtcFJvd0NvbC5yb3cgPiB0aGlzLl9yaWdodFRvcC5yb3cpIF90ZW1wUm93Q29sLnJvdyA9IHRoaXMuX3JpZ2h0VG9wLnJvdztcbiAgICAgICAgaWYgKF90ZW1wUm93Q29sLmNvbCA+IHRoaXMuX3JpZ2h0VG9wLmNvbCkgX3RlbXBSb3dDb2wuY29sID0gdGhpcy5fcmlnaHRUb3AuY29sO1xuXG4gICAgICAgIGlmIChfdGVtcFJvd0NvbC5yb3cgIT09IHJpZ2h0VG9wLnJvdyB8fCBfdGVtcFJvd0NvbC5jb2wgIT09IHJpZ2h0VG9wLmNvbCkge1xuICAgICAgICAgICAgcmlnaHRUb3Aucm93ID0gX3RlbXBSb3dDb2wucm93O1xuICAgICAgICAgICAgcmlnaHRUb3AuY29sID0gX3RlbXBSb3dDb2wuY29sO1xuICAgICAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB0aGUgcmVzdWx0IG1heSBub3QgcHJlY2lzZSwgYnV0IGl0IGRvc2UndCBtYXR0ZXIsIGl0IGp1c3QgdXNlcyB0byBiZSBnb3QgcmFuZ2VcbiAgICBfcG9zaXRpb25Ub1Jvd0NvbCAoeCwgeSwgcmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IFRpbGVkTWFwID0gY2MuVGlsZWRNYXA7XG4gICAgICAgIGNvbnN0IE9yaWVudGF0aW9uID0gVGlsZWRNYXAuT3JpZW50YXRpb247XG4gICAgICAgIGNvbnN0IFN0YWdnZXJBeGlzID0gVGlsZWRNYXAuU3RhZ2dlckF4aXM7XG5cbiAgICAgICAgbGV0IG1hcHR3ID0gdGhpcy5fbWFwVGlsZVNpemUud2lkdGgsXG4gICAgICAgICAgICBtYXB0aCA9IHRoaXMuX21hcFRpbGVTaXplLmhlaWdodCxcbiAgICAgICAgICAgIG1hcHR3MiA9IG1hcHR3ICogMC41LFxuICAgICAgICAgICAgbWFwdGgyID0gbWFwdGggKiAwLjU7XG4gICAgICAgIGxldCByb3cgPSAwLCBjb2wgPSAwLCBkaWZmWDIgPSAwLCBkaWZmWTIgPSAwLCBheGlzID0gdGhpcy5fc3RhZ2dlckF4aXM7XG4gICAgICAgIGxldCBjb2xzID0gdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgLy8gbGVmdCB0b3AgdG8gcmlnaHQgZG93bVxuICAgICAgICAgICAgY2FzZSBPcmllbnRhdGlvbi5PUlRITzpcbiAgICAgICAgICAgICAgICBjb2wgPSBNYXRoLmZsb29yKHggLyBtYXB0dyk7XG4gICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcih5IC8gbWFwdGgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gcmlnaHQgdG9wIHRvIGxlZnQgZG93blxuICAgICAgICAgICAgLy8gaXNvIGNhbiBiZSB0cmVhdCBhcyBzcGVjaWFsIGhleCB3aG9zZSBoZXggc2lkZSBsZW5ndGggaXMgMFxuICAgICAgICAgICAgY2FzZSBPcmllbnRhdGlvbi5JU086XG4gICAgICAgICAgICAgICAgY29sID0gTWF0aC5mbG9vcih4IC8gbWFwdHcyKTtcbiAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmZsb29yKHkgLyBtYXB0aDIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gbGVmdCB0b3AgdG8gcmlnaHQgZG93bVxuICAgICAgICAgICAgY2FzZSBPcmllbnRhdGlvbi5IRVg6XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgPT09IFN0YWdnZXJBeGlzLlNUQUdHRVJBWElTX1kpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcih5IC8gKG1hcHRoIC0gdGhpcy5fZGlmZlkxKSk7XG4gICAgICAgICAgICAgICAgICAgIGRpZmZYMiA9IHJvdyAlIDIgPT09IDEgPyBtYXB0dzIgKiB0aGlzLl9vZGRfZXZlbiA6IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IE1hdGguZmxvb3IoKHggLSBkaWZmWDIpIC8gbWFwdHcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IE1hdGguZmxvb3IoeCAvIChtYXB0dyAtIHRoaXMuX2RpZmZYMSkpO1xuICAgICAgICAgICAgICAgICAgICBkaWZmWTIgPSBjb2wgJSAyID09PSAxID8gbWFwdGgyICogLXRoaXMuX29kZF9ldmVuIDogMDtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcigoeSAtIGRpZmZZMikgLyBtYXB0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5yb3cgPSByb3c7XG4gICAgICAgIHJlc3VsdC5jb2wgPSBjb2w7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIF91cGRhdGVDdWxsaW5nICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5lbmFibGVDdWxsaW5nKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9lbmFibGVDdWxsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgICAgICBNYXQ0LmludmVydChfbWF0NF90ZW1wLCB0aGlzLm5vZGUuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgICAgIGxldCByZWN0ID0gY2MudmlzaWJsZVJlY3Q7XG4gICAgICAgICAgICBsZXQgY2FtZXJhID0gY2MuQ2FtZXJhLmZpbmRDYW1lcmEodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIGlmIChjYW1lcmEpIHtcbiAgICAgICAgICAgICAgICBfdmVjMl90ZW1wLnggPSAwO1xuICAgICAgICAgICAgICAgIF92ZWMyX3RlbXAueSA9IDA7XG4gICAgICAgICAgICAgICAgX3ZlYzJfdGVtcDIueCA9IF92ZWMyX3RlbXAueCArIHJlY3Qud2lkdGg7XG4gICAgICAgICAgICAgICAgX3ZlYzJfdGVtcDIueSA9IF92ZWMyX3RlbXAueSArIHJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNhbWVyYS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQoX3ZlYzJfdGVtcCwgX3ZlYzJfdGVtcCk7XG4gICAgICAgICAgICAgICAgY2FtZXJhLmdldFNjcmVlblRvV29ybGRQb2ludChfdmVjMl90ZW1wMiwgX3ZlYzJfdGVtcDIpO1xuICAgICAgICAgICAgICAgIFZlYzIudHJhbnNmb3JtTWF0NChfdmVjMl90ZW1wLCBfdmVjMl90ZW1wLCBfbWF0NF90ZW1wKTtcbiAgICAgICAgICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQoX3ZlYzJfdGVtcDIsIF92ZWMyX3RlbXAyLCBfbWF0NF90ZW1wKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWaWV3UG9ydChfdmVjMl90ZW1wLngsIF92ZWMyX3RlbXAueSwgX3ZlYzJfdGVtcDIueCAtIF92ZWMyX3RlbXAueCwgX3ZlYzJfdGVtcDIueSAtIF92ZWMyX3RlbXAueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBMYXllciBvcmllbnRhdGlvbiwgd2hpY2ggaXMgdGhlIHNhbWUgYXMgdGhlIG1hcCBvcmllbnRhdGlvbi5cbiAgICAgKiAhI3poIOiOt+WPliBMYXllciDmlrnlkJEo5ZCM5Zyw5Zu+5pa55ZCRKeOAglxuICAgICAqIEBtZXRob2QgZ2V0TGF5ZXJPcmllbnRhdGlvblxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBvcmllbnRhdGlvbiA9IHRpbGVkTGF5ZXIuZ2V0TGF5ZXJPcmllbnRhdGlvbigpO1xuICAgICAqIGNjLmxvZyhcIkxheWVyIE9yaWVudGF0aW9uOiBcIiArIG9yaWVudGF0aW9uKTtcbiAgICAgKi9cbiAgICBnZXRMYXllck9yaWVudGF0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyT3JpZW50YXRpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gcHJvcGVydGllcyBmcm9tIHRoZSBsYXllci4gVGhleSBjYW4gYmUgYWRkZWQgdXNpbmcgVGlsZWQuXG4gICAgICogISN6aCDojrflj5YgbGF5ZXIg55qE5bGe5oCn77yM5Y+v5Lul5L2/55SoIFRpbGVkIOe8lui+keWZqOa3u+WKoOWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgZ2V0UHJvcGVydGllc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IHByb3BlcnRpZXMgPSB0aWxlZExheWVyLmdldFByb3BlcnRpZXMoKTtcbiAgICAgKiBjYy5sb2coXCJQcm9wZXJ0aWVzOiBcIiArIHByb3BlcnRpZXMpO1xuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVZlcnRpY2VzICgpIHtcbiAgICAgICAgY29uc3QgVGlsZWRNYXAgPSBjYy5UaWxlZE1hcDtcbiAgICAgICAgY29uc3QgVGlsZUZsYWcgPSBUaWxlZE1hcC5UaWxlRmxhZztcbiAgICAgICAgY29uc3QgRkxJUFBFRF9NQVNLID0gVGlsZUZsYWcuRkxJUFBFRF9NQVNLO1xuICAgICAgICBjb25zdCBTdGFnZ2VyQXhpcyA9IFRpbGVkTWFwLlN0YWdnZXJBeGlzO1xuICAgICAgICBjb25zdCBPcmllbnRhdGlvbiA9IFRpbGVkTWFwLk9yaWVudGF0aW9uO1xuXG4gICAgICAgIGxldCB2ZXJ0aWNlcyA9IHRoaXMuX3ZlcnRpY2VzO1xuICAgICAgICB2ZXJ0aWNlcy5sZW5ndGggPSAwO1xuXG4gICAgICAgIGxldCBsYXllck9yaWVudGF0aW9uID0gdGhpcy5fbGF5ZXJPcmllbnRhdGlvbixcbiAgICAgICAgICAgIHRpbGVzID0gdGhpcy5fdGlsZXM7XG5cbiAgICAgICAgaWYgKCF0aWxlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJpZ2h0VG9wID0gdGhpcy5fcmlnaHRUb3A7XG4gICAgICAgIHJpZ2h0VG9wLnJvdyA9IC0xO1xuICAgICAgICByaWdodFRvcC5jb2wgPSAtMTtcblxuICAgICAgICBsZXQgbWFwdHcgPSB0aGlzLl9tYXBUaWxlU2l6ZS53aWR0aCxcbiAgICAgICAgICAgIG1hcHRoID0gdGhpcy5fbWFwVGlsZVNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgbWFwdHcyID0gbWFwdHcgKiAwLjUsXG4gICAgICAgICAgICBtYXB0aDIgPSBtYXB0aCAqIDAuNSxcbiAgICAgICAgICAgIHJvd3MgPSB0aGlzLl9sYXllclNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgY29scyA9IHRoaXMuX2xheWVyU2l6ZS53aWR0aCxcbiAgICAgICAgICAgIGdyaWRzID0gdGhpcy5fdGV4R3JpZHM7XG4gICAgICAgIFxuICAgICAgICBsZXQgY29sT2Zmc2V0ID0gMCwgZ2lkLCBncmlkLCBsZWZ0LCBib3R0b20sXG4gICAgICAgICAgICBheGlzLCBkaWZmWDEsIGRpZmZZMSwgb2RkX2V2ZW4sIGRpZmZYMiwgZGlmZlkyO1xuXG4gICAgICAgIGlmIChsYXllck9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5IRVgpIHtcbiAgICAgICAgICAgIGF4aXMgPSB0aGlzLl9zdGFnZ2VyQXhpcztcbiAgICAgICAgICAgIGRpZmZYMSA9IHRoaXMuX2RpZmZYMTtcbiAgICAgICAgICAgIGRpZmZZMSA9IHRoaXMuX2RpZmZZMTtcbiAgICAgICAgICAgIG9kZF9ldmVuID0gdGhpcy5fb2RkX2V2ZW47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VsbGluZ0NvbCA9IDAsIGN1bGxpbmdSb3cgPSAwO1xuICAgICAgICBsZXQgdGlsZU9mZnNldCA9IG51bGwsIGdyaWRHSUQgPSAwO1xuXG4gICAgICAgIHRoaXMuX3RvcE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuX2Rvd25PZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLl9sZWZ0T2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5fcmlnaHRPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLl9oYXNBbmlHcmlkID0gZmFsc2U7XG5cbiAgICAgICAgLy8gZ3JpZCBib3JkZXJcbiAgICAgICAgbGV0IHRvcEJvcmRlciA9IDAsIGRvd25Cb3JkZXIgPSAwLCBsZWZ0Qm9yZGVyID0gMCwgcmlnaHRCb3JkZXIgPSAwO1xuXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7ICsrcm93KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyArK2NvbCkge1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGNvbE9mZnNldCArIGNvbDtcbiAgICAgICAgICAgICAgICBnaWQgPSB0aWxlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgZ3JpZEdJRCA9ICgoZ2lkICYgRkxJUFBFRF9NQVNLKSA+Pj4gMCk7XG4gICAgICAgICAgICAgICAgZ3JpZCA9IGdyaWRzW2dyaWRHSURdO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgaGFzIGFuaW1hdGlvbiwgZ3JpZCBtdXN0IGJlIHVwZGF0ZWQgcGVyIGZyYW1lXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNbZ3JpZEdJRF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFzQW5pR3JpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFncmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAobGF5ZXJPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0IHRvcCB0byByaWdodCBkb3dtXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgT3JpZW50YXRpb24uT1JUSE86XG4gICAgICAgICAgICAgICAgICAgICAgICBjdWxsaW5nQ29sID0gY29sO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VsbGluZ1JvdyA9IHJvd3MgLSByb3cgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA9IGN1bGxpbmdDb2wgKiBtYXB0dztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbSA9IGN1bGxpbmdSb3cgKiBtYXB0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAvLyByaWdodCB0b3AgdG8gbGVmdCBkb3duXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgT3JpZW50YXRpb24uSVNPOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm90IGNvbnNpZGVyIGFib3V0IGNvbCwgdGhlbiBsZWZ0IGlzICd3LzIgKiAocm93cyAtIHJvdyAtIDEpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgY29uc2lkZXIgYWJvdXQgY29sIHRoZW4gbGVmdCBtdXN0IGFkZCAndy8yICogY29sJ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gbGVmdCBpcyAndy8yICogKHJvd3MgLSByb3cgLSAxKSArIHcvMiAqIGNvbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgZXhwcmVzc2lvbiBpcyAndy8yICogKHJvd3MgLSByb3cgKyBjb2wgLTEpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VsbGluZ0NvbCA9IHJvd3MgKyBjb2wgLSByb3cgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm90IGNvbnNpZGVyIGFib3V0IHJvdywgdGhlbiBib3R0b20gaXMgJ2gvMiAqIChjb2xzIC0gY29sIC0xKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGNvbnNpZGVyIGFib3V0IHJvdyB0aGVuIGJvdHRvbSBtdXN0IGFkZCAnaC8yICogKHJvd3MgLSByb3cgLSAxKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIGJvdHRvbSBpcyAnaC8yICogKGNvbHMgLSBjb2wgLTEpICsgaC8yICogKHJvd3MgLSByb3cgLSAxKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgZXhwcmVzc2lvbm4gaXMgJ2gvMiAqIChyb3dzICsgY29scyAtIGNvbCAtIHJvdyAtIDIpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VsbGluZ1JvdyA9IHJvd3MgKyBjb2xzIC0gY29sIC0gcm93IC0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSBtYXB0dzIgKiBjdWxsaW5nQ29sO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tID0gbWFwdGgyICogY3VsbGluZ1JvdztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0IHRvcCB0byByaWdodCBkb3dtXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgT3JpZW50YXRpb24uSEVYOlxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlgyID0gKGF4aXMgPT09IFN0YWdnZXJBeGlzLlNUQUdHRVJBWElTX1kgJiYgcm93ICUgMiA9PT0gMSkgPyBtYXB0dzIgKiBvZGRfZXZlbiA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmWTIgPSAoYXhpcyA9PT0gU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWCAmJiBjb2wgJSAyID09PSAxKSA/IG1hcHRoMiAqIC1vZGRfZXZlbiA6IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSBjb2wgKiAobWFwdHcgLSBkaWZmWDEpICsgZGlmZlgyO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tID0gKHJvd3MgLSByb3cgLSAxKSAqIChtYXB0aCAtIGRpZmZZMSkgKyBkaWZmWTI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdWxsaW5nQ29sID0gY29sO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VsbGluZ1JvdyA9IHJvd3MgLSByb3cgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHJvd0RhdGEgPSB2ZXJ0aWNlc1tjdWxsaW5nUm93XSA9IHZlcnRpY2VzW2N1bGxpbmdSb3ddIHx8IHttaW5Db2w6MCwgbWF4Q29sOjB9O1xuICAgICAgICAgICAgICAgIGxldCBjb2xEYXRhID0gcm93RGF0YVtjdWxsaW5nQ29sXSA9IHJvd0RhdGFbY3VsbGluZ0NvbF0gfHwge307XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gcmVjb3JkIGVhY2ggcm93IHJhbmdlLCBpdCB3aWxsIGZhc3RlciB3aGVuIGN1bGxpbmcgZ3JpZFxuICAgICAgICAgICAgICAgIGlmIChyb3dEYXRhLm1pbkNvbCA+IGN1bGxpbmdDb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93RGF0YS5taW5Db2wgPSBjdWxsaW5nQ29sO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyb3dEYXRhLm1heENvbCA8IGN1bGxpbmdDb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93RGF0YS5tYXhDb2wgPSBjdWxsaW5nQ29sO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlY29yZCBtYXggcmVjdCwgd2hlbiB2aWV3UG9ydCBpcyBiaWdnZXIgdGhhbiBsYXllciwgY2FuIG1ha2UgaXQgc21hbGxlclxuICAgICAgICAgICAgICAgIGlmIChyaWdodFRvcC5yb3cgPCBjdWxsaW5nUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0VG9wLnJvdyA9IGN1bGxpbmdSb3c7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0VG9wLmNvbCA8IGN1bGxpbmdDb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRUb3AuY29sID0gY3VsbGluZ0NvbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBfb2Zmc2V0IGlzIHdob2xlIGxheWVyIG9mZnNldFxuICAgICAgICAgICAgICAgIC8vIHRpbGVPZmZzZXQgaXMgdGlsZXNldCBvZmZzZXQgd2hpY2ggaXMgcmVsYXRlZCB0byBlYWNoIGdyaWRcbiAgICAgICAgICAgICAgICAvLyB0aWxlT2Zmc2V0IGNvb3JkaW5hdGUgc3lzdGVtJ3MgeSBheGlzIGlzIG9wcG9zaXRlIHdpdGggZW5naW5lJ3MgeSBheGlzLlxuICAgICAgICAgICAgICAgIHRpbGVPZmZzZXQgPSBncmlkLnRpbGVzZXQudGlsZU9mZnNldDtcbiAgICAgICAgICAgICAgICBsZWZ0ICs9IHRoaXMuX29mZnNldC54ICsgdGlsZU9mZnNldC54O1xuICAgICAgICAgICAgICAgIGJvdHRvbSArPSB0aGlzLl9vZmZzZXQueSAtIHRpbGVPZmZzZXQueTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0b3BCb3JkZXIgPSAtdGlsZU9mZnNldC55ICsgZ3JpZC50aWxlc2V0Ll90aWxlU2l6ZS5oZWlnaHQgLSBtYXB0aDtcbiAgICAgICAgICAgICAgICB0b3BCb3JkZXIgPSB0b3BCb3JkZXIgPCAwID8gMCA6IHRvcEJvcmRlcjtcbiAgICAgICAgICAgICAgICBkb3duQm9yZGVyID0gdGlsZU9mZnNldC55IDwgMCA/IDAgOiB0aWxlT2Zmc2V0Lnk7XG4gICAgICAgICAgICAgICAgbGVmdEJvcmRlciA9IC10aWxlT2Zmc2V0LnggPCAwID8gMCA6IC10aWxlT2Zmc2V0Lng7XG4gICAgICAgICAgICAgICAgcmlnaHRCb3JkZXIgPSB0aWxlT2Zmc2V0LnggKyBncmlkLnRpbGVzZXQuX3RpbGVTaXplLndpZHRoIC0gbWFwdHc7XG4gICAgICAgICAgICAgICAgcmlnaHRCb3JkZXIgPSByaWdodEJvcmRlciA8IDAgPyAwIDogcmlnaHRCb3JkZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcmlnaHRPZmZzZXQgPCBsZWZ0Qm9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JpZ2h0T2Zmc2V0ID0gbGVmdEJvcmRlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGVmdE9mZnNldCA8IHJpZ2h0Qm9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xlZnRPZmZzZXQgPSByaWdodEJvcmRlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdG9wT2Zmc2V0IDwgZG93bkJvcmRlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90b3BPZmZzZXQgPSBkb3duQm9yZGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kb3duT2Zmc2V0IDwgdG9wQm9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rvd25PZmZzZXQgPSB0b3BCb3JkZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29sRGF0YS5sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgICAgICBjb2xEYXRhLmJvdHRvbSA9IGJvdHRvbTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGluZGV4IGlzIHRpbGVkbWFwIGdyaWQgaW5kZXhcbiAgICAgICAgICAgICAgICBjb2xEYXRhLmluZGV4ID0gaW5kZXg7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sT2Zmc2V0ICs9IGNvbHM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdmVydGljZXNEaXJ0eSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBUaWxlZFRpbGUgd2l0aCB0aGUgdGlsZSBjb29yZGluYXRlLjxici8+XG4gICAgICogSWYgdGhlcmUgaXMgbm8gdGlsZSBpbiB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGUgYW5kIGZvcmNlQ3JlYXRlIHBhcmFtZXRlciBpcyB0cnVlLCA8YnIvPlxuICAgICAqIHRoZW4gd2lsbCBjcmVhdGUgYSBuZXcgVGlsZWRUaWxlIGF0IHRoZSBjb29yZGluYXRlLlxuICAgICAqIFRoZSByZW5kZXJlciB3aWxsIHJlbmRlciB0aGUgdGlsZSB3aXRoIHRoZSByb3RhdGlvbiwgc2NhbGUsIHBvc2l0aW9uIGFuZCBjb2xvciBwcm9wZXJ0eSBvZiB0aGUgVGlsZWRUaWxlLlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4fmjIflrprnmoQgdGlsZSDlnZDmoIfojrflj5blr7nlupTnmoQgVGlsZWRUaWxl44CCIDxici8+XG4gICAgICog5aaC5p6c5oyH5a6a55qE5Z2Q5qCH5rKh5pyJIHRpbGXvvIzlubbkuJTorr7nva7kuoYgZm9yY2VDcmVhdGUg6YKj5LmI5bCG5Lya5Zyo5oyH5a6a55qE5Z2Q5qCH5Yib5bu65LiA5Liq5paw55qEIFRpbGVkVGlsZSDjgII8YnIvPlxuICAgICAqIOWcqOa4suafk+i/meS4qiB0aWxlIOeahOaXtuWAme+8jOWwhuS8muS9v+eUqCBUaWxlZFRpbGUg55qE6IqC54K555qE5peL6L2s44CB57yp5pS+44CB5L2N56e744CB6aKc6Imy5bGe5oCn44CCPGJyLz5cbiAgICAgKiBAbWV0aG9kIGdldFRpbGVkVGlsZUF0XG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB4XG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB5XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBmb3JjZUNyZWF0ZVxuICAgICAqIEByZXR1cm4ge2NjLlRpbGVkVGlsZX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCB0aWxlID0gdGlsZWRMYXllci5nZXRUaWxlZFRpbGVBdCgxMDAsIDEwMCwgdHJ1ZSk7XG4gICAgICogY2MubG9nKHRpbGUpO1xuICAgICAqL1xuICAgIGdldFRpbGVkVGlsZUF0ICh4LCB5LCBmb3JjZUNyZWF0ZSkge1xuICAgICAgICBpZiAodGhpcy5faXNJbnZhbGlkUG9zaXRpb24oeCwgeSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGVkTGF5ZXIuZ2V0VGlsZWRUaWxlQXQ6IGludmFsaWQgcG9zaXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl90aWxlcykge1xuICAgICAgICAgICAgY2MubG9nSUQoNzIzNik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoeCkgKyBNYXRoLmZsb29yKHkpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuX3RpbGVkVGlsZXNbaW5kZXhdO1xuICAgICAgICBpZiAoIXRpbGUgJiYgZm9yY2VDcmVhdGUpIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICAgICAgICAgIHRpbGUgPSBub2RlLmFkZENvbXBvbmVudChjYy5UaWxlZFRpbGUpO1xuICAgICAgICAgICAgdGlsZS5feCA9IHg7XG4gICAgICAgICAgICB0aWxlLl95ID0geTtcbiAgICAgICAgICAgIHRpbGUuX2xheWVyID0gdGhpcztcbiAgICAgICAgICAgIHRpbGUuX3VwZGF0ZUluZm8oKTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgcmV0dXJuIHRpbGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRpbGU7XG4gICAgfSxcblxuICAgIC8qKiBcbiAgICAgKiAhI2VuXG4gICAgICogQ2hhbmdlIHRpbGUgdG8gVGlsZWRUaWxlIGF0IHRoZSBzcGVjaWZpZWQgY29vcmRpbmF0ZS5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5oyH5a6a55qEIHRpbGUg5Z2Q5qCH5pu/5o2i5Li65oyH5a6a55qEIFRpbGVkVGlsZeOAglxuICAgICAqIEBtZXRob2Qgc2V0VGlsZWRUaWxlQXRcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHhcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHlcbiAgICAgKiBAcGFyYW0ge2NjLlRpbGVkVGlsZX0gdGlsZWRUaWxlXG4gICAgICogQHJldHVybiB7Y2MuVGlsZWRUaWxlfVxuICAgICAqL1xuICAgIHNldFRpbGVkVGlsZUF0ICh4LCB5LCB0aWxlZFRpbGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzSW52YWxpZFBvc2l0aW9uKHgsIHkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlZExheWVyLnNldFRpbGVkVGlsZUF0OiBpbnZhbGlkIHBvc2l0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fdGlsZXMpIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDcyMzYpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKHgpICsgTWF0aC5mbG9vcih5KSAqIHRoaXMuX2xheWVyU2l6ZS53aWR0aDtcbiAgICAgICAgdGhpcy5fdGlsZWRUaWxlc1tpbmRleF0gPSB0aWxlZFRpbGU7XG4gICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRpbGVkVGlsZSkge1xuICAgICAgICAgICAgdGhpcy5faGFzVGlsZWROb2RlR3JpZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9oYXNUaWxlZE5vZGVHcmlkID0gdGhpcy5fdGlsZWRUaWxlcy5zb21lKGZ1bmN0aW9uICh0aWxlZE5vZGUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhdGlsZWROb2RlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGlsZWRUaWxlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybiB0ZXh0dXJlLlxuICAgICAqICEjemgg6I635Y+W57q555CG44CCXG4gICAgICogQG1ldGhvZCBnZXRUZXh0dXJlXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0ZXh0dXJlc1xuICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH1cbiAgICAgKi9cbiAgICBnZXRUZXh0dXJlIChpbmRleCkge1xuICAgICAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlcyAmJiBpbmRleCA+PSAwICYmIHRoaXMuX3RleHR1cmVzLmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZXNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybiB0ZXh0dXJlLlxuICAgICAqICEjemgg6I635Y+W57q555CG44CCXG4gICAgICogQG1ldGhvZCBnZXRUZXh0dXJlc1xuICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH1cbiAgICAgKi9cbiAgICBnZXRUZXh0dXJlcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva7nurnnkIbjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZVxuICAgICAqL1xuICAgIHNldFRleHR1cmUgKHRleHR1cmUpe1xuICAgICAgICB0aGlzLnNldFRleHR1cmVzKFt0ZXh0dXJlXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6K6+572u57q555CG44CCXG4gICAgICogQG1ldGhvZCBzZXRUZXh0dXJlXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVzXG4gICAgICovXG4gICAgc2V0VGV4dHVyZXMgKHRleHR1cmVzKSB7XG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0gdGV4dHVyZXM7XG4gICAgICAgIHRoaXMuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGxheWVyIHNpemUuXG4gICAgICogISN6aCDojrflvpflsYLlpKflsI/jgIJcbiAgICAgKiBAbWV0aG9kIGdldExheWVyU2l6ZVxuICAgICAqIEByZXR1cm4ge1NpemV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgc2l6ZSA9IHRpbGVkTGF5ZXIuZ2V0TGF5ZXJTaXplKCk7XG4gICAgICogY2MubG9nKFwibGF5ZXIgc2l6ZTogXCIgKyBzaXplKTtcbiAgICAgKi9cbiAgICBnZXRMYXllclNpemUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJTaXplO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNpemUgb2YgdGhlIG1hcCdzIHRpbGUgKGNvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSB0aWxlJ3Mgc2l6ZSkuXG4gICAgICogISN6aCDojrflj5YgdGlsZSDnmoTlpKflsI8oIHRpbGUg55qE5aSn5bCP5Y+v6IO95Lya5pyJ5omA5LiN5ZCMKeOAglxuICAgICAqIEBtZXRob2QgZ2V0TWFwVGlsZVNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IG1hcFRpbGVTaXplID0gdGlsZWRMYXllci5nZXRNYXBUaWxlU2l6ZSgpO1xuICAgICAqIGNjLmxvZyhcIk1hcFRpbGUgc2l6ZTogXCIgKyBtYXBUaWxlU2l6ZSk7XG4gICAgICovXG4gICAgZ2V0TWFwVGlsZVNpemUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwVGlsZVNpemU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBUaWxlIHNldCBmaXJzdCBpbmZvcm1hdGlvbiBmb3IgdGhlIGxheWVyLlxuICAgICAqICEjemgg6I635Y+WIGxheWVyIOe0ouW8leS9jee9ruS4ujDnmoQgVGlsZXNldCDkv6Hmga/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFRpbGVTZXRcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRpbGVzZXRzXG4gICAgICogQHJldHVybiB7VE1YVGlsZXNldEluZm99XG4gICAgICovXG4gICAgZ2V0VGlsZVNldCAoaW5kZXgpIHtcbiAgICAgICAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAgICAgICBpZiAodGhpcy5fdGlsZXNldHMgJiYgaW5kZXggPj0gMCAmJiB0aGlzLl90aWxlc2V0cy5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVzZXRzW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRpbGUgc2V0IGFsbCBpbmZvcm1hdGlvbiBmb3IgdGhlIGxheWVyLlxuICAgICAqICEjemgg6I635Y+WIGxheWVyIOaJgOacieeahCBUaWxlc2V0IOS/oeaBr+OAglxuICAgICAqIEBtZXRob2QgZ2V0VGlsZVNldFxuICAgICAqIEByZXR1cm4ge1RNWFRpbGVzZXRJbmZvfVxuICAgICAqL1xuICAgIGdldFRpbGVTZXRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVzZXRzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGlsZSBzZXQgaW5mb3JtYXRpb24gZm9yIHRoZSBsYXllci5cbiAgICAgKiAhI3poIOiuvue9riBsYXllciDnmoQgdGlsZXNldCDkv6Hmga/jgIJcbiAgICAgKiBAbWV0aG9kIHNldFRpbGVTZXRcbiAgICAgKiBAcGFyYW0ge1RNWFRpbGVzZXRJbmZvfSB0aWxlc2V0XG4gICAgICovXG4gICAgc2V0VGlsZVNldCAodGlsZXNldCkge1xuICAgICAgICB0aGlzLnNldFRpbGVTZXRzKFt0aWxlc2V0XSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBUaWxlIHNldCBpbmZvcm1hdGlvbiBmb3IgdGhlIGxheWVyLlxuICAgICAqICEjemgg6K6+572uIGxheWVyIOeahCBUaWxlc2V0IOS/oeaBr+OAglxuICAgICAqIEBtZXRob2Qgc2V0VGlsZVNldHNcbiAgICAgKiBAcGFyYW0ge1RNWFRpbGVzZXRJbmZvfSB0aWxlc2V0c1xuICAgICAqL1xuICAgIHNldFRpbGVTZXRzICh0aWxlc2V0cykge1xuICAgICAgICB0aGlzLl90aWxlc2V0cyA9IHRpbGVzZXRzO1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSB0aGlzLl90ZXh0dXJlcyA9IFtdO1xuICAgICAgICBsZXQgdGV4R3JpZHMgPSB0aGlzLl90ZXhHcmlkcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdGlsZXNldCA9IHRpbGVzZXRzW2ldO1xuICAgICAgICAgICAgaWYgKHRpbGVzZXQpIHtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlc1tpXSA9IHRpbGVzZXQuc291cmNlSW1hZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYy5UaWxlZE1hcC5sb2FkQWxsVGV4dHVyZXMgKHRleHR1cmVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRpbGVzZXRzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCB0aWxlc2V0SW5mbyA9IHRpbGVzZXRzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghdGlsZXNldEluZm8pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNjLlRpbGVkTWFwLmZpbGxUZXh0dXJlR3JpZHModGlsZXNldEluZm8sIHRleEdyaWRzLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVUb1JlbmRlcigpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBfdHJhdmVyc2VBbGxHcmlkICgpIHtcbiAgICAgICAgbGV0IHRpbGVzID0gdGhpcy5fdGlsZXM7XG4gICAgICAgIGxldCB0ZXhHcmlkcyA9IHRoaXMuX3RleEdyaWRzO1xuICAgICAgICBsZXQgdGlsZXNldEluZGV4QXJyID0gdGhpcy5fdGlsZXNldEluZGV4QXJyO1xuICAgICAgICBsZXQgdGlsZXNldElkeE1hcCA9IHt9O1xuXG4gICAgICAgIGNvbnN0IFRpbGVkTWFwID0gY2MuVGlsZWRNYXA7XG4gICAgICAgIGNvbnN0IFRpbGVGbGFnID0gVGlsZWRNYXAuVGlsZUZsYWc7XG4gICAgICAgIGNvbnN0IEZMSVBQRURfTUFTSyA9IFRpbGVGbGFnLkZMSVBQRURfTUFTSztcblxuICAgICAgICB0aWxlc2V0SW5kZXhBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGdpZCA9IHRpbGVzW2ldO1xuICAgICAgICAgICAgaWYgKGdpZCA9PT0gMCkgY29udGludWU7XG4gICAgICAgICAgICBnaWQgPSAoKGdpZCAmIEZMSVBQRURfTUFTSykgPj4+IDApO1xuICAgICAgICAgICAgbGV0IGdyaWQgPSB0ZXhHcmlkc1tnaWRdO1xuICAgICAgICAgICAgaWYgKCFncmlkKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoXCJDQ1RpbGVkTGF5ZXI6X3RyYXZlcnNlQWxsR3JpZCBncmlkIGlzIG51bGwsIGdpZCBpczpcIiwgZ2lkKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB0aWxlc2V0SWR4ID0gZ3JpZC50ZXhJZDtcbiAgICAgICAgICAgIGlmICh0aWxlc2V0SWR4TWFwW3RpbGVzZXRJZHhdKSBjb250aW51ZTtcbiAgICAgICAgICAgIHRpbGVzZXRJZHhNYXBbdGlsZXNldElkeF0gPSB0cnVlO1xuICAgICAgICAgICAgdGlsZXNldEluZGV4QXJyLnB1c2godGlsZXNldElkeCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXQgKGxheWVySW5mbywgbWFwSW5mbywgdGlsZXNldHMsIHRleHR1cmVzLCB0ZXhHcmlkcykge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbGF5ZXJJbmZvID0gbGF5ZXJJbmZvO1xuICAgICAgICB0aGlzLl9tYXBJbmZvID0gbWFwSW5mbztcblxuICAgICAgICBsZXQgc2l6ZSA9IGxheWVySW5mby5fbGF5ZXJTaXplO1xuXG4gICAgICAgIC8vIGxheWVySW5mb1xuICAgICAgICB0aGlzLl9sYXllck5hbWUgPSBsYXllckluZm8ubmFtZTtcbiAgICAgICAgdGhpcy5fdGlsZXMgPSBsYXllckluZm8uX3RpbGVzO1xuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gbGF5ZXJJbmZvLnByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMuX2xheWVyU2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuX21pbkdJRCA9IGxheWVySW5mby5fbWluR0lEO1xuICAgICAgICB0aGlzLl9tYXhHSUQgPSBsYXllckluZm8uX21heEdJRDtcbiAgICAgICAgdGhpcy5fb3BhY2l0eSA9IGxheWVySW5mby5fb3BhY2l0eTtcbiAgICAgICAgdGhpcy5fcmVuZGVyT3JkZXIgPSBtYXBJbmZvLnJlbmRlck9yZGVyO1xuICAgICAgICB0aGlzLl9zdGFnZ2VyQXhpcyA9IG1hcEluZm8uZ2V0U3RhZ2dlckF4aXMoKTtcbiAgICAgICAgdGhpcy5fc3RhZ2dlckluZGV4ID0gbWFwSW5mby5nZXRTdGFnZ2VySW5kZXgoKTtcbiAgICAgICAgdGhpcy5faGV4U2lkZUxlbmd0aCA9IG1hcEluZm8uZ2V0SGV4U2lkZUxlbmd0aCgpO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25zID0gbWFwSW5mby5nZXRUaWxlQW5pbWF0aW9ucygpO1xuXG4gICAgICAgIC8vIHRpbGVzZXRzXG4gICAgICAgIHRoaXMuX3RpbGVzZXRzID0gdGlsZXNldHM7XG4gICAgICAgIC8vIHRleHR1cmVzXG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0gdGV4dHVyZXM7XG4gICAgICAgIC8vIGdyaWQgdGV4dHVyZVxuICAgICAgICB0aGlzLl90ZXhHcmlkcyA9IHRleEdyaWRzO1xuXG4gICAgICAgIC8vIG1hcEluZm9cbiAgICAgICAgdGhpcy5fbGF5ZXJPcmllbnRhdGlvbiA9IG1hcEluZm8ub3JpZW50YXRpb247XG4gICAgICAgIHRoaXMuX21hcFRpbGVTaXplID0gbWFwSW5mby5nZXRUaWxlU2l6ZSgpO1xuXG4gICAgICAgIGxldCBtYXB0dyA9IHRoaXMuX21hcFRpbGVTaXplLndpZHRoO1xuICAgICAgICBsZXQgbWFwdGggPSB0aGlzLl9tYXBUaWxlU2l6ZS5oZWlnaHQ7XG4gICAgICAgIGxldCBsYXllclcgPSB0aGlzLl9sYXllclNpemUud2lkdGg7XG4gICAgICAgIGxldCBsYXllckggPSB0aGlzLl9sYXllclNpemUuaGVpZ2h0O1xuXG4gICAgICAgIGlmICh0aGlzLl9sYXllck9yaWVudGF0aW9uID09PSBjYy5UaWxlZE1hcC5PcmllbnRhdGlvbi5IRVgpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBoZXggbWFwXG4gICAgICAgICAgICBjb25zdCBUaWxlZE1hcCA9IGNjLlRpbGVkTWFwO1xuICAgICAgICAgICAgY29uc3QgU3RhZ2dlckF4aXMgPSBUaWxlZE1hcC5TdGFnZ2VyQXhpcztcbiAgICAgICAgICAgIGNvbnN0IFN0YWdnZXJJbmRleCA9IFRpbGVkTWFwLlN0YWdnZXJJbmRleDsgICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IDAsIGhlaWdodCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuX29kZF9ldmVuID0gKHRoaXMuX3N0YWdnZXJJbmRleCA9PT0gU3RhZ2dlckluZGV4LlNUQUdHRVJJTkRFWF9PREQpID8gMSA6IC0xO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YWdnZXJBeGlzID09PSBTdGFnZ2VyQXhpcy5TVEFHR0VSQVhJU19YKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlmZlgxID0gKG1hcHR3IC0gdGhpcy5faGV4U2lkZUxlbmd0aCkgLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RpZmZZMSA9IDA7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gbWFwdGggKiAobGF5ZXJIICsgMC41KTtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IChtYXB0dyArIHRoaXMuX2hleFNpZGVMZW5ndGgpICogTWF0aC5mbG9vcihsYXllclcgLyAyKSArIG1hcHR3ICogKGxheWVyVyAlIDIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWZmWDEgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RpZmZZMSA9IChtYXB0aCAtIHRoaXMuX2hleFNpZGVMZW5ndGgpIC8gMjtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IG1hcHR3ICogKGxheWVyVyArIDAuNSk7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gKG1hcHRoICsgdGhpcy5faGV4U2lkZUxlbmd0aCkgKiBNYXRoLmZsb29yKGxheWVySCAvIDIpICsgbWFwdGggKiAobGF5ZXJIICUgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbiA9PT0gY2MuVGlsZWRNYXAuT3JpZW50YXRpb24uSVNPKSB7XG4gICAgICAgICAgICBsZXQgd2ggPSBsYXllclcgKyBsYXllckg7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUobWFwdHcgKiAwLjUgKiB3aCwgbWFwdGggKiAwLjUgKiB3aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUobGF5ZXJXICogbWFwdHcsIGxheWVySCAqIG1hcHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9mZnNldCAoYWZ0ZXIgbGF5ZXIgb3JpZW50YXRpb24gaXMgc2V0KTtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gY2MudjIobGF5ZXJJbmZvLm9mZnNldC54LCAtbGF5ZXJJbmZvLm9mZnNldC55KTtcbiAgICAgICAgdGhpcy5fdXNlQXV0b21hdGljVmVydGV4WiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl92ZXJ0ZXhadmFsdWUgPSAwO1xuICAgICAgICB0aGlzLl9zeW5jQW5jaG9yUG9pbnQoKTtcbiAgICAgICAgdGhpcy5fcHJlcGFyZVRvUmVuZGVyKCk7XG4gICAgfSxcblxuICAgIF9wcmVwYXJlVG9SZW5kZXIgKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVWZXJ0aWNlcygpO1xuICAgICAgICB0aGlzLl90cmF2ZXJzZUFsbEdyaWQoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlQWxsVXNlck5vZGUoKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICBfYWN0aXZhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGxldCB0aWxlc2V0SW5kZXhBcnIgPSB0aGlzLl90aWxlc2V0SW5kZXhBcnI7XG4gICAgICAgIGlmICh0aWxlc2V0SW5kZXhBcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0ZXhJZE1hdElkeCA9IHRoaXMuX3RleElkVG9NYXRJbmRleCA9IHt9O1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSB0aGlzLl90ZXh0dXJlcztcbiAgICAgICAgbGV0IG1hdExlbiA9IHRpbGVzZXRJbmRleEFyci5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRMZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHRpbGVzZXRJZHggPSB0aWxlc2V0SW5kZXhBcnJbaV07XG4gICAgICAgICAgICBsZXQgdGV4dHVyZSA9IHRleHR1cmVzW3RpbGVzZXRJZHhdO1xuXG4gICAgICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbHNbaV07XG4gICAgICAgICAgICBpZiAoIW1hdGVyaWFsKSB7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSBNYXRlcmlhbC5nZXRCdWlsdGluTWF0ZXJpYWwoJzJkLXNwcml0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlKG1hdGVyaWFsLCB0aGlzKTtcblxuICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB0cnVlKTtcbiAgICAgICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGV4dHVyZSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsc1tpXSA9IG1hdGVyaWFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ZXhJZE1hdElkeFt0aWxlc2V0SWR4XSA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxzLmxlbmd0aCA9IG1hdExlbjtcbiAgICAgICAgdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgIH1cbn0pO1xuXG5jYy5UaWxlZExheWVyID0gbW9kdWxlLmV4cG9ydHMgPSBUaWxlZExheWVyO1xuIl19