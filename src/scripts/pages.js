(function(){
'use strict';
var $=AV.$,$$=AV.$$,clamp=AV.clamp,lerp=AV.lerp,RM=AV.RM;


/* product art with liquify hover */
AV.later(function(){$$('[data-art]').forEach(function(c){if(window.ART)AV.liquify($('.art',c),ART.get(c.getAttribute('data-art')))})});

$$('[data-spark]').forEach(function(sp){var h='';for(var i=0;i<14;i++)h+='<i style="--h:'+(25+Math.random()*75).toFixed(0)+'%;transition:height .9s cubic-bezier(.16,1,.3,1)"'+(i===9?' class="o"':'')+'></i>';sp.innerHTML=h;var bars=$$('i',sp);setInterval(function(){if(!document.hidden)bars.forEach(function(b){b.style.setProperty('--h',(25+Math.random()*75).toFixed(0)+'%')})},1400)});

/* heat map */
(function(){var hb=$('#hb');if(!hb)return;var cols=['Script','Disclosure','Dead air','Hold','Escalation','Handling','Resolution','Summary','CRM','Greeting'],rows=['Agent 01','Agent 02','Agent 03','Agent 04','Agent 05','Agent 06','Agent 07','Agent 08'];
  var h='<span></span>'+cols.map(function(c,i){return '<span class="cl x'+(i+1)+'">'+c+'</span>'}).join('');
  rows.forEach(function(r){h+='<span class="rl">'+r+'</span>';cols.forEach(function(c,i){h+='<i class="x'+(i+1)+'" style="--a:'+(.04+Math.random()*.3).toFixed(2)+'" title="'+r+' · '+c+'"></i>'})});hb.innerHTML=h;
  var cells=$$('i',hb);cells.forEach(function(c){if(Math.random()<.06)c.classList.add('hot')});
  setInterval(function(){if(document.hidden)return;for(var k=0;k<6;k++){var c=cells[Math.random()*cells.length|0];c.style.setProperty('--a',(.04+Math.random()*.35).toFixed(2))}var hot=$$('.hot',hb);if(hot.length>3)hot[Math.random()*hot.length|0].classList.remove('hot');cells[Math.random()*cells.length|0].classList.add('hot')},1200)})();

/* sentiment bars */
(function(){var e=$('#emo2');if(!e)return;var h='';for(var i=0;i<56;i++){var t=i/55,v=20+Math.abs(Math.sin(i*.5))*50+t*30*Math.random(),c=t<.38?'var(--dim)':t<.6?'color-mix(in srgb,var(--acc) 45%,transparent)':'var(--acc)';h+='<i style="--h:'+Math.min(100,v).toFixed(0)+'%;--c:'+c+';--k:'+i+'"></i>'}e.innerHTML=h;AV.observe(e.parentNode)})();

/* vertical steps */
(function(){var vs=$('#vsteps');if(!vs)return;var fb=$('.fillbar',vs),st=$$('.vstep',vs),n=$('#vsn'),rr=$('.vs-r',vs);
  var vsNr=AV.near(vs),lp='',la=-1;AV.on(function(){if(!vsNr.v||!AV.sd)return;var r=AV.box(rr),p=clamp((innerHeight*.55-r.top)/r.height,0,1).toFixed(4);if(p!==lp){lp=p;fb.style.setProperty('--p',p)}var act=0;st.forEach(function(s,i){var b=AV.box(s),on=b.top<innerHeight*.6;if(s._on!==on){s._on=on;s.classList.toggle('on',on)}if(on)act=i});if(n&&act!==la){la=act;n.textContent='0'+(act+1)}})})();

/* journey: scrub words + chapters + big mark */
(function(){var s=$('#scrubp');if(!s)return;s.innerHTML=s.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');var ws=$$('.w',s);
  var scNr=AV.near(s,50),lastP=-1;AV.on(function(){if(!scNr.v||!AV.sd)return;var r=AV.box(s);var p=clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35),0,1);if(RM)p=1;if(Math.abs(p-lastP)<.0015)return;lastP=p;ws.forEach(function(w,i){var o=(.14+.86*clamp(p*1.2*ws.length-i,0,1)).toFixed(3);if(w._o!==o){w._o=o;w.style.opacity=o}})})})();
(function(){var c=$('#chap');if(!c)return;var chs=$$('.ch',c),N=$('#chapN'),bars=$$('#chapP i'),cur=-1;
  N.innerHTML=chs.map(function(x,i){return '<span style="transform:translateY('+(i?130:0)+'%)">0'+(i+1)+'</span>'}).join('');var ns=$$('span',N);
  var chNr=AV.near(c);AV.on(function(){if(!chNr.v||!AV.sd)return;var act=0;chs.forEach(function(ch,i){var b=AV.box(ch),on=b.top<innerHeight*.55;if(on)act=i;var vis=b.top<innerHeight*.6&&b.bottom>innerHeight*.35;if(ch._v!==vis){ch._v=vis;ch.classList.toggle('on',vis)}var f=clamp((innerHeight*.55-b.top)/b.height,0,1).toFixed(3);if(bars[i]&&bars[i]._f!==f){bars[i]._f=f;bars[i].style.setProperty('--f',f)}});
    if(act!==cur){ns.forEach(function(s,i){s.style.transform='translateY('+(i<act?-130:i>act?130:0)+'%)'});cur=act}})})();

