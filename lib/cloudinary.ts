import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: string, folder: string = "listings") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    })
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error("Failed to upload image to Cloudinary")
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw new Error("Failed to delete image from Cloudinary")
  }
}

export const uploadMultipleToCloudinary = async (files: string[], folder: string = "listings") => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error)
    throw new Error("Failed to upload images to Cloudinary")
  }
}

export default cloudinary
