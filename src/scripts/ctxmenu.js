/* Custom right-click menu.

   One isolated component: it listens for `contextmenu` on the document, builds a menu that matches what was clicked
   (link, image, selected text, or plain page), and positions it inside the viewport. Nothing else on the site is touched.

   - Shift + right-click, inputs, textareas, selects, editable areas, video, audio and iframes keep the native browser menu.
   - Animations use GSAP, loaded lazily. Until it arrives, and when GSAP fails to load, the Web Animations API plays the
     same motion. With prefers-reduced-motion nothing is animated.
   - Document-level listeners exist only while the menu is open. The one permanent listener is removed by destroy(). */

var ICON = {
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  fwd: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  reload: '<path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  save: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  print: '<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z"/>',
  full: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  exit: '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>',
  tab: '<path d="M14 4h6v6M10 14 20 4M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-9 9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  inspect: '<path d="M4 4l7 16 2.5-6.5L20 11z"/>'
};

var MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
var SC = {
  reload: MAC ? '⌘R' : 'Ctrl+R',
  print: MAC ? '⌘P' : 'Ctrl+P',
  inspect: MAC ? '⌘⌥C' : 'Ctrl+Shift+C',
  source: MAC ? '⌘⌥U' : 'Ctrl+U'
};

var NATIVE = 'input,textarea,select,video,audio,iframe,object,embed,[contenteditable=""],[contenteditable="true"]';
var MARGIN = 8;

var root, menu, toastEl, gsap = null, gsapTried = false;
var isOpen = false, closing = 0, ctx = null, lastFocus = null, toastT = 0, anim = null, tanim = null;
var live = [];   /* listeners that exist only while the menu is open */

/* ---------- history (Back / Forward availability) ----------
   The Navigation API knows exactly. Elsewhere, each history entry is tagged with its position so Forward is only
   offered when there really is a later entry in this tab. */
function trackHistory() {
  if (window.navigation) return;
  try {
    var st = history.state, idx = st && typeof st.avIdx === 'number' ? st.avIdx : null;
    var cur = parseInt(sessionStorage.getItem('av-hc'), 10);
    if (isNaN(cur)) cur = -1;
    if (idx === null) {
      idx = cur + 1;
      sessionStorage.setItem('av-hm', String(idx));
      history.replaceState(Object.assign({}, st && typeof st === 'object' ? st : {}, { avIdx: idx }), '');
    }
    sessionStorage.setItem('av-hc', String(idx));
  } catch (e) { /* storage or history blocked: fall back to history.length only */ }
}
function canBack() { return window.navigation ? navigation.canGoBack : history.length > 1; }
function canForward() {
  if (window.navigation) return navigation.canGoForward;
  try {
    var st = history.state, idx = st && typeof st.avIdx === 'number' ? st.avIdx : -1;
    return idx > -1 && idx < parseInt(sessionStorage.getItem('av-hm'), 10);
  } catch (e) { return false; }
}

