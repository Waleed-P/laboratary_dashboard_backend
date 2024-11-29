const mongoose = require("mongoose")
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    contact_number: { type: String, required: true },
    email: { type: String },
    userId:{type:String,required:true}
})

const doctors = mongoose.model("doctors",doctorSchema)
module.exports = doctors