const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database/database');

describe('GET /api/games filters', () => {
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
            'Cyberpunl 2077',
            'Open-world action RPG',
            'Action-Adventure',
            'PC',
            'Playing',
            9,
            2020,
            'https://example.com/cyberpunk.jpg'
        );

        insertGame.run(
            'Red Dead Redemption 2',
            'Open-world western',
            'Action-Adventure',
            'PC',
            'Completed',
            10,
            2018,
            'https://example.com/rd2.jpg'
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
            'God of War',
            'Action adventure game',
            'Action-Adventure',
            'PlayStation',
            'Completed',
            9,
            2018,
            'https://example.com/god-of-war.jpg'
        );
    });

    test('filters games by status', async () => {
        const response = await request(app)
            .get('/api/games?status=Completed');

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(3);

        response.body.forEach((game) => {
            expect(game.status).toBe('Completed');
        });
    });

    test('filters games by genre', async () => {
        const response = await request(app)
            .get('/api/games?genre=RPG');

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(1);

        expect(response.body[0].title)
            .toBe('The Witcher 3: Wild Hunt');

        expect(response.body[0].genre)
            .toBe('RPG');
    });

    test('filters games by platform', async () => {
        const response = await request(app)
            .get('/api/games?platform=PlayStation');

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(1);

        expect(response.body[0].title)
            .toBe('God of War');

        expect(response.body[0].platform)
            .toBe('PlayStation');
    });

    test('filters games by minimum rating', async () => {
        const response = await request(app)
            .get('/api/games?rating=10');

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(response.body).toHaveLength(2);

        response.body.forEach((game) => {
            expect(game.rating)
                .toBeGreaterThanOrEqual(10);
        });
    });

    test('combines status and genre filters', async () => {
        const response = await request(app)
            .get(
                '/api/games?status=Completed&genre=Action-Adventure'
            );

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(2);

        response.body.forEach((game) => {
            expect(game.status)
                .toBe('Completed');

            expect(game.genre)
                .toBe('Action-Adventure')
        });
    });

    test('combines status and platform filters', async () => {
        const response = await request(app)
            .get(
                '/api/games?status=Playing&platform=PC'
            );

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(2);

        response.body.forEach((game) => {
            expect(game.status)
                .toBe('Playing');
                
            expect(game.platform)
                .toBe('PC');
        });
    });

    test('combines genre and platform filters', async () => {
        const response = await request(app)
            .get(
                '/api/games?genre=Action-Adventure&platform=PC'
            );

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(2);

        response.body.forEach((game) => {
            expect(game.genre)
                .toBe('Action-Adventure');

            expect(game.platform)
                .toBe('PC');
        });
    });

    test('combines status, genre, and platform filters', async () => {
        const response = await request(app)
            .get(
                '/api/games?status=Completed&genre=Action-Adventure&platform=PC'
            );

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toEqual(
            expect.objectContaining({
                title: 'Red Dead Redemption 2',
                status: 'Completed',
                genre: 'Action-Adventure',
                platform: 'PC'
            })
        );
    });

    test('combines status and rating filters', async () => {
        const response = await request(app)
            .get(
                '/api/games?status=Completed&rating=10'
            );

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(2);

        response.body.forEach((game) => {
            expect(game.status)
                .toBe('Completed');

            expect(game.rating)
                .toBeGreaterThanOrEqual(10);
        });
    });
});