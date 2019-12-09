/*!
	Copyright (c) 2011-2015, Pavel Shramov, Bruno Bergot - MIT licence
*/
L.KML=L.FeatureGroup.extend({initialize:function(a){this._kml=a;this._layers={};if(a){this.addKML(a)}},addKML:function(a){var c=L.KML.parseKML(a);if(!c||!c.length){return}for(var b=0;b<c.length;b++){this.fire("addlayer",{layer:c[b]});this.addLayer(c[b])}this.latLngs=L.KML.getLatLngs(a);this.fire("loaded")},latLngs:[]});L.Util.extend(L.KML,{parseKML:function(d){var g=this.parseStyles(d);this.parseStyleMap(d,g);var f=d.getElementsByTagName("Folder");var h=[],a;for(var e=0;e<f.length;e++){if(!this._check_folder(f[e])){continue}a=this.parseFolder(f[e],g);if(a){h.push(a)}}f=d.getElementsByTagName("Placemark");for(var c=0;c<f.length;c++){if(!this._check_folder(f[c])){continue}a=this.parsePlacemark(f[c],d,g);if(a){h.push(a)}}f=d.getElementsByTagName("GroundOverlay");for(var b=0;b<f.length;b++){a=this.parseGroundOverlay(f[b]);if(a){h.push(a)}}return h},_check_folder:function(b,a){b=b.parentNode;while(b&&b.tagName!=="Folder"){b=b.parentNode}return !b||b===a},parseStyles:function(c){var g={};var b=c.getElementsByTagName("Style");for(var e=0,a=b.length;e<a;e++){var f=this.parseStyle(b[e]);if(f){var d="#"+f.id;g[d]=f}}return g},parseStyle:function(b){var f={},e={},g={},d,h;var a={color:true,width:true,Icon:true,href:true,hotSpot:true};function c(m){var l={};for(var o=0;o<m.childNodes.length;o++){var q=m.childNodes[o];var n=q.tagName;if(!a[n]){continue}if(n==="hotSpot"){for(var k=0;k<q.attributes.length;k++){l[q.attributes[k].name]=q.attributes[k].nodeValue}}else{var p=q.childNodes[0].nodeValue;if(n==="color"){l.opacity=parseInt(p.substring(0,2),16)/255;l.color="#"+p.substring(6,8)+p.substring(4,6)+p.substring(2,4)}else{if(n==="width"){l.weight=p}else{if(n==="Icon"){g=c(q);if(g.href){l.href=g.href}}else{if(n==="href"){l.href=p}}}}}}return l}d=b.getElementsByTagName("LineStyle");if(d&&d[0]){f=c(d[0])}d=b.getElementsByTagName("PolyStyle");if(d&&d[0]){e=c(d[0])}if(e.color){f.fillColor=e.color}if(e.opacity){f.fillOpacity=e.opacity}d=b.getElementsByTagName("IconStyle");if(d&&d[0]){g=c(d[0])}if(g.href){f.icon=new L.KMLIcon({iconUrl:g.href,shadowUrl:null,anchorRef:{x:g.x,y:g.y},anchorType:{x:g.xunits,y:g.yunits}})}h=b.getAttribute("id");if(h&&f){f.id=h}return f},parseStyleMap:function(f,d){var b=f.getElementsByTagName("StyleMap");for(var g=0;g<b.length;g++){var j=b[g],h;var a,c;h=j.getElementsByTagName("key");if(h&&h[0]){a=h[0].textContent}h=j.getElementsByTagName("styleUrl");if(h&&h[0]){c=h[0].textContent}if(a==="normal"){d["#"+j.getAttribute("id")]=d[c]}}return},parseFolder:function(d,g){var f,h=[],a;f=d.getElementsByTagName("Folder");for(var e=0;e<f.length;e++){if(!this._check_folder(f[e],d)){continue}a=this.parseFolder(f[e],g);if(a){h.push(a)}}f=d.getElementsByTagName("Placemark");for(var c=0;c<f.length;c++){if(!this._check_folder(f[c],d)){continue}a=this.parsePlacemark(f[c],d,g);if(a){h.push(a)}}f=d.getElementsByTagName("GroundOverlay");for(var b=0;b<f.length;b++){if(!this._check_folder(f[b],d)){continue}a=this.parseGroundOverlay(f[b]);if(a){h.push(a)}}if(!h.length){return}if(h.length===1){return h[0]}return new L.FeatureGroup(h)},parsePlacemark:function(g,d,w,c){var v,u,t,s,b,m,n=c||{};b=g.getElementsByTagName("styleUrl");for(u=0;u<b.length;u++){var e=b[u].childNodes[0].nodeValue;for(var y in w[e]){n[y]=w[e][y]}}m=g.getElementsByTagName("Style")[0];if(m){var x=this.parseStyle(g);if(x){for(s in x){n[s]=x[s]}}}var q=["MultiGeometry","MultiTrack","gx:MultiTrack"];for(v in q){b=g.getElementsByTagName(q[v]);for(u=0;u<b.length;u++){return this.parsePlacemark(b[u],d,w,n)}}var f=[];var o=["LineString","Polygon","Point","Track","gx:Track"];for(t in o){var B=o[t];b=g.getElementsByTagName(B);for(u=0;u<b.length;u++){var r=this["parse"+B.replace(/gx:/,"")](b[u],d,n);if(r){f.push(r)}}}if(!f.length){return}var z=f[0];if(f.length>1){z=new L.FeatureGroup(f)}var A,p="";b=g.getElementsByTagName("name");if(b.length&&b[0].childNodes.length){A=b[0].childNodes[0].nodeValue}b=g.getElementsByTagName("description");for(u=0;u<b.length;u++){for(t=0;t<b[u].childNodes.length;t++){p=p+b[u].childNodes[t].nodeValue}}if(A){z.on("add",function(){z.bindPopup("<h2>"+A+"</h2>"+p,{className:"kml-popup"})})}return z},parseCoords:function(a){var b=a.getElementsByTagName("coordinates");return this._read_coords(b[0])},parseLineString:function(a,c,b){var d=this.parseCoords(a);if(!d.length){return}return new L.Polyline(d,b)},parseTrack:function(a,d,c){var e=d.getElementsByTagName("gx:coord");if(e.length===0){e=d.getElementsByTagName("coord")}var f=[];for(var b=0;b<e.length;b++){f=f.concat(this._read_gxcoords(e[b]))}if(!f.length){return}return new L.Polyline(f,c)},parsePoint:function(a,c,b){var d=a.getElementsByTagName("coordinates");if(!d.length){return}var e=d[0].childNodes[0].nodeValue.split(",");return new L.KMLMarker(new L.LatLng(e[1],e[0]),b)},parsePolygon:function(b,e,d){var g,a=[],c=[],f,h;g=b.getElementsByTagName("outerBoundaryIs");for(f=0;f<g.length;f++){h=this.parseCoords(g[f]);if(h){a.push(h)}}g=b.getElementsByTagName("innerBoundaryIs");for(f=0;f<g.length;f++){h=this.parseCoords(g[f]);if(h){c.push(h)}}if(!a.length){return}if(d.fillColor){d.fill=true}if(a.length===1){return new L.Polygon(a.concat(c),d)}return new L.MultiPolygon(a,d)},getLatLngs:function(b){var c=b.getElementsByTagName("coordinates");var d=[];for(var a=0;a<c.length;a++){d=d.concat(this._read_coords(c[a]))}return d},_read_coords:function(b){var e="",c=[],a;for(a=0;a<b.childNodes.length;a++){e=e+b.childNodes[a].nodeValue}e=e.split(/[\s\n]+/);for(a=0;a<e.length;a++){var d=e[a].split(",");if(d.length<2){continue}c.push(new L.LatLng(d[1],d[0]))}return c},_read_gxcoords:function(a){var c="",b=[];c=a.firstChild.nodeValue.split(" ");b.push(new L.LatLng(c[1],c[0]));return b},parseGroundOverlay:function(d){var c=d.getElementsByTagName("LatLonBox")[0];var g=new L.LatLngBounds([c.getElementsByTagName("south")[0].childNodes[0].nodeValue,c.getElementsByTagName("west")[0].childNodes[0].nodeValue],[c.getElementsByTagName("north")[0].childNodes[0].nodeValue,c.getElementsByTagName("east")[0].childNodes[0].nodeValue]);var a={Icon:true,href:true,color:true};function f(j){var h={},n={};for(var l=0;l<j.childNodes.length;l++){var o=j.childNodes[l];var k=o.tagName;if(!a[k]){continue}var m=o.childNodes[0].nodeValue;if(k==="Icon"){n=f(o);if(n.href){h.href=n.href}}else{if(k==="href"){h.href=m}else{if(k==="color"){h.opacity=parseInt(m.substring(0,2),16)/255;h.color="#"+m.substring(6,8)+m.substring(4,6)+m.substring(2,4)}}}}return h}var b={};b=f(d);if(c.getElementsByTagName("rotation")[0]!==undefined){var e=c.getElementsByTagName("rotation")[0].childNodes[0].nodeValue;b.rotation=parseFloat(e)}return new L.RotatedImageOverlay(b.href,g,{opacity:b.opacity,angle:b.rotation})}});L.KMLIcon=L.Icon.extend({options:{iconSize:[32,32],iconAnchor:[16,16]},_setIconStyles:function(a,b){L.Icon.prototype._setIconStyles.apply(this,[a,b]);if(a.complete){this.applyCustomStyles(a)}else{a.onload=this.applyCustomStyles.bind(this,a)}},applyCustomStyles:function(a){var b=this.options;this.options.popupAnchor=[0,-0.83*a.height];if(b.anchorType.x==="fraction"){a.style.marginLeft=-b.anchorRef.x*a.width+"px"}if(b.anchorType.y==="fraction"){a.style.marginTop=-(1-b.anchorRef.y)*a.height+1+"px"}if(b.anchorType.x==="pixels"){a.style.marginLeft=-b.anchorRef.x+"px"}if(b.anchorType.y==="pixels"){a.style.marginTop=b.anchorRef.y-a.height+1+"px"}}});L.KMLMarker=L.Marker.extend({options:{icon:new L.KMLIcon.Default()}});L.RotatedImageOverlay=L.ImageOverlay.extend({options:{angle:0},_reset:function(){L.ImageOverlay.prototype._reset.call(this);this._rotate()},_animateZoom:function(a){L.ImageOverlay.prototype._animateZoom.call(this,a);this._rotate()},_rotate:function(){if(L.DomUtil.TRANSFORM){this._image.style[L.DomUtil.TRANSFORM]+=" rotate("+this.options.angle+"deg)"}else{if(L.Browser.ie){var a=this.options.angle*(Math.PI/180),b=Math.cos(a),c=Math.sin(a);this._image.style.filter+=" progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+b+", M12="+-c+", M21="+c+", M22="+b+")"}}},getBounds:function(){return this._bounds}});