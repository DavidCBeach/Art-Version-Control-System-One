var http = require('http');
var url = require('url');
var dt - require("./dategetter")
var fs = require('fs');
var formidable = require('formidable');
const sqlite3 = require("sqlite3").verbose();

http.createServer(function (req, res) {
  let db = new sqlite3.Database('./db/filedb.sl3', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize(() => {
    db.each(`select * from files`,
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row.id + "\t" + row.name);
  });
});
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = './files/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("[404] "+ req.url);
      fs.appendFile('log', "[404] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    console.log("[200] "+req.url);
    fs.appendFile('log', "[200] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
    return res.end();
  });
  }
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}).listen(8080); 
