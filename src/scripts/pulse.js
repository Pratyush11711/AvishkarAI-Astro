/* Replays the existing twist-button hover animation by itself, every 4 seconds, on a few conversion buttons only
   (hero CTA, free pilot card, closing band). It pauses while the real pointer is on the button or the button has
   keyboard focus, and resumes afterwards. Nav, dock, footer and LinkedIn buttons are not included. */
(function () {
  var EVERY = 4000;      /* gap between pulses of one button */
  var HOLD = 900;        /* how long the hover state is held (the same animation as a real hover) */
  var FIRST = 2500;      /* first pulse after the button becomes visible */
  var GAP = 1600;        /* minimum time between pulses of different buttons */
  var lastPulse = 0;

  function blocked() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return true;
    if (document.hidden) return true;
    if (document.documentElement.getAttribute('data-perf') === 'low') return true;
    if (window.AV && AV.paused) return true;
    var net = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (net && (net.saveData || net.effectiveType === '2g' || net.effectiveType === 'slow-2g')) return true;
    return false;
  }

  var scrolling = false;
  var scrollT;
  addEventListener('scroll', function () {
    scrolling = true;
    clearTimeout(scrollT);
    scrollT = setTimeout(function () { scrolling = false; }, 700);
  }, { passive: true });

  function list() {
    return [
      document.querySelector('.hero .ctas .btn'),
      document.querySelector('.ph .ctas .btn'),
      document.querySelector('.pcta .btn'),
      document.querySelector('.endcta .btn')
    ].filter(Boolean);
  }

  function arm(el) {
    if (el._pulse) return;
    el._pulse = 1;
    var seen = false;
    var hot = false;
    var timer;

    /* only real input counts (synthetic events from this script are not trusted) */
    el.addEventListener('pointerenter', function (e) { if (e.isTrusted) hot = true; });
    el.addEventListener('pointerleave', function (e) { if (e.isTrusted) hot = false; });
    el.addEventListener('focus', function () { hot = true; });
    el.addEventListener('blur', function () { hot = false; });

    function kick(ms) {
      clearTimeout(timer);
      timer = setTimeout(run, ms);
    }

    function run() {
      if (!el.isConnected) return;
      if (!seen) return;                              /* resumes when it scrolls into view */
      if (hot || blocked() || scrolling) { kick(1000); return; }
      var wait = GAP - (performance.now() - lastPulse);
      if (wait > 0) { kick(wait + 50); return; }      /* never two buttons at once */
      lastPulse = performance.now();
      el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }));
      setTimeout(function () {
        if (!hot) el.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }));
      }, HOLD);
      kick(EVERY);
    }

    var io = new IntersectionObserver(function (entries) {
      seen = entries[0].isIntersecting;
      if (seen) kick(FIRST);
      else clearTimeout(timer);
    }, { threshold: 0.55 });
    io.observe(el);
  }

  function boot() {
    list().forEach(arm);
  }
  boot();
  document.addEventListener('astro:page-load', boot);
})();
