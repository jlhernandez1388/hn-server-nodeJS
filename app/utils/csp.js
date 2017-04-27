/* eslint-disable quotes */
const scriptSrc = ["'self'", 'https://www.google-analytics.com'];
const connectSrc = ["'self'"];

// Enable live reload in development
if (process.env.NODE_ENV !== 'production') {
  scriptSrc.push('data:');
  scriptSrc.push('http://localhost:35729');
  scriptSrc.push('http://0.0.0.0:35729');
  connectSrc.push('ws://localhost:35729');
  connectSrc.push('ws://0.0.0.0:35729');
}

module.exports = {
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'https://www.google-analytics.com'],
    scriptSrc,
    connectSrc
  }
};
