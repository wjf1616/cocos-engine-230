
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/assets/physics-material.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.PhysicsMaterial = void 0;

var _dec, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var _cc$_decorator = cc._decorator,
    ccclass = _cc$_decorator.ccclass,
    property = _cc$_decorator.property;
var fastRemove = cc.js.array.fastRemove;
var equals = cc.math.equals;
/**
 * Physics material.
 * @class PhysicsMaterial
 * @extends Asset
 */

var PhysicsMaterial = (_dec = ccclass('cc.PhysicsMaterial'), _dec(_class = (_class2 = (_temp = _class3 =
/*#__PURE__*/
function (_cc$Asset) {
  _inheritsLoose(PhysicsMaterial, _cc$Asset);

  _createClass(PhysicsMaterial, [{
    key: "friction",

    /**
     * Friction for this material.
     * If non-negative, it will be used instead of the friction given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
     * @property {number} friction
     */
    get: function get() {
      return this._friction;
    },
    set: function set(value) {
      if (!equals(this._friction, value)) {
        this._friction = value;
        this.emit('physics_material_update');
      }
    }
    /**
     * Restitution for this material.
     * If non-negative, it will be used instead of the restitution given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used
     * @property {number} restitution
     */

  }, {
    key: "restitution",
    get: function get() {
      return this._restitution;
    },
    set: function set(value) {
      if (!equals(this._restitution, value)) {
        this._restitution = value;
        this.emit('physics_material_update');
      }
    }
  }]);

  function PhysicsMaterial() {
    var _this;

    _this = _cc$Asset.call(this) || this;

    _initializerDefineProperty(_this, "_friction", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_restitution", _descriptor2, _assertThisInitialized(_this));

    cc.EventTarget.call(_assertThisInitialized(_this));
    PhysicsMaterial.allMaterials.push(_assertThisInitialized(_this));

    if (_this._uuid == '') {
      _this._uuid = 'pm_' + PhysicsMaterial._idCounter++;
    }

    return _this;
  }

  var _proto = PhysicsMaterial.prototype;

  _proto.clone = function clone() {
    var c = new PhysicsMaterial();
    c._friction = this._friction;
    c._restitution = this._restitution;
    return c;
  };

  _proto.destroy = function destroy() {
    if (_cc$Asset.prototype.destroy.call(this)) {
      fastRemove(PhysicsMaterial.allMaterials, this);
      return true;
    } else {
      return false;
    }
  };

  return PhysicsMaterial;
}(cc.Asset), _class3.allMaterials = [], _class3._idCounter = 0, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_friction", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_restitution", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "friction", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "friction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "restitution", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "restitution"), _class2.prototype)), _class2)) || _class);
exports.PhysicsMaterial = PhysicsMaterial;
cc.js.mixin(PhysicsMaterial.prototype, cc.EventTarget.prototype);
cc.PhysicsMaterial = PhysicsMaterial;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBoeXNpY3MtbWF0ZXJpYWwudHMiXSwibmFtZXMiOlsiY2MiLCJfZGVjb3JhdG9yIiwiY2NjbGFzcyIsInByb3BlcnR5IiwiZmFzdFJlbW92ZSIsImpzIiwiYXJyYXkiLCJlcXVhbHMiLCJtYXRoIiwiUGh5c2ljc01hdGVyaWFsIiwiX2ZyaWN0aW9uIiwidmFsdWUiLCJlbWl0IiwiX3Jlc3RpdHV0aW9uIiwiRXZlbnRUYXJnZXQiLCJjYWxsIiwiYWxsTWF0ZXJpYWxzIiwicHVzaCIsIl91dWlkIiwiX2lkQ291bnRlciIsImNsb25lIiwiYyIsImRlc3Ryb3kiLCJBc3NldCIsIm1peGluIiwicHJvdG90eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBeUI0QkEsRUFBRSxDQUFDQztJQUF4QkMseUJBQUFBO0lBQVNDLDBCQUFBQTtBQUNoQixJQUFNQyxVQUFVLEdBQUdKLEVBQUUsQ0FBQ0ssRUFBSCxDQUFNQyxLQUFOLENBQVlGLFVBQS9CO0FBQ0EsSUFBTUcsTUFBTSxHQUFHUCxFQUFFLENBQUNRLElBQUgsQ0FBUUQsTUFBdkI7QUFFQTs7Ozs7O0lBTWFFLDBCQURaUCxPQUFPLENBQUMsb0JBQUQ7Ozs7Ozs7O0FBYUo7Ozs7Ozt3QkFPZ0I7QUFDWixhQUFPLEtBQUtRLFNBQVo7QUFDSDtzQkFFYUMsT0FBTztBQUNqQixVQUFJLENBQUNKLE1BQU0sQ0FBQyxLQUFLRyxTQUFOLEVBQWlCQyxLQUFqQixDQUFYLEVBQW9DO0FBQ2hDLGFBQUtELFNBQUwsR0FBaUJDLEtBQWpCO0FBQ0EsYUFBS0MsSUFBTCxDQUFVLHlCQUFWO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7d0JBT21CO0FBQ2YsYUFBTyxLQUFLQyxZQUFaO0FBQ0g7c0JBRWdCRixPQUFPO0FBQ3BCLFVBQUksQ0FBQ0osTUFBTSxDQUFDLEtBQUtNLFlBQU4sRUFBb0JGLEtBQXBCLENBQVgsRUFBdUM7QUFDbkMsYUFBS0UsWUFBTCxHQUFvQkYsS0FBcEI7QUFDQSxhQUFLQyxJQUFMLENBQVUseUJBQVY7QUFDSDtBQUNKOzs7QUFFRCw2QkFBZTtBQUFBOztBQUNYOztBQURXOztBQUFBOztBQUVYWixJQUFBQSxFQUFFLENBQUNjLFdBQUgsQ0FBZUMsSUFBZjtBQUNBTixJQUFBQSxlQUFlLENBQUNPLFlBQWhCLENBQTZCQyxJQUE3Qjs7QUFDQSxRQUFJLE1BQUtDLEtBQUwsSUFBYyxFQUFsQixFQUFzQjtBQUNsQixZQUFLQSxLQUFMLEdBQWEsUUFBUVQsZUFBZSxDQUFDVSxVQUFoQixFQUFyQjtBQUNIOztBQU5VO0FBT2Q7Ozs7U0FFTUMsUUFBUCxpQkFBZ0I7QUFDWixRQUFJQyxDQUFDLEdBQUcsSUFBSVosZUFBSixFQUFSO0FBQ0FZLElBQUFBLENBQUMsQ0FBQ1gsU0FBRixHQUFjLEtBQUtBLFNBQW5CO0FBQ0FXLElBQUFBLENBQUMsQ0FBQ1IsWUFBRixHQUFpQixLQUFLQSxZQUF0QjtBQUNBLFdBQU9RLENBQVA7QUFDSDs7U0FFTUMsVUFBUCxtQkFBMkI7QUFDdkIsNEJBQVVBLE9BQVYsYUFBcUI7QUFDakJsQixNQUFBQSxVQUFVLENBQUNLLGVBQWUsQ0FBQ08sWUFBakIsRUFBK0IsSUFBL0IsQ0FBVjtBQUNBLGFBQU8sSUFBUDtBQUNILEtBSEQsTUFHTztBQUNILGFBQU8sS0FBUDtBQUNIO0FBQ0o7OztFQXZFZ0NoQixFQUFFLENBQUN1QixnQkFFdEJQLGVBQWtDLFlBRWpDRyxhQUFxQixxRkFFbkNoQjs7Ozs7V0FDbUI7O2lGQUVuQkE7Ozs7O1dBQ3NCOzs4REFRdEJBLDRKQWtCQUE7O0FBdUNMSCxFQUFFLENBQUNLLEVBQUgsQ0FBTW1CLEtBQU4sQ0FBWWYsZUFBZSxDQUFDZ0IsU0FBNUIsRUFBdUN6QixFQUFFLENBQUNjLFdBQUgsQ0FBZVcsU0FBdEQ7QUFDQXpCLEVBQUUsQ0FBQ1MsZUFBSCxHQUFxQkEsZUFBckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5jb25zdCBmYXN0UmVtb3ZlID0gY2MuanMuYXJyYXkuZmFzdFJlbW92ZTtcbmNvbnN0IGVxdWFscyA9IGNjLm1hdGguZXF1YWxzO1xuXG4vKipcbiAqIFBoeXNpY3MgbWF0ZXJpYWwuXG4gKiBAY2xhc3MgUGh5c2ljc01hdGVyaWFsXG4gKiBAZXh0ZW5kcyBBc3NldFxuICovXG5AY2NjbGFzcygnY2MuUGh5c2ljc01hdGVyaWFsJylcbmV4cG9ydCBjbGFzcyBQaHlzaWNzTWF0ZXJpYWwgZXh0ZW5kcyBjYy5Bc3NldCB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGFsbE1hdGVyaWFsczogUGh5c2ljc01hdGVyaWFsW10gPSBbXTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9pZENvdW50ZXI6IG51bWJlciA9IDA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9mcmljdGlvbiA9IDAuMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX3Jlc3RpdHV0aW9uID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogRnJpY3Rpb24gZm9yIHRoaXMgbWF0ZXJpYWwuXG4gICAgICogSWYgbm9uLW5lZ2F0aXZlLCBpdCB3aWxsIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgZnJpY3Rpb24gZ2l2ZW4gYnkgQ29udGFjdE1hdGVyaWFscy5cbiAgICAgKiBJZiB0aGVyZSdzIG5vIG1hdGNoaW5nIENvbnRhY3RNYXRlcmlhbCwgdGhlIHZhbHVlIGZyb20gLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwgaW4gdGhlIFdvcmxkIHdpbGwgYmUgdXNlZC5cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gZnJpY3Rpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgZnJpY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJpY3Rpb247XG4gICAgfVxuXG4gICAgc2V0IGZyaWN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAoIWVxdWFscyh0aGlzLl9mcmljdGlvbiwgdmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9mcmljdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdGl0dXRpb24gZm9yIHRoaXMgbWF0ZXJpYWwuXG4gICAgICogSWYgbm9uLW5lZ2F0aXZlLCBpdCB3aWxsIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgcmVzdGl0dXRpb24gZ2l2ZW4gYnkgQ29udGFjdE1hdGVyaWFscy5cbiAgICAgKiBJZiB0aGVyZSdzIG5vIG1hdGNoaW5nIENvbnRhY3RNYXRlcmlhbCwgdGhlIHZhbHVlIGZyb20gLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwgaW4gdGhlIFdvcmxkIHdpbGwgYmUgdXNlZFxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZXN0aXR1dGlvblxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCByZXN0aXR1dGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0aXR1dGlvbjtcbiAgICB9XG5cbiAgICBzZXQgcmVzdGl0dXRpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICghZXF1YWxzKHRoaXMuX3Jlc3RpdHV0aW9uLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc3RpdHV0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNjLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyk7XG4gICAgICAgIFBoeXNpY3NNYXRlcmlhbC5hbGxNYXRlcmlhbHMucHVzaCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuX3V1aWQgPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuX3V1aWQgPSAncG1fJyArIFBoeXNpY3NNYXRlcmlhbC5faWRDb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xvbmUgKCkge1xuICAgICAgICBsZXQgYyA9IG5ldyBQaHlzaWNzTWF0ZXJpYWwoKTtcbiAgICAgICAgYy5fZnJpY3Rpb24gPSB0aGlzLl9mcmljdGlvbjtcbiAgICAgICAgYy5fcmVzdGl0dXRpb24gPSB0aGlzLl9yZXN0aXR1dGlvbjtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3kgKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoc3VwZXIuZGVzdHJveSgpKSB7XG4gICAgICAgICAgICBmYXN0UmVtb3ZlKFBoeXNpY3NNYXRlcmlhbC5hbGxNYXRlcmlhbHMsIHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuY2MuanMubWl4aW4oUGh5c2ljc01hdGVyaWFsLnByb3RvdHlwZSwgY2MuRXZlbnRUYXJnZXQucHJvdG90eXBlKTtcbmNjLlBoeXNpY3NNYXRlcmlhbCA9IFBoeXNpY3NNYXRlcmlhbDsiXX0=