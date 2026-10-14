const dotenv = require('dotenv');
dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET || process.env.jwt_secret;
const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const connect = require('./db/db');


connect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoutes);

module.exports = app;