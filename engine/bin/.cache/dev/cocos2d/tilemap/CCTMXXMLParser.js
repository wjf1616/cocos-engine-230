
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTMXXMLParser.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var codec = require('../compression/ZipUtils');

var zlib = require('../compression/zlib.min');

var js = require('../core/platform/js');

require('../core/platform/CCSAXParser');

function uint8ArrayToUint32Array(uint8Arr) {
  if (uint8Arr.length % 4 !== 0) return null;
  var arrLen = uint8Arr.length / 4;
  var retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];

  for (var i = 0; i < arrLen; i++) {
    var offset = i * 4;
    retArr[i] = uint8Arr[offset] + uint8Arr[offset + 1] * (1 << 8) + uint8Arr[offset + 2] * (1 << 16) + uint8Arr[offset + 3] * (1 << 24);
  }

  return retArr;
} // Bits on the far end of the 32-bit global tile ID (GID's) are used for tile flags

/**
 * <p>cc.TMXLayerInfo contains the information about the layers like: <br />
 * - Layer name<br />
 * - Layer size <br />
 * - Layer opacity at creation time (it can be modified at runtime)  <br />
 * - Whether the layer is visible (if it's not visible, then the CocosNode won't be created) <br />
 *  <br />
 * This information is obtained from the TMX file.</p>
 * @class TMXLayerInfo
 *
 * @property {Array}    properties  - Properties of the layer info.
 */


cc.TMXLayerInfo = function () {
  this.properties = {};
  this.name = "";
  this._layerSize = null;
  this._tiles = [];
  this.visible = true;
  this._opacity = 0;
  this.ownTiles = true;
  this._minGID = 100000;
  this._maxGID = 0;
  this.offset = cc.v2(0, 0);
};

cc.TMXLayerInfo.prototype = {
  constructor: cc.TMXLayerInfo,

  /**
   * Gets the Properties.
   * @return {Array}
   */
  getProperties: function getProperties() {
    return this.properties;
  },

  /**
   * Set the Properties.
   * @param {object} value
   */
  setProperties: function setProperties(value) {
    this.properties = value;
  }
};
/**
 * cc.TMXImageLayerInfo contains the information about the image layers.
 * This information is obtained from the TMX file.
 * @class TMXImageLayerInfo
 */

cc.TMXImageLayerInfo = function () {
  this.name = "";
  this.visible = true;
  this.width = 0;
  this.height = 0;
  this.offset = cc.v2(0, 0);
  this._opacity = 0;
  this._trans = new cc.Color(255, 255, 255, 255);
  this.sourceImage = null;
};
/**
 * <p>cc.TMXObjectGroupInfo contains the information about the object group like: <br />
 * - group name<br />
 * - group size <br />
 * - group opacity at creation time (it can be modified at runtime)  <br />
 * - Whether the group is visible <br />
 *  <br />
 * This information is obtained from the TMX file.</p>
 * @class TMXObjectGroupInfo
 *
 * @property {Array}    properties  - Properties of the ObjectGroup info.
 */


cc.TMXObjectGroupInfo = function () {
  this.properties = {};
  this.name = "";
  this._objects = [];
  this.visible = true;
  this._opacity = 0;
  this._color = new cc.Color(255, 255, 255, 255);
  this.offset = cc.v2(0, 0);
  this._draworder = 'topdown';
};

cc.TMXObjectGroupInfo.prototype = {
  constructor: cc.TMXObjectGroupInfo,

  /**
   * Gets the Properties.
   * @return {Array}
   */
  getProperties: function getProperties() {
    return this.properties;
  },

  /**
   * Set the Properties.
   * @param {object} value
   */
  setProperties: function setProperties(value) {
    this.properties = value;
  }
};
/**
 * <p>cc.TMXTilesetInfo contains the information about the tilesets like: <br />
 * - Tileset name<br />
 * - Tileset spacing<br />
 * - Tileset margin<br />
 * - size of the tiles<br />
 * - Image used for the tiles<br />
 * - Image size<br />
 *
 * This information is obtained from the TMX file. </p>
 * @class TMXTilesetInfo
 *
 * @property {string} name - Tileset name
 * @property {number} firstGid - First grid
 * @property {number} spacing - Spacing
 * @property {number} margin - Margin
 * @property {null} sourceImage - Texture containing the tiles (should be sprite sheet / texture atlas)
 * @property {cc.Size} imageSize - Size in pixels of the image
 */

cc.TMXTilesetInfo = function () {
  // Tileset name
  this.name = ""; // First grid

  this.firstGid = 0; // Spacing

  this.spacing = 0; // Margin

  this.margin = 0; // Texture containing the tiles (should be sprite sheet / texture atlas)

  this.sourceImage = null; // Size in pixels of the image

  this.imageSize = cc.size(0, 0);
  this.tileOffset = cc.v2(0, 0);
  this._tileSize = cc.size(0, 0);
};

cc.TMXTilesetInfo.prototype = {
  constructor: cc.TMXTilesetInfo,

  /**
   * Return rect
   * @param {Number} gid
   * @return {Rect}
   */
  rectForGID: function rectForGID(gid, result) {
    var rect = result || cc.rect(0, 0, 0, 0);
    rect.width = this._tileSize.width;
    rect.height = this._tileSize.height;
    gid &= cc.TiledMap.TileFlag.FLIPPED_MASK;
    gid = gid - parseInt(this.firstGid, 10);
    var max_x = parseInt((this.imageSize.width - this.margin * 2 + this.spacing) / (this._tileSize.width + this.spacing), 10);
    rect.x = parseInt(gid % max_x * (this._tileSize.width + this.spacing) + this.margin, 10);
    rect.y = parseInt(parseInt(gid / max_x, 10) * (this._tileSize.height + this.spacing) + this.margin, 10);
    return rect;
  }
};

function strToHAlign(value) {
  var hAlign = cc.Label.HorizontalAlign;

  switch (value) {
    case 'center':
      return hAlign.CENTER;

    case 'right':
      return hAlign.RIGHT;

    default:
      return hAlign.LEFT;
  }
}

function strToVAlign(value) {
  var vAlign = cc.Label.VerticalAlign;

  switch (value) {
    case 'center':
      return vAlign.CENTER;

    case 'bottom':
      return vAlign.BOTTOM;

    default:
      return vAlign.TOP;
  }
}

function strToColor(value) {
  if (!value) {
    return cc.color(0, 0, 0, 255);
  }

  value = value.indexOf('#') !== -1 ? value.substring(1) : value;

  if (value.length === 8) {
    var a = parseInt(value.substr(0, 2), 16) || 255;
    var r = parseInt(value.substr(2, 2), 16) || 0;
    var g = parseInt(value.substr(4, 2), 16) || 0;
    var b = parseInt(value.substr(6, 2), 16) || 0;
    return cc.color(r, g, b, a);
  } else {
    var _r = parseInt(value.substr(0, 2), 16) || 0;

    var _g = parseInt(value.substr(2, 2), 16) || 0;

    var _b = parseInt(value.substr(4, 2), 16) || 0;

    return cc.color(_r, _g, _b, 255);
  }
}

function getPropertyList(node, map) {
  var res = [];
  var properties = node.getElementsByTagName("properties");

  for (var i = 0; i < properties.length; ++i) {
    var property = properties[i].getElementsByTagName("property");

    for (var j = 0; j < property.length; ++j) {
      res.push(property[j]);
    }
  }

  map = map || {};

  for (var _i = 0; _i < res.length; _i++) {
    var element = res[_i];
    var name = element.getAttribute('name');
    var type = element.getAttribute('type') || 'string';
    var value = element.getAttribute('value');

    if (type === 'int') {
      value = parseInt(value);
    } else if (type === 'float') {
      value = parseFloat(value);
    } else if (type === 'bool') {
      value = value === 'true';
    } else if (type === 'color') {
      value = strToColor(value);
    }

    map[name] = value;
  }

  return map;
}
/**
 * <p>cc.TMXMapInfo contains the information about the map like: <br/>
 *- Map orientation (hexagonal, isometric or orthogonal)<br/>
 *- Tile size<br/>
 *- Map size</p>
 *
 * <p>And it also contains: <br/>
 * - Layers (an array of TMXLayerInfo objects)<br/>
 * - Tilesets (an array of TMXTilesetInfo objects) <br/>
 * - ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
 *
 * <p>This information is obtained from the TMX file. </p>
 * @class
 *
 * @property {Array}    properties          - Properties of the map info.
 * @property {Number}   orientation         - Map orientation.
 * @property {Object}   parentElement       - Parent element.
 * @property {Number}   parentGID           - Parent GID.
 * @property {Object}   layerAttrs        - Layer attributes.
 * @property {Boolean}  storingCharacters   - Is reading storing characters stream.
 * @property {String}   currentString       - Current string stored from characters stream.
 * @property {Number}   mapWidth            - Width of the map
 * @property {Number}   mapHeight           - Height of the map
 * @property {Number}   tileWidth           - Width of a tile
 * @property {Number}   tileHeight          - Height of a tile
 * @example
 * 1.
 * //create a TMXMapInfo with file name
 * let tmxMapInfo = new cc.TMXMapInfo("res/orthogonal-test1.tmx");
 * 2.
 * //create a TMXMapInfo with content string and resource path
 * let resources = "res/TileMaps";
 * let filePath = "res/TileMaps/orthogonal-test1.tmx";
 * let xmlStr = cc.loader.getRes(filePath);
 * let tmxMapInfo = new cc.TMXMapInfo(xmlStr, resources);
 */

/**
 * Creates a TMX Format with a tmx file or content string                           <br/>
 * Constructor of cc.TMXMapInfo
 * @method constructor
 * @param {String} tmxFile content string
 * @param {Object} tsxMap
 * @param {Object} textures
 */


cc.TMXMapInfo = function (tmxFile, tsxMap, textures, textureSizes, imageLayerTextures) {
  this.properties = [];
  this.orientation = null;
  this.parentElement = null;
  this.parentGID = null;
  this.layerAttrs = 0;
  this.storingCharacters = false;
  this.currentString = null;
  this.renderOrder = cc.TiledMap.RenderOrder.RightDown;
  this._supportVersion = [1, 2, 0];
  this._parser = new cc.SAXParser();
  this._objectGroups = [];
  this._allChildren = [];
  this._mapSize = cc.size(0, 0);
  this._tileSize = cc.size(0, 0);
  this._layers = [];
  this._tilesets = [];
  this._imageLayers = [];
  this._tileProperties = {};
  this._tileAnimations = {};
  this._tsxMap = null; // map of textures indexed by name

  this._textures = null; // hex map values

  this._staggerAxis = null;
  this._staggerIndex = null;
  this._hexSideLength = 0;
  this._imageLayerTextures = null;
  this.initWithXML(tmxFile, tsxMap, textures, textureSizes, imageLayerTextures);
};