/* ---------- helpers ---------- */
function reduced() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
function fsEnabled() { return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled); }
function fileName(s) { return (String(s || '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80)) || 'page'; }

function svg(name) {
  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = ICON[name] || '';   /* static markup from the ICON table above, never user input */
  return s;
}

function copyText(text) {
  var fallback = function () {
    var sel = window.getSelection(), saved = [], i, prev = document.activeElement;
    for (i = 0; sel && i < sel.rangeCount; i++) saved.push(sel.getRangeAt(i));
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    if (sel) { sel.removeAllRanges(); saved.forEach(function (r) { sel.addRange(r); }); }   /* the reader's selection stays */
    if (prev && prev.focus && prev !== document.body) prev.focus({ preventScroll: true });
    return ok;
  };
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
  }
  return Promise.resolve(fallback());
}

function download(blobOrUrl, name) {
  var url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  var a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (typeof blobOrUrl !== 'string') setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
}

function openTab(url) {
  var a = document.createElement('a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function toPng(blob) {
  if (blob.type === 'image/png') return Promise.resolve(blob);
  return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(blob), img = new Image();
    img.onload = function () {
      try {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth || 1; c.height = img.naturalHeight || 1;
        c.getContext('2d').drawImage(img, 0, 0);
        c.toBlob(function (b) { URL.revokeObjectURL(url); b ? resolve(b) : reject(new Error('encode')); }, 'image/png');
      } catch (e) { URL.revokeObjectURL(url); reject(e); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
    img.src = url;
  });
}

function imageName(src, blob) {
  var n = '';
  try { n = decodeURIComponent(new URL(src, location.href).pathname.split('/').pop() || ''); } catch (e) { n = ''; }
  if (n && /\.[a-z0-9]{2,5}$/i.test(n)) return fileName(n);
  var ext = blob && /^image\/([a-z0-9+.-]+)/i.exec(blob.type);
  return fileName(n || 'image') + '.' + (ext ? ext[1].replace('svg+xml', 'svg').replace('jpeg', 'jpg') : 'png');
}

/* ---------- actions ---------- */
var A = {
  back: function () { history.back(); },
  forward: function () { history.forward(); },
  reload: function () { location.reload(); },

  copyAddress: function () {
    return copyText(location.href).then(function (ok) { toast(ok ? 'Page address copied' : 'Could not copy. Select the address bar and press ' + (MAC ? '⌘C' : 'Ctrl+C'), !ok); });
  },
  savePage: function () {
    var clone = document.documentElement.cloneNode(true), mine = clone.querySelector('.avcm-root');
    if (mine) mine.remove();
    var head = clone.querySelector('head');
    if (head && !clone.querySelector('base')) {
      var base = document.createElement('base');
      base.href = location.href;      /* keeps images, fonts and styles loading from the live site */
      head.insertBefore(base, head.firstChild);
    }
    var name = fileName(document.title) + '.html';
    download(new Blob(['<!DOCTYPE html>\n' + clone.outerHTML], { type: 'text/html;charset=utf-8' }), name);
    toast('Saved ' + name);
  },
  print: function () { window.print(); },
  fullscreen: function () {
    var el = document.documentElement;
    if (fsElement()) {
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) Promise.resolve(exit.call(document)).catch(function () { toast('Could not exit fullscreen', true); });
      return;
    }
    var req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req) { toast('Fullscreen is not supported in this browser', true); return; }
    Promise.resolve(req.call(el)).catch(function () { toast('The browser blocked fullscreen', true); });
  },

  openLinkTab: function (c) { openTab(c.link.href); },
  openLinkHere: function (c) {
    var l = c.link;
    if (!l.target || l.target === '_self') l.click(); else location.assign(l.href);
  },
  copyLink: function (c) {
    return copyText(c.link.href).then(function (ok) { toast(ok ? 'Link address copied' : 'Could not copy the link', !ok); });
  },

  openImage: function (c) { openTab(c.imgSrc); },
  copyImageAddress: function (c) {
    return copyText(c.imgSrc).then(function (ok) { toast(ok ? 'Image address copied' : 'Could not copy the address', !ok); });
  },
  saveImage: function (c) {
    if (/^data:/i.test(c.imgSrc)) { download(c.imgSrc, imageName('', { type: (/^data:([^;,]+)/.exec(c.imgSrc) || [])[0] || '' })); toast('Image saved'); return; }
    return fetch(c.imgSrc, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.blob();
    }).then(function (b) {
      download(b, imageName(c.imgSrc, b));
      toast('Image saved');
    }).catch(function () {
      /* cross-origin or blocked: let the browser handle the file directly */
      download(c.imgSrc, imageName(c.imgSrc));
      toast('Image download started');
    });
  },
  copyImage: function (c) {
    return fetch(c.imgSrc, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.blob();
    }).then(toPng).then(function (png) {
      return navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    }).then(function () { toast('Image copied'); }, function () { toast('The browser would not let this image be copied', true); });
  },

  copySelection: function (c) {
    return copyText(c.text).then(function (ok) { toast(ok ? 'Text copied' : 'Could not copy the text', !ok); });
  },
  searchSelection: function (c) {
    openTab('https://www.google.com/search?q=' + encodeURIComponent(c.text.slice(0, 300)));
  },

  viewSource: function () {
    var w = window.open('', '_blank');   /* opened now, inside the click, so pop-up blockers allow it */
    if (!w) { toast('Pop-up blocked. Press ' + SC.source + ' to view the source', true); return; }
    fetch(location.href.split('#')[0], { cache: 'force-cache', credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.text();
    }).then(function (t) {
      var url = URL.createObjectURL(new Blob([t], { type: 'text/plain;charset=utf-8' }));
      w.location.replace(url);
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    }).catch(function () {
      try { w.close(); } catch (e) { /* already closed */ }
      toast('Could not load the source. Press ' + SC.source + ' instead', true);
    });
  },
  inspect: function () {
    toast('Press ' + SC.inspect + ' or F12 to open the browser inspector', false, 4200);
  }
};

