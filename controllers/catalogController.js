const { getAllGames } = require('../services/gameService');

const catalogController = require('express').Router();

catalogController.get('/', async (req, res) => {

    const games = await getAllGames();

    res.render('catalog', {
        title: 'P@GO Catalog',
        user: req.user,
        games
    });
})

module.exports = catalogController;