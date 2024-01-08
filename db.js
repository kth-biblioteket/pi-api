require('dotenv').config({ path: 'pi-api.env' })

const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DATABASEHOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  debug: false
});
console.log(process.env.DATABASEHOST,process.env.DB_PASSWORD)

module.exports = { db, mysql }