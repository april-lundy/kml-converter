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
  window.setTimeout(function() {
    page.evaluate(function() {
      document.querySelector('.leaflet-control-attribution').style.visibility = 'hidden';
    });

    page.render(system.args[2]);
    phantom.exit();
  }, 500)
});
