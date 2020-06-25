
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/polyfill/number.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

Number.parseFloat = Number.parseFloat || parseFloat;
Number.parseInt = Number.parseInt || parseInt;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm51bWJlci5qcyJdLCJuYW1lcyI6WyJOdW1iZXIiLCJwYXJzZUZsb2F0IiwicGFyc2VJbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQUEsTUFBTSxDQUFDQyxVQUFQLEdBQW9CRCxNQUFNLENBQUNDLFVBQVAsSUFBcUJBLFVBQXpDO0FBQ0FELE1BQU0sQ0FBQ0UsUUFBUCxHQUFrQkYsTUFBTSxDQUFDRSxRQUFQLElBQW1CQSxRQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIlxuTnVtYmVyLnBhcnNlRmxvYXQgPSBOdW1iZXIucGFyc2VGbG9hdCB8fCBwYXJzZUZsb2F0O1xuTnVtYmVyLnBhcnNlSW50ID0gTnVtYmVyLnBhcnNlSW50IHx8IHBhcnNlSW50O1xuIl19