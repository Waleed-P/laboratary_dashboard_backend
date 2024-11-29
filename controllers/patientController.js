const patients = require("../models/patientModal");

exports.addPatient = async (req, res) => {
  console.log("inside add patient function");
  const { name, contact_number, address, gender, email, age } = req.body;
  console.log(req.body);
  const userId = req.payload;
  try {
    const newPatient = new patients({
      name,
      contact_number,
      address,
      gender,
      email,
      age,
      userId,
    });
    await newPatient.save();
    res.status(200).json({
      message: "Patient added successfully",
      data: newPatient,
    });
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};

//get all patients
exports.getAllPatients = async (req, res) => {
  try {
    // Extract and parse query parameters
    const pageSize = parseInt(req.query.page_size, 10) || 10; // Default to 10 if not provided
    const pageNo = parseInt(req.query.page_no, 10) || 1; // Default to 1 if not provided
    const userId = req.payload;
    const searchQuery = req.query.search || "";
    if (pageSize <= 0 || pageNo <= 0) {
      return res
        .status(400)
        .json({
          message: "Page size and page number must be greater than zero",
        });
    }
    const searchCriteria = {
      userId,
      name:{$regex : searchQuery , $options : 'i'},
    }

    // Calculate the total count of documents
    const totalCount = await patients.countDocuments(searchCriteria);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Fetch paginated data
    const allPatients = await patients
      .find(searchCriteria)
      .skip((pageNo - 1) * pageSize) // Skip documents for previous pages
      .limit(pageSize); // Limit the results to the page size

    // Return response with additional metadata
    res.status(200).json({
      total_pages: totalPages,
      total_records: totalCount,
      current_page: pageNo,
      data: allPatients,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "An error occurred while fetching patients" });
  }
};
//edit patient
exports.updatePatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const userId = req.payload;
    const { name, contact_number, address, gender, email, age } = req.body;
    const updatedPatient = await patients.findByIdAndUpdate(
      {_id:patient_id},{
        name,
        contact_number,
        address,
        gender,
        email,
        age,
        userId,
      },{new:true}
    );
    await updatedPatient.save();
    res.status(200).json({
      message:"Patient details updated successfully",
      data:updatedPatient
    })
  } catch (e) {
    res.status(401).json(e);
  }
};
//remove patient
exports.removePatient = async (req, res) => {
  console.log("inside remove patient");
  try{
    const { patient_id } = req.params;
    const patientDetails = await patients.findByIdAndDelete({_id:patient_id});
    res.status(200).json({
      message:"Patient deleted successfully",
      data:patientDetails
    })
  }catch(e){res.status(401).json(e)}
}