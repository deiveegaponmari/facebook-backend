const MediaRouter=require("express").Router();
const Media=require("../model/UploadMedia")

//post media from client
MediaRouter.post("/createmedia",async(req,res)=>{
try{
if(!req.body.file){
  res.status(400).json({
    message:"file is must required"
  })
}

}catch(error){
  console.group(err)
}
})
// Get All Media
MediaRouter.get('/media', async (req, res) => {
    try {
      const media = await Media.find();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching media' });
    }
  });
module.exports={
    MediaRouter
}