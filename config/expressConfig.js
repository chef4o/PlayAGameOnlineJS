const express = require('express');
const handlebars = require('express-handlebars');
const hbsCore = require('handlebars');
const hbsHelpers = require('../util/hbsHelpers');
const cookieParser = require('cookie-parser');
const session = require('../middlewares/session');
const trimBody = require('../middlewares/trimBody');
const defaultTitle = require('../middlewares/defaultTitle');


module.exports = (app) => {
    const hbs = handlebars.create({
        extname: '.hbs'
    });

    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');
    hbsCore.registerHelper(hbsHelpers);

    app.use(defaultTitle('Play @ Game Online'));
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session());
    app.use(trimBody('password')); //excludedKeys set for password in trimBody.js
};