/* ---------- what to show ---------- */
function groupsFor(c) {
  var out = [], g;

  /* what was clicked comes first, like a browser menu */
  g = [];
  if (c.text) {
    var shown = c.text.length > 28 ? c.text.slice(0, 28).trim() + '…' : c.text;
    g.push({ label: 'Copy', icon: 'copy', sc: MAC ? '⌘C' : 'Ctrl+C', run: A.copySelection });
    g.push({ label: 'Search Google for “' + shown.replace(/\s+/g, ' ') + '”', icon: 'search', run: A.searchSelection });
  }
  if (c.link) {
    g.push({ label: 'Open Link in New Tab', icon: 'tab', run: A.openLinkTab });
    g.push({ label: 'Open Link in Current Tab', icon: 'fwd', run: A.openLinkHere });
    g.push({ label: 'Copy Link Address', icon: 'copy', run: A.copyLink });
  }
  if (c.imgSrc) {
    var canClip = !!(window.isSecureContext && navigator.clipboard && navigator.clipboard.write && window.ClipboardItem);
    g.push({ label: 'Open Image in New Tab', icon: 'image', run: A.openImage });
    g.push({ label: 'Copy Image', icon: 'copy', disabled: !canClip, run: A.copyImage });
    g.push({ label: 'Copy Image Address', icon: 'copy', run: A.copyImageAddress });
    g.push({ label: 'Save Image', icon: 'save', run: A.saveImage });
  }
  if (g.length) out.push(g);

  out.push([
    { label: 'Back', icon: 'back', sc: MAC ? '⌘[' : 'Alt+←', disabled: !canBack(), run: A.back },
    { label: 'Forward', icon: 'fwd', sc: MAC ? '⌘]' : 'Alt+→', disabled: !canForward(), run: A.forward },
    { label: 'Reload', icon: 'reload', sc: SC.reload, run: A.reload }
  ]);

  var fs = !!fsElement();
  out.push([
    { label: 'Copy Page Address', icon: 'copy', run: A.copyAddress },
    { label: 'Save Page', icon: 'save', run: A.savePage },
    { label: 'Print Page', icon: 'print', sc: SC.print, run: A.print },
    { label: fs ? 'Exit Fullscreen' : 'Enter Fullscreen', icon: fs ? 'exit' : 'full', disabled: !fsEnabled(), run: A.fullscreen }
  ]);

  out.push([
    { label: 'View Page Source', icon: 'code', sc: SC.source, run: A.viewSource },
    { label: 'Inspect Element', icon: 'inspect', sc: SC.inspect, run: A.inspect }
  ]);
  return out;
}

function selectionText(x, y) {
  var sel = window.getSelection && window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return '';
  var text = sel.toString().trim();
  if (!text) return '';
  /* only when the click landed on the selection itself */
  var rects = sel.getRangeAt(0).getClientRects();
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i];
    if (x >= r.left - 3 && x <= r.right + 3 && y >= r.top - 3 && y <= r.bottom + 3) return text.slice(0, 5000);
  }
  return '';
}

