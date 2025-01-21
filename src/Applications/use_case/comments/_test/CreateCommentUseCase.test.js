const CreateCommentUseCase = require('../CreateCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CreateComment = require('../../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../../Domains/comments/entities/CreatedComment');

describe('CreateCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the create reply comment action correctly', async () => {
    // Arrange
    const useCasePayload = new CreateComment({
      content: 'Comment of Thread 1',
      thread_id: 'thread-123',
      user_id: 'user-123',
    });

    const expectedCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      user_id: useCasePayload.user_id,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.validateThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.createComment = jest.fn().mockResolvedValue({
      id: 'comment-123', 
      content: useCasePayload.content,
      owner: useCasePayload.user_id,
    });

    /** creating use case instance */
    const createCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const createdComment = await createCommentUseCase.execute(useCasePayload);

    // Assert

    const createdCommentFromUseCase = new CreatedComment({
      id: 'comment-123',
      content: createdComment.content,
      user_id: createdComment.owner,
    })

    expect(createdCommentFromUseCase).toStrictEqual(expectedCreatedComment);

    expect(mockCommentRepository.validateThreadExist).toHaveBeenCalledWith(
      useCasePayload.thread_id
    );

    expect(mockCommentRepository.createComment).toBeCalledWith(useCasePayload);
  });
});
