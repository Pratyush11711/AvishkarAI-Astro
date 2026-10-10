(function(){
'use strict';
var $=AV.$,$$=AV.$$,clamp=AV.clamp,lerp=AV.lerp,sm=AV.sm,eio=AV.eio,eo=AV.eo,hex=AV.hex,tok=AV.tok,isDark=AV.isDark,RM=AV.RM;
var B=document.body;

/* the splash now lives in core.js (AV.fullIntro) and plays on every fresh load or reload */

/* ================= HERO: COILED PHONE CORD ================= */
var cord=null,THREE=null;
function Cord(){
  var cv=$('#cord');if(!THREE||!cv||!cv.isConnected)return null;
  /* low-end: same wire, a little lighter. Slightly fewer segments and sides, pixel ratio up to 1.25, 30 fps. */
  var low=document.documentElement.getAttribute('data-perf')==='low';
  var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:low?'default':'high-performance'})}
  catch(e){try{R=new THREE.WebGLRenderer({canvas:cv,antialias:false,alpha:true})}catch(e2){console.warn('cord: WebGL is not available');return null}}
  R.setPixelRatio(Math.min(devicePixelRatio||1,low?1.25:1.5));R.setClearColor(0x000000,0);
  var S=new THREE.Scene(),Cam=new THREE.PerspectiveCamera(30,1,.1,100);Cam.position.set(0,0,14);
  var G=new THREE.Group();S.add(G);
  var N=low?2200:innerWidth<700?2400:3200,M=low?10:12,vc=(N+1)*(M+1),pos=new Float32Array(vc*3),tp=new Float32Array(vc*2),idx=[],k=0,i,j;
  for(i=0;i<=N;i++)for(j=0;j<=M;j++){tp[k*2]=i/N;tp[k*2+1]=j/M*Math.PI*2;k++}
  for(i=0;i<N;i++)for(j=0;j<M;j++){var a=i*(M+1)+j,b=(i+1)*(M+1)+j;idx.push(a,b,a+1,b,b+1,a+1)}
  var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('aTP',new THREE.BufferAttribute(tp,2));geo.setIndex(idx);
  var CP=[];for(i=0;i<12;i++)CP.push(new THREE.Vector3());
  var ALB=new THREE.Vector3(.07,.07,.075),ACC=new THREE.Vector3(1,.36,.12);
  var U={uCP:{value:CP},uTime:{value:0},uUn:{value:0},uIntro:{value:0},uWave:{value:0},uTurns:{value:56},uR:{value:.2},uTube:{value:.052},uA:{value:.18},uB:{value:.82},uAlb:{value:ALB},uAcc:{value:ACC},uHot:{value:0}};
  var VS=[
  'attribute vec2 aTP;uniform vec3 uCP[12];uniform float uTime,uUn,uIntro,uWave,uTurns,uR,uTube,uA,uB;',
  'varying vec3 vN,vW,vAx;varying float vT,vCoil;',
  'vec3 bz(vec3 a,vec3 b,vec3 c,vec3 d,float s){float u=1.-s;return u*u*u*a+3.*u*u*s*b+3.*u*s*s*c+s*s*s*d;}',
  'vec3 C(float t){if(t<uA)return bz(uCP[0],uCP[1],uCP[2],uCP[3],t/uA);if(t>uB)return bz(uCP[8],uCP[9],uCP[10],uCP[11],(t-uB)/(1.-uB));return bz(uCP[4],uCP[5],uCP[6],uCP[7],(t-uA)/(uB-uA));}',
  'float Wc(float t){return smoothstep(uA,uA+.04,t)*(1.-smoothstep(uB-.045,uB,t));}',
  'float TH(float t){return 6.2831853*uTurns*clamp((t-uA)/(uB-uA),0.,1.);}',
  'void fr(float t,out vec3 c,out vec3 tc,out vec3 n0,out vec3 b0){c=C(t);tc=normalize(C(t+.0006)-C(t-.0006));n0=normalize(cross(tc,vec3(0.,0.,1.)));b0=cross(tc,n0);}',
  'vec3 P(float t){vec3 c,tc,n0,b0;fr(t,c,tc,n0,b0);float th=TH(t);float r=uR*Wc(t)*(1.-uUn);',
  'vec3 p=c+r*(cos(th)*n0+sin(th)*b0);p+=n0*(uWave*.16*sin(t*24.-uTime*5.)*sin(3.14159*t));return p;}',
  'void main(){float t=aTP.x,ph=aTP.y;vec3 p=P(t);vec3 T=normalize(P(t+.00022)-P(t-.00022));',
  'vec3 c,tc,n0,b0;fr(t,c,tc,n0,b0);float th=TH(t);vec3 Rr=normalize(cos(th)*n0+sin(th)*b0);',
  'vec3 Bn=normalize(cross(T,Rr));vec3 Nn=normalize(cross(Bn,T));vec3 n=Nn*cos(ph)+Bn*sin(ph);',
  'float rad=uTube*smoothstep(uIntro+.001,uIntro-.02,t);',
  'vec4 wp=modelMatrix*vec4(p+n*rad,1.);vW=wp.xyz;vN=normalize(mat3(modelMatrix)*n);vAx=normalize(mat3(modelMatrix)*tc);vT=t;vCoil=Wc(t)*(1.-uUn);',
  'gl_Position=projectionMatrix*viewMatrix*wp;}'].join('\n');
  var FS=[
  '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nuniform float uTime,uHot;uniform vec3 uAlb,uAcc;varying vec3 vN,vW,vAx;varying float vT,vCoil;',
  'vec3 shade(vec3 N,vec3 V,float ao){vec3 L1=normalize(vec3(-.45,.8,.55)),L2=normalize(vec3(.7,-.35,.6));',
  'float ndv=max(dot(N,V),0.),d1=max(dot(N,L1),0.),d2=max(dot(N,L2),0.);float lum=uAlb.r;',
  'vec3 col=uAlb*(mix(.4,.9,lum)+mix(.6,.22,lum)*d1+.14*d2)*mix(ao,1.,lum*.78);',
  'vec3 H=normalize(L1+V);float sp=pow(max(dot(N,H),0.),70.);col+=sp*mix(.75,.4,lum)*mix(.55,1.,ao);',
  'float fr=pow(1.-ndv,3.);col*=1.-fr*.25*lum;col+=fr*.2*(1.-lum)*ao;return col;}',
  'float comet(float h){float d=h-vT;return d>0.?exp(-d*(120.-vCoil*88.)):exp(d*340.);}',
  'void main(){vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vW);',
  'float ao=1.-.62*pow(abs(dot(N,normalize(vAx))),1.4)*vCoil;vec3 col=shade(N,V,ao);',
  'float sp=.06;float h1=fract(uTime*sp),h2=fract(uTime*sp+.5);',
  'float g=max(comet(h1),comet(h2)*.85);float core=max(exp(-pow((vT-h1)*150.,2.)),exp(-pow((vT-h2)*150.,2.))*.85);g*=mix(1.,.85+.15*sin(vT*900.),vCoil);',
  'float rim=pow(1.-max(dot(N,V),0.),1.5);',
  'col=mix(col,uAcc,clamp(g*.9+core,0.,1.));col+=uAcc*(core*.35+g*rim*.35);',
  'gl_FragColor=vec4(col,1.);}'].join('\n');
  var mesh=new THREE.Mesh(geo,new THREE.ShaderMaterial({uniforms:U,vertexShader:VS,fragmentShader:FS}));mesh.frustumCulled=false;G.add(mesh);

  var coil=[],straight=[],mob=false,half=Math.tan(15*Math.PI/180)*14;
  function V3(x,y,z){return new THREE.Vector3(x,y,z||0)}
  function build(c0,c1,sag,lead0,lead1,L,ys){
    var dx=c1.x-c0.x,q1=V3(dx*.3,-sag),q2=V3(dx*.3,sag);
    var s1=[c0,c0.clone().add(q1),c1.clone().sub(q2),c1];
    var s0=[lead0.p,lead0.p.clone().add(lead0.v),c0.clone().sub(q1.clone().multiplyScalar(.7)),c0];
    var s2=[c1,c1.clone().add(q2.clone().multiplyScalar(.7)),lead1.p.clone().sub(lead1.v),lead1.p];
    coil=s0.concat(s1,s2);
    var a=U.uA.value,b=U.uB.value,xa=-L+2*L*a,xb=-L+2*L*b;
    function line(x0,x1){return [V3(x0,ys),V3(lerp(x0,x1,1/3),ys),V3(lerp(x0,x1,2/3),ys),V3(x1,ys)]}
    straight=line(-L,xa).concat(line(xa,xb),line(xb,L));
  }
  function layout(){
    var w=cv.clientWidth||innerWidth,h=cv.clientHeight||innerHeight;R.setSize(w,h,false);Cam.aspect=w/h;Cam.updateProjectionMatrix();
    var asp=w/h,hw=half*asp;mob=innerWidth<=980;
    if(!mob){G.scale.setScalar(1);
      var c0=V3(hw*.04,1.15),c1=V3(hw*.86,.75),L=hw+2;
      build(c0,c1,2.1,{p:V3(-hw*.1,half+1.2,-.4),v:V3(0,-1.6,0)},{p:V3(hw+1.6,-1.9,.3),v:V3(-1.4,.2,0)},L,.9);
      U.uTurns.value=Math.round((c1.x-c0.x+1.6)/.118);
    }else{var s=asp<.75?.6:.8;G.scale.setScalar(s);var lh=half/s,lw=hw/s,sl=$('#cslot'),py=sl&&sl.offsetHeight?sl.offsetTop+sl.offsetHeight*.5:h*.75,cy=(.5-py/h)*2*lh;
      var c0m=V3(-lw*.72,cy+.7),c1m=V3(lw*.72,cy+.5);
      build(c0m,c1m,1.5,{p:V3(-lw-1.5,cy+2.4,0),v:V3(1.2,-.4,0)},{p:V3(lw+1.6,cy-1.2,0),v:V3(-1,.3,0)},lw+2,cy+.3);
      U.uTurns.value=Math.round((c1m.x-c0m.x+1.2)/.118);}
  }
  layout();var rt,onRs=function(){clearTimeout(rt);rt=setTimeout(layout,150)};addEventListener('resize',onRs);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
  var albT=[.07,.07,.075];
  function theme(){var d=isDark(),a=hex(tok('--acc'));albT=d?[.97,.97,.96]:[.07,.07,.075];ACC.set(a[0],a[1],a[2])}
  theme();ALB.set(albT[0],albT[1],albT[2]);AV.theme(theme);
  var vis=true,t=0,last=performance.now(),wv=0,smx=0,smy=0,hero=$('#hero'),heroIn=$('#heroIn'),lastP=-1;
  var io=new IntersectionObserver(function(e){vis=e[0].isIntersecting});io.observe(cv);
  var frame;AV.on(frame=function(now){
    if(low&&now-last<32)return;
    var dt=Math.min((now-last)/1000,.05);last=now;if(!vis)return;
    var hr=AV.box(hero),p=clamp(-hr.top/(hr.height*.8),0,1);U.uUn.value=sm(p);
    if(Math.abs(p-lastP)>.001){lastP=p;heroIn.style.transform='translate3d(0,'+(p*-80).toFixed(1)+'px,0)';heroIn.style.opacity=(1-p*1.2).toFixed(3)}
    t+=RM?0:dt;U.uTime.value=t+2;ALB.set(lerp(ALB.x,albT[0],.06),lerp(ALB.y,albT[1],.06),lerp(ALB.z,albT[2],.06));
    var un=U.uUn.value,sw=Math.sin(t*.7)*.09;
    for(var i=0;i<12;i++){var c=coil[i],s=straight[i];if(!c)continue;CP[i].set(lerp(c.x,s.x,un),lerp(c.y+((i===5||i===6)?sw:0),s.y,un),lerp(c.z,s.z,un))}
    var tx=(AV.mx/innerWidth-.5),ty=(AV.my/innerHeight-.5);if(AV.mx<0){tx=0;ty=0}
    smx=lerp(smx,tx,.04);smy=lerp(smy,ty,.04);G.rotation.y=smx*.14;G.rotation.x=smy*.07;
    wv=lerp(wv,Math.min(Math.abs(AV.pvx)/40,1),.05);U.uWave.value=wv;
    R.render(S,Cam);
  });
  return {intro:function(){if(RM){U.uIntro.value=1.03;return}AV.tween({dur:2.8,update:function(e){U.uIntro.value=e*1.03}})},
    dispose:function(){AV.off(frame);io.disconnect();removeEventListener('resize',onRs);clearTimeout(rt);try{geo.dispose();R.dispose();R.forceContextLoss()}catch(e){}}};
}
/* three.js (about 600 KB) is fetched after the page has loaded, so it never blocks first paint or input.
   The cord fades in with its own intro as soon as it is ready. */
