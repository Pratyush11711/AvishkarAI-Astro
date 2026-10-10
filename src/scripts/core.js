var AV=(function(){
'use strict';
var MARK_D="M 265.919 48.866 C 262.459 52.378, 257.754 56.445, 251.500 61.332 C 246.994 64.852, 237.160 70.385, 229.930 73.468 C 219.669 77.844, 217.006 78.822, 208 81.528 C 203.325 82.932, 196.575 84.969, 193 86.055 C 189.425 87.141, 185.857 88.022, 185.071 88.014 C 184.285 88.007, 180.685 88.873, 177.071 89.939 C 170.150 91.982, 161.171 94.344, 152 96.534 C 145.784 98.018, 134.863 100.951, 124.500 103.918 C 120.650 105.020, 115.250 106.565, 112.500 107.352 C 104.817 109.551, 94.844 112.946, 91.349 114.552 C 89.616 115.348, 87.694 116, 87.078 116 C 85.091 116, 68.679 124.323, 62.500 128.465 C 54.064 134.120, 38.259 150.191, 32.962 158.500 C 25.245 170.606, 21.679 178.967, 19.002 191.232 C 15.644 206.620, 17.286 229.320, 22.657 241.760 C 30.953 260.976, 37.788 270.174, 52.586 282.033 C 58.135 286.481, 75.096 296, 77.472 296 C 78.016 296, 80.720 296.858, 83.481 297.907 C 101.922 304.915, 130.011 305.115, 150 298.381 C 152.475 297.547, 155.850 296.487, 157.500 296.025 C 161.015 295.040, 173.552 288.652, 180 284.560 C 186.660 280.334, 201.024 265.503, 206.207 257.500 C 210.845 250.339, 219.995 231.920, 220.006 229.722 C 220.010 229.050, 220.701 227.179, 221.543 225.565 C 222.384 223.952, 223.476 221.027, 223.969 219.065 C 225.654 212.358, 232.408 194.010, 234.852 189.500 C 247.038 167.013, 271.402 164.875, 281.131 185.438 C 284.537 192.638, 284.725 197.080, 281.925 204.213 C 278.336 213.357, 271.764 218.513, 261.996 219.849 C 252.030 221.212, 252.899 223.957, 263.305 223.985 C 284.233 224.040, 298.436 200.107, 289.138 180.453 C 285.868 173.542, 278.886 166.355, 271.500 162.300 C 266.877 159.761, 265.633 159.552, 255 159.527 C 244.164 159.502, 243.162 159.673, 237.643 162.500 C 225.461 168.740, 217.660 178.582, 205.545 203 C 197.507 219.200, 197.223 219.727, 192.597 227 C 188.130 234.022, 174.149 247.146, 167.957 250.129 C 154.103 256.802, 155.534 256.485, 139.500 256.442 C 126.263 256.406, 123.853 256.136, 119 254.139 C 90.898 242.580, 77.051 225.189, 77.013 201.410 C 77 193.062, 79.514 180.978, 82.405 175.500 C 83.275 173.850, 83.990 172.148, 83.994 171.718 C 83.997 171.287, 86.127 167.687, 88.728 163.718 C 94.705 154.592, 106.441 142.841, 115.500 136.912 C 129.933 127.466, 131.104 126.833, 147 119.893 C 153.325 117.132, 159.400 114.463, 160.500 113.963 C 161.600 113.463, 164.412 112.367, 166.750 111.527 C 169.088 110.687, 172.912 109.310, 175.250 108.467 C 177.588 107.624, 180.850 106.320, 182.500 105.570 C 184.150 104.820, 187.975 103.200, 191 101.970 C 223.766 88.649, 257.364 66.105, 268.053 50.267 C 272.532 43.630, 271.650 43.051, 265.919 48.866";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement,B=document.body;
root.classList.add('js');
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function sm(t){t=clamp(t,0,1);return t*t*(3-2*t)}
function eio(t){t=clamp(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function eo(t){t=clamp(t,0,1);return 1-Math.pow(1-t,4)}
function expo(t){t=clamp(t,0,1);return t===0?0:t===1?1:t<.5?Math.pow(2,20*t-10)/2:(2-Math.pow(2,-20*t+10))/2}
function hex(h){h=(h||'#000').trim().replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
function tok(n){return getComputedStyle(root).getPropertyValue(n).trim()}
function isDark(){return root.getAttribute('data-theme')==='dark'}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
function tween(o){var t0=performance.now()+(o.delay||0)*1000,d=(o.dur||1)*1000,e=o.ease||eio;(function f(n){if(n<t0){requestAnimationFrame(f);return}var p=clamp((n-t0)/d,0,1);o.update(e(p),p);if(p<1)requestAnimationFrame(f);else if(o.done)o.done()})(performance.now())}
var loops=[],readyFns=[],themeHooks=[];
/* when a section comes near, force one scroll-driven update (IO reports a frame late, after a jump the scroll value may not change again) */
function near(el,m){var o={v:false};if(!el)return o;new IntersectionObserver(function(e){var v=e[0].isIntersecting;if(v&&!o.v)nearKick++;o.v=v},{rootMargin:(m||200)+'px 0px'}).observe(el);return o}
var nearKick=0;
/* layout cache: document offsets measured once, refreshed only when the page size changes.
   Scroll driven loops read positions from here instead of calling getBoundingClientRect every frame. */
var LV=0;function bumpLayout(){LV++}
addEventListener('resize',bumpLayout);if(window.ResizeObserver)new ResizeObserver(bumpLayout).observe(document.documentElement);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(bumpLayout);
function box(el){var c=el._bx;if(!c||c.v!==LV){var t=0,l=0,n=el;while(n){t+=n.offsetTop;l+=n.offsetLeft;n=n.offsetParent}c=el._bx={v:LV,t:t,l:l,h:el.offsetHeight,w:el.offsetWidth}}
  var y=scrollY;return {top:c.t-y,bottom:c.t-y+c.h,height:c.h,left:c.l,width:c.w}}
var AV={near:near,box:box,$:$,$$:$$,RM:RM,FINE:FINE,clamp:clamp,lerp:lerp,sm:sm,eio:eio,eo:eo,expo:expo,hex:hex,tok:tok,isDark:isDark,tween:tween,MARK_D:MARK_D,
  on:function(f){loops.push(f)},ready:function(f){readyFns.push(f)},theme:function(f){themeHooks.push(f)},mx:-100,my:-100,pvx:0,vel:0,intro:null};

/* ---------- favicon + tab title ----------
   On the page the mark stays white. Leaving the tab blinks it orange, then white. */
var fav=document.querySelector('link[rel="icon"]');
if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav)}
fav.type='image/svg+xml';
document.querySelectorAll('link[rel="icon"]').forEach(function(n){if(n!==fav)n.remove()});
var awayFav=false;
function setFav(){var c=awayFav?'#FF5B1F':'#FFFFFF';fav.href='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 26 310 292"><path fill="'+c+'" fill-rule="evenodd" d="'+MARK_D+'"/></svg>')}
setFav();
var baseTitle=document.title,away=['Your calls are still talking','97 in 100 calls go unheard','Your free pilot is waiting','Come back, every call counts'],tt=null,tk2=0,awayT=null;
function blink(){var msg=away[Math.floor(tk2/3)%away.length],fr=['●','○'][tk2%2];document.title=fr+' '+msg;awayFav=tk2%2===0;setFav();tk2++}
document.addEventListener('visibilitychange',function(){
  if(document.hidden){tk2=0;blink();clearInterval(tt);tt=setInterval(blink,1000)}
  else{clearInterval(tt);awayFav=false;setFav();document.title='Welcome back to Avishkar AI';clearTimeout(awayT);awayT=setTimeout(function(){document.title=baseTitle},1800)}
});

/* ---------- inject shared svg defs usage helpers ---------- */
AV.markSVG=function(cls){return '<svg class="'+(cls||'mk')+'" viewBox="12 36 290 272"><use href="#mk"/></svg>'};

/* ---------- smooth anchor scroll (native wheel stays native) ---------- */
function scrollToY(y,dur){if(RM){scrollTo(0,y);return}var s=scrollY,d=y-s;tween({dur:dur||1.4,ease:function(x){return x<.5?16*x*x*x*x*x:1-Math.pow(-2*x+2,5)/2},update:function(e){scrollTo(0,s+d*e)}})}
AV.goTo=function(h){var el=h==='#top'?null:$(h);var y=el?el.getBoundingClientRect().top+scrollY:0;scrollToY(y,Math.min(2.2,.9+Math.abs(y-scrollY)/4000))};
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented)return;var h=a.getAttribute('href');
  if(h.charAt(0)==='#'&&h.length>1){e.preventDefault();B.classList.remove('mo');if(AV.beforeAnchor){AV.beforeAnchor(a,function(){AV.goTo(h)});return}AV.goTo(h);return}
});

