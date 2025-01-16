class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread_id, comment_id, user_id } = useCasePayload
    await this._commentRepository.validateThreadExist(thread_id);
    await this._commentRepository.validateCommentExist(comment_id);
    await this._commentRepository.validateCommentOwner(comment_id, user_id);

    return this._commentRepository.deleteComment(comment_id);
  }
}

module.exports = DeleteCommentUseCase;
