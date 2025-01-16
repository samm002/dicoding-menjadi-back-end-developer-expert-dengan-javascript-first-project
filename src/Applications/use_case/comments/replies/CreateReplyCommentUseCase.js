const CreateReplyComment = require("../../../../Domains/comments/entities/replies/CreateReplyComment");

class CreateReplyCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const createReplyComment = new CreateReplyComment (useCasePayload);
    
    await this._commentRepository.validateThreadExist(createReplyComment.thread_id);
    await this._commentRepository.validateCommentExist(createReplyComment.parent_comment_id);

    return this._commentRepository.createReply(createReplyComment);
  }
}

module.exports = CreateReplyCommentUseCase;