/* ---------- theme toggle ---------- */
function applyTheme(next){root.setAttribute('data-theme',next);try{localStorage.setItem('av-theme',next)}catch(er){}themeHooks.forEach(function(f){f()})}
var wiping=false;
function wipe(x,y,next){
  var bg=next==='dark'?'#0A0A0B':'#F4F4F2',R=Math.ceil(Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)))+4;
  var el=document.createElement('div');el.className='twipe';el.style.cssText='width:'+R*2+'px;height:'+R*2+'px;margin:'+(-R)+'px 0 0 '+(-R)+'px;left:'+x+'px;top:'+y+'px;background:'+bg;
  B.appendChild(el);wiping=true;
  var a1=el.animate([{transform:'scale(0)'},{transform:'scale(1)'}],{duration:560,easing:'cubic-bezier(.7,0,.25,1)',fill:'forwards'});
  a1.onfinish=function(){root.classList.add('notr');applyTheme(next);void root.offsetWidth;
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.remove('notr');
      var a2=el.animate([{opacity:1},{opacity:0}],{duration:420,easing:'cubic-bezier(.3,0,.2,1)',fill:'forwards'});a2.onfinish=function(){el.remove();wiping=false}})})};
}
function bindTog(){$$('[data-tog]').forEach(function(t){if(t._theme)return;t._theme=1;t.addEventListener('click',function(e){
  if(wiping)return;var next=isDark()?'light':'dark';
  if(RM||!el_animate()){applyTheme(next);return}
  var r=e.currentTarget.getBoundingClientRect();wipe(r.left+r.width/2,r.top+r.height/2,next);
})})}
bindTog();
function el_animate(){return typeof Element!=='undefined'&&Element.prototype.animate}

/* ---------- cursor ---------- */
var cur=$('#cur'),bub=$('#bub'),arw=cur&&$('.arw',cur);
var ax=-100,ay=-100,bx=-100,by=-100,pmx=0;
if(FINE&&cur){root.classList.add('cc');
  addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;AV.mx=e.clientX;AV.my=e.clientY;cur.classList.add('on');
    var t=e.target,lb=t.closest&&t.closest('[data-cursor]'),hv=t.closest&&t.closest('a,button,select,label,[role="tab"]'),tx=t.closest&&t.closest('input,textarea,select');
    cur.classList.toggle('txt',!!tx);
    if(lb){bub.textContent=lb.getAttribute('data-cursor');cur.classList.add('cl');cur.classList.remove('hov')}else{cur.classList.remove('cl');cur.classList.toggle('hov',!!hv)}
  },{passive:true});
  document.addEventListener('mouseleave',function(){cur.classList.remove('on')});
}else{addEventListener('pointermove',function(e){AV.mx=e.clientX;AV.my=e.clientY},{passive:true})}
AV.clearCursor=function(){if(cur)cur.classList.remove('cl','hov')};
loops.push(function(){var mx=AV.mx,my=AV.my;AV.pvx=lerp(AV.pvx,(mx-pmx),.2);pmx=mx;if(!FINE||!cur)return;
  /* settled: skip the style writes so an idle page does no style work */
  if(Math.abs(mx-ax)+Math.abs(my-ay)+Math.abs(mx-bx)+Math.abs(my-by)<.1&&Math.abs(AV.pvx)<.05)return;
  ax+=(mx-ax)*.42;ay+=(my-ay)*.42;bx+=(mx-bx)*.16;by+=(my-by)*.16;
  cur.style.transform='translate3d('+ax+'px,'+ay+'px,0)';arw.style.rotate=clamp(AV.pvx*.6,-18,18)+'deg';bub.style.translate=(bx-ax).toFixed(1)+'px '+(by-ay).toFixed(1)+'px'});

/* ---------- twist buttons ---------- */
var ARW='<svg viewBox="0 0 20 20"><use href="#arr"/></svg>',mags=[];
function twist(b){
  if(b._tw)return;b._tw=1;
  var lab=b.getAttribute('data-label')||'',n=b.classList.contains('sm')?10:(innerWidth<600?10:14),c='<span class="tw-c"><span>'+lab+'</span><span class="tw-ic">'+ARW+'</span></span>',h='<span class="tw-size" aria-hidden="true">'+c+'</span>';
  for(var i=0;i<n;i++)h+='<span class="sl" aria-hidden="true" style="--i:'+i+';--dl:'+(Math.min(i,n-1-i)*48)+'ms"><span class="fc f">'+c+'</span><span class="fc b">'+c+'</span></span>';
  b.innerHTML=h+'<span class="sr">'+lab+'</span>';b.style.setProperty('--n',n);b.setAttribute('aria-label',lab);
  var k=0,sl=$$('.sl',b),armed=false,dT=null,hold=600+Math.ceil(n/2)*48+120;
  function size(){var w=b.offsetWidth;if(w)b.style.setProperty('--w',w+'px')}
  size();if(window.ResizeObserver)new ResizeObserver(size).observe(b);
  function set(){sl.forEach(function(s){s.style.setProperty('--r',(k*180)+'deg')})}
  /* The 3D slices only exist while the button is flipping. At rest the button is flat, so a page with
     many buttons does not carry dozens of 3D compositor layers. Switching is instant at an angle that
     looks identical (0 or a full turn), so nothing visible changes. */
  function snap(fn){b.classList.add('tw-nt');fn();void b.offsetWidth;b.classList.remove('tw-nt')}
  function arm(){clearTimeout(dT);if(armed)return;armed=true;snap(function(){b.classList.add('tw3')})}
  function disarm(){dT=setTimeout(function(){if(k%2===0&&armed){armed=false;snap(function(){b.classList.remove('tw3')})}},hold)}
  function on(){arm();if(k%2===0){k++;set()}}function off(){if(k%2===1){k++;set()}disarm()}
  /* Hover flips the button, keyboard focus flips it, a click does not. Without this, clicking moved focus
     (into a form or popup), the blur flipped the button back mid-click, and it rotated the wrong way. */
  var hov=false;
  b.addEventListener('pointerenter',function(e){if(e.pointerType!=='mouse')return;hov=true;on()});
  b.addEventListener('pointerleave',function(e){if(e.pointerType!=='mouse')return;hov=false;off()});
  b.addEventListener('focus',function(){var fv=false;try{fv=b.matches(':focus-visible')}catch(x){}if(fv)on()});
  b.addEventListener('blur',function(){if(!hov)off()});
  /* back to rest instantly (used when a popup opens or closes and the button is hidden under the pointer) */
  b._twRest=function(){hov=false;clearTimeout(dT);if(k%2===1)k++;snap(function(){set();b.classList.remove('tw3')});armed=false};
  if(b.hasAttribute('data-mag')&&FINE){var m={el:b,x:0,y:0,tx:0,ty:0};mags.push(m);
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();m.tx=(e.clientX-r.left-r.width/2)*.16;m.ty=(e.clientY-r.top-r.height/2)*.3});
    b.addEventListener('pointerleave',function(){m.tx=0;m.ty=0})}
}
AV.twist=twist;
AV.twRest=function(scope){$$('.btn',scope||document).forEach(function(b){if(b._twRest)b._twRest()})};
/* change a twist button's label in place (keeps its listeners) */
AV.relabel=function(b,lab){if(!b.querySelector('.sl')){b.textContent=lab;return}b.setAttribute('data-label',lab);b.setAttribute('aria-label',lab);
  $$('.tw-c>span:first-child',b).forEach(function(s){s.textContent=lab});var sr=$('.sr',b);if(sr)sr.textContent=lab;
  requestAnimationFrame(function(){var w=b.offsetWidth;if(w)b.style.setProperty('--w',w+'px')})};
