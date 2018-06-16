const mysql = require('mysql');
const Promise = require('bluebird');
const connection = mysql.createConnection({

    host: 'localhost',
    user:'root',
    password:'root',
    port:8889,
    database:'juejin'
})

connection.connect();
module.exports = {

    query: Promise.promisify(connection.query).bind(connection)
}