const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const validator = require('validator');
const authController = require('express').Router();

const MISSING_FIELDS_DATA = 'All fields are required';
const INVALID_EMAIL = 'Email address is invalid';
const PASSWORDS_MISMATCH = 'Passwords do not match';

authController.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register with P@GO'
    });
});

authController.post('/register', async (req, res) => {
    try {
        if (validator.isEmail(req.body.email) == false) {
            throw new Error(INVALID_EMAIL);
        }
        if (req.body.email.trim() == '' 
            || req.body.username.trim() == '' 
            || req.body.pass.trim() == ''
            || req.body.firstName.trim() == '') {
            throw new Error(MISSING_FIELDS_DATA);
        }
        if (req.body.pass != req.body.re-pass) {
            throw new Error(PASSWORDS_MISMATCH);
        }

        const token = await register(req.body.email, req.body.username, req.body.pass);

        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);

        //TODO add error display to the actual template ({{#if errors}} -> div {{#each errors}}...)
        res.render('register', { 
            title: 'Register Page',
            errors,
            body: {
                email: req.body.email,
                username: req.body.username
            }
        });
    }
});

authController.get('/login', (req, res) => {
    res.render('login', { 
        title: 'P@GO Login Page'
    });
});

authController.post('/login', async (req, res) => {
    try {
        if (req.body.email.trim() == '' 
            || req.body.pass.trim() == '') {
            throw new Error(MISSING_FIELDS_DATA);
        }

        const token = await login(req.body.username, req.body.pass);
        
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);

        //TODO add error display to the actual template ({{#if errors}} -> div {{#each errors}}...)
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                email: req.body.email,
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = authController;