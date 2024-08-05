const express = require('express')
const router = express.Router();
const recommendedController = require('../controllers/recommendedController')
const {validateAddRecommended} = require('../validations/recommendedValidation')


router.get('/' , recommendedController.getAllRecommended)
router.get('/:id' , recommendedController.getRecommendedById)
router.post('/add' , validateAddRecommended, recommendedController.addRecommended)
router.delete('/delete' , recommendedController.deleteRecommended)
router.put('/update', recommendedController.updateRecommended)


module.exports = router;