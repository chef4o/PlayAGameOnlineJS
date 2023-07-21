const { getGameByName } = require('../services/gameService');

const gameController = require('express').Router();

gameController.get('/:name', async (req, res) => {

    const gameName = req.params.name;
    const game = await getGameByName(gameName);

    if (game) {
        res.render('gameZone', {
            title: 'PL@Y ' + gameName,
            user: req.user,
            game
        });
    } else {
        res.render('404', {
            title: 'Game Not Found',
            user: req.user,
            gameName       
        });
    }
});

module.exports = gameController;