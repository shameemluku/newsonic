const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ObjectId = require('mongodb').ObjectID;
const axios = require('axios')


// @desc  Creating a User
// @rout  POST /api/register
const registerUser = async (req,res) => {
    
    const {name,email,password,type,phone} = req.body;
    let result;
    
    try {

        
        if(type=== "normal"){
            
            const user = await User.findOne({email})
            if(user) return res.status(400).json({message:"User already exists"});
            const hashedPassword = await bcrypt.hash(password,12);
            result = await User.create({email,password:hashedPassword,name:name,phone:phone,type:"normal"});

        }else{
            const user = await User.findOne({email,type:"google"})
            if(user) {
                result = user;
            }else{
                
                const user = await User.findOne({email})
                if(user) return res.status(400).json({message:"An Account is already created using this email"});
                result = await User.create({email,name:name,phone:null,type:"google"});
            
            }
            
            
            
        }

        const token = jwt.sign({email: result.email, id: result._id},process.env.JWT_SECRET,{expiresIn: '1h'});

        const user = Object.assign({}, result._doc);

        // delete user._id;
        // delete user.isCreator;
        // delete user.isBlocked;
        user?.password && delete user?.password;

        console.log(user);

        
        res.cookie("security",token,{httpOnly:true, signed:true,maxAge:900000});
        res.status(200).json({user});


    } catch (error) {
        console.log(error);
    }
    
}



// @desc  Logging User
// @rout  POST /api/login
const loginUser = async (req,res) => {


    const {email,password} = req.body;
    const user = await User.findOne({email});


    if(!user) res.status(404).json({message:"User does not exist!"});

    if(user?.type==='google') res.status(400).json({message:"User is a google user"}); 

    const isPassValid = await bcrypt.compare(password,user.password);

    if(isPassValid){
        const token = jwt.sign({email: user.email, id: user._id},process.env.JWT_SECRET,{expiresIn: '1h'});     
        delete user.password;
        res.cookie("security",token,{httpOnly:true, signed:true,maxAge:900000});
        res.status(200).json({user});

    }else{

        res.status(400).json({message:"Invalid Credentials"});
    }

}


const verifyUser =async (req,res) => {

    const tokenId = req.body.decodeId;
    // console.log(req.cookies.cookieName);

    const user = await User.findOne({_id:ObjectId(tokenId)})
    
    if(user){
        user.token = req.body.token
        res.status(200).json({user});
    }else{
        res.status(404).json({status:false});
    }
}

const logoutUser = async (req,res) => {

    console.log("logging Out")

    res.status(200)
        .clearCookie("security")
        .send({});
}


const checkAvail =async (req,res) => {

    const {name} = req.body;
    res.status(200).json({status:true})

}

const getFinger =async (req,res) => {


    console.log("HERE");

    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
    .then(FingerprintJS => FingerprintJS.load())

    // fpPromise
    // .then(fp => fp.get())
    // .then(result => {
        
    //   const visitorId = result.visitorId
    //   console.log(visitorId)
      
    // })

    FingerprintJS.load()
        .then((fp) => fp.get())
        .then((result) => {
            const visitorId = result.visitorId
            console.log(visitorId)
        });


}

const getIp =async (req,res) => {

    res.json({
        ip:(await axios.get('https://geolocation-db.com/json/')).data?.IPv4
    })

}



module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    checkAvail,
    logoutUser,
    getIp,
    getFinger
}