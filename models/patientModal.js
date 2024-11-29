const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  email: { type: String },
  address: { type: String},
  userId:{type:String,required:true}
});

const patients = mongoose.model("patients",patientSchema)
module.exports = patients;