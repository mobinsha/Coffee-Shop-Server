const {dbConnection} = require("../config/dbConnection");


function getAllRecommended(callback) {
    dbConnection.query(
        'SELECT * FROM `recommended`' ,
        callback
    )
}


function getRecommendedById (id , callback){
    dbConnection.query(
        'SELECT * FROM `recommended` WHERE `id` = ?',
        [id],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result[0]);
        }
    )
}


function addRecommended(RecommendedData, callback){
    dbConnection.query('INSERT INTO `recommended`(`id`, `imageAddress`,`name`,`shortTitle`, `price`, `description`)' +
        ' VALUES (NULL,?, ?, ?, ?, ?)',

        [RecommendedData.imageAddress,
            RecommendedData.name,
            RecommendedData.shortTitle,
            RecommendedData.price,
            RecommendedData.description],

        (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, { id: results.insertId, ...RecommendedData });
        }
    );
}


function deleteRecommended (id , callback){
    dbConnection.query(
        'DELETE FROM `recommended` WHERE `recommended`.`id` = ?',
        [id],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    )
}


module.exports = {
    getRecommendedById,
    getAllRecommended,
    deleteRecommended,
    addRecommended
}