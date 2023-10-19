function hasUser() {
    return (req, res, next) => {
        console.log('redirecting')
        if (req.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            res.redirect('/auth/login');
        } else {
            next();
        }
    };
}

module.exports = {
    hasUser, 
    isGuest
}