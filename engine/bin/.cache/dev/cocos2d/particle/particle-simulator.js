
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/particle-simulator.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var AffineTrans = require('../core/utils/affine-transform');

var js = require('../core/platform/js');

var misc = require('../core/utils/misc');

var ZERO_VEC2 = cc.v2(0, 0);

var _trans = AffineTrans.create();

var _pos = cc.v2();

var _tpa = cc.v2();

var _tpb = cc.v2();

var _tpc = cc.v2();

var Particle = function Particle() {
  this.pos = cc.v2(0, 0);
  this.startPos = cc.v2(0, 0);
  this.color = cc.color(0, 0, 0, 255);
  this.deltaColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  };
  this.size = 0;
  this.deltaSize = 0;
  this.rotation = 0;
  this.deltaRotation = 0;
  this.timeToLive = 0;
  this.drawPos = cc.v2(0, 0);
  this.aspectRatio = 1; // Mode A

  this.dir = cc.v2(0, 0);
  this.radialAccel = 0;
  this.tangentialAccel = 0; // Mode B

  this.angle = 0;
  this.degreesPerSecond = 0;
  this.radius = 0;
  this.deltaRadius = 0;
};

var pool = new js.Pool(function (par) {
  par.pos.set(ZERO_VEC2);
  par.startPos.set(ZERO_VEC2);
  par.color._val = 0xFF000000;
  par.deltaColor.r = par.deltaColor.g = par.deltaColor.b = 0;
  par.deltaColor.a = 255;
  par.size = 0;
  par.deltaSize = 0;
  par.rotation = 0;
  par.deltaRotation = 0;
  par.timeToLive = 0;
  par.drawPos.set(ZERO_VEC2);
  par.aspectRatio = 1; // Mode A

  par.dir.set(ZERO_VEC2);
  par.radialAccel = 0;
  par.tangentialAccel = 0; // Mode B

  par.angle = 0;
  par.degreesPerSecond = 0;
  par.radius = 0;
  par.deltaRadius = 0;
}, 1024);

pool.get = function () {
  return this._get() || new Particle();
};

var Simulator = function Simulator(system) {
  this.sys = system;
  this.particles = [];
  this.active = false;
  this.readyToPlay = true;
  this.finished = false;
  this.elapsed = 0;
  this.emitCounter = 0;
  this._uvFilled = 0;
};

Simulator.prototype.stop = function () {
  this.active = false;
  this.readyToPlay = false;
  this.elapsed = this.sys.duration;
  this.emitCounter = 0;
};

Simulator.prototype.reset = function () {
  this.active = true;
  this.readyToPlay = true;
  this.elapsed = 0;
  this.emitCounter = 0;
  this.finished = false;
  var particles = this.particles;

  for (var id = 0; id < particles.length; ++id) {
    pool.put(particles[id]);
  }

  particles.length = 0;
};

Simulator.prototype.emitParticle = function (pos) {
  var psys = this.sys;
  var clampf = misc.clampf;
  var particle = pool.get();
  this.particles.push(particle); // Init particle
  // timeToLive
  // no negative life. prevent division by 0

  particle.timeToLive = psys.life + psys.lifeVar * (Math.random() - 0.5) * 2;
  var timeToLive = particle.timeToLive = Math.max(0, particle.timeToLive); // position

  particle.pos.x = psys.sourcePos.x + psys.posVar.x * (Math.random() - 0.5) * 2;
  particle.pos.y = psys.sourcePos.y + psys.posVar.y * (Math.random() - 0.5) * 2; // Color

  var sr, sg, sb, sa;
  var startColor = psys._startColor,
      startColorVar = psys._startColorVar;
  var endColor = psys._endColor,
      endColorVar = psys._endColorVar;
  particle.color.r = sr = clampf(startColor.r + startColorVar.r * (Math.random() - 0.5) * 2, 0, 255);
  particle.color.g = sg = clampf(startColor.g + startColorVar.g * (Math.random() - 0.5) * 2, 0, 255);
  particle.color.b = sb = clampf(startColor.b + startColorVar.b * (Math.random() - 0.5) * 2, 0, 255);
  particle.color.a = sa = clampf(startColor.a + startColorVar.a * (Math.random() - 0.5) * 2, 0, 255);
  particle.deltaColor.r = (clampf(endColor.r + endColorVar.r * (Math.random() - 0.5) * 2, 0, 255) - sr) / timeToLive;
  particle.deltaColor.g = (clampf(endColor.g + endColorVar.g * (Math.random() - 0.5) * 2, 0, 255) - sg) / timeToLive;
  particle.deltaColor.b = (clampf(endColor.b + endColorVar.b * (Math.random() - 0.5) * 2, 0, 255) - sb) / timeToLive;
  particle.deltaColor.a = (clampf(endColor.a + endColorVar.a * (Math.random() - 0.5) * 2, 0, 255) - sa) / timeToLive; // size

  var startS = psys.startSize + psys.startSizeVar * (Math.random() - 0.5) * 2;
  startS = Math.max(0, startS); // No negative value

  particle.size = startS;

  if (psys.endSize === cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE) {
    particle.deltaSize = 0;
  } else {
    var endS = psys.endSize + psys.endSizeVar * (Math.random() - 0.5) * 2;
    endS = Math.max(0, endS); // No negative values

    particle.deltaSize = (endS - startS) / timeToLive;
  } // rotation


  var startA = psys.startSpin + psys.startSpinVar * (Math.random() - 0.5) * 2;
  var endA = psys.endSpin + psys.endSpinVar * (Math.random() - 0.5) * 2;
  particle.rotation = startA;
  particle.deltaRotation = (endA - startA) / timeToLive; // position

  particle.startPos.x = pos.x;
  particle.startPos.y = pos.y; // aspect ratio

  particle.aspectRatio = psys._aspectRatio || 1; // direction

  var worldRotation = getWorldRotation(psys.node);
  var relAngle = psys.positionType === cc.ParticleSystem.PositionType.FREE ? psys.angle + worldRotation : psys.angle;
  var a = misc.degreesToRadians(relAngle + psys.angleVar * (Math.random() - 0.5) * 2); // Mode Gravity: A

  if (psys.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY) {
    var s = psys.speed + psys.speedVar * (Math.random() - 0.5) * 2; // direction

    particle.dir.x = Math.cos(a);
    particle.dir.y = Math.sin(a);
    particle.dir.mulSelf(s); // radial accel

    particle.radialAccel = psys.radialAccel + psys.radialAccelVar * (Math.random() - 0.5) * 2; // tangential accel

    particle.tangentialAccel = psys.tangentialAccel + psys.tangentialAccelVar * (Math.random() - 0.5) * 2; // rotation is dir

    if (psys.rotationIsDir) {
      particle.rotation = -misc.radiansToDegrees(Math.atan2(particle.dir.y, particle.dir.x));
    }
  } // Mode Radius: B
  else {
      // Set the default diameter of the particle from the source position
      var startRadius = psys.startRadius + psys.startRadiusVar * (Math.random() - 0.5) * 2;
      var endRadius = psys.endRadius + psys.endRadiusVar * (Math.random() - 0.5) * 2;
      particle.radius = startRadius;
      particle.deltaRadius = psys.endRadius === cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS ? 0 : (endRadius - startRadius) / timeToLive;
      particle.angle = a;
      particle.degreesPerSecond = misc.degreesToRadians(psys.rotatePerS + psys.rotatePerSVar * (Math.random() - 0.5) * 2);
    }
}; // In the Free mode to get emit real rotation in the world coordinate.


function getWorldRotation(node) {
  var rotation = 0;
  var tempNode = node;

  while (tempNode) {
    rotation += tempNode.angle;
    tempNode = tempNode.parent;
  }

  return rotation;
}

Simulator.prototype.updateUVs = function (force) {
  var assembler = this.sys._assembler;

  if (!assembler) {
    return;
  }

  var buffer = assembler.getBuffer();

  if (buffer && this.sys._renderSpriteFrame) {
    var FLOAT_PER_PARTICLE = 4 * assembler._vfmt._bytes / 4;
    var vbuf = buffer._vData;
    var uv = this.sys._renderSpriteFrame.uv;
    var start = force ? 0 : this._uvFilled;
    var particleCount = this.particles.length;

    for (var i = start; i < particleCount; i++) {
      var offset = i * FLOAT_PER_PARTICLE;
      vbuf[offset + 2] = uv[0];
      vbuf[offset + 3] = uv[1];
      vbuf[offset + 7] = uv[2];
      vbuf[offset + 8] = uv[3];
      vbuf[offset + 12] = uv[4];
      vbuf[offset + 13] = uv[5];
      vbuf[offset + 17] = uv[6];
      vbuf[offset + 18] = uv[7];
    }

    this._uvFilled = particleCount;
  }
};

