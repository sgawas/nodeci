const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v1');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    endpoint: 's3-us-west-2.amazonaws.com',
    signatureVersion: 'v4',
    region: 'us-west-2'
});

module.exports = app =>{
    app.get('/api/upload',(req, res)=>{
        const key = `${req.user.id}/${uuid()}.jpeg`;
        
        s3.getSignedUrl(
            'putObject',
            {
                Bucket: '',
                ContentType: 'image/jpeg',
                Key: key
            },
            (err, url)=>{ res.send({key, url})}
        )
    })
} 