/* The library is fetched early, but the wire (renderer, 40k-vertex mesh, shader compile) is only built once the
   splash has finished and the browser is idle, so it never competes with the opening animation. */
function bootCord(){AV.ready(function(){
  var go=function(){if(cord)return;try{cord=Cord()}catch(e){console.warn(e)}if(cord)cord.intro()};
  if('requestIdleCallback' in window)requestIdleCallback(go,{timeout:700});else setTimeout(go,150)})}
var tries=0,lowBoot=document.documentElement.getAttribute('data-perf')==='low';
function loadThree(){import('three').then(function(m){THREE=m;bootCord()},function(e){console.warn(e);if(++tries<3)setTimeout(loadThree,1500*tries)})}
/* start as soon as the browser is idle instead of waiting for the window load event (images, fonts) */
if('requestIdleCallback' in window)requestIdleCallback(loadThree,{timeout:lowBoot?2500:900});else setTimeout(loadThree,lowBoot?1200:250);
document.addEventListener('astro:before-swap',function(){if(cord){cord.dispose();cord=null}},{once:true});
window.__avHome=true;

/* hero chips live data */
(function(){
  var sp=$('#spark'),h='';for(var i=0;i<14;i++)h+='<i style="--h:'+(25+Math.random()*75).toFixed(0)+'%"'+(i===9?' class="o"':'')+'></i>';sp.innerHTML=h;
  var bars=$$('i',sp),c2=$('#hc2'),c3=$('#hc3'),n=12480,r=72;
  setInterval(function(){if(document.hidden)return;bars.forEach(function(b){b.style.setProperty('--h',(25+Math.random()*75).toFixed(0)+'%')});n+=1+(Math.random()*4|0);c3.textContent=n.toLocaleString('en-US');r=clamp(r+(Math.random()-.5)*2,69,76);c2.textContent=Math.round(r)+'%'},1400);
  $$('.spark i').forEach(function(b){b.style.transition='height .9s cubic-bezier(.16,1,.3,1)'});
})();

