(() => {
  const root=document.documentElement,header=document.querySelector('.space-status');
  const details=document.querySelector('#space-status-details'),island=document.querySelector('[data-island-toggle]');
  const dock=document.querySelector('.spatial-dock'),sensor=document.querySelector('.dock-sensor'),toggle=document.querySelector('[data-dock-toggle]');
  let immersive=false,statusOpen=false,pinned=false,dockHover=false,edgeHover=false,focused=false,hideTimer;
  function changed(){document.dispatchEvent(new Event('chromechange'));}
  function renderDock(){
    const visible=!immersive||pinned||focused||dockHover||edgeHover||!!document.querySelector('#room-controls:not([hidden])');
    const value=String(visible);
    dock.inert=!visible;toggle.setAttribute('aria-expanded',value);
    if(root.dataset.dockVisible!==value){root.dataset.dockVisible=value;changed();}
  }
  function showStatus(open,restore=false){
    statusOpen=immersive&&open;root.classList.toggle('island-open',statusOpen);
    details.inert=immersive&&!statusOpen;
    island.setAttribute('aria-expanded',String(statusOpen));
    island.setAttribute('aria-label',statusOpen?'Close space status':'Open space status');
    if(restore)island.focus({preventScroll:true});
  }
  function updateMode(){
    const next=root.classList.contains('workspace-fullscreen')&&!root.classList.contains('room-looking')&&!root.classList.contains('space-reflow');
    if(next!==immersive){
      const hovering=dock.matches(':hover');
      immersive=next;pinned=false;focused=dock.contains(document.activeElement);dockHover=next&&hovering;edgeHover=false;
      root.classList.toggle('immersive-chrome',next);showStatus(false);renderDock();changed();
    }
  }
  function hoverChange(key,value,event){
    if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    clearTimeout(hideTimer);
    if(key==='dock')dockHover=value;else edgeHover=value;
    if(value)renderDock();else hideTimer=setTimeout(renderDock,160);
  }
  dock.addEventListener('pointerenter',e=>hoverChange('dock',true,e));
  dock.addEventListener('pointerleave',e=>hoverChange('dock',false,e));
  sensor.addEventListener('pointerenter',e=>hoverChange('edge',true,e));
  sensor.addEventListener('pointerleave',e=>hoverChange('edge',false,e));
  dock.addEventListener('focusin',()=>{focused=true;renderDock();});
  dock.addEventListener('focusout',()=>queueMicrotask(()=>{focused=dock.contains(document.activeElement);renderDock();}));
  toggle.addEventListener('click',e=>{
    if(e.detail===0){focused=true;renderDock();requestAnimationFrame(()=>dock.querySelector('a').focus({preventScroll:true}));}
    else {pinned=e.pointerType==='touch'||!matchMedia('(hover:hover)').matches ? !pinned : false;renderDock();}
  });
  island.addEventListener('click',()=>{
    showStatus(!statusOpen);
  });
  header.addEventListener('focusout',e=>{
    if(e.relatedTarget&&!header.contains(e.relatedTarget)&&!e.relatedTarget.closest('.guide-panel'))showStatus(false);
  });
  document.addEventListener('pointerdown',e=>{
    if(!header.contains(e.target)&&!e.target.closest('.guide-panel'))showStatus(false);
    if(!dock.contains(e.target)&&!sensor.contains(e.target)){pinned=false;renderDock();}
  },true);
  dock.addEventListener('click',e=>{
    if(e.target.closest('a[data-open],a[data-case]')){pinned=false;focused=false;renderDock();}
  });
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape'||!immersive||e.target.closest('.guide-panel'))return;
    if(statusOpen){e.preventDefault();e.stopPropagation();showStatus(false,true);}
    else if(dock.contains(document.activeElement)||document.activeElement===toggle){
      e.preventDefault();e.stopPropagation();pinned=false;focused=false;dockHover=false;edgeHover=false;
      document.querySelector('[data-window]:not([hidden]) .spatial-scroll')?.focus({preventScroll:true});renderDock();
    }
  },true);
  let view=root.dataset.view;
  new MutationObserver(()=>{
    if(view!==root.dataset.view){view=root.dataset.view;showStatus(false);}
    updateMode();
  }).observe(root,{attributes:true,attributeFilter:['class','data-view']});
  new MutationObserver(renderDock).observe(document.querySelector('#room-controls'),{attributes:true,attributeFilter:['hidden']});
  updateMode();renderDock();
})();
