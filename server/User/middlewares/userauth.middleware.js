const jwt = require('jsonwebtoken');
const userModel = require('../Models/user.model');
const blacklisttokenModel = require('../Models/blacklisttoken.model');

module.exports.userAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const bearerToken = authorization && authorization.startsWith('Bearer ') ? authorization.slice(7) : undefined;
        const token = req.cookies?.token || bearerToken;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklisttokenModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};