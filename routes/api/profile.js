const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const config = require('config');
const axios = require('axios');

// @route  /api/profile/me 
// @desc   GET current user profile
// @access private

router.get('/me', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).send({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// @route  /api/profile
// @desc   POST create or update user profile
// @access private

router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty(),

]], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        facebook,
        twitter,
        linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());
    //console.log(profileFields.skills)

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        // update if profile already exists
        if (profile) {
            const profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // create a profile

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  /api/profile
// @desc   GET all profiles
// @access public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        //console.log(profiles);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  /api/profile/user/:user_id
// @desc   GET profile by user ID
// @access public

router.get('/user/:user_id', async (req, res) => {


    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        res.json(profile);
        if (!profile) return res.status(400).json({ msg: 'Profile Not Found' })
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile Not Found' })
        }
        res.status(500).send('Server Error');
    }
})

// @route  DELETE /api/profile
// @desc   delete profile,user,posts
// @access private

router.delete('/', auth, async (req, res) => {
    try {
        // @todo delete posts
        // delete profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // delete user
        await User.findOneAndRemove({ _id: req.user.id });
        //console.log(profiles);
        res.json({ msg: 'User Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  PUT /api/profile/experience
// @desc   add profile experience 
// @access private

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status.send({ errors: errors.array() });
    }

    const {
        title,
        company,
        from,
        location,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        from,
        location,
        to,
        current,
        description
    };
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

// @route  DELETE /api/profile/experience/:exp_id
// @desc   delete profile experience 
// @access private

router.delete('/experience/:exp_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

// @route  PUT /api/profile/education
// @desc   add profile education
// @access private

router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'FieldOfStudy is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        school,
        degree,
        from,
        to,
        fieldofstudy,
        current,
        description
    } = req.body;
    const edu = {
        school,
        degree,
        from,
        to,
        fieldofstudy,
        current,
        description
    };
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(edu);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

// @route  DELETE /api/profile/education/edu_id
// @desc   delete profile education
// @access private

router.delete('/education/:edu_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route  GET /api/profile/github/:username
// @desc   get user repos from github
// @access public

router.get('/github/:username', async (req, res) => {


    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('clientSecret')}`,
            method: 'GET',
        };
        let op = await axios(options);


        if (op.status == 200) {
            return res.json(op.data);
        }

        res.status(404).json({ msg: "No github profile found" });

    } catch (err) {
        console.error(err);
        if (err.message == "Request failed with status code 404") {
            return res.status(404).json({ msg: "No github profile found" });
        }
        res.status(500).send('Server Error');
    }
})




module.exports = router;