/* ---------- DOM ---------- */
function build() {
  if (root) return;
  root = document.createElement('div');
  root.className = 'avcm-root';
  menu = document.createElement('div');
  menu.className = 'avcm';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Page context menu');
  menu.tabIndex = -1;
  menu.hidden = true;
  toastEl = document.createElement('div');
  toastEl.className = 'avcm-toast';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.hidden = true;
  root.appendChild(menu);
  root.appendChild(toastEl);
  document.body.appendChild(root);

  /* keep the page selection (needed for Copy) and stop clicks reaching the page */
  menu.addEventListener('mousedown', function (e) { e.preventDefault(); });
  menu.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  menu.addEventListener('click', function (e) {
    var it = e.target.closest && e.target.closest('.avcm-i');
    if (!it || !menu.contains(it)) return;
    e.preventDefault();
    e.stopPropagation();
    if (it.getAttribute('aria-disabled') === 'true') return;
    var run = it._run, c = ctx;
    close(true, true);
    try {
      var r = run(c);
      if (r && r.catch) r.catch(function () { toast('That action failed', true); });
    } catch (err) { toast('That action failed', true); }
  });
}

function render(groups) {
  menu.textContent = '';
  groups.forEach(function (g, gi) {
    if (gi) {
      var sep = document.createElement('div');
      sep.className = 'avcm-sep';
      sep.setAttribute('role', 'separator');
      menu.appendChild(sep);
    }
    g.forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'avcm-i';
      b.setAttribute('role', 'menuitem');
      b.tabIndex = -1;
      if (d.disabled) b.setAttribute('aria-disabled', 'true');
      b.appendChild(svg(d.icon));
      var l = document.createElement('span');
      l.className = 'avcm-l';
      l.textContent = d.label;
      b.appendChild(l);
      if (d.sc) {
        var k = document.createElement('kbd');
        k.className = 'avcm-k';
        k.textContent = d.sc;
        b.appendChild(k);
      }
      b._run = d.run;
      menu.appendChild(b);
    });
  });
  var hint = document.createElement('div');
  hint.className = 'avcm-hint';
  hint.setAttribute('role', 'presentation');
  hint.textContent = 'Shift + right-click for the browser menu';
  menu.appendChild(hint);
}

function items() {
  return Array.prototype.filter.call(menu.querySelectorAll('.avcm-i'), function (b) { return b.getAttribute('aria-disabled') !== 'true'; });
}

function place(x, y) {
  var vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
  menu.style.maxHeight = Math.max(120, vh - MARGIN * 2) + 'px';
  menu.style.left = '0px';
  menu.style.top = '0px';
  var w = menu.offsetWidth, h = menu.offsetHeight;
  var px = x + w + MARGIN > vw ? x - w : x;           /* no room on the right: open to the left of the pointer */
  var py = y + h + MARGIN > vh ? y - h : y;           /* no room below: open above the pointer */
  px = Math.min(Math.max(px, MARGIN), Math.max(MARGIN, vw - w - MARGIN));
  py = Math.min(Math.max(py, MARGIN), Math.max(MARGIN, vh - h - MARGIN));
  menu.style.left = Math.round(px) + 'px';
  menu.style.top = Math.round(py) + 'px';
  menu.style.transformOrigin = Math.round(Math.min(Math.max(x - px, 0), w)) + 'px ' + Math.round(Math.min(Math.max(y - py, 0), h)) + 'px';
}

/* ---------- animation ---------- */
function stopAnim() {
  if (anim) { anim.cancel(); anim = null; }
  if (gsap) { gsap.killTweensOf(menu); gsap.killTweensOf(menu.querySelectorAll('.avcm-i')); gsap.set(menu, { clearProps: 'opacity,transform' }); gsap.set(menu.querySelectorAll('.avcm-i'), { clearProps: 'opacity,transform' }); }
  menu.style.opacity = '';
  menu.style.transform = '';
}
function animateIn() {
  if (reduced()) return;
  if (gsap) {
    gsap.fromTo(menu, { opacity: 0, scale: .96, y: 6 }, { opacity: 1, scale: 1, y: 0, duration: .2, ease: 'power3.out', clearProps: 'opacity,transform' });
    gsap.fromTo(menu.querySelectorAll('.avcm-i'), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: .18, stagger: .008, ease: 'power2.out', clearProps: 'opacity,transform' });
  } else if (menu.animate) {
    anim = menu.animate([{ opacity: 0, transform: 'translateY(6px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.215,.61,.355,1)' });
  }
}
function animateOut(done) {
  if (reduced()) { done(); return; }
  if (gsap) { gsap.to(menu, { opacity: 0, scale: .97, duration: .12, ease: 'power2.in', overwrite: true, onComplete: done }); return; }
  if (menu.animate) {
    anim = menu.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.97)' }], { duration: 120, easing: 'ease-in', fill: 'forwards' });
    anim.onfinish = done;
    return;
  }
  done();
}

