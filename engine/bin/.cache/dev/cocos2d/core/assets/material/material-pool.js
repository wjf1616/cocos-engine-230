
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/material-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _utils = _interopRequireDefault(require("./utils"));

var _pool = _interopRequireDefault(require("../../utils/pool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * {
 *   effectUuid: {
 *     defineSerializeKey: []
 *   }
 * }
 */
var MaterialPool =
/*#__PURE__*/
function (_Pool) {
  _inheritsLoose(MaterialPool, _Pool);

  function MaterialPool() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Pool.call.apply(_Pool, [this].concat(args)) || this;
    _this.enabled = false;
    _this._pool = {};
    return _this;
  }

  var _proto = MaterialPool.prototype;

  _proto.get = function get(exampleMat, renderComponent) {
    var pool = this._pool;

    if (exampleMat instanceof cc.MaterialVariant) {
      if (exampleMat._owner) {
        if (exampleMat._owner === renderComponent) {
          return exampleMat;
        } else {
          exampleMat = exampleMat.material;
        }
      } else {
        exampleMat._owner = renderComponent;
        return exampleMat;
      }
    }

    var instance;

    if (this.enabled) {
      var uuid = exampleMat.effectAsset._uuid;

      if (pool[uuid]) {
        var key = _utils["default"].serializeDefines(exampleMat._effect._defines) + _utils["default"].serializeTechniques(exampleMat._effect._techniques);

        instance = pool[uuid][key] && pool[uuid][key].pop();
      }
    }

    if (!instance) {
      instance = new cc.MaterialVariant(exampleMat);
      instance._name = exampleMat._name + ' (Instance)';
      instance._uuid = exampleMat._uuid;
    } else {
      this.count--;
    }

    instance._owner = renderComponent;
    return instance;
  };

  _proto.put = function put(mat) {
    if (!this.enabled || !mat._owner) {
      return;
    }

    var pool = this._pool;
    var uuid = mat.effectAsset._uuid;

    if (!pool[uuid]) {
      pool[uuid] = {};
    }

    var key = _utils["default"].serializeDefines(mat._effect._defines) + _utils["default"].serializeTechniques(mat._effect._techniques);

    if (!pool[uuid][key]) {
      pool[uuid][key] = [];
    }

    if (this.count > this.maxSize) return;

    this._clean(mat);

    pool[uuid][key].push(mat);
    this.count++;
  };

  _proto.clear = function clear() {
    this._pool = {};
    this.count = 0;
  };

  _proto._clean = function _clean(mat) {
    mat._owner = null;
  };

  return MaterialPool;
}(_pool["default"]);

var materialPool = new MaterialPool();

_pool["default"].register('material', materialPool);

