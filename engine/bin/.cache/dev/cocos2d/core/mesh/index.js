
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/mesh/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

require('./CCMesh');

if (!CC_EDITOR || !Editor.isMainProcess) {
  require('./CCMeshRenderer');

  require('./mesh-renderer');
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVA7O0FBQ0EsSUFBSSxDQUFDQyxTQUFELElBQWMsQ0FBQ0MsTUFBTSxDQUFDQyxhQUExQixFQUF5QztBQUNyQ0gsRUFBQUEsT0FBTyxDQUFDLGtCQUFELENBQVA7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL0NDTWVzaCcpO1xuaWYgKCFDQ19FRElUT1IgfHwgIUVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgcmVxdWlyZSgnLi9DQ01lc2hSZW5kZXJlcicpO1xuICAgIHJlcXVpcmUoJy4vbWVzaC1yZW5kZXJlcicpO1xufVxuIl19