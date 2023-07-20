const listingsController = require('../src/controllers/listings');
const listingsService = require('../src/services/listingsService');

const httpMocks = require('node-mocks-http'); 
const jwt = require('jsonwebtoken');
require("dotenv").config();

jest.mock('../src/services/listingsService');

describe("Listings Controller", () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  let token;

  beforeEach(() => {
    token = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET);
  });

  describe("myComments", () => {
    it("should get user's comments", async () => {

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/users/user-123/comments',
        params: {
          userId: 'user-123',
        },
        headers: {
          'authorization': token,
        },
        userId: 'user-123',
      });

      const res = httpMocks.createResponse();

      const expectedComments = [{
        id: 'comment-123',
        user_id: 'user-123',
        post_id: 'post-123',
        body: 'This is a comment',
        deleted: false,
      }];

      listingsService.getCommentsByUserId.mockResolvedValue(expectedComments);

      await listingsController.myComments(req, res);
      expect(JSON.parse(res._getData())).toEqual(expectedComments); 
      expect(res._getStatusCode()).toBe(200);
    });

    describe("myPosts", () => {
      it("should get user's posts", async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/users/user-123/posts',
          params: {
            userId: 'user-123',
          },
          headers: {
            'authorization': token,
          },
          userId: 'user-123',
        });
  
        const res = httpMocks.createResponse();
  
        const expectedPosts = [{
          id: 'post-123',
          user_id: 'user-123',
          title: 'My Post',
          body: 'This is my post',
          deleted: false,
        }];
  
        listingsService.getPostsByUserId.mockResolvedValue(expectedPosts);
  
        await listingsController.myPosts(req, res);
        expect(JSON.parse(res._getData())).toEqual(expectedPosts);
        expect(res._getStatusCode()).toBe(200);
      });
    });
  
    describe("lastPosts", () => {
      it("should get the last posts", async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/posts',
          query: {
            page: 1,
            limit: 10,
          },
          headers: {
            'authorization': token,
          },
          userId: 'user-123',
        });
  
        const res = httpMocks.createResponse();
  
        const expectedPosts = [
          {
            title: 'Last Post',
            username: 'John Doe',
            comment_count: 5,
            category: 'Technology',
          },
        ];
  
        listingsService.getLastPosts.mockResolvedValue(expectedPosts);
  
        await listingsController.lastPosts(req, res);
        expect(JSON.parse(res._getData())).toEqual(expectedPosts);
        expect(res._getStatusCode()).toBe(200);
      });
    });
  
    describe("postsByCategory", () => {
      it("should get posts by category", async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/posts/by_category',
          body: {
            category: 'Money',
          },
          headers: {
            'authorization': token,
          },
          userId: 'user-123',
        });
  
        const res = httpMocks.createResponse();
  
        const expectedPosts = [{
          id: 'post-123',
          user_id: 'user-123',
          title: 'Money Post',
          category: 'Money',
          body: 'This is a money post',
          deleted: false,
        }];
  
        listingsService.getPostsByCategory.mockResolvedValue(expectedPosts);
  
        await listingsController.postsByCategory(req, res);
        expect(JSON.parse(res._getData())).toEqual(expectedPosts);
        expect(res._getStatusCode()).toBe(200);
      });
    });
  });
});
