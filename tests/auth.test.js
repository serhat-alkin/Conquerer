const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const middleware = require('../src/middleware/auth');
const usersService = require('../src/services/usersService');

jest.mock('jsonwebtoken');
jest.mock('../src/services/usersService');

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('validateToken middleware', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  
  it('should return 401 if no token provided', async () => {
    await middleware.validateToken(req, res, next);
    expect(res._getStatusCode()).toBe(401);
  });

  it('should return 401 if invalid token', async () => {
    req.headers.authorization = 'fake-token';
    jwt.verify.mockImplementationOnce(() => { throw new Error('invalid token'); });
    await middleware.validateToken(req, res, next);
    expect(res._getStatusCode()).toBe(500);
  });

  it('should return 401 if token is expired', async () => {
    req.headers.authorization = 'expired-token';
    jwt.verify.mockReturnValueOnce({ user: 'testUserId' });
    usersService.getUserById.mockResolvedValueOnce({
      session_token: 'expired-token',
      session_token_expiration: new Date(Date.now() - 3600000) 
    });
    await middleware.validateToken(req, res, next);
    expect(res._getStatusCode()).toBe(401);
  });

  it('should call next() if the token is valid and not expired', async () => {
    req.headers.authorization = 'valid-token';
    jwt.verify.mockReturnValueOnce({ user: 'testUserId' });
    usersService.getUserById.mockResolvedValueOnce({
      session_token: 'valid-token',
      session_token_expiration: new Date(Date.now() + 3600000)
    });
    await middleware.validateToken(req, res, next);
    expect(next).toBeCalled();
  });
});
