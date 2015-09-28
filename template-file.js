var fs = require('fs');
var _ = require('lodash');

/**
 * Loads a template and renders it to an output file with the provided data
 *
 * @param templateFile The path to the template
 * @param outputFile   The file to put the output in
 * @param data         The data to pass to the template
 *
 * @return void
 */
module.exports = function(templateFile, outputFile, data) {
  var contents = fs.readFileSync(templateFile);
  var templateFunction = _.template(contents);
  var templated = templateFunction(data);
  fs.writeFileSync(outputFile, templated);
}
