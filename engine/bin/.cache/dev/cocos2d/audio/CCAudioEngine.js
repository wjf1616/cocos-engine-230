
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/audio/CCAudioEngine.js';
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
var Audio = require('./CCAudio');

var AudioClip = require('../core/assets/CCAudioClip');

var js = cc.js;
var _instanceId = 0;

var _id2audio = js.createMap(true);

var _url2id = {};
var _audioPool = [];

var recycleAudio = function recycleAudio(audio) {
  audio._finishCallback = null;
  audio.off('ended');
  audio.off('stop');
  audio.src = null; // In case repeatly recycle audio

  if (!_audioPool.includes(audio)) {
    if (_audioPool.length < 32) {
      _audioPool.push(audio);
    } else {
      audio.destroy();
    }
  }
};

var getAudioFromPath = function getAudioFromPath(path) {
  var id = _instanceId++;
  var list = _url2id[path];

  if (!list) {
    list = _url2id[path] = [];
  }

  if (audioEngine._maxAudioInstance <= list.length) {
    var oldId = list.shift();
    var oldAudio = getAudioFromId(oldId); // Stop will recycle audio automatically by event callback

    oldAudio.stop();
  }

  var audio = _audioPool.pop() || new Audio();

  var callback = function callback() {
    var audioInList = getAudioFromId(this.id);

    if (audioInList) {
      delete _id2audio[this.id];
      var index = list.indexOf(this.id);
      cc.js.array.fastRemoveAt(list, index);
    }

    recycleAudio(this);
  };

  audio.on('ended', function () {
    if (this._finishCallback) {
      this._finishCallback();
    }

    callback.call(this);
  }, audio);
  audio.on('stop', callback, audio);
  audio.id = id;
  _id2audio[id] = audio;
  list.push(id);
  return audio;
};

var getAudioFromId = function getAudioFromId(id) {
  return _id2audio[id];
};

var handleVolume = function handleVolume(volume) {
  if (volume === undefined) {
    // set default volume as 1
    volume = 1;
  } else if (typeof volume === 'string') {
    volume = Number.parseFloat(volume);
  }

  return volume;
};
/**
 * !#en cc.audioEngine is the singleton object, it provide simple audio APIs.
 * !#zh
 * cc.audioengine是单例对象。<br/>
 * 主要用来播放音频，播放的时候会返回一个 audioID，之后都可以通过这个 audioID 来操作这个音频对象。<br/>
 * 不使用的时候，请使用 cc.audioEngine.uncache(filePath); 进行资源释放 <br/>
 * 注意：<br/>
 * 在 Android 系统浏览器上，不同浏览器，不同版本的效果不尽相同。<br/>
 * 比如说：大多数浏览器都需要用户物理交互才可以开始播放音效，有一些不支持 WebAudio，<br/>
 * 有一些不支持多音轨播放。总之如果对音乐依赖比较强，请做尽可能多的测试。
 * @class audioEngine
 * @static
 */


