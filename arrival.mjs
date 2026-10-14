export function arrivalMarkup(base,version) {
  return `<audio id="welcome-audio" src="${base}assets/welcome-chime.wav?v=${version}" preload="auto" aria-hidden="true" hidden></audio>`;
}
