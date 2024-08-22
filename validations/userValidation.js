const { body } = require('express-validator');
const userModel = require("../models/userModel");

validateRegister = [
    body('userName')
        .isString().withMessage('Username must be a string.').bail()
        .matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('Username must start with a letter and can only contain letters and numbers.').bail()
        .isLength({ min: 5, max: 50 }).withMessage('Username must be between 5 and 50 characters long.').bail()
        .custom(async (userName) => {
            const userExist = await userModel.checkUserNameExists(userName);
            if (userExist) {
                throw new Error('A user with this username already exists.');
            }
            return true;
        }),

    body('password')
        .isString().withMessage('Password must be a string.').bail()
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.').bail()
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters.').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.').bail()
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.').bail()
        .matches(/[0-9]/).withMessage('Password must contain at least one number.'),

    body('email')
        .isEmail().withMessage('Please enter a valid email.').bail()
        .notEmpty().withMessage('Email is required.').bail()
        .isLength({ max: 254 }).withMessage('Email must not exceed 254 characters.').bail()
        .custom(async (email) => {
            const emailExist = await userModel.checkEmailExists(email);
            if (emailExist) {
                throw new Error('A user with this email already exists.');
            }
            return true;
        }),

    body('fullName')
        .isString().withMessage('Full name must be a string.').bail()
        .notEmpty().withMessage('Full name is required.').bail()
        .isLength({ max: 100 }).withMessage('Full name must not exceed 100 characters.').bail(),

    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required.').bail()
        .isString().withMessage('Phone number must be a string.').bail()
        .matches(/^09[0-9]{9}$/).withMessage('Phone number must start with 09 and contain 11 digits.').bail()
        .isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits long.'),

    body('permission')
        .isIn(['admin', 'user']).withMessage('Permission level must be one of the following: admin or user')
];

validateUpdate = [
    body('userName')
        .optional()
        .isString().withMessage('Username must be a string.').bail()
        .matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('Username must start with a letter and can only contain letters and numbers.').bail()
        .isLength({ min: 5, max: 50 }).withMessage('Username must be between 5 and 50 characters long.').bail()
        .custom(async (userName) => {
            const userExist = await userModel.checkUserNameExists(userName);
            if (userExist) {
                throw new Error('A user with this username already exists.');
            }
            return true;
        }),

    body('password')
        .optional()
        .isString().withMessage('Password must be a string.').bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.').bail()
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters.').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.').bail()
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.').bail()
        .matches(/[0-9]/).withMessage('Password must contain at least one number.'),

    body('email')
        .optional()
        .isEmail().withMessage('Please enter a valid email.').bail()
        .isLength({ max: 254 }).withMessage('Email must not exceed 254 characters.').bail()
        .custom(async (email) => {
            const emailExist = await userModel.checkEmailExists(email);
            if (emailExist) {
                throw new Error('A user with this email already exists.');
            }
            return true;
        }),

    body('fullName')
        .optional()
        .isString().withMessage('Full name must be a string.').bail()
        .isLength({ max: 100 }).withMessage('Full name must not exceed 100 characters.').bail(),

    body('phoneNumber')
        .optional()
        .isString().withMessage('Phone number must be a string.').bail()
        .matches(/^09[0-9]{9}$/).withMessage('Phone number must start with 09 and contain 11 digits.').bail()
        .isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits long.'),

    body('permission')
        .optional()
        .isIn(['admin', 'user']).withMessage('Permission level must be one of the following: admin or user')
]

validateLogin = [
    body('userNameOrEmail')
        .exists().withMessage('Username or email is required.')
        .isString().withMessage('Username or email must be a string.')
        .isLength({ max: 254 }).withMessage('Username or email must not exceed 254 characters.')
        .custom(async (value) => {
            if (value.includes('@')) {
                await body('userNameOrEmail').isEmail().withMessage('Invalid email format').run({ body: { userNameOrEmail: value } });
            } else {
                if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
                    throw new Error('Username must start with a letter and can only contain letters and numbers.');
                }
                if (value.length < 5 || value.length > 50) {
                    throw new Error('Username must be between 5 and 50 characters long.');
                }
            }
            return true;
        }),

    body('password')
        .exists().withMessage('Password is required.')
        .isString().withMessage('Password must be a string.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters.')
]



module.exports = {
    validateRegister,
    validateUpdate,
    validateLogin
}