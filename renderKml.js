var path = require('path');
var extractPolygons = require('./extract-polygons');
var templateFile = require('./template-file')
var phantom = require('phantomjs').path;
var childProcess = require('child_process');

var snapShotPolygons = function(name, polygons) {
  templateFile('index.tmpl.html', name + '.html', { polygons: polygons });
  var args = [
    path.join(__dirname, 'snapshot-polygon.js'),
    name + '.html',
    name + '.png'
  ];
  childProcess.execFile(phantom, args, function(err, stdout, stderr) {
    if(err) {
      console.log(err);
    }
    console.log(stdout);
    console.log(stderr);
  });
};

var filename = process.argv[2];
extractPolygons(filename, function(polygons) {
  console.log('About to load', path.basename(filename, '.kml'));
  snapShotPolygons(path.basename(filename, '.kml'), polygons);
});
