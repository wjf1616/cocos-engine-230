
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/compression/gzip.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/

/**
 * See cc.Codec.GZip.gunzip.
 * @param {Array | String} data The bytestream to decompress
 * Constructor
 */
var GZip = function Jacob__GZip(data) {
  this.data = data;
  this.debug = false;
  this.gpflags = undefined;
  this.files = 0;
  this.unzipped = [];
  this.buf32k = new Array(32768);
  this.bIdx = 0;
  this.modeZIP = false;
  this.bytepos = 0;
  this.bb = 1;
  this.bits = 0;
  this.nameBuf = [];
  this.fileout = undefined;
  this.literalTree = new Array(GZip.LITERALS);
  this.distanceTree = new Array(32);
  this.treepos = 0;
  this.Places = null;
  this.len = 0;
  this.fpos = new Array(17);
  this.fpos[0] = 0;
  this.flens = undefined;
  this.fmax = undefined;
};
/**
 * Unzips the gzipped data of the 'data' argument.
 * @param string  The bytestream to decompress. Either an array of Integers between 0 and 255, or a String.
 * @return {String}
 */


GZip.gunzip = function (string) {
  if (string.constructor === Array) {} else if (string.constructor === String) {}

  var gzip = new GZip(string);
  return gzip.gunzip()[0][0];
};

GZip.HufNode = function () {
  this.b0 = 0;
  this.b1 = 0;
  this.jump = null;
  this.jumppos = -1;
};
/**
 * @constant
 * @type Number
 */


GZip.LITERALS = 288;
/**
 * @constant
 * @type Number
 */

GZip.NAMEMAX = 256;
GZip.bitReverse = [0x00, 0x80, 0x40, 0xc0, 0x20, 0xa0, 0x60, 0xe0, 0x10, 0x90, 0x50, 0xd0, 0x30, 0xb0, 0x70, 0xf0, 0x08, 0x88, 0x48, 0xc8, 0x28, 0xa8, 0x68, 0xe8, 0x18, 0x98, 0x58, 0xd8, 0x38, 0xb8, 0x78, 0xf8, 0x04, 0x84, 0x44, 0xc4, 0x24, 0xa4, 0x64, 0xe4, 0x14, 0x94, 0x54, 0xd4, 0x34, 0xb4, 0x74, 0xf4, 0x0c, 0x8c, 0x4c, 0xcc, 0x2c, 0xac, 0x6c, 0xec, 0x1c, 0x9c, 0x5c, 0xdc, 0x3c, 0xbc, 0x7c, 0xfc, 0x02, 0x82, 0x42, 0xc2, 0x22, 0xa2, 0x62, 0xe2, 0x12, 0x92, 0x52, 0xd2, 0x32, 0xb2, 0x72, 0xf2, 0x0a, 0x8a, 0x4a, 0xca, 0x2a, 0xaa, 0x6a, 0xea, 0x1a, 0x9a, 0x5a, 0xda, 0x3a, 0xba, 0x7a, 0xfa, 0x06, 0x86, 0x46, 0xc6, 0x26, 0xa6, 0x66, 0xe6, 0x16, 0x96, 0x56, 0xd6, 0x36, 0xb6, 0x76, 0xf6, 0x0e, 0x8e, 0x4e, 0xce, 0x2e, 0xae, 0x6e, 0xee, 0x1e, 0x9e, 0x5e, 0xde, 0x3e, 0xbe, 0x7e, 0xfe, 0x01, 0x81, 0x41, 0xc1, 0x21, 0xa1, 0x61, 0xe1, 0x11, 0x91, 0x51, 0xd1, 0x31, 0xb1, 0x71, 0xf1, 0x09, 0x89, 0x49, 0xc9, 0x29, 0xa9, 0x69, 0xe9, 0x19, 0x99, 0x59, 0xd9, 0x39, 0xb9, 0x79, 0xf9, 0x05, 0x85, 0x45, 0xc5, 0x25, 0xa5, 0x65, 0xe5, 0x15, 0x95, 0x55, 0xd5, 0x35, 0xb5, 0x75, 0xf5, 0x0d, 0x8d, 0x4d, 0xcd, 0x2d, 0xad, 0x6d, 0xed, 0x1d, 0x9d, 0x5d, 0xdd, 0x3d, 0xbd, 0x7d, 0xfd, 0x03, 0x83, 0x43, 0xc3, 0x23, 0xa3, 0x63, 0xe3, 0x13, 0x93, 0x53, 0xd3, 0x33, 0xb3, 0x73, 0xf3, 0x0b, 0x8b, 0x4b, 0xcb, 0x2b, 0xab, 0x6b, 0xeb, 0x1b, 0x9b, 0x5b, 0xdb, 0x3b, 0xbb, 0x7b, 0xfb, 0x07, 0x87, 0x47, 0xc7, 0x27, 0xa7, 0x67, 0xe7, 0x17, 0x97, 0x57, 0xd7, 0x37, 0xb7, 0x77, 0xf7, 0x0f, 0x8f, 0x4f, 0xcf, 0x2f, 0xaf, 0x6f, 0xef, 0x1f, 0x9f, 0x5f, 0xdf, 0x3f, 0xbf, 0x7f, 0xff];
GZip.cplens = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
GZip.cplext = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99];
/* 99==invalid */

GZip.cpdist = [0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0007, 0x0009, 0x000d, 0x0011, 0x0019, 0x0021, 0x0031, 0x0041, 0x0061, 0x0081, 0x00c1, 0x0101, 0x0181, 0x0201, 0x0301, 0x0401, 0x0601, 0x0801, 0x0c01, 0x1001, 0x1801, 0x2001, 0x3001, 0x4001, 0x6001];
GZip.cpdext = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
GZip.border = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
/**
 * gunzip
 * @return {Array}
 */

GZip.prototype.gunzip = function () {
  this.outputArr = []; //convertToByteArray(input);
  //if (this.debug) alert(this.data);

  this.nextFile();
  return this.unzipped;
};

GZip.prototype.readByte = function () {
  this.bits += 8;

  if (this.bytepos < this.data.length) {
    //return this.data[this.bytepos++]; // Array
    return this.data.charCodeAt(this.bytepos++);
  } else {
    return -1;
  }
};

GZip.prototype.byteAlign = function () {
  this.bb = 1;
};

GZip.prototype.readBit = function () {
  var carry;
  this.bits++;
  carry = this.bb & 1;
  this.bb >>= 1;

  if (this.bb === 0) {
    this.bb = this.readByte();
    carry = this.bb & 1;
    this.bb = this.bb >> 1 | 0x80;
  }

  return carry;
};

GZip.prototype.readBits = function (a) {
  var res = 0,
      i = a;

  while (i--) {
    res = res << 1 | this.readBit();
  }

  if (a) res = GZip.bitReverse[res] >> 8 - a;
  return res;
};

GZip.prototype.flushBuffer = function () {
  this.bIdx = 0;
};

GZip.prototype.addBuffer = function (a) {
  this.buf32k[this.bIdx++] = a;
  this.outputArr.push(String.fromCharCode(a));
  if (this.bIdx === 0x8000) this.bIdx = 0;
};

GZip.prototype.IsPat = function () {
  while (1) {
    if (this.fpos[this.len] >= this.fmax) return -1;
    if (this.flens[this.fpos[this.len]] === this.len) return this.fpos[this.len]++;
    this.fpos[this.len]++;
  }
};

GZip.prototype.Rec = function () {
  var curplace = this.Places[this.treepos];
  var tmp; //if (this.debug) document.write("<br>len:"+this.len+" treepos:"+this.treepos);

  if (this.len === 17) {
    //war 17
    return -1;
  }

  this.treepos++;
  this.len++;
  tmp = this.IsPat(); //if (this.debug) document.write("<br>IsPat "+tmp);

  if (tmp >= 0) {
    curplace.b0 = tmp;
    /* leaf cell for 0-bit */
    //if (this.debug) document.write("<br>b0 "+curplace.b0);
  } else {
    /* Not a Leaf cell */
    curplace.b0 = 0x8000; //if (this.debug) document.write("<br>b0 "+curplace.b0);

    if (this.Rec()) return -1;
  }

  tmp = this.IsPat();

  if (tmp >= 0) {
    curplace.b1 = tmp;
    /* leaf cell for 1-bit */
    //if (this.debug) document.write("<br>b1 "+curplace.b1);

    curplace.jump = null;
    /* Just for the display routine */
  } else {
    /* Not a Leaf cell */
    curplace.b1 = 0x8000; //if (this.debug) document.write("<br>b1 "+curplace.b1);

    curplace.jump = this.Places[this.treepos];
    curplace.jumppos = this.treepos;
    if (this.Rec()) return -1;
  }

  this.len--;
  return 0;
};

GZip.prototype.CreateTree = function (currentTree, numval, lengths, show) {
  var i;
  /* Create the Huffman decode tree/table */
  //if (this.debug) document.write("currentTree "+currentTree+" numval "+numval+" lengths "+lengths+" show "+show);

  this.Places = currentTree;
  this.treepos = 0;
  this.flens = lengths;
  this.fmax = numval;

  for (i = 0; i < 17; i++) {
    this.fpos[i] = 0;
  }

  this.len = 0;

  if (this.Rec()) {
    //if (this.debug) alert("invalid huffman tree\n");
    return -1;
  } // if (this.debug) {
  //   document.write('<br>Tree: '+this.Places.length);
  //   for (var a=0;a<32;a++){
  //     document.write("Places["+a+"].b0="+this.Places[a].b0+"<br>");
  //     document.write("Places["+a+"].b1="+this.Places[a].b1+"<br>");
  //   }
  // }


  return 0;
};

GZip.prototype.DecodeValue = function (currentTree) {
  var len,
      i,
      xtreepos = 0,
      X = currentTree[xtreepos],
      b;
  /* decode one symbol of the data */

  while (1) {
    b = this.readBit(); // if (this.debug) document.write("b="+b);

    if (b) {
      if (!(X.b1 & 0x8000)) {
        // if (this.debug) document.write("ret1");
        return X.b1;
        /* If leaf node, return data */
      }

      X = X.jump;
      len = currentTree.length;

      for (i = 0; i < len; i++) {
        if (currentTree[i] === X) {
          xtreepos = i;
          break;
        }
      }
    } else {
      if (!(X.b0 & 0x8000)) {
        // if (this.debug) document.write("ret2");
        return X.b0;
        /* If leaf node, return data */
      }

      xtreepos++;
      X = currentTree[xtreepos];
    }
  } // if (this.debug) document.write("ret3");


  return -1;
};

