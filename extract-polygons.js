var fs = require('fs');
var xml2js = require('xml2js');
var basename = require('path').basename;

function mapRawPointsToObjectArray(rawPointsString) {
  return rawPointsString.split(' ').map(function(token) {
    var splitTokens = token.split(',');
    return {
      x: Number(Number(splitTokens[1]).toPrecision(8)),
      y: Number(Number(splitTokens[0]).toPrecision(8)),
    };
  });
}

function tmeToOpacity(tme) {
  if(isNaN(Number(tme))) {
    console.log('  BAD TME:', tme);
    return 0.5;
  }

  return (5 - Number(tme)) / 4;
}

module.exports = function(filename, callback) {
  var fileContents = fs.readFileSync(filename, { encoding: 'utf8' });
  xml2js.parseString(fileContents, { trim: true }, function(err, result) {
    var polygons = result.kml.Document[0].Folder[0].Placemark.map(function(placemark) {
      var rawPointsString = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
      return {
        points: mapRawPointsToObjectArray(rawPointsString),
        opacity: tmeToOpacity(placemark.name),
      };
    });

    callback && callback(polygons);
  });
};
