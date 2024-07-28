const {dbConnection} = require("../config/dbConnection");


function getAllServices(callback) {
    dbConnection.query(
        'SELECT * FROM `services`' ,
        callback
    )
}


function getServicesById (id , callback){
    dbConnection.query(
        'SELECT * FROM `services` WHERE `id` = ?',
        [id],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result[0]);
        }
    )
}


function addService(serviceData, callback){
    dbConnection.query('INSERT INTO `services`(`id`, `imageAddress`,`name`)' +
        ' VALUES (NULL, ?, ?)',
        [serviceData.imageAddress , serviceData.name],
        (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, { id: results.insertId, ...serviceData });
        }
    );
}


function deleteService (id , callback){
    dbConnection.query(
        'DELETE FROM `services` WHERE `services`.`id` = ?',
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
    getAllServices,
    getServicesById,
    deleteService,
    addService
}