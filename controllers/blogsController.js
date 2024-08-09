const {validationResult} = require("express-validator");
const blogsModel = require("../models/blogsModel");


function sendResponse(res, statusCode, message, data = {}, error = null) {
    res.status(statusCode).json({
        status: statusCode < 400,
        message,
        data,
        error
    });
}


async function getAllBlogs (req, res) {
    try{
        const blog = await blogsModel.getAllBlogs()
        sendResponse(res, 200, 'موفقیت‌آمیز', blog);
    } catch (err) {
        sendResponse(res, 500, 'خطای سرور', err.message);
    }
}


async function getBlogById (req, res) {
    const blogId = req.params.id

    try{
        const blog = await blogsModel.getBlogById(blogId)
        sendResponse(res, 200, 'موفقیت‌آمیز', blog);
    } catch (err) {
        if (err === 'بلاگ مورد نظر یافت نشد.'){
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function addBlog (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'خطاهای اعتبارسنجی', {}, errors.array());
    }

    const {title, content, userId} = req.body;


    try {
        const newBlog = await blogsModel.addBlog({title, content, userId})
        sendResponse(res, 201, newBlog, 'بلاگ با موفقیت اضافه شد');
    } catch (err) {
        if (err.message === 'کاربر مورد نظر وجود ندارد.') {
            sendResponse(res, 400, 'خطای سرور', {}, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }}
}


async function deleteBlog(req, res) {
    const deleteBlogId = req.body.id;
    try {
        await blogsModel.deleteBlog(deleteBlogId);
        sendResponse(res, 200, 'بلاگ با موفقیت حذف شد');
    } catch (err) {
        if (err.message === 'بلاگ مورد نظر یافت نشد.') {
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function updateBlog(req, res) {
    const blogId = req.body.id;
    const blogData = req.body;

    try {
        await blogsModel.updateBlogs(blogId, blogData);
        sendResponse(res    , 200, 'بلاگ با موفقیت به‌روزرسانی شد');

    } catch (error) {
        if (error.message === 'سرویس یافت نشد.') {
            sendResponse(res, 404, error.message);
        } else if (error.message === 'اطلاعات جدید وارد کنید') {
            sendResponse(res, 400, error.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, error.message);
        }
    }
}


module.exports = {
    getAllBlogs,
    getBlogById,
    addBlog,
    deleteBlog,
    updateBlog
}