const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('GET /api/games empty library', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();
    });

    test('returns empty array when library is empty', async () => {
        const response = await request(app)
            .get('/api/games');

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual([]);

        expect(Array.isArray(response.body))
            .toBe(true);
    });
});