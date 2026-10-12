import {welcomeCue} from './sound-app.js';
const root=document.documentElement,layer=document.querySelector('.arrival-layer');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let finishTimer,playing=false;
function finish() {
 clearTimeout(finishTimer);clearTimeout(window.ishaArrivalFallback);
 playing=false;delete root.dataset.arrival;layer.hidden=true;root.classList.add('arrival-complete');
}
function start() {
 if(motion.matches||root.classList.contains('space-reflow')||document.hidden||root.dataset.view!=='home'){finish();return;}
 clearTimeout(window.ishaArrivalFallback);clearTimeout(finishTimer);
 playing=true;layer.hidden=false;
 document.querySelector('.panel-home .spatial-scroll').scrollTop=0;
 root.dataset.arrival='pending';void layer.offsetWidth;root.dataset.arrival='running';
 finishTimer=setTimeout(finish,1100);
}
document.querySelector('[data-arrival-replay]').addEventListener('click',()=>{start();welcomeCue.replay();});
document.addEventListener('keydown',e=>{if(playing&&(e.key==='Escape'||e.key==='Tab'))finish();});
document.addEventListener('click',e=>{if(playing&&!e.target.closest('[data-arrival-replay]'))finish();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
motion.addEventListener('change',()=>{if(motion.matches)finish();});
new MutationObserver(()=>{if(playing&&root.dataset.view!=='home')finish();}).observe(root,{attributes:true,attributeFilter:['data-view']});
function prepare(){if(root.dataset.arrival==='pending')start();}
if(document.readyState==='complete')prepare();else document.addEventListener('DOMContentLoaded',prepare,{once:true});
