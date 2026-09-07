const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('DELETE /api/games/:id', () => {
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
            'Delete Test Game',
            'Game for DELETE test',
            'Action',
            'PC',
            'Backlog',
            7,
            2023,
            'https://example.com/delete-test.jpg'
        );
    });

    test('deletes an existing game successfully', async () => {
        const game = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE title = ? 
            `)
            .get('Delete Test Game');

        expect(game).toBeDefined();

        const response = await request(app)
            .delete(`/api/games/${game.id}`);

        expect(response.statusCode).toBe(204);

        const gameFromDatabase = db
            .prepare(`
                SELECT * 
                FROM games
                WHERE id = ?
            `)
            .get(game.id);

        expect(gameFromDatabase).toBeUndefined();
    });

    test('returns 404 for non-existing game ID', async () => {
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