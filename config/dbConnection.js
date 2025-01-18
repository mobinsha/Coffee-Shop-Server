const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const dbConnection = mysql.createPool(dbConfig);

dbConnection.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database: ' + err.message);
    } else {
        console.log('Database Connected!');
        connection.release();
    }
});

module.exports = {
    dbConnection
};
