const multer  = require('multer')

//configure multer
 const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,pathdir)
    }
 })

 const upload=multer({storage});
  module.exports=upload;