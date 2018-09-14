const mongoose=require('mongoose');

let StatusModelSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    CreatedBy:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    }
});

let statusModel=mongoose.model('Status',StatusModelSchema);

module.exports={statusModel};