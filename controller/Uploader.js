const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const handleFileUpload =async(req,res)=>{
    const filepath=req.file.path;
    console.log(filepath);

    //upload file to cloudinary
    const result=await cloudinary.uploader.upload(filepath,{
        folder:"uploads"
    })
    fs.unlink(filepath);
    return res.status(200).json({
        message:"File upload success",
        url:result.secure_url
    })
}