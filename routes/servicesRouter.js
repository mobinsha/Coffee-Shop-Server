const express = require('express')
const router = express.Router();
const servicesController = require('../controllers/servicesController')
const {validateAddService} = require('../validations/serviceValidation')
const {authenticateToken} = require('../middlewares/authenticateToken')
const {authorize} = require('../middlewares/authorize')
const {validationResults} = require('../middlewares/validationResults')
const {validateUpdate} = require("../validations/userValidation");


router.get('/', authenticateToken, authorize(['public', 'admin', 'user']), servicesController.getAllServices)

router.get('/:id', authenticateToken, authorize('admin'), servicesController.getServicesById)

router.post('/add', authenticateToken, authorize('admin'), validateAddService, validationResults, servicesController.addService)

router.delete('/delete/:id', authenticateToken, authorize('admin'), servicesController.deleteService)

router.put('/update/:id', authenticateToken, authorize('admin'), validateUpdate, validationResults, servicesController.updateService)


module.exports = router;