const CreateReplyCommentUseCase = require('../CreateReplyCommentUseCase');
const CommentRepository = require('../../../../../Domains/comments/CommentRepository');
const CreatedComment = require('../../../../../Domains/comments/entities/CreatedComment');
const CreateReplyComment = require('../../../../../Domains/comments/entities/replies/CreateReplyComment');

describe('CreateReplyCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the create comment action correctly', async () => {
    // Arrange
    const useCasePayload = new CreateReplyComment({
      content: 'Reply 1 of Comment 1 in Thread 1',
      thread_id: 'thread-123',
      user_id: 'user-123',
      parent_comment_id: 'comment-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.validateThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.validateCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.createReply = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new CreatedComment({
          id: 'reply-123',
          content: useCasePayload.content,
          user_id: useCasePayload.user_id,
        })
      )
    );

    /** creating use case instance */
    const createReplyCommentUseCase = new CreateReplyCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const createdComment = await createReplyCommentUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(createdComment).toStrictEqual(
      new CreatedComment({
        id: 'reply-123',
        content: useCasePayload.content,
        user_id: useCasePayload.user_id,
      })
    );

    expect(mockCommentRepository.validateThreadExist).toHaveBeenCalledWith(
      useCasePayload.thread_id
    );

    expect(mockCommentRepository.validateCommentExist).toHaveBeenCalledWith(
      useCasePayload.parent_comment_id
    );

    expect(mockCommentRepository.createReply).toBeCalledWith(useCasePayload);
  });
});
