const express = require('express');

const gameController = require('../controllers/gameController');
const validateId = require('../middleware/validateId');

const router = express.Router();

router.get('/stats', gameController.getStats);

router.get('/', gameController.getAllGames);

router.get('/:id', validateId, gameController.getGameById);

router.post('/', gameController.createGame);

router.put('/:id', validateId, gameController.updateGame);

router.delete('/:id', validateId, gameController.deleteGame);

module.exports = router;