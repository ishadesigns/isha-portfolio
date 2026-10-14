import {welcomeCue} from './sound-app.js';
// No opening veil, timer, or visual reveal. This remains an explicit sound-only
// action for visitors whose browser refuses audible autoplay.
document.querySelector('[data-arrival-replay]').addEventListener('click',()=>welcomeCue.replay());
