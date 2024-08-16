const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const {validateRegister} = require('../validations/userValidation')
const {authenticateToken} = require('../middlewares/authenticateToken')
const {authorize} = require('../middlewares/authorize')


router.get('/', authenticateToken, authorize(['admin']), userController.getAllUsers)
router.get('/:id', authenticateToken, authorize(['admin', 'user']), userController.getUserById)
router.post('/register', validateRegister, userController.register);
router.post('/login', userController.login);
router.delete('/delete/:id', authenticateToken, authorize('admin'), userController.deleteUser)
router.put('/update/:id', authenticateToken, authorize('admin'), userController.userUpdate)


module.exports = router;