$$('.btn[data-label]').forEach(twist);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){$$('.btn').forEach(function(b){if(b.offsetWidth)b.style.setProperty('--w',b.offsetWidth+'px')})});
loops.push(function(){mags.forEach(function(m){m.x=lerp(m.x,m.tx,.12);m.y=lerp(m.y,m.ty,.12);if(Math.abs(m.x)+Math.abs(m.y)>.05||m.tx)m.el.style.transform='translate3d('+m.x.toFixed(2)+'px,'+m.y.toFixed(2)+'px,0)'})});

/* ---------- icon strokes get a normalised length so hover can redraw them ---------- */
$$('.ico svg path,.ico svg circle,.ico svg rect,.trust svg path,.trust svg circle,.checks svg path,.mk-side a svg path,.mk-side a svg circle,.mk-side a svg rect,.mk-side a svg ellipse').forEach(function(p){p.setAttribute('pathLength','1');p.classList.add('drw')});
/* closed outlines (shapes, or paths that end with z) fill softly on hover; open strokes stay as lines */
$$('.ico svg *,.trust svg *,.ind svg *,.mk-side a svg *').forEach(function(p){var t=p.tagName.toLowerCase();if(t==='rect'||t==='circle'||t==='ellipse'||(t==='path'&&/z\s*$/i.test(p.getAttribute('d')||'')))p.classList.add('fl2')});

