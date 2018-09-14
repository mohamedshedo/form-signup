require('./../config/config.js');
const express = require('express');
const {mongoose}=require('./../db/mongoose');
const {api}=require('./../constrollers/apiController');
const bodyParser= require('body-parser');
///////
const app = express();
app.use(bodyParser.json());
let port= process.env.PORT;
api(app);





app.listen(port,()=>{
    console.log('server started');
});

