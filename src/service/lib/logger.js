"use strict";

const pino = require(`pino`);

const {Env} = require(`../../constants`);

const LOG_FILE = `./logs/api.log`;
const isProdMode = process.env.NODE_ENV === Env.PRODUCTION;
const logLevel = process.env.LOG_LEVEL || (isProdMode ? `error` : `info`);

const prodOptions = {
  transport: {
    target: `pino/file`,
    options: {
      destination: LOG_FILE
    }
  }
};

const logger = pino({
  name: `base-logger`,
  level: logLevel,
  ...(isProdMode && prodOptions)
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
