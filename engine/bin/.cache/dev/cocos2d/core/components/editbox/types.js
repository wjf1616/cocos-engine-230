
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/types.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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

/**
 * !#en Enum for keyboard return types
 * !#zh 键盘的返回键类型
 * @readonly
 * @enum EditBox.KeyboardReturnType
 */
var KeyboardReturnType = cc.Enum({
  /**
   * !#en TODO
   * !#zh 默认
   * @property {Number} DEFAULT
   */
  DEFAULT: 0,

  /**
   * !#en TODO
   * !#zh 完成类型
   * @property {Number} DONE
   */
  DONE: 1,

  /**
   * !#en TODO
   * !#zh 发送类型
   * @property {Number} SEND
   */
  SEND: 2,

  /**
   * !#en TODO
   * !#zh 搜索类型
   * @property {Number} SEARCH
   */
  SEARCH: 3,

  /**
   * !#en TODO
   * !#zh 跳转类型
   * @property {Number} GO
   */
  GO: 4,

  /**
   * !#en TODO
   * !#zh 下一个类型
   * @property {Number} NEXT
   */
  NEXT: 5
});
/**
 * !#en The EditBox's InputMode defines the type of text that the user is allowed to enter.
 * !#zh 输入模式
 * @readonly
 * @enum EditBox.InputMode
 */

var InputMode = cc.Enum({
  /**
   * !#en TODO
   * !#zh 用户可以输入任何文本，包括换行符。
   * @property {Number} ANY
   */
  ANY: 0,

  /**
   * !#en The user is allowed to enter an e-mail address.
   * !#zh 允许用户输入一个电子邮件地址。
   * @property {Number} EMAIL_ADDR
   */
  EMAIL_ADDR: 1,

  /**
   * !#en The user is allowed to enter an integer value.
   * !#zh 允许用户输入一个整数值。
   * @property {Number} NUMERIC
   */
  NUMERIC: 2,

  /**
   * !#en The user is allowed to enter a phone number.
   * !#zh 允许用户输入一个电话号码。
   * @property {Number} PHONE_NUMBER
   */
  PHONE_NUMBER: 3,

  /**
   * !#en The user is allowed to enter a URL.
   * !#zh 允许用户输入一个 URL。
   * @property {Number} URL
   */
  URL: 4,

  /**
   * !#en
   * The user is allowed to enter a real number value.
   * This extends kEditBoxInputModeNumeric by allowing a decimal point.
   * !#zh
   * 允许用户输入一个实数。
   * @property {Number} DECIMAL
   */
  DECIMAL: 5,

  /**
   * !#en The user is allowed to enter any text, except for line breaks.
   * !#zh 除了换行符以外，用户可以输入任何文本。
   * @property {Number} SINGLE_LINE
   */
  SINGLE_LINE: 6
});
/**
 * !#en Enum for the EditBox's input flags
 * !#zh 定义了一些用于设置文本显示和文本格式化的标志位。
 * @readonly
 * @enum EditBox.InputFlag
 */

