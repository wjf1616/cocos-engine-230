
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/graphics/earcut.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}/****************************************************************************
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
'use strict';

cc.Graphics.earcut = module.exports = earcut;

function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length,
      outerLen = hasHoles ? holeIndices[0] * dim : data.length,
      outerNode = linkedList(data, 0, outerLen, dim, true),
      triangles = [];
  if (!outerNode) return triangles;
  var minX, minY, maxX, maxY, x, y, size;
  if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim); // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox

  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];

    for (var i = dim; i < outerLen; i += dim) {
      x = data[i];
      y = data[i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    } // minX, minY and size are later used to transform coords into integers for z-order calculation


    size = Math.max(maxX - minX, maxY - minY);
  }

  earcutLinked(outerNode, triangles, dim, minX, minY, size);
  return triangles;
} // create a circular doubly linked list from polygon points in the specified winding order


function linkedList(data, start, end, dim, clockwise) {
  var i, last;

  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i = start; i < end; i += dim) {
      last = insertNode(i, data[i], data[i + 1], last);
    }
  } else {
    for (i = end - dim; i >= start; i -= dim) {
      last = insertNode(i, data[i], data[i + 1], last);
    }
  }

  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }

  return last;
} // eliminate colinear or duplicate points


function filterPoints(start, end) {
  if (!start) return start;
  if (!end) end = start;
  var p = start,
      again;

  do {
    again = false;

    if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
      removeNode(p);
      p = end = p.prev;
      if (p === p.next) return null;
      again = true;
    } else {
      p = p.next;
    }
  } while (again || p !== end);

  return end;
} // main ear slicing loop which triangulates a polygon (given as a linked list)


function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
  if (!ear) return; // interlink polygon nodes in z-order

  if (!pass && size) indexCurve(ear, minX, minY, size);
  var stop = ear,
      prev,
      next; // iterate through ears, slicing them one by one

  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;

    if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
      // cut off the triangle
      triangles.push(prev.i / dim);
      triangles.push(ear.i / dim);
      triangles.push(next.i / dim);
      removeNode(ear); // skipping the next vertice leads to less sliver triangles

      ear = next.next;
      stop = next.next;
      continue;
    }

    ear = next; // if we looped through the whole remaining polygon and can't find any more ears

    if (ear === stop) {
      // try filtering points and slicing again
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1); // if this didn't work, try curing all small self-intersections locally
      } else if (pass === 1) {
        ear = cureLocalIntersections(ear, triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, size, 2); // as a last resort, try splitting the remaining polygon into two
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, size);
      }

      break;
    }
  }
} // check whether a polygon node forms a valid ear with adjacent nodes


function isEar(ear) {
  var a = ear.prev,
      b = ear,
      c = ear.next;
  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
  // now make sure we don't have other points inside the potential ear

  var p = ear.next.next;

  while (p !== ear.prev) {
    if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.next;
  }

  return true;
}

function isEarHashed(ear, minX, minY, size) {
  var a = ear.prev,
      b = ear,
      c = ear.next;
  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
  // triangle bbox; min & max are calculated like this for speed

  var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x,
      minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y,
      maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x,
      maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y; // z-order range for the current triangle bbox;

  var minZ = zOrder(minTX, minTY, minX, minY, size),
      maxZ = zOrder(maxTX, maxTY, minX, minY, size); // first look for points inside the triangle in increasing z-order

  var p = ear.nextZ;

  while (p && p.z <= maxZ) {
    if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.nextZ;
  } // then look for points in decreasing z-order


  p = ear.prevZ;

  while (p && p.z >= minZ) {
    if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.prevZ;
  }

  return true;
} // go through all polygon nodes and cure small local self-intersections


function cureLocalIntersections(start, triangles, dim) {
  var p = start;

  do {
    var a = p.prev,
        b = p.next.next;

    if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
      triangles.push(a.i / dim);
      triangles.push(p.i / dim);
      triangles.push(b.i / dim); // remove two nodes involved

      removeNode(p);
      removeNode(p.next);
      p = start = b;
    }

    p = p.next;
  } while (p !== start);

  return p;
} // try splitting polygon into two and triangulate them independently


function splitEarcut(start, triangles, dim, minX, minY, size) {
  // look for a valid diagonal that divides the polygon into two
  var a = start;

  do {
    var b = a.next.next;

    while (b !== a.prev) {
      if (a.i !== b.i && isValidDiagonal(a, b)) {
        // split the polygon in two by the diagonal
        var c = splitPolygon(a, b); // filter colinear points around the cuts

        a = filterPoints(a, a.next);
        c = filterPoints(c, c.next); // run earcut on each half

        earcutLinked(a, triangles, dim, minX, minY, size);
        earcutLinked(c, triangles, dim, minX, minY, size);
        return;
      }

      b = b.next;
    }

    a = a.next;
  } while (a !== start);
} // link every hole into the outer loop, producing a single-ring polygon without holes


function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [],
      i,
      len,
      start,
      end,
      list;

  for (i = 0, len = holeIndices.length; i < len; i++) {
    start = holeIndices[i] * dim;
    end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next) list.steiner = true;
    queue.push(getLeftmost(list));
  }

  queue.sort(compareX); // process holes from left to right

  for (i = 0; i < queue.length; i++) {
    eliminateHole(queue[i], outerNode);
    outerNode = filterPoints(outerNode, outerNode.next);
  }

  return outerNode;
}

function compareX(a, b) {
  return a.x - b.x;
} // find a bridge between vertices that connects hole with an outer ring and and link it


function eliminateHole(hole, outerNode) {
  outerNode = findHoleBridge(hole, outerNode);

  if (outerNode) {
    var b = splitPolygon(outerNode, hole);
    filterPoints(b, b.next);
  }
} // David Eberly's algorithm for finding a bridge between hole and outer polygon


function findHoleBridge(hole, outerNode) {
  var p = outerNode,
      hx = hole.x,
      hy = hole.y,
      qx = -Infinity,
      m; // find a segment intersected by a ray from the hole's leftmost point to the left;
  // segment's endpoint with lesser x will be potential connection point

  do {
    if (hy <= p.y && hy >= p.next.y) {
      var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);

      if (x <= hx && x > qx) {
        qx = x;

        if (x === hx) {
          if (hy === p.y) return p;
          if (hy === p.next.y) return p.next;
        }

        m = p.x < p.next.x ? p : p.next;
      }
    }

    p = p.next;
  } while (p !== outerNode);

  if (!m) return null;
  if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint
  // look for points inside the triangle of hole point, segment intersection and endpoint;
  // if there are no points found, we have a valid connection;
  // otherwise choose the point of the minimum angle with the ray as connection point

  var stop = m,
      mx = m.x,
      my = m.y,
      tanMin = Infinity,
      tan;
  p = m.next;

  while (p !== stop) {
    if (hx >= p.x && p.x >= mx && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
      tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

      if ((tan < tanMin || tan === tanMin && p.x > m.x) && locallyInside(p, hole)) {
        m = p;
        tanMin = tan;
      }
    }

    p = p.next;
  }

  return m;
} // interlink polygon nodes in z-order


function indexCurve(start, minX, minY, size) {
  var p = start;

  do {
    if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
    p.prevZ = p.prev;
    p.nextZ = p.next;
    p = p.next;
  } while (p !== start);

  p.prevZ.nextZ = null;
  p.prevZ = null;
  sortLinked(p);
} // Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html


function sortLinked(list) {
  var i,
      p,
      q,
      e,
      tail,
      numMerges,
      pSize,
      qSize,
      inSize = 1;

  do {
    p = list;
    list = null;
    tail = null;
    numMerges = 0;

    while (p) {
      numMerges++;
      q = p;
      pSize = 0;

      for (i = 0; i < inSize; i++) {
        pSize++;
        q = q.nextZ;
        if (!q) break;
      }

      qSize = inSize;

      while (pSize > 0 || qSize > 0 && q) {
        if (pSize === 0) {
          e = q;
          q = q.nextZ;
          qSize--;
        } else if (qSize === 0 || !q) {
          e = p;
          p = p.nextZ;
          pSize--;
        } else if (p.z <= q.z) {
          e = p;
          p = p.nextZ;
          pSize--;
        } else {
          e = q;
          q = q.nextZ;
          qSize--;
        }

        if (tail) tail.nextZ = e;else list = e;
        e.prevZ = tail;
        tail = e;
      }

      p = q;
    }

    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);

  return list;
} // z-order of a point given coords and size of the data bounding box


function zOrder(x, y, minX, minY, size) {
  // coords are transformed into non-negative 15-bit integer range
  x = 32767 * (x - minX) / size;
  y = 32767 * (y - minY) / size;
  x = (x | x << 8) & 0x00FF00FF;
  x = (x | x << 4) & 0x0F0F0F0F;
  x = (x | x << 2) & 0x33333333;
  x = (x | x << 1) & 0x55555555;
  y = (y | y << 8) & 0x00FF00FF;
  y = (y | y << 4) & 0x0F0F0F0F;
  y = (y | y << 2) & 0x33333333;
  y = (y | y << 1) & 0x55555555;
  return x | y << 1;
} // find the leftmost node of a polygon ring


function getLeftmost(start) {
  var p = start,
      leftmost = start;

  do {
    if (p.x < leftmost.x) leftmost = p;
    p = p.next;
  } while (p !== start);

  return leftmost;
} // check if a point lies within a convex triangle


function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
} // check if a diagonal between two polygon nodes is valid (lies in polygon interior)


function isValidDiagonal(a, b) {
  return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
} // signed area of a triangle


function area(p, q, r) {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
} // check if two points are equal


function equals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
} // check if two segments intersect


function intersects(p1, q1, p2, q2) {
  if (equals(p1, q1) && equals(p2, q2) || equals(p1, q2) && equals(p2, q1)) return true;
  return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 && area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
} // check if a polygon diagonal intersects any polygon segments


function intersectsPolygon(a, b) {
  var p = a;

  do {
    if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
    p = p.next;
  } while (p !== a);

  return false;
} // check if a polygon diagonal is locally inside the polygon


function locallyInside(a, b) {
  return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
} // check if the middle point of a polygon diagonal is inside the polygon


function middleInside(a, b) {
  var p = a,
      inside = false,
      px = (a.x + b.x) / 2,
      py = (a.y + b.y) / 2;

  do {
    if (p.y > py !== p.next.y > py && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
    p = p.next;
  } while (p !== a);

  return inside;
} // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring


function splitPolygon(a, b) {
  var a2 = new Node(a.i, a.x, a.y),
      b2 = new Node(b.i, b.x, b.y),
      an = a.next,
      bp = b.prev;
  a.next = b;
  b.prev = a;
  a2.next = an;
  an.prev = a2;
  b2.next = a2;
  a2.prev = b2;
  bp.next = b2;
  b2.prev = bp;
  return b2;
} // create a node and optionally link it with previous one (in a circular doubly linked list)


function insertNode(i, x, y, last) {
  var p = new Node(i, x, y);

  if (!last) {
    p.prev = p;
    p.next = p;
  } else {
    p.next = last.next;
    p.prev = last;
    last.next.prev = p;
    last.next = p;
  }

  return p;
}

function removeNode(p) {
  p.next.prev = p.prev;
  p.prev.next = p.next;
  if (p.prevZ) p.prevZ.nextZ = p.nextZ;
  if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
  // vertice index in coordinates array
  this.i = i; // vertex coordinates

  this.x = x;
  this.y = y; // previous and next vertice nodes in a polygon ring

  this.prev = null;
  this.next = null; // z-order curve value

  this.z = null; // previous and next nodes in z-order

  this.prevZ = null;
  this.nextZ = null; // indicates whether this is a steiner point

  this.steiner = false;
} // return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation


earcut.deviation = function (data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));

  if (hasHoles) {
    for (var i = 0, len = holeIndices.length; i < len; i++) {
      var start = holeIndices[i] * dim;
      var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }

  var trianglesArea = 0;

  for (i = 0; i < triangles.length; i += 3) {
    var a = triangles[i] * dim;
    var b = triangles[i + 1] * dim;
    var c = triangles[i + 2] * dim;
    trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
  }

  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
  var sum = 0;

  for (var i = start, j = end - dim; i < end; i += dim) {
    sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
    j = i;
  }

  return sum;
} // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts


earcut.flatten = function (data) {
  var dim = data[0][0].length,
      result = {
    vertices: [],
    holes: [],
    dimensions: dim
  },
      holeIndex = 0;

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      for (var d = 0; d < dim; d++) {
        result.vertices.push(data[i][j][d]);
      }
    }

    if (i > 0) {
      holeIndex += data[i - 1].length;
      result.holes.push(holeIndex);
    }
  }

  return result;
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVhcmN1dC5qcyJdLCJuYW1lcyI6WyJjYyIsIkdyYXBoaWNzIiwiZWFyY3V0IiwibW9kdWxlIiwiZXhwb3J0cyIsImRhdGEiLCJob2xlSW5kaWNlcyIsImRpbSIsImhhc0hvbGVzIiwibGVuZ3RoIiwib3V0ZXJMZW4iLCJvdXRlck5vZGUiLCJsaW5rZWRMaXN0IiwidHJpYW5nbGVzIiwibWluWCIsIm1pblkiLCJtYXhYIiwibWF4WSIsIngiLCJ5Iiwic2l6ZSIsImVsaW1pbmF0ZUhvbGVzIiwiaSIsIk1hdGgiLCJtYXgiLCJlYXJjdXRMaW5rZWQiLCJzdGFydCIsImVuZCIsImNsb2Nrd2lzZSIsImxhc3QiLCJzaWduZWRBcmVhIiwiaW5zZXJ0Tm9kZSIsImVxdWFscyIsIm5leHQiLCJyZW1vdmVOb2RlIiwiZmlsdGVyUG9pbnRzIiwicCIsImFnYWluIiwic3RlaW5lciIsImFyZWEiLCJwcmV2IiwiZWFyIiwicGFzcyIsImluZGV4Q3VydmUiLCJzdG9wIiwiaXNFYXJIYXNoZWQiLCJpc0VhciIsInB1c2giLCJjdXJlTG9jYWxJbnRlcnNlY3Rpb25zIiwic3BsaXRFYXJjdXQiLCJhIiwiYiIsImMiLCJwb2ludEluVHJpYW5nbGUiLCJtaW5UWCIsIm1pblRZIiwibWF4VFgiLCJtYXhUWSIsIm1pbloiLCJ6T3JkZXIiLCJtYXhaIiwibmV4dFoiLCJ6IiwicHJldloiLCJpbnRlcnNlY3RzIiwibG9jYWxseUluc2lkZSIsImlzVmFsaWREaWFnb25hbCIsInNwbGl0UG9seWdvbiIsInF1ZXVlIiwibGVuIiwibGlzdCIsImdldExlZnRtb3N0Iiwic29ydCIsImNvbXBhcmVYIiwiZWxpbWluYXRlSG9sZSIsImhvbGUiLCJmaW5kSG9sZUJyaWRnZSIsImh4IiwiaHkiLCJxeCIsIkluZmluaXR5IiwibSIsIm14IiwibXkiLCJ0YW5NaW4iLCJ0YW4iLCJhYnMiLCJzb3J0TGlua2VkIiwicSIsImUiLCJ0YWlsIiwibnVtTWVyZ2VzIiwicFNpemUiLCJxU2l6ZSIsImluU2l6ZSIsImxlZnRtb3N0IiwiYXgiLCJheSIsImJ4IiwiYnkiLCJjeCIsImN5IiwicHgiLCJweSIsImludGVyc2VjdHNQb2x5Z29uIiwibWlkZGxlSW5zaWRlIiwiciIsInAxIiwicDIiLCJxMSIsInEyIiwiaW5zaWRlIiwiYTIiLCJOb2RlIiwiYjIiLCJhbiIsImJwIiwiZGV2aWF0aW9uIiwicG9seWdvbkFyZWEiLCJ0cmlhbmdsZXNBcmVhIiwic3VtIiwiaiIsImZsYXR0ZW4iLCJyZXN1bHQiLCJ2ZXJ0aWNlcyIsImhvbGVzIiwiZGltZW5zaW9ucyIsImhvbGVJbmRleCIsImQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFFQUEsRUFBRSxDQUFDQyxRQUFILENBQVlDLE1BQVosR0FBcUJDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkYsTUFBdEM7O0FBRUEsU0FBU0EsTUFBVCxDQUFnQkcsSUFBaEIsRUFBc0JDLFdBQXRCLEVBQW1DQyxHQUFuQyxFQUF3QztBQUVwQ0EsRUFBQUEsR0FBRyxHQUFHQSxHQUFHLElBQUksQ0FBYjtBQUVBLE1BQUlDLFFBQVEsR0FBR0YsV0FBVyxJQUFJQSxXQUFXLENBQUNHLE1BQTFDO0FBQUEsTUFDSUMsUUFBUSxHQUFHRixRQUFRLEdBQUdGLFdBQVcsQ0FBQyxDQUFELENBQVgsR0FBaUJDLEdBQXBCLEdBQTBCRixJQUFJLENBQUNJLE1BRHREO0FBQUEsTUFFSUUsU0FBUyxHQUFHQyxVQUFVLENBQUNQLElBQUQsRUFBTyxDQUFQLEVBQVVLLFFBQVYsRUFBb0JILEdBQXBCLEVBQXlCLElBQXpCLENBRjFCO0FBQUEsTUFHSU0sU0FBUyxHQUFHLEVBSGhCO0FBS0EsTUFBSSxDQUFDRixTQUFMLEVBQWdCLE9BQU9FLFNBQVA7QUFFaEIsTUFBSUMsSUFBSixFQUFVQyxJQUFWLEVBQWdCQyxJQUFoQixFQUFzQkMsSUFBdEIsRUFBNEJDLENBQTVCLEVBQStCQyxDQUEvQixFQUFrQ0MsSUFBbEM7QUFFQSxNQUFJWixRQUFK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QUFXSSxNQUFyQjtBQUFBLE1BQ0lrSCxNQUFNLEdBQUc7QUFBQ0MsSUFBQUEsUUFBUSxFQUFFLEVBQVg7QUFBZUMsSUFBQUEsS0FBSyxFQUFFLEVBQXRCO0FBQTBCQyxJQUFBQSxVQUFVLEVBQUV2SDtBQUF0QyxHQURiO0FBQUEsTUFFSXdILFNBQVMsR0FBRyxDQUZoQjs7QUFJQSxPQUFLLElBQUl6RyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHakIsSUFBSSxDQUFDSSxNQUF6QixFQUFpQ2EsQ0FBQyxFQUFsQyxFQUFzQztBQUNsQyxTQUFLLElBQUltRyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHcEgsSUFBSSxDQUFDaUIsQ0FBRCxDQUFKLENBQVFiLE1BQTVCLEVBQW9DZ0gsQ0FBQyxFQUFyQyxFQUF5QztBQUNyQyxXQUFLLElBQUlPLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd6SCxHQUFwQixFQUF5QnlILENBQUMsRUFBMUI7QUFBOEJMLFFBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQjdFLElBQWhCLENBQXFCMUMsSUFBSSxDQUFDaUIsQ0FBRCxDQUFKLENBQVFtRyxDQUFSLEVBQVdPLENBQVgsQ0FBckI7QUFBOUI7QUFDSDs7QUFDRCxRQUFJMUcsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNQeUcsTUFBQUEsU0FBUyxJQUFJMUgsSUFBSSxDQUFDaUIsQ0FBQyxHQUFHLENBQUwsQ0FBSixDQUFZYixNQUF6QjtBQUNBa0gsTUFBQUEsTUFBTSxDQUFDRSxLQUFQLENBQWE5RSxJQUFiLENBQWtCZ0YsU0FBbEI7QUFDSDtBQUNKOztBQUNELFNBQU9KLE1BQVA7QUFDSCxDQWZEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5HcmFwaGljcy5lYXJjdXQgPSBtb2R1bGUuZXhwb3J0cyA9IGVhcmN1dDtcblxuZnVuY3Rpb24gZWFyY3V0KGRhdGEsIGhvbGVJbmRpY2VzLCBkaW0pIHtcblxuICAgIGRpbSA9IGRpbSB8fCAyO1xuXG4gICAgdmFyIGhhc0hvbGVzID0gaG9sZUluZGljZXMgJiYgaG9sZUluZGljZXMubGVuZ3RoLFxuICAgICAgICBvdXRlckxlbiA9IGhhc0hvbGVzID8gaG9sZUluZGljZXNbMF0gKiBkaW0gOiBkYXRhLmxlbmd0aCxcbiAgICAgICAgb3V0ZXJOb2RlID0gbGlua2VkTGlzdChkYXRhLCAwLCBvdXRlckxlbiwgZGltLCB0cnVlKSxcbiAgICAgICAgdHJpYW5nbGVzID0gW107XG5cbiAgICBpZiAoIW91dGVyTm9kZSkgcmV0dXJuIHRyaWFuZ2xlcztcblxuICAgIHZhciBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZLCB4LCB5LCBzaXplO1xuXG4gICAgaWYgKGhhc0hvbGVzKSBvdXRlck5vZGUgPSBlbGltaW5hdGVIb2xlcyhkYXRhLCBob2xlSW5kaWNlcywgb3V0ZXJOb2RlLCBkaW0pO1xuXG4gICAgLy8gaWYgdGhlIHNoYXBlIGlzIG5vdCB0b28gc2ltcGxlLCB3ZSdsbCB1c2Ugei1vcmRlciBjdXJ2ZSBoYXNoIGxhdGVyOyBjYWxjdWxhdGUgcG9seWdvbiBiYm94XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gODAgKiBkaW0pIHtcbiAgICAgICAgbWluWCA9IG1heFggPSBkYXRhWzBdO1xuICAgICAgICBtaW5ZID0gbWF4WSA9IGRhdGFbMV07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGRpbTsgaSA8IG91dGVyTGVuOyBpICs9IGRpbSkge1xuICAgICAgICAgICAgeCA9IGRhdGFbaV07XG4gICAgICAgICAgICB5ID0gZGF0YVtpICsgMV07XG4gICAgICAgICAgICBpZiAoeCA8IG1pblgpIG1pblggPSB4O1xuICAgICAgICAgICAgaWYgKHkgPCBtaW5ZKSBtaW5ZID0geTtcbiAgICAgICAgICAgIGlmICh4ID4gbWF4WCkgbWF4WCA9IHg7XG4gICAgICAgICAgICBpZiAoeSA+IG1heFkpIG1heFkgPSB5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWluWCwgbWluWSBhbmQgc2l6ZSBhcmUgbGF0ZXIgdXNlZCB0byB0cmFuc2Zvcm0gY29vcmRzIGludG8gaW50ZWdlcnMgZm9yIHotb3JkZXIgY2FsY3VsYXRpb25cbiAgICAgICAgc2l6ZSA9IE1hdGgubWF4KG1heFggLSBtaW5YLCBtYXhZIC0gbWluWSk7XG4gICAgfVxuXG4gICAgZWFyY3V0TGlua2VkKG91dGVyTm9kZSwgdHJpYW5nbGVzLCBkaW0sIG1pblgsIG1pblksIHNpemUpO1xuXG4gICAgcmV0dXJuIHRyaWFuZ2xlcztcbn1cblxuLy8gY3JlYXRlIGEgY2lyY3VsYXIgZG91Ymx5IGxpbmtlZCBsaXN0IGZyb20gcG9seWdvbiBwb2ludHMgaW4gdGhlIHNwZWNpZmllZCB3aW5kaW5nIG9yZGVyXG5mdW5jdGlvbiBsaW5rZWRMaXN0KGRhdGEsIHN0YXJ0LCBlbmQsIGRpbSwgY2xvY2t3aXNlKSB7XG4gICAgdmFyIGksIGxhc3Q7XG5cbiAgICBpZiAoY2xvY2t3aXNlID09PSAoc2lnbmVkQXJlYShkYXRhLCBzdGFydCwgZW5kLCBkaW0pID4gMCkpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gZGltKSBsYXN0ID0gaW5zZXJ0Tm9kZShpLCBkYXRhW2ldLCBkYXRhW2kgKyAxXSwgbGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gZW5kIC0gZGltOyBpID49IHN0YXJ0OyBpIC09IGRpbSkgbGFzdCA9IGluc2VydE5vZGUoaSwgZGF0YVtpXSwgZGF0YVtpICsgMV0sIGxhc3QpO1xuICAgIH1cblxuICAgIGlmIChsYXN0ICYmIGVxdWFscyhsYXN0LCBsYXN0Lm5leHQpKSB7XG4gICAgICAgIHJlbW92ZU5vZGUobGFzdCk7XG4gICAgICAgIGxhc3QgPSBsYXN0Lm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhc3Q7XG59XG5cbi8vIGVsaW1pbmF0ZSBjb2xpbmVhciBvciBkdXBsaWNhdGUgcG9pbnRzXG5mdW5jdGlvbiBmaWx0ZXJQb2ludHMoc3RhcnQsIGVuZCkge1xuICAgIGlmICghc3RhcnQpIHJldHVybiBzdGFydDtcbiAgICBpZiAoIWVuZCkgZW5kID0gc3RhcnQ7XG5cbiAgICB2YXIgcCA9IHN0YXJ0LFxuICAgICAgICBhZ2FpbjtcbiAgICBkbyB7XG4gICAgICAgIGFnYWluID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCFwLnN0ZWluZXIgJiYgKGVxdWFscyhwLCBwLm5leHQpIHx8IGFyZWEocC5wcmV2LCBwLCBwLm5leHQpID09PSAwKSkge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShwKTtcbiAgICAgICAgICAgIHAgPSBlbmQgPSBwLnByZXY7XG4gICAgICAgICAgICBpZiAocCA9PT0gcC5uZXh0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcCA9IHAubmV4dDtcbiAgICAgICAgfVxuICAgIH0gd2hpbGUgKGFnYWluIHx8IHAgIT09IGVuZCk7XG5cbiAgICByZXR1cm4gZW5kO1xufVxuXG4vLyBtYWluIGVhciBzbGljaW5nIGxvb3Agd2hpY2ggdHJpYW5ndWxhdGVzIGEgcG9seWdvbiAoZ2l2ZW4gYXMgYSBsaW5rZWQgbGlzdClcbmZ1bmN0aW9uIGVhcmN1dExpbmtlZChlYXIsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBzaXplLCBwYXNzKSB7XG4gICAgaWYgKCFlYXIpIHJldHVybjtcblxuICAgIC8vIGludGVybGluayBwb2x5Z29uIG5vZGVzIGluIHotb3JkZXJcbiAgICBpZiAoIXBhc3MgJiYgc2l6ZSkgaW5kZXhDdXJ2ZShlYXIsIG1pblgsIG1pblksIHNpemUpO1xuXG4gICAgdmFyIHN0b3AgPSBlYXIsXG4gICAgICAgIHByZXYsIG5leHQ7XG5cbiAgICAvLyBpdGVyYXRlIHRocm91Z2ggZWFycywgc2xpY2luZyB0aGVtIG9uZSBieSBvbmVcbiAgICB3aGlsZSAoZWFyLnByZXYgIT09IGVhci5uZXh0KSB7XG4gICAgICAgIHByZXYgPSBlYXIucHJldjtcbiAgICAgICAgbmV4dCA9IGVhci5uZXh0O1xuXG4gICAgICAgIGlmIChzaXplID8gaXNFYXJIYXNoZWQoZWFyLCBtaW5YLCBtaW5ZLCBzaXplKSA6IGlzRWFyKGVhcikpIHtcbiAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHRyaWFuZ2xlXG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChwcmV2LmkgLyBkaW0pO1xuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goZWFyLmkgLyBkaW0pO1xuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2gobmV4dC5pIC8gZGltKTtcblxuICAgICAgICAgICAgcmVtb3ZlTm9kZShlYXIpO1xuXG4gICAgICAgICAgICAvLyBza2lwcGluZyB0aGUgbmV4dCB2ZXJ0aWNlIGxlYWRzIHRvIGxlc3Mgc2xpdmVyIHRyaWFuZ2xlc1xuICAgICAgICAgICAgZWFyID0gbmV4dC5uZXh0O1xuICAgICAgICAgICAgc3RvcCA9IG5leHQubmV4dDtcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBlYXIgPSBuZXh0O1xuXG4gICAgICAgIC8vIGlmIHdlIGxvb3BlZCB0aHJvdWdoIHRoZSB3aG9sZSByZW1haW5pbmcgcG9seWdvbiBhbmQgY2FuJ3QgZmluZCBhbnkgbW9yZSBlYXJzXG4gICAgICAgIGlmIChlYXIgPT09IHN0b3ApIHtcbiAgICAgICAgICAgIC8vIHRyeSBmaWx0ZXJpbmcgcG9pbnRzIGFuZCBzbGljaW5nIGFnYWluXG4gICAgICAgICAgICBpZiAoIXBhc3MpIHtcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoZmlsdGVyUG9pbnRzKGVhciksIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBzaXplLCAxKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBkaWRuJ3Qgd29yaywgdHJ5IGN1cmluZyBhbGwgc21hbGwgc2VsZi1pbnRlcnNlY3Rpb25zIGxvY2FsbHlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGVhciA9IGN1cmVMb2NhbEludGVyc2VjdGlvbnMoZWFyLCB0cmlhbmdsZXMsIGRpbSk7XG4gICAgICAgICAgICAgICAgZWFyY3V0TGlua2VkKGVhciwgdHJpYW5nbGVzLCBkaW0sIG1pblgsIG1pblksIHNpemUsIDIpO1xuXG4gICAgICAgICAgICAvLyBhcyBhIGxhc3QgcmVzb3J0LCB0cnkgc3BsaXR0aW5nIHRoZSByZW1haW5pbmcgcG9seWdvbiBpbnRvIHR3b1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXNzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgc3BsaXRFYXJjdXQoZWFyLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBjaGVjayB3aGV0aGVyIGEgcG9seWdvbiBub2RlIGZvcm1zIGEgdmFsaWQgZWFyIHdpdGggYWRqYWNlbnQgbm9kZXNcbmZ1bmN0aW9uIGlzRWFyKGVhcikge1xuICAgIHZhciBhID0gZWFyLnByZXYsXG4gICAgICAgIGIgPSBlYXIsXG4gICAgICAgIGMgPSBlYXIubmV4dDtcblxuICAgIGlmIChhcmVhKGEsIGIsIGMpID49IDApIHJldHVybiBmYWxzZTsgLy8gcmVmbGV4LCBjYW4ndCBiZSBhbiBlYXJcblxuICAgIC8vIG5vdyBtYWtlIHN1cmUgd2UgZG9uJ3QgaGF2ZSBvdGhlciBwb2ludHMgaW5zaWRlIHRoZSBwb3RlbnRpYWwgZWFyXG4gICAgdmFyIHAgPSBlYXIubmV4dC5uZXh0O1xuXG4gICAgd2hpbGUgKHAgIT09IGVhci5wcmV2KSB7XG4gICAgICAgIGlmIChwb2ludEluVHJpYW5nbGUoYS54LCBhLnksIGIueCwgYi55LCBjLngsIGMueSwgcC54LCBwLnkpICYmXG4gICAgICAgICAgICBhcmVhKHAucHJldiwgcCwgcC5uZXh0KSA+PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzRWFySGFzaGVkKGVhciwgbWluWCwgbWluWSwgc2l6ZSkge1xuICAgIHZhciBhID0gZWFyLnByZXYsXG4gICAgICAgIGIgPSBlYXIsXG4gICAgICAgIGMgPSBlYXIubmV4dDtcblxuICAgIGlmIChhcmVhKGEsIGIsIGMpID49IDApIHJldHVybiBmYWxzZTsgLy8gcmVmbGV4LCBjYW4ndCBiZSBhbiBlYXJcblxuICAgIC8vIHRyaWFuZ2xlIGJib3g7IG1pbiAmIG1heCBhcmUgY2FsY3VsYXRlZCBsaWtlIHRoaXMgZm9yIHNwZWVkXG4gICAgdmFyIG1pblRYID0gYS54IDwgYi54ID8gKGEueCA8IGMueCA/IGEueCA6IGMueCkgOiAoYi54IDwgYy54ID8gYi54IDogYy54KSxcbiAgICAgICAgbWluVFkgPSBhLnkgPCBiLnkgPyAoYS55IDwgYy55ID8gYS55IDogYy55KSA6IChiLnkgPCBjLnkgPyBiLnkgOiBjLnkpLFxuICAgICAgICBtYXhUWCA9IGEueCA+IGIueCA/IChhLnggPiBjLnggPyBhLnggOiBjLngpIDogKGIueCA+IGMueCA/IGIueCA6IGMueCksXG4gICAgICAgIG1heFRZID0gYS55ID4gYi55ID8gKGEueSA+IGMueSA/IGEueSA6IGMueSkgOiAoYi55ID4gYy55ID8gYi55IDogYy55KTtcblxuICAgIC8vIHotb3JkZXIgcmFuZ2UgZm9yIHRoZSBjdXJyZW50IHRyaWFuZ2xlIGJib3g7XG4gICAgdmFyIG1pblogPSB6T3JkZXIobWluVFgsIG1pblRZLCBtaW5YLCBtaW5ZLCBzaXplKSxcbiAgICAgICAgbWF4WiA9IHpPcmRlcihtYXhUWCwgbWF4VFksIG1pblgsIG1pblksIHNpemUpO1xuXG4gICAgLy8gZmlyc3QgbG9vayBmb3IgcG9pbnRzIGluc2lkZSB0aGUgdHJpYW5nbGUgaW4gaW5jcmVhc2luZyB6LW9yZGVyXG4gICAgdmFyIHAgPSBlYXIubmV4dFo7XG5cbiAgICB3aGlsZSAocCAmJiBwLnogPD0gbWF4Wikge1xuICAgICAgICBpZiAocCAhPT0gZWFyLnByZXYgJiYgcCAhPT0gZWFyLm5leHQgJiZcbiAgICAgICAgICAgIHBvaW50SW5UcmlhbmdsZShhLngsIGEueSwgYi54LCBiLnksIGMueCwgYy55LCBwLngsIHAueSkgJiZcbiAgICAgICAgICAgIGFyZWEocC5wcmV2LCBwLCBwLm5leHQpID49IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgcCA9IHAubmV4dFo7XG4gICAgfVxuXG4gICAgLy8gdGhlbiBsb29rIGZvciBwb2ludHMgaW4gZGVjcmVhc2luZyB6LW9yZGVyXG4gICAgcCA9IGVhci5wcmV2WjtcblxuICAgIHdoaWxlIChwICYmIHAueiA+PSBtaW5aKSB7XG4gICAgICAgIGlmIChwICE9PSBlYXIucHJldiAmJiBwICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIHAueCwgcC55KSAmJlxuICAgICAgICAgICAgYXJlYShwLnByZXYsIHAsIHAubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBwID0gcC5wcmV2WjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gZ28gdGhyb3VnaCBhbGwgcG9seWdvbiBub2RlcyBhbmQgY3VyZSBzbWFsbCBsb2NhbCBzZWxmLWludGVyc2VjdGlvbnNcbmZ1bmN0aW9uIGN1cmVMb2NhbEludGVyc2VjdGlvbnMoc3RhcnQsIHRyaWFuZ2xlcywgZGltKSB7XG4gICAgdmFyIHAgPSBzdGFydDtcbiAgICBkbyB7XG4gICAgICAgIHZhciBhID0gcC5wcmV2LFxuICAgICAgICAgICAgYiA9IHAubmV4dC5uZXh0O1xuXG4gICAgICAgIGlmICghZXF1YWxzKGEsIGIpICYmIGludGVyc2VjdHMoYSwgcCwgcC5uZXh0LCBiKSAmJiBsb2NhbGx5SW5zaWRlKGEsIGIpICYmIGxvY2FsbHlJbnNpZGUoYiwgYSkpIHtcblxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goYS5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKHAuaSAvIGRpbSk7XG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChiLmkgLyBkaW0pO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdHdvIG5vZGVzIGludm9sdmVkXG4gICAgICAgICAgICByZW1vdmVOb2RlKHApO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShwLm5leHQpO1xuXG4gICAgICAgICAgICBwID0gc3RhcnQgPSBiO1xuICAgICAgICB9XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gc3RhcnQpO1xuXG4gICAgcmV0dXJuIHA7XG59XG5cbi8vIHRyeSBzcGxpdHRpbmcgcG9seWdvbiBpbnRvIHR3byBhbmQgdHJpYW5ndWxhdGUgdGhlbSBpbmRlcGVuZGVudGx5XG5mdW5jdGlvbiBzcGxpdEVhcmN1dChzdGFydCwgdHJpYW5nbGVzLCBkaW0sIG1pblgsIG1pblksIHNpemUpIHtcbiAgICAvLyBsb29rIGZvciBhIHZhbGlkIGRpYWdvbmFsIHRoYXQgZGl2aWRlcyB0aGUgcG9seWdvbiBpbnRvIHR3b1xuICAgIHZhciBhID0gc3RhcnQ7XG4gICAgZG8ge1xuICAgICAgICB2YXIgYiA9IGEubmV4dC5uZXh0O1xuICAgICAgICB3aGlsZSAoYiAhPT0gYS5wcmV2KSB7XG4gICAgICAgICAgICBpZiAoYS5pICE9PSBiLmkgJiYgaXNWYWxpZERpYWdvbmFsKGEsIGIpKSB7XG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIHBvbHlnb24gaW4gdHdvIGJ5IHRoZSBkaWFnb25hbFxuICAgICAgICAgICAgICAgIHZhciBjID0gc3BsaXRQb2x5Z29uKGEsIGIpO1xuXG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyIGNvbGluZWFyIHBvaW50cyBhcm91bmQgdGhlIGN1dHNcbiAgICAgICAgICAgICAgICBhID0gZmlsdGVyUG9pbnRzKGEsIGEubmV4dCk7XG4gICAgICAgICAgICAgICAgYyA9IGZpbHRlclBvaW50cyhjLCBjLm5leHQpO1xuXG4gICAgICAgICAgICAgICAgLy8gcnVuIGVhcmN1dCBvbiBlYWNoIGhhbGZcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoYSwgdHJpYW5nbGVzLCBkaW0sIG1pblgsIG1pblksIHNpemUpO1xuICAgICAgICAgICAgICAgIGVhcmN1dExpbmtlZChjLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgc2l6ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYiA9IGIubmV4dDtcbiAgICAgICAgfVxuICAgICAgICBhID0gYS5uZXh0O1xuICAgIH0gd2hpbGUgKGEgIT09IHN0YXJ0KTtcbn1cblxuLy8gbGluayBldmVyeSBob2xlIGludG8gdGhlIG91dGVyIGxvb3AsIHByb2R1Y2luZyBhIHNpbmdsZS1yaW5nIHBvbHlnb24gd2l0aG91dCBob2xlc1xuZnVuY3Rpb24gZWxpbWluYXRlSG9sZXMoZGF0YSwgaG9sZUluZGljZXMsIG91dGVyTm9kZSwgZGltKSB7XG4gICAgdmFyIHF1ZXVlID0gW10sXG4gICAgICAgIGksIGxlbiwgc3RhcnQsIGVuZCwgbGlzdDtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGhvbGVJbmRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHN0YXJ0ID0gaG9sZUluZGljZXNbaV0gKiBkaW07XG4gICAgICAgIGVuZCA9IGkgPCBsZW4gLSAxID8gaG9sZUluZGljZXNbaSArIDFdICogZGltIDogZGF0YS5sZW5ndGg7XG4gICAgICAgIGxpc3QgPSBsaW5rZWRMaXN0KGRhdGEsIHN0YXJ0LCBlbmQsIGRpbSwgZmFsc2UpO1xuICAgICAgICBpZiAobGlzdCA9PT0gbGlzdC5uZXh0KSBsaXN0LnN0ZWluZXIgPSB0cnVlO1xuICAgICAgICBxdWV1ZS5wdXNoKGdldExlZnRtb3N0KGxpc3QpKTtcbiAgICB9XG5cbiAgICBxdWV1ZS5zb3J0KGNvbXBhcmVYKTtcblxuICAgIC8vIHByb2Nlc3MgaG9sZXMgZnJvbSBsZWZ0IHRvIHJpZ2h0XG4gICAgZm9yIChpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsaW1pbmF0ZUhvbGUocXVldWVbaV0sIG91dGVyTm9kZSk7XG4gICAgICAgIG91dGVyTm9kZSA9IGZpbHRlclBvaW50cyhvdXRlck5vZGUsIG91dGVyTm9kZS5uZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0ZXJOb2RlO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlWChhLCBiKSB7XG4gICAgcmV0dXJuIGEueCAtIGIueDtcbn1cblxuLy8gZmluZCBhIGJyaWRnZSBiZXR3ZWVuIHZlcnRpY2VzIHRoYXQgY29ubmVjdHMgaG9sZSB3aXRoIGFuIG91dGVyIHJpbmcgYW5kIGFuZCBsaW5rIGl0XG5mdW5jdGlvbiBlbGltaW5hdGVIb2xlKGhvbGUsIG91dGVyTm9kZSkge1xuICAgIG91dGVyTm9kZSA9IGZpbmRIb2xlQnJpZGdlKGhvbGUsIG91dGVyTm9kZSk7XG4gICAgaWYgKG91dGVyTm9kZSkge1xuICAgICAgICB2YXIgYiA9IHNwbGl0UG9seWdvbihvdXRlck5vZGUsIGhvbGUpO1xuICAgICAgICBmaWx0ZXJQb2ludHMoYiwgYi5uZXh0KTtcbiAgICB9XG59XG5cbi8vIERhdmlkIEViZXJseSdzIGFsZ29yaXRobSBmb3IgZmluZGluZyBhIGJyaWRnZSBiZXR3ZWVuIGhvbGUgYW5kIG91dGVyIHBvbHlnb25cbmZ1bmN0aW9uIGZpbmRIb2xlQnJpZGdlKGhvbGUsIG91dGVyTm9kZSkge1xuICAgIHZhciBwID0gb3V0ZXJOb2RlLFxuICAgICAgICBoeCA9IGhvbGUueCxcbiAgICAgICAgaHkgPSBob2xlLnksXG4gICAgICAgIHF4ID0gLUluZmluaXR5LFxuICAgICAgICBtO1xuXG4gICAgLy8gZmluZCBhIHNlZ21lbnQgaW50ZXJzZWN0ZWQgYnkgYSByYXkgZnJvbSB0aGUgaG9sZSdzIGxlZnRtb3N0IHBvaW50IHRvIHRoZSBsZWZ0O1xuICAgIC8vIHNlZ21lbnQncyBlbmRwb2ludCB3aXRoIGxlc3NlciB4IHdpbGwgYmUgcG90ZW50aWFsIGNvbm5lY3Rpb24gcG9pbnRcbiAgICBkbyB7XG4gICAgICAgIGlmIChoeSA8PSBwLnkgJiYgaHkgPj0gcC5uZXh0LnkpIHtcbiAgICAgICAgICAgIHZhciB4ID0gcC54ICsgKGh5IC0gcC55KSAqIChwLm5leHQueCAtIHAueCkgLyAocC5uZXh0LnkgLSBwLnkpO1xuICAgICAgICAgICAgaWYgKHggPD0gaHggJiYgeCA+IHF4KSB7XG4gICAgICAgICAgICAgICAgcXggPSB4O1xuICAgICAgICAgICAgICAgIGlmICh4ID09PSBoeCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaHkgPT09IHAueSkgcmV0dXJuIHA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoeSA9PT0gcC5uZXh0LnkpIHJldHVybiBwLm5leHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG0gPSBwLnggPCBwLm5leHQueCA/IHAgOiBwLm5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBvdXRlck5vZGUpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gbnVsbDtcblxuICAgIGlmIChoeCA9PT0gcXgpIHJldHVybiBtLnByZXY7IC8vIGhvbGUgdG91Y2hlcyBvdXRlciBzZWdtZW50OyBwaWNrIGxvd2VyIGVuZHBvaW50XG5cbiAgICAvLyBsb29rIGZvciBwb2ludHMgaW5zaWRlIHRoZSB0cmlhbmdsZSBvZiBob2xlIHBvaW50LCBzZWdtZW50IGludGVyc2VjdGlvbiBhbmQgZW5kcG9pbnQ7XG4gICAgLy8gaWYgdGhlcmUgYXJlIG5vIHBvaW50cyBmb3VuZCwgd2UgaGF2ZSBhIHZhbGlkIGNvbm5lY3Rpb247XG4gICAgLy8gb3RoZXJ3aXNlIGNob29zZSB0aGUgcG9pbnQgb2YgdGhlIG1pbmltdW0gYW5nbGUgd2l0aCB0aGUgcmF5IGFzIGNvbm5lY3Rpb24gcG9pbnRcblxuICAgIHZhciBzdG9wID0gbSxcbiAgICAgICAgbXggPSBtLngsXG4gICAgICAgIG15ID0gbS55LFxuICAgICAgICB0YW5NaW4gPSBJbmZpbml0eSxcbiAgICAgICAgdGFuO1xuXG4gICAgcCA9IG0ubmV4dDtcblxuICAgIHdoaWxlIChwICE9PSBzdG9wKSB7XG4gICAgICAgIGlmIChoeCA+PSBwLnggJiYgcC54ID49IG14ICYmXG4gICAgICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGh5IDwgbXkgPyBoeCA6IHF4LCBoeSwgbXgsIG15LCBoeSA8IG15ID8gcXggOiBoeCwgaHksIHAueCwgcC55KSkge1xuXG4gICAgICAgICAgICB0YW4gPSBNYXRoLmFicyhoeSAtIHAueSkgLyAoaHggLSBwLngpOyAvLyB0YW5nZW50aWFsXG5cbiAgICAgICAgICAgIGlmICgodGFuIDwgdGFuTWluIHx8ICh0YW4gPT09IHRhbk1pbiAmJiBwLnggPiBtLngpKSAmJiBsb2NhbGx5SW5zaWRlKHAsIGhvbGUpKSB7XG4gICAgICAgICAgICAgICAgbSA9IHA7XG4gICAgICAgICAgICAgICAgdGFuTWluID0gdGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gbTtcbn1cblxuLy8gaW50ZXJsaW5rIHBvbHlnb24gbm9kZXMgaW4gei1vcmRlclxuZnVuY3Rpb24gaW5kZXhDdXJ2ZShzdGFydCwgbWluWCwgbWluWSwgc2l6ZSkge1xuICAgIHZhciBwID0gc3RhcnQ7XG4gICAgZG8ge1xuICAgICAgICBpZiAocC56ID09PSBudWxsKSBwLnogPSB6T3JkZXIocC54LCBwLnksIG1pblgsIG1pblksIHNpemUpO1xuICAgICAgICBwLnByZXZaID0gcC5wcmV2O1xuICAgICAgICBwLm5leHRaID0gcC5uZXh0O1xuICAgICAgICBwID0gcC5uZXh0O1xuICAgIH0gd2hpbGUgKHAgIT09IHN0YXJ0KTtcblxuICAgIHAucHJldloubmV4dFogPSBudWxsO1xuICAgIHAucHJldlogPSBudWxsO1xuXG4gICAgc29ydExpbmtlZChwKTtcbn1cblxuLy8gU2ltb24gVGF0aGFtJ3MgbGlua2VkIGxpc3QgbWVyZ2Ugc29ydCBhbGdvcml0aG1cbi8vIGh0dHA6Ly93d3cuY2hpYXJrLmdyZWVuZW5kLm9yZy51ay9+c2d0YXRoYW0vYWxnb3JpdGhtcy9saXN0c29ydC5odG1sXG5mdW5jdGlvbiBzb3J0TGlua2VkKGxpc3QpIHtcbiAgICB2YXIgaSwgcCwgcSwgZSwgdGFpbCwgbnVtTWVyZ2VzLCBwU2l6ZSwgcVNpemUsXG4gICAgICAgIGluU2l6ZSA9IDE7XG5cbiAgICBkbyB7XG4gICAgICAgIHAgPSBsaXN0O1xuICAgICAgICBsaXN0ID0gbnVsbDtcbiAgICAgICAgdGFpbCA9IG51bGw7XG4gICAgICAgIG51bU1lcmdlcyA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHApIHtcbiAgICAgICAgICAgIG51bU1lcmdlcysrO1xuICAgICAgICAgICAgcSA9IHA7XG4gICAgICAgICAgICBwU2l6ZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5TaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwU2l6ZSsrO1xuICAgICAgICAgICAgICAgIHEgPSBxLm5leHRaO1xuICAgICAgICAgICAgICAgIGlmICghcSkgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHFTaXplID0gaW5TaXplO1xuXG4gICAgICAgICAgICB3aGlsZSAocFNpemUgPiAwIHx8IChxU2l6ZSA+IDAgJiYgcSkpIHtcblxuICAgICAgICAgICAgICAgIGlmIChwU2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBlID0gcTtcbiAgICAgICAgICAgICAgICAgICAgcSA9IHEubmV4dFo7XG4gICAgICAgICAgICAgICAgICAgIHFTaXplLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxU2l6ZSA9PT0gMCB8fCAhcSkge1xuICAgICAgICAgICAgICAgICAgICBlID0gcDtcbiAgICAgICAgICAgICAgICAgICAgcCA9IHAubmV4dFo7XG4gICAgICAgICAgICAgICAgICAgIHBTaXplLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwLnogPD0gcS56KSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBwO1xuICAgICAgICAgICAgICAgICAgICBwID0gcC5uZXh0WjtcbiAgICAgICAgICAgICAgICAgICAgcFNpemUtLTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlID0gcTtcbiAgICAgICAgICAgICAgICAgICAgcSA9IHEubmV4dFo7XG4gICAgICAgICAgICAgICAgICAgIHFTaXplLS07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRhaWwpIHRhaWwubmV4dFogPSBlO1xuICAgICAgICAgICAgICAgIGVsc2UgbGlzdCA9IGU7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZaID0gdGFpbDtcbiAgICAgICAgICAgICAgICB0YWlsID0gZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcCA9IHE7XG4gICAgICAgIH1cblxuICAgICAgICB0YWlsLm5leHRaID0gbnVsbDtcbiAgICAgICAgaW5TaXplICo9IDI7XG5cbiAgICB9IHdoaWxlIChudW1NZXJnZXMgPiAxKTtcblxuICAgIHJldHVybiBsaXN0O1xufVxuXG4vLyB6LW9yZGVyIG9mIGEgcG9pbnQgZ2l2ZW4gY29vcmRzIGFuZCBzaXplIG9mIHRoZSBkYXRhIGJvdW5kaW5nIGJveFxuZnVuY3Rpb24gek9yZGVyKHgsIHksIG1pblgsIG1pblksIHNpemUpIHtcbiAgICAvLyBjb29yZHMgYXJlIHRyYW5zZm9ybWVkIGludG8gbm9uLW5lZ2F0aXZlIDE1LWJpdCBpbnRlZ2VyIHJhbmdlXG4gICAgeCA9IDMyNzY3ICogKHggLSBtaW5YKSAvIHNpemU7XG4gICAgeSA9IDMyNzY3ICogKHkgLSBtaW5ZKSAvIHNpemU7XG5cbiAgICB4ID0gKHggfCAoeCA8PCA4KSkgJiAweDAwRkYwMEZGO1xuICAgIHggPSAoeCB8ICh4IDw8IDQpKSAmIDB4MEYwRjBGMEY7XG4gICAgeCA9ICh4IHwgKHggPDwgMikpICYgMHgzMzMzMzMzMztcbiAgICB4ID0gKHggfCAoeCA8PCAxKSkgJiAweDU1NTU1NTU1O1xuXG4gICAgeSA9ICh5IHwgKHkgPDwgOCkpICYgMHgwMEZGMDBGRjtcbiAgICB5ID0gKHkgfCAoeSA8PCA0KSkgJiAweDBGMEYwRjBGO1xuICAgIHkgPSAoeSB8ICh5IDw8IDIpKSAmIDB4MzMzMzMzMzM7XG4gICAgeSA9ICh5IHwgKHkgPDwgMSkpICYgMHg1NTU1NTU1NTtcblxuICAgIHJldHVybiB4IHwgKHkgPDwgMSk7XG59XG5cbi8vIGZpbmQgdGhlIGxlZnRtb3N0IG5vZGUgb2YgYSBwb2x5Z29uIHJpbmdcbmZ1bmN0aW9uIGdldExlZnRtb3N0KHN0YXJ0KSB7XG4gICAgdmFyIHAgPSBzdGFydCxcbiAgICAgICAgbGVmdG1vc3QgPSBzdGFydDtcbiAgICBkbyB7XG4gICAgICAgIGlmIChwLnggPCBsZWZ0bW9zdC54KSBsZWZ0bW9zdCA9IHA7XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gc3RhcnQpO1xuXG4gICAgcmV0dXJuIGxlZnRtb3N0O1xufVxuXG4vLyBjaGVjayBpZiBhIHBvaW50IGxpZXMgd2l0aGluIGEgY29udmV4IHRyaWFuZ2xlXG5mdW5jdGlvbiBwb2ludEluVHJpYW5nbGUoYXgsIGF5LCBieCwgYnksIGN4LCBjeSwgcHgsIHB5KSB7XG4gICAgcmV0dXJuIChjeCAtIHB4KSAqIChheSAtIHB5KSAtIChheCAtIHB4KSAqIChjeSAtIHB5KSA+PSAwICYmXG4gICAgICAgICAgIChheCAtIHB4KSAqIChieSAtIHB5KSAtIChieCAtIHB4KSAqIChheSAtIHB5KSA+PSAwICYmXG4gICAgICAgICAgIChieCAtIHB4KSAqIChjeSAtIHB5KSAtIChjeCAtIHB4KSAqIChieSAtIHB5KSA+PSAwO1xufVxuXG4vLyBjaGVjayBpZiBhIGRpYWdvbmFsIGJldHdlZW4gdHdvIHBvbHlnb24gbm9kZXMgaXMgdmFsaWQgKGxpZXMgaW4gcG9seWdvbiBpbnRlcmlvcilcbmZ1bmN0aW9uIGlzVmFsaWREaWFnb25hbChhLCBiKSB7XG4gICAgcmV0dXJuIGEubmV4dC5pICE9PSBiLmkgJiYgYS5wcmV2LmkgIT09IGIuaSAmJiAhaW50ZXJzZWN0c1BvbHlnb24oYSwgYikgJiZcbiAgICAgICAgICAgbG9jYWxseUluc2lkZShhLCBiKSAmJiBsb2NhbGx5SW5zaWRlKGIsIGEpICYmIG1pZGRsZUluc2lkZShhLCBiKTtcbn1cblxuLy8gc2lnbmVkIGFyZWEgb2YgYSB0cmlhbmdsZVxuZnVuY3Rpb24gYXJlYShwLCBxLCByKSB7XG4gICAgcmV0dXJuIChxLnkgLSBwLnkpICogKHIueCAtIHEueCkgLSAocS54IC0gcC54KSAqIChyLnkgLSBxLnkpO1xufVxuXG4vLyBjaGVjayBpZiB0d28gcG9pbnRzIGFyZSBlcXVhbFxuZnVuY3Rpb24gZXF1YWxzKHAxLCBwMikge1xuICAgIHJldHVybiBwMS54ID09PSBwMi54ICYmIHAxLnkgPT09IHAyLnk7XG59XG5cbi8vIGNoZWNrIGlmIHR3byBzZWdtZW50cyBpbnRlcnNlY3RcbmZ1bmN0aW9uIGludGVyc2VjdHMocDEsIHExLCBwMiwgcTIpIHtcbiAgICBpZiAoKGVxdWFscyhwMSwgcTEpICYmIGVxdWFscyhwMiwgcTIpKSB8fFxuICAgICAgICAoZXF1YWxzKHAxLCBxMikgJiYgZXF1YWxzKHAyLCBxMSkpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gYXJlYShwMSwgcTEsIHAyKSA+IDAgIT09IGFyZWEocDEsIHExLCBxMikgPiAwICYmXG4gICAgICAgICAgIGFyZWEocDIsIHEyLCBwMSkgPiAwICE9PSBhcmVhKHAyLCBxMiwgcTEpID4gMDtcbn1cblxuLy8gY2hlY2sgaWYgYSBwb2x5Z29uIGRpYWdvbmFsIGludGVyc2VjdHMgYW55IHBvbHlnb24gc2VnbWVudHNcbmZ1bmN0aW9uIGludGVyc2VjdHNQb2x5Z29uKGEsIGIpIHtcbiAgICB2YXIgcCA9IGE7XG4gICAgZG8ge1xuICAgICAgICBpZiAocC5pICE9PSBhLmkgJiYgcC5uZXh0LmkgIT09IGEuaSAmJiBwLmkgIT09IGIuaSAmJiBwLm5leHQuaSAhPT0gYi5pICYmXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0cyhwLCBwLm5leHQsIGEsIGIpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBhKTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLy8gY2hlY2sgaWYgYSBwb2x5Z29uIGRpYWdvbmFsIGlzIGxvY2FsbHkgaW5zaWRlIHRoZSBwb2x5Z29uXG5mdW5jdGlvbiBsb2NhbGx5SW5zaWRlKGEsIGIpIHtcbiAgICByZXR1cm4gYXJlYShhLnByZXYsIGEsIGEubmV4dCkgPCAwID9cbiAgICAgICAgYXJlYShhLCBiLCBhLm5leHQpID49IDAgJiYgYXJlYShhLCBhLnByZXYsIGIpID49IDAgOlxuICAgICAgICBhcmVhKGEsIGIsIGEucHJldikgPCAwIHx8IGFyZWEoYSwgYS5uZXh0LCBiKSA8IDA7XG59XG5cbi8vIGNoZWNrIGlmIHRoZSBtaWRkbGUgcG9pbnQgb2YgYSBwb2x5Z29uIGRpYWdvbmFsIGlzIGluc2lkZSB0aGUgcG9seWdvblxuZnVuY3Rpb24gbWlkZGxlSW5zaWRlKGEsIGIpIHtcbiAgICB2YXIgcCA9IGEsXG4gICAgICAgIGluc2lkZSA9IGZhbHNlLFxuICAgICAgICBweCA9IChhLnggKyBiLngpIC8gMixcbiAgICAgICAgcHkgPSAoYS55ICsgYi55KSAvIDI7XG4gICAgZG8ge1xuICAgICAgICBpZiAoKChwLnkgPiBweSkgIT09IChwLm5leHQueSA+IHB5KSkgJiYgKHB4IDwgKHAubmV4dC54IC0gcC54KSAqIChweSAtIHAueSkgLyAocC5uZXh0LnkgLSBwLnkpICsgcC54KSlcbiAgICAgICAgICAgIGluc2lkZSA9ICFpbnNpZGU7XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gYSk7XG5cbiAgICByZXR1cm4gaW5zaWRlO1xufVxuXG4vLyBsaW5rIHR3byBwb2x5Z29uIHZlcnRpY2VzIHdpdGggYSBicmlkZ2U7IGlmIHRoZSB2ZXJ0aWNlcyBiZWxvbmcgdG8gdGhlIHNhbWUgcmluZywgaXQgc3BsaXRzIHBvbHlnb24gaW50byB0d287XG4vLyBpZiBvbmUgYmVsb25ncyB0byB0aGUgb3V0ZXIgcmluZyBhbmQgYW5vdGhlciB0byBhIGhvbGUsIGl0IG1lcmdlcyBpdCBpbnRvIGEgc2luZ2xlIHJpbmdcbmZ1bmN0aW9uIHNwbGl0UG9seWdvbihhLCBiKSB7XG4gICAgdmFyIGEyID0gbmV3IE5vZGUoYS5pLCBhLngsIGEueSksXG4gICAgICAgIGIyID0gbmV3IE5vZGUoYi5pLCBiLngsIGIueSksXG4gICAgICAgIGFuID0gYS5uZXh0LFxuICAgICAgICBicCA9IGIucHJldjtcblxuICAgIGEubmV4dCA9IGI7XG4gICAgYi5wcmV2ID0gYTtcblxuICAgIGEyLm5leHQgPSBhbjtcbiAgICBhbi5wcmV2ID0gYTI7XG5cbiAgICBiMi5uZXh0ID0gYTI7XG4gICAgYTIucHJldiA9IGIyO1xuXG4gICAgYnAubmV4dCA9IGIyO1xuICAgIGIyLnByZXYgPSBicDtcblxuICAgIHJldHVybiBiMjtcbn1cblxuLy8gY3JlYXRlIGEgbm9kZSBhbmQgb3B0aW9uYWxseSBsaW5rIGl0IHdpdGggcHJldmlvdXMgb25lIChpbiBhIGNpcmN1bGFyIGRvdWJseSBsaW5rZWQgbGlzdClcbmZ1bmN0aW9uIGluc2VydE5vZGUoaSwgeCwgeSwgbGFzdCkge1xuICAgIHZhciBwID0gbmV3IE5vZGUoaSwgeCwgeSk7XG5cbiAgICBpZiAoIWxhc3QpIHtcbiAgICAgICAgcC5wcmV2ID0gcDtcbiAgICAgICAgcC5uZXh0ID0gcDtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHAubmV4dCA9IGxhc3QubmV4dDtcbiAgICAgICAgcC5wcmV2ID0gbGFzdDtcbiAgICAgICAgbGFzdC5uZXh0LnByZXYgPSBwO1xuICAgICAgICBsYXN0Lm5leHQgPSBwO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTm9kZShwKSB7XG4gICAgcC5uZXh0LnByZXYgPSBwLnByZXY7XG4gICAgcC5wcmV2Lm5leHQgPSBwLm5leHQ7XG5cbiAgICBpZiAocC5wcmV2WikgcC5wcmV2Wi5uZXh0WiA9IHAubmV4dFo7XG4gICAgaWYgKHAubmV4dFopIHAubmV4dFoucHJldlogPSBwLnByZXZaO1xufVxuXG5mdW5jdGlvbiBOb2RlKGksIHgsIHkpIHtcbiAgICAvLyB2ZXJ0aWNlIGluZGV4IGluIGNvb3JkaW5hdGVzIGFycmF5XG4gICAgdGhpcy5pID0gaTtcblxuICAgIC8vIHZlcnRleCBjb29yZGluYXRlc1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcblxuICAgIC8vIHByZXZpb3VzIGFuZCBuZXh0IHZlcnRpY2Ugbm9kZXMgaW4gYSBwb2x5Z29uIHJpbmdcbiAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIHRoaXMubmV4dCA9IG51bGw7XG5cbiAgICAvLyB6LW9yZGVyIGN1cnZlIHZhbHVlXG4gICAgdGhpcy56ID0gbnVsbDtcblxuICAgIC8vIHByZXZpb3VzIGFuZCBuZXh0IG5vZGVzIGluIHotb3JkZXJcbiAgICB0aGlzLnByZXZaID0gbnVsbDtcbiAgICB0aGlzLm5leHRaID0gbnVsbDtcblxuICAgIC8vIGluZGljYXRlcyB3aGV0aGVyIHRoaXMgaXMgYSBzdGVpbmVyIHBvaW50XG4gICAgdGhpcy5zdGVpbmVyID0gZmFsc2U7XG59XG5cbi8vIHJldHVybiBhIHBlcmNlbnRhZ2UgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBwb2x5Z29uIGFyZWEgYW5kIGl0cyB0cmlhbmd1bGF0aW9uIGFyZWE7XG4vLyB1c2VkIHRvIHZlcmlmeSBjb3JyZWN0bmVzcyBvZiB0cmlhbmd1bGF0aW9uXG5lYXJjdXQuZGV2aWF0aW9uID0gZnVuY3Rpb24gKGRhdGEsIGhvbGVJbmRpY2VzLCBkaW0sIHRyaWFuZ2xlcykge1xuICAgIHZhciBoYXNIb2xlcyA9IGhvbGVJbmRpY2VzICYmIGhvbGVJbmRpY2VzLmxlbmd0aDtcbiAgICB2YXIgb3V0ZXJMZW4gPSBoYXNIb2xlcyA/IGhvbGVJbmRpY2VzWzBdICogZGltIDogZGF0YS5sZW5ndGg7XG5cbiAgICB2YXIgcG9seWdvbkFyZWEgPSBNYXRoLmFicyhzaWduZWRBcmVhKGRhdGEsIDAsIG91dGVyTGVuLCBkaW0pKTtcbiAgICBpZiAoaGFzSG9sZXMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGhvbGVJbmRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBob2xlSW5kaWNlc1tpXSAqIGRpbTtcbiAgICAgICAgICAgIHZhciBlbmQgPSBpIDwgbGVuIC0gMSA/IGhvbGVJbmRpY2VzW2kgKyAxXSAqIGRpbSA6IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgcG9seWdvbkFyZWEgLT0gTWF0aC5hYnMoc2lnbmVkQXJlYShkYXRhLCBzdGFydCwgZW5kLCBkaW0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0cmlhbmdsZXNBcmVhID0gMDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIHZhciBhID0gdHJpYW5nbGVzW2ldICogZGltO1xuICAgICAgICB2YXIgYiA9IHRyaWFuZ2xlc1tpICsgMV0gKiBkaW07XG4gICAgICAgIHZhciBjID0gdHJpYW5nbGVzW2kgKyAyXSAqIGRpbTtcbiAgICAgICAgdHJpYW5nbGVzQXJlYSArPSBNYXRoLmFicyhcbiAgICAgICAgICAgIChkYXRhW2FdIC0gZGF0YVtjXSkgKiAoZGF0YVtiICsgMV0gLSBkYXRhW2EgKyAxXSkgLVxuICAgICAgICAgICAgKGRhdGFbYV0gLSBkYXRhW2JdKSAqIChkYXRhW2MgKyAxXSAtIGRhdGFbYSArIDFdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvbHlnb25BcmVhID09PSAwICYmIHRyaWFuZ2xlc0FyZWEgPT09IDAgPyAwIDpcbiAgICAgICAgTWF0aC5hYnMoKHRyaWFuZ2xlc0FyZWEgLSBwb2x5Z29uQXJlYSkgLyBwb2x5Z29uQXJlYSk7XG59O1xuXG5mdW5jdGlvbiBzaWduZWRBcmVhKGRhdGEsIHN0YXJ0LCBlbmQsIGRpbSkge1xuICAgIHZhciBzdW0gPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydCwgaiA9IGVuZCAtIGRpbTsgaSA8IGVuZDsgaSArPSBkaW0pIHtcbiAgICAgICAgc3VtICs9IChkYXRhW2pdIC0gZGF0YVtpXSkgKiAoZGF0YVtpICsgMV0gKyBkYXRhW2ogKyAxXSk7XG4gICAgICAgIGogPSBpO1xuICAgIH1cbiAgICByZXR1cm4gc3VtO1xufVxuXG4vLyB0dXJuIGEgcG9seWdvbiBpbiBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5IGZvcm0gKGUuZy4gYXMgaW4gR2VvSlNPTikgaW50byBhIGZvcm0gRWFyY3V0IGFjY2VwdHNcbmVhcmN1dC5mbGF0dGVuID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXVswXS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IHt2ZXJ0aWNlczogW10sIGhvbGVzOiBbXSwgZGltZW5zaW9uczogZGltfSxcbiAgICAgICAgaG9sZUluZGV4ID0gMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGFbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGltOyBkKyspIHJlc3VsdC52ZXJ0aWNlcy5wdXNoKGRhdGFbaV1bal1bZF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgaG9sZUluZGV4ICs9IGRhdGFbaSAtIDFdLmxlbmd0aDtcbiAgICAgICAgICAgIHJlc3VsdC5ob2xlcy5wdXNoKGhvbGVJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07Il19