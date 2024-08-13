const express = require('express')
const router = express.Router();
const servicesController = require('../controllers/servicesController')
const {validateAddService} = require('../validations/serviceValidation')
const {authenticateToken} = require('../middlewares/authenticateToken')
const {authorize} = require('../middlewares/authorize')


router.get('/', authenticateToken, authorize(['admin', 'user']), servicesController.getAllServices)
router.get('/:id', authenticateToken, authorize('admin'), servicesController.getServicesById)
router.post('/add', authenticateToken, authorize('admin'), validateAddService, servicesController.addService)
router.delete('/delete', authenticateToken, authorize('admin'), servicesController.deleteService)
router.put('/update', authenticateToken, authorize('admin'), servicesController.updateService)


module.exports = router;