var audioEngine = {
  AudioState: Audio.State,
  _maxWebAudioSize: 2097152,
  // 2048kb * 1024
  _maxAudioInstance: 24,
  _id2audio: _id2audio,

  /**
   * !#en Play audio.
   * !#zh 播放音频
   * @method play
   * @param {AudioClip} clip - The audio clip to play.
   * @param {Boolean} loop - Whether the music loop or not.
   * @param {Number} volume - Volume size.
   * @return {Number} audioId
   * @example
   * cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
   *     var audioID = cc.audioEngine.play(clip, false, 0.5);
   * });
   */
  play: function play(clip, loop, volume
  /*, profile*/
  ) {
    var path = clip;
    var audio;

    if (typeof clip === 'string') {
      // backward compatibility since 1.10
      cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
      path = clip; // load clip

      audio = getAudioFromPath(path);

      AudioClip._loadByUrl(path, function (err, clip) {
        if (clip) {
          audio.src = clip;
        }
      });
    } else {
      if (!clip) {
        return;
      }

      path = clip.nativeUrl;
      audio = getAudioFromPath(path);
      audio.src = clip;
    }

    audio.setLoop(loop || false);
    volume = handleVolume(volume);
    audio.setVolume(volume);
    audio.play();
    return audio.id;
  },

  /**
   * !#en Set audio loop.
   * !#zh 设置音频是否循环。
   * @method setLoop
   * @param {Number} audioID - audio id.
   * @param {Boolean} loop - Whether cycle.
   * @example
   * cc.audioEngine.setLoop(id, true);
   */
  setLoop: function setLoop(audioID, loop) {
    var audio = getAudioFromId(audioID);
    if (!audio || !audio.setLoop) return;
    audio.setLoop(loop);
  },

  /**
   * !#en Get audio cycle state.
   * !#zh 获取音频的循环状态。
   * @method isLoop
   * @param {Number} audioID - audio id.
   * @return {Boolean} Whether cycle.
   * @example
   * cc.audioEngine.isLoop(id);
   */
  isLoop: function isLoop(audioID) {
    var audio = getAudioFromId(audioID);
    if (!audio || !audio.getLoop) return false;
    return audio.getLoop();
  },

  /**
   * !#en Set the volume of audio.
   * !#zh 设置音量（0.0 ~ 1.0）。
   * @method setVolume
   * @param {Number} audioID - audio id.
   * @param {Number} volume - Volume must be in 0.0~1.0 .
   * @example
   * cc.audioEngine.setVolume(id, 0.5);
   */
  setVolume: function setVolume(audioID, volume) {
    var audio = getAudioFromId(audioID);

    if (audio) {
      audio.setVolume(volume);
    }
  },

  /**
   * !#en The volume of the music max value is 1.0,the min value is 0.0 .
   * !#zh 获取音量（0.0 ~ 1.0）。
   * @method getVolume
   * @param {Number} audioID - audio id.
   * @return {Number}
   * @example
   * var volume = cc.audioEngine.getVolume(id);
   */
  getVolume: function getVolume(audioID) {
    var audio = getAudioFromId(audioID);
    return audio ? audio.getVolume() : 1;
  },

  /**
   * !#en Set current time
   * !#zh 设置当前的音频时间。
   * @method setCurrentTime
   * @param {Number} audioID - audio id.
   * @param {Number} sec - current time.
   * @return {Boolean}
   * @example
   * cc.audioEngine.setCurrentTime(id, 2);
   */
  setCurrentTime: function setCurrentTime(audioID, sec) {
    var audio = getAudioFromId(audioID);

    if (audio) {
      audio.setCurrentTime(sec);
      return true;
    } else {
      return false;
    }
  },

  /**
   * !#en Get current time
   * !#zh 获取当前的音频播放时间。
   * @method getCurrentTime
   * @param {Number} audioID - audio id.
   * @return {Number} audio current time.
   * @example
   * var time = cc.audioEngine.getCurrentTime(id);
   */
  getCurrentTime: function getCurrentTime(audioID) {
    var audio = getAudioFromId(audioID);
    return audio ? audio.getCurrentTime() : 0;
  },

  /**
   * !#en Get audio duration
   * !#zh 获取音频总时长。
   * @method getDuration
   * @param {Number} audioID - audio id.
   * @return {Number} audio duration.
   * @example
   * var time = cc.audioEngine.getDuration(id);
   */
  getDuration: function getDuration(audioID) {
    var audio = getAudioFromId(audioID);
    return audio ? audio.getDuration() : 0;
  },

  /**
   * !#en Get audio state
   * !#zh 获取音频状态。
   * @method getState
   * @param {Number} audioID - audio id.
   * @return {audioEngine.AudioState} audio duration.
   * @example
   * var state = cc.audioEngine.getState(id);
   */
  getState: function getState(audioID) {
    var audio = getAudioFromId(audioID);
    return audio ? audio.getState() : this.AudioState.ERROR;
  },

  /**
   * !#en Set Audio finish callback
   * !#zh 设置一个音频结束后的回调
   * @method setFinishCallback
   * @param {Number} audioID - audio id.
   * @param {Function} callback - loaded callback.
   * @example
   * cc.audioEngine.setFinishCallback(id, function () {});
   */
  setFinishCallback: function setFinishCallback(audioID, callback) {
    var audio = getAudioFromId(audioID);
    if (!audio) return;
    audio._finishCallback = callback;
  },

  /**
   * !#en Pause playing audio.
   * !#zh 暂停正在播放音频。
   * @method pause
   * @param {Number} audioID - The return value of function play.
   * @example
   * cc.audioEngine.pause(audioID);
   */
  pause: function pause(audioID) {
    var audio = getAudioFromId(audioID);

    if (audio) {
      audio.pause();
      return true;
    } else {
      return false;
    }
  },
  _pauseIDCache: [],

  /**
   * !#en Pause all playing audio
   * !#zh 暂停现在正在播放的所有音频。
   * @method pauseAll
   * @example
   * cc.audioEngine.pauseAll();
   */
  pauseAll: function pauseAll() {
    for (var id in _id2audio) {
      var audio = _id2audio[id];
      var state = audio.getState();

      if (state === Audio.State.PLAYING) {
        this._pauseIDCache.push(id);

        audio.pause();
      }
    }
  },

  /**
   * !#en Resume playing audio.
   * !#zh 恢复播放指定的音频。
   * @method resume
   * @param {Number} audioID - The return value of function play.
   * @example
   * cc.audioEngine.resume(audioID);
   */
  resume: function resume(audioID) {
    var audio = getAudioFromId(audioID);

    if (audio) {
      audio.resume();
    }
  },

  /**
   * !#en Resume all playing audio.
   * !#zh 恢复播放所有之前暂停的所有音频。
   * @method resumeAll
   * @example
   * cc.audioEngine.resumeAll();
   */
  resumeAll: function resumeAll() {
    for (var i = 0; i < this._pauseIDCache.length; ++i) {
      var id = this._pauseIDCache[i];
      var audio = getAudioFromId(id);
      if (audio) audio.resume();
    }

    this._pauseIDCache.length = 0;
  },

  /**
   * !#en Stop playing audio.
   * !#zh 停止播放指定音频。
   * @method stop
   * @param {Number} audioID - The return value of function play.
   * @example
   * cc.audioEngine.stop(audioID);
   */
  stop: function stop(audioID) {
    var audio = getAudioFromId(audioID);

    if (audio) {
      // Stop will recycle audio automatically by event callback
      audio.stop();
      return true;
    } else {
      return false;
    }
  },

  /**
   * !#en Stop all playing audio.
   * !#zh 停止正在播放的所有音频。
   * @method stopAll
   * @example
   * cc.audioEngine.stopAll();
   */
  stopAll: function stopAll() {
    for (var id in _id2audio) {
      var audio = _id2audio[id];

      if (audio) {
        // Stop will recycle audio automatically by event callback
        audio.stop();
      }
    }
  },

  /**
   * !#en Set up an audio can generate a few examples.
   * !#zh 设置一个音频可以设置几个实例
   * @method setMaxAudioInstance
   * @param {Number} num - a number of instances to be created from within an audio
   * @example
   * cc.audioEngine.setMaxAudioInstance(20);
   */
  setMaxAudioInstance: function setMaxAudioInstance(num) {
    this._maxAudioInstance = num;
  },

  /**
   * !#en Getting audio can produce several examples.
   * !#zh 获取一个音频可以设置几个实例
   * @method getMaxAudioInstance
   * @return {Number} a - number of instances to be created from within an audio
   * @example
   * cc.audioEngine.getMaxAudioInstance();
   */
  getMaxAudioInstance: function getMaxAudioInstance() {
    return this._maxAudioInstance;
  },

  /**
   * !#en Unload the preloaded audio from internal buffer.
   * !#zh 卸载预加载的音频。
   * @method uncache
   * @param {AudioClip} clip
   * @example
   * cc.audioEngine.uncache(filePath);
   */
  uncache: function uncache(clip) {
    var filePath = clip;

    if (typeof clip === 'string') {
      // backward compatibility since 1.10
      cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
      filePath = clip;
    } else {
      if (!clip) {
        return;
      }

      filePath = clip.nativeUrl;
    }

    var list = _url2id[filePath];
    if (!list) return;

    while (list.length > 0) {
      var id = list.pop();
      var audio = _id2audio[id];

      if (audio) {
        // Stop will recycle audio automatically by event callback
        audio.stop();
        delete _id2audio[id];
      }
    }
  },

  /**
   * !#en Unload all audio from internal buffer.
   * !#zh 卸载所有音频。
   * @method uncacheAll
   * @example
   * cc.audioEngine.uncacheAll();
   */
  uncacheAll: function uncacheAll() {
    this.stopAll();
    var audio;

    for (var id in _id2audio) {
      audio = _id2audio[id];

      if (audio) {
        audio.destroy();
      }
    }

    while (audio = _audioPool.pop()) {
      audio.destroy();
    }

    _id2audio = js.createMap(true);
    _url2id = {};
  },

  /**
   * !#en Gets an audio profile by name.
   *
   * @param profileName A name of audio profile.
   * @return The audio profile.
   */
  getProfile: function getProfile(profileName) {},

  /**
   * !#en Preload audio file.
   * !#zh 预加载一个音频
   * @method preload
   * @param {String} filePath - The file path of an audio.
   * @param {Function} [callback] - The callback of an audio.
   * @example
   * cc.audioEngine.preload(path);
   * @deprecated `cc.audioEngine.preload` is deprecated, use `cc.loader.loadRes(url, cc.AudioClip)` instead please.
   */
  preload: function preload(filePath, callback) {
    if (CC_DEBUG) {
      cc.warn('`cc.audioEngine.preload` is deprecated, use `cc.loader.loadRes(url, cc.AudioClip)` instead please.');
    }

    cc.loader.load(filePath, callback && function (error) {
      if (!error) {
        callback();
      }
    });
  },

  /**
   * !#en Set a size, the unit is KB. Over this size is directly resolved into DOM nodes.
   * !#zh 设置一个以 KB 为单位的尺寸，大于这个尺寸的音频在加载的时候会强制使用 dom 方式加载
   * @method setMaxWebAudioSize
   * @param {Number} kb - The file path of an audio.
   * @example
   * cc.audioEngine.setMaxWebAudioSize(300);
   */
  // Because webAudio takes up too much memory，So allow users to manually choose
  setMaxWebAudioSize: function setMaxWebAudioSize(kb) {
    this._maxWebAudioSize = kb * 1024;
  },
  _breakCache: null,
  _break: function _break() {
    this._breakCache = [];

    for (var id in _id2audio) {
      var audio = _id2audio[id];
      var state = audio.getState();

      if (state === Audio.State.PLAYING) {
        this._breakCache.push(id);

        audio.pause();
      }
    }
  },
  _restore: function _restore() {
    if (!this._breakCache) return;

    while (this._breakCache.length > 0) {
      var id = this._breakCache.pop();

      var audio = getAudioFromId(id);
      if (audio && audio.resume) audio.resume();
    }

    this._breakCache = null;
  },
  ///////////////////////////////
  // Classification of interface
  _music: {
    id: -1,
    loop: false,
    volume: 1
  },
  _effect: {
    volume: 1,
    pauseCache: []
  },

  /**
   * !#en Play background music
   * !#zh 播放背景音乐
   * @method playMusic
   * @param {AudioClip} clip - The audio clip to play.
   * @param {Boolean} loop - Whether the music loop or not.
   * @return {Number} audioId
   * @example
   * cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
   *     var audioID = cc.audioEngine.playMusic(clip, false);
   * });
   */
  playMusic: function playMusic(clip, loop) {
    var music = this._music;
    this.stop(music.id);
    music.id = this.play(clip, loop, music.volume);
    music.loop = loop;
    return music.id;
  },

  /**
   * !#en Stop background music.
   * !#zh 停止播放背景音乐。
   * @method stopMusic
   * @example
   * cc.audioEngine.stopMusic();
   */
  stopMusic: function stopMusic() {
    this.stop(this._music.id);
  },

  /**
   * !#en Pause the background music.
   * !#zh 暂停播放背景音乐。
   * @method pauseMusic
   * @example
   * cc.audioEngine.pauseMusic();
   */
  pauseMusic: function pauseMusic() {
    this.pause(this._music.id);
    return this._music.id;
  },

  /**
   * !#en Resume playing background music.
   * !#zh 恢复播放背景音乐。
   * @method resumeMusic
   * @example
   * cc.audioEngine.resumeMusic();
   */
  resumeMusic: function resumeMusic() {
    this.resume(this._music.id);
    return this._music.id;
  },

  /**
   * !#en Get the volume(0.0 ~ 1.0).
   * !#zh 获取音量（0.0 ~ 1.0）。
   * @method getMusicVolume
   * @return {Number}
   * @example
   * var volume = cc.audioEngine.getMusicVolume();
   */
  getMusicVolume: function getMusicVolume() {
    return this._music.volume;
  },

  /**
   * !#en Set the background music volume.
   * !#zh 设置背景音乐音量（0.0 ~ 1.0）。
   * @method setMusicVolume
   * @param {Number} volume - Volume must be in 0.0~1.0.
   * @example
   * cc.audioEngine.setMusicVolume(0.5);
   */
  setMusicVolume: function setMusicVolume(volume) {
    volume = handleVolume(volume);
    var music = this._music;
    music.volume = volume;
    this.setVolume(music.id, music.volume);
    return music.volume;
  },

  /**
   * !#en Background music playing state
   * !#zh 背景音乐是否正在播放
   * @method isMusicPlaying
   * @return {Boolean}
   * @example
   * cc.audioEngine.isMusicPlaying();
   */
  isMusicPlaying: function isMusicPlaying() {
    return this.getState(this._music.id) === this.AudioState.PLAYING;
  },

  /**
   * !#en Play effect audio.
   * !#zh 播放音效
   * @method playEffect
   * @param {AudioClip} clip - The audio clip to play.
   * @param {Boolean} loop - Whether the music loop or not.
   * @return {Number} audioId
   * @example
   * cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
   *     var audioID = cc.audioEngine.playEffect(clip, false);
   * });
   */
  playEffect: function playEffect(clip, loop) {
    return this.play(clip, loop || false, this._effect.volume);
  },

  /**
   * !#en Set the volume of effect audio.
   * !#zh 设置音效音量（0.0 ~ 1.0）。
   * @method setEffectsVolume
   * @param {Number} volume - Volume must be in 0.0~1.0.
   * @example
   * cc.audioEngine.setEffectsVolume(0.5);
   */
  setEffectsVolume: function setEffectsVolume(volume) {
    volume = handleVolume(volume);
    var musicId = this._music.id;
    this._effect.volume = volume;

    for (var id in _id2audio) {
      var audio = _id2audio[id];
      if (!audio || audio.id === musicId) continue;
      audioEngine.setVolume(id, volume);
    }
  },

  /**
   * !#en The volume of the effect audio max value is 1.0,the min value is 0.0 .
   * !#zh 获取音效音量（0.0 ~ 1.0）。
   * @method getEffectsVolume
   * @return {Number}
   * @example
   * var volume = cc.audioEngine.getEffectsVolume();
   */
  getEffectsVolume: function getEffectsVolume() {
    return this._effect.volume;
  },

  /**
   * !#en Pause effect audio.
   * !#zh 暂停播放音效。
   * @method pauseEffect
   * @param {Number} audioID - audio id.
   * @example
   * cc.audioEngine.pauseEffect(audioID);
   */
  pauseEffect: function pauseEffect(audioID) {
    return this.pause(audioID);
  },

  /**
   * !#en Stop playing all the sound effects.
   * !#zh 暂停播放所有音效。
   * @method pauseAllEffects
   * @example
   * cc.audioEngine.pauseAllEffects();
   */
  pauseAllEffects: function pauseAllEffects() {
    var musicId = this._music.id;
    var effect = this._effect;
    effect.pauseCache.length = 0;

    for (var id in _id2audio) {
      var audio = _id2audio[id];
      if (!audio || audio.id === musicId) continue;
      var state = audio.getState();

      if (state === this.AudioState.PLAYING) {
        effect.pauseCache.push(id);
        audio.pause();
      }
    }
  },

  /**
   * !#en Resume effect audio.
   * !#zh 恢复播放音效音频。
   * @method resumeEffect
   * @param {Number} audioID - The return value of function play.
   * @example
   * cc.audioEngine.resumeEffect(audioID);
   */
  resumeEffect: function resumeEffect(id) {
    this.resume(id);
  },

  /**
   * !#en Resume all effect audio.
   * !#zh 恢复播放所有之前暂停的音效。
   * @method resumeAllEffects
   * @example
   * cc.audioEngine.resumeAllEffects();
   */
  resumeAllEffects: function resumeAllEffects() {
    var pauseIDCache = this._effect.pauseCache;

    for (var i = 0; i < pauseIDCache.length; ++i) {
      var id = pauseIDCache[i];
      var audio = _id2audio[id];
      if (audio) audio.resume();
    }
  },

  /**
   * !#en Stop playing the effect audio.
   * !#zh 停止播放音效。
   * @method stopEffect
   * @param {Number} audioID - audio id.
   * @example
   * cc.audioEngine.stopEffect(id);
   */
  stopEffect: function stopEffect(audioID) {
    return this.stop(audioID);
  },

  /**
   * !#en Stop playing all the effects.
   * !#zh 停止播放所有音效。
   * @method stopAllEffects
   * @example
   * cc.audioEngine.stopAllEffects();
   */
  stopAllEffects: function stopAllEffects() {
    var musicId = this._music.id;

    for (var id in _id2audio) {
      var audio = _id2audio[id];
      if (!audio || audio.id === musicId) continue;
      var state = audio.getState();

      if (state === audioEngine.AudioState.PLAYING) {
        audio.stop();
      }
    }
  }
};
module.exports = cc.audioEngine = audioEngine;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXVkaW9FbmdpbmUuanMiXSwibmFtZXMiOlsiQXVkaW8iLCJyZXF1aXJlIiwiQXVkaW9DbGlwIiwianMiLCJjYyIsIl9pbnN0YW5jZUlkIiwiX2lkMmF1ZGlvIiwiY3JlYXRlTWFwIiwiX3VybDJpZCIsIl9hdWRpb1Bvb2wiLCJyZWN5Y2xlQXVkaW8iLCJhdWRpbyIsIl9maW5pc2hDYWxsYmFjayIsIm9mZiIsInNyYyIsImluY2x1ZGVzIiwibGVuZ3RoIiwicHVzaCIsImRlc3Ryb3kiLCJnZXRBdWRpb0Zyb21QYXRoIiwicGF0aCIsImlkIiwibGlzdCIsImF1ZGlvRW5naW5lIiwiX21heEF1ZGlvSW5zdGFuY2UiLCJvbGRJZCIsInNoaWZ0Iiwib2xkQXVkaW8iLCJnZXRBdWRpb0Zyb21JZCIsInN0b3AiLCJwb3AiLCJjYWxsYmFjayIsImF1ZGlvSW5MaXN0IiwiaW5kZXgiLCJpbmRleE9mIiwiYXJyYXkiLCJmYXN0UmVtb3ZlQXQiLCJvbiIsImNhbGwiLCJoYW5kbGVWb2x1bWUiLCJ2b2x1bWUiLCJ1bmRlZmluZWQiLCJOdW1iZXIiLCJwYXJzZUZsb2F0IiwiQXVkaW9TdGF0ZSIsIlN0YXRlIiwiX21heFdlYkF1ZGlvU2l6ZSIsInBsYXkiLCJjbGlwIiwibG9vcCIsIndhcm5JRCIsIl9sb2FkQnlVcmwiLCJlcnIiLCJuYXRpdmVVcmwiLCJzZXRMb29wIiwic2V0Vm9sdW1lIiwiYXVkaW9JRCIsImlzTG9vcCIsImdldExvb3AiLCJnZXRWb2x1bWUiLCJzZXRDdXJyZW50VGltZSIsInNlYyIsImdldEN1cnJlbnRUaW1lIiwiZ2V0RHVyYXRpb24iLCJnZXRTdGF0ZSIsIkVSUk9SIiwic2V0RmluaXNoQ2FsbGJhY2siLCJwYXVzZSIsIl9wYXVzZUlEQ2FjaGUiLCJwYXVzZUFsbCIsInN0YXRlIiwiUExBWUlORyIsInJlc3VtZSIsInJlc3VtZUFsbCIsImkiLCJzdG9wQWxsIiwic2V0TWF4QXVkaW9JbnN0YW5jZSIsIm51bSIsImdldE1heEF1ZGlvSW5zdGFuY2UiLCJ1bmNhY2hlIiwiZmlsZVBhdGgiLCJ1bmNhY2hlQWxsIiwiZ2V0UHJvZmlsZSIsInByb2ZpbGVOYW1lIiwicHJlbG9hZCIsIkNDX0RFQlVHIiwid2FybiIsImxvYWRlciIsImxvYWQiLCJlcnJvciIsInNldE1heFdlYkF1ZGlvU2l6ZSIsImtiIiwiX2JyZWFrQ2FjaGUiLCJfYnJlYWsiLCJfcmVzdG9yZSIsIl9tdXNpYyIsIl9lZmZlY3QiLCJwYXVzZUNhY2hlIiwicGxheU11c2ljIiwibXVzaWMiLCJzdG9wTXVzaWMiLCJwYXVzZU11c2ljIiwicmVzdW1lTXVzaWMiLCJnZXRNdXNpY1ZvbHVtZSIsInNldE11c2ljVm9sdW1lIiwiaXNNdXNpY1BsYXlpbmciLCJwbGF5RWZmZWN0Iiwic2V0RWZmZWN0c1ZvbHVtZSIsIm11c2ljSWQiLCJnZXRFZmZlY3RzVm9sdW1lIiwicGF1c2VFZmZlY3QiLCJwYXVzZUFsbEVmZmVjdHMiLCJlZmZlY3QiLCJyZXN1bWVFZmZlY3QiLCJyZXN1bWVBbGxFZmZlY3RzIiwicGF1c2VJRENhY2hlIiwic3RvcEVmZmVjdCIsInN0b3BBbGxFZmZlY3RzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQXJCOztBQUNBLElBQU1DLFNBQVMsR0FBR0QsT0FBTyxDQUFDLDRCQUFELENBQXpCOztBQUNBLElBQU1FLEVBQUUsR0FBR0MsRUFBRSxDQUFDRCxFQUFkO0FBRUEsSUFBSUUsV0FBVyxHQUFHLENBQWxCOztBQUNBLElBQUlDLFNBQVMsR0FBR0gsRUFBRSxDQUFDSSxTQUFILENBQWEsSUFBYixDQUFoQjs7QUFDQSxJQUFJQyxPQUFPLEdBQUcsRUFBZDtBQUNBLElBQUlDLFVBQVUsR0FBRyxFQUFqQjs7QUFFQSxJQUFJQyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFVQyxLQUFWLEVBQWlCO0FBQ2hDQSxFQUFB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QyxVQUFoQzs7QUFDQSxTQUFLLElBQUl2QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHeUMsWUFBWSxDQUFDbkcsTUFBakMsRUFBeUMsRUFBRTBELENBQTNDLEVBQThDO0FBQzFDLFVBQUlyRCxFQUFFLEdBQUc4RixZQUFZLENBQUN6QyxDQUFELENBQXJCO0FBQ0EsVUFBSS9ELEtBQUssR0FBR0wsU0FBUyxDQUFDZSxFQUFELENBQXJCO0FBQ0EsVUFBSVYsS0FBSixFQUNJQSxLQUFLLENBQUM2RCxNQUFOO0FBQ1A7QUFDSixHQTlwQmE7O0FBZ3FCZDs7Ozs7Ozs7QUFRQTRDLEVBQUFBLFVBQVUsRUFBRSxvQkFBVTVELE9BQVYsRUFBbUI7QUFDM0IsV0FBTyxLQUFLM0IsSUFBTCxDQUFVMkIsT0FBVixDQUFQO0FBQ0gsR0ExcUJhOztBQTRxQmQ7Ozs7Ozs7QUFPQTZELEVBQUFBLGNBQWMsRUFBRSwwQkFBWTtBQUN4QixRQUFJVCxPQUFPLEdBQUcsS0FBS2IsTUFBTCxDQUFZMUUsRUFBMUI7O0FBQ0EsU0FBSyxJQUFJQSxFQUFULElBQWVmLFNBQWYsRUFBMEI7QUFDdEIsVUFBSUssS0FBSyxHQUFHTCxTQUFTLENBQUNlLEVBQUQsQ0FBckI7QUFDQSxVQUFJLENBQUNWLEtBQUQsSUFBVUEsS0FBSyxDQUFDVSxFQUFOLEtBQWF1RixPQUEzQixFQUFvQztBQUNwQyxVQUFJdEMsS0FBSyxHQUFHM0QsS0FBSyxDQUFDcUQsUUFBTixFQUFaOztBQUNBLFVBQUlNLEtBQUssS0FBSy9DLFdBQVcsQ0FBQ3FCLFVBQVosQ0FBdUIyQixPQUFyQyxFQUE4QztBQUMxQzVELFFBQUFBLEtBQUssQ0FBQ2tCLElBQU47QUFDSDtBQUNKO0FBQ0o7QUE3ckJhLENBQWxCO0FBZ3NCQXlGLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5ILEVBQUUsQ0FBQ21CLFdBQUgsR0FBaUJBLFdBQWxDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBBdWRpbyA9IHJlcXVpcmUoJy4vQ0NBdWRpbycpO1xuY29uc3QgQXVkaW9DbGlwID0gcmVxdWlyZSgnLi4vY29yZS9hc3NldHMvQ0NBdWRpb0NsaXAnKTtcbmNvbnN0IGpzID0gY2MuanM7XG5cbmxldCBfaW5zdGFuY2VJZCA9IDA7XG5sZXQgX2lkMmF1ZGlvID0ganMuY3JlYXRlTWFwKHRydWUpO1xubGV0IF91cmwyaWQgPSB7fTtcbmxldCBfYXVkaW9Qb29sID0gW107XG5cbmxldCByZWN5Y2xlQXVkaW8gPSBmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICBhdWRpby5fZmluaXNoQ2FsbGJhY2sgPSBudWxsO1xuICAgIGF1ZGlvLm9mZignZW5kZWQnKTtcbiAgICBhdWRpby5vZmYoJ3N0b3AnKTtcbiAgICBhdWRpby5zcmMgPSBudWxsO1xuICAgIC8vIEluIGNhc2UgcmVwZWF0bHkgcmVjeWNsZSBhdWRpb1xuICAgIGlmICghX2F1ZGlvUG9vbC5pbmNsdWRlcyhhdWRpbykpIHtcbiAgICAgICAgaWYgKF9hdWRpb1Bvb2wubGVuZ3RoIDwgMzIpIHtcbiAgICAgICAgICAgIF9hdWRpb1Bvb2wucHVzaChhdWRpbyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdWRpby5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5sZXQgZ2V0QXVkaW9Gcm9tUGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIGlkID0gX2luc3RhbmNlSWQrKztcbiAgICB2YXIgbGlzdCA9IF91cmwyaWRbcGF0aF07XG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICAgIGxpc3QgPSBfdXJsMmlkW3BhdGhdID0gW107XG4gICAgfVxuICAgIGlmIChhdWRpb0VuZ2luZS5fbWF4QXVkaW9JbnN0YW5jZSA8PSBsaXN0Lmxlbmd0aCkge1xuICAgICAgICB2YXIgb2xkSWQgPSBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIHZhciBvbGRBdWRpbyA9IGdldEF1ZGlvRnJvbUlkKG9sZElkKTtcbiAgICAgICAgLy8gU3RvcCB3aWxsIHJlY3ljbGUgYXVkaW8gYXV0b21hdGljYWxseSBieSBldmVudCBjYWxsYmFja1xuICAgICAgICBvbGRBdWRpby5zdG9wKCk7XG4gICAgfVxuXG4gICAgdmFyIGF1ZGlvID0gX2F1ZGlvUG9vbC5wb3AoKSB8fCBuZXcgQXVkaW8oKTtcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdWRpb0luTGlzdCA9IGdldEF1ZGlvRnJvbUlkKHRoaXMuaWQpO1xuICAgICAgICBpZiAoYXVkaW9Jbkxpc3QpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBfaWQyYXVkaW9bdGhpcy5pZF07XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBsaXN0LmluZGV4T2YodGhpcy5pZCk7XG4gICAgICAgICAgICBjYy5qcy5hcnJheS5mYXN0UmVtb3ZlQXQobGlzdCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHJlY3ljbGVBdWRpbyh0aGlzKTtcbiAgICB9O1xuXG4gICAgYXVkaW8ub24oJ2VuZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fZmluaXNoQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaENhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKTtcbiAgICB9LCBhdWRpbyk7XG5cbiAgICBhdWRpby5vbignc3RvcCcsIGNhbGxiYWNrLCBhdWRpbyk7XG4gICAgYXVkaW8uaWQgPSBpZDtcbiAgICBfaWQyYXVkaW9baWRdID0gYXVkaW87XG4gICAgbGlzdC5wdXNoKGlkKTtcblxuICAgIHJldHVybiBhdWRpbztcbn07XG5cbmxldCBnZXRBdWRpb0Zyb21JZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBfaWQyYXVkaW9baWRdO1xufTtcblxubGV0IGhhbmRsZVZvbHVtZSAgPSBmdW5jdGlvbiAodm9sdW1lKSB7XG4gICAgaWYgKHZvbHVtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIHNldCBkZWZhdWx0IHZvbHVtZSBhcyAxXG4gICAgICAgIHZvbHVtZSA9IDE7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB2b2x1bWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZvbHVtZSA9IE51bWJlci5wYXJzZUZsb2F0KHZvbHVtZSk7XG4gICAgfVxuICAgIHJldHVybiB2b2x1bWU7XG59O1xuXG4vKipcbiAqICEjZW4gY2MuYXVkaW9FbmdpbmUgaXMgdGhlIHNpbmdsZXRvbiBvYmplY3QsIGl0IHByb3ZpZGUgc2ltcGxlIGF1ZGlvIEFQSXMuXG4gKiAhI3poXG4gKiBjYy5hdWRpb2VuZ2luZeaYr+WNleS+i+WvueixoeOAgjxici8+XG4gKiDkuLvopoHnlKjmnaXmkq3mlL7pn7PpopHvvIzmkq3mlL7nmoTml7blgJnkvJrov5Tlm57kuIDkuKogYXVkaW9JRO+8jOS5i+WQjumDveWPr+S7pemAmui/h+i/meS4qiBhdWRpb0lEIOadpeaTjeS9nOi/meS4qumfs+mikeWvueixoeOAgjxici8+XG4gKiDkuI3kvb/nlKjnmoTml7blgJnvvIzor7fkvb/nlKggY2MuYXVkaW9FbmdpbmUudW5jYWNoZShmaWxlUGF0aCk7IOi/m+ihjOi1hOa6kOmHiuaUviA8YnIvPlxuICog5rOo5oSP77yaPGJyLz5cbiAqIOWcqCBBbmRyb2lkIOezu+e7n+a1j+iniOWZqOS4iu+8jOS4jeWQjOa1j+iniOWZqO+8jOS4jeWQjOeJiOacrOeahOaViOaenOS4jeWwveebuOWQjOOAgjxici8+XG4gKiDmr5TlpoLor7TvvJrlpKflpJrmlbDmtY/op4jlmajpg73pnIDopoHnlKjmiLfniannkIbkuqTkupLmiY3lj6/ku6XlvIDlp4vmkq3mlL7pn7PmlYjvvIzmnInkuIDkupvkuI3mlK/mjIEgV2ViQXVkaW/vvIw8YnIvPlxuICog5pyJ5LiA5Lqb5LiN5pSv5oyB5aSa6Z+z6L2o5pKt5pS+44CC5oC75LmL5aaC5p6c5a+56Z+z5LmQ5L6d6LWW5q+U6L6D5by677yM6K+35YGa5bC95Y+v6IO95aSa55qE5rWL6K+V44CCXG4gKiBAY2xhc3MgYXVkaW9FbmdpbmVcbiAqIEBzdGF0aWNcbiAqL1xudmFyIGF1ZGlvRW5naW5lID0ge1xuXG4gICAgQXVkaW9TdGF0ZTogQXVkaW8uU3RhdGUsXG5cbiAgICBfbWF4V2ViQXVkaW9TaXplOiAyMDk3MTUyLCAvLyAyMDQ4a2IgKiAxMDI0XG4gICAgX21heEF1ZGlvSW5zdGFuY2U6IDI0LFxuXG4gICAgX2lkMmF1ZGlvOiBfaWQyYXVkaW8sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBsYXkgYXVkaW8uXG4gICAgICogISN6aCDmkq3mlL7pn7PpopFcbiAgICAgKiBAbWV0aG9kIHBsYXlcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ2xpcH0gY2xpcCAtIFRoZSBhdWRpbyBjbGlwIHRvIHBsYXkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBsb29wIC0gV2hldGhlciB0aGUgbXVzaWMgbG9vcCBvciBub3QuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZvbHVtZSAtIFZvbHVtZSBzaXplLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gYXVkaW9JZFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MubG9hZGVyLmxvYWRSZXModXJsLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGNsaXApIHtcbiAgICAgKiAgICAgdmFyIGF1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5KGNsaXAsIGZhbHNlLCAwLjUpO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uIChjbGlwLCBsb29wLCB2b2x1bWUvKiwgcHJvZmlsZSovKSB7XG4gICAgICAgIHZhciBwYXRoID0gY2xpcDtcbiAgICAgICAgdmFyIGF1ZGlvO1xuICAgICAgICBpZiAodHlwZW9mIGNsaXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHNpbmNlIDEuMTBcbiAgICAgICAgICAgIGNjLndhcm5JRCg4NDAxLCAnY2MuYXVkaW9FbmdpbmUnLCAnY2MuQXVkaW9DbGlwJywgJ0F1ZGlvQ2xpcCcsICdjYy5BdWRpb0NsaXAnLCAnYXVkaW8nKTtcbiAgICAgICAgICAgIHBhdGggPSBjbGlwO1xuICAgICAgICAgICAgLy8gbG9hZCBjbGlwXG4gICAgICAgICAgICBhdWRpbyA9IGdldEF1ZGlvRnJvbVBhdGgocGF0aCk7XG4gICAgICAgICAgICBBdWRpb0NsaXAuX2xvYWRCeVVybChwYXRoLCBmdW5jdGlvbiAoZXJyLCBjbGlwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNsaXApIHtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW8uc3JjID0gY2xpcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghY2xpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhdGggPSBjbGlwLm5hdGl2ZVVybDtcbiAgICAgICAgICAgIGF1ZGlvID0gZ2V0QXVkaW9Gcm9tUGF0aChwYXRoKTtcbiAgICAgICAgICAgIGF1ZGlvLnNyYyA9IGNsaXA7XG4gICAgICAgIH1cblxuICAgICAgICBhdWRpby5zZXRMb29wKGxvb3AgfHwgZmFsc2UpO1xuICAgICAgICB2b2x1bWUgPSBoYW5kbGVWb2x1bWUodm9sdW1lKTtcbiAgICAgICAgYXVkaW8uc2V0Vm9sdW1lKHZvbHVtZSk7XG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcblxuICAgICAgICByZXR1cm4gYXVkaW8uaWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IGF1ZGlvIGxvb3AuXG4gICAgICogISN6aCDorr7nva7pn7PpopHmmK/lkKblvqrnjq/jgIJcbiAgICAgKiBAbWV0aG9kIHNldExvb3BcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIGF1ZGlvIGlkLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcCAtIFdoZXRoZXIgY3ljbGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zZXRMb29wKGlkLCB0cnVlKTtcbiAgICAgKi9cbiAgICBzZXRMb29wOiBmdW5jdGlvbiAoYXVkaW9JRCwgbG9vcCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgaWYgKCFhdWRpbyB8fCAhYXVkaW8uc2V0TG9vcClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXVkaW8uc2V0TG9vcChsb29wKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgYXVkaW8gY3ljbGUgc3RhdGUuXG4gICAgICogISN6aCDojrflj5bpn7PpopHnmoTlvqrnjq/nirbmgIHjgIJcbiAgICAgKiBAbWV0aG9kIGlzTG9vcFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhdWRpb0lEIC0gYXVkaW8gaWQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciBjeWNsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLmlzTG9vcChpZCk7XG4gICAgICovXG4gICAgaXNMb29wOiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgaWYgKCFhdWRpbyB8fCAhYXVkaW8uZ2V0TG9vcClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGF1ZGlvLmdldExvb3AoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIHZvbHVtZSBvZiBhdWRpby5cbiAgICAgKiAhI3poIOiuvue9rumfs+mHj++8iDAuMCB+IDEuMO+8ieOAglxuICAgICAqIEBtZXRob2Qgc2V0Vm9sdW1lXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvSUQgLSBhdWRpbyBpZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdm9sdW1lIC0gVm9sdW1lIG11c3QgYmUgaW4gMC4wfjEuMCAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zZXRWb2x1bWUoaWQsIDAuNSk7XG4gICAgICovXG4gICAgc2V0Vm9sdW1lOiBmdW5jdGlvbiAoYXVkaW9JRCwgdm9sdW1lKSB7XG4gICAgICAgIHZhciBhdWRpbyA9IGdldEF1ZGlvRnJvbUlkKGF1ZGlvSUQpO1xuICAgICAgICBpZiAoYXVkaW8pIHtcbiAgICAgICAgICAgIGF1ZGlvLnNldFZvbHVtZSh2b2x1bWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHZvbHVtZSBvZiB0aGUgbXVzaWMgbWF4IHZhbHVlIGlzIDEuMCx0aGUgbWluIHZhbHVlIGlzIDAuMCAuXG4gICAgICogISN6aCDojrflj5bpn7Pph4/vvIgwLjAgfiAxLjDvvInjgIJcbiAgICAgKiBAbWV0aG9kIGdldFZvbHVtZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhdWRpb0lEIC0gYXVkaW8gaWQuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHZvbHVtZSA9IGNjLmF1ZGlvRW5naW5lLmdldFZvbHVtZShpZCk7XG4gICAgICovXG4gICAgZ2V0Vm9sdW1lOiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgcmV0dXJuIGF1ZGlvID8gYXVkaW8uZ2V0Vm9sdW1lKCkgOiAxO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBjdXJyZW50IHRpbWVcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeeahOmfs+mikeaXtumXtOOAglxuICAgICAqIEBtZXRob2Qgc2V0Q3VycmVudFRpbWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIGF1ZGlvIGlkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzZWMgLSBjdXJyZW50IHRpbWUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnNldEN1cnJlbnRUaW1lKGlkLCAyKTtcbiAgICAgKi9cbiAgICBzZXRDdXJyZW50VGltZTogZnVuY3Rpb24gKGF1ZGlvSUQsIHNlYykge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgICAgICBhdWRpby5zZXRDdXJyZW50VGltZShzZWMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgY3VycmVudCB0aW1lXG4gICAgICogISN6aCDojrflj5blvZPliY3nmoTpn7PpopHmkq3mlL7ml7bpl7TjgIJcbiAgICAgKiBAbWV0aG9kIGdldEN1cnJlbnRUaW1lXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvSUQgLSBhdWRpbyBpZC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGF1ZGlvIGN1cnJlbnQgdGltZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB0aW1lID0gY2MuYXVkaW9FbmdpbmUuZ2V0Q3VycmVudFRpbWUoaWQpO1xuICAgICAqL1xuICAgIGdldEN1cnJlbnRUaW1lOiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgcmV0dXJuIGF1ZGlvID8gYXVkaW8uZ2V0Q3VycmVudFRpbWUoKSA6IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGF1ZGlvIGR1cmF0aW9uXG4gICAgICogISN6aCDojrflj5bpn7PpopHmgLvml7bplb/jgIJcbiAgICAgKiBAbWV0aG9kIGdldER1cmF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvSUQgLSBhdWRpbyBpZC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGF1ZGlvIGR1cmF0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHRpbWUgPSBjYy5hdWRpb0VuZ2luZS5nZXREdXJhdGlvbihpZCk7XG4gICAgICovXG4gICAgZ2V0RHVyYXRpb246IGZ1bmN0aW9uIChhdWRpb0lEKSB7XG4gICAgICAgIHZhciBhdWRpbyA9IGdldEF1ZGlvRnJvbUlkKGF1ZGlvSUQpO1xuICAgICAgICByZXR1cm4gYXVkaW8gPyBhdWRpby5nZXREdXJhdGlvbigpIDogMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgYXVkaW8gc3RhdGVcbiAgICAgKiAhI3poIOiOt+WPlumfs+mikeeKtuaAgeOAglxuICAgICAqIEBtZXRob2QgZ2V0U3RhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIGF1ZGlvIGlkLlxuICAgICAqIEByZXR1cm4ge2F1ZGlvRW5naW5lLkF1ZGlvU3RhdGV9IGF1ZGlvIGR1cmF0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHN0YXRlID0gY2MuYXVkaW9FbmdpbmUuZ2V0U3RhdGUoaWQpO1xuICAgICAqL1xuICAgIGdldFN0YXRlOiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgcmV0dXJuIGF1ZGlvID8gYXVkaW8uZ2V0U3RhdGUoKSA6IHRoaXMuQXVkaW9TdGF0ZS5FUlJPUjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgQXVkaW8gZmluaXNoIGNhbGxiYWNrXG4gICAgICogISN6aCDorr7nva7kuIDkuKrpn7PpopHnu5PmnZ/lkI7nmoTlm57osINcbiAgICAgKiBAbWV0aG9kIHNldEZpbmlzaENhbGxiYWNrXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvSUQgLSBhdWRpbyBpZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIGxvYWRlZCBjYWxsYmFjay5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnNldEZpbmlzaENhbGxiYWNrKGlkLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICovXG4gICAgc2V0RmluaXNoQ2FsbGJhY2s6IGZ1bmN0aW9uIChhdWRpb0lELCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgaWYgKCFhdWRpbylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXVkaW8uX2ZpbmlzaENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2UgcGxheWluZyBhdWRpby5cbiAgICAgKiAhI3poIOaaguWBnOato+WcqOaSreaUvumfs+mikeOAglxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIFRoZSByZXR1cm4gdmFsdWUgb2YgZnVuY3Rpb24gcGxheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnBhdXNlKGF1ZGlvSUQpO1xuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgICAgICBhdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3BhdXNlSURDYWNoZTogW10sXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZSBhbGwgcGxheWluZyBhdWRpb1xuICAgICAqICEjemgg5pqC5YGc546w5Zyo5q2j5Zyo5pKt5pS+55qE5omA5pyJ6Z+z6aKR44CCXG4gICAgICogQG1ldGhvZCBwYXVzZUFsbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUucGF1c2VBbGwoKTtcbiAgICAgKi9cbiAgICBwYXVzZUFsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpZCBpbiBfaWQyYXVkaW8pIHtcbiAgICAgICAgICAgIHZhciBhdWRpbyA9IF9pZDJhdWRpb1tpZF07XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBhdWRpby5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgaWYgKHN0YXRlID09PSBBdWRpby5TdGF0ZS5QTEFZSU5HKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGF1c2VJRENhY2hlLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIGF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgcGxheWluZyBhdWRpby5cbiAgICAgKiAhI3poIOaBouWkjeaSreaUvuaMh+WumueahOmfs+mikeOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvSUQgLSBUaGUgcmV0dXJuIHZhbHVlIG9mIGZ1bmN0aW9uIHBsYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5yZXN1bWUoYXVkaW9JRCk7XG4gICAgICovXG4gICAgcmVzdW1lOiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICB2YXIgYXVkaW8gPSBnZXRBdWRpb0Zyb21JZChhdWRpb0lEKTtcbiAgICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgICAgICBhdWRpby5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3VtZSBhbGwgcGxheWluZyBhdWRpby5cbiAgICAgKiAhI3poIOaBouWkjeaSreaUvuaJgOacieS5i+WJjeaaguWBnOeahOaJgOaciemfs+mikeOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lQWxsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5yZXN1bWVBbGwoKTtcbiAgICAgKi9cbiAgICByZXN1bWVBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9wYXVzZUlEQ2FjaGUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuX3BhdXNlSURDYWNoZVtpXTtcbiAgICAgICAgICAgIHZhciBhdWRpbyA9IGdldEF1ZGlvRnJvbUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChhdWRpbylcbiAgICAgICAgICAgICAgICBhdWRpby5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wYXVzZUlEQ2FjaGUubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wIHBsYXlpbmcgYXVkaW8uXG4gICAgICogISN6aCDlgZzmraLmkq3mlL7mjIflrprpn7PpopHjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIFRoZSByZXR1cm4gdmFsdWUgb2YgZnVuY3Rpb24gcGxheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnN0b3AoYXVkaW9JRCk7XG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24gKGF1ZGlvSUQpIHtcbiAgICAgICAgdmFyIGF1ZGlvID0gZ2V0QXVkaW9Gcm9tSWQoYXVkaW9JRCk7XG4gICAgICAgIGlmIChhdWRpbykge1xuICAgICAgICAgICAgLy8gU3RvcCB3aWxsIHJlY3ljbGUgYXVkaW8gYXV0b21hdGljYWxseSBieSBldmVudCBjYWxsYmFja1xuICAgICAgICAgICAgYXVkaW8uc3RvcCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wIGFsbCBwbGF5aW5nIGF1ZGlvLlxuICAgICAqICEjemgg5YGc5q2i5q2j5Zyo5pKt5pS+55qE5omA5pyJ6Z+z6aKR44CCXG4gICAgICogQG1ldGhvZCBzdG9wQWxsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zdG9wQWxsKCk7XG4gICAgICovXG4gICAgc3RvcEFsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpZCBpbiBfaWQyYXVkaW8pIHtcbiAgICAgICAgICAgIHZhciBhdWRpbyA9IF9pZDJhdWRpb1tpZF07XG4gICAgICAgICAgICBpZiAoYXVkaW8pIHtcbiAgICAgICAgICAgICAgICAvLyBTdG9wIHdpbGwgcmVjeWNsZSBhdWRpbyBhdXRvbWF0aWNhbGx5IGJ5IGV2ZW50IGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgYXVkaW8uc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHVwIGFuIGF1ZGlvIGNhbiBnZW5lcmF0ZSBhIGZldyBleGFtcGxlcy5cbiAgICAgKiAhI3poIOiuvue9ruS4gOS4qumfs+mikeWPr+S7peiuvue9ruWHoOS4quWunuS+i1xuICAgICAqIEBtZXRob2Qgc2V0TWF4QXVkaW9JbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW0gLSBhIG51bWJlciBvZiBpbnN0YW5jZXMgdG8gYmUgY3JlYXRlZCBmcm9tIHdpdGhpbiBhbiBhdWRpb1xuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUuc2V0TWF4QXVkaW9JbnN0YW5jZSgyMCk7XG4gICAgICovXG4gICAgc2V0TWF4QXVkaW9JbnN0YW5jZTogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICB0aGlzLl9tYXhBdWRpb0luc3RhbmNlID0gbnVtO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHRpbmcgYXVkaW8gY2FuIHByb2R1Y2Ugc2V2ZXJhbCBleGFtcGxlcy5cbiAgICAgKiAhI3poIOiOt+WPluS4gOS4qumfs+mikeWPr+S7peiuvue9ruWHoOS4quWunuS+i1xuICAgICAqIEBtZXRob2QgZ2V0TWF4QXVkaW9JbnN0YW5jZVxuICAgICAqIEByZXR1cm4ge051bWJlcn0gYSAtIG51bWJlciBvZiBpbnN0YW5jZXMgdG8gYmUgY3JlYXRlZCBmcm9tIHdpdGhpbiBhbiBhdWRpb1xuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUuZ2V0TWF4QXVkaW9JbnN0YW5jZSgpO1xuICAgICAqL1xuICAgIGdldE1heEF1ZGlvSW5zdGFuY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heEF1ZGlvSW5zdGFuY2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVW5sb2FkIHRoZSBwcmVsb2FkZWQgYXVkaW8gZnJvbSBpbnRlcm5hbCBidWZmZXIuXG4gICAgICogISN6aCDljbjovb3pooTliqDovb3nmoTpn7PpopHjgIJcbiAgICAgKiBAbWV0aG9kIHVuY2FjaGVcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ2xpcH0gY2xpcFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUudW5jYWNoZShmaWxlUGF0aCk7XG4gICAgICovXG4gICAgdW5jYWNoZTogZnVuY3Rpb24gKGNsaXApIHtcbiAgICAgICAgdmFyIGZpbGVQYXRoID0gY2xpcDtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGlwID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSBzaW5jZSAxLjEwXG4gICAgICAgICAgICBjYy53YXJuSUQoODQwMSwgJ2NjLmF1ZGlvRW5naW5lJywgJ2NjLkF1ZGlvQ2xpcCcsICdBdWRpb0NsaXAnLCAnY2MuQXVkaW9DbGlwJywgJ2F1ZGlvJyk7XG4gICAgICAgICAgICBmaWxlUGF0aCA9IGNsaXA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWNsaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWxlUGF0aCA9IGNsaXAubmF0aXZlVXJsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxpc3QgPSBfdXJsMmlkW2ZpbGVQYXRoXTtcbiAgICAgICAgaWYgKCFsaXN0KSByZXR1cm47XG4gICAgICAgIHdoaWxlIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGxpc3QucG9wKCk7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBfaWQyYXVkaW9baWRdO1xuICAgICAgICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgICAgICAgICAgLy8gU3RvcCB3aWxsIHJlY3ljbGUgYXVkaW8gYXV0b21hdGljYWxseSBieSBldmVudCBjYWxsYmFja1xuICAgICAgICAgICAgICAgIGF1ZGlvLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgX2lkMmF1ZGlvW2lkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFVubG9hZCBhbGwgYXVkaW8gZnJvbSBpbnRlcm5hbCBidWZmZXIuXG4gICAgICogISN6aCDljbjovb3miYDmnInpn7PpopHjgIJcbiAgICAgKiBAbWV0aG9kIHVuY2FjaGVBbGxcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnVuY2FjaGVBbGwoKTtcbiAgICAgKi9cbiAgICB1bmNhY2hlQWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcEFsbCgpO1xuICAgICAgICBsZXQgYXVkaW87XG4gICAgICAgIGZvciAobGV0IGlkIGluIF9pZDJhdWRpbykge1xuICAgICAgICAgICAgYXVkaW8gPSBfaWQyYXVkaW9baWRdO1xuICAgICAgICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgICAgICAgICAgYXVkaW8uZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChhdWRpbyA9IF9hdWRpb1Bvb2wucG9wKCkpIHtcbiAgICAgICAgICAgIGF1ZGlvLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBfaWQyYXVkaW8gPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XG4gICAgICAgIF91cmwyaWQgPSB7fTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGFuIGF1ZGlvIHByb2ZpbGUgYnkgbmFtZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwcm9maWxlTmFtZSBBIG5hbWUgb2YgYXVkaW8gcHJvZmlsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBhdWRpbyBwcm9maWxlLlxuICAgICAqL1xuICAgIGdldFByb2ZpbGU6IGZ1bmN0aW9uIChwcm9maWxlTmFtZSkge30sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFByZWxvYWQgYXVkaW8gZmlsZS5cbiAgICAgKiAhI3poIOmihOWKoOi9veS4gOS4qumfs+mikVxuICAgICAqIEBtZXRob2QgcHJlbG9hZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBmaWxlIHBhdGggb2YgYW4gYXVkaW8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIFRoZSBjYWxsYmFjayBvZiBhbiBhdWRpby5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnByZWxvYWQocGF0aCk7XG4gICAgICogQGRlcHJlY2F0ZWQgYGNjLmF1ZGlvRW5naW5lLnByZWxvYWRgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgY2MubG9hZGVyLmxvYWRSZXModXJsLCBjYy5BdWRpb0NsaXApYCBpbnN0ZWFkIHBsZWFzZS5cbiAgICAgKi9cbiAgICBwcmVsb2FkOiBmdW5jdGlvbiAoZmlsZVBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgY2Mud2FybignYGNjLmF1ZGlvRW5naW5lLnByZWxvYWRgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgY2MubG9hZGVyLmxvYWRSZXModXJsLCBjYy5BdWRpb0NsaXApYCBpbnN0ZWFkIHBsZWFzZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNjLmxvYWRlci5sb2FkKGZpbGVQYXRoLCBjYWxsYmFjayAmJiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgYSBzaXplLCB0aGUgdW5pdCBpcyBLQi4gT3ZlciB0aGlzIHNpemUgaXMgZGlyZWN0bHkgcmVzb2x2ZWQgaW50byBET00gbm9kZXMuXG4gICAgICogISN6aCDorr7nva7kuIDkuKrku6UgS0Ig5Li65Y2V5L2N55qE5bC65a+477yM5aSn5LqO6L+Z5Liq5bC65a+455qE6Z+z6aKR5Zyo5Yqg6L2955qE5pe25YCZ5Lya5by65Yi25L2/55SoIGRvbSDmlrnlvI/liqDovb1cbiAgICAgKiBAbWV0aG9kIHNldE1heFdlYkF1ZGlvU2l6ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBrYiAtIFRoZSBmaWxlIHBhdGggb2YgYW4gYXVkaW8uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zZXRNYXhXZWJBdWRpb1NpemUoMzAwKTtcbiAgICAgKi9cbiAgICAvLyBCZWNhdXNlIHdlYkF1ZGlvIHRha2VzIHVwIHRvbyBtdWNoIG1lbW9yee+8jFNvIGFsbG93IHVzZXJzIHRvIG1hbnVhbGx5IGNob29zZVxuICAgIHNldE1heFdlYkF1ZGlvU2l6ZTogZnVuY3Rpb24gKGtiKSB7XG4gICAgICAgIHRoaXMuX21heFdlYkF1ZGlvU2l6ZSA9IGtiICogMTAyNDtcbiAgICB9LFxuXG4gICAgX2JyZWFrQ2FjaGU6IG51bGwsXG4gICAgX2JyZWFrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2JyZWFrQ2FjaGUgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gX2lkMmF1ZGlvKSB7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBfaWQyYXVkaW9baWRdO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gYXVkaW8uZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gQXVkaW8uU3RhdGUuUExBWUlORykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JyZWFrQ2FjaGUucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVzdG9yZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2JyZWFrQ2FjaGUpIHJldHVybjtcblxuICAgICAgICB3aGlsZSAodGhpcy5fYnJlYWtDYWNoZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLl9icmVha0NhY2hlLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gZ2V0QXVkaW9Gcm9tSWQoaWQpO1xuICAgICAgICAgICAgaWYgKGF1ZGlvICYmIGF1ZGlvLnJlc3VtZSlcbiAgICAgICAgICAgICAgICBhdWRpby5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9icmVha0NhY2hlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIENsYXNzaWZpY2F0aW9uIG9mIGludGVyZmFjZVxuXG4gICAgX211c2ljOiB7XG4gICAgICAgIGlkOiAtMSxcbiAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgIHZvbHVtZTogMSxcbiAgICB9LFxuXG4gICAgX2VmZmVjdDoge1xuICAgICAgICB2b2x1bWU6IDEsXG4gICAgICAgIHBhdXNlQ2FjaGU6IFtdLFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBsYXkgYmFja2dyb3VuZCBtdXNpY1xuICAgICAqICEjemgg5pKt5pS+6IOM5pmv6Z+z5LmQXG4gICAgICogQG1ldGhvZCBwbGF5TXVzaWNcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ2xpcH0gY2xpcCAtIFRoZSBhdWRpbyBjbGlwIHRvIHBsYXkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBsb29wIC0gV2hldGhlciB0aGUgbXVzaWMgbG9vcCBvciBub3QuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBhdWRpb0lkXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGNjLkF1ZGlvQ2xpcCwgZnVuY3Rpb24gKGVyciwgY2xpcCkge1xuICAgICAqICAgICB2YXIgYXVkaW9JRCA9IGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyhjbGlwLCBmYWxzZSk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgcGxheU11c2ljOiBmdW5jdGlvbiAoY2xpcCwgbG9vcCkge1xuICAgICAgICB2YXIgbXVzaWMgPSB0aGlzLl9tdXNpYztcbiAgICAgICAgdGhpcy5zdG9wKG11c2ljLmlkKTtcbiAgICAgICAgbXVzaWMuaWQgPSB0aGlzLnBsYXkoY2xpcCwgbG9vcCwgbXVzaWMudm9sdW1lKTtcbiAgICAgICAgbXVzaWMubG9vcCA9IGxvb3A7XG4gICAgICAgIHJldHVybiBtdXNpYy5pZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wIGJhY2tncm91bmQgbXVzaWMuXG4gICAgICogISN6aCDlgZzmraLmkq3mlL7og4zmma/pn7PkuZDjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BNdXNpY1xuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKCk7XG4gICAgICovXG4gICAgc3RvcE11c2ljOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcCh0aGlzLl9tdXNpYy5pZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2UgdGhlIGJhY2tncm91bmQgbXVzaWMuXG4gICAgICogISN6aCDmmoLlgZzmkq3mlL7og4zmma/pn7PkuZDjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlTXVzaWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnBhdXNlTXVzaWMoKTtcbiAgICAgKi9cbiAgICBwYXVzZU11c2ljOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGF1c2UodGhpcy5fbXVzaWMuaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5fbXVzaWMuaWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVzdW1lIHBsYXlpbmcgYmFja2dyb3VuZCBtdXNpYy5cbiAgICAgKiAhI3poIOaBouWkjeaSreaUvuiDjOaZr+mfs+S5kOOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lTXVzaWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnJlc3VtZU11c2ljKCk7XG4gICAgICovXG4gICAgcmVzdW1lTXVzaWM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZXN1bWUodGhpcy5fbXVzaWMuaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5fbXVzaWMuaWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IHRoZSB2b2x1bWUoMC4wIH4gMS4wKS5cbiAgICAgKiAhI3poIOiOt+WPlumfs+mHj++8iDAuMCB+IDEuMO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0TXVzaWNWb2x1bWVcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdm9sdW1lID0gY2MuYXVkaW9FbmdpbmUuZ2V0TXVzaWNWb2x1bWUoKTtcbiAgICAgKi9cbiAgICBnZXRNdXNpY1ZvbHVtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbXVzaWMudm9sdW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgYmFja2dyb3VuZCBtdXNpYyB2b2x1bWUuXG4gICAgICogISN6aCDorr7nva7og4zmma/pn7PkuZDpn7Pph4/vvIgwLjAgfiAxLjDvvInjgIJcbiAgICAgKiBAbWV0aG9kIHNldE11c2ljVm9sdW1lXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZvbHVtZSAtIFZvbHVtZSBtdXN0IGJlIGluIDAuMH4xLjAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zZXRNdXNpY1ZvbHVtZSgwLjUpO1xuICAgICAqL1xuICAgIHNldE11c2ljVm9sdW1lOiBmdW5jdGlvbiAodm9sdW1lKSB7XG4gICAgICAgIHZvbHVtZSA9IGhhbmRsZVZvbHVtZSh2b2x1bWUpO1xuICAgICAgICB2YXIgbXVzaWMgPSB0aGlzLl9tdXNpYztcbiAgICAgICAgbXVzaWMudm9sdW1lID0gdm9sdW1lO1xuICAgICAgICB0aGlzLnNldFZvbHVtZShtdXNpYy5pZCwgbXVzaWMudm9sdW1lKTtcbiAgICAgICAgcmV0dXJuIG11c2ljLnZvbHVtZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBCYWNrZ3JvdW5kIG11c2ljIHBsYXlpbmcgc3RhdGVcbiAgICAgKiAhI3poIOiDjOaZr+mfs+S5kOaYr+WQpuato+WcqOaSreaUvlxuICAgICAqIEBtZXRob2QgaXNNdXNpY1BsYXlpbmdcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUuaXNNdXNpY1BsYXlpbmcoKTtcbiAgICAgKi9cbiAgICBpc011c2ljUGxheWluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSh0aGlzLl9tdXNpYy5pZCkgPT09IHRoaXMuQXVkaW9TdGF0ZS5QTEFZSU5HO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBsYXkgZWZmZWN0IGF1ZGlvLlxuICAgICAqICEjemgg5pKt5pS+6Z+z5pWIXG4gICAgICogQG1ldGhvZCBwbGF5RWZmZWN0XG4gICAgICogQHBhcmFtIHtBdWRpb0NsaXB9IGNsaXAgLSBUaGUgYXVkaW8gY2xpcCB0byBwbGF5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcCAtIFdoZXRoZXIgdGhlIG11c2ljIGxvb3Agb3Igbm90LlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gYXVkaW9JZFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MubG9hZGVyLmxvYWRSZXModXJsLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGNsaXApIHtcbiAgICAgKiAgICAgdmFyIGF1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KGNsaXAsIGZhbHNlKTtcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBwbGF5RWZmZWN0OiBmdW5jdGlvbiAoY2xpcCwgbG9vcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5KGNsaXAsIGxvb3AgfHwgZmFsc2UsIHRoaXMuX2VmZmVjdC52b2x1bWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgdm9sdW1lIG9mIGVmZmVjdCBhdWRpby5cbiAgICAgKiAhI3poIOiuvue9rumfs+aViOmfs+mHj++8iDAuMCB+IDEuMO+8ieOAglxuICAgICAqIEBtZXRob2Qgc2V0RWZmZWN0c1ZvbHVtZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2b2x1bWUgLSBWb2x1bWUgbXVzdCBiZSBpbiAwLjB+MS4wLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUuc2V0RWZmZWN0c1ZvbHVtZSgwLjUpO1xuICAgICAqL1xuICAgIHNldEVmZmVjdHNWb2x1bWU6IGZ1bmN0aW9uICh2b2x1bWUpIHtcbiAgICAgICAgdm9sdW1lID0gaGFuZGxlVm9sdW1lKHZvbHVtZSk7XG4gICAgICAgIHZhciBtdXNpY0lkID0gdGhpcy5fbXVzaWMuaWQ7XG4gICAgICAgIHRoaXMuX2VmZmVjdC52b2x1bWUgPSB2b2x1bWU7XG4gICAgICAgIGZvciAodmFyIGlkIGluIF9pZDJhdWRpbykge1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gX2lkMmF1ZGlvW2lkXTtcbiAgICAgICAgICAgIGlmICghYXVkaW8gfHwgYXVkaW8uaWQgPT09IG11c2ljSWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgYXVkaW9FbmdpbmUuc2V0Vm9sdW1lKGlkLCB2b2x1bWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHZvbHVtZSBvZiB0aGUgZWZmZWN0IGF1ZGlvIG1heCB2YWx1ZSBpcyAxLjAsdGhlIG1pbiB2YWx1ZSBpcyAwLjAgLlxuICAgICAqICEjemgg6I635Y+W6Z+z5pWI6Z+z6YeP77yIMC4wIH4gMS4w77yJ44CCXG4gICAgICogQG1ldGhvZCBnZXRFZmZlY3RzVm9sdW1lXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHZvbHVtZSA9IGNjLmF1ZGlvRW5naW5lLmdldEVmZmVjdHNWb2x1bWUoKTtcbiAgICAgKi9cbiAgICBnZXRFZmZlY3RzVm9sdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3Qudm9sdW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlIGVmZmVjdCBhdWRpby5cbiAgICAgKiAhI3poIOaaguWBnOaSreaUvumfs+aViOOAglxuICAgICAqIEBtZXRob2QgcGF1c2VFZmZlY3RcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIGF1ZGlvIGlkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUucGF1c2VFZmZlY3QoYXVkaW9JRCk7XG4gICAgICovXG4gICAgcGF1c2VFZmZlY3Q6IGZ1bmN0aW9uIChhdWRpb0lEKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlKGF1ZGlvSUQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3AgcGxheWluZyBhbGwgdGhlIHNvdW5kIGVmZmVjdHMuXG4gICAgICogISN6aCDmmoLlgZzmkq3mlL7miYDmnInpn7PmlYjjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlQWxsRWZmZWN0c1xuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXVkaW9FbmdpbmUucGF1c2VBbGxFZmZlY3RzKCk7XG4gICAgICovXG4gICAgcGF1c2VBbGxFZmZlY3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtdXNpY0lkID0gdGhpcy5fbXVzaWMuaWQ7XG4gICAgICAgIHZhciBlZmZlY3QgPSB0aGlzLl9lZmZlY3Q7XG4gICAgICAgIGVmZmVjdC5wYXVzZUNhY2hlLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaWQgaW4gX2lkMmF1ZGlvKSB7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBfaWQyYXVkaW9baWRdO1xuICAgICAgICAgICAgaWYgKCFhdWRpbyB8fCBhdWRpby5pZCA9PT0gbXVzaWNJZCkgY29udGludWU7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBhdWRpby5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgaWYgKHN0YXRlID09PSB0aGlzLkF1ZGlvU3RhdGUuUExBWUlORykge1xuICAgICAgICAgICAgICAgIGVmZmVjdC5wYXVzZUNhY2hlLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIGF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgZWZmZWN0IGF1ZGlvLlxuICAgICAqICEjemgg5oGi5aSN5pKt5pS+6Z+z5pWI6Z+z6aKR44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVFZmZlY3RcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9JRCAtIFRoZSByZXR1cm4gdmFsdWUgb2YgZnVuY3Rpb24gcGxheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnJlc3VtZUVmZmVjdChhdWRpb0lEKTtcbiAgICAgKi9cbiAgICByZXN1bWVFZmZlY3Q6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB0aGlzLnJlc3VtZShpZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVzdW1lIGFsbCBlZmZlY3QgYXVkaW8uXG4gICAgICogISN6aCDmgaLlpI3mkq3mlL7miYDmnInkuYvliY3mmoLlgZznmoTpn7PmlYjjgIJcbiAgICAgKiBAbWV0aG9kIHJlc3VtZUFsbEVmZmVjdHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmF1ZGlvRW5naW5lLnJlc3VtZUFsbEVmZmVjdHMoKTtcbiAgICAgKi9cbiAgICByZXN1bWVBbGxFZmZlY3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXVzZUlEQ2FjaGUgPSB0aGlzLl9lZmZlY3QucGF1c2VDYWNoZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXVzZUlEQ2FjaGUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IHBhdXNlSURDYWNoZVtpXTtcbiAgICAgICAgICAgIHZhciBhdWRpbyA9IF9pZDJhdWRpb1tpZF07XG4gICAgICAgICAgICBpZiAoYXVkaW8pXG4gICAgICAgICAgICAgICAgYXVkaW8ucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wIHBsYXlpbmcgdGhlIGVmZmVjdCBhdWRpby5cbiAgICAgKiAhI3poIOWBnOatouaSreaUvumfs+aViOOAglxuICAgICAqIEBtZXRob2Qgc3RvcEVmZmVjdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhdWRpb0lEIC0gYXVkaW8gaWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zdG9wRWZmZWN0KGlkKTtcbiAgICAgKi9cbiAgICBzdG9wRWZmZWN0OiBmdW5jdGlvbiAoYXVkaW9JRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9wKGF1ZGlvSUQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3AgcGxheWluZyBhbGwgdGhlIGVmZmVjdHMuXG4gICAgICogISN6aCDlgZzmraLmkq3mlL7miYDmnInpn7PmlYjjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BBbGxFZmZlY3RzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hdWRpb0VuZ2luZS5zdG9wQWxsRWZmZWN0cygpO1xuICAgICAqL1xuICAgIHN0b3BBbGxFZmZlY3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtdXNpY0lkID0gdGhpcy5fbXVzaWMuaWQ7XG4gICAgICAgIGZvciAodmFyIGlkIGluIF9pZDJhdWRpbykge1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gX2lkMmF1ZGlvW2lkXTtcbiAgICAgICAgICAgIGlmICghYXVkaW8gfHwgYXVkaW8uaWQgPT09IG11c2ljSWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gYXVkaW8uZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gYXVkaW9FbmdpbmUuQXVkaW9TdGF0ZS5QTEFZSU5HKSB7XG4gICAgICAgICAgICAgICAgYXVkaW8uc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5hdWRpb0VuZ2luZSA9IGF1ZGlvRW5naW5lOyJdfQ==