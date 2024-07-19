const mysql = require('mysql')


const dbConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'coffeeShop'
})

dbConnection.connect((err) => {
    if (err) console.error('Error connecting to database: ' + err.stack)
    else console.log("database Connected !")
})

module.exports = {
    dbConnection
}
