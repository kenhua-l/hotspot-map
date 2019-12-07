var hotspotDisplay = true;
var boundaryDisplay = true;
var satelliteDisplay = false;
var windDisplay = false;
// Image
var mapIMG = "canvas.png";
var dotIMG = "dot.png";

function defineSketch(hotspotKML,boundaryKML,windKML,satelliteIMG,windIMG,canvasWidth,canvasHeight) {
  return function(p) {
    // Fixed
    const coords = { N: 32.6, S: -18.75, E: 150, W: 81.25 };
    const satelliteCoords = { N: 32.6, S: -18.6, E: 144, W: 86 };
    var boundSatelliteCoords = {};
    // Wind
    var windCoords = {};
    var boundWindCoords = {};
    var altX = coords.W;
    var altY = coords.N;
    var offsetX = canvasWidth / (coords.E - coords.W);
    var offsetY = canvasHeight / (coords.S - coords.N);
    var hotspotOffsetX = canvasWidth / Math.abs(coords.E - coords.W);
    var hotspotOffsetY = canvasHeight / Math.abs(coords.S - coords.N);
    var hotspot = [];
    var boundaryArr = [];

    p.setup = function() {
      p.frameRate(1);
      p.createCanvas(canvasWidth, canvasHeight);

      // Load image
      img = p.loadImage(mapIMG);
      satellite = p.loadImage(satelliteIMG);
      wind = p.loadImage(windIMG);
      dot = p.loadImage(dotIMG);
      loadKml();
    };

    function loadKml() {
      fetch(hotspotKML)
        .then(res => res.text())
        .then(kmltext => {
          // Create new kml overlay
          const parser = new DOMParser();
          const kml = parser.parseFromString(kmltext, "text/xml");
          const track = new L.KML(kml);
          for (var i = 0; i < track.latLngs.length; i++) {
            hotspot.push({
              lat: track.latLngs[i].lat,
              lng: track.latLngs[i].lng
            });
          }
        });
      fetch(boundaryKML)
        .then(res => res.text())
        .then(kmltext => {
          // Create new kml overlay
          const parser = new DOMParser();
          const kml = parser.parseFromString(kmltext, "text/xml");
          const track = new L.KML(kml);
          const bounds = track.getLayers();
          boundaryArr = bounds;
        });

      fetch(windKML)
        .then(res => res.text())
        .then(kmltext => {
          // Create new kml overlay
          const parser = new DOMParser();
          const kml = parser.parseFromString(kmltext, "text/xml");
          const track = new L.KML(kml);
          var windBoundNE = track
            .getLayers()[0]
            .getBounds()
            .getNorthEast();
          var windBoundSW = track
            .getLayers()[0]
            .getBounds()
            .getSouthWest();
          windCoords = {
            N: windBoundNE.lat,
            E: windBoundNE.lng,
            S: windBoundSW.lat,
            W: windBoundSW.lng
          };
          boundWindCoords = {
            NW: alterCoords(windCoords.W, windCoords.N),
            SE: alterCoords(windCoords.E, windCoords.S)
          };
        });
      // Satellite
      boundSatelliteCoords = {
        NW: alterCoords(satelliteCoords.W, satelliteCoords.N),
        SE: alterCoords(satelliteCoords.E, satelliteCoords.S)
      };
    }
    function alterCoords(x, y) {
      var newX = (x - altX) * offsetX;
      var newY = (y - altY) * offsetY;
      return { newX, newY };
    }

    function markers(x, y) {
      p.noFill();
      p.stroke("red"); // Change the color
      p.strokeWeight(3);
      var mapX = Math.abs(x - altX) * hotspotOffsetX;
      var mapY = Math.abs(y - Math.abs(altY)) * hotspotOffsetY;
      p.image(dot, mapX, mapY);
    }

    function boundary(arr, options) {
      var c = p.color(options.fillColor);
      c.setAlpha(100);
      p.fill(c);
      p.stroke(options.color); // Change the color
      p.strokeWeight(1);
      p.beginShape();

      for (var i = 0; i < arr.length; i++) {
        var mapX = Math.abs(arr[i].lng - altX) * hotspotOffsetX;
        var mapY = Math.abs(arr[i].lat - Math.abs(altY)) * hotspotOffsetY;
        p.vertex(mapX, mapY);
      }
      p.endShape(p.CLOSE);
    }

    p.draw = function() {
      p.image(img, 0, 0);
      img.resize(canvasWidth, canvasHeight);

      if (hotspotDisplay === true) {
        showHotspot();
      }

      if (boundaryDisplay === true) {
        showBoundary();
      }
      //Wind
      if (windDisplay === true) {
        const WindEast = canvasWidth - boundWindCoords.SE.newX;
        const WindSouth = canvasHeight - boundWindCoords.SE.newY;
        const windHeight = boundWindCoords.SE.newY - boundWindCoords.NW.newY;
        const windWidth = boundWindCoords.SE.newX - boundWindCoords.NW.newX;
        p.image(
          wind,
          boundWindCoords.NW.newX,
          boundWindCoords.NW.newY,
          windWidth,
          windHeight
        );
      }
      // Satellite
      if (satelliteDisplay === true) {
        const satelliteEast = canvasWidth - boundSatelliteCoords.SE.newX;
        const satelliteSouth = canvasHeight - boundSatelliteCoords.SE.newY;
        const satelliteHeight =
          boundSatelliteCoords.SE.newY - boundSatelliteCoords.NW.newY;
        const satelliteWidth =
          boundSatelliteCoords.SE.newX - boundSatelliteCoords.NW.newX;
        p.image(
          satellite,
          boundSatelliteCoords.NW.newX,
          boundSatelliteCoords.NW.newY,
          satelliteWidth,
          satelliteHeight
        );
      }
    };

    function showHotspot() {
      for (var p = 0; p < hotspot.length; p++) {
        markers(hotspot[p].lng, hotspot[p].lat);
      }
    }

    function showBoundary() {
      for (var c = 0; c < boundaryArr.length; c++) {
        boundary(boundaryArr[c].getLatLngs()[0], boundaryArr[c].options);
      }
    }
  };
}

