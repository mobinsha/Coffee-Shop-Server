const {dbConnection} = require("../config/dbConnection");


async function getAllServices() {
    return new Promise((resolve,reject) => {
        dbConnection.query('SELECT * FROM `services`', (err, result) => {
            if (err) return reject(err)
            else resolve(result)
        })
    })
}


function getServicesById (id){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `services` WHERE `id` = ?',
            [id],
            (err, result)=> {
                if (err) return reject(err);
                if (result.length === 0) return reject(new Error('سروریس مورد نظر یافت نشد.'));
                else resolve(result);
            })
    })
}


async function addService(serviceData){
    return new Promise((resolve, reject) => {
        dbConnection.query('INSERT INTO `services` (`id`, `imageAddress`,`name`)' +
            ' VALUES (NULL, ?, ?)',
            [serviceData.imageAddress , serviceData.name],
            (err, results) => {
                if (err) return reject(err);
                else resolve({ id: results.insertId, ...serviceData });
            }
        );
    })
}


async function deleteService (id){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'DELETE FROM services WHERE `services`.`id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error('سروریس مورد نظر یافت نشد.'));
                else resolve(result);
            }
        )
    })
}


async function updateService (serviceId ,serviceData){

    const currentDataArray  = await getServicesById(serviceId)
    if (currentDataArray.length === 0) {
        throw new Error('سرویس یافت نشد.');
    }
    const currentData = currentDataArray[0]

    const serviceUpdate = {
        imageAddress: serviceData.imageAddress || currentData.imageAddress,
        name: serviceData.name || currentData.name,
    }

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `services` SET `imageAddress` = ?, `name` = ?' +
            ' WHERE `services`.`id` = ?',
            [serviceUpdate.imageAddress, serviceUpdate.name, serviceId],
            (err, result) => {
                if (err) return reject(err)
                if (result.changedRows === 0) return reject(new Error('اطلاعات جدید وارد کنید'));
                else resolve(result)
            })
    })
}


module.exports = {
    getAllServices,
    getServicesById,
    addService,
    deleteService,
    updateService
}