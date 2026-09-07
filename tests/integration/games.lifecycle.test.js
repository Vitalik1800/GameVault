const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('Game lifecycle', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();
    });

    test('creates, reads, updates, reads, deletes and confirms deletion', async () => {
        // POST - create
        const gameData = {
            title: 'Lifecycle Test Game',
            description: 'Game lifecycle test',
            genre: 'Action',
            platform: 'PC',
            status: 'Backlog',
            rating: 8,
            release_year: 2026,
            cover_url: 'https://example.com/lifecycle.jpg'
        };

        const createResponse = await request(app)
            .post('/api/games')
            .send(gameData);

        expect(createResponse.statusCode).toBe(201);

        expect(createResponse.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: gameData.title,
                genre: gameData.genre,
                platform: gameData.platform,
                status: gameData.status,
                rating: gameData.rating,
                release_year: gameData.release_year,
                cover_url: gameData.cover_url
            })
        );

        const gameId = createResponse.body.id;

        // GET - read created game
        const getResponse = await request(app)
            .get(`/api/games/${gameId}`);

        expect(getResponse.statusCode).toBe(200);

        expect(getResponse.body).toEqual(
            expect.objectContaining({
                id: gameId,
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

        // PUT - update game
        const updatedGame = {
            title: 'Updated Lifecycle Game',
            description: 'Updated lifecycle description',
            genre: 'RPG',
            platform: 'PC',
            status: 'Playing',
            rating: 9,
            release_year: 2025,
            cover_url: 'https://example.com/updated-lifecycle.jpg'
        };

        const updateResponse = await request(app)
            .put(`/api/games/${gameId}`)
            .send(updatedGame);

        expect(updateResponse.statusCode).toBe(200);

        expect(updateResponse.body).toEqual(
            expect.objectContaining({
                id: gameId,
                title: updatedGame.title,
                description: updatedGame.description,
                genre: updatedGame.genre,
                platform: updatedGame.platform,
                status: updatedGame.status,
                rating: updatedGame.rating,
                release_year: updatedGame.release_year,
                cover_url: updatedGame.cover_url
            })
        );

        // GET - verify updated game
        const getUpdatedResponse = await request(app)
            .get(`/api/games/${gameId}`);

        expect(getUpdatedResponse.statusCode).toBe(200);

        expect(getUpdatedResponse.body).toEqual(
            expect.objectContaining({
                id: gameId,
                title: updatedGame.title,
                description: updatedGame.description,
                genre: updatedGame.genre,
                platform: updatedGame.platform,
                status: updatedGame.status,
                rating: updatedGame.rating,
                release_year: updatedGame.release_year,
                cover_url: updatedGame.cover_url
            })
        );

        // DELETE - delete game
        const deleteResponse = await request(app)
            .delete(`/api/games/${gameId}`);

        expect(deleteResponse.statusCode).toBe(204);

        // GET - confirm deletion
        const getDeletedResponse = await request(app)
            .get(`/api/games/${gameId}`);

        expect(getDeletedResponse.statusCode).toBe(404);

        expect(getDeletedResponse.body).toEqual({
            error: {
                message: 'Game not found'
            }
        });

        // Verify database is also empty
        const gameFromDatabase = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE id = ?
            `)
            .get(gameId);

        expect(gameFromDatabase).toBeUndefined();
    });
})