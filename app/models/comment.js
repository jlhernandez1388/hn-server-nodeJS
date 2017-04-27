function CommentModel(model) {
  const methods = {
    toJSON: (comment) => {

      return {
        id: comment._id,
        type: 'comments',
        attributes: {
          text: comment.url,
          'created-at': comment.createdAt,
          user: comment.user
        },
        relationships: {
          story: {
            data: {
              id: comment.story.id,
              type: 'stories'
            }
          }
        }
      };
    }
  };
  return model('StoryModel', methods);
}

module.exports = CommentModel;
