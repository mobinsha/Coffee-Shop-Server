const express = require('express')
const router = express.Router();
const recommendedController = require('../controllers/recommendedController')

router.get('/', recommendedController.getRecommended)

module.exports = router;