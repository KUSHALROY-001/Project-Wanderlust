const cloudinaryLib = require("cloudinary"); // Renamed to avoid conflict with "cloudinary" variable below
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinaryLib.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryLib,
  params: {
    folder: "wanderlust_DEV", // The folder in cloudinary where images will be stored
    allowedFormats: ["jpg", "jpeg", "png"], // Allowed image formats
  },
});

module.exports = { cloudinary: cloudinaryLib.v2, storage };
