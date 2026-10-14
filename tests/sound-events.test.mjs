import assert from 'node:assert/strict';
// Exercise the actual production event wiring, not only the playback helpers.
for (const readyState of ['loading','interactive','complete']) for (const fails of [true, false]) {
  const handlers=new Map(),audioHandlers=new Map();
  const media={volume:0,muted:true,currentTime:0,calls:0,paused:true,
    addEventListener:(type,fn)=>audioHandlers.set(type,fn),
    pause(){this.paused=true;},
    play(){this.calls++;if(fails)return Promise.reject({name:'NotAllowedError'});this.paused=false;return Promise.resolve();}
  };
  const root={dataset:{}};
  globalThis.document={hidden:false,readyState,documentElement:root,
    querySelector:()=>media,
    addEventListener(type,fn){if(!handlers.has(type))handlers.set(type,[]);handlers.get(type).push(fn);}
  };
  globalThis.window={addEventListener(){}};
  const app=await import(`../sound-app.js?event-test=${readyState}-${fails}`);
  if(readyState==='loading')for(const listener of handlers.get('DOMContentLoaded')||[])listener();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(media.calls,1,'a document makes one automatic welcome attempt');
  const event={isTrusted:true,isPrimary:true,button:0,pointerId:1,clientX:10,clientY:10,detail:1,target:{closest:()=>null}};
  for(let i=0;i<4;i++)for(const type of ['pointerdown','pointerup','keydown','click'])for(const listener of handlers.get(type)||[])listener(event);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(media.calls,1,'browsing clicks/keys never retry or replay the opening chime');
  if(!fails){media.currentTime=1.9;media.paused=true;audioHandlers.get('ended')();assert.equal(root.dataset.welcomePlayback,'ended');}
  await app.welcomeCue.replay();
  assert.equal(media.calls,2,'the explicit Play welcome sound control can start a second cue');
}
delete globalThis.document;delete globalThis.window;
console.log('Passed production sound wiring: one automatic cue, no delayed gesture retries, no post-completion replay, explicit replay only.');
