const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
// const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route       GET api/profile/me
// @desc        Get current users profile
// @access      Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await User.findOne({_id: req.user.id}).populate('user', ['name']);

        if (! profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       POST api/profile
// @desc        Create or update user profile
// @access      Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {
        bio,
        company,
        location,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if (bio) {
        profileFields.bio = bio;
    }
    if (company) {
        profileFields.company = company;
    }
    if (location) {
        profileFields.location = location;
    }

    try {
        let profile = await User.findOne({_id: req.user.id});

        if (profile) {
            profile = await User.findOneAndUpdate({
                _id: req.user.id
            }, {
                $set: profileFields
            }, {new: true});

            return res.json(profile);
        }

        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       GET api/profile
// @desc        Get all profiles
// @access      Private
router.get('/', auth, async (req, res) => {
    try {
        const profiles = await User.find().populate('user', ['name']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       GET api/profile/user/:user_id
// @desc        Get specific profile
// @access      Private
router.get('/user/:user_id', auth, async (req, res) => {
    try {
        const profile = await User.findOne({_id: req.params.user_id}).populate('user', ['name']);

        if (! profile) {
            return res.status(400).json({msg: 'Profile not found'});
        }

        res.json(profile);
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       DELETE api/profile
// @desc        Delete profile & user
// @access      Private
router.delete('/', auth, async (req, res) => {
    try {
        // await Profile.findOneAndRemove({user: req.user.id});

        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User Deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
