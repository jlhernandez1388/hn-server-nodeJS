const winston = require('winston');
const expressWinston = require('express-winston');

const loggerConfig = {
  transports: [new winston.transports.Console({ colorize: true })],
  expressFormat: true,
  meta: false,
  colorize: true
};

exports.expressLogger = expressWinston.logger(loggerConfig);
