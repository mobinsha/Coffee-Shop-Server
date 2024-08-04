const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const { validateAddUser } = require('../validations/userValidation')


router.get('/' , userController.getAllUsers)
router.get('/:id' , userController.getUserById)
router.post('/add', validateAddUser, userController.addUser);
router.delete('/delete' , userController.deleteUser)
router.put('/update' , userController.userUpdate)



module.exports = router;