/* ================= GAP DOTS ================= */
(function(){
  var cv=$('#dots'),x=cv.getContext('2d'),W,H,dpr,pts=[],P=0,PT=0,vis=false,colF,colA,colL,r=4,gapEl=$('#gap'),gapN=$('#gapN'),gapL=$('#gapL');
  function build(){dpr=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;
    var mob=W<520,cols=mob?10:20,rows=mob?10:5,seeds=mob?[[2,2],[7,5],[4,8]]:[[3,1],[11,3],[16,0]];pts=[];var cw=W/cols,ch=H/rows,md=0;
    for(var rr=0;rr<rows;rr++)for(var c=0;c<cols;c++){var d=1e9,s=false;seeds.forEach(function(q){var dd=Math.hypot(q[0]-c,q[1]-rr);if(dd<d)d=dd;if(dd===0)s=true});md=Math.max(md,d);pts.push({x:(c+.5)*cw,y:(rr+.5)*ch,d:d,s:s,j:Math.random()})}
    pts.forEach(function(p){p.d=p.d/md*.86+p.j*.08});r=Math.min(cw,ch)*.2}
  function colors(){colF=tok('--fg');colA=tok('--acc');colL=tok('--dim')}
  new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);
  colors();build();addEventListener('resize',build);AV.theme(colors);
  var gnr=AV.near(gapEl),lastN=-1,lastB=null;
  AV.on(function(){if(!gnr.v)return;var rc=AV.box(gapEl),tot=rc.height-innerHeight,p=clamp(-rc.top/tot,0,1),q=clamp((p-.12)/.66,0,1);PT=q;var nn=Math.round(3+97*sm(q));if(nn!==lastN){lastN=nn;gapN.textContent=nn}var bb=nn>=100;if(bb!==lastB){lastB=bb;gapEl.classList.toggle('b',bb);gapL.textContent=bb?'Analysed':'Sampled'}if(rc.top<innerHeight*.4)gapEl.classList.add('hv');
    if(!vis)return;P=lerp(P,PT,.12);x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);var T=performance.now()/1000;
    pts.forEach(function(p){if(p.s){x.save();x.shadowColor=colA;x.shadowBlur=18+6*Math.sin(T*3);x.fillStyle=colA;x.beginPath();x.arc(p.x,p.y,r*1.25,0,7);x.fill();x.restore();return}
      var l=clamp((P*1.08-p.d)/.07,0,1),bump=l*(1-l)*4;if(l<1){x.strokeStyle=colL;x.lineWidth=1;x.beginPath();x.arc(p.x,p.y,r*(1-l*.2),0,7);x.stroke()}
      if(l>0){x.globalAlpha=l;x.fillStyle=colF;x.beginPath();x.arc(p.x,p.y,r*(.6+.4*l+.5*bump),0,7);x.fill();x.globalAlpha=1}})});
})();

