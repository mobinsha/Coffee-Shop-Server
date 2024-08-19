const mysql = require('mysql')
require('dotenv').config();

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

dbConnection.connect((err) => {
    if (err) console.error('Error connecting to database: ' + err.stack)
    else console.log("database Connected !")
})

module.exports = {
    dbConnection
}
