function UserModel(model) {
  const methods = {
    toJSON: (user) => {

      return {
        data: {
          attributes: {
            'created-at': user.createdAt,
            user: user.user
          },
          id: user._id,
          relationships: {
            comments: {
              data: user.comments
            },
            stories: {
              data: user.stories
            }
          },
          type: 'users'
        }
      };
    }
  };
  return model('UserModel', methods);
}

module.exports = UserModel;
