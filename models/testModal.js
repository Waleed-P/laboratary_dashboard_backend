const mongoose = require('mongoose')
const testSchema = new mongoose.Schema({
    test_name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    category:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    patient_name:{
        type:String
    },
    patient_id:{
        type:String
    },
    doctor_name:{
        type:String
    },
    doctor_id:{
        type:String
    },
    technician_name:{
        type:String
    },
    technician_id:{
        type:String
    },
    userId:{type:String,required:true}
})

const tests = mongoose.model("tests",testSchema)
module.exports = tests