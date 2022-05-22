const express = require('express');
const router = express.Router();

const {
    getPosts,
    addPosts,
    fetchNews,
    fetchDetails,
    postComment,
    deleteComment,
    likePost,
    savePost,
    deletePost,
    getCategory,
    homePosts,
    fetchHomeData,
    relatedPost
} = require('../controllers/postControllers');
const { 
    isLiked,
    isSaved
} = require('../middlewares/postMiddleware');
const { 
    getIp,
    isRead,
    isCreator,
    isUserValid
} = require('../middlewares/auth');


router.get('/', getPosts)
router.post('/addpost', addPosts)
router.get('/fetch-home', fetchHomeData)
router.get('/fetch-news/:category', fetchNews)
router.get('/fetch-details/:id', isRead, isLiked, isSaved, fetchDetails)
router.post('/post-comment', isUserValid,  postComment)
router.post('/delete-comment', isUserValid,  deleteComment)
router.post('/like-post', likePost)
router.post('/save-post', savePost)
router.post('/delete-post', isUserValid, isCreator, deletePost)
router.get('/category', getCategory)
router.get('/home-posts', homePosts)
router.post('/fetch-related', relatedPost)

module.exports = router;