var hotspotDisplay = true;
var boundaryDisplay = true;
var satelliteDisplay = false;
var windDisplay = false;
// Image
var mapIMG = "canvas.png";
var dotIMG = "dot.png";
function defineSketch(
  hotspotKML,
  boundaryKML,
  windKML,
  satelliteIMG,
  windIMG,
  canvasWidth,
  canvasHeight
) {
  return function(p) {
    // var canvasWidth = parseFloat(document.getElementById("canvas").offsetWidth);
    // var canvasHeight = parseFloat(
    //   document.getElementById("canvas").offsetHeight
    // );
    console.log(canvasWidth, canvasHeight);
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
      // Wind
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

      // p.strokeWeight(150);
      // p.stroke(256);
      // p.noFill();
      // p.rect(0, 0, 800, 800);
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

function toggleHotspot() {
  if (hotspotDisplay === false) {
    hotspotDisplay = true;
  } else {
    hotspotDisplay = false;
  }
}

function toggleBoundary() {
  if (boundaryDisplay === false) {
    boundaryDisplay = true;
  } else {
    boundaryDisplay = false;
  }
}

function toggleSatellite() {
  if (satelliteDisplay === false) {
    satelliteDisplay = true;
  } else {
    satelliteDisplay = false;
  }
}

function toggleWind() {
  if (windDisplay === false) {
    windDisplay = true;
  } else {
    windDisplay = false;
  }
}

// var canvasWidth = parseFloat(document.getElementById("canvas").offsetWidth);
// var canvasHeight = parseFloat(document.getElementById("canvas").offsetHeight);

var mySketch = defineSketch(
  "./data/hotspot.kml",
  "./data/boundary.kml",
  "./data/wind.kml",
  "./data/satellite.png",
  "./data/wind.png",
  parseFloat(document.getElementById("canvas").offsetWidth),
  parseFloat(document.getElementById("canvas").offsetHeight)
);

let myp5 = new p5(mySketch, "canvas");
let myp56 = new p5(mySketch, "canvas1");
let myp57 = new p5(mySketch, "canvas2");

$(document).ready(function() {
  $("#canvasDiv").scrollTop(280);
  $("#canvasDiv").scrollLeft(150);
  $("#canvasDiv1").scrollTop(280);
  $("#canvasDiv1").scrollLeft(150);
  $("#canvasDiv2").scrollTop(280);
  $("#canvasDiv2").scrollLeft(150);
});
