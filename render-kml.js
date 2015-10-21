var childProcess = require('child_process');
var extractPolygons = require('./extract-polygons');
var fs = require('fs');
var path = require('path');
var phantom = require('phantomjs').path;
var templateFile = require('./template-file');

var snapShotPolygons = function(name, polygons, callback) {
  // default the callback to always be a function (even if its a no-op)
  if(typeof callback !== 'function') {
    callback = function() { };
  }

  // Use index.tmpl.html as a template, but substitute in the polygons provided
  templateFile('index.tmpl.html', name + '.html', { polygons: polygons });

  // build out the args to the phantom script and run it:
  // phantomjs snapshot-polygon.js name.html name.png
  var args = [
    path.join(__dirname, 'snapshot-polygon.js'),
    name + '.html',
    name + '.png'
  ];
  childProcess.execFile(phantom, args, function(err, stdout, stderr) {
    // Once we've finished, print out any forwarded output
    if(err) {
      return callback(err, stdout, stderr);
    }

    // remove the templated file
    fs.unlink(name + '.html');

    // Notify that were done
    return callback(null, stdout, stderr);
  });
};

// use the second arg (node renderKml.js FILENAME.kml) as the input file
var filename = process.argv[2];
extractPolygons(filename, function(polygons) {
  console.log('About to load', path.basename(filename, '.kml'));
  snapShotPolygons(path.basename(filename, '.kml'), polygons, function() {
    console.log(arguments);
  });
});
