const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const router = express.Router();


// @route  POST /api/posts 
// @desc   create a new post 
// @access private

router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const pos = {};
    pos.text = req.body.text;
    pos.user = req.user.id;

    try {
        const user = await User.findOne({ _id: req.user.id });
        pos.name = user.name;
        pos.avatar = user.avatar;

        const post = new Post(pos);
        await post.save();

        res.json(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET /api/posts 
// @desc   get all posts 
// @access private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  GET /api/posts/:id 
// @desc   get a post by id 
// @access private

router.get('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findOne({ _id: req.params.id });
        if (!post) {
            res.status(400).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

// @route  DELETE /api/posts/:id 
// @desc   delete a post by id 
// @access private

router.delete('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this post' });
        }

        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.send('Server Error');
    }
})

module.exports = router;