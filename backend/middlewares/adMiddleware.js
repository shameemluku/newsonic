const jwt = require('jsonwebtoken');

exports.checkUserType = async (req, res, next)=>{
    
    
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