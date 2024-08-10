const express = require('express')
const router = express.Router();
const blogsController = require('../controllers/blogsController')
const {validateAddBlog} = require('../validations/blogValidation')


router.get('/', blogsController.getAllBlogs)
router.get('/:id', blogsController.getBlogById)
router.post('/add', validateAddBlog, blogsController.addBlog)
router.delete('/delete', blogsController.deleteBlog)
router.put('/update', blogsController.updateBlog)


module.exports = router;