const express = require('express');
const router = express.Router();

const {
    addPosts,
    fetchNews,
    fetchDetails,
    postComment,
    deleteComment,
    likePost,
    savePost,
    deletePost,
    getCategory,
    fetchHomeData,
    relatedPost,
    getNavLinks,
    savedPosts,
    updatePostText,
    updatePostCategory,
    updatePostIsComment,
    updatePostIsMonetize,
    translatePost,
    saveDraft,
    deleteDraft
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
} = require('../middlewares/authMiddleware');


router.post('/addpost', addPosts)
router.patch('/save-draft', saveDraft)
router.get('/fetch-home', fetchHomeData)
router.get('/fetch-news/:category', fetchNews)
router.get('/fetch-details/:id', isRead, isLiked, isSaved, fetchDetails)
router.patch('/post-comment', isUserValid,  postComment)
router.patch('/delete-comment', isUserValid,  deleteComment)
router.patch('/like-post', isUserValid, likePost)
router.patch('/save-post', isUserValid, savePost)
router.get('/fetch-saved', isUserValid, savedPosts)
router.post('/delete-post', isUserValid, isCreator, deletePost)
router.post('/delete-draft', isUserValid, isCreator, deleteDraft)
router.get('/category', getCategory)
router.get('/nav-links', getNavLinks)
router.post('/fetch-related', relatedPost)
router.patch('/update-post-data', isUserValid, isCreator, updatePostText)
router.patch('/update-post-category', isUserValid, isCreator, updatePostCategory)
router.patch('/update-post-iscomment', isUserValid, isCreator, updatePostIsComment)
router.patch('/update-post-ismonetize', isUserValid, isCreator, updatePostIsMonetize)
router.get('/translate/:content', translatePost)

module.exports = router;