//
//  AudioEngine-inlwanba.hpp
//  cocos2d_libs
//
//  Created by Goes_By on 2019/1/23.
//


#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC

#ifndef AudioEngine_inlwanba_hpp
#define AudioEngine_inlwanba_hpp

#include <stdio.h>

#include <unordered_map>
#include <iostream>

#include "audio/apple/AudioEngine-inl.h"

class AudioEngineInlWanba : public cocos2d::AudioEngineImpl {
public:
    AudioEngineInlWanba();
    ~AudioEngineInlWanba();
    
    bool init();
    int play2d(const std::string &fileFullPath, bool loop, float volume);
    void setVolume(int audioID,float volume);
    void setLoop(int audioID, bool loop);
    bool pause(int audioID);
    void pauseAll();
    bool resume(int audioID);
    void resumeAll();
    void stop(int audioID);
    void stopAll();
    float getDuration(int audioID);
    float getCurrentTime(int audioID);
    bool setCurrentTime(int audioID, float time);
    void setFinishCallback(int audioID, const std::function<void (int, const std::string &)> &callback);
    cocos2d::AudioCache* preload(const std::string& filePath, std::function<void(bool)> callback);
    void uncache(const std::string& filePath);
    void uncacheAll();
    void update(float dt);
    
    void wanbaEngineSetEnabled(bool isEnabled);
    bool wanbaEngineIsEnabled();
//        void registDelegate();
private:
    int _currentAudioID;

};

#endif /* AudioEngine_inlwanba_hpp */
#endif
