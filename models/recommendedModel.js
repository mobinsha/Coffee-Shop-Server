const {dbConnection} = require("../config/dbConnection");


async function getAllRecommended() {
    return new Promise((resolve,reject) => {
        dbConnection.query('SELECT * FROM `recommended`', (err, result) => {
            if (err) return reject(err)
            else resolve(result)
        })
    })
}


function getRecommendedById (id){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `recommended` WHERE `id` = ?',
            [id],
            (err, result)=> {
                if (err) return reject(err);
                if (result.length === 0) return reject(new Error('محصول مورد نظر یافت نشد.'));
                else resolve(result);
            })
    })
}


async function addRecommended(RecommendedData){
    return new Promise((resolve, reject) => {
        dbConnection.query('INSERT INTO `recommended`(`id`, `imageAddress`,`name`,' +
            '`shortTitle`, `price`, `description`)' +
            ' VALUES (NULL,?, ?, ?, ?, ?)',

            [RecommendedData.imageAddress,
                RecommendedData.name,
                RecommendedData.shortTitle,
                RecommendedData.price,
                RecommendedData.description],

            (err, results) => {
                if (err) return reject(err);
                else resolve({ id: results.insertId, ...RecommendedData });
            }
        );
    })
}


async function deleteRecommended (id){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'DELETE FROM recommended WHERE `recommended`.`id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error('محصول مورد نظر یافت نشد.'));
                else resolve(result);
            }
        )
    })
}


async function updateRecommended (recommendedId, recommendedData){

    const currentDataArray  = await getRecommendedById(recommendedId)
    if (currentDataArray.length === 0) {
        throw new Error('سرویس یافت نشد.');
    }
    const currentData = currentDataArray[0]

    const recommendedUpdate = {
        imageAddress: recommendedData.imageAddress || currentData.imageAddress,
        name: recommendedData.name || currentData.name,
        shortTitle: recommendedData.shortTitle || currentData.shortTitle,
        price: recommendedData.price || currentData.price,
        description: recommendedData.description || currentData.description,
    }

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `recommended` SET ' +
            '`imageAddress` = ?,' +
            ' `name` = ?,' +
            ' `shortTitle` = ?,' +
            ' `price` = ?,' +
            ' `description` = ?' +
            ' WHERE `recommended`.`id` = ?',
            [recommendedUpdate.imageAddress, recommendedUpdate.name, recommendedUpdate.shortTitle,
                recommendedUpdate.price, recommendedUpdate.description, recommendedId],
            (err, result) => {
                if (err) return reject(err)
                if (result.changedRows === 0) return reject(new Error('اطلاعات جدید وارد کنید'));
                else resolve(result)
            })
    })
}


module.exports = {
    getAllRecommended,
    getRecommendedById,
    addRecommended,
    deleteRecommended,
    updateRecommended
}