const postsController = require('../src/controllers/posts');
const postsService = require('../src/services/postsService');
const commentsService = require('../src/services/commentsService');
const httpMocks = require('node-mocks-http'); 

jest.mock('../src/services/postsService');
jest.mock('../src/services/commentsService');

describe('postsController', () => {
  describe('createBlogPost', () => {
    it('should create a blog post and return 200 status', async () => {
      const post = {
        user_id: "12345",
        title: "Blog Post Title",
        body: "This is the content of the blog post.",
        category: "Money"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/post/create',
        body: post
      });

      const res = httpMocks.createResponse();

      postsService.createBlogPost.mockResolvedValue(post);

      await postsController.createBlogPost(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(post); 
    });

    it('should return error if category is incorrect,', async () => {
      const post = {
        user_id: "12345",
        title: "Blog Post Title",
        body: "This is the content of the blog post.",
        category: "Fintech"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/post/create',
        body: post
      });

      const res = httpMocks.createResponse();

      postsService.createBlogPost.mockResolvedValue(post);

      await postsController.createBlogPost(req, res);

      expect(res._getStatusCode()).toBe(400);
      
    });


  });

  describe('updateBlogPost', () => {
    it('should update a blog post and return 200 status', async () => {
      const post = {
        title: "Updated Blog Post Title",
        body: "This is the updated content of the blog post.",
      };

      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/post/update',
        params: { postId: "existing-id" },
        body: post
      });

      const res = httpMocks.createResponse();

      postsService.updatePost.mockResolvedValue(true);

      await postsController.updateBlogPost(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ message: 'Post updated successfully' });
    });

  
  });

  describe('deleteBlogPost', () => {
    it('should delete a blog post and return 200 status', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/blog/delete',
        params: { postId: "existing-id" }
      });

      const res = httpMocks.createResponse();

      commentsService.softDeleteComments.mockResolvedValue();
      postsService.softDeletePost.mockResolvedValue(true);

      await postsController.deleteBlogPost(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ message: 'Post deleted successfully' });
    });

   
  });
});
