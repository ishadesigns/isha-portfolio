import assert from 'node:assert/strict';
import { preferredVoice, recognitionError, createDictationController } from '../voice-support.js';
const voice=(name,lang='en-US',localService=true)=>({name,lang,localService});
assert.equal(preferredVoice([voice('Fred Compact'),voice('Samantha'),voice('Ava (Enhanced)')]).name,'Ava (Enhanced)');
assert.equal(preferredVoice([voice('Google US English','en-US',false),voice('Fred Compact')]).name,'Google US English');
assert.equal(preferredVoice([voice('French Enhanced','fr-FR')]),null);
assert.equal(preferredVoice([]),null);
assert.match(recognitionError('network'),/connect/);
assert.match(recognitionError('audio-capture'),/another app/);
let instances=[],states=[],notices=[],transcripts=[],pending;
class Recognition {
  constructor(){instances.push(this);}
  start(){this.starts=(this.starts||0)+1;}
  stop(){this.stopped=true;}
  abort(){this.aborted=true;this.onend?.();}
}
const controller=createDictationController({Recognition,onState:s=>states.push(s),onNotice:n=>notices.push(n),onTranscript:t=>transcripts.push(t),timer:f=>(pending=f,1),cancelTimer:()=>{pending=null;}});
controller.toggle('Tell me');
const first=instances[0];
assert.equal(states.at(-1),'starting');
assert.equal(first.starts,1);
first.onstart();
assert.equal(states.at(-1),'listening');
first.onresult({results:[[{transcript:'about BMW'}]]});
assert.equal(transcripts.at(-1),'Tell me about BMW');
first.onresult({results:[[{transcript:'about BMW research'}]]});
assert.equal(transcripts.at(-1),'Tell me about BMW research'); // Interim results replace, not duplicate.
controller.toggle();
assert(first.stopped);
first.onend();
assert.equal(states.at(-1),'idle');
assert.match(notices.at(-1),/Review/);
controller.toggle();
const second=instances[1];
second.onerror({error:'network'});
assert.equal(states.at(-1),'idle');
assert(second.aborted);
assert.match(notices.at(-1),/connect/);
controller.toggle();
const third=instances[2];
controller.abort();
const count=transcripts.length;
third.onresult({results:[[{transcript:'late result'}]]});
assert.equal(transcripts.length,count); // Closed dialogs do not receive stale transcripts.
controller.toggle();
pending();
assert(instances[3].aborted);
assert.equal(states.at(-1),'idle');
assert.match(notices.at(-1),/didn’t start/);
controller.toggle();
instances[4].onstart();
instances[4].onresult({results:[[{transcript:'x'.repeat(600)}]]});
assert.equal(transcripts.at(-1).length,500);
controller.abort();
const insecure=createDictationController({Recognition,secure:false,onState:s=>states.push(s),onNotice:n=>notices.push(n),onTranscript:t=>transcripts.push(t)});
insecure.toggle();
assert.match(notices.at(-1),/secure connection/);
assert.equal(instances.length,5);
console.log('Passed 24 browser speech checks: voice preference, transcript integrity, lifecycle, stale events, and failure recovery.');
