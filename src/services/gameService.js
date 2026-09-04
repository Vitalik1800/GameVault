const gameRepository = require('../repositories/gameRepository');

const getAllGames = () => {
    return gameRepository.getAll();
};

const getGameById = (id) => {
    return gameRepository.getById(id);
};

const createGame = (game) => {
    return gameRepository.create(game);
};

const updateGame = (id, game) => {
    return gameRepository.update(id, game);
};

const deleteGame = (id) => {
    return gameRepository.remove(id);
};

const searchGames = (query) => {
    return gameRepository.search(query);
};

const filterGames = (filters) => {
    return gameRepository.filter(filters);
};

const sortGames = (sort, order) => {
    return gameRepository.getSorted(sort, order);
};

const queryGames = (params) => {
    return gameRepository.query(params);
}

const getStats = () => {
    const stats = gameRepository.getStats();

    return {
        totalGames: stats.totalGames,
        averageRating: stats.averageRating !== null
            ? Number(stats.averageRating.toFixed(2))
            : null,
        byStatus: Object.fromEntries(
            stats.byStatus.map(item => [
                item.status,
                item.count
            ])
        ),
        byGenre: Object.fromEntries(
            stats.byGenre.map(item => [
                item.genre,
                item.count
            ])
        ),
        byPlatform: Object.fromEntries(
            stats.byPlatform.map(item => [
                item.platform,
                item.count
            ])
        )
    };
};

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    searchGames,
    filterGames,
    sortGames,
    queryGames,
    getStats
};