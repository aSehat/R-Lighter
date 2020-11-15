const express = require('express');
const router = express.Router();
const request = require("request");

router.get('/', function (req, res) {
    const inputurl = req.query.url
    let src = request.get(inputurl)
    req.pipe(src).pipe(res);
});

module.exports = router;
