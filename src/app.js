const express = require('express');

const db = require('./database/database');

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'GameVault API is running'
    });
});

module.exports = app;