const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('POST /api/games validation', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();
    });

    const validGame = {
        title: 'Validation Test Game',
        description: 'Test description',
        genre: 'Action',
        platform: 'PC',
        status: 'Backlog',
        rating: 8,
        release_year: 2026,
        cover_url: 'https://example.com/game.jpg'
    };

    const expectValidationError = async (gameData) => {
        const response = await request(app)
            .post('/api/games')
            .send(gameData);

        expect(response.statusCode).toBe(400);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: 'Validation failed',
                    details: expect.any(Array)
                })
            })
        );

        const games = db
            .prepare('SELECT * FROM games')
            .all();

        expect(games).toHaveLength(0);
    };

    test('rejects game without title', async () => {
        const gameData = {
            ...validGame,
            title: ''
        };

        await expectValidationError(gameData);
    });

    test('rejects game without genre', async () => {
        const gameData = {
            ...validGame,
            genre: ''
        };

        await expectValidationError(gameData);
    });

    test('rejects game without platform', async () => {
        const gameData = {
            ...validGame,
            platform: ''
        };

        await expectValidationError(gameData);
    });

    test('rejects game with invalid status', async () => {
        const gameData = {
            ...validGame,
            status: 'Invalid Status'
        };

        await expectValidationError(gameData);
    });

    test('rejects game with rating below 0', async () => {
        const gameData = {
            ...validGame,
            rating: -1
        };

        await expectValidationError(gameData);
    });

    test('rejects game with rating above 10', async () => {
        const gameData = {
            ...validGame,
            rating: 11
        };

        await expectValidationError(gameData);
    });

    test('rejects game with release year below 1950', async () => {
        const gameData = {
            ...validGame,
            release_year: 1949
        };

        await expectValidationError(gameData);
    });

    test('rejects game with invalid cover URL', async () => {
        const gameData = {
            ...validGame,
            cover_url: 'not-a-valid-url'
        };

        await expectValidationError(gameData);
    });
});