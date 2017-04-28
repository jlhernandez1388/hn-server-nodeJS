const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const { Story, Comments, User } = require('../models');
const router = express.Router();

router.get('/stories', (req, res) => {
  Story.find({}, { sort: { createdAt: -1 } })
  .then((stories) => {
    const data = stories.map((r) => Story.toJSON(r));
    if (data) {
      res.json({ data });
    } else {
      res.status(404).send('Not found!');
    }
  });
});

router.get('/stories/:id', (req, res) => {
  Story.findById(req.params.id)
    .then((story) => {
      if (story) {
        res.json(Story.toJSON(story));
      } else {
        res.status(404).send('Not found');
      }
    });
});

router.post('/stories', (req, res) => {
  const storyData = {
    url: req.body.attributes.url,
    title: req.body.attributes.title,
    'created-at': new Date(),
    user: req.body.attributes.user,
    votes: 0
  };
  if (storyData.url !== null &&
      storyData.title !== null &&
      storyData.user !== null &&
      storyData.votes !== null) {
    Story.create(storyData)
      .then(() => {
        res.status(202).json({});
      });
  }
});

router.post('/comments', (req, res) => {
  const comment = {
    _id: new ObjectId(),
    text: req.body.attributes.text,
    user: req.body.attributes.user
  };
  Comments.create(comment)
    .then(() => {
      Story.findById(req.body.relationships.story.data.id)
        .then((story) => {
          if (story.comments) {
            story.comments.push(comment);
          } else {
            story.comments = [comment];
          }
          Story.updateById(req.body.relationships.story.data.id, story)
          .then(() => {
            res.status(200).json({});
          });
        });
    });
});

router.get('/comments/:id', (req, res) => {
  Comments.findById(req.params.id)
  .then((comment) => {
    if (comment) {
      res.json(Comments.toJSON(comment));
    } else {
      res.status(404).send('Not Found!');
    }
  });
});

router.post('/users/', (req, res) => {
  if (!req.body.attributes.user) {
    res.status(400).send('User Required');
    return;
  }
  if (!req.body.attributes.password) {
    res.status(400).send('Password Required');
    return;
  }
  const salt = crypto.randomBytes(48).toString('hex');
  const hash = crypto.pbkdf2Sync(
    req.body.attributes.password,
    salt,
    100000,
    512,
    'sha512').toString('hex');

  const userData = {
    user: req.body.attributes.user,
    hash: hash,
    salt: salt
  };

  User.create(userData)
    .then(() => {
      res.status(200).json({});
    });
});

router.post('/users/authenticate', (req, res) => {
  if (!req.body.attributes.user) {
    res.status(400).send('User Required');
    return;
  }
  if (!req.body.attributes.password) {
    res.status(400).send('Password Required');
    return;
  }
  User.findOne({ user: req.body.attributes.user })
  .then((user) => {
    if (user) {
      const hash = crypto.pbkdf2Sync(
      req.body.attributes.password,
      user.salt,
      100000,
      512,
      'sha512').toString('hex');

      User.count({ user: req.body.attributes.user, hash: hash })
      .then((c) => {
        if (c === 1) {
          const token = jwt.sign({
            user: req.body.attributes.user }, process.env.JWT_SECRET);
          res.status(200).json(token);
        } else {
          res.status(401).send('Invalid Login');
        }
      });
    } else {
      res.status(401).send('Invalid Login');
    }
  });

});

module.exports = router;
