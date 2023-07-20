const usersController = require('../src/controllers/users');
const usersService = require('../src/services/usersService');
const httpMocks = require('node-mocks-http');
const { hashPassword } = require("../src/utils/crypto");
const jwt = require('jsonwebtoken');
require("dotenv").config();
jest.mock('../src/services/usersService');

describe('UserController', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('should register a user and return 201 status', async () => {
      const newUser = {
        email: 'test@gmail.com',
        full_name: 'Test User',
        password: 'TestPassword123@',
        confirm_password: 'TestPassword123@',
      };
    
      const hashedPassword = await hashPassword(newUser.password);
      
      const user = {
        ...newUser,
        password: hashedPassword,
      };
    
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/register',
        body: newUser,
      });
    
      const res = httpMocks.createResponse();
      
      usersService.createUser.mockResolvedValue(user);
    
      await usersController.register(req, res);
    
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).toBe(201);
      expect(data).toEqual(user);
    });
    

    it('should return 400 status for invalid input', async () => {
      const newUser = {
        email: "test",
        full_name: "Test User",
        password: "TestPassword123@",
        confirm_password: "Test"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/register',
        body: newUser
      });

      const res = httpMocks.createResponse();

      await usersController.register(req, res);

      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const loginUser = {
        email: 'test@gmail.com',
        password: 'TestPassword123@',
      };
    
      const user = {
        email: 'test@gmail.com',
        password: await hashPassword(loginUser.password),
        id: 'test-id',
      };
    
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/login',
        body: loginUser,
      });
    
      const res = httpMocks.createResponse();
    
      usersService.getUser.mockResolvedValue(user);
      usersService.isValidPassword.mockResolvedValue(true);
    
      await usersController.login(req, res);
    
      const data = JSON.parse(res._getData());
    
      expect(res._getStatusCode()).toBe(200);
      expect(data.message).toBe("Login successful!");
      expect(data).toHaveProperty("token");
    });
    

    it('should return 401 for non-existing user', async () => {
      const user = {
        email: "test@gmail.com",
        password: "TestPassword123@"
      };
      
      usersService.getUser.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/users/login',
        body: user
      });

      const res = httpMocks.createResponse();

      await usersController.login(req, res);

      expect(res._getStatusCode()).toBe(401);
    });

    it('should return 400 for invalid password', async () => {
      const user = {
        email: "test@gmail.com",
        password: "TestPassword123@"
      };

      const hashedPassword = await hashPassword(user.password);
      
      usersService.getUser.mockResolvedValue({ ...user, password: hashedPassword });
      usersService.isValidPassword.mockResolvedValue(false);

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/users/login',
        body: user
      });

      const res = httpMocks.createResponse();

      await usersController.login(req, res);

      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe('changePassword', () => {
    it('should change password and return 200 status', async () => {
      const user_id = "test-id";
      const changePasswordReq = {
        current_password: "OldPassword123@",
        new_password: "NewPassword123@"
      };
  
      const user = {
        id: user_id,
        password: await hashPassword("OldPassword123@")
      };
  
      const token = jwt.sign({ user: user_id }, process.env.JWT_SECRET);
  
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `/users/${user_id}/changePassword`,
        params: { userId: user_id },
        body: changePasswordReq,
        headers: {
          'authorization': token,
        },
        userId: user_id
      });
  
      const res = httpMocks.createResponse();
  
      usersService.getUserById.mockResolvedValue(user);
      usersService.isValidPassword.mockResolvedValue(true);
      usersService.changePassword.mockResolvedValue();
      usersService.invalidateOldSessions.mockResolvedValue();
  
      await usersController.changePassword(req, res);
  
      const data = JSON.parse(res._getData());
      expect(res._getStatusCode()).toBe(200);
      expect(data).toEqual({
        message: "Password changed successfully. Please log in again.",
      }); 
    });
 

    it('should return 403 for unauthorized user', async () => {
      const user_id = "test-id";
      const user_id2 = "test-id2";
      const changePasswordReq = {
        current_password: "OldPassword123@",
        new_password: "NewPassword123@"
      };
  
      const user = {
        id: user_id,
        password: await hashPassword("OldPassword123@")
      };
  
      const token = jwt.sign({ user: user_id }, process.env.JWT_SECRET);
  
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `/users/${user_id}/changePassword`,
        params: { userId: user_id },
        body: changePasswordReq,
        headers: {
          'authorization': token,
        },
        userId: user_id2
      });

      const res = httpMocks.createResponse();

      await usersController.changePassword(req, res);

      expect(res._getStatusCode()).toBe(403);
    });

    it('should return 400 for worng password', async () => {
      const user_id = "test-id";
      const changePasswordReq = {
        current_password: "OldPassword",
        new_password: "NewPassword123@"
      };
  
      const user = {
        id: user_id,
        password: await hashPassword("OldPassword")
      };
  
      const token = jwt.sign({ user: user_id }, process.env.JWT_SECRET);
  
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `/users/${user_id}/changePassword`,
        params: { userId: user_id },
        body: changePasswordReq,
        headers: {
          'authorization': token,
        },
        userId: user_id
      });
  
      const res = httpMocks.createResponse();
  
      usersService.getUserById.mockResolvedValue(user);
      usersService.isValidPassword.mockResolvedValue(true);
      usersService.changePassword.mockResolvedValue();
      usersService.invalidateOldSessions.mockResolvedValue();
  
      await usersController.changePassword(req, res);
  
      expect(res._getStatusCode()).toBe(400);
    });

  });
});
