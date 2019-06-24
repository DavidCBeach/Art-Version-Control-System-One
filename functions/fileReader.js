const browser = require('browser-detect');
var fs = require('fs');
var dt = require("./custom_modules/dategetter");



var fileReader = function(filename,req,res){
  const result = browser(req.headers['user-agent']);
  //console.log(result);
  if(result.name == "chrome" && filename.indexOf("galibrary") >= 0){
    //console.log(result);
      filename = "./../templates/chrome" + filename;
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
      filename = "./../templates" + filename;
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
