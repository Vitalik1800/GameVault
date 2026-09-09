const express = require('express');

const gameController = require('../controllers/gameController');

const validateId = require('../middleware/validateId');

const router = express.Router();

router.get('/stats', gameController.getStats);
router.get('/wishlist', gameController.getWishlistGames);

router.get('/', gameController.getAllGames);
router.post('/', gameController.createGame);

router.get('/:id', validateId, gameController.getGameById);
router.put('/:id', validateId, gameController.updateGame);
router.delete('/:id', validateId, gameController.deleteGame);

router.put(
    '/:id/wishlist',
    validateId,
    gameController.updateWishlist
);

module.exports = router;