const ViewThreadByIdUseCase = require('../ViewThreadByIdUseCase');
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
    const mockCreatedThread = new DetailThread([
      {
        id: 'thread-123',
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        updated_at: '2025-01-08 10:30:26.511437',
        username: 'dicoding',
        comments: [],
      },
    ]);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.viewThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));

    /** creating use case instance */
    const viewThreadByIdUseCase = new ViewThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const viewThreadById = await viewThreadByIdUseCase.execute('thread-123');

    // Assert
    expect(viewThreadById).toBeDefined();
    expect(viewThreadById).toStrictEqual(mockCreatedThread);
  });
});
