const gameService = require('../services/gameService');

const { validateGame } = require('../validators/gameValidator');

const getAllGames = (req, res) => {
    const {
        q,
        status,
        genre,
        platform,
        rating,
        sort,
        order
    } = req.query;

    const games = gameService.queryGames({
        q,
        status,
        genre,
        platform,
        rating,
        sort,
        order
    });

    res.status(200).json(games);
};

const getGameById = (req, res, next) => {
    try {
        const game = gameService.getGameById(req.params.id);

        if (!game) {
            return res.status(404).json({
                error: {
                    message: 'Game not found'
                }
            });
        }

        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
};

const createGame = (req, res, next) => {
    try {
        const errors = validateGame(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    details: errors
                }
            });
        }

        const game = gameService.createGame(req.body);
        
        res.status(201).json(game);
    } catch (error) {
        next(error);
    }
}

const updateGame = (req, res, next) => {
    try {
        const errors = validateGame(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    details: errors
                }
            });
        }

        const game = gameService.updateGame(
            req.params.id,
            req.body
        );

        if (!game) {
            return res.status(404).json({
                error: {
                    message: 'Game not found'
                }
            });
        }
        
        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
}

const deleteGame = (req, res, next) => {
    try {
        const deleted = gameService.deleteGame(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                error: {
                    message: 'Game not found'
                }
            });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const getStats = (req, res) => {
    const stats = gameService.getStats();

    res.status(200).json(stats);
}

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getAllGames,
    getStats
};