/* ================= PRODUCT CARDS + LIQUID EXPAND ================= */
AV.later(function(){['verdicta','veritune'].forEach(function(k){AV.liquify($('#c-'+k+' .art'),ART.get(k))})});
var cardsEl=$$('.card');
var prNr=AV.near($('#products'));AV.on(function(){if(!prNr.v||!AV.sd)return;cardsEl.forEach(function(c){var r=AV.box(c);if(r.bottom<0||r.top>innerHeight)return;var p=(r.top+r.height/2-innerHeight/2)/innerHeight;$('.art',c).style.setProperty('--py',(p*-60).toFixed(1)+'px')})});
/* the liquid panel's WebGL (context, shader, two 1600x1200 textures) is built after the splash, in an idle moment.
   Until then a click on a card opens the panel the plain way. */
var LQ=null,mkLQ=function(){
  var cv=$('#lq'),gl=null;try{gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true})}catch(e){}
  if(!gl)return null;
  var vs='attribute vec2 aUv;uniform vec4 uFrom;uniform vec2 uRes;uniform float uP,uK,uT;varying vec2 vUv;varying vec2 vS;'+
  'void main(){vec4 r=mix(uFrom,vec4(0.,0.,uRes),uP);vec2 p=r.xy+aUv*r.zw;p.y+=sin(aUv.x*3.14159)*uK*uRes.y*.12;p.x+=sin(aUv.y*3.14159)*(aUv.x-.5)*uK*uRes.x*.08;'+
  'p+=uK*vec2(sin(aUv.y*7.+uT*3.),cos(aUv.x*6.+uT*2.4))*18.;vUv=aUv;vS=r.zw;vec2 c=p/uRes*2.-1.;gl_Position=vec4(c.x,-c.y,0.,1.);}';
  var fs='precision highp float;uniform sampler2D uTex;uniform vec2 uTS;uniform float uK,uT,uRad,uIdle,uP;varying vec2 vUv;varying vec2 vS;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'void main(){float ra=vS.x/vS.y,ta=uTS.x/uTS.y;vec2 uv=vUv-.5;if(ra>ta)uv.y*=ta/ra;else uv.x*=ra/ta;uv=uv/mix(1.2,1.,uP)+.5;'+
  'vec2 d=vec2(n(vUv*3.+uT*.35),n(vUv*3.+7.3-uT*.3))-.5;uv+=d*(uK*.12+uIdle*.012);'+
  'float ca=uK*.014+.0015;vec3 c=vec3(texture2D(uTex,uv+vec2(ca,0.)).r,texture2D(uTex,uv).g,texture2D(uTex,uv-vec2(ca,0.)).b);'+
  'vec2 px=vUv*vS,hs=vS*.5,q=abs(px-hs)-hs+uRad;float dist=length(max(q,0.))+min(max(q.x,q.y),0.)-uRad;float a=1.-smoothstep(-1.,1.,dist);gl_FragColor=vec4(c*a,a);}';
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;gl.useProgram(pr);
  var SG=64,uv=[],ix=[],i,j;for(i=0;i<=SG;i++)for(j=0;j<=SG;j++)uv.push(j/SG,i/SG);
  for(i=0;i<SG;i++)for(j=0;j<SG;j++){var a=i*(SG+1)+j;ix.push(a,a+1,a+SG+1,a+1,a+SG+2,a+SG+1)}
  var vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uv),gl.STATIC_DRAW);
  var ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ix),gl.STATIC_DRAW);
  var al=gl.getAttribLocation(pr,'aUv');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
  var Lc={};['uFrom','uRes','uP','uK','uT','uTex','uTS','uRad','uIdle'].forEach(function(n){Lc[n]=gl.getUniformLocation(pr,n)});
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  var tex={};['verdicta','veritune'].forEach(function(k){var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,ART.get(k));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);tex[k]=t});
  var st={p:0,k:0,rad:28,from:[0,0,1,1],key:'verdicta',on:false,idle:0};
  function size(){var d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;gl.viewport(0,0,cv.width,cv.height)}
  size();addEventListener('resize',size);
  AV.on(function(now){if(!st.on)return;var t=now/1000;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindTexture(gl.TEXTURE_2D,tex[st.key]);
    gl.uniform4f(Lc.uFrom,st.from[0],st.from[1],st.from[2],st.from[3]);gl.uniform2f(Lc.uRes,innerWidth,innerHeight);gl.uniform1f(Lc.uP,st.p);gl.uniform1f(Lc.uK,st.k);gl.uniform1f(Lc.uT,t);gl.uniform1i(Lc.uTex,0);gl.uniform2f(Lc.uTS,1600,1200);gl.uniform1f(Lc.uRad,st.rad);gl.uniform1f(Lc.uIdle,st.idle);
    gl.drawElements(gl.TRIANGLES,ix.length,gl.UNSIGNED_SHORT,0)});
  return st;
};
AV.later(function(){LQ=mkLQ()},2500);
var lqw=$('#lqw'),openKey=null,busy=false;
function openPanel(card,kb){
  if(busy||openKey)return;var key=card.getAttribute('data-p'),pn=$('#pn-'+key);openKey=key;AV.clearCursor();
  if(!LQ||RM){lqw.classList.add('lv','lo');pn.classList.add('on');lqw.style.background='#050506';AV.scrollbarFor(pn);return}
  busy=true;var r=card.getBoundingClientRect();LQ.key=key;LQ.from=[r.left,r.top,r.width,r.height];LQ.on=true;LQ.p=0;LQ.k=0;LQ.rad=28;LQ.idle=0;
  lqw.classList.add('lv');requestAnimationFrame(function(){requestAnimationFrame(function(){card.classList.add('lift')})});
  AV.tween({dur:1.4,ease:AV.expo,update:function(e){LQ.p=e;LQ.k=Math.sin(e*Math.PI);LQ.rad=28*(1-e)},done:function(){LQ.idle=1;pn.scrollTop=0;pn.classList.add('on');AV.scrollbarFor(pn);lqw.classList.add('lo');busy=false;if(kb){var x=$('.pn-x',pn);x&&x.focus({preventScroll:true})}}});
}
function closePanel(cb){
  if(!openKey||busy){cb&&cb();return}
  var key=openKey,pn=$('#pn-'+key),card=$('#c-'+key);pn.classList.remove('on');lqw.classList.remove('lo');AV.scrollbarFor(null);
  if(!LQ||RM){lqw.classList.remove('lv');lqw.style.background='';openKey=null;cb&&cb();return}
  busy=true;var r=card.getBoundingClientRect();LQ.from=[r.left,r.top,r.width,r.height];LQ.idle=0;
  AV.tween({dur:1.2,delay:.25,ease:AV.expo,update:function(e){var p=1-e;LQ.p=p;LQ.k=Math.sin(p*Math.PI)*.85;LQ.rad=28*(1-p)},done:function(){card.classList.remove('lift');LQ.on=false;lqw.classList.remove('lv');openKey=null;busy=false;cb&&cb()}});
}
function blockScroll(e){if(openKey&&!(e.target.closest&&e.target.closest('.pn,.pmod')))e.preventDefault()}
addEventListener('wheel',blockScroll,{passive:false});addEventListener('touchmove',blockScroll,{passive:false});
AV.beforeAnchor=function(a,go){if(openKey)closePanel(go);else go()};
$$('.card').forEach(function(c){c.addEventListener('click',function(){openPanel(c)});c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openPanel(c,true)}})});
$$('[data-open]').forEach(function(b){b.addEventListener('click',function(){var c=$('#c-'+b.getAttribute('data-open'));var r=c.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight){scrollTo(0,scrollY+r.top-(innerHeight-r.height)/2);setTimeout(function(){openPanel(c)},60)}else openPanel(c)})});
$$('[data-close]').forEach(function(b){b.addEventListener('click',function(){closePanel()})});
addEventListener('keydown',function(e){if(e.key==='Escape'){if(openKey)closePanel();B.classList.remove('mo')}});

