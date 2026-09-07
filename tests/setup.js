const path = require('path');

process.env.TEST_DB_PATH = path.join(
    __dirname,
    'database',
    'test.db'
);