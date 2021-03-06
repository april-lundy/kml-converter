#!/usr/bin/env node

var async = require('async');
var childProcess = require('child_process');
var extractPolygons = require('./extract-polygons');
var fs = require('fs');
var glob = require('glob');
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
    console.log('  Done with ' + name);
    return callback(null, 'Done with ' + name);
  });
};


var polygonExtractor = function(filename) {
  return function(callback) {
    extractPolygons(filename, function(polygons) {
      console.log('Loading', path.basename(filename, '.kml'));
      snapShotPolygons(path.basename(filename, '.kml'), polygons, function(err, result) {
        return callback(err, result);
      });
    });
  };
};

var processFiles = function(files, callback) {
  callback = callback || function() { };

  // make sure files is always an array
  if(!(files instanceof Array)) {
    files = [files];
  }

  async.series(files.map(polygonExtractor), callback);
};

// if the file is not the main script, export the "doer" function for others to use, otherwise try to run it immediately
// from: https://nodejs.org/docs/v4.2.1/api/modules.html (See Accessing the main module)
if(require.main === module) {
  // use the second arg (node renderKml.js glob) to specify files
  processFiles(glob.sync(process.argv[2]), function() {
    console.log('Done!');
  });
} else {
  module.exports.processFiles = processFiles;
}
