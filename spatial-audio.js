// Original short glass/pop cues, inspired by spatial UI. No sampled Apple audio.
export function createSpatialAudio({AudioContext,now=()=>performance.now(),active=()=>true,onState=()=>{}}) {
  let context=null,buffer=null,arrivalId=0,lastClick=-Infinity,disposed=false;
  const voices=new Set();
  function getContext() {
    if(disposed||!AudioContext)return null;
    if(!context) {
      try {context=new AudioContext();context.addEventListener('statechange',()=>onState(context.state));onState(context.state);}
      catch {return null;}
    }
    return context;
  }
  async function unlock() {
    const ctx=getContext();if(!ctx)return false;
    try {if(ctx.state!=='running')await ctx.resume();if(disposed||!active()){if(ctx.state==='running')await ctx.suspend();return false;}onState(ctx.state);return ctx.state==='running';}
    catch {return false;}
  }
  function track(source,kind,nodes=[]) {
    const voice={source,kind,nodes};voices.add(voice);
    source.onended=()=>{voices.delete(voice);source.disconnect();nodes.forEach(n=>n.disconnect());};
    return voice;
  }
  function stopKind(kind) {
    for(const voice of [...voices])if(!kind||voice.kind===kind) {
      voices.delete(voice);try{voice.source.stop();}catch{}
      voice.source.disconnect();voice.nodes.forEach(n=>n.disconnect());
    }
  }
  function clickBuffer(ctx) {
    if(buffer)return buffer;
    const length=Math.ceil(ctx.sampleRate*.085),samples=new Float32Array(length);
    let phase=0,seed=713;
    for(let i=0;i<length;i++) {
      const t=i/ctx.sampleRate;
      phase+=2*Math.PI*(800+1250*Math.exp(-t*65))/ctx.sampleRate;
      seed=(seed*16807)%2147483647;
      const air=(seed/2147483647*2-1)*Math.exp(-t*450)*.05;
      const envelope=(1-Math.exp(-t*1500))*Math.exp(-t*82);
      samples[i]=envelope*(Math.sin(phase)*.24+Math.sin(2*Math.PI*320*t)*.1)+air;
    }
    buffer=ctx.createBuffer(1,length,ctx.sampleRate);buffer.copyToChannel(samples,0);
    return buffer;
  }
  async function click() {
    const started=now();
    if(!active()||started-lastClick<55)return false;
    lastClick=started;
    if(!await unlock()||now()-started>180||!active())return false;
    const source=context.createBufferSource(),gain=context.createGain();
    source.buffer=clickBuffer(context);gain.gain.value=.65;
    source.connect(gain);gain.connect(context.destination);track(source,'click',[gain]);source.start();
    return true;
  }
  async function arrival() {
    stopArrival();const id=arrivalId,started=now();
    // A blocked autoplay request must never burst into a stale chord on a later click.
    if(!await unlock()||id!==arrivalId||now()-started>400||!active())return false;
    const ctx=context,time=ctx.currentTime;
    [196,293.665,392,440].forEach((frequency,i)=>{
      const oscillator=ctx.createOscillator(),envelope=ctx.createGain();
      oscillator.type='sine';oscillator.frequency.value=frequency;
      envelope.gain.setValueAtTime(0,time);
      envelope.gain.linearRampToValueAtTime(.038,time+.25+i*.08);
      envelope.gain.exponentialRampToValueAtTime(.0001,time+1);
      oscillator.connect(envelope);envelope.connect(ctx.destination);
      track(oscillator,'arrival',[envelope]);oscillator.start(time+i*.06);oscillator.stop(time+1.05);
    });
    return true;
  }
  function stopArrival(){++arrivalId;stopKind('arrival');}
  function suspend(){++arrivalId;stopKind();if(context?.state==='running')context.suspend().catch(()=>{});}
  function dispose(){disposed=true;++arrivalId;stopKind();if(context&&context.state!=='closed')context.close().catch(()=>{});}
  return {click,arrival,stopArrival,suspend,dispose};
}

// Each document gets a fresh cue. Browser permission is not a saved site preference.
export function createWelcomeCue({sound,active=()=>true,onState=()=>{}}) {
  let played=false,generation=0;
  onState('pending');
  async function attempt() {
    if(played||!active())return false;
    const id=++generation;
    const audible=await sound.arrival();
    if(id!==generation)return false;
    played=audible;onState(played?'played':'pending');return audible;
  }
  function replay(){played=false;onState('pending');return attempt();}
  function pause(){++generation;sound.stopArrival();}
  return {load:attempt,interact:attempt,replay,pause};
}
