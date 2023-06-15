const dotenv =require('dotenv');

dotenv.config({path:'./config.env'});

const app = require('./app.js');
const mongoose = require('mongoose');


mongoose.connect(process.env.CONN_STR,{
  useNewurlParser:true
}).then((conn)=>{
  console.log("connected database");
}).catch((err)=>{
console.log("db error found");
})



const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{ 
    console.log('running')

  })