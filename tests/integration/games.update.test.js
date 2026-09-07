const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('PUT /api/games/:id', () => {
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
            'Original Game',
            'Original description',
            'Action',
            'PC',
            'Backlog',
            7,
            2023,
            'https://example.com/original.jpg'
        );
    });

    test('updates an existing game successfully', async () => {
        const game = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE title = ?
            `)
            .get('Original Game');

        const updatedGameData = {
            title: 'Updated Game',
            description: 'Updated description',
            genre: 'RPG',
            platform: 'PC',
            status: 'Completed',
            rating: 10,
            release_year: 2024,
            cover_url: 'https://example.com/updated.jpg'
        };

        const response = await request(app)
            .put(`/api/games/${game.id}`)
            .send(updatedGameData);

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(response.body).toEqual(
            expect.objectContaining({
                id: game.id,
                title: updatedGameData.title,
                description: updatedGameData.description,
                genre: updatedGameData.genre,
                platform: updatedGameData.platform,
                status: updatedGameData.status,
                rating: updatedGameData.rating,
                release_year: updatedGameData.release_year,
                cover_url: updatedGameData.cover_url
            })
        );

        const gameFromDatabase = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE id = ?
            `)
            .get(game.id);

        expect(gameFromDatabase).toBeDefined();

        expect(gameFromDatabase.title)
            .toBe(updatedGameData.title);

        expect(gameFromDatabase.description)
            .toBe(updatedGameData.description);

        expect(gameFromDatabase.genre)
            .toBe(updatedGameData.genre);

        expect(gameFromDatabase.platform)
            .toBe(updatedGameData.platform);

        expect(gameFromDatabase.status)
            .toBe(updatedGameData.status);

        expect(gameFromDatabase.rating)
            .toBe(updatedGameData.rating);

        expect(gameFromDatabase.release_year)
            .toBe(updatedGameData.release_year);

        expect(gameFromDatabase.cover_url)
            .toBe(updatedGameData.cover_url);
    });

    test('returns 404 for non-existing game ID', async () => {
        const updatedGameData = {
            title: 'Updated Game',
            description: 'Updated description',
            genre: 'RPG',
            platform: 'PC',
            status: 'Completed',
            rating: 10,
            release_year: 2024,
            cover_url: 'https://example.com/updated.jpg'
        };

        const response = await request(app)
            .put('/api/games/999999')
            .send(updatedGameData);

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