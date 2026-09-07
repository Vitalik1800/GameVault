const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('GET /api/games search', () => {
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
            'The Witcher 3: Wild Hunt',
            'Open-world RPG',
            'RPG',
            'PC',
            'Completed',
            10,
            2015,
            'https://example.com/witcher.jpg'
        );

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
            'Cyberpunk 2077',
            'Open-world action RPG',
            'Action-Adventure',
            'PC',
            'Playing',
            9,
            2020,
            'https://example.com/cyberpunk.jpg'
        );
    });

    test('finds games by witcher search query', async () => {
        const response = await request(app)
            .get('/api/games?q=witcher');

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toEqual(
            expect.objectContaining({
                title: 'The Witcher 3: Wild Hunt',
                genre: 'RPG',
                platform: 'PC'
            })
        );
    });

    test('finds games by cyber search query', async () => {
        const response = await request(app)
            .get('/api/games?q=cyber');

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toEqual(
            expect.objectContaining({
                title: 'Cyberpunk 2077',
                genre: 'Action-Adventure',
                platform: 'PC'
            })
        );
    });

    test('returns an empty array when no games match the search query', async () => {
        const response = await request(app)
            .get('/api/games?q=xyz');

        expect(response.statusCode).toBe(200);

        expect(response.headers['content-type'])
            .toMatch(/json/);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(0);
    });
});