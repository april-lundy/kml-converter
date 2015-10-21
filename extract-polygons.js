var fs = require('fs');
var xml2js = require('xml2js');
var basename = require('path').basename;

/**
 * Takes a raw point string (lon,lat lon,lat lon,lat ...) and splits into an array
 * of x-y point objects
 *
 * @param rawPointsString The raw points as a string
 * @return An array of objects
 */
function mapRawPointsToObjectArray(rawPointsString) {
  return rawPointsString.split(' ').map(function(token) {
    var splitTokens = token.split(',');
    return {
      x: Number(Number(splitTokens[1]).toPrecision(8)),
      y: Number(Number(splitTokens[0]).toPrecision(8)),
    };
  });
}

/**
 * Converts a tme to an opacity value
 *
 * @param tme The tme string
 * @return float
 */
function tmeToOpacity(tme) {
  if(isNaN(Number(tme))) {
    return 0.5;
  }

  return (5 - Number(tme)) / 4;
}

/**
 * Extracts an array of polygons from a given file, calling the passed callback when it's done
 *
 * @param filename The kml file to read from
 * @param callback A function to call when it's finished
 *
 * @return void
 */
module.exports = function(filename, callback) {
  // enforce that the callback is a function
  if(typeof callback != 'function') {
    callback = function() { };
  }

  var fileContents = fs.readFileSync(filename, { encoding: 'utf8' });
  xml2js.parseString(fileContents, { trim: true }, function(err, result) {
    var placemarks = result.kml.Document[0].Folder[0].Placemark;

    // If there are no placemarks in the file, then there are no polygons
    if(!(placemarks instanceof Array)) {
      return callback([]);
    }

    var polygons = placemarks.map(function(placemark) {
      var rawPointsString = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
      return {
        points: mapRawPointsToObjectArray(rawPointsString),
        opacity: tmeToOpacity(placemark.name),
      };
    });

    return callback(polygons);
  });
};
