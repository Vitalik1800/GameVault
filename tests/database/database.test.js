const path = require('path');

const db = require('../../src/database/database');

describe('Test database', () => {
    test('uses separate test database', () => {
        const databases = db
            .prepare('PRAGMA database_list')
            .all();

        const mainDatabase = databases.find(
            (database) => database.name === 'main'
        );

        expect(mainDatabase).toBeDefined();

        expect(path.normalize(mainDatabase.file))
            .toBe(
                path.normalize(
                    process.env.TEST_DB_PATH
                )
            );
    });

    test('contains games table', () => {
        const table = db
            .prepare(`
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                AND name = 'games'
            `)
            .get();

        expect(table).toBeDefined();
        expect(table.name).toBe('games');
    });
});