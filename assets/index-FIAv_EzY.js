var M=Object.defineProperty;var w=a=>{throw TypeError(a)};var A=(a,t,e)=>t in a?M(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var r=(a,t,e)=>A(a,typeof t!="symbol"?t+"":t,e),O=(a,t,e)=>t.has(a)||w("Cannot "+e);var S=(a,t,e)=>t.has(a)?w("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(a):t.set(a,e);var p=(a,t,e)=>(O(a,t,"access private method"),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const h of n.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();class m{constructor(t,e){r(this,"x",0);r(this,"y",0);this.x=t,this.y=e}add(t){this.x+=t.x,this.y+=t.y}sub(t){this.x-=t.x,this.y-=t.y}mul(t){this.x*=t.x,this.y*=t.y}dist(t){const e=this.x-t.x,s=this.y-t.y;return Math.sqrt(e*e+s*s)}lerp(t,e,s){return new m(t.x*(1-s)+e.x*s,t.y*(1-s)+e.y*s)}clone(){return new m(this.x,this.y)}}class N{constructor(t){r(this,"spline");r(this,"draggingPoint",-1);r(this,"dragOffset",new m(0,0));r(this,"numPoints",10);r(this,"ui");this.spline=t,this.ui=document.createElement("div"),this.ui.className="ui",document.addEventListener("mousedown",this.onMouseDown.bind(this)),document.addEventListener("mouseup",this.onMouseUp.bind(this)),document.addEventListener("mousemove",this.onMouseMove.bind(this)),this.addSlider("Points",this.numPoints,2,20,1,e=>{this.numPoints=e,this.generatePath()}),this.addSlider("Arc Samples",this.spline.samples,2,16,1,e=>{this.spline.samples=e,this.spline.computeArcs()}),this.addSlider("Follower Speed",this.spline.speed,0,20,.1,e=>{this.spline.speed=e}),this.addCheckbox("Constant Speed",this.spline.constantSpeed,e=>{this.spline.constantSpeed=e}),document.body.appendChild(this.ui),this.generatePath(),window.addEventListener("resize",this.resize.bind(this))}resize(){this.generatePath()}generatePath(){this.spline.points=[];for(let t=0;t<this.numPoints;t++){const e=50+t/(this.numPoints-1)*(this.spline.canvas.clientWidth-100);this.spline.points.push(new m(e,this.spline.canvas.clientHeight*.5+Math.sin(e/this.spline.canvas.clientWidth*20)*150))}this.spline.computeArcs()}onMouseDown(t){const e=new m(t.x,t.y);for(let s=0;s<this.spline.points.length;s++){const i=this.spline.points[s];if(i.dist(e)<10){this.dragOffset.x=i.x-e.x,this.dragOffset.y=i.y-e.y,this.draggingPoint=s;break}}}onMouseUp(t){this.draggingPoint!=-1&&(this.draggingPoint=-1,this.spline.computeArcs())}onMouseMove(t){if(this.draggingPoint!=-1){const e=this.spline.points[this.draggingPoint];e.x=t.x,e.y=t.y,e.add(this.dragOffset)}}addSlider(t,e,s,i,n,h){const o=document.createElement("div"),c=document.createElement("div");c.className="row";const d=document.createElement("div");d.className="title",d.textContent=t,c.appendChild(d);const g=document.createElement("div");g.className="value",g.textContent=String(e),c.appendChild(g),o.appendChild(c);const u=document.createElement("input");u.type="range",u.value=String(e),u.step=String(n),u.min=String(s),u.max=String(i),u.addEventListener("input",x=>{const P=x.target.value;g.textContent=P,h(parseFloat(P))}),o.appendChild(u),this.ui.appendChild(o)}addCheckbox(t,e,s){const i=document.createElement("div"),n=document.createElement("div");n.className="row";const h=document.createElement("div");h.className="title",h.textContent=t,n.appendChild(h),i.appendChild(n);const o=document.createElement("input");o.type="checkbox",o.checked=e,o.addEventListener("input",c=>{const d=c.target.checked;s(d)}),i.appendChild(o),this.ui.appendChild(i)}}var l,y,v,C,b,E,f;class z{constructor(t){S(this,l);r(this,"canvas");r(this,"ctx");r(this,"points",[]);r(this,"arcs",[]);r(this,"index",0);r(this,"alpha",0);r(this,"running",!0);r(this,"samples",8);r(this,"speed",2);r(this,"constantSpeed",!0);this.canvas=t,this.ctx=this.canvas.getContext("2d"),p(this,l,y).call(this),window.addEventListener("resize",p(this,l,y).bind(this)),requestAnimationFrame(p(this,l,v).bind(this))}getPoint(t){return t<0?this.points[0]:t>this.points.length-1?this.points[this.points.length-1]:this.points[t]}computeArcs(){this.arcs=[];for(let t=0;t<this.points.length;t++)p(this,l,C).call(this,t,this.samples)}}l=new WeakSet,y=function(){this.canvas.width=this.canvas.clientWidth,this.canvas.height=this.canvas.clientHeight},v=function(){if(this.points.length<2)return;this.index>=this.points.length&&(this.index=0,this.alpha=0),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),p(this,l,E).call(this);const t=this.index,e=this.arcs[t],s=this.getPoint(t-1),i=this.getPoint(t),n=this.getPoint(t+1),h=this.getPoint(t+2),o=new m(0,0);if(this.constantSpeed){this.alpha+=1/e.length*this.speed;let c=p(this,l,b).call(this,e,this.alpha);p(this,l,f).call(this,s,i,n,h,c,o)}else this.alpha+=.01*this.speed,p(this,l,f).call(this,s,i,n,h,this.alpha,o);this.alpha>=1&&(this.alpha=0,this.index<this.points.length-2?this.index++:this.index=0),this.ctx.fillStyle="red",this.ctx.beginPath(),this.ctx.arc(o.x,o.y,5,0,360),this.ctx.fill(),this.ctx.fillText(String(Math.round(this.alpha*100)/100),o.x-10,o.y-10),this.running&&requestAnimationFrame(p(this,l,v).bind(this))},C=function(t,e){const s=this.points[t].clone(),i=this.getPoint(t-1),n=this.getPoint(t),h=this.getPoint(t+1),o=this.getPoint(t+2),c={segments:[],length:0};this.arcs[t]=c;for(let d=0;d<e;d++){const g=d/(e-1),u=s.clone();p(this,l,f).call(this,i,n,h,o,g,s);const x=u.dist(s);c.length+=x,c.segments[d]={alpha:g,length:c.length}}for(const d of c.segments)d.length/=c.length;return c},b=function(t,e){let s=0,i=t.segments.length-1;for(;s<=i;){const n=Math.floor((s+i)/2),h=t.segments[n];if(n+1<t.segments.length){const o=t.segments[n+1];if(e>=h.length&&e<=o.length){const c=(e-h.length)/(o.length-h.length);return h.alpha+c*(o.alpha-h.alpha)}}e<h.length?i=n-1:s=n+1}return 1},E=function(){const t=this.ctx;t.strokeStyle="white";const e=this.points[0].clone();t.beginPath(),t.moveTo(e.x,e.y);for(let s=0;s<this.points.length-1;s++){const i=this.getPoint(s-1),n=this.getPoint(s),h=this.getPoint(s+1),o=this.getPoint(s+2);for(let c=1;c<=this.samples;c++){const d=c/this.samples;p(this,l,f).call(this,i,n,h,o,d,e),t.lineTo(e.x,e.y)}}t.stroke(),t.fillStyle="yellow";for(let s=0;s<this.points.length;s++){const i=this.points[s];t.beginPath(),t.arc(i.x,i.y,3,0,360),t.fill()}},f=function(t,e,s,i,n,h){const o=n*n,c=o*n;h.x=.5*(2*e.x+(-t.x+s.x)*n+(2*t.x-5*e.x+4*s.x-i.x)*o+(-t.x+3*e.x-3*s.x+i.x)*c),h.y=.5*(2*e.y+(-t.y+s.y)*n+(2*t.y-5*e.y+4*s.y-i.y)*o+(-t.y+3*e.y-3*s.y+i.y)*c)};const L=document.createElement("canvas");document.body.appendChild(L);const F=new z(L);new N(F);
