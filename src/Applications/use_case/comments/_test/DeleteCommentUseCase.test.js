const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      user_id: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.validateThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.validateCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.validateCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.validateThreadExist).toBeCalledWith(
      useCasePayload.thread_id
    );

    expect(mockCommentRepository.validateCommentExist).toBeCalledWith(
      useCasePayload.comment_id
    );

    expect(mockCommentRepository.validateCommentOwner).toBeCalledWith(
      useCasePayload.comment_id,
      useCasePayload.user_id
    );

    await expect(
      mockCommentRepository.deleteComment(useCasePayload)
    ).resolves.not.toThrowError(NotFoundError);

    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.comment_id
    );
  });
});