/* glass cards catch a soft light that follows the pointer */
$$('.pcta').forEach(function(g){g.addEventListener('pointermove',function(e){var r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')})});

/* ---------- reveals + counters ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(en){var el=en.target;
  if(en.isIntersecting){el.classList.add('seen');if(el.hasAttribute('data-count')){io.unobserve(el);count(el)}}
  else if(en.boundingClientRect.top>innerHeight*.5&&!el.hasAttribute('data-count')&&!el.closest('.hero'))el.classList.remove('seen')})},{rootMargin:'0px 0px -8% 0px'});
$$('.up,.rv,.clip,[data-count]').forEach(function(el){io.observe(el)});
AV.observe=function(el){io.observe(el)};
function count(el){var to=parseFloat(el.getAttribute('data-count')),dec=(el.getAttribute('data-count').split('.')[1]||'').length,suf=el.getAttribute('data-suf')||'';
  var S=suf?'<small>'+suf+'</small>':'';function put(v){el.innerHTML=v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+S}
  if(RM){put(to);return}
  tween({dur:.9,ease:eo,update:function(e){put(to*e)}})}

/* ---------- nav / menu / scroll state ---------- */
var nav=$('#nav'),lastY=scrollY,dock=$('#dock'),darkEls=$$('.band,[data-dark]'),noDock=$$('[data-nodock]');
var hamb=$('#ham');if(hamb)hamb.addEventListener('click',function(){var o=B.classList.toggle('mo');hamb.setAttribute('aria-expanded',o?'true':'false');hamb.setAttribute('aria-label',o?'Close menu':'Open menu')});
$$('.menu a').forEach(function(a,i){a.style.setProperty('--i',i)});
var dockOff=ss('av-dock-off')==='1';
function onScroll(){var y=scrollY,h=innerHeight;AV.vel=lerp(AV.vel,y-lastY,.3);
  if(nav&&!B.classList.contains('mo')){if(y>lastY+2&&y>h*.6)nav.classList.add('hide');else if(y<lastY-2)nav.classList.remove('hide')}
  lastY=y;if(nav){nav.classList.toggle('nsc',y>40);var od=false;darkEls.forEach(function(d){var r=box(d);if(r.top<70&&r.bottom>70)od=true});nav.classList.toggle('ondark',od)}
  if(dock){var block=false;noDock.forEach(function(d){var r=box(d);if(r.top<h*.9&&r.bottom>0)block=true});dock.classList.toggle('on',!dockOff&&y>h*.8&&!block)}
}
addEventListener('scroll',onScroll,{passive:true});
loops.push(function(){AV.vel*=.92});


/* ---------- dock ---------- */
if(dock){var tk=$$('.tick span',dock),ti=0;
  if(tk.length){tk[0].classList.add('on');setInterval(function(){if(document.hidden||!dock.classList.contains('on'))return;var a=tk[ti];ti=(ti+1)%tk.length;var b=tk[ti];
    a.classList.remove('on');a.classList.add('off');b.classList.add('on');
    setTimeout(function(){a.style.transition='none';a.classList.remove('off');void a.offsetWidth;a.style.transition=''},750)},2800)}
  var dx=$('.dx',dock);if(dx)dx.addEventListener('click',function(){dockOff=true;ss('av-dock-off','1');dock.classList.remove('on')});
}

/* ---------- curtain (home page first visit only) ---------- */
var L=$('#ld');
function wavePath(el,y,c){el.setAttribute('d','M0 0H100V'+y.toFixed(2)+'Q50 '+(y+c).toFixed(2)+' 0 '+y.toFixed(2)+'Z')}
AV.lift=function(done){if(!L){done&&done();return}L.classList.add('out');var p1=$('.p1',L),p2=$('.p2',L),t0=performance.now(),fired=false;
  (function f(n){var t=(n-t0)/1000,a=eio(t/.85),b=eio((t-.1)/.85),y2=100-120*a,y1=100-120*b;wavePath(p2,y2,Math.sin(a*Math.PI)*-26);wavePath(p1,y1,Math.sin(b*Math.PI)*-26);
    if(t>.25&&!fired){fired=true;B.classList.add('ready')}if(t<1)requestAnimationFrame(f);else{L.classList.add('gone');done&&done()}})(t0)};
/* default: no loader, the page is ready the moment scripts run */
function instant(done){if(L)L.classList.add('gone');var br=$('#brand');if(br)br.classList.remove('wait');done()}
/* quick particle loader for page to page navigation: the mark and name form in the centre, then fly into the nav */
var SP=1.9;
function particleIntro(done){
  var LP=$('#lp'),br=$('#brand');if(!L||RM||!LP||!br)return AV.lift(function(){instant(done)});
  var fr=document.fonts&&document.fonts.load?Promise.race([document.fonts.load('400 40px Poppins'),new Promise(function(r){setTimeout(r,500)})]):Promise.resolve();
  fr.then(function(){
    var ctx=LP.getContext('2d'),W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2);LP.width=W*dpr;LP.height=H*dpr;LP.style.display='block';
    var mp=new Path2D(MARK_D);
    function mark(x,cx,cy,h){var s=h/272;x.save();x.translate(cx-157*s,cy-172*s);x.scale(s,s);x.fill(mp,'evenodd');x.restore()}
    function lock(x,x0,cy,fs){x.font='400 '+fs+'px Poppins, sans-serif';try{x.letterSpacing=(-.035*fs)+'px'}catch(e){}var mh=fs*1.33,mw=mh*290/272;mark(x,x0+mw/2,cy,mh);x.textBaseline='middle';x.fillText('Avishkar AI',x0+mw+fs*.26,cy+fs*.06)}
    function sample(draw,step){var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');x.fillStyle='#000';draw(x);var d=x.getImageData(0,0,W,H).data,p=[];for(var y=0;y<H;y+=step)for(var X=0;X<W;X+=step)if(d[(y*W+X)*4+3]>110)p.push(X,y);return p}
    var fs=Math.min(W*.085,76),tmp=document.createElement('canvas').getContext('2d');tmp.font='400 '+fs+'px Poppins, sans-serif';try{tmp.letterSpacing=(-.035*fs)+'px'}catch(e){}
    var tot=fs*1.33*290/272+fs*.26+tmp.measureText('Avishkar AI').width;
    var A=sample(function(x){lock(x,(W-tot)/2,H/2,fs)},2);
    var mk=$('.mk',br).getBoundingClientRect(),bfs=parseFloat(getComputedStyle(br).fontSize);
    var C=sample(function(x){lock(x,mk.left,mk.top+mk.height/2,bfs)},1);
    if(!A.length||!C.length){LP.style.display='none';AV.lift(function(){instant(done)});return}
    var N=W<700?1600:3000,P=new Float32Array(N*8);
    for(var i=0;i<N;i++){var o=i*8,a=(Math.random()*A.length/2|0)*2,c=(Math.random()*C.length/2|0)*2,an=Math.random()*6.283,rr=Math.max(W,H)*(.3+Math.random()*.5);
      P[o]=W/2+Math.cos(an)*rr;P[o+1]=H/2+Math.sin(an)*rr;P[o+2]=A[a];P[o+3]=A[a+1];P[o+4]=C[c];P[o+5]=C[c+1];P[o+6]=Math.random();P[o+7]=Math.random()<.07?1:0}
    var t0=performance.now(),fg=tok('--fg'),ac=tok('--acc'),lifted=false,fin=false;
    function finish(){if(fin)return;fin=true;LP.style.display='none';br.classList.remove('wait');L.classList.add('gone');done()}
    var XY=new Float32Array(N*2);
    (function f(n){var T=(n-t0)*SP;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.globalAlpha=1-sm((T-2150)/200);
      for(var i=0;i<N;i++){var o=i*8,d=P[o+6],k,x,y;
        if(T<1350){k=eo((T-d*300)/850);x=lerp(P[o],P[o+2],k);y=lerp(P[o+1],P[o+3],k);var tu=(1-k)*30;x+=Math.sin(P[o+3]*.05+T*.006)*tu;y+=Math.cos(P[o+2]*.05+T*.005)*tu}
        else{k=eio((T-1350-d*200)/700);x=lerp(P[o+2],P[o+4],k);y=lerp(P[o+3],P[o+5],k)}
        XY[i*2]=x;XY[i*2+1]=y}
      /* one fill per colour instead of a style switch per particle */
      var hot=T<1500;for(var pass=0;pass<(hot?2:1);pass++){ctx.beginPath();for(i=0;i<N;i++){if(hot&&(P[i*8+7]?1:0)!==pass)continue;ctx.rect(XY[i*2],XY[i*2+1],1.3,1.3)}ctx.fillStyle=pass?ac:fg;ctx.fill()}
      ctx.globalAlpha=1;
      if(T>1450&&!lifted){lifted=true;AV.lift()}
      if(T>2100)br.classList.remove('wait');
      if(T<2350)requestAnimationFrame(f);else finish()})(t0);
    setTimeout(finish,4000);
  });
}
AV.particleIntro=particleIntro;

/* full splash: the mark forms, becomes the wordmark, then flies into the nav.
   Plays on every fresh load and every reload. Moving between our own pages uses the quick version above. */
function fullIntro(done){
  var LP=$('#lp'),br=$('#brand');if(!L||RM||!LP||!br)return particleIntro(done);
  L.classList.remove('quick');
  var ctx=LP.getContext('2d'),W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2);LP.width=W*dpr;LP.height=H*dpr;LP.style.display='block';
  var cnt=$('#cnt'),bar=$('#lbar'),stx=$('#stx'),words=['Listening','Scoring','Reading','Ready'];
  var markP=new Path2D(MARK_D);
  function drawMark(x,cx,cy,h){var s=h/272;x.save();x.translate(cx-(12+145)*s,cy-(36+136)*s);x.scale(s,s);x.fill(markP,'evenodd');x.restore()}
  function sample(draw,step){var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');x.fillStyle='#000';draw(x);var d=x.getImageData(0,0,W,H).data,p=[];for(var y=0;y<H;y+=step)for(var X=0;X<W;X+=step){if(d[(y*W+X)*4+3]>110)p.push(X,y)}return p}
  var fontOk=document.fonts&&document.fonts.load?Promise.race([document.fonts.load('300 100px Poppins'),document.fonts.load('400 40px Poppins'),new Promise(function(r){setTimeout(r,1200)})]):Promise.resolve();
  var started=false,finished=false;
  function finish(){if(finished)return;finished=true;L.classList.add('gone');LP.style.display='none';br.classList.remove('wait');done()}
  fontOk.then(start,start);setTimeout(finish,9000);
  function start(){if(started)return;started=true;
    var mob=W<700,N=mob?3000:6500;
    var mh=Math.min(H*.34,W*.42),A=sample(function(x){drawMark(x,W/2,H/2,mh)},2);
    var tB=sample(function(x){x.font='300 100px Poppins, sans-serif';var w=x.measureText('Avishkar AI').width,fs=100*Math.min(W*.82,1100)/w;x.font='300 '+fs+'px Poppins, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('Avishkar AI',W/2,H/2)},2);
    var mkR=$('.mk',br).getBoundingClientRect(),wdR=$('.wd',br).getBoundingClientRect(),bfs=parseFloat(getComputedStyle(br).fontSize);
    var C=sample(function(x){drawMark(x,mkR.left+mkR.width/2,mkR.top+mkR.height/2,mkR.height);x.font='400 '+bfs+'px Poppins, sans-serif';x.textBaseline='middle';try{x.letterSpacing=(-.035*bfs)+'px'}catch(e){}x.fillText('Avishkar AI',wdR.left,mkR.top+mkR.height/2+bfs*.06)},1);
    if(!A.length||!tB.length||!C.length){AV.lift(finish);return}
    var P=new Float32Array(N*12),XY=new Float32Array(N*3);
    for(var i=0;i<N;i++){var o=i*12,a=(Math.random()*A.length/2|0)*2,b=(Math.random()*tB.length/2|0)*2,c=(Math.random()*C.length/2|0)*2,ang=Math.random()*6.283,rr=Math.max(W,H)*(.4+Math.random()*.6);
      P[o]=W/2+Math.cos(ang)*rr;P[o+1]=H/2+Math.sin(ang)*rr;P[o+2]=A[a];P[o+3]=A[a+1];P[o+4]=tB[b];P[o+5]=tB[b+1];P[o+6]=C[c];P[o+7]=C[c+1];P[o+8]=Math.random();P[o+9]=Math.random()*6.283;P[o+10]=Math.random()<.07?1:0;P[o+11]=.6+Math.random()*1.1}
    var t0=performance.now(),END=4300,lifted=false,fg=tok('--fg'),ac=tok('--acc'),lastPr=-1;
    function frame(now){
      var T=(now-t0)*1.2*(window.__ldScale||1);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
      ctx.globalAlpha=1-sm((T-4050)/250);
      for(var i=0;i<N;i++){var o=i*12,d=P[o+8],sd=P[o+9],x,y,k=0;
        if(T<1700){k=eo((T-d*450)/1150);x=lerp(P[o],P[o+2],k);y=lerp(P[o+1],P[o+3],k);if(k>=1){x+=Math.sin(T*.004+sd)*.6;y+=Math.cos(T*.004+sd)*.6}}
        else if(T<3150){k=eio((T-1700-d*260)/900);var tu=Math.sin(k*Math.PI)*(mob?40:80);x=lerp(P[o+2],P[o+4],k)+Math.sin(P[o+3]*.03+T*.006+sd)*tu;y=lerp(P[o+3],P[o+5],k)+Math.cos(P[o+2]*.025+T*.005+sd)*tu}
        else{k=eio((T-3150-d*300)/780);x=lerp(P[o+4],P[o+6],k);y=lerp(P[o+5],P[o+7],k)}
        XY[i*3]=x;XY[i*3+1]=y;XY[i*3+2]=P[o+11]*(T>3150?lerp(1,.7,k):1)}
      /* batched: one path and one fill per colour */
      var hot=T<3300;for(var pass=0;pass<(hot?2:1);pass++){ctx.beginPath();for(i=0;i<N;i++){if(hot&&(P[i*12+10]?1:0)!==pass)continue;var s=XY[i*3+2];ctx.rect(XY[i*3],XY[i*3+1],s,s)}ctx.fillStyle=pass?ac:fg;ctx.fill()}
      ctx.globalAlpha=1;
      var pr=clamp(T/END,0,1),pc=Math.round(pr*100);if(pc!==lastPr){lastPr=pc;cnt.textContent=String(pc).padStart(3,'0');bar.style.setProperty('--p',pr);stx.textContent=words[Math.min(3,Math.floor(pr*3.999))]}
      if(T>3250&&!lifted){lifted=true;AV.lift()}
      if(T>3950)br.classList.remove('wait');
      if(T<END)requestAnimationFrame(frame);else finish();
    }
    requestAnimationFrame(frame);
  }
}
AV.fullIntro=fullIntro;
/* was this page opened from one of our own links? (set right before we navigate away) */
/* Three independent signals, so it also works when the site is opened from disk (file://) where
   sessionStorage is not shared between pages: sessionStorage, window.name, and a same-origin referrer. */
var cameFromSite=false;
try{if(sessionStorage.getItem('av-nav')==='1')cameFromSite=true;sessionStorage.removeItem('av-nav')}catch(e){}
try{if(window.name==='av-nav')cameFromSite=true;if(window.name==='av-nav')window.name=''}catch(e){}
try{if(document.referrer&&location.origin!=='null'&&new URL(document.referrer).origin===location.origin)cameFromSite=true}catch(e){}
try{var nt=performance.getEntriesByType('navigation')[0];if(nt&&nt.type==='back_forward')cameFromSite=true;if(nt&&nt.type==='reload')cameFromSite=false}catch(e){}
function leave(h){try{sessionStorage.setItem('av-nav','1')}catch(e){}try{window.name='av-nav'}catch(e){}if(!L||RM){location.href=h;return}
  L.classList.remove('gone','out');var p1=$('.p1',L),p2=$('.p2',L),t0=performance.now(),D=.55;
  (function f(n){var t=(n-t0)/1000,b=eio(t/D),a=eio((t-.08)/D),y1=-20+120*b,y2=-20+120*a;
    p1.setAttribute('d','M0 100H100V'+(100-y1).toFixed(2)+'Q50 '+(100-y1-Math.sin(b*Math.PI)*22).toFixed(2)+' 0 '+(100-y1).toFixed(2)+'Z');
    p2.setAttribute('d','M0 100H100V'+(100-y2).toFixed(2)+'Q50 '+(100-y2-Math.sin(a*Math.PI)*22).toFixed(2)+' 0 '+(100-y2).toFixed(2)+'Z');
    if(t<D+.1)requestAnimationFrame(f);else location.href=h})(t0)}
var ldState='idle',ldShow=0,ldMax=0;
function curtain(){return document.getElementById('ld')}
function hideCurtain(){clearTimeout(ldShow);clearTimeout(ldMax);var el=curtain();if(el){el.classList.add('gone');el.style.pointerEvents='none'}document.body.style.overflow='';ldState='idle'}
function armCurtain(){if(ldState!=='idle')return;ldState='wait';var cap=root.getAttribute('data-perf')==='low'?800:1400;ldShow=setTimeout(function(){if(ldState!=='wait')return;ldState='on';var el=curtain();if(el){el.classList.remove('gone','out');el.style.pointerEvents='auto'}ldMax=setTimeout(hideCurtain,cap)},150)}
document.addEventListener('astro:before-preparation',armCurtain);
var navs=0;
document.addEventListener('astro:page-load',function(){if(!navs++)return;hideCurtain();document.body.classList.add('ready');$$('.btn[data-label]').forEach(twist);bindTog();if(!location.hash)scrollTo(0,0);var h=document.querySelector('h1');if(h){if(!h.hasAttribute('tabindex'))h.setAttribute('tabindex','-1');try{h.focus({preventScroll:true})}catch(err){}}});
addEventListener('pageshow',function(e){if(e.persisted)hideCurtain()});

/* ---------- molecular background (follows the cursor, very faint) ---------- */
(function(){
  var cv=$('#bgfx');if(!cv||RM||!FINE){if(cv)cv.remove();return}
  var x=cv.getContext('2d'),W,H,dpr,P=[],cF,cA,lmx=-1e4,lmy=-1e4,E=0,clean=true,GAP=44;var LB=[];for(var lb=0;lb<32;lb++)LB.push([]);
  function build(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;P=[];
    for(var y=-GAP;y<H+GAP;y+=GAP)for(var xx=-GAP;xx<W+GAP;xx+=GAP)P.push({bx:xx+(Math.random()-.5)*GAP*.9,by:y+(Math.random()-.5)*GAP*.9,x:0,y:0,e:0,ph:Math.random()*6.28,o:Math.random()<.07,r:.8+Math.random()*1.2})}
  function cols(){cF=hex(tok('--fg'));cA=hex(tok('--acc'))}
  build();cols();addEventListener('resize',build);themeHooks.push(cols);
  function rgba(c,a){return 'rgba('+(c[0]*255|0)+','+(c[1]*255|0)+','+(c[2]*255|0)+','+a.toFixed(3)+')'}
  var idle=0;loops.push(function(now){var t=now/1000,mx=AV.mx,my=AV.my,mv=Math.hypot(mx-lmx,my-lmy);lmx=mx;lmy=my;E=lerp(E,clamp(mv/18,0,1),.08);if(mv<.5&&clean){if(++idle>2)return}else idle=0;
    var act=[],any=false,dk=isDark(),base=dk?.34:.22;
    for(var i=0;i<P.length;i++){var p=P[i];p.x=p.bx+Math.sin(t*.5+p.ph)*5;p.y=p.by+Math.cos(t*.45+p.ph)*5;
      var d=Math.hypot(p.x-mx,p.y-my),tg=d<230?(1-d/230)*E:0;p.e=Math.max(p.e*.965,tg);if(p.e>.015){act.push(p);any=true}}
    if(!any){if(!clean){x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);clean=true}return}
    clean=false;x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);x.lineWidth=.7;
    /* links are grouped into 16 alpha steps per colour and stroked as one path per group:
       a few draw calls per frame instead of one per link, which keeps pointer movement smooth */
    for(i=0;i<32;i++)LB[i].length=0;
    for(i=0;i<act.length;i++){var a=act[i];for(var j=i+1;j<act.length;j++){var b=act[j],dx=a.x-b.x,dy=a.y-b.y,dd=dx*dx+dy*dy;if(dd>GAP*GAP*2.6)continue;
      var al=Math.min(a.e,b.e)*(1-Math.sqrt(dd)/(GAP*1.62))*base;if(al<.004)continue;var q2=Math.min(15,Math.round(al/base*15));LB[((a.o||b.o)?16:0)+q2].push(a.x,a.y,b.x,b.y)}}
    for(i=0;i<32;i++){var L2=LB[i];if(!L2.length)continue;x.strokeStyle=rgba(i>=16?cA:cF,Math.max(.004,(i%16)/15*base));x.beginPath();for(var m=0;m<L2.length;m+=4){x.moveTo(L2[m],L2[m+1]);x.lineTo(L2[m+2],L2[m+3])}x.stroke()}
    for(i=0;i<act.length;i++){var q=act[i];x.fillStyle=rgba(q.o?cA:cF,q.e*(q.o?.7:base*1.6));x.beginPath();x.arc(q.x,q.y,q.r*(q.o?1.6:1),0,7);x.fill()}
  });
})();

/* ---------- custom scrollbar ----------
   Follows the page, or any full-screen scroller handed to it with AV.scrollbarFor(el) (the product panels). */
(function(){
  var sb=document.createElement('div');sb.id='sbar';sb.innerHTML='<i></i>';B.appendChild(sb);var th=sb.firstChild,hideT,drag=null,tgt=null;
  function m(){if(tgt)return {h:tgt.scrollHeight,v:tgt.clientHeight,y:tgt.scrollTop};return {h:document.documentElement.scrollHeight,v:innerHeight,y:scrollY}}
  function to(y){if(tgt)tgt.scrollTop=y;else scrollTo(0,y)}
  function upd(){var d=m(),tr=sb.clientHeight;if(d.h<=d.v+2){sb.style.display='none';return}sb.style.display='';var h=Math.max(36,tr*d.v/d.h),y=(tr-h)*d.y/(d.h-d.v);th.style.setProperty('--h',h+'px');th.style.setProperty('--y',y+'px')}
  function show(){sb.classList.add('on');clearTimeout(hideT);hideT=setTimeout(function(){sb.classList.remove('on')},1200)}
  function onS(){upd();show()}
  addEventListener('scroll',function(){if(!tgt)onS()},{passive:true});addEventListener('resize',upd);setTimeout(upd,500);if(window.ResizeObserver)new ResizeObserver(upd).observe(B);
  AV.scrollbarFor=function(el){if(tgt)tgt.removeEventListener('scroll',onS);tgt=el||null;if(tgt)tgt.addEventListener('scroll',onS,{passive:true});upd();if(tgt)show()};
  sb.addEventListener('pointerdown',function(e){e.preventDefault();var r=sb.getBoundingClientRect(),d=m(),h=parseFloat(th.style.getPropertyValue('--h'))||40;
    var ty=parseFloat(th.style.getPropertyValue('--y'))||0;if(e.clientY<r.top+ty||e.clientY>r.top+ty+h){to((e.clientY-r.top-h/2)/(r.height-h)*(d.h-d.v))}
    d=m();drag={y:e.clientY,s:d.y,k:(d.h-d.v)/(r.height-h)};sb.classList.add('drag');sb.setPointerCapture(e.pointerId)});
  sb.addEventListener('pointermove',function(e){if(drag)to(drag.s+(e.clientY-drag.y)*drag.k)});
  sb.addEventListener('pointerup',function(){drag=null;sb.classList.remove('drag')});
})();

/* ---------- liquify hover (WebGL) for images ---------- */
AV.liquify=function(host,src){
  if(host.querySelector('canvas.lqz'))return;
  var poster=src._u||(src._u=src.toDataURL('image/jpeg',.82));
  host.style.backgroundImage='url('+poster+')';
  if(document.documentElement.getAttribute('data-perf')==='low')return;
  var cv=document.createElement('canvas');cv.className='lqz';host.appendChild(cv);var gl=null;try{gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true})}catch(e){}
  if(!gl){cv.remove();return}
  var vs='attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  var fs='precision highp float;varying vec2 v;uniform sampler2D T;uniform vec2 R,TS,M,V;uniform float S,Ti;'+
  'void main(){float ra=R.x/R.y,ta=TS.x/TS.y;vec2 uv=v;vec2 d=v-M;d.x*=ra;float f=exp(-dot(d,d)*9.)*S;'+
  'uv-=V*f*.55;uv+=vec2(sin(v.y*14.+Ti*2.),cos(v.x*12.+Ti*1.7))*.012*f;'+
  'vec2 c=uv-.5;if(ra>ta)c.y*=ta/ra;else c.x*=ra/ta;c/=1.04;c+=.5;c.y=1.-c.y;'+
  'float ca=.006*f;gl_FragColor=vec4(texture2D(T,c+vec2(ca,0.)).r,texture2D(T,c).g,texture2D(T,c-vec2(ca,0.)).b,1.);}';
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
  var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
  var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);
  [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR)});[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE)});
  var U={};['T','R','TS','M','V','S','Ti'].forEach(function(k){U[k]=gl.getUniformLocation(pr,k)});
  var st={mx:.5,my:.5,tx:.5,ty:.5,vx:0,vy:0,s:0,ts:0,dirty:true,vis:false};
  function size(){var r=host.getBoundingClientRect(),cap=document.documentElement.getAttribute('data-perf')==='mid'?1.25:1.5,d=Math.min(devicePixelRatio||1,cap);cv.width=Math.max(2,r.width*d|0);cv.height=Math.max(2,r.height*d|0);gl.viewport(0,0,cv.width,cv.height);st.dirty=true}
  size();if(window.ResizeObserver)new ResizeObserver(size).observe(host);
  var tgt=host.closest('[data-liq]')||host;
  var hr=null;tgt.addEventListener('pointerenter',function(){hr=host.getBoundingClientRect()});addEventListener('scroll',function(){hr=null},{passive:true});
  tgt.addEventListener('pointermove',function(e){var r=hr||(hr=host.getBoundingClientRect());st.tx=(e.clientX-r.left)/r.width;st.ty=1-(e.clientY-r.top)/r.height;st.ts=1});
  tgt.addEventListener('pointerleave',function(){st.ts=0});
  new IntersectionObserver(function(e){st.vis=e[0].isIntersecting;st.dirty=true}).observe(host);
  loops.push(function(now){if(!st.vis)return;var px=st.mx,py=st.my;st.mx=lerp(st.mx,st.tx,.12);st.my=lerp(st.my,st.ty,.12);st.vx=lerp(st.vx,(st.mx-px)*8,.2);st.vy=lerp(st.vy,(st.my-py)*8,.2);st.s=lerp(st.s,st.ts,.06);
    if(st.s<.002&&!st.dirty&&Math.abs(st.vx)+Math.abs(st.vy)<.0005)return;st.dirty=false;
    gl.uniform2f(U.R,cv.width,cv.height);gl.uniform2f(U.TS,src.width,src.height);gl.uniform2f(U.M,st.mx,st.my);gl.uniform2f(U.V,st.vx,st.vy);gl.uniform1f(U.S,st.s);gl.uniform1f(U.Ti,now/1000);gl.uniform1i(U.T,0);gl.drawArrays(gl.TRIANGLES,0,3)});
};

