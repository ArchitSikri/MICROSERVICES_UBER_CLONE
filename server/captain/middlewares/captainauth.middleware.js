const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.model');
const blacklisttokenModel = require('../models/blacklistedtoken.model');

module.exports.captainAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const bearerToken = authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : undefined;
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
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            throw error;
        }
        const captain = await captainModel.findById(decoded.id);

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.captain = captain;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
