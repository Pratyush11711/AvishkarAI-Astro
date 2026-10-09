/* Five step pilot onboarding.
   To connect a backend, set data-endpoint="https://..." on the <form data-wiz>.
   The form POSTs JSON; without an endpoint it only shows the success state. */
(function(){
'use strict';
var $=AV.$,$$=AV.$$;
var EMAIL=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
/* shared by both forms: POST to the server route, resolve only on { ok: true } */
var FAIL='Something went wrong sending your request. Please try again.';
function postForm(payload){
  return fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){
    return r.json().catch(function(){return {}}).then(function(j){
      if(!r.ok||!j||j.ok!==true){var e=new Error((j&&j.error)||FAIL);e.status=r.status;e.shown=r.status===429||r.status===400;throw e}
      return j})})}
function busy(btn,on){if(!btn)return;if(!btn._lab)btn._lab=btn.getAttribute('data-label')||'';
  btn.disabled=on;btn.setAttribute('aria-busy',on?'true':'false');
  if(AV.relabel)AV.relabel(btn,on?'Sending...':btn._lab)}
var LABELS={name:'Name',email:'Email',phone:'Phone',role:'Role',company:'Company',industry:'Industry',agents:'Agents',volume:'Call minutes',languages:'Languages',product:'Product',focus:'Focus',scorecard:'QA scorecard',share:'Sharing',deploy:'Deployment',start:'Start'};