/* ---------- footer: water drops that merge into the logo ---------- */
(function(){
  var wrap=$('.drops');if(!wrap)return;var cv=$('canvas',wrap),gl=null;try{gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true})}catch(e){}
  if(!gl||RM){wrap.classList.add('nogl');return}
  var N=34,vs='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var fs=['precision highp float;uniform vec2 uR;uniform vec3 uD['+N+'];uniform sampler2D uL,uS;uniform float uK,uInk,uNs,uDk;uniform vec3 uBg,uFg;',
  'float F(vec2 p){float f=0.;for(int i=0;i<'+N+';i++){vec3 d=uD[i];vec2 v=p-d.xy;float q=d.z*d.z/(dot(v,v)+1.);f+=q*sqrt(q);}return f+texture2D(uL,p/uR).a*uK*2.;}',
  'void main(){vec2 p=gl_FragCoord.xy;float f=F(p);float m=smoothstep(.9,1.1,f);float sa=texture2D(uS,p/uR).a;m=mix(m,sa,uInk*uInk);',
  'float fs2=F(p+vec2(-1.2,2.)*uNs*.25);float sh=smoothstep(.8,1.05,fs2)*(1.-m)*mix(.07,.18,uDk);',
  'if(m<.002){gl_FragColor=vec4(0.,0.,0.,sh);return;}',
  'vec2 g=vec2(F(p+vec2(1.5,0.))-f,F(p+vec2(0.,1.5))-f);vec3 N=normalize(vec3(-g*uNs,1.));',
  'vec3 L=normalize(vec3(-.45,.55,.8));float sp=pow(max(dot(reflect(-L,N),vec3(0.,0.,1.)),0.),70.);',
  'float rim=1.-smoothstep(1.,1.35,f);float ca=pow(max(dot(N,normalize(vec3(.5,-.4,.6))),0.),10.);',
  'float sideD=max(dot(N.xy,normalize(vec2(.6,-.7))),0.);vec3 water=uBg*(.985-.28*rim*(.5+sideD)*(1.-uDk*.4))+vec3(ca*.14)+sp*.9;',
  'vec3 ink=uFg+sp*mix(.35,.25,uDk);vec3 col=mix(water,ink,uInk);',
  'float a=m*mix(.92,1.,uInk);gl_FragColor=vec4(col*a+vec3(0.)*sh*(1.-a),a+sh*(1.-a));}'].join('\n');
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn(gl.getShaderInfoLog(o));return o}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){wrap.classList.add('nogl');return}gl.useProgram(pr);
  var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
  var U={};['uR','uD','uL','uS','uK','uInk','uNs','uDk','uBg','uFg'].forEach(function(k){U[k]=gl.getUniformLocation(pr,k)});
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  var tex=gl.createTexture(),texS=gl.createTexture(),W=0,H=0,K=1,D=new Float32Array(N*3),drops=[],targets=[],vis=false,T=0;
  var markP=new Path2D(MARK_D);
  function build(){
    var r=wrap.getBoundingClientRect();K=Math.min(devicePixelRatio||1,1.25)*(r.width<700?.9:.75);W=Math.max(2,r.width*K|0);H=Math.max(2,r.height*K|0);cv.width=W;cv.height=H;gl.viewport(0,0,W,H);
    var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');x.fillStyle='#fff';
    var mh=H*.62,fsz=H*.44;x.font='400 '+fsz+'px Poppins';try{x.letterSpacing=(-.035*fsz)+'px'}catch(e){}
    var tw=x.measureText('Avishkar AI').width,mw=mh*290/272,gap=mh*.24,tot=mw+gap+tw,sc=Math.min(1,W*.9/tot);
    mh*=sc;fsz*=sc;mw*=sc;gap*=sc;tw*=sc;tot=mw+gap+tw;x.font='400 '+fsz+'px Poppins';try{x.letterSpacing=(-.035*fsz)+'px'}catch(e){}
    var x0=(W-tot)/2,cy=H/2,s=mh/272;x.save();x.translate(x0-12*s,cy-mh/2-36*s);x.scale(s,s);x.fill(markP,'evenodd');x.restore();
    x.textBaseline='middle';x.fillText('Avishkar AI',x0+mw+gap,cy+fsz*.04);
    var d=x.getImageData(0,0,W,H).data;targets=[];for(var yy=0;yy<H;yy+=3)for(var xx=0;xx<W;xx+=3)if(d[(yy*W+xx)*4+3]>200)targets.push([xx,H-yy]);
    var b=document.createElement('canvas');b.width=W;b.height=H;var bx=b.getContext('2d');bx.filter='blur('+Math.max(1.5,fsz*.035)+'px)';bx.drawImage(c,0,0);
    gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,b);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,texS);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
    var unit=Math.min(W/1200,H/290)*1.1;drops=[];for(var i=0;i<N;i++)drops.push({r:(6+Math.random()*12)*unit*(W/1200<.5?1.4:1),h:home(),tg:pick(),s:Math.random(),ph:Math.random()*6.28});
    gl.uniform1f(U.uNs,8*K);
  }
  function home(){return [W*(.04+Math.random()*.92),H*(.1+Math.random()*.8)]}
  function pick(){var t=targets[(Math.random()*targets.length)|0]||[W/2,H/2];return [t[0],t[1]]}
  function cols(){var b=hex(tok('--bg')),f=hex(tok('--fg'));gl.uniform3f(U.uBg,b[0],b[1],b[2]);gl.uniform3f(U.uFg,f[0],f[1],f[2]);gl.uniform1f(U.uDk,isDark()?1:0)}
  var rt;function rebuild(){clearTimeout(rt);rt=setTimeout(build,200)}
  build();cols();themeHooks.push(cols);addEventListener('resize',rebuild);if(document.fonts&&document.fonts.load)document.fonts.load('400 100px Poppins').then(function(){build();cols()});
  new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.05}).observe(wrap);
  var CY=8,lt=performance.now();
  loops.push(function(now){var dt=Math.min((now-lt)/1000,.05);lt=now;if(!vis)return;T+=dt*(window.__dropSpeed||1);var t=T%CY,cyc=Math.floor(T/CY);
    if(cyc!==drops._c){drops._c=cyc;drops.forEach(function(d){if(cyc>0)d.h=d.nh||home();d.nh=home();d.tg=pick()})}
    var k=sm((t-1.5)/1)*(1-sm((t-6)/.8)),ink=sm((t-2.6)/.8)*(1-sm((t-5.6)/.6));
    for(var i=0;i<N;i++){var d=drops[i],mv=eio((t-.25-d.s*.6)/1.5),back=eio((t-6-d.s*.5)/1.4),x,y;
      if(t<6){x=lerp(d.h[0],d.tg[0],mv);y=lerp(d.h[1],d.tg[1],mv)}else{x=lerp(d.tg[0],d.nh[0],back);y=lerp(d.tg[1],d.nh[1],back)}
      var wob=1+.08*Math.sin(T*2.4+d.ph),shrink=1-sm((t-1.8)/1)*(1-sm((t-5.9)/.8)),wan=(1-mv*(t<6?1:0)+back)*6*K;
      D[i*3]=x+Math.sin(T*.9+d.ph)*wan;D[i*3+1]=y+Math.cos(T*.8+d.ph*1.3)*wan;D[i*3+2]=d.r*wob*shrink}
    gl.uniform2f(U.uR,W,H);gl.uniform3fv(U.uD,D);gl.uniform1f(U.uK,k);gl.uniform1f(U.uInk,ink);gl.uniform1i(U.uL,0);gl.uniform1i(U.uS,1);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3)});
})();

