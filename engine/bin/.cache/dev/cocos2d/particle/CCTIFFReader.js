
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/CCTIFFReader.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011 Gordon P. Hemsley
 http://gphemsley.org/

 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var debug = require('../core/CCDebug');
/**
 * cc.tiffReader is a singleton object, it's a tiff file reader, it can parse byte array to draw into a canvas
 * @class
 * @name tiffReader
 */


var tiffReader =
/** @lends tiffReader# */
{
  _littleEndian: false,
  _tiffData: null,
  _fileDirectories: [],
  getUint8: function getUint8(offset) {
    return this._tiffData[offset];
  },
  getUint16: function getUint16(offset) {
    if (this._littleEndian) return this._tiffData[offset + 1] << 8 | this._tiffData[offset];else return this._tiffData[offset] << 8 | this._tiffData[offset + 1];
  },
  getUint32: function getUint32(offset) {
    var a = this._tiffData;
    if (this._littleEndian) return a[offset + 3] << 24 | a[offset + 2] << 16 | a[offset + 1] << 8 | a[offset];else return a[offset] << 24 | a[offset + 1] << 16 | a[offset + 2] << 8 | a[offset + 3];
  },
  checkLittleEndian: function checkLittleEndian() {
    var BOM = this.getUint16(0);

    if (BOM === 0x4949) {
      this.littleEndian = true;
    } else if (BOM === 0x4D4D) {
      this.littleEndian = false;
    } else {
      console.log(BOM);
      throw TypeError(debug.getError(6019));
    }

    return this.littleEndian;
  },
  hasTowel: function hasTowel() {
    // Check for towel.
    if (this.getUint16(2) !== 42) {
      throw RangeError(debug.getError(6020));
      return false;
    }

    return true;
  },
  getFieldTypeName: function getFieldTypeName(fieldType) {
    var typeNames = this.fieldTypeNames;

    if (fieldType in typeNames) {
      return typeNames[fieldType];
    }

    return null;
  },
  getFieldTagName: function getFieldTagName(fieldTag) {
    var tagNames = this.fieldTagNames;

    if (fieldTag in tagNames) {
      return tagNames[fieldTag];
    } else {
      cc.logID(6021, fieldTag);
      return "Tag" + fieldTag;
    }
  },
  getFieldTypeLength: function getFieldTypeLength(fieldTypeName) {
    if (['BYTE', 'ASCII', 'SBYTE', 'UNDEFINED'].indexOf(fieldTypeName) !== -1) {
      return 1;
    } else if (['SHORT', 'SSHORT'].indexOf(fieldTypeName) !== -1) {
      return 2;
    } else if (['LONG', 'SLONG', 'FLOAT'].indexOf(fieldTypeName) !== -1) {
      return 4;
    } else if (['RATIONAL', 'SRATIONAL', 'DOUBLE'].indexOf(fieldTypeName) !== -1) {
      return 8;
    }

    return null;
  },
  getFieldValues: function getFieldValues(fieldTagName, fieldTypeName, typeCount, valueOffset) {
    var fieldValues = [];
    var fieldTypeLength = this.getFieldTypeLength(fieldTypeName);
    var fieldValueSize = fieldTypeLength * typeCount;

    if (fieldValueSize <= 4) {
      // The value is stored at the big end of the valueOffset.
      if (this.littleEndian === false) fieldValues.push(valueOffset >>> (4 - fieldTypeLength) * 8);else fieldValues.push(valueOffset);
    } else {
      for (var i = 0; i < typeCount; i++) {
        var indexOffset = fieldTypeLength * i;

        if (fieldTypeLength >= 8) {
          if (['RATIONAL', 'SRATIONAL'].indexOf(fieldTypeName) !== -1) {
            // Numerator
            fieldValues.push(this.getUint32(valueOffset + indexOffset)); // Denominator

            fieldValues.push(this.getUint32(valueOffset + indexOffset + 4));
          } else {
            cc.logID(8000);
          }
        } else {
          fieldValues.push(this.getBytes(fieldTypeLength, valueOffset + indexOffset));
        }
      }
    }

    if (fieldTypeName === 'ASCII') {
      fieldValues.forEach(function (e, i, a) {
        a[i] = String.fromCharCode(e);
      });
    }

    return fieldValues;
  },
  getBytes: function getBytes(numBytes, offset) {
    if (numBytes <= 0) {
      cc.logID(8001);
    } else if (numBytes <= 1) {
      return this.getUint8(offset);
    } else if (numBytes <= 2) {
      return this.getUint16(offset);
    } else if (numBytes <= 3) {
      return this.getUint32(offset) >>> 8;
    } else if (numBytes <= 4) {
      return this.getUint32(offset);
    } else {
      cc.logID(8002);
    }
  },
  getBits: function getBits(numBits, byteOffset, bitOffset) {
    bitOffset = bitOffset || 0;
    var extraBytes = Math.floor(bitOffset / 8);
    var newByteOffset = byteOffset + extraBytes;
    var totalBits = bitOffset + numBits;
    var shiftRight = 32 - numBits;
    var shiftLeft, rawBits;

    if (totalBits <= 0) {
      cc.logID(6023);
    } else if (totalBits <= 8) {
      shiftLeft = 24 + bitOffset;
      rawBits = this.getUint8(newByteOffset);
    } else if (totalBits <= 16) {
      shiftLeft = 16 + bitOffset;
      rawBits = this.getUint16(newByteOffset);
    } else if (totalBits <= 32) {
      shiftLeft = bitOffset;
      rawBits = this.getUint32(newByteOffset);
    } else {
      cc.logID(6022);
    }

    return {
      'bits': rawBits << shiftLeft >>> shiftRight,
      'byteOffset': newByteOffset + Math.floor(totalBits / 8),
      'bitOffset': totalBits % 8
    };
  },
  parseFileDirectory: function parseFileDirectory(byteOffset) {
    var numDirEntries = this.getUint16(byteOffset);
    var tiffFields = [];

    for (var i = byteOffset + 2, entryCount = 0; entryCount < numDirEntries; i += 12, entryCount++) {
      var fieldTag = this.getUint16(i);
      var fieldType = this.getUint16(i + 2);
      var typeCount = this.getUint32(i + 4);
      var valueOffset = this.getUint32(i + 8);
      var fieldTagName = this.getFieldTagName(fieldTag);
      var fieldTypeName = this.getFieldTypeName(fieldType);
      var fieldValues = this.getFieldValues(fieldTagName, fieldTypeName, typeCount, valueOffset);
      tiffFields[fieldTagName] = {
        type: fieldTypeName,
        values: fieldValues
      };
    }

    this._fileDirectories.push(tiffFields);

    var nextIFDByteOffset = this.getUint32(i);

    if (nextIFDByteOffset !== 0x00000000) {
      this.parseFileDirectory(nextIFDByteOffset);
    }
  },
  clampColorSample: function clampColorSample(colorSample, bitsPerSample) {
    var multiplier = Math.pow(2, 8 - bitsPerSample);
    return Math.floor(colorSample * multiplier + (multiplier - 1));
  },

  /**
   * @function
   * @param {Array} tiffData
   * @param {HTMLCanvasElement} canvas
   * @returns {*}
   */
  parseTIFF: function parseTIFF(tiffData, canvas) {
    canvas = canvas || document.createElement('canvas');
    this._tiffData = tiffData;
    this.canvas = canvas;
    this.checkLittleEndian();

    if (!this.hasTowel()) {
      return;
    }

    var firstIFDByteOffset = this.getUint32(4);
    this._fileDirectories.length = 0;
    this.parseFileDirectory(firstIFDByteOffset);
    var fileDirectory = this._fileDirectories[0];
    var imageWidth = fileDirectory['ImageWidth'].values[0];
    var imageLength = fileDirectory['ImageLength'].values[0];
    this.canvas.width = imageWidth;
    this.canvas.height = imageLength;
    var strips = [];
    var compression = fileDirectory['Compression'] ? fileDirectory['Compression'].values[0] : 1;
    var samplesPerPixel = fileDirectory['SamplesPerPixel'].values[0];
    var sampleProperties = [];
    var bitsPerPixel = 0;
    var hasBytesPerPixel = false;
    fileDirectory['BitsPerSample'].values.forEach(function (bitsPerSample, i, bitsPerSampleValues) {
      sampleProperties[i] = {
        bitsPerSample: bitsPerSample,
        hasBytesPerSample: false,
        bytesPerSample: undefined
      };

      if (bitsPerSample % 8 === 0) {
        sampleProperties[i].hasBytesPerSample = true;
        sampleProperties[i].bytesPerSample = bitsPerSample / 8;
      }

      bitsPerPixel += bitsPerSample;
    }, this);

    if (bitsPerPixel % 8 === 0) {
      hasBytesPerPixel = true;
      var bytesPerPixel = bitsPerPixel / 8;
    }

    var stripOffsetValues = fileDirectory['StripOffsets'].values;
    var numStripOffsetValues = stripOffsetValues.length; // StripByteCounts is supposed to be required, but see if we can recover anyway.

    if (fileDirectory['StripByteCounts']) {
      var stripByteCountValues = fileDirectory['StripByteCounts'].values;
    } else {
      cc.logID(8003); // Infer StripByteCounts, if possible.

      if (numStripOffsetValues === 1) {
        var stripByteCountValues = [Math.ceil(imageWidth * imageLength * bitsPerPixel / 8)];
      } else {
        throw Error(debug.getError(6024));
      }
    } // Loop through strips and decompress as necessary.


    for (var i = 0; i < numStripOffsetValues; i++) {
      var stripOffset = stripOffsetValues[i];
      strips[i] = [];
      var stripByteCount = stripByteCountValues[i]; // Loop through pixels.

      for (var byteOffset = 0, bitOffset = 0, jIncrement = 1, getHeader = true, pixel = [], numBytes = 0, sample = 0, currentSample = 0; byteOffset < stripByteCount; byteOffset += jIncrement) {
        // Decompress strip.
        switch (compression) {
          // Uncompressed
          case 1:
            // Loop through samples (sub-pixels).
            for (var m = 0, pixel = []; m < samplesPerPixel; m++) {
              if (sampleProperties[m].hasBytesPerSample) {
                // XXX: This is wrong!
                var sampleOffset = sampleProperties[m].bytesPerSample * m;
                pixel.push(this.getBytes(sampleProperties[m].bytesPerSample, stripOffset + byteOffset + sampleOffset));
              } else {
                var sampleInfo = this.getBits(sampleProperties[m].bitsPerSample, stripOffset + byteOffset, bitOffset);
                pixel.push(sampleInfo.bits);
                byteOffset = sampleInfo.byteOffset - stripOffset;
                bitOffset = sampleInfo.bitOffset;
                throw RangeError(debug.getError(6025));
              }
            }

            strips[i].push(pixel);

            if (hasBytesPerPixel) {
              jIncrement = bytesPerPixel;
            } else {
              jIncrement = 0;
              throw RangeError(debug.getError(6026));
            }

            break;
          // CITT Group 3 1-Dimensional Modified Huffman run-length encoding

          case 2:
            // XXX: Use PDF.js code?
            break;
          // Group 3 Fax

          case 3:
            // XXX: Use PDF.js code?
            break;
          // Group 4 Fax

          case 4:
            // XXX: Use PDF.js code?
            break;
          // LZW

          case 5:
            // XXX: Use PDF.js code?
            break;
          // Old-style JPEG (TIFF 6.0)

          case 6:
            // XXX: Use PDF.js code?
            break;
          // New-style JPEG (TIFF Specification Supplement 2)

          case 7:
            // XXX: Use PDF.js code?
            break;
          // PackBits

          case 32773:
            // Are we ready for a new block?
            if (getHeader) {
              getHeader = false;
              var blockLength = 1;
              var iterations = 1; // The header byte is signed.

              var header = this.getInt8(stripOffset + byteOffset);

              if (header >= 0 && header <= 127) {
                // Normal pixels.
                blockLength = header + 1;
              } else if (header >= -127 && header <= -1) {
                // Collapsed pixels.
                iterations = -header + 1;
              } else
                /*if (header === -128)*/
                {
                  // Placeholder byte?
                  getHeader = true;
                }
            } else {
              var currentByte = this.getUint8(stripOffset + byteOffset); // Duplicate bytes, if necessary.

              for (var m = 0; m < iterations; m++) {
                if (sampleProperties[sample].hasBytesPerSample) {
                  // We're reading one byte at a time, so we need to handle multi-byte samples.
                  currentSample = currentSample << 8 * numBytes | currentByte;
                  numBytes++; // Is our sample complete?

                  if (numBytes === sampleProperties[sample].bytesPerSample) {
                    pixel.push(currentSample);
                    currentSample = numBytes = 0;
                    sample++;
                  }
                } else {
                  throw RangeError(debug.getError(6025));
                } // Is our pixel complete?


                if (sample === samplesPerPixel) {
                  strips[i].push(pixel);
                  pixel = [];
                  sample = 0;
                }
              }

              blockLength--; // Is our block complete?

              if (blockLength === 0) {
                getHeader = true;
              }
            }

            jIncrement = 1;
            break;
          // Unknown compression algorithm

          default:
            // Do not attempt to parse the image data.
            break;
        }
      }
    }

    if (canvas.getContext) {
      var ctx = this.canvas.getContext("2d"); // Set a default fill style.

      ctx.fillStyle = "rgba(255, 255, 255, 0)"; // If RowsPerStrip is missing, the whole image is in one strip.

      var rowsPerStrip = fileDirectory['RowsPerStrip'] ? fileDirectory['RowsPerStrip'].values[0] : imageLength;
      var numStrips = strips.length;
      var imageLengthModRowsPerStrip = imageLength % rowsPerStrip;
      var rowsInLastStrip = imageLengthModRowsPerStrip === 0 ? rowsPerStrip : imageLengthModRowsPerStrip;
      var numRowsInStrip = rowsPerStrip;
      var numRowsInPreviousStrip = 0;
      var photometricInterpretation = fileDirectory['PhotometricInterpretation'].values[0];
      var extraSamplesValues = [];
      var numExtraSamples = 0;

      if (fileDirectory['ExtraSamples']) {
        extraSamplesValues = fileDirectory['ExtraSamples'].values;
        numExtraSamples = extraSamplesValues.length;
      }

      if (fileDirectory['ColorMap']) {
        var colorMapValues = fileDirectory['ColorMap'].values;
        var colorMapSampleSize = Math.pow(2, sampleProperties[0].bitsPerSample);
      } // Loop through the strips in the image.


      for (var i = 0; i < numStrips; i++) {
        // The last strip may be short.
        if (i + 1 === numStrips) {
          numRowsInStrip = rowsInLastStrip;
        }

        var numPixels = strips[i].length;
        var yPadding = numRowsInPreviousStrip * i; // Loop through the rows in the strip.

        for (var y = 0, j = 0; y < numRowsInStrip, j < numPixels; y++) {
          // Loop through the pixels in the row.
          for (var x = 0; x < imageWidth; x++, j++) {
            var pixelSamples = strips[i][j];
            var red = 0;
            var green = 0;
            var blue = 0;
            var opacity = 1.0;

            if (numExtraSamples > 0) {
              for (var k = 0; k < numExtraSamples; k++) {
                if (extraSamplesValues[k] === 1 || extraSamplesValues[k] === 2) {
                  // Clamp opacity to the range [0,1].
                  opacity = pixelSamples[3 + k] / 256;
                  break;
                }
              }
            }

            switch (photometricInterpretation) {
              // Bilevel or Grayscale
              // WhiteIsZero
              case 0:
                if (sampleProperties[0].hasBytesPerSample) {
                  var invertValue = Math.pow(0x10, sampleProperties[0].bytesPerSample * 2);
                } // Invert samples.


                pixelSamples.forEach(function (sample, index, samples) {
                  samples[index] = invertValue - sample;
                });
              // Bilevel or Grayscale
              // BlackIsZero

              case 1:
                red = green = blue = this.clampColorSample(pixelSamples[0], sampleProperties[0].bitsPerSample);
                break;
              // RGB Full Color

              case 2:
                red = this.clampColorSample(pixelSamples[0], sampleProperties[0].bitsPerSample);
                green = this.clampColorSample(pixelSamples[1], sampleProperties[1].bitsPerSample);
                blue = this.clampColorSample(pixelSamples[2], sampleProperties[2].bitsPerSample);
                break;
              // RGB Color Palette

              case 3:
                if (colorMapValues === undefined) {
                  throw Error(debug.getError(6027));
                }

                var colorMapIndex = pixelSamples[0];
                red = this.clampColorSample(colorMapValues[colorMapIndex], 16);
                green = this.clampColorSample(colorMapValues[colorMapSampleSize + colorMapIndex], 16);
                blue = this.clampColorSample(colorMapValues[2 * colorMapSampleSize + colorMapIndex], 16);
                break;
              // Unknown Photometric Interpretation

              default:
                throw RangeError(debug.getError(6028, photometricInterpretation));
                break;
            }

            ctx.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + opacity + ")";
            ctx.fillRect(x, yPadding + y, 1, 1);
          }
        }

        numRowsInPreviousStrip = numRowsInStrip;
      }
    }

    return this.canvas;
  },
  // See: http://www.digitizationguidelines.gov/guidelines/TIFF_Metadata_Final.pdf
  // See: http://www.digitalpreservation.gov/formats/content/tiff_tags.shtml
  fieldTagNames: {
    // TIFF Baseline
    0x013B: 'Artist',
    0x0102: 'BitsPerSample',
    0x0109: 'CellLength',
    0x0108: 'CellWidth',
    0x0140: 'ColorMap',
    0x0103: 'Compression',
    0x8298: 'Copyright',
    0x0132: 'DateTime',
    0x0152: 'ExtraSamples',
    0x010A: 'FillOrder',
    0x0121: 'FreeByteCounts',
    0x0120: 'FreeOffsets',
    0x0123: 'GrayResponseCurve',
    0x0122: 'GrayResponseUnit',
    0x013C: 'HostComputer',
    0x010E: 'ImageDescription',
    0x0101: 'ImageLength',
    0x0100: 'ImageWidth',
    0x010F: 'Make',
    0x0119: 'MaxSampleValue',
    0x0118: 'MinSampleValue',
    0x0110: 'Model',
    0x00FE: 'NewSubfileType',
    0x0112: 'Orientation',
    0x0106: 'PhotometricInterpretation',
    0x011C: 'PlanarConfiguration',
    0x0128: 'ResolutionUnit',
    0x0116: 'RowsPerStrip',
    0x0115: 'SamplesPerPixel',
    0x0131: 'Software',
    0x0117: 'StripByteCounts',
    0x0111: 'StripOffsets',
    0x00FF: 'SubfileType',
    0x0107: 'Threshholding',
    0x011A: 'XResolution',
    0x011B: 'YResolution',
    // TIFF Extended
    0x0146: 'BadFaxLines',
    0x0147: 'CleanFaxData',
    0x0157: 'ClipPath',
    0x0148: 'ConsecutiveBadFaxLines',
    0x01B1: 'Decode',
    0x01B2: 'DefaultImageColor',
    0x010D: 'DocumentName',
    0x0150: 'DotRange',
    0x0141: 'HalftoneHints',
    0x015A: 'Indexed',
    0x015B: 'JPEGTables',
    0x011D: 'PageName',
    0x0129: 'PageNumber',
    0x013D: 'Predictor',
    0x013F: 'PrimaryChromaticities',
    0x0214: 'ReferenceBlackWhite',
    0x0153: 'SampleFormat',
    0x022F: 'StripRowCounts',
    0x014A: 'SubIFDs',
    0x0124: 'T4Options',
    0x0125: 'T6Options',
    0x0145: 'TileByteCounts',
    0x0143: 'TileLength',
    0x0144: 'TileOffsets',
    0x0142: 'TileWidth',
    0x012D: 'TransferFunction',
    0x013E: 'WhitePoint',
    0x0158: 'XClipPathUnits',
    0x011E: 'XPosition',
    0x0211: 'YCbCrCoefficients',
    0x0213: 'YCbCrPositioning',
    0x0212: 'YCbCrSubSampling',
    0x0159: 'YClipPathUnits',
    0x011F: 'YPosition',
    // EXIF
    0x9202: 'ApertureValue',
    0xA001: 'ColorSpace',
    0x9004: 'DateTimeDigitized',
    0x9003: 'DateTimeOriginal',
    0x8769: 'Exif IFD',
    0x9000: 'ExifVersion',
    0x829A: 'ExposureTime',
    0xA300: 'FileSource',
    0x9209: 'Flash',
    0xA000: 'FlashpixVersion',
    0x829D: 'FNumber',
    0xA420: 'ImageUniqueID',
    0x9208: 'LightSource',
    0x927C: 'MakerNote',
    0x9201: 'ShutterSpeedValue',
    0x9286: 'UserComment',
    // IPTC
    0x83BB: 'IPTC',
    // ICC
    0x8773: 'ICC Profile',
    // XMP
    0x02BC: 'XMP',
    // GDAL
    0xA480: 'GDAL_METADATA',
    0xA481: 'GDAL_NODATA',
    // Photoshop
    0x8649: 'Photoshop'
  },
  fieldTypeNames: {
    0x0001: 'BYTE',
    0x0002: 'ASCII',
    0x0003: 'SHORT',
    0x0004: 'LONG',
    0x0005: 'RATIONAL',
    0x0006: 'SBYTE',
    0x0007: 'UNDEFINED',
    0x0008: 'SSHORT',
    0x0009: 'SLONG',
    0x000A: 'SRATIONAL',
    0x000B: 'FLOAT',
    0x000C: 'DOUBLE'
  }
};
module.exports = tiffReader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVElGRlJlYWRlci5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsInJlcXVpcmUiLCJ0aWZmUmVhZGVyIiwiX2xpdHRsZUVuZGlhbiIsIl90aWZmRGF0YSIsIl9maWxlRGlyZWN0b3JpZXMiLCJnZXRVaW50OCIsIm9mZnNldCIsImdldFVpbnQxNiIsImdldFVpbnQzMiIsImEiLCJjaGVja0xpdHRsZUVuZGlhbiIsIkJPTSIsImxpdHRsZUVuZGlhbiIsImNvbnNvbGUiLCJsb2ciLCJUeXBlRXJyb3IiLCJnZXRFcnJvciIsImhhc1Rvd2VsIiwiUmFuZ2VFcnJvciIsImdldEZpZWxkVHlwZU5hbWUiLCJmaWVsZFR5cGUiLCJ0eXBlTmFtZXMiLCJmaWVsZFR5cGVOYW1lcyIsImdldEZpZWxkVGFnTmFtZSIsImZpZWxkVGFnIiwidGFnTmFtZXMiLCJmaWVsZFRhZ05hbWVzIiwiY2MiLCJsb2dJRCIsImdldEZpZWxkVHlwZUxlbmd0aCIsImZpZWxkVHlwZU5hbWUiLCJpbmRleE9mIiwiZ2V0RmllbGRWYWx1ZXMiLCJmaWVsZFRhZ05hbWUiLCJ0eXBlQ291bnQiLCJ2YWx1ZU9mZnNldCIsImZpZWxkVmFsdWVzIiwiZmllbGRUeXBlTGVuZ3RoIiwiZmllbGRWYWx1ZVNpemUiLCJwdXNoIiwiaSIsImluZGV4T2Zmc2V0IiwiZ2V0Qnl0ZXMiLCJmb3JFYWNoIiwiZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsIm51bUJ5dGVzIiwiZ2V0Qml0cyIsIm51bUJpdHMiLCJieXRlT2Zmc2V0IiwiYml0T2Zmc2V0IiwiZXh0cmFCeXRlcyIsIk1hdGgiLCJmbG9vciIsIm5ld0J5dGVPZmZzZXQiLCJ0b3RhbEJpdHMiLCJzaGlmdFJpZ2h0Iiwic2hpZnRMZWZ0IiwicmF3Qml0cyIsInBhcnNlRmlsZURpcmVjdG9yeSIsIm51bURpckVudHJpZXMiLCJ0aWZmRmllbGRzIiwiZW50cnlDb3VudCIsInR5cGUiLCJ2YWx1ZXMiLCJuZXh0SUZEQnl0ZU9mZnNldCIsImNsYW1wQ29sb3JTYW1wbGUiLCJjb2xvclNhbXBsZSIsImJpdHNQZXJTYW1wbGUiLCJtdWx0aXBsaWVyIiwicG93IiwicGFyc2VUSUZGIiwidGlmZkRhdGEiLCJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJmaXJzdElGREJ5dGVPZmZzZXQiLCJsZW5ndGgiLCJmaWxlRGlyZWN0b3J5IiwiaW1hZ2VXaWR0aCIsImltYWdlTGVuZ3RoIiwid2lkdGgiLCJoZWlnaHQiLCJzdHJpcHMiLCJjb21wcmVzc2lvbiIsInNhbXBsZXNQZXJQaXhlbCIsInNhbXBsZVByb3BlcnRpZXMiLCJiaXRzUGVyUGl4ZWwiLCJoYXNCeXRlc1BlclBpeGVsIiwiYml0c1BlclNhbXBsZVZhbHVlcyIsImhhc0J5dGVzUGVyU2FtcGxlIiwiYnl0ZXNQZXJTYW1wbGUiLCJ1bmRlZmluZWQiLCJieXRlc1BlclBpeGVsIiwic3RyaXBPZmZzZXRWYWx1ZXMiLCJudW1TdHJpcE9mZnNldFZhbHVlcyIsInN0cmlwQnl0ZUNvdW50VmFsdWVzIiwiY2VpbCIsIkVycm9yIiwic3RyaXBPZmZzZXQiLCJzdHJpcEJ5dGVDb3VudCIsImpJbmNyZW1lbnQiLCJnZXRIZWFkZXIiLCJwaXhlbCIsInNhbXBsZSIsImN1cnJlbnRTYW1wbGUiLCJtIiwic2FtcGxlT2Zmc2V0Iiwic2FtcGxlSW5mbyIsImJpdHMiLCJibG9ja0xlbmd0aCIsIml0ZXJhdGlvbnMiLCJoZWFkZXIiLCJnZXRJbnQ4IiwiY3VycmVudEJ5dGUiLCJnZXRDb250ZXh0IiwiY3R4IiwiZmlsbFN0eWxlIiwicm93c1BlclN0cmlwIiwibnVtU3RyaXBzIiwiaW1hZ2VMZW5ndGhNb2RSb3dzUGVyU3RyaXAiLCJyb3dzSW5MYXN0U3RyaXAiLCJudW1Sb3dzSW5TdHJpcCIsIm51bVJvd3NJblByZXZpb3VzU3RyaXAiLCJwaG90b21ldHJpY0ludGVycHJldGF0aW9uIiwiZXh0cmFTYW1wbGVzVmFsdWVzIiwibnVtRXh0cmFTYW1wbGVzIiwiY29sb3JNYXBWYWx1ZXMiLCJjb2xvck1hcFNhbXBsZVNpemUiLCJudW1QaXhlbHMiLCJ5UGFkZGluZyIsInkiLCJqIiwieCIsInBpeGVsU2FtcGxlcyIsInJlZCIsImdyZWVuIiwiYmx1ZSIsIm9wYWNpdHkiLCJrIiwiaW52ZXJ0VmFsdWUiLCJpbmRleCIsInNhbXBsZXMiLCJjb2xvck1hcEluZGV4IiwiZmlsbFJlY3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxpQkFBRCxDQUFyQjtBQUVBOzs7Ozs7O0FBS0EsSUFBSUMsVUFBVTtBQUFHO0FBQXlCO0FBQ3RDQyxFQUFBQSxhQUFhLEVBQUUsS0FEdUI7QUFFdENDLEVBQUFBLFNBQVMsRUFBRSxJQUYyQjtBQUd0Q0MsRUFBQUEsZ0JBQWdCLEVBQUUsRUFIb0I7QUFLdENDLEVBQUFBLFFBQVEsRUFBRSxrQkFBVUMsTUFBVixFQUFrQjtBQUN4QixXQUFPLEtBQUtILFNBQUwsQ0FBZUcsTUFBZixDQUFQO0FBQ0gsR0FQcUM7QUFTdENDLEVBQUFBLFNBQVMsRUFBRSxtQkFBVUQsTUFBVixFQUFrQjtBQUN6QixRQUFJLEtBQUtKLGFBQVQsRUFDSSxPQUFRLEtBQUtDLFNBQUwsQ0FBZUcsTUFBTSxHQUFHLENBQXhCLEtBQThCLENBQS9CLEdBQXFDLEtBQUtILFNBQUwsQ0FBZUcsTUFBZixDQUE1QyxDQURKLEtBR0ksT0FBUSxLQUFLSCxTQUFMLENBQWVHLE1BQWYsS0FBMEIsQ0FBM0IsR0FBaUMsS0FBS0gsU0FBTCxDQUFlRyxNQUFNLEdBQUcsQ0FBeEIsQ0FBeEM7QUFDUCxHQWRxQztBQWdCdENFLEVBQUFBLFNBQVMsRUFBRSxtQkFBVUYsTUFBVixFQUFrQjtBQUN6QixRQUFJRyxDQUFDLEdBQUcsS0FBS04sU0FBYjtBQUNBLFFBQUksS0FBS0QsYUFBVCxFQUNJLE9BQVFPLENBQUMsQ0FBQ0gsTUFBTSxHQUFHLENBQVYsQ0FBRCxJQUFpQixFQUFsQixHQUF5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WUFBUSxjQWxGRztBQW1GWCxZQUFRLFlBbkZHO0FBb0ZYLFlBQVEsT0FwRkc7QUFxRlgsWUFBUSxpQkFyRkc7QUFzRlgsWUFBUSxTQXRGRztBQXVGWCxZQUFRLGVBdkZHO0FBd0ZYLFlBQVEsYUF4Rkc7QUF5RlgsWUFBUSxXQXpGRztBQTBGWCxZQUFRLG1CQTFGRztBQTJGWCxZQUFRLGFBM0ZHO0FBNkZYO0FBQ0EsWUFBUSxNQTlGRztBQWdHWDtBQUNBLFlBQVEsYUFqR0c7QUFtR1g7QUFDQSxZQUFRLEtBcEdHO0FBc0dYO0FBQ0EsWUFBUSxlQXZHRztBQXdHWCxZQUFRLGFBeEdHO0FBMEdYO0FBQ0EsWUFBUTtBQTNHRyxHQXJoQnVCO0FBbW9CdENKLEVBQUFBLGNBQWMsRUFBRTtBQUNaLFlBQVEsTUFESTtBQUVaLFlBQVEsT0FGSTtBQUdaLFlBQVEsT0FISTtBQUlaLFlBQVEsTUFKSTtBQUtaLFlBQVEsVUFMSTtBQU1aLFlBQVEsT0FOSTtBQU9aLFlBQVEsV0FQSTtBQVFaLFlBQVEsUUFSSTtBQVNaLFlBQVEsT0FUSTtBQVVaLFlBQVEsV0FWSTtBQVdaLFlBQVEsT0FYSTtBQVlaLFlBQVE7QUFaSTtBQW5vQnNCLENBQTFDO0FBbXBCQTRILE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxKLFVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTEgR29yZG9uIFAuIEhlbXNsZXlcbiBodHRwOi8vZ3BoZW1zbGV5Lm9yZy9cblxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnLi4vY29yZS9DQ0RlYnVnJyk7XG5cbi8qKlxuICogY2MudGlmZlJlYWRlciBpcyBhIHNpbmdsZXRvbiBvYmplY3QsIGl0J3MgYSB0aWZmIGZpbGUgcmVhZGVyLCBpdCBjYW4gcGFyc2UgYnl0ZSBhcnJheSB0byBkcmF3IGludG8gYSBjYW52YXNcbiAqIEBjbGFzc1xuICogQG5hbWUgdGlmZlJlYWRlclxuICovXG52YXIgdGlmZlJlYWRlciA9IC8qKiBAbGVuZHMgdGlmZlJlYWRlciMgKi97XG4gICAgX2xpdHRsZUVuZGlhbjogZmFsc2UsXG4gICAgX3RpZmZEYXRhOiBudWxsLFxuICAgIF9maWxlRGlyZWN0b3JpZXM6IFtdLFxuXG4gICAgZ2V0VWludDg6IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpZmZEYXRhW29mZnNldF07XG4gICAgfSxcblxuICAgIGdldFVpbnQxNjogZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICBpZiAodGhpcy5fbGl0dGxlRW5kaWFuKVxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl90aWZmRGF0YVtvZmZzZXQgKyAxXSA8PCA4KSB8ICh0aGlzLl90aWZmRGF0YVtvZmZzZXRdKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl90aWZmRGF0YVtvZmZzZXRdIDw8IDgpIHwgKHRoaXMuX3RpZmZEYXRhW29mZnNldCArIDFdKTtcbiAgICB9LFxuXG4gICAgZ2V0VWludDMyOiBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgICAgIHZhciBhID0gdGhpcy5fdGlmZkRhdGE7XG4gICAgICAgIGlmICh0aGlzLl9saXR0bGVFbmRpYW4pXG4gICAgICAgICAgICByZXR1cm4gKGFbb2Zmc2V0ICsgM10gPDwgMjQpIHwgKGFbb2Zmc2V0ICsgMl0gPDwgMTYpIHwgKGFbb2Zmc2V0ICsgMV0gPDwgOCkgfCAoYVtvZmZzZXRdKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIChhW29mZnNldF0gPDwgMjQpIHwgKGFbb2Zmc2V0ICsgMV0gPDwgMTYpIHwgKGFbb2Zmc2V0ICsgMl0gPDwgOCkgfCAoYVtvZmZzZXQgKyAzXSk7XG4gICAgfSxcblxuICAgIGNoZWNrTGl0dGxlRW5kaWFuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBCT00gPSB0aGlzLmdldFVpbnQxNigwKTtcblxuICAgICAgICBpZiAoQk9NID09PSAweDQ5NDkpIHtcbiAgICAgICAgICAgIHRoaXMubGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChCT00gPT09IDB4NEQ0RCkge1xuICAgICAgICAgICAgdGhpcy5saXR0bGVFbmRpYW4gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEJPTSk7XG4gICAgICAgICAgICB0aHJvdyBUeXBlRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAxOSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGl0dGxlRW5kaWFuO1xuICAgIH0sXG5cbiAgICBoYXNUb3dlbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBDaGVjayBmb3IgdG93ZWwuXG4gICAgICAgIGlmICh0aGlzLmdldFVpbnQxNigyKSAhPT0gNDIpIHtcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAyMCkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGdldEZpZWxkVHlwZU5hbWU6IGZ1bmN0aW9uIChmaWVsZFR5cGUpIHtcbiAgICAgICAgdmFyIHR5cGVOYW1lcyA9IHRoaXMuZmllbGRUeXBlTmFtZXM7XG4gICAgICAgIGlmIChmaWVsZFR5cGUgaW4gdHlwZU5hbWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZU5hbWVzW2ZpZWxkVHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIGdldEZpZWxkVGFnTmFtZTogZnVuY3Rpb24gKGZpZWxkVGFnKSB7XG4gICAgICAgIHZhciB0YWdOYW1lcyA9IHRoaXMuZmllbGRUYWdOYW1lcztcblxuICAgICAgICBpZiAoZmllbGRUYWcgaW4gdGFnTmFtZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0YWdOYW1lc1tmaWVsZFRhZ107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5sb2dJRCg2MDIxLCBmaWVsZFRhZyk7XG4gICAgICAgICAgICByZXR1cm4gXCJUYWdcIiArIGZpZWxkVGFnO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldEZpZWxkVHlwZUxlbmd0aDogZnVuY3Rpb24gKGZpZWxkVHlwZU5hbWUpIHtcbiAgICAgICAgaWYgKFsnQllURScsICdBU0NJSScsICdTQllURScsICdVTkRFRklORUQnXS5pbmRleE9mKGZpZWxkVHlwZU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoWydTSE9SVCcsICdTU0hPUlQnXS5pbmRleE9mKGZpZWxkVHlwZU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgIH0gZWxzZSBpZiAoWydMT05HJywgJ1NMT05HJywgJ0ZMT0FUJ10uaW5kZXhPZihmaWVsZFR5cGVOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiA0O1xuICAgICAgICB9IGVsc2UgaWYgKFsnUkFUSU9OQUwnLCAnU1JBVElPTkFMJywgJ0RPVUJMRSddLmluZGV4T2YoZmllbGRUeXBlTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gODtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgZ2V0RmllbGRWYWx1ZXM6IGZ1bmN0aW9uIChmaWVsZFRhZ05hbWUsIGZpZWxkVHlwZU5hbWUsIHR5cGVDb3VudCwgdmFsdWVPZmZzZXQpIHtcbiAgICAgICAgdmFyIGZpZWxkVmFsdWVzID0gW107XG4gICAgICAgIHZhciBmaWVsZFR5cGVMZW5ndGggPSB0aGlzLmdldEZpZWxkVHlwZUxlbmd0aChmaWVsZFR5cGVOYW1lKTtcbiAgICAgICAgdmFyIGZpZWxkVmFsdWVTaXplID0gZmllbGRUeXBlTGVuZ3RoICogdHlwZUNvdW50O1xuXG4gICAgICAgIGlmIChmaWVsZFZhbHVlU2l6ZSA8PSA0KSB7XG4gICAgICAgICAgICAvLyBUaGUgdmFsdWUgaXMgc3RvcmVkIGF0IHRoZSBiaWcgZW5kIG9mIHRoZSB2YWx1ZU9mZnNldC5cbiAgICAgICAgICAgIGlmICh0aGlzLmxpdHRsZUVuZGlhbiA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgZmllbGRWYWx1ZXMucHVzaCh2YWx1ZU9mZnNldCA+Pj4gKCg0IC0gZmllbGRUeXBlTGVuZ3RoKSAqIDgpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBmaWVsZFZhbHVlcy5wdXNoKHZhbHVlT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhPZmZzZXQgPSBmaWVsZFR5cGVMZW5ndGggKiBpO1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZFR5cGVMZW5ndGggPj0gOCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoWydSQVRJT05BTCcsICdTUkFUSU9OQUwnXS5pbmRleE9mKGZpZWxkVHlwZU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnVtZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFZhbHVlcy5wdXNoKHRoaXMuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgaW5kZXhPZmZzZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbm9taW5hdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFZhbHVlcy5wdXNoKHRoaXMuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgaW5kZXhPZmZzZXQgKyA0KSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5sb2dJRCg4MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkVmFsdWVzLnB1c2godGhpcy5nZXRCeXRlcyhmaWVsZFR5cGVMZW5ndGgsIHZhbHVlT2Zmc2V0ICsgaW5kZXhPZmZzZXQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmllbGRUeXBlTmFtZSA9PT0gJ0FTQ0lJJykge1xuICAgICAgICAgICAgZmllbGRWYWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAoZSwgaSwgYSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkVmFsdWVzO1xuICAgIH0sXG5cbiAgICBnZXRCeXRlczogZnVuY3Rpb24gKG51bUJ5dGVzLCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKG51bUJ5dGVzIDw9IDApIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDgwMDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG51bUJ5dGVzIDw9IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVpbnQ4KG9mZnNldCk7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtQnl0ZXMgPD0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VWludDE2KG9mZnNldCk7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtQnl0ZXMgPD0gMykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VWludDMyKG9mZnNldCkgPj4+IDg7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtQnl0ZXMgPD0gNCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VWludDMyKG9mZnNldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5sb2dJRCg4MDAyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRCaXRzOiBmdW5jdGlvbiAobnVtQml0cywgYnl0ZU9mZnNldCwgYml0T2Zmc2V0KSB7XG4gICAgICAgIGJpdE9mZnNldCA9IGJpdE9mZnNldCB8fCAwO1xuICAgICAgICB2YXIgZXh0cmFCeXRlcyA9IE1hdGguZmxvb3IoYml0T2Zmc2V0IC8gOCk7XG4gICAgICAgIHZhciBuZXdCeXRlT2Zmc2V0ID0gYnl0ZU9mZnNldCArIGV4dHJhQnl0ZXM7XG4gICAgICAgIHZhciB0b3RhbEJpdHMgPSBiaXRPZmZzZXQgKyBudW1CaXRzO1xuICAgICAgICB2YXIgc2hpZnRSaWdodCA9IDMyIC0gbnVtQml0cztcbiAgICAgICAgdmFyIHNoaWZ0TGVmdCxyYXdCaXRzO1xuXG4gICAgICAgIGlmICh0b3RhbEJpdHMgPD0gMCkge1xuICAgICAgICAgICAgY2MubG9nSUQoNjAyMyk7XG4gICAgICAgIH0gZWxzZSBpZiAodG90YWxCaXRzIDw9IDgpIHtcbiAgICAgICAgICAgIHNoaWZ0TGVmdCA9IDI0ICsgYml0T2Zmc2V0O1xuICAgICAgICAgICAgcmF3Qml0cyA9IHRoaXMuZ2V0VWludDgobmV3Qnl0ZU9mZnNldCk7XG4gICAgICAgIH0gZWxzZSBpZiAodG90YWxCaXRzIDw9IDE2KSB7XG4gICAgICAgICAgICBzaGlmdExlZnQgPSAxNiArIGJpdE9mZnNldDtcbiAgICAgICAgICAgIHJhd0JpdHMgPSB0aGlzLmdldFVpbnQxNihuZXdCeXRlT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0b3RhbEJpdHMgPD0gMzIpIHtcbiAgICAgICAgICAgIHNoaWZ0TGVmdCA9IGJpdE9mZnNldDtcbiAgICAgICAgICAgIHJhd0JpdHMgPSB0aGlzLmdldFVpbnQzMihuZXdCeXRlT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDYwMjIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdiaXRzJzogKChyYXdCaXRzIDw8IHNoaWZ0TGVmdCkgPj4+IHNoaWZ0UmlnaHQpLFxuICAgICAgICAgICAgJ2J5dGVPZmZzZXQnOiBuZXdCeXRlT2Zmc2V0ICsgTWF0aC5mbG9vcih0b3RhbEJpdHMgLyA4KSxcbiAgICAgICAgICAgICdiaXRPZmZzZXQnOiB0b3RhbEJpdHMgJSA4XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHBhcnNlRmlsZURpcmVjdG9yeTogZnVuY3Rpb24gKGJ5dGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG51bURpckVudHJpZXMgPSB0aGlzLmdldFVpbnQxNihieXRlT2Zmc2V0KTtcbiAgICAgICAgdmFyIHRpZmZGaWVsZHMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gYnl0ZU9mZnNldCArIDIsIGVudHJ5Q291bnQgPSAwOyBlbnRyeUNvdW50IDwgbnVtRGlyRW50cmllczsgaSArPSAxMiwgZW50cnlDb3VudCsrKSB7XG4gICAgICAgICAgICB2YXIgZmllbGRUYWcgPSB0aGlzLmdldFVpbnQxNihpKTtcbiAgICAgICAgICAgIHZhciBmaWVsZFR5cGUgPSB0aGlzLmdldFVpbnQxNihpICsgMik7XG4gICAgICAgICAgICB2YXIgdHlwZUNvdW50ID0gdGhpcy5nZXRVaW50MzIoaSArIDQpO1xuICAgICAgICAgICAgdmFyIHZhbHVlT2Zmc2V0ID0gdGhpcy5nZXRVaW50MzIoaSArIDgpO1xuXG4gICAgICAgICAgICB2YXIgZmllbGRUYWdOYW1lID0gdGhpcy5nZXRGaWVsZFRhZ05hbWUoZmllbGRUYWcpO1xuICAgICAgICAgICAgdmFyIGZpZWxkVHlwZU5hbWUgPSB0aGlzLmdldEZpZWxkVHlwZU5hbWUoZmllbGRUeXBlKTtcbiAgICAgICAgICAgIHZhciBmaWVsZFZhbHVlcyA9IHRoaXMuZ2V0RmllbGRWYWx1ZXMoZmllbGRUYWdOYW1lLCBmaWVsZFR5cGVOYW1lLCB0eXBlQ291bnQsIHZhbHVlT2Zmc2V0KTtcblxuICAgICAgICAgICAgdGlmZkZpZWxkc1tmaWVsZFRhZ05hbWVdID0geyB0eXBlOiBmaWVsZFR5cGVOYW1lLCB2YWx1ZXM6IGZpZWxkVmFsdWVzIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9maWxlRGlyZWN0b3JpZXMucHVzaCh0aWZmRmllbGRzKTtcblxuICAgICAgICB2YXIgbmV4dElGREJ5dGVPZmZzZXQgPSB0aGlzLmdldFVpbnQzMihpKTtcbiAgICAgICAgaWYgKG5leHRJRkRCeXRlT2Zmc2V0ICE9PSAweDAwMDAwMDAwKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRmlsZURpcmVjdG9yeShuZXh0SUZEQnl0ZU9mZnNldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xhbXBDb2xvclNhbXBsZTogZnVuY3Rpb24oY29sb3JTYW1wbGUsIGJpdHNQZXJTYW1wbGUpIHtcbiAgICAgICAgdmFyIG11bHRpcGxpZXIgPSBNYXRoLnBvdygyLCA4IC0gYml0c1BlclNhbXBsZSk7XG5cbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGNvbG9yU2FtcGxlICogbXVsdGlwbGllcikgKyAobXVsdGlwbGllciAtIDEpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtBcnJheX0gdGlmZkRhdGFcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBwYXJzZVRJRkY6IGZ1bmN0aW9uICh0aWZmRGF0YSwgY2FudmFzKSB7XG4gICAgICAgIGNhbnZhcyA9IGNhbnZhcyB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgICAgICB0aGlzLl90aWZmRGF0YSA9IHRpZmZEYXRhO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICAgICAgICB0aGlzLmNoZWNrTGl0dGxlRW5kaWFuKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc1Rvd2VsKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaXJzdElGREJ5dGVPZmZzZXQgPSB0aGlzLmdldFVpbnQzMig0KTtcblxuICAgICAgICB0aGlzLl9maWxlRGlyZWN0b3JpZXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5wYXJzZUZpbGVEaXJlY3RvcnkoZmlyc3RJRkRCeXRlT2Zmc2V0KTtcblxuICAgICAgICB2YXIgZmlsZURpcmVjdG9yeSA9IHRoaXMuX2ZpbGVEaXJlY3Rvcmllc1swXTtcblxuICAgICAgICB2YXIgaW1hZ2VXaWR0aCA9IGZpbGVEaXJlY3RvcnlbJ0ltYWdlV2lkdGgnXS52YWx1ZXNbMF07XG4gICAgICAgIHZhciBpbWFnZUxlbmd0aCA9IGZpbGVEaXJlY3RvcnlbJ0ltYWdlTGVuZ3RoJ10udmFsdWVzWzBdO1xuXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gaW1hZ2VXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaW1hZ2VMZW5ndGg7XG5cbiAgICAgICAgdmFyIHN0cmlwcyA9IFtdO1xuXG4gICAgICAgIHZhciBjb21wcmVzc2lvbiA9IChmaWxlRGlyZWN0b3J5WydDb21wcmVzc2lvbiddKSA/IGZpbGVEaXJlY3RvcnlbJ0NvbXByZXNzaW9uJ10udmFsdWVzWzBdIDogMTtcblxuICAgICAgICB2YXIgc2FtcGxlc1BlclBpeGVsID0gZmlsZURpcmVjdG9yeVsnU2FtcGxlc1BlclBpeGVsJ10udmFsdWVzWzBdO1xuXG4gICAgICAgIHZhciBzYW1wbGVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdmFyIGJpdHNQZXJQaXhlbCA9IDA7XG4gICAgICAgIHZhciBoYXNCeXRlc1BlclBpeGVsID0gZmFsc2U7XG5cbiAgICAgICAgZmlsZURpcmVjdG9yeVsnQml0c1BlclNhbXBsZSddLnZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uIChiaXRzUGVyU2FtcGxlLCBpLCBiaXRzUGVyU2FtcGxlVmFsdWVzKSB7XG4gICAgICAgICAgICBzYW1wbGVQcm9wZXJ0aWVzW2ldID0ge1xuICAgICAgICAgICAgICAgIGJpdHNQZXJTYW1wbGU6IGJpdHNQZXJTYW1wbGUsXG4gICAgICAgICAgICAgICAgaGFzQnl0ZXNQZXJTYW1wbGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGJ5dGVzUGVyU2FtcGxlOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICgoYml0c1BlclNhbXBsZSAlIDgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc2FtcGxlUHJvcGVydGllc1tpXS5oYXNCeXRlc1BlclNhbXBsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2FtcGxlUHJvcGVydGllc1tpXS5ieXRlc1BlclNhbXBsZSA9IGJpdHNQZXJTYW1wbGUgLyA4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiaXRzUGVyUGl4ZWwgKz0gYml0c1BlclNhbXBsZTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgaWYgKChiaXRzUGVyUGl4ZWwgJSA4KSA9PT0gMCkge1xuICAgICAgICAgICAgaGFzQnl0ZXNQZXJQaXhlbCA9IHRydWU7XG4gICAgICAgICAgICB2YXIgYnl0ZXNQZXJQaXhlbCA9IGJpdHNQZXJQaXhlbCAvIDg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RyaXBPZmZzZXRWYWx1ZXMgPSBmaWxlRGlyZWN0b3J5WydTdHJpcE9mZnNldHMnXS52YWx1ZXM7XG4gICAgICAgIHZhciBudW1TdHJpcE9mZnNldFZhbHVlcyA9IHN0cmlwT2Zmc2V0VmFsdWVzLmxlbmd0aDtcblxuICAgICAgICAvLyBTdHJpcEJ5dGVDb3VudHMgaXMgc3VwcG9zZWQgdG8gYmUgcmVxdWlyZWQsIGJ1dCBzZWUgaWYgd2UgY2FuIHJlY292ZXIgYW55d2F5LlxuICAgICAgICBpZiAoZmlsZURpcmVjdG9yeVsnU3RyaXBCeXRlQ291bnRzJ10pIHtcbiAgICAgICAgICAgIHZhciBzdHJpcEJ5dGVDb3VudFZhbHVlcyA9IGZpbGVEaXJlY3RvcnlbJ1N0cmlwQnl0ZUNvdW50cyddLnZhbHVlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDgwMDMpO1xuXG4gICAgICAgICAgICAvLyBJbmZlciBTdHJpcEJ5dGVDb3VudHMsIGlmIHBvc3NpYmxlLlxuICAgICAgICAgICAgaWYgKG51bVN0cmlwT2Zmc2V0VmFsdWVzID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0cmlwQnl0ZUNvdW50VmFsdWVzID0gW01hdGguY2VpbCgoaW1hZ2VXaWR0aCAqIGltYWdlTGVuZ3RoICogYml0c1BlclBpeGVsKSAvIDgpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAyNCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHN0cmlwcyBhbmQgZGVjb21wcmVzcyBhcyBuZWNlc3NhcnkuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtU3RyaXBPZmZzZXRWYWx1ZXM7IGkrKykge1xuICAgICAgICAgICAgdmFyIHN0cmlwT2Zmc2V0ID0gc3RyaXBPZmZzZXRWYWx1ZXNbaV07XG4gICAgICAgICAgICBzdHJpcHNbaV0gPSBbXTtcblxuICAgICAgICAgICAgdmFyIHN0cmlwQnl0ZUNvdW50ID0gc3RyaXBCeXRlQ291bnRWYWx1ZXNbaV07XG5cbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBwaXhlbHMuXG4gICAgICAgICAgICBmb3IgKHZhciBieXRlT2Zmc2V0ID0gMCwgYml0T2Zmc2V0ID0gMCwgakluY3JlbWVudCA9IDEsIGdldEhlYWRlciA9IHRydWUsIHBpeGVsID0gW10sIG51bUJ5dGVzID0gMCwgc2FtcGxlID0gMCwgY3VycmVudFNhbXBsZSA9IDA7XG4gICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQgPCBzdHJpcEJ5dGVDb3VudDsgYnl0ZU9mZnNldCArPSBqSW5jcmVtZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gRGVjb21wcmVzcyBzdHJpcC5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbXByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVuY29tcHJlc3NlZFxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggc2FtcGxlcyAoc3ViLXBpeGVscykuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMCwgcGl4ZWwgPSBbXTsgbSA8IHNhbXBsZXNQZXJQaXhlbDsgbSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNhbXBsZVByb3BlcnRpZXNbbV0uaGFzQnl0ZXNQZXJTYW1wbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWFhYOiBUaGlzIGlzIHdyb25nIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2FtcGxlT2Zmc2V0ID0gc2FtcGxlUHJvcGVydGllc1ttXS5ieXRlc1BlclNhbXBsZSAqIG07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsLnB1c2godGhpcy5nZXRCeXRlcyhzYW1wbGVQcm9wZXJ0aWVzW21dLmJ5dGVzUGVyU2FtcGxlLCBzdHJpcE9mZnNldCArIGJ5dGVPZmZzZXQgKyBzYW1wbGVPZmZzZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2FtcGxlSW5mbyA9IHRoaXMuZ2V0Qml0cyhzYW1wbGVQcm9wZXJ0aWVzW21dLmJpdHNQZXJTYW1wbGUsIHN0cmlwT2Zmc2V0ICsgYnl0ZU9mZnNldCwgYml0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWwucHVzaChzYW1wbGVJbmZvLmJpdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0ID0gc2FtcGxlSW5mby5ieXRlT2Zmc2V0IC0gc3RyaXBPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdE9mZnNldCA9IHNhbXBsZUluZm8uYml0T2Zmc2V0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAyNSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaXBzW2ldLnB1c2gocGl4ZWwpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzQnl0ZXNQZXJQaXhlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpJbmNyZW1lbnQgPSBieXRlc1BlclBpeGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqSW5jcmVtZW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yKGRlYnVnLmdldEVycm9yKDYwMjYpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENJVFQgR3JvdXAgMyAxLURpbWVuc2lvbmFsIE1vZGlmaWVkIEh1ZmZtYW4gcnVuLWxlbmd0aCBlbmNvZGluZ1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBYWFg6IFVzZSBQREYuanMgY29kZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEdyb3VwIDMgRmF4XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhYWDogVXNlIFBERi5qcyBjb2RlP1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gR3JvdXAgNCBGYXhcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWFhYOiBVc2UgUERGLmpzIGNvZGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBMWldcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWFhYOiBVc2UgUERGLmpzIGNvZGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBPbGQtc3R5bGUgSlBFRyAoVElGRiA2LjApXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhYWDogVXNlIFBERi5qcyBjb2RlP1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTmV3LXN0eWxlIEpQRUcgKFRJRkYgU3BlY2lmaWNhdGlvbiBTdXBwbGVtZW50IDIpXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhYWDogVXNlIFBERi5qcyBjb2RlP1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUGFja0JpdHNcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjc3MzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFyZSB3ZSByZWFkeSBmb3IgYSBuZXcgYmxvY2s/XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0SGVhZGVyID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2tMZW5ndGggPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVyYXRpb25zID0gMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBoZWFkZXIgYnl0ZSBpcyBzaWduZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMuZ2V0SW50OChzdHJpcE9mZnNldCArIGJ5dGVPZmZzZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChoZWFkZXIgPj0gMCkgJiYgKGhlYWRlciA8PSAxMjcpKSB7IC8vIE5vcm1hbCBwaXhlbHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrTGVuZ3RoID0gaGVhZGVyICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChoZWFkZXIgPj0gLTEyNykgJiYgKGhlYWRlciA8PSAtMSkpIHsgLy8gQ29sbGFwc2VkIHBpeGVscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0aW9ucyA9IC1oZWFkZXIgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSAvKmlmIChoZWFkZXIgPT09IC0xMjgpKi8geyAvLyBQbGFjZWhvbGRlciBieXRlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRIZWFkZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRCeXRlID0gdGhpcy5nZXRVaW50OChzdHJpcE9mZnNldCArIGJ5dGVPZmZzZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRHVwbGljYXRlIGJ5dGVzLCBpZiBuZWNlc3NhcnkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBpdGVyYXRpb25zOyBtKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNhbXBsZVByb3BlcnRpZXNbc2FtcGxlXS5oYXNCeXRlc1BlclNhbXBsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgcmVhZGluZyBvbmUgYnl0ZSBhdCBhIHRpbWUsIHNvIHdlIG5lZWQgdG8gaGFuZGxlIG11bHRpLWJ5dGUgc2FtcGxlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTYW1wbGUgPSAoY3VycmVudFNhbXBsZSA8PCAoOCAqIG51bUJ5dGVzKSkgfCBjdXJyZW50Qnl0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bUJ5dGVzKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIG91ciBzYW1wbGUgY29tcGxldGU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtQnl0ZXMgPT09IHNhbXBsZVByb3BlcnRpZXNbc2FtcGxlXS5ieXRlc1BlclNhbXBsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsLnB1c2goY3VycmVudFNhbXBsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNhbXBsZSA9IG51bUJ5dGVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGUrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAyNSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXMgb3VyIHBpeGVsIGNvbXBsZXRlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxlID09PSBzYW1wbGVzUGVyUGl4ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwc1tpXS5wdXNoKHBpeGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tMZW5ndGgtLTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIG91ciBibG9jayBjb21wbGV0ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2tMZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0SGVhZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGpJbmNyZW1lbnQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVW5rbm93biBjb21wcmVzc2lvbiBhbGdvcml0aG1cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCBhdHRlbXB0IHRvIHBhcnNlIHRoZSBpbWFnZSBkYXRhLlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICAgICAgICAvLyBTZXQgYSBkZWZhdWx0IGZpbGwgc3R5bGUuXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDApXCI7XG5cbiAgICAgICAgICAgIC8vIElmIFJvd3NQZXJTdHJpcCBpcyBtaXNzaW5nLCB0aGUgd2hvbGUgaW1hZ2UgaXMgaW4gb25lIHN0cmlwLlxuICAgICAgICAgICAgdmFyIHJvd3NQZXJTdHJpcCA9IGZpbGVEaXJlY3RvcnlbJ1Jvd3NQZXJTdHJpcCddID8gZmlsZURpcmVjdG9yeVsnUm93c1BlclN0cmlwJ10udmFsdWVzWzBdIDogaW1hZ2VMZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciBudW1TdHJpcHMgPSBzdHJpcHMubGVuZ3RoO1xuXG4gICAgICAgICAgICB2YXIgaW1hZ2VMZW5ndGhNb2RSb3dzUGVyU3RyaXAgPSBpbWFnZUxlbmd0aCAlIHJvd3NQZXJTdHJpcDtcbiAgICAgICAgICAgIHZhciByb3dzSW5MYXN0U3RyaXAgPSAoaW1hZ2VMZW5ndGhNb2RSb3dzUGVyU3RyaXAgPT09IDApID8gcm93c1BlclN0cmlwIDogaW1hZ2VMZW5ndGhNb2RSb3dzUGVyU3RyaXA7XG5cbiAgICAgICAgICAgIHZhciBudW1Sb3dzSW5TdHJpcCA9IHJvd3NQZXJTdHJpcDtcbiAgICAgICAgICAgIHZhciBudW1Sb3dzSW5QcmV2aW91c1N0cmlwID0gMDtcblxuICAgICAgICAgICAgdmFyIHBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24gPSBmaWxlRGlyZWN0b3J5WydQaG90b21ldHJpY0ludGVycHJldGF0aW9uJ10udmFsdWVzWzBdO1xuXG4gICAgICAgICAgICB2YXIgZXh0cmFTYW1wbGVzVmFsdWVzID0gW107XG4gICAgICAgICAgICB2YXIgbnVtRXh0cmFTYW1wbGVzID0gMDtcblxuICAgICAgICAgICAgaWYgKGZpbGVEaXJlY3RvcnlbJ0V4dHJhU2FtcGxlcyddKSB7XG4gICAgICAgICAgICAgICAgZXh0cmFTYW1wbGVzVmFsdWVzID0gZmlsZURpcmVjdG9yeVsnRXh0cmFTYW1wbGVzJ10udmFsdWVzO1xuICAgICAgICAgICAgICAgIG51bUV4dHJhU2FtcGxlcyA9IGV4dHJhU2FtcGxlc1ZhbHVlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmaWxlRGlyZWN0b3J5WydDb2xvck1hcCddKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yTWFwVmFsdWVzID0gZmlsZURpcmVjdG9yeVsnQ29sb3JNYXAnXS52YWx1ZXM7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yTWFwU2FtcGxlU2l6ZSA9IE1hdGgucG93KDIsIHNhbXBsZVByb3BlcnRpZXNbMF0uYml0c1BlclNhbXBsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgc3RyaXBzIGluIHRoZSBpbWFnZS5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtU3RyaXBzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGFzdCBzdHJpcCBtYXkgYmUgc2hvcnQuXG4gICAgICAgICAgICAgICAgaWYgKChpICsgMSkgPT09IG51bVN0cmlwcykge1xuICAgICAgICAgICAgICAgICAgICBudW1Sb3dzSW5TdHJpcCA9IHJvd3NJbkxhc3RTdHJpcDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbnVtUGl4ZWxzID0gc3RyaXBzW2ldLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgeVBhZGRpbmcgPSBudW1Sb3dzSW5QcmV2aW91c1N0cmlwICogaTtcblxuICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgcm93cyBpbiB0aGUgc3RyaXAuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDAsIGogPSAwOyB5IDwgbnVtUm93c0luU3RyaXAsIGogPCBudW1QaXhlbHM7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHBpeGVscyBpbiB0aGUgcm93LlxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGltYWdlV2lkdGg7IHgrKywgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGl4ZWxTYW1wbGVzID0gc3RyaXBzW2ldW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncmVlbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3BhY2l0eSA9IDEuMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bUV4dHJhU2FtcGxlcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IG51bUV4dHJhU2FtcGxlczsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHRyYVNhbXBsZXNWYWx1ZXNba10gPT09IDEgfHwgZXh0cmFTYW1wbGVzVmFsdWVzW2tdID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGFtcCBvcGFjaXR5IHRvIHRoZSByYW5nZSBbMCwxXS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBwaXhlbFNhbXBsZXNbMyArIGtdIC8gMjU2O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChwaG90b21ldHJpY0ludGVycHJldGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmlsZXZlbCBvciBHcmF5c2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaGl0ZUlzWmVyb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNhbXBsZVByb3BlcnRpZXNbMF0uaGFzQnl0ZXNQZXJTYW1wbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZlcnRWYWx1ZSA9IE1hdGgucG93KDB4MTAsIHNhbXBsZVByb3BlcnRpZXNbMF0uYnl0ZXNQZXJTYW1wbGUgKiAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEludmVydCBzYW1wbGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbFNhbXBsZXMuZm9yRWFjaChmdW5jdGlvbiAoc2FtcGxlLCBpbmRleCwgc2FtcGxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtcGxlc1tpbmRleF0gPSBpbnZlcnRWYWx1ZSAtIHNhbXBsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCaWxldmVsIG9yIEdyYXlzY2FsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrSXNaZXJvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWQgPSBncmVlbiA9IGJsdWUgPSB0aGlzLmNsYW1wQ29sb3JTYW1wbGUocGl4ZWxTYW1wbGVzWzBdLCBzYW1wbGVQcm9wZXJ0aWVzWzBdLmJpdHNQZXJTYW1wbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJHQiBGdWxsIENvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWQgPSB0aGlzLmNsYW1wQ29sb3JTYW1wbGUocGl4ZWxTYW1wbGVzWzBdLCBzYW1wbGVQcm9wZXJ0aWVzWzBdLmJpdHNQZXJTYW1wbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmVlbiA9IHRoaXMuY2xhbXBDb2xvclNhbXBsZShwaXhlbFNhbXBsZXNbMV0sIHNhbXBsZVByb3BlcnRpZXNbMV0uYml0c1BlclNhbXBsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWUgPSB0aGlzLmNsYW1wQ29sb3JTYW1wbGUocGl4ZWxTYW1wbGVzWzJdLCBzYW1wbGVQcm9wZXJ0aWVzWzJdLmJpdHNQZXJTYW1wbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJHQiBDb2xvciBQYWxldHRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JNYXBWYWx1ZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAyNykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yTWFwSW5kZXggPSBwaXhlbFNhbXBsZXNbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkID0gdGhpcy5jbGFtcENvbG9yU2FtcGxlKGNvbG9yTWFwVmFsdWVzW2NvbG9yTWFwSW5kZXhdLCAxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuID0gdGhpcy5jbGFtcENvbG9yU2FtcGxlKGNvbG9yTWFwVmFsdWVzW2NvbG9yTWFwU2FtcGxlU2l6ZSArIGNvbG9yTWFwSW5kZXhdLCAxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWUgPSB0aGlzLmNsYW1wQ29sb3JTYW1wbGUoY29sb3JNYXBWYWx1ZXNbKDIgKiBjb2xvck1hcFNhbXBsZVNpemUpICsgY29sb3JNYXBJbmRleF0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVbmtub3duIFBob3RvbWV0cmljIEludGVycHJldGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDI4LCBwaG90b21ldHJpY0ludGVycHJldGF0aW9uKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKFwiICsgcmVkICsgXCIsIFwiICsgZ3JlZW4gKyBcIiwgXCIgKyBibHVlICsgXCIsIFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHlQYWRkaW5nICsgeSwgMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBudW1Sb3dzSW5QcmV2aW91c1N0cmlwID0gbnVtUm93c0luU3RyaXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXM7XG4gICAgfSxcblxuICAgIC8vIFNlZTogaHR0cDovL3d3dy5kaWdpdGl6YXRpb25ndWlkZWxpbmVzLmdvdi9ndWlkZWxpbmVzL1RJRkZfTWV0YWRhdGFfRmluYWwucGRmXG4gICAgLy8gU2VlOiBodHRwOi8vd3d3LmRpZ2l0YWxwcmVzZXJ2YXRpb24uZ292L2Zvcm1hdHMvY29udGVudC90aWZmX3RhZ3Muc2h0bWxcbiAgICBmaWVsZFRhZ05hbWVzOiB7XG4gICAgICAgIC8vIFRJRkYgQmFzZWxpbmVcbiAgICAgICAgMHgwMTNCOiAnQXJ0aXN0JyxcbiAgICAgICAgMHgwMTAyOiAnQml0c1BlclNhbXBsZScsXG4gICAgICAgIDB4MDEwOTogJ0NlbGxMZW5ndGgnLFxuICAgICAgICAweDAxMDg6ICdDZWxsV2lkdGgnLFxuICAgICAgICAweDAxNDA6ICdDb2xvck1hcCcsXG4gICAgICAgIDB4MDEwMzogJ0NvbXByZXNzaW9uJyxcbiAgICAgICAgMHg4Mjk4OiAnQ29weXJpZ2h0JyxcbiAgICAgICAgMHgwMTMyOiAnRGF0ZVRpbWUnLFxuICAgICAgICAweDAxNTI6ICdFeHRyYVNhbXBsZXMnLFxuICAgICAgICAweDAxMEE6ICdGaWxsT3JkZXInLFxuICAgICAgICAweDAxMjE6ICdGcmVlQnl0ZUNvdW50cycsXG4gICAgICAgIDB4MDEyMDogJ0ZyZWVPZmZzZXRzJyxcbiAgICAgICAgMHgwMTIzOiAnR3JheVJlc3BvbnNlQ3VydmUnLFxuICAgICAgICAweDAxMjI6ICdHcmF5UmVzcG9uc2VVbml0JyxcbiAgICAgICAgMHgwMTNDOiAnSG9zdENvbXB1dGVyJyxcbiAgICAgICAgMHgwMTBFOiAnSW1hZ2VEZXNjcmlwdGlvbicsXG4gICAgICAgIDB4MDEwMTogJ0ltYWdlTGVuZ3RoJyxcbiAgICAgICAgMHgwMTAwOiAnSW1hZ2VXaWR0aCcsXG4gICAgICAgIDB4MDEwRjogJ01ha2UnLFxuICAgICAgICAweDAxMTk6ICdNYXhTYW1wbGVWYWx1ZScsXG4gICAgICAgIDB4MDExODogJ01pblNhbXBsZVZhbHVlJyxcbiAgICAgICAgMHgwMTEwOiAnTW9kZWwnLFxuICAgICAgICAweDAwRkU6ICdOZXdTdWJmaWxlVHlwZScsXG4gICAgICAgIDB4MDExMjogJ09yaWVudGF0aW9uJyxcbiAgICAgICAgMHgwMTA2OiAnUGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbicsXG4gICAgICAgIDB4MDExQzogJ1BsYW5hckNvbmZpZ3VyYXRpb24nLFxuICAgICAgICAweDAxMjg6ICdSZXNvbHV0aW9uVW5pdCcsXG4gICAgICAgIDB4MDExNjogJ1Jvd3NQZXJTdHJpcCcsXG4gICAgICAgIDB4MDExNTogJ1NhbXBsZXNQZXJQaXhlbCcsXG4gICAgICAgIDB4MDEzMTogJ1NvZnR3YXJlJyxcbiAgICAgICAgMHgwMTE3OiAnU3RyaXBCeXRlQ291bnRzJyxcbiAgICAgICAgMHgwMTExOiAnU3RyaXBPZmZzZXRzJyxcbiAgICAgICAgMHgwMEZGOiAnU3ViZmlsZVR5cGUnLFxuICAgICAgICAweDAxMDc6ICdUaHJlc2hob2xkaW5nJyxcbiAgICAgICAgMHgwMTFBOiAnWFJlc29sdXRpb24nLFxuICAgICAgICAweDAxMUI6ICdZUmVzb2x1dGlvbicsXG5cbiAgICAgICAgLy8gVElGRiBFeHRlbmRlZFxuICAgICAgICAweDAxNDY6ICdCYWRGYXhMaW5lcycsXG4gICAgICAgIDB4MDE0NzogJ0NsZWFuRmF4RGF0YScsXG4gICAgICAgIDB4MDE1NzogJ0NsaXBQYXRoJyxcbiAgICAgICAgMHgwMTQ4OiAnQ29uc2VjdXRpdmVCYWRGYXhMaW5lcycsXG4gICAgICAgIDB4MDFCMTogJ0RlY29kZScsXG4gICAgICAgIDB4MDFCMjogJ0RlZmF1bHRJbWFnZUNvbG9yJyxcbiAgICAgICAgMHgwMTBEOiAnRG9jdW1lbnROYW1lJyxcbiAgICAgICAgMHgwMTUwOiAnRG90UmFuZ2UnLFxuICAgICAgICAweDAxNDE6ICdIYWxmdG9uZUhpbnRzJyxcbiAgICAgICAgMHgwMTVBOiAnSW5kZXhlZCcsXG4gICAgICAgIDB4MDE1QjogJ0pQRUdUYWJsZXMnLFxuICAgICAgICAweDAxMUQ6ICdQYWdlTmFtZScsXG4gICAgICAgIDB4MDEyOTogJ1BhZ2VOdW1iZXInLFxuICAgICAgICAweDAxM0Q6ICdQcmVkaWN0b3InLFxuICAgICAgICAweDAxM0Y6ICdQcmltYXJ5Q2hyb21hdGljaXRpZXMnLFxuICAgICAgICAweDAyMTQ6ICdSZWZlcmVuY2VCbGFja1doaXRlJyxcbiAgICAgICAgMHgwMTUzOiAnU2FtcGxlRm9ybWF0JyxcbiAgICAgICAgMHgwMjJGOiAnU3RyaXBSb3dDb3VudHMnLFxuICAgICAgICAweDAxNEE6ICdTdWJJRkRzJyxcbiAgICAgICAgMHgwMTI0OiAnVDRPcHRpb25zJyxcbiAgICAgICAgMHgwMTI1OiAnVDZPcHRpb25zJyxcbiAgICAgICAgMHgwMTQ1OiAnVGlsZUJ5dGVDb3VudHMnLFxuICAgICAgICAweDAxNDM6ICdUaWxlTGVuZ3RoJyxcbiAgICAgICAgMHgwMTQ0OiAnVGlsZU9mZnNldHMnLFxuICAgICAgICAweDAxNDI6ICdUaWxlV2lkdGgnLFxuICAgICAgICAweDAxMkQ6ICdUcmFuc2ZlckZ1bmN0aW9uJyxcbiAgICAgICAgMHgwMTNFOiAnV2hpdGVQb2ludCcsXG4gICAgICAgIDB4MDE1ODogJ1hDbGlwUGF0aFVuaXRzJyxcbiAgICAgICAgMHgwMTFFOiAnWFBvc2l0aW9uJyxcbiAgICAgICAgMHgwMjExOiAnWUNiQ3JDb2VmZmljaWVudHMnLFxuICAgICAgICAweDAyMTM6ICdZQ2JDclBvc2l0aW9uaW5nJyxcbiAgICAgICAgMHgwMjEyOiAnWUNiQ3JTdWJTYW1wbGluZycsXG4gICAgICAgIDB4MDE1OTogJ1lDbGlwUGF0aFVuaXRzJyxcbiAgICAgICAgMHgwMTFGOiAnWVBvc2l0aW9uJyxcblxuICAgICAgICAvLyBFWElGXG4gICAgICAgIDB4OTIwMjogJ0FwZXJ0dXJlVmFsdWUnLFxuICAgICAgICAweEEwMDE6ICdDb2xvclNwYWNlJyxcbiAgICAgICAgMHg5MDA0OiAnRGF0ZVRpbWVEaWdpdGl6ZWQnLFxuICAgICAgICAweDkwMDM6ICdEYXRlVGltZU9yaWdpbmFsJyxcbiAgICAgICAgMHg4NzY5OiAnRXhpZiBJRkQnLFxuICAgICAgICAweDkwMDA6ICdFeGlmVmVyc2lvbicsXG4gICAgICAgIDB4ODI5QTogJ0V4cG9zdXJlVGltZScsXG4gICAgICAgIDB4QTMwMDogJ0ZpbGVTb3VyY2UnLFxuICAgICAgICAweDkyMDk6ICdGbGFzaCcsXG4gICAgICAgIDB4QTAwMDogJ0ZsYXNocGl4VmVyc2lvbicsXG4gICAgICAgIDB4ODI5RDogJ0ZOdW1iZXInLFxuICAgICAgICAweEE0MjA6ICdJbWFnZVVuaXF1ZUlEJyxcbiAgICAgICAgMHg5MjA4OiAnTGlnaHRTb3VyY2UnLFxuICAgICAgICAweDkyN0M6ICdNYWtlck5vdGUnLFxuICAgICAgICAweDkyMDE6ICdTaHV0dGVyU3BlZWRWYWx1ZScsXG4gICAgICAgIDB4OTI4NjogJ1VzZXJDb21tZW50JyxcblxuICAgICAgICAvLyBJUFRDXG4gICAgICAgIDB4ODNCQjogJ0lQVEMnLFxuXG4gICAgICAgIC8vIElDQ1xuICAgICAgICAweDg3NzM6ICdJQ0MgUHJvZmlsZScsXG5cbiAgICAgICAgLy8gWE1QXG4gICAgICAgIDB4MDJCQzogJ1hNUCcsXG5cbiAgICAgICAgLy8gR0RBTFxuICAgICAgICAweEE0ODA6ICdHREFMX01FVEFEQVRBJyxcbiAgICAgICAgMHhBNDgxOiAnR0RBTF9OT0RBVEEnLFxuXG4gICAgICAgIC8vIFBob3Rvc2hvcFxuICAgICAgICAweDg2NDk6ICdQaG90b3Nob3AnXG4gICAgfSxcblxuICAgIGZpZWxkVHlwZU5hbWVzOiB7XG4gICAgICAgIDB4MDAwMTogJ0JZVEUnLFxuICAgICAgICAweDAwMDI6ICdBU0NJSScsXG4gICAgICAgIDB4MDAwMzogJ1NIT1JUJyxcbiAgICAgICAgMHgwMDA0OiAnTE9ORycsXG4gICAgICAgIDB4MDAwNTogJ1JBVElPTkFMJyxcbiAgICAgICAgMHgwMDA2OiAnU0JZVEUnLFxuICAgICAgICAweDAwMDc6ICdVTkRFRklORUQnLFxuICAgICAgICAweDAwMDg6ICdTU0hPUlQnLFxuICAgICAgICAweDAwMDk6ICdTTE9ORycsXG4gICAgICAgIDB4MDAwQTogJ1NSQVRJT05BTCcsXG4gICAgICAgIDB4MDAwQjogJ0ZMT0FUJyxcbiAgICAgICAgMHgwMDBDOiAnRE9VQkxFJ1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGlmZlJlYWRlcjsiXX0=