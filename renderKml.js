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

snapShotPolygon('AR 12345', [
    { x: 38.8941386, y: -77.0236192 },
    { x: 38.8761386, y: -77.0236192 },
    { x: 38.8761386, y: -77.0288192 },
    { x: 38.8941386, y: -77.0288192 },
]);