/* ---------- dark CTA band: a live voice wave plus the molecule net ----------
   Two canvases. The wave lives in a short strip at the bottom and is the only thing drawn every frame
   (three layered curves, a few hundred points). The molecule net covers the band but only draws while the
   pointer is moving inside it, with links batched into a handful of paths, then goes fully idle. */
(function(){
  function band(cv){var bd=cv.parentNode,x=cv.getContext('2d'),W=0,H=0,dpr=1,vis=false,cFg,cAc,cFgA,cAcA,br=null,mx=-1,my=-1,inB=false,
    mc=document.createElement('canvas'),mx2=mc.getContext('2d'),MW=0,MH=0,mdpr=1,P=[],GAP=46,E=0,clean=true,lmx=-1e4,lmy=-1e4,idle=0,LB=[],hot=0,tHot=0;
    for(var q=0;q<24;q++)LB.push([]);
    mc.className='mol';mc.setAttribute('aria-hidden','true');bd.insertBefore(mc,cv);
    function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a.toFixed(3)+')'}
    function rgb(t){var v=hex(t);return [v[0]*255|0,v[1]*255|0,v[2]*255|0]}
    function size(){var w=cv.clientWidth,h=cv.clientHeight;if(w&&h){dpr=Math.min(devicePixelRatio||1,1.5);W=w;H=h;cv.width=W*dpr;cv.height=H*dpr}
      var w2=bd.clientWidth,h2=bd.clientHeight;      if(w2&&h2&&(w2!==MW||h2!==MH)){mdpr=Math.min(devicePixelRatio||1,1.25);MW=w2;MH=h2;mc.width=MW*mdpr;mc.height=MH*mdpr;P=[];
        for(var y=GAP/2;y<MH;y+=GAP)for(var xx=GAP/2;xx<MW;xx+=GAP)P.push({bx:xx+(Math.random()-.5)*GAP*.8,by:y+(Math.random()-.5)*GAP*.8,x:0,y:0,e:0,ph:Math.random()*6.28,o:Math.random()<.08,r:.8+Math.random()*1.1});clean=false}
    }
    function colors(){cFg=tok('--band-fg');cAc=tok('--acc');cFgA=rgb(cFg);cAcA=rgb(cAc)}
    bd.addEventListener('pointerenter',function(){br=bd.getBoundingClientRect();inB=true});
    bd.addEventListener('pointermove',function(e){if(!br)br=bd.getBoundingClientRect();mx=e.clientX-br.left;my=e.clientY-br.top;inB=true},{passive:true});
    bd.addEventListener('pointerleave',function(){inB=false;mx=my=-1e4});
    addEventListener('scroll',function(){br=null},{passive:true});
    new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(bd);
    colors();size();addEventListener('resize',size);themeHooks.push(colors);if(window.ResizeObserver){var ro=new ResizeObserver(size);ro.observe(cv);ro.observe(bd)}

    /* voice: three curves share one envelope so they read as a single voice; speech() gives the
       rise and fall of a sentence; the wave leans toward the pointer when it is close */
    function speech(t){var v=Math.abs(Math.sin(t*1.7)*.6+Math.sin(t*2.9+1.3)*.3+Math.sin(t*.6)*.4);return .25+.75*Math.min(1,v)}
    var CUR=[{k:.011,w:1.9,ph:0,a:1,c:0,al:.85},{k:.016,w:-2.6,ph:1.7,a:.7,c:1,al:.55},{k:.008,w:1.2,ph:3.1,a:.55,c:1,al:.3}];
    function wave(t,still){if(!W||!cFgA||!CUR)return;x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
      var cy=H*.5,amp=H*.42*(still?.8:speech(t)),cx=W*.5,half=W*.5,step=W<700?6:5,off=(MW-W)/2;
      hot+=(((inB&&my>MH-H-120)?1:0)-hot)*.06;
      for(var ci=0;ci<CUR.length;ci++){var C=CUR[ci];x.beginPath();
        for(var X=0;X<=W;X+=step){var u=(X-cx)/half,att=Math.pow(Math.max(0,1-u*u),2.2),near=hot*Math.exp(-Math.pow((X+off-mx)/140,2));
          var y=cy+Math.sin(X*C.k+t*C.w+C.ph)*amp*C.a*(att+near*.6);if(X===0)x.moveTo(X,y);else x.lineTo(X,y)}
        for(X=W;X>=0;X-=step){u=(X-cx)/half;att=Math.pow(Math.max(0,1-u*u),2.2);near=hot*Math.exp(-Math.pow((X+off-mx)/140,2));
          y=cy-Math.sin(X*C.k+t*C.w+C.ph)*amp*C.a*(att+near*.6)*.35;x.lineTo(X,y)}
        x.closePath();var col=C.c?cAcA:cFgA;x.fillStyle=rgba(col,C.al*.12);x.fill();x.lineWidth=1.2;x.strokeStyle=rgba(col,C.al);x.stroke()}
      x.fillStyle=rgba(cFgA,.14);x.fillRect(0,cy-.5,W,1)}

    function mol(now){var t=now/1000,mv=Math.hypot(mx-lmx,my-lmy);lmx=mx;lmy=my;E=lerp(E,inB?clamp(mv/16,0,1):0,.08);
      if(mv<.5&&clean){if(++idle>2)return}else idle=0;
      var act=[],i,R=210;for(i=0;i<P.length;i++){var p=P[i];p.x=p.bx+Math.sin(t*.5+p.ph)*5;p.y=p.by+Math.cos(t*.45+p.ph)*5;
        var dx=p.x-mx,dy=p.y-my,d=dx*dx+dy*dy,tg=d<R*R?(1-Math.sqrt(d)/R)*E:0;p.e=Math.max(p.e*.955,tg);if(p.e>.015)act.push(p)}
      mx2.setTransform(mdpr,0,0,mdpr,0,0);
      if(!act.length){if(!clean){mx2.clearRect(0,0,MW,MH);clean=true}return}
      clean=false;mx2.clearRect(0,0,MW,MH);mx2.lineWidth=.9;for(i=0;i<24;i++)LB[i].length=0;var base=.5;
      for(i=0;i<act.length;i++){var a=act[i];for(var j=i+1;j<act.length;j++){var b=act[j],ddx=a.x-b.x,ddy=a.y-b.y,dd=ddx*ddx+ddy*ddy;if(dd>GAP*GAP*2.6)continue;
        var al=Math.min(a.e,b.e)*(1-Math.sqrt(dd)/(GAP*1.62));if(al<.01)continue;LB[((a.o||b.o)?12:0)+Math.min(11,Math.round(al*11))].push(a.x,a.y,b.x,b.y)}}
      for(i=0;i<24;i++){var L2=LB[i];if(!L2.length)continue;mx2.strokeStyle=rgba(i>=12?cAcA:cFgA,(i%12)/11*base);mx2.beginPath();for(var k=0;k<L2.length;k+=4){mx2.moveTo(L2[k],L2[k+1]);mx2.lineTo(L2[k+2],L2[k+3])}mx2.stroke()}
      for(i=0;i<act.length;i++){var q2=act[i];mx2.fillStyle=rgba(q2.o?cAcA:cFgA,q2.e*(q2.o?.85:.5));mx2.beginPath();mx2.arc(q2.x,q2.y,q2.r*(q2.o?1.6:1),0,7);mx2.fill()}}

    if(RM)wave(2,true);
    loops.push(function(now){if(!vis||RM)return;wave(now/1000);if(FINE)mol(now)});
  }
  try{$$('canvas.sig').forEach(band)}catch(e){console.warn(e)}
})();

