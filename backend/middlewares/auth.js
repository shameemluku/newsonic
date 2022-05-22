const jwt = require('jsonwebtoken');
const {decode} = require('jsonwebtoken');
const requestIp = require('request-ip');
const axios = require('axios')
const Channel = require('../models/channels')
const ObjectId = require('mongodb').ObjectID;

exports.isUserValid = (req, res, next) => {

    try{

        // const token = req.headers.authorization.split(" ")[1];
        // const isCustomAuth = token.length<500;

        const token = req.signedCookies.security;
        let decodedData;
    
        if(token){
            
            decodedData = jwt.verify(token, process.env.JWT_SECRET);

            if(decodedData){
                
                req.body.decodeId = decodedData?.id;
                req.body.token = token;
                next()
            }
            
           
        }else{
            console.log("No token");
            res.status(401).json({message:"Not authorized"})
        }
    }catch(error){
        console.log(error);
        if(error) res.status(400).json({message:"Something went wrong!"})
    }




}

exports.getIp = async (req, res, next)=>{

    let ip = (await axios.get('https://geolocation-db.com/json/')).data?.IPv4;
    console.log(ip);

    next()
}

exports.isRead = async (req, res, next)=>{
    
    
    const token = req.signedCookies.security;
    const {signature} = req.query;

    console.log(signature);
    
    if(token){
        
        let decodedData = jwt.verify(token, process.env.JWT_SECRET);
        if(decodedData){

            req.identity = {
                userId:decodedData?.id,
                type:"USER_ID"
            }
            next()

        }else{

            req.identity = {
                userId:signature,
                type:"SIGN_USER"
            }
            console.log(req.identity.userId);
            next()

        }
        
           
    }else{
        req.identity = {
            userId:signature,
            type:"SIGN_USER"
        }
        console.log(req.identity.userId);
        next()
    }

}


const getIp = () => {

    return new Promise( async (resolve, reject) =>{
        
        resolve((await axios.get('https://geolocation-db.com/json/')).data?.IPv4)
        
    })
    
}


exports.isCreator = async (req, res, next)=>{

    const {channel} = req.query;
    if(channel){
        

        let details = await Channel.findOne({
            userId:ObjectId(req.body.decodeId),
            _id:ObjectId(channel)
        })

        if(details){
            console.log("Creator autherized");
            req.channelId = channel;
            next()
        }else{
            res.status(401).json({message:"Not authorized"})
        }

    }else{
        res.status(401).json({message:"Not authorized"})
        next()
    }

    
}