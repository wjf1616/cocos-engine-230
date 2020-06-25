
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCSpriteFrame.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var EventTarget = require("../event/event-target");

var textureUtil = require('../utils/texture-util');

var INSET_LEFT = 0;
var INSET_TOP = 1;
var INSET_RIGHT = 2;
var INSET_BOTTOM = 3;
var temp_uvs = [{
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}];
/**
 * !#en
 * A cc.SpriteFrame has:<br/>
 *  - texture: A cc.Texture2D that will be used by render components<br/>
 *  - rectangle: A rectangle of the texture
 *
 * !#zh
 * 一个 SpriteFrame 包含：<br/>
 *  - 纹理：会被渲染组件使用的 Texture2D 对象。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *
 * @class SpriteFrame
 * @extends Asset
 * @uses EventTarget
 * @example
 * // load a cc.SpriteFrame with image path (Recommend)
 * var self = this;
 * var url = "test assets/PurpleMonster";
 * cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node
 * });
 */

var SpriteFrame = cc.Class(
/** @lends cc.SpriteFrame# */
{
  name: 'cc.SpriteFrame',
  "extends": require('../assets/CCAsset'),
  mixins: [EventTarget],
  properties: {
    // Use this property to set texture when loading dependency
    _textureSetter: {
      set: function set(texture) {
        if (texture) {
          if (CC_EDITOR && Editor.isBuilder) {
            // just building
            this._texture = texture;
            return;
          }

          if (this._texture !== texture) {
            this._refreshTexture(texture);
          }

          this._textureFilename = texture.url;
        }
      }
    },
    // _textureFilename: {
    //     get () {
    //         return (this._texture && this._texture.url) || "";
    //     },
    //     set (url) {
    //         let texture = cc.textureCache.addImage(url);
    //         this._refreshTexture(texture);
    //     }
    // },

    /**
     * !#en Top border of the sprite
     * !#zh sprite 的顶部边框
     * @property insetTop
     * @type {Number}
     * @default 0
     */
    insetTop: {
      get: function get() {
        return this._capInsets[INSET_TOP];
      },
      set: function set(value) {
        this._capInsets[INSET_TOP] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Bottom border of the sprite
     * !#zh sprite 的底部边框
     * @property insetBottom
     * @type {Number}
     * @default 0
     */
    insetBottom: {
      get: function get() {
        return this._capInsets[INSET_BOTTOM];
      },
      set: function set(value) {
        this._capInsets[INSET_BOTTOM] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Left border of the sprite
     * !#zh sprite 的左边边框
     * @property insetLeft
     * @type {Number}
     * @default 0
     */
    insetLeft: {
      get: function get() {
        return this._capInsets[INSET_LEFT];
      },
      set: function set(value) {
        this._capInsets[INSET_LEFT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Right border of the sprite
     * !#zh sprite 的左边边框
     * @property insetRight
     * @type {Number}
     * @default 0
     */
    insetRight: {
      get: function get() {
        return this._capInsets[INSET_RIGHT];
      },
      set: function set(value) {
        this._capInsets[INSET_RIGHT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    }
  },

  /**
   * !#en
   * Constructor of SpriteFrame class.
   * !#zh
   * SpriteFrame 类的构造函数。
   * @method constructor
   * @param {String|Texture2D} [filename]
   * @param {Rect} [rect]
   * @param {Boolean} [rotated] - Whether the frame is rotated in the texture
   * @param {Vec2} [offset] - The offset of the frame in the texture
   * @param {Size} [originalSize] - The size of the frame in the texture
   */
  ctor: function ctor() {
    // Init EventTarget data
    EventTarget.call(this);
    var filename = arguments[0];
    var rect = arguments[1];
    var rotated = arguments[2];
    var offset = arguments[3];
    var originalSize = arguments[4]; // the location of the sprite on rendering texture

    this._rect = null; // uv data of frame

    this.uv = []; // texture of frame

    this._texture = null; // store original info before packed to dynamic atlas

    this._original = null; // for trimming

    this._offset = null; // for trimming

    this._originalSize = null;
    this._rotated = false;
    this.vertices = null;
    this._capInsets = [0, 0, 0, 0];
    this.uvSliced = [];
    this._textureFilename = '';

    if (CC_EDITOR) {
      // Atlas asset uuid
      this._atlasUuid = '';
    }

    if (filename !== undefined) {
      this.setTexture(filename, rect, rotated, offset, originalSize);
    } else {//todo log Error
    }
  },

  /**
   * !#en Returns whether the texture have been loaded
   * !#zh 返回是否已加载纹理
   * @method textureLoaded
   * @returns {boolean}
   */
  textureLoaded: function textureLoaded() {
    return this._texture && this._texture.loaded;
  },
  onTextureLoaded: function onTextureLoaded(callback, target) {
    if (this.textureLoaded()) {
      callback.call(target);
    } else {
      this.once('load', callback, target);
      this.ensureLoadTexture();
      return false;
    }

    return true;
  },

  /**
   * !#en Returns whether the sprite frame is rotated in the texture.
   * !#zh 获取 SpriteFrame 是否旋转
   * @method isRotated
   * @return {Boolean}
   */
  isRotated: function isRotated() {
    return this._rotated;
  },

  /**
   * !#en Set whether the sprite frame is rotated in the texture.
   * !#zh 设置 SpriteFrame 是否旋转
   * @method setRotated
   * @param {Boolean} bRotated
   */
  setRotated: function setRotated(bRotated) {
    this._rotated = bRotated;
    if (this._texture) this._calculateUV();
  },

  /**
   * !#en Returns the rect of the sprite frame in the texture.
   * !#zh 获取 SpriteFrame 的纹理矩形区域
   * @method getRect
   * @return {Rect}
   */
  getRect: function getRect() {
    return cc.rect(this._rect);
  },

  /**
   * !#en Sets the rect of the sprite frame in the texture.
   * !#zh 设置 SpriteFrame 的纹理矩形区域
   * @method setRect
   * @param {Rect} rect
   */
  setRect: function setRect(rect) {
    this._rect = rect;
    if (this._texture) this._calculateUV();
  },

  /**
   * !#en Returns the original size of the trimmed image.
   * !#zh 获取修剪前的原始大小
   * @method getOriginalSize
   * @return {Size}
   */
  getOriginalSize: function getOriginalSize() {
    return cc.size(this._originalSize);
  },

  /**
   * !#en Sets the original size of the trimmed image.
   * !#zh 设置修剪前的原始大小
   * @method setOriginalSize
   * @param {Size} size
   */
  setOriginalSize: function setOriginalSize(size) {
    if (!this._originalSize) {
      this._originalSize = cc.size(size);
    } else {
      this._originalSize.width = size.width;
      this._originalSize.height = size.height;
    }
  },

  /**
   * !#en Returns the texture of the frame.
   * !#zh 获取使用的纹理实例
   * @method getTexture
   * @return {Texture2D}
   */
  getTexture: function getTexture() {
    return this._texture;
  },
  _textureLoadedCallback: function _textureLoadedCallback() {
    var self = this;
    var texture = this._texture;

    if (!texture) {
      // clearTexture called while loading texture...
      return;
    }

    var w = texture.width,
        h = texture.height;

    if (self._rect) {
      self._checkRect(self._texture);
    } else {
      self._rect = cc.rect(0, 0, w, h);
    }

    if (!self._originalSize) {
      self.setOriginalSize(cc.size(w, h));
    }

    if (!self._offset) {
      self.setOffset(cc.v2(0, 0));
    }

    self._calculateUV(); // dispatch 'load' event of cc.SpriteFrame


    self.emit("load");
  },

  /*
   * !#en Sets the texture of the frame.
   * !#zh 设置使用的纹理实例。
   * @method _refreshTexture
   * @param {Texture2D} texture
   */
  _refreshTexture: function _refreshTexture(texture) {
    this._texture = texture;

    if (texture.loaded) {
      this._textureLoadedCallback();
    } else {
      texture.once('load', this._textureLoadedCallback, this);
    }
  },

  /**
   * !#en Returns the offset of the frame in the texture.
   * !#zh 获取偏移量
   * @method getOffset
   * @return {Vec2}
   */
  getOffset: function getOffset() {
    return cc.v2(this._offset);
  },

  /**
   * !#en Sets the offset of the frame in the texture.
   * !#zh 设置偏移量
   * @method setOffset
   * @param {Vec2} offsets
   */
  setOffset: function setOffset(offsets) {
    this._offset = cc.v2(offsets);
  },

  /**
   * !#en Clone the sprite frame.
   * !#zh 克隆 SpriteFrame
   * @method clone
   * @return {SpriteFrame}
   */
  clone: function clone() {
    return new SpriteFrame(this._texture || this._textureFilename, this._rect, this._rotated, this._offset, this._originalSize);
  },

  /**
   * !#en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
   * !#zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame。
   * @method setTexture
   * @param {String|Texture2D} textureOrTextureFile
   * @param {Rect} [rect=null]
   * @param {Boolean} [rotated=false]
   * @param {Vec2} [offset=cc.v2(0,0)]
   * @param {Size} [originalSize=rect.size]
   * @return {Boolean}
   */
  setTexture: function setTexture(textureOrTextureFile, rect, rotated, offset, originalSize) {
    if (rect) {
      this._rect = rect;
    } else {
      this._rect = null;
    }

    if (offset) {
      this.setOffset(offset);
    } else {
      this._offset = null;
    }

    if (originalSize) {
      this.setOriginalSize(originalSize);
    } else {
      this._originalSize = null;
    }

    this._rotated = rotated || false; // loading texture

    var texture = textureOrTextureFile;

    if (typeof texture === 'string' && texture) {
      this._textureFilename = texture;

      this._loadTexture();
    }

    if (texture instanceof cc.Texture2D && this._texture !== texture) {
      this._refreshTexture(texture);
    }

    return true;
  },
  _loadTexture: function _loadTexture() {
    if (this._textureFilename) {
      var texture = textureUtil.loadImage(this._textureFilename);

      this._refreshTexture(texture);
    }
  },

  /**
   * !#en If a loading scene (or prefab) is marked as `asyncLoadAssets`, all the textures of the SpriteFrame which
   * associated by user's custom Components in the scene, will not preload automatically.
   * These textures will be load when Sprite component is going to render the SpriteFrames.
   * You can call this method if you want to load the texture early.
   * !#zh 当加载中的场景或 Prefab 被标记为 `asyncLoadAssets` 时，用户在场景中由自定义组件关联到的所有 SpriteFrame 的贴图都不会被提前加载。
   * 只有当 Sprite 组件要渲染这些 SpriteFrame 时，才会检查贴图是否加载。如果你希望加载过程提前，你可以手工调用这个方法。
   *
   * @method ensureLoadTexture
   * @example
   * if (spriteFrame.textureLoaded()) {
   *     this._onSpriteFrameLoaded();
   * }
   * else {
   *     spriteFrame.once('load', this._onSpriteFrameLoaded, this);
   *     spriteFrame.ensureLoadTexture();
   * }
   */
  ensureLoadTexture: function ensureLoadTexture() {
    if (this._texture) {
      if (!this._texture.loaded) {
        // load exists texture
        this._refreshTexture(this._texture);

        textureUtil.postLoadTexture(this._texture);
      }
    } else if (this._textureFilename) {
      // load new texture
      this._loadTexture();
    }
  },

  /**
   * !#en
   * If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
   * !#zh
   * 当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。
   * @method clearTexture
   * @deprecated since 2.1
   */
  _checkRect: function _checkRect(texture) {
    var rect = this._rect;
    var maxX = rect.x,
        maxY = rect.y;

    if (this._rotated) {
      maxX += rect.height;
      maxY += rect.width;
    } else {
      maxX += rect.width;
      maxY += rect.height;
    }

    if (maxX > texture.width) {
      cc.errorID(3300, texture.url + '/' + this.name, maxX, texture.width);
    }

    if (maxY > texture.height) {
      cc.errorID(3400, texture.url + '/' + this.name, maxY, texture.height);
    }
  },
  _calculateSlicedUV: function _calculateSlicedUV() {
    var rect = this._rect;
    var atlasWidth = this._texture.width;
    var atlasHeight = this._texture.height;
    var leftWidth = this._capInsets[INSET_LEFT];
    var rightWidth = this._capInsets[INSET_RIGHT];
    var centerWidth = rect.width - leftWidth - rightWidth;
    var topHeight = this._capInsets[INSET_TOP];
    var bottomHeight = this._capInsets[INSET_BOTTOM];
    var centerHeight = rect.height - topHeight - bottomHeight;
    var uvSliced = this.uvSliced;
    uvSliced.length = 0;

    if (this._rotated) {
      temp_uvs[0].u = rect.x / atlasWidth;
      temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
      temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
      temp_uvs[3].u = (rect.x + rect.height) / atlasWidth;
      temp_uvs[3].v = rect.y / atlasHeight;
      temp_uvs[2].v = (rect.y + leftWidth) / atlasHeight;
      temp_uvs[1].v = (rect.y + leftWidth + centerWidth) / atlasHeight;
      temp_uvs[0].v = (rect.y + rect.width) / atlasHeight;

      for (var row = 0; row < 4; ++row) {
        var rowD = temp_uvs[row];

        for (var col = 0; col < 4; ++col) {
          var colD = temp_uvs[3 - col];
          uvSliced.push({
            u: rowD.u,
            v: colD.v
          });
        }
      }
    } else {
      temp_uvs[0].u = rect.x / atlasWidth;
      temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
      temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
      temp_uvs[3].u = (rect.x + rect.width) / atlasWidth;
      temp_uvs[3].v = rect.y / atlasHeight;
      temp_uvs[2].v = (rect.y + topHeight) / atlasHeight;
      temp_uvs[1].v = (rect.y + topHeight + centerHeight) / atlasHeight;
      temp_uvs[0].v = (rect.y + rect.height) / atlasHeight;

      for (var _row = 0; _row < 4; ++_row) {
        var _rowD = temp_uvs[_row];

        for (var _col = 0; _col < 4; ++_col) {
          var _colD = temp_uvs[_col];
          uvSliced.push({
            u: _colD.u,
            v: _rowD.v
          });
        }
      }
    }
  },
  _setDynamicAtlasFrame: function _setDynamicAtlasFrame(frame) {
    if (!frame) return;
    this._original = {
      _texture: this._texture,
      _x: this._rect.x,
      _y: this._rect.y
    };
    this._texture = frame.texture;
    this._rect.x = frame.x;
    this._rect.y = frame.y;

    this._calculateUV();
  },
  _resetDynamicAtlasFrame: function _resetDynamicAtlasFrame() {
    if (!this._original) return;
    this._rect.x = this._original._x;
    this._rect.y = this._original._y;
    this._texture = this._original._texture;
    this._original = null;

    this._calculateUV();
  },
  _calculateUV: function _calculateUV() {
    var rect = this._rect,
        texture = this._texture,
        uv = this.uv,
        texw = texture.width,
        texh = texture.height;

    if (this._rotated) {
      var l = texw === 0 ? 0 : rect.x / texw;
      var r = texw === 0 ? 0 : (rect.x + rect.height) / texw;
      var b = texh === 0 ? 0 : (rect.y + rect.width) / texh;
      var t = texh === 0 ? 0 : rect.y / texh;
      uv[0] = l;
      uv[1] = t;
      uv[2] = l;
      uv[3] = b;
      uv[4] = r;
      uv[5] = t;
      uv[6] = r;
      uv[7] = b;
    } else {
      var _l = texw === 0 ? 0 : rect.x / texw;

      var _r = texw === 0 ? 0 : (rect.x + rect.width) / texw;

      var _b = texh === 0 ? 0 : (rect.y + rect.height) / texh;

      var _t = texh === 0 ? 0 : rect.y / texh;

      uv[0] = _l;
      uv[1] = _b;
      uv[2] = _r;
      uv[3] = _b;
      uv[4] = _l;
      uv[5] = _t;
      uv[6] = _r;
      uv[7] = _t;
    }

    var vertices = this.vertices;

    if (vertices) {
      vertices.nu.length = 0;
      vertices.nv.length = 0;

      for (var i = 0; i < vertices.u.length; i++) {
        vertices.nu[i] = vertices.u[i] / texw;
        vertices.nv[i] = vertices.v[i] / texh;
      }
    }

    this._calculateSlicedUV();
  },
  // SERIALIZATION
  _serialize: CC_EDITOR && function (exporting) {
    var rect = this._rect;
    var offset = this._offset;
    var size = this._originalSize;
    var uuid;
    var texture = this._texture;

    if (texture) {
      uuid = texture._uuid;
    }

    if (!uuid) {
      var url = this._textureFilename;

      if (url) {
        uuid = Editor.Utils.UuidCache.urlToUuid(url);
      }
    }

    if (uuid && exporting) {
      uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
    }

    var vertices;

    if (this.vertices) {
      vertices = {
        triangles: this.vertices.triangles,
        x: this.vertices.x,
        y: this.vertices.y,
        u: this.vertices.u,
        v: this.vertices.v
      };
    }

    return {
      name: this._name,
      texture: uuid || undefined,
      atlas: exporting ? undefined : this._atlasUuid,
      // strip from json if exporting
      rect: rect ? [rect.x, rect.y, rect.width, rect.height] : undefined,
      offset: offset ? [offset.x, offset.y] : undefined,
      originalSize: size ? [size.width, size.height] : undefined,
      rotated: this._rotated ? 1 : undefined,
      capInsets: this._capInsets,
      vertices: vertices
    };
  },
  _deserialize: function _deserialize(data, handle) {
    var rect = data.rect;

    if (rect) {
      this._rect = new cc.Rect(rect[0], rect[1], rect[2], rect[3]);
    }

    if (data.offset) {
      this.setOffset(new cc.Vec2(data.offset[0], data.offset[1]));
    }

    if (data.originalSize) {
      this.setOriginalSize(new cc.Size(data.originalSize[0], data.originalSize[1]));
    }

    this._rotated = data.rotated === 1;
    this._name = data.name;
    var capInsets = data.capInsets;

    if (capInsets) {
      this._capInsets[INSET_LEFT] = capInsets[INSET_LEFT];
      this._capInsets[INSET_TOP] = capInsets[INSET_TOP];
      this._capInsets[INSET_RIGHT] = capInsets[INSET_RIGHT];
      this._capInsets[INSET_BOTTOM] = capInsets[INSET_BOTTOM];
    }

    if (CC_EDITOR) {
      this._atlasUuid = data.atlas;
    }

    this.vertices = data.vertices;

    if (this.vertices) {
      // initialize normal uv arrays
      this.vertices.nu = [];
      this.vertices.nv = [];
    } // load texture via _textureSetter


    var textureUuid = data.texture;

    if (textureUuid) {
      handle.result.push(this, '_textureSetter', textureUuid);
    }
  }
});
var proto = SpriteFrame.prototype;
proto.copyWithZone = proto.clone;
proto.copy = proto.clone;
proto.initWithTexture = proto.setTexture;
cc.SpriteFrame = SpriteFrame;
module.exports = SpriteFrame;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU3ByaXRlRnJhbWUuanMiXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJyZXF1aXJlIiwidGV4dHVyZVV0aWwiLCJJTlNFVF9MRUZUIiwiSU5TRVRfVE9QIiwiSU5TRVRfUklHSFQiLCJJTlNFVF9CT1RUT00iLCJ0ZW1wX3V2cyIsInUiLCJ2IiwiU3ByaXRlRnJhbWUiLCJjYyIsIkNsYXNzIiwibmFtZSIsIm1peGlucyIsInByb3BlcnRpZXMiLCJfdGV4dHVyZVNldHRlciIsInNldCIsInRleHR1cmUiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJpc0J1aWxkZXIiLCJfdGV4dHVyZSIsIl9yZWZyZXNoVGV4dHVyZSIsIl90ZXh0dXJlRmlsZW5hbWUiLCJ1cmwiLCJpbnNldFRvcCIsImdldCIsIl9jYXBJbnNldHMiLCJ2YWx1ZSIsIl9jYWxjdWxhdGVTbGljZWRVViIsImluc2V0Qm90dG9tIiwiaW5zZXRMZWZ0IiwiaW5zZXRSaWdodCIsImN0b3IiLCJjYWxsIiwiZmlsZW5hbWUiLCJhcmd1bWVudHMiLCJyZWN0Iiwicm90YXRlZCIsIm9mZnNldCIsIm9yaWdpbmFsU2l6ZSIsIl9yZWN0IiwidXYiLCJfb3JpZ2luYWwiLCJfb2Zmc2V0IiwiX29yaWdpbmFsU2l6ZSIsIl9yb3RhdGVkIiwidmVydGljZXMiLCJ1dlNsaWNlZCIsIl9hdGxhc1V1aWQiLCJ1bmRlZmluZWQiLCJzZXRUZXh0dXJlIiwidGV4dHVyZUxvYWRlZCIsImxvYWRlZCIsIm9uVGV4dHVyZUxvYWRlZCIsImNhbGxiYWNrIiwidGFyZ2V0Iiwib25jZSIsImVuc3VyZUxvYWRUZXh0dXJlIiwiaXNSb3RhdGVkIiwic2V0Um90YXRlZCIsImJSb3RhdGVkIiwiX2NhbGN1bGF0ZVVWIiwiZ2V0UmVjdCIsInNldFJlY3QiLCJnZXRPcmlnaW5hbFNpemUiLCJzaXplIiwic2V0T3JpZ2luYWxTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRUZXh0dXJlIiwiX3RleHR1cmVMb2FkZWRDYWxsYmFjayIsInNlbGYiLCJ3IiwiaCIsIl9jaGVja1JlY3QiLCJzZXRPZmZzZXQiLCJ2MiIsImVtaXQiLCJnZXRPZmZzZXQiLCJvZmZzZXRzIiwiY2xvbmUiLCJ0ZXh0dXJlT3JUZXh0dXJlRmlsZSIsIl9sb2FkVGV4dHVyZSIsIlRleHR1cmUyRCIsImxvYWRJbWFnZSIsInBvc3RMb2FkVGV4dHVyZSIsIm1heFgiLCJ4IiwibWF4WSIsInkiLCJlcnJvcklEIiwiYXRsYXNXaWR0aCIsImF0bGFzSGVpZ2h0IiwibGVmdFdpZHRoIiwicmlnaHRXaWR0aCIsImNlbnRlcldpZHRoIiwidG9wSGVpZ2h0IiwiYm90dG9tSGVpZ2h0IiwiY2VudGVySGVpZ2h0IiwibGVuZ3RoIiwicm93Iiwicm93RCIsImNvbCIsImNvbEQiLCJwdXNoIiwiX3NldER5bmFtaWNBdGxhc0ZyYW1lIiwiZnJhbWUiLCJfeCIsIl95IiwiX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUiLCJ0ZXh3IiwidGV4aCIsImwiLCJyIiwiYiIsInQiLCJudSIsIm52IiwiaSIsIl9zZXJpYWxpemUiLCJleHBvcnRpbmciLCJ1dWlkIiwiX3V1aWQiLCJVdGlscyIsIlV1aWRDYWNoZSIsInVybFRvVXVpZCIsIlV1aWRVdGlscyIsImNvbXByZXNzVXVpZCIsInRyaWFuZ2xlcyIsIl9uYW1lIiwiYXRsYXMiLCJjYXBJbnNldHMiLCJfZGVzZXJpYWxpemUiLCJkYXRhIiwiaGFuZGxlIiwiUmVjdCIsIlZlYzIiLCJTaXplIiwidGV4dHVyZVV1aWQiLCJyZXN1bHQiLCJwcm90byIsInByb3RvdHlwZSIsImNvcHlXaXRoWm9uZSIsImNvcHkiLCJpbml0V2l0aFRleHR1cmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLElBQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDLHVCQUFELENBQTNCOztBQUNBLElBQU1DLFdBQVcsR0FBR0QsT0FBTyxDQUFDLHVCQUFELENBQTNCOztBQUVBLElB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QWhCLElBQStCZ0ksU0FBUyxDQUFDaEksV0FBRCxDQUF4QztBQUNBLFdBQUt1QixVQUFMLENBQWdCdEIsWUFBaEIsSUFBZ0MrSCxTQUFTLENBQUMvSCxZQUFELENBQXpDO0FBQ0g7O0FBRUQsUUFBSWEsU0FBSixFQUFlO0FBQ1gsV0FBSytCLFVBQUwsR0FBa0JxRixJQUFJLENBQUNILEtBQXZCO0FBQ0g7O0FBRUQsU0FBS3BGLFFBQUwsR0FBZ0J1RixJQUFJLENBQUN2RixRQUFyQjs7QUFDQSxRQUFJLEtBQUtBLFFBQVQsRUFBbUI7QUFDZjtBQUNBLFdBQUtBLFFBQUwsQ0FBY3NFLEVBQWQsR0FBbUIsRUFBbkI7QUFDQSxXQUFLdEUsUUFBTCxDQUFjdUUsRUFBZCxHQUFtQixFQUFuQjtBQUNILEtBL0JpQyxDQWlDbEM7OztBQUNBLFFBQUlxQixXQUFXLEdBQUdMLElBQUksQ0FBQ3JILE9BQXZCOztBQUNBLFFBQUkwSCxXQUFKLEVBQWlCO0FBQ2JKLE1BQUFBLE1BQU0sQ0FBQ0ssTUFBUCxDQUFjbkMsSUFBZCxDQUFtQixJQUFuQixFQUF5QixnQkFBekIsRUFBMkNrQyxXQUEzQztBQUNIO0FBQ0o7QUFucUJtRCxDQUF0QyxDQUFsQjtBQXNxQkEsSUFBSUUsS0FBSyxHQUFHcEksV0FBVyxDQUFDcUksU0FBeEI7QUFFQUQsS0FBSyxDQUFDRSxZQUFOLEdBQXFCRixLQUFLLENBQUM1RCxLQUEzQjtBQUNBNEQsS0FBSyxDQUFDRyxJQUFOLEdBQWFILEtBQUssQ0FBQzVELEtBQW5CO0FBQ0E0RCxLQUFLLENBQUNJLGVBQU4sR0FBd0JKLEtBQUssQ0FBQzFGLFVBQTlCO0FBRUF6QyxFQUFFLENBQUNELFdBQUgsR0FBaUJBLFdBQWpCO0FBRUF5SSxNQUFNLENBQUNDLE9BQVAsR0FBaUIxSSxXQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgRXZlbnRUYXJnZXQgPSByZXF1aXJlKFwiLi4vZXZlbnQvZXZlbnQtdGFyZ2V0XCIpO1xuY29uc3QgdGV4dHVyZVV0aWwgPSByZXF1aXJlKCcuLi91dGlscy90ZXh0dXJlLXV0aWwnKTtcblxuY29uc3QgSU5TRVRfTEVGVCA9IDA7XG5jb25zdCBJTlNFVF9UT1AgPSAxO1xuY29uc3QgSU5TRVRfUklHSFQgPSAyO1xuY29uc3QgSU5TRVRfQk9UVE9NID0gMztcblxubGV0IHRlbXBfdXZzID0gW3t1OiAwLCB2OiAwfSwge3U6IDAsIHY6IDB9LCB7dTogMCwgdjogMH0sIHt1OiAwLCB2OiAwfV07XG5cbi8qKlxuICogISNlblxuICogQSBjYy5TcHJpdGVGcmFtZSBoYXM6PGJyLz5cbiAqICAtIHRleHR1cmU6IEEgY2MuVGV4dHVyZTJEIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHJlbmRlciBjb21wb25lbnRzPGJyLz5cbiAqICAtIHJlY3RhbmdsZTogQSByZWN0YW5nbGUgb2YgdGhlIHRleHR1cmVcbiAqXG4gKiAhI3poXG4gKiDkuIDkuKogU3ByaXRlRnJhbWUg5YyF5ZCr77yaPGJyLz5cbiAqICAtIOe6ueeQhu+8muS8muiiq+a4suafk+e7hOS7tuS9v+eUqOeahCBUZXh0dXJlMkQg5a+56LGh44CCPGJyLz5cbiAqICAtIOefqeW9ou+8muWcqOe6ueeQhuS4reeahOefqeW9ouWMuuWfn+OAglxuICpcbiAqIEBjbGFzcyBTcHJpdGVGcmFtZVxuICogQGV4dGVuZHMgQXNzZXRcbiAqIEB1c2VzIEV2ZW50VGFyZ2V0XG4gKiBAZXhhbXBsZVxuICogLy8gbG9hZCBhIGNjLlNwcml0ZUZyYW1lIHdpdGggaW1hZ2UgcGF0aCAoUmVjb21tZW5kKVxuICogdmFyIHNlbGYgPSB0aGlzO1xuICogdmFyIHVybCA9IFwidGVzdCBhc3NldHMvUHVycGxlTW9uc3RlclwiO1xuICogY2MubG9hZGVyLmxvYWRSZXModXJsLCBjYy5TcHJpdGVGcmFtZSwgZnVuY3Rpb24gKGVyciwgc3ByaXRlRnJhbWUpIHtcbiAqICB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKFwiTmV3IFNwcml0ZVwiKTtcbiAqICB2YXIgc3ByaXRlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAqICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTtcbiAqICBub2RlLnBhcmVudCA9IHNlbGYubm9kZVxuICogfSk7XG4gKi9cbmxldCBTcHJpdGVGcmFtZSA9IGNjLkNsYXNzKC8qKiBAbGVuZHMgY2MuU3ByaXRlRnJhbWUjICove1xuICAgIG5hbWU6ICdjYy5TcHJpdGVGcmFtZScsXG4gICAgZXh0ZW5kczogcmVxdWlyZSgnLi4vYXNzZXRzL0NDQXNzZXQnKSxcbiAgICBtaXhpbnM6IFtFdmVudFRhcmdldF0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIFVzZSB0aGlzIHByb3BlcnR5IHRvIHNldCB0ZXh0dXJlIHdoZW4gbG9hZGluZyBkZXBlbmRlbmN5XG4gICAgICAgIF90ZXh0dXJlU2V0dGVyOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiBFZGl0b3IuaXNCdWlsZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBqdXN0IGJ1aWxkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0dXJlID0gdGV4dHVyZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSAhPT0gdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUZpbGVuYW1lID0gdGV4dHVyZS51cmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIF90ZXh0dXJlRmlsZW5hbWU6IHtcbiAgICAgICAgLy8gICAgIGdldCAoKSB7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuICh0aGlzLl90ZXh0dXJlICYmIHRoaXMuX3RleHR1cmUudXJsKSB8fCBcIlwiO1xuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIHNldCAodXJsKSB7XG4gICAgICAgIC8vICAgICAgICAgbGV0IHRleHR1cmUgPSBjYy50ZXh0dXJlQ2FjaGUuYWRkSW1hZ2UodXJsKTtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUb3AgYm9yZGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgICogISN6aCBzcHJpdGUg55qE6aG26YOo6L655qGGXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpbnNldFRvcFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBpbnNldFRvcDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9UT1BdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1RPUF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBCb3R0b20gYm9yZGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgICogISN6aCBzcHJpdGUg55qE5bqV6YOo6L655qGGXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpbnNldEJvdHRvbVxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBpbnNldEJvdHRvbToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9CT1RUT01dO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBMZWZ0IGJvcmRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgICAqICEjemggc3ByaXRlIOeahOW3pui+uei+ueahhlxuICAgICAgICAgKiBAcHJvcGVydHkgaW5zZXRMZWZ0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0TGVmdDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFJpZ2h0IGJvcmRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgICAqICEjemggc3ByaXRlIOeahOW3pui+uei+ueahhlxuICAgICAgICAgKiBAcHJvcGVydHkgaW5zZXRSaWdodFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBpbnNldFJpZ2h0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9SSUdIVF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnN0cnVjdG9yIG9mIFNwcml0ZUZyYW1lIGNsYXNzLlxuICAgICAqICEjemhcbiAgICAgKiBTcHJpdGVGcmFtZSDnsbvnmoTmnoTpgKDlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTdHJpbmd8VGV4dHVyZTJEfSBbZmlsZW5hbWVdXG4gICAgICogQHBhcmFtIHtSZWN0fSBbcmVjdF1cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyb3RhdGVkXSAtIFdoZXRoZXIgdGhlIGZyYW1lIGlzIHJvdGF0ZWQgaW4gdGhlIHRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvZmZzZXRdIC0gVGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1NpemV9IFtvcmlnaW5hbFNpemVdIC0gVGhlIHNpemUgb2YgdGhlIGZyYW1lIGluIHRoZSB0ZXh0dXJlXG4gICAgICovXG4gICAgY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJbml0IEV2ZW50VGFyZ2V0IGRhdGFcbiAgICAgICAgRXZlbnRUYXJnZXQuY2FsbCh0aGlzKTtcblxuICAgICAgICBsZXQgZmlsZW5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIGxldCByZWN0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICBsZXQgcm90YXRlZCA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgbGV0IG9mZnNldCA9IGFyZ3VtZW50c1szXTtcbiAgICAgICAgbGV0IG9yaWdpbmFsU2l6ZSA9IGFyZ3VtZW50c1s0XTtcblxuICAgICAgICAvLyB0aGUgbG9jYXRpb24gb2YgdGhlIHNwcml0ZSBvbiByZW5kZXJpbmcgdGV4dHVyZVxuICAgICAgICB0aGlzLl9yZWN0ID0gbnVsbDtcbiAgICAgICAgLy8gdXYgZGF0YSBvZiBmcmFtZVxuICAgICAgICB0aGlzLnV2ID0gW107XG4gICAgICAgIC8vIHRleHR1cmUgb2YgZnJhbWVcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IG51bGw7XG4gICAgICAgIC8vIHN0b3JlIG9yaWdpbmFsIGluZm8gYmVmb3JlIHBhY2tlZCB0byBkeW5hbWljIGF0bGFzXG4gICAgICAgIHRoaXMuX29yaWdpbmFsID0gbnVsbDtcblxuICAgICAgICAvLyBmb3IgdHJpbW1pbmdcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDtcblxuICAgICAgICAvLyBmb3IgdHJpbW1pbmdcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9yb3RhdGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fY2FwSW5zZXRzID0gWzAsIDAsIDAsIDBdO1xuXG4gICAgICAgIHRoaXMudXZTbGljZWQgPSBbXTtcblxuICAgICAgICB0aGlzLl90ZXh0dXJlRmlsZW5hbWUgPSAnJztcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAvLyBBdGxhcyBhc3NldCB1dWlkXG4gICAgICAgICAgICB0aGlzLl9hdGxhc1V1aWQgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHR1cmUoZmlsZW5hbWUsIHJlY3QsIHJvdGF0ZWQsIG9mZnNldCwgb3JpZ2luYWxTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vdG9kbyBsb2cgRXJyb3JcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgd2hldGhlciB0aGUgdGV4dHVyZSBoYXZlIGJlZW4gbG9hZGVkXG4gICAgICogISN6aCDov5Tlm57mmK/lkKblt7LliqDovb3nurnnkIZcbiAgICAgKiBAbWV0aG9kIHRleHR1cmVMb2FkZWRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0ZXh0dXJlTG9hZGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlICYmIHRoaXMuX3RleHR1cmUubG9hZGVkO1xuICAgIH0sXG5cbiAgICBvblRleHR1cmVMb2FkZWQgKGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dHVyZUxvYWRlZCgpKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uY2UoJ2xvYWQnLCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuZW5zdXJlTG9hZFRleHR1cmUoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgd2hldGhlciB0aGUgc3ByaXRlIGZyYW1lIGlzIHJvdGF0ZWQgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgU3ByaXRlRnJhbWUg5piv5ZCm5peL6L2sXG4gICAgICogQG1ldGhvZCBpc1JvdGF0ZWRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzUm90YXRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgd2hldGhlciB0aGUgc3ByaXRlIGZyYW1lIGlzIHJvdGF0ZWQgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva4gU3ByaXRlRnJhbWUg5piv5ZCm5peL6L2sXG4gICAgICogQG1ldGhvZCBzZXRSb3RhdGVkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBiUm90YXRlZFxuICAgICAqL1xuICAgIHNldFJvdGF0ZWQ6IGZ1bmN0aW9uIChiUm90YXRlZCkge1xuICAgICAgICB0aGlzLl9yb3RhdGVkID0gYlJvdGF0ZWQ7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKVxuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlVVYoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSByZWN0IG9mIHRoZSBzcHJpdGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgU3ByaXRlRnJhbWUg55qE57q555CG55+p5b2i5Yy65Z+fXG4gICAgICogQG1ldGhvZCBnZXRSZWN0XG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKi9cbiAgICBnZXRSZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5yZWN0KHRoaXMuX3JlY3QpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIHJlY3Qgb2YgdGhlIHNwcml0ZSBmcmFtZSBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiuvue9riBTcHJpdGVGcmFtZSDnmoTnurnnkIbnn6nlvaLljLrln59cbiAgICAgKiBAbWV0aG9kIHNldFJlY3RcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAgICAgKi9cbiAgICBzZXRSZWN0OiBmdW5jdGlvbiAocmVjdCkge1xuICAgICAgICB0aGlzLl9yZWN0ID0gcmVjdDtcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpXG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzaXplIG9mIHRoZSB0cmltbWVkIGltYWdlLlxuICAgICAqICEjemgg6I635Y+W5L+u5Ymq5YmN55qE5Y6f5aeL5aSn5bCPXG4gICAgICogQG1ldGhvZCBnZXRPcmlnaW5hbFNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldE9yaWdpbmFsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9vcmlnaW5hbFNpemUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG9yaWdpbmFsIHNpemUgb2YgdGhlIHRyaW1tZWQgaW1hZ2UuXG4gICAgICogISN6aCDorr7nva7kv67liarliY3nmoTljp/lp4vlpKflsI9cbiAgICAgKiBAbWV0aG9kIHNldE9yaWdpbmFsU2l6ZVxuICAgICAqIEBwYXJhbSB7U2l6ZX0gc2l6ZVxuICAgICAqL1xuICAgIHNldE9yaWdpbmFsU2l6ZTogZnVuY3Rpb24gKHNpemUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2l6ZSA9IGNjLnNpemUoc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUud2lkdGggPSBzaXplLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplLmhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgdGV4dHVyZSBvZiB0aGUgZnJhbWUuXG4gICAgICogISN6aCDojrflj5bkvb/nlKjnmoTnurnnkIblrp7kvotcbiAgICAgKiBAbWV0aG9kIGdldFRleHR1cmVcbiAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9XG4gICAgICovXG4gICAgZ2V0VGV4dHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuXG4gICAgX3RleHR1cmVMb2FkZWRDYWxsYmFjayAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xuICAgICAgICBpZiAoIXRleHR1cmUpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyVGV4dHVyZSBjYWxsZWQgd2hpbGUgbG9hZGluZyB0ZXh0dXJlLi4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHcgPSB0ZXh0dXJlLndpZHRoLCBoID0gdGV4dHVyZS5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKHNlbGYuX3JlY3QpIHtcbiAgICAgICAgICAgIHNlbGYuX2NoZWNrUmVjdChzZWxmLl90ZXh0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX3JlY3QgPSBjYy5yZWN0KDAsIDAsIHcsIGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0T3JpZ2luYWxTaXplKGNjLnNpemUodywgaCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vZmZzZXQpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0T2Zmc2V0KGNjLnYyKDAsIDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2NhbGN1bGF0ZVVWKCk7XG5cbiAgICAgICAgLy8gZGlzcGF0Y2ggJ2xvYWQnIGV2ZW50IG9mIGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIHNlbGYuZW1pdChcImxvYWRcIik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBTZXRzIHRoZSB0ZXh0dXJlIG9mIHRoZSBmcmFtZS5cbiAgICAgKiAhI3poIOiuvue9ruS9v+eUqOeahOe6ueeQhuWunuS+i+OAglxuICAgICAqIEBtZXRob2QgX3JlZnJlc2hUZXh0dXJlXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgKi9cbiAgICBfcmVmcmVzaFRleHR1cmU6IGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgICBpZiAodGV4dHVyZS5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVMb2FkZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGV4dHVyZS5vbmNlKCdsb2FkJywgdGhpcy5fdGV4dHVyZUxvYWRlZENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5blgY/np7vph49cbiAgICAgKiBAbWV0aG9kIGdldE9mZnNldFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgZ2V0T2Zmc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl9vZmZzZXQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva7lgY/np7vph49cbiAgICAgKiBAbWV0aG9kIHNldE9mZnNldFxuICAgICAqIEBwYXJhbSB7VmVjMn0gb2Zmc2V0c1xuICAgICAqL1xuICAgIHNldE9mZnNldDogZnVuY3Rpb24gKG9mZnNldHMpIHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gY2MudjIob2Zmc2V0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xvbmUgdGhlIHNwcml0ZSBmcmFtZS5cbiAgICAgKiAhI3poIOWFi+mahiBTcHJpdGVGcmFtZVxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtTcHJpdGVGcmFtZX1cbiAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNwcml0ZUZyYW1lKHRoaXMuX3RleHR1cmUgfHwgdGhpcy5fdGV4dHVyZUZpbGVuYW1lLCB0aGlzLl9yZWN0LCB0aGlzLl9yb3RhdGVkLCB0aGlzLl9vZmZzZXQsIHRoaXMuX29yaWdpbmFsU2l6ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IFNwcml0ZUZyYW1lIHdpdGggVGV4dHVyZSwgcmVjdCwgcm90YXRlZCwgb2Zmc2V0IGFuZCBvcmlnaW5hbFNpemUuPGJyLz5cbiAgICAgKiAhI3poIOmAmui/hyBUZXh0dXJl77yMcmVjdO+8jHJvdGF0ZWTvvIxvZmZzZXQg5ZKMIG9yaWdpbmFsU2l6ZSDorr7nva4gU3ByaXRlRnJhbWXjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xUZXh0dXJlMkR9IHRleHR1cmVPclRleHR1cmVGaWxlXG4gICAgICogQHBhcmFtIHtSZWN0fSBbcmVjdD1udWxsXVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JvdGF0ZWQ9ZmFsc2VdXG4gICAgICogQHBhcmFtIHtWZWMyfSBbb2Zmc2V0PWNjLnYyKDAsMCldXG4gICAgICogQHBhcmFtIHtTaXplfSBbb3JpZ2luYWxTaXplPXJlY3Quc2l6ZV1cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHNldFRleHR1cmU6IGZ1bmN0aW9uICh0ZXh0dXJlT3JUZXh0dXJlRmlsZSwgcmVjdCwgcm90YXRlZCwgb2Zmc2V0LCBvcmlnaW5hbFNpemUpIHtcbiAgICAgICAgaWYgKHJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlY3QgPSByZWN0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmVjdCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9mZnNldChvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3JpZ2luYWxTaXplKG9yaWdpbmFsU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcm90YXRlZCA9IHJvdGF0ZWQgfHwgZmFsc2U7XG5cbiAgICAgICAgLy8gbG9hZGluZyB0ZXh0dXJlXG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGV4dHVyZU9yVGV4dHVyZUZpbGU7XG4gICAgICAgIGlmICh0eXBlb2YgdGV4dHVyZSA9PT0gJ3N0cmluZycgJiYgdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUZpbGVuYW1lID0gdGV4dHVyZTtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHR1cmUgaW5zdGFuY2VvZiBjYy5UZXh0dXJlMkQgJiYgdGhpcy5fdGV4dHVyZSAhPT0gdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2xvYWRUZXh0dXJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlRmlsZW5hbWUpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0dXJlID0gdGV4dHVyZVV0aWwubG9hZEltYWdlKHRoaXMuX3RleHR1cmVGaWxlbmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIElmIGEgbG9hZGluZyBzY2VuZSAob3IgcHJlZmFiKSBpcyBtYXJrZWQgYXMgYGFzeW5jTG9hZEFzc2V0c2AsIGFsbCB0aGUgdGV4dHVyZXMgb2YgdGhlIFNwcml0ZUZyYW1lIHdoaWNoXG4gICAgICogYXNzb2NpYXRlZCBieSB1c2VyJ3MgY3VzdG9tIENvbXBvbmVudHMgaW4gdGhlIHNjZW5lLCB3aWxsIG5vdCBwcmVsb2FkIGF1dG9tYXRpY2FsbHkuXG4gICAgICogVGhlc2UgdGV4dHVyZXMgd2lsbCBiZSBsb2FkIHdoZW4gU3ByaXRlIGNvbXBvbmVudCBpcyBnb2luZyB0byByZW5kZXIgdGhlIFNwcml0ZUZyYW1lcy5cbiAgICAgKiBZb3UgY2FuIGNhbGwgdGhpcyBtZXRob2QgaWYgeW91IHdhbnQgdG8gbG9hZCB0aGUgdGV4dHVyZSBlYXJseS5cbiAgICAgKiAhI3poIOW9k+WKoOi9veS4reeahOWcuuaZr+aIliBQcmVmYWIg6KKr5qCH6K6w5Li6IGBhc3luY0xvYWRBc3NldHNgIOaXtu+8jOeUqOaIt+WcqOWcuuaZr+S4reeUseiHquWumuS5iee7hOS7tuWFs+iBlOWIsOeahOaJgOaciSBTcHJpdGVGcmFtZSDnmoTotLTlm77pg73kuI3kvJrooqvmj5DliY3liqDovb3jgIJcbiAgICAgKiDlj6rmnInlvZMgU3ByaXRlIOe7hOS7tuimgea4suafk+i/meS6myBTcHJpdGVGcmFtZSDml7bvvIzmiY3kvJrmo4Dmn6XotLTlm77mmK/lkKbliqDovb3jgILlpoLmnpzkvaDluIzmnJvliqDovb3ov4fnqIvmj5DliY3vvIzkvaDlj6/ku6XmiYvlt6XosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZW5zdXJlTG9hZFRleHR1cmVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGlmIChzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcbiAgICAgKiAgICAgdGhpcy5fb25TcHJpdGVGcmFtZUxvYWRlZCgpO1xuICAgICAqIH1cbiAgICAgKiBlbHNlIHtcbiAgICAgKiAgICAgc3ByaXRlRnJhbWUub25jZSgnbG9hZCcsIHRoaXMuX29uU3ByaXRlRnJhbWVMb2FkZWQsIHRoaXMpO1xuICAgICAqICAgICBzcHJpdGVGcmFtZS5lbnN1cmVMb2FkVGV4dHVyZSgpO1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBlbnN1cmVMb2FkVGV4dHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90ZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGxvYWQgZXhpc3RzIHRleHR1cmVcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0aGlzLl90ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXRpbC5wb3N0TG9hZFRleHR1cmUodGhpcy5fdGV4dHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fdGV4dHVyZUZpbGVuYW1lKSB7XG4gICAgICAgICAgICAvLyBsb2FkIG5ldyB0ZXh0dXJlXG4gICAgICAgICAgICB0aGlzLl9sb2FkVGV4dHVyZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiB5b3UgZG8gbm90IG5lZWQgdG8gdXNlIHRoZSBTcHJpdGVGcmFtZSB0ZW1wb3JhcmlseSwgeW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIHNvIHRoYXQgaXRzIHRleHR1cmUgY291bGQgYmUgZ2FyYmFnZSBjb2xsZWN0ZWQuIFRoZW4gd2hlbiB5b3UgbmVlZCB0byByZW5kZXIgdGhlIFNwcml0ZUZyYW1lLCB5b3Ugc2hvdWxkIGNhbGwgYGVuc3VyZUxvYWRUZXh0dXJlYCBtYW51YWxseSB0byByZWxvYWQgdGV4dHVyZS5cbiAgICAgKiAhI3poXG4gICAgICog5b2T5L2g5pqC5pe25LiN5YaN5L2/55So6L+Z5LiqIFNwcml0ZUZyYW1lIOaXtu+8jOWPr+S7peiwg+eUqOi/meS4quaWueazleadpeS/neivgeW8leeUqOeahOi0tOWbvuWvueixoeiDveiiqyBHQ+OAgueEtuWQjuW9k+S9oOimgea4suafkyBTcHJpdGVGcmFtZSDml7bvvIzkvaDpnIDopoHmiYvliqjosIPnlKggYGVuc3VyZUxvYWRUZXh0dXJlYCDmnaXph43mlrDliqDovb3otLTlm77jgIJcbiAgICAgKiBAbWV0aG9kIGNsZWFyVGV4dHVyZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIDIuMVxuICAgICAqL1xuXG4gICAgX2NoZWNrUmVjdDogZnVuY3Rpb24gKHRleHR1cmUpIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0O1xuICAgICAgICBsZXQgbWF4WCA9IHJlY3QueCwgbWF4WSA9IHJlY3QueTtcbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0ZWQpIHtcbiAgICAgICAgICAgIG1heFggKz0gcmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICBtYXhZICs9IHJlY3Qud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXhYICs9IHJlY3Qud2lkdGg7XG4gICAgICAgICAgICBtYXhZICs9IHJlY3QuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhYID4gdGV4dHVyZS53aWR0aCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzMzAwLCB0ZXh0dXJlLnVybCArICcvJyArIHRoaXMubmFtZSwgbWF4WCwgdGV4dHVyZS53aWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heFkgPiB0ZXh0dXJlLmhlaWdodCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNDAwLCB0ZXh0dXJlLnVybCArICcvJyArIHRoaXMubmFtZSwgbWF4WSwgdGV4dHVyZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVTbGljZWRVViAoKSB7XG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5fcmVjdDtcbiAgICAgICAgbGV0IGF0bGFzV2lkdGggPSB0aGlzLl90ZXh0dXJlLndpZHRoO1xuICAgICAgICBsZXQgYXRsYXNIZWlnaHQgPSB0aGlzLl90ZXh0dXJlLmhlaWdodDtcbiAgICAgICAgbGV0IGxlZnRXaWR0aCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXTtcbiAgICAgICAgbGV0IHJpZ2h0V2lkdGggPSB0aGlzLl9jYXBJbnNldHNbSU5TRVRfUklHSFRdO1xuICAgICAgICBsZXQgY2VudGVyV2lkdGggPSByZWN0LndpZHRoIC0gbGVmdFdpZHRoIC0gcmlnaHRXaWR0aDtcbiAgICAgICAgbGV0IHRvcEhlaWdodCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9UT1BdO1xuICAgICAgICBsZXQgYm90dG9tSGVpZ2h0ID0gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV07XG4gICAgICAgIGxldCBjZW50ZXJIZWlnaHQgPSByZWN0LmhlaWdodCAtIHRvcEhlaWdodCAtIGJvdHRvbUhlaWdodDtcblxuICAgICAgICBsZXQgdXZTbGljZWQgPSB0aGlzLnV2U2xpY2VkO1xuICAgICAgICB1dlNsaWNlZC5sZW5ndGggPSAwO1xuICAgICAgICBpZiAodGhpcy5fcm90YXRlZCkge1xuICAgICAgICAgICAgdGVtcF91dnNbMF0udSA9IChyZWN0LngpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzFdLnUgPSAocmVjdC54ICsgYm90dG9tSGVpZ2h0KSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1syXS51ID0gKHJlY3QueCArIGJvdHRvbUhlaWdodCArIGNlbnRlckhlaWdodCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbM10udSA9IChyZWN0LnggKyByZWN0LmhlaWdodCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbM10udiA9IChyZWN0LnkpIC8gYXRsYXNIZWlnaHQ7XG4gICAgICAgICAgICB0ZW1wX3V2c1syXS52ID0gKHJlY3QueSArIGxlZnRXaWR0aCkgLyBhdGxhc0hlaWdodDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzFdLnYgPSAocmVjdC55ICsgbGVmdFdpZHRoICsgY2VudGVyV2lkdGgpIC8gYXRsYXNIZWlnaHQ7XG4gICAgICAgICAgICB0ZW1wX3V2c1swXS52ID0gKHJlY3QueSArIHJlY3Qud2lkdGgpIC8gYXRsYXNIZWlnaHQ7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDQ7ICsrcm93KSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvd0QgPSB0ZW1wX3V2c1tyb3ddO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDQ7ICsrY29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2xEID0gdGVtcF91dnNbMyAtIGNvbF07XG4gICAgICAgICAgICAgICAgICAgIHV2U2xpY2VkLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdTogcm93RC51LFxuICAgICAgICAgICAgICAgICAgICAgICAgdjogY29sRC52XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBfdXZzWzBdLnUgPSAocmVjdC54KSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1sxXS51ID0gKHJlY3QueCArIGxlZnRXaWR0aCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbMl0udSA9IChyZWN0LnggKyBsZWZ0V2lkdGggKyBjZW50ZXJXaWR0aCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbM10udSA9IChyZWN0LnggKyByZWN0LndpZHRoKSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1szXS52ID0gKHJlY3QueSkgLyBhdGxhc0hlaWdodDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzJdLnYgPSAocmVjdC55ICsgdG9wSGVpZ2h0KSAvIGF0bGFzSGVpZ2h0O1xuICAgICAgICAgICAgdGVtcF91dnNbMV0udiA9IChyZWN0LnkgKyB0b3BIZWlnaHQgKyBjZW50ZXJIZWlnaHQpIC8gYXRsYXNIZWlnaHQ7XG4gICAgICAgICAgICB0ZW1wX3V2c1swXS52ID0gKHJlY3QueSArIHJlY3QuaGVpZ2h0KSAvIGF0bGFzSGVpZ2h0O1xuXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA0OyArK3Jvdykge1xuICAgICAgICAgICAgICAgIGxldCByb3dEID0gdGVtcF91dnNbcm93XTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA0OyArK2NvbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sRCA9IHRlbXBfdXZzW2NvbF07XG4gICAgICAgICAgICAgICAgICAgIHV2U2xpY2VkLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdTogY29sRC51LFxuICAgICAgICAgICAgICAgICAgICAgICAgdjogcm93RC52XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0RHluYW1pY0F0bGFzRnJhbWUgKGZyYW1lKSB7XG4gICAgICAgIGlmICghZnJhbWUpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9vcmlnaW5hbCA9IHtcbiAgICAgICAgICAgIF90ZXh0dXJlIDogdGhpcy5fdGV4dHVyZSxcbiAgICAgICAgICAgIF94IDogdGhpcy5fcmVjdC54LFxuICAgICAgICAgICAgX3kgOiB0aGlzLl9yZWN0LnlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IGZyYW1lLnRleHR1cmU7XG4gICAgICAgIHRoaXMuX3JlY3QueCA9IGZyYW1lLng7XG4gICAgICAgIHRoaXMuX3JlY3QueSA9IGZyYW1lLnk7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgfSxcblxuICAgIF9yZXNldER5bmFtaWNBdGxhc0ZyYW1lICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5hbCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9yZWN0LnggPSB0aGlzLl9vcmlnaW5hbC5feDtcbiAgICAgICAgdGhpcy5fcmVjdC55ID0gdGhpcy5fb3JpZ2luYWwuX3k7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSB0aGlzLl9vcmlnaW5hbC5fdGV4dHVyZTtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgIH0sXG5cbiAgICBfY2FsY3VsYXRlVVYgKCkge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuX3JlY3QsXG4gICAgICAgICAgICB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZSxcbiAgICAgICAgICAgIHV2ID0gdGhpcy51dixcbiAgICAgICAgICAgIHRleHcgPSB0ZXh0dXJlLndpZHRoLFxuICAgICAgICAgICAgdGV4aCA9IHRleHR1cmUuaGVpZ2h0O1xuXG4gICAgICAgIGlmICh0aGlzLl9yb3RhdGVkKSB7XG4gICAgICAgICAgICBsZXQgbCA9IHRleHcgPT09IDAgPyAwIDogcmVjdC54IC8gdGV4dztcbiAgICAgICAgICAgIGxldCByID0gdGV4dyA9PT0gMCA/IDAgOiAocmVjdC54ICsgcmVjdC5oZWlnaHQpIC8gdGV4dztcbiAgICAgICAgICAgIGxldCBiID0gdGV4aCA9PT0gMCA/IDAgOiAocmVjdC55ICsgcmVjdC53aWR0aCkgLyB0ZXhoO1xuICAgICAgICAgICAgbGV0IHQgPSB0ZXhoID09PSAwID8gMCA6IHJlY3QueSAvIHRleGg7XG4gICAgICAgICAgICB1dlswXSA9IGw7XG4gICAgICAgICAgICB1dlsxXSA9IHQ7XG4gICAgICAgICAgICB1dlsyXSA9IGw7XG4gICAgICAgICAgICB1dlszXSA9IGI7XG4gICAgICAgICAgICB1dls0XSA9IHI7XG4gICAgICAgICAgICB1dls1XSA9IHQ7XG4gICAgICAgICAgICB1dls2XSA9IHI7XG4gICAgICAgICAgICB1dls3XSA9IGI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbCA9IHRleHcgPT09IDAgPyAwIDogcmVjdC54IC8gdGV4dztcbiAgICAgICAgICAgIGxldCByID0gdGV4dyA9PT0gMCA/IDAgOiAocmVjdC54ICsgcmVjdC53aWR0aCkgLyB0ZXh3O1xuICAgICAgICAgICAgbGV0IGIgPSB0ZXhoID09PSAwID8gMCA6IChyZWN0LnkgKyByZWN0LmhlaWdodCkgLyB0ZXhoO1xuICAgICAgICAgICAgbGV0IHQgPSB0ZXhoID09PSAwID8gMCA6IHJlY3QueSAvIHRleGg7XG4gICAgICAgICAgICB1dlswXSA9IGw7XG4gICAgICAgICAgICB1dlsxXSA9IGI7XG4gICAgICAgICAgICB1dlsyXSA9IHI7XG4gICAgICAgICAgICB1dlszXSA9IGI7XG4gICAgICAgICAgICB1dls0XSA9IGw7XG4gICAgICAgICAgICB1dls1XSA9IHQ7XG4gICAgICAgICAgICB1dls2XSA9IHI7XG4gICAgICAgICAgICB1dls3XSA9IHQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xuICAgICAgICBpZiAodmVydGljZXMpIHtcbiAgICAgICAgICAgIHZlcnRpY2VzLm51Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5udi5sZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy51Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmVydGljZXMubnVbaV0gPSB2ZXJ0aWNlcy51W2ldL3RleHc7XG4gICAgICAgICAgICAgICAgdmVydGljZXMubnZbaV0gPSB2ZXJ0aWNlcy52W2ldL3RleGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xuICAgIH0sXG5cbiAgICAvLyBTRVJJQUxJWkFUSU9OXG5cbiAgICBfc2VyaWFsaXplOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGV4cG9ydGluZykge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuX3JlY3Q7XG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLl9vZmZzZXQ7XG4gICAgICAgIGxldCBzaXplID0gdGhpcy5fb3JpZ2luYWxTaXplO1xuICAgICAgICBsZXQgdXVpZDtcbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xuICAgICAgICBpZiAodGV4dHVyZSkge1xuICAgICAgICAgICAgdXVpZCA9IHRleHR1cmUuX3V1aWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1dWlkKSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gdGhpcy5fdGV4dHVyZUZpbGVuYW1lO1xuICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgIHV1aWQgPSBFZGl0b3IuVXRpbHMuVXVpZENhY2hlLnVybFRvVXVpZCh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1dWlkICYmIGV4cG9ydGluZykge1xuICAgICAgICAgICAgdXVpZCA9IEVkaXRvci5VdGlscy5VdWlkVXRpbHMuY29tcHJlc3NVdWlkKHV1aWQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZlcnRpY2VzO1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlcykge1xuICAgICAgICAgICAgdmVydGljZXMgPSB7XG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzOiB0aGlzLnZlcnRpY2VzLnRyaWFuZ2xlcyxcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnZlcnRpY2VzLngsXG4gICAgICAgICAgICAgICAgeTogdGhpcy52ZXJ0aWNlcy55LFxuICAgICAgICAgICAgICAgIHU6IHRoaXMudmVydGljZXMudSxcbiAgICAgICAgICAgICAgICB2OiB0aGlzLnZlcnRpY2VzLnZcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5fbmFtZSxcbiAgICAgICAgICAgIHRleHR1cmU6IHV1aWQgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgYXRsYXM6IGV4cG9ydGluZyA/IHVuZGVmaW5lZCA6IHRoaXMuX2F0bGFzVXVpZCwgIC8vIHN0cmlwIGZyb20ganNvbiBpZiBleHBvcnRpbmdcbiAgICAgICAgICAgIHJlY3Q6IHJlY3QgPyBbcmVjdC54LCByZWN0LnksIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0XSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0ID8gW29mZnNldC54LCBvZmZzZXQueV0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBvcmlnaW5hbFNpemU6IHNpemUgPyBbc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHRdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcm90YXRlZDogdGhpcy5fcm90YXRlZCA/IDEgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjYXBJbnNldHM6IHRoaXMuX2NhcEluc2V0cyxcbiAgICAgICAgICAgIHZlcnRpY2VzOiB2ZXJ0aWNlc1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChkYXRhLCBoYW5kbGUpIHtcbiAgICAgICAgbGV0IHJlY3QgPSBkYXRhLnJlY3Q7XG4gICAgICAgIGlmIChyZWN0KSB7XG4gICAgICAgICAgICB0aGlzLl9yZWN0ID0gbmV3IGNjLlJlY3QocmVjdFswXSwgcmVjdFsxXSwgcmVjdFsyXSwgcmVjdFszXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEub2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9mZnNldChuZXcgY2MuVmVjMihkYXRhLm9mZnNldFswXSwgZGF0YS5vZmZzZXRbMV0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3JpZ2luYWxTaXplKG5ldyBjYy5TaXplKGRhdGEub3JpZ2luYWxTaXplWzBdLCBkYXRhLm9yaWdpbmFsU2l6ZVsxXSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JvdGF0ZWQgPSBkYXRhLnJvdGF0ZWQgPT09IDE7XG4gICAgICAgIHRoaXMuX25hbWUgPSBkYXRhLm5hbWU7XG5cbiAgICAgICAgbGV0IGNhcEluc2V0cyA9IGRhdGEuY2FwSW5zZXRzO1xuICAgICAgICBpZiAoY2FwSW5zZXRzKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfTEVGVF0gPSBjYXBJbnNldHNbSU5TRVRfTEVGVF07XG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXSA9IGNhcEluc2V0c1tJTlNFVF9UT1BdO1xuICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXSA9IGNhcEluc2V0c1tJTlNFVF9SSUdIVF07XG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfQk9UVE9NXSA9IGNhcEluc2V0c1tJTlNFVF9CT1RUT01dO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fYXRsYXNVdWlkID0gZGF0YS5hdGxhcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmVydGljZXMgPSBkYXRhLnZlcnRpY2VzO1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlcykge1xuICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSBub3JtYWwgdXYgYXJyYXlzXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzLm51ID0gW107XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzLm52ID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsb2FkIHRleHR1cmUgdmlhIF90ZXh0dXJlU2V0dGVyXG4gICAgICAgIGxldCB0ZXh0dXJlVXVpZCA9IGRhdGEudGV4dHVyZTtcbiAgICAgICAgaWYgKHRleHR1cmVVdWlkKSB7XG4gICAgICAgICAgICBoYW5kbGUucmVzdWx0LnB1c2godGhpcywgJ190ZXh0dXJlU2V0dGVyJywgdGV4dHVyZVV1aWQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmxldCBwcm90byA9IFNwcml0ZUZyYW1lLnByb3RvdHlwZTtcblxucHJvdG8uY29weVdpdGhab25lID0gcHJvdG8uY2xvbmU7XG5wcm90by5jb3B5ID0gcHJvdG8uY2xvbmU7XG5wcm90by5pbml0V2l0aFRleHR1cmUgPSBwcm90by5zZXRUZXh0dXJlO1xuXG5jYy5TcHJpdGVGcmFtZSA9IFNwcml0ZUZyYW1lO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZUZyYW1lO1xuIl19