var InputFlag = cc.Enum({
  /**
   * !#en
   * Indicates that the text entered is confidential data that should be
   * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
   * !#zh
   * 表明输入的文本是保密的数据，任何时候都应该隐藏起来，它隐含了 EDIT_BOX_INPUT_FLAG_SENSITIVE。
   * @property {Number} PASSWORD
   */
  PASSWORD: 0,

  /**
   * !#en
   * Indicates that the text entered is sensitive data that the
   * implementation must never store into a dictionary or table for use
   * in predictive, auto-completing, or other accelerated input schemes.
   * A credit card number is an example of sensitive data.
   * !#zh
   * 表明输入的文本是敏感数据，它禁止存储到字典或表里面，也不能用来自动补全和提示用户输入。
   * 一个信用卡号码就是一个敏感数据的例子。
   * @property {Number} SENSITIVE
   */
  SENSITIVE: 1,

  /**
   * !#en
   * This flag is a hint to the implementation that during text editing,
   * the initial letter of each word should be capitalized.
   * !#zh
   *  这个标志用来指定在文本编辑的时候，是否把每一个单词的首字母大写。
   * @property {Number} INITIAL_CAPS_WORD
   */
  INITIAL_CAPS_WORD: 2,

  /**
   * !#en
   * This flag is a hint to the implementation that during text editing,
   * the initial letter of each sentence should be capitalized.
   * !#zh
   * 这个标志用来指定在文本编辑是否每个句子的首字母大写。
   * @property {Number} INITIAL_CAPS_SENTENCE
   */
  INITIAL_CAPS_SENTENCE: 3,

  /**
   * !#en Capitalize all characters automatically.
   * !#zh 自动把输入的所有字符大写。
   * @property {Number} INITIAL_CAPS_ALL_CHARACTERS
   */
  INITIAL_CAPS_ALL_CHARACTERS: 4,

  /**
   * Don't do anything with the input text.
   * @property {Number} DEFAULT
   */
  DEFAULT: 5
});
module.exports = {
  KeyboardReturnType: KeyboardReturnType,
  InputMode: InputMode,
  InputFlag: InputFlag
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR5cGVzLmpzIl0sIm5hbWVzIjpbIktleWJvYXJkUmV0dXJuVHlwZSIsImNjIiwiRW51bSIsIkRFRkFVTFQiLCJET05FIiwiU0VORCIsIlNFQVJDSCIsIkdPIiwiTkVYVCIsIklucHV0TW9kZSIsIkFOWSIsIkVNQUlMX0FERFIiLCJOVU1FUklDIiwiUEhPTkVfTlVNQkVSIiwiVVJMIiwiREVDSU1BTCIsIlNJTkdMRV9MSU5FIiwiSW5wdXRGbGFnIiwiUEFTU1dPUkQiLCJTRU5TSVRJVkUiLCJJTklUSUFMX0NBUFNfV09SRCIsIklOSVRJQUxfQ0FQU19TRU5URU5DRSIsIklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQTs7Ozs7O0FBTUEsSUFBSUEsa0JBQWtCLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQzdCOzs7OztBQUtBQyxFQUFBQSxPQUFPLEVBQUUsQ0FOb0I7O0FBTzdCOzs7OztBQUtBQyxFQUFBQSxJQUFJLEVBQUUsQ0FadUI7O0FBYTdCOzs7OztBQUtBQyxFQUFBQSxJQUFJLEVBQUUsQ0FsQnVCOztBQW1CN0I7Ozs7O0FBS0FDLEVBQUFBLE1BQU0sRUFBRSxDQXhCcUI7O0FBeUI3Qjs7Ozs7QUFLQUMsRUFBQUEsRUFBRSxFQUFFLENBOUJ5Qjs7QUErQjdCOzs7OztBQUtBQyxFQUFBQSxJQUFJLEVBQUU7QUFwQ3VCLENBQVIsQ0FBekI7QUF1Q0E7Ozs7Ozs7QUFNQSxJQUFJQyxTQUFTLEdBQUdSLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCOzs7OztBQUtBUSxFQUFBQSxHQUFHLEVBQUUsQ0FOZTs7QUFPcEI7Ozs7O0FBS0FDLEVBQUFBLFVBQVUsRUFBRSxDQVpROztBQWFwQjs7Ozs7QUFLQUMsRUFBQUEsT0FBTyxFQUFFLENBbEJXOztBQW1CcEI7Ozs7O0FBS0FDLEVBQUFBLFlBQVksRUFBRSxDQXhCTTs7QUF5QnBCOzs7OztBQUtBQyxFQUFBQSxHQUFHLEVBQUUsQ0E5QmU7O0FBK0JwQjs7Ozs7Ozs7QUFRQUMsRUFBQUEsT0FBTyxFQUFFLENBdkNXOztBQXdDcEI7Ozs7O0FBS0FDLEVBQUFBLFdBQVcsRUFBRTtBQTdDTyxDQUFSLENBQWhCO0FBZ0RBOzs7Ozs7O0FBTUEsSUFBSUMsU0FBUyxHQUFHaEIsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDcEI7Ozs7Ozs7O0FBUUFnQixFQUFBQSxRQUFRLEVBQUUsQ0FUVTs7QUFVcEI7Ozs7Ozs7Ozs7O0FBV0FDLEVBQUFBLFNBQVMsRUFBRSxDQXJCUzs7QUFzQnBCOzs7Ozs7OztBQVFBQyxFQUFBQSxpQkFBaUIsRUFBRSxDQTlCQzs7QUErQnBCOzs7Ozs7OztBQVFBQyxFQUFBQSxxQkFBcUIsRUFBRSxDQXZDSDs7QUF3Q3BCOzs7OztBQUtBQyxFQUFBQSwyQkFBMkIsRUFBRSxDQTdDVDs7QUE4Q3BCOzs7O0FBSUFuQixFQUFBQSxPQUFPLEVBQUU7QUFsRFcsQ0FBUixDQUFoQjtBQXFEQW9CLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNieEIsRUFBQUEsa0JBQWtCLEVBQUVBLGtCQURQO0FBRWJTLEVBQUFBLFNBQVMsRUFBRUEsU0FGRTtBQUdiUSxFQUFBQSxTQUFTLEVBQUVBO0FBSEUsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gKiAhI2VuIEVudW0gZm9yIGtleWJvYXJkIHJldHVybiB0eXBlc1xuICogISN6aCDplK7nm5jnmoTov5Tlm57plK7nsbvlnotcbiAqIEByZWFkb25seVxuICogQGVudW0gRWRpdEJveC5LZXlib2FyZFJldHVyblR5cGVcbiAqL1xubGV0IEtleWJvYXJkUmV0dXJuVHlwZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg6buY6K6kXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERFRkFVTFRcbiAgICAgKi9cbiAgICBERUZBVUxUOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5a6M5oiQ57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERPTkVcbiAgICAgKi9cbiAgICBET05FOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5Y+R6YCB57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNFTkRcbiAgICAgKi9cbiAgICBTRU5EOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5pCc57Si57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNFQVJDSFxuICAgICAqL1xuICAgIFNFQVJDSDogMyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOi3s+i9rOexu+Wei1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBHT1xuICAgICAqL1xuICAgIEdPOiA0LFxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5LiL5LiA5Liq57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5FWFRcbiAgICAgKi9cbiAgICBORVhUOiA1XG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBFZGl0Qm94J3MgSW5wdXRNb2RlIGRlZmluZXMgdGhlIHR5cGUgb2YgdGV4dCB0aGF0IHRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gZW50ZXIuXG4gKiAhI3poIOi+k+WFpeaooeW8j1xuICogQHJlYWRvbmx5XG4gKiBAZW51bSBFZGl0Qm94LklucHV0TW9kZVxuICovXG5sZXQgSW5wdXRNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDnlKjmiLflj6/ku6XovpPlhaXku7vkvZXmlofmnKzvvIzljIXmi6zmjaLooYznrKbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQU5ZXG4gICAgICovXG4gICAgQU5ZOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVzZXIgaXMgYWxsb3dlZCB0byBlbnRlciBhbiBlLW1haWwgYWRkcmVzcy5cbiAgICAgKiAhI3poIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4queUteWtkOmCruS7tuWcsOWdgOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFTUFJTF9BRERSXG4gICAgICovXG4gICAgRU1BSUxfQUREUjogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gZW50ZXIgYW4gaW50ZWdlciB2YWx1ZS5cbiAgICAgKiAhI3poIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4quaVtOaVsOWAvOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOVU1FUklDXG4gICAgICovXG4gICAgTlVNRVJJQzogMixcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gZW50ZXIgYSBwaG9uZSBudW1iZXIuXG4gICAgICogISN6aCDlhYHorrjnlKjmiLfovpPlhaXkuIDkuKrnlLXor53lj7fnoIHjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhPTkVfTlVNQkVSXG4gICAgICovXG4gICAgUEhPTkVfTlVNQkVSOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVzZXIgaXMgYWxsb3dlZCB0byBlbnRlciBhIFVSTC5cbiAgICAgKiAhI3poIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4qiBVUkzjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVVJMXG4gICAgICovXG4gICAgVVJMOiA0LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgdXNlciBpcyBhbGxvd2VkIHRvIGVudGVyIGEgcmVhbCBudW1iZXIgdmFsdWUuXG4gICAgICogVGhpcyBleHRlbmRzIGtFZGl0Qm94SW5wdXRNb2RlTnVtZXJpYyBieSBhbGxvd2luZyBhIGRlY2ltYWwgcG9pbnQuXG4gICAgICogISN6aFxuICAgICAqIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4quWunuaVsOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBERUNJTUFMXG4gICAgICovXG4gICAgREVDSU1BTDogNSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gZW50ZXIgYW55IHRleHQsIGV4Y2VwdCBmb3IgbGluZSBicmVha3MuXG4gICAgICogISN6aCDpmaTkuobmjaLooYznrKbku6XlpJbvvIznlKjmiLflj6/ku6XovpPlhaXku7vkvZXmlofmnKzjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0lOR0xFX0xJTkVcbiAgICAgKi9cbiAgICBTSU5HTEVfTElORTogNlxufSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciB0aGUgRWRpdEJveCdzIGlucHV0IGZsYWdzXG4gKiAhI3poIOWumuS5ieS6huS4gOS6m+eUqOS6juiuvue9ruaWh+acrOaYvuekuuWSjOaWh+acrOagvOW8j+WMlueahOagh+W/l+S9jeOAglxuICogQHJlYWRvbmx5XG4gKiBAZW51bSBFZGl0Qm94LklucHV0RmxhZ1xuICovXG5sZXQgSW5wdXRGbGFnID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEluZGljYXRlcyB0aGF0IHRoZSB0ZXh0IGVudGVyZWQgaXMgY29uZmlkZW50aWFsIGRhdGEgdGhhdCBzaG91bGQgYmVcbiAgICAgKiBvYnNjdXJlZCB3aGVuZXZlciBwb3NzaWJsZS4gVGhpcyBpbXBsaWVzIEVESVRfQk9YX0lOUFVUX0ZMQUdfU0VOU0lUSVZFLlxuICAgICAqICEjemhcbiAgICAgKiDooajmmI7ovpPlhaXnmoTmlofmnKzmmK/kv53lr4bnmoTmlbDmja7vvIzku7vkvZXml7blgJnpg73lupTor6XpmpDol4/otbfmnaXvvIzlroPpmpDlkKvkuoYgRURJVF9CT1hfSU5QVVRfRkxBR19TRU5TSVRJVkXjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEFTU1dPUkRcbiAgICAgKi9cbiAgICBQQVNTV09SRDogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW5kaWNhdGVzIHRoYXQgdGhlIHRleHQgZW50ZXJlZCBpcyBzZW5zaXRpdmUgZGF0YSB0aGF0IHRoZVxuICAgICAqIGltcGxlbWVudGF0aW9uIG11c3QgbmV2ZXIgc3RvcmUgaW50byBhIGRpY3Rpb25hcnkgb3IgdGFibGUgZm9yIHVzZVxuICAgICAqIGluIHByZWRpY3RpdmUsIGF1dG8tY29tcGxldGluZywgb3Igb3RoZXIgYWNjZWxlcmF0ZWQgaW5wdXQgc2NoZW1lcy5cbiAgICAgKiBBIGNyZWRpdCBjYXJkIG51bWJlciBpcyBhbiBleGFtcGxlIG9mIHNlbnNpdGl2ZSBkYXRhLlxuICAgICAqICEjemhcbiAgICAgKiDooajmmI7ovpPlhaXnmoTmlofmnKzmmK/mlY/mhJ/mlbDmja7vvIzlroPnpoHmraLlrZjlgqjliLDlrZflhbjmiJbooajph4zpnaLvvIzkuZ/kuI3og73nlKjmnaXoh6rliqjooaXlhajlkozmj5DnpLrnlKjmiLfovpPlhaXjgIJcbiAgICAgKiDkuIDkuKrkv6HnlKjljaHlj7fnoIHlsLHmmK/kuIDkuKrmlY/mhJ/mlbDmja7nmoTkvovlrZDjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0VOU0lUSVZFXG4gICAgICovXG4gICAgU0VOU0lUSVZFOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGlzIGZsYWcgaXMgYSBoaW50IHRvIHRoZSBpbXBsZW1lbnRhdGlvbiB0aGF0IGR1cmluZyB0ZXh0IGVkaXRpbmcsXG4gICAgICogdGhlIGluaXRpYWwgbGV0dGVyIG9mIGVhY2ggd29yZCBzaG91bGQgYmUgY2FwaXRhbGl6ZWQuXG4gICAgICogISN6aFxuICAgICAqICDov5nkuKrmoIflv5fnlKjmnaXmjIflrprlnKjmlofmnKznvJbovpHnmoTml7blgJnvvIzmmK/lkKbmiormr4/kuIDkuKrljZXor43nmoTpppblrZfmr43lpKflhpnjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSU5JVElBTF9DQVBTX1dPUkRcbiAgICAgKi9cbiAgICBJTklUSUFMX0NBUFNfV09SRDogMixcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhpcyBmbGFnIGlzIGEgaGludCB0byB0aGUgaW1wbGVtZW50YXRpb24gdGhhdCBkdXJpbmcgdGV4dCBlZGl0aW5nLFxuICAgICAqIHRoZSBpbml0aWFsIGxldHRlciBvZiBlYWNoIHNlbnRlbmNlIHNob3VsZCBiZSBjYXBpdGFsaXplZC5cbiAgICAgKiAhI3poXG4gICAgICog6L+Z5Liq5qCH5b+X55So5p2l5oyH5a6a5Zyo5paH5pys57yW6L6R5piv5ZCm5q+P5Liq5Y+l5a2Q55qE6aaW5a2X5q+N5aSn5YaZ44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IElOSVRJQUxfQ0FQU19TRU5URU5DRVxuICAgICAqL1xuICAgIElOSVRJQUxfQ0FQU19TRU5URU5DRTogMyxcbiAgICAvKipcbiAgICAgKiAhI2VuIENhcGl0YWxpemUgYWxsIGNoYXJhY3RlcnMgYXV0b21hdGljYWxseS5cbiAgICAgKiAhI3poIOiHquWKqOaKiui+k+WFpeeahOaJgOacieWtl+espuWkp+WGmeOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlNcbiAgICAgKi9cbiAgICBJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlM6IDQsXG4gICAgLyoqXG4gICAgICogRG9uJ3QgZG8gYW55dGhpbmcgd2l0aCB0aGUgaW5wdXQgdGV4dC5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gREVGQVVMVFxuICAgICAqL1xuICAgIERFRkFVTFQ6IDVcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBLZXlib2FyZFJldHVyblR5cGU6IEtleWJvYXJkUmV0dXJuVHlwZSxcbiAgICBJbnB1dE1vZGU6IElucHV0TW9kZSxcbiAgICBJbnB1dEZsYWc6IElucHV0RmxhZ1xufTtcbiJdfQ==