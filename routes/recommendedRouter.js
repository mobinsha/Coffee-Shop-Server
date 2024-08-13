const express = require('express')
const router = express.Router();
const recommendedController = require('../controllers/recommendedController')
const {validateAddRecommended} = require('../validations/recommendedValidation')
const {authorize} = require("../middlewares/authorize");
const {authenticateToken} = require("../middlewares/authenticateToken");


router.get('/', authenticateToken, authorize(['admin', 'user']),recommendedController.getAllRecommended)
router.get('/:id', authenticateToken, authorize('admin'), recommendedController.getRecommendedById)
router.post('/add', authenticateToken, authorize('admin'), validateAddRecommended, recommendedController.addRecommended)
router.delete('/delete', authenticateToken, authorize('admin'), recommendedController.deleteRecommended)
router.put('/update', authenticateToken, authorize('admin'), recommendedController.updateRecommended)


module.exports = router;