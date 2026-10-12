// Native media gives us actual playback/error events and browser autoplay handling.
export function createWelcomePlayer({element,active=()=>true,onState=()=>{},onProgress=()=>{}}) {
  let generation=0;
  element.volume=.8;element.muted=false;
  element.addEventListener('timeupdate',()=>onProgress(element.currentTime));
  element.addEventListener('ended',()=>onState('ended'));
  async function arrival() {
    const id=++generation;
    element.pause();element.currentTime=0;
    if(!active())return false;
    onState('starting');
    try {
      await element.play();
      if(id!==generation||!active()){if(id===generation)element.pause();return false;}
      onState('playing');return true;
    } catch(error) {
      if(id===generation)onState(error.name==='NotAllowedError'?'blocked':'failed');
      return false;
    }
  }
  function stopArrival(){++generation;element.pause();onState('stopped');}
  return {arrival,stopArrival};
}
