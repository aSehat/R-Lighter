const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) { 
    console.log(req);
    const token = req.body.token ||
    req.query.token ||
    req.header('x-auth-token') ||
    req.cookies.token;
    console.log(req.cookies);
    if (! token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    try { 
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }

}
