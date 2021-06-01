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

// @route  PUT /api/posts/like/:id 
// @desc   like a post
// @access private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length !== 0) {
            return res.status(400).json({ msg: 'Post already Liked' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  PUT /api/posts/unlike/:id 
// @desc   unlike a post
// @access private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() == req.user.id).length === 0) {
            return res.status(500).json({ msg: 'Post has not yet been liked' });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  PUT /api/posts/comment/:id 
// @desc   add a comment
// @access private

router.put('/comment/:id', [auth, [
    check('text', 'text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ erros: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id);
        const post = await Post.findById(req.params.id);

        const com = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
        };
        post.comments.unshift(com);
        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  PUT /api/posts/comment/:id/:commentId
// @desc   delete a comment
// @access private

router.put('/comment/:id/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id === req.params.commentId);
        // check is comment exists
        if (!comment) return res.status(404).json({ msg: 'Comment does not exist' });

        // check if the comment to be deleted is written by the same user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this comment' });
        }

        const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.commentId);
        post.comments.splice(removeIndex, 1);
        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;