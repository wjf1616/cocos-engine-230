
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCSAXParser.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var js = require('../platform/js');
/**
 * A SAX Parser
 * @class saxParser
 */


cc.SAXParser = function () {
  if (!(CC_EDITOR && Editor.isMainProcess) && window.DOMParser) {
    this._isSupportDOMParser = true;
    this._parser = new DOMParser();
  } else {
    this._isSupportDOMParser = false;
    this._parser = null;
  }
};

cc.SAXParser.prototype = {
  constructor: cc.SAXParser,

  /**
   * @method parse
   * @param {String} xmlTxt
   * @return {Document}
   */
  parse: function parse(xmlTxt) {
    return this._parseXML(xmlTxt);
  },
  _parseXML: function _parseXML(textxml) {
    // get a reference to the requested corresponding xml file
    var xmlDoc;

    if (this._isSupportDOMParser) {
      xmlDoc = this._parser.parseFromString(textxml, "text/xml");
    } else {
      // Internet Explorer (untested!)
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(textxml);
    }

    return xmlDoc;
  }
};
/**
 *
 * cc.plistParser is a singleton object for parsing plist files
 * @class plistParser
 * @extends SAXParser
 */

cc.PlistParser = function () {
  cc.SAXParser.call(this);
};

js.extend(cc.PlistParser, cc.SAXParser);
js.mixin(cc.PlistParser.prototype, {
  /**
   * parse a xml string as plist object.
   * @param {String} xmlTxt - plist xml contents
   * @return {*} plist object
   */
  parse: function parse(xmlTxt) {
    var xmlDoc = this._parseXML(xmlTxt);

    var plist = xmlDoc.documentElement;

    if (plist.tagName !== 'plist') {
      cc.warnID(5100);
      return {};
    } // Get first real node


    var node = null;

    for (var i = 0, len = plist.childNodes.length; i < len; i++) {
      node = plist.childNodes[i];
      if (node.nodeType === 1) break;
    }

    xmlDoc = null;
    return this._parseNode(node);
  },
  _parseNode: function _parseNode(node) {
    var data = null,
        tagName = node.tagName;

    if (tagName === "dict") {
      data = this._parseDict(node);
    } else if (tagName === "array") {
      data = this._parseArray(node);
    } else if (tagName === "string") {
      if (node.childNodes.length === 1) data = node.firstChild.nodeValue;else {
        //handle Firefox's 4KB nodeValue limit
        data = "";

        for (var i = 0; i < node.childNodes.length; i++) {
          data += node.childNodes[i].nodeValue;
        }
      }
    } else if (tagName === "false") {
      data = false;
    } else if (tagName === "true") {
      data = true;
    } else if (tagName === "real") {
      data = parseFloat(node.firstChild.nodeValue);
    } else if (tagName === "integer") {
      data = parseInt(node.firstChild.nodeValue, 10);
    }

    return data;
  },
  _parseArray: function _parseArray(node) {
    var data = [];

    for (var i = 0, len = node.childNodes.length; i < len; i++) {
      var child = node.childNodes[i];
      if (child.nodeType !== 1) continue;
      data.push(this._parseNode(child));
    }

    return data;
  },
  _parseDict: function _parseDict(node) {
    var data = {};
    var key = null;

    for (var i = 0, len = node.childNodes.length; i < len; i++) {
      var child = node.childNodes[i];
      if (child.nodeType !== 1) continue; // Grab the key, next noe should be the value

      if (child.tagName === 'key') key = child.firstChild.nodeValue;else data[key] = this._parseNode(child); // Parse the value node
    }

    return data;
  }
});
cc.saxParser = new cc.SAXParser();
/**
 * @type {PlistParser}
 * @name plistParser
 * A Plist Parser
 */

