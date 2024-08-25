const mysql = require('mysql2')
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const dbConnection = mysql.createConnection(dbConfig)
dbConnection.connect((err) => {
    if (err) console.error('Error connecting to database: ' + err.stack)
    else console.log("database Connected !")
})

module.exports = {
    dbConnection
}
