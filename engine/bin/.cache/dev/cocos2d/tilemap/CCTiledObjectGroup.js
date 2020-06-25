
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledObjectGroup.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

/**
 * !#en Renders the TMX object group.
 * !#zh 渲染 tmx object group。
 * @class TiledObjectGroup
 * @extends Component
 */
var TiledObjectGroup = cc.Class({
  name: 'cc.TiledObjectGroup',
  // Inherits from the abstract class directly,
  // because TiledLayer not create or maintains the sgNode by itself.
  "extends": cc.Component,

  /**
   * !#en Offset position of child objects.
   * !#zh 获取子对象的偏移位置。
   * @method getPositionOffset
   * @return {Vec2}
   * @example
   * let offset = tMXObjectGroup.getPositionOffset();
   */
  getPositionOffset: function getPositionOffset() {
    return this._positionOffset;
  },

  /**
   * !#en List of properties stored in a dictionary.
   * !#zh 以映射的形式获取属性列表。
   * @method getProperties
   * @return {Object}
   * @example
   * let offset = tMXObjectGroup.getProperties();
   */
  getProperties: function getProperties() {
    this._properties;
  },

  /**
   * !#en Gets the Group name.
   * !#zh 获取组名称。
   * @method getGroupName
   * @return {String}
   * @example
   * let groupName = tMXObjectGroup.getGroupName;
   */
  getGroupName: function getGroupName() {
    return this._groupName;
  },

  /**
   * Return the value for the specific property name
   * @param {String} propertyName
   * @return {Object}
   */
  getProperty: function getProperty(propertyName) {
    return this._properties[propertyName.toString()];
  },

  /**
   * !#en
   * Return the object for the specific object name. <br />
   * It will return the 1st object found on the array for the given name.
   * !#zh 获取指定的对象。
   * @method getObject
   * @param {String} objectName
   * @return {Object|Null}
   * @example
   * let object = tMXObjectGroup.getObject("Group");
   */
  getObject: function getObject(objectName) {
    for (var i = 0, len = this._objects.length; i < len; i++) {
      var obj = this._objects[i];

      if (obj && obj.name === objectName) {
        return obj;
      }
    } // object not found


    return null;
  },

  /**
   * !#en Gets the objects.
   * !#zh 获取对象数组。
   * @method getObjects
   * @return {Array}
   * @example
   * let objects = tMXObjectGroup.getObjects();
   */
  getObjects: function getObjects() {
    return this._objects;
  },
  _init: function _init(groupInfo, mapInfo, texGrids) {
    var TiledMap = cc.TiledMap;
    var TMXObjectType = TiledMap.TMXObjectType;
    var Orientation = TiledMap.Orientation;
    var StaggerAxis = TiledMap.StaggerAxis;
    var TileFlag = TiledMap.TileFlag;
    var FLIPPED_MASK = TileFlag.FLIPPED_MASK;
    this._groupName = groupInfo.name;
    this._positionOffset = groupInfo.offset;
    this._mapInfo = mapInfo;
    this._properties = groupInfo.getProperties();
    this._offset = cc.v2(groupInfo.offset.x, -groupInfo.offset.y);
    this._opacity = groupInfo._opacity;
    var mapSize = mapInfo._mapSize;
    var tileSize = mapInfo._tileSize;
    var width = 0,
        height = 0;

    if (mapInfo.orientation === Orientation.HEX) {
      if (mapInfo.getStaggerAxis() === StaggerAxis.STAGGERAXIS_X) {
        height = tileSize.height * (mapSize.height + 0.5);
        width = (tileSize.width + mapInfo.getHexSideLength()) * Math.floor(mapSize.width / 2) + tileSize.width * (mapSize.width % 2);
      } else {
        width = tileSize.width * (mapSize.width + 0.5);
        height = (tileSize.height + mapInfo.getHexSideLength()) * Math.floor(mapSize.height / 2) + tileSize.height * (mapSize.height % 2);
      }
    } else if (mapInfo.orientation === Orientation.ISO) {
      var wh = mapSize.width + mapSize.height;
      width = tileSize.width * 0.5 * wh;
      height = tileSize.height * 0.5 * wh;
    } else {
      width = mapSize.width * tileSize.width;
      height = mapSize.height * tileSize.height;
    }

    this.node.setContentSize(width, height);
    var leftTopX = width * this.node.anchorX;
    var leftTopY = height * (1 - this.node.anchorY);
    var objects = groupInfo._objects;
    var aliveNodes = {};

    for (var i = 0, childIdx = objects.length - 1, l = objects.length; i < l; i++, childIdx--) {
      var object = objects[i];
      var objType = object.type;
      object.offset = cc.v2(object.x, object.y);
      var points = object.points || object.polylinePoints;

      if (points) {
        for (var pi = 0; pi < points.length; pi++) {
          points[pi].y *= -1;
        }
      }

      if (Orientation.ISO !== mapInfo.orientation) {
        object.y = height - object.y;
      } else {
        var posIdxX = object.x / tileSize.width * 2;
        var posIdxY = object.y / tileSize.height;
        object.x = tileSize.width * 0.5 * (mapSize.height + posIdxX - posIdxY);
        object.y = tileSize.height * 0.5 * (mapSize.width + mapSize.height - posIdxX - posIdxY);
      }

      if (objType === TMXObjectType.TEXT) {
        var textName = "text" + object.id;
        aliveNodes[textName] = true;
        var textNode = this.node.getChildByName(textName);

        if (!textNode) {
          textNode = new cc.Node();
        }

        textNode.anchorX = 0;
        textNode.anchorY = 1;
        textNode.angle = -object.rotation;
        textNode.x = object.x - leftTopX;
        textNode.y = object.y - leftTopY;
        textNode.name = textName;
        textNode.parent = this.node;
        textNode.color = object.color;
        textNode.opacity = this._opacity;
        textNode.setSiblingIndex(childIdx);
        var label = textNode.getComponent(cc.Label);

        if (!label) {
          label = textNode.addComponent(cc.Label);
        }

        label.overflow = cc.Label.Overflow.SHRINK;
        label.lineHeight = object.height;
        label.string = object.text;
        label.horizontalAlign = object.halign;
        label.verticalAlign = object.valign;
        label.fontSize = object.pixelsize;
        textNode.width = object.width;
        textNode.height = object.height;
      }

      if (objType === TMXObjectType.IMAGE) {
        var grid = texGrids[(object.gid & FLIPPED_MASK) >>> 0];
        if (!grid) continue;
        var tileset = grid.tileset;
        var imgName = "img" + object.id;
        aliveNodes[imgName] = true;
        var imgNode = this.node.getChildByName(imgName);
        var imgWidth = object.width || grid.width;
        var imgHeight = object.height || grid.height;
        var tileOffsetX = tileset.tileOffset.x;
        var tileOffsetY = tileset.tileOffset.y; // Delete image nodes implemented as private nodes
        // Use cc.Node to implement node-level requirements

        if (imgNode instanceof cc.PrivateNode) {
          imgNode.removeFromParent();
          imgNode.destroy();
          imgNode = null;
        }

        if (!imgNode) {
          imgNode = new cc.Node();
        }

        if (Orientation.ISO == mapInfo.orientation) {
          imgNode.anchorX = 0.5 + tileOffsetX / imgWidth;
          imgNode.anchorY = tileOffsetY / imgHeight;
        } else {
          imgNode.anchorX = tileOffsetX / imgWidth;
          imgNode.anchorY = tileOffsetY / imgHeight;
        }

        imgNode.angle = -object.rotation;
        imgNode.x = object.x - leftTopX;
        imgNode.y = object.y - leftTopY;
        imgNode.name = imgName;
        imgNode.parent = this.node;
        imgNode.opacity = this._opacity;
        imgNode.setSiblingIndex(childIdx);
        var sp = imgNode.getComponent(cc.Sprite);

        if (!sp) {
          sp = imgNode.addComponent(cc.Sprite);
        }

        var spf = sp.spriteFrame;

        if (!spf) {
          spf = new cc.SpriteFrame();
        }

        spf.setTexture(grid.tileset.sourceImage, cc.rect(grid));
        sp.spriteFrame = spf; // object group may has no width or height info

        imgNode.width = imgWidth;
        imgNode.height = imgHeight;
      }
    }

    this._objects = objects; // destroy useless node

    var children = this.node.children;
    var uselessExp = /^(?:img|text)\d+$/;

    for (var _i = 0, n = children.length; _i < n; _i++) {
      var c = children[_i];
      var cName = c._name;
      var isUseless = uselessExp.test(cName);
      if (isUseless && !aliveNodes[cName]) c.destroy();
    }
  }
});
cc.TiledObjectGroup = module.exports = TiledObjectGroup;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVGlsZWRPYmplY3RHcm91cC5qcyJdLCJuYW1lcyI6WyJUaWxlZE9iamVjdEdyb3VwIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJnZXRQb3NpdGlvbk9mZnNldCIsIl9wb3NpdGlvbk9mZnNldCIsImdldFByb3BlcnRpZXMiLCJfcHJvcGVydGllcyIsImdldEdyb3VwTmFtZSIsIl9ncm91cE5hbWUiLCJnZXRQcm9wZXJ0eSIsInByb3BlcnR5TmFtZSIsInRvU3RyaW5nIiwiZ2V0T2JqZWN0Iiwib2JqZWN0TmFtZSIsImkiLCJsZW4iLCJfb2JqZWN0cyIsImxlbmd0aCIsIm9iaiIsImdldE9iamVjdHMiLCJfaW5pdCIsImdyb3VwSW5mbyIsIm1hcEluZm8iLCJ0ZXhHcmlkcyIsIlRpbGVkTWFwIiwiVE1YT2JqZWN0VHlwZSIsIk9yaWVudGF0aW9uIiwiU3RhZ2dlckF4aXMiLCJUaWxlRmxhZyIsIkZMSVBQRURfTUFTSyIsIm9mZnNldCIsIl9tYXBJbmZvIiwiX29mZnNldCIsInYyIiwieCIsInkiLCJfb3BhY2l0eSIsIm1hcFNpemUiLCJfbWFwU2l6ZSIsInRpbGVTaXplIiwiX3RpbGVTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJvcmllbnRhdGlvbiIsIkhFWCIsImdldFN0YWdnZXJBeGlzIiwiU1RBR0dFUkFYSVNfWCIsImdldEhleFNpZGVMZW5ndGgiLCJNYXRoIiwiZmxvb3IiLCJJU08iLCJ3aCIsIm5vZGUiLCJzZXRDb250ZW50U2l6ZSIsImxlZnRUb3BYIiwiYW5jaG9yWCIsImxlZnRUb3BZIiwiYW5jaG9yWSIsIm9iamVjdHMiLCJhbGl2ZU5vZGVzIiwiY2hpbGRJZHgiLCJsIiwib2JqZWN0Iiwib2JqVHlwZSIsInR5cGUiLCJwb2ludHMiLCJwb2x5bGluZVBvaW50cyIsInBpIiwicG9zSWR4WCIsInBvc0lkeFkiLCJURVhUIiwidGV4dE5hbWUiLCJpZCIsInRleHROb2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJOb2RlIiwiYW5nbGUiLCJyb3RhdGlvbiIsInBhcmVudCIsImNvbG9yIiwib3BhY2l0eSIsInNldFNpYmxpbmdJbmRleCIsImxhYmVsIiwiZ2V0Q29tcG9uZW50IiwiTGFiZWwiLCJhZGRDb21wb25lbnQiLCJvdmVyZmxvdyIsIk92ZXJmbG93IiwiU0hSSU5LIiwibGluZUhlaWdodCIsInN0cmluZyIsInRleHQiLCJob3Jpem9udGFsQWxpZ24iLCJoYWxpZ24iLCJ2ZXJ0aWNhbEFsaWduIiwidmFsaWduIiwiZm9udFNpemUiLCJwaXhlbHNpemUiLCJJTUFHRSIsImdyaWQiLCJnaWQiLCJ0aWxlc2V0IiwiaW1nTmFtZSIsImltZ05vZGUiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsInRpbGVPZmZzZXRYIiwidGlsZU9mZnNldCIsInRpbGVPZmZzZXRZIiwiUHJpdmF0ZU5vZGUiLCJyZW1vdmVGcm9tUGFyZW50IiwiZGVzdHJveSIsInNwIiwiU3ByaXRlIiwic3BmIiwic3ByaXRlRnJhbWUiLCJTcHJpdGVGcmFtZSIsInNldFRleHR1cmUiLCJzb3VyY2VJbWFnZSIsInJlY3QiLCJjaGlsZHJlbiIsInVzZWxlc3NFeHAiLCJuIiwiYyIsImNOYW1lIiwiX25hbWUiLCJpc1VzZWxlc3MiLCJ0ZXN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7O0FBTUEsSUFBSUEsZ0JBQWdCLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUscUJBRHNCO0FBRzVCO0FBQ0E7QUFDQSxhQUFTRixFQUFFLENBQUNHLFNBTGdCOztBQU81Qjs7Ozs7Ozs7QUFRQUMsRUFBQUEsaUJBZjRCLCtCQWVQO0FBQ2pCLFdBQU8sS0FBS0MsZUFBWjtBQUNILEdBakIyQjs7QUFtQjVCOzs7Ozs7OztBQVFBQyxFQUFBQSxhQTNCNEIsMkJBMkJYO0FBQ2IsU0FBS0MsV0FBTDtBQUNILEdBN0IyQjs7QUErQjVCOzs7Ozs7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YWlCLFdBQTVCLEVBQXlDdkgsRUFBRSxDQUFDd0gsSUFBSCxDQUFRcEIsSUFBUixDQUF6QztBQUNBYSxRQUFBQSxFQUFFLENBQUNHLFdBQUgsR0FBaUJELEdBQWpCLENBaERpQyxDQWtEakM7O0FBQ0FYLFFBQUFBLE9BQU8sQ0FBQzlELEtBQVIsR0FBZ0IrRCxRQUFoQjtBQUNBRCxRQUFBQSxPQUFPLENBQUM3RCxNQUFSLEdBQWlCK0QsU0FBakI7QUFDSDtBQUNKOztBQUNELFNBQUt6RixRQUFMLEdBQWdCMEMsT0FBaEIsQ0F6SmlDLENBMkpqQzs7QUFDQSxRQUFJOEQsUUFBUSxHQUFHLEtBQUtwRSxJQUFMLENBQVVvRSxRQUF6QjtBQUNBLFFBQUlDLFVBQVUsR0FBRyxtQkFBakI7O0FBQ0EsU0FBSyxJQUFJM0csRUFBQyxHQUFHLENBQVIsRUFBVzRHLENBQUMsR0FBR0YsUUFBUSxDQUFDdkcsTUFBN0IsRUFBcUNILEVBQUMsR0FBRzRHLENBQXpDLEVBQTRDNUcsRUFBQyxFQUE3QyxFQUFpRDtBQUM3QyxVQUFJNkcsQ0FBQyxHQUFHSCxRQUFRLENBQUMxRyxFQUFELENBQWhCO0FBQ0EsVUFBSThHLEtBQUssR0FBR0QsQ0FBQyxDQUFDRSxLQUFkO0FBQ0EsVUFBSUMsU0FBUyxHQUFHTCxVQUFVLENBQUNNLElBQVgsQ0FBZ0JILEtBQWhCLENBQWhCO0FBQ0EsVUFBSUUsU0FBUyxJQUFJLENBQUNuRSxVQUFVLENBQUNpRSxLQUFELENBQTVCLEVBQXFDRCxDQUFDLENBQUNaLE9BQUY7QUFDeEM7QUFDSjtBQTFQMkIsQ0FBVCxDQUF2QjtBQTZQQWhILEVBQUUsQ0FBQ0QsZ0JBQUgsR0FBc0JrSSxNQUFNLENBQUNDLE9BQVAsR0FBaUJuSSxnQkFBdkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAqICEjZW4gUmVuZGVycyB0aGUgVE1YIG9iamVjdCBncm91cC5cbiAqICEjemgg5riy5p+TIHRteCBvYmplY3QgZ3JvdXDjgIJcbiAqIEBjbGFzcyBUaWxlZE9iamVjdEdyb3VwXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IFRpbGVkT2JqZWN0R3JvdXAgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRpbGVkT2JqZWN0R3JvdXAnLFxuXG4gICAgLy8gSW5oZXJpdHMgZnJvbSB0aGUgYWJzdHJhY3QgY2xhc3MgZGlyZWN0bHksXG4gICAgLy8gYmVjYXVzZSBUaWxlZExheWVyIG5vdCBjcmVhdGUgb3IgbWFpbnRhaW5zIHRoZSBzZ05vZGUgYnkgaXRzZWxmLlxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gT2Zmc2V0IHBvc2l0aW9uIG9mIGNoaWxkIG9iamVjdHMuXG4gICAgICogISN6aCDojrflj5blrZDlr7nosaHnmoTlgY/np7vkvY3nva7jgIJcbiAgICAgKiBAbWV0aG9kIGdldFBvc2l0aW9uT2Zmc2V0XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBvZmZzZXQgPSB0TVhPYmplY3RHcm91cC5nZXRQb3NpdGlvbk9mZnNldCgpO1xuICAgICAqL1xuICAgIGdldFBvc2l0aW9uT2Zmc2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uT2Zmc2V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExpc3Qgb2YgcHJvcGVydGllcyBzdG9yZWQgaW4gYSBkaWN0aW9uYXJ5LlxuICAgICAqICEjemgg5Lul5pig5bCE55qE5b2i5byP6I635Y+W5bGe5oCn5YiX6KGo44CCXG4gICAgICogQG1ldGhvZCBnZXRQcm9wZXJ0aWVzXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IG9mZnNldCA9IHRNWE9iamVjdEdyb3VwLmdldFByb3BlcnRpZXMoKTtcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBHcm91cCBuYW1lLlxuICAgICAqICEjemgg6I635Y+W57uE5ZCN56ew44CCXG4gICAgICogQG1ldGhvZCBnZXRHcm91cE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgZ3JvdXBOYW1lID0gdE1YT2JqZWN0R3JvdXAuZ2V0R3JvdXBOYW1lO1xuICAgICAqL1xuICAgIGdldEdyb3VwTmFtZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cE5hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBwcm9wZXJ0eSBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eSAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZS50b1N0cmluZygpXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybiB0aGUgb2JqZWN0IGZvciB0aGUgc3BlY2lmaWMgb2JqZWN0IG5hbWUuIDxiciAvPlxuICAgICAqIEl0IHdpbGwgcmV0dXJuIHRoZSAxc3Qgb2JqZWN0IGZvdW5kIG9uIHRoZSBhcnJheSBmb3IgdGhlIGdpdmVuIG5hbWUuXG4gICAgICogISN6aCDojrflj5bmjIflrprnmoTlr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIGdldE9iamVjdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvYmplY3ROYW1lXG4gICAgICogQHJldHVybiB7T2JqZWN0fE51bGx9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgb2JqZWN0ID0gdE1YT2JqZWN0R3JvdXAuZ2V0T2JqZWN0KFwiR3JvdXBcIik7XG4gICAgICovXG4gICAgZ2V0T2JqZWN0IChvYmplY3ROYW1lKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLl9vYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5fb2JqZWN0c1tpXTtcbiAgICAgICAgICAgIGlmIChvYmogJiYgb2JqLm5hbWUgPT09IG9iamVjdE5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBub3QgZm91bmRcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyB0aGUgb2JqZWN0cy5cbiAgICAgKiAhI3poIOiOt+WPluWvueixoeaVsOe7hOOAglxuICAgICAqIEBtZXRob2QgZ2V0T2JqZWN0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IG9iamVjdHMgPSB0TVhPYmplY3RHcm91cC5nZXRPYmplY3RzKCk7XG4gICAgICovXG4gICAgZ2V0T2JqZWN0cyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vYmplY3RzO1xuICAgIH0sXG5cbiAgICBfaW5pdCAoZ3JvdXBJbmZvLCBtYXBJbmZvLCB0ZXhHcmlkcykge1xuICAgICAgICBjb25zdCBUaWxlZE1hcCA9IGNjLlRpbGVkTWFwO1xuICAgICAgICBjb25zdCBUTVhPYmplY3RUeXBlID0gVGlsZWRNYXAuVE1YT2JqZWN0VHlwZTtcbiAgICAgICAgY29uc3QgT3JpZW50YXRpb24gPSBUaWxlZE1hcC5PcmllbnRhdGlvbjtcbiAgICAgICAgY29uc3QgU3RhZ2dlckF4aXMgPSBUaWxlZE1hcC5TdGFnZ2VyQXhpcztcbiAgICAgICAgY29uc3QgVGlsZUZsYWcgPSBUaWxlZE1hcC5UaWxlRmxhZztcbiAgICAgICAgY29uc3QgRkxJUFBFRF9NQVNLID0gVGlsZUZsYWcuRkxJUFBFRF9NQVNLO1xuXG4gICAgICAgIHRoaXMuX2dyb3VwTmFtZSA9IGdyb3VwSW5mby5uYW1lO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbk9mZnNldCA9IGdyb3VwSW5mby5vZmZzZXQ7XG4gICAgICAgIHRoaXMuX21hcEluZm8gPSBtYXBJbmZvO1xuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gZ3JvdXBJbmZvLmdldFByb3BlcnRpZXMoKTtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gY2MudjIoZ3JvdXBJbmZvLm9mZnNldC54LCAtZ3JvdXBJbmZvLm9mZnNldC55KTtcbiAgICAgICAgdGhpcy5fb3BhY2l0eSA9IGdyb3VwSW5mby5fb3BhY2l0eTtcblxuICAgICAgICBsZXQgbWFwU2l6ZSA9IG1hcEluZm8uX21hcFNpemU7XG4gICAgICAgIGxldCB0aWxlU2l6ZSA9IG1hcEluZm8uX3RpbGVTaXplO1xuICAgICAgICBsZXQgd2lkdGggPSAwLCBoZWlnaHQgPSAwO1xuICAgICAgICBpZiAobWFwSW5mby5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uSEVYKSB7XG4gICAgICAgICAgICBpZiAobWFwSW5mby5nZXRTdGFnZ2VyQXhpcygpID09PSBTdGFnZ2VyQXhpcy5TVEFHR0VSQVhJU19YKSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gdGlsZVNpemUuaGVpZ2h0ICogKG1hcFNpemUuaGVpZ2h0ICsgMC41KTtcbiAgICAgICAgICAgICAgICB3aWR0aCA9ICh0aWxlU2l6ZS53aWR0aCArIG1hcEluZm8uZ2V0SGV4U2lkZUxlbmd0aCgpKSAqIE1hdGguZmxvb3IobWFwU2l6ZS53aWR0aCAvIDIpICsgdGlsZVNpemUud2lkdGggKiAobWFwU2l6ZS53aWR0aCAlIDIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRpbGVTaXplLndpZHRoICogKG1hcFNpemUud2lkdGggKyAwLjUpO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9ICh0aWxlU2l6ZS5oZWlnaHQgKyBtYXBJbmZvLmdldEhleFNpZGVMZW5ndGgoKSkgKiBNYXRoLmZsb29yKG1hcFNpemUuaGVpZ2h0IC8gMikgKyB0aWxlU2l6ZS5oZWlnaHQgKiAobWFwU2l6ZS5oZWlnaHQgJSAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtYXBJbmZvLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5JU08pIHtcbiAgICAgICAgICAgIGxldCB3aCA9IG1hcFNpemUud2lkdGggKyBtYXBTaXplLmhlaWdodDtcbiAgICAgICAgICAgIHdpZHRoID0gdGlsZVNpemUud2lkdGggKiAwLjUgKiB3aDtcbiAgICAgICAgICAgIGhlaWdodCA9IHRpbGVTaXplLmhlaWdodCAqIDAuNSAqIHdoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggPSBtYXBTaXplLndpZHRoICogdGlsZVNpemUud2lkdGg7IFxuICAgICAgICAgICAgaGVpZ2h0ID0gbWFwU2l6ZS5oZWlnaHQgKiB0aWxlU2l6ZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGxldCBsZWZ0VG9wWCA9IHdpZHRoICogdGhpcy5ub2RlLmFuY2hvclg7XG4gICAgICAgIGxldCBsZWZ0VG9wWSA9IGhlaWdodCAqICgxIC0gdGhpcy5ub2RlLmFuY2hvclkpO1xuXG4gICAgICAgIGxldCBvYmplY3RzID0gZ3JvdXBJbmZvLl9vYmplY3RzO1xuICAgICAgICBsZXQgYWxpdmVOb2RlcyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgY2hpbGRJZHggPSBvYmplY3RzLmxlbmd0aCAtIDEsIGwgPSBvYmplY3RzLmxlbmd0aDsgaSA8IGw7IGkrKywgY2hpbGRJZHgtLSkge1xuICAgICAgICAgICAgbGV0IG9iamVjdCA9IG9iamVjdHNbaV07XG4gICAgICAgICAgICBsZXQgb2JqVHlwZSA9IG9iamVjdC50eXBlO1xuICAgICAgICAgICAgb2JqZWN0Lm9mZnNldCA9IGNjLnYyKG9iamVjdC54LCBvYmplY3QueSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBwb2ludHMgPSBvYmplY3QucG9pbnRzIHx8IG9iamVjdC5wb2x5bGluZVBvaW50cztcbiAgICAgICAgICAgIGlmIChwb2ludHMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwaSA9IDA7IHBpIDwgcG9pbnRzLmxlbmd0aDsgcGkrKykge1xuICAgICAgICAgICAgICAgICAgICBwb2ludHNbcGldLnkgKj0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAoT3JpZW50YXRpb24uSVNPICE9PSBtYXBJbmZvLm9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnkgPSBoZWlnaHQgLSBvYmplY3QueTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvc0lkeFggPSBvYmplY3QueCAvIHRpbGVTaXplLndpZHRoICogMjtcbiAgICAgICAgICAgICAgICBsZXQgcG9zSWR4WSA9IG9iamVjdC55IC8gdGlsZVNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIG9iamVjdC54ID0gdGlsZVNpemUud2lkdGggKiAwLjUgKiAobWFwU2l6ZS5oZWlnaHQgKyBwb3NJZHhYIC0gcG9zSWR4WSk7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnkgPSB0aWxlU2l6ZS5oZWlnaHQgKiAwLjUgKiAobWFwU2l6ZS53aWR0aCArIG1hcFNpemUuaGVpZ2h0IC0gcG9zSWR4WCAtIHBvc0lkeFkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PT0gVE1YT2JqZWN0VHlwZS5URVhUKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHROYW1lID0gXCJ0ZXh0XCIgKyBvYmplY3QuaWQ7XG4gICAgICAgICAgICAgICAgYWxpdmVOb2Rlc1t0ZXh0TmFtZV0gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRleHROb2RlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKHRleHROYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRleHROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5hbmNob3JYID0gMDtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5hbmNob3JZID0gMTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5hbmdsZSA9IC1vYmplY3Qucm90YXRpb247XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUueCA9IG9iamVjdC54IC0gbGVmdFRvcFg7XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUueSA9IG9iamVjdC55IC0gbGVmdFRvcFk7XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUubmFtZSA9IHRleHROYW1lO1xuICAgICAgICAgICAgICAgIHRleHROb2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5jb2xvciA9IG9iamVjdC5jb2xvcjtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5vcGFjaXR5ID0gdGhpcy5fb3BhY2l0eTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5zZXRTaWJsaW5nSW5kZXgoY2hpbGRJZHgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gdGV4dE5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gdGV4dE5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGFiZWwub3ZlcmZsb3cgPSBjYy5MYWJlbC5PdmVyZmxvdy5TSFJJTks7XG4gICAgICAgICAgICAgICAgbGFiZWwubGluZUhlaWdodCA9IG9iamVjdC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFiZWwuc3RyaW5nID0gb2JqZWN0LnRleHQ7XG4gICAgICAgICAgICAgICAgbGFiZWwuaG9yaXpvbnRhbEFsaWduID0gb2JqZWN0LmhhbGlnbjtcbiAgICAgICAgICAgICAgICBsYWJlbC52ZXJ0aWNhbEFsaWduID0gb2JqZWN0LnZhbGlnbjtcbiAgICAgICAgICAgICAgICBsYWJlbC5mb250U2l6ZSA9IG9iamVjdC5waXhlbHNpemU7XG5cbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS53aWR0aCA9IG9iamVjdC53aWR0aDtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5oZWlnaHQgPSBvYmplY3QuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PT0gVE1YT2JqZWN0VHlwZS5JTUFHRSkge1xuICAgICAgICAgICAgICAgIGxldCBncmlkID0gdGV4R3JpZHNbKG9iamVjdC5naWQgJiBGTElQUEVEX01BU0spID4+PiAwXTtcbiAgICAgICAgICAgICAgICBpZiAoIWdyaWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGxldCB0aWxlc2V0ID0gZ3JpZC50aWxlc2V0O1xuICAgICAgICAgICAgICAgIGxldCBpbWdOYW1lID0gXCJpbWdcIiArIG9iamVjdC5pZDtcbiAgICAgICAgICAgICAgICBhbGl2ZU5vZGVzW2ltZ05hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgaW1nTm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShpbWdOYW1lKTtcbiAgICAgICAgICAgICAgICBsZXQgaW1nV2lkdGggPSBvYmplY3Qud2lkdGggfHwgZ3JpZC53aWR0aDtcbiAgICAgICAgICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gb2JqZWN0LmhlaWdodCB8fCBncmlkLmhlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZU9mZnNldFggPSB0aWxlc2V0LnRpbGVPZmZzZXQueDtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZU9mZnNldFkgPSB0aWxlc2V0LnRpbGVPZmZzZXQueTtcblxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBpbWFnZSBub2RlcyBpbXBsZW1lbnRlZCBhcyBwcml2YXRlIG5vZGVzXG4gICAgICAgICAgICAgICAgLy8gVXNlIGNjLk5vZGUgdG8gaW1wbGVtZW50IG5vZGUtbGV2ZWwgcmVxdWlyZW1lbnRzXG4gICAgICAgICAgICAgICAgaWYgKGltZ05vZGUgaW5zdGFuY2VvZiBjYy5Qcml2YXRlTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBpbWdOb2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaW1nTm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIGltZ05vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaW1nTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBpbWdOb2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoT3JpZW50YXRpb24uSVNPID09IG1hcEluZm8ub3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nTm9kZS5hbmNob3JYID0gMC41ICsgdGlsZU9mZnNldFggLyBpbWdXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaW1nTm9kZS5hbmNob3JZID0gdGlsZU9mZnNldFkgLyBpbWdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nTm9kZS5hbmNob3JYID0gdGlsZU9mZnNldFggLyBpbWdXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaW1nTm9kZS5hbmNob3JZID0gdGlsZU9mZnNldFkgLyBpbWdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGltZ05vZGUuYW5nbGUgPSAtb2JqZWN0LnJvdGF0aW9uO1xuICAgICAgICAgICAgICAgIGltZ05vZGUueCA9IG9iamVjdC54IC0gbGVmdFRvcFg7XG4gICAgICAgICAgICAgICAgaW1nTm9kZS55ID0gb2JqZWN0LnkgLSBsZWZ0VG9wWTtcbiAgICAgICAgICAgICAgICBpbWdOb2RlLm5hbWUgPSBpbWdOYW1lO1xuICAgICAgICAgICAgICAgIGltZ05vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIGltZ05vZGUub3BhY2l0eSA9IHRoaXMuX29wYWNpdHk7XG4gICAgICAgICAgICAgICAgaW1nTm9kZS5zZXRTaWJsaW5nSW5kZXgoY2hpbGRJZHgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHNwID0gaW1nTm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwID0gaW1nTm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHNwZiA9IHNwLnNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGlmICghc3BmKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzcGYuc2V0VGV4dHVyZShncmlkLnRpbGVzZXQuc291cmNlSW1hZ2UsIGNjLnJlY3QoZ3JpZCkpO1xuICAgICAgICAgICAgICAgIHNwLnNwcml0ZUZyYW1lID0gc3BmO1xuXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0IGdyb3VwIG1heSBoYXMgbm8gd2lkdGggb3IgaGVpZ2h0IGluZm9cbiAgICAgICAgICAgICAgICBpbWdOb2RlLndpZHRoID0gaW1nV2lkdGg7XG4gICAgICAgICAgICAgICAgaW1nTm9kZS5oZWlnaHQgPSBpbWdIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb2JqZWN0cyA9IG9iamVjdHM7XG5cbiAgICAgICAgLy8gZGVzdHJveSB1c2VsZXNzIG5vZGVcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xuICAgICAgICBsZXQgdXNlbGVzc0V4cCA9IC9eKD86aW1nfHRleHQpXFxkKyQvO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IGMgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGxldCBjTmFtZSA9IGMuX25hbWU7XG4gICAgICAgICAgICBsZXQgaXNVc2VsZXNzID0gdXNlbGVzc0V4cC50ZXN0KGNOYW1lKTtcbiAgICAgICAgICAgIGlmIChpc1VzZWxlc3MgJiYgIWFsaXZlTm9kZXNbY05hbWVdKSBjLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5UaWxlZE9iamVjdEdyb3VwID0gbW9kdWxlLmV4cG9ydHMgPSBUaWxlZE9iamVjdEdyb3VwO1xuIl19