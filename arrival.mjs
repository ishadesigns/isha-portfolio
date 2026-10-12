export function arrivalMarkup() {
  return `<div class="arrival-layer" aria-hidden="true" hidden><div class="arrival-lens"></div><div class="arrival-portal"></div></div>`;
}
// Runs before the styles and app modules. A failed module must never hide the site.
export const arrivalBoot = `<script>if(!location.hash||location.hash==='#home'){if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.arrival='pending';window.ishaArrivalFallback=setTimeout(()=>{delete document.documentElement.dataset.arrival;document.querySelector('.arrival-layer')?.setAttribute('hidden','');document.querySelectorAll('[data-arrival-inert]').forEach(el=>{el.inert=false;delete el.dataset.arrivalInert;});},8000);}}</script>`;
