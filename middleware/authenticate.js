let {UserModel}=require('./../models/UserModel');

authenticate=(req,res,next)=>{
    let token = req.header('x-auth');
    UserModel.findByToken(token)
    .then((user) => {
        if(!user){
            return Promise.reject("invalid token");
        }

        req.user=user;
        req.token=token;
        next();
    }).catch((err) => {
        res.status(401).send(err);
    });
}

module.exports={authenticate};