const http = require('http');
var express = require("express");
var session = require('express-session')
const app = express();
var routes = require('./routes');


algorithm = 'aes-256-ctr';


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

//req TODO
//handle names with '-'  for file upload from galibrary


const hostname = '127.0.0.1';
const port = 3000;

let globalReq;
let globalRes;

app.use('/', routes);

app.listen(port, () => console.log(`App listening on port ${port}!`));
module.exports = app;
