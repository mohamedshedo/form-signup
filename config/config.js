let env=process.env.NODE_ENV || 'development';
console.log(env);

if(env==='development'|| env === "test"){
var config = require('./config.json');
Object.keys(config[env]).forEach((key)=>{
    process.env[key]=config[env][key];
})
}
