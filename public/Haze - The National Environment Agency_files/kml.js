google.maps.__gjsload__('kml', function(_){var L7=function(a){_.E(this,a,3)},M7=function(a){_.E(this,a,3)},N7=function(a){_.E(this,a,1)},O7=function(a){_.E(this,a,2)},P7=function(a){_.E(this,a,2)},Q7=function(a){_.E(this,a,2)},R7=function(a){_.E(this,a,2)},S7=function(a){_.E(this,a,2)},T7=function(a){_.E(this,a,4)},U7=function(a){_.E(this,a,6)},V7=function(a){_.E(this,a,4)},W7=function(a){_.E(this,a,3)},X7=function(a){_.E(this,a,10)},Y7=_.oa("g"),Z7=function(a){this.h=0;this.g=[];this.i=a},a8=function(){var a=this;this.Z=new _.bh(function(){var b=
a.get("zoom"),c=a.get("projection");if(c&&_.pd(b)){var d=a.get("mapBounds");if(d){var e=1<<b,f=c.fromLatLngToPoint(_.$l(d));d=c.fromLatLngToPoint(_.Zl(d));f.x*=e;f.y*=e;d.x*=e;d.y*=e;e=new _.Rd([f,d]);e=_.Sd(e.$,e.X,e.fa,e.ea);b=_.wn(c,b);c=(e.$+e.fa)/2;b=c-_.kd(c,0,Math.sqrt(b.x*b.x+b.y*b.y));e.fa-=b;e.$-=b;a.g&&_.Yw(a.g,e)||(b=e.getCenter(),c=_.Ww(e),a.g=new _.Rd([new _.I(b.x-c.width,b.y-c.height),new _.I(b.x+c.width,b.y+c.height)]));$7(a)}}},0)},$7=function(a){if(a.g){var b=a.g.getCenter(),c=a.get("projection");
var d=a.get("bounds");var e=a.get("zoom");if(c&&d&&_.pd(e)){d=_.vn(c,d,e);if(b){var f=d.getCenter();(e=_.xn(c,e))&&Infinity!=e&&0!=e&&(c&&c.getPov&&0!=c.getPov().heading()%180?(b=f.y-b.y,b=_.kd(b,-e/2,e/2)-b,d.X+=b,d.ea+=b):(b=f.x-b.x,b=_.kd(b,-e/2,e/2)-b,d.$+=b,d.fa+=b))}d.$-=_.kk.width;d.X-=_.kk.height;d.fa-=_.kk.width;d.ea-=_.kk.height}else d=void 0;b=a.g;d=_.Sd(Math.max(b.$,d.$),Math.max(b.X,d.X),Math.min(b.fa,d.fa),Math.min(b.ea,d.ea));d.equals(a.h)||(a.set("croppedBounds",d),a.h=d)}},lfa=function(a,
b){return{h:function(c){return"dragstart"!=c&&"drag"!=c&&"dragend"!=c},i:function(c,d){if(d)return null;var e=null,f=c.latLng;a.forEach(function(g){if(!e){var h=g.get("bounds");h&&h.contains(f)&&0!=g.get("clickable")&&(e=g)}});return e},handleEvent:function(c,d,e){"mouseover"==c?b.set("cursor","pointer"):"mouseout"==c&&b.set("cursor",null);_.N.trigger(e,c,new _.Cm(d.latLng,d.xa))},zIndex:10}},c8=function(a,b){var c=this;this.h=a;this.g=b;this.Z=new _.bh(function(){var d=c.get("projection"),e=c.get("bounds"),
f=c.get("zoom");mfa(c);if(d&&e&&_.pd(f)&&!e.isEmpty()){var g=Math.round(e.X);e=Math.round(e.ea);d=c.get("projection");var h=c.get("zoom"),k=c.h;f=_.$l(k).lng();var l=_.Zl(k).lng();h=_.vn(d,k,h);h=Math.round(_.Ww(h).width);k=k.getNorthEast().lat()-k.getSouthWest().lat();for(var m=b8(c,g),q=g;g<=e;++g){var r=b8(c,g),v=q,u=g,w=m,x=r,D=(w+x)/2,K=b8(c,(v+u)/2),M=Math.abs(g-q);if(1<=Math.abs((v-u)/(x-w)*(K-D))&&10<M||g==e)v=new _.L(m,l),u=new _.L(r,f),m=c,q=new _.J(h,g-q),u=new _.fe(u,v),w=k,v=d,x=_.$l(u).lat(),
D=_.Zl(u).lat(),D=q.height/(x-D),x=(_.$l(m.h).lat()-x)*D,w=Math.abs(w*D),x=new _.I(0,x),D=_.$l(u),q={i:x,position:D,h:q,scaledSize:new _.J(q.width,w)},v={min:_.Wm(_.$l(u),v),max:_.Wm(_.Zl(u),v)},q.j=v,_.Le(m.g,q),q=g,m=r}}_.Nx((0,_.z)(c.i,c))()},0)},mfa=function(a){a.g.forEach(function(b){b.rk=!0})},b8=function(a,b){var c=a.get("projection");a=a.get("zoom");return _.tn(c,new _.I(0,b),a).lat()},e8=function(a,b,c,d){var e=this;this.o=a;this.i=b;this.g=c;this.h=d;_.N.addListener(c,"insert",(0,_.z)(this.C,
this));_.N.addListener(c,"remove",(0,_.z)(this.l,this));setTimeout(function(){if(e.g.i){var f=d8(e);e.g.forEach((0,_.z)(e.l,e));e.g.forEach((0,_.z)(e.j,e,f))}},0)},d8=function(a){a=a.get("opacity");return _.nd(a,1)},f8=function(a){this.g=_.fl(_.sp,_.Oi,a+"/maps/api/js/KmlOverlayService.GetFeature",_.Xh)},nfa=_.n(),g8=function(a,b){return 0==_.Rc(a,1)?a.Ha()*b:2==_.Rc(a,1)?b-a.Ha():a.Ha()},h8=function(a,b,c){return 2==_.Rc(a,0)?(a=0==_.Rc(new P7(a.m[1]),1)?(new P7(a.m[1])).Ha()*b:(new P7(a.m[1])).Ha(),
a/c):1},i8=function(a,b,c,d){return 0==_.Rc(a,0)?b:2==_.Rc(a,0)?g8(new P7(a.m[1]),c):b*d},j8=function(a,b){this.h=b;this.g=this.i=null;_.N.bind(this.h,"insert",this,this.Ag);_.N.bind(this.h,"remove",this,this.Bg)},k8=function(a,b){this.g=b;this.h=_.N.bind(a,"click",this,this.i)},ofa=function(a){var b=a.get("map");0!=a.get("screenOverlays")?l8(a,b):m8(a,b)},n8=function(a){return a.get("url")?a.get("url"):null},rfa=function(a,b,c){b.__gm.H||(b.__gm.H={},_.hd({"false":_.ht,"true":_.It},function(d,e){b.__gm.H[d]=
new Z7(new Y7(_.fl(_.sp,_.Oi,e+"/maps/api/js/KmlOverlayService.GetOverlays",_.Xh)))}));if(a.F=c)a.C=!0,b.__gm.H[0==c.lastIndexOf("https://",0)].load(c,_.fl(pfa,_.fl(qfa,a,b,c))),_.Ei(b,"Lk"),_.Zn("Lk","-p",a),a.screenOverlays_changed=_.fl(ofa,a)},qfa=function(a,b,c,d,e,f,g,h,k,l){if(a.get("map")==b&&c==a.F&&a.C){a.C=!1;var m=n8(a);if(m&&m==c&&(a.set("status",g),g==_.ia)){a.g=h;a.h=k;e&&a.set("defaultViewport",e);a.set("metadata",f);a.J=l;c=0==c.lastIndexOf("https://",0);e=new f8(c?_.It:_.ht);f=_.LD(e);
g=new _.ms;g.Ca=d;g.hg=c;g.zIndex=a.get("zIndex")||0;for(var q in l)g.parameters[q]=l[q];g.nh=(0,_.z)(f.load,f);g.clickable=0!=a.get("clickable");a.i=g;_.oW.Fg(g,b);a.l||(a.l=_.N.addListener(g,"click",(0,_.z)(sfa,a,a,b)));0!=a.get("screenOverlays")&&l8(a,b);for(d=0;d<a.h.length;++d)l=a.h[d],l.overlay.set("map",b),l.overlay.bindTo("clickable",a),tfa(e,l,a,b);d=a.get("preserveViewport");e=a.get("defaultViewport");!d&&e&&b.fitBounds(e);b=new _.Sf;b=new k8(a,b);b.bindTo("map",a);b.bindTo("suppressInfoWindows",
a);a.j=b;_.N.addListener(a,"clickable_changed",function(){a.i.clickable=0!=a.get("clickable")})}}},tfa=function(a,b,c,d){var e=new _.EU(c.i.Ca,b.Ca);c=(0,_.z)(o8,c,c,d,b.overlay.get("bounds").getCenter(),null);a=(0,_.z)(a.load,a,e,c);b.listener=_.N.addListener(b.overlay,"click",a)},o8=function(a,b,c,d,e){if(!e.infoWindowHtml){b=_.Sn("div");b.setAttribute("style","font-family: Roboto,Arial,sans-serif; font-size: small");if(e.info_window_html)_.dy(b,e.info_window_html);else if(e.name||e.description){if(e.name){var f=
_.Sn("div",b);f.setAttribute("style","font-weight: 500; font-size: medium; margin-bottom: 0em");_.Nn(e.name,f)}e.description&&(f=_.Sn("div",b),_.dy(f,e.description))}else b=null;f="";b&&(f=document.createElement("div"),f.appendChild(b),f=f.innerHTML);e.infoWindowHtml=f}_.N.trigger(a,"click",{latLng:c,pixelOffset:d,featureData:e});_.Zn("Lk","-i",e)},sfa=function(a,b,c,d,e,f){o8(a,b,d,e,f)},pfa=function(a,b){if(b&&a&&0==b.getStatus()){for(var c=[],d=[],e={},f=0;f<_.Xc(b,5);++f){var g=new U7(_.Il(b,
5,f));if(_.Gl(g,5))g={ec:new T7(g.m[5])},d.push(g);else if(_.Gl(g,4)){var h=p8(new _.Lm((new O7(g.m[4])).m[1]));h=new _.$f((new N7((new O7(g.m[4])).m[0])).getUrl(),h);c.push({overlay:h,Ca:g.getId()})}}g=_.F(b,1);h=p8(b.getDefaultViewport());f=new V7(b.m[3]);var k=new L7(f.m[3]);k={name:_.F(f,0),description:_.F(f,1),snippet:_.F(f,2),author:{name:_.F(k,0),email:_.F(k,2),uri:_.F(k,1)},hasScreenOverlays:!1};k.hasScreenOverlays=!!d.length;a:{for(l in _.Fk)if(_.Rc(b,6)==ufa[l]){var l=_.Fk[l];break a}l=
"UNKNOWN"}for(f=0;f<_.Xc(b,9);++f){var m=new _.ZU(_.Il(b,9,f));e[m.getKey()]=m.Ha()}for(f=0;f<_.Xc(b,7);++f)m=new _.ZU(_.Il(b,7,f)),e[m.getKey()]=m.Ha();a(g,h,k,l,d,c,e)}},q8=function(a){var b=a.__gm.screenOverlays;b||(b=new _.Ke,a.__gm.screenOverlays=b,(new j8(new nfa,b)).bindTo("innerContainer",a.__gm));return b},m8=function(a,b){if(a.g){b=q8(b);for(var c=0;c<a.g.length;++c)b.remove(a.g[c])}},l8=function(a,b){if(a.g){b=q8(b);for(var c=a.g.length-1;0<=c;--c)_.Le(b,a.g[c])}},p8=function(a){var b=
new _.L(_.Sc(new _.Im(a.m[1]),0),_.Sc(new _.Im(a.m[1]),1));a=new _.L(_.Sc(new _.Im(a.m[0]),0),_.Sc(new _.Im(a.m[0]),1));return new _.fe(a,b)},r8=_.n();_.A(L7,_.C);var s8;_.A(M7,_.C);_.A(N7,_.C);N7.prototype.getUrl=function(){return _.F(this,0)};N7.prototype.setUrl=function(a){this.m[0]=a};_.A(O7,_.C);_.A(P7,_.C);P7.prototype.Ha=function(){return _.Sc(this,0)};_.A(Q7,_.C);_.A(R7,_.C);_.A(S7,_.C);_.A(T7,_.C);_.A(U7,_.C);U7.prototype.getId=function(){return _.F(this,0)};_.A(V7,_.C);_.A(W7,_.C);W7.prototype.getUrl=function(){return _.F(this,0)};W7.prototype.setUrl=function(a){this.m[0]=a};var ufa={UNKNOWN:0,OK:1,INVALID_REQUEST:2,DOCUMENT_NOT_FOUND:3,FETCH_ERROR:4,INVALID_DOCUMENT:5,DOCUMENT_TOO_LARGE:6,LIMITS_EXCEEDED:7,INTERNAL_ERROR:8,TIMED_OUT:9,$m:10};_.A(X7,_.C);X7.prototype.getStatus=function(){return _.Rc(this,0,-1)};X7.prototype.getDefaultViewport=function(){return new _.Lm(this.m[4])};Y7.prototype.load=function(a,b){var c=new W7;c.setUrl(a);a=_.Ch.g(c.m,"s3i");c=(0,_.z)(this.i,this,b);b=(0,_.z)(this.h,this,b);this.g(a,c,b)};Y7.prototype.h=function(a){a(null)};Y7.prototype.i=function(a,b){b=new X7(b);a(b)};Z7.prototype.load=function(a,b){this.h++;b=_.Nx((0,_.z)(this.j,this,b));this.i.load(a,b)};Z7.prototype.j=function(a,b){this.g.push((0,_.z)(a,null,b));this.h--;if(0==this.h){for(a=0;a<this.g.length;++a)this.g[a]();this.g=[]}};_.A(a8,_.O);a8.prototype.projection_changed=function(){$7(this)};a8.prototype.bounds_changed=function(){$7(this)};a8.prototype.projectionBounds_changed=function(){_.ch(this.Z)};a8.prototype.mapBounds_changed=function(){_.ch(this.Z)};_.A(c8,_.O);c8.prototype.changed=function(a){"bounds"!=a&&"projection"!=a||_.ch(this.Z)};c8.prototype.i=function(){this.g.forEach(function(a){a.rk&&this.remove(a)})};_.A(e8,_.O);e8.prototype.opacity_changed=function(){var a=d8(this);this.g.forEach(function(b){_.qy(b.node,a)})};e8.prototype.C=function(a){var b=d8(this);this.j(b,a)};e8.prototype.j=function(a,b){var c=b.node=_.VD(this.o,this.i,b.i,b.h,_.jk,b.scaledSize);c=b.g=new _.$m(this.i,10,{image:c,bounds:b.j,size:b.h});this.h.ta(c);_.qy(b.node,a)};e8.prototype.l=function(a){a.node&&(a.g&&this.h&&this.h.ad(a.g),a.node=null)};f8.prototype.load=function(a,b){var c=new M7;c.m[0]=a.Ca;c.m[1]=a.g+"";if(a.parameters)for(var d in a.parameters){var e=new _.ZU(_.Wc(c,2));e.m[0]=d;e.m[1]=a.parameters[d]}a=_.Ch;s8||(s8={D:"ssM",G:["ss"]});c=a.g(c.m,s8);this.g(c,b,b);return c};f8.prototype.cancel=function(){throw Error("Not implemented");};_.A(j8,_.O);_.t=j8.prototype;_.t.innerContainer_changed=function(){var a=this.g;this.g=this.get("innerContainer");this.i&&(_.N.removeListener(this.i),delete this.i);a&&this.h.forEach((0,_.z)(this.Bg,this));this.g&&(this.i=_.N.bind(this.g,"resize",this,this.Vl),this.h.forEach((0,_.z)(this.Ag,this)))};_.t.Vl=function(){var a=this;_.Nx(function(){a.h.forEach((0,_.z)(a.Ig,a))})()};
_.t.Ag=function(a){if(this.g){var b=_.th(this.g);b=_.Sn("div",this.g,new _.I(b.width,b.height));_.Qn(b);_.Tn(b,2);a.da=b;b=_.Sn("div",a.da,new _.I(0,0),null,!0);_.Qn(b);a.g=b;b={g:(0,_.z)(this.$i,this,a)};a.image=_.UD((new N7(a.ec.m[0])).getUrl(),a.da,null,null,b)}};_.t.Bg=function(a){a.da&&_.An(a.da);a.g&&_.An(a.g);a.image&&_.An(a.image);a.da=null;a.image=null;a.g=null};_.t.$i=function(a,b,c){a.da&&c&&(a.image=c,_.Qn(c),this.Ig(a))};
_.t.Ig=function(a){var b=_.th(this.g);var c=_.th(a.image);var d=h8(new Q7((new R7(a.ec.m[3])).m[0]),b.width,c.width),e=h8(new Q7((new R7(a.ec.m[3])).m[1]),b.height,c.height);e=i8(new Q7((new R7(a.ec.m[3])).m[0]),c.width,b.width,e);c=i8(new Q7((new R7(a.ec.m[3])).m[1]),c.height,b.height,d);c=new _.J(e,c);d=g8(new P7((new S7(a.ec.m[2])).m[0]),b.width);e=g8(new P7((new S7(a.ec.m[2])).m[1]),b.height);e=b.height-e-c.height;b=g8(new P7((new S7(a.ec.m[1])).m[0]),c.width);var f=g8(new P7((new S7(a.ec.m[1])).m[1]),
c.height);_.Rn(a.da,new _.I(d-b,e+f));_.sh(a.da,c);_.sh(a.image,c);_.sh(a.g,c)};_.A(k8,_.O);k8.prototype.remove=function(){this.g.close();_.N.removeListener(this.h);delete this.h};k8.prototype.changed=function(){this.g.close()};k8.prototype.suppressInfoWindows_changed=function(){this.get("suppressInfoWindows")&&this.g.close()};k8.prototype.i=function(a){if(a){var b=this.get("map");if(b&&!this.get("suppressInfoWindows")){var c=a.featureData;if(c=c&&c.infoWindowHtml||a.infoWindowHtml)this.g.setOptions({pixelOffset:a.pixelOffset,position:a.latLng,content:c}),this.g.open(b)}}};r8.prototype.h=function(a){var b=a.H,c=a.H=a.get("map"),d=n8(a);if(b){a.C=!1;a.i&&_.oW.Vh(a.i,b);a.l&&(_.N.removeListener(a.l),delete a.l);m8(a,b);delete a.screenOverlays_changed;if(a.h)for(b=0;b<a.h.length;++b){var e=a.h[b];e.overlay.set("map",null);e.listener&&(_.N.removeListener(e.listener),delete e.listener)}a.j&&(a.j.remove(),a.j.unbindAll(),delete a.j);_.$n("Lk","-p",a)}c&&rfa(a,c,d)};
r8.prototype.g=function(a){var b=a.get("map"),c=b&&b.__gm;a.i&&a.i.F.remove(a);(a.i=c)&&_.Le(c.F,a);if(c&&!c.R){var d=lfa(c.F,c);c.R=d;c.i.register(d)}a.g&&(a.g.set("bounds",null),a.h.unbindAll(),a.g.unbindAll(),a.j.then(function(l){l.unbindAll()}),delete a.h,delete a.g,delete a.j,_.$n("Og","-p",a));if(b){var e=a.get("bounds"),f=a.get("url"),g=c.get("panes").overlayLayer,h=new _.Ke;a.l=h;d=new a8;d.bindTo("mapBounds",b,"bounds");d.bindTo("projection",b);d.bindTo("zoom",b);d.set("bounds",e);a.h=d;
var k=new c8(e,h);k.bindTo("zoom",b);k.bindTo("projection",b);k.bindTo("bounds",d,"croppedBounds");a.g=k;a.j=c.g.then(function(l){l=new e8(f,g,h,l.va);c&&l.bindTo("offset",c);l.bindTo("zoom",b);c&&l.bindTo("center",c,"projectionCenterQ");l.bindTo("projection",b);l.bindTo("opacity",a);l.set("latLngBounds",e);return l});_.Ei(b,"Og");_.Zn("Og","-p",a);_.N.addListener(a,"click",function(){_.Zn("Og","-i",a)})}};_.nf("kml",new r8);});
