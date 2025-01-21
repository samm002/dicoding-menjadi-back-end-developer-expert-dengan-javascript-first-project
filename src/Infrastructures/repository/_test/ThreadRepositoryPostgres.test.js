const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
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

      // Prepare creating thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      // Action
      await threadRepositoryPostgres.createThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-123'
      );

      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: fakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // Prepare creating thread
      const createThread = new CreateThread({
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
        generateId: threadFakeIdGenerator,
      });

      // Action
      const createdThread = await threadRepositoryPostgres.createThread(
        createThread
      );

      // Assert
      const expectedCreatedThread = new CreatedThread({
        id: 'thread-123',
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        user_id: 'user-123',
      });

      expect(createdThread).toStrictEqual(expectedCreatedThread);
    });
  });

  describe('viewThreadById function', () => {
    it('should return thread details correctly', async () => {
      // Arrange

      // Create user
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = jest.fn(() => 'user-123'); // mock
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {
        generateId: fakeIdGenerator,
      });

      await userRepositoryPostgres.addUser(registerUser);

      // Prepare creating thread
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

      const expectedCreatedThread = new DetailThread([
        {
          id: 'thread-123',
          title: 'Thread 1',
          body: 'Isi dari Thread 1',
          updated_at: '2025-01-08 10:30:26.511437',
          username: 'dicoding',
        },
      ]);

      // Action
      const threadDetail = await threadRepositoryPostgres.viewThreadById(
        'thread-123'
      );

      // Assert
      expectedCreatedThread.date = threadDetail.date;

      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-123'
      );

      expect(threads).toHaveLength(1);
      expect(threadDetail).toBeDefined();
      expect(threadDetail).toStrictEqual(expectedCreatedThread);
    });
  });

  it('should return not found when viewing invalid thread', async () => {
    // Arrange
    const threadFakeIdGenerator = jest.fn(() => 'thread-123'); // mock
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {
      generateId: threadFakeIdGenerator,
    });

    // Action & Assert
    await expect(
      threadRepositoryPostgres.viewThreadById('thread-456')
    ).rejects.toThrowError(NotFoundError);

    const threads = await ThreadsTableTestHelper.findThreadsById('thread-456');

    expect(threads).toHaveLength(0);
  });
});