Simulator.prototype.updateParticleBuffer = function (particle, pos, buffer, offset) {
  var vbuf = buffer._vData;
  var uintbuf = buffer._uintVData;
  var x = pos.x,
      y = pos.y;
  var width = particle.size;
  var height = width;
  var aspectRatio = particle.aspectRatio;
  aspectRatio > 1 ? height = width / aspectRatio : width = height * aspectRatio;
  var halfWidth = width / 2;
  var halfHeight = height / 2; // pos

  if (particle.rotation) {
    var x1 = -halfWidth,
        y1 = -halfHeight;
    var x2 = halfWidth,
        y2 = halfHeight;
    var rad = -misc.degreesToRadians(particle.rotation);
    var cr = Math.cos(rad),
        sr = Math.sin(rad); // bl

    vbuf[offset] = x1 * cr - y1 * sr + x;
    vbuf[offset + 1] = x1 * sr + y1 * cr + y; // br

    vbuf[offset + 5] = x2 * cr - y1 * sr + x;
    vbuf[offset + 6] = x2 * sr + y1 * cr + y; // tl

    vbuf[offset + 10] = x1 * cr - y2 * sr + x;
    vbuf[offset + 11] = x1 * sr + y2 * cr + y; // tr

    vbuf[offset + 15] = x2 * cr - y2 * sr + x;
    vbuf[offset + 16] = x2 * sr + y2 * cr + y;
  } else {
    // bl
    vbuf[offset] = x - halfWidth;
    vbuf[offset + 1] = y - halfHeight; // br

    vbuf[offset + 5] = x + halfWidth;
    vbuf[offset + 6] = y - halfHeight; // tl

    vbuf[offset + 10] = x - halfWidth;
    vbuf[offset + 11] = y + halfHeight; // tr

    vbuf[offset + 15] = x + halfWidth;
    vbuf[offset + 16] = y + halfHeight;
  } // color


  uintbuf[offset + 4] = particle.color._val;
  uintbuf[offset + 9] = particle.color._val;
  uintbuf[offset + 14] = particle.color._val;
  uintbuf[offset + 19] = particle.color._val;
};

Simulator.prototype.step = function (dt) {
  dt = dt > cc.director._maxParticleDeltaTime ? cc.director._maxParticleDeltaTime : dt;
  var psys = this.sys;
  var node = psys.node;
  var particles = this.particles;
  var FLOAT_PER_PARTICLE = 4 * this.sys._assembler._vfmt._bytes / 4; // Calculate pos

  node._updateWorldMatrix();

  _trans = AffineTrans.identity();

  if (psys.positionType === cc.ParticleSystem.PositionType.FREE) {
    var m = node._worldMatrix.m;
    _trans.tx = m[12];
    _trans.ty = m[13];
    AffineTrans.transformVec2(_pos, ZERO_VEC2, _trans);
  } else if (psys.positionType === cc.ParticleSystem.PositionType.RELATIVE) {
    var angle = misc.degreesToRadians(-node.angle);
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    _trans = AffineTrans.create(cos, -sin, sin, cos, 0, 0);
    _pos.x = node.x;
    _pos.y = node.y;
  } // Get world to node trans only once


  AffineTrans.invert(_trans, _trans);
  var worldToNodeTrans = _trans; // Emission

  if (this.active && psys.emissionRate) {
    var rate = 1.0 / psys.emissionRate; //issue #1201, prevent bursts of particles, due to too high emitCounter

    if (particles.length < psys.totalParticles) this.emitCounter += dt;

    while (particles.length < psys.totalParticles && this.emitCounter > rate) {
      this.emitParticle(_pos);
      this.emitCounter -= rate;
    }

    this.elapsed += dt;

    if (psys.duration !== -1 && psys.duration < this.elapsed) {
      psys.stopSystem();
    }
  } // Request buffer for particles


  var buffer = psys._assembler.getBuffer();

  var particleCount = particles.length;
  buffer.reset();
  buffer.request(particleCount * 4, particleCount * 6); // Fill up uvs

  if (particleCount > this._uvFilled) {
    this.updateUVs();
  } // Used to reduce memory allocation / creation within the loop


  var particleIdx = 0;

  while (particleIdx < particles.length) {
    // Reset temporary vectors
    _tpa.x = _tpa.y = _tpb.x = _tpb.y = _tpc.x = _tpc.y = 0;
    var particle = particles[particleIdx]; // life

    particle.timeToLive -= dt;

    if (particle.timeToLive > 0) {
      // Mode A: gravity, direction, tangential accel & radial accel
      if (psys.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY) {
        var tmp = _tpc,
            radial = _tpa,
            tangential = _tpb; // radial acceleration

        if (particle.pos.x || particle.pos.y) {
          radial.set(particle.pos);
          radial.normalizeSelf();
        }

        tangential.set(radial);
        radial.mulSelf(particle.radialAccel); // tangential acceleration

        var newy = tangential.x;
        tangential.x = -tangential.y;
        tangential.y = newy;
        tangential.mulSelf(particle.tangentialAccel);
        tmp.set(radial);
        tmp.addSelf(tangential);
        tmp.addSelf(psys.gravity);
        tmp.mulSelf(dt);
        particle.dir.addSelf(tmp);
        tmp.set(particle.dir);
        tmp.mulSelf(dt);
        particle.pos.addSelf(tmp);
      } // Mode B: radius movement
      else {
          // Update the angle and radius of the particle.
          particle.angle += particle.degreesPerSecond * dt;
          particle.radius += particle.deltaRadius * dt;
          particle.pos.x = -Math.cos(particle.angle) * particle.radius;
          particle.pos.y = -Math.sin(particle.angle) * particle.radius;
        } // color


      particle.color.r += particle.deltaColor.r * dt;
      particle.color.g += particle.deltaColor.g * dt;
      particle.color.b += particle.deltaColor.b * dt;
      particle.color.a += particle.deltaColor.a * dt; // size

      particle.size += particle.deltaSize * dt;

      if (particle.size < 0) {
        particle.size = 0;
      } // angle


      particle.rotation += particle.deltaRotation * dt; // update values in quad buffer

      var newPos = _tpa;
      var diff = _tpb;

      if (psys.positionType === cc.ParticleSystem.PositionType.FREE) {
        diff.set(particle.startPos);
        diff.negSelf(); // Unify direction with other positionType

        newPos.set(particle.pos);
        newPos.subSelf(diff);
      } else if (psys.positionType === cc.ParticleSystem.PositionType.RELATIVE) {
        var startPos = _tpc; // current Position convert To Node Space

        AffineTrans.transformVec2(diff, _pos, worldToNodeTrans); // start Position convert To Node Space

        AffineTrans.transformVec2(startPos, particle.startPos, worldToNodeTrans);
        diff.subSelf(startPos);
        newPos.set(particle.pos);
        newPos.subSelf(diff);
      } else {
        newPos.set(particle.pos);
      }

      var offset = FLOAT_PER_PARTICLE * particleIdx;
      this.updateParticleBuffer(particle, newPos, buffer, offset); // update particle counter

      ++particleIdx;
    } else {
      // life < 0
      var deadParticle = particles[particleIdx];

      if (particleIdx !== particles.length - 1) {
        particles[particleIdx] = particles[particles.length - 1];
      }

      pool.put(deadParticle);
      particles.length--;
    }
  }

  if (particles.length > 0) {
    buffer.uploadData();
    psys._assembler._ia._count = particles.length * 6;
  } else if (!this.active && !this.readyToPlay) {
    this.finished = true;

    psys._finishedSimulation();
  }
};