cc.plistParser = new cc.PlistParser();
module.exports = {
  saxParser: cc.saxParser,
  plistParser: cc.plistParser
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU0FYUGFyc2VyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsImNjIiwiU0FYUGFyc2VyIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNNYWluUHJvY2VzcyIsIndpbmRvdyIsIkRPTVBhcnNlciIsIl9pc1N1cHBvcnRET01QYXJzZXIiLCJfcGFyc2VyIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJwYXJzZSIsInhtbFR4dCIsIl9wYXJzZVhNTCIsInRleHR4bWwiLCJ4bWxEb2MiLCJwYXJzZUZyb21TdHJpbmciLCJBY3RpdmVYT2JqZWN0IiwiYXN5bmMiLCJsb2FkWE1MIiwiUGxpc3RQYXJzZXIiLCJjYWxsIiwiZXh0ZW5kIiwibWl4aW4iLCJwbGlzdCIsImRvY3VtZW50RWxlbWVudCIsInRhZ05hbWUiLCJ3YXJuSUQiLCJub2RlIiwiaSIsImxlbiIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJub2RlVHlwZSIsIl9wYXJzZU5vZGUiLCJkYXRhIiwiX3BhcnNlRGljdCIsIl9wYXJzZUFycmF5IiwiZmlyc3RDaGlsZCIsIm5vZGVWYWx1ZSIsInBhcnNlRmxvYXQiLCJwYXJzZUludCIsImNoaWxkIiwicHVzaCIsImtleSIsInNheFBhcnNlciIsInBsaXN0UGFyc2VyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxnQkFBRCxDQUFoQjtBQUVBOzs7Ozs7QUFJQUMsRUFBRSxDQUFDQyxTQUFILEdBQWUsWUFBWTtBQUN2QixNQUFJLEVBQUVDLFNBQVMsSUFBSUMsTUFBTSxDQUFDQyxhQUF0QixLQUF3Q0MsTUFBTSxDQUFDQyxTQUFuRCxFQUE4RDtBQUMxRCxTQUFLQyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJRixTQUFKLEVBQWY7QUFDSCxHQUhELE1BR087QUFDSCxT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QVMsRUFBRTdDLEVBQUUsQ0FBQzZDLFNBREQ7QUFFYkMsRUFBQUEsV0FBVyxFQUFFOUMsRUFBRSxDQUFDOEM7QUFGSCxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcblxuLyoqXG4gKiBBIFNBWCBQYXJzZXJcbiAqIEBjbGFzcyBzYXhQYXJzZXJcbiAqL1xuY2MuU0FYUGFyc2VyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghKENDX0VESVRPUiAmJiBFZGl0b3IuaXNNYWluUHJvY2VzcykgJiYgd2luZG93LkRPTVBhcnNlcikge1xuICAgICAgICB0aGlzLl9pc1N1cHBvcnRET01QYXJzZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLl9wYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faXNTdXBwb3J0RE9NUGFyc2VyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BhcnNlciA9IG51bGw7XG4gICAgfVxufTtcbmNjLlNBWFBhcnNlci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLlNBWFBhcnNlcixcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHBhcnNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHhtbFR4dFxuICAgICAqIEByZXR1cm4ge0RvY3VtZW50fVxuICAgICAqL1xuICAgIHBhcnNlIDogZnVuY3Rpb24oeG1sVHh0KXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlWE1MKHhtbFR4dCk7XG4gICAgfSxcblxuICAgIF9wYXJzZVhNTDogZnVuY3Rpb24gKHRleHR4bWwpIHtcbiAgICAgICAgLy8gZ2V0IGEgcmVmZXJlbmNlIHRvIHRoZSByZXF1ZXN0ZWQgY29ycmVzcG9uZGluZyB4bWwgZmlsZVxuICAgICAgICB2YXIgeG1sRG9jO1xuICAgICAgICBpZiAodGhpcy5faXNTdXBwb3J0RE9NUGFyc2VyKSB7XG4gICAgICAgICAgICB4bWxEb2MgPSB0aGlzLl9wYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHR4bWwsIFwidGV4dC94bWxcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciAodW50ZXN0ZWQhKVxuICAgICAgICAgICAgeG1sRG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MRE9NXCIpO1xuICAgICAgICAgICAgeG1sRG9jLmFzeW5jID0gXCJmYWxzZVwiO1xuICAgICAgICAgICAgeG1sRG9jLmxvYWRYTUwodGV4dHhtbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHhtbERvYztcbiAgICB9XG59O1xuXG4vKipcbiAqXG4gKiBjYy5wbGlzdFBhcnNlciBpcyBhIHNpbmdsZXRvbiBvYmplY3QgZm9yIHBhcnNpbmcgcGxpc3QgZmlsZXNcbiAqIEBjbGFzcyBwbGlzdFBhcnNlclxuICogQGV4dGVuZHMgU0FYUGFyc2VyXG4gKi9cbmNjLlBsaXN0UGFyc2VyID0gZnVuY3Rpb24gKCkge1xuICAgIGNjLlNBWFBhcnNlci5jYWxsKHRoaXMpO1xufTtcbmpzLmV4dGVuZChjYy5QbGlzdFBhcnNlciwgY2MuU0FYUGFyc2VyKTtcbmpzLm1peGluKGNjLlBsaXN0UGFyc2VyLnByb3RvdHlwZSwge1xuICAgIC8qKlxuICAgICAqIHBhcnNlIGEgeG1sIHN0cmluZyBhcyBwbGlzdCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHhtbFR4dCAtIHBsaXN0IHhtbCBjb250ZW50c1xuICAgICAqIEByZXR1cm4geyp9IHBsaXN0IG9iamVjdFxuICAgICAqL1xuICAgIHBhcnNlIDogZnVuY3Rpb24gKHhtbFR4dCkge1xuICAgICAgICB2YXIgeG1sRG9jID0gdGhpcy5fcGFyc2VYTUwoeG1sVHh0KTtcbiAgICAgICAgdmFyIHBsaXN0ID0geG1sRG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgaWYgKHBsaXN0LnRhZ05hbWUgIT09ICdwbGlzdCcpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg1MTAwKTtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCBmaXJzdCByZWFsIG5vZGVcbiAgICAgICAgdmFyIG5vZGUgPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IHBsaXN0LmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB4bWxEb2MgPSBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VOb2RlKG5vZGUpO1xuICAgIH0sXG5cbiAgICBfcGFyc2VOb2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgZGF0YSA9IG51bGwsIHRhZ05hbWUgPSBub2RlLnRhZ05hbWU7XG4gICAgICAgIGlmKHRhZ05hbWUgPT09IFwiZGljdFwiKXtcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9wYXJzZURpY3Qobm9kZSk7XG4gICAgICAgIH1lbHNlIGlmKHRhZ05hbWUgPT09IFwiYXJyYXlcIil7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5fcGFyc2VBcnJheShub2RlKTtcbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgICBpZiAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgICAgICBkYXRhID0gbm9kZS5maXJzdENoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vaGFuZGxlIEZpcmVmb3gncyA0S0Igbm9kZVZhbHVlIGxpbWl0XG4gICAgICAgICAgICAgICAgZGF0YSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgKz0gbm9kZS5jaGlsZE5vZGVzW2ldLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJmYWxzZVwiKXtcbiAgICAgICAgICAgIGRhdGEgPSBmYWxzZTtcbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJ0cnVlXCIpe1xuICAgICAgICAgICAgZGF0YSA9IHRydWU7XG4gICAgICAgIH1lbHNlIGlmKHRhZ05hbWUgPT09IFwicmVhbFwiKXtcbiAgICAgICAgICAgIGRhdGEgPSBwYXJzZUZsb2F0KG5vZGUuZmlyc3RDaGlsZC5ub2RlVmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZih0YWdOYW1lID09PSBcImludGVnZXJcIil7XG4gICAgICAgICAgICBkYXRhID0gcGFyc2VJbnQobm9kZS5maXJzdENoaWxkLm5vZGVWYWx1ZSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG5cbiAgICBfcGFyc2VBcnJheTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9PSAxKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgZGF0YS5wdXNoKHRoaXMuX3BhcnNlTm9kZShjaGlsZCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG5cbiAgICBfcGFyc2VEaWN0OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICB2YXIga2V5ID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9PSAxKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBrZXksIG5leHQgbm9lIHNob3VsZCBiZSB0aGUgdmFsdWVcbiAgICAgICAgICAgIGlmIChjaGlsZC50YWdOYW1lID09PSAna2V5JylcbiAgICAgICAgICAgICAgICBrZXkgPSBjaGlsZC5maXJzdENoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSB0aGlzLl9wYXJzZU5vZGUoY2hpbGQpOyAgICAgICAgICAgICAgICAgLy8gUGFyc2UgdGhlIHZhbHVlIG5vZGVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG59KTtcblxuY2Muc2F4UGFyc2VyID0gbmV3IGNjLlNBWFBhcnNlcigpO1xuLyoqXG4gKiBAdHlwZSB7UGxpc3RQYXJzZXJ9XG4gKiBAbmFtZSBwbGlzdFBhcnNlclxuICogQSBQbGlzdCBQYXJzZXJcbiAqL1xuY2MucGxpc3RQYXJzZXIgPSBuZXcgY2MuUGxpc3RQYXJzZXIoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgc2F4UGFyc2VyOiBjYy5zYXhQYXJzZXIsXG4gICAgcGxpc3RQYXJzZXI6IGNjLnBsaXN0UGFyc2VyXG59XG4iXX0=