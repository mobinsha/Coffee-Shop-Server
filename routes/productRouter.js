const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController')
const {validateAddProduct} = require('../validations/productValidation')
const {authorize} = require("../middlewares/authorize");
const {authenticateToken} = require("../middlewares/authenticateToken");


router.get('/', authenticateToken, authorize(['public', 'admin', 'user']), productController.getAllProduct)
router.get('/:id', authenticateToken, authorize('admin'), productController.getProductById)
router.post('/add', authenticateToken, authorize('admin'), validateAddProduct, productController.addProduct)
router.delete('/delete/:id', authenticateToken, authorize('admin'), productController.deleteProduct)
router.put('/update/:id', authenticateToken, authorize('admin'), productController.updateProduct)


module.exports = router;