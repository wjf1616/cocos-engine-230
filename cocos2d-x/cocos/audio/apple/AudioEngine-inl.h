/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
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

#include "platform/CCPlatformConfig.h"
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC

#ifndef __AUDIO_ENGINE_INL_H_
#define __AUDIO_ENGINE_INL_H_

#include <unordered_map>

#include "base/CCRef.h"
#include "audio/apple/AudioCache.h"
#include "audio/apple/AudioPlayer.h"

NS_CC_BEGIN
class Scheduler;

#define MAX_AUDIOINSTANCES 24

class AudioEngineImpl : public cocos2d::Ref
{
public:
    AudioEngineImpl();
    ~AudioEngineImpl();

    virtual bool init();
    virtual int play2d(const std::string &fileFullPath ,bool loop ,float volume);
    virtual void setVolume(int audioID,float volume);
    virtual void setLoop(int audioID, bool loop);
    virtual bool pause(int audioID);
    virtual bool resume(int audioID);
    virtual void stop(int audioID);
    virtual void stopAll();
    virtual float getDuration(int audioID);
    virtual float getDurationFromFile(const std::string &fileFullPath);
    virtual float getCurrentTime(int audioID);
    virtual bool setCurrentTime(int audioID, float time);
    virtual void setFinishCallback(int audioID, const std::function<void (int, const std::string &)> &callback);

    virtual void uncache(const std::string& filePath);
    virtual void uncacheAll();
    virtual AudioCache* preload(const std::string& filePath, std::function<void(bool)> callback);
    virtual void update(float dt);

private:
    bool _checkAudioIdValid(int audioID);
    void _play2d(AudioCache *cache, int audioID);
    ALuint findValidSource();

    static ALvoid myAlSourceNotificationCallback(ALuint sid, ALuint notificationID, ALvoid* userData);

    ALuint _alSources[MAX_AUDIOINSTANCES];

    //source,used
    std::list<ALuint> _unusedSourcesPool;

    //filePath,bufferInfo
    std::unordered_map<std::string, AudioCache> _audioCaches;

    //audioID,AudioInfo
    std::unordered_map<int, AudioPlayer*>  _audioPlayers;
    std::mutex _threadMutex;

    bool _lazyInitLoop;

    int _currentAudioID;
    std::weak_ptr<Scheduler> _scheduler;
};
NS_CC_END
#endif // __AUDIO_ENGINE_INL_H_
#endif
