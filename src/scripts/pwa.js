/* Offline status, service worker, and quiet prefetch. No visual change until the network drops. */
(function () {
  var chip;
  var hideT;
  function say(text, stay) {
    if (!chip) {
      chip = document.createElement('p');
      chip.className = 'av-net';
      chip.setAttribute('role', 'status');
      chip.setAttribute('aria-live', 'polite');
      document.body.appendChild(chip);
    }
    chip.textContent = text;
    chip.hidden = false;
    clearTimeout(hideT);
    if (!stay) hideT = setTimeout(function () { chip.hidden = true; }, 3000);
  }
  var offline = !navigator.onLine;
  function showOffline() { offline = true; say('Offline: showing saved pages', true); }
  function showOnline() { if (!offline) return; offline = false; say('Back online', false); }
  if (offline) showOffline();
  addEventListener('offline', showOffline);
  addEventListener('online', showOnline);
  navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data.type === 'SERVED_FROM_CACHE' || data.type === 'OFFLINE') showOffline();
  });
  function askWorker() {
    var worker = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (worker) worker.postMessage({ type: 'NAV_STATUS' });
  }
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(askWorker).catch(function () {});
    navigator.serviceWorker.addEventListener('controllerchange', askWorker);
  }
  var pingT = 0;
  function ping() {
    if (document.hidden) return;
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 4000);
    fetch('/ping.txt', { cache: 'no-store', signal: ctrl.signal }).then(function (res) {
      clearTimeout(timer);
      if (res && res.ok) showOnline();
      else showOffline();
    }).catch(function () { clearTimeout(timer); showOffline(); });
  }
  function later() {
    var low = document.documentElement.getAttribute('data-perf') === 'low';
    clearTimeout(pingT);
    pingT = setTimeout(function () { ping(); later(); }, low ? 40000 : 18000);
  }
  setTimeout(ping, 2000);
  later();

  function settle(img) { img.classList.remove('av-wait'); }
  function watch(img) {
    if (img.complete && img.naturalWidth) { settle(img); return; }
    img.classList.add('av-wait');
    img.addEventListener('load', function () { settle(img); });
    img.addEventListener('error', function () { settle(img); });
  }
  function imgs(root) { return Array.prototype.slice.call((root || document).querySelectorAll('img')); }
  if (document.body) imgs().forEach(watch);
  if (window.MutationObserver && document.body) {
    new MutationObserver(function (records) {
      records.forEach(function (record) {
        Array.prototype.forEach.call(record.addedNodes, function (node) {
          if (!node || !node.tagName) return;
          if (node.tagName === 'IMG') watch(node);
          else if (node.querySelectorAll) imgs(node).forEach(watch);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  function busy() {
    if (document.hidden) return true;
    if (window.AV && window.AV.paused) return true;
    return false;
  }
  var scrolling = false;
  var scrollT;
  addEventListener('scroll', function () {
    scrolling = true;
    clearTimeout(scrollT);
    scrollT = setTimeout(function () { scrolling = false; }, 700);
  }, { passive: true });

  function allowHeavy() {
    var net = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!net) return true;
    if (net.saveData) return false;
    return net.effectiveType !== 'slow-2g' && net.effectiveType !== '2g';
  }

  function prefetch(url) {
    if (busy() || scrolling) return Promise.resolve();
    return fetch(url, { credentials: 'same-origin' }).catch(function () {});
  }

  function warm() {
    var pages = ['/verdicta', '/veritune', '/pilot', '/journey', '/privacy', '/terms', '/accessibility', '/contact'];
    var here = location.pathname.replace(/\/$/, '') || '/';
    var queue = pages.filter(function (path) { return path !== here; });
    if (!allowHeavy()) queue = queue.slice(0, 2);
    var limit = allowHeavy() ? 2 : 1;
    var active = 0;
    function next() {
      if (busy() || scrolling) { setTimeout(next, 800); return; }
      while (active < limit && queue.length) {
        active++;
        prefetch(queue.shift()).then(function () { active--; next(); });
      }
    }
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(function () { fn(); }, 1200); };
    idle(function () { next(); });
  }

  document.addEventListener('pointerenter', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '/' || href.indexOf('//') === 0) return;
    prefetch(href.split('#')[0] || '/');
  }, true);

  addEventListener('load', function () {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    warm();
  });
})();
