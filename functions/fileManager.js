var dt = require("./../custom_modules/dategetter")
const sqlite3 = require("sqlite3").verbose();
var fs = require('fs');
var PSD = require('psd');
var fileReader = require('./fileReader');
var session = require('express-session')

;
//opens db and extracts nessessary data for file upload
exports.fileAdd = function(files,req,res,sessionaccount,prog = false,progname = "",public = "true"){
  globalReq = req;
  globalRes = res;
  sessionAccount = sessionaccount;
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
    fileReader.fileReader("/library.html",globalReq,globalRes);
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

  db.get(`select id,version from projects where name = ? and account_id = ? `,[name, sessionAccount],
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
    db.run('insert into projects(name,version,account_id,public) values(?,?,?,?)',[name,0,sessionAccount,p], function(err) {
      if (err) {console.error("vsause error here:",err.message);}
      version = 0;
      db.get(`select id from projects where name = ?  and account_id = ?`,[name, sessionAccount],
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
//photoshop file converter
var fileConverter = function(filename) {
  PSD.open(filename+".psd").then(function (psd) {
    return psd.image.saveAsPng(filename+".png");
  }).then(function () {
    console.log('psd -> png coversion complete');
  });
}
//thanks for taking a look at my code
