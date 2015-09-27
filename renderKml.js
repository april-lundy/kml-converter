var fs = require('fs');
var async = require('async');
var xml2js = require('xml2js');
var phantom = require('phantom');

function snapShotPolygon(serialNumber, points, complete) {
  phantom.create('--ssl-protocol=any', function(phantomHandle) {
    phantomHandle.createPage(function(page) {
      var url = 'http://localhost:1337#' + JSON.stringify(points);
      page.open(url, function(status) {
        setTimeout(function() {
          page.evaluate(function() {
            document.querySelector('.leaflet-control-attribution').style.visibility = 'hidden';
          });
          console.log('Rendering ' + serialNumber);
          page.render(serialNumber + '.png');
          phantomHandle.exit();
          complete && complete();
        }, 500);
      });
    });
  });
};

function mapRawPointsToObjectArray(rawPointsString) {
  return rawPointsString.split(' ').map(function(token) {
    var splitTokens = token.split(',');
    return {
      x: parseFloat(splitTokens[1]),
         y: parseFloat(splitTokens[0])
    };
  });
}

var fileContents = fs.readFileSync('example_smallest.kml', { encoding: 'utf8' });
xml2js.parseString(fileContents, { trim: true }, function(err, result) {
  var placeMarkProcessors = result.kml.Document[0].Folder[0].Placemark.map(function(placemark) {
    var serialNumber = placemark.name[0];
    var rawPointsString = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
    var points = mapRawPointsToObjectArray(rawPointsString);
    return function(callback) {
      snapShotPolygon(serialNumber, points, callback);
    };
  });

  async.series(placeMarkProcessors);
});
