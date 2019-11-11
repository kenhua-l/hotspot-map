// Declare Variables
// var canvasWidth = parseFloat(document.getElementById("canvas").style.width);
// var canvasHeight = parseFloat(document.getElementById("canvas").style.height);
var canvasWidth = parseFloat(document.getElementById("canvas").offsetWidth);
var canvasHeight = parseFloat(document.getElementById("canvas").offsetHeight);
// console.log(canvasWidth + " " + canvasHeight);
// N 32.6 E 150
// S -18.75 W 86
var coords = { N: 32.6, S: -18.75, E: 150, W: 81.25 };
// Satellite
var satelliteCoords = { N: 32.6, S: -18.6, E: 144, W: 86 };
var boundSatelliteCoords = {};
// Wind
var windCoords = {};
var boundWindCoords = {};
var altX = coords.W;
var altY = coords.N;
// var offsetX = 729 / 64;
// var offsetY = 609 / 51.35;
var offsetX = canvasWidth / (coords.E - coords.W);
var offsetY = canvasHeight / (coords.S - coords.N);

var hotspotOffsetX = canvasWidth / Math.abs(coords.E - coords.W);
var hotspotOffsetY = canvasHeight / Math.abs(coords.S - coords.N);
// console.log(hotspotOffsetX);
// console.log(hotspotOffsetY);
var hotspot = [];
var boundaryArr = [];
var hotspotDisplay = true;
var boundaryDisplay = true;
var satelliteDisplay = false;
var windDisplay = false;

function setup() {
  frameRate(1);
  var cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.style("display", "block");
  cnv.parent("canvas");
  // console.log(cnv.parent("canvas").width);
  // createCanvas("100%", 100);
  img = loadImage("canvas.png"); // Load the image
  satellite = loadImage("satellite.png");
  wind = loadImage("wind");
  dot = loadImage("dot.png");
  fetch("./haze-hotspot.kml")
    .then(res => res.text())
    .then(kmltext => {
      // Create new kml overlay
      const parser = new DOMParser();
      const kml = parser.parseFromString(kmltext, "text/xml");
      const track = new L.KML(kml);
      for (var i = 0; i < track.latLngs.length; i++) {
        hotspot.push({ lat: track.latLngs[i].lat, lng: track.latLngs[i].lng });
      }
    });
  fetch("./haze-boundary.kml")
    .then(res => res.text())
    .then(kmltext => {
      // Create new kml overlay
      const parser = new DOMParser();
      const kml = parser.parseFromString(kmltext, "text/xml");
      const track = new L.KML(kml);
      const bounds = track.getLayers();
      boundaryArr = bounds;
    });

  fetch("./wind.kml")
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
      // console.log(boundWindCoords);
    });

  // Satellite
  boundSatelliteCoords = {
    NW: alterCoords(satelliteCoords.W, satelliteCoords.N),
    SE: alterCoords(satelliteCoords.E, satelliteCoords.S)
  };
  // console.log(boundSatelliteCoords);
}

function alterCoords(x, y) {
  var newX = (x - altX) * offsetX;
  var newY = (y - altY) * offsetY;
  return { newX, newY };
}

function markers(x, y) {
  noFill();
  stroke("red"); // Change the color
  strokeWeight(3);
  var mapX = Math.abs(x - altX) * hotspotOffsetX;
  var mapY = Math.abs(y - Math.abs(altY)) * hotspotOffsetY;

  // console.log("before " + x, y);
  // console.log("after " + mapX, mapY);
  image(dot, mapX, mapY);
  // point(mapX, mapY);
}

function boundary(arr, options) {
  var c = color(options.fillColor);
  c.setAlpha(100);
  fill(c);
  stroke(options.color); // Change the color
  strokeWeight(1);
  beginShape();

  for (var i = 0; i < arr.length; i++) {
    var mapX = Math.abs(arr[i].lng - altX) * hotspotOffsetX;
    var mapY = Math.abs(arr[i].lat - Math.abs(altY)) * hotspotOffsetY;
    vertex(mapX, mapY);
  }
  endShape(CLOSE);
}

function draw() {
  // Load Image
  image(img, 0, 0);
  img.resize(canvasWidth, canvasHeight);
  // load data
  if (hotspotDisplay === true) {
    showHotspot();
  }

  if (boundaryDisplay === true) {
    showBoundary();
  }
  // Wind
  if (windDisplay === true) {
    // wind.resize(729, 609);

    const WindEast = canvasWidth - boundWindCoords.SE.newX;
    const WindSouth = canvasHeight - boundWindCoords.SE.newY;
    const windHeight = boundWindCoords.SE.newY - boundWindCoords.NW.newY;
    const windWidth = boundWindCoords.SE.newX - boundWindCoords.NW.newX;
    image(
      wind,
      boundWindCoords.NW.newX,
      boundWindCoords.NW.newY,
      windWidth,
      windHeight
    );
  }

  // Satellite
  if (satelliteDisplay === true) {
    // satellite.resize(729, 609);
    // console.log("drawing");
    const satelliteEast = canvasWidth - boundSatelliteCoords.SE.newX;
    const satelliteSouth = canvasHeight - boundSatelliteCoords.SE.newY;
    const satelliteHeight =
      boundSatelliteCoords.SE.newY - boundSatelliteCoords.NW.newY;
    const satelliteWidth =
      boundSatelliteCoords.SE.newX - boundSatelliteCoords.NW.newX;
    image(
      satellite,
      boundSatelliteCoords.NW.newX,
      boundSatelliteCoords.NW.newY,
      satelliteWidth,
      satelliteHeight
    );
  }
}

function showHotspot() {
  for (var p = 0; p < hotspot.length; p++) {
    markers(hotspot[p].lng, hotspot[p].lat);
  }
  // noFill();
  // stroke("red"); // Change the color
  // strokeWeight(3);
  // point(615.84, 834.989);
}

function showBoundary() {
  for (var c = 0; c < boundaryArr.length; c++) {
    boundary(boundaryArr[c].getLatLngs()[0], boundaryArr[c].options);
  }
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

$(document).ready(function() {
  // console.log("running");
  $("#canvasDiv").scrollTop(280);
  $("#canvasDiv").scrollLeft(150);
});
