const { dbConnection } = require("../config/dbConnection");
const { SendError } = require('../utils/sendError');

async function getAllBlogs(limit) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM blogs ORDER BY createdAt DESC'

        if (limit !== undefined){
         limit = parseInt(limit, 10)
            if (isNaN(limit) || limit <= 0){
                return reject(new SendError(400, "پارامتر محدودیت نامعتبر است. باید یک عدد مثبت باشد"))
            } else query += ' LIMIT ?'
        }

        dbConnection.query(query, [limit],(err, result) => {
            if (err) return reject(new SendError(500, err));
            else resolve(result);
        });
    });
}

function getBlogById(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `blogs` WHERE `id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.length === 0) return reject(new SendError(404, 'مقاله مورد نظر یافت نشد'));
                else resolve(result);
            }
        );
    });
}

async function addBlog(blogData) {
    return new Promise(async (resolve, reject) => {

        dbConnection.query('INSERT INTO `blogs`' +
            '(`id`, `title`, `content`, `adminId`, `imageAddress`, `createdAt`, `updatedAt`)' +
            ' VALUES (NULL, ?, ?, ?, ?, current_timestamp(), current_timestamp())',
            [blogData.title, blogData.content, blogData.adminId, blogData.imageAddress],
            (err, results) => {
                if (err) return reject(new SendError(500, err));
                else resolve({ id: results.insertId, ...blogData });
            }
        );
    });
}

async function deleteBlog(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'DELETE FROM blogs WHERE `blogs`.`id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.affectedRows === 0) return reject(new SendError(404, 'مقاله مورد نظر یافت نشد'));
                else resolve(result);
            }
        );
    });
}

async function updateBlogs(blogId, blogData) {
    const currentDataArray = await getBlogById(blogId);
    if (currentDataArray.length === 0) {
        throw new SendError(404, 'مقاله مورد نظر یافت نشد');
    }
    const currentData = currentDataArray[0];

    const blogUpdate = {
        title: blogData.title !== undefined ? blogData.title : currentData.title,
        content: blogData.content !== undefined ? blogData.content : currentData.content,
        imageAddress: blogData.imageAddress !== undefined ? blogData.imageAddress : currentData.imageAddress,
        adminId: blogData.adminId || currentData.adminId
    };

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `blogs` SET `title` = ?, `content` = ?, `imageAddress` = ?, `adminId` = ? ' +
            ' WHERE `blogs`.`id` = ?',
            [blogUpdate.title, blogUpdate.content, blogUpdate.imageAddress, blogUpdate.adminId, blogId],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.changedRows === 0) return reject(new SendError(400, 'لطفاً اطلاعات جدید وارد کنید'));
                else resolve(result);
            });
    });
}

module.exports = {
    getAllBlogs,
    getBlogById,
    addBlog,
    deleteBlog,
    updateBlogs
};
