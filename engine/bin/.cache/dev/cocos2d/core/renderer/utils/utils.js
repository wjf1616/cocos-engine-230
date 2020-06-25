
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/utils.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var dynamicAtlasManager = require('./dynamic-atlas/manager');

var WHITE = cc.Color.WHITE; // share data of bmfont

var shareLabelInfo = {
  fontAtlas: null,
  fontSize: 0,
  lineHeight: 0,
  hAlign: 0,
  vAlign: 0,
  hash: "",
  fontFamily: "",
  fontDesc: "Arial",
  color: WHITE,
  isOutlined: false,
  out: WHITE,
  margin: 0
};
module.exports = {
  deleteFromDynamicAtlas: function deleteFromDynamicAtlas(comp, frame) {
    if (frame && !CC_TEST) {
      if (frame._original && dynamicAtlasManager) {
        dynamicAtlasManager.deleteAtlasSpriteFrame(frame);

        frame._resetDynamicAtlasFrame();
      }
    }
  },
  getFontFamily: function getFontFamily(comp) {
    if (!comp.useSystemFont) {
      if (comp.font) {
        if (comp.font._nativeAsset) return comp.font._nativeAsset;
        cc.loader.load(comp.font.nativeUrl, function (err, asset) {
          comp.font._nativeAsset = asset;
          comp.setVertsDirty();
        });
        return 'Arial';
      }

      return 'Arial';
    } else {
      return comp.fontFamily || 'Arial';
    }
  },
  shareLabelInfo: shareLabelInfo
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbImR5bmFtaWNBdGxhc01hbmFnZXIiLCJyZXF1aXJlIiwiV0hJVEUiLCJjYyIsIkNvbG9yIiwic2hhcmVMYWJlbEluZm8iLCJmb250QXRsYXMiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJoQWxpZ24iLCJ2QWxpZ24iLCJoYXNoIiwiZm9udEZhbWlseSIsImZvbnREZXNjIiwiY29sb3IiLCJpc091dGxpbmVkIiwib3V0IiwibWFyZ2luIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlbGV0ZUZyb21EeW5hbWljQXRsYXMiLCJjb21wIiwiZnJhbWUiLCJDQ19URVNUIiwiX29yaWdpbmFsIiwiZGVsZXRlQXRsYXNTcHJpdGVGcmFtZSIsIl9yZXNldER5bmFtaWNBdGxhc0ZyYW1lIiwiZ2V0Rm9udEZhbWlseSIsInVzZVN5c3RlbUZvbnQiLCJmb250IiwiX25hdGl2ZUFzc2V0IiwibG9hZGVyIiwibG9hZCIsIm5hdGl2ZVVybCIsImVyciIsImFzc2V0Iiwic2V0VmVydHNEaXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBbkM7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBU0YsS0FBdkIsRUFFQTs7QUFDQSxJQUFJRyxjQUFjLEdBQUc7QUFDakJDLEVBQUFBLFNBQVMsRUFBRSxJQURNO0FBR2pCQyxFQUFBQSxRQUFRLEVBQUMsQ0FIUTtBQUlqQkMsRUFBQUEsVUFBVSxFQUFDLENBSk07QUFLakJDLEVBQUFBLE1BQU0sRUFBQyxDQUxVO0FBTWpCQyxFQUFBQSxNQUFNLEVBQUMsQ0FOVTtBQVFqQkMsRUFBQUEsSUFBSSxFQUFDLEVBUlk7QUFTakJDLEVBQUFBLFVBQVUsRUFBQyxFQVRNO0FBVWpCQyxFQUFBQSxRQUFRLEVBQUMsT0FWUTtBQVdqQkMsRUFBQUEsS0FBSyxFQUFDWixLQVhXO0FBWWpCYSxFQUFBQSxVQUFVLEVBQUMsS0FaTTtBQWFqQkMsRUFBQUEsR0FBRyxFQUFDZCxLQWJhO0FBY2pCZSxFQUFBQSxNQUFNLEVBQUM7QUFkVSxDQUFyQjtBQWlCQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBRWJDLEVBQUFBLHNCQUZhLGtDQUVXQyxJQUZYLEVBRWlCQyxLQUZqQixFQUV3QjtBQUNqQyxRQUFJQSxLQUFLLElBQUksQ0FBQ0MsT0FBZCxFQUF1QjtBQUNuQixVQUFJRCxLQUFLLENBQUNFLFNBQU4sSUFBbUJ4QixtQkFBdkIsRUFBNEM7QUFDeENBLFFBQUFBLG1CQUFtQixDQUFDeUIsc0JBQXBCLENBQTJDSCxLQUEzQzs7QUFDQUEsUUFBQUEsS0FBSyxDQUFDSSx1QkFBTjtBQUNIO0FBQ0o7QUFDSixHQVRZO0FBV2JDLEVBQUFBLGFBWGEseUJBV0VOLElBWEYsRUFXUTtBQUNqQixRQUFJLENBQUNBLElBQUksQ0FBQ08sYUFBVixFQUF5QjtBQUNyQixVQUFJUCxJQUFJLENBQUNRLElBQVQsRUFBZTtBQUNYLFlBQUlSLElBQUksQ0FBQ1EsSUFBTCxDQUFVQyxZQUFkLEVBQTRCLE9BQU9ULElBQUksQ0FBQ1EsSUFBTCxDQUFVQyxZQUFqQjtBQUM1QjNCLFFBQUFBLEVBQUUsQ0FBQzRCLE1BQUgsQ0FBVUMsSUFBVixDQUFlWCxJQUFJLENBQUNRLElBQUwsQ0FBVUksU0FBekIsRUFBb0MsVUFBQ0MsR0FBRCxFQUFNQyxLQUFOLEVBQWdCO0FBQ2hEZCxVQUFBQSxJQUFJLENBQUNRLElBQUwsQ0FBVUMsWUFBVixHQUF5QkssS0FBekI7QUFDQWQsVUFBQUEsSUFBSSxDQUFDZSxhQUFMO0FBQ0gsU0FIRDtBQUlBLGVBQU8sT0FBUDtBQUNIOztBQUVELGFBQU8sT0FBUDtBQUNILEtBWEQsTUFZSztBQUNELGFBQU9mLElBQUksQ0FBQ1QsVUFBTCxJQUFtQixPQUExQjtBQUNIO0FBQ0osR0EzQlk7QUE2QmJQLEVBQUFBLGNBQWMsRUFBRUE7QUE3QkgsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkeW5hbWljQXRsYXNNYW5hZ2VyID0gcmVxdWlyZSgnLi9keW5hbWljLWF0bGFzL21hbmFnZXInKTtcbmNvbnN0IFdISVRFID0gY2MuQ29sb3IuV0hJVEU7XG5cbi8vIHNoYXJlIGRhdGEgb2YgYm1mb250XG5sZXQgc2hhcmVMYWJlbEluZm8gPSB7XG4gICAgZm9udEF0bGFzOiBudWxsLFxuICAgIFxuICAgIGZvbnRTaXplOjAsXG4gICAgbGluZUhlaWdodDowLFxuICAgIGhBbGlnbjowLFxuICAgIHZBbGlnbjowLFxuXG4gICAgaGFzaDpcIlwiLFxuICAgIGZvbnRGYW1pbHk6XCJcIixcbiAgICBmb250RGVzYzpcIkFyaWFsXCIsXG4gICAgY29sb3I6V0hJVEUsXG4gICAgaXNPdXRsaW5lZDpmYWxzZSxcbiAgICBvdXQ6V0hJVEUsXG4gICAgbWFyZ2luOjAsXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgZGVsZXRlRnJvbUR5bmFtaWNBdGxhcyAoY29tcCwgZnJhbWUpIHtcbiAgICAgICAgaWYgKGZyYW1lICYmICFDQ19URVNUKSB7XG4gICAgICAgICAgICBpZiAoZnJhbWUuX29yaWdpbmFsICYmIGR5bmFtaWNBdGxhc01hbmFnZXIpIHtcbiAgICAgICAgICAgICAgICBkeW5hbWljQXRsYXNNYW5hZ2VyLmRlbGV0ZUF0bGFzU3ByaXRlRnJhbWUoZnJhbWUpO1xuICAgICAgICAgICAgICAgIGZyYW1lLl9yZXNldER5bmFtaWNBdGxhc0ZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0Rm9udEZhbWlseSAoY29tcCkge1xuICAgICAgICBpZiAoIWNvbXAudXNlU3lzdGVtRm9udCkge1xuICAgICAgICAgICAgaWYgKGNvbXAuZm9udCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wLmZvbnQuX25hdGl2ZUFzc2V0KSByZXR1cm4gY29tcC5mb250Ll9uYXRpdmVBc3NldDtcbiAgICAgICAgICAgICAgICBjYy5sb2FkZXIubG9hZChjb21wLmZvbnQubmF0aXZlVXJsLCAoZXJyLCBhc3NldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wLmZvbnQuX25hdGl2ZUFzc2V0ID0gYXNzZXQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbXAuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAnQXJpYWwnO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgcmV0dXJuICdBcmlhbCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcC5mb250RmFtaWx5IHx8ICdBcmlhbCc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hhcmVMYWJlbEluZm86IHNoYXJlTGFiZWxJbmZvXG59XG4iXX0=