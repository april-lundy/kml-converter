var fs = require('fs');
var path = require('path');
var extractPolygons = require('./extract-polygons');
var templateFile = require('./template-file')
var phantom = require('phantomjs').path;
var childProcess = require('child_process');

var snapShotPolygons = function(name, polygons) {
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
      console.log(err);
    }
    console.log(stdout);
    console.log(stderr);

    // remove the templated file
    fs.unlink(name + '.html');
  });
};

// use the second arg (node renderKml.js FILENAME.kml) as the input file
var filename = process.argv[2];
extractPolygons(filename, function(polygons) {
  console.log('About to load', path.basename(filename, '.kml'));
  snapShotPolygons(path.basename(filename, '.kml'), polygons);
});
