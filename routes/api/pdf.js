const express = require('express');
const router = express.Router();
const request = require("request");
const axios = require("axios");

router.get('/', function (req, res) {
    const inputurl = req.query.url
    let src = request.get(inputurl)
    req.pipe(src).pipe(res);
});

router.get('/checkValidPdf', function(req, res){
    const inputurl = req.query.url;
    axios.get(inputurl).then(response => {
        console.log(response.headers['content-type']);
        const pdfIndex = response.headers['content-type'].search("application/pdf")
        if(pdfIndex !== -1){
            res.send({result: true});
        }else {
            res.send({result: false});
        }
    }).catch(err => {
        console.log(err);
        res.send({result: false});
    })   
})

module.exports = router;
