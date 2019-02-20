const http = require('http');
var express = require("express");
const app = express()
var url = require('url');
var fs = require('fs');
var dt = require("./custom_modules/dategetter")
var formidable = require('formidable');
const sqlite3 = require("sqlite3").verbose();
var PSD = require('psd');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


//TODO:
//difference showwer
//multiple account support
//Multiple files with same version number for project with multiple files

const hostname = '127.0.0.1';
const port = 3000;

let global_req;
let global_res;

//TODO: for file compare read in all pixel info and compare between versions
//if there is difference color with highlight effect
//then show modified image to show changes in files

app.post('/fileupload', (req, res) => {
  var form = new formidable.IncomingForm();
  global_req = req;
  global_res = res;
  form.parse(req, function (err, fields, files) {

    fileAdd(files);

});
});
app.post('/progupload', (req, res) => {
  //console.log(req.body);
  var form = new formidable.IncomingForm();
  global_req = req;
  global_res = res;
  form.parse(req, function (err, fields, files) {
    if(files.filetoupload.name && fields.progname){
      fileAdd(files,true,fields.progname);
    } else {
      fileReader("/newProject.html",req,res);
    }

});
});


app.use(express.static('public'));

app.get('/download', function(req, res){
  var file = "./public/files/"+ req.query.file;
  res.download(file,req.query.name+req.query.dateversion); // Set disposition and send it.
});


app.get('/test', (req, res) => {
  console.log(req.query.snake);
});

app.get('/getfiles', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select distinct name from files`,
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row);
     res.json({files:row});
  });

});
app.get('/getlatest', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select * from projects, files where projects.id = files.project_id and projects.version = files.version`,
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row);
     res.json({files:row});
  });


});


app.get('/getinfo', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select * from files where name = ? order by version desc`,[req.query.file],
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row);
     res.json({info:row});
  });


});


app.get('/getfolders', (req, res) => {
  fs.readdir("./public/files/", (err, files) => {
    var folders = [];
    for(i = 0; i < files.length;i++){
      if(!(files[i].includes(".png") || files[i].includes(".jpg") || files[i].includes(".JPG")|| files[i].includes(".gif"))){
        folders.push(files[i])
      }
    }
   res.json({ folders: folders });

  });

});

app.get('/sqlfiles', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select * from files`,
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row);
     res.json({files: row})
  });
});
app.get('/sqlprojects', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select * from projects`,
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row);
     res.json({files: row})
  });
});

app.get('/*', (req, res) => {
    var q = url.parse(req.url, true);
    var filename =  q.pathname;
    if(filename == "/"){
      filename = "/library.html";
    }
    console.log(filename);
    fileReader(filename,req,res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


var fileAdd = function(files,prog = false,progname = ""){
  var filename  = files.filetoupload.name;
  var filepath = files.filetoupload.path;
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  var filenameParts = filename.split('.');
  var length = filenameParts.length;
  var extension = filenameParts[length-1];
  filenameParts.length = length - 1;
  if(!prog){
    name = global_req.query.name;
  } else {
    name = progname;
  }
  console.log(global_req.query.name);

  //TODO: input each file upload as new row and make get get the largest version of file to make the
  // new row the next version. also file might be put into a folder with file name as folder name
  // and each file named the version number
  fileInsert(db,name,extension,filepath);
}

var filePather = function(version,name,oldpath,extension){
  var newpath = './public/files/' + name + '/'+version +'.'+extension;
  var dir = './public/files/' + name;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  fs.rename(oldpath, newpath, function (err) {
    if (err) throw err;
    if(extension == "psd"){
      fileConverter('./public/files/' + name + '/'+version);
    }
    //TODO: galibrary upload returns to galibrary
    fileReader("/library.html",global_req,global_res);
  });
}

var filesInsert = function(db,name,extension,version,id ){
  var date =  new Date();
  db.run(`INSERT INTO files(name,extension,version,date, project_id) VALUES(?,?,?,?,?)`, [name,extension,version,date,id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(version, id);
    db.run(`update projects set version = ? where id = ?`, [version,id], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("updated");
    });
    date = null;

  });
}

var fileInsert = function(db,name,extension,filepath){
  db.get(`select id,version from projects where name = ? `,[name],
     (err, row) => {
     if (err) {
       console.error("vsause error here",err.message);
     }
     if (row) {
       version = row.version + 1;
       id = row.id;
    console.log(version, id);
    filesInsert(db, name,extension,version,id);
    filePather(version,name,filepath,extension);
  } else {
    db.run('insert into projects(name,version) values(?,?)',[name,0], function(err) {
      if (err) {console.error("vsause error here",err.message);}
      version = 0;
      db.get(`select id from projects where name = ? `,[name],
         (err, row) => {
         if (err) {
           console.error("vsause error here",err.message);
         }
         id = row.id;
         filesInsert(db,name,extension,version,id);
         filePather(version,name,filepath,extension);
       });
});
}

  });

}

var fileReader = function(filename,req,res){
    filename = "./templates" + filename;
    fs.readFile(filename, function(err, data) {

    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("[404] "+ req.url);
      //fs.appendFile('log', "[404] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    console.log("[200] "+req.url);
    //disabling log
    //fs.appendFile('log', "[200] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
    return res.end();
    });

  }

var fileConverter = function(filename) {
PSD.open(filename+".psd").then(function (psd) {
  return psd.image.saveAsPng(filename+".png");
}).then(function () {
  console.log('Finished!');
});
}
