const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers['x-access-token'];

        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.accessTokenPayload = decoded;
        next();
    } catch (err) {
        return res.status(400).json("Tai khoan khong hop le");
    }
}