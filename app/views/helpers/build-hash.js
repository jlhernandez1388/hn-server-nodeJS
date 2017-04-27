const fs = require('fs');

let hash = 'dev';

if (process.env.NODE_ENV === 'production') {
  hash = fs.readFileSync('./build/HASH').toString();
}

module.exports = () => {
  return hash;
};
