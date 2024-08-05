const {dbConnection} = require("../config/dbConnection");

function getBlogsById (id , callback){
    dbConnection.query(
        'SELECT * FROM `blogs` WHERE `id` = ?',
        [id],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result[0]);
        }
    )
}