/* ---------- cookie consent: remembered per browser, reopened from the footer ---------- */
(function(){
  var ck=$('#ck');if(!ck)return;var K='av-consent',pref=$('#ckPref'),cb=$('[data-ck-act="custom"]',ck),T=null;
  function get(){try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}}
  AV.consent=get();
  function sync(){var v=AV.consent||{};$$('[data-ck]',ck).forEach(function(i){i.checked=!!v[i.getAttribute('data-ck')]})}
  function show(withPref){clearTimeout(T);sync();ck.classList.remove('out');ck.hidden=false;void ck.offsetWidth;ck.classList.add('on');B.classList.add('ck-on');if(withPref)setPref(true)}
  function hide(){ck.classList.add('out');B.classList.remove('ck-on');T=setTimeout(function(){ck.classList.remove('on','out');ck.hidden=true;setPref(false)},480)}
  function setPref(on){ck.classList.toggle('pref',on);AV.relabel(cb,on?'Save choices':'Customise')}
  function save(a,m){var v={necessary:true,analytics:!!a,marketing:!!m,at:new Date().toISOString()};try{localStorage.setItem(K,JSON.stringify(v))}catch(e){}
    AV.consent=v;try{document.dispatchEvent(new CustomEvent('av:consent',{detail:v}))}catch(e){}hide()}
  $$('[data-ck-act]',ck).forEach(function(b){b.addEventListener('click',function(){var act=b.getAttribute('data-ck-act');
    if(act==='accept')save(true,true);else if(act==='reject')save(false,false);
    else if(!ck.classList.contains('pref'))setPref(true);else save($('[data-ck="analytics"]',ck).checked,$('[data-ck="marketing"]',ck).checked)})});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-ck-open]');if(!a)return;e.preventDefault();e.stopPropagation();show(true)},true);
  if(!AV.consent)readyFns.push(function(){T=setTimeout(function(){show(false)},1600)});
})();