/* ================= MOCK ================= */
(function(){
  function wave(el,col){var h='';for(var i=0;i<72;i++){var v=20+Math.abs(Math.sin(i*.45)*Math.cos(i*.13))*70+Math.random()*12;var c=col?(i<26?'':i<42?' class="s1"':' class="s2"'):'';h+='<i'+c+' style="--h:'+v.toFixed(0)+'%"></i>'}el.insertAdjacentHTML('afterbegin',h);return {bars:$$('i',el),ph:$('.ph',el)}}
  var w1=wave($('#wave1')),w2=wave($('#wave2'),true);
  var hh='',hot=[3,12,13,21,30,38,44];for(var i=0;i<40;i++){hh+=hot.indexOf(i)>-1?'<i class="o"></i>':'<i style="--a:'+(.05+Math.random()*.3).toFixed(2)+'"></i>'}$('#heat').innerHTML=hh;
  var mock=$('#mock'),ran=false;
  function play(v){v.classList.remove('run');$$('.gauge .pr',v).forEach(function(c){c.style.transition='none';c.style.strokeDashoffset=100});$$('.sc div',v).forEach(function(d){d.classList.remove('ok')});void v.offsetWidth;
    $$('.gauge .pr',v).forEach(function(c){c.style.transition='';c.style.strokeDashoffset=c.getAttribute('data-v')});v.classList.add('run');
    $$('.sc div',v).forEach(function(d,i){setTimeout(function(){d.classList.add('ok')},300+i*260)});$$('.st',v).forEach(function(d,i){d.style.setProperty('--k',i)})}
  new IntersectionObserver(function(e){if(e[0].isIntersecting&&!ran){ran=true;play($('#v1'))}},{threshold:.25}).observe(mock);
  var t0=performance.now();
  var inNr=AV.near($('#inside'));
  AV.on(function(n){if(!inNr.v)return;[w1,w2].forEach(function(w,j){var p=((n-t0)/(9000+j*1500))%1;w.ph.style.setProperty('--ph',(p*100)+'%');var k=Math.floor(p*w.bars.length);for(var i=0;i<w.bars.length;i++){var on=i<k;if(w.bars[i]._p!==on){w.bars[i]._p=on;w.bars[i].classList.toggle('p',on)}}});
    if(!AV.sd)return;var r=AV.box(mock.parentNode),vh=innerHeight,p=clamp((vh*.95-r.top)/(vh*.7),0,1);if(RM)p=1;if(p===mock._p)return;mock._p=p;mock.style.transform='translate3d(0,'+((1-p)*40).toFixed(1)+'px,0) rotateX('+((1-p)*24).toFixed(2)+'deg) scale('+(.88+.12*p).toFixed(4)+')'});
  /* screens: the sidebar opens every screen. Dashboard belongs to Verdicta and Analyze results to Veritune,
     so picking either one also flips the product tab. The tabs do the reverse. */
  var tk=$('#tk'),tabs=$$('.tabs button'),cur2='v1',loc=$('#mkLoc'),side=$$('.mk-nav a[data-sv]'),swapT=null;
  var NAMES={v1:['Verdicta','Dashboard'],v2:['Veritune','Analyze results'],v3:['Workspace','Campaigns'],v4:['Workspace','User management'],v5:['Workspace','Settings']};
  function place(b){if(!b||!b.offsetWidth)return;tk.style.width=b.offsetWidth+'px';tk.style.transform='translateX('+(b.offsetLeft-5)+'px)'}
  place(tabs[0]);addEventListener('resize',function(){place($('.tabs button[aria-selected="true"]'))});if(document.fonts)document.fonts.ready.then(function(){place($('.tabs button[aria-selected="true"]'))});
  function selTab(v){var b=tabs.filter(function(x){return x.getAttribute('data-v')===v})[0];if(!b)return;tabs.forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});place(b);mock.setAttribute('data-cur',v)}
  function show(v){if(v===cur2||!$('#'+v))return;
    side.forEach(function(x){x.classList.toggle('on',x.getAttribute('data-sv')===v)});
    if(v==='v1'||v==='v2')selTab(v);
    mock.setAttribute('data-scr',v);if(loc)loc.innerHTML='<b>'+NAMES[v][0]+'</b><em>/</em>'+NAMES[v][1];
    clearTimeout(swapT);$$('.mk-main .view').forEach(function(x){if(x.id!==cur2&&x.id!==v){x.hidden=true;x.classList.remove('leave','enter','run')}});
    var a=$('#'+cur2),n=$('#'+v);a.classList.add('leave');cur2=v;
    swapT=setTimeout(function(){a.hidden=true;a.classList.remove('leave','run');n.hidden=false;n.classList.add('enter');void n.offsetWidth;n.classList.remove('enter');play(n)},420)}
  tabs.forEach(function(b){b.addEventListener('click',function(){show(b.getAttribute('data-v'))})});
  side.forEach(function(x){x.addEventListener('click',function(){show(x.getAttribute('data-sv'))});x.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show(x.getAttribute('data-sv'))}})});
  /* small interactions inside the screens */
  $$('.mk-main [data-seg]').forEach(function(sg){var bs=$$('button',sg);bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.toggle('on',x===b)});
    var f=b.getAttribute('data-f');if(f){$$('.camp .tr[data-st]').forEach(function(r){r.classList.toggle('off',f!=='all'&&r.getAttribute('data-st')!==f)})}})})});
  $$('.mk-main .sw').forEach(function(w){w.addEventListener('click',function(){var on=!w.classList.contains('on');w.classList.toggle('on',on);w.setAttribute('aria-pressed',on?'true':'false')})});
  var lc=$('[data-lc]');$$('.mk-main .lchip').forEach(function(c){c.addEventListener('click',function(){c.classList.toggle('on');if(lc)lc.textContent=$$('.mk-main .lchip.on').length+' of 7 on'})});
  var sv=$('[data-save]'),svd=$('.vsaved'),svT;if(sv)sv.addEventListener('click',function(){svd.textContent='Saved';svd.classList.add('on');clearTimeout(svT);svT=setTimeout(function(){svd.classList.remove('on')},1800)});
})();

