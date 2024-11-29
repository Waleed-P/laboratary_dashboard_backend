const technicians = require("../models/technicianModal");
exports.addTechnician = async (req, res) => {
  try {
    const userId = req.payload;
    console.log("userid:",userId)
    const { name, contact_number, email, specialization } = req.body;
    const newTechnician = new technicians({
      name,
      contact_number,
      email,
      specialization,
      userId
    });
    await newTechnician.save();
    res.status(200).json({
      message: "Technician Added Successfully",
      data: newTechnician,
    });
  } catch (e) {
    res.status(401).json(e);
    console.log(e)
  }
};

exports.getAllTechnicians = async (req, res) => {
  try{
    const userId = req.payload;
    const pageNumber = parseInt(req.query.page_no) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    if(pageNumber <0 || pageSize < 0){
      return res.status(400).json({message: "Invalid Page Number or Page Size"})
    }
    const searchQuery = req.query.search || "";
    const searchCriteria={
      userId,
      name:{$regex:searchQuery, $options: 'i'},
    }
    const totalCount = await technicians.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalCount/pageSize);
    const allTechnicians = await technicians.find(searchCriteria).skip((pageNumber-1)*pageSize).limit(pageSize);
    res.status(200).json({
      total_pages: totalPages,
      total_records: totalCount,
      current_page: pageNumber,
      data: allTechnicians,
    });
  }catch(e){res.status(401).json(e)
    console.log(e)
  }
}


exports.updateTechnician = async (req,res)=>{
  try{
    const userId = req.payload;
    const {technician_id} = req.params;
    const { name, contact_number, email, specialization } = req.body;
    const updatedTechnician = await technicians.findByIdAndUpdate({_id:technician_id},{
      name, contact_number, email, specialization, userId
    },{new:true});
    await updatedTechnician.save();
    res.status(200).json({
      message: "Technician Updated Successfully",
      data: updatedTechnician,
    })
  }catch(e){
    console.log(e)
    res.status(401).json(e)}
}

exports.removeTechnician = async (req,res)=>{
  try{
    const {technician_id} = req.params;
    const removedTechnician = await technicians.findByIdAndDelete({_id:technician_id});
    res.status(200).json({
      message: "Technician Removed Successfully",
      data: removedTechnician,
    })
  }catch(e){res.status(401).json(e)}
}