module.exports = Simulator;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnRpY2xlLXNpbXVsYXRvci5qcyJdLCJuYW1lcyI6WyJBZmZpbmVUcmFucyIsInJlcXVpcmUiLCJqcyIsIm1pc2MiLCJaRVJPX1ZFQzIiLCJjYyIsInYyIiwiX3RyYW5zIiwiY3JlYXRlIiwiX3BvcyIsIl90cGEiLCJfdHBiIiwiX3RwYyIsIlBhcnRpY2xlIiwicG9zIiwic3RhcnRQb3MiLCJjb2xvciIsImRlbHRhQ29sb3IiLCJyIiwiZyIsImIiLCJhIiwic2l6ZSIsImRlbHRhU2l6ZSIsInJvdGF0aW9uIiwiZGVsdGFSb3RhdGlvbiIsInRpbWVUb0xpdmUiLCJkcmF3UG9zIiwiYXNwZWN0UmF0aW8iLCJkaXIiLCJyYWRpYWxBY2NlbCIsInRhbmdlbnRpYWxBY2NlbCIsImFuZ2xlIiwiZGVncmVlc1BlclNlY29uZCIsInJhZGl1cyIsImRlbHRhUmFkaXVzIiwicG9vbCIsIlBvb2wiLCJwYXIiLCJzZXQiLCJfdmFsIiwiZ2V0IiwiX2dldCIsIlNpbXVsYXRvciIsInN5c3RlbSIsInN5cyIsInBhcnRpY2xlcyIsImFjdGl2ZSIsInJlYWR5VG9QbGF5IiwiZmluaXNoZWQiLCJlbGFwc2VkIiwiZW1pdENvdW50ZXIiLCJfdXZGaWxsZWQiLCJwcm90b3R5cGUiLCJzdG9wIiwiZHVyYXRpb24iLCJyZXNldCIsImlkIiwibGVuZ3RoIiwicHV0IiwiZW1pdFBhcnRpY2xlIiwicHN5cyIsImNsYW1wZiIsInBhcnRpY2xlIiwicHVzaCIsImxpZmUiLCJsaWZlVmFyIiwiTWF0aCIsInJhbmRvbSIsIm1heCIsIngiLCJzb3VyY2VQb3MiLCJwb3NWYXIiLCJ5Iiwic3IiLCJzZyIsInNiIiwic2EiLCJzdGFydENvbG9yIiwiX3N0YXJ0Q29sb3IiLCJzdGFydENvbG9yVmFyIiwiX3N0YXJ0Q29sb3JWYXIiLCJlbmRDb2xvciIsIl9lbmRDb2xvciIsImVuZENvbG9yVmFyIiwiX2VuZENvbG9yVmFyIiwic3RhcnRTIiwic3RhcnRTaXplIiwic3RhcnRTaXplVmFyIiwiZW5kU2l6ZSIsIlBhcnRpY2xlU3lzdGVtIiwiU1RBUlRfU0laRV9FUVVBTF9UT19FTkRfU0laRSIsImVuZFMiLCJlbmRTaXplVmFyIiwic3RhcnRBIiwic3RhcnRTcGluIiwic3RhcnRTcGluVmFyIiwiZW5kQSIsImVuZFNwaW4iLCJlbmRTcGluVmFyIiwiX2FzcGVjdFJhdGlvIiwid29ybGRSb3RhdGlvbiIsImdldFdvcmxkUm90YXRpb24iLCJub2RlIiwicmVsQW5nbGUiLCJwb3NpdGlvblR5cGUiLCJQb3NpdGlvblR5cGUiLCJGUkVFIiwiZGVncmVlc1RvUmFkaWFucyIsImFuZ2xlVmFyIiwiZW1pdHRlck1vZGUiLCJFbWl0dGVyTW9kZSIsIkdSQVZJVFkiLCJzIiwic3BlZWQiLCJzcGVlZFZhciIsImNvcyIsInNpbiIsIm11bFNlbGYiLCJyYWRpYWxBY2NlbFZhciIsInRhbmdlbnRpYWxBY2NlbFZhciIsInJvdGF0aW9uSXNEaXIiLCJyYWRpYW5zVG9EZWdyZWVzIiwiYXRhbjIiLCJzdGFydFJhZGl1cyIsInN0YXJ0UmFkaXVzVmFyIiwiZW5kUmFkaXVzIiwiZW5kUmFkaXVzVmFyIiwiU1RBUlRfUkFESVVTX0VRVUFMX1RPX0VORF9SQURJVVMiLCJyb3RhdGVQZXJTIiwicm90YXRlUGVyU1ZhciIsInRlbXBOb2RlIiwicGFyZW50IiwidXBkYXRlVVZzIiwiZm9yY2UiLCJhc3NlbWJsZXIiLCJfYXNzZW1ibGVyIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiX3JlbmRlclNwcml0ZUZyYW1lIiwiRkxPQVRfUEVSX1BBUlRJQ0xFIiwiX3ZmbXQiLCJfYnl0ZXMiLCJ2YnVmIiwiX3ZEYXRhIiwidXYiLCJzdGFydCIsInBhcnRpY2xlQ291bnQiLCJpIiwib2Zmc2V0IiwidXBkYXRlUGFydGljbGVCdWZmZXIiLCJ1aW50YnVmIiwiX3VpbnRWRGF0YSIsIndpZHRoIiwiaGVpZ2h0IiwiaGFsZldpZHRoIiwiaGFsZkhlaWdodCIsIngxIiwieTEiLCJ4MiIsInkyIiwicmFkIiwiY3IiLCJzdGVwIiwiZHQiLCJkaXJlY3RvciIsIl9tYXhQYXJ0aWNsZURlbHRhVGltZSIsIl91cGRhdGVXb3JsZE1hdHJpeCIsImlkZW50aXR5IiwibSIsIl93b3JsZE1hdHJpeCIsInR4IiwidHkiLCJ0cmFuc2Zvcm1WZWMyIiwiUkVMQVRJVkUiLCJpbnZlcnQiLCJ3b3JsZFRvTm9kZVRyYW5zIiwiZW1pc3Npb25SYXRlIiwicmF0ZSIsInRvdGFsUGFydGljbGVzIiwic3RvcFN5c3RlbSIsInJlcXVlc3QiLCJwYXJ0aWNsZUlkeCIsInRtcCIsInJhZGlhbCIsInRhbmdlbnRpYWwiLCJub3JtYWxpemVTZWxmIiwibmV3eSIsImFkZFNlbGYiLCJncmF2aXR5IiwibmV3UG9zIiwiZGlmZiIsIm5lZ1NlbGYiLCJzdWJTZWxmIiwiZGVhZFBhcnRpY2xlIiwidXBsb2FkRGF0YSIsIl9pYSIsIl9jb3VudCIsIl9maW5pc2hlZFNpbXVsYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyxnQ0FBRCxDQUEzQjs7QUFDQSxJQUFNQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxxQkFBRCxDQUFsQjs7QUFDQSxJQUFNRSxJQUFJLEdBQUdGLE9BQU8sQ0FBQyxvQkFBRCxDQUFwQjs7QUFFQSxJQUFNRyxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFULENBQWxCOztBQUVBLElBQUlDLE1BQU0sR0FBR1AsV0FBVyxDQUFDUSxNQUFaLEVBQWI7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHSixFQUFFLENBQUNDLEVBQUgsRUFBWDs7QUFDQSxJQUFJSSxJQUFJLEdBQUdMLEVBQUUsQ0FBQ0MsRUFBSCxFQUFYOztBQUNBLElBQUlLLElBQUksR0FBR04sRUFBRSxDQUFDQyxFQUFILEVBQVg7O0FBQ0EsSUFBSU0sSUFBSSxHQUFHUCxFQUFFLENBQUNDLEVBQUgsRUFBWDs7QUFFQSxJQUFJTyxR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WSxZQUFZLEdBQUdwSixTQUFTLENBQUN3SSxXQUFELENBQTVCOztBQUNBLFVBQUlBLFdBQVcsS0FBS3hJLFNBQVMsQ0FBQ1ksTUFBVixHQUFtQixDQUF2QyxFQUEwQztBQUN0Q1osUUFBQUEsU0FBUyxDQUFDd0ksV0FBRCxDQUFULEdBQXlCeEksU0FBUyxDQUFDQSxTQUFTLENBQUNZLE1BQVYsR0FBbUIsQ0FBcEIsQ0FBbEM7QUFDSDs7QUFDRHRCLE1BQUFBLElBQUksQ0FBQ3VCLEdBQUwsQ0FBU3VJLFlBQVQ7QUFDQXBKLE1BQUFBLFNBQVMsQ0FBQ1ksTUFBVjtBQUNIO0FBQ0o7O0FBRUQsTUFBSVosU0FBUyxDQUFDWSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3RCK0UsSUFBQUEsTUFBTSxDQUFDMEQsVUFBUDtBQUNBdEksSUFBQUEsSUFBSSxDQUFDMkUsVUFBTCxDQUFnQjRELEdBQWhCLENBQW9CQyxNQUFwQixHQUE2QnZKLFNBQVMsQ0FBQ1ksTUFBVixHQUFtQixDQUFoRDtBQUNILEdBSEQsTUFJSyxJQUFJLENBQUMsS0FBS1gsTUFBTixJQUFnQixDQUFDLEtBQUtDLFdBQTFCLEVBQXVDO0FBQ3hDLFNBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7O0FBQ0FZLElBQUFBLElBQUksQ0FBQ3lJLG1CQUFMO0FBQ0g7QUFDSixDQXhLRDs7QUEwS0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjdKLFNBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBBZmZpbmVUcmFucyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMvYWZmaW5lLXRyYW5zZm9ybScpO1xuY29uc3QganMgPSByZXF1aXJlKCcuLi9jb3JlL3BsYXRmb3JtL2pzJyk7XG5jb25zdCBtaXNjID0gcmVxdWlyZSgnLi4vY29yZS91dGlscy9taXNjJyk7XG5cbmNvbnN0IFpFUk9fVkVDMiA9IGNjLnYyKDAsIDApO1xuXG5sZXQgX3RyYW5zID0gQWZmaW5lVHJhbnMuY3JlYXRlKCk7XG5sZXQgX3BvcyA9IGNjLnYyKCk7XG5sZXQgX3RwYSA9IGNjLnYyKCk7XG5sZXQgX3RwYiA9IGNjLnYyKCk7XG5sZXQgX3RwYyA9IGNjLnYyKCk7XG5cbmxldCBQYXJ0aWNsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBvcyA9IGNjLnYyKDAsIDApO1xuICAgIHRoaXMuc3RhcnRQb3MgPSBjYy52MigwLCAwKTtcbiAgICB0aGlzLmNvbG9yID0gY2MuY29sb3IoMCwgMCwgMCwgMjU1KTtcbiAgICB0aGlzLmRlbHRhQ29sb3IgPSB7cjogMCwgZzogMCwgYjogMCwgYTogMjU1fTtcbiAgICB0aGlzLnNpemUgPSAwO1xuICAgIHRoaXMuZGVsdGFTaXplID0gMDtcbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcbiAgICB0aGlzLmRlbHRhUm90YXRpb24gPSAwO1xuICAgIHRoaXMudGltZVRvTGl2ZSA9IDA7XG4gICAgdGhpcy5kcmF3UG9zID0gY2MudjIoMCwgMCk7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XG4gICAgLy8gTW9kZSBBXG4gICAgdGhpcy5kaXIgPSBjYy52MigwLCAwKTtcbiAgICB0aGlzLnJhZGlhbEFjY2VsID0gMDtcbiAgICB0aGlzLnRhbmdlbnRpYWxBY2NlbCA9IDA7XG4gICAgLy8gTW9kZSBCXG4gICAgdGhpcy5hbmdsZSA9IDA7XG4gICAgdGhpcy5kZWdyZWVzUGVyU2Vjb25kID0gMDtcbiAgICB0aGlzLnJhZGl1cyA9IDA7XG4gICAgdGhpcy5kZWx0YVJhZGl1cyA9IDA7XG59XG5cbmxldCBwb29sID0gbmV3IGpzLlBvb2woZnVuY3Rpb24gKHBhcikge1xuICAgIHBhci5wb3Muc2V0KFpFUk9fVkVDMik7XG4gICAgcGFyLnN0YXJ0UG9zLnNldChaRVJPX1ZFQzIpO1xuICAgIHBhci5jb2xvci5fdmFsID0gMHhGRjAwMDAwMDtcbiAgICBwYXIuZGVsdGFDb2xvci5yID0gcGFyLmRlbHRhQ29sb3IuZyA9IHBhci5kZWx0YUNvbG9yLmIgPSAwO1xuICAgIHBhci5kZWx0YUNvbG9yLmEgPSAyNTU7XG4gICAgcGFyLnNpemUgPSAwO1xuICAgIHBhci5kZWx0YVNpemUgPSAwO1xuICAgIHBhci5yb3RhdGlvbiA9IDA7XG4gICAgcGFyLmRlbHRhUm90YXRpb24gPSAwO1xuICAgIHBhci50aW1lVG9MaXZlID0gMDtcbiAgICBwYXIuZHJhd1Bvcy5zZXQoWkVST19WRUMyKTtcbiAgICBwYXIuYXNwZWN0UmF0aW8gPSAxO1xuICAgIC8vIE1vZGUgQVxuICAgIHBhci5kaXIuc2V0KFpFUk9fVkVDMik7XG4gICAgcGFyLnJhZGlhbEFjY2VsID0gMDtcbiAgICBwYXIudGFuZ2VudGlhbEFjY2VsID0gMDtcbiAgICAvLyBNb2RlIEJcbiAgICBwYXIuYW5nbGUgPSAwO1xuICAgIHBhci5kZWdyZWVzUGVyU2Vjb25kID0gMDtcbiAgICBwYXIucmFkaXVzID0gMDtcbiAgICBwYXIuZGVsdGFSYWRpdXMgPSAwO1xufSwgMTAyNCk7XG5wb29sLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0KCkgfHwgbmV3IFBhcnRpY2xlKCk7XG59XG5cbmxldCBTaW11bGF0b3IgPSBmdW5jdGlvbiAoc3lzdGVtKSB7XG4gICAgdGhpcy5zeXMgPSBzeXN0ZW07XG4gICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMucmVhZHlUb1BsYXkgPSB0cnVlO1xuICAgIHRoaXMuZmluaXNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLmVsYXBzZWQgPSAwO1xuICAgIHRoaXMuZW1pdENvdW50ZXIgPSAwO1xuICAgIHRoaXMuX3V2RmlsbGVkID0gMDtcbn1cblxuU2ltdWxhdG9yLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5yZWFkeVRvUGxheSA9IGZhbHNlO1xuICAgIHRoaXMuZWxhcHNlZCA9IHRoaXMuc3lzLmR1cmF0aW9uO1xuICAgIHRoaXMuZW1pdENvdW50ZXIgPSAwO1xufVxuXG5TaW11bGF0b3IucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnJlYWR5VG9QbGF5ID0gdHJ1ZTtcbiAgICB0aGlzLmVsYXBzZWQgPSAwO1xuICAgIHRoaXMuZW1pdENvdW50ZXIgPSAwO1xuICAgIHRoaXMuZmluaXNoZWQgPSBmYWxzZTtcbiAgICBsZXQgcGFydGljbGVzID0gdGhpcy5wYXJ0aWNsZXM7XG4gICAgZm9yIChsZXQgaWQgPSAwOyBpZCA8IHBhcnRpY2xlcy5sZW5ndGg7ICsraWQpXG4gICAgICAgIHBvb2wucHV0KHBhcnRpY2xlc1tpZF0pO1xuICAgIHBhcnRpY2xlcy5sZW5ndGggPSAwO1xufVxuXG5TaW11bGF0b3IucHJvdG90eXBlLmVtaXRQYXJ0aWNsZSA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICBsZXQgcHN5cyA9IHRoaXMuc3lzO1xuICAgIGxldCBjbGFtcGYgPSBtaXNjLmNsYW1wZjtcbiAgICBsZXQgcGFydGljbGUgPSBwb29sLmdldCgpO1xuICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuXG4gICAgLy8gSW5pdCBwYXJ0aWNsZVxuICAgIC8vIHRpbWVUb0xpdmVcbiAgICAvLyBubyBuZWdhdGl2ZSBsaWZlLiBwcmV2ZW50IGRpdmlzaW9uIGJ5IDBcbiAgICBwYXJ0aWNsZS50aW1lVG9MaXZlID0gcHN5cy5saWZlICsgcHN5cy5saWZlVmFyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjtcbiAgICBsZXQgdGltZVRvTGl2ZSA9IHBhcnRpY2xlLnRpbWVUb0xpdmUgPSBNYXRoLm1heCgwLCBwYXJ0aWNsZS50aW1lVG9MaXZlKTtcblxuICAgIC8vIHBvc2l0aW9uXG4gICAgcGFydGljbGUucG9zLnggPSBwc3lzLnNvdXJjZVBvcy54ICsgcHN5cy5wb3NWYXIueCAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDI7XG4gICAgcGFydGljbGUucG9zLnkgPSBwc3lzLnNvdXJjZVBvcy55ICsgcHN5cy5wb3NWYXIueSAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDI7XG5cbiAgICAvLyBDb2xvclxuICAgIGxldCBzciwgc2csIHNiLCBzYTtcbiAgICBsZXQgc3RhcnRDb2xvciA9IHBzeXMuX3N0YXJ0Q29sb3IsIHN0YXJ0Q29sb3JWYXIgPSBwc3lzLl9zdGFydENvbG9yVmFyO1xuICAgIGxldCBlbmRDb2xvciA9IHBzeXMuX2VuZENvbG9yLCBlbmRDb2xvclZhciA9IHBzeXMuX2VuZENvbG9yVmFyO1xuICAgIHBhcnRpY2xlLmNvbG9yLnIgPSBzciA9IGNsYW1wZihzdGFydENvbG9yLnIgKyBzdGFydENvbG9yVmFyLnIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLCAwLCAyNTUpO1xuICAgIHBhcnRpY2xlLmNvbG9yLmcgPSBzZyA9IGNsYW1wZihzdGFydENvbG9yLmcgKyBzdGFydENvbG9yVmFyLmcgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLCAwLCAyNTUpO1xuICAgIHBhcnRpY2xlLmNvbG9yLmIgPSBzYiA9IGNsYW1wZihzdGFydENvbG9yLmIgKyBzdGFydENvbG9yVmFyLmIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLCAwLCAyNTUpO1xuICAgIHBhcnRpY2xlLmNvbG9yLmEgPSBzYSA9IGNsYW1wZihzdGFydENvbG9yLmEgKyBzdGFydENvbG9yVmFyLmEgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLCAwLCAyNTUpO1xuICAgIHBhcnRpY2xlLmRlbHRhQ29sb3IuciA9IChjbGFtcGYoZW5kQ29sb3IuciArIGVuZENvbG9yVmFyLnIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLCAwLCAyNTUpIC0gc3IpIC8gdGltZVRvTGl2ZTtcbiAgICBwYXJ0aWNsZS5kZWx0YUNvbG9yLmcgPSAoY2xhbXBmKGVuZENvbG9yLmcgKyBlbmRDb2xvclZhci5nICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMiwgMCwgMjU1KSAtIHNnKSAvIHRpbWVUb0xpdmU7XG4gICAgcGFydGljbGUuZGVsdGFDb2xvci5iID0gKGNsYW1wZihlbmRDb2xvci5iICsgZW5kQ29sb3JWYXIuYiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIsIDAsIDI1NSkgLSBzYikgLyB0aW1lVG9MaXZlO1xuICAgIHBhcnRpY2xlLmRlbHRhQ29sb3IuYSA9IChjbGFtcGYoZW5kQ29sb3IuYSArIGVuZENvbG9yVmFyLmEgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLCAwLCAyNTUpIC0gc2EpIC8gdGltZVRvTGl2ZTtcblxuICAgIC8vIHNpemVcbiAgICBsZXQgc3RhcnRTID0gcHN5cy5zdGFydFNpemUgKyBwc3lzLnN0YXJ0U2l6ZVZhciAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDI7XG4gICAgc3RhcnRTID0gTWF0aC5tYXgoMCwgc3RhcnRTKTsgLy8gTm8gbmVnYXRpdmUgdmFsdWVcbiAgICBwYXJ0aWNsZS5zaXplID0gc3RhcnRTO1xuICAgIGlmIChwc3lzLmVuZFNpemUgPT09IGNjLlBhcnRpY2xlU3lzdGVtLlNUQVJUX1NJWkVfRVFVQUxfVE9fRU5EX1NJWkUpIHtcbiAgICAgICAgcGFydGljbGUuZGVsdGFTaXplID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZW5kUyA9IHBzeXMuZW5kU2l6ZSArIHBzeXMuZW5kU2l6ZVZhciAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDI7XG4gICAgICAgIGVuZFMgPSBNYXRoLm1heCgwLCBlbmRTKTsgLy8gTm8gbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgIHBhcnRpY2xlLmRlbHRhU2l6ZSA9IChlbmRTIC0gc3RhcnRTKSAvIHRpbWVUb0xpdmU7XG4gICAgfVxuXG4gICAgLy8gcm90YXRpb25cbiAgICB2YXIgc3RhcnRBID0gcHN5cy5zdGFydFNwaW4gKyBwc3lzLnN0YXJ0U3BpblZhciAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDI7XG4gICAgdmFyIGVuZEEgPSBwc3lzLmVuZFNwaW4gKyBwc3lzLmVuZFNwaW5WYXIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyO1xuICAgIHBhcnRpY2xlLnJvdGF0aW9uID0gc3RhcnRBO1xuICAgIHBhcnRpY2xlLmRlbHRhUm90YXRpb24gPSAoZW5kQSAtIHN0YXJ0QSkgLyB0aW1lVG9MaXZlO1xuXG4gICAgLy8gcG9zaXRpb25cbiAgICBwYXJ0aWNsZS5zdGFydFBvcy54ID0gcG9zLng7XG4gICAgcGFydGljbGUuc3RhcnRQb3MueSA9IHBvcy55O1xuXG4gICAgLy8gYXNwZWN0IHJhdGlvXG4gICAgcGFydGljbGUuYXNwZWN0UmF0aW8gPSBwc3lzLl9hc3BlY3RSYXRpbyB8fCAxO1xuXG4gICAgLy8gZGlyZWN0aW9uXG4gICAgbGV0IHdvcmxkUm90YXRpb24gPSBnZXRXb3JsZFJvdGF0aW9uKHBzeXMubm9kZSk7XG4gICAgbGV0IHJlbEFuZ2xlID0gcHN5cy5wb3NpdGlvblR5cGUgPT09IGNjLlBhcnRpY2xlU3lzdGVtLlBvc2l0aW9uVHlwZS5GUkVFID8gcHN5cy5hbmdsZSArIHdvcmxkUm90YXRpb24gOiBwc3lzLmFuZ2xlO1xuICAgIGxldCBhID0gbWlzYy5kZWdyZWVzVG9SYWRpYW5zKHJlbEFuZ2xlICsgcHN5cy5hbmdsZVZhciAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIpO1xuICAgIC8vIE1vZGUgR3Jhdml0eTogQVxuICAgIGlmIChwc3lzLmVtaXR0ZXJNb2RlID09PSBjYy5QYXJ0aWNsZVN5c3RlbS5FbWl0dGVyTW9kZS5HUkFWSVRZKSB7XG4gICAgICAgIGxldCBzID0gcHN5cy5zcGVlZCArIHBzeXMuc3BlZWRWYXIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyO1xuICAgICAgICAvLyBkaXJlY3Rpb25cbiAgICAgICAgcGFydGljbGUuZGlyLnggPSBNYXRoLmNvcyhhKTtcbiAgICAgICAgcGFydGljbGUuZGlyLnkgPSBNYXRoLnNpbihhKTtcbiAgICAgICAgcGFydGljbGUuZGlyLm11bFNlbGYocyk7XG4gICAgICAgIC8vIHJhZGlhbCBhY2NlbFxuICAgICAgICBwYXJ0aWNsZS5yYWRpYWxBY2NlbCA9IHBzeXMucmFkaWFsQWNjZWwgKyBwc3lzLnJhZGlhbEFjY2VsVmFyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjtcbiAgICAgICAgLy8gdGFuZ2VudGlhbCBhY2NlbFxuICAgICAgICBwYXJ0aWNsZS50YW5nZW50aWFsQWNjZWwgPSBwc3lzLnRhbmdlbnRpYWxBY2NlbCArIHBzeXMudGFuZ2VudGlhbEFjY2VsVmFyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjtcbiAgICAgICAgLy8gcm90YXRpb24gaXMgZGlyXG4gICAgICAgIGlmIChwc3lzLnJvdGF0aW9uSXNEaXIpIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnJvdGF0aW9uID0gLW1pc2MucmFkaWFuc1RvRGVncmVlcyhNYXRoLmF0YW4yKHBhcnRpY2xlLmRpci55LCBwYXJ0aWNsZS5kaXIueCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vZGUgUmFkaXVzOiBCXG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCBkaWFtZXRlciBvZiB0aGUgcGFydGljbGUgZnJvbSB0aGUgc291cmNlIHBvc2l0aW9uXG4gICAgICAgIHZhciBzdGFydFJhZGl1cyA9IHBzeXMuc3RhcnRSYWRpdXMgKyBwc3lzLnN0YXJ0UmFkaXVzVmFyICogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjtcbiAgICAgICAgdmFyIGVuZFJhZGl1cyA9IHBzeXMuZW5kUmFkaXVzICsgcHN5cy5lbmRSYWRpdXNWYXIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyO1xuICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgPSBzdGFydFJhZGl1cztcbiAgICAgICAgcGFydGljbGUuZGVsdGFSYWRpdXMgPSAocHN5cy5lbmRSYWRpdXMgPT09IGNjLlBhcnRpY2xlU3lzdGVtLlNUQVJUX1JBRElVU19FUVVBTF9UT19FTkRfUkFESVVTKSA/IDAgOiAoZW5kUmFkaXVzIC0gc3RhcnRSYWRpdXMpIC8gdGltZVRvTGl2ZTtcbiAgICAgICAgcGFydGljbGUuYW5nbGUgPSBhO1xuICAgICAgICBwYXJ0aWNsZS5kZWdyZWVzUGVyU2Vjb25kID0gbWlzYy5kZWdyZWVzVG9SYWRpYW5zKHBzeXMucm90YXRlUGVyUyArIHBzeXMucm90YXRlUGVyU1ZhciAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIpO1xuICAgIH1cbn07XG4vLyBJbiB0aGUgRnJlZSBtb2RlIHRvIGdldCBlbWl0IHJlYWwgcm90YXRpb24gaW4gdGhlIHdvcmxkIGNvb3JkaW5hdGUuXG5mdW5jdGlvbiBnZXRXb3JsZFJvdGF0aW9uIChub2RlKSB7XG4gICAgbGV0IHJvdGF0aW9uID0gMDtcbiAgICBsZXQgdGVtcE5vZGUgPSBub2RlO1xuICAgIHdoaWxlICh0ZW1wTm9kZSkge1xuICAgICAgICByb3RhdGlvbiArPSB0ZW1wTm9kZS5hbmdsZTtcbiAgICAgICAgdGVtcE5vZGUgPSB0ZW1wTm9kZS5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiByb3RhdGlvbjtcbn1cblxuU2ltdWxhdG9yLnByb3RvdHlwZS51cGRhdGVVVnMgPSBmdW5jdGlvbiAoZm9yY2UpIHtcbiAgICBsZXQgYXNzZW1ibGVyID0gdGhpcy5zeXMuX2Fzc2VtYmxlcjtcbiAgICBpZiAoIWFzc2VtYmxlcikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBidWZmZXIgPSBhc3NlbWJsZXIuZ2V0QnVmZmVyKCk7XG4gICAgaWYgKGJ1ZmZlciAmJiB0aGlzLnN5cy5fcmVuZGVyU3ByaXRlRnJhbWUpIHtcbiAgICAgICAgY29uc3QgRkxPQVRfUEVSX1BBUlRJQ0xFID0gNCAqIGFzc2VtYmxlci5fdmZtdC5fYnl0ZXMgLyA0O1xuICAgICAgICBsZXQgdmJ1ZiA9IGJ1ZmZlci5fdkRhdGE7XG4gICAgICAgIGxldCB1diA9IHRoaXMuc3lzLl9yZW5kZXJTcHJpdGVGcmFtZS51djtcblxuICAgICAgICBsZXQgc3RhcnQgPSBmb3JjZSA/IDAgOiB0aGlzLl91dkZpbGxlZDtcbiAgICAgICAgbGV0IHBhcnRpY2xlQ291bnQgPSB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IGkgKiBGTE9BVF9QRVJfUEFSVElDTEU7XG4gICAgICAgICAgICB2YnVmW29mZnNldCsyXSA9IHV2WzBdO1xuICAgICAgICAgICAgdmJ1ZltvZmZzZXQrM10gPSB1dlsxXTtcbiAgICAgICAgICAgIHZidWZbb2Zmc2V0KzddID0gdXZbMl07XG4gICAgICAgICAgICB2YnVmW29mZnNldCs4XSA9IHV2WzNdO1xuICAgICAgICAgICAgdmJ1ZltvZmZzZXQrMTJdID0gdXZbNF07XG4gICAgICAgICAgICB2YnVmW29mZnNldCsxM10gPSB1dls1XTtcbiAgICAgICAgICAgIHZidWZbb2Zmc2V0KzE3XSA9IHV2WzZdO1xuICAgICAgICAgICAgdmJ1ZltvZmZzZXQrMThdID0gdXZbN107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXZGaWxsZWQgPSBwYXJ0aWNsZUNvdW50O1xuICAgIH1cbn1cblxuU2ltdWxhdG9yLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZUJ1ZmZlciA9IGZ1bmN0aW9uIChwYXJ0aWNsZSwgcG9zLCBidWZmZXIsIG9mZnNldCkge1xuICAgIGxldCB2YnVmID0gYnVmZmVyLl92RGF0YTtcbiAgICBsZXQgdWludGJ1ZiA9IGJ1ZmZlci5fdWludFZEYXRhO1xuXG4gICAgbGV0IHggPSBwb3MueCwgeSA9IHBvcy55O1xuICAgIGxldCB3aWR0aCA9IHBhcnRpY2xlLnNpemU7XG4gICAgbGV0IGhlaWdodCA9IHdpZHRoO1xuICAgIGxldCBhc3BlY3RSYXRpbyA9IHBhcnRpY2xlLmFzcGVjdFJhdGlvO1xuICAgIGFzcGVjdFJhdGlvID4gMSA/IChoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvKSA6ICh3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvKTtcbiAgICBsZXQgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIGxldCBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICAvLyBwb3NcbiAgICBpZiAocGFydGljbGUucm90YXRpb24pIHtcbiAgICAgICAgbGV0IHgxID0gLWhhbGZXaWR0aCwgeTEgPSAtaGFsZkhlaWdodDtcbiAgICAgICAgbGV0IHgyID0gaGFsZldpZHRoLCB5MiA9IGhhbGZIZWlnaHQ7XG4gICAgICAgIGxldCByYWQgPSAtbWlzYy5kZWdyZWVzVG9SYWRpYW5zKHBhcnRpY2xlLnJvdGF0aW9uKTtcbiAgICAgICAgbGV0IGNyID0gTWF0aC5jb3MocmFkKSwgc3IgPSBNYXRoLnNpbihyYWQpO1xuICAgICAgICAvLyBibFxuICAgICAgICB2YnVmW29mZnNldF0gPSB4MSAqIGNyIC0geTEgKiBzciArIHg7XG4gICAgICAgIHZidWZbb2Zmc2V0KzFdID0geDEgKiBzciArIHkxICogY3IgKyB5O1xuICAgICAgICAvLyBiclxuICAgICAgICB2YnVmW29mZnNldCs1XSA9IHgyICogY3IgLSB5MSAqIHNyICsgeDtcbiAgICAgICAgdmJ1ZltvZmZzZXQrNl0gPSB4MiAqIHNyICsgeTEgKiBjciArIHk7XG4gICAgICAgIC8vIHRsXG4gICAgICAgIHZidWZbb2Zmc2V0KzEwXSA9IHgxICogY3IgLSB5MiAqIHNyICsgeDtcbiAgICAgICAgdmJ1ZltvZmZzZXQrMTFdID0geDEgKiBzciArIHkyICogY3IgKyB5O1xuICAgICAgICAvLyB0clxuICAgICAgICB2YnVmW29mZnNldCsxNV0gPSB4MiAqIGNyIC0geTIgKiBzciArIHg7XG4gICAgICAgIHZidWZbb2Zmc2V0KzE2XSA9IHgyICogc3IgKyB5MiAqIGNyICsgeTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGJsXG4gICAgICAgIHZidWZbb2Zmc2V0XSA9IHggLSBoYWxmV2lkdGg7XG4gICAgICAgIHZidWZbb2Zmc2V0KzFdID0geSAtIGhhbGZIZWlnaHQ7XG4gICAgICAgIC8vIGJyXG4gICAgICAgIHZidWZbb2Zmc2V0KzVdID0geCArIGhhbGZXaWR0aDtcbiAgICAgICAgdmJ1ZltvZmZzZXQrNl0gPSB5IC0gaGFsZkhlaWdodDtcbiAgICAgICAgLy8gdGxcbiAgICAgICAgdmJ1ZltvZmZzZXQrMTBdID0geCAtIGhhbGZXaWR0aDtcbiAgICAgICAgdmJ1ZltvZmZzZXQrMTFdID0geSArIGhhbGZIZWlnaHQ7XG4gICAgICAgIC8vIHRyXG4gICAgICAgIHZidWZbb2Zmc2V0KzE1XSA9IHggKyBoYWxmV2lkdGg7XG4gICAgICAgIHZidWZbb2Zmc2V0KzE2XSA9IHkgKyBoYWxmSGVpZ2h0O1xuICAgIH1cbiAgICAvLyBjb2xvclxuICAgIHVpbnRidWZbb2Zmc2V0KzRdID0gcGFydGljbGUuY29sb3IuX3ZhbDtcbiAgICB1aW50YnVmW29mZnNldCs5XSA9IHBhcnRpY2xlLmNvbG9yLl92YWw7XG4gICAgdWludGJ1ZltvZmZzZXQrMTRdID0gcGFydGljbGUuY29sb3IuX3ZhbDtcbiAgICB1aW50YnVmW29mZnNldCsxOV0gPSBwYXJ0aWNsZS5jb2xvci5fdmFsO1xufTtcblxuU2ltdWxhdG9yLnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24gKGR0KSB7XG4gICAgZHQgPSBkdCA+IGNjLmRpcmVjdG9yLl9tYXhQYXJ0aWNsZURlbHRhVGltZSA/IGNjLmRpcmVjdG9yLl9tYXhQYXJ0aWNsZURlbHRhVGltZSA6IGR0O1xuICAgIGxldCBwc3lzID0gdGhpcy5zeXM7XG4gICAgbGV0IG5vZGUgPSBwc3lzLm5vZGU7XG4gICAgbGV0IHBhcnRpY2xlcyA9IHRoaXMucGFydGljbGVzO1xuICAgIGNvbnN0IEZMT0FUX1BFUl9QQVJUSUNMRSA9IDQgKiB0aGlzLnN5cy5fYXNzZW1ibGVyLl92Zm10Ll9ieXRlcyAvIDQ7XG5cbiAgICAvLyBDYWxjdWxhdGUgcG9zXG4gICAgbm9kZS5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICBfdHJhbnMgPSBBZmZpbmVUcmFucy5pZGVudGl0eSgpO1xuICAgIGlmIChwc3lzLnBvc2l0aW9uVHlwZSA9PT0gY2MuUGFydGljbGVTeXN0ZW0uUG9zaXRpb25UeXBlLkZSRUUpIHtcbiAgICAgICAgbGV0IG0gPSAgbm9kZS5fd29ybGRNYXRyaXgubTtcbiAgICAgICAgX3RyYW5zLnR4ID0gbVsxMl07XG4gICAgICAgIF90cmFucy50eSA9IG1bMTNdO1xuICAgICAgICBBZmZpbmVUcmFucy50cmFuc2Zvcm1WZWMyKF9wb3MsIFpFUk9fVkVDMiwgX3RyYW5zKTtcbiAgICB9IGVsc2UgaWYgKHBzeXMucG9zaXRpb25UeXBlID09PSBjYy5QYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGUuUkVMQVRJVkUpIHtcbiAgICAgICAgbGV0IGFuZ2xlID0gbWlzYy5kZWdyZWVzVG9SYWRpYW5zKC1ub2RlLmFuZ2xlKTtcbiAgICAgICAgbGV0IGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgbGV0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgX3RyYW5zID0gQWZmaW5lVHJhbnMuY3JlYXRlKGNvcywgLXNpbiwgc2luLCBjb3MsIDAsIDApO1xuICAgICAgICBfcG9zLnggPSBub2RlLng7XG4gICAgICAgIF9wb3MueSA9IG5vZGUueTtcbiAgICB9XG5cbiAgICAvLyBHZXQgd29ybGQgdG8gbm9kZSB0cmFucyBvbmx5IG9uY2VcbiAgICBBZmZpbmVUcmFucy5pbnZlcnQoX3RyYW5zLCBfdHJhbnMpO1xuICAgIGxldCB3b3JsZFRvTm9kZVRyYW5zID0gX3RyYW5zO1xuXG4gICAgLy8gRW1pc3Npb25cbiAgICBpZiAodGhpcy5hY3RpdmUgJiYgcHN5cy5lbWlzc2lvblJhdGUpIHtcbiAgICAgICAgdmFyIHJhdGUgPSAxLjAgLyBwc3lzLmVtaXNzaW9uUmF0ZTtcbiAgICAgICAgLy9pc3N1ZSAjMTIwMSwgcHJldmVudCBidXJzdHMgb2YgcGFydGljbGVzLCBkdWUgdG8gdG9vIGhpZ2ggZW1pdENvdW50ZXJcbiAgICAgICAgaWYgKHBhcnRpY2xlcy5sZW5ndGggPCBwc3lzLnRvdGFsUGFydGljbGVzKVxuICAgICAgICAgICAgdGhpcy5lbWl0Q291bnRlciArPSBkdDtcblxuICAgICAgICB3aGlsZSAoKHBhcnRpY2xlcy5sZW5ndGggPCBwc3lzLnRvdGFsUGFydGljbGVzKSAmJiAodGhpcy5lbWl0Q291bnRlciA+IHJhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRQYXJ0aWNsZShfcG9zKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdENvdW50ZXIgLT0gcmF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxhcHNlZCArPSBkdDtcbiAgICAgICAgaWYgKHBzeXMuZHVyYXRpb24gIT09IC0xICYmIHBzeXMuZHVyYXRpb24gPCB0aGlzLmVsYXBzZWQpIHtcbiAgICAgICAgICAgIHBzeXMuc3RvcFN5c3RlbSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVxdWVzdCBidWZmZXIgZm9yIHBhcnRpY2xlc1xuICAgIGxldCBidWZmZXIgPSBwc3lzLl9hc3NlbWJsZXIuZ2V0QnVmZmVyKCk7XG4gICAgbGV0IHBhcnRpY2xlQ291bnQgPSBwYXJ0aWNsZXMubGVuZ3RoO1xuICAgIGJ1ZmZlci5yZXNldCgpO1xuICAgIGJ1ZmZlci5yZXF1ZXN0KHBhcnRpY2xlQ291bnQgKiA0LCBwYXJ0aWNsZUNvdW50ICogNik7XG5cbiAgICAvLyBGaWxsIHVwIHV2c1xuICAgIGlmIChwYXJ0aWNsZUNvdW50ID4gdGhpcy5fdXZGaWxsZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVVVnMoKTtcbiAgICB9XG5cbiAgICAvLyBVc2VkIHRvIHJlZHVjZSBtZW1vcnkgYWxsb2NhdGlvbiAvIGNyZWF0aW9uIHdpdGhpbiB0aGUgbG9vcFxuICAgIGxldCBwYXJ0aWNsZUlkeCA9IDA7XG4gICAgd2hpbGUgKHBhcnRpY2xlSWR4IDwgcGFydGljbGVzLmxlbmd0aCkge1xuICAgICAgICAvLyBSZXNldCB0ZW1wb3JhcnkgdmVjdG9yc1xuICAgICAgICBfdHBhLnggPSBfdHBhLnkgPSBfdHBiLnggPSBfdHBiLnkgPSBfdHBjLnggPSBfdHBjLnkgPSAwO1xuXG4gICAgICAgIGxldCBwYXJ0aWNsZSA9IHBhcnRpY2xlc1twYXJ0aWNsZUlkeF07XG5cbiAgICAgICAgLy8gbGlmZVxuICAgICAgICBwYXJ0aWNsZS50aW1lVG9MaXZlIC09IGR0O1xuICAgICAgICBpZiAocGFydGljbGUudGltZVRvTGl2ZSA+IDApIHtcbiAgICAgICAgICAgIC8vIE1vZGUgQTogZ3Jhdml0eSwgZGlyZWN0aW9uLCB0YW5nZW50aWFsIGFjY2VsICYgcmFkaWFsIGFjY2VsXG4gICAgICAgICAgICBpZiAocHN5cy5lbWl0dGVyTW9kZSA9PT0gY2MuUGFydGljbGVTeXN0ZW0uRW1pdHRlck1vZGUuR1JBVklUWSkge1xuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBfdHBjLCByYWRpYWwgPSBfdHBhLCB0YW5nZW50aWFsID0gX3RwYjtcblxuICAgICAgICAgICAgICAgIC8vIHJhZGlhbCBhY2NlbGVyYXRpb25cbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucG9zLnggfHwgcGFydGljbGUucG9zLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFkaWFsLnNldChwYXJ0aWNsZS5wb3MpO1xuICAgICAgICAgICAgICAgICAgICByYWRpYWwubm9ybWFsaXplU2VsZigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YW5nZW50aWFsLnNldChyYWRpYWwpO1xuICAgICAgICAgICAgICAgIHJhZGlhbC5tdWxTZWxmKHBhcnRpY2xlLnJhZGlhbEFjY2VsKTtcblxuICAgICAgICAgICAgICAgIC8vIHRhbmdlbnRpYWwgYWNjZWxlcmF0aW9uXG4gICAgICAgICAgICAgICAgbGV0IG5ld3kgPSB0YW5nZW50aWFsLng7XG4gICAgICAgICAgICAgICAgdGFuZ2VudGlhbC54ID0gLXRhbmdlbnRpYWwueTtcbiAgICAgICAgICAgICAgICB0YW5nZW50aWFsLnkgPSBuZXd5O1xuXG4gICAgICAgICAgICAgICAgdGFuZ2VudGlhbC5tdWxTZWxmKHBhcnRpY2xlLnRhbmdlbnRpYWxBY2NlbCk7XG5cbiAgICAgICAgICAgICAgICB0bXAuc2V0KHJhZGlhbCk7XG4gICAgICAgICAgICAgICAgdG1wLmFkZFNlbGYodGFuZ2VudGlhbCk7XG4gICAgICAgICAgICAgICAgdG1wLmFkZFNlbGYocHN5cy5ncmF2aXR5KTtcbiAgICAgICAgICAgICAgICB0bXAubXVsU2VsZihkdCk7XG4gICAgICAgICAgICAgICAgcGFydGljbGUuZGlyLmFkZFNlbGYodG1wKTtcblxuICAgICAgICAgICAgICAgIHRtcC5zZXQocGFydGljbGUuZGlyKTtcbiAgICAgICAgICAgICAgICB0bXAubXVsU2VsZihkdCk7XG4gICAgICAgICAgICAgICAgcGFydGljbGUucG9zLmFkZFNlbGYodG1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1vZGUgQjogcmFkaXVzIG1vdmVtZW50XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGFuZ2xlIGFuZCByYWRpdXMgb2YgdGhlIHBhcnRpY2xlLlxuICAgICAgICAgICAgICAgIHBhcnRpY2xlLmFuZ2xlICs9IHBhcnRpY2xlLmRlZ3JlZXNQZXJTZWNvbmQgKiBkdDtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgKz0gcGFydGljbGUuZGVsdGFSYWRpdXMgKiBkdDtcblxuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvcy54ID0gLU1hdGguY29zKHBhcnRpY2xlLmFuZ2xlKSAqIHBhcnRpY2xlLnJhZGl1cztcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3MueSA9IC1NYXRoLnNpbihwYXJ0aWNsZS5hbmdsZSkgKiBwYXJ0aWNsZS5yYWRpdXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbG9yXG4gICAgICAgICAgICBwYXJ0aWNsZS5jb2xvci5yICs9IHBhcnRpY2xlLmRlbHRhQ29sb3IuciAqIGR0O1xuICAgICAgICAgICAgcGFydGljbGUuY29sb3IuZyArPSBwYXJ0aWNsZS5kZWx0YUNvbG9yLmcgKiBkdDtcbiAgICAgICAgICAgIHBhcnRpY2xlLmNvbG9yLmIgKz0gcGFydGljbGUuZGVsdGFDb2xvci5iICogZHQ7XG4gICAgICAgICAgICBwYXJ0aWNsZS5jb2xvci5hICs9IHBhcnRpY2xlLmRlbHRhQ29sb3IuYSAqIGR0O1xuXG4gICAgICAgICAgICAvLyBzaXplXG4gICAgICAgICAgICBwYXJ0aWNsZS5zaXplICs9IHBhcnRpY2xlLmRlbHRhU2l6ZSAqIGR0O1xuICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnNpemUgPCAwKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGUuc2l6ZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGFuZ2xlXG4gICAgICAgICAgICBwYXJ0aWNsZS5yb3RhdGlvbiArPSBwYXJ0aWNsZS5kZWx0YVJvdGF0aW9uICogZHQ7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB2YWx1ZXMgaW4gcXVhZCBidWZmZXJcbiAgICAgICAgICAgIGxldCBuZXdQb3MgPSBfdHBhO1xuICAgICAgICAgICAgbGV0IGRpZmYgPSBfdHBiO1xuICAgICAgICAgICAgaWYgKHBzeXMucG9zaXRpb25UeXBlID09PSBjYy5QYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGUuRlJFRSkge1xuICAgICAgICAgICAgICAgIGRpZmYuc2V0KHBhcnRpY2xlLnN0YXJ0UG9zKTtcbiAgICAgICAgICAgICAgICBkaWZmLm5lZ1NlbGYoKTsgIC8vIFVuaWZ5IGRpcmVjdGlvbiB3aXRoIG90aGVyIHBvc2l0aW9uVHlwZVxuICAgICAgICAgICAgICAgIG5ld1Bvcy5zZXQocGFydGljbGUucG9zKTtcbiAgICAgICAgICAgICAgICBuZXdQb3Muc3ViU2VsZihkaWZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHBzeXMucG9zaXRpb25UeXBlID09PSBjYy5QYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGUuUkVMQVRJVkUpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRQb3MgPSBfdHBjO1xuICAgICAgICAgICAgICAgIC8vIGN1cnJlbnQgUG9zaXRpb24gY29udmVydCBUbyBOb2RlIFNwYWNlXG4gICAgICAgICAgICAgICAgQWZmaW5lVHJhbnMudHJhbnNmb3JtVmVjMihkaWZmLCBfcG9zLCB3b3JsZFRvTm9kZVRyYW5zKTtcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBQb3NpdGlvbiBjb252ZXJ0IFRvIE5vZGUgU3BhY2VcbiAgICAgICAgICAgICAgICBBZmZpbmVUcmFucy50cmFuc2Zvcm1WZWMyKHN0YXJ0UG9zLCBwYXJ0aWNsZS5zdGFydFBvcywgd29ybGRUb05vZGVUcmFucyk7XG4gICAgICAgICAgICAgICAgZGlmZi5zdWJTZWxmKHN0YXJ0UG9zKTtcbiAgICAgICAgICAgICAgICBuZXdQb3Muc2V0KHBhcnRpY2xlLnBvcyk7XG4gICAgICAgICAgICAgICAgbmV3UG9zLnN1YlNlbGYoZGlmZik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1Bvcy5zZXQocGFydGljbGUucG9zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IG9mZnNldCA9IEZMT0FUX1BFUl9QQVJUSUNMRSAqIHBhcnRpY2xlSWR4O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJ0aWNsZUJ1ZmZlcihwYXJ0aWNsZSwgbmV3UG9zLCBidWZmZXIsIG9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBwYXJ0aWNsZSBjb3VudGVyXG4gICAgICAgICAgICArK3BhcnRpY2xlSWR4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbGlmZSA8IDBcbiAgICAgICAgICAgIGxldCBkZWFkUGFydGljbGUgPSBwYXJ0aWNsZXNbcGFydGljbGVJZHhdO1xuICAgICAgICAgICAgaWYgKHBhcnRpY2xlSWR4ICE9PSBwYXJ0aWNsZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlc1twYXJ0aWNsZUlkeF0gPSBwYXJ0aWNsZXNbcGFydGljbGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9vbC5wdXQoZGVhZFBhcnRpY2xlKTtcbiAgICAgICAgICAgIHBhcnRpY2xlcy5sZW5ndGgtLTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwYXJ0aWNsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBidWZmZXIudXBsb2FkRGF0YSgpO1xuICAgICAgICBwc3lzLl9hc3NlbWJsZXIuX2lhLl9jb3VudCA9IHBhcnRpY2xlcy5sZW5ndGggKiA2O1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5hY3RpdmUgJiYgIXRoaXMucmVhZHlUb1BsYXkpIHtcbiAgICAgICAgdGhpcy5maW5pc2hlZCA9IHRydWU7XG4gICAgICAgIHBzeXMuX2ZpbmlzaGVkU2ltdWxhdGlvbigpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaW11bGF0b3I7XG4iXX0=