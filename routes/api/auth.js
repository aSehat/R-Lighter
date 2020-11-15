const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth')

const User = require('../../models/User');

// @route       GET api/auth
// @desc        Test route
// @access      Public
router.get('/', auth, async (req, res) => {
    try { // Find user information - password from User collection
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       Post api/auth
// @desc        Authenticate user & get token
// @access      Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try { 
        let user = await User.findOne({email});
        if (! user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Invalid Credentials'
                    }
                ]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (! isMatch) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Invalid Credentials'
                    }
                ]
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600
        }, (err, token) => {
            if (err) {
                throw err;
            }
            res.cookie('token', token, { httpOnly: true });
            res.json({token}).sendStatus(200);
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