function checkboxes(){
  if(jQuery('#overlay1').prop('checked') == true){
    showMarkers();
  }
  if(jQuery('#overlay2').prop('checked') == true){
    toggleOverlay();
  }
}

function toggleOverlay() {
  if (satelliteDisplay === false) {
    satelliteDisplay = true;
  } else {
    satelliteDisplay = false;
  }
}

function showMarkers() {
  if (windDisplay === false) {
    windDisplay = true;
  } else {
    windDisplay = false;
  }
}

function pannable() {
  var curDown = false,
      curYPos = 0,
      curXPos = 0,
      scrollTop = 0,
      scrollLeft = 0;
  $('#canvasDiv').on('mousemove', function (m) {
      if (curDown === true) {
          $('#canvasDiv').scrollTop(scrollTop + (curYPos - m.pageY));
          $('#canvasDiv').scrollLeft(scrollLeft + (curXPos - m.pageX));
      }
  });
  $('#canvasDiv').on('touchmove', function (m) {
      m.preventDefault();
      if (curDown === true) {
          $('#canvasDiv').scrollTop(scrollTop + (curYPos - m.originalEvent.touches[0].pageY));
          $('#canvasDiv').scrollLeft(scrollLeft + (curXPos - m.originalEvent.touches[0].pageX));
      }
  });
  $('#canvasDiv').on('mousedown', function (m) {
      curDown = true;
      curYPos = m.pageY;
      curXPos = m.pageX;
      scrollTop = $('#canvasDiv').scrollTop();
      scrollLeft = $('#canvasDiv').scrollLeft();
  });
  $('#canvasDiv').on('touchstart', function (m) {
      curDown = true;
      curYPos = m.originalEvent.touches[0].pageY;
      curXPos = m.originalEvent.touches[0].pageX;
      scrollTop = $('#canvasDiv').scrollTop();
      scrollLeft = $('#canvasDiv').scrollLeft();
  });
  $(window).on('mouseup touchend', function () {
      curDown = false;
  });
}