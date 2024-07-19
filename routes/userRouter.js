const express = require('express')
const router = express.Router();
const userController = require('../controllers/userContoroller')



router.get('/' , userController.getAllUsers)
router.get('/:id' , userController.getUserById)
router.post('/add' , userController.addUser)
router.delete('/delete' , userController.deleteUser)
router.put('/update' , userController.userUpdate)



module.exports = router;