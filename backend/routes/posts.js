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
    relatedPost,
    getNavLinks,
    savedPosts,
    updatePostText,
    updatePostCategory,
    updatePostIsComment,
    updatePostIsMonetize,
    translatePost
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
router.post('/like-post', isUserValid, likePost)
router.post('/save-post', isUserValid, savePost)
router.get('/fetch-saved', isUserValid, savedPosts)
router.post('/delete-post', isUserValid, isCreator, deletePost)
router.get('/category', getCategory)
router.get('/nav-links', getNavLinks)
router.get('/home-posts', homePosts)
router.post('/fetch-related', relatedPost)
router.patch('/update-post-data', isUserValid, isCreator, updatePostText)
router.patch('/update-post-category', isUserValid, isCreator, updatePostCategory)
router.patch('/update-post-iscomment', isUserValid, isCreator, updatePostIsComment)
router.patch('/update-post-ismonetize', isUserValid, isCreator, updatePostIsMonetize)
router.get('/translate', translatePost)

module.exports = router;