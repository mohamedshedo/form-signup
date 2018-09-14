const {upload}=require('./../multer/storage');
const fs= require('fs');
const {UserModel}=require('./../models/UserModel');
const _ =require('lodash');
module.exports.api=function(app){

app.post('/formRegist',upload.single('avatar'),(req,res)=>{
    let reqBody=_.pick(req.body,['first_name','last_name','country_code','phone_number','gender','birthdate','email','password']);
   
    let newUser= new UserModel({
      first_name:reqBody.first_name,
      last_name:reqBody.last_name,
      country_code:reqBody.country_code,
      phone_number:reqBody.phone_number,
      gender:reqBody.gender,
      birthdate:new Date(reqBody.birthdate),
      email:reqBody.email,
      password:reqBody.password
    });
    if(req.file){
    newUser.avatar.data = fs.readFileSync(req.file.path)
    newUser.avatar.contentType = req.file.mimetype;
    }



    newUser.save().then((result) => {
      fs.unlinkSync(req.file.path,(err)=>{
      });
      return newUser.generateAuthToken();

    }).then((token)=>{
      res..status(201).header('x-auth',token).send(_.pick(newUser,['first_name','last_name','country_code','phone_number','gender','birthdate','email']));

    }).catch((err) => {
      res.send(err);
    });
  
  
  });


app.post('/user',(req,res)=>{

    let reqBody=_.pick(req.body,['phone_number','password']);
 
    UserModel.findByPhone(reqBody.phone_number,reqBody.password).then((user)=>{
        return user.generateAuthToken();
    })
    .then((token)=>{
        res.status(200).header('x-auth',token).send('success');
    })
    .catch((err)=>{
        res.status(400).send(err);
    });

})


app.post('/phoneAuth',(req,res)=>{


})
};