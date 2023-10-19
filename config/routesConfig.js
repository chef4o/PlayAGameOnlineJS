const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const catalogController = require("../controllers/catalogController");
const notFoundController = require("../controllers/notFoundController");
const gameController = require("../controllers/gameController");
const adminController = require("../controllers/adminController");
const { hasUser, isGuest } = require("../middlewares/guards");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/catalog', catalogController);
    app.use('/games', hasUser(), gameController);
    app.use('/admin-panel', adminController);

    app.all('*', notFoundController);
};