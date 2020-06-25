
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCObject.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

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
var js = require('./js');

var CCClass = require('./CCClass'); // definitions for CCObject.Flags


var Destroyed = 1 << 0;
var RealDestroyed = 1 << 1;
var ToDestroy = 1 << 2;
var DontSave = 1 << 3;
var EditorOnly = 1 << 4;
var Dirty = 1 << 5;
var DontDestroy = 1 << 6;
var Destroying = 1 << 7;
var Deactivating = 1 << 8;
var LockedInEditor = 1 << 9; //var HideInGame = 1 << 9;

var HideInHierarchy = 1 << 10;
var IsOnEnableCalled = 1 << 11;
var IsEditorOnEnableCalled = 1 << 12;
var IsPreloadStarted = 1 << 13;
var IsOnLoadCalled = 1 << 14;
var IsOnLoadStarted = 1 << 15;
var IsStartCalled = 1 << 16;
var IsRotationLocked = 1 << 17;
var IsScaleLocked = 1 << 18;
var IsAnchorLocked = 1 << 19;
var IsSizeLocked = 1 << 20;
var IsPositionLocked = 1 << 21; //var Hide = HideInGame | HideInHierarchy;
// should not clone or serialize these flags

var PersistentMask = ~(ToDestroy | Dirty | Destroying | DontDestroy | Deactivating | IsPreloadStarted | IsOnLoadStarted | IsOnLoadCalled | IsStartCalled | IsOnEnableCalled | IsEditorOnEnableCalled | IsRotationLocked | IsScaleLocked | IsAnchorLocked | IsSizeLocked | IsPositionLocked
/*RegisteredInEditor*/
);
/**
 * The base class of most of all the objects in Fireball.
 * @class Object
 *
 * @main
 * @private
 */

function CCObject() {
  /**
   * @property {String} _name
   * @default ""
   * @private
   */
  this._name = '';
  /**
   * @property {Number} _objFlags
   * @default 0
   * @private
   */

  this._objFlags = 0;
}

CCClass.fastDefine('cc.Object', CCObject, {
  _name: '',
  _objFlags: 0
});
/**
 * Bit mask that controls object states.
 * @enum Flags
 * @static
 * @private
 */

js.value(CCObject, 'Flags', {
  Destroyed: Destroyed,
  //ToDestroy: ToDestroy,

  /**
   * !#en The object will not be saved.
   * !#zh 该对象将不会被保存。
   * @property {Number} DontSave
   */
  DontSave: DontSave,

  /**
   * !#en The object will not be saved when building a player.
   * !#zh 构建项目时，该对象将不会被保存。
   * @property {Number} EditorOnly
   */
  EditorOnly: EditorOnly,
  Dirty: Dirty,

  /**
   * !#en Dont destroy automatically when loading a new scene.
   * !#zh 加载一个新场景时，不自动删除该对象。
   * @property DontDestroy
   * @private
   */
  DontDestroy: DontDestroy,
  PersistentMask: PersistentMask,
  // FLAGS FOR ENGINE
  Destroying: Destroying,

  /**
   * !#en The node is deactivating.
   * !#zh 节点正在反激活的过程中。
   * @property Deactivating
   * @private
   */
  Deactivating: Deactivating,

  /**
   * !#en The lock node, when the node is locked, cannot be clicked in the scene.
   * !#zh 锁定节点，锁定后场景内不能点击。
   * 
   * @property LockedInEditor
   * @private
   */
  LockedInEditor: LockedInEditor,
  ///**
  // * !#en
  // * Hide in game and hierarchy.
  // * This flag is readonly, it can only be used as an argument of scene.addEntity() or Entity.createWithFlags().
  // * !#zh
  // * 在游戏和层级中隐藏该对象。<br/>
  // * 该标记只读，它只能被用作 scene.addEntity()的一个参数。
  // * @property {Number} HideInGame
  // */
  //HideInGame: HideInGame,
  // FLAGS FOR EDITOR

  /**
   * !#en Hide the object in editor.
   * !#zh 在编辑器中隐藏该对象。
   * @property {Number} HideInHierarchy
   */
  HideInHierarchy: HideInHierarchy,
  ///**
  // * !#en
  // * Hide in game view, hierarchy, and scene view... etc.
  // * This flag is readonly, it can only be used as an argument of scene.addEntity() or Entity.createWithFlags().
  // * !#zh
  // * 在游戏视图，层级，场景视图等等...中隐藏该对象。
  // * 该标记只读，它只能被用作 scene.addEntity()的一个参数。
  // * @property {Number} Hide
  // */
  //Hide: Hide,
  // FLAGS FOR COMPONENT
  IsPreloadStarted: IsPreloadStarted,
  IsOnLoadStarted: IsOnLoadStarted,
  IsOnLoadCalled: IsOnLoadCalled,
  IsOnEnableCalled: IsOnEnableCalled,
  IsStartCalled: IsStartCalled,
  IsEditorOnEnableCalled: IsEditorOnEnableCalled,
  IsPositionLocked: IsPositionLocked,
  IsRotationLocked: IsRotationLocked,
  IsScaleLocked: IsScaleLocked,
  IsAnchorLocked: IsAnchorLocked,
  IsSizeLocked: IsSizeLocked
});
var objectsToDestroy = [];

function deferredDestroy() {
  var deleteCount = objectsToDestroy.length;

  for (var i = 0; i < deleteCount; ++i) {
    var obj = objectsToDestroy[i];

    if (!(obj._objFlags & Destroyed)) {
      obj._destroyImmediate();
    }
  } // if we called b.destory() in a.onDestroy(), objectsToDestroy will be resized,
  // but we only destroy the objects which called destory in this frame.


  if (deleteCount === objectsToDestroy.length) {
    objectsToDestroy.length = 0;
  } else {
    objectsToDestroy.splice(0, deleteCount);
  }

  if (CC_EDITOR) {
    deferredDestroyTimer = null;
  }
}

js.value(CCObject, '_deferredDestroy', deferredDestroy);

if (CC_EDITOR) {
  js.value(CCObject, '_clearDeferredDestroyTimer', function () {
    if (deferredDestroyTimer !== null) {
      clearImmediate(deferredDestroyTimer);
      deferredDestroyTimer = null;
    }
  });
} // MEMBER

/**
 * @class Object
 */


var prototype = CCObject.prototype;
/**
 * !#en The name of the object.
 * !#zh 该对象的名称。
 * @property {String} name
 * @default ""
 * @example
 * obj.name = "New Obj";
 */

js.getset(prototype, 'name', function () {
  return this._name;
}, function (value) {
  this._name = value;
}, true);
/**
 * !#en
 * Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * !#zh
 * 表示该对象是否可用（被 destroy 后将不可用）。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @property {Boolean} isValid
 * @default true
 * @readOnly
 * @example
 * var node = new cc.Node();
 * cc.log(node.isValid);    // true
 * node.destroy();
 * cc.log(node.isValid);    // true, still valid in this frame
 * // after a frame...
 * cc.log(node.isValid);    // false, destroyed in the end of last frame
 */

