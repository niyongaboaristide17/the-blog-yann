import cloudinary from "cloudinary"

export const uploadFile = async(req, res) => {
     let imageUrl = ""
     await cloudinary.v2.uploader.upload(req.file.path, (error, image) => {
          if (error) {
               console.log(error);
          } else {
               imageUrl = image.url
          }
     })
     return imageUrl
     
}