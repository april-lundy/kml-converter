var page = require('webpage').create();
var system = require('system');

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
