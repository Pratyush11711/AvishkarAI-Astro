var ART=(function(){
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function grain(x,W,H,a){var n=document.createElement('canvas');n.width=n.height=200;var nx=n.getContext('2d'),d=nx.createImageData(200,200);for(var i=0;i<d.data.length;i+=4){var v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}nx.putImageData(d,0,0);x.save();x.globalAlpha=a;x.globalCompositeOperation='overlay';x.fillStyle=x.createPattern(n,'repeat');x.fillRect(0,0,W,H);x.restore()}
function bar(x,bx,by,w,h,o){
  x.save();rr(x,bx,by,w,h,26);
  if(o){var g=x.createLinearGradient(0,by,0,by+h);g.addColorStop(0,'#ffb08a');g.addColorStop(.3,'#ff6a2c');g.addColorStop(1,'#9c2e09');x.shadowColor='rgba(255,91,31,.9)';x.shadowBlur=90;x.fillStyle=g;x.fill();x.shadowBlur=0}
  else{var g2=x.createLinearGradient(bx,0,bx+w,0);g2.addColorStop(0,'rgba(255,255,255,.3)');g2.addColorStop(.16,'rgba(255,255,255,.08)');g2.addColorStop(.5,'rgba(255,255,255,.025)');g2.addColorStop(.84,'rgba(255,255,255,.1)');g2.addColorStop(1,'rgba(255,255,255,.34)');x.fillStyle=g2;x.fill()}
  x.lineWidth=1.5;x.strokeStyle=o?'rgba(255,200,170,.6)':'rgba(255,255,255,.32)';x.stroke();
  x.clip();var hl=x.createLinearGradient(0,by,0,by+h);hl.addColorStop(0,'rgba(255,255,255,.55)');hl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=hl;x.fillRect(bx+w*.2,by+14,4,h*.7);
  x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.ellipse(bx+w/2,by+12,w*.36,7,0,0,7);x.fill();x.restore();
}
function make(kind){
  var W=1600,H=1200,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  var g=x.createRadialGradient(W*.5,H*.95,40,W*.5,H*.6,W*.85);g.addColorStop(0,'#2b2622');g.addColorStop(.4,'#121213');g.addColorStop(1,'#050506');x.fillStyle=g;x.fillRect(0,0,W,H);
  if(kind==='verdicta'){
    var hs=[.36,.5,.3,.62,.16,.46,.56],bw=118,gp=58,tot=hs.length*bw+(hs.length-1)*gp,x0=(W-tot)/2,base=H*.7,tops=[];
    hs.forEach(function(h,i){var bx=x0+i*(bw+gp),bh=h*H,by=base-bh,o=i===4;tops.push([bx+bw/2,by]);x.save();x.globalAlpha=.22;x.translate(0,base*2+10);x.scale(1,-1);bar(x,bx,by,bw,bh,o);x.restore();bar(x,bx,by,bw,bh,o)});
    var fl=x.createLinearGradient(0,base,0,H);fl.addColorStop(0,'rgba(5,5,6,.35)');fl.addColorStop(.5,'rgba(5,5,6,.92)');fl.addColorStop(1,'#050506');x.fillStyle=fl;x.fillRect(0,base+4,W,H-base);
    x.save();x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=3;x.shadowColor='rgba(255,255,255,.7)';x.shadowBlur=14;x.beginPath();x.moveTo(-20,tops[0][1]+140);x.quadraticCurveTo(x0-120,tops[0][1]+60,tops[0][0],tops[0][1]-26);
    for(var i=1;i<tops.length;i++){var a=tops[i-1],b=tops[i];x.bezierCurveTo(a[0]+60,a[1]-76,b[0]-60,b[1]-76,b[0],b[1]-26)}
    x.quadraticCurveTo(W-200,tops[6][1]-120,W+20,tops[6][1]-60);x.stroke();x.restore();
    tops.forEach(function(p,i){x.save();x.fillStyle=i===4?'#ff6a2c':'#fff';x.shadowColor=i===4?'#ff5b1f':'#fff';x.shadowBlur=i===4?30:12;x.beginPath();x.arc(p[0],p[1]-26,i===4?9:5,0,7);x.fill();x.restore()});
  }else{
    var mid=H*.42,pts=[],minY=1e9,minX=0;
    for(var X=-40;X<=W+40;X+=3){var env=Math.exp(-Math.pow((X-W*.52)/(W*.17),2)),y=mid-Math.sin((X-W*.52)*.0135+1.5708)*(22+200*env)*(.8+.2*Math.sin(X*.004+1));pts.push([X,y]);if(y<minY){minY=y;minX=X}}
    var gr=x.createLinearGradient(0,0,W,0);gr.addColorStop(0,'rgba(205,215,230,.9)');gr.addColorStop(.45,'rgba(255,255,255,1)');gr.addColorStop(.72,'rgba(255,140,80,1)');gr.addColorStop(1,'rgba(255,91,31,1)');
    var path=function(dy){x.beginPath();pts.forEach(function(p,i){i?x.lineTo(p[0],p[1]+dy):x.moveTo(p[0],p[1]+dy)})};
    x.save();x.globalCompositeOperation='lighter';x.filter='blur(30px)';x.globalAlpha=.35;x.strokeStyle=gr;x.lineWidth=70;path(0);x.stroke();x.filter='blur(8px)';x.globalAlpha=.4;x.lineWidth=26;path(0);x.stroke();x.filter='none';x.globalAlpha=.55;x.lineWidth=16;path(0);x.stroke();x.restore();
    x.save();x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=2.5;path(-4);x.stroke();x.restore();
    var oy=H*.68,ox=minX,orb=x.createRadialGradient(ox-24,oy-26,4,ox,oy,70);orb.addColorStop(0,'#ffd2b8');orb.addColorStop(.35,'#ff7a3a');orb.addColorStop(1,'#a8320b');
    x.save();x.shadowColor='#ff5b1f';x.shadowBlur=90;x.fillStyle=orb;x.beginPath();x.arc(ox,oy,62,0,7);x.fill();x.restore();
    x.save();x.strokeStyle='rgba(255,255,255,.25)';x.setLineDash([2,10]);x.beginPath();x.moveTo(ox,minY+30);x.lineTo(ox,oy-80);x.stroke();x.restore();
    x.save();for(var tx=W*.18;tx<=W*.86;tx+=28){var nearO=Math.abs(tx-ox)<90;x.fillStyle=nearO?'rgba(255,140,80,.55)':'rgba(255,255,255,.14)';x.fillRect(tx,H*.86,1.5,tx%140<28?14:7)}x.restore();
    for(var k2=0;k2<90;k2++){x.fillStyle='rgba(255,255,255,'+(Math.random()*.25)+')';x.beginPath();x.arc(Math.random()*W,Math.random()*H,Math.random()*1.6,0,7);x.fill()}
  }
  var v=x.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=v;x.fillRect(0,0,W,H);
  grain(x,W,H,.07);return c;
}
var cache={};
return {get:function(k){return cache[k]||(cache[k]=make(k))},url:function(k){var c=this.get(k);return c._u||(c._u=c.toDataURL('image/jpeg',.88))}};
})();
window.ART=ART;
