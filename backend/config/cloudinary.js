import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const  uploadOnCloud = async (filePath) => {
    cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME, 
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    });
    

    try {
        if(!filePath) {
            return null
        }
        const uploadResponse = await cloudinary.uploader.upload(filePath, {resource_type : "image"})
        fs.unlinkSync(filePath)
        return uploadResponse.secure_url   
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(error);   
    }
}

export default uploadOnCloud