
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/index.js';
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
require('./box2d-adapter');

require('./CCPhysicsManager');

require('./CCRigidBody');

require('./CCPhysicsContact');

require('./collider/CCPhysicsCollider');

require('./collider/CCPhysicsChainCollider');

require('./collider/CCPhysicsCircleCollider');

require('./collider/CCPhysicsBoxCollider');

require('./collider/CCPhysicsPolygonCollider');

require('./joint/CCJoint');

require('./joint/CCDistanceJoint');

require('./joint/CCRevoluteJoint');

require('./joint/CCMouseJoint');

require('./joint/CCMotorJoint');

require('./joint/CCPrismaticJoint');

require('./joint/CCWeldJoint');

require('./joint/CCWheelJoint');

require('./joint/CCRopeJoint');

require('./platform/CCPhysicsContactListner');

require('./platform/CCPhysicsAABBQueryCallback');

require('./platform/CCPhysicsRayCastCallback');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBQSxPQUFPLENBQUMsaUJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLG9CQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxlQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQOztBQUVBQSxPQUFPLENBQUMsOEJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLG1DQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxvQ0FBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsaUNBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLHFDQUFELENBQVA7O0FBRUFBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMseUJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLHlCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxzQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsc0JBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLDBCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxxQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsc0JBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLHFCQUFELENBQVA7O0FBRUFBLE9BQU8sQ0FBQyxvQ0FBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsdUNBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLHFDQUFELENBQVAiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5yZXF1aXJlKCcuL2JveDJkLWFkYXB0ZXInKTtcbnJlcXVpcmUoJy4vQ0NQaHlzaWNzTWFuYWdlcicpO1xucmVxdWlyZSgnLi9DQ1JpZ2lkQm9keScpO1xucmVxdWlyZSgnLi9DQ1BoeXNpY3NDb250YWN0Jyk7XG5cbnJlcXVpcmUoJy4vY29sbGlkZXIvQ0NQaHlzaWNzQ29sbGlkZXInKTtcbnJlcXVpcmUoJy4vY29sbGlkZXIvQ0NQaHlzaWNzQ2hhaW5Db2xsaWRlcicpO1xucmVxdWlyZSgnLi9jb2xsaWRlci9DQ1BoeXNpY3NDaXJjbGVDb2xsaWRlcicpO1xucmVxdWlyZSgnLi9jb2xsaWRlci9DQ1BoeXNpY3NCb3hDb2xsaWRlcicpO1xucmVxdWlyZSgnLi9jb2xsaWRlci9DQ1BoeXNpY3NQb2x5Z29uQ29sbGlkZXInKTtcblxucmVxdWlyZSgnLi9qb2ludC9DQ0pvaW50Jyk7XG5yZXF1aXJlKCcuL2pvaW50L0NDRGlzdGFuY2VKb2ludCcpO1xucmVxdWlyZSgnLi9qb2ludC9DQ1Jldm9sdXRlSm9pbnQnKTtcbnJlcXVpcmUoJy4vam9pbnQvQ0NNb3VzZUpvaW50Jyk7XG5yZXF1aXJlKCcuL2pvaW50L0NDTW90b3JKb2ludCcpO1xucmVxdWlyZSgnLi9qb2ludC9DQ1ByaXNtYXRpY0pvaW50Jyk7XG5yZXF1aXJlKCcuL2pvaW50L0NDV2VsZEpvaW50Jyk7XG5yZXF1aXJlKCcuL2pvaW50L0NDV2hlZWxKb2ludCcpO1xucmVxdWlyZSgnLi9qb2ludC9DQ1JvcGVKb2ludCcpO1xuXG5yZXF1aXJlKCcuL3BsYXRmb3JtL0NDUGh5c2ljc0NvbnRhY3RMaXN0bmVyJyk7XG5yZXF1aXJlKCcuL3BsYXRmb3JtL0NDUGh5c2ljc0FBQkJRdWVyeUNhbGxiYWNrJyk7XG5yZXF1aXJlKCcuL3BsYXRmb3JtL0NDUGh5c2ljc1JheUNhc3RDYWxsYmFjaycpO1xuIl19