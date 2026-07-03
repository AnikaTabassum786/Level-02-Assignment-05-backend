import { v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const cloudinaryUpload = cloudinary;

//This is a function that deletes an image from Cloudinary.

export const deleteFromCloudinary = async (
  publicId: string
) => {
  return await cloudinary.uploader.destroy(publicId);
};