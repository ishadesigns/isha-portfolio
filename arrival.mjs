export function arrivalMarkup() {
  return `<div class="arrival-layer" aria-hidden="true" hidden><div class="arrival-lens"></div></div>`;
}
// Runs before the styles and app modules. A failed module must never hide the site.
export const arrivalBoot = `<script>if(!location.hash||location.hash==='#home'){if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.arrival='pending';window.ishaArrivalFallback=setTimeout(()=>{delete document.documentElement.dataset.arrival;document.querySelector('.arrival-layer')?.setAttribute('hidden','');},2500);}}</script>`;
