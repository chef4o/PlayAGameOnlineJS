const { getTopFiveByRatingDescAndDateDesc } = require('../services/gameService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {

    const topGames = await getTopFiveByRatingDescAndDateDesc();

    res.render('home', {
        user: req.user,
        topGames
    });
})

module.exports = homeController;