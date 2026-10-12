export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function stepOrbit(bodies,bounds,seconds) {
 const dt=clamp(seconds,0,0.05), pad=10;
 for(const b of bodies) {
  if(!b.held) {
   const speed=Math.hypot(b.vx,b.vy);
   if(speed<14) { b.vx=(b.vx/(speed||1)||1)*14; b.vy=b.vy/(speed||1)*14; }
   else if(speed>40) {const fade=Math.exp(-dt*0.7);b.vx*=fade;b.vy*=fade;}
   b.x+=b.vx*dt; b.y+=b.vy*dt;
  }
  const right=Math.max(pad,bounds.width-b.w-pad),bottom=Math.max(pad,bounds.height-b.h-pad);
  if(b.x<pad){b.x=pad;b.vx=Math.abs(b.vx);}
  if(b.x>right){b.x=right;b.vx=-Math.abs(b.vx);}
  if(b.y<pad){b.y=pad;b.vy=Math.abs(b.vy);}
  if(b.y>bottom){b.y=bottom;b.vy=-Math.abs(b.vy);}
 }
 for(let i=0;i<bodies.length;i++) for(let j=i+1;j<bodies.length;j++) {
  const a=bodies[i],b=bodies[j];
  if(a.held&&b.held) continue;
  const dx=(b.x+b.w/2)-(a.x+a.w/2),dy=(b.y+b.h/2)-(a.y+a.h/2);
  const ox=(a.w+b.w)/2-Math.abs(dx),oy=(a.h+b.h)/2-Math.abs(dy);
  if(ox<=0||oy<=0) continue;
  const horizontal=ox<oy,shift=(horizontal?ox:oy)+0.5,dir=(horizontal?dx:dy)>=0?1:-1;
  const axis=horizontal?'x':'y',v=horizontal?'vx':'vy';
  const shares=a.held||b.held?1:0.5;
  if(!a.held){a[axis]-=dir*shift*shares;a[v]=-dir*Math.max(12,Math.abs(a[v]));}
  if(!b.held){b[axis]+=dir*shift*shares;b[v]=dir*Math.max(12,Math.abs(b[v]));}
 }
 // Collision separation must never push an object beyond the scene.
 for(const b of bodies){b.x=clamp(b.x,pad,Math.max(pad,bounds.width-b.w-pad));b.y=clamp(b.y,pad,Math.max(pad,bounds.height-b.h-pad));}
 return bodies;
}
