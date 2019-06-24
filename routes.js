var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');

var encrypt = require('./functions/encrypt');
var fileManager = require('./functions/fileManager');
var fileReader = require('./functions/fileReader');



router.post('/fileupload', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    fileManager.fileAdd(files,req,res);
  });
});

router.post('/deletefile', (req, res) => {
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
                res.redirect(req.get('referer'));
            });
            });
          } else {
            db.run('delete from files where id = ?',[id], function(err){
              res.redirect(req.get('referer'));
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
router.post('/deleteproject', (req, res) => {
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
router.post('/progupload', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if((files.filetoupload.name && fields.progname)&&(!fields.progname.includes(" "))){
      console.log(fields);
      fileManager.fileAdd(files,true,fields.progname,fields.public,req,res);
    } else {
      fileReader.fileReader("/library.html",req,res);
    }
  });
});

router.post('/signin', (req, res) => {
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
  var password = encrypt.encrypt(fields.password);
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
  fileReader.fileReader("/library.html",req,res);
});
router.post('/signup', (req, res) => {
  console.log("signup");
  let db = new sqlite3.Database('./db/filedb2.sl3',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var password = encrypt.encrypt(fields.password);
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

  fileReader.fileReader("/library.html",req,res);
});
});
});
router.use(express.static('public'));

router.get('/download', function(req, res){
  var file = "./public/files/"+ req.query.file;
  res.download(file,req.query.name+req.query.dateversion);
});

router.get('/getfiles', (req, res) => {
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

router.get('/getlatest', (req, res) => {
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
router.get('/getlatestpublic', (req, res) => {
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



router.get('/verifyaccount', (req, res) => {
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
router.get('/getaccount', (req, res) => {
  res.json({account:req.session.account});



});
router.get('/signout', (req, res) => {
    req.session.account = -1;
    res.redirect("library.html");
});
router.get('/getinfo', (req, res) => {
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

router.get('/getfolders', (req, res) => {
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

router.get('/sqlfiles', (req, res) => {
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

router.get('/sqlprojects', (req, res) => {
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
router.get('/sqlaccounts', (req, res) => {
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

router.get('/*', (req, res) => {
    var q = url.parse(req.url, true);
    var filename =  q.pathname;

    if(filename == "/"){
      filename = "/library.html";
    }
    fileReader.fileReader(filename,req,res);
});

module.exports = router;