var _default = materialPool;
exports["default"] = _default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFsLXBvb2wuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxQb29sIiwiZW5hYmxlZCIsIl9wb29sIiwiZ2V0IiwiZXhhbXBsZU1hdCIsInJlbmRlckNvbXBvbmVudCIsInBvb2wiLCJjYyIsIk1hdGVyaWFsVmFyaWFudCIsIl9vd25lciIsIm1hdGVyaWFsIiwiaW5zdGFuY2UiLCJ1dWlkIiwiZWZmZWN0QXNzZXQiLCJfdXVpZCIsImtleSIsInV0aWxzIiwic2VyaWFsaXplRGVmaW5lcyIsIl9lZmZlY3QiLCJfZGVmaW5lcyIsInNlcmlhbGl6ZVRlY2huaXF1ZXMiLCJfdGVjaG5pcXVlcyIsInBvcCIsIl9uYW1lIiwiY291bnQiLCJwdXQiLCJtYXQiLCJtYXhTaXplIiwiX2NsZWFuIiwicHVzaCIsImNsZWFyIiwiUG9vbCIsIm1hdGVyaWFsUG9vbCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7O0lBT01BOzs7Ozs7Ozs7Ozs7O1VBRUZDLFVBQVU7VUFFVkMsUUFBUTs7Ozs7O1NBRVJDLE1BQUEsYUFBS0MsVUFBTCxFQUFpQkMsZUFBakIsRUFBa0M7QUFDOUIsUUFBSUMsSUFBSSxHQUFHLEtBQUtKLEtBQWhCOztBQUVBLFFBQUlFLFVBQVUsWUFBWUcsRUFBRSxDQUFDQyxlQUE3QixFQUE4QztBQUMxQyxVQUFJSixVQUFVLENBQUNLLE1BQWYsRUFBdUI7QUFDbkIsWUFBSUwsVUFBVSxDQUFDSyxNQUFYLEtBQXNCSixlQUExQixFQUEyQztBQUN2QyxpQkFBT0QsVUFBUDtBQUNILFNBRkQsTUFHSztBQUNEQSxVQUFBQSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ00sUUFBeEI7QUFDSDtBQUNKLE9BUEQsTUFRSztBQUNETixRQUFBQSxVQUFVLENBQUNLLE1BQVgsR0FBb0JKLGVBQXBCO0FBQ0EsZUFBT0QsVUFBUDtBQUNIO0FBQ0o7O0FBRUQsUUFBSU8sUUFBSjs7QUFDQSxRQUFJLEtBQUtWLE9BQVQsRUFBa0I7QUFDZCxVQUFJVyxJQUFJLEdBQUdSLFVBQVUsQ0FBQ1MsV0FBWCxDQUF1QkMsS0FBbEM7O0FBQ0EsVUFBSVIsSUFBSSxDQUFDTSxJQUFELENBQVIsRUFBZ0I7QUFDWixZQUFJRyxHQUFHLEdBQ0hDLGtCQUFNQyxnQkFBTixDQUF1QmIsVUFBVSxDQUFDYyxPQUFYLENBQW1CQyxRQUExQyxJQUNBSCxrQkFBTUksbUJBQU4sQ0FBMEJoQixVQUFVLENBQUNjLE9BQVgsQ0FBbUJHLFdBQTdDLENBRko7O0FBR0FWLFFBQUFBLFFBQVEsR0FBR0wsSUFBSSxDQUFDTSxJQUFELENBQUosQ0FBV0csR0FBWCxLQUFtQlQsSUFBSSxDQUFDTSxJQUFELENBQUosQ0FBV0csR0FBWCxFQUFnQk8sR0FBaEIsRUFBOUI7QUFDSDtBQUNKOztBQUVELFFBQUksQ0FBQ1gsUUFBTCxFQUFlO0FBQ1hBLE1BQUFBLFFBQVEsR0FBRyxJQUFJSixFQUFFLENBQUNDLGVBQVAsQ0FBdUJKLFVBQXZCLENBQVg7QUFDQU8sTUFBQUEsUUFBUSxDQUFDWSxLQUFULEdBQWlCbkIsVUFBVSxDQUFDbUIsS0FBWCxHQUFtQixhQUFwQztBQUNBWixNQUFBQSxRQUFRLENBQUNHLEtBQVQsR0FBaUJWLFVBQVUsQ0FBQ1UsS0FBNUI7QUFDSCxLQUpELE1BS0s7QUFDRCxXQUFLVSxLQUFMO0FBQ0g7O0FBRURiLElBQUFBLFFBQVEsQ0FBQ0YsTUFBVCxHQUFrQkosZUFBbEI7QUFFQSxXQUFPTSxRQUFQO0FBQ0g7O1NBRURjLE1BQUEsYUFBS0MsR0FBTCxFQUFVO0FBQ04sUUFBSSxDQUFDLEtBQUt6QixPQUFOLElBQWlCLENBQUN5QixHQUFHLENBQUNqQixNQUExQixFQUFrQztBQUM5QjtBQUNIOztBQUVELFFBQUlILElBQUksR0FBRyxLQUFLSixLQUFoQjtBQUNBLFFBQUlVLElBQUksR0FBR2MsR0FBRyxDQUFDYixXQUFKLENBQWdCQyxLQUEzQjs7QUFDQSxRQUFJLENBQUNSLElBQUksQ0FBQ00sSUFBRCxDQUFULEVBQWlCO0FBQ2JOLE1BQUFBLElBQUksQ0FBQ00sSUFBRCxDQUFKLEdBQWEsRUFBYjtBQUNIOztBQUNELFFBQUlHLEdBQUcsR0FDSEMsa0JBQU1DLGdCQUFOLENBQXVCUyxHQUFHLENBQUNSLE9BQUosQ0FBWUMsUUFBbkMsSUFDQUgsa0JBQU1JLG1CQUFOLENBQTBCTSxHQUFHLENBQUNSLE9BQUosQ0FBWUcsV0FBdEMsQ0FGSjs7QUFHQSxRQUFJLENBQUNmLElBQUksQ0FBQ00sSUFBRCxDQUFKLENBQVdHLEdBQVgsQ0FBTCxFQUFzQjtBQUNsQlQsTUFBQUEsSUFBSSxDQUFDTSxJQUFELENBQUosQ0FBV0csR0FBWCxJQUFrQixFQUFsQjtBQUNIOztBQUNELFFBQUksS0FBS1MsS0FBTCxHQUFhLEtBQUtHLE9BQXRCLEVBQStCOztBQUUvQixTQUFLQyxNQUFMLENBQVlGLEdBQVo7O0FBQ0FwQixJQUFBQSxJQUFJLENBQUNNLElBQUQsQ0FBSixDQUFXRyxHQUFYLEVBQWdCYyxJQUFoQixDQUFxQkgsR0FBckI7QUFDQSxTQUFLRixLQUFMO0FBQ0g7O1NBRURNLFFBQUEsaUJBQVM7QUFDTCxTQUFLNUIsS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLc0IsS0FBTCxHQUFhLENBQWI7QUFDSDs7U0FFREksU0FBQSxnQkFBUUYsR0FBUixFQUFhO0FBQ1RBLElBQUFBLEdBQUcsQ0FBQ2pCLE1BQUosR0FBYSxJQUFiO0FBQ0g7OztFQS9Fc0JzQjs7QUFrRjNCLElBQUlDLFlBQVksR0FBRyxJQUFJaEMsWUFBSixFQUFuQjs7QUFDQStCLGlCQUFLRSxRQUFMLENBQWMsVUFBZCxFQUEwQkQsWUFBMUI7O2VBQ2VBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi4vLi4vdXRpbHMvcG9vbCc7XG5cbi8qKlxuICoge1xuICogICBlZmZlY3RVdWlkOiB7XG4gKiAgICAgZGVmaW5lU2VyaWFsaXplS2V5OiBbXVxuICogICB9XG4gKiB9XG4gKi9cbmNsYXNzIE1hdGVyaWFsUG9vbCBleHRlbmRzIFBvb2wge1xuICAgIC8vIGRlZmF1bHQgZGlzYWJsZWQgbWF0ZXJpYWwgcG9vbFxuICAgIGVuYWJsZWQgPSBmYWxzZTtcbiAgICBcbiAgICBfcG9vbCA9IHt9O1xuXG4gICAgZ2V0IChleGFtcGxlTWF0LCByZW5kZXJDb21wb25lbnQpIHtcbiAgICAgICAgbGV0IHBvb2wgPSB0aGlzLl9wb29sO1xuXG4gICAgICAgIGlmIChleGFtcGxlTWF0IGluc3RhbmNlb2YgY2MuTWF0ZXJpYWxWYXJpYW50KSB7XG4gICAgICAgICAgICBpZiAoZXhhbXBsZU1hdC5fb3duZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXhhbXBsZU1hdC5fb3duZXIgPT09IHJlbmRlckNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhhbXBsZU1hdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4YW1wbGVNYXQgPSBleGFtcGxlTWF0Lm1hdGVyaWFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4YW1wbGVNYXQuX293bmVyID0gcmVuZGVyQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgIHJldHVybiBleGFtcGxlTWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluc3RhbmNlO1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICBsZXQgdXVpZCA9IGV4YW1wbGVNYXQuZWZmZWN0QXNzZXQuX3V1aWQ7XG4gICAgICAgICAgICBpZiAocG9vbFt1dWlkXSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXkgPSBcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuc2VyaWFsaXplRGVmaW5lcyhleGFtcGxlTWF0Ll9lZmZlY3QuX2RlZmluZXMpICtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuc2VyaWFsaXplVGVjaG5pcXVlcyhleGFtcGxlTWF0Ll9lZmZlY3QuX3RlY2huaXF1ZXMpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gcG9vbFt1dWlkXVtrZXldICYmIHBvb2xbdXVpZF1ba2V5XS5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyBjYy5NYXRlcmlhbFZhcmlhbnQoZXhhbXBsZU1hdCk7XG4gICAgICAgICAgICBpbnN0YW5jZS5fbmFtZSA9IGV4YW1wbGVNYXQuX25hbWUgKyAnIChJbnN0YW5jZSknO1xuICAgICAgICAgICAgaW5zdGFuY2UuX3V1aWQgPSBleGFtcGxlTWF0Ll91dWlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb3VudC0tO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGluc3RhbmNlLl9vd25lciA9IHJlbmRlckNvbXBvbmVudDtcbiAgICBcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgICBcbiAgICBwdXQgKG1hdCkge1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCB8fCAhbWF0Ll9vd25lcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBvb2wgPSB0aGlzLl9wb29sO1xuICAgICAgICBsZXQgdXVpZCA9IG1hdC5lZmZlY3RBc3NldC5fdXVpZDtcbiAgICAgICAgaWYgKCFwb29sW3V1aWRdKSB7XG4gICAgICAgICAgICBwb29sW3V1aWRdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGtleSA9IFxuICAgICAgICAgICAgdXRpbHMuc2VyaWFsaXplRGVmaW5lcyhtYXQuX2VmZmVjdC5fZGVmaW5lcykgK1xuICAgICAgICAgICAgdXRpbHMuc2VyaWFsaXplVGVjaG5pcXVlcyhtYXQuX2VmZmVjdC5fdGVjaG5pcXVlcyk7XG4gICAgICAgIGlmICghcG9vbFt1dWlkXVtrZXldKSB7XG4gICAgICAgICAgICBwb29sW3V1aWRdW2tleV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb3VudCA+IHRoaXMubWF4U2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2NsZWFuKG1hdCk7XG4gICAgICAgIHBvb2xbdXVpZF1ba2V5XS5wdXNoKG1hdCk7XG4gICAgICAgIHRoaXMuY291bnQrKztcbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX3Bvb2wgPSB7fTtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgfVxuXG4gICAgX2NsZWFuIChtYXQpIHtcbiAgICAgICAgbWF0Ll9vd25lciA9IG51bGw7XG4gICAgfVxufVxuXG5sZXQgbWF0ZXJpYWxQb29sID0gbmV3IE1hdGVyaWFsUG9vbCgpO1xuUG9vbC5yZWdpc3RlcignbWF0ZXJpYWwnLCBtYXRlcmlhbFBvb2wpO1xuZXhwb3J0IGRlZmF1bHQgbWF0ZXJpYWxQb29sO1xuIl19