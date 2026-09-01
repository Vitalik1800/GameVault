const express = require('express');

const gameRoutes = require('./routes/gameRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'GameVault API is running'
    });
});

app.use('/api/games', gameRoutes);

app.use(errorHandler);

module.exports = app;