/* journey hero: interactive particle logo */
(function(){var cv=$('#jp');if(!cv)return;var x=cv.getContext('2d'),W,H,dpr,P=[],cF,cA,vis=true,mp=new Path2D(AV.MARK_D);
  function build(){var r=cv.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);W=Math.max(2,Math.floor(r.width));H=Math.max(2,Math.floor(r.height));cv.width=W*dpr;cv.height=H*dpr;
    var c=document.createElement('canvas');c.width=W;c.height=H;var g=c.getContext('2d'),h=Math.min(H*.86,W*.8),s=h/272;g.translate(W/2-157*s,H/2-172*s);g.scale(s,s);g.fill(mp,'evenodd');
    var d=g.getImageData(0,0,W,H).data,pts=[],st=W<600?4:5;for(var y=0;y<H;y+=st)for(var X=0;X<W;X+=st)if(d[(y*W+X)*4+3]>100)pts.push([X,y]);
    P=pts.map(function(q){var an=Math.random()*6.28,rr=80+Math.random()*260;return {hx:q[0],hy:q[1],x:q[0]+Math.cos(an)*rr,y:q[1]+Math.sin(an)*rr,vx:0,vy:0,o:Math.random()<.06,r:.7+Math.random()*1.1,ph:Math.random()*6.28}})}
  function cols(){cF=AV.tok('--fg');cA=AV.tok('--acc')}
  build();cols();AV.theme(cols);var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,200)});if(document.fonts)document.fonts.ready.then(build);
  new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);
  /* the canvas sits in the hero, so its page offset is cached; the sin/cos drift is shared by particles with the same phase bucket */
  AV.on(function(now){if(!vis)return;var t=now/1000,r=AV.box(cv),mx=AV.mx-r.left,my=AV.my-r.top,i,p;x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
    for(i=0;i<P.length;i++){p=P[i];var tx=p.hx+Math.sin(t*.8+p.ph)*1.5,ty=p.hy+Math.cos(t*.7+p.ph)*1.5,dx=p.x-mx,dy=p.y-my,dd=dx*dx+dy*dy;
      if(dd<14400){var dl=Math.sqrt(dd)+.01,f=(1-(dl-.01)/120)*3.2;p.vx+=dx/dl*f;p.vy+=dy/dl*f}
      p.vx+=(tx-p.x)*.05;p.vy+=(ty-p.y)*.05;p.vx*=.84;p.vy*=.84;p.x+=p.vx;p.y+=p.vy}
    x.globalAlpha=.75;x.fillStyle=cF;x.beginPath();for(i=0;i<P.length;i++){p=P[i];if(!p.o)x.rect(p.x,p.y,p.r,p.r)}x.fill();
    x.globalAlpha=.9;x.fillStyle=cA;x.beginPath();for(i=0;i<P.length;i++){p=P[i];if(p.o)x.rect(p.x,p.y,p.r,p.r)}x.fill();x.globalAlpha=1});
})();

/* next steps rail */
(function(){var n=$('#next');if(!n)return;var rail=$('.rail',n),nx=$$('.nx',n);
  var nxNr=AV.near(n);AV.on(function(){if(!nxNr.v||!AV.sd)return;var r=AV.box(n),p=clamp((innerHeight*.8-r.top)/(r.height+innerHeight*.2),0,1);if(RM)p=1;rail.style.setProperty('--p',p.toFixed(4));nx.forEach(function(x,i){x.classList.toggle('on',p>=i/4+.02||p>.98)})})})();
})();
/* cross-link cards: a live sound wave instead of decoration */
AV.$$('.xl').forEach(function(x,j){var w=document.createElement('div');w.className='xw';w.setAttribute('aria-hidden','true');var h='';
  for(var i=0;i<44;i++){var v=18+Math.abs(Math.sin(i*.38+j)*Math.cos(i*.11))*82;h+='<b style="--h:'+v.toFixed(0)+'%;--k:'+i+'"></b>'}w.innerHTML=h;x.appendChild(w)});
/* legal: reading progress + table of contents that follows you */
(function(){var toc=AV.$('#lgtoc');if(!toc)return;var bar=AV.$('#lgp'),links=AV.$$('a',toc),secs=AV.$$('.lg-sec'),cur=-1;
  function upd(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.setProperty('--p',h>0?(scrollY/h).toFixed(4):0);
    var act=0;for(var i=0;i<secs.length;i++){if(secs[i].getBoundingClientRect().top<innerHeight*.3)act=i}
    if(act!==cur){cur=act;links.forEach(function(a,k){a.classList.toggle('on',k===act)});var a=links[act];if(a&&innerWidth<=900)a.scrollIntoView({block:'nearest',inline:'center'})}}
  addEventListener('scroll',upd,{passive:true});upd()})();
AV.start();
