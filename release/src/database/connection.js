const Database = require('better-sqlite3');

const path = require('path');

const dbPath = process.env.TEST_DB_PATH
    ? path.resolve(process.env.TEST_DB_PATH)
    : path.join(__dirname, 'gamevault.db');

const db = new Database(dbPath);

module.exports = db;