const mongoose = require('mongoose');
const validator=require('validator');
const moment = require('moment');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');

let UserModelSchema= mongoose.Schema({
    first_name:{
        type:String,
        trim:true,
        required:true,
        minlength:1
    },
    last_name:{
        type:String,
        trim:true,
        required:true,
        minlength:1
    },
    country_code:{
        required:true,
        type:String
    },
    phone_number:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate:{
            validator:
            (value)=>{
                return validator.isMobilePhone(value,'any',{strictMode:true});
            },
            message:'invalid'
        }
    },
    gender:{
        type:String,
        required:true,
        default:'male',
        enum:{
            values:['male','female','other'],
            message:"Invalid"
        }
    },
    birthdate:{
        type:Date,
        required:true,
        validate:{
            validator:(value)=>{
                return (moment(value,'YYYY-MM-DD').isValid()&& moment().diff(moment(value))>0);
                
            },
            message:'invalid'
        },get:DateTransofrm
    },
    avatar:{
        data:{
             type:Buffer,
            required:true,
        },
        contentType:String,
        
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'invalid'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
 
    },
    tokens:[{
        access:{type:String,required:true},
        token:{type:String,required:true}
    }],

    statuses:[
        {
            _id:{type:mongoose.SchemaTypes.ObjectId,required:true},
        }
    ]
}); 



function DateTransofrm(value){
 
    return `${moment(value).year()}-${moment(value).month()}-${moment(value).day()}`;
}


UserModelSchema.statics.findByEmail=function(email,password){
    let User=this;

 return User.findOne({email}).then((user)=>{
        if(!user){return Promise.reject();}

        return new Promise((resolve,reject)=>{

            bcrypt.compare(password,user.password,(err,success)=>{
                if(success){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });
    });
};

UserModelSchema.statics.findByPhone=function(phone_number,password){
    let User=this;

 return User.findOne({phone_number}).then((user)=>{
        if(!user){return Promise.reject();}

        return new Promise((resolve,reject)=>{

            bcrypt.compare(password,user.password,(err,success)=>{
                if(success){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });
    });
};

UserModelSchema.methods.generateAuthToken = function(){
    let user=this;
    let access='auth';
    let token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
    user.tokens.push({access,token});
   return user.save().then((result) => {
        return token;
    });
};

UserModelSchema.statics.findByToken=function(token){
    let User=this;
    let decoded;
    try{
        decoded= jwt.verify(token,process.env.JWT_SECRET);
    }catch(e){
        return new Promise((resolve,reject)=>{
            reject();
        });

    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}
UserModelSchema.pre('save',function(next){

    let user = this;
  
    if(user.isModified('password')){
        
        bcrypt.genSalt(10,(err,salt)=>{
            
            bcrypt.hash(user.password,salt,(err,hash)=>{
            
                user.password=hash;
                next();
            });
        });

    }else{
    next();
}
});


let UserModel= mongoose.model('User',UserModelSchema);

module.exports={UserModel};
