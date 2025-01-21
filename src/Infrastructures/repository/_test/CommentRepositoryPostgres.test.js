const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreateReplyComment = require('../../../Domains/comments/entities/replies/CreateReplyComment');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      // Prepare creating comment
      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      // Action
      await commentRepositoryPostgres.createComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      // Prepare creating comment
      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      // Action
      const createdComment = await commentRepositoryPostgres.createComment(
        createComment
      );

      // Assert
      const expectedCreatedComment = new CreatedComment({
        id: 'comment-123',
        content: 'Comment of Thread 1',
        user_id: 'user-123',
      });

      expect(createdComment).toStrictEqual(expectedCreatedComment);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      // Prepare creating comment
      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      await commentRepositoryPostgres.createComment(createComment);

      // Action & Assert
      expect(async () => {
        await commentRepositoryPostgres.deleteComment('comment-123');
      }).not.toThrowError(NotFoundError);

      const comment = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );

      expect(comment[0].is_deleted).toBe(true);
    });
    it('should return not found when delete invalid comment', async () => {
      // Arrange
      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment('comment-456')
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('createReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      // Create comment
      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      await commentRepositoryPostgres.createComment(createComment);

      // Prepare creating reply
      const createReply = new CreateReplyComment({
        content: 'Reply of Thread 1 Comment',
        thread_id: 'thread-123',
        user_id: 'user-123',
        parent_comment_id: 'comment-123',
      });

      const replyFakeIdGenerator = jest.fn(() => 'reply-123'); // mock
      const replyRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: replyFakeIdGenerator,
      });

      // Action
      await replyRepositoryPostgres.createReply(createReply);

      // Assert
      const reply = await CommentsTableTestHelper.findCommentsById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      // Prepare creating comment
      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      await commentRepositoryPostgres.createComment(createComment);

      // Prepare creating reply
      const createReply = new CreateReplyComment({
        content: 'Reply of Thread 1 Comment',
        thread_id: 'thread-123',
        user_id: 'user-123',
        parent_comment_id: 'comment-123',
      });

      const replyFakeIdGenerator = jest.fn(() => 'reply-123'); // mock
      const replyRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: replyFakeIdGenerator,
      });

      // Action
      const createdReply = await replyRepositoryPostgres.createReply(
        createReply
      );

      // Assert
      const expectedCreatedReply = new CreatedComment({
        id: 'reply-123',
        content: 'Reply of Thread 1 Comment',
        user_id: 'user-123',
      });

      expect(createdReply).toStrictEqual(expectedCreatedReply);
    });
  });

  describe('validateThreadExist function', () => {
    it('should validate thread exist correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      // Action & Assert
      // Valid thread
      await expect(
        commentRepositoryPostgres.validateThreadExist('thread-123')
      ).resolves.not.toThrowError(NotFoundError);

      const validThreadSearch = await ThreadsTableTestHelper.findThreadsById(
        'thread-123'
      );
      expect(validThreadSearch).toHaveLength(1);

      // Invalid thread
      await expect(
        commentRepositoryPostgres.validateThreadExist('thread-456')
      ).rejects.toThrowError(NotFoundError);

      const invalidThreadSearch = await ThreadsTableTestHelper.findThreadsById(
        'thread-456'
      );
      expect(invalidThreadSearch).toHaveLength(0);
    });
  });

  describe('validateCommentExist function', () => {
    it('should validate comment exist correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      await commentRepositoryPostgres.createComment(createComment);

      // Action & Assert
      // Valid comment
      await expect(
        commentRepositoryPostgres.validateCommentExist('comment-123')
      ).resolves.not.toThrowError(NotFoundError);

      const validCommentSearch = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(validCommentSearch).toHaveLength(1);

      // Invalid comment
      await expect(
        commentRepositoryPostgres.validateCommentExist('comment-456')
      ).rejects.toThrowError(NotFoundError);

      const invalidCommentSearch =
        await CommentsTableTestHelper.findCommentsById('comment-456');
      expect(invalidCommentSearch).toHaveLength(0);
    });
  });

  describe('validateCommentOwner function', () => {
    it('should validate comment owner correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const userFakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: userFakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // create thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      await threadRepositoryPostgres.createThread(createThread);

      const commentFakeIdGenerator = jest.fn(() => 'comment-123'); // mock
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {
        generateId: commentFakeIdGenerator,
      });

      const createComment = new CreateComment({
        content: 'Comment of Thread 1',
        thread_id: 'thread-123',
        user_id: 'user-123',
      });

      await commentRepositoryPostgres.createComment(createComment);

      // Action & Assert
      // Valid comment owner
      await expect(
        commentRepositoryPostgres.validateCommentOwner(
          'comment-123',
          'user-123'
        )
      ).resolves.not.toThrowError(AuthorizationError);

      // Invalid comment owner
      await expect(
        commentRepositoryPostgres.validateCommentOwner(
          'comment-123',
          'user-456'
        )
      ).rejects.toThrowError(AuthorizationError);
    });
  });
});