cc.TMXMapInfo.prototype = {
  constructor: cc.TMXMapInfo,

  /**
   * Gets Map orientation.
   * @return {Number}
   */
  getOrientation: function getOrientation() {
    return this.orientation;
  },

  /**
   * Set the Map orientation.
   * @param {Number} value
   */
  setOrientation: function setOrientation(value) {
    this.orientation = value;
  },

  /**
   * Gets the staggerAxis of map.
   * @return {cc.TiledMap.StaggerAxis}
   */
  getStaggerAxis: function getStaggerAxis() {
    return this._staggerAxis;
  },

  /**
   * Set the staggerAxis of map.
   * @param {cc.TiledMap.StaggerAxis} value
   */
  setStaggerAxis: function setStaggerAxis(value) {
    this._staggerAxis = value;
  },

  /**
   * Gets stagger index
   * @return {cc.TiledMap.StaggerIndex}
   */
  getStaggerIndex: function getStaggerIndex() {
    return this._staggerIndex;
  },

  /**
   * Set the stagger index.
   * @param {cc.TiledMap.StaggerIndex} value
   */
  setStaggerIndex: function setStaggerIndex(value) {
    this._staggerIndex = value;
  },

  /**
   * Gets Hex side length.
   * @return {Number}
   */
  getHexSideLength: function getHexSideLength() {
    return this._hexSideLength;
  },

  /**
   * Set the Hex side length.
   * @param {Number} value
   */
  setHexSideLength: function setHexSideLength(value) {
    this._hexSideLength = value;
  },

  /**
   * Map width & height
   * @return {Size}
   */
  getMapSize: function getMapSize() {
    return cc.size(this._mapSize.width, this._mapSize.height);
  },

  /**
   * Map width & height
   * @param {Size} value
   */
  setMapSize: function setMapSize(value) {
    this._mapSize.width = value.width;
    this._mapSize.height = value.height;
  },
  _getMapWidth: function _getMapWidth() {
    return this._mapSize.width;
  },
  _setMapWidth: function _setMapWidth(width) {
    this._mapSize.width = width;
  },
  _getMapHeight: function _getMapHeight() {
    return this._mapSize.height;
  },
  _setMapHeight: function _setMapHeight(height) {
    this._mapSize.height = height;
  },

  /**
   * Tiles width & height
   * @return {Size}
   */
  getTileSize: function getTileSize() {
    return cc.size(this._tileSize.width, this._tileSize.height);
  },

  /**
   * Tiles width & height
   * @param {Size} value
   */
  setTileSize: function setTileSize(value) {
    this._tileSize.width = value.width;
    this._tileSize.height = value.height;
  },
  _getTileWidth: function _getTileWidth() {
    return this._tileSize.width;
  },
  _setTileWidth: function _setTileWidth(width) {
    this._tileSize.width = width;
  },
  _getTileHeight: function _getTileHeight() {
    return this._tileSize.height;
  },
  _setTileHeight: function _setTileHeight(height) {
    this._tileSize.height = height;
  },

  /**
   * Layers
   * @return {Array}
   */
  getLayers: function getLayers() {
    return this._layers;
  },

  /**
   * Layers
   * @param {cc.TMXLayerInfo} value
   */
  setLayers: function setLayers(value) {
    this._allChildren.push(value);

    this._layers.push(value);
  },

  /**
   * ImageLayers
   * @return {Array}
   */
  getImageLayers: function getImageLayers() {
    return this._imageLayers;
  },

  /**
   * ImageLayers
   * @param {cc.TMXImageLayerInfo} value
   */
  setImageLayers: function setImageLayers(value) {
    this._allChildren.push(value);

    this._imageLayers.push(value);
  },

  /**
   * tilesets
   * @return {Array}
   */
  getTilesets: function getTilesets() {
    return this._tilesets;
  },

  /**
   * tilesets
   * @param {cc.TMXTilesetInfo} value
   */
  setTilesets: function setTilesets(value) {
    this._tilesets.push(value);
  },

  /**
   * ObjectGroups
   * @return {Array}
   */
  getObjectGroups: function getObjectGroups() {
    return this._objectGroups;
  },

  /**
   * ObjectGroups
   * @param {cc.TMXObjectGroup} value
   */
  setObjectGroups: function setObjectGroups(value) {
    this._allChildren.push(value);

    this._objectGroups.push(value);
  },
  getAllChildren: function getAllChildren() {
    return this._allChildren;
  },

  /**
   * parent element
   * @return {Object}
   */
  getParentElement: function getParentElement() {
    return this.parentElement;
  },

  /**
   * parent element
   * @param {Object} value
   */
  setParentElement: function setParentElement(value) {
    this.parentElement = value;
  },

  /**
   * parent GID
   * @return {Number}
   */
  getParentGID: function getParentGID() {
    return this.parentGID;
  },

  /**
   * parent GID
   * @param {Number} value
   */
  setParentGID: function setParentGID(value) {
    this.parentGID = value;
  },

  /**
   * Layer attribute
   * @return {Object}
   */
  getLayerAttribs: function getLayerAttribs() {
    return this.layerAttrs;
  },

  /**
   * Layer attribute
   * @param {Object} value
   */
  setLayerAttribs: function setLayerAttribs(value) {
    this.layerAttrs = value;
  },

  /**
   * Is reading storing characters stream
   * @return {Boolean}
   */
  getStoringCharacters: function getStoringCharacters() {
    return this.storingCharacters;
  },

  /**
   * Is reading storing characters stream
   * @param {Boolean} value
   */
  setStoringCharacters: function setStoringCharacters(value) {
    this.storingCharacters = value;
  },

  /**
   * Properties
   * @return {Array}
   */
  getProperties: function getProperties() {
    return this.properties;
  },

  /**
   * Properties
   * @param {object} value
   */
  setProperties: function setProperties(value) {
    this.properties = value;
  },

  /**
   * initializes a TMX format with an XML string and a TMX resource path
   * @param {String} tmxString
   * @param {Object} tsxMap
   * @param {Object} textures
   * @return {Boolean}
   */
  initWithXML: function initWithXML(tmxString, tsxMap, textures, textureSizes, imageLayerTextures) {
    this._tilesets.length = 0;
    this._layers.length = 0;
    this._imageLayers.length = 0;
    this._tsxMap = tsxMap;
    this._textures = textures;
    this._imageLayerTextures = imageLayerTextures;
    this._textureSizes = textureSizes;
    this._objectGroups.length = 0;
    this._allChildren.length = 0;
    this.properties.length = 0;
    this._tileProperties = {};
    this._tileAnimations = {}; // tmp vars

    this.currentString = "";
    this.storingCharacters = false;
    this.layerAttrs = cc.TMXLayerInfo.ATTRIB_NONE;
    this.parentElement = cc.TiledMap.NONE;
    return this.parseXMLString(tmxString);
  },

  /**
   * Initializes parsing of an XML string, either a tmx (Map) string or tsx (Tileset) string
   * @param {String} xmlString
   * @param {Number} tilesetFirstGid
   * @return {Element}
   */
  parseXMLString: function parseXMLString(xmlStr, tilesetFirstGid) {
    var mapXML = this._parser._parseXML(xmlStr);

    var i; // PARSE <map>

    var map = mapXML.documentElement;
    var orientationStr = map.getAttribute('orientation');
    var staggerAxisStr = map.getAttribute('staggeraxis');
    var staggerIndexStr = map.getAttribute('staggerindex');
    var hexSideLengthStr = map.getAttribute('hexsidelength');
    var renderorderStr = map.getAttribute('renderorder');
    var version = map.getAttribute('version') || '1.0.0';

    if (map.nodeName === "map") {
      var versionArr = version.split('.');
      var supportVersion = this._supportVersion;

      for (var _i2 = 0; _i2 < supportVersion.length; _i2++) {
        var v = parseInt(versionArr[_i2]) || 0;
        var sv = supportVersion[_i2];

        if (sv < v) {
          cc.logID(7216, version);
          break;
        }
      }

      if (orientationStr === "orthogonal") this.orientation = cc.TiledMap.Orientation.ORTHO;else if (orientationStr === "isometric") this.orientation = cc.TiledMap.Orientation.ISO;else if (orientationStr === "hexagonal") this.orientation = cc.TiledMap.Orientation.HEX;else if (orientationStr !== null) cc.logID(7217, orientationStr);

      if (renderorderStr === 'right-up') {
        this.renderOrder = cc.TiledMap.RenderOrder.RightUp;
      } else if (renderorderStr === 'left-up') {
        this.renderOrder = cc.TiledMap.RenderOrder.LeftUp;
      } else if (renderorderStr === 'left-down') {
        this.renderOrder = cc.TiledMap.RenderOrder.LeftDown;
      } else {
        this.renderOrder = cc.TiledMap.RenderOrder.RightDown;
      }

      if (staggerAxisStr === 'x') {
        this.setStaggerAxis(cc.TiledMap.StaggerAxis.STAGGERAXIS_X);
      } else if (staggerAxisStr === 'y') {
        this.setStaggerAxis(cc.TiledMap.StaggerAxis.STAGGERAXIS_Y);
      }

      if (staggerIndexStr === 'odd') {
        this.setStaggerIndex(cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD);
      } else if (staggerIndexStr === 'even') {
        this.setStaggerIndex(cc.TiledMap.StaggerIndex.STAGGERINDEX_EVEN);
      }

      if (hexSideLengthStr) {
        this.setHexSideLength(parseFloat(hexSideLengthStr));
      }

      var mapSize = cc.size(0, 0);
      mapSize.width = parseFloat(map.getAttribute('width'));
      mapSize.height = parseFloat(map.getAttribute('height'));
      this.setMapSize(mapSize);
      mapSize = cc.size(0, 0);
      mapSize.width = parseFloat(map.getAttribute('tilewidth'));
      mapSize.height = parseFloat(map.getAttribute('tileheight'));
      this.setTileSize(mapSize); // The parent element is the map

      this.properties = getPropertyList(map);
    } // PARSE <tileset>


    var tilesets = map.getElementsByTagName('tileset');

    if (map.nodeName !== "map") {
      tilesets = [];
      tilesets.push(map);
    }

    for (i = 0; i < tilesets.length; i++) {
      var selTileset = tilesets[i]; // If this is an external tileset then start parsing that

      var tsxName = selTileset.getAttribute('source');

      if (tsxName) {
        var currentFirstGID = parseInt(selTileset.getAttribute('firstgid'));
        var tsxXmlString = this._tsxMap[tsxName];

        if (tsxXmlString) {
          this.parseXMLString(tsxXmlString, currentFirstGID);
        }
      } else {
        var images = selTileset.getElementsByTagName('image');
        var multiTextures = images.length > 1;
        var image = images[0];
        var firstImageName = image.getAttribute('source');
        firstImageName.replace(/\\/g, '\/');
        var tiles = selTileset.getElementsByTagName('tile');
        var tileCount = tiles && tiles.length || 1;
        var tile = null;
        var tilesetName = selTileset.getAttribute('name') || "";
        var tilesetSpacing = parseInt(selTileset.getAttribute('spacing')) || 0;
        var tilesetMargin = parseInt(selTileset.getAttribute('margin')) || 0;
        var fgid = parseInt(tilesetFirstGid);

        if (!fgid) {
          fgid = parseInt(selTileset.getAttribute('firstgid')) || 0;
        }

        var tilesetSize = cc.size(0, 0);
        tilesetSize.width = parseFloat(selTileset.getAttribute('tilewidth'));
        tilesetSize.height = parseFloat(selTileset.getAttribute('tileheight')); // parse tile offset

        var offset = selTileset.getElementsByTagName('tileoffset')[0];
        var tileOffset = cc.v2(0, 0);

        if (offset) {
          tileOffset.x = parseFloat(offset.getAttribute('x'));
          tileOffset.y = parseFloat(offset.getAttribute('y'));
        }

        var tileset = null;

        for (var tileIdx = 0; tileIdx < tileCount; tileIdx++) {
          if (!tileset || multiTextures) {
            tileset = new cc.TMXTilesetInfo();
            tileset.name = tilesetName;
            tileset.firstGid = fgid;
            tileset.spacing = tilesetSpacing;
            tileset.margin = tilesetMargin;
            tileset._tileSize = tilesetSize;
            tileset.tileOffset = tileOffset;
            tileset.sourceImage = this._textures[firstImageName];
            tileset.imageSize = this._textureSizes[firstImageName] || tileset.imageSize;

            if (!tileset.sourceImage) {
              cc.errorID(7221, firstImageName);
            }

            this.setTilesets(tileset);
          }

          tile = tiles && tiles[tileIdx];
          if (!tile) continue;
          this.parentGID = parseInt(fgid) + parseInt(tile.getAttribute('id') || 0);
          var tileImages = tile.getElementsByTagName('image');

          if (tileImages && tileImages.length > 0) {
            image = tileImages[0];
            var imageName = image.getAttribute('source');
            imageName.replace(/\\/g, '\/');
            tileset.sourceImage = this._textures[imageName];

            if (!tileset.sourceImage) {
              cc.errorID(7221, imageName);
            }

            var tileSize = cc.size(0, 0);
            tileSize.width = parseFloat(image.getAttribute('width'));
            tileSize.height = parseFloat(image.getAttribute('height'));
            tileset._tileSize = tileSize;
            tileset.firstGid = this.parentGID;
          }

          this._tileProperties[this.parentGID] = getPropertyList(tile);
          var animations = tile.getElementsByTagName('animation');

          if (animations && animations.length > 0) {
            var animation = animations[0];
            var framesData = animation.getElementsByTagName('frame');
            var animationProp = {
              frames: [],
              dt: 0,
              frameIdx: 0
            };
            this._tileAnimations[this.parentGID] = animationProp;
            var frames = animationProp.frames;

            for (var frameIdx = 0; frameIdx < framesData.length; frameIdx++) {
              var frame = framesData[frameIdx];
              var tileid = parseInt(fgid) + parseInt(frame.getAttribute('tileid'));
              var duration = parseFloat(frame.getAttribute('duration'));
              frames.push({
                tileid: tileid,
                duration: duration / 1000,
                grid: null
              });
            }
          }
        }
      }
    } // PARSE <layer> & <objectgroup> in order


    var childNodes = map.childNodes;

    for (i = 0; i < childNodes.length; i++) {
      var childNode = childNodes[i];

      if (this._shouldIgnoreNode(childNode)) {
        continue;
      }

      if (childNode.nodeName === 'imagelayer') {
        var imageLayer = this._parseImageLayer(childNode);

        if (imageLayer) {
          this.setImageLayers(imageLayer);
        }
      }

      if (childNode.nodeName === 'layer') {
        var layer = this._parseLayer(childNode);

        this.setLayers(layer);
      }

      if (childNode.nodeName === 'objectgroup') {
        var objectGroup = this._parseObjectGroup(childNode);

        this.setObjectGroups(objectGroup);
      }
    }

    return map;
  },
  _shouldIgnoreNode: function _shouldIgnoreNode(node) {
    return node.nodeType === 3 // text
    || node.nodeType === 8 // comment
    || node.nodeType === 4; // cdata
  },
  _parseImageLayer: function _parseImageLayer(selLayer) {
    var datas = selLayer.getElementsByTagName('image');
    if (!datas || datas.length == 0) return null;
    var imageLayer = new cc.TMXImageLayerInfo();
    imageLayer.name = selLayer.getAttribute('name');
    imageLayer.offset.x = parseFloat(selLayer.getAttribute('offsetx')) || 0;
    imageLayer.offset.y = parseFloat(selLayer.getAttribute('offsety')) || 0;
    var visible = selLayer.getAttribute('visible');
    imageLayer.visible = !(visible === "0");
    var opacity = selLayer.getAttribute('opacity') || 1;
    imageLayer.opacity = parseInt(255 * parseFloat(opacity)) || 255;
    var data = datas[0];
    var source = data.getAttribute('source');
    imageLayer.sourceImage = this._imageLayerTextures[source];
    imageLayer.width = parseInt(data.getAttribute('width')) || 0;
    imageLayer.height = parseInt(data.getAttribute('height')) || 0;
    imageLayer.trans = strToColor(data.getAttribute('trans'));

    if (!imageLayer.sourceImage) {
      cc.errorID(7221, source);
      return null;
    }

    return imageLayer;
  },
  _parseLayer: function _parseLayer(selLayer) {
    var data = selLayer.getElementsByTagName('data')[0];
    var layer = new cc.TMXLayerInfo();
    layer.name = selLayer.getAttribute('name');
    var layerSize = cc.size(0, 0);
    layerSize.width = parseFloat(selLayer.getAttribute('width'));
    layerSize.height = parseFloat(selLayer.getAttribute('height'));
    layer._layerSize = layerSize;
    var visible = selLayer.getAttribute('visible');
    layer.visible = !(visible === "0");
    var opacity = selLayer.getAttribute('opacity') || 1;
    if (opacity) layer._opacity = parseInt(255 * parseFloat(opacity));else layer._opacity = 255;
    layer.offset = cc.v2(parseFloat(selLayer.getAttribute('offsetx')) || 0, parseFloat(selLayer.getAttribute('offsety')) || 0);
    var nodeValue = '';

    for (var j = 0; j < data.childNodes.length; j++) {
      nodeValue += data.childNodes[j].nodeValue;
    }

    nodeValue = nodeValue.trim(); // Unpack the tilemap data

    var compression = data.getAttribute('compression');
    var encoding = data.getAttribute('encoding');

    if (compression && compression !== "gzip" && compression !== "zlib") {
      cc.logID(7218);
      return null;
    }

    var tiles;

    switch (compression) {
      case 'gzip':
        tiles = codec.unzipBase64AsArray(nodeValue, 4);
        break;

      case 'zlib':
        var inflator = new zlib.Inflate(codec.Base64.decodeAsArray(nodeValue, 1));
        tiles = uint8ArrayToUint32Array(inflator.decompress());
        break;

      case null:
      case '':
        // Uncompressed
        if (encoding === "base64") tiles = codec.Base64.decodeAsArray(nodeValue, 4);else if (encoding === "csv") {
          tiles = [];
          var csvTiles = nodeValue.split(',');

          for (var csvIdx = 0; csvIdx < csvTiles.length; csvIdx++) {
            tiles.push(parseInt(csvTiles[csvIdx]));
          }
        } else {
          //XML format
          var selDataTiles = data.getElementsByTagName("tile");
          tiles = [];

          for (var xmlIdx = 0; xmlIdx < selDataTiles.length; xmlIdx++) {
            tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute("gid")));
          }
        }
        break;

      default:
        if (this.layerAttrs === cc.TMXLayerInfo.ATTRIB_NONE) cc.logID(7219);
        break;
    }

    if (tiles) {
      layer._tiles = new Uint32Array(tiles);
    } // The parent element is the last layer


    layer.properties = getPropertyList(selLayer);
    return layer;
  },
  _parseObjectGroup: function _parseObjectGroup(selGroup) {
    var objectGroup = new cc.TMXObjectGroupInfo();
    objectGroup.name = selGroup.getAttribute('name') || '';
    objectGroup.offset = cc.v2(parseFloat(selGroup.getAttribute('offsetx')), parseFloat(selGroup.getAttribute('offsety')));
    var opacity = selGroup.getAttribute('opacity') || 1;
    if (opacity) objectGroup._opacity = parseInt(255 * parseFloat(opacity));else objectGroup._opacity = 255;
    var visible = selGroup.getAttribute('visible');
    if (visible && parseInt(visible) === 0) objectGroup.visible = false;
    var color = selGroup.getAttribute('color');
    if (color) objectGroup._color.fromHEX(color);
    var draworder = selGroup.getAttribute('draworder');
    if (draworder) objectGroup._draworder = draworder; // set the properties to the group

    objectGroup.setProperties(getPropertyList(selGroup));
    var objects = selGroup.getElementsByTagName('object');

    if (objects) {
      for (var j = 0; j < objects.length; j++) {
        var selObj = objects[j]; // The value for "type" was blank or not a valid class name
        // Create an instance of TMXObjectInfo to store the object and its properties

        var objectProp = {}; // Set the id of the object

        objectProp['id'] = selObj.getAttribute('id') || j; // Set the name of the object to the value for "name"

        objectProp["name"] = selObj.getAttribute('name') || ""; // Assign all the attributes as key/name pairs in the properties dictionary

        objectProp["width"] = parseFloat(selObj.getAttribute('width')) || 0;
        objectProp["height"] = parseFloat(selObj.getAttribute('height')) || 0;
        objectProp["x"] = parseFloat(selObj.getAttribute('x')) || 0;
        objectProp["y"] = parseFloat(selObj.getAttribute('y')) || 0;
        objectProp["rotation"] = parseFloat(selObj.getAttribute('rotation')) || 0;
        getPropertyList(selObj, objectProp); // visible

        var visibleAttr = selObj.getAttribute('visible');
        objectProp['visible'] = !(visibleAttr && parseInt(visibleAttr) === 0); // text

        var texts = selObj.getElementsByTagName('text');

        if (texts && texts.length > 0) {
          var text = texts[0];
          objectProp['type'] = cc.TiledMap.TMXObjectType.TEXT;
          objectProp['wrap'] = text.getAttribute('wrap') == '1';
          objectProp['color'] = strToColor(text.getAttribute('color'));
          objectProp['halign'] = strToHAlign(text.getAttribute('halign'));
          objectProp['valign'] = strToVAlign(text.getAttribute('valign'));
          objectProp['pixelsize'] = parseInt(text.getAttribute('pixelsize')) || 16;
          objectProp['text'] = text.childNodes[0].nodeValue;
        } // image


        var gid = selObj.getAttribute('gid');

        if (gid) {
          objectProp['gid'] = parseInt(gid);
          objectProp['type'] = cc.TiledMap.TMXObjectType.IMAGE;
        } // ellipse


        var ellipse = selObj.getElementsByTagName('ellipse');

        if (ellipse && ellipse.length > 0) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.ELLIPSE;
        } //polygon


        var polygonProps = selObj.getElementsByTagName("polygon");

        if (polygonProps && polygonProps.length > 0) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.POLYGON;
          var selPgPointStr = polygonProps[0].getAttribute('points');
          if (selPgPointStr) objectProp["points"] = this._parsePointsString(selPgPointStr);
        } //polyline


        var polylineProps = selObj.getElementsByTagName("polyline");

        if (polylineProps && polylineProps.length > 0) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.POLYLINE;
          var selPlPointStr = polylineProps[0].getAttribute('points');
          if (selPlPointStr) objectProp["polylinePoints"] = this._parsePointsString(selPlPointStr);
        }

        if (!objectProp['type']) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.RECT;
        } // Add the object to the objectGroup


        objectGroup._objects.push(objectProp);
      }
    }

    return objectGroup;
  },
  _parsePointsString: function _parsePointsString(pointsString) {
    if (!pointsString) return null;
    var points = [];
    var pointsStr = pointsString.split(' ');

    for (var i = 0; i < pointsStr.length; i++) {
      var selPointStr = pointsStr[i].split(',');
      points.push({
        'x': parseFloat(selPointStr[0]),
        'y': parseFloat(selPointStr[1])
      });
    }

    return points;
  },

  /**
   * Sets the tile animations.
   * @return {Object}
   */
  setTileAnimations: function setTileAnimations(animations) {
    this._tileAnimations = animations;
  },

  /**
   * Gets the tile animations.
   * @return {Object}
   */
  getTileAnimations: function getTileAnimations() {
    return this._tileAnimations;
  },

  /**
   * Gets the tile properties.
   * @return {Object}
   */
  getTileProperties: function getTileProperties() {
    return this._tileProperties;
  },

  /**
   * Set the tile properties.
   * @param {Object} tileProperties
   */
  setTileProperties: function setTileProperties(tileProperties) {
    this._tileProperties = tileProperties;
  },

  /**
   * Gets the currentString
   * @return {String}
   */
  getCurrentString: function getCurrentString() {
    return this.currentString;
  },

  /**
   * Set the currentString
   * @param {String} currentString
   */
  setCurrentString: function setCurrentString(currentString) {
    this.currentString = currentString;
  }
};
var _p = cc.TMXMapInfo.prototype; // Extended properties

