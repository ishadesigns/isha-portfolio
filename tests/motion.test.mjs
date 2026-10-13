import assert from 'node:assert/strict';
import {dragRoom,edgeVelocity,advanceRoom} from '../room-motion.js';
import {stepOrbit,constellationLayout} from '../orbit-motion.js';
const viewport={width:1200,height:800};
for(const [point,expected] of [[{x:1,y:400},{x:-1,y:0}],[{x:1199,y:400},{x:1,y:0}],[{x:600,y:1},{x:0,y:-1}],[{x:600,y:799},{x:0,y:1}]]) {
 let pan={x:0,y:0},velocity=edgeVelocity(point,viewport);
 for(let frame=0;frame<100;frame++)pan=advanceRoom(pan,velocity,0.05);
 assert.deepEqual(pan,expected,'Holding at an edge reaches the entire room view.');
}
assert.deepEqual(edgeVelocity({x:600,y:400},viewport),{x:0,y:0});
assert.deepEqual(dragRoom({x:0,y:0},{x:1800,y:-1000},viewport),{x:1,y:-1});
const bounds={width:400,height:300};
const right={x:309,y:100,w:80,h:60,vx:100,vy:0,held:false};
stepOrbit([right],bounds,0.05);assert(right.vx<0);assert(right.x<=310);
const bottom={x:100,y:229,w:80,h:60,vx:0,vy:100,held:false};
stepOrbit([bottom],bounds,0.05);assert(bottom.vy<0);assert(bottom.y<=230);
const fixed={x:100,y:100,w:80,h:60,vx:50,vy:50,held:true};
stepOrbit([fixed],bounds,0.05);assert.equal(fixed.x,100);assert.equal(fixed.y,100);
const a={x:110,y:100,w:80,h:60,vx:20,vy:0,held:false};
stepOrbit([fixed,a],bounds,0);assert.equal(fixed.x,100);assert.equal(fixed.y,100);assert(a.x>=180||a.y>=160||a.y<=40);
const bodies=Array.from({length:10},(_,i)=>({x:20+(i%5)*70,y:40+Math.floor(i/5)*110,w:60,h:80,vx:(i%2?1:-1)*70,vy:40,held:false}));
for(let frame=0;frame<3000;frame++)stepOrbit(bodies,bounds,1/30);
assert(bodies.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)&&b.x>=10&&b.x<=bounds.width-b.w-10&&b.y>=10&&b.y<=bounds.height-b.h-10),'Bouncing remains bounded over a sustained run.');
for(const size of [{width:285,height:460},{width:500,height:400},{width:850,height:300}]){
 const cols=size.width<450?3:size.width<560?4:6,rows=Math.ceil(11/cols);
 const stars=Array.from({length:11},()=>({w:Math.min(136,(size.width-36)/cols-8),h:Math.min(100,(size.height-32)/rows-8)}));
 const places=constellationLayout(stars,size);
 assert.equal(places.length,11);
 places.forEach((p,i)=>{assert(p.x>=10&&p.y>=10&&p.x+stars[i].w<=size.width-10&&p.y+stars[i].h<=size.height-10,'every constellation star stays reachable');});
 for(let i=0;i<places.length;i++)for(let j=i+1;j<places.length;j++)assert(Math.abs(places[i].x-places[j].x)>=stars[i].w||Math.abs(places[i].y-places[j].y)>=stars[i].h,'the preset never overlaps interactive objects');
}
console.log('Passed room edge-hold, drag bounds, orbit bounce, focus stability, collisions, and sustained-motion checks.');
