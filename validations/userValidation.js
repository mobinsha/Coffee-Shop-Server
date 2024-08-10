const {body, validationResult} = require('express-validator')
const userModel = require("../models/userModel");


exports.validateAddUser = [
    body('userName')
        .isString().withMessage('نام کاربری باید از نوع رشته باشد.')
        .bail()
        .matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('نام کاربری باید با یک حرف شروع شده و تنها شامل حروف و اعداد باشد.')
        .bail()
        .isLength({min: 5, max: 50}).withMessage('نام کاربری باید حداقل 5 و حداکثر 50 کاراکتر باشد.')
        .custom(async (userName) => {
            const userExist = await userModel.checkUserNameExists(userName);
            if (userExist) {
                throw new Error('کاربری با این نام کاربری وجود دارد.');
            }
            return true;
        }).bail(),

    body('password')
        .isString().withMessage('گذرواژه باید از نوع رشته باشد.').bail()
        .notEmpty().withMessage('گذرواژه الزامی است.').bail()
        .isLength({min: 6}).withMessage('گذرواژه باید حداقل 6 کاراکتر باشد.').bail()
        .isLength({max: 128}).withMessage('گذرواژه نباید بیشتر از 128 کاراکتر باشد.').bail()
        .matches(/[A-Z]/).withMessage('گذرواژه باید حداقل شامل یک حرف بزرگ باشد.').bail()
        .matches(/[a-z]/).withMessage('گذرواژه باید حداقل شامل یک حرف کوچک باشد.').bail()
        .matches(/[0-9]/).withMessage('گذرواژه باید حداقل شامل یک عدد باشد.'),

    body('email')
        .isEmail().withMessage('لطفاً یک ایمیل معتبر وارد کنید.').bail()
        .notEmpty().withMessage('ایمیل الزامی است.').bail()
        .isLength({max: 254}).withMessage('ایمیل نباید بیشتر از 254 کاراکتر باشد.').bail()
        .custom(async (email) => {
            const emailExist = await userModel.checkEmailExists(email);
            if (emailExist) {
                throw new Error('کاربری با این ایمیل وجود دارد.');
            }
            return true;
        }),

    body('fullName')
        .isString().withMessage('نام کامل باید از نوع رشته باشد.').bail()
        .notEmpty().withMessage('نام کامل نباید خالی باشد.').bail()
        .isLength({max: 100}).withMessage('نام کامل نباید بیش از 100 کاراکتر باشد.').bail()
    // .matches(/^[\u0600-\u06FF\s]+$/).withMessage('نام کامل فقط باید شامل حروف فارسی و فضای خالی باشد.')
    ,

    body('phoneNumber')
        .notEmpty().withMessage('شماره تلفن الزامی است.').bail()
        .isString().withMessage('شماره تلفن باید از نوع رشته باشد.').bail()
        .matches(/^09[0-9]{9}$/).withMessage('شماره تلفن باید با 09 شروع شده و شامل 11 رقم باشد.').bail()
        .isLength({min: 11, max: 11}).withMessage('شماره تلفن باید 11 رقم باشد.'),

    body('permission')
        .isIn(['admin', 'user', 'guest']).withMessage('سطح دسترسی باید یکی از موارد زیر باشد: مدیر، کاربر یا مهمان.')
];



