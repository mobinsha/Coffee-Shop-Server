const {body} = require('express-validator')


exports.validateAddService = [
    body('imageAddress')
        .matches(/\.(jpeg|jpg|gif|png)$/)
        .withMessage('آدرس باید یک تصویر با فرمت jpg، jpeg، gif یا png باشد'),
    body('name')
        .notEmpty()
        .withMessage('نام سرویس الزامی است.').bail()
        .isLength({min: 2, max: 50})
        .withMessage('نام باید بین 2 تا 50 کاراکتر باشد').bail()
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('نام فقط می‌تواند شامل حروف، اعداد و فاصله باشد'),
]