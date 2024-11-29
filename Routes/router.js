const express = require('express');
const router = new express.Router()
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const userController = require('../controllers/userController')
const patientController = require('../controllers/patientController')
const doctorController = require('../controllers/doctorController')
const resultController = require('../controllers/resultController')
const technicianController = require('../controllers/technicianController')
const testController = require('../controllers/testController')
//-------------User-------------//
router.post('/register',userController.register)
router.post('/login',userController.login)
//------------patients-------------//
router.post('/add_patient',jwtMiddleware,patientController.addPatient)
router.get('/get_patients',jwtMiddleware,patientController.getAllPatients)
router.put('/update_patient/:patient_id',jwtMiddleware,patientController.updatePatient)
router.delete('/remove_patient/:patient_id',jwtMiddleware,patientController.removePatient)
//------------Doctor-------------//
router.post('/add_doctor',jwtMiddleware,doctorController.addDoctor)
router.get('/get_doctors',jwtMiddleware,doctorController.getAllDoctors)
router.put('/update_doctor/:doctor_id',jwtMiddleware,doctorController.updateDoctor)
router.delete('/remove_doctor/:doctor_id',jwtMiddleware,doctorController.removeDoctor)
//---------Result---------------//
router.post('/add_result',jwtMiddleware,resultController.addResult)
router.get('/get_results',jwtMiddleware,resultController.getAllResults)
router.put('/update_result/:result_id',jwtMiddleware,resultController.updateResult)
router.delete('/remove_result/:result_id',jwtMiddleware,resultController.removeResult)
//----------technician----------//
router.post('/add_technician',jwtMiddleware,technicianController.addTechnician)
router.get('/get_technicians',jwtMiddleware,technicianController.getAllTechnicians)
router.put('/update_technician/:technician_id',jwtMiddleware,technicianController.updateTechnician)
router.delete('/remove_technician/:technician_id',jwtMiddleware,technicianController.removeTechnician)
//---------test------------------//
router.post('/add_test',jwtMiddleware,testController.addTest)
router.get('/get_tests',jwtMiddleware,testController.getAllTests)
router.put('/update_test/:test_id',jwtMiddleware,testController.updateTest)
router.delete('/remove_test/:test_id',jwtMiddleware,testController.removeTest)
//=============Prediction=============//
module.exports = router