var fs = require('fs');

module.exports = function(templateFile, outputFile, data) {
  var contents = fs.readFileSync(templateFile);
  var templateFunction = _.template(contents);
  var templated = templateFunction(data);
  fs.writeFileSync(outputFile, templated);
}
