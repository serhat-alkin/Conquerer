const commentsController = require('../src/controllers/comments');
const commentsService = require('../src/services/commentsService');
const httpMocks = require('node-mocks-http');

jest.mock('../src/services/commentsService');

describe('commentsController', () => {
  describe('createComment', () => {
    it('should create a comment and return 200 status', async () => {
      const comment = {
        post_id: 'post-1',
        user_id: 'user-1',
        body: "This is a comment.",
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/comments/create',
        body: comment
      });

      const res = httpMocks.createResponse();

      commentsService.createComment.mockResolvedValue(comment);

      await commentsController.createComment(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(comment);
    });

    it('should return 400 status when invalid post id data is provided', async () => {
      const comment = {
        post_id: '',
        user_id: 'user-1',
        body: "This is a comment.",
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/comments/create',
        body: comment
      });

      const res = httpMocks.createResponse();

      await commentsController.createComment(req, res);
    
      expect(res._getStatusCode()).toBe(400);
     
    });
    
  });
});
