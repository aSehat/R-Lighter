const express = require('express');
const router = express.Router();
const request = require("request");

router.get('/', function (req, res) {
    const inputurl = req.query.url
    let src = request.get({url: inputurl, jar: true})
    req.pipe(src).pipe(res);
});

module.exports = router;
