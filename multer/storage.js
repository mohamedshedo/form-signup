const path = require('path'); 
const multer=require('multer');


const ApprovedImagesExtentions=['image/jpeg','image/png','image/jpg']
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './my-uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  });
const fileFilter=(req,file,cb)=>{
  if(ApprovedImagesExtentions.includes(file.mimetype)){
    cb(null,true);
  }else{
    req.fileValidationError = 'goes wrong on the mimetype';
     cb(null, false, new Error('goes wrong on the mimetype'));
  }
}
let upload = multer({ 
    storage: storage,
    limits:{
         fileSize:1024*1024*2
      },
    fileFilter:fileFilter
 })

 module.exports={upload};