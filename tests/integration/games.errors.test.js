const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('API errors', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();
    });

    test('GET /api/games/999999 returns 404', async () => {
        const response = await request(app)
            .get('/api/games/999999');

        expect(response.statusCode).toBe(404);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual({
            error: {
                message: 'Game not found'
            }
        });
    });

    test('PUT /api/games/999999 returns 404', async () => {
        const gameData = {
            title: 'Updated Game',
            description: 'Updated description',
            genre: 'Action',
            platform: 'PC',
            status: 'Playing',
            rating: 9,
            release_year: 2025,
            cover_url: 'https://example.com/updated.jpg'
        };

        const response = await request(app)
            .put('/api/games/999999')
            .send(gameData);

        expect(response.statusCode).toBe(404);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual({
            error: {
                message: 'Game not found'
            }
        });
    });

    test('DELETE /api/games/999999 returns 404', async () => {
        const response = await request(app)
            .delete('/api/games/999999');

        expect(response.statusCode).toBe(404);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual({
            error: {
                message: 'Game not found'
            }
        });
    });
});