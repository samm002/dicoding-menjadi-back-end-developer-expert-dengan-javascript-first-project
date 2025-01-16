const ViewThreadByIdUseCase = require('../ViewThreadByIdUseCase');
const CreateThreadUseCase = require('../CreateThreadUseCase');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('ViewThreadByIdUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should view thread detail correctly', async () => {
    // Arrange
    const useCasePayload = new CreateThread({
      title: 'Thread 1',
      body: 'Isi dari Thread 1',
      user_id: 'user-123',
    });

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      user_id: useCasePayload.user_id,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.createThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));

    mockThreadRepository.viewThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedThread));

    /** creating use case instance */
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const viewThreadByIdUseCase = new ViewThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    const expectedCreatedThread = new DetailThread({
      id: 'thread-123',
      title: 'Thread 1',
      body: 'Isi dari Thread 1',
      updated_at: '2025-01-08 10:30:26.511437',
      username: 'dicoding',
      comments: [],
    });

    const createdThread = await createThreadUseCase.execute(useCasePayload);

    // Action
    const viewThreadById = await viewThreadByIdUseCase.execute('thread-123');

    // Assert
    expectedCreatedThread.date = createdThread.date;

    expect(viewThreadById).toBeDefined();
    expect(viewThreadById).toStrictEqual(expectedCreatedThread);
  });
});
