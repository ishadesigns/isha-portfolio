import {spatialSound} from './sound-app.js';
const root = document.documentElement;
const layer = document.querySelector('.arrival-layer');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let finishTimer, loadTimer, playing = false;

function finish() {
  clearTimeout(finishTimer); clearTimeout(loadTimer); clearTimeout(window.ishaArrivalFallback);
  playing=false; delete root.dataset.arrival; layer.hidden=true; spatialSound.stopArrival();
  root.classList.add('arrival-complete');
  document.querySelectorAll('[data-arrival-inert]').forEach(el=>{el.inert=false;delete el.dataset.arrivalInert;});

}
function start() {
  if (motion.matches || root.classList.contains('space-reflow') || document.hidden || root.dataset.view!=='home') { finish(); return; }
  clearTimeout(window.ishaArrivalFallback); clearTimeout(loadTimer); clearTimeout(finishTimer);
  playing=true; spatialSound.stopArrival(); layer.hidden=false;
  document.querySelector('.panel-home .spatial-scroll').scrollTop=0;
  document.querySelectorAll('.space-status,.spatial-dock,.spatial-workspace,.portfolio-guide').forEach(el=>{if(!el.inert){el.inert=true;el.dataset.arrivalInert='';}});
  root.dataset.arrival='pending';
  // Restart the one-shot CSS timeline after replay, without a continuous JS frame loop.
  void layer.offsetWidth;
  root.dataset.arrival='running';
  spatialSound.arrival();
  finishTimer=setTimeout(finish,3950);
}
document.querySelector('[data-arrival-replay]').addEventListener('click',start);
// Keyboard navigation can proceed immediately without a visible intro control.
document.addEventListener('keydown',e=>{if(playing&&(e.key==='Escape'||e.key==='Tab'))finish();});
document.addEventListener('click',e=>{if(playing&&!e.target.closest('.arrival-layer,[data-arrival-replay]'))finish();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
motion.addEventListener('change',()=>{if(motion.matches)finish();});
new MutationObserver(()=>{if(playing&&root.dataset.view!=='home')finish();}).observe(root,{attributes:true,attributeFilter:['data-view']});
function prepare() { if(root.dataset.arrival==='pending') {
  // Decode the existing room plane before revealing it; never wait indefinitely.
  const room = new Image();
  room.src = new URL('assets/spatial-room-wide.webp',new URL(document.body.dataset.base,document.baseURI)).href;
  loadTimer=setTimeout(start,1600);
  room.decode().catch(()=>{}).then(()=>{if(root.dataset.arrival==='pending')start();});
} }
if(document.readyState==='complete')prepare();else document.addEventListener('DOMContentLoaded',prepare,{once:true});
