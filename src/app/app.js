const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('config');
const cors = require('cors');

const router = require('./../router');

const { responseHandler, } = require('./../lib/middlewares');
const { connectDb } = require('../models');


const createApp = async () => {
    const app = express();
    app.use(bodyParser.json({ limit: '50mb', }));

    app.use(cors());
    app.use(compression());

    app.get('/', (_req, res) => {
        res.status(200).json({ message: 'NodeJS API', });
    });

    //  Mount routes
    app.use(config.get('api.BASE_URI'), router);


    // Add error handler and OkHandler middleware
    // after all other routes have been added
    app.use(responseHandler.OkHandler);
    app.use(responseHandler.ErrorHandler);

    await connectDb();

    return app;
};
module.exports = { createApp, };
