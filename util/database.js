const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'airport-schedule',
  password: '11111111'
});

module.exports = pool;