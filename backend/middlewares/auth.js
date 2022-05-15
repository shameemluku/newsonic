const jwt = require('jsonwebtoken');
const {decode} = require('jsonwebtoken');

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