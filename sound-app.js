import {createSpatialAudio} from './spatial-audio.js';
export const spatialSound=createSpatialAudio({
  AudioContext:window.AudioContext||window.webkitAudioContext,
  active:()=>!document.hidden,
  onState:state=>{document.documentElement.dataset.spatialAudio=state;}
});
let pointer=null,lastDrag=-Infinity;
document.addEventListener('pointerdown',e=>{if(e.isPrimary)pointer={id:e.pointerId,x:e.clientX,y:e.clientY};},{passive:true});
document.addEventListener('pointerup',e=>{if(pointer?.id===e.pointerId){if(Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>6)lastDrag=performance.now();pointer=null;}},{passive:true});
document.addEventListener('pointercancel',()=>{pointer=null;},{passive:true});
document.addEventListener('click',e=>{
  if(!e.isTrusted||e.button!==0||e.target.closest(':disabled,[inert]'))return;
  if(e.detail>0&&performance.now()-lastDrag<250)return;
  if(e.target.closest('.spatial-panel,.spatial-dock,.space-status,.portfolio-guide,.room-controls,.room-explorer,dialog'))spatialSound.click();
},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){pointer=null;spatialSound.suspend();}});
window.addEventListener('pagehide',e=>{if(e.persisted)spatialSound.suspend();else spatialSound.dispose();});
