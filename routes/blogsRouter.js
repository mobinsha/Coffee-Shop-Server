const express = require('express')
const router = express.Router();
const blogsController = require('../controllers/blogsController')
const {validateAddBlog, validateUpdateBlog} = require('../validations/blogValidation')
const {validationResults} = require('../middlewares/validationResults')
const {authorize} = require("../middlewares/authorize");
const {authenticateToken} = require("../middlewares/authenticateToken");


router.get('/', authenticateToken, authorize(['public', 'admin', 'user']), blogsController.getAllBlogs)

router.get('/:id', authenticateToken, authorize('admin'), blogsController.getBlogById)

router.post('/add', authenticateToken, authorize('admin'), validateAddBlog, validationResults, blogsController.addBlog)

router.delete('/delete/:id', authenticateToken, authorize('admin'), blogsController.deleteBlog)

router.put('/update/:id', authenticateToken, authorize('admin'), validateUpdateBlog, validationResults, blogsController.updateBlog)


module.exports = router;