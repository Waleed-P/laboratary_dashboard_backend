const tests = require("../models/testModal");

exports.addTest = async (req, res) => {
  try {
    const userId = req.payload;
    const {
      test_name,
      description,
      category,
      price,
      patient_name,
      patient_id,
      doctor_name,
      doctor_id,
      technician_name,
      technician_id,
    } = req.body;
    const newTest = new tests({
      test_name,
      description,
      category,
      price,
      userId,
      patient_name,
      patient_id,
      doctor_name,
      doctor_id,
      technician_name,
      technician_id
    });
    await newTest.save();
    res.status(200).json({ message: "Test Added Successfully", data: newTest });
  } catch (e) {
    res.status(401).json(e);
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const userId = req.payload;
    const pageNumber = parseInt(req.query.page_no) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const searchQuery = req.query.search || "";
    const searchCriteria ={
      userId,
      test_name: { $regex: searchQuery, $options: "i" },
    }
    if (pageNumber < 1 || pageSize < 10) {
      return res
        .status(400)
        .json({ message: "Invalid Page Number or Page Size" });
    }
    const totalCount = await tests.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalCount / pageSize);
    const allTests = await tests
      .find(searchCriteria)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    res.status(200).json({
      total_pages: totalPages,
      total_records: totalCount,
      current_page: pageNumber,
      data: allTests,
    });
  } catch (e) {
    res.status(401).json(e);
    console.log(e);
  }
};

exports.updateTest = async (req, res) => {
  try {
    const userId = req.payload;
    const { test_id } = req.params;
    const {
      test_name,
      description,
      category,
      price,
      patient_name,
      patient_id,
      doctor_name,
      doctor_id,
      technician_name,
      technician_id,
    } = req.body;
    const updatedTest = await tests.findByIdAndUpdate(
      { _id: test_id },
      {
        test_name,
        description,
        category,
        price,
        userId,
        patient_name,
        patient_id,
        doctor_name,
        doctor_id,
        technician_name,
        technician_id,
      },
      { new: true }
    );
    await updatedTest.save();
    res
      .status(200)
      .json({ message: "Test Updated Successfully", data: updatedTest });
  } catch (e) {
    res.status(401).json(e);
    console.log(e);
  }
};

exports.removeTest = async (req, res) => {
  try {
    const { test_id } = req.params;
    const deletedTest = await tests.findByIdAndDelete({ _id: test_id });
    res.status(200).json({
      message: "Test Deleted Successfully",
      data: deletedTest,
    });
  } catch (e) {
    res.status(401).json(e);
  }
};
