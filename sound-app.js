import {createSpatialAudio,createWelcomeCue} from './spatial-audio.js';
import {createWelcomePlayer} from './welcome-media.js';
export const spatialSound=createSpatialAudio({
  AudioContext:window.AudioContext||window.webkitAudioContext,
  active:()=>!document.hidden,
  onState:state=>{document.documentElement.dataset.spatialAudio=state;}
});
const welcomePlayer=createWelcomePlayer({element:document.querySelector('#welcome-audio'),active:()=>!document.hidden,onState:state=>{document.documentElement.dataset.welcomePlayback=state;},onProgress:time=>{document.documentElement.dataset.welcomeTime=time.toFixed(3);}});
export const welcomeCue=createWelcomeCue({sound:welcomePlayer,active:()=>!document.hidden,onState:state=>{document.documentElement.dataset.welcomeSound=state;}});
// One automatic attempt per document. A refused cue stays silent: unrelated
// pointer presses must never launch a delayed welcome while someone is browsing.
// The existing Replay arrival button is the explicit, gesture-authorized retry.
if(document.readyState==='complete')welcomeCue.load();
else document.addEventListener('DOMContentLoaded',()=>welcomeCue.load(),{once:true});
let pointer=null,lastDrag=-Infinity;
document.addEventListener('pointerdown',e=>{if(e.isPrimary)pointer={id:e.pointerId,x:e.clientX,y:e.clientY};},{passive:true});
document.addEventListener('pointerup',e=>{if(pointer?.id===e.pointerId){if(Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>6)lastDrag=performance.now();pointer=null;}},{passive:true});
document.addEventListener('pointercancel',()=>{pointer=null;},{passive:true});
document.addEventListener('click',e=>{
  if(!e.isTrusted||e.button!==0||e.target.closest(':disabled,[inert]'))return;
  if(e.detail>0&&performance.now()-lastDrag<250)return;
  if(e.target.closest('.spatial-panel,.spatial-dock,.space-status,.portfolio-guide,.room-controls,.room-explorer,dialog'))spatialSound.click();
},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){pointer=null;welcomeCue.pause();spatialSound.suspend();}});
window.addEventListener('pagehide',e=>{welcomeCue.pause();if(e.persisted)spatialSound.suspend();else spatialSound.dispose();});
