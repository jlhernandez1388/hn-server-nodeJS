const MongoAdapter = require('./adapters/mongodb');
const MongoModelFactory = require('./adapters/mongodb/model');
const StoryModel = require('./story');
const CommentModel = require('./comment');
const UserModel = require('./user');

const Adapter = MongoAdapter({
  url: process.env.DATABASE_URL,
  connectionOptions: {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  }
});

const Model = MongoModelFactory(Adapter);

module.exports = {
  Adapter,
  Model,

  Story: StoryModel(Model),
  Comment: CommentModel(Model),
  User: UserModel(Model)
};
