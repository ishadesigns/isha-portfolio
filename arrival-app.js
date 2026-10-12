const root = document.documentElement;
const layer = document.querySelector('.arrival-layer');
const soundButton = document.querySelector('[data-arrival-sound]');
const status = document.querySelector('[data-arrival-status]');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let finishTimer, loadTimer, playing = false, generation = 0, audio = null, restore = null;

// An original, four-second ambient chord. Audio is created only on an explicit click.
async function playSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio || !playing) return;
  const id = generation;
  stopSound();
  const context = new Audio(); audio = context;
  try {
    await context.resume();
    if (id !== generation || !playing || context !== audio) { await context.close().catch(()=>{}); return; }
    const now = context.currentTime, master = context.createGain();
    master.gain.value = .13; master.connect(context.destination);
    [196,293.665,392,440].forEach((frequency,i)=>{
      const oscillator = context.createOscillator(), envelope = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(0,now);
      envelope.gain.linearRampToValueAtTime(.32,now+.3+i*.1);
      envelope.gain.exponentialRampToValueAtTime(.001,now+3.7);
      oscillator.connect(envelope); envelope.connect(master);
      oscillator.start(now+i*.06); oscillator.stop(now+3.8);
    });
    soundButton.setAttribute('aria-pressed','true'); soundButton.textContent = 'Sound off';
    status.textContent = 'Arrival sound on.';
  } catch { stopSound(); status.textContent = 'Sound is unavailable in this browser. The visual intro will continue.'; }
}
function stopSound() {
  if (audio) { const old=audio; audio=null; old.close().catch(()=>{}); }
  soundButton.setAttribute('aria-pressed','false'); soundButton.textContent='Sound on';
}
function finish() {
  clearTimeout(finishTimer); clearTimeout(loadTimer); clearTimeout(window.ishaArrivalFallback);
  ++generation; playing=false; delete root.dataset.arrival; layer.hidden=true; stopSound();
  root.classList.add('arrival-complete');
  document.querySelectorAll('[data-arrival-inert]').forEach(el=>{el.inert=false;delete el.dataset.arrivalInert;});
  if (layer.contains(document.activeElement)) (restore || document.querySelector('.panel-home .spatial-scroll'))?.focus({preventScroll:true});
  restore=null;
}
function start() {
  if (motion.matches || root.classList.contains('space-reflow') || document.hidden || root.dataset.view!=='home') { finish(); return; }
  clearTimeout(window.ishaArrivalFallback); clearTimeout(loadTimer); clearTimeout(finishTimer);
  ++generation; playing=true; stopSound(); layer.hidden=false;
  document.querySelector('.panel-home .spatial-scroll').scrollTop=0;
  document.querySelectorAll('.space-status,.spatial-dock,.spatial-workspace,.portfolio-guide').forEach(el=>{if(!el.inert){el.inert=true;el.dataset.arrivalInert='';}});
  root.dataset.arrival='pending';
  // Restart the one-shot CSS timeline after replay, without a continuous JS frame loop.
  void layer.offsetWidth;
  root.dataset.arrival='running';
  status.textContent='Entering Isha’s space. You can skip the intro.';
  finishTimer=setTimeout(finish,3950);
}
soundButton.addEventListener('click',()=>{if(audio)stopSound();else {start();playSound();}});
document.querySelector('[data-arrival-skip]').addEventListener('click',finish);
document.querySelector('[data-arrival-replay]').addEventListener('click',e=>{restore=e.currentTarget;start();});
document.addEventListener('keydown',e=>{if(!playing)return;if(e.key==='Escape'){e.preventDefault();finish();}else if(e.key==='Tab'&&!layer.contains(document.activeElement)&&!document.activeElement.matches('.skip-link')){e.preventDefault();document.querySelector('[data-arrival-skip]').focus();}});
document.addEventListener('click',e=>{if(playing&&!e.target.closest('.arrival-layer,[data-arrival-replay]'))finish();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
motion.addEventListener('change',()=>{if(motion.matches)finish();});
new MutationObserver(()=>{if(playing&&root.dataset.view!=='home')finish();}).observe(root,{attributes:true,attributeFilter:['data-view']});
function prepare() { if(root.dataset.arrival==='pending') {
  // Decode the existing room plane before revealing it; never wait indefinitely.
  const room = new Image();
  room.src = new URL('assets/spatial-room-wide.webp',new URL(document.body.dataset.base,document.baseURI)).href;
  loadTimer=setTimeout(start,1600);
  room.decode().catch(()=>{}).then(()=>{if(root.dataset.arrival==='pending')start();});
} }
if(document.readyState==='complete')prepare();else document.addEventListener('DOMContentLoaded',prepare,{once:true});
