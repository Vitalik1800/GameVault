const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('GET /api/games sorting', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM games').run();

        const insertGame = db.prepare(`
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
        `);

        insertGame.run(
            'Cyberpunk 2077',
            'Open-world action RPG',
            'Action-Adventure',
            'PC',
            'Playing',
            9,
            2020,
            'https://example.com/cyberpunk.jpg'
        );

        insertGame.run(
            'The Witcher 3: Wild Hunt',
            'Open-world RPG',
            'RPG',
            'PC',
            'Completed',
            10,
            2015,
            'https://example.com/witcher.jpg'
        );

        insertGame.run(
            'Minecraft',
            'Sandbox game',
            'Sandbox',
            'PC',
            'Playing',
            8,
            2011,
            'https://example.com/minecraft.jpg'
        );

        insertGame.run(
            'Red Dead Redemption 2',
            'Open-world western',
            'Action-Adventure',
            'PC',
            'Completed',
            10,
            2018,
            'https://example.com/rdr2.jpg'
        );
    });

    test('sorts games by title ASC', async () => {
        const response = await request(app)
            .get('/api/games?sort=title&order=asc');

        expect(response.statusCode).toBe(200);

        expect(response.body.map(game => game.title))
            .toEqual([
                'Cyberpunk 2077',
                'Minecraft',
                'Red Dead Redemption 2',
                'The Witcher 3: Wild Hunt'
            ]);
    });

    test('sorts games by title DESC', async () => {
        const response = await request(app)
            .get('/api/games?sort=title&order=desc');

        expect(response.statusCode).toBe(200);

        expect(response.body.map(game => game.title))
            .toEqual([
                'The Witcher 3: Wild Hunt',
                'Red Dead Redemption 2',
                'Minecraft',
                'Cyberpunk 2077'
            ]);
    });

    test('sorts games by rating ASC', async () => {
        const response = await request(app)
            .get('/api/games?sort=rating&order=asc');

        expect(response.statusCode).toBe(200);

        expect(response.body.map(game => game.rating))
            .toEqual([
                8,
                9,
                10,
                10
            ]);
    });

    test('sorts games by rating DESC', async () => {
        const response = await request(app)
            .get('/api/games?sort=rating&order=desc');

        expect(response.statusCode).toBe(200);

        expect(response.body.map(game => game.rating))
            .toEqual([
                10,
                10,
                9,
                8
            ]);
    });

    test('sorts games by release year ASC', async () => {
        const response = await request(app)
            .get('/api/games?sort=release_year&order=asc');

        expect(response.statusCode).toBe(200);

        expect(response.body.map(game => game.release_year))
            .toEqual([
                2011,
                2015,
                2018,
                2020
            ]);
    });

    test('sorts games by release year DESC', async () => {
        const response = await request(app)
            .get('/api/games?sort=release_year&order=desc');

        expect(response.statusCode).toBe(200);

        expect(response.body.map(game => game.release_year))
            .toEqual([
                2020,
                2018,
                2015,
                2011
            ]);
    });
});