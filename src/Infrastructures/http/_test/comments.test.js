const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  // Create Comment
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      // Action
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      expect(createCommentResponse.statusCode).toEqual(201);
      expect(createCommentResponseJson.status).toEqual('success');
      expect(createCommentResponseJson.data.addedComment).toBeDefined();
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

      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        invalidProperty: 'Comment for Thread 1',
      };

      // Action
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      expect(createCommentResponse.statusCode).toEqual(400);
      expect(createCommentResponseJson.status).toEqual('fail');
      expect(createCommentResponseJson.message).toBeDefined();
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

      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: true,
      };

      // Action
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      expect(createCommentResponse.statusCode).toEqual(400);
      expect(createCommentResponseJson.status).toEqual('fail');
      expect(createCommentResponseJson.message).toBeDefined();
    });

    it('should response 401 when not including user authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const requestPayload = {
        content: 'Comment 1',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });
  });

  // Delete Comment
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and return success when deleting valid comment', async () => {
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Action
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(
        deleteCommentResponse.payload
      );
      expect(deleteCommentResponse.statusCode).toEqual(200);
      expect(deleteCommentResponseJson.status).toBeDefined();
      expect(deleteCommentResponseJson.status).toEqual('success');
    });

    it('should response 404 and return not found error when deleting invalid comment', async () => {
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Action
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(
        deleteCommentResponse.payload
      );
      expect(deleteCommentResponse.statusCode).toEqual(404);
      expect(deleteCommentResponseJson.status).toBeDefined();
      expect(deleteCommentResponseJson.status).toEqual('fail');
      expect(deleteCommentResponseJson.message).toBeDefined();
      expect(deleteCommentResponseJson.message).toEqual(
        'comment tidak ditemukan'
      );
    });

    it('should response 401 when deleting comment without including user authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comments-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 when deleting other user comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User (Comment Creator)
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Action
      // Create and login with another user
      const login2Payload = {
        username: 'dicoding2',
        password: 'secret2',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret2',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login
      const login2Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: login2Payload,
      });

      const login2ResponseJson = JSON.parse(login2Response.payload);
      const accessToken2 = login2ResponseJson.data.accessToken;

      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(
        deleteCommentResponse.payload
      );
      expect(deleteCommentResponse.statusCode).toEqual(403);
      expect(deleteCommentResponseJson.status).toEqual('fail');
      expect(deleteCommentResponseJson.message).toBeDefined();
    });
  });

  // Create Reply
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Create Reply
      const createReplyPayload = {
        content: 'Reply for Comment 1 in Thread 1',
      };

      // Action
      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: createReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createReplyResponseJson = JSON.parse(createReplyResponse.payload);
      expect(createReplyResponse.statusCode).toEqual(201);
      expect(createReplyResponseJson.status).toEqual('success');
      expect(createReplyResponseJson.data.addedReply).toBeDefined();
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

      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Create Reply
      const createReplyPayload = {
        invalidProperty: 'Reply for Comment 1 in Thread 1',
      };

      // Action
      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: createReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createReplyResponseJson = JSON.parse(createReplyResponse.payload);
      expect(createReplyResponse.statusCode).toEqual(400);
      expect(createReplyResponseJson.status).toEqual('fail');
      expect(createReplyResponseJson.message).toBeDefined();
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

      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Create Reply
      const createReplyPayload = {
        content: true,
      };

      // Action
      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: createReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createReplyResponseJson = JSON.parse(createReplyResponse.payload);
      expect(createReplyResponse.statusCode).toEqual(400);
      expect(createReplyResponseJson.status).toEqual('fail');
      expect(createReplyResponseJson.message).toBeDefined();
    });

    it('should response 401 when not including user authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const requestPayload = {
        content: 'Reply Comment 1',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comments-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });
  });

  // Delete Reply
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and return success when deleting valid reply', async () => {
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Create Reply
      const createReplyPayload = {
        content: 'Reply for Comment 1 in Thread 1',
      };

      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: createReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createReplyResponseJson = JSON.parse(createReplyResponse.payload);
      const replyId = createReplyResponseJson.data.addedReply.id;

      // Action
      const deleteReplyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteReplyResponseJson = JSON.parse(deleteReplyResponse.payload);
      expect(deleteReplyResponse.statusCode).toEqual(200);
      expect(deleteReplyResponseJson.status).toBeDefined();
      expect(deleteReplyResponseJson.status).toEqual('success');
    });

    it('should response 404 and return not found error when deleting invalid reply', async () => {
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Action
      const deleteReplyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteReplyResponseJson = JSON.parse(deleteReplyResponse.payload);
      expect(deleteReplyResponse.statusCode).toEqual(404);
      expect(deleteReplyResponseJson.status).toBeDefined();
      expect(deleteReplyResponseJson.status).toEqual('fail');
      expect(deleteReplyResponseJson.message).toBeDefined();
      expect(deleteReplyResponseJson.message).toEqual(
        'comment tidak ditemukan'
      );
    });

    it('should response 401 when deleting comment without including user authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comments-123/replies/reply-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 when deleting other user comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User (Comment Creator)
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
      const createThreadPayload = {
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
      };

      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
      const threadId = createThreadResponseJson.data.addedThread.id;

      // Create comment
      const createCommentPayload = {
        content: 'Comment for Thread 1',
      };

      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: createCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createCommentResponseJson = JSON.parse(
        createCommentResponse.payload
      );
      const commentId = createCommentResponseJson.data.addedComment.id;

      // Create Reply
      const createReplyPayload = {
        content: 'Reply for Comment 1 in Thread 1',
      };

      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: createReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createReplyResponseJson = JSON.parse(
        createReplyResponse.payload
      );
      const replyId = createReplyResponseJson.data.addedReply.id;

      // Action
      // Create and login with another user
      const login2Payload = {
        username: 'dicoding2',
        password: 'secret2',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret2',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login
      const login2Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: login2Payload,
      });

      const login2ResponseJson = JSON.parse(login2Response.payload);
      const accessToken2 = login2ResponseJson.data.accessToken;

      const deleteReplyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const deleteReplyResponseJson = JSON.parse(
        deleteReplyResponse.payload
      );
      expect(deleteReplyResponse.statusCode).toEqual(403);
      expect(deleteReplyResponseJson.status).toEqual('fail');
      expect(deleteReplyResponseJson.message).toBeDefined();
    });
  });
});
