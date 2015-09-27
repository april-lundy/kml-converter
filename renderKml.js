var fs = require('fs');
var xml2js = require('xml2js');
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

function mapRawPointsToObjectArray(rawPointsString) {
  return rawPointsString.split(' ').map(function(token) {
    var splitTokens = token.split(',');
    return {
      x: Number(Number(splitTokens[1]).toPrecision(8)),
      y: Number(Number(splitTokens[0]).toPrecision(8)),
    };
  });
}

var filename = process.argv[2];
var fileContents = fs.readFileSync(filename, { encoding: 'utf8' });
xml2js.parseString(fileContents, { trim: true }, function(err, result) {
  var polygons = result.kml.Document[0].Folder[0].Placemark.map(function(placemark) {
    var rawPointsString = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
    return {
      points: mapRawPointsToObjectArray(rawPointsString),
      opacity: 1,
    };
  });

  console.log('About to load', basename(filename, '.kml'));
  snapShotPolygons(basename(filename, '.kml'), polygons);
});
