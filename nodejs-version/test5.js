const http = require('http');
var express = require("express");
const app = express()
var url = require('url');
var fs = require('fs');
var dt = require("./custom_modules/dategetter")
var formidable = require('formidable');
const sqlite3 = require("sqlite3").verbose();

const hostname = '127.0.0.1';
const port = 3000;

//TODO: for file compare read in all pixel info and compare between versions
//if there is difference color with highlight effect
//then show modified image to show changes in files

app.post('/fileupload', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './public/files/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      fileReader("/home.html",req,res);
    });

});
});

app.use(express.static('public'));



app.get('/getfiles', (req, res) => {
  fs.readdir("./public/files/", (err, files) => {
   res.json({ files: files });

  });

});

app.get('/sqltest', (req, res) => {
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
});

app.get('/*', (req, res) => {
    var q = url.parse(req.url, true);
    var filename =  q.pathname;
    fileReader(filename,req,res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


var sqlAdd = function(filename){
  

}



var fileReader = function(filename,req,res){
    filename = "./templates" + filename;
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
