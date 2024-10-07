import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();  // Correct way to load environment variables

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

export default cloudinaryV2;  // ES Module export
