const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const catalogController = require("../controllers/catalogController");
const notFoundController = require("../controllers/notFoundController");
const gameController = require("../controllers/gameController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/catalog', catalogController);
    app.use('/games', gameController);

    app.all('*', notFoundController);
};