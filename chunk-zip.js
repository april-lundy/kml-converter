var archiver = require('archiver');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');

// Don't proceed, unless we've got all the fields we need
if(process.argv.length < 4) {
  console.log('Usage: node chunk-zip.js <chunk_count> <file_glob>');
  process.exit(1);
}

// parse the command line args
var chunks = Number(process.argv[2]) || 1;
var filenames = glob.sync(process.argv[3]);

// if there are more chunks than files, truncate down
if(chunks > filenames.length) {
  chunks = filenames.length;
}

var filesPerChunk = Math.ceil(filenames.length / chunks);
_.range(0, chunks).forEach(function(chunk) {
  var archive = archiver.create('zip', {});
  
  // create the output stream where the actual zip file will be listed
  var archiveName = 'chunk-' + (chunk + 1) + '.zip';
  var output = fs.createWriteStream(archiveName);
  output.on('close', function() {
    var kbWritten = archive.pointer() / 1024;
    console.log(Math.round(kbWritten) + 'KB written in ' + archiveName);
  });
  archive.pipe(output);

  // get the files that will be in the chunk, and append to the archive
  var filesInThisChunk = filenames.slice(chunk * filesPerChunk, (chunk + 1) * filesPerChunk);
  filesInThisChunk.forEach(function(filename) {
    console.log('  Adding ' + filename + ' to ' + archiveName);
    archive.file(filename, { name: filename });
  });

  // Now, write the data out
  archive.finalize();
});
