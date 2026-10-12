// Original welcome bell, generated locally. Re-run after adjusting this score.
import {writeFile} from 'node:fs/promises';
const rate=22050,duration=1.9,length=Math.round(rate*duration),samples=new Float64Array(length);
const notes=[523.251,659.255,783.991,1046.502],delays=[0,.085,.17,.255];
for(let i=0;i<length;i++) {
  const t=i/rate;
  notes.forEach((frequency,n)=>{
    const age=t-delays[n];if(age<0)return;
    const envelope=(1-Math.exp(-age*100))*Math.exp(-age*2.4);
    const bell=Math.sin(2*Math.PI*frequency*age)+.19*Math.sin(2*Math.PI*frequency*2.003*age)+.055*Math.sin(2*Math.PI*frequency*3.997*age);
    const shimmer=.07*Math.sin(2*Math.PI*frequency*1.002*age);
    samples[i]+=(bell+shimmer)*envelope/(n===3?1.8:1.5);
  });
  if(t>duration-.25)samples[i]*=.5+.5*Math.cos(Math.PI*(t-duration+.25)/.25);
}
const peak=Math.max(...samples.map(Math.abs)),scale=.72/peak;
const wav=Buffer.alloc(44+length*2);
wav.write('RIFF');wav.writeUInt32LE(36+length*2,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(length*2,40);
for(let i=0;i<length;i++)wav.writeInt16LE(Math.round(samples[i]*scale*32767),44+i*2);
await writeFile('public/assets/welcome-chime.wav',wav);
const rms=Math.sqrt(samples.reduce((sum,s)=>sum+(s*scale)**2,0)/length);
console.log(JSON.stringify({duration,peak:.72,rms:Number(rms.toFixed(3)),bytes:wav.length}));
