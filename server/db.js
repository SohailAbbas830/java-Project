const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, 'database.sqlite3');

function getDbConnection(cb) {
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    cb(err, db);
  });
}

module.exports = {
  getDbConnection: getDbConnection
};
