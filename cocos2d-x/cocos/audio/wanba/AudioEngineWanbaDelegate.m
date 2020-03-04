//
//  AudioEngineWanbaDelegate.m
//  cocos2d_libs
//
//  Created by Goes_By on 2019/1/23.
//

#import "AudioEngineWanbaDelegate.h"

@implementation AudioEngineWanbaImpl


static AudioEngineWanbaImpl* _instance = nil;

+(instancetype) shareInstance
{
    static dispatch_once_t onceToken ;
    dispatch_once(&onceToken, ^{
        _instance = [[self alloc] init] ;
    }) ;
    
    return _instance ;
}

- (void)play:(NSString*)audioPath audioId:(int)audioId loop:(bool)loop volume:(float)volume{
    [self.delegate play:audioPath audioId:audioId loop:loop volume:volume];
}

-(void)setVolume:(int)audioId volume:(float)volume {
    [self.delegate setVolume:audioId volume:volume];
}

-(void)setLoop:(int)audioId loop:(bool)loop {
    [self.delegate setLoop:audioId loop:loop];
}

-(bool)pause:(int)audioId {
    return [self.delegate pause:audioId];
}

-(void)pauseAll {
    [self.delegate pauseAll];
}

-(bool)resume:(int)audioId {
    return [self.delegate resume:audioId];
}

-(void)resumeAll {
    [self.delegate resumeAll];
}

-(void)stop:(int)audioId {
    [self.delegate stop:audioId];
}

-(void)stopAll {
    [self.delegate stopAll];
}

-(float)getDuration:(int)audioId {
    return [self.delegate getDuration:audioId];
}

-(float)getCurrentTime:(int)audioId {
    return [self.delegate getCurrentTime:audioId];
}

-(bool)setCurrentTime:(int)audioId time:(float)time {
    return [self.delegate setCurrentTime:audioId time:time];
}

-(void)preload:(NSString*)audioPath {
    [self.delegate preload:audioPath];
}

-(void)uncache:(NSString*)audioPath {
    [self.delegate uncache:audioPath];
}

-(void)uncacheAll {
    [self.delegate uncacheAll];
}

-(void)wanbaEngineModeSetEnabled:(bool)isEnabled {
    [self.delegate wanbaEngineModeSetEnabled:isEnabled];
}

-(bool)wanbaEngineIsEnable {
    return [self.delegate wanbaEngineIsEnable];
}

@end
