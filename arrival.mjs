export function arrivalMarkup() {
  return `<section class="arrival-layer" aria-label="Entering Isha’s space" hidden>
    <div class="arrival-lens" aria-hidden="true"></div>
    <div class="arrival-scan" aria-hidden="true"></div>
    <div class="arrival-portal" aria-hidden="true"><span class="arrival-portal-line"></span><span class="arrival-portal-title">Isha</span><span class="arrival-portal-subtitle">A little beyond the screen.</span><span class="arrival-portal-line"></span></div>
    <div class="arrival-caption" aria-hidden="true"><span>YOUR PERSPECTIVE, EXPANDED</span><p>Make yourself at home.</p></div>
    <div class="arrival-controls"><button type="button" data-arrival-sound aria-pressed="false">Sound on</button><button type="button" data-arrival-skip>Skip intro <span aria-hidden="true">↗</span></button></div>
    <span class="sr-only" data-arrival-status role="status" aria-live="polite"></span>
  </section>`;
}
// Runs before the styles and app modules. A failed module must never hide the site.
export const arrivalBoot = `<script>if(!location.hash||location.hash==='#home'){if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.arrival='pending';window.ishaArrivalFallback=setTimeout(()=>{delete document.documentElement.dataset.arrival;document.querySelector('.arrival-layer')?.setAttribute('hidden','');document.querySelectorAll('[data-arrival-inert]').forEach(el=>{el.inert=false;delete el.dataset.arrivalInert;});},8000);}}</script>`;
