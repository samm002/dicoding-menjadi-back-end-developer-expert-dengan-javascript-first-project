class DeleteReplyCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread_id, parent_comment_id, reply_id, user_id } = useCasePayload
    await this._commentRepository.validateThreadExist(thread_id);
    await this._commentRepository.validateCommentExist(parent_comment_id);
    await this._commentRepository.validateCommentExist(reply_id);
    await this._commentRepository.validateCommentOwner(reply_id, user_id);

    return this._commentRepository.deleteComment(reply_id);
  }
}

module.exports = DeleteReplyCommentUseCase;
