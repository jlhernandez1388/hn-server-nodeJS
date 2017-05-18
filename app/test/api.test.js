const request = require('supertest');
const app = require('../index');


describe('POST /authenticate', function () {
  it('Authenticates the user.', function(done) {
    request(app).post('/api/v1/users/authenticate')
    .set('accept', 'application/json')
    .send({ type: 'users',
      attributes: {
        user: 'newuser',
        password: 'newhash'
      },
      relationships: {
        story: {
          data: {
          }
        }
      }
    })
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET /stories', function () {
  it('Gets all stories.', function(done) {
    request(app).get('/api/v1/stories')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmV3dXNlciIsImlhdCI6MTQ5NTA4MTAzOH0.iv67LqiPlb1Y8SyX92bFKB1sStYdkuQPW0qpvPYg11g')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET /stories/:id', function () {
  it('Gets a story by its ID.', function(done) {
    request(app).get('/api/v1/stories/58ffc2c44ac28c499d676c93')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmV3dXNlciIsImlhdCI6MTQ5NTA4MTAzOH0.iv67LqiPlb1Y8SyX92bFKB1sStYdkuQPW0qpvPYg11g')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET /comments/:id', function () {
  it('Gets a comment by its ID.', function(done) {
    request(app).get('/api/v1/comments/5902609ab70e3fb80b13119d')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmV3dXNlciIsImlhdCI6MTQ5NTA4MTAzOH0.iv67LqiPlb1Y8SyX92bFKB1sStYdkuQPW0qpvPYg11g')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});