GZip.prototype.DeflateLoop = function () {
  var last, c, type, i, len;

  do {
    last = this.readBit();
    type = this.readBits(2);

    if (type === 0) {
      var blockLen, cSum; // Stored

      this.byteAlign();
      blockLen = this.readByte();
      blockLen |= this.readByte() << 8;
      cSum = this.readByte();
      cSum |= this.readByte() << 8;

      if ((blockLen ^ ~cSum) & 0xffff) {
        document.write("BlockLen checksum mismatch\n"); // FIXME: use throw
      }

      while (blockLen--) {
        c = this.readByte();
        this.addBuffer(c);
      }
    } else if (type === 1) {
      var j;
      /* Fixed Huffman tables -- fixed decode routine */

      while (1) {
        /*
         256    0000000        0
         :   :     :
         279    0010111        23
         0   00110000    48
         :    :      :
         143    10111111    191
         280 11000000    192
         :    :      :
         287 11000111    199
         144    110010000    400
         :    :       :
         255    111111111    511
          Note the bit order!
         */
        j = GZip.bitReverse[this.readBits(7)] >> 1;

        if (j > 23) {
          j = j << 1 | this.readBit();
          /* 48..255 */

          if (j > 199) {
            /* 200..255 */
            j -= 128;
            /*  72..127 */

            j = j << 1 | this.readBit();
            /* 144..255 << */
          } else {
            /*  48..199 */
            j -= 48;
            /*   0..151 */

            if (j > 143) {
              j = j + 136;
              /* 280..287 << */

              /*   0..143 << */
            }
          }
        } else {
          /*   0..23 */
          j += 256;
          /* 256..279 << */
        }

        if (j < 256) {
          this.addBuffer(j);
        } else if (j === 256) {
          /* EOF */
          break; // FIXME: make this the loop-condition
        } else {
          var len, dist;
          j -= 256 + 1;
          /* bytes + EOF */

          len = this.readBits(GZip.cplext[j]) + GZip.cplens[j];
          j = GZip.bitReverse[this.readBits(5)] >> 3;

          if (GZip.cpdext[j] > 8) {
            dist = this.readBits(8);
            dist |= this.readBits(GZip.cpdext[j] - 8) << 8;
          } else {
            dist = this.readBits(GZip.cpdext[j]);
          }

          dist += GZip.cpdist[j];

          for (j = 0; j < len; j++) {
            var c = this.buf32k[this.bIdx - dist & 0x7fff];
            this.addBuffer(c);
          }
        }
      } // while

    } else if (type === 2) {
      var j, n, literalCodes, distCodes, lenCodes;
      var ll = new Array(288 + 32); // "static" just to preserve stack
      // Dynamic Huffman tables

      literalCodes = 257 + this.readBits(5);
      distCodes = 1 + this.readBits(5);
      lenCodes = 4 + this.readBits(4);

      for (j = 0; j < 19; j++) {
        ll[j] = 0;
      } // Get the decode tree code lengths


      for (j = 0; j < lenCodes; j++) {
        ll[GZip.border[j]] = this.readBits(3);
      }

      len = this.distanceTree.length;

      for (i = 0; i < len; i++) {
        this.distanceTree[i] = new GZip.HufNode();
      }

      if (this.CreateTree(this.distanceTree, 19, ll, 0)) {
        this.flushBuffer();
        return 1;
      } // if (this.debug) {
      //   document.write("<br>distanceTree");
      //   for(var a=0;a<this.distanceTree.length;a++){
      //     document.write("<br>"+this.distanceTree[a].b0+" "+this.distanceTree[a].b1+" "+this.distanceTree[a].jump+" "+this.distanceTree[a].jumppos);
      //   }
      // }
      //read in literal and distance code lengths


      n = literalCodes + distCodes;
      i = 0;
      var z = -1; // if (this.debug) document.write("<br>n="+n+" bits: "+this.bits+"<br>");

      while (i < n) {
        z++;
        j = this.DecodeValue(this.distanceTree); // if (this.debug) document.write("<br>"+z+" i:"+i+" decode: "+j+"    bits "+this.bits+"<br>");

        if (j < 16) {
          // length of code in bits (0..15)
          ll[i++] = j;
        } else if (j === 16) {
          // repeat last length 3 to 6 times
          var l;
          j = 3 + this.readBits(2);

          if (i + j > n) {
            this.flushBuffer();
            return 1;
          }

          l = i ? ll[i - 1] : 0;

          while (j--) {
            ll[i++] = l;
          }
        } else {
          if (j === 17) {
            // 3 to 10 zero length codes
            j = 3 + this.readBits(3);
          } else {
            // j == 18: 11 to 138 zero length codes
            j = 11 + this.readBits(7);
          }

          if (i + j > n) {
            this.flushBuffer();
            return 1;
          }

          while (j--) {
            ll[i++] = 0;
          }
        }
      } // while
      // Can overwrite tree decode tree as it is not used anymore


      len = this.literalTree.length;

      for (i = 0; i < len; i++) {
        this.literalTree[i] = new GZip.HufNode();
      }

      if (this.CreateTree(this.literalTree, literalCodes, ll, 0)) {
        this.flushBuffer();
        return 1;
      }

      len = this.literalTree.length;

      for (i = 0; i < len; i++) {
        this.distanceTree[i] = new GZip.HufNode();
      }

      var ll2 = new Array();

      for (i = literalCodes; i < ll.length; i++) {
        ll2[i - literalCodes] = ll[i];
      }

      if (this.CreateTree(this.distanceTree, distCodes, ll2, 0)) {
        this.flushBuffer();
        return 1;
      } // if (this.debug) document.write("<br>literalTree");


      while (1) {
        j = this.DecodeValue(this.literalTree);

        if (j >= 256) {
          // In C64: if carry set
          var len, dist;
          j -= 256;

          if (j === 0) {
            // EOF
            break;
          }

          j--;
          len = this.readBits(GZip.cplext[j]) + GZip.cplens[j];
          j = this.DecodeValue(this.distanceTree);

          if (GZip.cpdext[j] > 8) {
            dist = this.readBits(8);
            dist |= this.readBits(GZip.cpdext[j] - 8) << 8;
          } else {
            dist = this.readBits(GZip.cpdext[j]);
          }

          dist += GZip.cpdist[j];

          while (len--) {
            var c = this.buf32k[this.bIdx - dist & 0x7fff];
            this.addBuffer(c);
          }
        } else {
          this.addBuffer(j);
        }
      } // while

    }
  } while (!last);

  this.flushBuffer();
  this.byteAlign();
  return 0;
};

GZip.prototype.unzipFile = function (name) {
  var i;
  this.gunzip();

  for (i = 0; i < this.unzipped.length; i++) {
    if (this.unzipped[i][1] === name) {
      return this.unzipped[i][0];
    }
  }
};

GZip.prototype.nextFile = function () {
  // if (this.debug) alert("NEXTFILE");
  this.outputArr = [];
  this.modeZIP = false;
  var tmp = [];
  tmp[0] = this.readByte();
  tmp[1] = this.readByte(); // if (this.debug) alert("type: "+tmp[0]+" "+tmp[1]);

  if (tmp[0] === 0x78 && tmp[1] === 0xda) {
    //GZIP
    // if (this.debug) alert("GEONExT-GZIP");
    this.DeflateLoop(); // if (this.debug) alert(this.outputArr.join(''));

    this.unzipped[this.files] = [this.outputArr.join(''), "geonext.gxt"];
    this.files++;
  }

  if (tmp[0] === 0x1f && tmp[1] === 0x8b) {
    //GZIP
    // if (this.debug) alert("GZIP");
    this.skipdir(); // if (this.debug) alert(this.outputArr.join(''));

    this.unzipped[this.files] = [this.outputArr.join(''), "file"];
    this.files++;
  }

  if (tmp[0] === 0x50 && tmp[1] === 0x4b) {
    //ZIP
    this.modeZIP = true;
    tmp[2] = this.readByte();
    tmp[3] = this.readByte();

    if (tmp[2] === 0x03 && tmp[3] === 0x04) {
      //MODE_ZIP
      tmp[0] = this.readByte();
      tmp[1] = this.readByte(); // if (this.debug) alert("ZIP-Version: "+tmp[1]+" "+tmp[0]/10+"."+tmp[0]%10);

      this.gpflags = this.readByte();
      this.gpflags |= this.readByte() << 8; // if (this.debug) alert("gpflags: "+this.gpflags);

      var method = this.readByte();
      method |= this.readByte() << 8; // if (this.debug) alert("method: "+method);

      this.readByte();
      this.readByte();
      this.readByte();
      this.readByte(); //       var crc = this.readByte();
      //       crc |= (this.readByte()<<8);
      //       crc |= (this.readByte()<<16);
      //       crc |= (this.readByte()<<24);

      var compSize = this.readByte();
      compSize |= this.readByte() << 8;
      compSize |= this.readByte() << 16;
      compSize |= this.readByte() << 24;
      var size = this.readByte();
      size |= this.readByte() << 8;
      size |= this.readByte() << 16;
      size |= this.readByte() << 24; // if (this.debug) alert("local CRC: "+crc+"\nlocal Size: "+size+"\nlocal CompSize: "+compSize);

      var filelen = this.readByte();
      filelen |= this.readByte() << 8;
      var extralen = this.readByte();
      extralen |= this.readByte() << 8; // if (this.debug) alert("filelen "+filelen);

      i = 0;
      this.nameBuf = [];

      while (filelen--) {
        var c = this.readByte();

        if (c === "/" | c === ":") {
          i = 0;
        } else if (i < GZip.NAMEMAX - 1) {
          this.nameBuf[i++] = String.fromCharCode(c);
        }
      } // if (this.debug) alert("nameBuf: "+this.nameBuf);


      if (!this.fileout) this.fileout = this.nameBuf;
      var i = 0;

      while (i < extralen) {
        c = this.readByte();
        i++;
      } // if (size = 0 && this.fileOut.charAt(this.fileout.length-1)=="/"){
      //   //skipdir
      //   // if (this.debug) alert("skipdir");
      // }


      if (method === 8) {
        this.DeflateLoop(); // if (this.debug) alert(this.outputArr.join(''));

        this.unzipped[this.files] = [this.outputArr.join(''), this.nameBuf.join('')];
        this.files++;
      }

      this.skipdir();
    }
  }
};

