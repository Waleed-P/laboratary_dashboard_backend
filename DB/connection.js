const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTION_STRING).then(
    result=>{
        console.log("mongo db connected with server");
    }
).catch(err=>{
    console.log(err);
    console.log("connection failed")
})