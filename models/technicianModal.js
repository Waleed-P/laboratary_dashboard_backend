const mongoose = require('mongoose')
const technicianSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_number: { type: String, required: true },
    email: { type: String },
    specialization: { type: String },
    userId:{type:String,required:true}
})

const technicians = mongoose.model("technicians",technicianSchema)
module.exports = technicians