GZip.prototype.skipdir = function () {
  var tmp = [];
  var compSize, size, os, i, c;

  if (this.gpflags & 8) {
    tmp[0] = this.readByte();
    tmp[1] = this.readByte();
    tmp[2] = this.readByte();
    tmp[3] = this.readByte(); //     if (tmp[0] == 0x50 && tmp[1] == 0x4b && tmp[2] == 0x07 && tmp[3] == 0x08) {
    //       crc = this.readByte();
    //       crc |= (this.readByte()<<8);
    //       crc |= (this.readByte()<<16);
    //       crc |= (this.readByte()<<24);
    //     } else {
    //       crc = tmp[0] | (tmp[1]<<8) | (tmp[2]<<16) | (tmp[3]<<24);
    //     }

    compSize = this.readByte();
    compSize |= this.readByte() << 8;
    compSize |= this.readByte() << 16;
    compSize |= this.readByte() << 24;
    size = this.readByte();
    size |= this.readByte() << 8;
    size |= this.readByte() << 16;
    size |= this.readByte() << 24;
  }

  if (this.modeZIP) this.nextFile();
  tmp[0] = this.readByte();

  if (tmp[0] !== 8) {
    // if (this.debug) alert("Unknown compression method!");
    return 0;
  }

  this.gpflags = this.readByte(); // if (this.debug && (this.gpflags & ~(0x1f))) alert("Unknown flags set!");

  this.readByte();
  this.readByte();
  this.readByte();
  this.readByte();
  this.readByte();
  os = this.readByte();

  if (this.gpflags & 4) {
    tmp[0] = this.readByte();
    tmp[2] = this.readByte();
    this.len = tmp[0] + 256 * tmp[1]; // if (this.debug) alert("Extra field size: "+this.len);

    for (i = 0; i < this.len; i++) {
      this.readByte();
    }
  }

  if (this.gpflags & 8) {
    i = 0;
    this.nameBuf = [];

    while (c = this.readByte()) {
      if (c === "7" || c === ":") i = 0;
      if (i < GZip.NAMEMAX - 1) this.nameBuf[i++] = c;
    } //this.nameBuf[i] = "\0";
    // if (this.debug) alert("original file name: "+this.nameBuf);

  }

  if (this.gpflags & 16) {
    while (c = this.readByte()) {// FIXME: looks like they read to the end of the stream, should be doable more efficiently
      //FILE COMMENT
    }
  }

  if (this.gpflags & 2) {
    this.readByte();
    this.readByte();
  }

  this.DeflateLoop(); //   crc = this.readByte();
  //   crc |= (this.readByte()<<8);
  //   crc |= (this.readByte()<<16);
  //   crc |= (this.readByte()<<24);

  size = this.readByte();
  size |= this.readByte() << 8;
  size |= this.readByte() << 16;
  size |= this.readByte() << 24;
  if (this.modeZIP) this.nextFile();
};

