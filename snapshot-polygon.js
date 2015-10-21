var page = require('webpage').create();
var system = require('system');

/**
 * Simple script to snapshot a webpage. Currently, defaults to localhost:1337 pages:
 *
 * Usage:
 *   phantomjs snapshot-polygon.js file.html output.png
 *
 * This call will snapshot localhost:1337/file.html and save it into output.png
 */
page.viewportSize = { width: 1024, height: 720 };
page.open('http://localhost:1337/' + system.args[1], function(status) {

  // We're using setTimeout here to "sleep" a little bit, so that the page has time to render
  window.setTimeout(function() {

    // Remove the attribution control
    page.evaluate(function() {
      document.querySelector('.leaflet-control-attribution').style.visibility = 'hidden';
    });

    // save the image
    page.render(system.args[2]);

    // tell phantom we're done
    phantom.exit();
  }, 500);
});
