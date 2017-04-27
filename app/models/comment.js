function CommentModel(model) {
  const methods = {
    toJSON: (comment) => {

      return {
        data: {
          attributes: {
            'created-at': comment.createdAt,
            text: comment.text,
            user: comment.user || null
          },
          id: comment._id,
          relationships: {
            users: {
              data: comment.user
            },
            stories: {
              data: comment.stories
            }
          },
          type: 'stories'
        }
      };
    }
  };
  return model('CommentModel', methods);
}

module.exports = CommentModel;
