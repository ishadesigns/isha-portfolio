import assert from 'node:assert/strict';
import {createSpatialAudio,createWelcomeCue} from '../spatial-audio.js';

let clock=0,isActive=true;
class FakeAudio {
  static instances=[];
  static initialState='running';
  static delayed=false;
  constructor(){this.state=FakeAudio.initialState;this.sampleRate=48000;this.currentTime=3;this.destination={};this.sources=[];this.buffers=[];FakeAudio.instances.push(this);}
  addEventListener(){}
  resume(){if(FakeAudio.delayed)return new Promise(resolve=>{this.release=()=>{this.state='running';resolve();};});this.state='running';return Promise.resolve();}
  suspend(){this.state='suspended';return Promise.resolve();}
  close(){this.state='closed';return Promise.resolve();}
  createGain(){return {gain:{value:1,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
  source(){const s={frequency:{value:0},stops:[],connect(){},disconnect(){},start(t){this.started=t??0;},stop(t){this.stops.push(t);}};this.sources.push(s);return s;}
  createOscillator(){return this.source();}
  createBufferSource(){return this.source();}
  createBuffer(channels,length,rate){const b={channels,length,rate,copyToChannel(samples){this.samples=samples;}};this.buffers.push(b);return b;}
}
const options=()=>({AudioContext:FakeAudio,now:()=>clock,active:()=>isActive});
const audio=createSpatialAudio(options());
assert.equal(await audio.arrival(),true);
const ctx=FakeAudio.instances[0];
assert.equal(ctx.sources.length,4);
assert(ctx.sources.every(s=>s.stops[0]-ctx.currentTime<=1.1),'welcome cue ends in about one second');
audio.stopArrival();
assert(ctx.sources.every(s=>s.stops.length===2),'cancellation stops the scheduled arrival voices');
assert.equal(await audio.click(),true);
assert.equal(ctx.buffers.length,1);
assert.equal(ctx.buffers[0].channels,1);
assert(ctx.buffers[0].length/ctx.sampleRate<.1);
assert(ctx.buffers[0].samples.some(s=>Math.abs(s)>.05),'click is audible, not an empty buffer');
assert(ctx.buffers[0].samples.every(s=>Number.isFinite(s)&&Math.abs(s)<1),'no clipping or invalid samples');
clock=20;assert.equal(await audio.click(),false,'duplicate fast activation is suppressed');
clock=100;assert.equal(await audio.click(),true);
assert.equal(FakeAudio.instances.length,1,'reuse one audio context across clicks and arrival');
assert.equal(ctx.buffers.length,1,'reuse the small click buffer');
audio.suspend();assert.equal(ctx.state,'suspended');
isActive=false;clock=200;assert.equal(await audio.click(),false,'hidden tabs cannot click');
isActive=true;FakeAudio.initialState='suspended';FakeAudio.delayed=true;
const canceled=createSpatialAudio(options());
const pending=canceled.arrival(),ctx2=FakeAudio.instances[1];
canceled.stopArrival();ctx2.release();assert.equal(await pending,false);
assert.equal(ctx2.sources.length,0,'blocked startup never plays after its arrival has ended');
const late=createSpatialAudio(options());
const waiting=late.arrival(),ctx3=FakeAudio.instances[2];clock+=1000;ctx3.release();
assert.equal(await waiting,false);assert.equal(ctx3.sources.length,0,'late unlock cannot replay a stale chord');
const lateClick=createSpatialAudio(options());
const clickPending=lateClick.click(),ctx4=FakeAudio.instances[3];clock+=300;ctx4.release();
assert.equal(await clickPending,false);assert.equal(ctx4.sources.length,0,'clicks are not queued for delayed playback');
audio.dispose();assert.equal(ctx.state,'closed');clock+=200;assert.equal(await audio.click(),false);
const unsupported=createSpatialAudio({AudioContext:undefined});
assert.equal(await unsupported.click(),false);assert.equal(await unsupported.arrival(),false);
console.log('Passed spatial audio checks: bounded cues, context/buffer reuse, cancellation, hidden tabs, autoplay delays, stale clicks, and unavailable audio.');

let calls=0,allowed=false,status;
const welcomeSound={arrival:async()=>{calls++;return allowed;},stopArrival(){}};
const cue=createWelcomeCue({sound:welcomeSound,onState:s=>{status=s;}});
assert.equal(await cue.load(),false);assert.equal(status,'blocked');
allowed=true;assert.equal(await cue.interact(),true);assert.equal(status,'played');
assert.equal(await cue.interact(),false);assert.equal(calls,2,'one welcome per visit, not per click');
assert.equal(await cue.replay(),true);assert.equal(calls,3);
const refreshed=createWelcomeCue({sound:welcomeSound});
assert.equal(await refreshed.load(),true);assert.equal(calls,4,'a fresh page attempts its own welcome');
const resolvers=[];
const racing=createWelcomeCue({sound:{arrival:()=>new Promise(r=>resolvers.push(r)),stopArrival(){}},onState:s=>{status=s;}});
const oldLoad=racing.load(),newGesture=racing.interact(),otherGesture=racing.interact();
assert.equal(resolvers.length,1,'rapid gestures cannot restart in-flight native playback');
assert.equal(newGesture,oldLoad,'all ordinary attempts share the active request');
resolvers[0](true);assert.equal(await oldLoad,true);assert.equal(await newGesture,true);assert.equal(await otherGesture,true);
assert.equal(await racing.interact(),false);assert.equal(status,'played');
const oldReplay=racing.replay(),newReplay=racing.replay();
assert.equal(resolvers.length,3,'only explicit replay starts a fresh request');
resolvers[2](true);assert.equal(await newReplay,true);
resolvers[1](false);assert.equal(await oldReplay,false);assert.equal(status,'played','an interrupted replay cannot overwrite a newer successful playback');
let visible=false;
const background=createWelcomeCue({sound:welcomeSound,active:()=>visible});
assert.equal(await background.load(),false);visible=true;assert.equal(await background.interact(),true);
console.log('Passed welcome checks: each-page reset, blocked-autoplay fallback, single playback, replay, race ordering, and background visits.');
