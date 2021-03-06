const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route  POST /api/users 
// @desc   register a user 
// @access public

router.post('/', [
    check('name', 'name is required').isLength({ min: 1 }),
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    let { name, email, password } = req.body;

    try {
        // see if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        // get user's gravatar
        let avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            password,
            avatar
        })
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // SAVE USER
        user.save();

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('server error');
    }


});

module.exports = router;