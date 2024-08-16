const { dbConnection } = require("../config/dbConnection");
const { SendError } = require('../utils/SendError');

async function getAllBlogs() {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM `blogs`', (err, result) => {
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
                if (result.length === 0) return reject(new SendError(404, 'Blog not found.'));
                else resolve(result);
            }
        );
    });
}

async function addBlog(blogData) {
    return new Promise(async (resolve, reject) => {

        dbConnection.query('INSERT INTO `blogs`' +
            '(`id`, `title`, `content`, `adminId`, `created_at`, `updated_at`)' +
            ' VALUES (NULL, ?, ?, ?, current_timestamp(), current_timestamp())',
            [blogData.title, blogData.content, blogData.adminId],
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
                if (result.affectedRows === 0) return reject(new SendError(404, 'Blog not found.'));
                else resolve(result);
            }
        );
    });
}

async function updateBlogs(blogId, blogData) {
    const currentDataArray = await getBlogById(blogId);
    if (currentDataArray.length === 0) {
        throw new SendError(404, 'Blog not found.');
    }
    const currentData = currentDataArray[0];

    const blogUpdate = {
        title: blogData.title || currentData.title,
        content: blogData.content || currentData.content,
        userId: blogData.userId || currentData.userId
    };

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `blogs` SET `title` = ?, `content` = ?, `userId` = ? ' +
            ' WHERE `blogs`.`id` = ?',
            [blogUpdate.title, blogUpdate.content, blogUpdate.userId, blogId],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.changedRows === 0) return reject(new SendError(400, 'Enter new information.'));
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
