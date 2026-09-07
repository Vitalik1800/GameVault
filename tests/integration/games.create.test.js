const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('POST /api/games', () => {
    test('creates a new game successfully', async () => {
        const gameData = {
            title: 'Test Game',
            description: 'Test game description',
            genre: 'Action',
            platform: 'PC',
            status: 'Backlog',
            rating: 8,
            release_year: 2026,
            cover_url: 'https://example.com/test-game.jpg'
        };

        const response = await request(app)
            .post('/api/games')
            .send(gameData);

        expect(response.statusCode).toBe(201);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: gameData.title,
                description: gameData.description,
                genre: gameData.genre,
                platform: gameData.platform,
                status: gameData.status,
                rating: gameData.rating,
                release_year: gameData.release_year,
                cover_url: gameData.cover_url
            })
        );

        const gameFromDatabase = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE id = ? 
            `)
            .get(response.body.id);

        expect(gameFromDatabase).toBeDefined();

        expect(gameFromDatabase.title)
            .toBe(gameData.title);

        expect(gameFromDatabase.description)
            .toBe(gameData.description);

        expect(gameFromDatabase.genre)
            .toBe(gameData.genre);

        expect(gameFromDatabase.platform)
            .toBe(gameData.platform);

        expect(gameFromDatabase.status)
            .toBe(gameData.status);

        expect(gameFromDatabase.rating)
            .toBe(gameData.rating);

        expect(gameFromDatabase.release_year)
            .toBe(gameData.release_year);

        expect(gameFromDatabase.cover_url)
            .toBe(gameData.cover_url);
    });
});