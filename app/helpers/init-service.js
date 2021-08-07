/* eslint-disable linebreak-style */
const moduleAlias = require('module-alias');
const express = require('express');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');

const initAlias = () => {
  moduleAlias();
};

const withAlias =
  (cb) =>
  (...args) => {
    initAlias();
    return cb(...args);
  };

const expressInit = () => {
  const app = express();

  app.use(cors());

  const bodyParsers = [
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json({ type: ['application/json', 'text/plain'] }),
  ];

  app.use(bodyParsers, require('~routes'));
  app.use(require('~middlewares/catch-error'));

  console.log(chalk`{blue [Initialized] Express routes initialized}`);

  return app;
};

const runServer = (server) => {
  const { PORT } = process.env;
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      resolve();
    });
  });
};

const setMongooseConfig = () => {
  mongoose.set('useCreateIndex', true);
  mongoose.set('toJSON', { virtuals: true });
  mongoose.set('useFindAndModify', false);
};

const loadMongoosePlugins = () => {
  mongoose.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt: true,
    deletedBy: true,
  });

  mongoose.plugin((schema) => {
    const condition =
      typeof schema.options.userAudits === 'undefined' ||
      schema.options.userAudits;
    if (condition) {
      schema.add({
        createdBy: {
          type: 'ObjectId',
          ref: 'User',
          default: null,
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'User',
          default: null,
        },
      });
    }
  });

  mongoose.plugin((schema) => {
    schema.set('timestamps', true);
  });

  mongoose.plugin(mongoosePaginate);
};

const connectMongoose = () => {
  const { MONGODB_URL } = process.env;
  console.log(MONGODB_URL);
  return mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const mongooseInit = async () => {
  setMongooseConfig();
  loadMongoosePlugins();
  const mongooseCon = await connectMongoose();
  console.log(chalk`{blue [Initialized] Mongoose connection initialized}`);
  return mongooseCon;
};

const appInit = async () => {
  // initAlias();
  // Connect to mongo DB
  await mongooseInit();
  // Initialize express app
  const app = expressInit();
  // bullInit();
  await runServer(app);
  const { PORT, APP_NAME } = process.env;
  console.log(
    chalk`{green [Running] {bold ${APP_NAME}} on {bold http://localhost:${PORT}}}`
  );
};

module.exports = {
  mongooseInit: withAlias(mongooseInit),
  appInit: withAlias(appInit),
};
