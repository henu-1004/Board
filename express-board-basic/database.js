const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gusdn7447!',
  database: 'boarddb'
});

connection.connect((err) => {
  if (err) {
    console.error('database connection failed: ' + err.stack);
    return;
  }
  console.log('connected to database.');
});

module.exports = connection;
