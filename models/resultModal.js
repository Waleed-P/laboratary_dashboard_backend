const mongoose = require('mongoose')
const resultSchema = new mongoose.Schema({
    test:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    weight:{
        type:Number,
    },
    height:{
        type:Number,
    },
    medical_history:{
        type:[String],
    },
    //lab results
    hemoglobin:{
        type:Number,
    },
    wbc:{
        type:Number,
    },
    rbc:{
        type:Number,
    },
    cholesterol:{
        type:Number,
    },
    //life style
    smoking:{
        type:Boolean,
    },
    alcohol:{
        type:Boolean,
    },
    activity_level:{
        type:String,
    },
    medications:{
        type:[String],
    },
    symptoms:{
        type:[String],
    },
    //patient detals
    patient_name:{
        type:String,
    },
    patient_id:{
        type:String,
    },
    userId:{type:String,required:true}
})

const results = mongoose.model("results",resultSchema)
module.exports = results