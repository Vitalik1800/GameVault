const db = require('../database/database');

const getAll = () => {
    return db.prepare(`
        SELECT * 
        FROM games
        ORDER BY id DESC 
    `).all();
};

const getById = (id) => {
    return db.prepare(`
        SELECT * 
        FROM games
        WHERE id = ?
    `).get(id);
};

const create = (game) => {
    const statement = db.prepare(`
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

    const result = statement.run(
        game.title,
        game.description,
        game.genre,
        game.platform,
        game.status,
        game.rating,
        game.release_year,
        game.cover_url
    );

    return getById(result.lastInsertRowid);
};

const update = (id, game) => {
    const statement = db.prepare(`
        UPDATE games
        SET
            title = ?,
            description = ?,
            genre = ?,
            platform = ?,
            status = ?,
            rating = ?,
            release_year = ?,
            cover_url = ?,
            created_at = CURRENT_TIMESTAMP
        WHERE id = ? 
    `);

    const result = statement.run(
        game.title,
        game.description,
        game.genre,
        game.platform,
        game.status,
        game.rating,
        game.release_year,
        game.cover_url,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getById(id);
};

const remove = (id) => {
    const statement = db.prepare(`
       DELETE FROM games
       WHERE id = ? 
    `);

    const result = statement.run(id);

    return result.changes > 0;
};

const search = (query) => {
    return db.prepare(`
        SELECT * 
        FROM games
        WHERE title LIKE ?
        OR genre LIKE ?
        OR platform LIKE ?
        ORDER BY id DESC
    `).all(
        `%${query}%`,
        `%${query}%`,
        `%${query}%`
    );
};

const filter = (filters) => {
    const conditions = [];
    const values = [];

    if (filters.status) {
        conditions.push('status = ?');
        values.push(filters.status);
    }

    if (filters.genre) {
        conditions.push('genre = ?');
        values.push(filters.genre);
    }

    if (filters.platform) {
        conditions.push('platform = ?');
        values.push(filters.platform);
    }

    if (filters.rating) {
        conditions.push('rating >= ?');
        values.push(filters.rating);
    }

    let query = `
        SELECT * 
        FROM games
    `;

    if (conditions.length > 0) {
        query += `
            WHERE ${conditions.join(' AND ')}
        `;
    }

    query += `
        ORDER BY id DESC
    `;

    return db.prepare(query).all(...values);
};

const getSorted = (sort = 'id', order = 'desc') => {
    const allowedColumns = {
        title: 'title',
        rating: 'rating',
        release_year: 'release_year',
        created_at: 'created_at',
        updated_at: 'updated_at'
    };

    const column = allowedColumns[sort] || 'id';
    const direction = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const query = `
        SELECT * 
        FROM games
        ORDER BY ${column} ${direction}
    `;

    return db.prepare(query).all();
};

const query = (params = {}) => {
    const conditions = [];
    const values = [];

    if (params.q) {
        conditions.push(`
            (
                title LIKE ?
                OR genre LIKE ?
                OR platform LIKE ?
            )
        `);

        const searchValue = `%${params.q}%`;

        values.push(
            searchValue,
            searchValue,
            searchValue
        );
    }

    if (params.status) {
        conditions.push('status = ?');
        values.push(params.status);
    }

    if (params.genre) {
        conditions.push('genre = ?');
        values.push(params.genre);
    }

    if (params.platform) {
        conditions.push('platform = ?');
        values.push(params.platform);
    }

    if (params.rating) {
        conditions.push('rating >= ?');
        values.push(Number(params.rating));
    }

    let sql = `
        SELECT * 
        FROM games
    `;

    if (conditions.length > 0) {
        sql += `
            WHERE ${conditions.join(' AND ')}
        `;
    }

    const allowedColumns = {
        title: 'title',
        rating: 'rating',
        release_year: 'release_year',
        created_at: 'created_at',
        updated_at: 'updated_at'
    };

    const column = allowedColumns[params.sort] || 'id';

    const direction = 
        params.order?.toLowerCase() === 'asc'
            ? 'ASC'
            : 'DESC';

    sql += `
        ORDER BY ${column} ${direction}
    `;

    return db.prepare(sql).all(...values);
};

const getStats = () => {
    const totalGames = db.prepare(`
        SELECT COUNT(*) AS count
        FROM games
    `).get();

    const averageRating = db.prepare(`
        SELECT AVG(rating) AS average
        FROM games
        WHERE rating IS NOT NULL
    `).get();

    const byStatus = db.prepare(`
        SELECT status, COUNT(*) AS count
        FROM games
        WHERE status IS NOT NULL
        GROUP BY status
    `).all();

    const byGenre = db.prepare(`
        SELECT genre, COUNT(*) AS count
        FROM games
        WHERE genre IS NOT NULL
        GROUP BY genre
    `).all();

    const byPlatform = db.prepare(`
        SELECT platform, COUNT(*) AS count
        FROM games
        WHERE platform IS NOT NULL
        GROUP BY platform
    `).all();

    return {
        totalGames: totalGames.count,
        averageRating: averageRating.average,
        byStatus,
        byGenre,
        byPlatform
    };
};

const getWishlist = () => {
    return db.prepare(`
        SELECT *
        FROM games
        WHERE is_wishlist = 1
        ORDER BY id DESC
    `).all();
};

const setWishlist = (id, isWishlist) => {
    const result = db.prepare(`
        UPDATE games
        SET is_wishlist = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        isWishlist ? 1 : 0,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getById(id);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    search,
    filter,
    getSorted,
    query,
    getStats,
    getWishlist,
    setWishlist
};