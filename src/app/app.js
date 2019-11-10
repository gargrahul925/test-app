const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('config');
const cors = require('cors');
const commonErrors = require('common-errors');

const router = require('./../router');

const { ResponseHandler } = require('./../lib/middlewares');
const { connectDb } = require('../models');


const createApp = async () => {
  const app = express();
  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(cors());
  app.use(compression());

  app.get('/', (_req, res) => {
    res.status(200).json({ message: 'NodeJS API' });
  });

  //  Mount routes
  app.use(config.get('api.BASE_URI'), router);


  // Add error handler and OkHandler middleware
  // after all other routes have been added
  app.use(ResponseHandler.Ok);
  app.use(ResponseHandler.Error);
  app.use(commonErrors.middleware.errorHandler);

  await connectDb();

  return app;
};
module.exports = { createApp };
