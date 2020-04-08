//
//  AudioEngine-inlwanba.cpp
//  cocos2d_libs
//
//  Created by Goes_By on 2019/1/23.
//

#include "AudioEngine-inlwanba.hpp"
#import "AudioEngineWanbaDelegate.h"


using namespace cocos2d;

AudioEngineInlWanba::AudioEngineInlWanba():
_currentAudioID(0){
    
}

AudioEngineInlWanba::~AudioEngineInlWanba() {
    
}

bool AudioEngineInlWanba::init() {
    return true;
}

int AudioEngineInlWanba::play2d(const std::string &fileFullPath, bool loop, float volume) {
//    NSLog(@"AudioEngineInlWanba::play2d\n");
    [[AudioEngineWanbaImpl shareInstance] play: [NSString stringWithCString:fileFullPath.c_str() encoding:NSUTF8StringEncoding] audioId:_currentAudioID loop:loop volume:volume];
    return _currentAudioID++;
}

void AudioEngineInlWanba::setVolume(int audioID, float volume) {
    [[AudioEngineWanbaImpl shareInstance] setVolume:audioID volume:volume];
}

void AudioEngineInlWanba::setLoop(int audioID, bool loop) {
    [[AudioEngineWanbaImpl shareInstance] setLoop:audioID loop:loop];
}

bool AudioEngineInlWanba::pause(int audioID) {
    return [[AudioEngineWanbaImpl shareInstance] pause:audioID];
}

void AudioEngineInlWanba::pauseAll() {
    [[AudioEngineWanbaImpl shareInstance] pauseAll];
}

bool AudioEngineInlWanba::resume(int audioID) {
    return [[AudioEngineWanbaImpl shareInstance] resume:audioID];
}

void AudioEngineInlWanba::resumeAll() {
    [[AudioEngineWanbaImpl shareInstance] resumeAll];
}

void AudioEngineInlWanba::stop(int audioID) {
    [[AudioEngineWanbaImpl shareInstance] stop:audioID];
}

void AudioEngineInlWanba::stopAll() {
    [[AudioEngineWanbaImpl shareInstance] stopAll];
}

float AudioEngineInlWanba::getDuration(int audioID) {
    return [[AudioEngineWanbaImpl shareInstance] getDuration:audioID];
}

float AudioEngineInlWanba::getCurrentTime(int audioID) {
    return [[AudioEngineWanbaImpl shareInstance] getCurrentTime:audioID];
}

bool AudioEngineInlWanba::setCurrentTime(int audioID, float time) {
    return [[AudioEngineWanbaImpl shareInstance] setCurrentTime:audioID time:time];
}

void AudioEngineInlWanba::setFinishCallback(int audioID, const std::function<void (int, const std::string &)> &callback) {
    //do nothing
}

cocos2d::AudioCache* AudioEngineInlWanba::preload(const std::string& filePath, std::function<void(bool)> callback) {
    [[AudioEngineWanbaImpl shareInstance] preload:[NSString stringWithCString:filePath.c_str() encoding:NSUTF8StringEncoding]];
    return nullptr;
}

void AudioEngineInlWanba::uncache(const std::string& filePath) {
    [[AudioEngineWanbaImpl shareInstance] uncache:[NSString stringWithCString:filePath.c_str() encoding:NSUTF8StringEncoding]];
}

void AudioEngineInlWanba::uncacheAll() {
    [[AudioEngineWanbaImpl shareInstance] uncacheAll];
}

void AudioEngineInlWanba::update(float dt) {
    //do nothing
}

void AudioEngineInlWanba::wanbaEngineSetEnabled(bool isEnabled) {
    [[AudioEngineWanbaImpl shareInstance] wanbaEngineModeSetEnabled:isEnabled];
}

bool AudioEngineInlWanba::wanbaEngineIsEnabled() {
    auto instance = [AudioEngineWanbaImpl shareInstance];
    if (instance) {
        return [instance wanbaEngineIsEnable];
    }
    return false;
}
