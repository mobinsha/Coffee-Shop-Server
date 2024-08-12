const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const {validateRegister} = require('../validations/userValidation')
const {authenticateToken} = require('../utils/authenticateToken')


router.get('/', userController.getAllUsers)
router.get('/:id', authenticateToken, userController.getUserById)
router.post('/register', validateRegister, userController.register);
router.post('/login', userController.login);
router.delete('/delete', userController.deleteUser)
router.put('/update', userController.userUpdate)


module.exports = router;