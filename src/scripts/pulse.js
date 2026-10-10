/* Brief replay of the existing twist-button hover, on a few conversion buttons only. */
(function () {
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

  function arm(el, stagger) {
    if (el._pulse) return;
    el._pulse = 1;
    var n = 0;
    var seen = false;
    var timer;
    function stop() { el._stop = 1; clearTimeout(timer); }
    el.addEventListener('pointerenter', stop);
    el.addEventListener('focus', stop);
    el.addEventListener('click', stop);
    function kick(ms) {
      clearTimeout(timer);
      if (el._stop || n >= 4) return;
      timer = setTimeout(run, ms);
    }
    function run() {
      if (!seen || el._stop || n >= 4) return;
      if (blocked() || scrolling) { kick(1200); return; }
      el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }));
      setTimeout(function () {
        el.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }));
      }, 900);
      n += 1;
      if (n < 4) kick(5600 + Math.random() * 2200);
    }
    var io = new IntersectionObserver(function (entries) {
      seen = entries[0].isIntersecting;
      if (seen) kick(n ? 0 : 2500 + stagger);
      else clearTimeout(timer);
    }, { threshold: 0.55 });
    io.observe(el);
    el._pulseIo = io;
  }

  function boot() {
    list().forEach(function (el, i) { arm(el, i * 1600); });
  }
  boot();
  document.addEventListener('astro:page-load', boot);
})();
