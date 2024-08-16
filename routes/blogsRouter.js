const express = require('express')
const router = express.Router();
const blogsController = require('../controllers/blogsController')
const {validateAddBlog} = require('../validations/blogValidation')
const {authorize} = require("../middlewares/authorize");
const {authenticateToken} = require("../middlewares/authenticateToken");


router.get('/', authenticateToken, authorize(['public', 'admin', 'user']), blogsController.getAllBlogs)
router.get('/:id', authenticateToken, authorize('admin'), blogsController.getBlogById)
router.post('/add', authenticateToken, authorize('admin'), validateAddBlog, blogsController.addBlog)
router.delete('/delete/:id', authenticateToken, authorize('admin'), blogsController.deleteBlog)
router.put('/update/:id', authenticateToken, authorize('admin'), blogsController.updateBlog)


module.exports = router;