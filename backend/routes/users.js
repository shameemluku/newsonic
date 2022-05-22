const { isUserValid } = require('../middlewares/auth')

const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    verifyUser,
    checkAvail ,
    logoutUser,
    getIp,
    getFinger
} = require('../controllers/usersController');


router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/signout', logoutUser);
router.get('/verify', isUserValid , verifyUser)
router.post('/check-avail' , checkAvail)
router.get('/get-ip' , getIp)
router.get('/finger' , getFinger)



module.exports = router;