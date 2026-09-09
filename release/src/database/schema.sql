CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    description TEXT,

    genre TEXT NOT NULL,

    platform TEXT NOT NULL,

    status TEXT NOT NULL
        CHECK (status IN ('Backlog', 'Playing', 'Completed', 'Dropped')),

    rating INTEGER
        CHECK (rating IS NULL OR rating BETWEEN 1 AND 10),

    release_year INTEGER
        CHECK (release_year IS NULL OR release_year BETWEEN 1950 AND 2100),

    cover_url TEXT,

    is_wishlist INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);