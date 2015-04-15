var fs = require('fs');
var xml2js = require('xml2js');
var phantom = require('phantom');

function snapShotPolygon(serialNumber, points) {
    phantom.create('--ssl-protocol=any', function(phantomHandle) {
        phantomHandle.createPage(function(page) {
            var url = 'http://localhost:1337#' + JSON.stringify(points);
            page.open(url, function(status) {
                setTimeout(function() {
                    console.log('Rendering ' + serialNumber);
                    page.render(serialNumber + '.png');
                    phantomHandle.exit();
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

var fileContents = fs.readFileSync('example_small.kml', { encoding: 'utf8' });
xml2js.parseString(fileContents, { trim: true }, function(err, result) {
    result.kml.Document[0].Folder[0].Placemark.forEach(function(placemark) {
        var serialNumber = placemark.name[0];
        var rawPointsString = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
        var points = mapRawPointsToObjectArray(rawPointsString);
        snapShotPolygon(serialNumber, points);
    });
});
