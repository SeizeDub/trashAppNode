const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let adminToken = req.cookies.adminToken;
        let decodedToken = jwt.verify(adminToken, 'RANDOM_ADMIN_SECRET');
        if (decodedToken.loggedInAs !== 'admin') {
            throw 'Invalid';
        } else {
            next();
        }
    } catch {
        res.status(401).render('admin-login');
    }
};

