const doctors = require("../models/doctorModal");
exports.addDoctor = async (req, res) => {
  try {
    const userId = req.payload;
    const { name, email, contact_number, specialization } = req.body;
    const newDoctor = new doctors({
      name,
      email,
      contact_number,
      specialization,
      userId
    });
    await newDoctor.save();
    res
      .status(200)
      .json({ message: "Doctor added successfully", data: newDoctor });
  } catch (e) {
    res.status(401).json(e);
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const userId = req.payload;
    const pageSize = parseInt(req.query.page_size) || 10;
    const pageNumber = parseInt(req.query.page_no) || 1;
    const searchQuery = req.query.search || "";

    if (pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({ message: "Page size and page number must be greater than zero" });
    }
    const searchCriteria = {
      userId,
      name: { $regex: searchQuery, $options: "i" },
    };
    const totalCount = await doctors.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalCount / pageSize);
    const allDoctors = await doctors
      .find(searchCriteria)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Send the response
    res.status(200).json({
      total_pages: totalPages,
      total_records: totalCount,
      current_page: pageNumber,
      data: allDoctors,
    });
  } catch (e) {
    res.status(500).json({ error: e.message }); // Updated error status and message
  }
};


exports.updateDoctor = async (req,res)=>{
  try{
    const {doctor_id} = req.params;
    const userId= req.payload;
    const { name, email, contact_number, specialization } = req.body;
    const updatedDoctor =await doctors.findByIdAndUpdate({_id:doctor_id},{
      name,email,contact_number,specialization,userId
    },{new:true});
    await updatedDoctor.save();
    res.status(200).json({
      message: "Doctor updated successfully",
      data: updatedDoctor
    })
  }catch(e){res.status(401).json(e)}
}

exports.removeDoctor = async (req,res)=>{
  try{
    const {doctor_id} = req.params;
    const doctorDetails = await doctors.findByIdAndDelete({_id:doctor_id});
    res.status(200).json({
      message: "Doctor removed successfully",
      data: doctorDetails
    })
  }catch(e){res.status(401).json(e)}
}