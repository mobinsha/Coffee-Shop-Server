const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const {validateRegister, validateUpdate, validateLogin} = require('../validations/userValidation')
const {validationResults} = require('../middlewares/validationResults')
const {authenticateToken} = require('../middlewares/authenticateToken')
const {authorize} = require('../middlewares/authorize')


router.get('/', authenticateToken, authorize(['admin']), userController.getAllUsers)

router.get('/:id', authenticateToken, authorize(['admin', 'user']), userController.getUserById)

router.post('/register', validateRegister, validationResults, userController.register);

router.post('/login', validateLogin, validationResults, userController.login);

router.delete('/delete/:id', authenticateToken, authorize('admin'), userController.deleteUser)

router.put('/update/:id', authenticateToken, authorize('admin'), validateUpdate, validationResults, userController.userUpdate)


module.exports = router;