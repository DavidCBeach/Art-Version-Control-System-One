const http = require('http');
var express = require("express");
var session = require('express-session')
const app = express();
var url = require('url');
var fs = require('fs');
var dt = require("./custom_modules/dategetter")
var formidable = require('formidable');
const sqlite3 = require("sqlite3").verbose();
var crypto = require('crypto');
const browser = require('browser-detect');
var encryptpass = require('./custom_modules/encrypt.mjs');
algorithm = 'aes-256-ctr';
password = encryptpass.password();
var PSD = require('psd');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))


//likes TODO: for file compare read in all pixel info and compare between versions
//if there is difference color with highlight effect
//then show modified image to show changes in files
//Multiple files with same version number for project with multiple files
//allow project names to contain spaces
//card view mode for library and galibrary
//public profile

//req TODO
//search function
//handle names with '-'  for file upload from galibrary


const hostname = '127.0.0.1';
const port = 3000;

let globalReq;
let globalRes;


app.post('/fileupload', (req, res) => {
  var form = new formidable.IncomingForm();
  globalReq = req;
  globalRes = res;
  form.parse(req, function (err, fields, files) {
    fileAdd(files);
  });
});

app.post('/deletefile', (req, res) => {
  var version = req.body.version;
  var id = req.body.id;
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

      db.get(`select * from (select * from ( select id as projects_id, name, version as project_version, account_id from projects), files where projects_id = files.project_id) where id = ?`,[id], (err, row) =>{
          console.log(row);
          console.log("version: " + version);
          if(row.project_version == version){
            version = row.version - 1;
            db.run(`update projects set version = ? where id = ?`, [version,row.project_id], function(err) {
              if (err) {
                return console.log(err.message);
              }
              console.log("project version updated");
              db.run('delete from files where id = ?',[id], function(err){
            });
            });
          } else {
            db.run('delete from files where id = ?',[id], function(err){
          });
        }
});
// console.log(id);
// console.log(version);
// db.all(`select id, name, version as project_version, account_id from projects`, (err, row) =>{
//         console.log(row);
//
//          });
// db.all(`select * from (select * from ( select id as projects_id, name, version as project_version, account_id from projects), files where projects_id = files.project_id) where id = ?`,[id], (err, row) =>{
//         console.log(row);
//
//          });
});
app.post('/deleteproject', (req, res) => {
  var id = req.body.id;
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.run('delete from projects where id = ?',[id], function(err){
});
db.run('delete from files where project_id = ?',[id], function(err){
});

});
app.post('/progupload', (req, res) => {
  var form = new formidable.IncomingForm();
  globalReq = req;
  globalRes = res;
  form.parse(req, function (err, fields, files) {
    if((files.filetoupload.name && fields.progname)&&(!fields.progname.includes(" "))){
      console.log(fields);
      fileAdd(files,true,fields.progname,fields.public);
    } else {
      fileReader("/library.html",req,res);
    }
  });
});
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
app.post('/signin', (req, res) => {
  console.log("signin");
  var ssn = req.session;
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var password = encrypt(fields.password);
  var username = fields.username;
  console.log(password, username)
  db.get(`select * from accounts where username = ? and password = ? `,[username,password],
     (err, row) => {
     if (err) {
       console.error("vsause error here:",err.message);
     }
     if (row) {
       console.log("signed in");
       req.session.account = row.id;
       req.session.save(function(err) {
          // session saved
        })

  }
  });

  });
  fileReader("/library.html",req,res);
});
app.post('/signup', (req, res) => {
  console.log("signup");
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var password = encrypt(fields.password);
  var username = fields.username;
  db.get(`select * from accounts where username = ? `,[username],
     (err, row) => {
     if (err) {
       console.error("vsause error here:",err.message);
     }
     if (row) {

  } else {
    db.run('insert into accounts(username,password) values(?,?)',[username,password], function(err) {
      if (err) {console.error("vsause error here:",err.message);}
      console.log("user added");
      db.get(`select * from accounts where username = ? `,[username],
         (err, row) => {
         if (err) {
           console.error("vsause error here:",err.message);
         }
         if (!row) {


      console.log("signed in");
      req.session.account = row.id;
      req.session.save(function(err) {
         // session saved
       });
     }
     });
});
}

  fileReader("/library.html",req,res);
});
});
});
app.use(express.static('public'));

app.get('/download', function(req, res){
  var file = "./public/files/"+ req.query.file;
  res.download(file,req.query.name+req.query.dateversion);
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
  if(req.session.account){
    db.all(`select * from (select * from projects, files where projects.id = files.project_id and projects.version = files.version) where account_id = ?`,[req.session.account],
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     if(row){
       res.json({files:row});
     }

  });
  }

});
app.get('/getlatestpublic', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

    db.all(`select * from (select * from (select * from projects, files where projects.id = files.project_id and projects.version = files.version), accounts where accounts.id = account_id) where public = 1`,
     (err, rows) => {
     if (err) {
       console.error(err.message);
     }
     if(rows){
       res.json({files:rows});
     }

  });


});