js.getset(_p, "mapWidth", _p._getMapWidth, _p._setMapWidth);
js.getset(_p, "mapHeight", _p._getMapHeight, _p._setMapHeight);
js.getset(_p, "tileWidth", _p._getTileWidth, _p._setTileWidth);
js.getset(_p, "tileHeight", _p._getTileHeight, _p._setTileHeight);
/**
 * @constant
 * @type Number
 */

cc.TMXLayerInfo.ATTRIB_NONE = 1 << 0;
/**
 * @constant
 * @type Number
 */

cc.TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
/**
 * @constant
 * @type Number
 */

cc.TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
/**
 * @constant
 * @type Number
 */

cc.TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVE1YWE1MUGFyc2VyLmpzIl0sIm5hbWVzIjpbImNvZGVjIiwicmVxdWlyZSIsInpsaWIiLCJqcyIsInVpbnQ4QXJyYXlUb1VpbnQzMkFycmF5IiwidWludDhBcnIiLCJsZW5ndGgiLCJhcnJMZW4iLCJyZXRBcnIiLCJ3aW5kb3ciLCJVaW50MzJBcnJheSIsImkiLCJvZmZzZXQiLCJjYyIsIlRNWExheWVySW5mbyIsInByb3BlcnRpZXMiLCJuYW1lIiwiX2xheWVyU2l6ZSIsIl90aWxlcyIsInZpc2libGUiLCJfb3BhY2l0eSIsIm93blRpbGVzIiwiX21pbkdJRCIsIl9tYXhHSUQiLCJ2MiIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwiZ2V0UHJvcGVydGllcyIsInNldFByb3BlcnRpZXMiLCJ2YWx1ZSIsIlRNWEltYWdlTGF5ZXJJbmZvIiwid2lkdGgiLCJoZWlnaHQiLCJfdHJhbnMiLCJDb2xvciIsInNvdXJjZUltYWdlIiwiVE1YT2JqZWN0R3JvdXBJbmZvIiwiX29iamVjdHMiLCJfY29sb3IiLCJfZHJhd29yZGVyIiwiVE1YVGlsZXNldEluZm8iLCJmaXJzdEdpZCIsInNwYWNpbmciLCJtYXJnaW4iLCJpbWFnZVNpemUiLCJzaXplIiwidGlsZU9mZnNldCIsIl90aWxlU2l6ZSIsInJlY3RGb3JHSUQiLCJnaWQiLCJyZXN1bHQiLCJyZWN0IiwiVGlsZWRNYXAiLCJUaWxlRmxhZyIsIkZMSVBQRURfTUFTSyIsInBhcnNlSW50IiwibWF4X3giLCJ4IiwieSIsInN0clRvSEFsaWduIiwiaEFsaWduIiwiTGFiZWwiLCJIb3Jpem9udGFsQWxpZ24iLCJDRU5URVIiLCJSSUdIVCIsIkxFRlQiLCJzdHJUb1ZBbGlnbiIsInZBbGlnbiIsIlZlcnRpY2FsQWxpZ24iLCJCT1RUT00iLCJUT1AiLCJzdHJUb0NvbG9yIiwiY29sb3IiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiYSIsInN1YnN0ciIsInIiLCJnIiwiYiIsImdldFByb3BlcnR5TGlzdCIsIm5vZGUiLCJtYXAiLCJyZXMiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInByb3BlcnR5IiwiaiIsInB1c2giLCJlbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwidHlwZSIsInBhcnNlRmxvYXQiLCJUTVhNYXBJbmZvIiwidG14RmlsZSIsInRzeE1hcCIsInRleHR1cmVzIiwidGV4dHVyZVNpemVzIiwiaW1hZ2VMYXllclRleHR1cmVzIiwib3JpZW50YXRpb24iLCJwYXJlbnRFbGVtZW50IiwicGFyZW50R0lEIiwibGF5ZXJBdHRycyIsInN0b3JpbmdDaGFyYWN0ZXJzIiwiY3VycmVudFN0cmluZyIsInJlbmRlck9yZGVyIiwiUmVuZGVyT3JkZXIiLCJSaWdodERvd24iLCJfc3VwcG9ydFZlcnNpb24iLCJfcGFyc2VyIiwiU0FYUGFyc2VyIiwiX29iamVjdEdyb3VwcyIsIl9hbGxDaGlsZHJlbiIsIl9tYXBTaXplIiwiX2xheWVycyIsIl90aWxlc2V0cyIsIl9pbWFnZUxheWVycyIsIl90aWxlUHJvcGVydGllcyIsIl90aWxlQW5pbWF0aW9ucyIsIl90c3hNYXAiLCJfdGV4dHVyZXMiLCJfc3RhZ2dlckF4aXMiLCJfc3RhZ2dlckluZGV4IiwiX2hleFNpZGVMZW5ndGgiLCJfaW1hZ2VMYXllclRleHR1cmVzIiwiaW5pdFdpdGhYTUwiLCJnZXRPcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwiZ2V0U3RhZ2dlckF4aXMiLCJzZXRTdGFnZ2VyQXhpcyIsImdldFN0YWdnZXJJbmRleCIsInNldFN0YWdnZXJJbmRleCIsImdldEhleFNpZGVMZW5ndGgiLCJzZXRIZXhTaWRlTGVuZ3RoIiwiZ2V0TWFwU2l6ZSIsInNldE1hcFNpemUiLCJfZ2V0TWFwV2lkdGgiLCJfc2V0TWFwV2lkdGgiLCJfZ2V0TWFwSGVpZ2h0IiwiX3NldE1hcEhlaWdodCIsImdldFRpbGVTaXplIiwic2V0VGlsZVNpemUiLCJfZ2V0VGlsZVdpZHRoIiwiX3NldFRpbGVXaWR0aCIsIl9nZXRUaWxlSGVpZ2h0IiwiX3NldFRpbGVIZWlnaHQiLCJnZXRMYXllcnMiLCJzZXRMYXllcnMiLCJnZXRJbWFnZUxheWVycyIsInNldEltYWdlTGF5ZXJzIiwiZ2V0VGlsZXNldHMiLCJzZXRUaWxlc2V0cyIsImdldE9iamVjdEdyb3VwcyIsInNldE9iamVjdEdyb3VwcyIsImdldEFsbENoaWxkcmVuIiwiZ2V0UGFyZW50RWxlbWVudCIsInNldFBhcmVudEVsZW1lbnQiLCJnZXRQYXJlbnRHSUQiLCJzZXRQYXJlbnRHSUQiLCJnZXRMYXllckF0dHJpYnMiLCJzZXRMYXllckF0dHJpYnMiLCJnZXRTdG9yaW5nQ2hhcmFjdGVycyIsInNldFN0b3JpbmdDaGFyYWN0ZXJzIiwidG14U3RyaW5nIiwiX3RleHR1cmVTaXplcyIsIkFUVFJJQl9OT05FIiwiTk9ORSIsInBhcnNlWE1MU3RyaW5nIiwieG1sU3RyIiwidGlsZXNldEZpcnN0R2lkIiwibWFwWE1MIiwiX3BhcnNlWE1MIiwiZG9jdW1lbnRFbGVtZW50Iiwib3JpZW50YXRpb25TdHIiLCJzdGFnZ2VyQXhpc1N0ciIsInN0YWdnZXJJbmRleFN0ciIsImhleFNpZGVMZW5ndGhTdHIiLCJyZW5kZXJvcmRlclN0ciIsInZlcnNpb24iLCJub2RlTmFtZSIsInZlcnNpb25BcnIiLCJzcGxpdCIsInN1cHBvcnRWZXJzaW9uIiwidiIsInN2IiwibG9nSUQiLCJPcmllbnRhdGlvbiIsIk9SVEhPIiwiSVNPIiwiSEVYIiwiUmlnaHRVcCIsIkxlZnRVcCIsIkxlZnREb3duIiwiU3RhZ2dlckF4aXMiLCJTVEFHR0VSQVhJU19YIiwiU1RBR0dFUkFYSVNfWSIsIlN0YWdnZXJJbmRleCIsIlNUQUdHRVJJTkRFWF9PREQiLCJTVEFHR0VSSU5ERVhfRVZFTiIsIm1hcFNpemUiLCJ0aWxlc2V0cyIsInNlbFRpbGVzZXQiLCJ0c3hOYW1lIiwiY3VycmVudEZpcnN0R0lEIiwidHN4WG1sU3RyaW5nIiwiaW1hZ2VzIiwibXVsdGlUZXh0dXJlcyIsImltYWdlIiwiZmlyc3RJbWFnZU5hbWUiLCJyZXBsYWNlIiwidGlsZXMiLCJ0aWxlQ291bnQiLCJ0aWxlIiwidGlsZXNldE5hbWUiLCJ0aWxlc2V0U3BhY2luZyIsInRpbGVzZXRNYXJnaW4iLCJmZ2lkIiwidGlsZXNldFNpemUiLCJ0aWxlc2V0IiwidGlsZUlkeCIsImVycm9ySUQiLCJ0aWxlSW1hZ2VzIiwiaW1hZ2VOYW1lIiwidGlsZVNpemUiLCJhbmltYXRpb25zIiwiYW5pbWF0aW9uIiwiZnJhbWVzRGF0YSIsImFuaW1hdGlvblByb3AiLCJmcmFtZXMiLCJkdCIsImZyYW1lSWR4IiwiZnJhbWUiLCJ0aWxlaWQiLCJkdXJhdGlvbiIsImdyaWQiLCJjaGlsZE5vZGVzIiwiY2hpbGROb2RlIiwiX3Nob3VsZElnbm9yZU5vZGUiLCJpbWFnZUxheWVyIiwiX3BhcnNlSW1hZ2VMYXllciIsImxheWVyIiwiX3BhcnNlTGF5ZXIiLCJvYmplY3RHcm91cCIsIl9wYXJzZU9iamVjdEdyb3VwIiwibm9kZVR5cGUiLCJzZWxMYXllciIsImRhdGFzIiwib3BhY2l0eSIsImRhdGEiLCJzb3VyY2UiLCJ0cmFucyIsImxheWVyU2l6ZSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJjb21wcmVzc2lvbiIsImVuY29kaW5nIiwidW56aXBCYXNlNjRBc0FycmF5IiwiaW5mbGF0b3IiLCJJbmZsYXRlIiwiQmFzZTY0IiwiZGVjb2RlQXNBcnJheSIsImRlY29tcHJlc3MiLCJjc3ZUaWxlcyIsImNzdklkeCIsInNlbERhdGFUaWxlcyIsInhtbElkeCIsInNlbEdyb3VwIiwiZnJvbUhFWCIsImRyYXdvcmRlciIsIm9iamVjdHMiLCJzZWxPYmoiLCJvYmplY3RQcm9wIiwidmlzaWJsZUF0dHIiLCJ0ZXh0cyIsInRleHQiLCJUTVhPYmplY3RUeXBlIiwiVEVYVCIsIklNQUdFIiwiZWxsaXBzZSIsIkVMTElQU0UiLCJwb2x5Z29uUHJvcHMiLCJQT0xZR09OIiwic2VsUGdQb2ludFN0ciIsIl9wYXJzZVBvaW50c1N0cmluZyIsInBvbHlsaW5lUHJvcHMiLCJQT0xZTElORSIsInNlbFBsUG9pbnRTdHIiLCJSRUNUIiwicG9pbnRzU3RyaW5nIiwicG9pbnRzIiwicG9pbnRzU3RyIiwic2VsUG9pbnRTdHIiLCJzZXRUaWxlQW5pbWF0aW9ucyIsImdldFRpbGVBbmltYXRpb25zIiwiZ2V0VGlsZVByb3BlcnRpZXMiLCJzZXRUaWxlUHJvcGVydGllcyIsInRpbGVQcm9wZXJ0aWVzIiwiZ2V0Q3VycmVudFN0cmluZyIsInNldEN1cnJlbnRTdHJpbmciLCJfcCIsImdldHNldCIsIkFUVFJJQl9CQVNFNjQiLCJBVFRSSUJfR1pJUCIsIkFUVFJJQl9aTElCIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQTs7QUFFQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyx5QkFBRCxDQUFyQjs7QUFDQSxJQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyx5QkFBRCxDQUFwQjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxxQkFBRCxDQUFsQjs7QUFDQUEsT0FBTyxDQUFDLDhCQUFELENBQVA7O0FBRUEsU0FBU0csdUJBQVQsQ0FBa0NDLFFBQWxDLEVBQTRDO0FBQ3hDLE1BQUdBLFFBQVEsQ0FBQ0MsTUFBVCxHQUFrQixDQUFsQixLQUF3QixDQUEzQixFQUNJLE9BQU8sSUFBUDtBQUVKLE1BQUlDLE1BQU0sR0FBR0YsUUFBUSxDQUFDQyxNQUFULEdBQWlCLENBQTlCO0FBQ0EsTUFBSUUsTUFBTSxHQUFHQyxNQUFNLENBQUNDLFdBQVAsR0FBb0IsSUFBSUEsV0FBSixDQUFnQkgsTUFBaEIsQ0FBcEIsR0FBOEMsRUFBM0Q7O0FBQ0EsT0FBSSxJQUFJSSxDQUFDLEdBQUcsQ0FBWixFQUFlQSxDQUFDLEdBQUdKLE1BQW5CLEVBQTJCSSxDQUFDLEVBQTVCLEVBQStCO0FBQzNCLFFBQUlDLE1BQU0sR0FBR0QsQ0FBQyxHQUFHLENBQWpCO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ0csQ0FBRCxDQUFOLEdBQVlOLFFBQVEsQ0FBQ08sTUFBRCxDQUFSLEdBQW9CUCxRQUFRLENBQUNPLE1BQU0s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QSxhQUFyQjtBQUNIO0FBdnlCcUIsQ0FBMUI7QUEweUJBLElBQUltTSxFQUFFLEdBQUc3UixFQUFFLENBQUMrRSxVQUFILENBQWNuRSxTQUF2QixFQUVBOztBQUNBdEIsRUFBRSxDQUFDd1MsTUFBSCxDQUFVRCxFQUFWLEVBQWMsVUFBZCxFQUEwQkEsRUFBRSxDQUFDbkssWUFBN0IsRUFBMkNtSyxFQUFFLENBQUNsSyxZQUE5QztBQUNBckksRUFBRSxDQUFDd1MsTUFBSCxDQUFVRCxFQUFWLEVBQWMsV0FBZCxFQUEyQkEsRUFBRSxDQUFDakssYUFBOUIsRUFBNkNpSyxFQUFFLENBQUNoSyxhQUFoRDtBQUNBdkksRUFBRSxDQUFDd1MsTUFBSCxDQUFVRCxFQUFWLEVBQWMsV0FBZCxFQUEyQkEsRUFBRSxDQUFDN0osYUFBOUIsRUFBNkM2SixFQUFFLENBQUM1SixhQUFoRDtBQUNBM0ksRUFBRSxDQUFDd1MsTUFBSCxDQUFVRCxFQUFWLEVBQWMsWUFBZCxFQUE0QkEsRUFBRSxDQUFDM0osY0FBL0IsRUFBK0MySixFQUFFLENBQUMxSixjQUFsRDtBQUdBOzs7OztBQUlBbkksRUFBRSxDQUFDQyxZQUFILENBQWdCc0osV0FBaEIsR0FBOEIsS0FBSyxDQUFuQztBQUNBOzs7OztBQUlBdkosRUFBRSxDQUFDQyxZQUFILENBQWdCOFIsYUFBaEIsR0FBZ0MsS0FBSyxDQUFyQztBQUNBOzs7OztBQUlBL1IsRUFBRSxDQUFDQyxZQUFILENBQWdCK1IsV0FBaEIsR0FBOEIsS0FBSyxDQUFuQztBQUNBOzs7OztBQUlBaFMsRUFBRSxDQUFDQyxZQUFILENBQWdCZ1MsV0FBaEIsR0FBOEIsS0FBSyxDQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb2RlYyA9IHJlcXVpcmUoJy4uL2NvbXByZXNzaW9uL1ppcFV0aWxzJyk7XG5jb25zdCB6bGliID0gcmVxdWlyZSgnLi4vY29tcHJlc3Npb24vemxpYi5taW4nKTtcbmNvbnN0IGpzID0gcmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9qcycpO1xucmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9DQ1NBWFBhcnNlcicpO1xuXG5mdW5jdGlvbiB1aW50OEFycmF5VG9VaW50MzJBcnJheSAodWludDhBcnIpIHtcbiAgICBpZih1aW50OEFyci5sZW5ndGggJSA0ICE9PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGxldCBhcnJMZW4gPSB1aW50OEFyci5sZW5ndGggLzQ7XG4gICAgbGV0IHJldEFyciA9IHdpbmRvdy5VaW50MzJBcnJheT8gbmV3IFVpbnQzMkFycmF5KGFyckxlbikgOiBbXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJyTGVuOyBpKyspe1xuICAgICAgICBsZXQgb2Zmc2V0ID0gaSAqIDQ7XG4gICAgICAgIHJldEFycltpXSA9IHVpbnQ4QXJyW29mZnNldF0gICsgdWludDhBcnJbb2Zmc2V0ICsgMV0gKiAoMSA8PCA4KSArIHVpbnQ4QXJyW29mZnNldCArIDJdICogKDEgPDwgMTYpICsgdWludDhBcnJbb2Zmc2V0ICsgM10gKiAoMTw8MjQpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0QXJyO1xufVxuXG4vLyBCaXRzIG9uIHRoZSBmYXIgZW5kIG9mIHRoZSAzMi1iaXQgZ2xvYmFsIHRpbGUgSUQgKEdJRCdzKSBhcmUgdXNlZCBmb3IgdGlsZSBmbGFnc1xuXG4vKipcbiAqIDxwPmNjLlRNWExheWVySW5mbyBjb250YWlucyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGxheWVycyBsaWtlOiA8YnIgLz5cbiAqIC0gTGF5ZXIgbmFtZTxiciAvPlxuICogLSBMYXllciBzaXplIDxiciAvPlxuICogLSBMYXllciBvcGFjaXR5IGF0IGNyZWF0aW9uIHRpbWUgKGl0IGNhbiBiZSBtb2RpZmllZCBhdCBydW50aW1lKSAgPGJyIC8+XG4gKiAtIFdoZXRoZXIgdGhlIGxheWVyIGlzIHZpc2libGUgKGlmIGl0J3Mgbm90IHZpc2libGUsIHRoZW4gdGhlIENvY29zTm9kZSB3b24ndCBiZSBjcmVhdGVkKSA8YnIgLz5cbiAqICA8YnIgLz5cbiAqIFRoaXMgaW5mb3JtYXRpb24gaXMgb2J0YWluZWQgZnJvbSB0aGUgVE1YIGZpbGUuPC9wPlxuICogQGNsYXNzIFRNWExheWVySW5mb1xuICpcbiAqIEBwcm9wZXJ0eSB7QXJyYXl9ICAgIHByb3BlcnRpZXMgIC0gUHJvcGVydGllcyBvZiB0aGUgbGF5ZXIgaW5mby5cbiAqL1xuY2MuVE1YTGF5ZXJJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICAgIHRoaXMubmFtZSA9IFwiXCI7XG4gICAgdGhpcy5fbGF5ZXJTaXplID0gbnVsbDtcbiAgICB0aGlzLl90aWxlcyA9IFtdO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5fb3BhY2l0eSA9IDA7XG4gICAgdGhpcy5vd25UaWxlcyA9IHRydWU7XG4gICAgdGhpcy5fbWluR0lEID0gMTAwMDAwO1xuICAgIHRoaXMuX21heEdJRCA9IDA7XG4gICAgdGhpcy5vZmZzZXQgPSBjYy52MigwLDApO1xufTtcblxuY2MuVE1YTGF5ZXJJbmZvLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogY2MuVE1YTGF5ZXJJbmZvLFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIFByb3BlcnRpZXMuXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0UHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgUHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRQcm9wZXJ0aWVzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICB9XG59O1xuXG4vKipcbiAqIGNjLlRNWEltYWdlTGF5ZXJJbmZvIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgaW1hZ2UgbGF5ZXJzLlxuICogVGhpcyBpbmZvcm1hdGlvbiBpcyBvYnRhaW5lZCBmcm9tIHRoZSBUTVggZmlsZS5cbiAqIEBjbGFzcyBUTVhJbWFnZUxheWVySW5mb1xuICovXG5jYy5UTVhJbWFnZUxheWVySW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5hbWU9IFwiXCI7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLndpZHRoID0gMDtcbiAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgdGhpcy5vZmZzZXQgPSBjYy52MigwLDApO1xuICAgIHRoaXMuX29wYWNpdHkgPSAwO1xuICAgIHRoaXMuX3RyYW5zID0gbmV3IGNjLkNvbG9yKDI1NSwgMjU1LCAyNTUsIDI1NSk7XG4gICAgdGhpcy5zb3VyY2VJbWFnZSA9IG51bGw7XG59O1xuXG4vKipcbiAqIDxwPmNjLlRNWE9iamVjdEdyb3VwSW5mbyBjb250YWlucyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG9iamVjdCBncm91cCBsaWtlOiA8YnIgLz5cbiAqIC0gZ3JvdXAgbmFtZTxiciAvPlxuICogLSBncm91cCBzaXplIDxiciAvPlxuICogLSBncm91cCBvcGFjaXR5IGF0IGNyZWF0aW9uIHRpbWUgKGl0IGNhbiBiZSBtb2RpZmllZCBhdCBydW50aW1lKSAgPGJyIC8+XG4gKiAtIFdoZXRoZXIgdGhlIGdyb3VwIGlzIHZpc2libGUgPGJyIC8+XG4gKiAgPGJyIC8+XG4gKiBUaGlzIGluZm9ybWF0aW9uIGlzIG9idGFpbmVkIGZyb20gdGhlIFRNWCBmaWxlLjwvcD5cbiAqIEBjbGFzcyBUTVhPYmplY3RHcm91cEluZm9cbiAqXG4gKiBAcHJvcGVydHkge0FycmF5fSAgICBwcm9wZXJ0aWVzICAtIFByb3BlcnRpZXMgb2YgdGhlIE9iamVjdEdyb3VwIGluZm8uXG4gKi9cbmNjLlRNWE9iamVjdEdyb3VwSW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB7fTtcbiAgICB0aGlzLm5hbWUgPSBcIlwiO1xuICAgIHRoaXMuX29iamVjdHMgPSBbXTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuX29wYWNpdHkgPSAwO1xuICAgIHRoaXMuX2NvbG9yID0gbmV3IGNjLkNvbG9yKDI1NSwgMjU1LCAyNTUsIDI1NSk7XG4gICAgdGhpcy5vZmZzZXQgPSBjYy52MigwLDApO1xuICAgIHRoaXMuX2RyYXdvcmRlciA9ICd0b3Bkb3duJztcbn07XG5cbmNjLlRNWE9iamVjdEdyb3VwSW5mby5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLlRNWE9iamVjdEdyb3VwSW5mbyxcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBQcm9wZXJ0aWVzLlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIFByb3BlcnRpZXMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgc2V0UHJvcGVydGllcyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgfVxufTtcblxuLyoqXG4gKiA8cD5jYy5UTVhUaWxlc2V0SW5mbyBjb250YWlucyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHRpbGVzZXRzIGxpa2U6IDxiciAvPlxuICogLSBUaWxlc2V0IG5hbWU8YnIgLz5cbiAqIC0gVGlsZXNldCBzcGFjaW5nPGJyIC8+XG4gKiAtIFRpbGVzZXQgbWFyZ2luPGJyIC8+XG4gKiAtIHNpemUgb2YgdGhlIHRpbGVzPGJyIC8+XG4gKiAtIEltYWdlIHVzZWQgZm9yIHRoZSB0aWxlczxiciAvPlxuICogLSBJbWFnZSBzaXplPGJyIC8+XG4gKlxuICogVGhpcyBpbmZvcm1hdGlvbiBpcyBvYnRhaW5lZCBmcm9tIHRoZSBUTVggZmlsZS4gPC9wPlxuICogQGNsYXNzIFRNWFRpbGVzZXRJbmZvXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgLSBUaWxlc2V0IG5hbWVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBmaXJzdEdpZCAtIEZpcnN0IGdyaWRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzcGFjaW5nIC0gU3BhY2luZ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1hcmdpbiAtIE1hcmdpblxuICogQHByb3BlcnR5IHtudWxsfSBzb3VyY2VJbWFnZSAtIFRleHR1cmUgY29udGFpbmluZyB0aGUgdGlsZXMgKHNob3VsZCBiZSBzcHJpdGUgc2hlZXQgLyB0ZXh0dXJlIGF0bGFzKVxuICogQHByb3BlcnR5IHtjYy5TaXplfSBpbWFnZVNpemUgLSBTaXplIGluIHBpeGVscyBvZiB0aGUgaW1hZ2VcbiAqL1xuY2MuVE1YVGlsZXNldEluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGlsZXNldCBuYW1lXG4gICAgdGhpcy5uYW1lID0gXCJcIjtcbiAgICAvLyBGaXJzdCBncmlkXG4gICAgdGhpcy5maXJzdEdpZCA9IDA7XG4gICAgLy8gU3BhY2luZ1xuICAgIHRoaXMuc3BhY2luZyA9IDA7XG4gICAgLy8gTWFyZ2luXG4gICAgdGhpcy5tYXJnaW4gPSAwO1xuICAgIC8vIFRleHR1cmUgY29udGFpbmluZyB0aGUgdGlsZXMgKHNob3VsZCBiZSBzcHJpdGUgc2hlZXQgLyB0ZXh0dXJlIGF0bGFzKVxuICAgIHRoaXMuc291cmNlSW1hZ2UgPSBudWxsO1xuICAgIC8vIFNpemUgaW4gcGl4ZWxzIG9mIHRoZSBpbWFnZVxuICAgIHRoaXMuaW1hZ2VTaXplID0gY2Muc2l6ZSgwLCAwKTtcblxuICAgIHRoaXMudGlsZU9mZnNldCA9IGNjLnYyKDAsIDApO1xuXG4gICAgdGhpcy5fdGlsZVNpemUgPSBjYy5zaXplKDAsIDApO1xufTtcblxuY2MuVE1YVGlsZXNldEluZm8ucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5UTVhUaWxlc2V0SW5mbyxcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gcmVjdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBnaWRcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICAqL1xuICAgIHJlY3RGb3JHSUQgKGdpZCwgcmVzdWx0KSB7XG4gICAgICAgIGxldCByZWN0ID0gcmVzdWx0IHx8IGNjLnJlY3QoMCwgMCwgMCwgMCk7XG4gICAgICAgIHJlY3Qud2lkdGggPSB0aGlzLl90aWxlU2l6ZS53aWR0aDtcbiAgICAgICAgcmVjdC5oZWlnaHQgPSB0aGlzLl90aWxlU2l6ZS5oZWlnaHQ7XG4gICAgICAgIGdpZCAmPSBjYy5UaWxlZE1hcC5UaWxlRmxhZy5GTElQUEVEX01BU0s7XG4gICAgICAgIGdpZCA9IGdpZCAtIHBhcnNlSW50KHRoaXMuZmlyc3RHaWQsIDEwKTtcbiAgICAgICAgbGV0IG1heF94ID0gcGFyc2VJbnQoKHRoaXMuaW1hZ2VTaXplLndpZHRoIC0gdGhpcy5tYXJnaW4gKiAyICsgdGhpcy5zcGFjaW5nKSAvICh0aGlzLl90aWxlU2l6ZS53aWR0aCArIHRoaXMuc3BhY2luZyksIDEwKTtcbiAgICAgICAgcmVjdC54ID0gcGFyc2VJbnQoKGdpZCAlIG1heF94KSAqICh0aGlzLl90aWxlU2l6ZS53aWR0aCArIHRoaXMuc3BhY2luZykgKyB0aGlzLm1hcmdpbiwgMTApO1xuICAgICAgICByZWN0LnkgPSBwYXJzZUludChwYXJzZUludChnaWQgLyBtYXhfeCwgMTApICogKHRoaXMuX3RpbGVTaXplLmhlaWdodCArIHRoaXMuc3BhY2luZykgKyB0aGlzLm1hcmdpbiwgMTApO1xuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBzdHJUb0hBbGlnbiAodmFsdWUpIHtcbiAgICBjb25zdCBoQWxpZ24gPSBjYy5MYWJlbC5Ib3Jpem9udGFsQWxpZ247XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICAgICAgcmV0dXJuIGhBbGlnbi5DRU5URVI7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHJldHVybiBoQWxpZ24uUklHSFQ7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gaEFsaWduLkxFRlQ7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdHJUb1ZBbGlnbiAodmFsdWUpIHtcbiAgICBjb25zdCB2QWxpZ24gPSBjYy5MYWJlbC5WZXJ0aWNhbEFsaWduO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgY2FzZSAnY2VudGVyJzpcbiAgICAgICAgICAgIHJldHVybiB2QWxpZ24uQ0VOVEVSO1xuICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgcmV0dXJuIHZBbGlnbi5CT1RUT007XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gdkFsaWduLlRPUDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN0clRvQ29sb3IgKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2MuY29sb3IoMCwgMCwgMCwgMjU1KTtcbiAgICB9XG4gICAgdmFsdWUgPSAodmFsdWUuaW5kZXhPZignIycpICE9PSAtMSkgPyB2YWx1ZS5zdWJzdHJpbmcoMSkgOiB2YWx1ZTtcbiAgICBpZiAodmFsdWUubGVuZ3RoID09PSA4KSB7XG4gICAgICAgIGxldCBhID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyKDAsIDIpLCAxNikgfHwgMjU1O1xuICAgICAgICBsZXQgciA9IHBhcnNlSW50KHZhbHVlLnN1YnN0cigyLCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIGxldCBnID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyKDQsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgbGV0IGIgPSBwYXJzZUludCh2YWx1ZS5zdWJzdHIoNiwgMiksIDE2KSB8fCAwO1xuICAgICAgICByZXR1cm4gY2MuY29sb3IociwgZywgYiwgYSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludCh2YWx1ZS5zdWJzdHIoMCwgMiksIDE2KSB8fCAwO1xuICAgICAgICBsZXQgZyA9IHBhcnNlSW50KHZhbHVlLnN1YnN0cigyLCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIGxldCBiID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyKDQsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgcmV0dXJuIGNjLmNvbG9yKHIsIGcsIGIsIDI1NSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eUxpc3QgKG5vZGUsIG1hcCkge1xuICAgIGxldCByZXMgPSBbXTtcbiAgICBsZXQgcHJvcGVydGllcyA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwcm9wZXJ0aWVzXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgcHJvcGVydHkgPSBwcm9wZXJ0aWVzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicHJvcGVydHlcIik7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcGVydHkubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKHByb3BlcnR5W2pdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcCA9IG1hcCB8fCB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZWxlbWVudCA9IHJlc1tpXTtcbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgICAgICBsZXQgdHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJ3N0cmluZyc7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgIGlmICh0eXBlID09PSAnaW50Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ2Zsb2F0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnYm9vbCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT09ICd0cnVlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnY29sb3InKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0clRvQ29sb3IodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFwW25hbWVdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcDtcbn1cblxuLyoqXG4gKiA8cD5jYy5UTVhNYXBJbmZvIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbWFwIGxpa2U6IDxici8+XG4gKi0gTWFwIG9yaWVudGF0aW9uIChoZXhhZ29uYWwsIGlzb21ldHJpYyBvciBvcnRob2dvbmFsKTxici8+XG4gKi0gVGlsZSBzaXplPGJyLz5cbiAqLSBNYXAgc2l6ZTwvcD5cbiAqXG4gKiA8cD5BbmQgaXQgYWxzbyBjb250YWluczogPGJyLz5cbiAqIC0gTGF5ZXJzIChhbiBhcnJheSBvZiBUTVhMYXllckluZm8gb2JqZWN0cyk8YnIvPlxuICogLSBUaWxlc2V0cyAoYW4gYXJyYXkgb2YgVE1YVGlsZXNldEluZm8gb2JqZWN0cykgPGJyLz5cbiAqIC0gT2JqZWN0R3JvdXBzIChhbiBhcnJheSBvZiBUTVhPYmplY3RHcm91cEluZm8gb2JqZWN0cykgPC9wPlxuICpcbiAqIDxwPlRoaXMgaW5mb3JtYXRpb24gaXMgb2J0YWluZWQgZnJvbSB0aGUgVE1YIGZpbGUuIDwvcD5cbiAqIEBjbGFzc1xuICpcbiAqIEBwcm9wZXJ0eSB7QXJyYXl9ICAgIHByb3BlcnRpZXMgICAgICAgICAgLSBQcm9wZXJ0aWVzIG9mIHRoZSBtYXAgaW5mby5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSAgIG9yaWVudGF0aW9uICAgICAgICAgLSBNYXAgb3JpZW50YXRpb24uXG4gKiBAcHJvcGVydHkge09iamVjdH0gICBwYXJlbnRFbGVtZW50ICAgICAgIC0gUGFyZW50IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge051bWJlcn0gICBwYXJlbnRHSUQgICAgICAgICAgIC0gUGFyZW50IEdJRC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgIGxheWVyQXR0cnMgICAgICAgIC0gTGF5ZXIgYXR0cmlidXRlcy5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gIHN0b3JpbmdDaGFyYWN0ZXJzICAgLSBJcyByZWFkaW5nIHN0b3JpbmcgY2hhcmFjdGVycyBzdHJlYW0uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gICBjdXJyZW50U3RyaW5nICAgICAgIC0gQ3VycmVudCBzdHJpbmcgc3RvcmVkIGZyb20gY2hhcmFjdGVycyBzdHJlYW0uXG4gKiBAcHJvcGVydHkge051bWJlcn0gICBtYXBXaWR0aCAgICAgICAgICAgIC0gV2lkdGggb2YgdGhlIG1hcFxuICogQHByb3BlcnR5IHtOdW1iZXJ9ICAgbWFwSGVpZ2h0ICAgICAgICAgICAtIEhlaWdodCBvZiB0aGUgbWFwXG4gKiBAcHJvcGVydHkge051bWJlcn0gICB0aWxlV2lkdGggICAgICAgICAgIC0gV2lkdGggb2YgYSB0aWxlXG4gKiBAcHJvcGVydHkge051bWJlcn0gICB0aWxlSGVpZ2h0ICAgICAgICAgIC0gSGVpZ2h0IG9mIGEgdGlsZVxuICogQGV4YW1wbGVcbiAqIDEuXG4gKiAvL2NyZWF0ZSBhIFRNWE1hcEluZm8gd2l0aCBmaWxlIG5hbWVcbiAqIGxldCB0bXhNYXBJbmZvID0gbmV3IGNjLlRNWE1hcEluZm8oXCJyZXMvb3J0aG9nb25hbC10ZXN0MS50bXhcIik7XG4gKiAyLlxuICogLy9jcmVhdGUgYSBUTVhNYXBJbmZvIHdpdGggY29udGVudCBzdHJpbmcgYW5kIHJlc291cmNlIHBhdGhcbiAqIGxldCByZXNvdXJjZXMgPSBcInJlcy9UaWxlTWFwc1wiO1xuICogbGV0IGZpbGVQYXRoID0gXCJyZXMvVGlsZU1hcHMvb3J0aG9nb25hbC10ZXN0MS50bXhcIjtcbiAqIGxldCB4bWxTdHIgPSBjYy5sb2FkZXIuZ2V0UmVzKGZpbGVQYXRoKTtcbiAqIGxldCB0bXhNYXBJbmZvID0gbmV3IGNjLlRNWE1hcEluZm8oeG1sU3RyLCByZXNvdXJjZXMpO1xuICovXG5cbi8qKlxuICogQ3JlYXRlcyBhIFRNWCBGb3JtYXQgd2l0aCBhIHRteCBmaWxlIG9yIGNvbnRlbnQgc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIENvbnN0cnVjdG9yIG9mIGNjLlRNWE1hcEluZm9cbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0bXhGaWxlIGNvbnRlbnQgc3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gdHN4TWFwXG4gKiBAcGFyYW0ge09iamVjdH0gdGV4dHVyZXNcbiAqL1xuY2MuVE1YTWFwSW5mbyA9IGZ1bmN0aW9uICh0bXhGaWxlLCB0c3hNYXAsIHRleHR1cmVzLCB0ZXh0dXJlU2l6ZXMsIGltYWdlTGF5ZXJUZXh0dXJlcykge1xuICAgIHRoaXMucHJvcGVydGllcyA9IFtdO1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuICAgIHRoaXMucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnRHSUQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJBdHRycyA9IDA7XG4gICAgdGhpcy5zdG9yaW5nQ2hhcmFjdGVycyA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFN0cmluZyA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXJPcmRlciA9IGNjLlRpbGVkTWFwLlJlbmRlck9yZGVyLlJpZ2h0RG93bjtcblxuICAgIHRoaXMuX3N1cHBvcnRWZXJzaW9uID0gWzEsIDIsIDBdO1xuICAgIHRoaXMuX3BhcnNlciA9IG5ldyBjYy5TQVhQYXJzZXIoKTtcbiAgICB0aGlzLl9vYmplY3RHcm91cHMgPSBbXTtcbiAgICB0aGlzLl9hbGxDaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMuX21hcFNpemUgPSBjYy5zaXplKDAsIDApO1xuICAgIHRoaXMuX3RpbGVTaXplID0gY2Muc2l6ZSgwLCAwKTtcbiAgICB0aGlzLl9sYXllcnMgPSBbXTtcbiAgICB0aGlzLl90aWxlc2V0cyA9IFtdO1xuICAgIHRoaXMuX2ltYWdlTGF5ZXJzID0gW107XG4gICAgdGhpcy5fdGlsZVByb3BlcnRpZXMgPSB7fTtcbiAgICB0aGlzLl90aWxlQW5pbWF0aW9ucyA9IHt9O1xuICAgIHRoaXMuX3RzeE1hcCA9IG51bGw7XG5cbiAgICAvLyBtYXAgb2YgdGV4dHVyZXMgaW5kZXhlZCBieSBuYW1lXG4gICAgdGhpcy5fdGV4dHVyZXMgPSBudWxsO1xuXG4gICAgLy8gaGV4IG1hcCB2YWx1ZXNcbiAgICB0aGlzLl9zdGFnZ2VyQXhpcyA9IG51bGw7XG4gICAgdGhpcy5fc3RhZ2dlckluZGV4ID0gbnVsbDtcbiAgICB0aGlzLl9oZXhTaWRlTGVuZ3RoID0gMDtcblxuICAgIHRoaXMuX2ltYWdlTGF5ZXJUZXh0dXJlcyA9IG51bGw7XG5cbiAgICB0aGlzLmluaXRXaXRoWE1MKHRteEZpbGUsIHRzeE1hcCwgdGV4dHVyZXMsIHRleHR1cmVTaXplcywgaW1hZ2VMYXllclRleHR1cmVzKTtcbn07XG5jYy5UTVhNYXBJbmZvLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogY2MuVE1YTWFwSW5mbyxcbiAgICAvKipcbiAgICAgKiBHZXRzIE1hcCBvcmllbnRhdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0T3JpZW50YXRpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBNYXAgb3JpZW50YXRpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlXG4gICAgICovXG4gICAgc2V0T3JpZW50YXRpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3RhZ2dlckF4aXMgb2YgbWFwLlxuICAgICAqIEByZXR1cm4ge2NjLlRpbGVkTWFwLlN0YWdnZXJBeGlzfVxuICAgICAqL1xuICAgIGdldFN0YWdnZXJBeGlzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YWdnZXJBeGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHN0YWdnZXJBeGlzIG9mIG1hcC5cbiAgICAgKiBAcGFyYW0ge2NjLlRpbGVkTWFwLlN0YWdnZXJBeGlzfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFN0YWdnZXJBeGlzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9zdGFnZ2VyQXhpcyA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHN0YWdnZXIgaW5kZXhcbiAgICAgKiBAcmV0dXJuIHtjYy5UaWxlZE1hcC5TdGFnZ2VySW5kZXh9XG4gICAgICovXG4gICAgZ2V0U3RhZ2dlckluZGV4ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YWdnZXJJbmRleDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBzdGFnZ2VyIGluZGV4LlxuICAgICAqIEBwYXJhbSB7Y2MuVGlsZWRNYXAuU3RhZ2dlckluZGV4fSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFN0YWdnZXJJbmRleCAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc3RhZ2dlckluZGV4ID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgSGV4IHNpZGUgbGVuZ3RoLlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRIZXhTaWRlTGVuZ3RoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hleFNpZGVMZW5ndGg7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgSGV4IHNpZGUgbGVuZ3RoLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldEhleFNpZGVMZW5ndGggKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2hleFNpZGVMZW5ndGggPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWFwIHdpZHRoICYgaGVpZ2h0XG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRNYXBTaXplICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnNpemUodGhpcy5fbWFwU2l6ZS53aWR0aCwgdGhpcy5fbWFwU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNYXAgd2lkdGggJiBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge1NpemV9IHZhbHVlXG4gICAgICovXG4gICAgc2V0TWFwU2l6ZSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbWFwU2l6ZS53aWR0aCA9IHZhbHVlLndpZHRoO1xuICAgICAgICB0aGlzLl9tYXBTaXplLmhlaWdodCA9IHZhbHVlLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX2dldE1hcFdpZHRoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcFNpemUud2lkdGg7XG4gICAgfSxcbiAgICBfc2V0TWFwV2lkdGggKHdpZHRoKSB7XG4gICAgICAgIHRoaXMuX21hcFNpemUud2lkdGggPSB3aWR0aDtcbiAgICB9LFxuICAgIF9nZXRNYXBIZWlnaHQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwU2l6ZS5oZWlnaHQ7XG4gICAgfSxcbiAgICBfc2V0TWFwSGVpZ2h0IChoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fbWFwU2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRpbGVzIHdpZHRoICYgaGVpZ2h0XG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRUaWxlU2l6ZSAoKSB7XG4gICAgICAgIHJldHVybiBjYy5zaXplKHRoaXMuX3RpbGVTaXplLndpZHRoLCB0aGlzLl90aWxlU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUaWxlcyB3aWR0aCAmIGhlaWdodFxuICAgICAqIEBwYXJhbSB7U2l6ZX0gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRUaWxlU2l6ZSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdGlsZVNpemUud2lkdGggPSB2YWx1ZS53aWR0aDtcbiAgICAgICAgdGhpcy5fdGlsZVNpemUuaGVpZ2h0ID0gdmFsdWUuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfZ2V0VGlsZVdpZHRoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVTaXplLndpZHRoO1xuICAgIH0sXG4gICAgX3NldFRpbGVXaWR0aCAod2lkdGgpIHtcbiAgICAgICAgdGhpcy5fdGlsZVNpemUud2lkdGggPSB3aWR0aDtcbiAgICB9LFxuICAgIF9nZXRUaWxlSGVpZ2h0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVTaXplLmhlaWdodDtcbiAgICB9LFxuICAgIF9zZXRUaWxlSGVpZ2h0IChoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fdGlsZVNpemUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMYXllcnNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRMYXllcnMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMYXllcnNcbiAgICAgKiBAcGFyYW0ge2NjLlRNWExheWVySW5mb30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRMYXllcnMgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2FsbENoaWxkcmVuLnB1c2godmFsdWUpO1xuICAgICAgICB0aGlzLl9sYXllcnMucHVzaCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEltYWdlTGF5ZXJzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0SW1hZ2VMYXllcnMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2VMYXllcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEltYWdlTGF5ZXJzXG4gICAgICogQHBhcmFtIHtjYy5UTVhJbWFnZUxheWVySW5mb30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRJbWFnZUxheWVycyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYWxsQ2hpbGRyZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX2ltYWdlTGF5ZXJzLnB1c2godmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aWxlc2V0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldFRpbGVzZXRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVzZXRzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aWxlc2V0c1xuICAgICAqIEBwYXJhbSB7Y2MuVE1YVGlsZXNldEluZm99IHZhbHVlXG4gICAgICovXG4gICAgc2V0VGlsZXNldHMgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3RpbGVzZXRzLnB1c2godmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBPYmplY3RHcm91cHNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRPYmplY3RHcm91cHMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0R3JvdXBzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBPYmplY3RHcm91cHNcbiAgICAgKiBAcGFyYW0ge2NjLlRNWE9iamVjdEdyb3VwfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldE9iamVjdEdyb3VwcyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYWxsQ2hpbGRyZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX29iamVjdEdyb3Vwcy5wdXNoKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgZ2V0QWxsQ2hpbGRyZW4gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxsQ2hpbGRyZW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBhcmVudCBlbGVtZW50XG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFBhcmVudEVsZW1lbnQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXJlbnQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFBhcmVudEVsZW1lbnQgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXJlbnQgR0lEXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFBhcmVudEdJRCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudEdJRDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGFyZW50IEdJRFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFBhcmVudEdJRCAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRHSUQgPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTGF5ZXIgYXR0cmlidXRlXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldExheWVyQXR0cmlicyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheWVyQXR0cnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExheWVyIGF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZVxuICAgICAqL1xuICAgIHNldExheWVyQXR0cmlicyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5sYXllckF0dHJzID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIElzIHJlYWRpbmcgc3RvcmluZyBjaGFyYWN0ZXJzIHN0cmVhbVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0U3RvcmluZ0NoYXJhY3RlcnMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yaW5nQ2hhcmFjdGVycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSXMgcmVhZGluZyBzdG9yaW5nIGNoYXJhY3RlcnMgc3RyZWFtXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFN0b3JpbmdDaGFyYWN0ZXJzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0b3JpbmdDaGFyYWN0ZXJzID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByb3BlcnRpZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcGVydGllcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJvcGVydGllc1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFByb3BlcnRpZXMgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpbml0aWFsaXplcyBhIFRNWCBmb3JtYXQgd2l0aCBhbiBYTUwgc3RyaW5nIGFuZCBhIFRNWCByZXNvdXJjZSBwYXRoXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRteFN0cmluZ1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0c3hNYXBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGV4dHVyZXNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoWE1MICh0bXhTdHJpbmcsIHRzeE1hcCwgdGV4dHVyZXMsIHRleHR1cmVTaXplcywgaW1hZ2VMYXllclRleHR1cmVzKSB7XG4gICAgICAgIHRoaXMuX3RpbGVzZXRzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xheWVycy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9pbWFnZUxheWVycy5sZW5ndGggPSAwO1xuXG4gICAgICAgIHRoaXMuX3RzeE1hcCA9IHRzeE1hcDtcbiAgICAgICAgdGhpcy5fdGV4dHVyZXMgPSB0ZXh0dXJlcztcbiAgICAgICAgdGhpcy5faW1hZ2VMYXllclRleHR1cmVzID0gaW1hZ2VMYXllclRleHR1cmVzO1xuICAgICAgICB0aGlzLl90ZXh0dXJlU2l6ZXMgPSB0ZXh0dXJlU2l6ZXM7XG5cbiAgICAgICAgdGhpcy5fb2JqZWN0R3JvdXBzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2FsbENoaWxkcmVuLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMucHJvcGVydGllcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl90aWxlUHJvcGVydGllcyA9IHt9O1xuICAgICAgICB0aGlzLl90aWxlQW5pbWF0aW9ucyA9IHt9O1xuXG4gICAgICAgIC8vIHRtcCB2YXJzXG4gICAgICAgIHRoaXMuY3VycmVudFN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuc3RvcmluZ0NoYXJhY3RlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYXllckF0dHJzID0gY2MuVE1YTGF5ZXJJbmZvLkFUVFJJQl9OT05FO1xuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSBjYy5UaWxlZE1hcC5OT05FO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlWE1MU3RyaW5nKHRteFN0cmluZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHBhcnNpbmcgb2YgYW4gWE1MIHN0cmluZywgZWl0aGVyIGEgdG14IChNYXApIHN0cmluZyBvciB0c3ggKFRpbGVzZXQpIHN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB4bWxTdHJpbmdcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGlsZXNldEZpcnN0R2lkXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICAgKi9cbiAgICBwYXJzZVhNTFN0cmluZyAoeG1sU3RyLCB0aWxlc2V0Rmlyc3RHaWQpIHtcbiAgICAgICAgbGV0IG1hcFhNTCA9IHRoaXMuX3BhcnNlci5fcGFyc2VYTUwoeG1sU3RyKTtcbiAgICAgICAgbGV0IGk7XG5cbiAgICAgICAgLy8gUEFSU0UgPG1hcD5cbiAgICAgICAgbGV0IG1hcCA9IG1hcFhNTC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgbGV0IG9yaWVudGF0aW9uU3RyID0gbWFwLmdldEF0dHJpYnV0ZSgnb3JpZW50YXRpb24nKTtcbiAgICAgICAgbGV0IHN0YWdnZXJBeGlzU3RyID0gbWFwLmdldEF0dHJpYnV0ZSgnc3RhZ2dlcmF4aXMnKTtcbiAgICAgICAgbGV0IHN0YWdnZXJJbmRleFN0ciA9IG1hcC5nZXRBdHRyaWJ1dGUoJ3N0YWdnZXJpbmRleCcpO1xuICAgICAgICBsZXQgaGV4U2lkZUxlbmd0aFN0ciA9IG1hcC5nZXRBdHRyaWJ1dGUoJ2hleHNpZGVsZW5ndGgnKTtcbiAgICAgICAgbGV0IHJlbmRlcm9yZGVyU3RyID0gbWFwLmdldEF0dHJpYnV0ZSgncmVuZGVyb3JkZXInKTtcbiAgICAgICAgbGV0IHZlcnNpb24gPSBtYXAuZ2V0QXR0cmlidXRlKCd2ZXJzaW9uJykgfHwgJzEuMC4wJztcblxuICAgICAgICBpZiAobWFwLm5vZGVOYW1lID09PSBcIm1hcFwiKSB7XG4gICAgICAgICAgICBsZXQgdmVyc2lvbkFyciA9IHZlcnNpb24uc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGxldCBzdXBwb3J0VmVyc2lvbiA9IHRoaXMuX3N1cHBvcnRWZXJzaW9uO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdXBwb3J0VmVyc2lvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB2ID0gcGFyc2VJbnQodmVyc2lvbkFycltpXSkgfHwgMDtcbiAgICAgICAgICAgICAgICBsZXQgc3YgPSBzdXBwb3J0VmVyc2lvbltpXTtcbiAgICAgICAgICAgICAgICBpZiAoc3YgPCB2KSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDcyMTYsIHZlcnNpb24pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgXG5cbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvblN0ciA9PT0gXCJvcnRob2dvbmFsXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IGNjLlRpbGVkTWFwLk9yaWVudGF0aW9uLk9SVEhPO1xuICAgICAgICAgICAgZWxzZSBpZiAob3JpZW50YXRpb25TdHIgPT09IFwiaXNvbWV0cmljXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IGNjLlRpbGVkTWFwLk9yaWVudGF0aW9uLklTTztcbiAgICAgICAgICAgIGVsc2UgaWYgKG9yaWVudGF0aW9uU3RyID09PSBcImhleGFnb25hbFwiKVxuICAgICAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBjYy5UaWxlZE1hcC5PcmllbnRhdGlvbi5IRVg7XG4gICAgICAgICAgICBlbHNlIGlmIChvcmllbnRhdGlvblN0ciAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICBjYy5sb2dJRCg3MjE3LCBvcmllbnRhdGlvblN0cik7XG5cbiAgICAgICAgICAgIGlmIChyZW5kZXJvcmRlclN0ciA9PT0gJ3JpZ2h0LXVwJykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyT3JkZXIgPSBjYy5UaWxlZE1hcC5SZW5kZXJPcmRlci5SaWdodFVwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZW5kZXJvcmRlclN0ciA9PT0gJ2xlZnQtdXAnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJPcmRlciA9IGNjLlRpbGVkTWFwLlJlbmRlck9yZGVyLkxlZnRVcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVuZGVyb3JkZXJTdHIgPT09ICdsZWZ0LWRvd24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJPcmRlciA9IGNjLlRpbGVkTWFwLlJlbmRlck9yZGVyLkxlZnREb3duO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck9yZGVyID0gY2MuVGlsZWRNYXAuUmVuZGVyT3JkZXIuUmlnaHREb3duO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhZ2dlckF4aXNTdHIgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhZ2dlckF4aXMoY2MuVGlsZWRNYXAuU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzdGFnZ2VyQXhpc1N0ciA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFnZ2VyQXhpcyhjYy5UaWxlZE1hcC5TdGFnZ2VyQXhpcy5TVEFHR0VSQVhJU19ZKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YWdnZXJJbmRleFN0ciA9PT0gJ29kZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YWdnZXJJbmRleChjYy5UaWxlZE1hcC5TdGFnZ2VySW5kZXguU1RBR0dFUklOREVYX09ERCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzdGFnZ2VySW5kZXhTdHIgPT09ICdldmVuJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhZ2dlckluZGV4KGNjLlRpbGVkTWFwLlN0YWdnZXJJbmRleC5TVEFHR0VSSU5ERVhfRVZFTik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoZXhTaWRlTGVuZ3RoU3RyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRIZXhTaWRlTGVuZ3RoKHBhcnNlRmxvYXQoaGV4U2lkZUxlbmd0aFN0cikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbWFwU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgICAgICAgICBtYXBTaXplLndpZHRoID0gcGFyc2VGbG9hdChtYXAuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKTtcbiAgICAgICAgICAgIG1hcFNpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChtYXAuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG4gICAgICAgICAgICB0aGlzLnNldE1hcFNpemUobWFwU2l6ZSk7XG5cbiAgICAgICAgICAgIG1hcFNpemUgPSBjYy5zaXplKDAsIDApO1xuICAgICAgICAgICAgbWFwU2l6ZS53aWR0aCA9IHBhcnNlRmxvYXQobWFwLmdldEF0dHJpYnV0ZSgndGlsZXdpZHRoJykpO1xuICAgICAgICAgICAgbWFwU2l6ZS5oZWlnaHQgPSBwYXJzZUZsb2F0KG1hcC5nZXRBdHRyaWJ1dGUoJ3RpbGVoZWlnaHQnKSk7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVTaXplKG1hcFNpemUpO1xuXG4gICAgICAgICAgICAvLyBUaGUgcGFyZW50IGVsZW1lbnQgaXMgdGhlIG1hcFxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZ2V0UHJvcGVydHlMaXN0KG1hcCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQQVJTRSA8dGlsZXNldD5cbiAgICAgICAgbGV0IHRpbGVzZXRzID0gbWFwLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aWxlc2V0Jyk7XG4gICAgICAgIGlmIChtYXAubm9kZU5hbWUgIT09IFwibWFwXCIpIHtcbiAgICAgICAgICAgIHRpbGVzZXRzID0gW107XG4gICAgICAgICAgICB0aWxlc2V0cy5wdXNoKG1hcCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGlsZXNldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzZWxUaWxlc2V0ID0gdGlsZXNldHNbaV07XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIGV4dGVybmFsIHRpbGVzZXQgdGhlbiBzdGFydCBwYXJzaW5nIHRoYXRcbiAgICAgICAgICAgIGxldCB0c3hOYW1lID0gc2VsVGlsZXNldC5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xuICAgICAgICAgICAgaWYgKHRzeE5hbWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEZpcnN0R0lEID0gcGFyc2VJbnQoc2VsVGlsZXNldC5nZXRBdHRyaWJ1dGUoJ2ZpcnN0Z2lkJykpO1xuICAgICAgICAgICAgICAgIGxldCB0c3hYbWxTdHJpbmcgPSB0aGlzLl90c3hNYXBbdHN4TmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHRzeFhtbFN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlWE1MU3RyaW5nKHRzeFhtbFN0cmluZywgY3VycmVudEZpcnN0R0lEKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBpbWFnZXMgPSBzZWxUaWxlc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWFnZScpO1xuICAgICAgICAgICAgICAgIGxldCBtdWx0aVRleHR1cmVzID0gaW1hZ2VzLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICAgICAgbGV0IGltYWdlID0gaW1hZ2VzWzBdO1xuICAgICAgICAgICAgICAgIGxldCBmaXJzdEltYWdlTmFtZSA9IGltYWdlLmdldEF0dHJpYnV0ZSgnc291cmNlJyk7XG4gICAgICAgICAgICAgICAgZmlyc3RJbWFnZU5hbWUucmVwbGFjZSgvXFxcXC9nLCAnXFwvJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGlsZXMgPSBzZWxUaWxlc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aWxlJyk7XG4gICAgICAgICAgICAgICAgbGV0IHRpbGVDb3VudCA9IHRpbGVzICYmIHRpbGVzLmxlbmd0aCB8fCAxO1xuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGxldCB0aWxlc2V0TmFtZSA9IHNlbFRpbGVzZXQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZXNldFNwYWNpbmcgPSBwYXJzZUludChzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgnc3BhY2luZycpKSB8fCAwO1xuICAgICAgICAgICAgICAgIGxldCB0aWxlc2V0TWFyZ2luID0gcGFyc2VJbnQoc2VsVGlsZXNldC5nZXRBdHRyaWJ1dGUoJ21hcmdpbicpKSB8fCAwO1xuICAgICAgICAgICAgICAgIGxldCBmZ2lkID0gcGFyc2VJbnQodGlsZXNldEZpcnN0R2lkKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZnaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmdpZCA9IHBhcnNlSW50KHNlbFRpbGVzZXQuZ2V0QXR0cmlidXRlKCdmaXJzdGdpZCcpKSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB0aWxlc2V0U2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgICAgICAgICAgICAgdGlsZXNldFNpemUud2lkdGggPSBwYXJzZUZsb2F0KHNlbFRpbGVzZXQuZ2V0QXR0cmlidXRlKCd0aWxld2lkdGgnKSk7XG4gICAgICAgICAgICAgICAgdGlsZXNldFNpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgndGlsZWhlaWdodCcpKTtcblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRpbGUgb2Zmc2V0XG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IHNlbFRpbGVzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpbGVvZmZzZXQnKVswXTtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZU9mZnNldCA9IGNjLnYyKDAsIDApO1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZU9mZnNldC54ID0gcGFyc2VGbG9hdChvZmZzZXQuZ2V0QXR0cmlidXRlKCd4JykpO1xuICAgICAgICAgICAgICAgICAgICB0aWxlT2Zmc2V0LnkgPSBwYXJzZUZsb2F0KG9mZnNldC5nZXRBdHRyaWJ1dGUoJ3knKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHRpbGVzZXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHRpbGVJZHggPSAwOyB0aWxlSWR4IDwgdGlsZUNvdW50OyB0aWxlSWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aWxlc2V0IHx8IG11bHRpVGV4dHVyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQgPSBuZXcgY2MuVE1YVGlsZXNldEluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQubmFtZSA9IHRpbGVzZXROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5maXJzdEdpZCA9IGZnaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQuc3BhY2luZyA9IHRpbGVzZXRTcGFjaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5tYXJnaW4gPSB0aWxlc2V0TWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5fdGlsZVNpemUgPSB0aWxlc2V0U2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQudGlsZU9mZnNldCA9IHRpbGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlc2V0LnNvdXJjZUltYWdlID0gdGhpcy5fdGV4dHVyZXNbZmlyc3RJbWFnZU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5pbWFnZVNpemUgPSB0aGlzLl90ZXh0dXJlU2l6ZXNbZmlyc3RJbWFnZU5hbWVdIHx8IHRpbGVzZXQuaW1hZ2VTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aWxlc2V0LnNvdXJjZUltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg3MjIxLCBmaXJzdEltYWdlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRpbGVzZXRzKHRpbGVzZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGlsZSA9IHRpbGVzICYmIHRpbGVzW3RpbGVJZHhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbGUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50R0lEID0gcGFyc2VJbnQoZmdpZCkgKyBwYXJzZUludCh0aWxlLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGVJbWFnZXMgPSB0aWxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWFnZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGlsZUltYWdlcyAmJiB0aWxlSW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlID0gdGlsZUltYWdlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZU5hbWUgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VOYW1lLnJlcGxhY2UoL1xcXFwvZywgJ1xcLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5zb3VyY2VJbWFnZSA9IHRoaXMuX3RleHR1cmVzW2ltYWdlTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbGVzZXQuc291cmNlSW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDcyMjEsIGltYWdlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlU2l6ZS53aWR0aCA9IHBhcnNlRmxvYXQoaW1hZ2UuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVTaXplLmhlaWdodCA9IHBhcnNlRmxvYXQoaW1hZ2UuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlc2V0Ll90aWxlU2l6ZSA9IHRpbGVTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5maXJzdEdpZCA9IHRoaXMucGFyZW50R0lEO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGlsZVByb3BlcnRpZXNbdGhpcy5wYXJlbnRHSURdID0gZ2V0UHJvcGVydHlMaXN0KHRpbGUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHRpbGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2FuaW1hdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9ucyAmJiBhbmltYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSBhbmltYXRpb25zWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lc0RhdGEgPSBhbmltYXRpb24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZyYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uUHJvcCA9IHtmcmFtZXM6W10sIGR0OjAsIGZyYW1lSWR4OjB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGlsZUFuaW1hdGlvbnNbdGhpcy5wYXJlbnRHSURdID0gYW5pbWF0aW9uUHJvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZXMgPSBhbmltYXRpb25Qcm9wLmZyYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGZyYW1lSWR4ID0gMDsgZnJhbWVJZHggPCBmcmFtZXNEYXRhLmxlbmd0aDsgZnJhbWVJZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IGZyYW1lc0RhdGFbZnJhbWVJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlaWQgPSBwYXJzZUludChmZ2lkKSArIHBhcnNlSW50KGZyYW1lLmdldEF0dHJpYnV0ZSgndGlsZWlkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZnJhbWUuZ2V0QXR0cmlidXRlKCdkdXJhdGlvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZXMucHVzaCh7dGlsZWlkIDogdGlsZWlkLCBkdXJhdGlvbiA6IGR1cmF0aW9uIC8gMTAwMCwgZ3JpZDogbnVsbH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUEFSU0UgPGxheWVyPiAmIDxvYmplY3Rncm91cD4gaW4gb3JkZXJcbiAgICAgICAgbGV0IGNoaWxkTm9kZXMgPSBtYXAuY2hpbGROb2RlcztcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Nob3VsZElnbm9yZU5vZGUoY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVOYW1lID09PSAnaW1hZ2VsYXllcicpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2VMYXllciA9IHRoaXMuX3BhcnNlSW1hZ2VMYXllcihjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChpbWFnZUxheWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VMYXllcnMoaW1hZ2VMYXllcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVOYW1lID09PSAnbGF5ZXInKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxheWVyID0gdGhpcy5fcGFyc2VMYXllcihjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TGF5ZXJzKGxheWVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlTmFtZSA9PT0gJ29iamVjdGdyb3VwJykge1xuICAgICAgICAgICAgICAgIGxldCBvYmplY3RHcm91cCA9IHRoaXMuX3BhcnNlT2JqZWN0R3JvdXAoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdEdyb3VwcyhvYmplY3RHcm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH0sXG5cbiAgICBfc2hvdWxkSWdub3JlTm9kZSAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gMyAvLyB0ZXh0XG4gICAgICAgICAgICB8fCBub2RlLm5vZGVUeXBlID09PSA4ICAgLy8gY29tbWVudFxuICAgICAgICAgICAgfHwgbm9kZS5ub2RlVHlwZSA9PT0gNDsgIC8vIGNkYXRhXG4gICAgfSxcblxuICAgIF9wYXJzZUltYWdlTGF5ZXIgKHNlbExheWVyKSB7XG4gICAgICAgIGxldCBkYXRhcyA9IHNlbExheWVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWFnZScpO1xuICAgICAgICBpZiAoIWRhdGFzIHx8IGRhdGFzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgaW1hZ2VMYXllciA9IG5ldyBjYy5UTVhJbWFnZUxheWVySW5mbygpO1xuICAgICAgICBpbWFnZUxheWVyLm5hbWUgPSBzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICAgICAgaW1hZ2VMYXllci5vZmZzZXQueCA9IHBhcnNlRmxvYXQoc2VsTGF5ZXIuZ2V0QXR0cmlidXRlKCdvZmZzZXR4JykpIHx8IDA7XG4gICAgICAgIGltYWdlTGF5ZXIub2Zmc2V0LnkgPSBwYXJzZUZsb2F0KHNlbExheWVyLmdldEF0dHJpYnV0ZSgnb2Zmc2V0eScpKSB8fCAwO1xuICAgICAgICBsZXQgdmlzaWJsZSA9IHNlbExheWVyLmdldEF0dHJpYnV0ZSgndmlzaWJsZScpO1xuICAgICAgICBpbWFnZUxheWVyLnZpc2libGUgPSAhKHZpc2libGUgPT09IFwiMFwiKTtcblxuICAgICAgICBsZXQgb3BhY2l0eSA9IHNlbExheWVyLmdldEF0dHJpYnV0ZSgnb3BhY2l0eScpIHx8IDE7XG4gICAgICAgIGltYWdlTGF5ZXIub3BhY2l0eSA9IHBhcnNlSW50KDI1NSAqIHBhcnNlRmxvYXQob3BhY2l0eSkpIHx8IDI1NTtcblxuICAgICAgICBsZXQgZGF0YSA9IGRhdGFzWzBdO1xuICAgICAgICBsZXQgc291cmNlID0gZGF0YS5nZXRBdHRyaWJ1dGUoJ3NvdXJjZScpO1xuICAgICAgICBpbWFnZUxheWVyLnNvdXJjZUltYWdlID0gdGhpcy5faW1hZ2VMYXllclRleHR1cmVzW3NvdXJjZV07XG4gICAgICAgIGltYWdlTGF5ZXIud2lkdGggPSBwYXJzZUludChkYXRhLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSkgfHwgMDtcbiAgICAgICAgaW1hZ2VMYXllci5oZWlnaHQgPSBwYXJzZUludChkYXRhLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpIHx8IDA7XG4gICAgICAgIGltYWdlTGF5ZXIudHJhbnMgPSBzdHJUb0NvbG9yKGRhdGEuZ2V0QXR0cmlidXRlKCd0cmFucycpKTtcblxuICAgICAgICBpZiAoIWltYWdlTGF5ZXIuc291cmNlSW1hZ2UpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoNzIyMSwgc291cmNlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbWFnZUxheWVyO1xuICAgIH0sXG4gXG4gICAgX3BhcnNlTGF5ZXIgKHNlbExheWVyKSB7XG4gICAgICAgIGxldCBkYXRhID0gc2VsTGF5ZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RhdGEnKVswXTtcblxuICAgICAgICBsZXQgbGF5ZXIgPSBuZXcgY2MuVE1YTGF5ZXJJbmZvKCk7XG4gICAgICAgIGxheWVyLm5hbWUgPSBzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuICAgICAgICBsZXQgbGF5ZXJTaXplID0gY2Muc2l6ZSgwLCAwKTtcbiAgICAgICAgbGF5ZXJTaXplLndpZHRoID0gcGFyc2VGbG9hdChzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpO1xuICAgICAgICBsYXllclNpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKTtcbiAgICAgICAgbGF5ZXIuX2xheWVyU2l6ZSA9IGxheWVyU2l6ZTtcblxuICAgICAgICBsZXQgdmlzaWJsZSA9IHNlbExheWVyLmdldEF0dHJpYnV0ZSgndmlzaWJsZScpO1xuICAgICAgICBsYXllci52aXNpYmxlID0gISh2aXNpYmxlID09PSBcIjBcIik7XG5cbiAgICAgICAgbGV0IG9wYWNpdHkgPSBzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ29wYWNpdHknKSB8fCAxO1xuICAgICAgICBpZiAob3BhY2l0eSlcbiAgICAgICAgICAgIGxheWVyLl9vcGFjaXR5ID0gcGFyc2VJbnQoMjU1ICogcGFyc2VGbG9hdChvcGFjaXR5KSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxheWVyLl9vcGFjaXR5ID0gMjU1O1xuICAgICAgICBsYXllci5vZmZzZXQgPSBjYy52MihwYXJzZUZsb2F0KHNlbExheWVyLmdldEF0dHJpYnV0ZSgnb2Zmc2V0eCcpKSB8fCAwLCBwYXJzZUZsb2F0KHNlbExheWVyLmdldEF0dHJpYnV0ZSgnb2Zmc2V0eScpKSB8fCAwKTtcblxuICAgICAgICBsZXQgbm9kZVZhbHVlID0gJyc7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0YS5jaGlsZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBub2RlVmFsdWUgKz0gZGF0YS5jaGlsZE5vZGVzW2pdLm5vZGVWYWx1ZVxuICAgICAgICB9XG4gICAgICAgIG5vZGVWYWx1ZSA9IG5vZGVWYWx1ZS50cmltKCk7XG5cbiAgICAgICAgLy8gVW5wYWNrIHRoZSB0aWxlbWFwIGRhdGFcbiAgICAgICAgbGV0IGNvbXByZXNzaW9uID0gZGF0YS5nZXRBdHRyaWJ1dGUoJ2NvbXByZXNzaW9uJyk7XG4gICAgICAgIGxldCBlbmNvZGluZyA9IGRhdGEuZ2V0QXR0cmlidXRlKCdlbmNvZGluZycpO1xuICAgICAgICBpZiAoY29tcHJlc3Npb24gJiYgY29tcHJlc3Npb24gIT09IFwiZ3ppcFwiICYmIGNvbXByZXNzaW9uICE9PSBcInpsaWJcIikge1xuICAgICAgICAgICAgY2MubG9nSUQoNzIxOCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGlsZXM7XG4gICAgICAgIHN3aXRjaCAoY29tcHJlc3Npb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2d6aXAnOlxuICAgICAgICAgICAgICAgIHRpbGVzID0gY29kZWMudW56aXBCYXNlNjRBc0FycmF5KG5vZGVWYWx1ZSwgNCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd6bGliJzpcbiAgICAgICAgICAgICAgICBsZXQgaW5mbGF0b3IgPSBuZXcgemxpYi5JbmZsYXRlKGNvZGVjLkJhc2U2NC5kZWNvZGVBc0FycmF5KG5vZGVWYWx1ZSwgMSkpO1xuICAgICAgICAgICAgICAgIHRpbGVzID0gdWludDhBcnJheVRvVWludDMyQXJyYXkoaW5mbGF0b3IuZGVjb21wcmVzcygpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbnVsbDpcbiAgICAgICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgICAgICAgLy8gVW5jb21wcmVzc2VkXG4gICAgICAgICAgICAgICAgaWYgKGVuY29kaW5nID09PSBcImJhc2U2NFwiKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcyA9IGNvZGVjLkJhc2U2NC5kZWNvZGVBc0FycmF5KG5vZGVWYWx1ZSwgNCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZW5jb2RpbmcgPT09IFwiY3N2XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNzdlRpbGVzID0gbm9kZVZhbHVlLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNzdklkeCA9IDA7IGNzdklkeCA8IGNzdlRpbGVzLmxlbmd0aDsgY3N2SWR4KyspXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHBhcnNlSW50KGNzdlRpbGVzW2NzdklkeF0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL1hNTCBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbERhdGFUaWxlcyA9IGRhdGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0aWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aWxlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB4bWxJZHggPSAwOyB4bWxJZHggPCBzZWxEYXRhVGlsZXMubGVuZ3RoOyB4bWxJZHgrKylcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2gocGFyc2VJbnQoc2VsRGF0YVRpbGVzW3htbElkeF0uZ2V0QXR0cmlidXRlKFwiZ2lkXCIpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXllckF0dHJzID09PSBjYy5UTVhMYXllckluZm8uQVRUUklCX05PTkUpXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDcyMTkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aWxlcykge1xuICAgICAgICAgICAgbGF5ZXIuX3RpbGVzID0gbmV3IFVpbnQzMkFycmF5KHRpbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBwYXJlbnQgZWxlbWVudCBpcyB0aGUgbGFzdCBsYXllclxuICAgICAgICBsYXllci5wcm9wZXJ0aWVzID0gZ2V0UHJvcGVydHlMaXN0KHNlbExheWVyKTtcblxuICAgICAgICByZXR1cm4gbGF5ZXI7XG4gICAgfSxcblxuICAgIF9wYXJzZU9iamVjdEdyb3VwIChzZWxHcm91cCkge1xuICAgICAgICBsZXQgb2JqZWN0R3JvdXAgPSBuZXcgY2MuVE1YT2JqZWN0R3JvdXBJbmZvKCk7XG4gICAgICAgIG9iamVjdEdyb3VwLm5hbWUgPSBzZWxHcm91cC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCAnJztcbiAgICAgICAgb2JqZWN0R3JvdXAub2Zmc2V0ID0gY2MudjIocGFyc2VGbG9hdChzZWxHcm91cC5nZXRBdHRyaWJ1dGUoJ29mZnNldHgnKSksIHBhcnNlRmxvYXQoc2VsR3JvdXAuZ2V0QXR0cmlidXRlKCdvZmZzZXR5JykpKTtcblxuICAgICAgICBsZXQgb3BhY2l0eSA9IHNlbEdyb3VwLmdldEF0dHJpYnV0ZSgnb3BhY2l0eScpIHx8IDE7XG4gICAgICAgIGlmIChvcGFjaXR5KVxuICAgICAgICAgICAgb2JqZWN0R3JvdXAuX29wYWNpdHkgPSBwYXJzZUludCgyNTUgKiBwYXJzZUZsb2F0KG9wYWNpdHkpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2JqZWN0R3JvdXAuX29wYWNpdHkgPSAyNTU7XG5cbiAgICAgICAgbGV0IHZpc2libGUgPSBzZWxHcm91cC5nZXRBdHRyaWJ1dGUoJ3Zpc2libGUnKTtcbiAgICAgICAgaWYgKHZpc2libGUgJiYgcGFyc2VJbnQodmlzaWJsZSkgPT09IDApXG4gICAgICAgICAgICBvYmplY3RHcm91cC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGNvbG9yID0gc2VsR3JvdXAuZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgICBpZiAoY29sb3IpXG4gICAgICAgICAgICBvYmplY3RHcm91cC5fY29sb3IuZnJvbUhFWChjb2xvcik7XG5cbiAgICAgICAgbGV0IGRyYXdvcmRlciA9IHNlbEdyb3VwLmdldEF0dHJpYnV0ZSgnZHJhd29yZGVyJyk7XG4gICAgICAgIGlmIChkcmF3b3JkZXIpXG4gICAgICAgICAgICBvYmplY3RHcm91cC5fZHJhd29yZGVyID0gZHJhd29yZGVyO1xuXG4gICAgICAgIC8vIHNldCB0aGUgcHJvcGVydGllcyB0byB0aGUgZ3JvdXBcbiAgICAgICAgb2JqZWN0R3JvdXAuc2V0UHJvcGVydGllcyhnZXRQcm9wZXJ0eUxpc3Qoc2VsR3JvdXApKTtcblxuICAgICAgICBsZXQgb2JqZWN0cyA9IHNlbEdyb3VwLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdvYmplY3QnKTtcbiAgICAgICAgaWYgKG9iamVjdHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb2JqZWN0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBzZWxPYmogPSBvYmplY3RzW2pdO1xuICAgICAgICAgICAgICAgIC8vIFRoZSB2YWx1ZSBmb3IgXCJ0eXBlXCIgd2FzIGJsYW5rIG9yIG5vdCBhIHZhbGlkIGNsYXNzIG5hbWVcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgVE1YT2JqZWN0SW5mbyB0byBzdG9yZSB0aGUgb2JqZWN0IGFuZCBpdHMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGxldCBvYmplY3RQcm9wID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGlkIG9mIHRoZSBvYmplY3RcbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wWydpZCddID0gc2VsT2JqLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCBqO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBuYW1lIG9mIHRoZSBvYmplY3QgdG8gdGhlIHZhbHVlIGZvciBcIm5hbWVcIlxuICAgICAgICAgICAgICAgIG9iamVjdFByb3BbXCJuYW1lXCJdID0gc2VsT2JqLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IFwiXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBBc3NpZ24gYWxsIHRoZSBhdHRyaWJ1dGVzIGFzIGtleS9uYW1lIHBhaXJzIGluIHRoZSBwcm9wZXJ0aWVzIGRpY3Rpb25hcnlcbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wW1wid2lkdGhcIl0gPSBwYXJzZUZsb2F0KHNlbE9iai5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpIHx8IDA7XG4gICAgICAgICAgICAgICAgb2JqZWN0UHJvcFtcImhlaWdodFwiXSA9IHBhcnNlRmxvYXQoc2VsT2JqLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpIHx8IDA7XG5cbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wW1wieFwiXSA9IHBhcnNlRmxvYXQoc2VsT2JqLmdldEF0dHJpYnV0ZSgneCcpKSB8fCAwO1xuICAgICAgICAgICAgICAgIG9iamVjdFByb3BbXCJ5XCJdID0gcGFyc2VGbG9hdChzZWxPYmouZ2V0QXR0cmlidXRlKCd5JykpIHx8IDA7XG5cbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wW1wicm90YXRpb25cIl0gPSBwYXJzZUZsb2F0KHNlbE9iai5nZXRBdHRyaWJ1dGUoJ3JvdGF0aW9uJykpIHx8IDA7XG5cbiAgICAgICAgICAgICAgICBnZXRQcm9wZXJ0eUxpc3Qoc2VsT2JqLCBvYmplY3RQcm9wKTtcblxuICAgICAgICAgICAgICAgIC8vIHZpc2libGVcbiAgICAgICAgICAgICAgICBsZXQgdmlzaWJsZUF0dHIgPSBzZWxPYmouZ2V0QXR0cmlidXRlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndmlzaWJsZSddID0gISh2aXNpYmxlQXR0ciAmJiBwYXJzZUludCh2aXNpYmxlQXR0cikgPT09IDApO1xuXG4gICAgICAgICAgICAgICAgLy8gdGV4dFxuICAgICAgICAgICAgICAgIGxldCB0ZXh0cyA9IHNlbE9iai5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0cyAmJiB0ZXh0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGV4dHNbMF07XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3R5cGUnXSA9IGNjLlRpbGVkTWFwLlRNWE9iamVjdFR5cGUuVEVYVDtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsnd3JhcCddID0gdGV4dC5nZXRBdHRyaWJ1dGUoJ3dyYXAnKSA9PSAnMSc7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ2NvbG9yJ10gPSBzdHJUb0NvbG9yKHRleHQuZ2V0QXR0cmlidXRlKCdjb2xvcicpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsnaGFsaWduJ10gPSBzdHJUb0hBbGlnbih0ZXh0LmdldEF0dHJpYnV0ZSgnaGFsaWduJykpO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RQcm9wWyd2YWxpZ24nXSA9IHN0clRvVkFsaWduKHRleHQuZ2V0QXR0cmlidXRlKCd2YWxpZ24nKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3BpeGVsc2l6ZSddID0gcGFyc2VJbnQodGV4dC5nZXRBdHRyaWJ1dGUoJ3BpeGVsc2l6ZScpKSB8fCAxNjtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndGV4dCddID0gdGV4dC5jaGlsZE5vZGVzWzBdLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpbWFnZVxuICAgICAgICAgICAgICAgIGxldCBnaWQgPSBzZWxPYmouZ2V0QXR0cmlidXRlKCdnaWQnKTtcbiAgICAgICAgICAgICAgICBpZiAoZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ2dpZCddID0gcGFyc2VJbnQoZ2lkKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndHlwZSddID0gY2MuVGlsZWRNYXAuVE1YT2JqZWN0VHlwZS5JTUFHRTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBlbGxpcHNlXG4gICAgICAgICAgICAgICAgbGV0IGVsbGlwc2UgPSBzZWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2VsbGlwc2UnKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndHlwZSddID0gY2MuVGlsZWRNYXAuVE1YT2JqZWN0VHlwZS5FTExJUFNFO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vcG9seWdvblxuICAgICAgICAgICAgICAgIGxldCBwb2x5Z29uUHJvcHMgPSBzZWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwb2x5Z29uXCIpO1xuICAgICAgICAgICAgICAgIGlmIChwb2x5Z29uUHJvcHMgJiYgcG9seWdvblByb3BzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndHlwZSddID0gY2MuVGlsZWRNYXAuVE1YT2JqZWN0VHlwZS5QT0xZR09OO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsUGdQb2ludFN0ciA9IHBvbHlnb25Qcm9wc1swXS5nZXRBdHRyaWJ1dGUoJ3BvaW50cycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsUGdQb2ludFN0cilcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbXCJwb2ludHNcIl0gPSB0aGlzLl9wYXJzZVBvaW50c1N0cmluZyhzZWxQZ1BvaW50U3RyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL3BvbHlsaW5lXG4gICAgICAgICAgICAgICAgbGV0IHBvbHlsaW5lUHJvcHMgPSBzZWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwb2x5bGluZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAocG9seWxpbmVQcm9wcyAmJiBwb2x5bGluZVByb3BzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndHlwZSddID0gY2MuVGlsZWRNYXAuVE1YT2JqZWN0VHlwZS5QT0xZTElORTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbFBsUG9pbnRTdHIgPSBwb2x5bGluZVByb3BzWzBdLmdldEF0dHJpYnV0ZSgncG9pbnRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxQbFBvaW50U3RyKVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFtcInBvbHlsaW5lUG9pbnRzXCJdID0gdGhpcy5fcGFyc2VQb2ludHNTdHJpbmcoc2VsUGxQb2ludFN0cik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFvYmplY3RQcm9wWyd0eXBlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndHlwZSddID0gY2MuVGlsZWRNYXAuVE1YT2JqZWN0VHlwZS5SRUNUO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgb2JqZWN0IHRvIHRoZSBvYmplY3RHcm91cFxuICAgICAgICAgICAgICAgIG9iamVjdEdyb3VwLl9vYmplY3RzLnB1c2gob2JqZWN0UHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdEdyb3VwO1xuICAgIH0sXG5cbiAgICBfcGFyc2VQb2ludHNTdHJpbmcgKHBvaW50c1N0cmluZykge1xuICAgICAgICBpZiAoIXBvaW50c1N0cmluZylcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICAgICAgbGV0IHBvaW50c1N0ciA9IHBvaW50c1N0cmluZy5zcGxpdCgnICcpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50c1N0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHNlbFBvaW50U3RyID0gcG9pbnRzU3RyW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBwb2ludHMucHVzaCh7J3gnOiBwYXJzZUZsb2F0KHNlbFBvaW50U3RyWzBdKSwgJ3knOiBwYXJzZUZsb2F0KHNlbFBvaW50U3RyWzFdKX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHRpbGUgYW5pbWF0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgc2V0VGlsZUFuaW1hdGlvbnMgKGFuaW1hdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fdGlsZUFuaW1hdGlvbnMgPSBhbmltYXRpb25zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0aWxlIGFuaW1hdGlvbnMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFRpbGVBbmltYXRpb25zICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVBbmltYXRpb25zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0aWxlIHByb3BlcnRpZXMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFRpbGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVQcm9wZXJ0aWVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHRpbGUgcHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGlsZVByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBzZXRUaWxlUHJvcGVydGllcyAodGlsZVByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5fdGlsZVByb3BlcnRpZXMgPSB0aWxlUHJvcGVydGllcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudFN0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50U3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0cmluZztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjdXJyZW50U3RyaW5nXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGN1cnJlbnRTdHJpbmdcbiAgICAgKi9cbiAgICBzZXRDdXJyZW50U3RyaW5nIChjdXJyZW50U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFN0cmluZyA9IGN1cnJlbnRTdHJpbmc7XG4gICAgfVxufTtcblxubGV0IF9wID0gY2MuVE1YTWFwSW5mby5wcm90b3R5cGU7XG5cbi8vIEV4dGVuZGVkIHByb3BlcnRpZXNcbmpzLmdldHNldChfcCwgXCJtYXBXaWR0aFwiLCBfcC5fZ2V0TWFwV2lkdGgsIF9wLl9zZXRNYXBXaWR0aCk7XG5qcy5nZXRzZXQoX3AsIFwibWFwSGVpZ2h0XCIsIF9wLl9nZXRNYXBIZWlnaHQsIF9wLl9zZXRNYXBIZWlnaHQpO1xuanMuZ2V0c2V0KF9wLCBcInRpbGVXaWR0aFwiLCBfcC5fZ2V0VGlsZVdpZHRoLCBfcC5fc2V0VGlsZVdpZHRoKTtcbmpzLmdldHNldChfcCwgXCJ0aWxlSGVpZ2h0XCIsIF9wLl9nZXRUaWxlSGVpZ2h0LCBfcC5fc2V0VGlsZUhlaWdodCk7XG5cblxuLyoqXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIE51bWJlclxuICovXG5jYy5UTVhMYXllckluZm8uQVRUUklCX05PTkUgPSAxIDw8IDA7XG4vKipcbiAqIEBjb25zdGFudFxuICogQHR5cGUgTnVtYmVyXG4gKi9cbmNjLlRNWExheWVySW5mby5BVFRSSUJfQkFTRTY0ID0gMSA8PCAxO1xuLyoqXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIE51bWJlclxuICovXG5jYy5UTVhMYXllckluZm8uQVRUUklCX0daSVAgPSAxIDw8IDI7XG4vKipcbiAqIEBjb25zdGFudFxuICogQHR5cGUgTnVtYmVyXG4gKi9cbmNjLlRNWExheWVySW5mby5BVFRSSUJfWkxJQiA9IDEgPDwgMztcbiJdfQ==