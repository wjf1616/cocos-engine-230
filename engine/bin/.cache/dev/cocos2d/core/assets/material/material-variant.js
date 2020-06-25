
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/material-variant.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CCMaterial = _interopRequireDefault(require("./CCMaterial"));

var _effectVariant = _interopRequireDefault(require("./effect-variant"));

var _materialPool = _interopRequireDefault(require("./material-pool"));

var _dec, _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ccclass = cc._decorator.ccclass;
/**
 * !#en
 * Material Variant is an extension of the Material Asset.
 * Changes to Material Variant do not affect other Material Variant or Material Asset, 
 * and changes to Material Asset are synchronized to the Material Variant.
 * However, when a Material Variant had already modifies a state, the Material Asset state is not synchronized to the Material Variant.
 * !#zh 
 * 材质变体是材质资源的一个延伸。
 * 材质变体的修改不会影响到其他的材质变体或者材质资源，而材质资源的修改会同步体现到材质变体上，
 * 但是当材质变体对一个状态修改后，材质资源再对这个状态修改是不会同步到材质变体上的。
 * @class MaterialVariant
 * @extends Material
 */

var MaterialVariant = (_dec = ccclass('cc.MaterialVariant'), _dec(_class = (_temp =
/*#__PURE__*/
function (_Material) {
  _inheritsLoose(MaterialVariant, _Material);

  /**
   * @method createWithBuiltin
   * @param {Material.BUILTIN_NAME} materialName 
   * @param {RenderComponent} owner 
   * @typescript
   * static createWithBuiltin (materialName, owner: cc.RenderComponent): MaterialVariant | null
   */
  MaterialVariant.createWithBuiltin = function createWithBuiltin(materialName, owner) {
    return MaterialVariant.create(_CCMaterial["default"].getBuiltinMaterial(materialName), owner);
  }
  /**
   * @method create
   * @param {Material} material 
   * @param {RenderComponent} owner 
   * @typescript
   * static create (material: Material, owner: cc.RenderComponent): MaterialVariant | null
   */
  ;

  MaterialVariant.create = function create(material, owner) {
    if (!material) return null;
    return _materialPool["default"].get(material, owner);
  };

  _createClass(MaterialVariant, [{
    key: "owner",
    get: function get() {
      return this._owner;
    }
  }, {
    key: "material",
    get: function get() {
      return this._material;
    }
  }]);

  function MaterialVariant(material) {
    var _this;

    _this = _Material.call(this) || this;
    _this._owner = null;
    _this._material = null;

    _this.init(material);

    return _this;
  }

  var _proto = MaterialVariant.prototype;

  _proto.init = function init(material) {
    this._effect = new _effectVariant["default"](material.effect);
    this._effectAsset = material._effectAsset;
    this._material = material;
  };

  return MaterialVariant;
}(_CCMaterial["default"]), _temp)) || _class);
exports["default"] = MaterialVariant;
cc.MaterialVariant = MaterialVariant;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFsLXZhcmlhbnQudHMiXSwibmFtZXMiOlsiY2NjbGFzcyIsImNjIiwiX2RlY29yYXRvciIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZVdpdGhCdWlsdGluIiwibWF0ZXJpYWxOYW1lIiwib3duZXIiLCJjcmVhdGUiLCJNYXRlcmlhbCIsImdldEJ1aWx0aW5NYXRlcmlhbCIsIm1hdGVyaWFsIiwiTWF0ZXJpYWxQb29sIiwiZ2V0IiwiX293bmVyIiwiX21hdGVyaWFsIiwiaW5pdCIsIl9lZmZlY3QiLCJFZmZlY3RWYXJpYW50IiwiZWZmZWN0IiwiX2VmZmVjdEFzc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxVQUFhQyxFQUFFLENBQUNDLFdBQWhCRjtBQUVOOzs7Ozs7Ozs7Ozs7OztJQWNxQkcsMEJBRHBCSCxPQUFPLENBQUMsb0JBQUQ7Ozs7O0FBS0o7Ozs7Ozs7a0JBT09JLG9CQUFQLDJCQUEwQkMsWUFBMUIsRUFBZ0RDLEtBQWhELEVBQW1HO0FBQy9GLFdBQU9ILGVBQWUsQ0FBQ0ksTUFBaEIsQ0FBdUJDLHVCQUFTQyxrQkFBVCxDQUE0QkosWUFBNUIsQ0FBdkIsRUFBa0VDLEtBQWxFLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7a0JBT09DLFNBQVAsZ0JBQWVHLFFBQWYsRUFBbUNKLEtBQW5DLEVBQXNGO0FBQ2xGLFFBQUksQ0FBQ0ksUUFBTCxFQUFlLE9BQU8sSUFBUDtBQUNmLFdBQU9DLHlCQUFhQyxHQUFiLENBQWlCRixRQUFqQixFQUEyQkosS0FBM0IsQ0FBUDtBQUNIOzs7O3dCQUVZO0FBQ1QsYUFBTyxLQUFLTyxNQUFaO0FBQ0g7Ozt3QkFFZTtBQUNaLGFBQU8sS0FBS0MsU0FBWjtBQUNIOzs7QUFFRCwyQkFBYUosUUFBYixFQUFpQztBQUFBOztBQUM3QjtBQUQ2QixVQWxDakNHLE1Ba0NpQyxHQWxDSixJQWtDSTtBQUFBLFVBakNqQ0MsU0FpQ2lDLEdBakNYLElBaUNXOztBQUU3QixVQUFLQyxJQUFMLENBQVVMLFFBQVY7O0FBRjZCO0FBR2hDOzs7O1NBRURLLE9BQUEsY0FBTUwsUUFBTixFQUFnQjtBQUNaLFNBQUtNLE9BQUwsR0FBZSxJQUFJQyx5QkFBSixDQUFrQlAsUUFBUSxDQUFDUSxNQUEzQixDQUFmO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQlQsUUFBUSxDQUFDUyxZQUE3QjtBQUNBLFNBQUtMLFNBQUwsR0FBaUJKLFFBQWpCO0FBQ0g7OztFQTVDd0NGOztBQStDN0NQLEVBQUUsQ0FBQ0UsZUFBSCxHQUFxQkEsZUFBckIiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNYXRlcmlhbCBmcm9tICcuL0NDTWF0ZXJpYWwnO1xuaW1wb3J0IEVmZmVjdFZhcmlhbnQgZnJvbSAnLi9lZmZlY3QtdmFyaWFudCc7XG5pbXBvcnQgTWF0ZXJpYWxQb29sIGZyb20gJy4vbWF0ZXJpYWwtcG9vbCc7XG5cbmxldCB7IGNjY2xhc3MsIH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKipcbiAqICEjZW5cbiAqIE1hdGVyaWFsIFZhcmlhbnQgaXMgYW4gZXh0ZW5zaW9uIG9mIHRoZSBNYXRlcmlhbCBBc3NldC5cbiAqIENoYW5nZXMgdG8gTWF0ZXJpYWwgVmFyaWFudCBkbyBub3QgYWZmZWN0IG90aGVyIE1hdGVyaWFsIFZhcmlhbnQgb3IgTWF0ZXJpYWwgQXNzZXQsIFxuICogYW5kIGNoYW5nZXMgdG8gTWF0ZXJpYWwgQXNzZXQgYXJlIHN5bmNocm9uaXplZCB0byB0aGUgTWF0ZXJpYWwgVmFyaWFudC5cbiAqIEhvd2V2ZXIsIHdoZW4gYSBNYXRlcmlhbCBWYXJpYW50IGhhZCBhbHJlYWR5IG1vZGlmaWVzIGEgc3RhdGUsIHRoZSBNYXRlcmlhbCBBc3NldCBzdGF0ZSBpcyBub3Qgc3luY2hyb25pemVkIHRvIHRoZSBNYXRlcmlhbCBWYXJpYW50LlxuICogISN6aCBcbiAqIOadkOi0qOWPmOS9k+aYr+adkOi0qOi1hOa6kOeahOS4gOS4quW7tuS8uOOAglxuICog5p2Q6LSo5Y+Y5L2T55qE5L+u5pS55LiN5Lya5b2x5ZON5Yiw5YW25LuW55qE5p2Q6LSo5Y+Y5L2T5oiW6ICF5p2Q6LSo6LWE5rqQ77yM6ICM5p2Q6LSo6LWE5rqQ55qE5L+u5pS55Lya5ZCM5q2l5L2T546w5Yiw5p2Q6LSo5Y+Y5L2T5LiK77yMXG4gKiDkvYbmmK/lvZPmnZDotKjlj5jkvZPlr7nkuIDkuKrnirbmgIHkv67mlLnlkI7vvIzmnZDotKjotYTmupDlho3lr7nov5nkuKrnirbmgIHkv67mlLnmmK/kuI3kvJrlkIzmraXliLDmnZDotKjlj5jkvZPkuIrnmoTjgIJcbiAqIEBjbGFzcyBNYXRlcmlhbFZhcmlhbnRcbiAqIEBleHRlbmRzIE1hdGVyaWFsXG4gKi9cbkBjY2NsYXNzKCdjYy5NYXRlcmlhbFZhcmlhbnQnKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0ZXJpYWxWYXJpYW50IGV4dGVuZHMgTWF0ZXJpYWwge1xuICAgIF9vd25lcjogY2MuUmVuZGVyQ29tcG9uZW50ID0gbnVsbDtcbiAgICBfbWF0ZXJpYWw6IE1hdGVyaWFsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY3JlYXRlV2l0aEJ1aWx0aW5cbiAgICAgKiBAcGFyYW0ge01hdGVyaWFsLkJVSUxUSU5fTkFNRX0gbWF0ZXJpYWxOYW1lIFxuICAgICAqIEBwYXJhbSB7UmVuZGVyQ29tcG9uZW50fSBvd25lciBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjcmVhdGVXaXRoQnVpbHRpbiAobWF0ZXJpYWxOYW1lLCBvd25lcjogY2MuUmVuZGVyQ29tcG9uZW50KTogTWF0ZXJpYWxWYXJpYW50IHwgbnVsbFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVXaXRoQnVpbHRpbiAobWF0ZXJpYWxOYW1lOiBzdHJpbmcsIG93bmVyOiBjYy5SZW5kZXJDb21wb25lbnQpOiBNYXRlcmlhbFZhcmlhbnQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIE1hdGVyaWFsVmFyaWFudC5jcmVhdGUoTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKG1hdGVyaWFsTmFtZSksIG93bmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgICAqIEBwYXJhbSB7TWF0ZXJpYWx9IG1hdGVyaWFsIFxuICAgICAqIEBwYXJhbSB7UmVuZGVyQ29tcG9uZW50fSBvd25lciBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjcmVhdGUgKG1hdGVyaWFsOiBNYXRlcmlhbCwgb3duZXI6IGNjLlJlbmRlckNvbXBvbmVudCk6IE1hdGVyaWFsVmFyaWFudCB8IG51bGxcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlIChtYXRlcmlhbDogTWF0ZXJpYWwsIG93bmVyOiBjYy5SZW5kZXJDb21wb25lbnQpOiBNYXRlcmlhbFZhcmlhbnQgfCBudWxsIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBNYXRlcmlhbFBvb2wuZ2V0KG1hdGVyaWFsLCBvd25lcik7XG4gICAgfVxuXG4gICAgZ2V0IG93bmVyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xuICAgIH1cblxuICAgIGdldCBtYXRlcmlhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAobWF0ZXJpYWw6IE1hdGVyaWFsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdChtYXRlcmlhbCk7XG4gICAgfVxuXG4gICAgaW5pdCAobWF0ZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0ID0gbmV3IEVmZmVjdFZhcmlhbnQobWF0ZXJpYWwuZWZmZWN0KTtcbiAgICAgICAgdGhpcy5fZWZmZWN0QXNzZXQgPSBtYXRlcmlhbC5fZWZmZWN0QXNzZXQ7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgfVxufVxuXG5jYy5NYXRlcmlhbFZhcmlhbnQgPSBNYXRlcmlhbFZhcmlhbnQ7XG4iXX0=