const { body } = require('express-validator');
const userModel = require("../models/userModel");

// Regex patterns
const usernamePattern = /^[A-Za-z][A-Za-z0-9_]*$/;
const phonePattern = /^09[0-9]{9}$/;

const validateRegister = [
    body('userName')
        .isString()
        .withMessage('نام کاربری باید متن باشد').bail()
        .matches(usernamePattern)
        .withMessage('نام کاربری باید با حرف شروع شود و فقط شامل حروف، اعداد و خط تیره باشد').bail()
        .isLength({ min: 5, max: 50 })
        .withMessage('نام کاربری باید بین 5 تا 50 کاراکتر باشد').bail()
        .custom(async (userName) => {
            const userExist = await userModel.checkUserNameExists(userName);
            if (userExist) {
                throw new Error('این نام کاربری قبلاً ثبت شده است');
            }
            return true;
        }),

    body('password')
        .isString()
        .withMessage('رمز عبور باید متن باشد').bail()
        .notEmpty()
        .withMessage('رمز عبور الزامی است').bail()
        .isLength({ min: 6 })
        .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد').bail()
        .isLength({ max: 128 })
        .withMessage('رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد').bail()
        .matches(/[A-Z]/)
        .withMessage('رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد').bail()
        .matches(/[a-z]/)
        .withMessage('رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد').bail()
        .matches(/[0-9]/)
        .withMessage('رمز عبور باید حداقل یک عدد داشته باشد'),

    body('email')
        .isEmail()
        .withMessage('لطفاً یک ایمیل معتبر وارد کنید').bail()
        .notEmpty()
        .withMessage('ایمیل الزامی است').bail()
        .isLength({ max: 254 })
        .withMessage('ایمیل نمی‌تواند بیشتر از 254 کاراکتر باشد').bail()
        .custom(async (email) => {
            const emailExist = await userModel.checkEmailExists(email);
            if (emailExist) {
                throw new Error('این ایمیل قبلاً ثبت شده است');
            }
            return true;
        }),

    body('fullName')
        .isString()
        .withMessage('نام کامل باید متن باشد').bail()
        .notEmpty()
        .withMessage('نام کامل الزامی است').bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('نام کامل باید بین 2 تا 100 کاراکتر باشد'),

    body('phoneNumber')
        .notEmpty()
        .withMessage('شماره تلفن الزامی است').bail()
        .isString()
        .withMessage('شماره تلفن باید متن باشد').bail()
        .matches(phonePattern)
        .withMessage('شماره تلفن باید با 09 شروع شود و 11 رقم باشد'),

    body('permission')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('سطح دسترسی باید admin یا user باشد')
];

const validateUpdate = [
    body('userName')
        .optional()
        .isString()
        .withMessage('نام کاربری باید متن باشد').bail()
        .matches(usernamePattern)
        .withMessage('نام کاربری باید با حرف شروع شود و فقط شامل حروف، اعداد و خط تیره باشد').bail()
        .isLength({ min: 5, max: 50 })
        .withMessage('نام کاربری باید بین 5 تا 50 کاراکتر باشد').bail()
        .custom(async (userName) => {
            const userExist = await userModel.checkUserNameExists(userName);
            if (userExist) {
                throw new Error('این نام کاربری قبلاً ثبت شده است');
            }
            return true;
        }),

    body('password')
        .optional()
        .isString()
        .withMessage('رمز عبور باید متن باشد').bail()
        .isLength({ min: 6 })
        .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد').bail()
        .isLength({ max: 128 })
        .withMessage('رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد').bail()
        .matches(/[A-Z]/)
        .withMessage('رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد').bail()
        .matches(/[a-z]/)
        .withMessage('رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد').bail()
        .matches(/[0-9]/)
        .withMessage('رمز عبور باید حداقل یک عدد داشته باشد'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('لطفاً یک ایمیل معتبر وارد کنید').bail()
        .isLength({ max: 254 })
        .withMessage('ایمیل نمی‌تواند بیشتر از 254 کاراکتر باشد').bail()
        .custom(async (email) => {
            const emailExist = await userModel.checkEmailExists(email);
            if (emailExist) {
                throw new Error('این ایمیل قبلاً ثبت شده است');
            }
            return true;
        }),

    body('fullName')
        .optional()
        .isString()
        .withMessage('نام کامل باید متن باشد').bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('نام کامل باید بین 2 تا 100 کاراکتر باشد'),

    body('phoneNumber')
        .optional()
        .isString()
        .withMessage('شماره تلفن باید متن باشد').bail()
        .matches(phonePattern)
        .withMessage('شماره تلفن باید با 09 شروع شود و 11 رقم باشد'),

    body('permission')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('سطح دسترسی باید admin یا user باشد')
];

const validateLogin = [
    body('userNameOrEmail')
        .exists()
        .withMessage('نام کاربری یا ایمیل الزامی است')
        .isString()
        .withMessage('نام کاربری یا ایمیل باید متن باشد')
        .isLength({ max: 254 })
        .withMessage('نام کاربری یا ایمیل نمی‌تواند بیشتر از 254 کاراکتر باشد'),

    body('password')
        .exists()
        .withMessage('رمز عبور الزامی است')
        .isString()
        .withMessage('رمز عبور باید متن باشد')
        .isLength({ min: 6 })
        .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد')
        .isLength({ max: 128 })
        .withMessage('رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد')
];

module.exports = {
    validateRegister,
    validateUpdate,
    validateLogin
};
