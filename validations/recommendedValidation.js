const { body } = require ('express-validator')

exports.validateAddRecommended = [
    body('imageAddress')
        .matches(/\.(jpeg|jpg|gif|png)$/)
        .withMessage('آدرس باید یک تصویر با فرمت jpg، jpeg، gif یا png باشد'),

    body('name')
        .notEmpty()
        .withMessage('نام سرویس الزامی است.').bail()
        .isLength({ min: 2, max: 50 })
        .withMessage('نام باید بین 2 تا 50 کاراکتر باشد').bail()
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('نام فقط می‌تواند شامل حروف، اعداد و فاصله باشد'),

    body('shortTitle')
        .notEmpty()
        .withMessage('نام محصول الزامی است.').bail()
        .isString()
        .withMessage('عنوان باید یک رشته باشد').bail()
        .isLength({ min: 3 }).withMessage('عنوان باید حداقل ۳ کاراکتر داشته باشد').bail()
        .isLength({ max: 100 }).withMessage('عنوان نباید بیش از ۱۰۰ کاراکتر باشد'),

    body('price')
        .notEmpty()
        .withMessage('قیمت محصول الزامی است.').bail()
        .isNumeric().withMessage('قیمت باید یک عدد باشد').bail()
        .isFloat({ gt: 0 }).withMessage('قیمت باید بیشتر از ۰ باشد'),

    body('description')
        .isString().withMessage('توضیحات باید یک رشته باشد').bail()
        .isLength({ min: 5 }).withMessage('توضیحات باید حداقل 5 کاراکتر داشته باشد')
]