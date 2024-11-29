const results = require("../models/resultModal");
const axios = require("axios");
const patients = require('../models/patientModal')
exports.addResult = async (req, res) => {
  try {
    const userId = req.payload;
    const {
      test,
      age,
      gender,
      weight,
      height,
      medical_history,
      hemoglobin,
      wbc,
      rbc,
      cholesterol,
      smoking,
      alcohol,
      activity_level,
      medications,
      symptoms,
      patient_name,
      patient_id,
    } = req.body;
    console.log(req.body);
    const newResult = new results({
      test,
      userId,
      age,
      gender,
      weight,
      height,
      medical_history,
      hemoglobin,
      wbc,
      rbc,
      cholesterol,
      smoking,
      alcohol,
      activity_level,
      medications,
      symptoms,
      patient_name,
      patient_id,
    });
    await newResult.save();
    res
      .status(200)
      .json({ message: "Test Added Successfully", data: newResult });
  } catch (e) {
    res.status(401).json(e);
    console.log(e);
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const userId = req.payload;
    const pageNumber = parseInt(req.query.page_no) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const searchQuery = req.query.search || "";
    const searchCriteria = {
      userId,
      patient_name: { $regex: searchQuery, $options: "i" },
    };
    if (pageNumber < 1 || pageSize < 10) {
      return res
        .status(400)
        .json({ message: "Invalid Page Number or Page Size" });
    }
    const totalCount = await results.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalCount / pageSize);
    const allResults = await results
      .find(searchCriteria)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    res.status(200).json({
      total_pages: totalPages,
      total_records: totalCount,
      current_page: pageNumber,
      data: allResults,
    });
  } catch (e) {
    res.status(401).json(e);
    console.log(e);
  }
};

exports.updateResult = async (req, res) => {
  try {
    const userId = req.payload;
    const { result_id } = req.params;
    const {
      test,
      age,
      gender,
      weight,
      height,
      medical_history,
      hemoglobin,
      wbc,
      rbc,
      cholesterol,
      smoking,
      alcohol,
      activity_level,
      medications,
      symptoms,
      patient_name,
      patient_id,
    } = req.body;
    const updatedResult = await results.findByIdAndUpdate(
      { _id: result_id },
      {
        test,
        age,
        gender,
        weight,
        height,
        medical_history,
        hemoglobin,
        wbc,
        rbc,
        cholesterol,
        smoking,
        alcohol,
        activity_level,
        medications,
        symptoms,
        patient_name,
        patient_id,
      },
      { new: true }
    );
    await updatedResult.save();
    res
      .status(200)
      .json({ message: "Result Updated Successfully", data: updatedResult });
  } catch (e) {
    res.status(401).json(e);
  }
};

exports.removeResult = async (req, res) => {
  try {
    const { result_id } = req.params;
    const deletedResult = await results.findByIdAndDelete({ _id: result_id });
    res.status(200).json({
      message: "Result Deleted Successfully",
      data: deletedResult,
    });
  } catch (e) {
    res.status(401).json(e);
  }
};
