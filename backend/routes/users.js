const { isUserValid } = require('../middlewares/auth')

const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    verifyUser,
    checkAvail ,
    logoutUser
} = require('../controllers/usersController');


router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/signout', logoutUser);
router.get('/verify', isUserValid , verifyUser)
router.post('/check-avail' , checkAvail)



module.exports = router;