const fs = require('fs');
const marked = require('marked');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const readme = marked(fs.readFileSync('./README.md').toString());
  res.render('index', { title: 'Hello, World!', readme });
});

module.exports = router;