js.get(prototype, 'isValid', function () {
  return !(this._objFlags & Destroyed);
}, true);

if (CC_EDITOR || CC_TEST) {
  js.get(prototype, 'isRealValid', function () {
    return !(this._objFlags & RealDestroyed);
  });
}

var deferredDestroyTimer = null;
/**
 * !#en
 * Destroy this Object, and release all its own references to other objects.<br/>
 * Actual object destruction will delayed until before rendering.
 * From the next frame, this object is not usable any more.
 * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
 * !#zh
 * 销毁该对象，并释放所有它对其它对象的引用。<br/>
 * 实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
 * 您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
 * @example
 * obj.destroy();
 */

prototype.destroy = function () {
  if (this._objFlags & Destroyed) {
    cc.warnID(5000);
    return false;
  }

  if (this._objFlags & ToDestroy) {
    return false;
  }

  this._objFlags |= ToDestroy;
  objectsToDestroy.push(this);

  if (CC_EDITOR && deferredDestroyTimer === null && cc.engine && !cc.engine._isUpdating) {
    // auto destroy immediate in edit mode
    deferredDestroyTimer = setImmediate(deferredDestroy);
  }

  return true;
};

if (CC_EDITOR || CC_TEST) {
  /*
   * !#en
   * In fact, Object's "destroy" will not trigger the destruct operation in Firebal Editor.
   * The destruct operation will be executed by Undo system later.
   * !#zh
   * 事实上，对象的 “destroy” 不会在编辑器中触发析构操作，
   * 析构操作将在 Undo 系统中**延后**执行。
   * @method realDestroyInEditor
   * @private
   */
  prototype.realDestroyInEditor = function () {
    if (!(this._objFlags & Destroyed)) {
      cc.warnID(5001);
      return;
    }

    if (this._objFlags & RealDestroyed) {
      cc.warnID(5000);
      return;
    }

    this._destruct();

    this._objFlags |= RealDestroyed;
  };
}

function compileDestruct(obj, ctor) {
  var shouldSkipId = obj instanceof cc._BaseNode || obj instanceof cc.Component;
  var idToSkip = shouldSkipId ? '_id' : null;
  var key,
      propsToReset = {};

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === idToSkip) {
        continue;
      }

      switch (typeof obj[key]) {
        case 'string':
          propsToReset[key] = '';
          break;

        case 'object':
        case 'function':
          propsToReset[key] = null;
          break;
      }
    }
  } // Overwrite propsToReset according to Class


  if (cc.Class._isCCClass(ctor)) {
    var attrs = cc.Class.Attr.getClassAttrs(ctor);
    var propList = ctor.__props__;

    for (var i = 0; i < propList.length; i++) {
      key = propList[i];
      var attrKey = key + cc.Class.Attr.DELIMETER + 'default';

      if (attrKey in attrs) {
        if (shouldSkipId && key === '_id') {
          continue;
        }

        switch (typeof attrs[attrKey]) {
          case 'string':
            propsToReset[key] = '';
            break;

          case 'object':
          case 'function':
            propsToReset[key] = null;
            break;

          case 'undefined':
            propsToReset[key] = undefined;
            break;
        }
      }
    }
  }

  if (CC_SUPPORT_JIT) {
    // compile code
    var func = '';

    for (key in propsToReset) {
      var statement;

      if (CCClass.IDENTIFIER_RE.test(key)) {
        statement = 'o.' + key + '=';
      } else {
        statement = 'o[' + CCClass.escapeForJS(key) + ']=';
      }

      var val = propsToReset[key];

      if (val === '') {
        val = '""';
      }

      func += statement + val + ';\n';
    }

    return Function('o', func);
  } else {
    return function (o) {
      for (var key in propsToReset) {
        o[key] = propsToReset[key];
      }
    };
  }
}
/**
 * Clear all references in the instance.
 *
 * NOTE: this method will not clear the getter or setter functions which defined in the instance of CCObject.
 *       You can override the _destruct method if you need, for example:
 *       _destruct: function () {
 *           for (var key in this) {
 *               if (this.hasOwnProperty(key)) {
 *                   switch (typeof this[key]) {
 *                       case 'string':
 *                           this[key] = '';
 *                           break;
 *                       case 'object':
 *                       case 'function':
 *                           this[key] = null;
 *                           break;
 *               }
 *           }
 *       }
 *
 * @method _destruct
 * @private
 */


prototype._destruct = function () {
  var ctor = this.constructor;
  var destruct = ctor.__destruct__;

  if (!destruct) {
    destruct = compileDestruct(this, ctor);
    js.value(ctor, '__destruct__', destruct, true);
  }

  destruct(this);
};
/**
 * Called before the object being destroyed.
 * @method _onPreDestroy
 * @private
 */


prototype._onPreDestroy = null;

prototype._destroyImmediate = function () {
  if (this._objFlags & Destroyed) {
    cc.errorID(5000);
    return;
  } // engine internal callback


  if (this._onPreDestroy) {
    this._onPreDestroy();
  }

  if ((CC_TEST ?
  /* make CC_EDITOR mockable*/
  Function('return !CC_EDITOR')() : !CC_EDITOR) || cc.engine._isPlaying) {
    this._destruct();
  }

  this._objFlags |= Destroyed;
};

if (CC_EDITOR) {
  /**
   * The customized serialization for this object. (Editor Only)
   * @method _serialize
   * @param {Boolean} exporting
   * @return {object} the serialized json data object
   * @private
   */
  prototype._serialize = null;
}
/**
 * Init this object from the custom serialized data.
 * @method _deserialize
 * @param {Object} data - the serialized json data
 * @param {_Deserializer} ctx
 * @private
 */


prototype._deserialize = null;
/**
 * @module cc
 */

/**
 * !#en
 * Checks whether the object is non-nil and not yet destroyed.<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * !#zh
 * 检查该对象是否不为 null 并且尚未销毁。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @method isValid
 * @param {any} value
 * @param {Boolean} [strictMode=false] - If true, Object called destroy() in this frame will also treated as invalid.
 * @return {Boolean} whether is valid
 * @example
 * var node = new cc.Node();
 * cc.log(cc.isValid(node));    // true
 * node.destroy();
 * cc.log(cc.isValid(node));    // true, still valid in this frame
 * // after a frame...
 * cc.log(cc.isValid(node));    // false, destroyed in the end of last frame
 */

cc.isValid = function (value, strictMode) {
  if (typeof value === 'object') {
    return !!value && !(value._objFlags & (strictMode ? Destroyed | ToDestroy : Destroyed));
  } else {
    return typeof value !== 'undefined';
  }
};

if (CC_EDITOR || CC_TEST) {
  js.value(CCObject, '_willDestroy', function (obj) {
    return !(obj._objFlags & Destroyed) && (obj._objFlags & ToDestroy) > 0;
  });
  js.value(CCObject, '_cancelDestroy', function (obj) {
    obj._objFlags &= ~ToDestroy;
    js.array.fastRemove(objectsToDestroy, obj);
  });
}

