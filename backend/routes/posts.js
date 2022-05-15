const express = require('express');
const router = express.Router();

const {
    getPosts,
    addPosts,
    fetchNews,
    fetchDetails,
    postComment
} = require('../controllers/postControllers')


router.get('/', getPosts)
router.post('/addpost', addPosts)
router.get('/fetch-news/:category', fetchNews)
router.get('/fetch-details/:id', fetchDetails)
router.post('/post-comment', postComment)

module.exports = router;