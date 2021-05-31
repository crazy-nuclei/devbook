const express = require('express');
const router = express.Router();

// @route  /api/posts 
// @desc   test route 
// @access public

router.get('/', (req, res) => res.send('posts route'));

module.exports = router;