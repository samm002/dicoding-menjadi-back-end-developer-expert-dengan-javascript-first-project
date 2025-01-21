const ViewThreadByIdUseCase = require('../ViewThreadByIdUseCase');
const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('ViewThreadByIdUseCase', () => {
  it('should view thread detail correctly', async () => {
    // Arrange
    // Raw data that would come from the repository
    const mockThreadData = [
      {
        id: 'thread-123',
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        updated_at: '2025-01-08 10:30:26.511437',
        username: 'dicoding',
        comment_id: null,
        comment_username: null,
        comment_date: null,
        content: null,
        is_deleted: null,
        parent_comment_id: null,
      },
    ];

    // Expected DetailThread instance that should be returned by use case
    const expectedDetailThread = new DetailThread([
      {
        id: 'thread-123',
        title: 'Thread 1',
        body: 'Isi dari Thread 1',
        updated_at: '2025-01-08 10:30:26.511437',
        username: 'dicoding',
        comment_id: null,
        comment_username: null,
        comment_date: null,
        content: null,
        is_deleted: null,
        parent_comment_id: null,
      },
    ]);

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.viewThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));

    const viewThreadByIdUseCase = new ViewThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const viewThreadById = await viewThreadByIdUseCase.execute('thread-123');

    // Assert
    expect(viewThreadById).toBeDefined();
    expect(new DetailThread(viewThreadById)).toStrictEqual(
      expectedDetailThread
    );

    expect(mockThreadRepository.viewThreadById).toBeCalledWith('thread-123');
    expect(mockThreadRepository.viewThreadById).toBeCalledTimes(1);
  });
});