cc.Object = module.exports = CCObject;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDT2JqZWN0LmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIkNDQ2xhc3MiLCJEZXN0cm95ZWQiLCJSZWFsRGVzdHJveWVkIiwiVG9EZXN0cm95IiwiRG9udFNhdmUiLCJFZGl0b3JPbmx5IiwiRGlydHkiLCJEb250RGVzdHJveSIsIkRlc3Ryb3lpbmciLCJEZWFjdGl2YXRpbmciLCJMb2NrZWRJbkVkaXRvciIsIkhpZGVJbkhpZXJhcmNoeSIsIklzT25FbmFibGVDYWxsZWQiLCJJc0VkaXRvck9uRW5hYmxlQ2FsbGVkIiwiSXNQcmVsb2FkU3RhcnRlZCIsIklzT25Mb2FkQ2FsbGVkIiwiSXNPbkxvYWRTdGFydGVkIiwiSXNTdGFydENhbGxlZCIsIklzUm90YXRpb25Mb2NrZWQiLCJJc1NjYWxlTG9ja2VkIiwiSXNBbmNob3JMb2NrZWQiLCJJc1NpemVMb2NrZWQiLCJJc1Bvc2l0aW9uTG9ja2VkIiwiUGVyc2lzdGVudE1hc2siLCJDQ09iamVjdCIsIl9uYW1lIiwiX29iakZsYWdzIiwiZmFzdERlZmluZSIsInZhbHVlIiwib2JqZWN0c1RvRGVzdHJveSIsImRlZmVycmVkRGVzdHJveSIsImRlbGV0ZUNvdW50IiwibGVuZ3RoIiwiaSIsIm9iaiIsIl9kZXN0cm95SW1tZWRpYXRlIiwic3BsaWNlIiwiQ0NfRURJVE9SIiwiZGVmZXJyZWREZXN0cm95VGltZXIiLCJjbGVhckltbWVkaWF0ZSIsInByb3RvdHlwZSIsImdldHNldCIsImdldCIsIkNDX1RFU1QiLCJkZXN0cm95IiwiY2MiLCJ3YXJuSUQiLCJwdXNoIiwiZW5naW5lIiwiX2lzVXBkYXRpbmciLCJzZXRJbW1lZGlhdGUiLCJyZWFsRGVzdHJveUluRWRpdG9yIiwiX2Rlc3RydWN0IiwiY29tcGlsZURlc3RydWN0IiwiY3RvciIsInNob3VsZFNraXBJZCIsIl9CYXNlTm9kZSIsIkNvbXBvbmVudCIsImlkVG9Ta2lwIiwia2V5IiwicHJvcHNUb1Jlc2V0IiwiaGFzT3duUHJvcGVydHkiLCJDbGFzcyIsIl9pc0NDQ2xhc3MiLCJhdHRycyIsIkF0dHIiLCJnZXRDbGFzc0F0dHJzIiwicHJvcExpc3QiLCJfX3Byb3BzX18iLCJhdHRyS2V5IiwiREVMSU1FVEVSIiwidW5kZWZpbmVkIiwiQ0NfU1VQUE9SVF9KSVQiLCJmdW5jIiwic3RhdGVtZW50IiwiSURFTlRJRklFUl9SRSIsInRlc3QiLCJlc2NhcGVGb3JKUyIsInZhbCIsIkZ1bmN0aW9uIiwibyIsImNvbnN0cnVjdG9yIiwiZGVzdHJ1Y3QiLCJfX2Rlc3RydWN0X18iLCJfb25QcmVEZXN0cm95IiwiZXJyb3JJRCIsIl9pc1BsYXlpbmciLCJfc2VyaWFsaXplIiwiX2Rlc2VyaWFsaXplIiwiaXNWYWxpZCIsInN0cmljdE1vZGUiLCJhcnJheSIsImZhc3RSZW1vdmUiLCJPYmplY3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQWhCOztBQUNBLElBQUlDLE9BQU8sR0FBR0QsT0FBTyxDQUFDLFdBQUQsQ0FBckIsRUFFQTs7O0FBRUEsSUFBSUUsU0FBUyxHQUFHLEtBQUssQ0FBckI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsS0FBSyxDQUF6QjtBQUNBLElBQUlDLFNBQVMsR0FBRyxLQUFLLENBQXJCO0FBQ0EsSUFBSUMsUUFBUSxHQUFHLEtBQUssQ0FBcEI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsS0FBSyxDQUF0QjtBQUNBLElBQUlDLEtBQUssR0FBRyxLQUFLLENBQWpCO0FBQ0EsSUFBSUMsV0FBVyxHQUFHLEtBQUssQ0FBdkI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsS0FBSyxDQUF0QjtBQUNBLElBQUlDLFlBQVksR0FBRyxLQUFLLENBQXhCO0FBQ0EsSUFBSUMsY0FBYyxHQUFHLEtBQUssQ0FBMUIsRUFDQTs7QUFDQSxJQUFJQyxlQUFlLEdBQUcsS0FBSyxFQUEzQjtBQUVBLElBQUlDLGdCQUFn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SXpGLFNBQVMsR0FBR0UsU0FBaEIsR0FBNkJGLFNBQTFELENBQUYsQ0FBbEI7QUFDSCxHQUZELE1BR0s7QUFDRCxXQUFPLE9BQU8yQixLQUFQLEtBQWlCLFdBQXhCO0FBQ0g7QUFDSixDQVBEOztBQVNBLElBQUlTLFNBQVMsSUFBSU0sT0FBakIsRUFBMEI7QUFDdEI3QyxFQUFBQSxFQUFFLENBQUM4QixLQUFILENBQVNKLFFBQVQsRUFBbUIsY0FBbkIsRUFBbUMsVUFBVVUsR0FBVixFQUFlO0FBQzlDLFdBQU8sRUFBRUEsR0FBRyxDQUFDUixTQUFKLEdBQWdCekIsU0FBbEIsS0FBZ0MsQ0FBQ2lDLEdBQUcsQ0FBQ1IsU0FBSixHQUFnQnZCLFNBQWpCLElBQThCLENBQXJFO0FBQ0gsR0FGRDtBQUdBTCxFQUFBQSxFQUFFLENBQUM4QixLQUFILENBQVNKLFFBQVQsRUFBbUIsZ0JBQW5CLEVBQXFDLFVBQVVVLEdBQVYsRUFBZTtBQUNoREEsSUFBQUEsR0FBRyxDQUFDUixTQUFKLElBQWlCLENBQUN2QixTQUFsQjtBQUNBTCxJQUFBQSxFQUFFLENBQUM2RixLQUFILENBQVNDLFVBQVQsQ0FBb0IvRCxnQkFBcEIsRUFBc0NLLEdBQXRDO0FBQ0gsR0FIRDtBQUlIOztBQUVEVyxFQUFFLENBQUNnRCxNQUFILEdBQVlDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZFLFFBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gcmVxdWlyZSgnLi9qcycpO1xudmFyIENDQ2xhc3MgPSByZXF1aXJlKCcuL0NDQ2xhc3MnKTtcblxuLy8gZGVmaW5pdGlvbnMgZm9yIENDT2JqZWN0LkZsYWdzXG5cbnZhciBEZXN0cm95ZWQgPSAxIDw8IDA7XG52YXIgUmVhbERlc3Ryb3llZCA9IDEgPDwgMTtcbnZhciBUb0Rlc3Ryb3kgPSAxIDw8IDI7XG52YXIgRG9udFNhdmUgPSAxIDw8IDM7XG52YXIgRWRpdG9yT25seSA9IDEgPDwgNDtcbnZhciBEaXJ0eSA9IDEgPDwgNTtcbnZhciBEb250RGVzdHJveSA9IDEgPDwgNjtcbnZhciBEZXN0cm95aW5nID0gMSA8PCA3O1xudmFyIERlYWN0aXZhdGluZyA9IDEgPDwgODtcbnZhciBMb2NrZWRJbkVkaXRvciA9IDEgPDwgOTtcbi8vdmFyIEhpZGVJbkdhbWUgPSAxIDw8IDk7XG52YXIgSGlkZUluSGllcmFyY2h5ID0gMSA8PCAxMDtcblxudmFyIElzT25FbmFibGVDYWxsZWQgPSAxIDw8IDExO1xudmFyIElzRWRpdG9yT25FbmFibGVDYWxsZWQgPSAxIDw8IDEyO1xudmFyIElzUHJlbG9hZFN0YXJ0ZWQgPSAxIDw8IDEzO1xudmFyIElzT25Mb2FkQ2FsbGVkID0gMSA8PCAxNDtcbnZhciBJc09uTG9hZFN0YXJ0ZWQgPSAxIDw8IDE1O1xudmFyIElzU3RhcnRDYWxsZWQgPSAxIDw8IDE2O1xuXG52YXIgSXNSb3RhdGlvbkxvY2tlZCA9IDEgPDwgMTc7XG52YXIgSXNTY2FsZUxvY2tlZCA9IDEgPDwgMTg7XG52YXIgSXNBbmNob3JMb2NrZWQgPSAxIDw8IDE5O1xudmFyIElzU2l6ZUxvY2tlZCA9IDEgPDwgMjA7XG52YXIgSXNQb3NpdGlvbkxvY2tlZCA9IDEgPDwgMjE7XG5cbi8vdmFyIEhpZGUgPSBIaWRlSW5HYW1lIHwgSGlkZUluSGllcmFyY2h5O1xuLy8gc2hvdWxkIG5vdCBjbG9uZSBvciBzZXJpYWxpemUgdGhlc2UgZmxhZ3NcbnZhciBQZXJzaXN0ZW50TWFzayA9IH4oVG9EZXN0cm95IHwgRGlydHkgfCBEZXN0cm95aW5nIHwgRG9udERlc3Ryb3kgfCBEZWFjdGl2YXRpbmcgfFxuICAgICAgICAgICAgICAgICAgICAgICBJc1ByZWxvYWRTdGFydGVkIHwgSXNPbkxvYWRTdGFydGVkIHwgSXNPbkxvYWRDYWxsZWQgfCBJc1N0YXJ0Q2FsbGVkIHxcbiAgICAgICAgICAgICAgICAgICAgICAgSXNPbkVuYWJsZUNhbGxlZCB8IElzRWRpdG9yT25FbmFibGVDYWxsZWQgfFxuICAgICAgICAgICAgICAgICAgICAgICBJc1JvdGF0aW9uTG9ja2VkIHwgSXNTY2FsZUxvY2tlZCB8IElzQW5jaG9yTG9ja2VkIHwgSXNTaXplTG9ja2VkIHwgSXNQb3NpdGlvbkxvY2tlZFxuICAgICAgICAgICAgICAgICAgICAgICAvKlJlZ2lzdGVyZWRJbkVkaXRvciovKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBjbGFzcyBvZiBtb3N0IG9mIGFsbCB0aGUgb2JqZWN0cyBpbiBGaXJlYmFsbC5cbiAqIEBjbGFzcyBPYmplY3RcbiAqXG4gKiBAbWFpblxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gQ0NPYmplY3QgKCkge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBfbmFtZVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX25hbWUgPSAnJztcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBfb2JqRmxhZ3NcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9vYmpGbGFncyA9IDA7XG59XG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLk9iamVjdCcsIENDT2JqZWN0LCB7IF9uYW1lOiAnJywgX29iakZsYWdzOiAwIH0pO1xuXG4vKipcbiAqIEJpdCBtYXNrIHRoYXQgY29udHJvbHMgb2JqZWN0IHN0YXRlcy5cbiAqIEBlbnVtIEZsYWdzXG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5qcy52YWx1ZShDQ09iamVjdCwgJ0ZsYWdzJywge1xuXG4gICAgRGVzdHJveWVkLFxuICAgIC8vVG9EZXN0cm95OiBUb0Rlc3Ryb3ksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBvYmplY3Qgd2lsbCBub3QgYmUgc2F2ZWQuXG4gICAgICogISN6aCDor6Xlr7nosaHlsIbkuI3kvJrooqvkv53lrZjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRG9udFNhdmVcbiAgICAgKi9cbiAgICBEb250U2F2ZSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG9iamVjdCB3aWxsIG5vdCBiZSBzYXZlZCB3aGVuIGJ1aWxkaW5nIGEgcGxheWVyLlxuICAgICAqICEjemgg5p6E5bu66aG555uu5pe277yM6K+l5a+56LGh5bCG5LiN5Lya6KKr5L+d5a2Y44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVkaXRvck9ubHlcbiAgICAgKi9cbiAgICBFZGl0b3JPbmx5LFxuXG4gICAgRGlydHksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERvbnQgZGVzdHJveSBhdXRvbWF0aWNhbGx5IHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZS5cbiAgICAgKiAhI3poIOWKoOi9veS4gOS4quaWsOWcuuaZr+aXtu+8jOS4jeiHquWKqOWIoOmZpOivpeWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSBEb250RGVzdHJveVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgRG9udERlc3Ryb3ksXG5cbiAgICBQZXJzaXN0ZW50TWFzayxcblxuICAgIC8vIEZMQUdTIEZPUiBFTkdJTkVcblxuICAgIERlc3Ryb3lpbmcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBub2RlIGlzIGRlYWN0aXZhdGluZy5cbiAgICAgKiAhI3poIOiKgueCueato+WcqOWPjea/gOa0u+eahOi/h+eoi+S4reOAglxuICAgICAqIEBwcm9wZXJ0eSBEZWFjdGl2YXRpbmdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIERlYWN0aXZhdGluZyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGxvY2sgbm9kZSwgd2hlbiB0aGUgbm9kZSBpcyBsb2NrZWQsIGNhbm5vdCBiZSBjbGlja2VkIGluIHRoZSBzY2VuZS5cbiAgICAgKiAhI3poIOmUgeWumuiKgueCue+8jOmUgeWumuWQjuWcuuaZr+WGheS4jeiDveeCueWHu+OAglxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBMb2NrZWRJbkVkaXRvclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgTG9ja2VkSW5FZGl0b3IsXG5cbiAgICAvLy8qKlxuICAgIC8vICogISNlblxuICAgIC8vICogSGlkZSBpbiBnYW1lIGFuZCBoaWVyYXJjaHkuXG4gICAgLy8gKiBUaGlzIGZsYWcgaXMgcmVhZG9ubHksIGl0IGNhbiBvbmx5IGJlIHVzZWQgYXMgYW4gYXJndW1lbnQgb2Ygc2NlbmUuYWRkRW50aXR5KCkgb3IgRW50aXR5LmNyZWF0ZVdpdGhGbGFncygpLlxuICAgIC8vICogISN6aFxuICAgIC8vICog5Zyo5ri45oiP5ZKM5bGC57qn5Lit6ZqQ6JeP6K+l5a+56LGh44CCPGJyLz5cbiAgICAvLyAqIOivpeagh+iusOWPquivu++8jOWug+WPquiDveiiq+eUqOS9nCBzY2VuZS5hZGRFbnRpdHkoKeeahOS4gOS4quWPguaVsOOAglxuICAgIC8vICogQHByb3BlcnR5IHtOdW1iZXJ9IEhpZGVJbkdhbWVcbiAgICAvLyAqL1xuICAgIC8vSGlkZUluR2FtZTogSGlkZUluR2FtZSxcblxuICAgIC8vIEZMQUdTIEZPUiBFRElUT1JcblxuICAgIC8qKlxuICAgICAqICEjZW4gSGlkZSB0aGUgb2JqZWN0IGluIGVkaXRvci5cbiAgICAgKiAhI3poIOWcqOe8lui+keWZqOS4remakOiXj+ivpeWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBIaWRlSW5IaWVyYXJjaHlcbiAgICAgKi9cbiAgICBIaWRlSW5IaWVyYXJjaHk6IEhpZGVJbkhpZXJhcmNoeSxcblxuICAgIC8vLyoqXG4gICAgLy8gKiAhI2VuXG4gICAgLy8gKiBIaWRlIGluIGdhbWUgdmlldywgaGllcmFyY2h5LCBhbmQgc2NlbmUgdmlldy4uLiBldGMuXG4gICAgLy8gKiBUaGlzIGZsYWcgaXMgcmVhZG9ubHksIGl0IGNhbiBvbmx5IGJlIHVzZWQgYXMgYW4gYXJndW1lbnQgb2Ygc2NlbmUuYWRkRW50aXR5KCkgb3IgRW50aXR5LmNyZWF0ZVdpdGhGbGFncygpLlxuICAgIC8vICogISN6aFxuICAgIC8vICog5Zyo5ri45oiP6KeG5Zu+77yM5bGC57qn77yM5Zy65pmv6KeG5Zu+562J562JLi4u5Lit6ZqQ6JeP6K+l5a+56LGh44CCXG4gICAgLy8gKiDor6XmoIforrDlj6ror7vvvIzlroPlj6rog73ooqvnlKjkvZwgc2NlbmUuYWRkRW50aXR5KCnnmoTkuIDkuKrlj4LmlbDjgIJcbiAgICAvLyAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBIaWRlXG4gICAgLy8gKi9cbiAgICAvL0hpZGU6IEhpZGUsXG5cbiAgICAvLyBGTEFHUyBGT1IgQ09NUE9ORU5UXG5cbiAgICBJc1ByZWxvYWRTdGFydGVkLFxuICAgIElzT25Mb2FkU3RhcnRlZCxcbiAgICBJc09uTG9hZENhbGxlZCxcbiAgICBJc09uRW5hYmxlQ2FsbGVkLFxuICAgIElzU3RhcnRDYWxsZWQsXG4gICAgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCxcblxuICAgIElzUG9zaXRpb25Mb2NrZWQsXG4gICAgSXNSb3RhdGlvbkxvY2tlZCxcbiAgICBJc1NjYWxlTG9ja2VkLFxuICAgIElzQW5jaG9yTG9ja2VkLFxuICAgIElzU2l6ZUxvY2tlZCxcbn0pO1xuXG52YXIgb2JqZWN0c1RvRGVzdHJveSA9IFtdO1xuXG5mdW5jdGlvbiBkZWZlcnJlZERlc3Ryb3kgKCkge1xuICAgIHZhciBkZWxldGVDb3VudCA9IG9iamVjdHNUb0Rlc3Ryb3kubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsZXRlQ291bnQ7ICsraSkge1xuICAgICAgICB2YXIgb2JqID0gb2JqZWN0c1RvRGVzdHJveVtpXTtcbiAgICAgICAgaWYgKCEob2JqLl9vYmpGbGFncyAmIERlc3Ryb3llZCkpIHtcbiAgICAgICAgICAgIG9iai5fZGVzdHJveUltbWVkaWF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHdlIGNhbGxlZCBiLmRlc3RvcnkoKSBpbiBhLm9uRGVzdHJveSgpLCBvYmplY3RzVG9EZXN0cm95IHdpbGwgYmUgcmVzaXplZCxcbiAgICAvLyBidXQgd2Ugb25seSBkZXN0cm95IHRoZSBvYmplY3RzIHdoaWNoIGNhbGxlZCBkZXN0b3J5IGluIHRoaXMgZnJhbWUuXG4gICAgaWYgKGRlbGV0ZUNvdW50ID09PSBvYmplY3RzVG9EZXN0cm95Lmxlbmd0aCkge1xuICAgICAgICBvYmplY3RzVG9EZXN0cm95Lmxlbmd0aCA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvYmplY3RzVG9EZXN0cm95LnNwbGljZSgwLCBkZWxldGVDb3VudCk7XG4gICAgfVxuXG4gICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IG51bGw7XG4gICAgfVxufVxuXG5qcy52YWx1ZShDQ09iamVjdCwgJ19kZWZlcnJlZERlc3Ryb3knLCBkZWZlcnJlZERlc3Ryb3kpO1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAganMudmFsdWUoQ0NPYmplY3QsICdfY2xlYXJEZWZlcnJlZERlc3Ryb3lUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRlZmVycmVkRGVzdHJveVRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjbGVhckltbWVkaWF0ZShkZWZlcnJlZERlc3Ryb3lUaW1lcik7XG4gICAgICAgICAgICBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gTUVNQkVSXG5cbi8qKlxuICogQGNsYXNzIE9iamVjdFxuICovXG5cbnZhciBwcm90b3R5cGUgPSBDQ09iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogISNlbiBUaGUgbmFtZSBvZiB0aGUgb2JqZWN0LlxuICogISN6aCDor6Xlr7nosaHnmoTlkI3np7DjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lXG4gKiBAZGVmYXVsdCBcIlwiXG4gKiBAZXhhbXBsZVxuICogb2JqLm5hbWUgPSBcIk5ldyBPYmpcIjtcbiAqL1xuanMuZ2V0c2V0KHByb3RvdHlwZSwgJ25hbWUnLFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfSxcbiAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgIH0sXG4gICAgdHJ1ZVxuKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb2JqZWN0IGlzIG5vdCB5ZXQgZGVzdHJveWVkLiAoSXQgd2lsbCBub3QgYmUgYXZhaWxhYmxlIGFmdGVyIGJlaW5nIGRlc3Ryb3llZCk8YnI+XG4gKiBXaGVuIGFuIG9iamVjdCdzIGBkZXN0cm95YCBpcyBjYWxsZWQsIGl0IGlzIGFjdHVhbGx5IGRlc3Ryb3llZCBhZnRlciB0aGUgZW5kIG9mIHRoaXMgZnJhbWUuXG4gKiBTbyBgaXNWYWxpZGAgd2lsbCByZXR1cm4gZmFsc2UgZnJvbSB0aGUgbmV4dCBmcmFtZSwgd2hpbGUgYGlzVmFsaWRgIGluIHRoZSBjdXJyZW50IGZyYW1lIHdpbGwgc3RpbGwgYmUgdHJ1ZS5cbiAqIElmIHlvdSB3YW50IHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBjdXJyZW50IGZyYW1lIGhhcyBjYWxsZWQgYGRlc3Ryb3lgLCB1c2UgYGNjLmlzVmFsaWQob2JqLCB0cnVlKWAsXG4gKiBidXQgdGhpcyBpcyBvZnRlbiBjYXVzZWQgYnkgYSBwYXJ0aWN1bGFyIGxvZ2ljYWwgcmVxdWlyZW1lbnRzLCB3aGljaCBpcyBub3Qgbm9ybWFsbHkgcmVxdWlyZWQuXG4gKlxuICogISN6aFxuICog6KGo56S66K+l5a+56LGh5piv5ZCm5Y+v55So77yI6KKrIGRlc3Ryb3kg5ZCO5bCG5LiN5Y+v55So77yJ44CCPGJyPlxuICog5b2T5LiA5Liq5a+56LGh55qEIGBkZXN0cm95YCDosIPnlKjku6XlkI7vvIzkvJrlnKjov5nkuIDluKfnu5PmnZ/lkI7miY3nnJ/mraPplIDmr4HjgILlm6DmraTku47kuIvkuIDluKflvIDlp4sgYGlzVmFsaWRgIOWwseS8mui/lOWbniBmYWxzZe+8jOiAjOW9k+WJjeW4p+WGhSBgaXNWYWxpZGAg5LuN54S25Lya5pivIHRydWXjgILlpoLmnpzluIzmnJvliKTmlq3lvZPliY3luKfmmK/lkKbosIPnlKjov4cgYGRlc3Ryb3lg77yM6K+35L2/55SoIGBjYy5pc1ZhbGlkKG9iaiwgdHJ1ZSlg77yM5LiN6L+H6L+Z5b6A5b6A5piv54m55q6K55qE5Lia5Yqh6ZyA5rGC5byV6LW355qE77yM6YCa5bi45oOF5Ya15LiL5LiN6ZyA6KaB6L+Z5qC344CCXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBpc1ZhbGlkXG4gKiBAZGVmYXVsdCB0cnVlXG4gKiBAcmVhZE9ubHlcbiAqIEBleGFtcGxlXG4gKiB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gKiBjYy5sb2cobm9kZS5pc1ZhbGlkKTsgICAgLy8gdHJ1ZVxuICogbm9kZS5kZXN0cm95KCk7XG4gKiBjYy5sb2cobm9kZS5pc1ZhbGlkKTsgICAgLy8gdHJ1ZSwgc3RpbGwgdmFsaWQgaW4gdGhpcyBmcmFtZVxuICogLy8gYWZ0ZXIgYSBmcmFtZS4uLlxuICogY2MubG9nKG5vZGUuaXNWYWxpZCk7ICAgIC8vIGZhbHNlLCBkZXN0cm95ZWQgaW4gdGhlIGVuZCBvZiBsYXN0IGZyYW1lXG4gKi9cbmpzLmdldChwcm90b3R5cGUsICdpc1ZhbGlkJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWVkKTtcbn0sIHRydWUpO1xuXG5pZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICBqcy5nZXQocHJvdG90eXBlLCAnaXNSZWFsVmFsaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhKHRoaXMuX29iakZsYWdzICYgUmVhbERlc3Ryb3llZCk7XG4gICAgfSk7XG59XG5cbnZhciBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IG51bGw7XG5cbi8qKlxuICogISNlblxuICogRGVzdHJveSB0aGlzIE9iamVjdCwgYW5kIHJlbGVhc2UgYWxsIGl0cyBvd24gcmVmZXJlbmNlcyB0byBvdGhlciBvYmplY3RzLjxici8+XG4gKiBBY3R1YWwgb2JqZWN0IGRlc3RydWN0aW9uIHdpbGwgZGVsYXllZCB1bnRpbCBiZWZvcmUgcmVuZGVyaW5nLlxuICogRnJvbSB0aGUgbmV4dCBmcmFtZSwgdGhpcyBvYmplY3QgaXMgbm90IHVzYWJsZSBhbnkgbW9yZS5cbiAqIFlvdSBjYW4gdXNlIGNjLmlzVmFsaWQob2JqKSB0byBjaGVjayB3aGV0aGVyIHRoZSBvYmplY3QgaXMgZGVzdHJveWVkIGJlZm9yZSBhY2Nlc3NpbmcgaXQuXG4gKiAhI3poXG4gKiDplIDmr4Hor6Xlr7nosaHvvIzlubbph4rmlL7miYDmnInlroPlr7nlhbblroPlr7nosaHnmoTlvJXnlKjjgII8YnIvPlxuICog5a6e6ZmF6ZSA5q+B5pON5L2c5Lya5bu26L+f5Yiw5b2T5YmN5bin5riy5p+T5YmN5omn6KGM44CC5LuO5LiL5LiA5bin5byA5aeL77yM6K+l5a+56LGh5bCG5LiN5YaN5Y+v55So44CCXG4gKiDmgqjlj6/ku6XlnKjorr/pl67lr7nosaHkuYvliY3kvb/nlKggY2MuaXNWYWxpZChvYmopIOadpeajgOafpeWvueixoeaYr+WQpuW3suiiq+mUgOavgeOAglxuICogQG1ldGhvZCBkZXN0cm95XG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0IGlzIHRoZSBmaXJzdCB0aW1lIHRoZSBkZXN0cm95IGJlaW5nIGNhbGxlZFxuICogQGV4YW1wbGVcbiAqIG9iai5kZXN0cm95KCk7XG4gKi9cbnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCkge1xuICAgICAgICBjYy53YXJuSUQoNTAwMCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX29iakZsYWdzICYgVG9EZXN0cm95KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5fb2JqRmxhZ3MgfD0gVG9EZXN0cm95O1xuICAgIG9iamVjdHNUb0Rlc3Ryb3kucHVzaCh0aGlzKTtcblxuICAgIGlmIChDQ19FRElUT1IgJiYgZGVmZXJyZWREZXN0cm95VGltZXIgPT09IG51bGwgJiYgY2MuZW5naW5lICYmICEgY2MuZW5naW5lLl9pc1VwZGF0aW5nKSB7XG4gICAgICAgIC8vIGF1dG8gZGVzdHJveSBpbW1lZGlhdGUgaW4gZWRpdCBtb2RlXG4gICAgICAgIGRlZmVycmVkRGVzdHJveVRpbWVyID0gc2V0SW1tZWRpYXRlKGRlZmVycmVkRGVzdHJveSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgLypcbiAgICAgKiAhI2VuXG4gICAgICogSW4gZmFjdCwgT2JqZWN0J3MgXCJkZXN0cm95XCIgd2lsbCBub3QgdHJpZ2dlciB0aGUgZGVzdHJ1Y3Qgb3BlcmF0aW9uIGluIEZpcmViYWwgRWRpdG9yLlxuICAgICAqIFRoZSBkZXN0cnVjdCBvcGVyYXRpb24gd2lsbCBiZSBleGVjdXRlZCBieSBVbmRvIHN5c3RlbSBsYXRlci5cbiAgICAgKiAhI3poXG4gICAgICog5LqL5a6e5LiK77yM5a+56LGh55qEIOKAnGRlc3Ryb3nigJ0g5LiN5Lya5Zyo57yW6L6R5Zmo5Lit6Kem5Y+R5p6Q5p6E5pON5L2c77yMXG4gICAgICog5p6Q5p6E5pON5L2c5bCG5ZyoIFVuZG8g57O757uf5LitKirlu7blkI4qKuaJp+ihjOOAglxuICAgICAqIEBtZXRob2QgcmVhbERlc3Ryb3lJbkVkaXRvclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG90eXBlLnJlYWxEZXN0cm95SW5FZGl0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICggISh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCkgKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoNTAwMSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX29iakZsYWdzICYgUmVhbERlc3Ryb3llZCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDUwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Rlc3RydWN0KCk7XG4gICAgICAgIHRoaXMuX29iakZsYWdzIHw9IFJlYWxEZXN0cm95ZWQ7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZURlc3RydWN0IChvYmosIGN0b3IpIHtcbiAgICB2YXIgc2hvdWxkU2tpcElkID0gb2JqIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlIHx8IG9iaiBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudDtcbiAgICB2YXIgaWRUb1NraXAgPSBzaG91bGRTa2lwSWQgPyAnX2lkJyA6IG51bGw7XG5cbiAgICB2YXIga2V5LCBwcm9wc1RvUmVzZXQgPSB7fTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBpZFRvU2tpcCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2Ygb2JqW2tleV0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgICAgICBwcm9wc1RvUmVzZXRba2V5XSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNUb1Jlc2V0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBPdmVyd3JpdGUgcHJvcHNUb1Jlc2V0IGFjY29yZGluZyB0byBDbGFzc1xuICAgIGlmIChjYy5DbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XG4gICAgICAgIHZhciBhdHRycyA9IGNjLkNsYXNzLkF0dHIuZ2V0Q2xhc3NBdHRycyhjdG9yKTtcbiAgICAgICAgdmFyIHByb3BMaXN0ID0gY3Rvci5fX3Byb3BzX187XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGtleSA9IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIGF0dHJLZXkgPSBrZXkgKyBjYy5DbGFzcy5BdHRyLkRFTElNRVRFUiArICdkZWZhdWx0JztcbiAgICAgICAgICAgIGlmIChhdHRyS2V5IGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFNraXBJZCAmJiBrZXkgPT09ICdfaWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBhdHRyc1thdHRyS2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNUb1Jlc2V0W2tleV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1RvUmVzZXRba2V5XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzVG9SZXNldFtrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKENDX1NVUFBPUlRfSklUKSB7XG4gICAgICAgIC8vIGNvbXBpbGUgY29kZVxuICAgICAgICB2YXIgZnVuYyA9ICcnO1xuICAgICAgICBmb3IgKGtleSBpbiBwcm9wc1RvUmVzZXQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZW1lbnQ7XG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5JREVOVElGSUVSX1JFLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICdvLicgKyBrZXkgKyAnPSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSAnb1snICsgQ0NDbGFzcy5lc2NhcGVGb3JKUyhrZXkpICsgJ109JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWwgPSBwcm9wc1RvUmVzZXRba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWwgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gJ1wiXCInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuYyArPSAoc3RhdGVtZW50ICsgdmFsICsgJztcXG4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRnVuY3Rpb24oJ28nLCBmdW5jKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzVG9SZXNldCkge1xuICAgICAgICAgICAgICAgIG9ba2V5XSA9IHByb3BzVG9SZXNldFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuLyoqXG4gKiBDbGVhciBhbGwgcmVmZXJlbmNlcyBpbiB0aGUgaW5zdGFuY2UuXG4gKlxuICogTk9URTogdGhpcyBtZXRob2Qgd2lsbCBub3QgY2xlYXIgdGhlIGdldHRlciBvciBzZXR0ZXIgZnVuY3Rpb25zIHdoaWNoIGRlZmluZWQgaW4gdGhlIGluc3RhbmNlIG9mIENDT2JqZWN0LlxuICogICAgICAgWW91IGNhbiBvdmVycmlkZSB0aGUgX2Rlc3RydWN0IG1ldGhvZCBpZiB5b3UgbmVlZCwgZm9yIGV4YW1wbGU6XG4gKiAgICAgICBfZGVzdHJ1Y3Q6IGZ1bmN0aW9uICgpIHtcbiAqICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcykge1xuICogICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gKiAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB0aGlzW2tleV0pIHtcbiAqICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSAnJztcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAqICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG51bGw7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICogICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgfVxuICogICAgICAgfVxuICpcbiAqIEBtZXRob2QgX2Rlc3RydWN0XG4gKiBAcHJpdmF0ZVxuICovXG5wcm90b3R5cGUuX2Rlc3RydWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgZGVzdHJ1Y3QgPSBjdG9yLl9fZGVzdHJ1Y3RfXztcbiAgICBpZiAoIWRlc3RydWN0KSB7XG4gICAgICAgIGRlc3RydWN0ID0gY29tcGlsZURlc3RydWN0KHRoaXMsIGN0b3IpO1xuICAgICAgICBqcy52YWx1ZShjdG9yLCAnX19kZXN0cnVjdF9fJywgZGVzdHJ1Y3QsIHRydWUpO1xuICAgIH1cbiAgICBkZXN0cnVjdCh0aGlzKTtcbn07XG5cbi8qKlxuICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGJlaW5nIGRlc3Ryb3llZC5cbiAqIEBtZXRob2QgX29uUHJlRGVzdHJveVxuICogQHByaXZhdGVcbiAqL1xucHJvdG90eXBlLl9vblByZURlc3Ryb3kgPSBudWxsO1xuXG5wcm90b3R5cGUuX2Rlc3Ryb3lJbW1lZGlhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWVkKSB7XG4gICAgICAgIGNjLmVycm9ySUQoNTAwMCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZW5naW5lIGludGVybmFsIGNhbGxiYWNrXG4gICAgaWYgKHRoaXMuX29uUHJlRGVzdHJveSkge1xuICAgICAgICB0aGlzLl9vblByZURlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBpZiAoKENDX1RFU1QgPyAoLyogbWFrZSBDQ19FRElUT1IgbW9ja2FibGUqLyBGdW5jdGlvbigncmV0dXJuICFDQ19FRElUT1InKSkoKSA6ICFDQ19FRElUT1IpIHx8IGNjLmVuZ2luZS5faXNQbGF5aW5nKSB7XG4gICAgICAgIHRoaXMuX2Rlc3RydWN0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb2JqRmxhZ3MgfD0gRGVzdHJveWVkO1xufTtcblxuaWYgKENDX0VESVRPUikge1xuICAgIC8qKlxuICAgICAqIFRoZSBjdXN0b21pemVkIHNlcmlhbGl6YXRpb24gZm9yIHRoaXMgb2JqZWN0LiAoRWRpdG9yIE9ubHkpXG4gICAgICogQG1ldGhvZCBfc2VyaWFsaXplXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBleHBvcnRpbmdcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRoZSBzZXJpYWxpemVkIGpzb24gZGF0YSBvYmplY3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvdHlwZS5fc2VyaWFsaXplID0gbnVsbDtcbn1cblxuLyoqXG4gKiBJbml0IHRoaXMgb2JqZWN0IGZyb20gdGhlIGN1c3RvbSBzZXJpYWxpemVkIGRhdGEuXG4gKiBAbWV0aG9kIF9kZXNlcmlhbGl6ZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSB0aGUgc2VyaWFsaXplZCBqc29uIGRhdGFcbiAqIEBwYXJhbSB7X0Rlc2VyaWFsaXplcn0gY3R4XG4gKiBAcHJpdmF0ZVxuICovXG5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gbnVsbDtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgb2JqZWN0IGlzIG5vbi1uaWwgYW5kIG5vdCB5ZXQgZGVzdHJveWVkLjxicj5cbiAqIFdoZW4gYW4gb2JqZWN0J3MgYGRlc3Ryb3lgIGlzIGNhbGxlZCwgaXQgaXMgYWN0dWFsbHkgZGVzdHJveWVkIGFmdGVyIHRoZSBlbmQgb2YgdGhpcyBmcmFtZS5cbiAqIFNvIGBpc1ZhbGlkYCB3aWxsIHJldHVybiBmYWxzZSBmcm9tIHRoZSBuZXh0IGZyYW1lLCB3aGlsZSBgaXNWYWxpZGAgaW4gdGhlIGN1cnJlbnQgZnJhbWUgd2lsbCBzdGlsbCBiZSB0cnVlLlxuICogSWYgeW91IHdhbnQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGN1cnJlbnQgZnJhbWUgaGFzIGNhbGxlZCBgZGVzdHJveWAsIHVzZSBgY2MuaXNWYWxpZChvYmosIHRydWUpYCxcbiAqIGJ1dCB0aGlzIGlzIG9mdGVuIGNhdXNlZCBieSBhIHBhcnRpY3VsYXIgbG9naWNhbCByZXF1aXJlbWVudHMsIHdoaWNoIGlzIG5vdCBub3JtYWxseSByZXF1aXJlZC5cbiAqXG4gKiAhI3poXG4gKiDmo4Dmn6Xor6Xlr7nosaHmmK/lkKbkuI3kuLogbnVsbCDlubbkuJTlsJrmnKrplIDmr4HjgII8YnI+XG4gKiDlvZPkuIDkuKrlr7nosaHnmoQgYGRlc3Ryb3lgIOiwg+eUqOS7peWQju+8jOS8muWcqOi/meS4gOW4p+e7k+adn+WQjuaJjeecn+ato+mUgOavgeOAguWboOatpOS7juS4i+S4gOW4p+W8gOWniyBgaXNWYWxpZGAg5bCx5Lya6L+U5ZueIGZhbHNl77yM6ICM5b2T5YmN5bin5YaFIGBpc1ZhbGlkYCDku43nhLbkvJrmmK8gdHJ1ZeOAguWmguaenOW4jOacm+WIpOaWreW9k+WJjeW4p+aYr+WQpuiwg+eUqOi/hyBgZGVzdHJveWDvvIzor7fkvb/nlKggYGNjLmlzVmFsaWQob2JqLCB0cnVlKWDvvIzkuI3ov4fov5nlvoDlvoDmmK/nibnmrornmoTkuJrliqHpnIDmsYLlvJXotbfnmoTvvIzpgJrluLjmg4XlhrXkuIvkuI3pnIDopoHov5nmoLfjgIJcbiAqXG4gKiBAbWV0aG9kIGlzVmFsaWRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHBhcmFtIHtCb29sZWFufSBbc3RyaWN0TW9kZT1mYWxzZV0gLSBJZiB0cnVlLCBPYmplY3QgY2FsbGVkIGRlc3Ryb3koKSBpbiB0aGlzIGZyYW1lIHdpbGwgYWxzbyB0cmVhdGVkIGFzIGludmFsaWQuXG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGlzIHZhbGlkXG4gKiBAZXhhbXBsZVxuICogdmFyIG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuICogY2MubG9nKGNjLmlzVmFsaWQobm9kZSkpOyAgICAvLyB0cnVlXG4gKiBub2RlLmRlc3Ryb3koKTtcbiAqIGNjLmxvZyhjYy5pc1ZhbGlkKG5vZGUpKTsgICAgLy8gdHJ1ZSwgc3RpbGwgdmFsaWQgaW4gdGhpcyBmcmFtZVxuICogLy8gYWZ0ZXIgYSBmcmFtZS4uLlxuICogY2MubG9nKGNjLmlzVmFsaWQobm9kZSkpOyAgICAvLyBmYWxzZSwgZGVzdHJveWVkIGluIHRoZSBlbmQgb2YgbGFzdCBmcmFtZVxuICovXG5jYy5pc1ZhbGlkID0gZnVuY3Rpb24gKHZhbHVlLCBzdHJpY3RNb2RlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuICEhdmFsdWUgJiYgISh2YWx1ZS5fb2JqRmxhZ3MgJiAoc3RyaWN0TW9kZSA/IChEZXN0cm95ZWQgfCBUb0Rlc3Ryb3kpIDogRGVzdHJveWVkKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJztcbiAgICB9XG59O1xuXG5pZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICBqcy52YWx1ZShDQ09iamVjdCwgJ193aWxsRGVzdHJveScsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuICEob2JqLl9vYmpGbGFncyAmIERlc3Ryb3llZCkgJiYgKG9iai5fb2JqRmxhZ3MgJiBUb0Rlc3Ryb3kpID4gMDtcbiAgICB9KTtcbiAgICBqcy52YWx1ZShDQ09iamVjdCwgJ19jYW5jZWxEZXN0cm95JywgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBvYmouX29iakZsYWdzICY9IH5Ub0Rlc3Ryb3k7XG4gICAgICAgIGpzLmFycmF5LmZhc3RSZW1vdmUob2JqZWN0c1RvRGVzdHJveSwgb2JqKTtcbiAgICB9KTtcbn1cblxuY2MuT2JqZWN0ID0gbW9kdWxlLmV4cG9ydHMgPSBDQ09iamVjdDtcbiJdfQ==