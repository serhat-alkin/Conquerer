const postsController = require('../src/controllers/posts');
const postsService = require('../src/services/postsService');
const commentsService = require('../src/services/commentsService');
const httpMocks = require('node-mocks-http'); 
const jwt = require('jsonwebtoken');
require("dotenv").config();

jest.mock('../src/services/postsService');
jest.mock('../src/services/commentsService');

describe('postsController', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });
  
  const userId = "test-id";

  describe('createBlogPost', () => {
    it('should create a blog post and return 200 status', async () => {
      const post = {
        title: "Blog Post Title",
        body: "This is the content of the blog post.",
        category: "Money"
      };
      const token = jwt.sign({ user: userId }, process.env.JWT_SECRET);

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/posts/create',
        body: post,
        headers: {
          'authorization': token,
        },
        userId
      });

      const res = httpMocks.createResponse();

      postsService.createBlogPost.mockResolvedValue(post);

      await postsController.createBlogPost(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(post); 
    });

    it('should return error if category is incorrect,', async () => {
      const post = {
        title: "Blog Post Title",
        body: "This is the content of the blog post.",
        category: "Fintech"
      };

      const token = jwt.sign({ user: userId }, process.env.JWT_SECRET);

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/posts/create',
        body: post,
        headers: {
          'authorization': token,
        },
        userId
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
  
      const existingPost = {
        user_id: userId,
        title: "Existing Blog Post Title",
        body: "This is the content of the existing blog post.",
      }
  
      const token = jwt.sign({ user: userId }, process.env.JWT_SECRET);
  
      const req = httpMocks.createRequest({
        method: 'PATCH',
        url: '/posts/update',
        params: { postId: "existing-id" },
        body: post,
        headers: {
          'authorization': token,
        },
        userId
      });
  
      const res = httpMocks.createResponse();
      postsService.getPostById.mockResolvedValue(existingPost);
  
      postsService.updatePost.mockResolvedValue(true);
  
      await postsController.updateBlogPost(req, res);
  
      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('deleteBlogPost', () => {
    it('should delete a blog post and return 200 status', async () => {
      const existingPost = {
        user_id: userId,
        title: "Existing Blog Post Title",
        body: "This is the content of the existing blog post.",
      }

      const token = jwt.sign({ user: userId }, process.env.JWT_SECRET);
      const req = httpMocks.createRequest({
        method: 'PATCH',
        url: '/posts/delete/existing-id',
        params: { postId: "existing-id" },
        headers: {
          'authorization': token,
        },
        userId
      });

      const res = httpMocks.createResponse();
      postsService.getPostById.mockResolvedValue(existingPost);
      commentsService.softDeleteComments.mockResolvedValue();
      postsService.softDeletePost.mockResolvedValue(true);

      await postsController.deleteBlogPost(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ message: 'Post deleted successfully' });
    });
  });
});
