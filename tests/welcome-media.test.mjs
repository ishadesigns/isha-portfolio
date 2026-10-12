import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createWelcomePlayer} from '../welcome-media.js';
class Media {
 constructor(){this.currentTime=0;this.muted=true;this.volume=0;this.events={};this.fail=null;this.delayed=false;this.calls=0;}
 addEventListener(name,callback){this.events[name]=callback;}
 pause(){this.paused=true;}
 play(){this.calls++;if(this.fail)return Promise.reject({name:this.fail});if(this.delayed)return new Promise(resolve=>{this.resolve=()=>{this.paused=false;resolve();};});this.paused=false;return Promise.resolve();}
}
let state,progress,visible=true;
const element=new Media(),player=createWelcomePlayer({element,active:()=>visible,onState:s=>{state=s;},onProgress:t=>{progress=t;}});
assert.equal(element.muted,false);assert.equal(element.volume,.8);
element.fail='NotAllowedError';assert.equal(await player.arrival(),false);assert.equal(state,'blocked');
element.fail=null;assert.equal(await player.arrival(),true);assert.equal(state,'playing');assert.equal(element.paused,false);
element.currentTime=.7;element.events.timeupdate();assert.equal(progress,.7);
assert.equal(await player.arrival(),true);assert.equal(element.currentTime,0,'replay starts at the beginning');
element.events.ended();assert.equal(state,'ended');
element.delayed=true;const pending=player.arrival();player.stopArrival();element.resolve();assert.equal(await pending,false);assert.equal(state,'stopped','late playback cannot replace canceled state');
visible=false;assert.equal(await player.arrival(),false);assert.equal(element.paused,true);
const wav=await readFile('public/assets/welcome-chime.wav');
assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
const rate=wav.readUInt32LE(24),count=wav.readUInt32LE(40)/2;
assert.equal(count/rate,1.9);
let squares=0,peak=0;for(let i=44;i<wav.length;i+=2){const s=wav.readInt16LE(i)/32767;peak=Math.max(peak,Math.abs(s));squares+=s*s;}
assert(peak>.7&&peak<.8,'headroom without clipping');assert(Math.sqrt(squares/count)>.12,'welcome file has meaningful audible energy');
console.log('Passed native welcome playback, blocked permission, replay, progress, cancellation, and WAV level/duration checks.');
