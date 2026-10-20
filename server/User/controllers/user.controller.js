const userModel = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EventEmitter = require('events');
const blacklisttokenModel = require("../Models/blacklisttoken.model");
const { subscribeToQueue } = require('../services/rabbit');

const rideEventEmitter = new EventEmitter();

module.exports.register = async (req, res) => {
    try {
        const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT_SECRET is not configured' });
        }

        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hash });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: '1h' });

        res.cookie('token', token);

        res.send({ token, newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret;
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        res.cookie('token', token);
        res.send({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            await blacklisttokenModel.create({ token });
        }
        res.clearCookie('token');
        res.send({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.acceptedRide = async (req, res) => {
    const onAccepted = (data) => {
        res.send(data);
        rideEventEmitter.removeListener('ride-accepted', onAccepted);
    };

    rideEventEmitter.once('ride-accepted', onAccepted);

    setTimeout(() => {
        rideEventEmitter.removeListener('ride-accepted', onAccepted);
        if (!res.headersSent) {
            res.status(204).send();
        }
    }, 30000);
};

subscribeToQueue('ride-accepted', (msg) => {
    try {
        const data = JSON.parse(msg);
        rideEventEmitter.emit('ride-accepted', data);
    } catch (error) {
        console.error('Failed to process accepted ride event', error.message);
    }
});