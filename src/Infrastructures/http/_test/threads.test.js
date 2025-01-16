const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const accessToken = loginResponseJson.data.accessToken;

      // Create thread
      const requestPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const accessToken = loginResponseJson.data.accessToken;

      const requestPayload = {
        title: 'Thread 1',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const accessToken = loginResponseJson.data.accessToken;

      const requestPayload = {
        title: 'Thread 1',
        body: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when not including user authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const requestPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 200 when viewing valid thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const accessToken = loginResponseJson.data.accessToken;

      // Create thread
      const requestPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Action
      const viewThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        payload: requestPayload,
      });

      // Assert
      const viewThreadResponseJson = JSON.parse(viewThreadResponse.payload);
      expect(viewThreadResponse.statusCode).toEqual(200);
      expect(viewThreadResponseJson.status).toEqual('success');
      expect(viewThreadResponseJson.data.thread).toBeDefined();
    });

    it('should response 404 when viewing invalid thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const viewThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/thread-123`,
      });

      // Assert
      const viewThreadResponseJson = JSON.parse(viewThreadResponse.payload);
      expect(viewThreadResponse.statusCode).toEqual(404);
      expect(viewThreadResponseJson.status).toBeDefined();
      expect(viewThreadResponseJson.status).toEqual('fail');
      expect(viewThreadResponseJson.message).toBeDefined();
      expect(viewThreadResponseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
