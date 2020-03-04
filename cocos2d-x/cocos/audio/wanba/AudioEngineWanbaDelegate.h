//
//  AudioEngineWanbaDelegate.h
//  cocos2d_libs
//
//  Created by Goes_By on 2019/1/23.
//

#import <Foundation/Foundation.h>

@protocol AudioEngineWanbaDelegate

-(void)play:(NSString*)audioPath audioId:(int)audioId loop:(bool)loop volume:(float)volume;
-(void)setVolume:(int)audioId volume:(float)volume;
-(void)setLoop:(int)audioId loop:(bool)loop;
-(bool)pause:(int)audioId;
-(void)pauseAll;
-(bool)resume:(int)audioId;
-(void)resumeAll;
-(void)stop:(int)audioId;
-(void)stopAll;
-(float)getDuration:(int)audioId;
-(float)getCurrentTime:(int)audioId;
-(bool)setCurrentTime:(int)audioId time:(float)time;
-(void)preload:(NSString*)audioPath;
-(void)uncache:(NSString*)audioPath;
-(void)uncacheAll;
-(void)wanbaEngineModeSetEnabled:(bool)isEnabled;
-(bool)wanbaEngineIsEnable;
@end

@interface AudioEngineWanbaImpl : NSObject

+(instancetype) shareInstance;

@property(assign,nonatomic)id<AudioEngineWanbaDelegate> delegate;

-(void)play:(NSString*)audioPath audioId:(int)audioId loop:(bool)loop volume:(float)volume;
-(void)setVolume:(int)audioId volume:(float)volume;
-(void)setLoop:(int)audioId loop:(bool)loop;
-(bool)pause:(int)audioId;
-(void)pauseAll;
-(bool)resume:(int)audioId;
-(void)resumeAll;
-(void)stop:(int)audioId;
-(void)stopAll;
-(float)getDuration:(int)audioId;
-(float)getCurrentTime:(int)audioId;
-(bool)setCurrentTime:(int)audioId time:(float)time;
-(void)preload:(NSString*)audioPath;
-(void)uncache:(NSString*)audioPath;
-(void)uncacheAll;
-(void)wanbaEngineModeSetEnabled:(bool)isEnabled;
-(bool)wanbaEngineIsEnable;

@end
