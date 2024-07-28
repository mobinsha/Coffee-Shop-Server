const express = require('express')
const router = express.Router();
const servicesController = require('../controllers/servicesController')
const userController = require("../controllers/userController");



router.get('/' , servicesController.getAllServices)
router.get('/:id' , servicesController.getServicesById)
router.post('/add' , servicesController.addService)
router.delete('/delete' , servicesController.deleteService)



module.exports = router;