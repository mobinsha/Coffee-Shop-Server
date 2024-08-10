const { validationResult } = require("express-validator");
const blogsModel = require("../models/blogsModel");
const { sendResponse } = require('../utils/responseController');

async function getAllBlogs(req, res, next) {
    try {
        const blog = await blogsModel.getAllBlogs();
        sendResponse(res, 200, 'Success', blog);
    } catch (err) {
        next(err);
    }
}

async function getBlogById(req, res, next) {
    const blogId = req.params.id;

    try {
        const blog = await blogsModel.getBlogById(blogId);
        sendResponse(res, 200, 'Success', blog);
    } catch (err) {
        next(err);
    }
}

async function addBlog(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'Validation errors', {}, errors.array());
    }

    const { title, content, userId } = req.body;

    try {
        const newBlog = await blogsModel.addBlog({ title, content, userId });
        sendResponse(res, 201, 'Blog successfully added', newBlog);
    } catch (err) {
        next(err);
    }
}

async function deleteBlog(req, res, next) {
    const deleteBlogId = req.body.id;
    try {
        await blogsModel.deleteBlog(deleteBlogId);
        sendResponse(res, 200, 'Blog successfully deleted');
    } catch (err) {
        next(err);
    }
}

async function updateBlog(req, res, next) {
    const blogId = req.body.id;
    const blogData = req.body;

    try {
        await blogsModel.updateBlogs(blogId, blogData);
        sendResponse(res, 200, 'Blog successfully updated');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllBlogs,
    getBlogById,
    addBlog,
    deleteBlog,
    updateBlog
};
