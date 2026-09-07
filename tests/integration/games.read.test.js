const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('GET /api/games', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();

        db.prepare(`
            INSERT INTO games (
                title,
                description,
                genre,
                platform,
                status,
                rating,
                release_year,
                cover_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)   
        `).run(
            'Read Test Game',
            'Game for READ tests',
            'RPG',
            'PC',
            'Backlog',
            9,
            2025,
            'https://example.com/read-test.jpg'
        );
    });

    test('returns list of games', async () => {
        const response = await request(app)
            .get('/api/games');

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toEqual(
            expect.objectContaining({
                title: 'Read Test Game',
                genre: 'RPG',
                platform: 'PC',
                status: 'Backlog',
                rating: 9,
                release_year: 2025
            })
        )
    });
});

describe('GET /api/games/:id', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();

        db.prepare(`
            INSERT INTO games (
                title,
                description,
                genre,
                platform,
                status,
                rating,
                release_year,
                cover_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)   
        `).run(
            'Specific Read Test Game',
            'Game for specific READ test',
            'Action',
            'PC',
            'Playing',
            8,
            2024,
            'https://example.com/specific-read-test.jpg'
        );
    });

    test('returns a specific game by ID', async () => {
        const game = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE title = ?
            `)
            .get('Specific Read Test Game');

        const response = await request(app)
            .get(`/api/games/${game.id}`);

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual(
            expect.objectContaining({
                id: game.id,
                title: 'Specific Read Test Game',
                description: 'Game for specific READ test',
                genre: 'Action',
                platform: 'PC',
                status: 'Playing',
                rating: 8,
                release_year: 2024
            })
        );
    });

    test('returns 404 for non-existing game ID', async () => {
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
});