module.exports = GZip;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImd6aXAuanMiXSwibmFtZXMiOlsiR1ppcCIsIkphY29iX19HWmlwIiwiZGF0YSIsImRlYnVnIiwiZ3BmbGFncyIsInVuZGVmaW5lZCIsImZpbGVzIiwidW56aXBwZWQiLCJidWYzMmsiLCJBcnJheSIsImJJZHgiLCJtb2RlWklQIiwiYnl0ZXBvcyIsImJiIiwiYml0cyIsIm5hbWVCdWYiLCJmaWxlb3V0IiwibGl0ZXJhbFRyZWUiLCJMSVRFUkFMUyIsImRpc3RhbmNlVHJlZSIsInRyZWVwb3MiLCJQbGFjZXMiLCJsZW4iLCJmcG9zIiwiZmxlbnMiLCJmbWF4IiwiZ3VuemlwIiwic3RyaW5nIiwiY29uc3RydWN0b3IiLCJTdHJpbmciLCJnemlwIiwiSHVmTm9kZSIsImIwIiwiYjEiLCJqdW1wIiwianVtcHBvcyIsIk5BTUVNQVgiLCJiaXRSZXZlcnNlIiwiY3BsZW5zIiwiY3BsZXh0IiwiY3BkaXN0IiwiY3BkZXh0IiwiYm9yZGVyIiwicHJvdG90eXBlIiwib3V0cHV0QXJyIiwibmV4dEZpbGUiLCJyZWFkQnl0ZSIsImxlbmd0aCIsImNoYXJDb2RlQXQiLCJieXRlQWxpZ24iLCJyZWFkQml0IiwiY2FycnkiLCJyZWFkQml0cyIsImEiLCJyZXMiLCJpIiwiZmx1c2hCdWZmZXIiLCJhZGRCdWZmZXIiLCJwdXNoIiwiZnJvbUNoYXJDb2RlIiwiSXNQYXQiLCJSZWMiLCJjdXJwbGFjZSIsInRtcCIsIkNyZWF0ZVRyZWUiLCJjdXJyZW50VHJlZSIsIm51bXZhbCIsImxlbmd0aHMiLCJzaG93IiwiRGVjb2RlVmFsdWUiLCJ4dHJlZXBvcyIsIlgiLCJiIiwiRGVmbGF0ZUxvb3AiLCJsYXN0IiwiYyIsInR5cGUiLCJibG9ja0xlbiIsImNTdW0iLCJkb2N1bWVudCIsIndyaXRlIiwiaiIsImRpc3QiLCJuIiwibGl0ZXJhbENvZGVzIiwiZGlzdENvZGVzIiwibGVuQ29kZXMiLCJsbCIsInoiLCJsIiwibGwyIiwidW56aXBGaWxlIiwibmFtZSIsImpvaW4iLCJza2lwZGlyIiwibWV0aG9kIiwiY29tcFNpemUiLCJzaXplIiwiZmlsZWxlbiIsImV4dHJhbGVuIiwib3MiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQU1BOzs7OztBQUtBLElBQUlBLElBQUksR0FBRyxTQUFTQyxXQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUNsQyxPQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFFQSxPQUFLQyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUtDLE9BQUwsR0FBZUMsU0FBZjtBQUNBLE9BQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLE9BQUtDLE1BQUwsR0FBYyxJQUFJQyxLQUFKLENBQVUsS0FBVixDQUFkO0FBQ0EsT0FBS0MsSUFBTCxHQUFZLENBQVo7QUFDQSxPQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBLE9BQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0EsT0FBS0MsRUFBTCxHQUFVLENBQVY7QUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsT0FBS0MsT0FBTCxHQUFlWCxTQUFmO0FBQ0EsT0FBS1ksV0FBTCxHQUFtQixJQUFJUixLQUFKLENBQVVULElBQUksQ0FBQ2tCLFFBQWYsQ0FBbkI7QUFDQSxPQUFLQyxZQUFMLEdBQW9CLElBQUlWLEtBQUosQ0FBVSxFQUFWLENBQXBCO0FBQ0EsT0FBS1csT0FBTCxHQUFlLENBQWY7QUFDQSxPQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLE9BQUtDLEdBQUwsR0FBVyxDQUFYO0FBQ0EsT0FBS0MsSUFBTCxHQUFZLElBQUlkLEtBQUosQ0FBVSxFQUFWLENBQVo7QUFDQSxPQUFLYyxJQUFMLENBQVUsQ0FBVixJQUFlLENBQWY7QUFDQSxPQUFLQyxLQUFMLEdBQWFuQixTQUFiO0FBQ0EsT0FBS29CLElBQUwsR0FBWXBCLFNBQVo7QUFDSCxDQXhCRDtBQTBCQTs7Ozs7OztBQUtBTCxJQUFJLENB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STZCLENBQUMsS0FBSyxHQUFOLElBQWFBLENBQUMsS0FBSyxHQUF2QixFQUNJcEIsQ0FBQyxHQUFHLENBQUo7QUFDSixVQUFJQSxDQUFDLEdBQUd2RCxJQUFJLENBQUNvQyxPQUFMLEdBQWUsQ0FBdkIsRUFDSSxLQUFLckIsT0FBTCxDQUFhd0MsQ0FBQyxFQUFkLElBQW9Cb0IsQ0FBcEI7QUFDUCxLQVJtQixDQVNwQjtBQUNBOztBQUNIOztBQUVELE1BQUssS0FBS3ZFLE9BQUwsR0FBZSxFQUFwQixFQUF5QjtBQUNyQixXQUFPdUUsQ0FBQyxHQUFHLEtBQUs3QixRQUFMLEVBQVgsRUFBNEIsQ0FBRTtBQUMxQjtBQUNIO0FBQ0o7O0FBRUQsTUFBSyxLQUFLMUMsT0FBTCxHQUFlLENBQXBCLEVBQXdCO0FBQ3BCLFNBQUswQyxRQUFMO0FBQ0EsU0FBS0EsUUFBTDtBQUNIOztBQUVELE9BQUsyQixXQUFMLEdBbEZpQyxDQW9GckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUl3QixFQUFBQSxJQUFJLEdBQUcsS0FBS25ELFFBQUwsRUFBUDtBQUNBbUQsRUFBQUEsSUFBSSxJQUFLLEtBQUtuRCxRQUFMLE1BQW1CLENBQTVCO0FBQ0FtRCxFQUFBQSxJQUFJLElBQUssS0FBS25ELFFBQUwsTUFBbUIsRUFBNUI7QUFDQW1ELEVBQUFBLElBQUksSUFBSyxLQUFLbkQsUUFBTCxNQUFtQixFQUE1QjtBQUVBLE1BQUksS0FBS25DLE9BQVQsRUFBa0IsS0FBS2tDLFFBQUw7QUFDckIsQ0EvRkQ7O0FBaUdBd0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdEcsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tXG4gQ29weXJpZ2h0IDIwMDktMjAxMCBieSBTdGVmYW4gUnVzdGVyaG9sei5cbiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuIFlvdSBjYW4gY2hvb3NlIGJldHdlZW4gTUlUIGFuZCBCU0QtMy1DbGF1c2UgbGljZW5zZS4gTGljZW5zZSBmaWxlIHdpbGwgYmUgYWRkZWQgbGF0ZXIuXG4gLS0qL1xuXG4vKipcbiAqIFNlZSBjYy5Db2RlYy5HWmlwLmd1bnppcC5cbiAqIEBwYXJhbSB7QXJyYXkgfCBTdHJpbmd9IGRhdGEgVGhlIGJ5dGVzdHJlYW0gdG8gZGVjb21wcmVzc1xuICogQ29uc3RydWN0b3JcbiAqL1xudmFyIEdaaXAgPSBmdW5jdGlvbiBKYWNvYl9fR1ppcChkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIHRoaXMuZGVidWcgPSBmYWxzZTtcbiAgICB0aGlzLmdwZmxhZ3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maWxlcyA9IDA7XG4gICAgdGhpcy51bnppcHBlZCA9IFtdO1xuICAgIHRoaXMuYnVmMzJrID0gbmV3IEFycmF5KDMyNzY4KTtcbiAgICB0aGlzLmJJZHggPSAwO1xuICAgIHRoaXMubW9kZVpJUCA9IGZhbHNlO1xuICAgIHRoaXMuYnl0ZXBvcyA9IDA7XG4gICAgdGhpcy5iYiA9IDE7XG4gICAgdGhpcy5iaXRzID0gMDtcbiAgICB0aGlzLm5hbWVCdWYgPSBbXTtcbiAgICB0aGlzLmZpbGVvdXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5saXRlcmFsVHJlZSA9IG5ldyBBcnJheShHWmlwLkxJVEVSQUxTKTtcbiAgICB0aGlzLmRpc3RhbmNlVHJlZSA9IG5ldyBBcnJheSgzMik7XG4gICAgdGhpcy50cmVlcG9zID0gMDtcbiAgICB0aGlzLlBsYWNlcyA9IG51bGw7XG4gICAgdGhpcy5sZW4gPSAwO1xuICAgIHRoaXMuZnBvcyA9IG5ldyBBcnJheSgxNyk7XG4gICAgdGhpcy5mcG9zWzBdID0gMDtcbiAgICB0aGlzLmZsZW5zID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZm1heCA9IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogVW56aXBzIHRoZSBnemlwcGVkIGRhdGEgb2YgdGhlICdkYXRhJyBhcmd1bWVudC5cbiAqIEBwYXJhbSBzdHJpbmcgIFRoZSBieXRlc3RyZWFtIHRvIGRlY29tcHJlc3MuIEVpdGhlciBhbiBhcnJheSBvZiBJbnRlZ2VycyBiZXR3ZWVuIDAgYW5kIDI1NSwgb3IgYSBTdHJpbmcuXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbkdaaXAuZ3VuemlwID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgIGlmIChzdHJpbmcuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgfSBlbHNlIGlmIChzdHJpbmcuY29uc3RydWN0b3IgPT09IFN0cmluZykge1xuICAgIH1cbiAgICB2YXIgZ3ppcCA9IG5ldyBHWmlwKHN0cmluZyk7XG4gICAgcmV0dXJuIGd6aXAuZ3VuemlwKClbMF1bMF07XG59O1xuXG5HWmlwLkh1Zk5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5iMCA9IDA7XG4gICAgdGhpcy5iMSA9IDA7XG4gICAgdGhpcy5qdW1wID0gbnVsbDtcbiAgICB0aGlzLmp1bXBwb3MgPSAtMTtcbn07XG5cbi8qKlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSBOdW1iZXJcbiAqL1xuR1ppcC5MSVRFUkFMUyA9IDI4ODtcbi8qKlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSBOdW1iZXJcbiAqL1xuR1ppcC5OQU1FTUFYID0gMjU2O1xuXG5HWmlwLmJpdFJldmVyc2UgPSBbXG4gICAgMHgwMCwgMHg4MCwgMHg0MCwgMHhjMCwgMHgyMCwgMHhhMCwgMHg2MCwgMHhlMCxcbiAgICAweDEwLCAweDkwLCAweDUwLCAweGQwLCAweDMwLCAweGIwLCAweDcwLCAweGYwLFxuICAgIDB4MDgsIDB4ODgsIDB4NDgsIDB4YzgsIDB4MjgsIDB4YTgsIDB4NjgsIDB4ZTgsXG4gICAgMHgxOCwgMHg5OCwgMHg1OCwgMHhkOCwgMHgzOCwgMHhiOCwgMHg3OCwgMHhmOCxcbiAgICAweDA0LCAweDg0LCAweDQ0LCAweGM0LCAweDI0LCAweGE0LCAweDY0LCAweGU0LFxuICAgIDB4MTQsIDB4OTQsIDB4NTQsIDB4ZDQsIDB4MzQsIDB4YjQsIDB4NzQsIDB4ZjQsXG4gICAgMHgwYywgMHg4YywgMHg0YywgMHhjYywgMHgyYywgMHhhYywgMHg2YywgMHhlYyxcbiAgICAweDFjLCAweDljLCAweDVjLCAweGRjLCAweDNjLCAweGJjLCAweDdjLCAweGZjLFxuICAgIDB4MDIsIDB4ODIsIDB4NDIsIDB4YzIsIDB4MjIsIDB4YTIsIDB4NjIsIDB4ZTIsXG4gICAgMHgxMiwgMHg5MiwgMHg1MiwgMHhkMiwgMHgzMiwgMHhiMiwgMHg3MiwgMHhmMixcbiAgICAweDBhLCAweDhhLCAweDRhLCAweGNhLCAweDJhLCAweGFhLCAweDZhLCAweGVhLFxuICAgIDB4MWEsIDB4OWEsIDB4NWEsIDB4ZGEsIDB4M2EsIDB4YmEsIDB4N2EsIDB4ZmEsXG4gICAgMHgwNiwgMHg4NiwgMHg0NiwgMHhjNiwgMHgyNiwgMHhhNiwgMHg2NiwgMHhlNixcbiAgICAweDE2LCAweDk2LCAweDU2LCAweGQ2LCAweDM2LCAweGI2LCAweDc2LCAweGY2LFxuICAgIDB4MGUsIDB4OGUsIDB4NGUsIDB4Y2UsIDB4MmUsIDB4YWUsIDB4NmUsIDB4ZWUsXG4gICAgMHgxZSwgMHg5ZSwgMHg1ZSwgMHhkZSwgMHgzZSwgMHhiZSwgMHg3ZSwgMHhmZSxcbiAgICAweDAxLCAweDgxLCAweDQxLCAweGMxLCAweDIxLCAweGExLCAweDYxLCAweGUxLFxuICAgIDB4MTEsIDB4OTEsIDB4NTEsIDB4ZDEsIDB4MzEsIDB4YjEsIDB4NzEsIDB4ZjEsXG4gICAgMHgwOSwgMHg4OSwgMHg0OSwgMHhjOSwgMHgyOSwgMHhhOSwgMHg2OSwgMHhlOSxcbiAgICAweDE5LCAweDk5LCAweDU5LCAweGQ5LCAweDM5LCAweGI5LCAweDc5LCAweGY5LFxuICAgIDB4MDUsIDB4ODUsIDB4NDUsIDB4YzUsIDB4MjUsIDB4YTUsIDB4NjUsIDB4ZTUsXG4gICAgMHgxNSwgMHg5NSwgMHg1NSwgMHhkNSwgMHgzNSwgMHhiNSwgMHg3NSwgMHhmNSxcbiAgICAweDBkLCAweDhkLCAweDRkLCAweGNkLCAweDJkLCAweGFkLCAweDZkLCAweGVkLFxuICAgIDB4MWQsIDB4OWQsIDB4NWQsIDB4ZGQsIDB4M2QsIDB4YmQsIDB4N2QsIDB4ZmQsXG4gICAgMHgwMywgMHg4MywgMHg0MywgMHhjMywgMHgyMywgMHhhMywgMHg2MywgMHhlMyxcbiAgICAweDEzLCAweDkzLCAweDUzLCAweGQzLCAweDMzLCAweGIzLCAweDczLCAweGYzLFxuICAgIDB4MGIsIDB4OGIsIDB4NGIsIDB4Y2IsIDB4MmIsIDB4YWIsIDB4NmIsIDB4ZWIsXG4gICAgMHgxYiwgMHg5YiwgMHg1YiwgMHhkYiwgMHgzYiwgMHhiYiwgMHg3YiwgMHhmYixcbiAgICAweDA3LCAweDg3LCAweDQ3LCAweGM3LCAweDI3LCAweGE3LCAweDY3LCAweGU3LFxuICAgIDB4MTcsIDB4OTcsIDB4NTcsIDB4ZDcsIDB4MzcsIDB4YjcsIDB4NzcsIDB4ZjcsXG4gICAgMHgwZiwgMHg4ZiwgMHg0ZiwgMHhjZiwgMHgyZiwgMHhhZiwgMHg2ZiwgMHhlZixcbiAgICAweDFmLCAweDlmLCAweDVmLCAweGRmLCAweDNmLCAweGJmLCAweDdmLCAweGZmXG5dO1xuR1ppcC5jcGxlbnMgPSBbXG4gICAgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMywgMTUsIDE3LCAxOSwgMjMsIDI3LCAzMSxcbiAgICAzNSwgNDMsIDUxLCA1OSwgNjcsIDgzLCA5OSwgMTE1LCAxMzEsIDE2MywgMTk1LCAyMjcsIDI1OCwgMCwgMFxuXTtcbkdaaXAuY3BsZXh0ID0gW1xuICAgIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDIsIDIsIDIsIDIsXG4gICAgMywgMywgMywgMywgNCwgNCwgNCwgNCwgNSwgNSwgNSwgNSwgMCwgOTksIDk5XG5dO1xuLyogOTk9PWludmFsaWQgKi9cbkdaaXAuY3BkaXN0ID0gW1xuICAgIDB4MDAwMSwgMHgwMDAyLCAweDAwMDMsIDB4MDAwNCwgMHgwMDA1LCAweDAwMDcsIDB4MDAwOSwgMHgwMDBkLFxuICAgIDB4MDAxMSwgMHgwMDE5LCAweDAwMjEsIDB4MDAzMSwgMHgwMDQxLCAweDAwNjEsIDB4MDA4MSwgMHgwMGMxLFxuICAgIDB4MDEwMSwgMHgwMTgxLCAweDAyMDEsIDB4MDMwMSwgMHgwNDAxLCAweDA2MDEsIDB4MDgwMSwgMHgwYzAxLFxuICAgIDB4MTAwMSwgMHgxODAxLCAweDIwMDEsIDB4MzAwMSwgMHg0MDAxLCAweDYwMDFcbl07XG5HWmlwLmNwZGV4dCA9IFtcbiAgICAwLCAwLCAwLCAwLCAxLCAxLCAyLCAyLFxuICAgIDMsIDMsIDQsIDQsIDUsIDUsIDYsIDYsXG4gICAgNywgNywgOCwgOCwgOSwgOSwgMTAsIDEwLFxuICAgIDExLCAxMSwgMTIsIDEyLCAxMywgMTNcbl07XG5HWmlwLmJvcmRlciA9IFsxNiwgMTcsIDE4LCAwLCA4LCA3LCA5LCA2LCAxMCwgNSwgMTEsIDQsIDEyLCAzLCAxMywgMiwgMTQsIDEsIDE1XTtcblxuXG4vKipcbiAqIGd1bnppcFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbkdaaXAucHJvdG90eXBlLmd1bnppcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm91dHB1dEFyciA9IFtdO1xuXG4gICAgLy9jb252ZXJ0VG9CeXRlQXJyYXkoaW5wdXQpO1xuICAgIC8vaWYgKHRoaXMuZGVidWcpIGFsZXJ0KHRoaXMuZGF0YSk7XG5cbiAgICB0aGlzLm5leHRGaWxlKCk7XG4gICAgcmV0dXJuIHRoaXMudW56aXBwZWQ7XG59O1xuXG5HWmlwLnByb3RvdHlwZS5yZWFkQnl0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmJpdHMgKz0gODtcbiAgICBpZiAodGhpcy5ieXRlcG9zIDwgdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAvL3JldHVybiB0aGlzLmRhdGFbdGhpcy5ieXRlcG9zKytdOyAvLyBBcnJheVxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmNoYXJDb2RlQXQodGhpcy5ieXRlcG9zKyspO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG59O1xuXG5HWmlwLnByb3RvdHlwZS5ieXRlQWxpZ24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5iYiA9IDE7XG59O1xuXG5HWmlwLnByb3RvdHlwZS5yZWFkQml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYXJyeTtcbiAgICB0aGlzLmJpdHMrKztcbiAgICBjYXJyeSA9ICh0aGlzLmJiICYgMSk7XG4gICAgdGhpcy5iYiA+Pj0gMTtcbiAgICBpZiAodGhpcy5iYiA9PT0gMCkge1xuICAgICAgICB0aGlzLmJiID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICBjYXJyeSA9ICh0aGlzLmJiICYgMSk7XG4gICAgICAgIHRoaXMuYmIgPSAodGhpcy5iYiA+PiAxKSB8IDB4ODA7XG4gICAgfVxuICAgIHJldHVybiBjYXJyeTtcbn07XG5cbkdaaXAucHJvdG90eXBlLnJlYWRCaXRzID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgcmVzID0gMCxcbiAgICAgICAgaSA9IGE7XG5cbiAgICB3aGlsZSAoaS0tKSByZXMgPSAocmVzIDw8IDEpIHwgdGhpcy5yZWFkQml0KCk7XG4gICAgaWYgKGEpIHJlcyA9IEdaaXAuYml0UmV2ZXJzZVtyZXNdID4+ICg4IC0gYSk7XG5cbiAgICByZXR1cm4gcmVzO1xufTtcblxuR1ppcC5wcm90b3R5cGUuZmx1c2hCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5iSWR4ID0gMDtcbn07XG5cbkdaaXAucHJvdG90eXBlLmFkZEJ1ZmZlciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdGhpcy5idWYzMmtbdGhpcy5iSWR4KytdID0gYTtcbiAgICB0aGlzLm91dHB1dEFyci5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYSkpO1xuICAgIGlmICh0aGlzLmJJZHggPT09IDB4ODAwMCkgdGhpcy5iSWR4ID0gMDtcbn07XG5cbkdaaXAucHJvdG90eXBlLklzUGF0ID0gZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIGlmICh0aGlzLmZwb3NbdGhpcy5sZW5dID49IHRoaXMuZm1heCkgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICBpZiAodGhpcy5mbGVuc1t0aGlzLmZwb3NbdGhpcy5sZW5dXSA9PT0gdGhpcy5sZW4pIHJldHVybiB0aGlzLmZwb3NbdGhpcy5sZW5dKys7XG4gICAgICAgIHRoaXMuZnBvc1t0aGlzLmxlbl0rKztcbiAgICB9XG59O1xuXG5HWmlwLnByb3RvdHlwZS5SZWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnBsYWNlID0gdGhpcy5QbGFjZXNbdGhpcy50cmVlcG9zXTtcbiAgICB2YXIgdG1wO1xuICAgIC8vaWYgKHRoaXMuZGVidWcpIGRvY3VtZW50LndyaXRlKFwiPGJyPmxlbjpcIit0aGlzLmxlbitcIiB0cmVlcG9zOlwiK3RoaXMudHJlZXBvcyk7XG4gICAgaWYgKHRoaXMubGVuID09PSAxNykgeyAvL3dhciAxN1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIHRoaXMudHJlZXBvcysrO1xuICAgIHRoaXMubGVuKys7XG5cbiAgICB0bXAgPSB0aGlzLklzUGF0KCk7XG4gICAgLy9pZiAodGhpcy5kZWJ1ZykgZG9jdW1lbnQud3JpdGUoXCI8YnI+SXNQYXQgXCIrdG1wKTtcbiAgICBpZiAodG1wID49IDApIHtcbiAgICAgICAgY3VycGxhY2UuYjAgPSB0bXA7XG4gICAgICAgIC8qIGxlYWYgY2VsbCBmb3IgMC1iaXQgKi9cbiAgICAgICAgLy9pZiAodGhpcy5kZWJ1ZykgZG9jdW1lbnQud3JpdGUoXCI8YnI+YjAgXCIrY3VycGxhY2UuYjApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIE5vdCBhIExlYWYgY2VsbCAqL1xuICAgICAgICBjdXJwbGFjZS5iMCA9IDB4ODAwMDtcbiAgICAgICAgLy9pZiAodGhpcy5kZWJ1ZykgZG9jdW1lbnQud3JpdGUoXCI8YnI+YjAgXCIrY3VycGxhY2UuYjApO1xuICAgICAgICBpZiAodGhpcy5SZWMoKSkgcmV0dXJuIC0xO1xuICAgIH1cbiAgICB0bXAgPSB0aGlzLklzUGF0KCk7XG4gICAgaWYgKHRtcCA+PSAwKSB7XG4gICAgICAgIGN1cnBsYWNlLmIxID0gdG1wO1xuICAgICAgICAvKiBsZWFmIGNlbGwgZm9yIDEtYml0ICovXG4gICAgICAgIC8vaWYgKHRoaXMuZGVidWcpIGRvY3VtZW50LndyaXRlKFwiPGJyPmIxIFwiK2N1cnBsYWNlLmIxKTtcbiAgICAgICAgY3VycGxhY2UuanVtcCA9IG51bGw7XG4gICAgICAgIC8qIEp1c3QgZm9yIHRoZSBkaXNwbGF5IHJvdXRpbmUgKi9cbiAgICB9IGVsc2Uge1xuICAgICAgICAvKiBOb3QgYSBMZWFmIGNlbGwgKi9cbiAgICAgICAgY3VycGxhY2UuYjEgPSAweDgwMDA7XG4gICAgICAgIC8vaWYgKHRoaXMuZGVidWcpIGRvY3VtZW50LndyaXRlKFwiPGJyPmIxIFwiK2N1cnBsYWNlLmIxKTtcbiAgICAgICAgY3VycGxhY2UuanVtcCA9IHRoaXMuUGxhY2VzW3RoaXMudHJlZXBvc107XG4gICAgICAgIGN1cnBsYWNlLmp1bXBwb3MgPSB0aGlzLnRyZWVwb3M7XG4gICAgICAgIGlmICh0aGlzLlJlYygpKSByZXR1cm4gLTE7XG4gICAgfVxuICAgIHRoaXMubGVuLS07XG4gICAgcmV0dXJuIDA7XG59O1xuXG5HWmlwLnByb3RvdHlwZS5DcmVhdGVUcmVlID0gZnVuY3Rpb24gKGN1cnJlbnRUcmVlLCBudW12YWwsIGxlbmd0aHMsIHNob3cpIHtcbiAgICB2YXIgaTtcbiAgICAvKiBDcmVhdGUgdGhlIEh1ZmZtYW4gZGVjb2RlIHRyZWUvdGFibGUgKi9cbiAgICAvL2lmICh0aGlzLmRlYnVnKSBkb2N1bWVudC53cml0ZShcImN1cnJlbnRUcmVlIFwiK2N1cnJlbnRUcmVlK1wiIG51bXZhbCBcIitudW12YWwrXCIgbGVuZ3RocyBcIitsZW5ndGhzK1wiIHNob3cgXCIrc2hvdyk7XG4gICAgdGhpcy5QbGFjZXMgPSBjdXJyZW50VHJlZTtcbiAgICB0aGlzLnRyZWVwb3MgPSAwO1xuICAgIHRoaXMuZmxlbnMgPSBsZW5ndGhzO1xuICAgIHRoaXMuZm1heCA9IG51bXZhbDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgMTc7IGkrKykgdGhpcy5mcG9zW2ldID0gMDtcbiAgICB0aGlzLmxlbiA9IDA7XG4gICAgaWYgKHRoaXMuUmVjKCkpIHtcbiAgICAgICAgLy9pZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJpbnZhbGlkIGh1ZmZtYW4gdHJlZVxcblwiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICAvLyBpZiAodGhpcy5kZWJ1Zykge1xuICAgIC8vICAgZG9jdW1lbnQud3JpdGUoJzxicj5UcmVlOiAnK3RoaXMuUGxhY2VzLmxlbmd0aCk7XG4gICAgLy8gICBmb3IgKHZhciBhPTA7YTwzMjthKyspe1xuICAgIC8vICAgICBkb2N1bWVudC53cml0ZShcIlBsYWNlc1tcIithK1wiXS5iMD1cIit0aGlzLlBsYWNlc1thXS5iMCtcIjxicj5cIik7XG4gICAgLy8gICAgIGRvY3VtZW50LndyaXRlKFwiUGxhY2VzW1wiK2ErXCJdLmIxPVwiK3RoaXMuUGxhY2VzW2FdLmIxK1wiPGJyPlwiKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgICByZXR1cm4gMDtcbn07XG5cbkdaaXAucHJvdG90eXBlLkRlY29kZVZhbHVlID0gZnVuY3Rpb24gKGN1cnJlbnRUcmVlKSB7XG4gICAgdmFyIGxlbiwgaSxcbiAgICAgICAgeHRyZWVwb3MgPSAwLFxuICAgICAgICBYID0gY3VycmVudFRyZWVbeHRyZWVwb3NdLFxuICAgICAgICBiO1xuXG4gICAgLyogZGVjb2RlIG9uZSBzeW1ib2wgb2YgdGhlIGRhdGEgKi9cbiAgICB3aGlsZSAoMSkge1xuICAgICAgICBiID0gdGhpcy5yZWFkQml0KCk7XG4gICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBkb2N1bWVudC53cml0ZShcImI9XCIrYik7XG4gICAgICAgIGlmIChiKSB7XG4gICAgICAgICAgICBpZiAoIShYLmIxICYgMHg4MDAwKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBkb2N1bWVudC53cml0ZShcInJldDFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFguYjE7XG4gICAgICAgICAgICAgICAgLyogSWYgbGVhZiBub2RlLCByZXR1cm4gZGF0YSAqL1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgWCA9IFguanVtcDtcbiAgICAgICAgICAgIGxlbiA9IGN1cnJlbnRUcmVlLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VHJlZVtpXSA9PT0gWCkge1xuICAgICAgICAgICAgICAgICAgICB4dHJlZXBvcyA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghKFguYjAgJiAweDgwMDApKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGRvY3VtZW50LndyaXRlKFwicmV0MlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWC5iMDtcbiAgICAgICAgICAgICAgICAvKiBJZiBsZWFmIG5vZGUsIHJldHVybiBkYXRhICovXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4dHJlZXBvcysrO1xuICAgICAgICAgICAgWCA9IGN1cnJlbnRUcmVlW3h0cmVlcG9zXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiAodGhpcy5kZWJ1ZykgZG9jdW1lbnQud3JpdGUoXCJyZXQzXCIpO1xuXG4gICAgcmV0dXJuIC0xO1xufTtcblxuR1ppcC5wcm90b3R5cGUuRGVmbGF0ZUxvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3QsIGMsIHR5cGUsIGksIGxlbjtcbiAgICBkbyB7XG4gICAgICAgIGxhc3QgPSB0aGlzLnJlYWRCaXQoKTtcbiAgICAgICAgdHlwZSA9IHRoaXMucmVhZEJpdHMoMik7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBibG9ja0xlbiwgY1N1bTtcblxuICAgICAgICAgICAgLy8gU3RvcmVkXG4gICAgICAgICAgICB0aGlzLmJ5dGVBbGlnbigpO1xuICAgICAgICAgICAgYmxvY2tMZW4gPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgICAgICBibG9ja0xlbiB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuXG4gICAgICAgICAgICBjU3VtID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICAgICAgY1N1bSB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuXG4gICAgICAgICAgICBpZiAoKChibG9ja0xlbiBeIH5jU3VtKSAmIDB4ZmZmZikpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC53cml0ZShcIkJsb2NrTGVuIGNoZWNrc3VtIG1pc21hdGNoXFxuXCIpOyAvLyBGSVhNRTogdXNlIHRocm93XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoYmxvY2tMZW4tLSkge1xuICAgICAgICAgICAgICAgIGMgPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRCdWZmZXIoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgdmFyIGo7XG5cbiAgICAgICAgICAgIC8qIEZpeGVkIEh1ZmZtYW4gdGFibGVzIC0tIGZpeGVkIGRlY29kZSByb3V0aW5lICovXG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgIDI1NiAgICAwMDAwMDAwICAgICAgICAwXG4gICAgICAgICAgICAgICAgIDogICA6ICAgICA6XG4gICAgICAgICAgICAgICAgIDI3OSAgICAwMDEwMTExICAgICAgICAyM1xuICAgICAgICAgICAgICAgICAwICAgMDAxMTAwMDAgICAgNDhcbiAgICAgICAgICAgICAgICAgOiAgICA6ICAgICAgOlxuICAgICAgICAgICAgICAgICAxNDMgICAgMTAxMTExMTEgICAgMTkxXG4gICAgICAgICAgICAgICAgIDI4MCAxMTAwMDAwMCAgICAxOTJcbiAgICAgICAgICAgICAgICAgOiAgICA6ICAgICAgOlxuICAgICAgICAgICAgICAgICAyODcgMTEwMDAxMTEgICAgMTk5XG4gICAgICAgICAgICAgICAgIDE0NCAgICAxMTAwMTAwMDAgICAgNDAwXG4gICAgICAgICAgICAgICAgIDogICAgOiAgICAgICA6XG4gICAgICAgICAgICAgICAgIDI1NSAgICAxMTExMTExMTEgICAgNTExXG5cbiAgICAgICAgICAgICAgICAgTm90ZSB0aGUgYml0IG9yZGVyIVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGogPSAoR1ppcC5iaXRSZXZlcnNlW3RoaXMucmVhZEJpdHMoNyldID4+IDEpO1xuICAgICAgICAgICAgICAgIGlmIChqID4gMjMpIHtcbiAgICAgICAgICAgICAgICAgICAgaiA9IChqIDw8IDEpIHwgdGhpcy5yZWFkQml0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8qIDQ4Li4yNTUgKi9cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaiA+IDE5OSkgeyAgICAgICAgICAgICAgLyogMjAwLi4yNTUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGogLT0gMTI4O1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogIDcyLi4xMjcgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAoaiA8PCAxKSB8IHRoaXMucmVhZEJpdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogMTQ0Li4yNTUgPDwgKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgIC8qICA0OC4uMTk5ICovXG4gICAgICAgICAgICAgICAgICAgICAgICBqIC09IDQ4O1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogICAwLi4xNTEgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID4gMTQzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IGogKyAxMzY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogMjgwLi4yODcgPDwgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgIDAuLjE0MyA8PCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgLyogICAwLi4yMyAqL1xuICAgICAgICAgICAgICAgICAgICBqICs9IDI1NjtcbiAgICAgICAgICAgICAgICAgICAgLyogMjU2Li4yNzkgPDwgKi9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGogPCAyNTYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRCdWZmZXIoaik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChqID09PSAyNTYpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogRU9GICovXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrOyAvLyBGSVhNRTogbWFrZSB0aGlzIHRoZSBsb29wLWNvbmRpdGlvblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW4sIGRpc3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgaiAtPSAyNTYgKyAxO1xuICAgICAgICAgICAgICAgICAgICAvKiBieXRlcyArIEVPRiAqL1xuICAgICAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLnJlYWRCaXRzKEdaaXAuY3BsZXh0W2pdKSArIEdaaXAuY3BsZW5zW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIGogPSBHWmlwLmJpdFJldmVyc2VbdGhpcy5yZWFkQml0cyg1KV0gPj4gMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKEdaaXAuY3BkZXh0W2pdID4gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdCA9IHRoaXMucmVhZEJpdHMoOCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0IHw9ICh0aGlzLnJlYWRCaXRzKEdaaXAuY3BkZXh0W2pdIC0gOCkgPDwgOCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0ID0gdGhpcy5yZWFkQml0cyhHWmlwLmNwZGV4dFtqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGlzdCArPSBHWmlwLmNwZGlzdFtqXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5idWYzMmtbKHRoaXMuYklkeCAtIGRpc3QpICYgMHg3ZmZmXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQnVmZmVyKGMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAvLyB3aGlsZVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMikge1xuICAgICAgICAgICAgdmFyIGosIG4sIGxpdGVyYWxDb2RlcywgZGlzdENvZGVzLCBsZW5Db2RlcztcbiAgICAgICAgICAgIHZhciBsbCA9IG5ldyBBcnJheSgyODggKyAzMik7ICAgIC8vIFwic3RhdGljXCIganVzdCB0byBwcmVzZXJ2ZSBzdGFja1xuXG4gICAgICAgICAgICAvLyBEeW5hbWljIEh1ZmZtYW4gdGFibGVzXG5cbiAgICAgICAgICAgIGxpdGVyYWxDb2RlcyA9IDI1NyArIHRoaXMucmVhZEJpdHMoNSk7XG4gICAgICAgICAgICBkaXN0Q29kZXMgPSAxICsgdGhpcy5yZWFkQml0cyg1KTtcbiAgICAgICAgICAgIGxlbkNvZGVzID0gNCArIHRoaXMucmVhZEJpdHMoNCk7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgMTk7IGorKykge1xuICAgICAgICAgICAgICAgIGxsW2pdID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBkZWNvZGUgdHJlZSBjb2RlIGxlbmd0aHNcblxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGxlbkNvZGVzOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsbFtHWmlwLmJvcmRlcltqXV0gPSB0aGlzLnJlYWRCaXRzKDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVuID0gdGhpcy5kaXN0YW5jZVRyZWUubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB0aGlzLmRpc3RhbmNlVHJlZVtpXSA9IG5ldyBHWmlwLkh1Zk5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLkNyZWF0ZVRyZWUodGhpcy5kaXN0YW5jZVRyZWUsIDE5LCBsbCwgMCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoQnVmZmVyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgLy8gICBkb2N1bWVudC53cml0ZShcIjxicj5kaXN0YW5jZVRyZWVcIik7XG4gICAgICAgICAgICAvLyAgIGZvcih2YXIgYT0wO2E8dGhpcy5kaXN0YW5jZVRyZWUubGVuZ3RoO2ErKyl7XG4gICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQud3JpdGUoXCI8YnI+XCIrdGhpcy5kaXN0YW5jZVRyZWVbYV0uYjArXCIgXCIrdGhpcy5kaXN0YW5jZVRyZWVbYV0uYjErXCIgXCIrdGhpcy5kaXN0YW5jZVRyZWVbYV0uanVtcCtcIiBcIit0aGlzLmRpc3RhbmNlVHJlZVthXS5qdW1wcG9zKTtcbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAvL3JlYWQgaW4gbGl0ZXJhbCBhbmQgZGlzdGFuY2UgY29kZSBsZW5ndGhzXG4gICAgICAgICAgICBuID0gbGl0ZXJhbENvZGVzICsgZGlzdENvZGVzO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICB2YXIgeiA9IC0xO1xuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGRvY3VtZW50LndyaXRlKFwiPGJyPm49XCIrbitcIiBiaXRzOiBcIit0aGlzLmJpdHMrXCI8YnI+XCIpO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICAgICAgICAgICAgeisrO1xuICAgICAgICAgICAgICAgIGogPSB0aGlzLkRlY29kZVZhbHVlKHRoaXMuZGlzdGFuY2VUcmVlKTtcbiAgICAgICAgICAgICAgICAvLyBpZiAodGhpcy5kZWJ1ZykgZG9jdW1lbnQud3JpdGUoXCI8YnI+XCIreitcIiBpOlwiK2krXCIgZGVjb2RlOiBcIitqK1wiICAgIGJpdHMgXCIrdGhpcy5iaXRzK1wiPGJyPlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaiA8IDE2KSB7ICAgIC8vIGxlbmd0aCBvZiBjb2RlIGluIGJpdHMgKDAuLjE1KVxuICAgICAgICAgICAgICAgICAgICBsbFtpKytdID0gajtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGogPT09IDE2KSB7ICAgIC8vIHJlcGVhdCBsYXN0IGxlbmd0aCAzIHRvIDYgdGltZXNcbiAgICAgICAgICAgICAgICAgICAgdmFyIGw7XG4gICAgICAgICAgICAgICAgICAgIGogPSAzICsgdGhpcy5yZWFkQml0cygyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgKyBqID4gbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHVzaEJ1ZmZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbCA9IGkgPyBsbFtpIC0gMV0gOiAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsbFtpKytdID0gbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAxNykgeyAgICAgICAgLy8gMyB0byAxMCB6ZXJvIGxlbmd0aCBjb2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDMgKyB0aGlzLnJlYWRCaXRzKDMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAgICAgICAgLy8gaiA9PSAxODogMTEgdG8gMTM4IHplcm8gbGVuZ3RoIGNvZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMTEgKyB0aGlzLnJlYWRCaXRzKDcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICsgaiA+IG4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1c2hCdWZmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxsW2krK10gPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAvLyB3aGlsZVxuXG4gICAgICAgICAgICAvLyBDYW4gb3ZlcndyaXRlIHRyZWUgZGVjb2RlIHRyZWUgYXMgaXQgaXMgbm90IHVzZWQgYW55bW9yZVxuICAgICAgICAgICAgbGVuID0gdGhpcy5saXRlcmFsVHJlZS5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5saXRlcmFsVHJlZVtpXSA9IG5ldyBHWmlwLkh1Zk5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLkNyZWF0ZVRyZWUodGhpcy5saXRlcmFsVHJlZSwgbGl0ZXJhbENvZGVzLCBsbCwgMCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoQnVmZmVyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZW4gPSB0aGlzLmxpdGVyYWxUcmVlLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykgdGhpcy5kaXN0YW5jZVRyZWVbaV0gPSBuZXcgR1ppcC5IdWZOb2RlKCk7XG4gICAgICAgICAgICB2YXIgbGwyID0gbmV3IEFycmF5KCk7XG4gICAgICAgICAgICBmb3IgKGkgPSBsaXRlcmFsQ29kZXM7IGkgPCBsbC5sZW5ndGg7IGkrKykgbGwyW2kgLSBsaXRlcmFsQ29kZXNdID0gbGxbaV07XG4gICAgICAgICAgICBpZiAodGhpcy5DcmVhdGVUcmVlKHRoaXMuZGlzdGFuY2VUcmVlLCBkaXN0Q29kZXMsIGxsMiwgMCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoQnVmZmVyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAodGhpcy5kZWJ1ZykgZG9jdW1lbnQud3JpdGUoXCI8YnI+bGl0ZXJhbFRyZWVcIik7XG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIGogPSB0aGlzLkRlY29kZVZhbHVlKHRoaXMubGl0ZXJhbFRyZWUpO1xuICAgICAgICAgICAgICAgIGlmIChqID49IDI1NikgeyAgICAgICAgLy8gSW4gQzY0OiBpZiBjYXJyeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiwgZGlzdDtcbiAgICAgICAgICAgICAgICAgICAgaiAtPSAyNTY7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFT0ZcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgICAgICAgICAgbGVuID0gdGhpcy5yZWFkQml0cyhHWmlwLmNwbGV4dFtqXSkgKyBHWmlwLmNwbGVuc1tqXTtcblxuICAgICAgICAgICAgICAgICAgICBqID0gdGhpcy5EZWNvZGVWYWx1ZSh0aGlzLmRpc3RhbmNlVHJlZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChHWmlwLmNwZGV4dFtqXSA+IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3QgPSB0aGlzLnJlYWRCaXRzKDgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdCB8PSAodGhpcy5yZWFkQml0cyhHWmlwLmNwZGV4dFtqXSAtIDgpIDw8IDgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdCA9IHRoaXMucmVhZEJpdHMoR1ppcC5jcGRleHRbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpc3QgKz0gR1ppcC5jcGRpc3Rbal07XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmJ1ZjMya1sodGhpcy5iSWR4IC0gZGlzdCkgJiAweDdmZmZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRCdWZmZXIoYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEJ1ZmZlcihqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IC8vIHdoaWxlXG4gICAgICAgIH1cbiAgICB9IHdoaWxlICghbGFzdCk7XG4gICAgdGhpcy5mbHVzaEJ1ZmZlcigpO1xuXG4gICAgdGhpcy5ieXRlQWxpZ24oKTtcbiAgICByZXR1cm4gMDtcbn07XG5cbkdaaXAucHJvdG90eXBlLnVuemlwRmlsZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGk7XG4gICAgdGhpcy5ndW56aXAoKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy51bnppcHBlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy51bnppcHBlZFtpXVsxXSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW56aXBwZWRbaV1bMF07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5HWmlwLnByb3RvdHlwZS5uZXh0RmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBpZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJORVhURklMRVwiKTtcblxuICAgIHRoaXMub3V0cHV0QXJyID0gW107XG4gICAgdGhpcy5tb2RlWklQID0gZmFsc2U7XG5cbiAgICB2YXIgdG1wID0gW107XG4gICAgdG1wWzBdID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgIHRtcFsxXSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAvLyBpZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJ0eXBlOiBcIit0bXBbMF0rXCIgXCIrdG1wWzFdKTtcblxuICAgIGlmICh0bXBbMF0gPT09IDB4NzggJiYgdG1wWzFdID09PSAweGRhKSB7IC8vR1pJUFxuICAgICAgICAvLyBpZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJHRU9ORXhULUdaSVBcIik7XG4gICAgICAgIHRoaXMuRGVmbGF0ZUxvb3AoKTtcbiAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGFsZXJ0KHRoaXMub3V0cHV0QXJyLmpvaW4oJycpKTtcbiAgICAgICAgdGhpcy51bnppcHBlZFt0aGlzLmZpbGVzXSA9IFt0aGlzLm91dHB1dEFyci5qb2luKCcnKSwgXCJnZW9uZXh0Lmd4dFwiXTtcbiAgICAgICAgdGhpcy5maWxlcysrO1xuICAgIH1cbiAgICBpZiAodG1wWzBdID09PSAweDFmICYmIHRtcFsxXSA9PT0gMHg4YikgeyAvL0daSVBcbiAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGFsZXJ0KFwiR1pJUFwiKTtcbiAgICAgICAgdGhpcy5za2lwZGlyKCk7XG4gICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBhbGVydCh0aGlzLm91dHB1dEFyci5qb2luKCcnKSk7XG4gICAgICAgIHRoaXMudW56aXBwZWRbdGhpcy5maWxlc10gPSBbdGhpcy5vdXRwdXRBcnIuam9pbignJyksIFwiZmlsZVwiXTtcbiAgICAgICAgdGhpcy5maWxlcysrO1xuICAgIH1cbiAgICBpZiAodG1wWzBdID09PSAweDUwICYmIHRtcFsxXSA9PT0gMHg0YikgeyAvL1pJUFxuICAgICAgICB0aGlzLm1vZGVaSVAgPSB0cnVlO1xuICAgICAgICB0bXBbMl0gPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgIHRtcFszXSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgaWYgKHRtcFsyXSA9PT0gMHgwMyAmJiB0bXBbM10gPT09IDB4MDQpIHtcbiAgICAgICAgICAgIC8vTU9ERV9aSVBcbiAgICAgICAgICAgIHRtcFswXSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgICAgIHRtcFsxXSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBhbGVydChcIlpJUC1WZXJzaW9uOiBcIit0bXBbMV0rXCIgXCIrdG1wWzBdLzEwK1wiLlwiK3RtcFswXSUxMCk7XG5cbiAgICAgICAgICAgIHRoaXMuZ3BmbGFncyA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgICAgIHRoaXMuZ3BmbGFncyB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGFsZXJ0KFwiZ3BmbGFnczogXCIrdGhpcy5ncGZsYWdzKTtcblxuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgICAgIG1ldGhvZCB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGFsZXJ0KFwibWV0aG9kOiBcIittZXRob2QpO1xuXG4gICAgICAgICAgICB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgICAgICB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgICAgICB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgICAgICB0aGlzLnJlYWRCeXRlKCk7XG5cbi8vICAgICAgIHZhciBjcmMgPSB0aGlzLnJlYWRCeXRlKCk7XG4vLyAgICAgICBjcmMgfD0gKHRoaXMucmVhZEJ5dGUoKTw8OCk7XG4vLyAgICAgICBjcmMgfD0gKHRoaXMucmVhZEJ5dGUoKTw8MTYpO1xuLy8gICAgICAgY3JjIHw9ICh0aGlzLnJlYWRCeXRlKCk8PDI0KTtcblxuICAgICAgICAgICAgdmFyIGNvbXBTaXplID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICAgICAgY29tcFNpemUgfD0gKHRoaXMucmVhZEJ5dGUoKSA8PCA4KTtcbiAgICAgICAgICAgIGNvbXBTaXplIHw9ICh0aGlzLnJlYWRCeXRlKCkgPDwgMTYpO1xuICAgICAgICAgICAgY29tcFNpemUgfD0gKHRoaXMucmVhZEJ5dGUoKSA8PCAyNCk7XG5cbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICAgICAgc2l6ZSB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuICAgICAgICAgICAgc2l6ZSB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDE2KTtcbiAgICAgICAgICAgIHNpemUgfD0gKHRoaXMucmVhZEJ5dGUoKSA8PCAyNCk7XG5cbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBhbGVydChcImxvY2FsIENSQzogXCIrY3JjK1wiXFxubG9jYWwgU2l6ZTogXCIrc2l6ZStcIlxcbmxvY2FsIENvbXBTaXplOiBcIitjb21wU2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBmaWxlbGVuID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICAgICAgZmlsZWxlbiB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuXG4gICAgICAgICAgICB2YXIgZXh0cmFsZW4gPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgICAgICBleHRyYWxlbiB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDgpO1xuXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJmaWxlbGVuIFwiK2ZpbGVsZW4pO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICB0aGlzLm5hbWVCdWYgPSBbXTtcbiAgICAgICAgICAgIHdoaWxlIChmaWxlbGVuLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCIvXCIgfCBjID09PSBcIjpcIikge1xuICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBHWmlwLk5BTUVNQVggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZUJ1ZltpKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJuYW1lQnVmOiBcIit0aGlzLm5hbWVCdWYpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmlsZW91dCkgdGhpcy5maWxlb3V0ID0gdGhpcy5uYW1lQnVmO1xuXG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoaSA8IGV4dHJhbGVuKSB7XG4gICAgICAgICAgICAgICAgYyA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIChzaXplID0gMCAmJiB0aGlzLmZpbGVPdXQuY2hhckF0KHRoaXMuZmlsZW91dC5sZW5ndGgtMSk9PVwiL1wiKXtcbiAgICAgICAgICAgIC8vICAgLy9za2lwZGlyXG4gICAgICAgICAgICAvLyAgIC8vIGlmICh0aGlzLmRlYnVnKSBhbGVydChcInNraXBkaXJcIik7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSA4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5EZWZsYXRlTG9vcCgpO1xuICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBhbGVydCh0aGlzLm91dHB1dEFyci5qb2luKCcnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51bnppcHBlZFt0aGlzLmZpbGVzXSA9IFt0aGlzLm91dHB1dEFyci5qb2luKCcnKSwgdGhpcy5uYW1lQnVmLmpvaW4oJycpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNraXBkaXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbkdaaXAucHJvdG90eXBlLnNraXBkaXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRtcCA9IFtdO1xuICAgIHZhciBjb21wU2l6ZSwgc2l6ZSwgb3MsIGksIGM7XG5cbiAgICBpZiAoKHRoaXMuZ3BmbGFncyAmIDgpKSB7XG4gICAgICAgIHRtcFswXSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgdG1wWzFdID0gdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICB0bXBbMl0gPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgIHRtcFszXSA9IHRoaXMucmVhZEJ5dGUoKTtcblxuLy8gICAgIGlmICh0bXBbMF0gPT0gMHg1MCAmJiB0bXBbMV0gPT0gMHg0YiAmJiB0bXBbMl0gPT0gMHgwNyAmJiB0bXBbM10gPT0gMHgwOCkge1xuLy8gICAgICAgY3JjID0gdGhpcy5yZWFkQnl0ZSgpO1xuLy8gICAgICAgY3JjIHw9ICh0aGlzLnJlYWRCeXRlKCk8PDgpO1xuLy8gICAgICAgY3JjIHw9ICh0aGlzLnJlYWRCeXRlKCk8PDE2KTtcbi8vICAgICAgIGNyYyB8PSAodGhpcy5yZWFkQnl0ZSgpPDwyNCk7XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIGNyYyA9IHRtcFswXSB8ICh0bXBbMV08PDgpIHwgKHRtcFsyXTw8MTYpIHwgKHRtcFszXTw8MjQpO1xuLy8gICAgIH1cblxuICAgICAgICBjb21wU2l6ZSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgY29tcFNpemUgfD0gKHRoaXMucmVhZEJ5dGUoKSA8PCA4KTtcbiAgICAgICAgY29tcFNpemUgfD0gKHRoaXMucmVhZEJ5dGUoKSA8PCAxNik7XG4gICAgICAgIGNvbXBTaXplIHw9ICh0aGlzLnJlYWRCeXRlKCkgPDwgMjQpO1xuXG4gICAgICAgIHNpemUgPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgIHNpemUgfD0gKHRoaXMucmVhZEJ5dGUoKSA8PCA4KTtcbiAgICAgICAgc2l6ZSB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDE2KTtcbiAgICAgICAgc2l6ZSB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDI0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb2RlWklQKSB0aGlzLm5leHRGaWxlKCk7XG5cbiAgICB0bXBbMF0gPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgaWYgKHRtcFswXSAhPT0gOCkge1xuICAgICAgICAvLyBpZiAodGhpcy5kZWJ1ZykgYWxlcnQoXCJVbmtub3duIGNvbXByZXNzaW9uIG1ldGhvZCFcIik7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHRoaXMuZ3BmbGFncyA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAvLyBpZiAodGhpcy5kZWJ1ZyAmJiAodGhpcy5ncGZsYWdzICYgfigweDFmKSkpIGFsZXJ0KFwiVW5rbm93biBmbGFncyBzZXQhXCIpO1xuXG4gICAgdGhpcy5yZWFkQnl0ZSgpO1xuICAgIHRoaXMucmVhZEJ5dGUoKTtcbiAgICB0aGlzLnJlYWRCeXRlKCk7XG4gICAgdGhpcy5yZWFkQnl0ZSgpO1xuXG4gICAgdGhpcy5yZWFkQnl0ZSgpO1xuICAgIG9zID0gdGhpcy5yZWFkQnl0ZSgpO1xuXG4gICAgaWYgKCh0aGlzLmdwZmxhZ3MgJiA0KSkge1xuICAgICAgICB0bXBbMF0gPSB0aGlzLnJlYWRCeXRlKCk7XG4gICAgICAgIHRtcFsyXSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICAgICAgdGhpcy5sZW4gPSB0bXBbMF0gKyAyNTYgKiB0bXBbMV07XG4gICAgICAgIC8vIGlmICh0aGlzLmRlYnVnKSBhbGVydChcIkV4dHJhIGZpZWxkIHNpemU6IFwiK3RoaXMubGVuKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuOyBpKyspXG4gICAgICAgICAgICB0aGlzLnJlYWRCeXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKCh0aGlzLmdwZmxhZ3MgJiA4KSkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgdGhpcy5uYW1lQnVmID0gW107XG4gICAgICAgIHdoaWxlIChjID0gdGhpcy5yZWFkQnl0ZSgpKSB7XG4gICAgICAgICAgICBpZiAoYyA9PT0gXCI3XCIgfHwgYyA9PT0gXCI6XCIpXG4gICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBpZiAoaSA8IEdaaXAuTkFNRU1BWCAtIDEpXG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lQnVmW2krK10gPSBjO1xuICAgICAgICB9XG4gICAgICAgIC8vdGhpcy5uYW1lQnVmW2ldID0gXCJcXDBcIjtcbiAgICAgICAgLy8gaWYgKHRoaXMuZGVidWcpIGFsZXJ0KFwib3JpZ2luYWwgZmlsZSBuYW1lOiBcIit0aGlzLm5hbWVCdWYpO1xuICAgIH1cblxuICAgIGlmICgodGhpcy5ncGZsYWdzICYgMTYpKSB7XG4gICAgICAgIHdoaWxlIChjID0gdGhpcy5yZWFkQnl0ZSgpKSB7IC8vIEZJWE1FOiBsb29rcyBsaWtlIHRoZXkgcmVhZCB0byB0aGUgZW5kIG9mIHRoZSBzdHJlYW0sIHNob3VsZCBiZSBkb2FibGUgbW9yZSBlZmZpY2llbnRseVxuICAgICAgICAgICAgLy9GSUxFIENPTU1FTlRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICgodGhpcy5ncGZsYWdzICYgMikpIHtcbiAgICAgICAgdGhpcy5yZWFkQnl0ZSgpO1xuICAgICAgICB0aGlzLnJlYWRCeXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5EZWZsYXRlTG9vcCgpO1xuXG4vLyAgIGNyYyA9IHRoaXMucmVhZEJ5dGUoKTtcbi8vICAgY3JjIHw9ICh0aGlzLnJlYWRCeXRlKCk8PDgpO1xuLy8gICBjcmMgfD0gKHRoaXMucmVhZEJ5dGUoKTw8MTYpO1xuLy8gICBjcmMgfD0gKHRoaXMucmVhZEJ5dGUoKTw8MjQpO1xuXG4gICAgc2l6ZSA9IHRoaXMucmVhZEJ5dGUoKTtcbiAgICBzaXplIHw9ICh0aGlzLnJlYWRCeXRlKCkgPDwgOCk7XG4gICAgc2l6ZSB8PSAodGhpcy5yZWFkQnl0ZSgpIDw8IDE2KTtcbiAgICBzaXplIHw9ICh0aGlzLnJlYWRCeXRlKCkgPDwgMjQpO1xuXG4gICAgaWYgKHRoaXMubW9kZVpJUCkgdGhpcy5uZXh0RmlsZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHWmlwO1xuIl19