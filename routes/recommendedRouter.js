const express = require('express')
const router = express.Router();
const recommendedController = require('../controllers/recommendedController')



router.get('/' , recommendedController.getAllRecommended)
router.get('/:id' , recommendedController.getRecommendedById)
router.post('/add' , recommendedController.addRecommended)
router.delete('/delete' , recommendedController.deleteRecommended)


module.exports = router;