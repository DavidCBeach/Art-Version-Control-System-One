var fs = require('fs');

var getFileNames = function (folder){
  var files = fs.readdirSync(folder);
  return files;
}
