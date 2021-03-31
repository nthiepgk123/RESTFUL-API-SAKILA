const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, 'password');
        console.log(decoded);
        next();
    } catch (err) {
        res.json("Tai khoan khong hop le");
    }
    next();
}