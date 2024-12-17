const results = require("../models/resultModal");
const axios = require("axios");
const patients = require("../models/patientModal");
const { GoogleGenerativeAI } = require("@google/generative-ai");
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

exports.generatePrediction = async (req, res) => {
  try {
    const { result_id } = req.params;
    console.log(result_id);
    const genAI = new GoogleGenerativeAI(
      "AIzaSyB0wSa9Xfbl0FeZDk7Ojss3tBExl-GP7Io"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultDetails = await results.findOne({ _id: result_id });
    const prompt = `You are an AI healthcare assistant tasked with analyzing patient health data, predicting their future health trends, and suggesting remedial actions for well-being. Consider the following patient information:

Patient Details: 
- Age: ${resultDetails.age}  
- Gender: ${resultDetails.gender} 
- Weight: ${resultDetails.weight} kg  
- Height: ${resultDetails.height} cm  
- Medical History: ${resultDetails.medical_history}
- Medications: ${resultDetails.medications}
- Symptoms: ${resultDetails.symptoms}
- Cholesterol Level: ${resultDetails.cholesterol} mg/dL  
- Hemoglobin Level: ${resultDetails.hemoglobin} g/dL  
- RBC Count: ${resultDetails.rbc} (million cells/µL)  
- WBC Count:${resultDetails.wbc} (cells/µL)  
- Activity Level: ${resultDetails.activity_level} 

### Tasks:
1. Predict the patient's **future health outcomes** based on the given data, considering potential risks related to cholesterol, hemoglobin, and blood counts.  
2. Identify health concerns or patterns that may arise from their current health status.  
3. Suggest **remedial measures** to improve their well-being, including:
   - Lifestyle changes (e.g., diet, exercise, sleep).  
   - Medical interventions (if needed).  
   - Recommendations for follow-up tests or consultations.  
4. Ensure the advice is explained clearly, in simple terms, so the patient can easily follow it.

Provide the prediction and suggestions in a structured format:
- **Future Prediction**: [Your Analysis]  
- **Health Concerns**: [List Key Issues]  
- **Suggestions**:  
   1. [Lifestyle changes]  
   2. [Medical suggestions]  
   3. [Follow-up actions]
`;

    const result = await model.generateContent(prompt);
    res.status(200).json({
      message: "Prediction generated successfully",
      data: result.response.text(),
    });
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
