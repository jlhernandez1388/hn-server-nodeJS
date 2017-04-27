function StoryModel(model) {
  const methods = {
    toJSON: (story) => {

      return {
        data: {
          attributes: {
            'created-at': story.createdAt,
            title: story.title,
            url: story.url,
            user: story.user || null,
            votes: story.votes
          },
          id: story._id,
          relationships: {
            comments: {
              data: story.comments
            }
          },
          type: 'stories'
        }
      };
    }
  };
  return model('StoryModel', methods);
}

module.exports = StoryModel;
