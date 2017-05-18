require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const exphbs = require('express-handlebars');
const livereload = require('connect-livereload');
const expressJWT = require('express-jwt');


const cspConfig = require('./utils/csp');
const { expressLogger } = require('./utils/logging');
const helpers = require('./views/helpers');
const mainRouter = require('./routes/index');

const port = process.env.PORT || 5000;
const server = express();

// Logger
server.use(expressLogger);

// Secure app
server.use(helmet());
server.use(helmet.contentSecurityPolicy(cspConfig));

// Compression middleware (deflate, gzip)
server.use(compression());

// livereload
if (process.env.NODE_ENV !== 'production') {
  server.use(livereload());
}

// Static files middleware
server.use('/public', express.static(
  path.resolve(__dirname, '../build/public'))
);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(expressJWT({ secret: (process.env.JWT_SECRET ||
  'zxfar[w]fhidPe8vJWJfMKt{kDB7eoBnuxCP6CNbGyXfguMDfR{H4fVz8PurYH=V') })
  .unless({ path: ['/', '/api/v1/users', '/api/v1/users/authenticate'] }));

// views engine
server.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'base',
  layoutsDir: './app/views/layouts',
  partialsDir: './app/views/partials',
  helpers: helpers
}));
server.set('view engine', '.hbs');
server.set('views', './app/views');

// mount main router
server.use(mainRouter);
server.use('/api/v1', require('./routes/api'));
// start server
server.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Express app started on http://0.0.0.0:${port}`);
  }
});

module.exports = server;
