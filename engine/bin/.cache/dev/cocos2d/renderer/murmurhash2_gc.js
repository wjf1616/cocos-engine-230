
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/murmurhash2_gc.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = murmurhash2_32_gc;

/**
 * JS Implementation of MurmurHash2
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
function murmurhash2_32_gc(str, seed) {
  var l = str.length,
      h = seed ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return h >>> 0;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11cm11cmhhc2gyX2djLmpzIl0sIm5hbWVzIjpbIm11cm11cmhhc2gyXzMyX2djIiwic3RyIiwic2VlZCIsImwiLCJsZW5ndGgiLCJoIiwiaSIsImsiLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQWFlLFNBQVNBLGlCQUFULENBQTJCQyxHQUEzQixFQUFnQ0MsSUFBaEMsRUFBc0M7QUFDbkQsTUFDRUMsQ0FBQyxHQUFHRixHQUFHLENBQUNHLE1BRFY7QUFBQSxNQUVFQyxDQUFDLEdBQUdILElBQUksR0FBR0MsQ0FGYjtBQUFBLE1BR0VHLENBQUMsR0FBRyxDQUhOO0FBQUEsTUFJRUMsQ0FKRjs7QUFNQSxTQUFPSixDQUFDLElBQUksQ0FBWixFQUFlO0FBQ2RJLElBQUFBLENBQUMsR0FDR04sR0FBRyxDQUFDTyxVQUFKLENBQWVGLENBQWYsSUFBb0IsSUFBdEIsR0FDQyxDQUFDTCxHQUFHLENBQUNPLFVBQUosQ0FBZSxFQUFFRixDQUFqQixJQUFzQixJQUF2QixLQUFnQyxDQURqQyxHQUVDLENBQUNMLEdBQUcsQ0FBQ08sVUFBSixDQUFlLEVBQUVGLENBQWpCLElBQXNCLElBQXZCLEtBQWdDLEVBRmpDLEdBR0MsQ0FBQ0wsR0FBRyxDQUFDTyxVQUFKLENBQWUsRUFBRUYsQ0FBakIsSUFBc0IsSUFBdkIsS0FBZ0MsRUFKbkM7QUFNQ0MsSUFBQUEsQ0FBQyxHQUFLLENBQUNBLENBQUMsR0FBRyxNQUFMLElBQWUsVUFBaEIsSUFBK0IsQ0FBRSxDQUFDQSxDQUFDLEtBQUssRUFBUCxJQUFhLFVBQWQsR0FBNEIsTUFBN0IsS0FBd0MsRUFBdkUsQ0FBTDtBQUNBQSxJQUFBQSxDQUFDLElBQUlBLENBQUMsS0FBSyxFQUFYO0FBQ0FBLElBQUFBLENBQUMsR0FBSyxDQUFDQSxDQUFDLEdBQUcsTUFBTCxJQUFlLFVBQWhCLElBQStCLENBQUUsQ0FBQ0EsQ0FBQyxLQUFLLEVBQVAsSUFBYSxVQUFkLEdBQTRCLE1BQTdCLEtBQXdDLEVBQXZFLENBQUw7QUFFSEYsSUFBQUEsQ0FBQyxHQUFLLENBQUNBLENBQUMsR0FBRyxNQUFMLElBQWUsVUFBaEIsSUFBK0IsQ0FBRSxDQUFDQSxDQUFDLEtBQUssRUFBUCxJQUFhLFVBQWQsR0FBNEIsTUFBN0IsS0FBd0MsRUFBdkUsQ0FBRCxHQUErRUUsQ0FBbkY7QUFFR0osSUFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDQSxNQUFFRyxDQUFGO0FBQ0Q7O0FBRUQsVUFBUUgsQ0FBUjtBQUNBLFNBQUssQ0FBTDtBQUFRRSxNQUFBQSxDQUFDLElBQUksQ0FBQ0osR0FBRyxDQUFDTyxVQUFKLENBQWVGLENBQUMsR0FBRyxDQUFuQixJQUF3QixJQUF6QixLQUFrQyxFQUF2Qzs7QUFDUixTQUFLLENBQUw7QUFBUUQsTUFBQUEsQ0FBQyxJQUFJLENBQUNKLEdBQUcsQ0FBQ08sVUFBSixDQUFlRixDQUFDLEdBQUcsQ0FBbkIsSUFBd0IsSUFBekIsS0FBa0MsQ0FBdkM7O0FBQ1IsU0FBSyxDQUFMO0FBQVFELE1BQUFBLENBQUMsSUFBS0osR0FBRyxDQUFDTyxVQUFKLENBQWVGLENBQWYsSUFBb0IsSUFBMUI7QUFDQUQsTUFBQUEsQ0FBQyxHQUFLLENBQUNBLENBQUMsR0FBRyxNQUFMLElBQWUsVUFBaEIsSUFBK0IsQ0FBRSxDQUFDQSxDQUFDLEtBQUssRUFBUCxJQUFhLFVBQWQsR0FBNEIsTUFBN0IsS0FBd0MsRUFBdkUsQ0FBTDtBQUpSOztBQU9BQSxFQUFBQSxDQUFDLElBQUlBLENBQUMsS0FBSyxFQUFYO0FBQ0FBLEVBQUFBLENBQUMsR0FBSyxDQUFDQSxDQUFDLEdBQUcsTUFBTCxJQUFlLFVBQWhCLElBQStCLENBQUUsQ0FBQ0EsQ0FBQyxLQUFLLEVBQVAsSUFBYSxVQUFkLEdBQTRCLE1BQTdCLEtBQXdDLEVBQXZFLENBQUw7QUFDQUEsRUFBQUEsQ0FBQyxJQUFJQSxDQUFDLEtBQUssRUFBWDtBQUVBLFNBQU9BLENBQUMsS0FBSyxDQUFiO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEpTIEltcGxlbWVudGF0aW9uIG9mIE11cm11ckhhc2gyXG4gKiBcbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpnYXJ5LmNvdXJ0QGdtYWlsLmNvbVwiPkdhcnkgQ291cnQ8L2E+XG4gKiBAc2VlIGh0dHA6Ly9naXRodWIuY29tL2dhcnljb3VydC9tdXJtdXJoYXNoLWpzXG4gKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86YWFwcGxlYnlAZ21haWwuY29tXCI+QXVzdGluIEFwcGxlYnk8L2E+XG4gKiBAc2VlIGh0dHA6Ly9zaXRlcy5nb29nbGUuY29tL3NpdGUvbXVybXVyaGFzaC9cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBU0NJSSBvbmx5XG4gKiBAcGFyYW0ge251bWJlcn0gc2VlZCBQb3NpdGl2ZSBpbnRlZ2VyIG9ubHlcbiAqIEByZXR1cm4ge251bWJlcn0gMzItYml0IHBvc2l0aXZlIGludGVnZXIgaGFzaFxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG11cm11cmhhc2gyXzMyX2djKHN0ciwgc2VlZCkge1xuICB2YXJcbiAgICBsID0gc3RyLmxlbmd0aCxcbiAgICBoID0gc2VlZCBeIGwsXG4gICAgaSA9IDAsXG4gICAgaztcbiAgXG4gIHdoaWxlIChsID49IDQpIHtcbiAgXHRrID0gXG4gIFx0ICAoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZikpIHxcbiAgXHQgICgoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDgpIHxcbiAgXHQgICgoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDE2KSB8XG4gIFx0ICAoKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCAyNCk7XG4gICAgXG4gICAgayA9ICgoKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSkgKyAoKCgoayA+Pj4gMTYpICogMHg1YmQxZTk5NSkgJiAweGZmZmYpIDw8IDE2KSk7XG4gICAgayBePSBrID4+PiAyNDtcbiAgICBrID0gKCgoayAmIDB4ZmZmZikgKiAweDViZDFlOTk1KSArICgoKChrID4+PiAxNikgKiAweDViZDFlOTk1KSAmIDB4ZmZmZikgPDwgMTYpKTtcblxuXHRoID0gKCgoaCAmIDB4ZmZmZikgKiAweDViZDFlOTk1KSArICgoKChoID4+PiAxNikgKiAweDViZDFlOTk1KSAmIDB4ZmZmZikgPDwgMTYpKSBeIGs7XG5cbiAgICBsIC09IDQ7XG4gICAgKytpO1xuICB9XG4gIFxuICBzd2l0Y2ggKGwpIHtcbiAgY2FzZSAzOiBoIF49IChzdHIuY2hhckNvZGVBdChpICsgMikgJiAweGZmKSA8PCAxNjtcbiAgY2FzZSAyOiBoIF49IChzdHIuY2hhckNvZGVBdChpICsgMSkgJiAweGZmKSA8PCA4O1xuICBjYXNlIDE6IGggXj0gKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZik7XG4gICAgICAgICAgaCA9ICgoKGggJiAweGZmZmYpICogMHg1YmQxZTk5NSkgKyAoKCgoaCA+Pj4gMTYpICogMHg1YmQxZTk5NSkgJiAweGZmZmYpIDw8IDE2KSk7XG4gIH1cblxuICBoIF49IGggPj4+IDEzO1xuICBoID0gKCgoaCAmIDB4ZmZmZikgKiAweDViZDFlOTk1KSArICgoKChoID4+PiAxNikgKiAweDViZDFlOTk1KSAmIDB4ZmZmZikgPDwgMTYpKTtcbiAgaCBePSBoID4+PiAxNTtcblxuICByZXR1cm4gaCA+Pj4gMDtcbn0iXX0=