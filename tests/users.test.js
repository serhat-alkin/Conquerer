const usersController = require('../src/controllers/users');
const usersService = require('../src/services/usersService');
const { generateJWT, hashPassword } = require("../src/utils/crypto");
const httpMocks = require('node-mocks-http'); 

jest.mock('../src/services/usersService'); 

describe('usersController', () => {
  describe('register', () => {
    it('should create a user and return 201 status', async () => {
      const user = {
        full_name: "Anastasia Ferguson",
        email: "anastasia@ferguson.moda",
        password: "Password123@",
        confirm_password:"Password123@"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/register',
        body: user
      });

      const res = httpMocks.createResponse();

      const hashedPassword = await hashPassword(user.password);
      usersService.createUser.mockResolvedValue({
        ...user,
        id: "generated-id",
        password: hashedPassword,
        username: user.full_name.split(' ').join('_').toLowerCase()
      });

      await usersController.register(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        ...user,
        id: "generated-id",
        password: hashedPassword,
        username: user.full_name.split(' ').join('_').toLowerCase()
      }); 
    });

    it('should return 400 status if password is not confirmed', async () => {
      const user = {
        full_name: "Anastasia Ferguson",
        email: "anastasia@ferguson.moda",
        password: "Password123@",
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/register',
        body: user
      });

      const res = httpMocks.createResponse();
      await usersController.register(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    it('should return 400 status if passwords do not match', async () => {
      const user = {
        full_name: "Anastasia Ferguson",
        email: "anastasia@ferguson.moda",
        password: "Password123@",
        confirm_password:"Password123"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/register',
        body: user
      });

      const res = httpMocks.createResponse();
      await usersController.register(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    it('should return 400 status if passwords is not strong', async () => {
      const user = {
        full_name: "Anastasia Ferguson",
        email: "anastasia@ferguson.moda",
        password: "password123",
        confirm_password:"password123"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/register',
        body: user
      });

      const res = httpMocks.createResponse();
      await usersController.register(req, res);
      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe('login', () => {
    it('should log in a user and return 200 status', async () => {
      const user = {
        email: "anastasia@ferguson.moda",
        password: "Password123@"
      };

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/users/login',
        body: user
      });

      const res = httpMocks.createResponse();

      usersService.getUser.mockResolvedValue({
        ...user,
        id: "user-id"
      });
      
      usersService.isValidPassword.mockResolvedValue(true);
      usersService.updateSessionToken.mockResolvedValue();

      const token = await generateJWT("user-id");
      usersService.invalidateOldSessions.mockResolvedValue();
      await usersController.login(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Login successful!",
        token,
      }); 
    });

    it('should return 400 status if password is incorrect', async () => {
      const user = {
        email: "anastasia@ferguson.moda",
        password: "IncorrectPassword123@"
      };

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/users/login',
        body: user
      });

      const res = httpMocks.createResponse();

      usersService.getUser.mockResolvedValue({
        ...user,
        id: "user-id"
      });

      usersService.isValidPassword.mockResolvedValue(false);
      await usersController.login(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    it('should return 401 status if user not found', async () => {
      const user = {
        email: "no.user@gmail.com",
        password: "Password123@"
      };

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/users/login',
        body: user
      });

      const res = httpMocks.createResponse();

      usersService.getUser.mockResolvedValue(null);
      await usersController.login(req, res);

      expect(res._getStatusCode()).toBe(401);
    });
  });


  describe('changePassword', () => {
    it('should change password and return 200 status', async () => {
      const changePasswordReq = {
        user_id: "user-id",
        old_password: "OldPassword123@",
        new_password: "NewPassword123@"
      };

      const user = {
        id: "user-id",
        password: await hashPassword("OldPassword123@")
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/changePassword',
        body: changePasswordReq
      });

      const res = httpMocks.createResponse();

      usersService.getUserById.mockResolvedValue(user);
      usersService.isValidPassword.mockResolvedValue(true);
      usersService.changePassword.mockResolvedValue();
      usersService.invalidateOldSessions.mockResolvedValue();

      await usersController.changePassword(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Password changed successfully. Please log in again.",
      }); 
    });

    it('should return 400 status if old password is incorrect', async () => {
      const changePasswordReq = {
        user_id: "user-id",
        old_password: "IncorrectOldPassword123@",
        new_password: "NewPassword123@"
      };

      const user = {
        id: "user-id",
        password: await hashPassword("OldPassword123@")
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/changePassword',
        body: changePasswordReq
      });

      const res = httpMocks.createResponse();
      usersService.getUserById.mockResolvedValue(user);
      usersService.isValidPassword.mockResolvedValue(false);
      await usersController.changePassword(req, res);
      
      expect(res._getStatusCode()).toBe(400);
    });

    it('should return 404 status if user not found', async () => {
      const changePasswordReq = {
        user_id: "nonexistent-user-id",
        old_password: "OldPassword123@",
        new_password: "NewPassword123@"
      };

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users/changePassword',
        body: changePasswordReq
      });

      const res = httpMocks.createResponse();
      usersService.getUserById.mockResolvedValue(null);
      await usersController.changePassword(req, res);
      
      expect(res._getStatusCode()).toBe(404);
    });
  });
});
