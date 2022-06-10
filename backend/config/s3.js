require("dotenv").config();
const AWS = require("aws-sdk");

let bucketName = process.env.AWS_BUCKET_NAME;
let bucketRegion = process.env.AWS_BUCKET_REGION;
let accessKey = process.env.AWS_ACCESS_KEY;
let secretKey = process.env.AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: bucketRegion,
});

const s3 = new AWS.S3();

async function uploadFile(file, name) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    Key: name,
  };

  // return s3.upload(uploadParams).promise()

  return new Promise(async (res, rej) => {
    let data = await s3.upload(uploadParams).promise();
    res(data.key);
  });
}

async function uploadBaseFile(file, name) {
  return new Promise(async (res, rej) => {
    file.Bucket = bucketName;
    let data = await s3.upload(file).promise();
    res(data.key);
  });
}

function getFileStream(fileKey) {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };

    return s3.getObject(downloadParams).createReadStream();
  } catch (err) {
    console.log(err);
  }
}

function deleteFile(fileKey) {
   const params = {
     Bucket: bucketName,
     Key: fileKey,
   };
 
   return new Promise (async (res,rej) => {
    try {

        await s3.headObject(params).promise();
   
        try {
   
          await s3.deleteObject(params).promise();
          res("File deleted Successfully")
   
        } catch (err) {
          res("ERROR in file Deleting : " + JSON.stringify(err))
        }
        
      } catch (err) {
        res( "File not Found ERROR : " + err.code )
      }
   })
}


module.exports = {
    uploadFile,
    uploadBaseFile,
    getFileStream,
    deleteFile
}
