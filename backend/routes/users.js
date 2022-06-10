const { isUserValid } = require('../middlewares/authMiddleware')

const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    verifyUser,
    checkAvail ,
    logoutUser,
    getIp,
    getFinger,
    getUserProfile,
    changeDp,
    removeDp,
    changeName,
    changePassword,
    changePhone
} = require('../controllers/usersController');


router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/signout', logoutUser);
router.get('/verify', isUserValid , verifyUser)
router.get('/fetch-profile', isUserValid , getUserProfile)
router.patch('/change-dp', isUserValid , changeDp)
router.patch('/remove-dp', isUserValid , removeDp)
router.patch('/change-name', isUserValid , changeName)
router.patch('/change-password', isUserValid , changePassword)
router.patch('/change-phone', isUserValid , changePhone)
router.post('/check-avail' , checkAvail)
router.get('/get-ip' , getIp)
router.get('/finger' , getFinger)



module.exports = router;