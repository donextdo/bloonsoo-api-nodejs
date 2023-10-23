import {S3Client} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import dotenv from 'dotenv';
dotenv.config();
const FileService = {};

FileService.uploadFile = async function(request, response, next) {
    try {

        const client = new S3Client({
            credentials: {
                accessKeyId: 'AKIAYUZNOOIWX4C6XAGY',
                secretAccessKey: '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',
            },
             region: 'ap-southeast-1',
        });

        const fileName = `${Date.now().toString()}-${request.file.originalname}`;

        const parallelUploads3 = new Upload({
            client: client,
            tags: [],
            queueSize: 4,
            leavePartsOnError: false,
            params: {
                //ACL: 'public-read',
                Bucket: 'bloonsoo-images-upload',
                Key: fileName,
                Body: request.file.buffer,
            },
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {});

        await parallelUploads3.done();
        
        return fileName;
        // return response.status(200).json({
        //     error: false,
        //     message: 'File uploaded',
        //     data: {
        //         file_url: `${process.env.AWS_S3_BASEURL}/${fileName}`
        //     },
        // });
    } catch (error) {
        return response.status(400).json({
            error: true,
            message: 'Something went wrong',
            data: error,
        });
    }
}

export default FileService;