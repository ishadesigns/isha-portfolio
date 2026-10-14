import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Run the production controller against an event fixture. Exercise the transitions
// that can strand focus or leave touch/hover navigation stuck on screen.
const listeners=new Map(),observers=[],timers=new Map(),frames=[];
let serial=0,hasHover=true;
class Node {
  constructor(parent=null){this.parent=parent;this.attributes={};this.events=new Map();this.inert=false;}
  addEventListener(type,fn){if(!this.events.has(type))this.events.set(type,[]);this.events.get(type).push(fn);}
  emit(type,values={}){const event={target:this,detail:1,pointerType:'mouse',...values};for(const fn of this.events.get(type)||[])fn(event);}
  setAttribute(key,value){this.attributes[key]=value;}
  contains(node){return node===this||!!node?.parent&&this.contains(node.parent);}
  closest(selector){if(selector==='.guide-panel')return guide.contains(this)?guide:null;return this.navigationLink?this:null;}
  matches(){return !!this.hover;}
  focus(){document.activeElement=this;}
}
const root={dataset:{view:'home'},classes:new Set()};
root.classList={contains:c=>root.classes.has(c),toggle(c,value){if(value)root.classes.add(c);else root.classes.delete(c);}};
const header=new Node(),details=new Node(header),island=new Node(header),dock=new Node(),sensor=new Node(),toggle=new Node(sensor),room=new Node(),guide=new Node(),content=new Node(),outside=new Node();
const home=new Node(dock);home.navigationLink=true;
dock.querySelector=()=>home;
room.hidden=true;
const nodes={'.space-status':header,'#space-status-details':details,'[data-island-toggle]':island,'.spatial-dock':dock,'.dock-sensor':sensor,'[data-dock-toggle]':toggle,'#room-controls':room,'[data-window]:not([hidden]) .spatial-scroll':content};
const document={documentElement:root,activeElement:outside,querySelector(selector){return selector==='#room-controls:not([hidden])'?room.hidden?null:room:nodes[selector];},
  addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn);},dispatchEvent(){}};
const emit=(type,values={})=>{const event={target:outside,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;},...values};for(const fn of listeners.get(type)||[])fn(event);return event;};
const flush=()=>{for(const fn of timers.values())fn();timers.clear();while(frames.length)frames.shift()();};
const mutate=()=>{for(const observer of observers)observer();};
runInNewContext(readFileSync(new URL('../chrome-app.js',import.meta.url),'utf8'),{
  document,Event:class {},MutationObserver:class {constructor(fn){observers.push(fn);}observe(){}},
  matchMedia:()=>({matches:hasHover}),requestAnimationFrame:fn=>frames.push(fn),
  setTimeout:fn=>{timers.set(++serial,fn);return serial;},clearTimeout:id=>timers.delete(id),queueMicrotask:fn=>fn()
});
assert.equal(root.dataset.dockVisible,'true');
root.classes.add('workspace-fullscreen');mutate();
assert.equal(root.dataset.dockVisible,'false');assert.equal(dock.inert,true);assert.equal(details.inert,true);
sensor.emit('pointerenter');assert.equal(root.dataset.dockVisible,'true');
sensor.emit('pointerleave');dock.emit('pointerenter');flush();
assert.equal(root.dataset.dockVisible,'true','crossing from the edge to dock must retain it');
dock.emit('pointerleave');flush();assert.equal(root.dataset.dockVisible,'false','mouse departure hides navigation');
sensor.emit('pointerenter');toggle.emit('click');sensor.emit('pointerleave');flush();
assert.equal(root.dataset.dockVisible,'false','a mouse click must not pin the dock');
sensor.emit('pointerenter',{pointerType:'touch'});assert.equal(root.dataset.dockVisible,'false');
toggle.emit('click',{pointerType:'touch'});assert.equal(root.dataset.dockVisible,'true','touch reveals without hover');
emit('pointerdown');assert.equal(root.dataset.dockVisible,'false','outside tap dismisses touch navigation');
hasHover=false;toggle.emit('click');assert.equal(root.dataset.dockVisible,'true','a non-hover browser also supports tapping');
emit('pointerdown');hasHover=true;
toggle.emit('click',{detail:0});flush();assert.equal(document.activeElement,home);assert.equal(dock.inert,false);
const key=emit('keydown',{key:'Escape'});assert.equal(key.stopped,true);assert.equal(document.activeElement,content);assert.equal(root.dataset.dockVisible,'false');
document.activeElement=home;dock.emit('focusin');assert.equal(root.dataset.dockVisible,'true');
document.activeElement=outside;dock.emit('focusout');assert.equal(root.dataset.dockVisible,'false');
island.emit('click');assert.equal(island.attributes['aria-expanded'],'true');assert.equal(details.inert,false);
emit('pointerdown',{target:guide});assert.equal(island.attributes['aria-expanded'],'true','Luke dialog does not dismiss its focus return target');
const guideEscape=emit('keydown',{key:'Escape',target:guide});
assert.equal(guideEscape.stopped,undefined,'Luke receives its own Escape action before the island closes');
assert.equal(island.attributes['aria-expanded'],'true');
emit('keydown',{key:'Escape'});assert.equal(document.activeElement,island);assert.equal(details.inert,true);
island.emit('click');emit('pointerdown');assert.equal(details.inert,true);
room.hidden=false;mutate();assert.equal(root.dataset.dockVisible,'true','room menu retains navigation');
room.hidden=true;mutate();assert.equal(root.dataset.dockVisible,'false');
root.classes.add('room-looking');mutate();assert.equal(root.dataset.dockVisible,'true');assert.equal(details.inert,false);
root.classes.delete('room-looking');mutate();assert.equal(root.dataset.dockVisible,'false');
root.classes.add('space-reflow');mutate();assert.equal(root.dataset.dockVisible,'true','large-text reflow keeps controls visible');
root.classes.delete('space-reflow');root.classes.delete('workspace-fullscreen');mutate();
assert.equal(dock.inert,false);assert.equal(details.inert,false);assert.equal(root.classes.has('immersive-chrome'),false);
console.log('Passed immersive chrome transitions: hover, touch, keyboard focus, Escape, island/Luke, room exploration and text reflow.');