/* ================= PAIR ================= */
(function(){
  var pairEl=$('#pair'),o1=$('#ob1'),o2=$('#ob2'),ring=$('#ring'),sL=$('#sideL'),sR=$('#sideR');
  var paNr=AV.near(pairEl);
  AV.on(function(now){if(!paNr.v)return;var r=AV.box(pairEl);if(r.bottom<0||r.top>innerHeight)return;var tot=r.height-innerHeight,p=clamp((innerHeight*.35-r.top)/(tot+innerHeight*.35),0,1);if(RM)p=1;
    var e=eio(p/.42),t=now/1000,wob=Math.sin(e*Math.PI)*6;o1.setAttribute('cx',(90+e*95+Math.sin(t*3)*wob).toFixed(2));o2.setAttribute('cx',(310-e*95-Math.sin(t*3.4)*wob).toFixed(2));
    var rad=70+e*30+Math.sin(t*4)*e*2.5;o1.setAttribute('r',rad.toFixed(2));o2.setAttribute('r',(rad*(1-.02*Math.sin(t*3.7))).toFixed(2));
    ring.setAttribute('r',170-e*36);ring.style.opacity=.4+e*.6;
    var mob=innerWidth<800,shf=mob?0:e*40,f=sm((p-.4)/.2);sL.style.transform='translateX('+shf+'px)';sR.style.transform='translateX('+(-shf)+'px)';sL.style.opacity=sR.style.opacity=(1-f).toFixed(3);sL.style.filter=sR.style.filter='blur('+(f*8).toFixed(1)+'px)';
    pairEl.classList.toggle('m',e>.97)});
})();

