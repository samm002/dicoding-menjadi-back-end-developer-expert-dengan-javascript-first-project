const CreateThreadUseCase = require('../CreateThreadUseCase');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('CreateThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the create thread action correctly', async () => {
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

    /** creating use case instance */
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await createThreadUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        user_id: useCasePayload.user_id,
      })
    );

    expect(mockThreadRepository.createThread).toBeCalledWith(
      new CreateThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        user_id: useCasePayload.user_id,
      })
    );
  });
});
