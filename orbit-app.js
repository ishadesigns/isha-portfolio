import { clamp, stepOrbit } from './orbit-motion.js';
export function initOrbit() {
 const scene=document.querySelector('.orbit-scene');
 if(!scene) return;
 const root=document.documentElement,items=JSON.parse(document.querySelector('#orbit-data').textContent);
 const base=new URL(document.body.dataset.base,document.baseURI),panel=scene.closest('[data-window]');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const bodies=[...scene.querySelectorAll('[data-orbit-object]')].map((el)=>({el,id:el.dataset.orbitObject,x:0,y:0,w:0,h:0,vx:20,vy:15,held:false}));
 let bounds={width:0,height:0},frame=0,last=0,drag=null,suppress=null;
 function render(){for(const b of bodies)b.el.style.transform=`translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) rotate(${clamp(b.vx/18,-7,7).toFixed(1)}deg)`;}
 function layout(remix=false){
  if(!scene.clientWidth||!scene.clientHeight)return;
  const next={width:scene.clientWidth,height:scene.clientHeight};
  const cols=next.width<450?3:next.width<560?4:next.width>=700?6:5,rows=Math.ceil(bodies.length/cols);
  const w=Math.min(136,(next.width-36)/cols-8),h=Math.min(w<95?100:118,(next.height-32)/rows-8);
  const order=remix?[...bodies].sort(()=>Math.random()-0.5):bodies;
  order.forEach((b,i)=>{
   b.w=w;b.h=h;b.el.style.width=`${w}px`;b.el.style.height=`${h}px`;
   if(remix||!bounds.width){b.x=(i%cols+0.5)*next.width/cols-w/2;b.y=(Math.floor(i/cols)+0.5)*next.height/rows-h/2;const angle=Math.random()*Math.PI*2;b.vx=Math.cos(angle)*24;b.vy=Math.sin(angle)*24;}
   else {b.x=b.x/bounds.width*next.width;b.y=b.y/bounds.height*next.height;}
  });
  bounds=next;stepOrbit(bodies,bounds,0);render();schedule();
 }
 function active(){return bounds.width>0&&!document.hidden&&!panel.hidden&&!motion.matches&&!document.querySelector('dialog[open]')&&scene.getClientRects().length>0;}
 function tick(time){frame=0;if(!active()){scene.dataset.running='false';last=0;return;}if(!last)last=time;if(time-last>=32){stepOrbit(bodies,bounds,(time-last)/1000);render();last=time;}frame=requestAnimationFrame(tick);}
 function schedule(){cancelAnimationFrame(frame);frame=0;last=0;scene.dataset.running=String(active());if(active())frame=requestAnimationFrame(tick);}
 function choose(b){
  const item=items.find(i=>i.id===b.id);
  const detail=document.querySelector('.orbit-detail');detail.hidden=false;
  bodies.forEach(body=>body.el.setAttribute('aria-pressed',String(body===b)));
  document.querySelector('[data-orbit-title]').textContent=item.title;
  document.querySelector('[data-orbit-copy]').textContent=item.copy;
  const link=document.querySelector('[data-orbit-link]');link.hidden=false;
  link.textContent=item.project?'Explore the case study →':'Visit About Me →';
  link.href=new URL(item.project?`projects/${item.project}/`:'#about',base).href;
  delete link.dataset.case;delete link.dataset.open;
  if(item.project)link.dataset.case=item.project;else link.dataset.open='about';
  detail.scrollIntoView({block:'nearest',behavior:motion.matches?'instant':'smooth'});
 }
 for(const b of bodies){
  b.el.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=scene.getBoundingClientRect();drag={b,id:e.pointerId,startX:e.clientX,startY:e.clientY,offsetX:e.clientX-r.left-b.x,offsetY:e.clientY-r.top-b.y,lastX:e.clientX,lastY:e.clientY,time:e.timeStamp,moved:false};b.held=true;b.el.setPointerCapture(e.pointerId);b.el.classList.add('orbit-held');});
  b.el.addEventListener('pointermove',e=>{if(!drag||drag.b!==b||drag.id!==e.pointerId)return;const r=scene.getBoundingClientRect(),dt=Math.max(0.016,(e.timeStamp-drag.time)/1000);b.x=clamp(e.clientX-r.left-drag.offsetX,10,bounds.width-b.w-10);b.y=clamp(e.clientY-r.top-drag.offsetY,10,bounds.height-b.h-10);b.vx=clamp((e.clientX-drag.lastX)/dt,-220,220);b.vy=clamp((e.clientY-drag.lastY)/dt,-220,220);drag.moved ||= Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5;drag.lastX=e.clientX;drag.lastY=e.clientY;drag.time=e.timeStamp;render();});
  const release=e=>{if(!drag||drag.b!==b||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;b.held=!moved&&document.activeElement===b.el;b.el.classList.remove('orbit-held');if(moved){suppress={id:b.id,until:performance.now()+600};b.el.blur();}if(b.el.hasPointerCapture(e.pointerId))b.el.releasePointerCapture(e.pointerId);schedule();};
  b.el.addEventListener('pointerup',release);b.el.addEventListener('pointercancel',release);b.el.addEventListener('lostpointercapture',release);
  b.el.addEventListener('click',()=>{if(suppress?.id===b.id&&performance.now()<suppress.until){suppress=null;return;}choose(b);});
  b.el.addEventListener('focus',()=>{b.held=true;});
  b.el.addEventListener('blur',()=>{if(drag?.b!==b)b.held=false;});
  b.el.addEventListener('pointerenter',()=>{if(!drag)b.held=true;});
  b.el.addEventListener('pointerleave',()=>{if(!drag&&document.activeElement!==b.el)b.held=false;});
  b.el.addEventListener('keydown',e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();b.x=clamp(b.x+(e.key==='ArrowLeft'?-18:e.key==='ArrowRight'?18:0),10,bounds.width-b.w-10);b.y=clamp(b.y+(e.key==='ArrowUp'?-18:e.key==='ArrowDown'?18:0),10,bounds.height-b.h-10);render();});
 }
 document.querySelector('[data-orbit-reset]').addEventListener('click',()=>{drag=null;suppress=null;for(const b of bodies){b.held=false;b.el.classList.remove('orbit-held');b.el.setAttribute('aria-pressed','false');}document.querySelector('[data-orbit-title]').textContent='Follow your curiosity.';document.querySelector('[data-orbit-copy]').textContent='Every object has a little story. Where will you land?';document.querySelector('[data-orbit-link]').hidden=true;document.querySelector('.orbit-detail').hidden=true;layout(true);});
 new ResizeObserver(()=>layout()).observe(scene);
 new MutationObserver(schedule).observe(root,{attributes:true,subtree:true,attributeFilter:['data-view','hidden','open']});
 motion.addEventListener('change',schedule);document.addEventListener('visibilitychange',()=>{if(document.hidden&&drag){drag.b.held=false;drag.b.el.classList.remove('orbit-held');drag=null;}schedule();});
 layout();
}
