const Channel = require('../models/channels')
const User = require('../models/user')
const Posts = require('../models/posts')
const ObjectId = require('mongodb').ObjectID;
const { uploadFile, uploadBaseFile } = require('../config/s3')
const mime = require('mime-types')


// @desc    Create a channel
// @rout    POST /api/channel/create
const createChannel = async (req,res) => {

    let result, filesArray=[];
    let userId = req.body.decodeId
    
    const {channelName,phone,email,website,propic} = req.body;
    
    if(propic==="null"){
         res.status(400).json({status:false}) 
         return;
    }
    
    result = await Channel.create({name:channelName,phone,email,userId,website});


    // let ext = propic.match(/[^:/]\w+(?=;|,)/)[0];
    // let bufferObj = Buffer.from(propic, "base64");
    // let proDetails = await uploadFile(bufferObj,`propic-${result._id}.${ext}`)


    let buffer = Buffer.from(propic.replace(/^data:image\/\w+;base64,/, ""),'base64')

    let data = {
        Key: `propic-${result._id}`, 
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };

    let proDetails = await uploadBaseFile(data)


    if(Array.isArray(req.files.file)){

        let promises=[];

        req.files.file.forEach((file,i)=>{
            let ext = mime.extension(file.mimetype)
            promises.push(uploadFile(file.data,`channel-${result._id}-${i}.${ext}`));
        })

        Promise.all(promises).then(async function(filesArray){


            const update_result = await Channel.findOneAndUpdate(
                {_id:ObjectId(result._id)},
                {
                    $set:{
                        "image":proDetails,
                        "supportFiles":filesArray
                    }
            })
            await User.updateOne({_id:ObjectId(userId)},{$set:{isCreator:true}})
            res.status(200).json({status:true,details:update_result})


        }).catch(function(err){
            res.send(err.stack);
        }) 


        
    }else{

        let ext = mime.extension(req.files.file.mimetype)
        const {data,name} = req.files.file;
        filesArray.push((await uploadFile(data,`channel-${result._id}.${ext}`)));

        const update_result = await Channel.findOneAndUpdate(
            {_id:ObjectId(result._id)},
            {$set:{image:proDetails,supportFiles:filesArray}
        })
        await User.updateOne({_id:ObjectId(userId)},{$set:{isCreator:true}})
        res.status(200).json({status:true,details:update_result})
    }

}


// @desc    Create a channel
// @rout    POST /api/channel/get-details

const getChannelDetails = async (req,res) => {
    let userId = req.body.decodeId;
    let details = await Channel.findOne({userId:ObjectId(userId)})
    res.status(200).json({channelDetails:details})
}

const getAddedPosts = async (req,res) => {

    const {channel:channelId, filter} = req.query
    let added_posts;

    if(filter==="ALL"){
        added_posts = await Posts.find({channelId:ObjectId(channelId)}).sort({_id:-1})
    }else{

        added_posts = await Posts.aggregate([
            {
                $match:{
                    channelId:ObjectId(channelId),
                    status:filter
                }
            },
            {
                $sort:{_id:-1}
            }
        ])
    }


    res.status(200).json({posts:added_posts})

}




module.exports = {
    createChannel,
    getChannelDetails,
    getAddedPosts
}