/* ================= MARQUEE ================= */
(function(){var w=['Score every call','Flag every risk','Coach every agent','Keep every customer'],h='';for(var r=0;r<3;r++)w.forEach(function(x,i){h+='<span class="'+(i%2?'st':'')+'">'+x+'</span>'});var mq=$('#mq');mq.innerHTML=h;
  var X=0,dir=1,mqNr=AV.near(mq,100);AV.on(function(n,dt){if(RM||!mqNr.v)return;var v=AV.vel;if(v>.5)dir=1;else if(v<-.5)dir=-1;var w=mq.scrollWidth/3;X-=(50+Math.abs(v)*22)*dt*dir;if(X<-w)X+=w;if(X>0)X-=w;mq.style.transform='translate3d('+X.toFixed(1)+'px,0,0) skewX('+clamp(-v*.5,-10,10).toFixed(2)+'deg)'})})();

/* ================= LANG ================= */
(function(){
  var F={
    en:'<rect width="30" height="30" fill="#012169"/><path d="M0 0 30 30M30 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 30 30M30 0 0 30" stroke="#C8102E" stroke-width="2"/><path d="M15 0v30M0 15h30" stroke="#fff" stroke-width="9"/><path d="M15 0v30M0 15h30" stroke="#C8102E" stroke-width="5"/>',
    es:'<rect width="30" height="30" fill="#AA151B"/><rect y="7.5" width="30" height="15" fill="#F1BF00"/>',
    fr:'<rect width="10" height="30" fill="#002654"/><rect x="10" width="10" height="30" fill="#fff"/><rect x="20" width="10" height="30" fill="#CE1126"/>',
    de:'<rect width="30" height="10" fill="#000"/><rect y="10" width="30" height="10" fill="#DD0000"/><rect y="20" width="30" height="10" fill="#FFCE00"/>',
    pt:'<rect width="30" height="30" fill="#DA291C"/><rect width="12" height="30" fill="#046A38"/><circle cx="12" cy="15" r="5" fill="#FFE900" stroke="#DA291C" stroke-width="1"/>',
    ar:'<rect width="30" height="10" fill="#00732F"/><rect y="10" width="30" height="10" fill="#fff"/><rect y="20" width="30" height="10" fill="#000"/><rect width="9" height="30" fill="#FF0000"/>',
    zh:'<rect width="30" height="30" fill="#EE1C25"/><path d="M9 6.5l1.6 4.9h5.1l-4.1 3 1.6 4.9L9 16.3l-4.2 3 1.6-4.9-4.1-3h5.1z" fill="#FFFF00"/>'};
  var Lg=[['Hello','English','en'],['Hola','Spanish','es'],['Bonjour','French','fr'],['Hallo','German','de'],['Olá','Portuguese','pt'],['مرحبا','Arabic','ar'],['你好','Mandarin','zh']];
  var wh=$('#wheel'),fg=$('#flags');
  wh.innerHTML=Lg.map(function(x){return '<div'+(x[2]==='ar'?' dir="rtl" style="text-align:left;unicode-bidi:plaintext"':'')+'>'+x[0]+'</div>'}).join('');
  fg.innerHTML=Lg.map(function(x,i){return '<button class="flag" role="tab" aria-label="'+x[1]+'" data-i="'+i+'"><svg viewBox="0 0 30 30">'+F[x[2]]+'</svg><span>'+x[1]+'</span></button>'}).join('');
  var items=$$('div',wh),fb=$$('.flag',fg),i=0,timer;
  var TX=[['I was charged twice this month.',"Duplicate charge on this month's bill.",'Frustrated','w'],
    ['Quiero cancelar mi plan este mes.','Customer wants to cancel this month.','Churn risk','f'],
    ['Votre concurrent est moins cher.','Competitor named on price.','Competitor','w'],
    ['Danke, das hat mir sehr geholfen.','Issue resolved. Customer satisfied.','Positive',''],
    ['Ainda não recebi o meu cartão.','Card not received yet.','Concerned','w'],
    ['أريد التحدث مع المدير من فضلك','Customer asks for a supervisor.','Escalation','f'],
    ['我的网络这周一直断线。','Network keeps dropping this week.','Frustrated','w']];
  var tq=$('#tcQ'),te=$('#tcE'),ts=$('#tcS'),tl=$('#tcL'),tn=$('#tcN'),tc=$('#tcard'),callN=418;
  function tx(k){if(!tc)return;tc.classList.add('tc-sw');setTimeout(function(){var d=TX[k];tq.textContent=d[0];tq.dir=k===5?'rtl':'ltr';te.textContent=d[1];ts.textContent=d[2];ts.className='pill'+(d[3]?' '+d[3]:'');tl.textContent=Lg[k][1];callN+=1+(Math.random()*7|0);tn.textContent=('00000'+callN).slice(-5);requestAnimationFrame(function(){tc.classList.remove('tc-sw')})},300)}
  function go(n){i=(n+Lg.length)%Lg.length;tx(i);wh.style.transform='translateY(calc(var(--lh) * '+(1-i)+'))';items.forEach(function(d,k){d.classList.toggle('on',k===i)});fb.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i?'true':'false')})}
  function auto(){clearInterval(timer);timer=setInterval(function(){if(!document.hidden)go(i+1)},2300)}
  fb.forEach(function(b){b.addEventListener('click',function(){go(+b.getAttribute('data-i'));auto()})});
  go(0);auto();
})();

