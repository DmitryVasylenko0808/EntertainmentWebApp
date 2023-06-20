const config = require('../config');
const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, config.secretKey);
            req.userId = decoded.id;

            next();
        }
        catch (error) {
            return res.status(403).json({ errorMessage: "Access denied" })
        }
    }
    else {
        return res.status(403).json({ errorMessage: "Access denied" })
    }
}

module.exports = checkAuth;