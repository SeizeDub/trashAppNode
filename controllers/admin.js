const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    if (req.body === 'adminpassword') {
        let adminToken = jwt.sign({ loggedInAs: 'admin' },'RANDOM_ADMIN_SECRET',
        { expiresIn: 86400 });
        res.cookie('adminToken', adminToken, { maxAge: 86400 * 1000, httpOnly: true });
        res.status(200).json({message: 'success'});
    } else {
        res.status(400).json({message: 'invalid'});
    }
}