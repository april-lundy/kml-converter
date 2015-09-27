var extractPolygons = require('./extract-polygons');
var phantom = require('phantom');
var basename = require('path').basename;

function snapShotPolygons(serialNumber, polygons, complete) {
  phantom.create('--ssl-protocol=any', function(phantomHandle) {
    phantomHandle.createPage(function(page) {
      var url = 'http://localhost:1337#' + JSON.stringify(polygons);
      console.log(url.length);
      page.open(url, function(status) {
        setTimeout(function() {
          page.evaluate(function() {
            document.querySelector('.leaflet-control-attribution').style.visibility = 'hidden';
          });
          console.log('  Rendering');
          page.render(serialNumber + '.png');
          phantomHandle.exit();
          complete && complete();
          console.log('  Done.');
        }, 500);
      });
    });
  });
};


var filename = process.argv[2];
extractPolygons(filename, function(polygons) {
  console.log('About to load', basename(filename, '.kml'));
  snapShotPolygons(basename(filename, '.kml'), polygons);
});
