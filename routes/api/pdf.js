const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const url = require("url");

router.get('/', function (req, res) {
    const inputurl = req.query.url
    const parsedurl = url.parse(inputurl);
    var options = {
      method: 'GET',
      host: parsedurl.host,
      port: parsedurl.port,
      path: parsedurl.path
    };
    const protocols = {
        'http:':http,
        'https:': https
    }
    if(parsedurl.protocol == 'https:' || parsedurl.protocol == 'http:'){
        var request = protocols[parsedurl.protocol].request(options, function(response) {
        var data = [];
    
        response.on('data', function(chunk) {
            data.push(chunk);
        });
    
        response.on('end', function() {
            data = Buffer.concat(data);
            console.log('requested content length: ', response.headers['content-length']);
            console.log('parsed content length: ', data.length);
            res.contentType("application/pdf");
            res.send(data);
        });
        });
    } 
  
    request.end();
  });
  
  module.exports = router;