/* ---------- park CSS animations in sections that are off screen ---------- */
(function(){if(!window.IntersectionObserver)return;var io2=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('zz',!e.isIntersecting)})},{rootMargin:'120px 0px'});
  $$('main>section,main>div,main>.band,footer,#lqw').forEach(function(el){io2.observe(el)})})();

/* ---------- faq ---------- */
$$('.qa button').forEach(function(b){b.addEventListener('click',function(){var q=b.parentNode,o=!q.classList.contains('open');$$('.qa',q.parentNode).forEach(function(x){x.classList.remove('open');$('button',x).setAttribute('aria-expanded','false')});if(o){q.classList.add('open');b.setAttribute('aria-expanded','true')}})});

/* ---------- parallax helpers ---------- */
var pars=$$('[data-par]');
if(pars.length)loops.push(function(){if(!AV.sd)return;pars.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;var p=(r.top+r.height/2-innerHeight/2)/innerHeight;el.style.transform='translate3d(0,'+(p*-parseFloat(el.getAttribute('data-par'))).toFixed(1)+'px,0)'})});

/* ---------- main loop + start ---------- */
var lastT=performance.now(),lsy=-1,lsw=0,lsh=0,lsv=-1,lnk=0;
/* AV.sd is true on frames where the scroll position, viewport or layout changed.
   Loops that only depend on scroll position return early when it is false. */
function loop(now){var dt=Math.min((now-lastT)/1000,.05);lastT=now;
  var sy=scrollY;AV.sd=sy!==lsy||innerWidth!==lsw||innerHeight!==lsh||LV!==lsv||nearKick!==lnk;lnk=nearKick;lsy=sy;lsw=innerWidth;lsh=innerHeight;lsv=LV;
  for(var i=0,n=(AV.paused||document.hidden)?2:loops.length;i<n;i++){try{loops[i](now,dt)}catch(e){console.warn(e);loops.splice(i,1);i--}}requestAnimationFrame(loop)}
var started=false;
AV.start=function(){
  if(started){B.classList.add('ready');return}started=true;
  requestAnimationFrame(loop);onScroll();
  var booted=false;function done(){if(booted)return;booted=true;B.classList.add('ready');readyFns.forEach(function(f){try{f()}catch(e){console.warn(e)}})}
  var intro=AV.intro||(cameFromSite?particleIntro:fullIntro);try{intro(done)}catch(e){console.warn(e);if(L)L.classList.add('gone');done()}
  setTimeout(function(){if(!booted){if(L)L.classList.add('gone');done()}},9000);
};
return AV;
})();
window.AV=AV;