function loadGsap() {
  if (gsapTried) return;
  gsapTried = true;
  import('gsap').then(function (m) { gsap = m.gsap || m.default; }, function () { gsap = null; });
}

/* ---------- toast ---------- */
function toast(msg, isError, ms) {
  if (!root) build();
  clearTimeout(toastT);
  if (tanim) { tanim.cancel(); tanim = null; }
  toastEl.textContent = msg;
  toastEl.classList.toggle('err', !!isError);
  toastEl.hidden = false;
  if (!reduced() && toastEl.animate) tanim = toastEl.animate([{ opacity: 0, transform: 'translate(-50%,8px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 180, easing: 'cubic-bezier(.215,.61,.355,1)' });
  toastT = setTimeout(function () {
    var hide = function () { toastEl.hidden = true; tanim = null; };
    if (reduced() || !toastEl.animate) { hide(); return; }
    tanim = toastEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    tanim.onfinish = hide;
  }, ms || 1900);
}

/* ---------- open / close ---------- */
function on(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  live.push(function () { target.removeEventListener(type, fn, opts); });
}

function open(e, c) {
  build();
  loadGsap();
  var wasOpen = isOpen;
  closing++;                                   /* cancels a close that is still animating */
  if (!wasOpen) lastFocus = document.activeElement;
  ctx = c;
  stopAnim();
  render(groupsFor(c));
  menu.hidden = false;
  menu.style.pointerEvents = '';
  menu.removeAttribute('aria-hidden');
  menu.style.visibility = 'hidden';
  place(e.clientX, e.clientY);
  menu.style.visibility = '';
  isOpen = true;
  animateIn();
  /* A pointer-opened menu leaves focus where it was, so the page selection survives (Safari drops it on focus).
     Hover highlights with :hover, and the first arrow key moves focus into the menu. A keyboard-opened one focuses item one. */
  if (e.button !== 2) { var first = items()[0]; if (first) first.focus({ preventScroll: true }); }

  if (!wasOpen) listen();
}

function listen() {
  on(document, 'pointerdown', function (e) {
    if (e.button === 2 && !(root && root.contains(e.target))) return;   /* the contextmenu event decides what happens */
    if (root && root.contains(e.target)) return;
    close(false, false);
  }, true);
  on(document, 'keydown', onKey, true);
  on(window, 'scroll', function (e) { if (!(menu && menu.contains(e.target))) close(true, false); }, { capture: true, passive: true });
  on(window, 'resize', function () { close(true, false); });
  on(window, 'blur', function () { close(true, false); });
  on(window, 'pagehide', function () { close(true, false); });
  on(window, 'popstate', function () { close(true, false); });
  on(window, 'hashchange', function () { close(true, false); });
  on(document, 'visibilitychange', function () { if (document.hidden) close(true, false); });
  on(document, 'focusin', function (e) { if (root && !root.contains(e.target)) close(false, false); });
  on(document, 'fullscreenchange', refresh);
  on(document, 'webkitfullscreenchange', refresh);
}

function refresh() {
  if (!isOpen || !ctx) return;
  var keep = document.activeElement && document.activeElement.textContent;
  render(groupsFor(ctx));
  var again = items().filter(function (b) { return b.textContent === keep; })[0];
  (again || menu).focus({ preventScroll: true });
}

function close(instant, restore) {
  if (!isOpen) return;
  isOpen = false;
  live.splice(0).forEach(function (off) { off(); });
  var token = ++closing;
  menu.style.pointerEvents = 'none';           /* nothing can be clicked while it fades */
  menu.setAttribute('aria-hidden', 'true');
  var f = lastFocus;
  var finish = function () {
    if (token !== closing) return;             /* reopened meanwhile */
    anim = null;
    if (gsap) gsap.set(menu, { clearProps: 'opacity,transform' });
    menu.style.opacity = '';
    menu.style.transform = '';
    menu.hidden = true;
    menu.textContent = '';
    ctx = null;
  };
  if (restore !== false && f && f.isConnected && typeof f.focus === 'function' && f !== document.body) f.focus({ preventScroll: true });
  else if (document.activeElement && menu.contains(document.activeElement)) document.activeElement.blur();
  if (instant === true && reduced()) finish(); else animateOut(finish);
}

function onKey(e) {
  if (!isOpen) return;
  var list = items(), i = list.indexOf(document.activeElement), k = e.key, handled = true;
  if (k === 'Escape') close(false, true);
  else if (k === 'ArrowDown') (list[i < 0 ? 0 : (i + 1) % list.length] || menu).focus({ preventScroll: true });
  else if (k === 'ArrowUp') (list[i < 0 ? list.length - 1 : (i - 1 + list.length) % list.length] || menu).focus({ preventScroll: true });
  else if (k === 'Home') (list[0] || menu).focus({ preventScroll: true });
  else if (k === 'End') (list[list.length - 1] || menu).focus({ preventScroll: true });
  else if (k === 'Enter' || k === ' ' || k === 'Spacebar') { if (i > -1) list[i].click(); }
  else if (k === 'Tab') { close(false, true); handled = false; }
  else handled = false;
  if (handled) { e.preventDefault(); e.stopPropagation(); }
}

/* ---------- entry ---------- */
function onContext(e) {
  if (e.shiftKey) { close(true, false); return; }               /* Shift + right-click: native browser menu */
  if (e.defaultPrevented) return;
  var t = e.target;
  if (!(t instanceof Element)) t = t && t.parentElement;
  if (!t) return;
  if (root && root.contains(t)) { e.preventDefault(); return; }
  if (e.pointerType === 'touch' || t.isContentEditable || t.closest(NATIVE)) { close(true, false); return; }

  var link = t.closest('a[href]');
  if (link && (/^javascript:/i.test(link.getAttribute('href') || '') || !link.href)) link = null;
  var img = t.closest('img');
  if (!img && t.tagName === 'CANVAS') {
    /* the artwork on product cards is drawn over its <img> by a WebGL canvas: the picture underneath is what was clicked */
    var stack = document.elementsFromPoint(e.clientX, e.clientY);
    for (var s = 0; s < stack.length; s++) { if (stack[s].tagName === 'IMG') { img = stack[s]; break; } if (stack[s].tagName !== 'CANVAS') break; }
  }
  var src = img ? (img.currentSrc || img.src) : '';
  if (src && !/^(https?:|data:image\/|blob:)/i.test(src)) src = '';

  e.preventDefault();
  open(e, { link: link, imgSrc: src, text: selectionText(e.clientX, e.clientY) });
}

function destroy() {
  document.removeEventListener('contextmenu', onContext);
  live.splice(0).forEach(function (off) { off(); });
  clearTimeout(toastT);
  if (root) root.remove();
  root = menu = toastEl = null;
  isOpen = false;
  if (window.__avcm === api) window.__avcm = null;
}

var api = { destroy: destroy, close: function () { close(true, false); } };
if (window.__avcm && window.__avcm.destroy) window.__avcm.destroy();   /* never two instances after a re-run */
window.__avcm = api;
trackHistory();
addEventListener('pageshow', function (e) { if (e.persisted) trackHistory(); });
document.addEventListener('contextmenu', onContext);
/* fetch GSAP once the page is idle, so the first menu already uses it */
if (window.requestIdleCallback) addEventListener('load', function () { requestIdleCallback(loadGsap, { timeout: 6000 }); });
if (import.meta.hot) import.meta.hot.dispose(destroy);
