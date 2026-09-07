const ALLOWED_STATUSES = [
    'Backlog',
    'Playing',
    'Completed',
    'Dropped'
];

const validateGame = (game) => {
    const errors = [];

    if (!game.title || typeof game.title !== 'string' || !game.title.trim()) {
        errors.push('title is required');
    }

    if (!game.genre || typeof game.genre !== 'string' || !game.genre.trim()) {
        errors.push('genre is required');
    }

    if (!game.platform || typeof game.platform !== 'string' || !game.platform.trim()) {
        errors.push('platform is required');
    }

    if (!game.status) {
        errors.push('status is required');
    } else if (!ALLOWED_STATUSES.includes(game.status)) {
        errors.push(
            `status must be one of: ${ALLOWED_STATUSES.join(', ')}`
        );
    }

    if (game.rating !== undefined && game.rating !== null) {
        if (
            typeof game.rating !== 'number' ||
            game.rating < 0 ||
            game.rating > 10
        ) {
            errors.push('rating must be between 0 and 10');
        }
    }

    if (game.release_year === undefined || game.release_year === null) {
        errors.push('release_year is required');
    } else if(
        !Number.isInteger(game.release_year) ||
        game.release_year < 1950 ||
        game.release_year > new Date().getFullYear()
    ) {
        errors.push('release_year is invalid');
    }

    if (
        game.description !== undefined &&
        game.description !== null &&
        typeof game.description !== 'string'
    ) {
        errors.push('description must be a string');
    }

    if (
        game.cover_url !== undefined &&
        game.cover_url !== null
    ) {
        if (typeof game.cover_url !== 'string') {
            errors.push('cover_url must be a string');
        } else {
            try {
                new URL(game.cover_url);
            } catch {
                errors.push('cover_url must be a valid URL');
            }
        }
    }

    return errors;
};

module.exports = {
    validateGame
};