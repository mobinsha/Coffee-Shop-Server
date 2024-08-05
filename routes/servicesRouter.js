const express = require('express')
const router = express.Router();
const servicesController = require('../controllers/servicesController')
const {validateAddService} = require('../validations/serviceValidation')


router.get('/' , servicesController.getAllServices)
router.get('/:id' , servicesController.getServicesById)
router.post('/add' , validateAddService ,servicesController.addService)
router.delete('/delete' , servicesController.deleteService)



module.exports = router;