$$('form[data-wiz]').forEach(function(f){
  var panes=$$('.wp',f),dots=$$('.wsteps li',f),wrap=$('.wpanes',f),err=$('.err',f),wn=$('[data-wn]',f),at=1,N=panes.length;

  function fit(){var p=panes[at-1];wrap.style.height=p.offsetHeight+'px'}
  function val(name){var els=$$('[name="'+name+'"]',f);if(!els.length)return '';
    if(els[0].type==='radio')return (els.filter(function(e){return e.checked})[0]||{}).value||'';
    if(els[0].type==='checkbox')return els.filter(function(e){return e.checked}).map(function(e){return e.value}).join(', ');
    return els[0].value.trim()}
  function full(name){var v=val(name),sp=$('[name="'+name+'_other"]',f);if(sp&&/(^|, )Other$|(^|, )Other,/.test(v)&&sp.value.trim())v=v.replace('Other','Other: '+sp.value.trim());return v}
  /* "Other" opens a small field right under its options; the step height follows it smoothly */
  function follow(ms){var t0=performance.now();(function g(n){fit();if(n-t0<ms)requestAnimationFrame(g)})(t0)}
  function specs(){$$('.spec',f).forEach(function(sp){var g=sp.getAttribute('data-spec'),o=$('[name="'+g+'"][value="Other"]',f),on=!!(o&&o.checked),inp=$('input',sp);
    if(sp.classList.contains('open')===on)return;sp.classList.toggle('open',on);inp.tabIndex=on?0:-1;if(!on){inp.value='';sp.classList.remove('bad')}
    follow(520);if(on&&matchMedia('(hover:hover)').matches)setTimeout(function(){inp.focus({preventScroll:true})},180)})}
  function mark(el,bad){el.classList.toggle('bad',bad);return !bad}

  /* each step lists what it needs */
  var rules={
    1:function(){var a=mark($('[name="name"]',f).parentNode,val('name').length<2),b=mark($('[name="email"]',f).parentNode,!EMAIL.test(val('email')));return a&&b?'':'Add your name and a valid work email.'},
    2:function(){var a=mark($('[name="company"]',f).parentNode,val('company').length<2),b=mark($('[data-group="industry"]',f),!val('industry'));
      var sp=$('[data-spec="industry"]',f),c=true;if(b&&val('industry')==='Other'){c=mark(sp,$('input',sp).value.trim().length<2)}
      return !(a&&b)?'Add your company and pick an industry.':(!c?'Tell us which industry you are in.':'')},
    3:function(){return mark($('[data-group="volume"]',f),!val('volume'))?'':'Pick your monthly call minutes.'},
    4:function(){return mark($('[data-group="product"]',f),!val('product'))?'':'Pick the product you want to try.'},
    5:function(){return mark($('.agree',f),!$('[name="consent"]',f).checked)?'':'Please confirm so we can contact you about the pilot.'}
  };

  function go(n){
    if(n<1||n>N)return;var dir=n>at?1:-1,old=panes[at-1],nw=panes[n-1];
    old.classList.remove('on');old.classList.add(dir>0?'l':'rr');
    nw.classList.remove('l','rr');nw.classList.add(dir>0?'rr':'l');void nw.offsetWidth;nw.classList.add('on');nw.classList.remove('l','rr');
    setTimeout(function(){old.classList.remove('l','rr')},600);
    at=n;f.setAttribute('data-at',at);if(wn)wn.textContent=at;err.textContent='';
    dots.forEach(function(d,i){d.classList.toggle('on',i===at-1);d.classList.toggle('dn',i<at-1)});
    fit();
    var first=$('.fl input:not([name$="_other"])',nw);
    if(first&&matchMedia('(hover:hover)').matches)setTimeout(function(){first.focus({preventScroll:true})},350);
    var sc=f.closest('.pm-card');if(sc&&sc.scrollTop>0)sc.scrollTo({top:0,behavior:'smooth'});
  }
  function next(){var e=rules[at]();if(e){err.textContent=e;f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');return false}go(at+1);return true}

  f.setAttribute('data-at','1');
  $('[data-next]',f).addEventListener('click',next);
  $('[data-back]',f).addEventListener('click',function(){go(at-1)});
  f.addEventListener('change',function(e){var g=e.target.closest('.opts,.agree');if(g){g.classList.remove('bad');err.textContent='';specs()}});
  f.addEventListener('input',function(e){var p=e.target.parentNode;if(p&&p.classList.contains('fl'))p.classList.remove('bad');var sp=e.target.closest('.spec');if(sp)sp.classList.remove('bad')});
  f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();if(at<N)next();else f.requestSubmit?f.requestSubmit():f.dispatchEvent(new Event('submit',{cancelable:true}))}});
  addEventListener('resize',fit);if(window.ResizeObserver)new ResizeObserver(fit).observe(panes[0].parentNode.parentNode);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);fit();
  /* start over: used when the popup opens again after a sent request */
  f._reset=function(){f.reset();specs();f.classList.remove('ok');$$('.bad',f).forEach(function(x){x.classList.remove('bad')});
    panes.forEach(function(p,i){p.classList.toggle('on',i===0);p.classList.remove('l','rr')});at=1;f.setAttribute('data-at','1');if(wn)wn.textContent='1';err.textContent='';
    dots.forEach(function(d,i){d.classList.toggle('on',i===0);d.classList.remove('dn')});fit()};
  f._fit=fit;

  /* checked options as an array; "Other" carries the typed text */
  function arr(name){var sp=$('[name="'+name+'_other"]',f);return $$('[name="'+name+'"]',f).filter(function(x){return x.checked}).map(function(x){return x.value==='Other'&&sp&&sp.value.trim()?'Other: '+sp.value.trim():x.value})}
  var sending=false,sub=$('.wsub',f);
  f.addEventListener('submit',function(e){e.preventDefault();if(sending)return;if(at<N){next();return}
    if(rules[N]()){err.textContent=rules[N]();return}
    var data={};Object.keys(LABELS).forEach(function(k){data[k]=full(k)});data.consent=true;data.page=location.pathname;data.sentAt=new Date().toISOString();
    var hp=$('[name="company_website"]',f);
    var payload={formType:'pilot',name:data.name,email:data.email,phone:data.phone,role:data.role,company:data.company,industry:data.industry,agents:data.agents,callMinutes:data.volume,languages:arr('languages'),product:data.product,priorities:arr('focus'),hasScorecard:data.scorecard,sharingMethod:data.share,deployment:data.deploy,startTimeline:data.start,consent:true,company_website:hp?hp.value:''};
    sending=true;err.textContent='';busy(sub,true);
    postForm(payload).then(function(){sending=false;busy(sub,false);done(data)},function(x){sending=false;busy(sub,false);err.textContent=x&&x.shown&&x.message?x.message:FAIL;f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake')});
  });
  function done(data){
    var ep=f.getAttribute('data-endpoint');
    if(ep){try{fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(function(){})}catch(x){}}
    if(typeof AV.onLead==='function')AV.onLead(data);
    var esc=function(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    var first=(data.name||'').trim().split(/\s+/)[0];$('.dn-h',f).textContent=first?'Thank you, '+first+'.':'Thank you.';
    var mail=$('[data-dn-mail]',f);if(mail&&data.email)mail.innerHTML='Look out for an email to <b>'+esc(data.email)+'</b> with your secure upload link.';
    var dl=$('.sum',f),h='';['company','product','volume','languages','share','start'].forEach(function(k){if(data[k])h+='<div><dt>'+LABELS[k]+'</dt><dd>'+esc(data[k])+'</dd></div>'});dl.innerHTML=h;
    f.classList.add('ok');var d=$('.done',f);d.focus({preventScroll:true});var sc2=f.closest('.pm-card');if(sc2){sc2.scrollLeft=0;sc2.scrollTop=0}
  }
});

/* ---------- popups ----------
   One controller drives the pilot dialog (#pmodal).
   Open and close are CSS transitions on two classes, with timers as the source of truth. */
var root=document.documentElement,B=document.body,openM=null;
function Modal(pm,closeSel,onOpen){
  if(!pm)return null;var card=$('.pm-card',pm),form=$('form',pm),opener=null,T=null,state='closed',RMq=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clearAnims(){try{(card.getAnimations?card.getAnimations():[]).forEach(function(a){a.cancel()})}catch(e){}}
  function focusFirst(){var i=$('.wp.on .fl input:not([name$="_other"])',form);if(i&&!form.classList.contains('ok')&&matchMedia('(hover:hover)').matches)i.focus({preventScroll:true});else $('.pm-x',pm).focus({preventScroll:true})}
  var m={pm:pm,form:form,card:card,
    open:function(from){if(openM&&openM!==m)openM.close(true);if(state==='open'||state==='opening')return;
      clearTimeout(T);clearAnims();opener=from||document.activeElement;B.classList.remove('mo');onOpen&&onOpen(m);
      pm.classList.remove('off','on');pm.hidden=false;root.classList.add('pm-lock');AV.paused=true;card.scrollTop=0;if(AV.clearCursor)AV.clearCursor();
      AV.twRest&&AV.twRest(pm);if(opener&&opener._twRest)opener._twRest();
      state='opening';openM=m;void card.offsetWidth;pm.classList.add('on');T=setTimeout(function(){state='open';focusFirst()},RMq?0:340)},
    close:function(instant){if(state==='closed'||state==='closing')return;clearTimeout(T);clearAnims();state='closing';pm.classList.add('off');
      T=setTimeout(function(){pm.classList.remove('on','off');pm.hidden=true;state='closed';AV.twRest&&AV.twRest(pm);if(openM===m){openM=null;root.classList.remove('pm-lock');AV.paused=false;if(!instant&&opener&&opener.focus)opener.focus({preventScroll:true})}},(RMq||instant)?0:240)},
    isOpen:function(){return state==='open'||state==='opening'}};
  $$(closeSel,pm).forEach(function(x){x.addEventListener('click',function(){m.close()})});
  return m}

var pilotM=Modal($('#pmodal'),'[data-pclose]',function(m){if(m.form.classList.contains('ok'))m.form._reset();m.form._fit&&m.form._fit()});
AV.openPilot=pilotM&&pilotM.open;AV.closePilot=pilotM&&pilotM.close;
var PILOT=/(^#start$|^#form$|(?:^|\/)pilot(?:\.html)?#form$)/;
function isPilot(a){if(a.hasAttribute('data-pilot'))return true;var h=a.getAttribute('href')||'';if(PILOT.test(h))return true;return a.classList.contains('btn')&&/(?:^|\/)pilot(?:\.html)?$/.test(h)}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href],button[data-pilot]');if(!a)return;
  if(pilotM&&isPilot(a)){if(pilotM.pm.contains(a))return;e.preventDefault();pilotM.open(a)}},true);
addEventListener('keydown',function(e){if(!openM||!openM.isOpen())return;var card=openM.card;
  if(e.key==='Escape'){e.stopPropagation();openM.close();return}
  if(e.key==='Tab'){var f=$$('button:not([disabled]),input:not([name="company_website"]),textarea,select,a[href]',card).filter(function(x){return x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}},true);
/* deep link: /pilot#form opens the pilot form */
AV.ready(function(){setTimeout(function(){if(/^#(form|start)$/.test(location.hash)&&/\/pilot(?:\.html)?\/?$/.test(location.pathname)&&pilotM)pilotM.open(null)},300)});
})();