app.get('/verifyaccount', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

       db.get(`select * from projects where id = ? and account_id = ?`,[req.query.id,req.session.account],
          (err, row) => {
          if (err) {
            console.error("vsause error here:",err.message);
          }
          if (row) {

            res.json({verification: true});
       } else {
         res.json({verification: false});
       }


     });



});
app.get('/getaccount', (req, res) => {
  res.json({account:req.session.account});



});
app.get('/signout', (req, res) => {
    req.session.account = -1;
    res.redirect("library.html");
});
app.get('/getinfo', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select * from files where project_id = ? order by version desc`,[req.query.file],
     (err, row) => {
     if (err) {
       console.error(err.message);
     } if(row){
       db.get(`select name from projects where id = ? `,[req.query.file],
          (err, row2) => {
          if (err) {
            console.error("vsause error here:",err.message);
          }
          if (row2) {

            res.json({info:row,name:row2["name"]});
       }


     });

  }
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
     res.json({files: row})
  });
});
app.get('/sqlaccounts', (req, res) => {
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
    db.all(`select * from accounts`,
     (err, row) => {
     if (err) {
       console.error(err.message);
     }
     res.json({accounts: row})
  });
});

app.get('/*', (req, res) => {
    var q = url.parse(req.url, true);
    var filename =  q.pathname;

    if(filename == "/"){
      filename = "/library.html";
    }
    fileReader(filename,req,res);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));


//opens db and extracts nessessary data for file upload
var fileAdd = function(files,prog = false,progname = "",public = "true"){
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
    name = globalReq.query.name;
  } else {
    name = progname;
  }
  fileInsert(db,name,extension,filepath,public);
}

//sets actual location of uploaded file
var filePather = function(version,id,oldpath,extension){
  var newpath = './public/files/' + id + '/'+version +'.'+extension;
  var dir = './public/files/' + id;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  fs.rename(oldpath, newpath, function (err) {
    if (err) throw err;
    if(extension == "psd"){
      fileConverter('./public/files/' + id + '/'+version);
    }
    //TODO: galibrary upload returns to galibrary
    fileReader("/library.html",globalReq,globalRes);
  });
}

//inserts new file into EXISTING project
var filesInsert = function(db,name,extension,version,id ){
  var date =  new Date();
  db.run(`INSERT INTO files(name,extension,version,date, project_id) VALUES(?,?,?,?,?)`, [name,extension,version,date,id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    db.run(`update projects set version = ? where id = ?`, [version,id], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("project version updated");
    });
    date = null;

  });
}

//inserts file into NEW project
var fileInsert = function(db,name,extension,filepath,public){

  db.get(`select id,version from projects where name = ? and account_id = ? `,[name, globalReq.session.account],
     (err, row) => {
     if (err) {
       console.error("vsause error here:",err.message);
     }
     if (row) {
       version = row.version + 1;
       id = row.id;
    console.log(version, id);
    filesInsert(db, name,extension,version,id);
    filePather(version,id,filepath,extension);
  } else {
    console.log(public);
    if(public == "yes"){
      p = 1;
    } else {
      p = 0;
    }
    db.run('insert into projects(name,version,account_id,public) values(?,?,?,?)',[name,0,globalReq.session.account,p], function(err) {
      if (err) {console.error("vsause error here:",err.message);}
      version = 0;
      db.get(`select id from projects where name = ?  and account_id = ?`,[name, globalReq.session.account],
         (err, row) => {
         if (err) {
           console.error("vsause error here:",err.message);
         }
         if(row){
           id = row.id;
           filesInsert(db,name,extension,version,id);
           filePather(version,id,filepath,extension);
         }

       });
     });
   }
  });
}

var fileReader = function(filename,req,res){
  const result = browser(req.headers['user-agent']);
  //console.log(result);
  if(result.name == "chrome" && filename.indexOf("galibrary") >= 0){
    //console.log(result);
      filename = "./templates/chrome" + filename;
      fs.readFile(filename, function(err, data) {
      //simple log and console output
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        console.log("[404] "+ req.url);
        //disable log by commenting out line below
        fs.appendFile('log', "[404] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      console.log("[200] "+req.url);
      //disable log by commenting out line below
      fs.appendFile('log', "[200] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
      return res.end();
      });
  } else {
      filename = "./templates" + filename;
      fs.readFile(filename, function(err, data) {
      //simple log and console output
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        console.log("[404] "+ req.url);
        //disable log by commenting out line below
        fs.appendFile('log', "[404] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      console.log("[200] "+req.url);
      //disable log by commenting out line below
      fs.appendFile('log', "[200] "+dt.myDateTime()+" "+req.url+"\n", function (err) {if (err) throw err;});
      return res.end();
      });
  }


  }
//photoshop file converter
var fileConverter = function(filename) {
  PSD.open(filename+".psd").then(function (psd) {
    return psd.image.saveAsPng(filename+".png");
  }).then(function () {
    console.log('psd -> png coversion complete');
  });
}
//thanks for taking a look at my code