/* ================= ODOMETERS ================= */
(function(){
  $$('.odo').forEach(function(o,k){var v=o.getAttribute('data-v'),s=o.getAttribute('data-s'),h='';
    v.split('').forEach(function(d,i){var c='';for(var r=0;r<3;r++)for(var n=0;n<10;n++)c+='<span>'+n+'</span>';h+='<span class="col" data-d="'+d+'" style="--dl:'+(k*.12+i*.15)+'s">'+c+'</span>'});
    o.innerHTML=h+'<small>'+s+'</small>';o.setAttribute('aria-label',v+s)});
  function widths(){$$('.odo').forEach(function(o){var fs=parseFloat(getComputedStyle(o).fontSize);$$('.col',o).forEach(function(c){var m=document.createElement('span');m.style.cssText='position:absolute;visibility:hidden';m.textContent=c.getAttribute('data-d');o.appendChild(m);c.style.width=(m.getBoundingClientRect().width/fs+.02).toFixed(3)+'em';m.remove()})})}
  widths();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(widths);
  new IntersectionObserver(function(e,ob){if(e[0].isIntersecting){$$('.odo .col').forEach(function(c){c.style.transform='translateY(-'+((20+ +c.getAttribute('data-d'))*1.12)+'em)'});ob.disconnect()}},{threshold:.35}).observe($('#stats'));
})();

/* ================= PILOT (horizontal) ================= */
(function(){
  var hz=$('#pilot'),hzt=$('#hzt'),hzb=$('#hzb'),pps=$$('.pp[data-k]');
  function rep(el){if(el._r)return;el._r=1;$$('[data-rc]',el).forEach(function(b){var to=+b.getAttribute('data-rc'),suf=b.getAttribute('data-suf')||'';AV.tween({dur:1.8,ease:eo,update:function(e){b.textContent=Math.round(to*e)+suf}})})}
  var hzNr=AV.near(hz),sc=$('.mini-sc'),scan=sc&&$('.scan',sc),rows=sc?$$('div',sc):[],ring=$('.sring'),ringB=ring&&$('b',ring),card2=sc&&sc.closest('.pp'),T0=performance.now();
  addEventListener('resize',function(){if(sc)sc._h=0;rows.forEach(function(r){r._m=null});hz._sw=null});
  /* scanner: the beam eases down the scorecard, each row lights up as the beam crosses it and its verdict drops in,
     the score climbs with the beam, holds, then everything clears for the next call */
  var sv=0,lastRv='';
  AV.on(function(now){if(!hzNr.v||!sc||!card2.classList.contains('on'))return;var CY=6400,t=((now-T0)%CY)/CY,H=sc._h||(sc._h=sc.offsetHeight);
    var run=clamp((t-.08)/.6,0,1),e=eio(run),y=e*(H+2)-1;
    var vis=t<.08?sm(t/.08):t<.68?1:1-sm((t-.68)/.06);
    scan.style.transform='translate3d(0,'+y.toFixed(1)+'px,0)';scan.style.opacity=vis.toFixed(3);
    var reset=t>.93;
    rows.forEach(function(r){if(r._m==null)r._m=r.offsetTop+r.offsetHeight*.5;var on=!reset&&t>.08&&y>r._m;if(r._h!==on){r._h=on;r.classList.toggle('hit',on);
      if(on){r.classList.add('flash');clearTimeout(r._ft);r._ft=setTimeout(function(){r.classList.remove('flash')},520)}}});
    var tg=reset?0:83*e;sv+=(tg-sv)*(reset?.18:.25);var rv=Math.round(sv)+'%';ring.style.setProperty('--sc',sv.toFixed(1));if(rv!==lastRv){lastRv=rv;ringB.textContent=rv}
    sc.classList.toggle('live',t>.06&&t<.72)});

  AV.on(function(){if(!hzNr.v||!AV.sd)return;if(innerWidth<=800){pps.forEach(function(p){var b=p.getBoundingClientRect();if(b.top<innerHeight*.8){p.classList.add('on');rep(p)}});return}
    var r=AV.box(hz);if(r.bottom<0||r.top>innerHeight)return;var tot=r.height-innerHeight,p=clamp(-r.top/tot,0,1),max=hz._sw!=null&&hz._lv===innerWidth?hz._sw:(hz._lv=innerWidth,hz._sw=hzt.scrollWidth-innerWidth);hzt.style.transform='translate3d('+(-p*Math.max(0,max)).toFixed(1)+'px,0,0)';hzb.style.setProperty('--p',p.toFixed(4));
    pps.forEach(function(el){var b=el.getBoundingClientRect(),on=b.left<innerWidth*.72;el.classList.toggle('on',on);if(on)rep(el)})});
})();

/* ================= INDUSTRY ICONS: a slow rotation so the row feels alive ================= */
(function(){var w=$('#ind');if(!w)return;var it=$$('span',w),k=0,nr=AV.near(w,0),hov=false;
  w.addEventListener('pointerenter',function(){hov=true;it.forEach(function(x){x.classList.remove('go')})});w.addEventListener('pointerleave',function(){hov=false});
  it.forEach(function(x){x.querySelectorAll('.i-tick').forEach(function(p){p.setAttribute('pathLength','1')})});
  setInterval(function(){if(!nr.v||hov||document.hidden)return;it.forEach(function(x){x.classList.remove('go')});it[k].classList.add('go');k=(k+1)%it.length},1700)})();

/* ================= BENTO ================= */
(function(){
  $$('.bx').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.setProperty('--mx',(e.clientX-r.left)+'px');b.style.setProperty('--my',(e.clientY-r.top)+'px')})});
  var ds=$$('#dep div'),k=0;setInterval(function(){if(document.hidden)return;k=(k+1)%ds.length;ds.forEach(function(d,i){d.classList.toggle('on',i===k)})},2400);
})();
})();
AV.start();
